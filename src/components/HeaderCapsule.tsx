import { useState, useRef, useEffect } from "react";
import {
    Sun,
    Moon,
    Zap,
    Settings,
    X,
    FlaskConical,
    GitBranch,
    Palette,
    Monitor,
} from "lucide-react";
import { useTheme, ThemePreference } from "../context/ThemeContext";

import { Project } from "../data/projects";
import { ProjectGalaItem } from "../services/galaService";
import { GalaDynamicIsland } from "./GalaDynamicIsland";

interface HeaderCapsuleProps {
    activeSection: string;
    onNavigate: (sectionId: string) => void;
    galas?: ProjectGalaItem[];
    projects?: Project[];
}

export const HeaderCapsule = ({
    activeSection,
    onNavigate,
    galas,
    projects,
}: HeaderCapsuleProps) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const {
        themePreference,
        darkTheme,
        accentColor,
        setThemePreference,
        setDarkTheme,
        setAccentColor,
    } = useTheme();
    const settingsRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { id: "projects", label: "Projeler", icon: GitBranch },
        { id: "developments", label: "Gelişmeler", icon: FlaskConical },
    ];

    const themeOptions: {
        id: ThemePreference;
        label: string;
        desc: string;
        icon: typeof Monitor;
    }[] = [
        {
            id: "system",
            label: "Sistem",
            desc: "Cihaz temasını takip et",
            icon: Monitor,
        },
        {
            id: "dark",
            label: "Koyu",
            desc: "Koyu görünümü kullan",
            icon: Moon,
        },
        {
            id: "light",
            label: "Açık",
            desc: "Açık görünümü kullan",
            icon: Sun,
        },
    ];
    const accentPresets = [
        { name: "Antic Sarısı", color: "#FFC928" },
        { name: "Mor", color: "#9B6BFF" },
        { name: "Mavi", color: "#38BDF8" },
        { name: "Yeşil", color: "#34D399" },
        { name: "Mercan", color: "#FB7185" },
    ];

    // Close settings popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                settingsRef.current &&
                !settingsRef.current.contains(event.target as Node)
            ) {
                setSettingsOpen(false);
            }
        };
        if (settingsOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleSettingsKeyDown);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleSettingsKeyDown);
        };
    }, [settingsOpen]);

    const handleSettingsKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") setSettingsOpen(false);
    };

    return (
        <header className="motion-enter sticky top-0 z-50 w-full px-4 sm:px-6 py-3.5 bg-transparent pointer-events-none">
            <div className="w-[90%] mx-auto flex items-center justify-between gap-3">
                {/* Brand Capsule (Left) */}
                <div className="pointer-events-auto flex items-center gap-2">
                    <button
                        id="brand-capsule-button"
                        onClick={() => onNavigate("projects")}
                        className="group flex items-center gap-2.5 px-2 py-2 rounded-full bg-[var(--bg-island)] border border-[var(--border-card)] hover:border-[var(--accent)] shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                            <img
                                src="/assets/img/anticvalley.png"
                                alt="Antic Valley Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="font-medium text-xs sm:text-sm tracking-normal text-[var(--text-primary)]">
                            Antic Labs
                        </span>
                    </button>
                </div>

                {/* Floating Capsule Nav (Center - Desktop) */}
                <nav
                    aria-label="Ana Gezinti"
                    className="pointer-events-auto hidden md:flex items-center gap-1.5 px-1.5 py-1.5 rounded-full bg-[var(--bg-island)] border border-[var(--border-card)] shadow-md backdrop-blur-md"
                >
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                id={`nav-capsule-${item.id}`}
                                onClick={() => onNavigate(item.id)}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 ${
                                    isActive
                                        ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs font-semibold"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inner)]"
                                }`}
                            >
                                <Icon
                                    className={`w-4 h-4 ${isActive ? "text-[var(--btn-primary-text)]" : "text-[var(--text-secondary)]"}`}
                                />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Right Capsules: Gala Dynamic Island & Settings */}
                <div className="pointer-events-auto flex items-center gap-2 relative">
                    {/* Gala Dynamic Island (Immediately to the left of Ayarlar) */}
                    <GalaDynamicIsland galas={galas} projects={projects} />

                    {/* Settings Capsule (Theme & Appearance Menu) */}
                    <div ref={settingsRef} className="relative">
                        <button
                            id="settings-capsule-button"
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            aria-expanded={settingsOpen}
                            aria-controls="settings-menu"
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--bg-island)] border shadow-xs transition-all duration-150 ${
                                settingsOpen
                                    ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-card-hover)]"
                                    : "border-[var(--border-card)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--bg-card-hover)]"
                            }`}
                            title="Arayüz Ayarları ve Tema"
                            aria-label="Ayarlar"
                        >
                            <Settings
                                className={`w-4 h-4 transition-transform duration-200 ${settingsOpen ? "rotate-90 text-[var(--accent)]" : ""}`}
                            />
                            <span className="hidden sm:inline text-xs sm:text-sm font-medium">
                                Ayarlar
                            </span>
                        </button>

                        {settingsOpen && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Ayarlar menüsünü kapat"
                                    onClick={() => setSettingsOpen(false)}
                                    className="settings-menu-backdrop fixed inset-0 z-[60] cursor-default bg-[var(--modal-backdrop)] backdrop-blur-xs"
                                />
                                <section
                                    id="settings-menu"
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="settings-menu-title"
                                    aria-label="Görünüm ayarları menüsü"
                                    className="settings-menu-enter fixed right-0 top-0 z-[70] h-[100dvh] w-[min(22rem,100vw)] overflow-y-auto rounded-l-3xl border-y border-l border-[var(--border-card)] bg-[var(--bg-modal)] p-5 shadow-2xl backdrop-blur-xl"
                                >
                                    <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
                                    <div className="flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-[var(--accent)]" />
                                        <span
                                            id="settings-menu-title"
                                            className="font-bold text-xs sm:text-sm text-[var(--text-primary)]"
                                        >
                                            Görünüm menüsü
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSettingsOpen(false)}
                                        aria-label="Ayarlar menüsünü kapat"
                                        className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inner)] transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] px-1">
                                        Tema
                                    </div>

                                    <div className="grid grid-cols-3 gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-inner)] p-1">
                                        {themeOptions.map((opt) => {
                                            const Icon = opt.icon;
                                            const isCurrent =
                                                themePreference === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    id={`setting-theme-${opt.id}`}
                                                    onClick={() =>
                                                        setThemePreference(
                                                            opt.id,
                                                        )
                                                    }
                                                    title={opt.desc}
                                                    className={`flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition-colors ${
                                                        isCurrent
                                                            ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs"
                                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    <span>{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {themePreference !== "light" && (
                                    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-inner)] px-3 py-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <Zap className="h-4 w-4 text-[var(--accent)]" />
                                            <div>
                                                <div className="text-xs font-semibold text-[var(--text-primary)]">
                                                    AMOLED koyu mod
                                                </div>
                                                <div className="text-[11px] text-[var(--text-secondary)]">
                                                    Saf siyah arka plan
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={darkTheme === "amoled"}
                                            aria-label="AMOLED koyu modu"
                                            onClick={() =>
                                                setDarkTheme(
                                                    darkTheme === "amoled"
                                                        ? "dark"
                                                        : "amoled",
                                                )
                                            }
                                            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                                                darkTheme === "amoled"
                                                    ? "bg-[var(--accent)]"
                                                    : "bg-[var(--border-hover)]"
                                            }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                                    darkTheme === "amoled"
                                                        ? "translate-x-[1.375rem]"
                                                        : "translate-x-0.5"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                            <Palette className="h-3.5 w-3.5" />
                                            Vurgu rengi
                                        </div>
                                        <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                                            {accentColor.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {accentPresets.map((preset) => (
                                            <button
                                                key={preset.color}
                                                type="button"
                                                onClick={() =>
                                                    setAccentColor(preset.color)
                                                }
                                                aria-label={`${preset.name} vurgu rengini seç`}
                                                aria-pressed={
                                                    accentColor.toLowerCase() ===
                                                    preset.color.toLowerCase()
                                                }
                                                title={preset.name}
                                                className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                                                    accentColor.toLowerCase() ===
                                                    preset.color.toLowerCase()
                                                        ? "border-[var(--text-primary)] ring-2 ring-[var(--accent-border)]"
                                                        : "border-[var(--border-card)]"
                                                }`}
                                                style={{
                                                    backgroundColor:
                                                        preset.color,
                                                }}
                                            />
                                        ))}
                                        <label
                                            title="Özel vurgu rengi seç"
                                            className="relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[var(--border-card)] bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)]"
                                        >
                                            <input
                                                type="color"
                                                value={accentColor}
                                                onChange={(event) =>
                                                    setAccentColor(
                                                        event.target.value,
                                                    )
                                                }
                                                aria-label="Özel vurgu rengi"
                                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                            />
                                        </label>
                                    </div>
                                </div>
                                    </div>
                                </section>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
};
