import { ArrowRight, FlaskConical, History, Sparkles } from "lucide-react";
import { projects } from "../data/projects";
import { labDevelopments } from "../data/developments";

interface HeroSectionProps {
    onExploreProjects: () => void;
    onExploreDevelopments: () => void;
}

export const HeroSection = ({
    onExploreProjects,
    onExploreDevelopments,
}: HeroSectionProps) => {
    return (
        <section id="hero" className="w-full pt-4 pb-5 px-4 sm:px-6">
            <div className="w-[80%] mx-auto">
                <div className="motion-enter rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] p-6 sm:p-8 relative overflow-hidden shadow-xs">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-subtle)] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[var(--bg-inner)] border border-[var(--border-subtle)] p-3 shrink-0">
                            <img
                                src="/assets/img/anticvalley.png"
                                alt="Antic Valley logosu"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="max-w-3xl space-y-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-semibold uppercase tracking-wider font-mono">
                                <Sparkles className="w-3.5 h-3.5" />
                                ANTIC VALLEY • ANTIC LABS
                            </span>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
                                Antic Valley projeleri, tek bir yerde.
                            </h1>
                            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                                Antic Labs; Antic Valley çatısı altında
                                geliştirilen projeleri tanıtmak ve gelişimlerini
                                gün gün paylaşmak için kuruldu. Güvenli kasa ve
                                parola yönetiminden ERP'ye, ses araçlarından
                                hesaplar arası senkronizasyona uzanan ürünleri
                                keşfedin.
                            </p>

                            <div className="pt-1 flex flex-wrap items-center gap-2.5">
                                <button
                                    onClick={onExploreProjects}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] text-sm font-semibold shadow-xs transition-all group"
                                >
                                    <FlaskConical className="w-4 h-4" />
                                    <span>Projeleri keşfet</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                                <button
                                    onClick={onExploreDevelopments}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-inner)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-input)] text-sm font-semibold transition-all"
                                >
                                    <History className="w-4 h-4 text-[var(--accent)]" />
                                    <span>Günlük gelişmeler</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-6 pt-5 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-4 sm:gap-6 max-w-lg">
                        <div className="space-y-0.5">
                            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                                Proje
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-[var(--text-primary)] font-mono">
                                {projects.length} çalışma
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                                Günlük
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-[var(--accent)] font-mono">
                                {labDevelopments.length} gelişme
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
