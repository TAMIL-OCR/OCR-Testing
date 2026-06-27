import { useState, useCallback } from 'react';
import { Copy, Check, Terminal, FileCode2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeBlockProps {
  code: string;
  language: 'bash' | 'powershell' | 'python';
  filename?: string;
  title?: string;
}

const languageConfig = {
  bash: { label: 'Bash', icon: Terminal, color: 'text-green-400' },
  powershell: { label: 'PowerShell', icon: Terminal, color: 'text-blue-400' },
  python: { label: 'Python', icon: FileCode2, color: 'text-yellow-400' },
};

// Simple syntax highlighter
function highlightSyntax(code: string, language: string): string {
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (language === 'bash' || language === 'powershell') {
    // Comments
    highlighted = highlighted.replace(
      /^(#.*)$/gm,
      '<span class="text-gray-500 italic">$1</span>'
    );
    // Strings
    highlighted = highlighted.replace(
      /"([^"]*)"/g,
      '<span class="text-green-300">"$1"</span>'
    );
    highlighted = highlighted.replace(
      /'([^']*)'/g,
      '<span class="text-green-300">\'$1\'</span>'
    );
    // Commands / keywords
    const bashKeywords = ['sudo', 'apt', 'dnf', 'git', 'mkdir', 'cd', 'echo', 'pip', 'python', 'wget', 'curl', 'chmod', 'export', 'source', 'npm', 'npx', 'clone', 'install'];
    bashKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-blue-400 font-semibold">$1</span>');
    });
    // Flags
    highlighted = highlighted.replace(
      /(\s)(--?\w[\w-]*)/g,
      '$1<span class="text-cyan-400">$2</span>'
    );
    // PowerShell cmdlets
    if (language === 'powershell') {
      const psCmdlets = ['New-Item', 'Write-Host', 'Set-Location', 'Get-ChildItem', 'Remove-Item', 'Invoke-WebRequest'];
      psCmdlets.forEach(cmd => {
        const regex = new RegExp(`\\b(${cmd})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-purple-400 font-semibold">$1</span>');
      });
      highlighted = highlighted.replace(
        /(-ItemType|-Force|-Path)/g,
        '<span class="text-orange-400">$1</span>'
      );
    }
  } else if (language === 'python') {
    // Comments
    highlighted = highlighted.replace(
      /^(#.*)$/gm,
      '<span class="text-gray-500 italic">$1</span>'
    );
    // Strings
    highlighted = highlighted.replace(
      /("""[\s\S]*?"""|'''[\s\S]*?''')/g,
      '<span class="text-green-300">$1</span>'
    );
    highlighted = highlighted.replace(
      /("[^"]*")/g,
      '<span class="text-green-300">$1</span>'
    );
    highlighted = highlighted.replace(
      /('[^']*')/g,
      '<span class="text-green-300">$1</span>'
    );
    // f-string content
    highlighted = highlighted.replace(
      /(f)(["'])/g,
      '<span class="text-yellow-300">$1</span>$2'
    );
    // Keywords
    const pyKeywords = ['import', 'from', 'def', 'class', 'return', 'if', 'else', 'elif', 'for', 'in', 'while', 'try', 'except', 'with', 'as', 'True', 'False', 'None', 'and', 'or', 'not', 'print', 'self', 'lambda'];
    pyKeywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-purple-400 font-semibold">$1</span>');
    });
    // Built-in functions
    const pyBuiltins = ['print', 'len', 'range', 'enumerate', 'open', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'type', 'isinstance'];
    pyBuiltins.forEach(fn => {
      const regex = new RegExp(`\\b(${fn})\\s*\\(`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-cyan-400">$1</span>(');
    });
    // Numbers
    highlighted = highlighted.replace(
      /\b(\d+\.?\d*)\b/g,
      '<span class="text-orange-400">$1</span>'
    );
  }

  return highlighted;
}

export default function CodeBlock({ code, language, filename, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const config = languageConfig[language];
  const Icon = config.icon;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [code]);

  const lines = code.split('\n');
  const highlightedLines = lines.map(line => highlightSyntax(line, language));

  return (
    <motion.div
      className="code-block-wrapper group my-4"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {/* Header bar */}
      <div className="code-block-header">
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            <div className="dot-red" />
            <div className="dot-yellow" />
            <div className="dot-green" />
          </div>
          {/* Language badge */}
          <div className="flex items-center gap-1.5 ml-2">
            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
            <span className={`text-xs font-mono font-medium ${config.color}`}>
              {filename || config.label}
            </span>
          </div>
          {title && (
            <span className="text-xs text-gray-500 ml-2 hidden sm:inline">
              — {title}
            </span>
          )}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
            copied
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-white/[0.04] text-gray-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-gray-200 hover:border-white/[0.12]'
          }`}
          aria-label="Copy code to clipboard"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Copied! ✓</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed font-mono">
          <code>
            {highlightedLines.map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none text-gray-600 w-8 text-right mr-4 flex-shrink-0 text-xs leading-relaxed">
                  {i + 1}
                </span>
                <span
                  className="flex-1 min-w-0"
                  dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </motion.div>
  );
}
