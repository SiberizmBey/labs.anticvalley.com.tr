import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "dark" | "light" | "amoled";
export type ThemePreference = "system" | "dark" | "light";
export type DarkTheme = "dark" | "amoled";

interface ThemeContextType {
    theme: ThemeMode;
    themePreference: ThemePreference;
    darkTheme: DarkTheme;
    accentColor: string;
    setThemePreference: (preference: ThemePreference) => void;
    setDarkTheme: (theme: DarkTheme) => void;
    setAccentColor: (color: string) => void;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
}

const DEFAULT_ACCENT = "#FFC928";

const ThemeContext = createContext<ThemeContextType>({
    theme: "dark",
    themePreference: "system",
    darkTheme: "dark",
    accentColor: DEFAULT_ACCENT,
    setThemePreference: () => {},
    setDarkTheme: () => {},
    setAccentColor: () => {},
    setTheme: () => {},
    toggleTheme: () => {},
});

const isThemePreference = (value: string | null): value is ThemePreference =>
    value === "system" || value === "dark" || value === "light";

const isHexColor = (value: string) => /^#[\da-f]{6}$/i.test(value);

const toRgb = (hex: string) => {
    const value = hex.slice(1);
    return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16),
    };
};

const mixColor = (
    { r, g, b }: ReturnType<typeof toRgb>,
    target: number,
    amount: number,
) =>
    `#${[r, g, b]
        .map((channel) =>
            Math.round(channel + (target - channel) * amount)
                .toString(16)
                .padStart(2, "0"),
        )
        .join("")}`;

const applyAccentColor = (color: string, theme: ThemeMode) => {
    const root = document.documentElement;
    const rgb = toRgb(color);
    const luminance =
        (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
    const darkSurface = theme !== "light";
    const accentText = mixColor(rgb, darkSurface ? 255 : 0, darkSurface ? 0.42 : 0.48);
    const buttonText = luminance > 0.58 ? "#18140a" : "#ffffff";

    root.style.setProperty("--accent", color);
    root.style.setProperty(
        "--accent-hover",
        mixColor(rgb, darkSurface ? 0 : 255, 0.12),
    );
    root.style.setProperty(
        "--accent-active",
        mixColor(rgb, darkSurface ? 0 : 255, 0.22),
    );
    root.style.setProperty(
        "--accent-subtle",
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${darkSurface ? 0.15 : 0.09})`,
    );
    root.style.setProperty(
        "--accent-border",
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${darkSurface ? 0.38 : 0.3})`,
    );
    root.style.setProperty("--accent-text", accentText);
    root.style.setProperty("--btn-primary-bg", color);
    root.style.setProperty("--btn-primary-hover", mixColor(rgb, 0, 0.14));
    root.style.setProperty("--btn-primary-text", buttonText);
    root.style.setProperty("--badge-bg", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
    root.style.setProperty("--badge-border", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.34)`);
    root.style.setProperty("--badge-text", accentText);
    root.style.setProperty("--scrollbar-thumb-hover", color);
    root.style.setProperty("--main-theme", color);
    root.style.setProperty("--s-main-theme", accentText);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [themePreference, setThemePreferenceState] =
        useState<ThemePreference>(() => {
            try {
                const savedPreference = localStorage.getItem(
                    "antic_theme_preference",
                );
                if (isThemePreference(savedPreference)) return savedPreference;

                const legacyTheme = localStorage.getItem("siberizm_theme");
                if (
                    legacyTheme === "dark" ||
                    legacyTheme === "light" ||
                    legacyTheme === "amoled"
                ) {
                    return legacyTheme === "amoled" ? "dark" : legacyTheme;
                }
            } catch {
                // localStorage may be unavailable in some environments.
            }
            return "system";
        });
    const [darkTheme, setDarkThemeState] = useState<DarkTheme>(() => {
        try {
            const savedDarkTheme = localStorage.getItem("antic_dark_theme");
            if (savedDarkTheme === "dark" || savedDarkTheme === "amoled") {
                return savedDarkTheme;
            }
            if (localStorage.getItem("siberizm_theme") === "amoled") {
                return "amoled";
            }
        } catch {
            // localStorage may be unavailable in some environments.
        }
        return "dark";
    });
    const [accentColor, setAccentColorState] = useState(() => {
        try {
            const savedColor = localStorage.getItem("antic_accent_color");
            if (savedColor && isHexColor(savedColor)) return savedColor;
        } catch {
            // localStorage may be unavailable in some environments.
        }
        return DEFAULT_ACCENT;
    });
    const [systemPrefersDark, setSystemPrefersDark] = useState(
        () =>
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches,
    );

    const theme: ThemeMode =
        themePreference === "system"
            ? systemPrefersDark
                ? darkTheme
                : "light"
            : themePreference === "dark"
              ? darkTheme
              : "light";

    const setThemePreference = (preference: ThemePreference) => {
        setThemePreferenceState(preference);
        try {
            localStorage.setItem("antic_theme_preference", preference);
        } catch {
            // localStorage may be unavailable in some environments.
        }
    };

    const setDarkTheme = (newTheme: DarkTheme) => {
        setDarkThemeState(newTheme);
        try {
            localStorage.setItem("antic_dark_theme", newTheme);
        } catch {
            // localStorage may be unavailable in some environments.
        }
    };

    const setAccentColor = (color: string) => {
        if (!isHexColor(color)) return;
        setAccentColorState(color);
        try {
            localStorage.setItem("antic_accent_color", color);
        } catch {
            // localStorage may be unavailable in some environments.
        }
    };

    const setTheme = (newTheme: ThemeMode) => {
        if (newTheme === "amoled") {
            setDarkTheme("amoled");
            setThemePreference("dark");
        } else {
            setThemePreference(newTheme);
        }
    };

    const toggleTheme = () => {
        setThemePreference(theme === "light" ? "dark" : "light");
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const updateSystemTheme = (event: MediaQueryListEvent) =>
            setSystemPrefersDark(event.matches);

        setSystemPrefersDark(mediaQuery.matches);
        mediaQuery.addEventListener("change", updateSystemTheme);
        return () =>
            mediaQuery.removeEventListener("change", updateSystemTheme);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute("data-theme", theme);
        root.classList.remove("dark", "light", "amoled");
        root.classList.add(theme);
        applyAccentColor(accentColor, theme);
    }, [theme, accentColor]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                themePreference,
                darkTheme,
                accentColor,
                setThemePreference,
                setDarkTheme,
                setAccentColor,
                setTheme,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
