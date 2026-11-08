import { labDevelopments } from "../data/developments";
import { projects as defaultProjects, Project } from "../data/projects";
import { LabDevelopment } from "../types";

const turkishMonths: Record<string, number> = {
    ocak: 0,
    subat: 1,
    şubat: 1,
    mart: 2,
    nisan: 3,
    mayis: 4,
    mayıs: 4,
    haziran: 5,
    temmuz: 6,
    agustos: 7,
    ağustos: 7,
    eylul: 8,
    eylül: 8,
    ekim: 9,
    kasim: 10,
    kasım: 10,
    aralik: 11,
    aralık: 11,
};

const getDateValue = (dateStr: string) => {
    if (!dateStr) return 0;
    const clean = dateStr.trim();

    // 1. Try standard JS Date parse (e.g. ISO)
    const standardParsed = Date.parse(clean);
    if (!Number.isNaN(standardParsed)) return standardParsed;

    // 2. Try day month year: "8 Kasım 2026" or "08 Kasım 2026"
    const parts = clean.split(/\s+/);
    if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const monthKey = parts[1].toLowerCase();
        const monthIndex = turkishMonths[monthKey];
        const year = parseInt(parts[2], 10);
        if (!Number.isNaN(day) && monthIndex !== undefined && !Number.isNaN(year)) {
            return new Date(year, monthIndex, day).getTime();
        }
    }

    // 3. Try "DD.MM.YYYY" or "DD/MM/YYYY"
    const match = clean.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
    if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const year = parseInt(match[3], 10);
        return new Date(year, month, day).getTime();
    }

    return 0;
};

interface DevelopmentsSectionProps {
    developments?: LabDevelopment[];
    projects?: Project[];
}

export const DevelopmentsSection = ({
    developments: passedDevelopments,
    projects: passedProjects = defaultProjects,
}: DevelopmentsSectionProps = {}) => {
    const activeProjects = passedProjects || defaultProjects;
    const rawDevs = passedDevelopments && passedDevelopments.length > 0 ? passedDevelopments : labDevelopments;
    
    // Sort developments:
    // 1. Newest date timestamp first
    // 2. Newest createdAt timestamp first
    // 3. User-added developments before initial base developments
    const baseIds = new Set(labDevelopments.map((d) => d.id));
    const developments = [...rawDevs].sort((a, b) => {
        const dateDiff = getDateValue(b.date) - getDateValue(a.date);
        if (dateDiff !== 0) return dateDiff;

        const timeA = a.createdAt ? Date.parse(a.createdAt) : 0;
        const timeB = b.createdAt ? Date.parse(b.createdAt) : 0;
        if (timeA !== timeB) return timeB - timeA;

        const aIsCustom = !baseIds.has(a.id);
        const bIsCustom = !baseIds.has(b.id);
        if (aIsCustom && !bIsCustom) return -1;
        if (!aIsCustom && bIsCustom) return 1;

        return 0;
    });

    // Group developments by normalized date maintaining sort order
    const groupsMap = new Map<string, LabDevelopment[]>();
    for (const dev of developments) {
        const dateKey = dev.date?.trim() || "Tarih Belirtilmedi";
        if (!groupsMap.has(dateKey)) {
            groupsMap.set(dateKey, []);
        }
        groupsMap.get(dateKey)!.push(dev);
    }
    const developmentsByDate = Array.from(groupsMap.entries()).map(([date, entries]) => ({
        date,
        entries,
    }));

    return (
        <section
            id="developments"
            className="w-full py-6 sm:py-8 px-4 sm:px-6"
        >
            <div className="w-[80%] mx-auto space-y-5">
                <div className="space-y-1">
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
                                <h3 className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)]">
                                    <time>{group.date}</time>
                                    <span className="h-px flex-1 bg-[var(--border-subtle)]" />
                                </h3>
                                <div className="space-y-3.5">
                                    {group.entries.map((dev) => (
                                        <article
                                            key={dev.id}
                                            id={`dev-item-${dev.id}`}
                                            className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] p-5 transition-all shadow-xs space-y-2 hover:-translate-y-0.5"
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
                                                                    activeProjects.find(
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
