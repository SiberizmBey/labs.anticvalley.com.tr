import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    deleteDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { projectGalas as baseGalas } from '../data/galas';

const STORAGE_GALA_CACHE_KEY = 'antic_labs_galas_cache';

const listeners = new Set<(galas: ProjectGalaItem[]) => void>();
let currentGalas: ProjectGalaItem[] = [];

function getCachedGalas(): ProjectGalaItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_GALA_CACHE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch {}
    return [];
}

function setCachedGalas(list: ProjectGalaItem[]) {
    try {
        localStorage.setItem(STORAGE_GALA_CACHE_KEY, JSON.stringify(list));
    } catch {}
}

function notifyGalaListeners(list: ProjectGalaItem[]) {
    currentGalas = list;
    listeners.forEach((listener) => {
        try {
            listener(list);
        } catch (e) {
            console.error('Gala listener error:', e);
        }
    });
}

// Initial cache
currentGalas = getCachedGalas();

export interface ProjectGalaItem {
    id: string;
    projectId: string;
    projectTitle: string;
    startsAt: string;
    endsAt?: string;
    youtubeLiveUrl?: string;
    description?: string;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
    authorId?: string;
    createdAt?: string;
}

export function subscribeGalas(callback: (galas: ProjectGalaItem[]) => void): () => void {
    listeners.add(callback);

    // Call immediately with cache
    if (currentGalas.length > 0) {
        callback(currentGalas);
    } else if (baseGalas.length > 0) {
        const fallbackItems: ProjectGalaItem[] = baseGalas.map((g, idx) => ({
            id: `base-${idx}-${g.projectId}`,
            projectId: g.projectId,
            projectTitle: g.projectId,
            startsAt: g.startsAt,
            endsAt: g.endsAt,
            youtubeLiveUrl: g.youtubeLiveUrl,
            status: 'scheduled',
            createdAt: new Date().toISOString(),
        }));
        callback(fallbackItems);
    }

    const galasCollection = collection(db, 'galas');

    const unsubscribe = onSnapshot(
        galasCollection,
        (snapshot) => {
            const list: ProjectGalaItem[] = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                list.push({
                    id: docSnap.id,
                    projectId: data.projectId || '',
                    projectTitle: data.projectTitle || data.projectId || 'Deneysel Proje',
                    startsAt: data.startsAt || '',
                    endsAt: data.endsAt || undefined,
                    youtubeLiveUrl: data.youtubeLiveUrl || undefined,
                    description: data.description || '',
                    status: data.status || 'scheduled',
                    createdAt: data.createdAt || undefined,
                });
            });

            list.sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
            setCachedGalas(list);
            notifyGalaListeners(list);
        },
        (error) => {
            handleFirestoreError(error, OperationType.GET, 'galas');
            callback(currentGalas);
        }
    );

    return () => {
        listeners.delete(callback);
        unsubscribe();
    };
}

export async function saveGala(gala: ProjectGalaItem): Promise<void> {
    // 1. Instant Optimistic Update
    const current = getCachedGalas();
    const existingIndex = current.findIndex((g) => g.id === gala.id);
    let updated: ProjectGalaItem[];
    if (existingIndex >= 0) {
        updated = [...current];
        updated[existingIndex] = gala;
    } else {
        updated = [...current, gala];
    }
    updated.sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
    setCachedGalas(updated);
    notifyGalaListeners(updated);

    // 2. Parallel Firestore Persistence
    const path = `galas/${gala.id}`;
    try {
        const docRef = doc(db, 'galas', gala.id);
        const cleanPayload: Record<string, any> = {
            id: gala.id,
            projectId: gala.projectId.trim(),
            projectTitle: gala.projectTitle.trim(),
            startsAt: gala.startsAt.trim(),
            status: gala.status,
            createdAt: gala.createdAt || new Date().toISOString(),
        };

        if (gala.endsAt) cleanPayload.endsAt = gala.endsAt.trim();
        if (gala.youtubeLiveUrl) cleanPayload.youtubeLiveUrl = gala.youtubeLiveUrl.trim();
        if (gala.description) cleanPayload.description = gala.description.trim();

        await setDoc(docRef, cleanPayload);
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
    }
}

export async function deleteGala(galaId: string): Promise<void> {
    // 1. Instant Optimistic Update
    const current = getCachedGalas();
    const filtered = current.filter((g) => g.id !== galaId);
    setCachedGalas(filtered);
    notifyGalaListeners(filtered);

    // 2. Parallel Firestore Deletion
    const path = `galas/${galaId}`;
    try {
        const docRef = doc(db, 'galas', galaId);
        await deleteDoc(docRef);
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
    }
}
