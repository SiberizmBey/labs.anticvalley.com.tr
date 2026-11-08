import { useEffect, useMemo, useState, useRef } from "react";
import { ExternalLink, Sparkles, X, Clock, Video, Radio, ChevronDown, ChevronUp } from "lucide-react";
import { Project } from "../data/projects";
import { ProjectGalaItem } from "../services/galaService";
import { ProjectDetailsModal } from "./ProjectDetailsModal";

interface GalaDynamicIslandProps {
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

export const GalaDynamicIsland = ({
    galas = [],
    projects = [],
}: GalaDynamicIslandProps) => {
    const [now, setNow] = useState<number>(() => Date.now());
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [previewProject, setPreviewProject] = useState<Project | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Refresh time every 5 seconds for live status
    useEffect(() => {
        const interval = window.setInterval(() => {
            setNow(Date.now());
        }, 5000);
        return () => window.clearInterval(interval);
    }, []);

    // Filter valid galas: live first, then upcoming
    const activeGala = useMemo(() => {
        if (!galas || galas.length === 0) return undefined;

        // 1. Currently active / live gala
        const liveGala = galas.find((gala) => {
            if (gala.status === "cancelled" || gala.status === "completed") return false;
            const startsAt = Date.parse(gala.startsAt);
            const endsAt = gala.endsAt ? Date.parse(gala.endsAt) : Number.POSITIVE_INFINITY;
            if (Number.isNaN(startsAt)) return false;

            if (gala.status === "live") return true;
            return now >= startsAt && now < endsAt;
        });

        if (liveGala) return { gala: liveGala, isLive: true };

        // 2. Upcoming gala within 7 days
        const upcoming = galas.find((gala) => {
            if (gala.status !== "scheduled") return false;
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

    const youtubeUrl = useMemo(() => {
        if (!activeGala?.gala.youtubeLiveUrl) return undefined;
        return isValidYoutubeUrl(activeGala.gala.youtubeLiveUrl)
            ? activeGala.gala.youtubeLiveUrl
            : undefined;
    }, [activeGala]);

    // Close expanded view when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsExpanded(false);
            }
        };
        if (isExpanded) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isExpanded]);

    if (!activeGala || !targetProject) return null;

    const isLive = activeGala.isLive;
    const gala = activeGala.gala;

    const formatRemainingTime = (targetTime: number) => {
        const diffMs = targetTime - now;
        if (diffMs <= 0) return "Başlıyor...";
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days} gün ${hours % 24} sa`;
        }
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <>
            <div ref={containerRef} className="relative z-40">
                {/* Collapsed Dynamic Island Capsule (Sits right to the left of Settings) */}
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-label={`${targetProject.name} galası dinamik ada`}
                    className={`group relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border shadow-xs transition-all duration-300 ease-out cursor-pointer select-none hover:scale-[1.04] active:scale-[0.97] ${
                        isLive
                            ? "bg-[var(--bg-island)] border-red-500/70 hover:border-red-500 text-red-400 island-live-anim shadow-lg"
                            : "bg-[var(--bg-island)] border-[var(--accent)] text-[var(--text-primary)] hover:border-[var(--accent)] island-pulse-anim shadow-md"
                    } ${isExpanded ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-canvas)] scale-[1.02]" : ""}`}
                >
                    {/* Live Beacon with Equalizer Bars or Clock Icon */}
                    {isLive ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="relative flex h-2.5 w-2.5 shrink-0">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-80" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                            </span>
                            <div className="flex items-end gap-0.5 h-3">
                                <span className="w-0.5 bg-red-400 rounded-full animate-[soundwave_0.8s_ease-in-out_infinite]" />
                                <span className="w-0.5 bg-red-400 rounded-full animate-[soundwave_1.1s_ease-in-out_infinite_0.2s]" />
                                <span className="w-0.5 bg-red-400 rounded-full animate-[soundwave_0.9s_ease-in-out_infinite_0.4s]" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 shrink-0">
                            <Clock className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 animate-pulse" />
                        </div>
                    )}

                    {/* Project Logo mini avatar */}
                    <div className="w-4 h-4 rounded-full overflow-hidden bg-black/20 shrink-0 flex items-center justify-center p-0.5 transition-transform duration-200 group-hover:scale-110">
                        <img
                            src={targetProject.logo}
                            alt=""
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Capsule Label Text */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <span className="font-bold text-[var(--text-primary)] truncate max-w-[80px] sm:max-w-[130px]">
                            {targetProject.name}
                        </span>
                        {isLive ? (
                            <span className="text-[10px] sm:text-xs font-mono font-bold text-red-400 uppercase tracking-tight flex items-center gap-1">
                                <span className="hidden sm:inline">//</span>
                                <span>CANLI GALA</span>
                            </span>
                        ) : (
                            <span className="text-[10px] sm:text-[11px] font-mono text-[var(--accent-text)] hidden sm:inline">
                                ({formatRemainingTime(Date.parse(gala.startsAt))})
                            </span>
                        )}
                    </div>

                    {/* Dynamic Island Expand Caret */}
                    {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0 transition-transform duration-200" />
                    ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0 group-hover:translate-y-0.5 transition-transform duration-200" />
                    )}
                </button>

                {/* Expanded Form: Dynamic Island Announcement Form */}
                {isExpanded && (
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${targetProject.name} gala duyuru formu`}
                        className={`absolute right-0 top-full mt-2.5 w-[calc(100vw-2rem)] sm:w-[28rem] md:w-[32rem] max-w-[92vw] z-50 rounded-3xl border ${
                            isLive
                                ? "border-red-500/40 bg-[var(--bg-modal)] shadow-2xl shadow-red-500/10 ring-1 ring-red-500/30"
                                : "border-[var(--accent-border)] bg-[var(--bg-modal)] shadow-2xl shadow-[var(--accent-subtle)] ring-1 ring-[var(--accent-border)]"
                        } p-4 sm:p-5 backdrop-blur-2xl transition-all duration-300 ease-out origin-top-right animate-in fade-in zoom-in-95 slide-in-from-top-2`}
                    >
                        {/* Dynamic Island Top Notch Pill Indicator */}
                        <div className="w-12 h-1 rounded-full bg-[var(--border-subtle)] mx-auto mb-3 opacity-60" />

                        {/* Header of expanded form */}
                        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                            <div className="flex items-center gap-2">
                                {isLive ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-80" />
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                        </span>
                                        <span className="text-xs font-bold font-mono tracking-wider uppercase text-red-400">
                                            CANLI YAYINDA // PROJE GALASI
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5">
                                        <Radio className="w-4 h-4 text-[var(--accent)] animate-pulse" />
                                        <span className="text-xs font-bold font-mono tracking-wider uppercase text-[var(--accent-text)]">
                                            YAKLAŞAN PROJE GALASI
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                aria-label="Kapat"
                                className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inner)] transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="py-3 flex items-start gap-3.5">
                            <div className="w-12 h-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-inner)] p-2 shrink-0 flex items-center justify-center shadow-xs">
                                <img
                                    src={targetProject.logo}
                                    alt=""
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="min-w-0 flex-1 space-y-1">
                                <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)] leading-snug">
                                    {targetProject.name}
                                </h4>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                    {gala.description || (isLive
                                        ? "Şu anda projenin canlı galası yapılıyor. Hemen ön izlemeye gelin ve yenilikleri keşfedin!"
                                        : `${targetProject.name} resmi lansman galası yaklaşıyor. Başlangıç saati geldiğinde otomatik canlı yayına geçilecektir.`)}
                                </p>
                                {!isLive && (
                                    <div className="pt-1 flex items-center gap-1.5 text-xs font-mono text-[var(--accent-text)]">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Kalan Süre: {formatRemainingTime(Date.parse(gala.startsAt))}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewProject(targetProject);
                                        setIsExpanded(false);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--btn-primary-bg)] px-4 py-2 text-xs font-semibold text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] cursor-pointer shadow-xs transition-all"
                                >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>Hemen Ön İzlemeye Git</span>
                                </button>

                                {youtubeUrl && (
                                    <a
                                        href={youtubeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all"
                                    >
                                        <Video className="h-3.5 w-3.5" />
                                        <span>Canlı Yayın</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-1 rounded-lg"
                            >
                                Küçült
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for previewing project */}
            {previewProject && (
                <ProjectDetailsModal
                    project={previewProject}
                    onClose={() => setPreviewProject(null)}
                />
            )}
        </>
    );
};
