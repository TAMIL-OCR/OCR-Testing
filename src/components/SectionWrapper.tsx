import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SectionWrapperProps {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: ReactNode;
  accentColor?: string;
}

export default function SectionWrapper({
  id,
  icon: Icon,
  title,
  subtitle,
  children,
  accentColor = 'text-neon-blue',
}: SectionWrapperProps) {
  return (
    <section id={id} className="scroll-mt-8 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Section header */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]`}>
            <Icon className={`w-5 h-5 ${accentColor}`} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-gray-500 text-sm ml-12 mb-6">{subtitle}</p>
        )}
        {!subtitle && <div className="mb-6" />}

        {/* Section content */}
        <div className="glass-panel p-6 sm:p-8">
          {children}
        </div>
      </motion.div>
    </section>
  );
}
