import { motion } from 'framer-motion';
import { Cpu, Users, Layers, Github, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative overflow-hidden">
      {/* Background mesh gradient */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-transparent to-surface-950" />
      
      {/* Animated grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-blue/20 bg-neon-blue/5 mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-neon-blue" />
            <span className="text-xs font-medium text-neon-blue tracking-wider uppercase">
              Internal Engineering Docs v2.0
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-white">Tamil OCR </span>
            <span className="gradient-text">Benchmarking Hub</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Unified Setup & Inference Guide for Full-Stack Team Testing.{' '}
            <span className="text-gray-500">
              Everything your team needs to set up, run, and compare 4 Tamil OCR engines — in one place.
            </span>
          </p>

          {/* Architecture note */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl glass-panel text-sm text-gray-400"
          >
            <Layers className="w-4 h-4 text-neon-purple flex-shrink-0" />
            <span>
              <span className="text-gray-300 font-medium">Stack:</span> Frontend built with React/Tailwind.
              Python scripts designed for seamless FastAPI integration.
            </span>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10"
          >
            {[
              { icon: Cpu, label: 'OCR Engines', value: '4' },
              { icon: Users, label: 'Team Members', value: '5' },
              { icon: Github, label: 'Repositories', value: '4' },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2"
              >
                <stat.icon className="w-5 h-5 text-neon-cyan" />
                <div className="text-left">
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
