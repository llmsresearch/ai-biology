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

// ===== REAL RESEARCH ARTIFACT TYPES =====
// Based on Anthropic's sparse autoencoder and attribution graph research

// SAE Feature Types (based on Anthropic's monosemanticity research)
export interface SAEFeature {
  id: string;
  index: number;
  description: string;
  explanation: string;
  layer: number;
  neuron_weight_vector: number[]; // Decoder weights
  activation_frequency: number;
  top_activating_tokens: Array<{
    token: string;
    activation: number;
    context: string;
  }>;
  example_prompts: Array<{
    text: string;
    activation_strength: number;
    highlighted_spans: Array<{
      start: number;
      end: number;
      activation: number;
    }>;
  }>;
  category: 'syntactic' | 'semantic' | 'factual' | 'logical' | 'safety' | 'other';
  confidence_score: number;
}

// Attribution Graph Types (based on McDougall et al., 2025)
export interface AttributionNode {
  id: string;
  type: 'input' | 'hidden' | 'output' | 'feature';
  layer?: number;
  position: number; // Position in layer
  activation: number;
  feature_info?: SAEFeature;
  description: string;
  coordinates: { x: number; y: number; z: number }; // For 3D visualization
}

export interface AttributionEdge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  weight: number; // Attribution strength (-1 to 1)
  type: 'direct' | 'indirect' | 'residual';
  layer_span: [number, number]; // [source_layer, target_layer]
  confidence: number;
}

export interface AttributionGraph {
  id: string;
  prompt: string;
  target_token: string;
  nodes: AttributionNode[];
  edges: AttributionEdge[];
  metadata: {
    model: string;
    creation_date: string;
    total_attribution_accounted: number;
    methodology: string;
  };
}

// Research Artifact Types
export interface ResearchArtifact {
  id: string;
  type: 'sae_features' | 'attribution_graph' | 'circuit_analysis';
  title: string;
  description: string;
  paper_reference: string;
  data_url?: string;
  example_prompts: string[];
  metadata: Record<string, any>;
}

// Real SAE Operations
export interface SAEInferenceRequest {
  activations: number[]; // Residual stream activations
  layer: number;
  position?: number; // Token position
}

export interface SAEInferenceResult {
  feature_activations: Record<string, number>; // feature_id -> activation_strength
  reconstruction: number[];
  reconstruction_loss: number;
  sparsity: number; // L0 norm
  top_features: Array<{
    feature_id: string;
    activation: number;
    description: string;
  }>;
}

// Search parameters for SAE features
export interface FeatureSearchParams {
  query?: string;
  layer?: number;
  category?: 'syntactic' | 'semantic' | 'factual' | 'logical' | 'safety' | 'other';
  minActivationFreq?: number;
  maxActivationFreq?: number;
  limit?: number;
}