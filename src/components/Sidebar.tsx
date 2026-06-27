import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Download,
  FolderTree,
  Wrench,
  Cpu,
  BarChart3,
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'setup', label: 'Global Setup', icon: Download },
  { id: 'directory', label: 'Directory Structure', icon: FolderTree },
  { id: 'prerequisites', label: 'Prerequisites', icon: Wrench },
  { id: 'engines', label: 'OCR Engines', icon: Cpu },
  { id: 'benchmarking', label: 'Benchmarking', icon: BarChart3 },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertTriangle },
  { id: 'resources', label: 'Resources', icon: BookOpen },
];

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState('setup');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl glass-panel text-gray-400 hover:text-white transition-colors"
        aria-label="Toggle navigation"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        className={`fixed top-0 left-0 h-full w-64 z-40 bg-surface-950/95 backdrop-blur-xl border-r border-white/[0.06] pt-20 pb-8 px-4 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-3 mb-8">
          <LayoutDashboard className="w-5 h-5 text-neon-blue" />
          <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Navigation</span>
        </div>

        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-neon-blue' : 'text-gray-600 group-hover:text-gray-400'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <motion.div layoutId="active-nav-arrow">
                      <ChevronRight className="w-3.5 h-3.5 text-neon-blue" />
                    </motion.div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] px-3">
          <div className="text-xs text-gray-600">
            <p className="mb-1">Tamil OCR Benchmarking</p>
            <p className="text-gray-700">© 2026 Engineering Team</p>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
