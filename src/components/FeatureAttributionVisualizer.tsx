import React, { useState, useMemo } from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  useTheme
} from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// Purple color constant for consistency
const PURPLE_COLOR = '#7A00E6';


// Fallback component when WebGL fails
const WebGLFallback = ({ children, isDarkMode }: { children: React.ReactNode; isDarkMode: boolean }) => (
  <Box 
    sx={{ 
      height: '450px', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      border: `1px dashed ${isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
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

interface AttributionFeature {
  id: string;
  name: string;
  activation: number;
  attribution: number;
  layer: number;
  position: { x: number; y: number; z: number };
  description: string;
  category: 'syntactic' | 'semantic' | 'factual' | 'logical' | 'safety';
  confidence: number;
}

interface AttributionConnection {
  id: string;
  from: string;
  to: string;
  strength: number;
  type: 'excitatory' | 'inhibitory' | 'modulating';
}

interface AttributionAnalysis {
  features: AttributionFeature[];
  connections: AttributionConnection[];
  targetToken: string;
  explanation: string;
  confidence: number;
}

const FeatureAttributionVisualizer: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [inputText, setInputText] = useState<string>("The Eiffel Tower, located in Paris, France, was completed in 1889.");
  const [targetToken, setTargetToken] = useState<string>("Paris");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [attributionData, setAttributionData] = useState<AttributionAnalysis | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<AttributionFeature | null>(null);
  const [error, setError] = useState<string>('');
  const [webGLFailed, setWebGLFailed] = useState<boolean>(false);
  const [showOnlySignificant, setShowOnlySignificant] = useState<boolean>(true);
  const [attributionThreshold, setAttributionThreshold] = useState<number>(0.1);
  const [viewMode, setViewMode] = useState<'attribution' | 'activation' | 'both'>('attribution');

  const exampleInputs = useMemo(() => [
    "The Eiffel Tower, located in Paris, France, was completed in 1889.",
    "Albert Einstein developed the theory of relativity in the early 20th century.",
    "The quick brown fox jumps over the lazy dog.",
    "Quantum computers use quantum bits called qubits to process information.",
    "Climate change is causing rising sea levels around the world.",
    "Machine learning models can recognize patterns in large datasets."
  ], []);

  const exampleTokens = useMemo(() => [
    "Paris", "Einstein", "fox", "quantum", "climate", "patterns"
  ], []);

  const categoryColors = useMemo(() => ({
    syntactic: '#FF6B6B',
    semantic: '#4ECDC4', 
    factual: '#45B7D1',
    logical: '#96CEB4',
    safety: '#FFEAA7'
  }), []);

  const analyzeAttribution = async () => {
    if (!inputText.trim() || !targetToken.trim()) {
      setError('Please provide both input text and target token');
      return;
    }

    setAnalyzing(true);
    setError('');
    setAttributionData(null);
    setSelectedFeature(null);

    try {
      console.log(`Analyzing attribution for token "${targetToken}" in text: "${inputText}"`);
      
      const response = await fetch('/api/features/attribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText: inputText.trim(),
          targetToken: targetToken.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const analysisData = await response.json();
      console.log(`Received attribution analysis with ${analysisData.features.length} features`);
      setAttributionData(analysisData);

    } catch (error) {
      console.error('Attribution analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
      
      // Enhanced fallback with context-aware mock data
      const fallbackData = generateFallbackAttribution(inputText, targetToken);
      setAttributionData(fallbackData);
    } finally {
      setAnalyzing(false);
    }
  };

  // Enhanced fallback function for when API fails
  const generateFallbackAttribution = (text: string, token: string): AttributionAnalysis => {
    const textLower = text.toLowerCase();
    const tokenLower = token.toLowerCase();
    
    // Context-aware feature generation
    const features: AttributionFeature[] = [];
    
    // Add context-specific features based on text content
    if (textLower.includes('paris') || textLower.includes('france') || textLower.includes('eiffel')) {
      features.push({
        id: 'feature-geo-1',
        name: "Geographic Entity Recognition",
        activation: 0.92,
        attribution: 0.85,
        layer: 15,
        position: { x: -2, y: 1, z: 0 },
        description: "Identifies geographical locations and places",
        category: 'factual',
        confidence: 0.9
      });
    }
    
    if (textLower.includes('einstein') || textLower.includes('relativity') || textLower.includes('quantum')) {
      features.push({
        id: 'feature-sci-1',
        name: "Scientific Knowledge",
        activation: 0.88,
        attribution: 0.91,
        layer: 19,
        position: { x: 0, y: 2, z: 1 },
        description: "Encodes scientific facts and theories",
        category: 'factual',
        confidence: 0.92
      });
    }
    
    // Always include general features
    features.push(
      {
        id: 'feature-syn-1',
        name: "Proper Noun Detection",
        activation: 0.88,
        attribution: 0.72,
        layer: 8,
        position: { x: 1, y: 0, z: -1 },
        description: "Recognizes proper nouns and capitalized entities",
        category: 'syntactic',
        confidence: 0.85
      },
      {
        id: 'feature-sem-1',
        name: "Contextual Understanding",
        activation: 0.69,
        attribution: 0.55,
        layer: 12,
        position: { x: -1, y: -1, z: 1 },
        description: "Links entities mentioned in context with their properties",
        category: 'semantic',
        confidence: 0.82
      }
    );

    const connections: AttributionConnection[] = [
      {
        id: 'conn-1',
        from: features[0].id,
        to: features[features.length - 1].id,
        strength: 0.6,
        type: 'excitatory'
      }
    ];

    return {
      features,
      connections,
      targetToken: token,
      explanation: `Fallback attribution analysis for "${token}" shows ${features.length} relevant features.`,
      confidence: 0.75
    };
  };

  // 3D Visualization Component
  const FeatureNode3D = ({ feature, onClick }: { feature: AttributionFeature; onClick: () => void }) => {
    const color = categoryColors[feature.category];
    const size = showOnlySignificant && Math.abs(feature.attribution) < attributionThreshold ? 0.1 : 
                 0.2 + Math.abs(feature.attribution) * 0.3;
    
    const opacity = viewMode === 'attribution' ? Math.abs(feature.attribution) : 
                   viewMode === 'activation' ? feature.activation :
                   (Math.abs(feature.attribution) + feature.activation) / 2;

    return (
      <Sphere
        position={[feature.position.x, feature.position.y, feature.position.z]}
        args={[size, 16, 16]}
        onClick={onClick}
      >
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.7 + opacity * 0.3}
          emissive={selectedFeature?.id === feature.id ? new THREE.Color(color) : new THREE.Color(0x000000)}
          emissiveIntensity={selectedFeature?.id === feature.id ? 0.3 : 0}
        />
      </Sphere>
    );
  };

  const ConnectionLine3D = ({ from, to, connection }: { 
    from: AttributionFeature; 
    to: AttributionFeature;
    connection: AttributionConnection;
  }) => {
    const color = connection.type === 'inhibitory' ? '#FF4444' : 
                 connection.type === 'excitatory' ? '#44FF44' : '#FFAA44';
    
    return (
      <Line 
        points={[
          new THREE.Vector3(from.position.x, from.position.y, from.position.z),
          new THREE.Vector3(to.position.x, to.position.y, to.position.z)
        ]}
        color={color}
        lineWidth={1 + connection.strength * 2}
        transparent
        opacity={0.6}
      />
    );
  };

  const AttributionVisualization3D = () => {
    if (!attributionData) return null;

    const visibleFeatures = showOnlySignificant ? 
      attributionData.features.filter(f => Math.abs(f.attribution) >= attributionThreshold) :
      attributionData.features;

    const FallbackContent = () => (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Feature Attribution Analysis:</Typography>
        <List>
          {visibleFeatures.map(feature => (
            <ListItem key={feature.id} button onClick={() => setSelectedFeature(feature)}>
              <ListItemText
                primary={feature.name}
                secondary={`Attribution: ${feature.attribution.toFixed(3)} | Activation: ${feature.activation.toFixed(3)}`}
              />
              <Chip 
                size="small" 
                label={feature.category} 
                sx={{ bgcolor: categoryColors[feature.category], color: 'white' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );

    if (webGLFailed) {
      return <WebGLFallback isDarkMode={isDarkMode}><FallbackContent /></WebGLFallback>;
    }

    try {
      return (
        <Canvas 
          style={{ height: '450px', background: 'transparent' }} 
          camera={{ position: [0, 2, 10], fov: 50 }}
          onError={() => setWebGLFailed(true)}
          dpr={1.5}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          
          {visibleFeatures.map(feature => (
            <FeatureNode3D 
              key={feature.id} 
              feature={feature} 
              onClick={() => setSelectedFeature(feature)}
            />
          ))}

          {attributionData.connections.map(conn => {
            const fromFeature = visibleFeatures.find(f => f.id === conn.from);
            const toFeature = visibleFeatures.find(f => f.id === conn.to);
            if (fromFeature && toFeature) {
              return (
                <ConnectionLine3D 
                  key={conn.id} 
                  from={fromFeature} 
                  to={toFeature} 
                  connection={conn}
                />
              );
            }
            return null;
          })}

          {visibleFeatures.map(feature => (
            <Text
              key={`label-${feature.id}`}
              position={[
                feature.position.x,
                feature.position.y + 0.5,
                feature.position.z
              ]}
              fontSize={0.15}
              color="#000000"
              anchorX="center"
              anchorY="middle"
              maxWidth={2}
            >
              {feature.name}
            </Text>
          ))}
        </Canvas>
      );
    } catch (error) {
      console.error("Error rendering 3D canvas:", error);
      setWebGLFailed(true);
      return <WebGLFallback isDarkMode={isDarkMode}><FallbackContent /></WebGLFallback>;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 1 }}>
        Feature Attribution Visualizer
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, opacity: 0.85, color: 'text.secondary' }}>
        Explore how individual features contribute to predicting specific tokens using advanced attribution analysis. 
        This interactive tool demonstrates mechanistic interpretability techniques from sparse autoencoder research,
        generating dynamic feature maps based on your input text and target token.
        <br/>Try different types of content - geographic facts, scientific knowledge, or simple sentences - to see how different feature patterns emerge.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper className="glass-card" sx={{ p: {xs:2, md:3}, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{color: 'text.primary'}}>
              Attribution Analysis Setup
            </Typography>
            
            <TextField
              fullWidth
              label="Input Text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              multiline
              rows={3}
              placeholder="Enter text to analyze..."
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Target Token"
              value={targetToken}
              onChange={(e) => setTargetToken(e.target.value)}
              placeholder="Token to analyze attribution for"
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Example Inputs:
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {exampleInputs.map((example, index) => (
                <Chip
                  key={index}
                  label={example.substring(0, 25) + "..."}
                  onClick={() => setInputText(example)}
                  size="small"
                  variant="outlined"
                  sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                />
              ))}
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Example Tokens:
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {exampleTokens.map((token, index) => (
                <Chip
                  key={index}
                  label={token}
                  onClick={() => setTargetToken(token)}
                  size="small"
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>

            <Button 
              variant="contained" 
              color="primary" 
              onClick={analyzeAttribution} 
              disabled={analyzing || !inputText.trim() || !targetToken.trim()}
              fullWidth
              sx={{ mt: 'auto', py: 1.5 }}
            >
              {analyzing ? <CircularProgress size={24} color="inherit" /> : 'Analyze Attribution'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper className="glass-card" sx={{ p: {xs:2, md:3}, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom sx={{color: 'text.primary'}}>
                Attribution Visualization
              </Typography>
              {attributionData && (
                <Chip 
                  label={`Target: ${attributionData.targetToken}`} 
                  color="secondary" 
                  size="small" 
                  sx={{fontWeight: 500}}
                />
              )}
            </Box>

            {attributionData && (
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>View Mode</InputLabel>
                      <Select value={viewMode} onChange={(e) => setViewMode(e.target.value as any)}>
                        <MenuItem value="attribution">Attribution</MenuItem>
                        <MenuItem value="activation">Activation</MenuItem>
                        <MenuItem value="both">Combined</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={showOnlySignificant} 
                          onChange={(e) => setShowOnlySignificant(e.target.checked)} 
                        />
                      }
                      label="Significant Only"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Attribution Threshold</Typography>
                    <Slider
                      value={attributionThreshold}
                      onChange={(_: Event, value: number | number[]) => setAttributionThreshold(value as number)}
                      min={0}
                      max={1}
                      step={0.05}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(x: number) => x.toFixed(2)}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {analyzing && !attributionData && (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow: 1, minHeight: '400px' }}>
                <CircularProgress size={40} />
                <Typography sx={{ml: 2, color: 'text.secondary'}}>Analyzing feature attribution...</Typography>
              </Box>
            )}

            {!analyzing && !attributionData && !error && (
              <Alert severity="info" sx={{mt:2, flexGrow:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
                Enter text and a target token, then click "Analyze Attribution" to visualize feature contributions.
              </Alert>
            )}

            {attributionData && (
              <Box sx={{flexGrow: 1, width: '100%', minHeight: '400px'}}>
                <AttributionVisualization3D />
              </Box>
            )}
          </Paper>
        </Grid>

        {selectedFeature && (
          <Grid item xs={12}>
            <Card className="glass-card" sx={{ p: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Typography variant="h6">{selectedFeature.name}</Typography>
                  <Chip 
                    size="small" 
                    label={selectedFeature.category} 
                    sx={{ 
                      bgcolor: categoryColors[selectedFeature.category], 
                      color: 'white',
                      fontWeight: 500
                    }} 
                  />
                  <Chip 
                    size="small" 
                    label={`Layer ${selectedFeature.layer}`} 
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" sx={{color: 'text.secondary', mb: 2}}>
                  {selectedFeature.description}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" display="block" sx={{color: 'text.secondary'}}>Attribution Score</Typography>
                    <Typography variant="body1" sx={{color: selectedFeature.attribution > 0 ? 'success.light' : 'error.light', fontWeight: 'bold'}}>
                      {selectedFeature.attribution > 0 ? '+' : ''}{selectedFeature.attribution.toFixed(3)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" display="block" sx={{color: 'text.secondary'}}>Activation Level</Typography>
                    <Typography variant="body1" sx={{color: 'info.light', fontWeight: 'bold'}}>
                      {selectedFeature.activation.toFixed(3)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" display="block" sx={{color: 'text.secondary'}}>Confidence</Typography>
                    <Typography variant="body1" sx={{color: 'text.primary', fontWeight: 'bold'}}>
                      {(selectedFeature.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FeatureAttributionVisualizer;
