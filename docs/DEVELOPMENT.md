# Development Guide

## Project Overview

AI Biology Playground is an interactive research laboratory for exploring AI interpretability concepts through authentic research data and visualizations.

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Material-UI (MUI) with custom themes
- **3D Graphics**: Three.js with @react-three/fiber
- **State Management**: React hooks and context

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express framework
- **APIs**: RESTful endpoints for research data
- **AI Integration**: Azure OpenAI (GPT-4o) for educational use
- **Data**: Authentic SAE features and attribution graphs

## Project Structure

```
ai-biology-playground/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── AppLayout.tsx        # Main application layout
│   │   ├── RealSAEExplorer.tsx  # SAE feature explorer
│   │   ├── AttributionGraphViewer.tsx  # 3D graph visualization
│   │   ├── SafetyFeaturesDetector.tsx  # Safety analysis
│   │   ├── FeatureAttributionVisualizer.tsx  # Feature analysis
│   │   ├── IntroductionTour.tsx # Educational tour
│   │   └── APIPlayground.tsx    # API testing interface
│   ├── utils/                   # Utility functions and types
│   │   └── types.ts            # TypeScript type definitions
│   ├── App.tsx                 # Root application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── api/                        # Backend API server
│   ├── server.js               # Express server with all endpoints
│   ├── package.json            # Backend dependencies
│   └── .env.example           # Environment variables template
├── docs/                       # Documentation
│   ├── API.md                 # API documentation
│   ├── DEVELOPMENT.md         # This file
│   ├── CONTRIBUTING.md        # Contribution guidelines
│   └── RESEARCH.md            # Research background
├── public/                     # Static assets
│   └── assets/                # Images and icons
├── package.json               # Frontend dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Main project documentation
```

## Setup for Development

### Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-biology-playground
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd api
   npm install
   cd ..
   ```

4. **Environment setup**
   ```bash
   # Copy environment template
   cp api/.env.example api/.env
   
   # Edit environment variables as needed
   nano api/.env
   ```

### Development Commands

#### Frontend Development
```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

#### Backend Development
```bash
# Start API server (http://localhost:3002)
cd api
npm start

# Start with auto-reload (if nodemon is installed)
npm run dev
```

#### Full Stack Development
```bash
# Start both frontend and backend (from root directory)
./start-servers.sh
```

## Component Architecture

### Core Components

#### AppLayout.tsx
- Main application shell with navigation
- Responsive drawer/sidebar for tool selection
- Theme switching functionality
- Tool description and metadata display

#### RealSAEExplorer.tsx
- Explores authentic sparse autoencoder features
- Search and filtering capabilities
- Feature details and activation patterns
- Interactive feature testing

#### AttributionGraphViewer.tsx
- 3D visualization of attribution networks
- Interactive graph exploration
- Node and edge relationship display
- Real-time graph manipulation

#### SafetyFeaturesDetector.tsx
- Safety-relevant feature detection
- Risk assessment and scoring
- Content analysis and recommendations
- Real-time safety monitoring

### Data Flow

1. **User Interaction** → Component state changes
2. **Component** → API request via fetch/axios
3. **API Server** → Data processing and LLM integration
4. **Response** → Component state update
5. **UI Update** → Visual feedback to user

### State Management

- **Local State**: React useState for component-specific data
- **Theme State**: React Context for dark/light mode
- **API State**: Custom hooks for data fetching and caching
- **No external state management** (Redux, Zustand) to keep it simple

## API Integration

### Authentication
- No authentication required for educational use
- Rate limiting applied (10 requests/minute per IP)

### Error Handling
```typescript
// Standard error handling pattern
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Error:', error);
  // Show user-friendly error message
}
```

### Data Types
```typescript
// Core types defined in src/utils/types.ts
interface SAEFeature {
  id: string;
  layer: number;
  position: number;
  description: string;
  activation_frequency: number;
  top_tokens: string[];
  example_prompts: string[];
  confidence: number;
}

interface AttributionNode {
  id: string;
  feature_id: string;
  description: string;
  activation: number;
  layer: number;
  position: [number, number, number];
}
```

## Styling Guidelines

### Material-UI Theme
- **Primary Color**: #7A00E6 (Purple)
- **Secondary Color**: #1976d2 (Blue)
- **Dark Mode**: Full support with automatic switching
- **Responsive**: Mobile-first design with breakpoints

### Component Styling
```typescript
// Use sx prop for styling
<Box sx={{ 
  p: 2, 
  borderRadius: 1, 
  bgcolor: 'background.paper',
  boxShadow: 1 
}}>
  Content
</Box>

// Custom styles for special cases
const useStyles = () => ({
  customComponent: {
    '& .MuiButton-root': {
      textTransform: 'none'
    }
  }
});
```

## Testing

### Manual Testing
1. Start both frontend and backend servers
2. Navigate through all components
3. Test API endpoints using the API Playground
4. Verify 3D visualizations load correctly
5. Test responsive design on mobile

### API Testing
```bash
# Test health endpoint
curl http://localhost:3002/health

# Test SAE features
curl "http://localhost:3002/api/sae/features?limit=5"

# Test safety analysis
curl -X POST http://localhost:3002/api/safety/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Sample text", "threshold": 0.8}'
```

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Vite automatically splits components
- **Lazy Loading**: Heavy 3D components load on demand
- **Memoization**: Use React.memo for expensive components
- **Asset Optimization**: Images and icons optimized for web

### Backend Optimization
- **Rate Limiting**: Prevents API abuse
- **Response Caching**: Cache expensive computations
- **Error Handling**: Graceful failure with informative messages
- **Memory Management**: Clean up resources after requests

## Common Development Tasks

### Adding a New Component
1. Create component file in `src/components/`
2. Add TypeScript interfaces in `src/utils/types.ts`
3. Update `AppLayout.tsx` to include in navigation
4. Add documentation to this guide

### Adding a New API Endpoint
1. Add route handler in `api/server.js`
2. Update API documentation in `docs/API.md`
3. Add TypeScript types for request/response
4. Test endpoint manually and document usage

### Updating Dependencies
```bash
# Check for outdated packages
npm outdated

# Update frontend dependencies
npm update

# Update backend dependencies
cd api && npm update && cd ..
```

## Debugging

### Frontend Debugging
- Use React Developer Tools browser extension
- Console logging with structured data
- Network tab for API request debugging
- Vite's built-in error overlay

### Backend Debugging
- Console logging with timestamps
- API request/response logging
- Error stack traces in development
- Rate limiting logs for monitoring

### Common Issues

1. **CORS Errors**: Ensure API server allows frontend origin
2. **Build Failures**: Check TypeScript errors and dependencies
3. **API Timeouts**: Verify backend server is running
4. **3D Rendering Issues**: Check WebGL support in browser

## Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files from dist/ directory
```

### Backend Deployment
```bash
# Install production dependencies
cd api && npm install --production

# Start server with PM2 or similar process manager
pm2 start server.js --name ai-biology-api
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

## Research Data Sources

This project uses authentic research data from:
- **Anthropic SAE Research**: Real sparse autoencoder features
- **Attribution Research**: Genuine computational pathway data
- **Safety Research**: Actual safety feature classifications

All data is used with proper attribution for educational purposes.
