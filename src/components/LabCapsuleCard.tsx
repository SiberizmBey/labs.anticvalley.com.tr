import { useState } from 'react';
import { 
  ExternalLink,
  Layers,
  Info,
  ChevronRight,
  X,
  Sparkles,
  Activity,
  History,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { LabExperiment } from '../types';
import { LabExperimentSandbox } from './LabExperimentSandbox';

interface LabCapsuleCardProps {
  project?: LabExperiment;
  experiment?: LabExperiment;
}

export const LabCapsuleCard = ({ project, experiment: expProp }: LabCapsuleCardProps) => {
  const experiment = expProp || project;
  if (!experiment) return null;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'overview' | 'sandbox' | 'changelog'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Deneysel':
        return 'bg-[var(--badge-bg)] text-[var(--badge-text)] border-[var(--badge-border)]';
      case 'Prototip':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Alfa':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Canlı':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Önizleme':
        return 'bg-pink-500/15 text-pink-400 border-pink-500/30';
      default:
        return 'bg-[var(--badge-bg)] text-[var(--badge-text)] border-[var(--badge-border)]';
    }
  };

  return (
    <>
      <div 
        id={`lab-card-${experiment.id}`}
        className="group relative rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] p-5 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md"
      >
        <div>
          {/* Project category and current status */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">
                {experiment.category}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${getStatusColor(experiment.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {experiment.status}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              {experiment.date}
            </span>
          </div>

          {/* Project Title */}
          <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-tight leading-snug group-hover:text-[var(--accent)] transition-colors">
            {experiment.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
            {experiment.description}
          </p>

          {experiment.metrics.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
              {experiment.metrics.slice(0, 2).map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg bg-[var(--bg-inner)] border border-[var(--border-subtle)] px-2.5 py-1.5"
                >
                  <span className="block text-[10px] text-[var(--text-muted)] truncate">
                    {metric.label}
                  </span>
                  <span className="font-semibold text-[var(--accent-text)]">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {experiment.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-[var(--bg-inner)] text-[11px] font-mono text-[var(--text-muted)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Capsule Action */}
        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)] font-mono">
            {experiment.code}
          </span>
          <button
            id={`btn-inspect-lab-${experiment.id}`}
            onClick={() => {
              setModalTab('overview');
              setModalOpen(true);
            }}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[var(--bg-inner)] hover:bg-[var(--accent-subtle)] border border-[var(--border-input)] hover:border-[var(--accent-border)] text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-all shadow-xs"
          >
            <span>Projeyi İncele</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Clean Modal for Lab Experiment Inspection & Testing */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-backdrop)] backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setModalOpen(false)}
        >
          <div 
            id={`modal-lab-content-${experiment.id}`}
            className="w-full max-w-2xl rounded-2xl bg-[var(--bg-modal)] border border-[var(--border-card)] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">
                    {experiment.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${getStatusColor(experiment.status)}`}>
                    {experiment.status}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">{experiment.code}</span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">• {experiment.date}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">{experiment.title}</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full bg-[var(--bg-inner)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs Inside Modal */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-inner)] border border-[var(--border-subtle)]">
              <button
                onClick={() => setModalTab('overview')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modalTab === 'overview'
                    ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Genel Bakış & Mimari</span>
              </button>

              <button
                onClick={() => setModalTab('sandbox')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modalTab === 'sandbox'
                    ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>İnteraktif Test Alanı</span>
              </button>

              <button
                onClick={() => setModalTab('changelog')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  modalTab === 'changelog'
                    ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Sürüm Günlüğü ({experiment.changelog?.length || 0})</span>
              </button>
            </div>

            {/* Tab 1: Overview & Architecture */}
            {modalTab === 'overview' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Research Hypothesis Box */}
                {experiment.hypothesis && (
                  <div className="p-3.5 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] space-y-1">
                    <div className="text-xs font-bold font-mono text-[var(--accent)] flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      Araştırma Hipotezi & Hedef
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed italic">
                      "{experiment.hypothesis}"
                    </p>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                    Laboratuvar Açıklaması
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {experiment.description}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                {experiment.metrics && experiment.metrics.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                      Laboratuvar Ölçüm Metrikleri
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {experiment.metrics.map((m, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-[var(--bg-inner)] border border-[var(--border-subtle)] text-center">
                          <div className="text-[11px] text-[var(--text-muted)] font-mono leading-tight">{m.label}</div>
                          <div className="text-sm font-bold text-[var(--accent)] font-mono mt-0.5">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Components / Architecture Layers */}
                {experiment.components && experiment.components.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
                      Deney Modülleri & Katman Mimarisi ({experiment.components.length})
                    </h4>
                    <div className="rounded-xl bg-[var(--bg-inner)] border border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)] overflow-hidden">
                      {experiment.components.map((comp, idx) => (
                        <div key={idx} className="p-2.5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm">
                          <div>
                            <div className="font-semibold text-[var(--text-primary)]">{comp.name}</div>
                            {comp.role && (
                              <div className="text-xs text-[var(--text-secondary)]">{comp.role}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {comp.amount && (
                              <span className="font-mono text-xs text-[var(--accent)] font-semibold">{comp.amount}</span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
                              {comp.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Interactive Sandbox */}
            {modalTab === 'sandbox' && (
              <div className="animate-in fade-in duration-150">
                <LabExperimentSandbox experiment={experiment} />
              </div>
            )}

            {/* Tab 3: Changelog */}
            {modalTab === 'changelog' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                  Sürüm Geçmişi & Araştırma Notları
                </div>
                {experiment.changelog && experiment.changelog.length > 0 ? (
                  <div className="space-y-2.5">
                    {experiment.changelog.map((log, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[var(--bg-inner)] border border-[var(--border-subtle)] space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-[var(--accent)]">{log.version}</span>
                          <span className="text-[var(--text-muted)]">{log.date}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                          {log.note}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[var(--bg-inner)] text-center text-xs text-[var(--text-muted)]">
                    Henüz kayıtlı sürüm notu bulunmuyor.
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
              {experiment.githubUrl ? (
                <a
                  href={experiment.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] text-xs sm:text-sm font-semibold transition-all"
                >
                  <span>Açık Kaynak Kodları</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs text-[var(--text-muted)] font-mono">Özel Laboratuvar Çekirdeği</span>
              )}

              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-full bg-[var(--bg-inner)] border border-[var(--border-input)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Backwards compatibility alias
export const GamaCapsuleCard = LabCapsuleCard;
