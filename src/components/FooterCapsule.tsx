import { Github, Instagram, FlaskConical, History } from "lucide-react";

interface FooterCapsuleProps {
    onNavigate: (sectionId: string) => void;
}

export const FooterCapsule = ({ onNavigate }: FooterCapsuleProps) => (
    <footer className="motion-enter w-full px-2.5 pt-4 pb-24 md:pb-8 bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors">
        <div className="w-full p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)]/40 backdrop-blur-xl border border-[var(--border-card)]/60 shadow-2xl">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
                    <div className="space-y-4">
                        <button
                            onClick={() => onNavigate("hero")}
                            className="flex items-center gap-3 text-left group"
                        >
                            <img
                                src="/assets/img/anticvalley.png"
                                alt="Antic Valley logosu"
                                className="w-9 h-9 object-contain transition-transform duration-200 group-hover:scale-105"
                            />
                            <span className="text-sm font-medium tracking-wide text-[var(--text-primary)]">
                                Antic Valley
                            </span>
                        </button>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                            Antic Valley projeleri ve günlük gelişmeleri.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                            Keşfet
                        </h2>
                        <div className="flex flex-col items-start gap-2 text-xs sm:text-sm text-[var(--text-secondary)]">
                            <button
                                onClick={() => onNavigate("projects")}
                                className="inline-flex items-center gap-2 hover:text-[var(--accent-text)]"
                            >
                                <FlaskConical className="w-3.5 h-3.5" />
                                Projeler
                            </button>
                            <button
                                onClick={() => onNavigate("developments")}
                                className="inline-flex items-center gap-2 hover:text-[var(--accent-text)]"
                            >
                                <History className="w-3.5 h-3.5" />
                                Günlük gelişmeler
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                            Sosyal
                        </h2>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://github.com/SiberizmBey"
                                target="_blank"
                                rel="noreferrer"
                                className="w-10 h-10 rounded-2xl bg-[var(--bg-inner)]/50 border border-[var(--border-card)] hover:border-[var(--accent-border)] hover:text-[var(--accent-text)] hover:-translate-y-0.5 flex items-center justify-center text-[var(--text-primary)]"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com/ahmetinzmsec"
                                target="_blank"
                                rel="noreferrer"
                                className="w-10 h-10 rounded-2xl bg-[var(--bg-inner)]/50 border border-[var(--border-card)] hover:border-[var(--accent-border)] hover:text-[var(--accent-text)] hover:-translate-y-0.5 flex items-center justify-center text-[var(--text-primary)]"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-5 border-t border-[var(--border-subtle)]/40 text-center">
                    <p className="text-xs text-[var(--text-muted)] font-medium">
                        © 2026 Antic Valley • Tüm Hakları Saklıdır.
                    </p>
                </div>
            </div>
        </div>
    </footer>
);
