import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Sliders, 
  Check, 
  Activity
} from 'lucide-react';
import { LabExperiment } from '../types';

interface LabExperimentSandboxProps {
  experiment: LabExperiment;
}

export const LabExperimentSandbox = ({ experiment }: LabExperimentSandboxProps) => {
  // 1. AI Agent Simulator State
  const [agentPrompt, setAgentPrompt] = useState<string>('Bellek kancalarını tara ve asenkron veri boru hattını doğrula.');
  const [agentRunning, setAgentRunning] = useState<boolean>(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [agentStep, setAgentStep] = useState<number>(0);

  // 2. Audio Synth Simulator State (WebAudio)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const [frequency, setFrequency] = useState<number>(440);
  const [bpm, setBpm] = useState<number>(128);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // 3. Crypto Hash State
  const [cryptoInput, setCryptoInput] = useState<string>('NexaPayload_Node#09_Valid_Token');
  const [cryptoHash, setCryptoHash] = useState<string>('');
  const [merkleRoot, setMerkleRoot] = useState<string>('');
  const [proofVerified, setProofVerified] = useState<boolean>(true);

  // 4. Radial UI State
  const [activeRadialSlot, setActiveRadialSlot] = useState<number | null>(0);
  const radialSlots = [
    { label: 'Ajan Başlat', icon: '🚀', action: 'SYS_EXEC_AGENT' },
    { label: 'Bellek Tara', icon: '🧠', action: 'SYS_AUDIT_MEM' },
    { label: 'P2P Bağlan', icon: '🔗', action: 'SYS_CONNECT_PEER' },
    { label: 'Ses Modüle Et', icon: '🎵', action: 'SYS_SYNTH_WAVE' },
    { label: 'Kripto Doğrula', icon: '🛡️', action: 'SYS_VERIFY_ZKP' },
    { label: 'Topoloji Çiz', icon: '🌐', action: 'SYS_MAP_LATENT' },
    { label: 'Önbellek Boşalt', icon: '⚡', action: 'SYS_FLUSH_CACHE' },
    { label: 'Kapsül Ayarları', icon: '⚙️', action: 'SYS_CONFIG_CORE' },
  ];

  // 5. Semantic Tokens State
  const [selectedCluster, setSelectedCluster] = useState<string>('Otonom Ajanlar');

  // Compute Simple Hash
  useEffect(() => {
    let hash = 0;
    for (let i = 0; i < cryptoInput.length; i++) {
      const char = cryptoInput.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    setCryptoHash(`0x${hex}e8a49c71b302f784d1a58021`);
    setMerkleRoot(`zk-MRK_${hex.toUpperCase()}_ROOT#99`);
  }, [cryptoInput]);

  // Clean WebAudio on unmount
  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // ignore
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handlePlaySoundTone = (freqVal: number) => {
    setFrequency(freqVal);
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freqVal, audioCtxRef.current.currentTime);

      gain.gain.setValueAtTime(0.15, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.6);

      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 600);
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  };

  const handleRunAgentSimulation = () => {
    if (agentRunning) return;
    setAgentRunning(true);
    setAgentStep(1);
    setAgentLogs([
      `[00:01] Başlatıcı: AetherAura Vektör Motoru devrede...`,
      `[00:03] Girdi Analizi: "${agentPrompt.slice(0, 45)}..."`,
      `[00:06] Semantik Yönlendirici: Görev sınıfı [Çoklu_Araç_Akıl_Yürütme]`
    ]);

    setTimeout(() => {
      setAgentStep(2);
      setAgentLogs((prev) => [
        ...prev,
        `[00:12] Düşünce Zinciri (CoT): 4 hipotez oluşturuldu.`,
        `[00:18] Araç Çağrısı: SYS_MEM_SCAN(derinlik=4, format="ast")`,
        `[00:24] Bellek Ağacı: Sıfır güvenlik kancası tespit edildi (Temiz).`
      ]);
    }, 900);

    setTimeout(() => {
      setAgentStep(3);
      setAgentLogs((prev) => [
        ...prev,
        `[00:32] Sentez & Karar: Asenkron boru hattı doğrulandı (%99.4 güven).`,
        `[00:38] Çıktı: "Tüm sistem bileşenleri nominal değerlerde senkronize edildi."`,
        `[00:40] İşlem tamamlandı. Toplam süre: 318ms. Token harcaması: 482.`
      ]);
      setAgentRunning(false);
    }, 2000);
  };

  return (
    <div className="rounded-xl bg-[var(--bg-inner)] border border-[var(--border-subtle)] p-4 space-y-4">
      {/* Sandbox Header */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
            CANLI LABORATUVAR TEST ALANI // {experiment.code}
          </h4>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">
          İnteraktif Simülasyon
        </span>
      </div>

      {/* Mode 1: AI Agent Interactive Playground */}
      {(experiment.interactiveType === 'ai-agent' || !experiment.interactiveType) && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center justify-between">
              <span>Ajan Test Görevi / İsteği:</span>
              <span className="font-mono text-[11px] text-[var(--accent)]">Gemini 2.5 Ajan Çekirdeği</span>
            </label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                placeholder="Ajan için bir görev veya hipotez yazın..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] text-xs sm:text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
              />
              <button
                onClick={handleRunAgentSimulation}
                disabled={agentRunning}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] text-xs font-semibold shadow-xs disabled:opacity-50 transition-all shrink-0"
              >
                {agentRunning ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    <span>Akıl Yürütülüyor...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Ajanı Çalıştır</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stepper indicator */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className={`p-1.5 rounded-md border transition-colors ${agentStep >= 1 ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent-text)]' : 'border-[var(--border-subtle)] text-[var(--text-muted)]'}`}>
              1. Semantik Ayrıştırma
            </div>
            <div className={`p-1.5 rounded-md border transition-colors ${agentStep >= 2 ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent-text)]' : 'border-[var(--border-subtle)] text-[var(--text-muted)]'}`}>
              2. Düşünce Zinciri
            </div>
            <div className={`p-1.5 rounded-md border transition-colors ${agentStep >= 3 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-[var(--border-subtle)] text-[var(--text-muted)]'}`}>
              3. Karar ve Eylem
            </div>
          </div>

          {/* Terminal Logs Output */}
          <div className="rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] p-3 space-y-1 font-mono text-xs max-h-40 overflow-y-auto">
            <div className="text-[var(--text-muted)] text-[11px] pb-1 border-b border-[var(--border-subtle)] flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[var(--accent)]" />
              <span>Ajan Telemetri Konsolu [Canlı Çıktı]:</span>
            </div>
            {agentLogs.length === 0 ? (
              <div className="text-[var(--text-muted)] italic py-2">
                Yukarıdaki butona tıklayarak otonom akıl yürütme döngüsünü başlatın.
              </div>
            ) : (
              agentLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed text-[var(--text-primary)]">
                  {log.includes('Hata') ? (
                    <span className="text-red-400">{log}</span>
                  ) : log.includes('Doğrulandı') || log.includes('Tamamlandı') ? (
                    <span className="text-emerald-400">{log}</span>
                  ) : log.includes('Düşünce') || log.includes('Semantik') ? (
                    <span className="text-[var(--accent-text)]">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Audio Synth Interactive Playground */}
      {experiment.interactiveType === 'audio-synth' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Dalga Biçimi:</span>
              {(['sine', 'triangle', 'sawtooth', 'square'] as OscillatorType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setWaveType(type)}
                  className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                    waveType === type
                      ? 'bg-[var(--accent)] text-[var(--btn-primary-text)] font-bold'
                      : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-[var(--accent)] flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              <span>48 kHz WebAudio</span>
            </div>
          </div>

          {/* Interactive Keyboard / Frequency Triggers */}
          <div className="space-y-1.5">
            <div className="text-xs text-[var(--text-secondary)]">Matematiksel Frekans Tuşları (Tıklayarak Sentezleyin):</div>
            <div className="grid grid-cols-6 gap-2">
              {[
                { note: 'C4', f: 261.63 },
                { note: 'D4', f: 293.66 },
                { note: 'E4', f: 329.63 },
                { note: 'G4', f: 392.00 },
                { note: 'A4', f: 440.00 },
                { note: 'C5', f: 523.25 },
              ].map((item) => (
                <button
                  key={item.note}
                  onClick={() => handlePlaySoundTone(item.f)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--accent-subtle)] border border-[var(--border-card)] hover:border-[var(--accent)] text-[var(--text-primary)] hover:text-[var(--accent)] transition-all active:scale-95 group shadow-xs"
                >
                  <span className="font-bold text-xs sm:text-sm font-mono">{item.note}</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono group-hover:text-[var(--accent)]">
                    {Math.round(item.f)}Hz
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Waveform Indicator */}
          <div className="p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />
              )}
              <span className="text-[var(--text-secondary)]">
                Frekans: <strong className="text-[var(--text-primary)]">{frequency} Hz</strong>
              </span>
              <span className="text-[var(--border-subtle)]">|</span>
              <span className="text-[var(--text-secondary)]">
                Dalga: <strong className="text-[var(--accent)] uppercase">{waveType}</strong>
              </span>
            </div>
            <div className="text-[11px] text-emerald-400">Gecikme: 7.8ms</div>
          </div>
        </div>
      )}

      {/* Mode 3: Crypto Hash Interactive Playground */}
      {experiment.interactiveType === 'crypto-hash' && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              Kriptografik Durum Yükü (Payload):
            </label>
            <input 
              type="text"
              value={cryptoInput}
              onChange={(e) => setCryptoInput(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] text-xs sm:text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">SHA-256 Durum Hash:</span>
              <span className="text-[var(--accent-text)] font-bold">{cryptoHash}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">ZKP Merkle Ağacı Kökü:</span>
              <span className="text-emerald-400 font-bold">{merkleRoot}</span>
            </div>
            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                Sıfır Bilgi Kanıtı Geçerli (zk-SNARK Doğrulandı)
              </span>
              <span className="text-[var(--text-muted)]">Doğrulama: 1.4ms</span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 4: Radial UI Playground */}
      {experiment.interactiveType === 'radial-ui' && (
        <div className="space-y-3">
          <div className="text-xs text-[var(--text-secondary)]">
            Fitts Kanunu Radyal Dilim Testi (Slot seçmek için tıklayın):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {radialSlots.map((slot, idx) => (
              <button
                key={idx}
                onClick={() => setActiveRadialSlot(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  activeRadialSlot === idx
                    ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent-text)] shadow-xs font-semibold'
                    : 'border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                }`}
              >
                <span className="text-base">{slot.icon}</span>
                <div className="truncate">
                  <div className="text-xs font-medium leading-tight">{slot.label}</div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)]">{slot.action}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--text-muted)]">
              Aktif Seçim: <strong className="text-[var(--text-primary)]">{radialSlots[activeRadialSlot || 0].label}</strong>
            </span>
            <span className="text-emerald-400">Tepki Süresi: 185ms (Kas Hafızası Modu)</span>
          </div>
        </div>
      )}

      {/* Mode 5: Semantic Tokens Playground */}
      {experiment.interactiveType === 'semantic-tokens' && (
        <div className="space-y-3">
          <div className="text-xs text-[var(--text-secondary)]">
            Gizil (Latent) Uzay Semantik Kümeleri:
          </div>
          <div className="flex flex-wrap gap-2">
            {['Otonom Ajanlar', 'Kripto Protokoller', 'Frekans Sentezi', 'Ergonomik Arayüz', 'Mikro-Çekirdek'].map((cl) => (
              <button
                key={cl}
                onClick={() => setSelectedCluster(cl)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCluster === cl
                    ? 'bg-[var(--accent)] text-[var(--btn-primary-text)] font-semibold shadow-xs'
                    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cl}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>Seçili Küme Embedding Boyutu:</span>
              <span className="text-[var(--text-primary)]">1536d</span>
            </div>
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>2B İzdüşüm Koordinatı:</span>
              <span className="text-[var(--accent-text)]">x: 0.8412, y: -0.3298</span>
            </div>
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>Kosinüs Benzerlik Oranı:</span>
              <span className="text-emerald-400 font-bold">0.941 (Yüksek Anlamsal Yakınlık)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
