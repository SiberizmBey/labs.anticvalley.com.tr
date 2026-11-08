import { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  FlaskConical,
  Cpu,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const AboutSection = () => {
  const [activeTab, setActiveTab] = useState<'philosophy' | 'tokens'>('philosophy');

  const colorPalettes = [
    { name: 'Accent Purple', variable: '--accent', desc: 'Birincil aksiyonlar, aktif deneyler, butonlar' },
    { name: 'Canvas Base', variable: '--bg-canvas', desc: 'Genel laboratuvar zemin arka planı' },
    { name: 'Card Surface', variable: '--bg-card', desc: 'Modüler deney kartları ve sandbox kapsülleri' },
    { name: 'Island Capsule', variable: '--bg-island', desc: 'Yüzen navigasyon adaları ve üst menü kapsülü' },
    { name: 'Border Subtle', variable: '--border-subtle', desc: 'Kapsül sınır çizgileri ve teknik bölücüler' },
    { name: 'Text Primary', variable: '--text-primary', desc: 'Yüksek kontrastlı ana başlık ve veri metinleri' },
  ];

  return (
    <section id="about" className="w-full py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-5">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-text)] font-mono">
                LAB MANİFESTOSU & PROTOKOL
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Laboratuvar İlkeleri & Kapsül Şartnamesi
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Google Labs modeli araştırma disiplini, açık bilim felsefesi ve arayüz tasarım standartları.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)]">
            <button
              onClick={() => setActiveTab('philosophy')}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'philosophy'
                  ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Felsefe & İlkeler
            </button>
            <button
              onClick={() => setActiveTab('tokens')}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'tokens'
                  ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Tasarım Token Sistemi
            </button>
          </div>
        </div>

        {/* Tab 1: Philosophy */}
        {activeTab === 'philosophy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 animate-in fade-in duration-150">
            <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] p-5 sm:p-6 space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[var(--accent)]" />
                <span>"Görünmeyeni Kodla, Sınırları Zorla"</span>
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Antic Labs, karmaşık yapay zeka çıkarımlarını, matematiksel ses dalgalarını ve kriptografik durum ispatlarını herkesin deneyimleyebileceği, hızlı ve modüler dijital kapsüllere dönüştürmeyi amaçlar.
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Tıpkı Google Labs'in çığır açan prototipleri gibi; burada yayınlanan her çalışma henüz keşif aşamasında olan, deneysel cesarete dayanan ve geri bildirimlerle evrilen canlı bir hipotezdir.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] p-5 sm:p-6 space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--accent)]" />
                <span>Deneysel Araştırma Standartları</span>
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed"><strong>Sıfır Gürültü, Saf İşlev:</strong> Süslü boş laflar yerine doğrudan çalışan kod, test edilebilir canlı simülasyon ve şeffaf metrikler.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed"><strong>Bilişsel Ergonomi (Fitts Yasası):</strong> İnsan-bilgisayar etkileşiminde mili-saniyeleri kurtaran radyal ve kapsül arayüz geometrisi.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed"><strong>Açık Bilim & Şeffaflık:</strong> Tüm bulgular, sürüm notları ve GitHub açık kaynak kodları toplulukla anlık paylaşılır.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Tokens */}
        {activeTab === 'tokens' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 animate-in fade-in duration-150">
            {colorPalettes.map((pal, idx) => (
              <div 
                key={idx}
                className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] p-4 sm:p-5 flex items-start gap-3.5"
              >
                <div 
                  className="w-10 h-10 rounded-xl border border-[var(--border-subtle)] shrink-0 shadow-xs"
                  style={{ backgroundColor: `var(${pal.variable})` }}
                />
                <div className="space-y-1">
                  <div className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">{pal.name}</div>
                  <div className="text-xs font-mono text-[var(--accent)]">{pal.variable}</div>
                  <div className="text-xs text-[var(--text-secondary)] leading-tight">{pal.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
