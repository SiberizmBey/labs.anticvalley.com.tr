import { FlaskConical, GitBranch } from 'lucide-react';

interface MobileBottomNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const MobileBottomNav = ({
  activeSection,
  onNavigate
}: MobileBottomNavProps) => {
  const items = [
    { id: 'projects', label: 'Projeler', icon: GitBranch },
    { id: 'developments', label: 'Gelişmeler', icon: FlaskConical },
  ];

  return (
    <div className="motion-enter md:hidden fixed bottom-3 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
      <nav 
        aria-label="Mobil Gezinti Adası"
        className="pointer-events-auto flex items-center justify-between gap-1 p-1 rounded-full shadow-2xl backdrop-blur-lg border border-[var(--border-card)] bg-[var(--bg-island)] max-w-md w-full transition-all duration-300"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-island-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${
                isActive
                ? 'bg-[var(--accent)] text-[var(--btn-primary-text)] shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-inner)]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
