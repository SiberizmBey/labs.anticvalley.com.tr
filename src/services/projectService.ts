import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    deleteDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Project, projects as baseProjects } from '../data/projects';

const STORAGE_CACHE_KEY = 'antic_labs_custom_projects_cache';
const STORAGE_DELETED_KEY = 'antic_labs_deleted_project_ids';

const listeners = new Set<(projects: Project[]) => void>();
let currentMergedProjects: Project[] = [];

function getDeletedProjectIds(): Set<string> {
    try {
        const raw = localStorage.getItem(STORAGE_DELETED_KEY);
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) return new Set(arr);
        }
    } catch {}
    return new Set<string>();
}

function addDeletedProjectId(id: string) {
    try {
        const set = getDeletedProjectIds();
        set.add(id);
        localStorage.setItem(STORAGE_DELETED_KEY, JSON.stringify(Array.from(set)));
    } catch {}
}

function removeDeletedProjectId(id: string) {
    try {
        const set = getDeletedProjectIds();
        if (set.has(id)) {
            set.delete(id);
            localStorage.setItem(STORAGE_DELETED_KEY, JSON.stringify(Array.from(set)));
        }
    } catch {}
}

function getCachedCustomProjects(): Project[] {
    try {
        const raw = localStorage.getItem(STORAGE_CACHE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch {}
    return [];
}

function setCachedCustomProjects(customList: Project[]) {
    try {
        localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(customList));
    } catch {}
}

function mergeProjects(customProjects: Project[]): Project[] {
    const deletedIds = getDeletedProjectIds();
    const activeCustom = customProjects.filter((p) => !deletedIds.has(p.id));
    const overriddenIds = new Set(activeCustom.map((p) => p.id));
    const remainingBase = baseProjects.filter(
        (p) => !overriddenIds.has(p.id) && !deletedIds.has(p.id)
    );
    return [...activeCustom, ...remainingBase];
}

function notifyListeners(projects: Project[]) {
    currentMergedProjects = projects;
    listeners.forEach((listener) => {
        try {
            listener(projects);
        } catch (e) {
            console.error('Project listener error:', e);
        }
    });
}

// Initial cache
currentMergedProjects = mergeProjects(getCachedCustomProjects());

export function subscribeProjects(callback: (projects: Project[]) => void): () => void {
    listeners.add(callback);

    // Call immediately with cache
    callback(currentMergedProjects);

    const projectsCollection = collection(db, 'projects');

    const unsubscribeSnapshot = onSnapshot(
        projectsCollection,
        (snapshot) => {
            const firestoreProjects: Project[] = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                firestoreProjects.push({
                    id: docSnap.id,
                    name: data.name || docSnap.id,
                    logo: data.logo || '/assets/img/anticvalley.png',
                    category: data.category || 'Deneysel',
                    status: data.status || 'Geliştiriliyor',
                    lifecycle: data.lifecycle || 'active',
                    description: data.description || '',
                    details: data.details || '',
                    platform: data.platform || 'Masaüstü uygulaması',
                    highlights: Array.isArray(data.highlights) ? data.highlights : [],
                    safetyNotice: data.safetyNotice || undefined,
                    hideUntilGala: data.hideUntilGala === true,
                    galaStartsAt: data.galaStartsAt || undefined,
                    galaId: data.galaId || undefined,
                });
            });

            setCachedCustomProjects(firestoreProjects);
            notifyListeners(mergeProjects(firestoreProjects));
        },
        (error) => {
            handleFirestoreError(error, OperationType.GET, 'projects');
            callback(currentMergedProjects.length > 0 ? currentMergedProjects : baseProjects);
        }
    );

    return () => {
        listeners.delete(callback);
        unsubscribeSnapshot();
    };
}

export async function saveProject(project: Project): Promise<void> {
    removeDeletedProjectId(project.id);

    // 1. Instant Optimistic Update
    const currentCustom = getCachedCustomProjects();
    const existingIndex = currentCustom.findIndex((p) => p.id === project.id);
    let updatedCustom: Project[];
    if (existingIndex >= 0) {
        updatedCustom = [...currentCustom];
        updatedCustom[existingIndex] = project;
    } else {
        updatedCustom = [project, ...currentCustom];
    }
    setCachedCustomProjects(updatedCustom);
    notifyListeners(mergeProjects(updatedCustom));

    // 2. Parallel Firestore Persistence
    const path = `projects/${project.id}`;
    try {
        const docRef = doc(db, 'projects', project.id);
        const cleanPayload: Record<string, any> = {
            id: project.id,
            name: project.name.trim(),
            logo: project.logo.trim(),
            category: project.category.trim(),
            status: project.status.trim(),
            lifecycle: project.lifecycle,
            description: project.description.trim(),
            details: project.details.trim(),
            platform: project.platform.trim(),
            highlights: project.highlights || [],
            createdAt: new Date().toISOString(),
        };
        if (project.safetyNotice) cleanPayload.safetyNotice = project.safetyNotice.trim();
        if (project.hideUntilGala !== undefined) cleanPayload.hideUntilGala = Boolean(project.hideUntilGala);
        if (project.galaStartsAt) cleanPayload.galaStartsAt = project.galaStartsAt.trim();
        if (project.galaId) cleanPayload.galaId = project.galaId.trim();

        await setDoc(docRef, cleanPayload);
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
    }
}

export async function deleteProject(projectId: string): Promise<void> {
    // 1. Mark deleted & Instant Optimistic Update (0ms)
    addDeletedProjectId(projectId);
    const currentCustom = getCachedCustomProjects();
    const filtered = currentCustom.filter((p) => p.id !== projectId);
    setCachedCustomProjects(filtered);
    notifyListeners(mergeProjects(filtered));

    // 2. Parallel Firestore Deletion
    const path = `projects/${projectId}`;
    try {
        const docRef = doc(db, 'projects', projectId);
        await deleteDoc(docRef);
    } catch (error) {
        // If it wasn't in firestore or rules failed, optimistic update still guarantees local deletion
        console.warn('Firestore delete note:', error);
    }
}
