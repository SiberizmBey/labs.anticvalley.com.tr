import { projects } from "../data/projects";
import { ProjectCard } from "./ProjectCard";

export const ProjectsSection = () => {
    const activeProjects = projects.filter(
        (project) => project.lifecycle === "active",
    );
    const transitioningProjects = projects.filter(
        (project) => project.lifecycle === "transitioning",
    );
    const pausedProjects = projects.filter(
        (project) => project.lifecycle === "paused",
    );

    return (
        <section id="projects" className="w-full py-6 sm:py-8 px-4 sm:px-6">
            <div className="w-[80%] mx-auto space-y-5">
                <div className="motion-enter space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-text)] font-mono">
                            PROJELER
                        </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                        Aktif projeler
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        Aktif olarak geliştirilen projeler; ürün devri ve
                        geliştirme durumundaki diğer çalışmalardan ayrı
                        listelenir.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {activeProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {(transitioningProjects.length > 0 ||
                    pausedProjects.length > 0) && (
                    <div className="space-y-5 pt-4">
                        <div className="space-y-1">
                            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
                                Aktif olmayan projeler
                            </h3>
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                                Ürün devri süren veya geliştirmesi askıya
                                alınan projeler.
                            </p>
                        </div>

                        {transitioningProjects.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-[var(--text-secondary)]">
                                    Koza'ya devrediliyor
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                    {transitioningProjects.map((project) => (
                                        <ProjectCard
                                            key={project.id}
                                            project={project}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {pausedProjects.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-[var(--text-secondary)]">
                                    Geliştirmesi askıda
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                    {pausedProjects.map((project) => (
                                        <ProjectCard
                                            key={project.id}
                                            project={project}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};
