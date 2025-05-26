import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Feature, ReasoningStep, LLMConnectionConfig } from '../utils/types';
import { llmService } from '../utils/llmService';
import { Theme } from '@mui/material/styles';

// Fallback component when WebGL fails
const WebGLFallback = ({ children }: { children: React.ReactNode }) => (
  <Box 
    sx={{ 
      height: '400px', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      border: '1px dashed rgba(255,255,255,0.3)',
      borderRadius: '4px',
      padding: 2
    }}
  >
    <Alert severity="warning" sx={{ mb: 2 }}>
      WebGL visualization unavailable. Using simplified view instead.
    </Alert>
    {children}
  </Box>
);

const MultiStepReasoningPlayground: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("Explain how a large language model might answer the question: What is the capital of the country where the Eiffel Tower is located?");
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);
  const [llmReasoningOutput, setLlmReasoningOutput] = useState<string>('');
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedFeature3D, setSelectedFeature3D] = useState<Feature | null>(null);
  const [showRawOutput, setShowRawOutput] = useState<boolean>(false);
  const [webGLFailed, setWebGLFailed] = useState<boolean>(false);

  const examplePrompts = [
    "Explain how a large language model might answer the question: What is the capital of the country where the Eiffel Tower is located?",
    "Describe the internal steps a model might take to determine the primary material of the Statue of Liberty.",
    "If a model is asked to write a short story about a cat who visits the moon, what conceptual steps might it take?",
    "How would an LLM deduce the answer to: Which US president signed the act that established Yellowstone National Park?"
  ];

  const simulate3DReasoning = (basedOnPrompt: string) => {
    let steps: ReasoningStep[] = [];
    if (basedOnPrompt.toLowerCase().includes("eiffel tower")) {
      steps = [
        {
          id: 'step1-eiffel',
          description: 'Identify Key Entity: Eiffel Tower',
          features: [{ id: 'eiffel-tower', name: 'Eiffel Tower', activation: 0.9, layer: 5, confidence: 0.9, type: 'landmark', description: 'Recognized Eiffel Tower', position: { x: -2, y: 1, z: 0 } }],
          connections: [],
          confidence: 0.9, timestamp: Date.now()
        },
        {
          id: 'step2-paris',
          description: 'Location Association: Eiffel Tower in Paris',
          features: [{ id: 'paris-city', name: 'Paris', activation: 0.88, layer: 8, confidence: 0.88, type: 'location', description: 'Paris, France', position: { x: 0, y: 1, z: 0 } }],
          connections: [{ id: 'conn-eiffel-paris', from: 'eiffel-tower', to: 'paris-city', strength: 0.85, type: 'causal', confidence: 0.85 }],
          confidence: 0.88, timestamp: Date.now() + 500
        },
        {
            id: 'step3-france',
            description: 'Country Association: Paris in France',
            features: [{ id: 'france-country', name: 'France', activation: 0.92, layer: 10, confidence: 0.92, type: 'location', description: 'Country: France', position: { x: 0, y: -1, z: 0 } }],
            connections: [{ id: 'conn-paris-france', from: 'paris-city', to: 'france-country', strength: 0.9, type: 'causal', confidence: 0.9 }],
            confidence: 0.92, timestamp: Date.now() + 1000
        },
        {
          id: 'step4-capital',
          description: 'Capital Retrieval: Capital of France is Paris',
          features: [{ id: 'paris-capital', name: 'Capital: Paris', activation: 0.95, layer: 12, confidence: 0.95, type: 'relation', description: 'Paris is the capital of France', position: { x: 2, y: 1, z: 0 } }],
          connections: [{ id: 'conn-france-capital', from: 'france-country', to: 'paris-capital', strength: 0.9, type: 'causal', confidence: 0.9 }],
          confidence: 0.95, timestamp: Date.now() + 1500
        }
      ];
    } else {
      steps = [
        { id: 'generic-step1', description: 'Initial Processing', features: [], connections: [], confidence: 0.8, timestamp: Date.now() },
        { id: 'generic-step2', description: 'Intermediate Analysis', features: [], connections: [], confidence: 0.7, timestamp: Date.now() + 500 },
      ];
    }
    setReasoningSteps(steps);
    let currentAnimatedStep = 0;
    const interval = setInterval(() => {
        if (currentAnimatedStep < steps.length -1) {
            setActiveStepIdx(prev => prev + 1);
            currentAnimatedStep++;
        } else {
            clearInterval(interval);
        }
    }, 800);
  };

  const analyzeWithLLM = async () => {
    setAnalyzing(true);
    setLlmReasoningOutput('');
    setReasoningSteps([]);
    setActiveStepIdx(0);
    setError('');
    setWebGLFailed(false);

    try {
      const messages = [
        { role: "system" as const, content: "You are an AI assistant specialized in explaining the internal reasoning steps of language models. When given a question or a task, describe a plausible sequence of internal conceptual steps an LLM might take to arrive at the answer or complete the task. Present these steps clearly, for example, as a numbered list. Focus on the conceptual flow, not the specific neural activations unless you are simulating them." },
        { role: "user" as const, content: prompt }
      ];

      const outputText = await llmService.sendMessage(messages, prompt);
      setLlmReasoningOutput(outputText);
      simulate3DReasoning(prompt);

    } catch (err: any) {
      console.error("[MultiStepReasoning] Error fetching LLM reasoning:", err);
      setError(err.message || "Failed to fetch reasoning from LLM. Check API server and connection.");
    } finally {
      setAnalyzing(false);
    }
  };

  const FeatureNode3D = ({ feature, onClick }: { feature: Feature; onClick: () => void }) => {
    const colorMapping: { [key: string]: string } = {
      concept: '#667eea',
      location: '#764ba2',
      relation: '#f093fb',
      action: '#4facfe',
      linguistic: '#43e97b',
      landmark: '#ffeb3b'
    };
    const color = colorMapping[feature.type] || '#90A4AE';

    return (
      <Sphere
        position={[feature.position?.x || 0, feature.position?.y || 0, feature.position?.z || 0]}
        args={[0.3, 16, 16]}
        onClick={onClick}
      >
        <meshStandardMaterial color={color} transparent opacity={0.9} />
      </Sphere>
    );
  };

  const ConnectionLine3D = ({ from, to }: { from: Feature; to: Feature }) => {
    const points = [
      new THREE.Vector3(from.position?.x || 0, from.position?.y || 0, from.position?.z || 0),
      new THREE.Vector3(to.position?.x || 0, to.position?.y || 0, to.position?.z || 0)
    ];
    return <Line points={points} color="#B0BDC8" lineWidth={1.5} transparent opacity={0.6}/>;
  };

  const AttributionGraph3D = () => {
    if (reasoningSteps.length === 0) return null;

    const currentDisplayStep = reasoningSteps[activeStepIdx];
    const allFeatures = reasoningSteps.slice(0, activeStepIdx + 1).flatMap(step => step.features);
    const allConnections = reasoningSteps.slice(0, activeStepIdx + 1).flatMap(step => step.connections);

    // 2D fallback content
    const FallbackContent = () => (
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>Features in Current Step:</Typography>
        <List>
          {allFeatures.map((feature) => (
            <ListItem 
              key={feature.id} 
              onClick={() => setSelectedFeature3D(feature)}
              sx={{ 
                cursor: 'pointer',
                backgroundColor: selectedFeature3D?.id === feature.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderRadius: 1,
                mb: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
              }}
            >
              <ListItemText 
                primary={feature.name} 
                secondary={`Type: ${feature.type} | Activation: ${feature.activation?.toFixed(2)}`} 
              />
            </ListItem>
          ))}
        </List>
        
        {allConnections.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Connections:</Typography>
            <List dense>
              {allConnections.map((conn) => {
                const fromFeature = allFeatures.find(f => f.id === conn.from);
                const toFeature = allFeatures.find(f => f.id === conn.to);
                if (fromFeature && toFeature) {
                  return (
                    <ListItem key={conn.id}>
                      <ListItemText 
                        primary={`${fromFeature.name} → ${toFeature.name}`} 
                        secondary={`Strength: ${conn.strength?.toFixed(2)}`} 
                      />
                    </ListItem>
                  );
                }
                return null;
              })}
            </List>
          </>
        )}
      </Box>
    );
    
    // Return early with fallback if WebGL has failed
    if (webGLFailed) {
      return <WebGLFallback><FallbackContent /></WebGLFallback>;
    }

    try {
      return (
        <Canvas 
          style={{ height: '400px', background: 'transparent' }} 
          camera={{ position: [0, 1, 7], fov: 50 }}
          onError={() => setWebGLFailed(true)}
          dpr={1.5} // Limit pixel ratio for performance
        >
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          
          {allFeatures.map(feature => (
            <FeatureNode3D 
              key={feature.id} 
              feature={feature} 
              onClick={() => setSelectedFeature3D(feature)}
            />
          ))}

          {allConnections.map(conn => {
            const fromFeature = allFeatures.find(f => f.id === conn.from);
            const toFeature = allFeatures.find(f => f.id === conn.to);
            if (fromFeature && toFeature) {
              return <ConnectionLine3D key={conn.id} from={fromFeature} to={toFeature} />;
            }
            return null;
          })}

          {allFeatures.map(feature => (
            <Text
              key={`label-${feature.id}`}
              position={[
                (feature.position?.x || 0),
                (feature.position?.y || 0) + 0.45,
                feature.position?.z || 0
              ]}
              fontSize={0.15}
              color="#E0E0E0"
              anchorX="center"
              anchorY="middle"
              maxWidth={1.5}
            >
              {feature.name}
            </Text>
          ))}
        </Canvas>
      );
    } catch (error) {
      console.error("Error rendering 3D canvas:", error);
      setWebGLFailed(true);
      return <WebGLFallback><FallbackContent /></WebGLFallback>;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 1 }}>
        Multi-Step Reasoning Explorer
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, opacity: 0.85, color: 'text.secondary' }}>
        Enter a complex question or task to see a step-by-step conceptual breakdown from a connected LLM. This playground demonstrates how models perform genuine reasoning with intermediate steps.
        <br/>The 3D graph below offers a <em>conceptual visualization</em> of how internal features might activate and connect during such a process.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className="glass-card" sx={{ p: {xs:2, md:3}, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{color: 'text.primary'}}>
              Your Question / Task
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a question that requires multi-step reasoning..."
              sx={{ mb: 2 }}
            />
            
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Example prompts:
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {examplePrompts.map((example, index) => (
                <Chip
                  key={index}
                  label={example}
                  onClick={() => setPrompt(example)}
                  size="small"
                  variant="outlined"
                  sx={{ cursor: 'pointer'}}
                />
              ))}
            </Box>

            <Button 
              variant="contained" 
              color="primary" 
              onClick={analyzeWithLLM} 
              disabled={analyzing}
              fullWidth
              sx={{ mb: 2, py: 1.5 }}
            >
              {analyzing ? <CircularProgress size={24} color="inherit" /> : "Analyze Reasoning with LLM"}
            </Button>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {llmReasoningOutput && (
              <Box sx={{ mt: 2, flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1}}>
                    <Typography variant="h6" sx={{color: 'text.primary'}}>LLM's Reasoning Steps:</Typography>
                    <IconButton onClick={() => setShowRawOutput(!showRawOutput)} size="small">
                        <ExpandMoreIcon sx={{ transform: showRawOutput ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}} />
                    </IconButton>
                </Box>
                <Collapse in={showRawOutput} timeout="auto" unmountOnExit>
                  <Paper variant="outlined" sx={{ p: 2, maxHeight: '300px', overflowY: 'auto', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(0,0,0,0.25)', borderColor: 'rgba(255,255,255,0.2)' }}>
                    <Typography component="pre" variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary'}}>
                        {llmReasoningOutput}
                    </Typography>
                  </Paper>
                </Collapse>
                {!showRawOutput && (
                     <Typography variant="body2" sx={{fontStyle: 'italic', color: 'text.secondary'}}>
                        Click the expand icon to view the LLM's detailed textual output.
                    </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper className="glass-card" sx={{ p: {xs:2, md:3}, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{color: 'text.primary'}}>
              Conceptual 3D Visualization
            </Typography>
            {reasoningSteps.length > 0 && (
                <Typography variant="caption" display="block" sx={{mb:1, color: 'text.secondary'}}>
                    This is a conceptual animation based on the prompt's theme.
                </Typography>
            )}
            
            {analyzing && reasoningSteps.length === 0 && (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '400px' }}>
                <CircularProgress />
                <Typography sx={{ml: 2, color: 'text.secondary'}}>Preparing visualization...</Typography>
              </Box>
            )}
            
            {!analyzing && reasoningSteps.length === 0 && !llmReasoningOutput && (
                 <Alert severity="info" sx={{mt:2}}>
                    Enter a prompt and click "Analyze Reasoning" to see the LLM output and a conceptual 3D graph.
                </Alert>
            )}

            {reasoningSteps.length > 0 && (
              <Box>
                <AttributionGraph3D />
                <Stepper activeStep={activeStepIdx} orientation="vertical" sx={{ mt: 2 }}>
                  {reasoningSteps.map((step, index) => (
                    <Step key={step.id}>
                      <StepLabel 
                        onClick={() => setActiveStepIdx(index)} 
                        sx={{ cursor: 'pointer', 
                              transition: 'background-color 0.2s',
                              '&:hover': { backgroundColor: (theme: Theme) => theme.palette.action.hover },
                              '.MuiStepLabel-label': {color: 'text.primary'} 
                            }}
                      >
                        {step.description}
                      </StepLabel>
                      <StepContent sx={{borderColor: 'primary.dark'}}>
                        <Typography variant="caption" sx={{color: 'text.secondary'}}>Confidence: {step.confidence}</Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            )}

            {selectedFeature3D && (
              <Card className="glass-card" sx={{ mt: 2, p: 1.5, background: (theme: Theme) => theme.palette.background.paper + 'aa' }}>
                <CardContent sx={{py: '12px !important'}}>
                  <Typography variant="h6">Selected Feature: {selectedFeature3D.name}</Typography>
                  <Typography sx={{color: 'text.secondary'}}>Type: {selectedFeature3D.type}</Typography>
                  <Typography sx={{color: 'text.secondary'}}>Activation: {selectedFeature3D.activation?.toFixed(2)}</Typography>
                  <Typography sx={{color: 'text.secondary'}}>Layer: {selectedFeature3D.layer}</Typography>
                  <Typography sx={{color: 'text.secondary'}}>Description: {selectedFeature3D.description}</Typography>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MultiStepReasoningPlayground;