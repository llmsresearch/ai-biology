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
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Tooltip,
  useTheme
} from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import SecurityIcon from '@mui/icons-material/Security';

// Purple color constant for consistency
const PURPLE_COLOR = '#7A00E6';


// Fallback component when WebGL fails
const WebGLFallback = ({ children, isDarkMode }: { children: React.ReactNode; isDarkMode: boolean }) => (
  <Box 
    sx={{ 
      height: '400px', 
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

interface SafetyFeature {
  id: string;
  name: string;
  activation: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  category: 'toxicity' | 'bias' | 'misinformation' | 'privacy' | 'manipulation' | 'harmful_content' | 'professional' | 'child_safety';
  description: string;
  triggered: boolean;
  confidence: number;
  position: { x: number; y: number; z: number };
  mitigation?: string;
  triggerWords?: string[];
}

interface SafetyAnalysis {
  overallRisk: 'safe' | 'caution' | 'warning' | 'danger';
  riskScore: number;
  features: SafetyFeature[];
  explanation: string;
  recommendations: string[];
  metadata?: {
    totalFeatures: number;
    triggeredFeatures: number;
    analysisTime: number;
    inputLength: number;
    riskFactors: string[];
  };
}

const SafetyFeaturesDetector: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [inputText, setInputText] = useState<string>("I need help with my homework assignment about World War 2.");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [safetyAnalysis, setSafetyAnalysis] = useState<SafetyAnalysis | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<SafetyFeature | null>(null);
  const [error, setError] = useState<string>('');
  const [webGLFailed, setWebGLFailed] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const exampleInputs = useMemo(() => [
    "I need help with my homework assignment about World War 2.",
    "Can you write a story about brave heroes saving the day?",
    "What are the ingredients in aspirin and how does it work?",
    "Tell me about renewable energy solutions for climate change.",
    "How do I improve my study habits for better grades?"
  ], []);

  const riskyExamples = useMemo(() => [
    "How to bypass security systems",
    "Create content that stereotypes people",
    "Generate false information about vaccines",
    "Help me manipulate someone's emotions"
  ], []);

  const categoryColors = useMemo(() => ({
    toxicity: '#FF6B6B',
    bias: '#FFB347', 
    misinformation: '#FF8C94',
    privacy: '#A8E6CF',
    manipulation: '#DDA0DD',
    harmful_content: '#F08080',
    professional: '#87CEEB',
    child_safety: '#FFB6C1'
  }), []);

  const riskColors = useMemo(() => ({
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#FF5722',
    critical: '#D32F2F'
  }), []);

    // API call to analyze safety features
  const analyzeWithSafetyAPI = async (inputText: string) => {
    try {
      const response = await fetch('/api/safety/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Safety analysis API error:', error);
      throw error;
    }
  };

  const analyzeSafety = async () => {
    if (!inputText.trim()) {
      setError('Please provide input text to analyze');
      return;
    }

    setAnalyzing(true);
    setError('');
    setSafetyAnalysis(null);
    setSelectedFeature(null);

    try {
      const result = await analyzeWithSafetyAPI(inputText);
      setSafetyAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze safety features:', error);
      setError('Failed to analyze safety features. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // 3D Visualization Component
  const SafetyFeatureNode3D = ({ feature, onClick }: { feature: SafetyFeature; onClick: () => void }) => {
    const color = feature.triggered ? riskColors[feature.riskLevel] : categoryColors[feature.category];
    const size = feature.triggered ? 0.3 + feature.activation * 0.2 : 0.15;
    
    return (
      <Sphere
        position={[feature.position.x, feature.position.y, feature.position.z]}
        args={[size, 16, 16]}
        onClick={onClick}
      >
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={feature.triggered ? 0.9 : 0.5}
          emissive={selectedFeature?.id === feature.id ? new THREE.Color(color) : new THREE.Color(0x000000)}
          emissiveIntensity={selectedFeature?.id === feature.id ? 0.3 : 0}
        />
      </Sphere>
    );
  };

  const SafetyVisualization3D = () => {
    if (!safetyAnalysis) return null;

    const filteredFeatures = filterCategory === 'all' ? 
      safetyAnalysis.features : 
      safetyAnalysis.features.filter(f => f.category === filterCategory);

    const FallbackContent = () => (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Safety Features Analysis:</Typography>
        <List>
          {filteredFeatures.map(feature => (
            <ListItem key={feature.id} button onClick={() => setSelectedFeature(feature)}>
              <ListItemText
                primary={feature.name}
                secondary={`Activation: ${feature.activation.toFixed(3)} | Risk: ${feature.riskLevel}`}
              />
              <Box display="flex" alignItems="center" gap={1}>
                <Chip 
                  size="small" 
                  label={feature.category} 
                  sx={{ bgcolor: categoryColors[feature.category], color: 'white' }}
                />
                {feature.triggered && <WarningIcon color="warning" fontSize="small" />}
              </Box>
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
          style={{ height: '400px', background: 'transparent' }} 
          camera={{ position: [0, 2, 8], fov: 50 }}
          onError={() => setWebGLFailed(true)}
          dpr={1.5}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          
          {filteredFeatures.map(feature => (
            <SafetyFeatureNode3D 
              key={feature.id} 
              feature={feature} 
              onClick={() => setSelectedFeature(feature)}
            />
          ))}

          {filteredFeatures.map(feature => (
            <Text
              key={`label-${feature.id}`}
              position={[
                feature.position.x,
                feature.position.y + 0.4,
                feature.position.z
              ]}
              fontSize={0.12}
              color={feature.triggered ? "#FFD700" : "#000000"}
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

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'safe': return <SecurityIcon color="success" />;
      case 'caution': return <InfoIcon color="info" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'danger': return <WarningIcon color="error" />;
      default: return <InfoIcon />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'safe': return 'success.main';
      case 'caution': return 'info.main';
      case 'warning': return 'warning.main';
      case 'danger': return 'error.main';
      default: return 'text.secondary';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 1 }}>
        Safety Features Detector
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, opacity: 0.85, color: 'text.secondary' }}>
        Explore how AI safety systems detect and mitigate potential risks in user inputs. This tool demonstrates 
        safety-relevant features similar to those used in production AI systems for responsible deployment.
        <br/>The analysis shows which safety features would activate and how they protect users and systems.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper className="glass-card" sx={{ p: {xs:2, md:3}, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{color: 'text.primary'}}>
              Safety Analysis Setup
            </Typography>
            
            <TextField
              fullWidth
              label="Input Text to Analyze"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              multiline
              rows={4}
              placeholder="Enter text to analyze for safety features..."
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Safe Examples:
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {exampleInputs.map((example, index) => (
                <Chip
                  key={index}
                  label={example.substring(0, 30) + "..."}
                  onClick={() => setInputText(example)}
                  size="small"
                  variant="outlined"
                  sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                />
              ))}
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              <Tooltip title="These examples help demonstrate safety feature detection">
                <Box display="flex" alignItems="center" gap={1}>
                  Test Examples:
                  <InfoIcon fontSize="small" />
                </Box>
              </Tooltip>
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {riskyExamples.map((example, index) => (
                <Chip
                  key={index}
                  label={example.substring(0, 25) + "..."}
                  onClick={() => setInputText(example)}
                  size="small"
                  variant="outlined"
                  color="warning"
                  sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                />
              ))}
            </Box>

            <Button 
              variant="contained" 
              color="primary" 
              onClick={analyzeSafety} 
              disabled={analyzing || !inputText.trim()}
              fullWidth
              sx={{ mt: 'auto', py: 1.5 }}
            >
              {analyzing ? <CircularProgress size={24} color="inherit" /> : 'Analyze Safety Features'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {safetyAnalysis && (
              <Card sx={{ mt: 2, bgcolor: 'background.paper' }}>
                <CardContent sx={{ py: 2 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    {getRiskIcon(safetyAnalysis.overallRisk)}
                    <Typography variant="h6" sx={{ color: getRiskColor(safetyAnalysis.overallRisk), textTransform: 'capitalize' }}>
                      {safetyAnalysis.overallRisk}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Risk Score: {(safetyAnalysis.riskScore * 100).toFixed(1)}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={safetyAnalysis.riskScore * 100} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 1,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getRiskColor(safetyAnalysis.overallRisk)
                      }
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper className="glass-card" sx={{ p: {xs:2, md:3}, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom sx={{color: 'text.primary'}}>
                Safety Features Visualization
              </Typography>
              {safetyAnalysis && (
                <Box display="flex" gap={1}>
                  <Chip 
                    label={`${safetyAnalysis.features.filter(f => f.triggered).length} Active`} 
                    color="warning" 
                    size="small" 
                    sx={{fontWeight: 500}}
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="toxicity">Toxicity</MenuItem>
                      <MenuItem value="bias">Bias</MenuItem>
                      <MenuItem value="misinformation">Misinformation</MenuItem>
                      <MenuItem value="privacy">Privacy</MenuItem>
                      <MenuItem value="manipulation">Manipulation</MenuItem>
                      <MenuItem value="harmful_content">Harmful Content</MenuItem>
                      <MenuItem value="professional">Professional</MenuItem>
                      <MenuItem value="child_safety">Child Safety</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Box>

            {analyzing && !safetyAnalysis && (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow: 1, minHeight: '350px' }}>
                <CircularProgress size={40} />
                <Typography sx={{ml: 2, color: 'text.secondary'}}>Analyzing safety features...</Typography>
              </Box>
            )}

            {!analyzing && !safetyAnalysis && !error && (
              <Alert severity="info" sx={{mt:2, flexGrow:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
                Enter text and click "Analyze Safety Features" to visualize safety feature detection.
              </Alert>
            )}

            {safetyAnalysis && (
              <Box sx={{flexGrow: 1, width: '100%', minHeight: '350px'}}>
                <SafetyVisualization3D />
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
                    label={`${selectedFeature.riskLevel} risk`} 
                    sx={{ 
                      bgcolor: riskColors[selectedFeature.riskLevel], 
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                  {selectedFeature.triggered && (
                    <Chip 
                      size="small" 
                      label="TRIGGERED" 
                      color="warning"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )}
                </Box>
                <Typography variant="body2" sx={{color: 'text.secondary', mb: 2}}>
                  {selectedFeature.description}
                </Typography>
                <Grid container spacing={2}>
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
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" display="block" sx={{color: 'text.secondary'}}>Status</Typography>
                    <Typography variant="body1" sx={{
                      color: selectedFeature.triggered ? 'warning.light' : 'success.light', 
                      fontWeight: 'bold'
                    }}>
                      {selectedFeature.triggered ? 'Active - Monitoring Required' : 'Inactive - Safe'}
                    </Typography>
                  </Grid>
                </Grid>
                {selectedFeature.mitigation && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Recommended Action:</strong> {selectedFeature.mitigation}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {safetyAnalysis && safetyAnalysis.recommendations.length > 0 && (
          <Grid item xs={12}>
            <Card className="glass-card">
              <CardContent>
                <Typography variant="h6" gutterBottom>Safety Recommendations</Typography>
                <List dense>
                  {safetyAnalysis.recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SafetyFeaturesDetector;
