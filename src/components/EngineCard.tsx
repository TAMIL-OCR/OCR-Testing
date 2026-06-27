import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Github, Package, Clock, Gauge } from 'lucide-react';
import CodeBlock from './CodeBlock';

interface EngineCardProps {
  name: string;
  description: string;
  repo: string;
  pipInstall: string;
  inferenceCode: string;
  language: 'python';
  strengths: string[];
  weaknesses: string[];
  modelInfo: string;
  setupNotes?: string;
  accentColor: string;
  icon: string;
  latency: string;
  accuracy: string;
}

export default function EngineCard({
  name,
  description,
  repo,
  pipInstall,
  inferenceCode,
  strengths,
  weaknesses,
  modelInfo,
  setupNotes,
  accentColor,
  icon,
  latency,
  accuracy,
}: EngineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="glass-panel-hover overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Card header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Engine icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${accentColor} border border-white/[0.06] bg-white/[0.02] flex-shrink-0`}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                {description}
              </p>
              {/* Quick stats */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{latency}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>{accuracy}</span>
                </div>
                <a
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-neon-blue transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Expand toggle */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="p-2 rounded-lg bg-white/[0.03] text-gray-500"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/[0.04] pt-4">
              {/* Model info */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-neon-purple" />
                  Model Information
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed pl-6">{modelInfo}</p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div className="p-4 rounded-xl bg-green-500/[0.04] border border-green-500/10">
                  <h5 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">
                    ✦ Strengths
                  </h5>
                  <ul className="space-y-1.5">
                    {strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-red-500/[0.04] border border-red-500/10">
                  <h5 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                    ⚠ Limitations
                  </h5>
                  <ul className="space-y-1.5">
                    {weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Setup notes */}
              {setupNotes && (
                <div className="p-4 rounded-xl bg-yellow-500/[0.04] border border-yellow-500/10 mb-5">
                  <h5 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">
                    📋 Setup Notes
                  </h5>
                  <p className="text-sm text-gray-400 leading-relaxed">{setupNotes}</p>
                </div>
              )}

              {/* pip install */}
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                1. Install Dependencies
              </h4>
              <CodeBlock code={pipInstall} language="bash" filename="terminal" title="Install packages" />

              {/* Inference script */}
              <h4 className="text-sm font-semibold text-gray-300 mt-5 mb-2">
                2. Run Inference
              </h4>
              <CodeBlock code={inferenceCode} language="python" filename={`${name.toLowerCase().replace(/[\s-]/g, '_')}_inference.py`} title="Inference script" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
