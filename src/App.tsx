import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  FolderTree,
  Wrench,
  Cpu,
  BarChart3,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Info,
  ArrowUpRight,
  FileText,
  Database,
  Cog,
  Beaker,
} from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SectionWrapper from './components/SectionWrapper';
import CodeBlock from './components/CodeBlock';
import OsToggle from './components/OsToggle';
import EngineCard from './components/EngineCard';

import {
  linuxSetupScript,
  windowsSetupScript,
  engines,
  directoryStructure,
  benchmarkScript,
  troubleshootingItems,
  prerequisites,
  resources,
} from './data/content';

export default function App() {
  const [selectedOs, setSelectedOs] = useState<'linux' | 'windows'>('linux');

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header />

        {/* Content sections */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-4">

          {/* ── Section: Global Setup ─────────────────────────────── */}
          <SectionWrapper
            id="setup"
            icon={Download}
            title="Global Setup"
            subtitle="All-in-One installation script — clone all repos and install dependencies in a single run."
            accentColor="text-neon-blue"
          >
            <div className="space-y-6">
              {/* Intro */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-neon-blue/[0.04] border border-neon-blue/10">
                <Info className="w-5 h-5 text-neon-blue flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400 leading-relaxed">
                  <span className="text-gray-300 font-medium">One script to rule them all.</span>{' '}
                  Select your operating system below and run the complete setup script. It will create 
                  the workspace directory, clone all 4 OCR engine repositories, set up model folders, 
                  create a Python virtual environment, and install all pip dependencies.
                </div>
              </div>

              {/* OS Toggle */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 font-medium">Select your OS:</span>
                <OsToggle selected={selectedOs} onSelect={setSelectedOs} />
              </div>

              {/* Script */}
              <CodeBlock
                code={selectedOs === 'linux' ? linuxSetupScript : windowsSetupScript}
                language={selectedOs === 'linux' ? 'bash' : 'powershell'}
                filename={selectedOs === 'linux' ? 'setup_linux.sh' : 'setup_windows.ps1'}
                title="Complete workspace setup"
              />

              {/* Post-setup checklist */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">✅ Post-Setup Checklist</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Virtual environment created and activated',
                    'All 4 repositories cloned successfully',
                    'Model directories created',
                    'Python packages installed (pip list)',
                    'Download parseq_tamil_v6.ckpt manually',
                    'Download PaddleOCR Tamil rec model manually',
                    'Tesseract --list-langs shows "tam"',
                    'Place test images in test_images/ folder',
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-500 p-2 rounded-lg bg-white/[0.01]"
                    >
                      <div className="w-4 h-4 rounded border border-white/10 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionWrapper>

          <div className="section-divider my-12" />

          {/* ── Section: Directory Structure ──────────────────────── */}
          <SectionWrapper
            id="directory"
            icon={FolderTree}
            title="Directory Structure"
            subtitle="Expected workspace layout after running the setup script."
            accentColor="text-neon-cyan"
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-400 leading-relaxed">
                After running the setup script, your workspace should look like this. 
                Items marked with arrows (←) require manual action from you.
              </p>
              <CodeBlock
                code={directoryStructure}
                language="bash"
                filename="workspace-tree"
                title="Expected directory layout"
              />
            </div>
          </SectionWrapper>

          <div className="section-divider my-12" />

          {/* ── Section: Prerequisites ────────────────────────────── */}
          <SectionWrapper
            id="prerequisites"
            icon={Wrench}
            title="Prerequisites"
            subtitle="Ensure these tools are installed before running any OCR engine."
            accentColor="text-neon-green"
          >
            <div className="space-y-3">
              {prerequisites.map((prereq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                >
                  <div className={`p-2 rounded-lg ${prereq.required ? 'bg-green-500/10' : 'bg-yellow-500/10'} flex-shrink-0`}>
                    {prereq.required ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <Info className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-white">{prereq.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-500 font-mono">
                        {prereq.version}
                      </span>
                      {!prereq.required && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{prereq.description}</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono px-2 py-1 rounded bg-surface-900 text-neon-cyan border border-white/[0.04]">
                        {prereq.checkCommand}
                      </code>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Virtual environment reminder */}
              <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-yellow-500/[0.04] border border-yellow-500/10">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400 leading-relaxed">
                  <span className="text-yellow-300 font-medium">Always use a virtual environment!</span>{' '}
                  Never install OCR dependencies into your system Python. The setup script creates 
                  a <code className="text-neon-cyan font-mono text-xs">.venv</code> automatically. Activate it with:{' '}
                  <code className="text-neon-cyan font-mono text-xs">
                    {selectedOs === 'linux' ? 'source .venv/bin/activate' : '.\\.venv\\Scripts\\Activate.ps1'}
                  </code>
                </div>
              </div>
            </div>
          </SectionWrapper>

          <div className="section-divider my-12" />

          {/* ── Section: OCR Engines ─────────────────────────────── */}
          <SectionWrapper
            id="engines"
            icon={Cpu}
            title="OCR Engines"
            subtitle="Expand each engine card to see setup instructions, inference scripts, and performance notes."
            accentColor="text-neon-purple"
          >
            <div className="space-y-4">
              {/* Engine comparison note */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-neon-purple/[0.04] border border-neon-purple/10 mb-4">
                <Beaker className="w-5 h-5 text-neon-purple flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400 leading-relaxed">
                  <span className="text-gray-300 font-medium">Click any engine card to expand it.</span>{' '}
                  Each card contains pip install commands, the full Python inference script, 
                  model information, strengths/limitations analysis, and setup notes. All code blocks 
                  are copyable with one click.
                </div>
              </div>

              {/* Engine cards */}
              {engines.map((engine, i) => (
                <EngineCard
                  key={i}
                  {...engine}
                  language="python"
                />
              ))}
            </div>
          </SectionWrapper>

          <div className="section-divider my-12" />

          {/* ── Section: Benchmarking ────────────────────────────── */}
          <SectionWrapper
            id="benchmarking"
            icon={BarChart3}
            title="Benchmarking"
            subtitle="Run all 4 engines against your test images and collect timing + accuracy data."
            accentColor="text-neon-blue"
          >
            <div className="space-y-6">
              {/* Metrics explanation */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">📊 Key Metrics to Evaluate</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      name: 'Latency (ms)',
                      desc: 'Time taken per image from input to output. Lower is better.',
                      icon: '⚡',
                    },
                    {
                      name: 'CER (Character Error Rate)',
                      desc: 'Percentage of incorrectly recognized characters vs. ground truth.',
                      icon: '🔤',
                    },
                    {
                      name: 'WER (Word Error Rate)',
                      desc: 'Percentage of incorrectly recognized words vs. ground truth.',
                      icon: '📝',
                    },
                  ].map((metric, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="text-2xl mb-2">{metric.icon}</div>
                      <h5 className="text-sm font-semibold text-white mb-1">{metric.name}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed">{metric.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benchmark runner script */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  🚀 Full Benchmark Runner Script
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  This script runs all 4 engines against every image in your test_images/ folder and 
                  saves results as JSON. Run from the <code className="text-neon-cyan">ocr_engines/</code> directory.
                </p>
                <CodeBlock
                  code={benchmarkScript}
                  language="python"
                  filename="benchmark_compare.py"
                  title="Full benchmark runner"
                />
              </div>

              {/* How to interpret results */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/[0.04] border border-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400 leading-relaxed">
                  <span className="text-green-300 font-medium">How to interpret results:</span>{' '}
                  Focus on CER for Tamil text accuracy. Latency matters for API integration. 
                  Test with at least 20 diverse images (printed + handwritten + different fonts) 
                  to get statistically meaningful results. Share your benchmark_results.json with the team.
                </div>
              </div>
            </div>
          </SectionWrapper>

          <div className="section-divider my-12" />

          {/* ── Section: Troubleshooting ─────────────────────────── */}
          <SectionWrapper
            id="troubleshooting"
            icon={AlertTriangle}
            title="Troubleshooting"
            subtitle="Common issues and their solutions. Check here before asking in the team channel."
            accentColor="text-yellow-400"
          >
            <div className="space-y-3">
              {troubleshootingItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-red-500/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-red-300 font-mono mb-1">
                        {item.problem}
                      </h5>
                      <p className="text-xs text-gray-500 mb-2">
                        <span className="text-gray-400 font-medium">Cause:</span> {item.cause}
                      </p>
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-green-500/[0.04] border border-green-500/10">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-300/80 leading-relaxed">
                          <span className="font-medium text-green-300">Fix:</span> {item.solution}
                        </p>
                      </div>
                      {item.os !== 'all' && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-500 capitalize">
                          {item.os} only
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>

          <div className="section-divider my-12" />

          {/* ── Section: Resources ────────────────────────────────── */}
          <SectionWrapper
            id="resources"
            icon={BookOpen}
            title="Resources"
            subtitle="Useful links, documentation, and reference materials for the team."
            accentColor="text-neon-pink"
          >
            <div className="space-y-6">
              {/* Group by category */}
              {(['documentation', 'model', 'dataset', 'tool'] as const).map((category) => {
                const categoryResources = resources.filter((r) => r.category === category);
                const categoryIcons = {
                  documentation: { icon: FileText, label: 'Documentation', color: 'text-blue-400' },
                  model: { icon: Database, label: 'Models & Weights', color: 'text-purple-400' },
                  dataset: { icon: Cog, label: 'Datasets', color: 'text-green-400' },
                  tool: { icon: Wrench, label: 'Tools & Utilities', color: 'text-orange-400' },
                };
                const config = categoryIcons[category];
                const CatIcon = config.icon;

                return (
                  <div key={category}>
                    <h4 className={`text-sm font-semibold ${config.color} mb-3 flex items-center gap-2`}>
                      <CatIcon className="w-4 h-4" />
                      {config.label}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {categoryResources.map((resource, i) => (
                        <a
                          key={i}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-neon-blue/20 hover:bg-white/[0.02] transition-all group"
                        >
                          <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-neon-blue transition-colors flex-shrink-0 mt-0.5" />
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                              {resource.title}
                            </h5>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                              {resource.description}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionWrapper>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/[0.04] text-center">
            <p className="text-sm text-gray-600">
              Tamil OCR Benchmarking Hub — Built for the Engineering Team
            </p>
            <p className="text-xs text-gray-700 mt-1">
              React + Tailwind CSS + Framer Motion • Designed for internal use
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
