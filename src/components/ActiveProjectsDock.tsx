import { useState } from "react";
import { projects as defaultProjects, Project } from "../data/projects";
import { ProjectDetailsModal } from "./ProjectDetailsModal";

interface ActiveProjectsDockProps {
    projects?: Project[];
}

export const ActiveProjectsDock = ({
    projects = defaultProjects,
}: ActiveProjectsDockProps = {}) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null,
    );
    const dockProjects = projects.filter(
        (project) =>
            project.lifecycle === "active" || project.lifecycle === "paused",
    );

    return (
        <>
            <nav
                aria-label="Aktif ve geliştirmesi askıda olan projeler"
                className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 md:flex flex-col items-center gap-1.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-island)] p-1.5 shadow-xl backdrop-blur-lg"
            >
                {dockProjects.map((project) => (
                    <button
                        key={project.id}
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        aria-label={`${project.name} proje detaylarını aç`}
                        aria-haspopup="dialog"
                        title={project.name}
                        className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-[var(--bg-inner)] p-2 text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:bg-[var(--accent-subtle)] focus-visible:border-[var(--accent)] focus-visible:outline-none"
                    >
                        <img
                            src={project.logo}
                            alt=""
                            className="h-full w-full object-contain"
                            loading="lazy"
                        />
                        <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-full border border-[var(--border-card)] bg-[var(--bg-modal)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] opacity-0 shadow-lg invisible transition-all group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100">
                            {project.name}
                        </span>
                    </button>
                ))}
            </nav>
            {selectedProject && (
                <ProjectDetailsModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </>
    );
};
