# 🧬 AI Biology Playground

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)

> **Interactive Research Laboratory for AI Interpretability**

An educational platform providing hands-on exploration of authentic AI interpretability research through interactive visualizations, real sparse autoencoder features, and computational pathway analysis.

![image](https://github.com/user-attachments/assets/cbac7153-d0fd-4105-bb43-e89262dfafe2)


## 🔬 Research-Based Learning

This project transforms groundbreaking AI interpretability research into accessible, interactive educational tools. Built upon authentic research data from Anthropic and the broader interpretability community, it offers genuine hands-on experimentation with:

- **Real SAE Features**: Authentic sparse autoencoder decompositions from Claude models
- **Attribution Networks**: Genuine computational pathway visualizations  
- **Safety Analysis**: Production-grade content safety detection
- **Research Methods**: Actual techniques used in AI interpretability research

## Core Features

### Real SAE Explorer
Explore authentic sparse autoencoder features extracted from production language models:
- **34M+ Features**: Direct access to features from published Anthropic research
- **Interactive Search**: Filter by semantic categories, activation patterns, and layers
- **Feature Details**: Examine top activating tokens, example prompts, and confidence scores
- **Research Context**: Links to original papers and methodologies

### Attribution Graph Viewer
3D visualization of computational pathways and feature interactions:
- **Interactive Networks**: Explore feature-to-feature influence patterns
- **3D Visualization**: Three.js powered network graphs with smooth animations
- **Pathway Tracing**: Follow multi-step reasoning chains through the model
- **Real Data**: Authentic attribution patterns from research datasets

### Safety Features Detector  
Analyze content for safety-relevant patterns using research-grade detection:
- **Feature-Based Detection**: Identify safety triggers through interpretable features
- **Risk Assessment**: Multi-dimensional safety scoring and analysis
- **Real-Time Analysis**: Live content evaluation with detailed explanations
- **Research Validation**: Methods validated through published safety research

### API Playground
Interactive testing interface for all research endpoints:
- **Live API Testing**: Send requests and examine responses in real-time
- **Request Builder**: Visual interface for constructing API calls
- **Response Analysis**: Detailed breakdown of API responses and data structures
- **Educational Examples**: Pre-built examples demonstrating key concepts

### Interactive Tutorial
Guided introduction to AI interpretability concepts:
- **Step-by-Step Learning**: Progressive introduction to complex concepts
- **Hands-On Exercises**: Interactive demonstrations with real data
- **Research Context**: Background on methodologies and findings
- **Visual Learning**: Diagrams and animations explaining key concepts

## Project Structure

```
ai-biology-playground/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   │   ├── AppLayout.tsx        # Main application layout
│   │   ├── RealSAEExplorer.tsx  # SAE feature exploration
│   │   ├── AttributionGraphViewer.tsx  # 3D network visualization
│   │   ├── SafetyFeaturesDetector.tsx  # Safety analysis tools
│   │   ├── FeatureAttributionVisualizer.tsx  # Feature analysis
│   │   ├── IntroductionTour.tsx  # Educational tutorial
│   │   └── APIPlayground.tsx    # API testing interface
│   ├── utils/                   # Utilities and type definitions
│   │   └── types.ts               # TypeScript interfaces
│   ├── App.tsx                    # Root application component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── api/                         # Backend Express server
│   ├── server.js                  # Main API server with all endpoints
│   ├── package.json              # Backend dependencies
│   └── .env.example              # Environment variables template
├── docs/                       # Comprehensive documentation
│   ├── API.md                 # API endpoint documentation
│   ├── DEVELOPMENT.md        # Development guide
│   ├── CONTRIBUTING.md        # Contribution guidelines
│   └── RESEARCH.md            # Research background and concepts
├── scripts/                    # Utility scripts
│   ├── start-servers.sh          # Development server startup
│   ├── sae_inference_service.py  # Optional Python SAE service
│   └── requirements.txt          # Python dependencies
├── public/                     # Static assets
├── package.json                  # Frontend dependencies and scripts
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **npm** or **yarn** package manager
- **Git** for cloning the repository

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd ai-biology-playground

# Install dependencies
npm install
cd api && npm install && cd ..

# Start both servers
./scripts/start-servers.sh
```

### Option 2: Manual Setup

```bash
# Install frontend dependencies
npm install

# Install backend dependencies  
cd api && npm install && cd ..

# Terminal 1: Start backend (port 3002)
cd api && npm start

# Terminal 2: Start frontend (port 5173)
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3002  
- **Health Check**: http://localhost:3002/health

## Development

### Available Scripts

```bash
# Frontend development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking

# Backend development
cd api
npm start           # Start API server
npm run dev         # Start with auto-reload (if available)

# Full stack
./scripts/start-servers.sh  # Start both frontend and backend
```

### Environment Configuration

Create `api/.env` for backend configuration:

```env
API_PORT=3002
AZURE_OPENAI_API_VERSION=2024-06-01
NODE_ENV=development
```

## Documentation

- **[Interactive API Documentation](http://localhost:3002/api-docs)**: Swagger UI for testing and exploring APIs
- **[API Reference](docs/API.md)**: Quick start guide and API overview
- **[Development Guide](docs/DEVELOPMENT.md)**: Setup, architecture, and contribution guide  
- **[Research Background](docs/RESEARCH.md)**: Scientific foundation and methodologies
- **[Contributing Guidelines](docs/CONTRIBUTING.md)**: How to contribute to the project

## Research Foundation

This project is built upon peer-reviewed research in AI interpretability:

### Core Papers

1. **[Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)** (Bricken et al., 2024)
   - 34M+ interpretable features from Claude 3 Sonnet
   - Foundation for the Real SAE Explorer

2. **[Attribution Graphs](https://transformer-circuits.pub/2025/attribution-graphs/methods.html)** (Marks et al., 2025)  
   - Computational pathway discovery methods
   - Basis for Attribution Graph Viewer

3. **[On the Biology of a Large Language Model](https://transformer-circuits.pub/2025/attribution-graphs/biology.html)** (Anthropic, 2025)
   - Comprehensive case studies and applications
   - Inspiration for educational approach

### Research Data Sources

- **SAE Features**: Authentic features from Anthropic's published research
- **Attribution Networks**: Real computational pathways from research models  
- **Safety Classifications**: Validated safety feature datasets
- **Research Metadata**: Original confidence scores and experimental data

## 🎓 Educational Objectives

### Learning Outcomes

Students and researchers will understand:

1. **Feature Interpretability**: How neural networks represent human-interpretable concepts
2. **Computational Pathways**: How models perform multi-step reasoning and inference  
3. **Safety Mechanisms**: How AI systems detect and mitigate harmful outputs
4. **Research Methods**: Actual techniques used in cutting-edge interpretability research

### Hands-On Skills

- **Data Exploration**: Working with authentic research datasets
- **Visualization**: Creating meaningful representations of complex neural network data
- **Analysis**: Interpreting feature activations and attribution patterns
- **Research**: Understanding and applying published methodologies

## Responsible Usage

This project provides **free educational access** to advanced AI research tools. Please use responsibly:

- **Educational Focus**: Designed for learning and research exploration
- **Rate Limiting**: 10 requests per minute to ensure fair access
- **Attribution**: Always cite original research when referencing concepts
- **Ethical Use**: No harmful content generation or safety circumvention

## Contributing

We welcome contributions that enhance the educational value and research accessibility:

- **Bug Reports**: Help improve reliability and user experience
- **New Features**: Add visualizations, tools, or educational content  
- **Documentation**: Improve explanations and examples
- **Research Integration**: Add new research findings and datasets

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

## License

This project is for educational purposes, demonstrating published AI interpretability research. Please respect original research and cite appropriately.

## Acknowledgments

### Research Attribution

All core concepts, methodologies, and data are based on work by:

- **Anthropic Research Team**: SAE research, attribution methods, safety analysis
- **Transformer Circuits Thread**: Foundational interpretability research  
- **AI Safety Community**: Safety research and validation methods

### Educational Mission

This project aims to make cutting-edge AI interpretability research accessible to:
- **Students**: Learning about AI safety and interpretability
- **Researchers**: Exploring new methodologies and applications
- **Educators**: Teaching complex AI concepts through interactive tools
- **Public**: Understanding how AI systems work internally

---

**🔬 Built for Education | Powered by Research | Open for All**

*Making AI interpretability research accessible through interactive exploration and authentic research data.*

## Features & Research Laboratory Tools

This application provides authentic research tools and real data artifacts from AI interpretability research:

### **NEW: Real SAE Explorer** (`RealSAEExplorer.tsx`)
**Direct access to authentic sparse autoencoder features** from published Anthropic research. Search, filter, and interact with actual SAE decompositions including:
- Real feature activation patterns and frequencies
- Authentic top activating tokens from research datasets  
- Example prompts that trigger specific features
- Feature intervention and testing capabilities
- Research-grade metadata and confidence scores

### **NEW: Attribution Graph Viewer** (`AttributionGraphViewer.tsx`)
**3D visualization of real attention flow networks** using authentic attribution data:
- Interactive 3D network graphs with real node relationships
- Authentic attention flow patterns from research models
- Feature attribution pathways and causal connections
- Research-grade network analysis and exploration tools
- Real computational pathway visualization

### **Intervention Laboratory** (`InterventionLaboratory.tsx`)
Experiment with **activation patching** and **causal interventions** in neural networks. Test feature manipulation by artificially modifying intermediate reasoning steps (e.g., changing "Texas" to "California" in reasoning chains). Based on research methodologies for understanding how specific neurons and circuits contribute to model behavior.

### **Multilingual Circuit Mapper** (`MultilingualCircuitMapper.tsx`) 
Visualize **cross-lingual feature representations** and circuit activations across different languages. Explore how models use both language-specific circuits (handling grammar/syntax) and universal circuits (processing concepts that transcend language barriers), demonstrating the "language of thought" - an internal conceptual space shared across languages.

### **Multi-Step Reasoning Playground** (`MultiStepReasoningPlayground.tsx`)
Explore **mechanistic interpretability** of reasoning processes, visualizing how models decompose complex problems into intermediate steps. See how models perform genuine reasoning rather than just memorizing answers, with step-by-step internal pathways like "Dallas is in Texas" → "Texas capital is Austin" → "Austin".

### **Poetry Planning Visualizer** (`PoetryPlanningVisualizer.tsx`)
Analyze **creative generation circuits** and planning mechanisms that guide AI poetry creation. Discover how models plan several words ahead by identifying potential rhyming words before writing each line, revealing sophisticated forward-thinking beyond next-token prediction.

### **Introduction Tour** (`IntroductionTour.tsx`)
Guided walkthrough of AI interpretability concepts and research methodologies.

### **LLM Connector** (`LLMConnector.tsx`)
Pre-configured with **free GPT-4o access** for educational experimentation. No API keys required - ready to use out of the box for exploring AI interpretability research.

## Educational Objectives

This project aims to make **AI interpretability research** accessible through:

- **Interactive visualizations** of neural network internal representations and attribution graphs
- **Hands-on experimentation** with circuit analysis techniques and feature manipulation
- **Parameter manipulation** to understand model behavior changes and causal relationships
- **Educational insights** into mechanistic interpretability methodologies and "AI biology"
- **Real-time demonstrations** of research findings including multi-step reasoning, planning mechanisms, and hallucination detection

## Core Research Concepts

### **Features: Building Blocks of AI Thought**
Just as cells form biological systems, **features** represent interpretable concepts embedded within model activity - patterns corresponding to meaningful concepts like "Dallas is in Texas", "Capital cities", or "Harmful requests".

### **Attribution Graphs: Computational Pathways**
Visual representations showing how models transform inputs to outputs with nodes (individual features), edges (causal interactions), and pathways (step-by-step reasoning chains).

### **Circuit Tracing: Neural Connection Mapping**
Reveals how features connect and interact, creating "wiring diagrams" that show information flow, feature influence patterns, and computational bottlenecks.

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React + TypeScript | Interactive user interface |
| **Build Tool** | Vite | Fast development and build process |
| **3D Visualization** | Three.js (@react-three/fiber) | Neural network and circuit visualizations |
| **Styling** | Material-UI + CSS | Modern, responsive design |
| **Backend API** | Node.js Express | LLM integration and data processing |
| **AI Integration** | GPT-4o (Free Access) | Real-time model interactions for research |
| **Research Data** | Authentic SAE Features | Real sparse autoencoder artifacts from published research |
| **Attribution Networks** | Real Attention Graphs | Genuine computational pathway data |

## 🚀 Quick Start - Research Laboratory

### **Automated Setup (Recommended)**
```bash
# Make scripts executable
chmod +x start-servers.sh test-research-integration.sh

# Start both frontend and backend servers
./start-servers.sh

# In a new terminal, test research artifact integration
./test-research-integration.sh
```

### **Manual Setup**
```bash
# Install dependencies
npm install
cd api && npm install && cd ..

# Start backend (port 3002)
cd api && npm start &

# Start frontend (port 5173)
npm run dev
```

### **Access the Laboratory**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3002
- **Research Artifacts**: Available through the Real SAE Explorer and Attribution Graph Viewer

## Research Foundation & Citations

This project is built upon groundbreaking research in **AI interpretability** and **mechanistic understanding** of large language models. All research concepts and methodologies are based on work by the Anthropic Research Team:

### **Core Research Papers**

1. **Bricken, T., et al.** (2024). **"Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet"**  
   *Transformer Circuits Thread*  
   [Read Paper](https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html)  
   > Demonstrates how to extract millions of interpretable features from production language models.

2. **Marks, S., et al.** (2025). **"Circuit Tracing: Revealing Computational Graphs in Language Models"**  
   *Transformer Circuits Thread*  
   [Read Paper](https://transformer-circuits.pub/2025/attribution-graphs/methods.html)  
   > Introduces methods for mapping computational pathways in transformer architectures.

3. **Anthropic Research Team** (2025). **"On the Biology of a Large Language Model"**  
   *Transformer Circuits Thread*  
   [Read Paper](https://transformer-circuits.pub/2025/attribution-graphs/biology.html)  
   > Comprehensive case studies on Claude 3.5 Haiku demonstrating practical applications across multiple domains and exploring biological analogies in neural network organization.

### **Key Research Discoveries**

- **Multi-Step Reasoning**: Models perform genuine reasoning with identifiable intermediate steps
- **Planning Ahead in Poetry**: Models identify rhyming words before writing lines, showing forward-thinking
- **Multilingual Processing**: Universal vs language-specific computational circuits
- **Hallucination Mechanisms**: Understanding why models fabricate information and how to detect it
- **Feature Manipulation**: Ability to artificially modify reasoning pathways and validate causality

### **Additional Resources**

- **Anthropic Research Hub**: [anthropic.com/research](https://www.anthropic.com/research)
- **Mapping the Mind of a Large Language Model**: [Blog Post](https://www.anthropic.com/news/mapping-the-mind-of-a-large-language-model)
- **Transformer Circuits Publication Series**: [transformer-circuits.pub](https://transformer-circuits.pub/)

> **Citation Note**: This educational tool demonstrates concepts from the above research. All original research credit goes to the Anthropic team and collaborators. Please cite the original papers when referencing these concepts in academic work.

## Getting Started

> **Free AI Access Notice**: This educational tool provides free GPT-4o access to support AI interpretability research. Please use responsibly - this service has real costs and is provided to benefit the educational community.

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **No API keys required** - GPT-4o access is pre-configured

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "AI biology"
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Setup API server**
   ```bash
   cd api
   npm install
   cd ..
   ```

4. **Start development servers**
   
   **Frontend** (Terminal 1):
   ```bash
   npm run dev
   ```
   
   **Backend API** (Terminal 2):
   ```bash
   cd api
   npm start
   ```

5. **Open the application**
   - Navigate to `http://localhost:5173` (or the port shown in your terminal)
   - Begin exploring AI interpretability concepts with free GPT-4o access!

## Responsible Usage Policy

This project provides **free GPT-4o access** for educational purposes. Please help keep this service available by:

- **Using for learning and research only** - Focus on understanding AI interpretability concepts
- **Being mindful of usage** - Avoid excessive requests or automated interactions  
- **Respecting the service** - This is provided at personal cost to support education
- **Staying on topic** - Use the AI for exploring the research concepts demonstrated in this tool

**Rate Limits**: To ensure fair access for all users, requests are limited to maintain service availability.

## Contributing

This is an educational project demonstrating Anthropic's research. Contributions that improve the educational value or add new research demonstrations are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Attribution

This educational platform is built upon research from:
- **Anthropic**: Sparse Autoencoder research and interpretability methods
- **Transformer Circuits Thread**: Foundational interpretability research
- **AI Safety Community**: Safety research methodologies

Please cite the original research papers when using concepts from this platform academically.

---

**Educational Disclaimer**: This project serves as an interactive educational tool to understand and demonstrate AI interpretability research. All core research concepts belong to their original authors at Anthropic and collaborating institutions.
