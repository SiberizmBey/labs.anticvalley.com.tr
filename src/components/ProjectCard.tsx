import { useState } from "react";
import { Check, Monitor } from "lucide-react";
import { Project } from "../data/projects";
import { ProjectDetailsModal } from "./ProjectDetailsModal";
import { ProjectLogoPreview } from "./ProjectLogoPreview";

interface ProjectCardProps {
    project: Project;
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

export const ProjectCard = ({ project }: ProjectCardProps) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    return (
        <>
            <article
                id={`project-${project.id}`}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`${project.name} proje detaylarını aç`}
                onClick={() => setIsDetailsOpen(true)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setIsDetailsOpen(true);
                    }
                }}
                className="group scroll-mt-24 cursor-pointer rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] p-5 transition-all duration-200 flex flex-col shadow-xs hover:shadow-md hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
                <div className="flex items-start justify-between gap-3">
                    <ProjectLogoPreview
                        src={project.logo}
                        alt={`${project.name} logosu`}
                        projectName={project.name}
                        className="h-14 w-14 shrink-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-inner)] p-2"
                    />
                    <div className="flex flex-wrap justify-end gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">
                            {project.category}
                        </span>
                        <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getStatusStyle(project.status)}`}
                        >
                            {project.status}
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--accent)] transition-colors">
                        {project.name}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                        {project.description}
                    </p>
                </div>

                <ul className="mt-4 space-y-2">
                    {project.highlights.map((highlight) => (
                        <li
                            key={highlight}
                            className="flex items-start gap-2 text-xs text-[var(--text-secondary)]"
                        >
                            <Check className="w-3.5 h-3.5 mt-0.5 text-[var(--accent)] shrink-0" />
                            <span>{highlight}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
                    <Monitor className="w-3.5 h-3.5 text-[var(--accent)]" />
                    {project.platform}
                </div>
            </article>
            {isDetailsOpen && (
                <ProjectDetailsModal
                    project={project}
                    onClose={() => setIsDetailsOpen(false)}
                />
            )}
        </>
    );
};
