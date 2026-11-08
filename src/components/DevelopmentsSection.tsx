import { labDevelopments } from "../data/developments";
import { projects } from "../data/projects";
import { LabDevelopment } from "../types";

const turkishMonths: Record<string, number> = {
    Ocak: 0,
    Şubat: 1,
    Mart: 2,
    Nisan: 3,
    Mayıs: 4,
    Haziran: 5,
    Temmuz: 6,
    Ağustos: 7,
    Eylül: 8,
    Ekim: 9,
    Kasım: 10,
    Aralık: 11,
};

const getDateValue = (date: string) => {
    const [day, month, year] = date.split(" ");
    const monthIndex = turkishMonths[month];
    return monthIndex === undefined
        ? 0
        : new Date(Number(year), monthIndex, Number(day)).getTime();
};

export const DevelopmentsSection = () => {
    const developments = [...labDevelopments].sort(
        (a, b) => getDateValue(b.date) - getDateValue(a.date),
    );
    const developmentsByDate = developments.reduce<
        { date: string; entries: LabDevelopment[] }[]
    >((groups, development) => {
        const currentGroup = groups[groups.length - 1];
        if (currentGroup?.date === development.date) {
            currentGroup.entries.push(development);
        } else {
            groups.push({ date: development.date, entries: [development] });
        }
        return groups;
    }, []);

    return (
        <section
            id="developments"
            className="w-full py-6 sm:py-8 px-4 sm:px-6"
        >
            <div className="w-[80%] mx-auto space-y-5">
                <div className="motion-enter space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-text)] font-mono">
                            GELİŞMELER
                        </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                        Günlük Proje Notları
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        Projelerimdeki yenilikler ve ilerlemeler, en yeniden eskiye.
                    </p>
                </div>

                {developments.length > 0 ? (
                    <div className="space-y-7">
                        {developmentsByDate.map((group) => (
                            <section
                                key={group.date}
                                aria-label={`Gelişmeler: ${group.date}`}
                                className="space-y-3"
                            >
                                <h3 className="motion-enter flex items-center gap-3 text-sm font-bold text-[var(--text-primary)]">
                                    <time>{group.date}</time>
                                    <span className="h-px flex-1 bg-[var(--border-subtle)]" />
                                </h3>
                                <div className="space-y-3.5">
                                    {group.entries.map((dev) => (
                                        <article
                                            key={dev.id}
                                            id={`dev-item-${dev.id}`}
                                            className="motion-enter rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] p-5 transition-all shadow-xs space-y-2 hover:-translate-y-0.5"
                                        >
                                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                                <span className="px-2.5 py-0.5 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] font-mono font-semibold">
                                                    {dev.badge}
                                                </span>
                                                <span className="text-[var(--border-subtle)]">
                                                    •
                                                </span>
                                                <span className="font-medium text-[var(--accent-text)]">
                                                    <span className="mr-1.5 inline-flex items-center gap-1 align-middle">
                                                        {dev.category
                                                            .split("→")
                                                            .map((name) =>
                                                                name.trim(),
                                                            )
                                                            .map((name) => {
                                                                const project =
                                                                    projects.find(
                                                                        (item) =>
                                                                            item.name.toLowerCase() ===
                                                                            name.toLowerCase(),
                                                                    );
                                                                return project ? (
                                                                    <img
                                                                        key={
                                                                            project.id
                                                                        }
                                                                        src={
                                                                            project.logo
                                                                        }
                                                                        alt=""
                                                                        title={
                                                                            project.name
                                                                        }
                                                                        className="h-5 w-5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-inner)] object-contain p-0.5"
                                                                        loading="lazy"
                                                                    />
                                                                ) : null;
                                                            })}
                                                    </span>
                                                    {dev.category}
                                                </span>
                                            </div>
                                            <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                                                {dev.title}
                                            </h4>
                                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                                                {dev.summary}
                                            </p>
                                            {dev.highlights.length > 0 && (
                                                <ul className="pt-2 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    {dev.highlights.map(
                                                        (highlight) => (
                                                            <li
                                                                key={highlight}
                                                                className="flex items-start gap-2 p-2 rounded-xl bg-[var(--bg-inner)] border border-[var(--border-subtle)] text-[11px] sm:text-xs text-[var(--text-secondary)] leading-snug"
                                                            >
                                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                                                                {highlight}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] p-6 text-sm text-[var(--text-secondary)]">
                        Yeni proje notları ve günlük gelişmeler burada
                        yayınlanacak.
                    </div>
                )}
            </div>
        </section>
    );
};
