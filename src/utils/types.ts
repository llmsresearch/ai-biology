// Core data structures for AI Biology research visualization

export interface AttentionHead {
  layer: number;
  head: number;
  pattern: number[][];
  description: string;
}

export interface NeuronActivation {
  layer: number;
  position: number;
  activation: number;
  concept: string;
  examples: string[];
}

export interface Feature {
  id: string;
  name: string;
  activation: number;
  layer: number;
  confidence: number;
  type: string; // e.g., 'concept', 'location', 'relation', 'landmark'
  description: string;
  position?: { x: number; y: number; z: number };
}

export interface Connection {
  id: string;
  from: string; // feature ID
  to: string;   // feature ID
  strength: number;
  type: string; // e.g., 'causal', 'associative'
  confidence: number;
}

export interface ReasoningStep {
  id: string;
  description: string;
  features: Feature[];
  connections: Connection[];
  confidence: number;
  timestamp: number; // For ordering/animation if needed
}

export interface InterventionResult {
  experimentName?: string;
  originalPrompt?: string;
  originalOutput: string;
  modifiedOutput: string;
  interventionType: 'ablation' | 'activation' | 'modification';
  targetFeatures: string[]; // IDs of features intervened on
  strength?: number;
  confidence: number;
  simulatedEffectDescription?: string;
}

export interface CircuitVisualization {
  features: Feature[];
  connections: Array<{
    from: string;
    to: string;
    strength: number;
    type: string;
  }>;
}

export interface LLMResponse {
  text: string;
  confidence: number;
  reasoningSteps?: ReasoningStep[];
  activatedFeatures?: Feature[];
}

// Definition moved from LLMConnector.tsx
export interface LLMConnectionConfig {
  selectedProvider: string;
  modelName: string;
  isSponsored?: boolean;
  apiEndpoint?: string; // For proxied or direct backend calls (e.g., /api/azure-openai/free or /api/llm/proxy)
  proxyDetails?: { // For user-provided keys that go through our /api/llm/proxy
    providerType: string; // 'azure', 'openai', 'anthropic'
    apiKey?: string;
    endpoint?: string; // e.g., Azure resource endpoint
    deploymentName?: string; // e.g., Azure deployment name for their own key
    apiVersion?: string;
  };
  ollamaBaseUrl?: string; // For Ollama direct connections (currently not proxied by server.js)
  apiKey?: string; // For direct custom connections (e.g. provider 'custom' might use this with customEndpoint)
  customEndpoint?: string; // For direct custom connections (currently not proxied by server.js)
  supportsFeaturesExtraction?: boolean; // Example of an existing property, might not be used by all
}