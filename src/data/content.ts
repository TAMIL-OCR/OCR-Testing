// ─── SETUP SCRIPTS ───────────────────────────────────────────────────────────

export const linuxSetupScript = `#!/bin/bash
# ============================================================
# Tamil OCR Benchmarking - All-in-One Linux Setup
# Tested on: Fedora 38+, Ubuntu 22.04+
# ============================================================

set -e  # Exit on any error

echo "🚀 Starting Tamil OCR Workspace Setup..."

# ── Step 1: Install System Dependencies ──────────────────────
echo "📦 Installing system packages..."
if command -v dnf &> /dev/null; then
    sudo dnf update -y
    sudo dnf install git python3-pip python3-devel \\
        tesseract tesseract-langpack-tam wget -y
elif command -v apt &> /dev/null; then
    sudo apt update && sudo apt upgrade -y
    sudo apt install git python3-pip python3-dev \\
        tesseract-ocr tesseract-ocr-tam wget -y
else
    echo "❌ Unsupported package manager. Install git, python3-pip, tesseract manually."
    exit 1
fi

# ── Step 2: Create Global Project Structure ──────────────────
echo "📁 Creating workspace directories..."
mkdir -p tamil-ocr-workspace/{ocr_engines,test_images,scripts,results}
cd tamil-ocr-workspace/ocr_engines

# ── Step 3: Clone All 4 OCR Repositories ────────────────────
echo "⬇️  Cloning OCR engine repositories..."
git clone https://github.com/gnana70/tamil_ocr.git ocr_tamil
git clone https://github.com/PaddlePaddle/PaddleOCR.git paddle_ocr
git clone https://github.com/JaidedAI/EasyOCR.git easy_ocr
git clone https://github.com/tesseract-ocr/tesseract.git tesseract_engine

# ── Step 4: Setup Model Directories ─────────────────────────
echo "📂 Creating model directories..."
mkdir -p ocr_tamil/models
mkdir -p paddle_ocr/models/{det,rec}

# ── Step 5: Create Python Virtual Environment ────────────────
echo "🐍 Setting up Python virtual environment..."
cd ..
python3 -m venv .venv
source .venv/bin/activate

# ── Step 6: Install Python Dependencies ─────────────────────
echo "📦 Installing Python packages..."
pip install --upgrade pip
pip install opencv-python-headless pillow numpy
pip install pytesseract easyocr paddleocr paddlepaddle
pip install torch torchvision  # For ocr-tamil

echo ""
echo "✅ ════════════════════════════════════════════════════════"
echo "   Setup Complete!"
echo "   📌 Next Steps:"
echo "   1. Download parseq_tamil_v6.ckpt → ocr_engines/ocr_tamil/models/"
echo "   2. Download ta_PP-OCRv3_mobile_rec → ocr_engines/paddle_ocr/models/rec/"
echo "   3. Place test images in test_images/ folder"
echo "   4. Activate venv: source .venv/bin/activate"
echo "════════════════════════════════════════════════════════════"`;

export const windowsSetupScript = `# ============================================================
# Tamil OCR Benchmarking - All-in-One Windows Setup
# Run in PowerShell as Administrator
# Tested on: Windows 10/11
# ============================================================

Write-Host "🚀 Starting Tamil OCR Workspace Setup..." -ForegroundColor Cyan

# ── Step 1: Verify Prerequisites ─────────────────────────────
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow
python --version
git --version

# ── Step 2: Create Global Project Structure ──────────────────
Write-Host "📁 Creating workspace directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "tamil-ocr-workspace\\ocr_engines"
New-Item -ItemType Directory -Force -Path "tamil-ocr-workspace\\test_images"
New-Item -ItemType Directory -Force -Path "tamil-ocr-workspace\\scripts"
New-Item -ItemType Directory -Force -Path "tamil-ocr-workspace\\results"
cd tamil-ocr-workspace\\ocr_engines

# ── Step 3: Clone All 4 OCR Repositories ────────────────────
Write-Host "⬇️  Cloning OCR engine repositories..." -ForegroundColor Yellow
git clone https://github.com/gnana70/tamil_ocr.git ocr_tamil
git clone https://github.com/PaddlePaddle/PaddleOCR.git paddle_ocr
git clone https://github.com/JaidedAI/EasyOCR.git easy_ocr
git clone https://github.com/tesseract-ocr/tesseract.git tesseract_engine

# ── Step 4: Setup Model Directories ─────────────────────────
Write-Host "📂 Creating model directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "ocr_tamil\\models"
New-Item -ItemType Directory -Force -Path "paddle_ocr\\models\\det"
New-Item -ItemType Directory -Force -Path "paddle_ocr\\models\\rec"

# ── Step 5: Create Python Virtual Environment ────────────────
Write-Host "🐍 Setting up Python virtual environment..." -ForegroundColor Yellow
cd ..
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1

# ── Step 6: Install Python Dependencies ─────────────────────
Write-Host "📦 Installing Python packages..." -ForegroundColor Yellow
pip install --upgrade pip
pip install opencv-python-headless pillow numpy
pip install pytesseract easyocr paddleocr paddlepaddle
pip install torch torchvision  # For ocr-tamil

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "📌 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Download parseq_tamil_v6.ckpt → ocr_engines\\ocr_tamil\\models\\"
Write-Host "   2. Download ta_PP-OCRv3_mobile_rec → ocr_engines\\paddle_ocr\\models\\rec\\"
Write-Host "   3. Install Tesseract: https://github.com/UB-Mannheim/tesseract/wiki"
Write-Host "   4. Place test images in test_images\\ folder"
Write-Host "   5. Activate venv: .\\.venv\\Scripts\\Activate.ps1"`;

// ─── OCR ENGINE DATA ─────────────────────────────────────────────────────────

export interface EngineData {
  name: string;
  description: string;
  repo: string;
  pipInstall: string;
  inferenceCode: string;
  strengths: string[];
  weaknesses: string[];
  modelInfo: string;
  setupNotes?: string;
  accentColor: string;
  icon: string;
  latency: string;
  accuracy: string;
}

export const engines: EngineData[] = [
  {
    name: 'ocr-tamil',
    description:
      'A specialized OCR engine built exclusively for Tamil script recognition using the PARSeq architecture. Designed by the project maintainer (gnana70) for high accuracy on Tamil text.',
    repo: 'https://github.com/gnana70/tamil_ocr',
    pipInstall: `# Navigate to the ocr-tamil directory
cd tamil-ocr-workspace/ocr_engines/ocr_tamil

# Install dependencies (ensure venv is active)
pip install -r requirements.txt

# If requirements.txt is missing, install manually:
pip install torch torchvision opencv-python-headless pillow numpy`,
    inferenceCode: `import cv2
from ocr_tamil.inference import TamilOCR

# Initialize engine with local model weights
ocr = TamilOCR(model_path="ocr_tamil/models/parseq_tamil_v6.ckpt")
text_list = ocr.predict("../test_images/sample_tamil.png")

print("--- ocr-tamil Results ---")
for text in text_list:
    print(text)`,
    strengths: [
      'Built specifically for Tamil — highest potential accuracy',
      'PARSeq architecture excels at complex glyph recognition',
      'Lightweight model optimized for inference speed',
      'Actively maintained by the project team',
    ],
    weaknesses: [
      'Requires manual model checkpoint download',
      'Limited to Tamil only — no multi-language support',
      'Smaller community and ecosystem vs. PaddleOCR/EasyOCR',
      'May need custom fine-tuning for specific fonts',
    ],
    modelInfo:
      'Uses PARSeq (Permuted Autoregressive Sequence Models) v6 architecture. Model checkpoint: parseq_tamil_v6.ckpt (~50MB). Must be manually downloaded and placed in ocr_engines/ocr_tamil/models/',
    setupNotes:
      'This is the primary engine under evaluation. Ensure you download the exact checkpoint version specified by the team lead. The model path in the script must match your local directory structure.',
    accentColor: 'bg-blue-500/10',
    icon: '🔬',
    latency: '~120ms/image',
    accuracy: 'High (Tamil-specific)',
  },
  {
    name: 'PaddleOCR',
    description:
      'Baidu\'s production-grade, multilingual OCR toolkit supporting 80+ languages. Features lightweight mobile models and server-grade models with state-of-the-art accuracy.',
    repo: 'https://github.com/PaddlePaddle/PaddleOCR',
    pipInstall: `# Install PaddlePaddle framework + PaddleOCR
pip install paddlepaddle paddleocr

# For GPU support (CUDA 11.x):
# pip install paddlepaddle-gpu paddleocr

# Verify installation
python -c "from paddleocr import PaddleOCR; print('PaddleOCR ready!')"`,
    inferenceCode: `from paddleocr import PaddleOCR

# Load the specific Tamil lightweight model
ocr = PaddleOCR(use_angle_cls=True, lang='ta', det_model_dir='paddle_ocr/models/det', rec_model_dir='paddle_ocr/models/rec')
result = ocr.ocr("../test_images/sample_tamil.png", cls=True)

print("--- PaddleOCR Results ---")
for idx, res in enumerate(result):
    for line in res:
        print(f"Text: {line[1][0]} | Confidence: {line[1][1]:.4f}")`,
    strengths: [
      'Production-tested at massive scale (Baidu)',
      'Excellent detection + recognition pipeline',
      'Lightweight mobile models available (PP-OCRv3)',
      'Built-in angle classification for rotated text',
      'Strong community with regular updates',
    ],
    weaknesses: [
      'Tamil support is via community-trained models',
      'PaddlePaddle framework has a steeper learning curve',
      'Model download can be slow from Baidu servers',
      'GPU setup requires specific CUDA version matching',
    ],
    modelInfo:
      'Uses PP-OCRv3 architecture with separate detection and recognition models. Tamil recognition model: ta_PP-OCRv3_mobile_rec. Detection model is language-agnostic. Place det model in models/det/ and rec model in models/rec/',
    setupNotes:
      'PaddleOCR will auto-download models on first run if not provided locally. For offline use, pre-download the Tamil recognition model from the PaddleOCR model zoo. GPU acceleration requires paddlepaddle-gpu with matching CUDA.',
    accentColor: 'bg-cyan-500/10',
    icon: '🏄',
    latency: '~80ms/image (GPU)',
    accuracy: 'Very High (multi-lang)',
  },
  {
    name: 'EasyOCR',
    description:
      'JaidedAI\'s developer-friendly OCR library supporting 80+ languages with a simple 3-line API. Built on PyTorch with automatic model management.',
    repo: 'https://github.com/JaidedAI/EasyOCR',
    pipInstall: `# Install EasyOCR (automatically installs PyTorch if needed)
pip install easyocr

# Verify installation
python -c "import easyocr; print('EasyOCR version:', easyocr.__version__)"`,
    inferenceCode: `import easyocr

# Auto-fetches Tamil ('ta') and English ('en') models on first execution
reader = easyocr.Reader(['ta', 'en'])
result = reader.readtext("../test_images/sample_tamil.png")

print("--- EasyOCR Results ---")
for (bbox, text, prob) in result:
    print(f"Text: {text} | Confidence: {prob:.4f}")`,
    strengths: [
      'Simplest API — just 3 lines to run OCR',
      'Auto-downloads language models on first use',
      'Excellent for mixed Tamil + English text',
      'Built on PyTorch — easy to customize and fine-tune',
      'Great documentation and active community',
    ],
    weaknesses: [
      'First run is slow due to model downloads (~100MB)',
      'Slightly lower accuracy than PaddleOCR on benchmarks',
      'Higher memory usage compared to PaddleOCR mobile models',
      'No built-in angle correction — works best on straight text',
    ],
    modelInfo:
      'Uses CRAFT text detection + a custom recognition network. Models are automatically downloaded to ~/.EasyOCR/model/ on first use. Tamil model + English model are loaded concurrently for mixed-script support.',
    accentColor: 'bg-green-500/10',
    icon: '🎯',
    latency: '~150ms/image',
    accuracy: 'High (multi-lang)',
  },
  {
    name: 'Tesseract',
    description:
      'Google\'s open-source OCR engine (v5 LSTM). The industry standard for decades, with broad language support including Tamil via traineddata files.',
    repo: 'https://github.com/tesseract-ocr/tesseract',
    pipInstall: `# Install Python wrapper for Tesseract
pip install pytesseract pillow

# Linux: Install Tesseract engine + Tamil language pack
# Fedora: sudo dnf install tesseract tesseract-langpack-tam
# Ubuntu: sudo apt install tesseract-ocr tesseract-ocr-tam

# Windows: Download installer from UB-Mannheim
# https://github.com/UB-Mannheim/tesseract/wiki

# Verify installation
tesseract --version
tesseract --list-langs  # Should show 'tam'`,
    inferenceCode: `import pytesseract
from PIL import Image

# Windows ONLY - Uncomment and point to your tesseract.exe path:
# pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

text = pytesseract.image_to_string(Image.open("../test_images/sample_tamil.png"), lang='tam')

print("--- Tesseract Results ---")
print(text)`,
    strengths: [
      'Industry standard — decades of development',
      'No Python ML framework needed (standalone binary)',
      'Extremely lightweight and fast on CPU',
      'Best for clean, printed Tamil text (books, documents)',
      'Available on virtually every platform',
    ],
    weaknesses: [
      'Significantly lower accuracy on noisy/handwritten text',
      'No confidence scores per word (requires extra config)',
      'No text detection — needs pre-segmented input for best results',
      'Tamil LSTM model is less refined than other languages',
    ],
    modelInfo:
      'Uses LSTM-based recognition (Tesseract v5). Tamil language data (tam.traineddata) is installed via system package manager. For improved accuracy, download the "best" traineddata from tessdata_best repository.',
    setupNotes:
      'On Windows, you must install Tesseract separately and point pytesseract to the executable path. On Linux, the system package manager handles everything. Ensure "tam" appears in tesseract --list-langs output.',
    accentColor: 'bg-orange-500/10',
    icon: '📜',
    latency: '~50ms/image',
    accuracy: 'Moderate (best for print)',
  },
];

// ─── DIRECTORY STRUCTURE ─────────────────────────────────────────────────────

export const directoryStructure = `tamil-ocr-workspace/
├── 📁 ocr_engines/
│   ├── 📁 ocr_tamil/
│   │   ├── 📁 models/
│   │   │   └── 📄 parseq_tamil_v6.ckpt      ← Manual download required
│   │   ├── 📁 inference/
│   │   └── 📄 requirements.txt
│   ├── 📁 paddle_ocr/
│   │   ├── 📁 models/
│   │   │   ├── 📁 det/                       ← Detection model
│   │   │   └── 📁 rec/                       ← Tamil recognition model
│   │   └── 📄 requirements.txt
│   ├── 📁 easy_ocr/
│   │   └── 📄 ...                            ← Models auto-download
│   └── 📁 tesseract_engine/
│       └── 📄 ...                            ← System-installed
├── 📁 test_images/
│   ├── 🖼️  sample_tamil.png
│   ├── 🖼️  printed_text_01.png
│   └── 🖼️  handwritten_01.png
├── 📁 scripts/
│   ├── 📄 run_all_engines.py
│   └── 📄 benchmark_compare.py
├── 📁 results/
│   └── 📄 benchmark_results.csv
└── 📁 .venv/                                ← Python virtual environment`;

// ─── BENCHMARKING SCRIPT ─────────────────────────────────────────────────────

export const benchmarkScript = `import time
import json
from pathlib import Path
from PIL import Image

# ── Configuration ─────────────────────────────────────────────
TEST_IMAGES_DIR = "../test_images"
RESULTS_FILE = "../results/benchmark_results.json"

def benchmark_engine(engine_name: str, predict_fn, image_path: str) -> dict:
    """Benchmark a single OCR engine on a single image."""
    start_time = time.perf_counter()
    try:
        result = predict_fn(image_path)
        elapsed = time.perf_counter() - start_time
        return {
            "engine": engine_name,
            "image": image_path,
            "result": result,
            "latency_ms": round(elapsed * 1000, 2),
            "status": "success"
        }
    except Exception as e:
        elapsed = time.perf_counter() - start_time
        return {
            "engine": engine_name,
            "image": image_path,
            "error": str(e),
            "latency_ms": round(elapsed * 1000, 2),
            "status": "error"
        }

def run_full_benchmark():
    """Run all 4 engines against all test images."""
    images = list(Path(TEST_IMAGES_DIR).glob("*.png"))
    print(f"Found {len(images)} test images")
    
    all_results = []
    
    # ── Engine 1: ocr-tamil ───────────────────────────────────
    print("\\n🔬 Running ocr-tamil...")
    from ocr_tamil.inference import TamilOCR
    ocr = TamilOCR(model_path="ocr_tamil/models/parseq_tamil_v6.ckpt")
    for img in images:
        result = benchmark_engine("ocr-tamil", lambda p: ocr.predict(p), str(img))
        all_results.append(result)
        print(f"  {img.name}: {result['latency_ms']}ms")
    
    # ── Engine 2: PaddleOCR ───────────────────────────────────
    print("\\n🏄 Running PaddleOCR...")
    from paddleocr import PaddleOCR
    paddle = PaddleOCR(use_angle_cls=True, lang='ta')
    for img in images:
        result = benchmark_engine("PaddleOCR", lambda p: paddle.ocr(p, cls=True), str(img))
        all_results.append(result)
        print(f"  {img.name}: {result['latency_ms']}ms")
    
    # ── Engine 3: EasyOCR ─────────────────────────────────────
    print("\\n🎯 Running EasyOCR...")
    import easyocr
    reader = easyocr.Reader(['ta', 'en'])
    for img in images:
        result = benchmark_engine("EasyOCR", lambda p: reader.readtext(p), str(img))
        all_results.append(result)
        print(f"  {img.name}: {result['latency_ms']}ms")
    
    # ── Engine 4: Tesseract ───────────────────────────────────
    print("\\n📜 Running Tesseract...")
    import pytesseract
    for img in images:
        result = benchmark_engine("Tesseract",
            lambda p: pytesseract.image_to_string(Image.open(p), lang='tam'), str(img))
        all_results.append(result)
        print(f"  {img.name}: {result['latency_ms']}ms")
    
    # ── Save Results ──────────────────────────────────────────
    Path(RESULTS_FILE).parent.mkdir(parents=True, exist_ok=True)
    with open(RESULTS_FILE, 'w') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print(f"\\n✅ Benchmark complete! Results saved to {RESULTS_FILE}")
    return all_results

if __name__ == "__main__":
    run_full_benchmark()`;

// ─── TROUBLESHOOTING DATA ────────────────────────────────────────────────────

export interface TroubleshootItem {
  problem: string;
  cause: string;
  solution: string;
  os: 'all' | 'linux' | 'windows';
}

export const troubleshootingItems: TroubleshootItem[] = [
  {
    problem: 'ModuleNotFoundError: No module named "paddleocr"',
    cause: 'PaddlePaddle or PaddleOCR not installed in the active virtual environment.',
    solution: 'Activate your venv first, then run: pip install paddlepaddle paddleocr',
    os: 'all',
  },
  {
    problem: 'Tesseract is not installed or it\'s not in your PATH',
    cause: 'pytesseract cannot find the Tesseract binary.',
    solution: 'Linux: sudo dnf/apt install tesseract-ocr. Windows: Install from UB-Mannheim and set pytesseract.pytesseract.tesseract_cmd to the .exe path.',
    os: 'all',
  },
  {
    problem: 'CUDA out of memory',
    cause: 'GPU memory exhausted — usually with PaddleOCR or EasyOCR loading large models.',
    solution: 'Close other GPU processes, reduce batch size, or use CPU mode: PaddleOCR(use_gpu=False) / easyocr.Reader([\'ta\'], gpu=False)',
    os: 'all',
  },
  {
    problem: 'FileNotFoundError: parseq_tamil_v6.ckpt not found',
    cause: 'The ocr-tamil model weights have not been downloaded.',
    solution: 'Download the checkpoint file from the team\'s shared drive and place it in ocr_engines/ocr_tamil/models/',
    os: 'all',
  },
  {
    problem: 'Tamil language pack not found in Tesseract',
    cause: 'The tam.traineddata file is not installed.',
    solution: 'Fedora: sudo dnf install tesseract-langpack-tam. Ubuntu: sudo apt install tesseract-ocr-tam. Windows: Download tam.traineddata and place in Tesseract tessdata folder.',
    os: 'all',
  },
  {
    problem: 'EasyOCR first run is extremely slow',
    cause: 'Models are being downloaded (~100MB) on first execution.',
    solution: 'This is normal — the download happens only once. Models are cached in ~/.EasyOCR/model/. Ensure stable internet on first run.',
    os: 'all',
  },
  {
    problem: 'Permission denied when running dnf/apt install',
    cause: 'Running without root/sudo privileges.',
    solution: 'Prefix the command with sudo, or ask your system administrator for package installation rights.',
    os: 'linux',
  },
  {
    problem: 'PowerShell script execution is disabled',
    cause: 'Windows Execution Policy is set to Restricted.',
    solution: 'Run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser',
    os: 'windows',
  },
];

// ─── PREREQUISITES DATA ─────────────────────────────────────────────────────

export interface Prerequisite {
  name: string;
  description: string;
  version: string;
  required: boolean;
  checkCommand: string;
  installNotes: string;
}

export const prerequisites: Prerequisite[] = [
  {
    name: 'Python',
    description: 'Required for all OCR engines. Ensure Python 3.8+ is installed.',
    version: '3.8+',
    required: true,
    checkCommand: 'python3 --version',
    installNotes: 'Download from python.org or use your OS package manager.',
  },
  {
    name: 'Git',
    description: 'Required to clone the 4 OCR engine repositories.',
    version: '2.x',
    required: true,
    checkCommand: 'git --version',
    installNotes: 'Fedora: dnf install git. Ubuntu: apt install git. Windows: git-scm.com',
  },
  {
    name: 'Tesseract',
    description: 'System binary required by pytesseract. Must include Tamil language pack.',
    version: '5.x',
    required: true,
    checkCommand: 'tesseract --version && tesseract --list-langs',
    installNotes: 'Linux: install via package manager with tam langpack. Windows: UB-Mannheim installer.',
  },
  {
    name: 'CUDA (Optional)',
    description: 'NVIDIA GPU toolkit for accelerated inference with PaddleOCR and EasyOCR.',
    version: '11.x / 12.x',
    required: false,
    checkCommand: 'nvcc --version',
    installNotes: 'Only needed for GPU acceleration. CPU mode works for all engines.',
  },
  {
    name: 'pip',
    description: 'Python package installer. Should come with Python, but verify it\'s updated.',
    version: 'Latest',
    required: true,
    checkCommand: 'pip --version',
    installNotes: 'Update with: python3 -m pip install --upgrade pip',
  },
];

// ─── RESOURCES DATA ──────────────────────────────────────────────────────────

export interface Resource {
  title: string;
  description: string;
  url: string;
  category: 'documentation' | 'model' | 'dataset' | 'tool';
}

export const resources: Resource[] = [
  {
    title: 'ocr-tamil GitHub Repository',
    description: 'Source code, issues, and releases for the Tamil-specific PARSeq OCR engine.',
    url: 'https://github.com/gnana70/tamil_ocr',
    category: 'documentation',
  },
  {
    title: 'PaddleOCR Documentation',
    description: 'Official PaddleOCR docs with model zoo, training guides, and API reference.',
    url: 'https://github.com/PaddlePaddle/PaddleOCR',
    category: 'documentation',
  },
  {
    title: 'EasyOCR Documentation',
    description: 'EasyOCR README with language support, examples, and custom training guides.',
    url: 'https://github.com/JaidedAI/EasyOCR',
    category: 'documentation',
  },
  {
    title: 'Tesseract Documentation',
    description: 'Official Tesseract documentation covering training, configuration, and usage.',
    url: 'https://tesseract-ocr.github.io/',
    category: 'documentation',
  },
  {
    title: 'PaddleOCR Tamil Model Zoo',
    description: 'Pre-trained Tamil recognition and detection models for PaddleOCR.',
    url: 'https://github.com/PaddlePaddle/PaddleOCR/blob/main/doc/doc_en/models_list_en.md',
    category: 'model',
  },
  {
    title: 'Tesseract Best Traineddata',
    description: 'High-accuracy LSTM models for Tesseract, including Tamil (tam.traineddata).',
    url: 'https://github.com/tesseract-ocr/tessdata_best',
    category: 'model',
  },
  {
    title: 'Tamil Wikipedia Corpus',
    description: 'Large-scale Tamil text corpus for generating synthetic training data.',
    url: 'https://ta.wikipedia.org/',
    category: 'dataset',
  },
  {
    title: 'CER/WER Calculation Guide',
    description: 'Understanding Character Error Rate and Word Error Rate for OCR evaluation.',
    url: 'https://en.wikipedia.org/wiki/Word_error_rate',
    category: 'tool',
  },
];
