import { useState, useEffect } from 'react';
import {
    X,
    Shield,
    Plus,
    Trash2,
    Edit3,
    Sparkles,
    Calendar,
    Radio,
    ExternalLink,
    Check,
    AlertTriangle,
    LogOut,
    Layers,
    Clock,
    Tag,
    Image as ImageIcon,
    RefreshCw,
    Video,
    Eye,
    FlaskConical,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Project } from '../data/projects';
import { LabDevelopment } from '../types';
import { availableIcons } from '../data/availableIcons';
import { saveProject, deleteProject } from '../services/projectService';
import { ProjectGalaItem, saveGala, deleteGala } from '../services/galaService';
import { saveDevelopment, deleteDevelopment } from '../services/developmentService';

interface AdminPanelModalProps {
    isOpen: boolean;
    onClose: () => void;
    allProjects: Project[];
    allGalas: ProjectGalaItem[];
    allDevelopments?: LabDevelopment[];
}

export const AdminPanelModal = ({
    isOpen,
    onClose,
    allProjects,
    allGalas,
    allDevelopments = [],
}: AdminPanelModalProps) => {
    const { isAdmin, authError, loginWithMasterKey, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'projects' | 'developments' | 'galas' | 'icons'>('projects');
    const [masterKeyInput, setMasterKeyInput] = useState<string>('');
    const [confirmDeleteProjectId, setConfirmDeleteProjectId] = useState<string | null>(null);
    const [confirmDeleteGalaId, setConfirmDeleteGalaId] = useState<string | null>(null);
    const [confirmDeleteDevId, setConfirmDeleteDevId] = useState<string | null>(null);

    // Development Form State
    const [devId, setDevId] = useState<string>('');
    const [devTitle, setDevTitle] = useState<string>('');
    const [devCategory, setDevCategory] = useState<string>('Antic Valley');
    const [devType, setDevType] = useState<'Milestone' | 'Benchmark' | 'Release' | 'Research'>('Milestone');
    const [devBadge, setDevBadge] = useState<string>('İYİLEŞTİRME');
    const [devDate, setDevDate] = useState<string>('');
    const [devSummary, setDevSummary] = useState<string>('');
    const [devHighlightInput, setDevHighlightInput] = useState<string>('');
    const [devHighlights, setDevHighlights] = useState<string[]>([]);
    const [isSubmittingDev, setIsSubmittingDev] = useState<boolean>(false);
    const [devSuccessMsg, setDevSuccessMsg] = useState<string | null>(null);

    // Project Form State
    const [projectId, setProjectId] = useState<string>('');
    const [projectName, setProjectName] = useState<string>('');
    const [projectLogo, setProjectLogo] = useState<string>('/assets/img/anticvalley.png');
    const [projectCategory, setProjectCategory] = useState<string>('Güvenlik');
    const [projectStatus, setProjectStatus] = useState<string>('Geliştiriliyor');
    const [projectLifecycle, setProjectLifecycle] = useState<'active' | 'transitioning' | 'paused'>('active');
    const [projectDescription, setProjectDescription] = useState<string>('');
    const [projectDetails, setProjectDetails] = useState<string>('');
    const [projectPlatform, setProjectPlatform] = useState<string>('Electron masaüstü uygulaması');
    const [highlightInput, setHighlightInput] = useState<string>('');
    const [highlights, setHighlights] = useState<string[]>([]);
    const [safetyNotice, setSafetyNotice] = useState<string>('');
    const [isSubmittingProject, setIsSubmittingProject] = useState<boolean>(false);
    const [projectSuccessMsg, setProjectSuccessMsg] = useState<string | null>(null);

    // Project Gala Integration Form State ("Galayla birlikte göster")
    const [projectWithGala, setProjectWithGala] = useState<boolean>(false);
    const [projectGalaStartsAt, setProjectGalaStartsAt] = useState<string>('');
    const [projectGalaEndsAt, setProjectGalaEndsAt] = useState<string>('');
    const [projectGalaYoutubeUrl, setProjectGalaYoutubeUrl] = useState<string>('');
    const [projectGalaDescription, setProjectGalaDescription] = useState<string>('');

    // Gala Form State
    const [galaId, setGalaId] = useState<string>('');
    const [galaProjectId, setGalaProjectId] = useState<string>('');
    const [galaStartsAt, setGalaStartsAt] = useState<string>('');
    const [galaEndsAt, setGalaEndsAt] = useState<string>('');
    const [galaYoutubeUrl, setGalaYoutubeUrl] = useState<string>('');
    const [galaDescription, setGalaDescription] = useState<string>('');
    const [galaStatus, setGalaStatus] = useState<'scheduled' | 'live' | 'completed' | 'cancelled'>('scheduled');
    const [isSubmittingGala, setIsSubmittingGala] = useState<boolean>(false);
    const [galaSuccessMsg, setGalaSuccessMsg] = useState<string | null>(null);

    // Initialize default gala project
    useEffect(() => {
        if (allProjects.length > 0 && !galaProjectId) {
            setGalaProjectId(allProjects[0].id);
        }
    }, [allProjects, galaProjectId]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Helper: auto-generate slug
    const handleNameChange = (val: string) => {
        setProjectName(val);
        if (!projectId || projectId === projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
            const slug = val
                .toLowerCase()
                .trim()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            setProjectId(slug);
        }
    };

    // Add Highlight
    const addHighlight = () => {
        if (highlightInput.trim() && !highlights.includes(highlightInput.trim())) {
            setHighlights([...highlights, highlightInput.trim()]);
            setHighlightInput('');
        }
    };

    const removeHighlight = (index: number) => {
        setHighlights(highlights.filter((_, i) => i !== index));
    };

    // Submit Project
    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId.trim() || !projectName.trim()) return;

        setIsSubmittingProject(true);
        setProjectSuccessMsg(null);

        try {
            const galaStartsDate = projectWithGala && projectGalaStartsAt
                ? new Date(projectGalaStartsAt).toISOString()
                : undefined;
            const galaEndsDate = projectWithGala && projectGalaEndsAt
                ? new Date(projectGalaEndsAt).toISOString()
                : undefined;
            const generatedGalaId = projectWithGala
                ? `gala-${projectId.trim()}`
                : undefined;

            const projectToSave: Project = {
                id: projectId.trim(),
                name: projectName.trim(),
                logo: projectLogo.trim(),
                category: projectCategory.trim(),
                status: projectWithGala ? 'Gala Bekleniyor' : projectStatus.trim(),
                lifecycle: projectLifecycle,
                description: projectDescription.trim() || 'Açıklama belirtilmedi.',
                details: projectDetails.trim() || projectDescription.trim(),
                platform: projectPlatform.trim(),
                highlights: highlights.length > 0 ? highlights : ['Deneysel İnovasyon'],
                safetyNotice: safetyNotice.trim() || undefined,
                hideUntilGala: projectWithGala,
                galaStartsAt: galaStartsDate,
                galaId: generatedGalaId,
            };

            await saveProject(projectToSave);

            // Automatically create & schedule matching gala if "Galayla birlikte göster" is checked
            if (projectWithGala && galaStartsDate) {
                const startsTimestamp = Date.parse(galaStartsDate);
                const isLiveNow = !Number.isNaN(startsTimestamp) && Date.now() >= startsTimestamp;
                const galaToSave: ProjectGalaItem = {
                    id: generatedGalaId!,
                    projectId: projectId.trim(),
                    projectTitle: projectName.trim(),
                    startsAt: galaStartsDate,
                    endsAt: galaEndsDate,
                    youtubeLiveUrl: projectGalaYoutubeUrl.trim() || undefined,
                    description: projectGalaDescription.trim() || `${projectName.trim()} resmi lansman galası!`,
                    status: isLiveNow ? 'live' : 'scheduled',
                };
                await saveGala(galaToSave);
            }

            setProjectSuccessMsg(
                projectWithGala
                    ? `"${projectName}" projesi ve canlı galası başarıyla planlandı! Gala başlayana kadar ana sayfada gizlenecektir.`
                    : `"${projectName}" projesi başarıyla Firestore'a kaydedildi ve yayına alındı!`
            );
            setTimeout(() => setProjectSuccessMsg(null), 4000);

            // Reset form
            setProjectId('');
            setProjectName('');
            setProjectDescription('');
            setProjectDetails('');
            setHighlights([]);
            setSafetyNotice('');
            setProjectWithGala(false);
            setProjectGalaStartsAt('');
            setProjectGalaEndsAt('');
            setProjectGalaYoutubeUrl('');
            setProjectGalaDescription('');
        } catch (err) {
            console.error('Failed to save project:', err);
        } finally {
            setIsSubmittingProject(false);
        }
    };

    // Populate for editing
    const handleEditProject = (p: Project) => {
        setProjectId(p.id);
        setProjectName(p.name);
        setProjectLogo(p.logo);
        setProjectCategory(p.category);
        setProjectStatus(p.status);
        setProjectLifecycle(p.lifecycle);
        setProjectDescription(p.description);
        setProjectDetails(p.details);
        setProjectPlatform(p.platform);
        setHighlights(p.highlights || []);
        setSafetyNotice(p.safetyNotice || '');

        setProjectWithGala(p.hideUntilGala === true);
        if (p.galaStartsAt) {
            const dateObj = new Date(p.galaStartsAt);
            if (!Number.isNaN(dateObj.getTime())) {
                dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
                setProjectGalaStartsAt(dateObj.toISOString().slice(0, 16));
            }
        } else {
            setProjectGalaStartsAt('');
        }

        const existingGala = allGalas.find((g) => g.projectId === p.id);
        if (existingGala) {
            setProjectGalaYoutubeUrl(existingGala.youtubeLiveUrl || '');
            setProjectGalaDescription(existingGala.description || '');
        } else {
            setProjectGalaYoutubeUrl('');
            setProjectGalaDescription('');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Delete Project
    const handleDeleteProject = async (id: string, name: string) => {
        try {
            await deleteProject(id);
            setConfirmDeleteProjectId(null);
            setProjectSuccessMsg(`"${name}" projesi silindi.`);
            setTimeout(() => setProjectSuccessMsg(null), 3000);
        } catch (err) {
            console.error('Failed to delete project:', err);
        }
    };

    // Date Shortcuts for Gala
    const setGalaTimeToNow = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setGalaStartsAt(now.toISOString().slice(0, 16));
        setGalaStatus('live');
    };

    const setGalaTimeInOneHour = () => {
        const later = new Date(Date.now() + 60 * 60 * 1000);
        later.setMinutes(later.getMinutes() - later.getTimezoneOffset());
        setGalaStartsAt(later.toISOString().slice(0, 16));
        setGalaStatus('scheduled');
    };

    const setGalaTimeTonight = () => {
        const tonight = new Date();
        tonight.setHours(20, 0, 0, 0);
        if (tonight.getTime() < Date.now()) {
            tonight.setDate(tonight.getDate() + 1);
        }
        tonight.setMinutes(tonight.getMinutes() - tonight.getTimezoneOffset());
        setGalaStartsAt(tonight.toISOString().slice(0, 16));
        setGalaStatus('scheduled');
    };

    // Submit Gala
    const handleGalaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!galaProjectId || !galaStartsAt) return;

        setIsSubmittingGala(true);
        setGalaSuccessMsg(null);

        try {
            const selectedProj = allProjects.find((p) => p.id === galaProjectId);
            const targetId = galaId || `gala-${galaProjectId}-${Date.now().toString(36)}`;
            
            // Format dates with timezone
            const startDateObj = new Date(galaStartsAt);
            const endDateObj = galaEndsAt ? new Date(galaEndsAt) : undefined;

            const galaToSave: ProjectGalaItem = {
                id: targetId,
                projectId: galaProjectId,
                projectTitle: selectedProj?.name || galaProjectId,
                startsAt: startDateObj.toISOString(),
                endsAt: endDateObj ? endDateObj.toISOString() : undefined,
                youtubeLiveUrl: galaYoutubeUrl.trim() || undefined,
                description: galaDescription.trim() || undefined,
                status: galaStatus,
            };

            await saveGala(galaToSave);
            setGalaSuccessMsg(`"${selectedProj?.name || galaProjectId}" galası başarıyla kaydedildi!`);
            setTimeout(() => setGalaSuccessMsg(null), 4000);

            // Reset form
            setGalaId('');
            setGalaStartsAt('');
            setGalaEndsAt('');
            setGalaYoutubeUrl('');
            setGalaDescription('');
            setGalaStatus('scheduled');
        } catch (err) {
            console.error('Failed to save gala:', err);
        } finally {
            setIsSubmittingGala(false);
        }
    };

    const handleDeleteGala = async (id: string, title: string) => {
        try {
            await deleteGala(id);
            setConfirmDeleteGalaId(null);
            setGalaSuccessMsg(`"${title}" galası silindi.`);
            setTimeout(() => setGalaSuccessMsg(null), 3000);
        } catch (err) {
            console.error('Failed to delete gala:', err);
        }
    };

    // Helper: Turkish date format for today
    const getTodayTurkishDate = () => {
        const now = new Date();
        const day = now.getDate();
        const monthNames = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        const month = monthNames[now.getMonth()];
        const year = now.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Highlights for Developments
    const addDevHighlight = () => {
        if (devHighlightInput.trim() && !devHighlights.includes(devHighlightInput.trim())) {
            setDevHighlights([...devHighlights, devHighlightInput.trim()]);
            setDevHighlightInput('');
        }
    };

    const removeDevHighlight = (index: number) => {
        setDevHighlights(devHighlights.filter((_, i) => i !== index));
    };

    // Submit Development
    const handleDevSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!devTitle.trim() || !devSummary.trim()) return;

        setIsSubmittingDev(true);
        setDevSuccessMsg(null);

        try {
            const finalDate = devDate.trim() || getTodayTurkishDate();
            const targetId = devId.trim() || `dev-${Date.now().toString(36)}`;

            const devToSave: LabDevelopment = {
                id: targetId,
                date: finalDate,
                title: devTitle.trim(),
                category: devCategory.trim() || 'Antic Valley',
                type: devType,
                badge: devBadge.trim() || 'İYİLEŞTİRME',
                summary: devSummary.trim(),
                highlights: devHighlights.length > 0 ? devHighlights : ['Sistem ve altyapı güncellendi'],
                createdAt: new Date().toISOString(),
            };

            // Instant optimistic update (0ms delay) + parallel Firestore sync
            saveDevelopment(devToSave);
            setDevSuccessMsg(`"${devTitle}" gelişmesi başarıyla yayınlandı!`);
            setTimeout(() => setDevSuccessMsg(null), 4000);

            // Reset form immediately
            setDevId('');
            setDevTitle('');
            setDevSummary('');
            setDevHighlights([]);
            setDevDate('');
            setDevBadge('İYİLEŞTİRME');
        } catch (err) {
            console.error('Failed to save development:', err);
        } finally {
            setIsSubmittingDev(false);
        }
    };

    const handleEditDev = (d: LabDevelopment) => {
        setDevId(d.id);
        setDevTitle(d.title);
        setDevCategory(d.category);
        setDevType(d.type);
        setDevBadge(d.badge);
        setDevDate(d.date);
        setDevSummary(d.summary);
        setDevHighlights(d.highlights || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteDev = async (id: string, title: string) => {
        try {
            await deleteDevelopment(id);
            setConfirmDeleteDevId(null);
            setDevSuccessMsg(`"${title}" gelişmesi silindi.`);
            setTimeout(() => setDevSuccessMsg(null), 3000);
        } catch (err) {
            console.error('Failed to delete development:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[var(--bg-modal)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden text-[var(--text-primary)]">
                
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-card)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--accent)] shadow-xs">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                                    Antic Labs // Yönetim Paneli
                                </h2>
                                {isAdmin && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                                        YETKİLİ
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-[var(--text-secondary)]">
                                Proje yayınlama, görsel ikon seçimi ve otomatik canlı gala yönetimi
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <button
                                onClick={logout}
                                title="Çıkış Yap"
                                className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-xs flex items-center gap-1.5"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Çıkış</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-[var(--bg-inner)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-input)] transition-all"
                            aria-label="Kapat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    
                    {/* Non-Admin Login Screen */}
                    {!isAdmin ? (
                        <div className="py-10 px-4 text-center max-w-md mx-auto space-y-5">
                            <div className="w-16 h-16 rounded-3xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] mx-auto flex items-center justify-center text-[var(--accent)]">
                                <Shield className="w-8 h-8" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                                    Yetkili Laboratuvar Girişi
                                </h3>
                                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                                    Bu yönetim paneli yalnızca yetkili sistem kurucusuna tahsis edilmiştir.
                                </p>
                            </div>

                            {authError && (
                                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 text-left">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{authError}</span>
                                </div>
                            )}

                            {/* Master Key Direct Passcode Form */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    loginWithMasterKey(masterKeyInput);
                                }}
                                className="space-y-2.5 text-left"
                            >
                                <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                                    Sistem Erişim Anahtarı
                                </label>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <input
                                        type="password"
                                        placeholder="Erişim anahtarını girin..."
                                        value={masterKeyInput}
                                        onChange={(e) => setMasterKeyInput(e.target.value)}
                                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)] font-mono"
                                    />
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-xl bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] font-semibold text-xs sm:text-sm transition-all cursor-pointer shrink-0 shadow-xs"
                                    >
                                        Giriş Yap
                                    </button>
                                </div>
                            </form>

                            <p className="text-[11px] text-[var(--text-muted)] font-mono">
                                Gizli klavye kombosu ve master anahtar koruması altındadır.
                            </p>
                        </div>
                    ) : (
                        /* Logged in Admin Interface */
                        <div className="space-y-6">
                            
                            {/* Navigation Tabs */}
                            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('projects')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                                        activeTab === 'projects'
                                            ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inner)]'
                                    }`}
                                >
                                    <Layers className="w-4 h-4" />
                                    <span>Projeler & Yayınla</span>
                                    <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-[10px] font-mono">
                                        {allProjects.length}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('developments')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                                        activeTab === 'developments'
                                            ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inner)]'
                                    }`}
                                >
                                    <FlaskConical className="w-4 h-4" />
                                    <span>Gelişmeler & Notlar</span>
                                    <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-[10px] font-mono">
                                        {allDevelopments.length}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('galas')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                                        activeTab === 'galas'
                                            ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inner)]'
                                    }`}
                                >
                                    <Radio className="w-4 h-4" />
                                    <span>Gala & Canlı Lansman</span>
                                    <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-[10px] font-mono">
                                        {allGalas.length}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('icons')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                                        activeTab === 'icons'
                                            ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inner)]'
                                    }`}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span>İkon Havuzu</span>
                                    <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-[10px] font-mono">
                                        {availableIcons.length}
                                    </span>
                                </button>
                            </div>

                            {/* TAB 1: PROJECTS */}
                            {activeTab === 'projects' && (
                                <div className="space-y-6">
                                    
                                    {projectSuccessMsg && (
                                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                                            <Check className="w-4 h-4 shrink-0" />
                                            <span>{projectSuccessMsg}</span>
                                        </div>
                                    )}

                                    {/* Project Form */}
                                    <form onSubmit={handleProjectSubmit} className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-4">
                                        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                                                <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                                                    {projectId && allProjects.some(p => p.id === projectId) ? 'Projeyi Düzenle' : 'Yeni Proje Yayınla'}
                                                </h3>
                                            </div>
                                            <span className="text-[11px] font-mono text-[var(--text-muted)]">
                                                Firestore Veritabanı
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                    Proje Adı *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Örn: SiberKalkan"
                                                    value={projectName}
                                                    onChange={(e) => handleNameChange(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                    Benzersiz ID / Slug *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Örn: siberkalkan"
                                                    value={projectId}
                                                    onChange={(e) => setProjectId(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)] font-mono"
                                                />
                                            </div>
                                        </div>

                                        {/* Icon Picker */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                                                    Proje İkonu (public/assets/img/ içinden seçin) *
                                                </label>
                                                <span className="text-[11px] text-[var(--text-muted)] font-mono">
                                                    Seçili: {projectLogo}
                                                </span>
                                            </div>

                                            {/* Visual Icon Grid */}
                                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2 rounded-2xl bg-[var(--bg-inner)] border border-[var(--border-input)] max-h-48 overflow-y-auto">
                                                {availableIcons.map((icon) => {
                                                    const isSelected = projectLogo === icon.path;
                                                    return (
                                                        <button
                                                            key={icon.id}
                                                            type="button"
                                                            onClick={() => setProjectLogo(icon.path)}
                                                            className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center border ${
                                                                isSelected
                                                                    ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent)] shadow-xs'
                                                                    : 'bg-[var(--bg-card)] border-transparent hover:border-[var(--border-hover)] text-[var(--text-secondary)]'
                                                            }`}
                                                        >
                                                            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center p-1 bg-black/20">
                                                                <img
                                                                    src={icon.path}
                                                                    alt={icon.name}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </div>
                                                            <span className="text-[10px] font-medium truncate w-full">
                                                                {icon.name}
                                                            </span>
                                                            {isSelected && (
                                                                <span className="w-3 h-3 rounded-full bg-[var(--accent)] text-[var(--btn-primary-text)] flex items-center justify-center text-[8px] font-bold">
                                                                    ✓
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Custom Icon Path Input */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={projectLogo}
                                                    onChange={(e) => setProjectLogo(e.target.value)}
                                                    placeholder="/assets/img/projeniz.png"
                                                    className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs text-[var(--text-primary)] font-mono"
                                                />
                                                <div className="w-8 h-8 rounded-lg bg-[var(--bg-inner)] border border-[var(--border-input)] flex items-center justify-center p-1 shrink-0">
                                                    <img src={projectLogo} alt="Önizleme" className="w-full h-full object-contain" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                    Kategori *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={projectCategory}
                                                    onChange={(e) => setProjectCategory(e.target.value)}
                                                    placeholder="Güvenlik, Yapay Zeka vb."
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                    Durum *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={projectStatus}
                                                    onChange={(e) => setProjectStatus(e.target.value)}
                                                    placeholder="Geliştiriliyor, Yayında vb."
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                    Yaşam Döngüsü *
                                                </label>
                                                <select
                                                    value={projectLifecycle}
                                                    onChange={(e) => setProjectLifecycle(e.target.value as any)}
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                                >
                                                    <option value="active">Aktif (Geliştiriliyor / Canlı)</option>
                                                    <option value="transitioning">Devrediliyor (Transitioning)</option>
                                                    <option value="paused">Askıda (Paused)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                Hedef Platform *
                                            </label>
                                            <input
                                                type="text"
                                                value={projectPlatform}
                                                onChange={(e) => setProjectPlatform(e.target.value)}
                                                placeholder="Örn: Electron masaüstü uygulaması, Web Servisi"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                Kısa Tanıtım Açıklaması *
                                            </label>
                                            <textarea
                                                rows={2}
                                                required
                                                value={projectDescription}
                                                onChange={(e) => setProjectDescription(e.target.value)}
                                                placeholder="Projenin ana amacını ve sunduğu çözümü özetleyin..."
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                Genişletilmiş Detaylar (Modal İçeriği)
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={projectDetails}
                                                onChange={(e) => setProjectDetails(e.target.value)}
                                                placeholder="Mimari detaylar, teknolojik altyapı ve arka plan..."
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                            />
                                        </div>

                                        {/* Highlights Pill Input */}
                                        <div className="space-y-2">
                                            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                                                Öne Çıkan Özellikler / Etiketler
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={highlightInput}
                                                    onChange={(e) => setHighlightInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addHighlight();
                                                        }
                                                    }}
                                                    placeholder="Özellik yazıp Enter'a veya Ekle'ye basın..."
                                                    className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addHighlight}
                                                    className="px-4 py-2 rounded-xl bg-[var(--bg-inner)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-input)] text-xs font-semibold"
                                                >
                                                    Ekle
                                                </button>
                                            </div>

                                            {highlights.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {highlights.map((h, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] text-xs font-medium"
                                                        >
                                                            <span>{h}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeHighlight(idx)}
                                                                className="hover:text-red-400"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                Güvenlik Uyarısı (İsteğe bağlı)
                                            </label>
                                            <input
                                                type="text"
                                                value={safetyNotice}
                                                onChange={(e) => setSafetyNotice(e.target.value)}
                                                placeholder="Örn: Anti-hile korumaları için çevrimdışı deneyin."
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                            />
                                        </div>

                                        {/* Gala Launch Integration Box ("Galayla birlikte göster") */}
                                        <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-inner)] space-y-3">
                                            <label className="flex items-start gap-3 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={projectWithGala}
                                                    onChange={(e) => setProjectWithGala(e.target.checked)}
                                                    className="mt-1 h-4 w-4 rounded border-[var(--border-input)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                                                />
                                                <div>
                                                    <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                                                        <span>Bu Projeyi Gala Lansmanıyla Birlikte Yayınla</span>
                                                        <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold">
                                                            LİVE GALA
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                                                        İşaretlendiğinde, proje <strong>gala başlangıç saatine kadar ana sayfada gizli tutulur</strong>. Saat geldiğinde otomatik olarak sitede yayına girer. Bu sırada Dinamik Ada üzerinde geri sayım ve canlı gala duyurusu yapılır.
                                                    </p>
                                                </div>
                                            </label>

                                            {projectWithGala && (
                                                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {/* Gala Time Shortcuts */}
                                                    <div className="space-y-1.5">
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                                                                Gala Başlangıç Zamanı *
                                                            </label>
                                                            <div className="flex items-center gap-1.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const now = new Date();
                                                                        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                                                                        setProjectGalaStartsAt(now.toISOString().slice(0, 16));
                                                                    }}
                                                                    className="px-2.5 py-1 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent-text)] text-[10px] font-semibold hover:bg-[var(--accent)] hover:text-[var(--btn-primary-text)] transition-all cursor-pointer"
                                                                >
                                                                    🔴 Şimdi Başlat (Canlı)
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const later = new Date(Date.now() + 60 * 60 * 1000);
                                                                        later.setMinutes(later.getMinutes() - later.getTimezoneOffset());
                                                                        setProjectGalaStartsAt(later.toISOString().slice(0, 16));
                                                                    }}
                                                                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] text-[var(--text-secondary)] text-[10px] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                                                                >
                                                                    +1 Saat Sonra
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const tonight = new Date();
                                                                        tonight.setHours(20, 0, 0, 0);
                                                                        if (tonight.getTime() < Date.now()) {
                                                                            tonight.setDate(tonight.getDate() + 1);
                                                                        }
                                                                        tonight.setMinutes(tonight.getMinutes() - tonight.getTimezoneOffset());
                                                                        setProjectGalaStartsAt(tonight.toISOString().slice(0, 16));
                                                                    }}
                                                                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] text-[var(--text-secondary)] text-[10px] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                                                                >
                                                                    Bu Akşam 20:00
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <input
                                                                type="datetime-local"
                                                                required={projectWithGala}
                                                                value={projectGalaStartsAt}
                                                                onChange={(e) => setProjectGalaStartsAt(e.target.value)}
                                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)] font-mono"
                                                            />
                                                            <input
                                                                type="datetime-local"
                                                                value={projectGalaEndsAt}
                                                                onChange={(e) => setProjectGalaEndsAt(e.target.value)}
                                                                placeholder="Bitiş Zamanı (İsteğe bağlı)"
                                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)] font-mono"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* YouTube Live stream url */}
                                                    <div>
                                                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center gap-1.5">
                                                            <Video className="w-3.5 h-3.5 text-red-500" />
                                                            <span>Gala Canlı Yayın Linki (YouTube - İsteğe bağlı)</span>
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={projectGalaYoutubeUrl}
                                                            onChange={(e) => setProjectGalaYoutubeUrl(e.target.value)}
                                                            placeholder="https://www.youtube.com/live/VIDEO_ID veya https://youtu.be/..."
                                                            className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs text-[var(--text-primary)] font-mono"
                                                        />
                                                    </div>

                                                    {/* Gala description */}
                                                    <div>
                                                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                                                            Gala Lansman Duyuru Metni
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={projectGalaDescription}
                                                            onChange={(e) => setProjectGalaDescription(e.target.value)}
                                                            placeholder="Örn: Yeni nesil mimarimiz ve ilk açık deneme sürümü canlı yayında!"
                                                            className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2 flex items-center justify-end gap-3">
                                            {projectId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProjectId('');
                                                        setProjectName('');
                                                        setProjectDescription('');
                                                        setProjectDetails('');
                                                        setHighlights([]);
                                                        setSafetyNotice('');
                                                        setProjectWithGala(false);
                                                        setProjectGalaStartsAt('');
                                                        setProjectGalaEndsAt('');
                                                        setProjectGalaYoutubeUrl('');
                                                        setProjectGalaDescription('');
                                                    }}
                                                    className="px-4 py-2.5 rounded-xl text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                                >
                                                    Temizle
                                                </button>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={isSubmittingProject}
                                                className="px-6 py-2.5 rounded-xl bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                            >
                                                {isSubmittingProject ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                                <span>Projeyi Firestore'a Yayınla</span>
                                            </button>
                                        </div>
                                    </form>

                                    {/* Existing Projects List */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                                            Kayıtlı Projeler ({allProjects.length})
                                        </h4>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {allProjects.map((p) => (
                                                <div
                                                    key={p.id}
                                                    className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] flex items-center justify-between gap-3 shadow-xs"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-inner)] border border-[var(--border-subtle)] p-1 shrink-0 flex items-center justify-center">
                                                            <img src={p.logo} alt="" className="w-full h-full object-contain" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h5 className="text-sm font-bold text-[var(--text-primary)] truncate">
                                                                    {p.name}
                                                                </h5>
                                                                {p.hideUntilGala && (
                                                                    <span className="px-1.5 py-0.2 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[9px] font-mono font-bold shrink-0">
                                                                        GALA BEKLİYOR
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
                                                                {p.category} • {p.status}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditProject(p)}
                                                            className="p-2 rounded-xl bg-[var(--bg-inner)] hover:bg-[var(--accent-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent)] border border-[var(--border-input)] transition-all"
                                                            title="Düzenle"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        {confirmDeleteProjectId === p.id ? (
                                                            <div className="flex items-center gap-1 bg-red-500/15 border border-red-500/30 rounded-xl p-1 shrink-0">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteProject(p.id, p.name)}
                                                                    className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                                                                >
                                                                    Sil
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setConfirmDeleteProjectId(null)}
                                                                    className="p-1 rounded-lg text-white/70 hover:text-white text-[11px] cursor-pointer"
                                                                    title="İptal"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirmDeleteProjectId(p.id)}
                                                                className="p-2 rounded-xl bg-[var(--bg-inner)] hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 border border-[var(--border-input)] transition-all cursor-pointer"
                                                                title="Sil"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* TAB: DEVELOPMENTS (Gelişmeler & Günlük Notlar) */}
                            {activeTab === 'developments' && (
                                <div className="space-y-6">
                                    
                                    {devSuccessMsg && (
                                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                                            <Check className="w-4 h-4 shrink-0" />
                                            <span>{devSuccessMsg}</span>
                                        </div>
                                    )}

                                    {/* Development Form */}
                                    <form onSubmit={handleDevSubmit} className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-4">
                                        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                                            <div className="flex items-center gap-2">
                                                <FlaskConical className="w-4 h-4 text-[var(--accent)]" />
                                                <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                                                    {devId ? 'Gelişme Notunu Düzenle' : 'Yeni Günlük Gelişme Yayınla'}
                                                </h3>
                                            </div>
                                            <span className="text-[11px] font-mono text-[var(--text-muted)]">
                                                Günlük Proje Notları
                                            </span>
                                        </div>

                                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                            Laboratuvardaki projeleriniz için yaptığınız günlük güncellemeleri, sürüm notlarını veya araştırma aşamalarını buradan anında yayınlayabilirsiniz.
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                    Gelişme Başlığı *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Örn: Yeni Bellek Optimizasyonu ve Güvenlik Yaması"
                                                    value={devTitle}
                                                    onChange={(e) => setDevTitle(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                                                        Tarih (Türkçe Format) *
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDevDate(getTodayTurkishDate())}
                                                        className="text-[10px] text-[var(--accent-text)] hover:underline font-semibold"
                                                    >
                                                        📅 Bugün ({getTodayTurkishDate()})
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Örn: 8 Kasım 2026"
                                                    value={devDate}
                                                    onChange={(e) => setDevDate(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)] font-mono"
                                                />
                                            </div>
                                        </div>

                                        {/* Category & Project Link */}
                                        <div className="space-y-2">
                                            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                                                Kategori / İlgili Proje (Hızlı seçin veya yazın) *
                                            </label>
                                            
                                            {/* Quick project selectors */}
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {allProjects.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => setDevCategory(p.name)}
                                                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                                                            devCategory.toLowerCase() === p.name.toLowerCase()
                                                                ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent-text)]'
                                                                : 'bg-[var(--bg-inner)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                                        }`}
                                                    >
                                                        <div className="w-3.5 h-3.5 rounded-sm overflow-hidden bg-black/20 p-0.5 shrink-0 flex items-center justify-center">
                                                            <img src={p.logo} alt="" className="w-full h-full object-contain" />
                                                        </div>
                                                        <span>{p.name}</span>
                                                    </button>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => setDevCategory('Antic Valley')}
                                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                                                        devCategory === 'Antic Valley'
                                                            ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent-text)]'
                                                            : 'bg-[var(--bg-inner)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                                    }`}
                                                >
                                                    Antic Valley (Genel)
                                                </button>
                                            </div>

                                            <input
                                                type="text"
                                                required
                                                value={devCategory}
                                                onChange={(e) => setDevCategory(e.target.value)}
                                                placeholder="Örn: Lir → Bellek Modülü veya Koza"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Badge presets */}
                                            <div className="space-y-1.5">
                                                <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                                                    Rozet / Durum Etiketi *
                                                </label>
                                                <div className="flex flex-wrap gap-1.5 pb-1">
                                                    {['İYİLEŞTİRME', 'YENİ SÜRÜM', 'KAPALI TEST', 'GİZLİ GELİŞTİRME', 'ÜRÜN DEVRİ', 'GÜVENLİK'].map((b) => (
                                                        <button
                                                            key={b}
                                                            type="button"
                                                            onClick={() => setDevBadge(b)}
                                                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border transition-all ${
                                                                devBadge === b
                                                                    ? 'bg-[var(--accent)] text-[var(--btn-primary-text)] border-[var(--accent)]'
                                                                    : 'bg-[var(--badge-bg)] text-[var(--badge-text)] border-[var(--badge-border)] hover:border-[var(--accent)]'
                                                            }`}
                                                        >
                                                            {b}
                                                        </button>
                                                    ))}
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={devBadge}
                                                    onChange={(e) => setDevBadge(e.target.value)}
                                                    placeholder="Özel rozet metni yazın..."
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)] uppercase font-mono"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                    Gelişme Türü *
                                                </label>
                                                <select
                                                    value={devType}
                                                    onChange={(e) => setDevType(e.target.value as any)}
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                                >
                                                    <option value="Milestone">Dönüm Noktası (Milestone)</option>
                                                    <option value="Release">Sürüm Yayını (Release)</option>
                                                    <option value="Research">Araştırma / Ar-Ge (Research)</option>
                                                    <option value="Benchmark">Performans & Test (Benchmark)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                Özet Açıklama *
                                            </label>
                                            <textarea
                                                rows={2}
                                                required
                                                value={devSummary}
                                                onChange={(e) => setDevSummary(e.target.value)}
                                                placeholder="Bu gelişmede neler yapıldığını, çözülen problemi veya eklenen yetenekleri özetleyin..."
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                            />
                                        </div>

                                        {/* Highlights list */}
                                        <div className="space-y-2">
                                            <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                                                Önemli Maddeler / Detay Noktaları (İsteğe bağlı)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={devHighlightInput}
                                                    onChange={(e) => setDevHighlightInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addDevHighlight();
                                                        }
                                                    }}
                                                    placeholder="Madde yazıp Enter'a veya Ekle'ye basın..."
                                                    className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addDevHighlight}
                                                    className="px-4 py-2 rounded-xl bg-[var(--bg-inner)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-input)] text-xs font-semibold"
                                                >
                                                    Ekle
                                                </button>
                                            </div>

                                            {devHighlights.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {devHighlights.map((h, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] text-xs font-medium"
                                                        >
                                                            <span>{h}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeDevHighlight(idx)}
                                                                className="hover:text-red-400 font-bold"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2 flex items-center justify-end gap-3">
                                            {devId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDevId('');
                                                        setDevTitle('');
                                                        setDevSummary('');
                                                        setDevHighlights([]);
                                                        setDevDate('');
                                                        setDevBadge('İYİLEŞTİRME');
                                                    }}
                                                    className="px-4 py-2.5 rounded-xl text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                                                >
                                                    Vazgeç
                                                </button>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={isSubmittingDev}
                                                className="px-6 py-2.5 rounded-xl bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                            >
                                                {isSubmittingDev ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <FlaskConical className="w-4 h-4" />
                                                )}
                                                <span>Gelişmeyi Yayınla</span>
                                            </button>
                                        </div>
                                    </form>

                                    {/* Existing Developments List */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                                                Kayıtlı Gelişmeler ({allDevelopments.length})
                                            </h4>
                                            <span className="text-[11px] text-[var(--text-muted)] font-mono">
                                                En yeniden eskiye sıralı
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {allDevelopments.map((d) => (
                                                <div
                                                    key={d.id}
                                                    className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                                                >
                                                    <div className="space-y-1.5 min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                                            <span className="px-2 py-0.5 rounded-full bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] text-[10px] font-mono font-semibold">
                                                                {d.badge}
                                                            </span>
                                                            <span className="font-mono text-[var(--accent-text)] text-[11px] font-bold">
                                                                {d.date}
                                                            </span>
                                                            <span className="text-[var(--border-subtle)]">•</span>
                                                            <span className="text-[var(--text-secondary)] text-xs font-medium">
                                                                {d.category}
                                                            </span>
                                                        </div>

                                                        <h5 className="text-sm font-bold text-[var(--text-primary)]">
                                                            {d.title}
                                                        </h5>

                                                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                                                            {d.summary}
                                                        </p>

                                                        {d.highlights && d.highlights.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                                {d.highlights.slice(0, 3).map((h, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-inner)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                                                                    >
                                                                        {h}
                                                                    </span>
                                                                ))}
                                                                {d.highlights.length > 3 && (
                                                                    <span className="text-[10px] text-[var(--text-muted)] font-mono self-center">
                                                                        +{d.highlights.length - 3} daha
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditDev(d)}
                                                            className="p-2 rounded-xl bg-[var(--bg-inner)] hover:bg-[var(--accent-subtle)] text-[var(--text-secondary)] hover:text-[var(--accent)] border border-[var(--border-input)] transition-all cursor-pointer"
                                                            title="Düzenle"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        {confirmDeleteDevId === d.id ? (
                                                            <div className="flex items-center gap-1 bg-red-500/15 border border-red-500/30 rounded-xl p-1 shrink-0">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteDev(d.id, d.title)}
                                                                    className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                                                                >
                                                                    Sil
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setConfirmDeleteDevId(null)}
                                                                    className="p-1 rounded-lg text-white/70 hover:text-white text-[11px] cursor-pointer"
                                                                    title="İptal"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirmDeleteDevId(d.id)}
                                                                className="p-2 rounded-xl bg-[var(--bg-inner)] hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 border border-[var(--border-input)] transition-all cursor-pointer"
                                                                title="Gelişmeyi Sil"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* TAB 2: GALAS */}
                            {activeTab === 'galas' && (
                                <div className="space-y-6">
                                    
                                    {galaSuccessMsg && (
                                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                                            <Check className="w-4 h-4 shrink-0" />
                                            <span>{galaSuccessMsg}</span>
                                        </div>
                                    )}

                                    {/* Gala Form */}
                                    <form onSubmit={handleGalaSubmit} className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-4">
                                        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                                            <div className="flex items-center gap-2">
                                                <Radio className="w-4 h-4 text-[var(--accent)]" />
                                                <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                                                    Yeni Proje Galası / Canlı Lansman Planla
                                                </h3>
                                            </div>
                                            <span className="text-[11px] font-mono text-[var(--text-muted)]">
                                                Otomatik Tetikleme
                                            </span>
                                        </div>

                                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                            Belirlediğiniz tarih ve saat geldiğinde, sitede tüm ziyaretçilere <strong>"Şu projenin galası yapılıyor! Hemen ön izlemeye gelin"</strong> canlı duyuru kapsülü otomatik olarak açılır.
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                    Tanıtılacak Proje *
                                                </label>
                                                <select
                                                    value={galaProjectId}
                                                    onChange={(e) => setGalaProjectId(e.target.value)}
                                                    required
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                                >
                                                    {allProjects.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.name} ({p.category})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                    Gala Durumu *
                                                </label>
                                                <select
                                                    value={galaStatus}
                                                    onChange={(e) => setGalaStatus(e.target.value as any)}
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                                >
                                                    <option value="scheduled">Planlandı (Scheduled)</option>
                                                    <option value="live">Şu Anda Canlıda (Live)</option>
                                                    <option value="completed">Tamamlandı (Completed)</option>
                                                    <option value="cancelled">İptal Edildi</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Date inputs with Shortcuts */}
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                                                    Gala Başlangıç Zamanı *
                                                </label>
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={setGalaTimeToNow}
                                                        className="px-2.5 py-1 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent-text)] text-[10px] font-semibold hover:bg-[var(--accent)] hover:text-[var(--btn-primary-text)] transition-all"
                                                    >
                                                        🔴 Şimdi Başlat (Canlı)
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={setGalaTimeInOneHour}
                                                        className="px-2.5 py-1 rounded-lg bg-[var(--bg-inner)] text-[var(--text-secondary)] text-[10px] hover:text-[var(--text-primary)] transition-all"
                                                    >
                                                        +1 Saat Sonra
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={setGalaTimeTonight}
                                                        className="px-2.5 py-1 rounded-lg bg-[var(--bg-inner)] text-[var(--text-secondary)] text-[10px] hover:text-[var(--text-primary)] transition-all"
                                                    >
                                                        Bu Akşam 20:00
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <input
                                                    type="datetime-local"
                                                    required
                                                    value={galaStartsAt}
                                                    onChange={(e) => setGalaStartsAt(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)] font-mono"
                                                />

                                                <input
                                                    type="datetime-local"
                                                    value={galaEndsAt}
                                                    onChange={(e) => setGalaEndsAt(e.target.value)}
                                                    placeholder="Bitiş zamanı (İsteğe bağlı)"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)] font-mono"
                                                />
                                            </div>
                                        </div>

                                        {/* YouTube Live Link */}
                                        <div>
                                            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 flex items-center gap-1.5">
                                                <Video className="w-3.5 h-3.5 text-red-500" />
                                                <span>YouTube Canlı Yayın Linki (İsteğe bağlı)</span>
                                            </label>
                                            <input
                                                type="url"
                                                value={galaYoutubeUrl}
                                                onChange={(e) => setGalaYoutubeUrl(e.target.value)}
                                                placeholder="https://www.youtube.com/live/VIDEO_ID veya https://youtu.be/..."
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)] font-mono"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                                                Gala Lansman Mesajı
                                            </label>
                                            <input
                                                type="text"
                                                value={galaDescription}
                                                onChange={(e) => setGalaDescription(e.target.value)}
                                                placeholder="Örn: Yeni nesil mimarimiz ve ilk açık deneme sürümü canlı yayında!"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                                            />
                                        </div>

                                        <div className="pt-2 flex items-center justify-end gap-3">
                                            <button
                                                type="submit"
                                                disabled={isSubmittingGala}
                                                className="px-6 py-2.5 rounded-xl bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                            >
                                                {isSubmittingGala ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Radio className="w-4 h-4" />
                                                )}
                                                <span>Galayı Kaydet & Otomatik Yayına Al</span>
                                            </button>
                                        </div>
                                    </form>

                                    {/* Existing Galas List */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                                            Kayıtlı Galalar ({allGalas.length})
                                        </h4>

                                        {allGalas.length === 0 ? (
                                            <p className="text-xs text-[var(--text-muted)] italic py-3">
                                                Henüz planlanmış veya kayıtlı bir gala bulunmuyor. Yukarıdaki formdan ekleyebilirsiniz.
                                            </p>
                                        ) : (
                                            <div className="space-y-2.5">
                                                {allGalas.map((g) => {
                                                    const startDate = new Date(g.startsAt);
                                                    const isLiveNow = Date.now() >= startDate.getTime() && (!g.endsAt || Date.now() < new Date(g.endsAt).getTime());
                                                    
                                                    return (
                                                        <div
                                                            key={g.id}
                                                            className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                                                        >
                                                            <div className="space-y-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <h5 className="text-sm font-bold text-[var(--text-primary)]">
                                                                        {g.projectTitle}
                                                                    </h5>
                                                                    {isLiveNow ? (
                                                                        <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold flex items-center gap-1">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                                                            CANLI YAYINDA
                                                                        </span>
                                                                    ) : (
                                                                        <span className="px-2 py-0.5 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-[10px] font-mono font-semibold">
                                                                            PLANLANDI
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <p className="text-xs text-[var(--text-secondary)] font-mono">
                                                                    Başlangıç: {startDate.toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}
                                                                </p>

                                                                {g.youtubeLiveUrl && (
                                                                    <a
                                                                        href={g.youtubeLiveUrl}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="text-xs text-red-400 hover:underline flex items-center gap-1 font-mono"
                                                                    >
                                                                        <Video className="w-3.5 h-3.5" />
                                                                        <span>{g.youtubeLiveUrl}</span>
                                                                        <ExternalLink className="w-3 h-3" />
                                                                    </a>
                                                                )}
                                                            </div>

                                                                {confirmDeleteGalaId === g.id ? (
                                                                    <div className="flex items-center gap-1 bg-red-500/15 border border-red-500/30 rounded-xl p-1 shrink-0">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleDeleteGala(g.id, g.projectTitle)}
                                                                            className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                                                                        >
                                                                            Sil
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setConfirmDeleteGalaId(null)}
                                                                            className="p-1 rounded-lg text-white/70 hover:text-white text-[11px] cursor-pointer"
                                                                            title="İptal"
                                                                        >
                                                                            <X className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setConfirmDeleteGalaId(g.id)}
                                                                        className="p-2 rounded-xl bg-[var(--bg-inner)] hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 border border-[var(--border-input)] transition-all cursor-pointer"
                                                                        title="Galayı Sil"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}

                            {/* TAB 3: ICONS REPOSITORY */}
                            {activeTab === 'icons' && (
                                <div className="space-y-5">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-[var(--text-primary)]">
                                            Kayıtlı İkon & Logo Kütüphanesi
                                        </h4>
                                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                            Tüm ikonlar doğrudan <code>public/assets/img/</code> klasöründe yer alır. Yeni ikon eklemek istediğinizde dosyayı bu klasöre bırakabilir ve proje yayınlarken doğrudan yolunu belirtebilirsiniz.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {availableIcons.map((icon) => (
                                            <div
                                                key={icon.id}
                                                className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] flex items-center gap-3.5 shadow-xs"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-[var(--bg-inner)] border border-[var(--border-subtle)] p-1.5 shrink-0 flex items-center justify-center">
                                                    <img src={icon.path} alt={icon.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h5 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
                                                        {icon.name}
                                                    </h5>
                                                    <p className="text-[10px] text-[var(--text-muted)] truncate mb-1">
                                                        {icon.description}
                                                    </p>
                                                    <code className="text-[10px] font-mono text-[var(--accent-text)] bg-[var(--bg-inner)] px-1.5 py-0.5 rounded-md truncate block">
                                                        {icon.path}
                                                    </code>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};
