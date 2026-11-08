import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    deleteDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { LabDevelopment } from '../types';
import { labDevelopments as baseDevelopments } from '../data/developments';

const STORAGE_DEV_CACHE_KEY = 'antic_labs_custom_developments_cache';
const STORAGE_DELETED_DEV_KEY = 'antic_labs_deleted_dev_ids';

const listeners = new Set<(devs: LabDevelopment[]) => void>();
let currentMergedDevelopments: LabDevelopment[] = [];

function getDeletedDevIds(): Set<string> {
    try {
        const raw = localStorage.getItem(STORAGE_DELETED_DEV_KEY);
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) return new Set(arr);
        }
    } catch {}
    return new Set<string>();
}

function addDeletedDevId(id: string) {
    try {
        const set = getDeletedDevIds();
        set.add(id);
        localStorage.setItem(STORAGE_DELETED_DEV_KEY, JSON.stringify(Array.from(set)));
    } catch {}
}

function removeDeletedDevId(id: string) {
    try {
        const set = getDeletedDevIds();
        if (set.has(id)) {
            set.delete(id);
            localStorage.setItem(STORAGE_DELETED_DEV_KEY, JSON.stringify(Array.from(set)));
        }
    } catch {}
}

function getCachedCustomDevelopments(): LabDevelopment[] {
    try {
        const raw = localStorage.getItem(STORAGE_DEV_CACHE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch {}
    return [];
}

function setCachedCustomDevelopments(customList: LabDevelopment[]) {
    try {
        localStorage.setItem(STORAGE_DEV_CACHE_KEY, JSON.stringify(customList));
    } catch {}
}

function mergeDevelopments(customDevs: LabDevelopment[]): LabDevelopment[] {
    const deletedIds = getDeletedDevIds();
    const activeCustom = customDevs.filter((d) => !deletedIds.has(d.id));
    const overriddenIds = new Set(activeCustom.map((d) => d.id));
    const remainingBase = baseDevelopments.filter(
        (d) => !overriddenIds.has(d.id) && !deletedIds.has(d.id)
    );
    return [...activeCustom, ...remainingBase];
}

function notifyDevListeners(devs: LabDevelopment[]) {
    currentMergedDevelopments = devs;
    listeners.forEach((listener) => {
        try {
            listener(devs);
        } catch (e) {
            console.error('Dev listener error:', e);
        }
    });
}

// Initial cache load (0ms)
currentMergedDevelopments = mergeDevelopments(getCachedCustomDevelopments());

export function getInitialDevelopments(): LabDevelopment[] {
    return currentMergedDevelopments;
}

export function subscribeDevelopments(callback: (devs: LabDevelopment[]) => void): () => void {
    listeners.add(callback);

    // Call immediately with cache
    callback(currentMergedDevelopments);

    const devCollection = collection(db, 'developments');

    const unsubscribe = onSnapshot(
        devCollection,
        (snapshot) => {
            const firestoreDevs: LabDevelopment[] = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                firestoreDevs.push({
                    id: docSnap.id,
                    date: data.date || '',
                    title: data.title || '',
                    category: data.category || 'Antic Valley',
                    type: (data.type as any) || 'Milestone',
                    badge: data.badge || 'GELİŞME',
                    summary: data.summary || '',
                    highlights: Array.isArray(data.highlights) ? data.highlights : [],
                    createdAt: data.createdAt || undefined,
                });
            });

            // Merge Firestore developments with locally cached developments so pending items are not lost
            const deletedIds = getDeletedDevIds();
            const localCache = getCachedCustomDevelopments();
            const mergedMap = new Map<string, LabDevelopment>();

            for (const item of firestoreDevs) {
                if (!deletedIds.has(item.id)) {
                    mergedMap.set(item.id, item);
                }
            }

            for (const item of localCache) {
                if (!deletedIds.has(item.id) && !mergedMap.has(item.id)) {
                    mergedMap.set(item.id, item);
                }
            }

            const mergedList = Array.from(mergedMap.values());
            setCachedCustomDevelopments(mergedList);
            notifyDevListeners(mergeDevelopments(mergedList));
        },
        (error) => {
            handleFirestoreError(error, OperationType.GET, 'developments');
            callback(currentMergedDevelopments.length > 0 ? currentMergedDevelopments : baseDevelopments);
        }
    );

    return () => {
        listeners.delete(callback);
        unsubscribe();
    };
}

export async function saveDevelopment(dev: LabDevelopment): Promise<void> {
    removeDeletedDevId(dev.id);

    const fullDev: LabDevelopment = {
        ...dev,
        createdAt: dev.createdAt || new Date().toISOString(),
    };

    // 1. Instant Synchronous Optimistic Update (0ms)
    const currentCustom = getCachedCustomDevelopments();
    const existingIndex = currentCustom.findIndex((d) => d.id === fullDev.id);
    let updatedCustom: LabDevelopment[];
    if (existingIndex >= 0) {
        updatedCustom = [...currentCustom];
        updatedCustom[existingIndex] = fullDev;
    } else {
        updatedCustom = [fullDev, ...currentCustom];
    }
    setCachedCustomDevelopments(updatedCustom);
    notifyDevListeners(mergeDevelopments(updatedCustom));

    // 2. Parallel Firestore Persistence
    const cleanId = fullDev.id.trim();
    const path = `developments/${cleanId}`;
    try {
        const docRef = doc(db, 'developments', cleanId);
        const cleanPayload: Record<string, any> = {
            id: cleanId,
            date: fullDev.date.trim(),
            title: fullDev.title.trim(),
            category: fullDev.category.trim(),
            type: fullDev.type,
            badge: fullDev.badge.trim(),
            summary: fullDev.summary.trim(),
            highlights: (fullDev.highlights || []).filter((h) => h.trim().length > 0),
            createdAt: fullDev.createdAt,
        };

        await setDoc(docRef, cleanPayload);
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
    }
}

export async function deleteDevelopment(devId: string): Promise<void> {
    // 1. Instant Optimistic Update
    addDeletedDevId(devId);
    const currentCustom = getCachedCustomDevelopments();
    const filtered = currentCustom.filter((d) => d.id !== devId);
    setCachedCustomDevelopments(filtered);
    notifyDevListeners(mergeDevelopments(filtered));

    // 2. Parallel Firestore Deletion
    const path = `developments/${devId}`;
    try {
        const docRef = doc(db, 'developments', devId);
        await deleteDoc(docRef);
    } catch (error) {
        console.warn('Firestore delete note:', error);
    }
}
