import { useState, useEffect } from 'react';
import { 
  Github, 
  Star, 
  GitFork, 
  ExternalLink, 
  Search, 
  RefreshCw, 
  Copy, 
  Check 
} from 'lucide-react';
import { GithubRepo, GithubUser } from '../types';
import { fallbackGithubRepos } from '../data/labExperiments';

export const GithubReposSection = () => {
  const [repos, setRepos] = useState<GithubRepo[]>(fallbackGithubRepos);
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [copiedCloneId, setCopiedCloneId] = useState<number | null>(null);

  const fetchGithubData = async () => {
    setLoading(true);
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch('https://api.github.com/users/SiberizmBey'),
        fetch('https://api.github.com/users/SiberizmBey/repos?per_page=100&sort=updated')
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }

      if (reposRes.ok) {
        const reposData = await reposRes.json();
        if (Array.isArray(reposData) && reposData.length > 0) {
          setRepos(reposData);
        }
      }
    } catch (err) {
      console.error('GitHub API fetch failed, using fallback repos:', err);
      setRepos(fallbackGithubRepos);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGithubData();
  }, []);

  const copyCloneCommand = (repo: GithubRepo) => {
    const cloneUrl = repo.clone_url || `${repo.html_url}.git`;
    navigator.clipboard.writeText(`git clone ${cloneUrl}`);
    setCopiedCloneId(repo.id);
    setTimeout(() => {
      setCopiedCloneId(null);
    }, 2000);
  };

  const availableLanguages = Array.from(
    new Set(repos.map((r) => r.language).filter(Boolean) as string[])
  );

  const filteredRepos = repos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLang = selectedLanguage === 'all' || repo.language === selectedLanguage;
    return matchesSearch && matchesLang;
  });

  return (
    <section id="github" className="w-full py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-5">
        
        {/* Section Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-text)] font-mono">
              AÇIK KAYNAK // RESEARCH REPOSITORIES
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Laboratuvar Kod Depoları
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            GitHub üzerinde toplulukla paylaşılan deneysel kütüphaneler, motorlar ve siber araştırma projeleri.
          </p>
        </div>

        {/* GitHub Header Showcase Card */}
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Antic Valley GitHub"
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full border border-[var(--accent)] object-cover shadow-xs"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[var(--bg-inner)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                <Github className="w-5 h-5" />
              </div>
            )}

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  github.com/SiberizmBey
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-mono font-semibold">
                  CANLI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {user?.bio || 'Görünmeyeni kodla, sarsılmazı inşa et.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              id="refresh-github-button"
              onClick={fetchGithubData}
              disabled={loading}
              className="p-2 rounded-full bg-[var(--bg-inner)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-input)] transition-all"
              title="Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[var(--accent)]' : ''}`} />
            </button>
            <a
              id="view-github-profile-link"
              href="https://github.com/SiberizmBey"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] text-xs sm:text-sm font-semibold shadow-xs transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Profili</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          {/* Language filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              id="github-filter-all"
              onClick={() => setSelectedLanguage('all')}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
                selectedLanguage === 'all'
                  ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-semibold shadow-xs'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-card)]'
              }`}
            >
              Tümü ({repos.length})
            </button>
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                id={`github-filter-${lang}`}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  selectedLanguage === lang
                    ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-semibold shadow-xs'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-card)]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[220px] sm:w-64">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="github-search-input"
              type="text"
              placeholder="Depolarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-full bg-[var(--bg-input)] border border-[var(--border-input)] focus:border-[var(--accent)] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors"
            />
          </div>
        </div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              id={`repo-card-${repo.id}`}
              className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] hover:text-[var(--accent)] truncate">
                    <a href={repo.html_url} target="_blank" rel="noreferrer">
                      {repo.name}
                    </a>
                  </h3>
                  {repo.language && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] shrink-0">
                      {repo.language}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                  {repo.description || 'Açıklama belirtilmemiş.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-[var(--text-muted)] font-medium">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-mono">{repo.stargazers_count}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono">{repo.forks_count}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyCloneCommand(repo)}
                    className="p-1.5 rounded-full bg-[var(--bg-inner)] hover:bg-[var(--accent-subtle)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"
                    title="Klonlama Komutunu Kopyala"
                  >
                    {copiedCloneId === repo.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-full bg-[var(--bg-inner)] hover:bg-[var(--accent-subtle)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"
                    title="Depoyu Aç"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
