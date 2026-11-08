import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { HeaderCapsule } from "./components/HeaderCapsule";
import { HeroSection } from "./components/HeroSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { DevelopmentsSection } from "./components/DevelopmentsSection";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { FooterCapsule } from "./components/FooterCapsule";
import { ActiveProjectsDock } from "./components/ActiveProjectsDock";
import { ProjectGalaAnnouncement } from "./components/ProjectGalaAnnouncement";

export default function App() {
    const [activeSection, setActiveSection] = useState<string>("projects");

    const handleNavigate = (sectionId: string) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            const navOffset = 60;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.pageYOffset - navOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["projects", "developments"];
            const scrollPosition = window.scrollY + 120;

            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (
                        scrollPosition >= top &&
                        scrollPosition < top + height
                    ) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const elements = document.querySelectorAll<HTMLElement>(
            ".motion-enter",
        );
        const root = document.documentElement;

        if (!("IntersectionObserver" in window)) {
            elements.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        root.classList.add("motion-ready");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0, rootMargin: "0px" },
        );

        elements.forEach((element) => observer.observe(element));
        return () => {
            observer.disconnect();
            root.classList.remove("motion-ready");
        };
    }, []);

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] capsule-grid selection:bg-[var(--accent)] selection:text-[var(--btn-primary-text)] flex flex-col transition-colors duration-250">
                {/* Top Floating Capsule Navigation Header */}
                <HeaderCapsule
                    activeSection={activeSection}
                    onNavigate={handleNavigate}
                />
                <ActiveProjectsDock />
                <ProjectGalaAnnouncement />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col pb-16 md:pb-0">
                    <HeroSection
                        onExploreProjects={() => handleNavigate("projects")}
                        onExploreDevelopments={() =>
                            handleNavigate("developments")
                        }
                    />
                    <ProjectsSection />
                    <DevelopmentsSection />
                </main>

                <MobileBottomNav
                    activeSection={activeSection}
                    onNavigate={handleNavigate}
                />
                <FooterCapsule onNavigate={handleNavigate} />
            </div>
        </ThemeProvider>
    );
}
