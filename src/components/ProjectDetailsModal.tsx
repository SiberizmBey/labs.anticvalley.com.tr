import { useEffect } from "react";
import { Check, Monitor, X } from "lucide-react";
import { Project } from "../data/projects";
import { ProjectLogoPreview } from "./ProjectLogoPreview";

interface ProjectDetailsModalProps {
    project: Project;
    onClose: () => void;
}

const getStatusStyle = (status: string) => {
    if (status === "Aktif" || status === "Geliştiriliyor") {
        return "bg-[var(--accent-subtle)] text-[var(--accent-text)] border-[var(--accent-border)]";
    }
    if (status === "Koza'ya devrediliyor" || status === "Koza'ya aktarılıyor") {
        return "bg-amber-500/10 text-amber-300 border-amber-500/25";
    }
    return "bg-[var(--bg-inner)] text-[var(--text-secondary)] border-[var(--border-subtle)]";
};

export const ProjectDetailsModal = ({
    project,
    onClose,
}: ProjectDetailsModalProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === "Escape" &&
                !document.querySelector("[data-logo-preview-open='true']")
            ) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="project-modal-backdrop fixed inset-0 z-[60] flex items-center justify-center bg-[var(--modal-backdrop)] p-4 backdrop-blur-xs"
            onClick={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby={`project-modal-title-${project.id}`}
                className="project-modal-panel w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--border-card)] bg-[var(--bg-modal)] p-5 shadow-2xl sm:p-7"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
                    <div className="flex items-center gap-3">
                        <ProjectLogoPreview
                            src={project.logo}
                            alt={`${project.name} logosu`}
                            projectName={project.name}
                            className="h-14 w-14 shrink-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-inner)] p-2"
                        />
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-1.5">
                                <span className="rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--badge-text)]">
                                    {project.category}
                                </span>
                                <span
                                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getStatusStyle(project.status)}`}
                                >
                                    {project.status}
                                </span>
                            </div>
                            <h2
                                id={`project-modal-title-${project.id}`}
                                className="text-xl font-bold tracking-tight text-[var(--text-primary)]"
                            >
                                {project.name}
                            </h2>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Pencereyi kapat"
                        className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-inner)] p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </header>

                <div className="space-y-5 pt-5">
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                        {project.description}
                    </p>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                        {project.details}
                    </p>

                    {project.safetyNotice && (
                        <aside
                            role="note"
                            className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-[var(--text-primary)]"
                        >
                            <h3 className="mb-1.5 font-bold text-amber-400">
                                Güvenlik uyarısı
                            </h3>
                            <p>{project.safetyNotice}</p>
                        </aside>
                    )}

                    <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                            Öne çıkanlar
                        </h3>
                        <ul className="space-y-2.5">
                            {project.highlights.map((highlight) => (
                                <li
                                    key={highlight}
                                    className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                                >
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center gap-2 border-t border-[var(--border-subtle)] pt-4 text-xs font-mono text-[var(--text-muted)]">
                        <Monitor className="h-4 w-4 text-[var(--accent)]" />
                        {project.platform}
                    </div>
                </div>
            </section>
        </div>
    );
};
