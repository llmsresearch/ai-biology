# 🧬 AI Biology Playground

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)

> **Educational Visualization Tool** | Exploring LLM Internals through Interactive Demos

An interactive web application designed to **visualize and explore** the groundbreaking AI interpretability research conducted by the [Anthropic Research Team](https://www.anthropic.com/research). This project serves as an educational tool to understand complex AI model internals, circuit analysis, and mechanistic interpretability through hands-on experimentation.

![image](https://github.com/user-attachments/assets/c5c84302-3802-4979-a8ca-d57b48520ef3)


This research introduces a new paradigm for understanding how large language models think internally by developing an "AI microscope" that reveals computational pathways and internal mechanisms. By drawing inspiration from neuroscience, it provides the first detailed look inside frontier language models like Claude.

> ⚠️ **Research Attribution**: This project is created for educational purposes to demonstrate and explain the research methodologies and findings published by Anthropic. All core research concepts, methodologies, and insights belong to the original Anthropic research team.

## Features & Interactive Playgrounds

This application provides interactive demonstrations of cutting-edge AI interpretability research:

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

This project is for educational purposes. Please respect the original research and cite appropriately.

---

**Educational Disclaimer**: This project serves as an interactive educational tool to understand and demonstrate AI interpretability research. All core research concepts belong to their original authors at Anthropic and collaborating institutions.
