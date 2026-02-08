# 🧮 AlgoLab - Interactive Algorithm Visualizer

AlgoLab is an interactive platform designed to help you learn and understand algorithms through step-by-step visualizations. Explore sorting, searching, graph algorithms, and more in a hands-on environment.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vite** | Fast build tool & dev server |
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI components |
| **Netlify Functions** | Serverless backend (AI Chatbot) |
| **OpenRouter API** | AI-powered algorithm tutor |

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Netlify CLI** (optional, for full features) - installed automatically with dependencies

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_GIT_URL>
cd Algo-Lab
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables (for AI Chatbot)

Create a `.env` file in the root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> 💡 Get your API key from [OpenRouter](https://openrouter.ai/)

### 4. Run the development server

**Option A: Without AI Chatbot (Vite only)**
```bash
npm run dev:vite
```
Opens at: `http://localhost:5173`

**Option B: With AI Chatbot (Netlify Dev)**
```bash
npm run dev:netlify
```
Opens at: `http://localhost:8888`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev:vite` | Start Vite dev server (no backend) |
| `npm run dev:netlify` | Start with Netlify Functions (AI Chatbot) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📁 Project Structure

```
Algo-Lab/
├── src/
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── AlgorithmVisualizer.tsx
│   │   ├── AlgorithmBattle.tsx
│   │   ├── LearningTest.tsx
│   │   └── Docs.tsx
│   ├── components/         # Reusable UI components
│   ├── algorithms/         # Algorithm implementations
│   └── App.tsx             # Main app entry
├── netlify/
│   └── functions/          # Serverless functions
│       └── chatbot.js      # AI Tutor API
├── public/                 # Static assets
├── package.json
├── netlify.toml            # Netlify configuration
├── vite.config.ts          # Vite configuration
└── tailwind.config.ts      # Tailwind configuration
```

## ✨ Features

- 📊 **Interactive Visualizations** - Step-by-step algorithm animations
- 🤖 **AI Tutor** - Ask questions about any algorithm
- ⚔️ **Algorithm Battle** - Compare algorithms side by side
- 📚 **Learning Tests** - Practice with algorithm problems
- 🎨 **Modern UI** - Clean, responsive design

## 🌐 Deployment

This project is configured for **Netlify** deployment:

1. Push your code to GitHub
2. Connect your repo to Netlify
3. Set the `OPENROUTER_API_KEY` environment variable in Netlify dashboard
4. Deploy!

Build settings are already configured in `netlify.toml`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

TEKERS License
