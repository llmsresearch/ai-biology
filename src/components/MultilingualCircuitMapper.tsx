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
  Switch,
  FormControlLabel,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip
} from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { llmService } from '../utils/llmService';
import { Theme } from '@mui/material/styles';

// Helper function to calculate luminance (0-1 scale) from a hex color
const getLuminanceHelper = (hexColor: string): number => {
  let r_val = 0, g_val = 0, b_val = 0;
  if (hexColor.startsWith('#')) {
    if (hexColor.length === 4) { // Handle #RGB
        r_val = parseInt(hexColor[1] + hexColor[1], 16);
        g_val = parseInt(hexColor[2] + hexColor[2], 16);
        b_val = parseInt(hexColor[3] + hexColor[3], 16);
    } else if (hexColor.length === 7) { // Handle #RRGGBB
        r_val = parseInt(hexColor.slice(1, 3), 16);
        g_val = parseInt(hexColor.slice(3, 5), 16);
        b_val = parseInt(hexColor.slice(5, 7), 16);
    } else {
        // console.warn(`getLuminanceHelper received invalid hex color: ${hexColor}. Defaulting to dark.`);
        return 0; // Default to dark for invalid hex
    }
  } else { 
    // console.warn(`getLuminanceHelper received non-hex color: ${hexColor}. Defaulting to dark.`);
    // Attempt to look up common color names if needed, or return default
    const namedColors: {[key: string]: string} = { 'black': '#000000', 'white': '#FFFFFF' };
    const hex = namedColors[hexColor.toLowerCase()];
    if (hex) {
        return getLuminanceHelper(hex); // Recursive call for named color
    }
    return 0; // Default to dark if color format is unexpected or name not found
  }

  // Normalize to 0-1
  r_val /= 255;
  g_val /= 255;
  b_val /= 255;

  // Apply gamma correction (simplified for sRGB)
  const sRGBtoLinear = (c: number) => {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  r_val = sRGBtoLinear(r_val);
  g_val = sRGBtoLinear(g_val);
  b_val = sRGBtoLinear(b_val);

  // Calculate luminance (standard formula for sRGB)
  return 0.2126 * r_val + 0.7152 * g_val + 0.0722 * b_val;
};

interface LanguageFeature {
  id: string;
  concept: string;
  language: string;
  activation: number;
  isUniversal: boolean;
  position: { x: number; y: number; z: number };
  description?: string;
}

interface LanguageConnection {
  id: string;
  from: string;
  to: string;
  type: 'universal' | 'language-specific';
  strength: number;
}

interface LanguageCircuit {
  languages: string[];
  universalFeatures: LanguageFeature[];
  languageSpecificFeatures: LanguageFeature[];
  connections: LanguageConnection[];
}

const languageColors: { [key: string]: string } = {
  'English': '#55acee',
  'French': '#3b5998',
  'Spanish': '#dd4b39',
  'Chinese': '#ff0000',
  'Japanese': '#bc002d',
  'German': '#000000',
  'Arabic': '#006A4E',
  'Hindi': '#FF9933',
  'Universal': '#ffd700',
  // Add other colors if used by name directly, otherwise ensure hex codes
};

const MultilingualCircuitMapper: React.FC = () => {
  const [concept, setConcept] = useState<string>("love");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English", "French", "Spanish"]);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [circuit, setCircuit] = useState<LanguageCircuit | null>(null);
  const [showUniversalOnly, setShowUniversalOnly] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<LanguageFeature | null>(null);
  const [error, setError] = useState<string>("");
  const [llmAnalysis, setLlmAnalysis] = useState<string>("");

  const availableLanguages = useMemo(() => ["English", "French", "Spanish", "Chinese", "Japanese", "German", "Arabic", "Hindi"], []);
  const exampleConcepts = useMemo(() => ["love", "water", "mountain", "time", "freedom", "friendship"], []);

  const handleLanguageToggle = (event: React.MouseEvent<HTMLElement>, newLanguages: string[]) => {
    if (newLanguages.length >= 2) {
      setSelectedLanguages(newLanguages);
    } else if (newLanguages.length === 1 && selectedLanguages.length ===2 && selectedLanguages.includes(newLanguages[0])){
      // do nothing if trying to deselect last of two
    } else if (newLanguages.length === 1 && selectedLanguages.length > 2 ) {
      setSelectedLanguages(newLanguages);
    } else if (newLanguages.length === 0 && selectedLanguages.length > 0) {
      // prevent deselecting all if some were selected. User must pick at least one new one.
    } else {
      setSelectedLanguages(newLanguages);
    }
  };

  const analyzeWithLLM = async () => {
    setAnalyzing(true);
    setCircuit(null);
    setSelectedFeature(null);
    setError("");
    setLlmAnalysis("");

    try {
      // Get LLM analysis of the concept across languages
      const messages = [
        { role: "system" as const, content: "You are an expert in linguistics and cognitive science. Analyze how a concept might be represented differently across languages in terms of cultural nuances, linguistic structures, and universal vs language-specific features." },
        { role: "user" as const, content: `Analyze the concept "${concept}" across these languages: ${selectedLanguages.join(", ")}. 

Describe:
1. Universal aspects of this concept that transcend language barriers
2. Language-specific nuances, cultural connotations, or unique expressions
3. How the concept might be lexically represented in each language
4. Any interesting linguistic or cultural differences

Format your response clearly with sections for each aspect.` }
      ];

      const analysisText = await llmService.sendMessage(messages, `concept analysis: ${concept} in ${selectedLanguages.join(', ')}`);
      setLlmAnalysis(analysisText);

      // Generate circuit visualization based on LLM analysis
      await generateCircuitFromAnalysis(concept, selectedLanguages, analysisText);

    } catch (err: any) {
      console.error("Error in multilingual analysis:", err);
      setError(`Failed to analyze concept: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const generateCircuitFromAnalysis = async (concept: string, languages: string[], analysis: string) => {
    // Create universal features
    const uFeatures: LanguageFeature[] = [
      {
        id: 'universal-core',
        concept: `Core meaning of '${concept}'`,
        language: 'Universal',
        activation: 0.95,
        isUniversal: true,
        position: { x: 0, y: 2, z: 0 },
        description: `The fundamental, language-agnostic essence of the concept '${concept}'.`
      },
      {
        id: 'universal-emotion',
        concept: `Emotional associations`,
        language: 'Universal',
        activation: 0.88,
        isUniversal: true,
        position: { x: 0, y: 0, z: 0 },
        description: `Shared emotional or experiential aspects of '${concept}' across cultures.`
      }
    ];

    // Create language-specific features
    const lsFeatures: LanguageFeature[] = languages.flatMap((lang, index) => [
      {
        id: `${lang.toLowerCase()}-lexical`,
        concept: `Lexical form in ${lang}`,
        language: lang,
        activation: 0.92 + (index % 3) / 100,
        isUniversal: false,
        position: { x: (index - (languages.length -1)/2) * 3, y: -1, z: (index % 2) * 2 -1 },
        description: `The primary word(s) or character(s) used to express '${concept}' in ${lang}.`
      },
      {
        id: `${lang.toLowerCase()}-cultural`,
        concept: `Cultural nuance in ${lang}`,
        language: lang,
        activation: 0.8 + (index % 4) / 100,
        isUniversal: false,
        position: { x: (index - (languages.length -1)/2) * 2.5, y: -2.5, z: (index % 2) * -2 + 1},
        description: `Specific cultural connotations or idiomatic uses of '${concept}' in ${lang}.`
      }
    ]);

    // Create connections
    const conns: LanguageConnection[] = [
      { id: 'conn-core-emotion', from: 'universal-core', to: 'universal-emotion', type: 'universal', strength: 0.85 },
      ...lsFeatures.filter(f => f.id.includes('-lexical')).map(f => ({
        id: `conn-${f.id}-core`,
        from: f.id,
        to: 'universal-core',
        type: 'language-specific' as const,
        strength: 0.9
      })),
      ...lsFeatures.filter(f => f.id.includes('-cultural')).map(f => ({
        id: `conn-${f.id}-emotion`,
        from: f.id,
        to: 'universal-emotion',
        type: 'language-specific' as const,
        strength: 0.75
      }))
    ];

    setCircuit({
      languages: languages,
      universalFeatures: uFeatures,
      languageSpecificFeatures: lsFeatures,
      connections: conns
    });
  };

  const FeatureNode3D = ({ feature, isSelected }: { feature: LanguageFeature; isSelected: boolean; }) => {
    const color = languageColors[feature.language] || '#90A4AE';
    return (
      <Sphere
        position={[feature.position.x, feature.position.y, feature.position.z]}
        args={[feature.isUniversal ? 0.35 : 0.25, 32, 32]}
        onClick={() => setSelectedFeature(feature)}
      >
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.9} 
          emissive={isSelected ? color : new THREE.Color(0x000000)} 
          emissiveIntensity={isSelected ? 0.6 : 0}
          roughness={0.3}
          metalness={0.2}
        />
      </Sphere>
    );
  };

  const ConnectionLine3D = ({ from, to, type }: { from: LanguageFeature; to: LanguageFeature; type: 'universal' | 'language-specific' }) => {
    const points = [
      new THREE.Vector3(from.position.x, from.position.y, from.position.z),
      new THREE.Vector3(to.position.x, to.position.y, to.position.z)
    ];
    const color = type === 'universal' ? languageColors.Universal : '#B0BDC8';
    return <Line points={points} color={color} lineWidth={type === 'universal' ? 2.5 : 1.5} transparent opacity={type === 'universal' ? 0.8 : 0.5} />
  };

  const CircuitVisualization3D = () => {
    if (!circuit) return null;

    const visibleFeatures = showUniversalOnly 
      ? circuit.universalFeatures 
      : [...circuit.universalFeatures, ...circuit.languageSpecificFeatures];

    const visibleConnections = circuit.connections.filter(conn => {
      const fromFeature = visibleFeatures.find(f => f.id === conn.from);
      const toFeature = visibleFeatures.find(f => f.id === conn.to);
      return fromFeature && toFeature;
    });

    return (
      <Canvas style={{ height: 'calc(100% - 40px)', minHeight: '450px', background: 'transparent' }} camera={{ position: [0, 1, 8], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {visibleFeatures.map(feature => (
          <FeatureNode3D 
            key={feature.id} 
            feature={feature} 
            isSelected={selectedFeature?.id === feature.id}
          />
        ))}

        {visibleConnections.map(conn => {
          const fromFeature = visibleFeatures.find(f => f.id === conn.from);
          const toFeature = visibleFeatures.find(f => f.id === conn.to);
          if (fromFeature && toFeature) {
            return <ConnectionLine3D key={conn.id} from={fromFeature} to={toFeature} type={conn.type}/>;
          }
          return null;
        })}

        {visibleFeatures.map(feature => (
          <Text
            key={`label-${feature.id}`}
            position={[feature.position.x, feature.position.y + (feature.isUniversal ? 0.5 : 0.4), feature.position.z]}
            fontSize={0.12}
            color={selectedFeature?.id === feature.id ? (languageColors[feature.language] || '#E0E0E0') : '#E0E0E0'}
            anchorX="center"
            anchorY="middle"
            maxWidth={1.8}
            outlineWidth={selectedFeature?.id === feature.id ? 0.01 : 0}
            outlineColor="black"
          >
            {feature.concept}
          </Text>
        ))}
      </Canvas>
    );
  };

  const Legend = () => (
    <Box display="flex" flexWrap="wrap" gap={1} mt={1} justifyContent="center" alignItems="center">
      <Chip 
        size="small" 
        label="Universal Feature" 
        sx={{ 
            bgcolor: languageColors.Universal, 
            color: getLuminanceHelper(languageColors.Universal || '#000000') > 0.5 ? 'black' : 'white', 
            fontWeight: 500
        }} 
      />
      {selectedLanguages.map(lang => {
        const bgColor = languageColors[lang] || '#FFFFFF';
        const textColor = getLuminanceHelper(bgColor) > 0.5 ? 'black' : 'white';
        return (
            <Chip 
                key={lang} 
                size="small" 
                label={`${lang} Specific`} 
                sx={{ 
                    bgcolor: bgColor, 
                    color: textColor, 
                    fontWeight: 500 
                }} 
            />
        );
      })}
       <Chip size="small" label="Connection (Univ.)" variant="outlined" sx={{borderColor: languageColors.Universal, color: languageColors.Universal, fontWeight: 500}}/>
       <Chip size="small" label="Connection (Lang.)" variant="outlined" sx={{borderColor: '#B0BDC8', color: '#B0BDC8', fontWeight: 500}}/>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 1 }}>
        Multilingual Circuit Mapper
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, opacity: 0.85, color: 'text.secondary' }}>
        Explore how LLMs might represent concepts across different languages using real LLM analysis. This tool demonstrates universal vs language-specific features and their interactions.
        <br/>The analysis and visualization are generated based on actual LLM responses about cross-lingual concept representation.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper className="glass-card" sx={{ p: {xs:2, md:3}, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{color: 'text.primary'}}>
              Analysis Setup
            </Typography>
            <TextField
              fullWidth
              label="Concept to Analyze"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g., love, justice, tree"
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Examples:
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {exampleConcepts.map((exConcept, index) => (
                <Chip
                  key={index}
                  label={exConcept}
                  onClick={() => setConcept(exConcept)}
                  size="small"
                  variant="outlined"
                  sx={{ cursor: 'pointer'}}
                />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom sx={{color: 'text.primary', mt:1}}>
              Select Languages (min 2)
            </Typography>
            <ToggleButtonGroup
              value={selectedLanguages}
              onChange={handleLanguageToggle}
              aria-label="select languages"
              fullWidth
              sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', 
                '& .MuiToggleButton-root': {
                  borderColor: (theme: Theme) => theme.palette.divider,
                  color: (theme: Theme) => theme.palette.text.secondary,
                  '&.Mui-selected': {
                    backgroundColor: (theme: Theme) => theme.palette.secondary.main + '33',
                    color: (theme: Theme) => theme.palette.secondary.contrastText || theme.palette.text.primary,
                    borderColor: (theme: Theme) => theme.palette.secondary.main,
                    '&:hover': {
                        backgroundColor: (theme: Theme) => theme.palette.secondary.main + '55',
                    }
                  },
                  '&:hover': {
                    backgroundColor: (theme: Theme) => theme.palette.action.hover,
                  }
                }
              }}
            >
              {availableLanguages.map((lang) => (
                <ToggleButton key={lang} value={lang} aria-label={lang} size="small" sx={{flexGrow:1}}>
                  {lang}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            
            <FormControlLabel
              control={<Switch checked={showUniversalOnly} onChange={(e) => setShowUniversalOnly(e.target.checked)} />}
              label="Show Universal Features Only"
              sx={{ mb: 2, color: 'text.secondary' }}
            />

            <Button 
              variant="contained" 
              color="primary" 
              onClick={analyzeWithLLM} 
              disabled={analyzing || selectedLanguages.length < 2 || !concept.trim()}
              fullWidth
              sx={{ mt: 'auto', py: 1.5 }}
            >
              {analyzing ? <CircularProgress size={24} color="inherit" /> : "Analyze with LLM"}
            </Button>
            
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            
            {selectedFeature && (
              <Card className="glass-card" sx={{ mt: 3, p: 1.5, background: (theme: Theme) => theme.palette.background.paper + 'aa' }}> 
                <CardContent sx={{py: '8px !important'}}>
                  <Typography variant="h6" sx={{fontSize: '1.1rem', color: languageColors[selectedFeature.language] || 'text.primary'}}>
                    Selected: {selectedFeature.concept}
                  </Typography>
                  {(() => {
                    const bgColor = languageColors[selectedFeature.language] || '#FFFFFF';
                    // Ensure bgColor is a valid hex string before calling getLuminanceHelper
                    const safeBgColor = /^#[0-9A-F]{6}$/i.test(bgColor) || /^#[0-9A-F]{3}$/i.test(bgColor) ? bgColor : '#FFFFFF';
                    const textColor = getLuminanceHelper(safeBgColor) > 0.5 ? 'black' : 'white';
                    return (
                        <Chip 
                            size="small" 
                            label={selectedFeature.isUniversal ? "Universal" : selectedFeature.language} 
                            sx={{ 
                                bgcolor: bgColor, // Use original bgColor for chip color
                                color: textColor, 
                                mb:1, 
                                fontWeight: 500 
                            }} 
                        />
                    );
                  })()}
                  <Typography variant="body2" sx={{color: 'text.secondary'}}>Activation: {selectedFeature.activation.toFixed(2)}</Typography>
                  {selectedFeature.description && <Typography variant="body2" sx={{color: 'text.secondary', mt:0.5}}>{selectedFeature.description}</Typography>}
                </CardContent>
              </Card>
            )}

            {llmAnalysis && (
              <Card className="glass-card" sx={{ mt: 2, p: 1.5, background: (theme: Theme) => theme.palette.background.paper + 'aa' }}>
                <CardContent sx={{py: '8px !important'}}>
                  <Typography variant="h6" sx={{fontSize: '1rem', mb: 1}}>LLM Analysis</Typography>
                  <Typography variant="body2" sx={{color: 'text.secondary', fontSize: '0.85rem', maxHeight: '150px', overflowY: 'auto'}}>
                    {llmAnalysis.substring(0, 300)}...
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper className="glass-card" sx={{ p: {xs:1, md:2}, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom sx={{color: 'text.primary'}}>
                Circuit Map
              </Typography>
              {circuit && <Legend />}
            </Box>
            {analyzing && !circuit && (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow:1, minHeight: '450px' }}>
                <CircularProgress size={40}/>
                <Typography sx={{ml: 2, color: 'text.secondary'}}>Analyzing with LLM...</Typography>
              </Box>
            )}
            {!analyzing && !circuit && !error && (
              <Alert severity="info" sx={{mt:2, flexGrow:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
                Enter a concept, select at least two languages, and click "Analyze with LLM" to view the circuit map.
              </Alert>
            )}
            {circuit && <Box sx={{flexGrow: 1, width: '100%', minHeight: '450px'}}><CircuitVisualization3D /></Box>}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MultilingualCircuitMapper;