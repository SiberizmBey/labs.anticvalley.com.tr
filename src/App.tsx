import { useState, useEffect, useRef, useMemo } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { HeaderCapsule } from "./components/HeaderCapsule";
import { HeroSection } from "./components/HeroSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { DevelopmentsSection } from "./components/DevelopmentsSection";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { FooterCapsule } from "./components/FooterCapsule";
import { ActiveProjectsDock } from "./components/ActiveProjectsDock";
import { AdminPanelModal } from "./components/AdminPanelModal";
import { Project, projects as initialProjects } from "./data/projects";
import { LabDevelopment } from "./types";
import { subscribeProjects } from "./services/projectService";
import { ProjectGalaItem, subscribeGalas } from "./services/galaService";
import { subscribeDevelopments, getInitialDevelopments } from "./services/developmentService";

export default function App() {
    const [activeSection, setActiveSection] = useState<string>("projects");
    const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [galas, setGalas] = useState<ProjectGalaItem[]>([]);
    const [developments, setDevelopments] = useState<LabDevelopment[]>(getInitialDevelopments);
    const [now, setNow] = useState<number>(() => Date.now());
    const keyBufferRef = useRef<string>("");

    // Timer to automatically publish projects when their gala starts
    useEffect(() => {
        const timer = window.setInterval(() => {
            setNow(Date.now());
        }, 5000);
        return () => window.clearInterval(timer);
    }, []);

    // Filter projects for the public homepage: projects awaiting their gala are hidden until gala starts
    const publicProjects = useMemo(() => {
        return projects.filter((project) => {
            if (!project.hideUntilGala || !project.galaStartsAt) return true;
            const startsAt = Date.parse(project.galaStartsAt);
            if (Number.isNaN(startsAt)) return true;

            // Check if matching gala is already live or completed
            const matchingGala = galas.find((g) => g.projectId === project.id);
            if (matchingGala && (matchingGala.status === 'live' || matchingGala.status === 'completed')) {
                return true;
            }

            return now >= startsAt;
        });
    }, [projects, galas, now]);

    // Secret keyboard combo listener: "siberizmbey"
    useEffect(() => {
        const targetSequence = "siberizmbey";

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if active element is input, textarea or contentEditable
            const activeEl = document.activeElement as HTMLElement | null;
            if (
                activeEl &&
                (activeEl.tagName === "INPUT" ||
                    activeEl.tagName === "TEXTAREA" ||
                    activeEl.isContentEditable)
            ) {
                return;
            }

            if (e.key && e.key.length === 1) {
                keyBufferRef.current = (
                    keyBufferRef.current + e.key.toLowerCase()
                ).slice(-targetSequence.length);

                if (keyBufferRef.current === targetSequence) {
                    setAdminModalOpen(true);
                    keyBufferRef.current = "";
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Subscribe to Firestore dynamic projects
    useEffect(() => {
        const unsubscribe = subscribeProjects((updatedProjects) => {
            setProjects(updatedProjects);
        });
        return () => unsubscribe();
    }, []);

    // Subscribe to Firestore dynamic galas
    useEffect(() => {
        const unsubscribe = subscribeGalas((updatedGalas) => {
            setGalas(updatedGalas);
        });
        return () => unsubscribe();
    }, []);

    // Subscribe to Firestore dynamic developments
    useEffect(() => {
        const unsubscribe = subscribeDevelopments((updatedDevs) => {
            setDevelopments(updatedDevs);
        });
        return () => unsubscribe();
    }, []);

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
        <AuthProvider>
            <ThemeProvider>
                <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] capsule-grid selection:bg-[var(--accent)] selection:text-[var(--btn-primary-text)] flex flex-col transition-colors duration-250">
                    {/* Top Floating Capsule Navigation Header with Gala Dynamic Island */}
                    <HeaderCapsule
                        activeSection={activeSection}
                        onNavigate={handleNavigate}
                        galas={galas}
                        projects={projects}
                    />
                    <ActiveProjectsDock projects={publicProjects} />

                    {/* Main Content Area */}
                    <main className="flex-1 flex flex-col pb-16 md:pb-0">
                        <HeroSection
                            onExploreProjects={() => handleNavigate("projects")}
                            onExploreDevelopments={() =>
                                handleNavigate("developments")
                            }
                        />
                        <ProjectsSection projects={publicProjects} />
                        <DevelopmentsSection
                            developments={developments}
                            projects={projects}
                        />
                    </main>

                    <MobileBottomNav
                        activeSection={activeSection}
                        onNavigate={handleNavigate}
                    />
                    <FooterCapsule onNavigate={handleNavigate} />

                    {/* Admin Panel Modal (Activated via secret combo: "siberizmbey") */}
                    <AdminPanelModal
                        isOpen={adminModalOpen}
                        onClose={() => setAdminModalOpen(false)}
                        allProjects={projects}
                        allGalas={galas}
                        allDevelopments={developments}
                    />
                </div>
            </ThemeProvider>
        </AuthProvider>
    );
}
