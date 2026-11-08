import { useEffect, useMemo, useState } from "react";
import { Clapperboard, ExternalLink, Sparkles, X, Clock, Video } from "lucide-react";
import { Project } from "../data/projects";
import { ProjectGalaItem } from "../services/galaService";
import { ProjectDetailsModal } from "./ProjectDetailsModal";

interface ProjectGalaAnnouncementProps {
    galas?: ProjectGalaItem[];
    projects?: Project[];
}

const isValidYoutubeUrl = (value: string) => {
    try {
        const url = new URL(value);
        return (
            url.protocol === "https:" &&
            (url.hostname === "youtube.com" ||
                url.hostname.endsWith(".youtube.com") ||
                url.hostname === "youtu.be")
        );
    } catch {
        return false;
    }
};

export const ProjectGalaAnnouncement = ({
    galas = [],
    projects = [],
}: ProjectGalaAnnouncementProps) => {
    const [now, setNow] = useState<number>(() => Date.now());
    const [dismissedGalaKey, setDismissedGalaKey] = useState<string | null>(null);
    const [previewProject, setPreviewProject] = useState<Project | null>(null);

    // Regular interval to refresh "now" every 10 seconds for real-time live detection
    useEffect(() => {
        const interval = window.setInterval(() => {
            setNow(Date.now());
        }, 5000);
        return () => window.clearInterval(interval);
    }, []);

    // Filter valid galas
    const activeGala = useMemo(() => {
        if (!galas || galas.length === 0) return undefined;

        // 1. Look for currently active (live) gala
        const active = galas.find((gala) => {
            if (gala.status === 'cancelled' || gala.status === 'completed') return false;
            const startsAt = Date.parse(gala.startsAt);
            const endsAt = gala.endsAt ? Date.parse(gala.endsAt) : Number.POSITIVE_INFINITY;
            if (Number.isNaN(startsAt)) return false;

            // Direct "live" status or time reached
            if (gala.status === 'live') return true;
            return now >= startsAt && now < endsAt;
        });

        if (active) return { gala: active, isLive: true };

        // 2. Look for upcoming gala within 7 days
        const upcoming = galas.find((gala) => {
            if (gala.status !== 'scheduled') return false;
            const startsAt = Date.parse(gala.startsAt);
            if (Number.isNaN(startsAt)) return false;
            const diff = startsAt - now;
            return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
        });

        if (upcoming) return { gala: upcoming, isLive: false };

        return undefined;
    }, [galas, now]);

    const targetProject = useMemo(() => {
        if (!activeGala) return undefined;
        return projects.find((p) => p.id === activeGala.gala.projectId);
    }, [activeGala, projects]);

    const galaKey = activeGala
        ? `${activeGala.gala.id}:${activeGala.gala.startsAt}`
        : null;

    const youtubeUrl = useMemo(() => {
        if (!activeGala?.gala.youtubeLiveUrl) return undefined;
        return isValidYoutubeUrl(activeGala.gala.youtubeLiveUrl)
            ? activeGala.gala.youtubeLiveUrl
            : undefined;
    }, [activeGala]);

    if (!activeGala || !targetProject || dismissedGalaKey === galaKey) return null;

    const isLive = activeGala.isLive;
    const gala = activeGala.gala;

    // Format remaining time for upcoming
    const formatRemainingTime = (targetTime: number) => {
        const diffMs = targetTime - now;
        if (diffMs <= 0) return 'Başlıyor...';
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days} gün ${hours % 24} sa ${minutes} dk`;
        }
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <aside
                aria-label={`${targetProject.name} proje galası`}
                className={`gala-announcement fixed inset-x-0 top-[5.25rem] z-[45] mx-auto w-[min(50rem,calc(100%-1.5rem))] rounded-2xl border ${
                    isLive ? 'border-[var(--accent)] bg-[var(--bg-island)] shadow-2xl shadow-[var(--accent-subtle)]' : 'border-[var(--border-card)] bg-[var(--bg-island)] shadow-xl'
                } p-3.5 sm:p-4 backdrop-blur-xl transition-all duration-300`}
            >
                <div className="flex items-center gap-3">
                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-inner)] p-1.5 sm:flex">
                        <img
                            src={targetProject.logo}
                            alt=""
                            className="h-full w-full object-contain"
                        />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--accent-text)]">
                            {isLive ? (
                                <>
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                    </span>
                                    <span className="text-red-400 font-mono font-bold">CANLI // ŞU ANDA PROJE GALASI YAPILIYOR</span>
                                </>
                            ) : (
                                <>
                                    <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
                                    <span className="font-mono">YAKLAŞAN PROJE GALASI: {formatRemainingTime(Date.parse(gala.startsAt))}</span>
                                </>
                            )}
                        </div>

                        <p className="mt-1 truncate text-sm font-bold text-[var(--text-primary)] sm:text-base">
                            {targetProject.name}
                            <span className="font-medium text-[var(--text-secondary)]">
                                {isLive ? " galasında ön izlemeye gelin!" : " resmi lansman galası yaklaşıyor."}
                            </span>
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setPreviewProject(targetProject)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--btn-primary-bg)] px-3 py-2 text-xs font-semibold text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] sm:px-4 cursor-pointer shadow-xs"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Ön izlemeye git</span>
                            <span className="sm:hidden">Ön izleme</span>
                        </button>

                        {youtubeUrl && (
                            <a
                                href={youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                            >
                                <Video className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Canlı Yayın</span>
                                <ExternalLink className="hidden h-3 w-3 sm:block" />
                            </a>
                        )}

                        <button
                            type="button"
                            onClick={() => setDismissedGalaKey(galaKey)}
                            aria-label="Gala duyurusunu kapat"
                            className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--bg-inner)] hover:text-[var(--text-primary)] cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {previewProject && (
                <ProjectDetailsModal
                    project={previewProject}
                    onClose={() => setPreviewProject(null)}
                />
            )}
        </>
    );
};
