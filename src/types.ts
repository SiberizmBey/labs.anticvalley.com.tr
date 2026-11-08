export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  created_at: string;
  topics?: string[];
  homepage?: string | null;
  clone_url?: string;
}

export interface GithubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export type ExperimentStatus = 'Deneysel' | 'Prototip' | 'Alfa' | 'Önizleme' | 'Canlı';
export type ExperimentCategory = 
  | 'API'
  | 'Yapay Zeka & Ajanlar' 
  | 'Üretken Medya & Ses' 
  | 'Siber & Çekirdek' 
  | 'Sistem & Çekirdek'
  | 'Arayüz & Etkileşim' 
  | 'Algoritma & Veri'
  | 'Mimari & Tasarım';

export interface LabExperiment {
  id: string;
  title: string;
  code: string;
  category: ExperimentCategory;
  categoryColor: 'purple' | 'emerald' | 'cyan' | 'pink' | 'amber';
  status: ExperimentStatus;
  version: string;
  date: string;
  hypothesis: string;
  description: string;
  metrics: {
    label: string;
    value: string;
  }[];
  components: {
    name: string;
    type: string;
    amount?: string;
    role?: string;
  }[];
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  interactiveType?: 'ai-agent' | 'audio-synth' | 'crypto-hash' | 'radial-ui' | 'semantic-tokens';
  changelog: {
    version: string;
    date: string;
    note: string;
  }[];
}

export interface LabDevelopment {
  id: string;
  date: string;
  title: string;
  category: string;
  type: 'Milestone' | 'Benchmark' | 'Release' | 'Research';
  summary: string;
  highlights: string[];
  badge: string;
  relatedExperimentCode?: string;
}

// Backwards compatibility alias for components
export type ShowcaseProject = LabExperiment;
