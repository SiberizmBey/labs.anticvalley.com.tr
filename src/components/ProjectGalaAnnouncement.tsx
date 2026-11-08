import { useEffect, useMemo, useState } from "react";
import { Clapperboard, ExternalLink, Sparkles, X } from "lucide-react";
import { projects } from "../data/projects";
import { projectGalas, ProjectGala } from "../data/galas";
import { Project } from "../data/projects";
import { ProjectDetailsModal } from "./ProjectDetailsModal";

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

const validatedGalas = projectGalas.filter((gala) => {
    const startsAt = Date.parse(gala.startsAt);
    const endsAt = gala.endsAt ? Date.parse(gala.endsAt) : undefined;
    const projectExists = projects.some(
        (project) => project.id === gala.projectId,
    );

    if (!projectExists || Number.isNaN(startsAt)) {
        console.error(
            `Invalid project gala configuration for "${gala.projectId}": verify the project ID and startsAt date.`,
        );
        return false;
    }
    if (endsAt !== undefined && (Number.isNaN(endsAt) || endsAt <= startsAt)) {
        console.error(
            `Invalid end time for project gala "${gala.projectId}": endsAt must be later than startsAt.`,
        );
        return false;
    }
    if (gala.youtubeLiveUrl && !isValidYoutubeUrl(gala.youtubeLiveUrl)) {
        console.error(
            `Invalid YouTube URL for project gala "${gala.projectId}": use an https YouTube link.`,
        );
        return false;
    }
    return true;
});

const findActiveGala = (now: number): ProjectGala | undefined =>
    validatedGalas
        .filter((gala) => {
            const startsAt = Date.parse(gala.startsAt);
            const endsAt = gala.endsAt
                ? Date.parse(gala.endsAt)
                : Number.POSITIVE_INFINITY;
            return now >= startsAt && now < endsAt;
        })
        .sort(
            (first, second) =>
                Date.parse(second.startsAt) - Date.parse(first.startsAt),
        )[0];

export const ProjectGalaAnnouncement = () => {
    const [now, setNow] = useState(() => Date.now());
    const [dismissedGalaKey, setDismissedGalaKey] = useState<string | null>(
        null,
    );
    const [previewProject, setPreviewProject] = useState<Project | null>(null);

    useEffect(() => {
        let timeoutId: number | undefined;

        const scheduleNextChange = () => {
            const currentTime = Date.now();
            const nextChange = validatedGalas
                .flatMap((gala) => [
                    Date.parse(gala.startsAt),
                    gala.endsAt ? Date.parse(gala.endsAt) : undefined,
                ])
                .filter(
                    (time): time is number =>
                        time !== undefined && time > currentTime,
                )
                .sort((first, second) => first - second)[0];

            if (nextChange !== undefined) {
                timeoutId = window.setTimeout(() => {
                    setNow(Date.now());
                    scheduleNextChange();
                }, nextChange - currentTime + 50);
            }
        };

        scheduleNextChange();
        return () => {
            if (timeoutId !== undefined) window.clearTimeout(timeoutId);
        };
    }, []);

    const activeGala = findActiveGala(now);
    const project = activeGala
        ? projects.find((item) => item.id === activeGala.projectId)
        : undefined;
    const galaKey = activeGala
        ? `${activeGala.projectId}:${activeGala.startsAt}`
        : null;
    const youtubeUrl = useMemo(
        () =>
            activeGala?.youtubeLiveUrl &&
            isValidYoutubeUrl(activeGala.youtubeLiveUrl)
                ? activeGala.youtubeLiveUrl
                : undefined,
        [activeGala],
    );

    if (!activeGala || !project || dismissedGalaKey === galaKey) return null;

    return (
        <>
            <aside
                aria-label={`${project.name} proje galası`}
                className="gala-announcement fixed inset-x-0 top-[5.25rem] z-[45] mx-auto w-[min(48rem,calc(100%-1.5rem))] rounded-2xl border border-[var(--accent-border)] bg-[var(--bg-island)] p-3 shadow-2xl backdrop-blur-xl sm:p-4"
            >
                <div className="flex items-center gap-3">
                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-inner)] p-1.5 sm:flex">
                        <img
                            src={project.logo}
                            alt=""
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-text)] sm:text-xs">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                            </span>
                            Şu anda proje galası yapılıyor
                        </div>
                        <p className="mt-1 truncate text-sm font-bold text-[var(--text-primary)] sm:text-base">
                            {project.name}
                            <span className="font-medium text-[var(--text-secondary)]">
                                {" "}
                                galasında ön izlemeye gelin.
                            </span>
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setPreviewProject(project)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--btn-primary-bg)] px-3 py-2 text-xs font-semibold text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] sm:px-4"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">
                                Ön izlemeye git
                            </span>
                            <span className="sm:hidden">Ön izleme</span>
                        </button>
                        {youtubeUrl && (
                            <a
                                href={youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-inner)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-border)]"
                            >
                                <Clapperboard className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">
                                    Canlı yayın
                                </span>
                                <ExternalLink className="hidden h-3 w-3 sm:block" />
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={() => setDismissedGalaKey(galaKey)}
                            aria-label="Gala duyurusunu kapat"
                            className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--bg-inner)] hover:text-[var(--text-primary)]"
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
