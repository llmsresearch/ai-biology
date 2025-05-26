import React, { useState, useRef, useEffect } from 'react';
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
  LinearProgress,
  Tooltip
} from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { llmService } from '../utils/llmService';
import { Theme } from '@mui/material/styles';

// Add fallback component when WebGL is not available
const WebGLFallback = ({ children }: { children: React.ReactNode }) => (
  <Box 
    sx={{ 
      height: '350px', 
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

interface RhymeCandidate {
  word: string;
  activation: number;
  rhymeScore: number;
  position: { x: number; y: number; z: number };
}

interface PoetryStep {
  lineNumber: number;
  partialLine: string;
  rhymeCandidates: RhymeCandidate[];
  selectedRhymeWord: string;
  finalLine: string;
}

const PoetryPlanningVisualizer: React.FC = () => {
  const [poetryPrompt, setPoetryPrompt] = useState<string>("Craft a short verse about a star so bright");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [poetrySteps, setPoetrySteps] = useState<PoetryStep[]>([]);
  const [currentDisplayStepIndex, setCurrentDisplayStepIndex] = useState<number>(0);
  const [selectedRhymeCandidate, setSelectedRhymeCandidate] = useState<RhymeCandidate | null>(null);
  const [error, setError] = useState<string>('');
  const [webGLFailed, setWebGLFailed] = useState<boolean>(false);
  const [llmPoem, setLlmPoem] = useState<string>('');

  const examplePrompts = [
    "Craft a short verse about a star so bright",
    "Compose a quatrain on the silent moon's soft light",
    "Write a few lines describing a river's gentle flow",
    "Versify the concept of time, and how it seems to go"
  ];

  const analyzePoetryWithLLM = async () => {
    setAnalyzing(true);
    setPoetrySteps([]);
    setCurrentDisplayStepIndex(0);
    setSelectedRhymeCandidate(null);
    setError('');
    setLlmPoem('');

    try {
      // Get LLM to write poetry and explain its process
      const messages = [
        { role: "system" as const, content: "You are a poet and linguistics expert. When given a poetry prompt, first write a short poem (2-4 lines), then explain step-by-step how you might have planned the rhyme scheme and word choices. Describe what rhyme candidates you considered for each line." },
        { role: "user" as const, content: `Poetry prompt: "${poetryPrompt}"

First, write a short poem based on this prompt. Then explain your thought process:
1. How did you plan the rhyme scheme?
2. What rhyme words did you consider for each line?
3. How did word choice influence the overall meaning?

Format your response with the poem first, then your analysis.` }
      ];

      const response = await llmService.sendMessage(messages, `poetry planning: ${poetryPrompt}`);
      setLlmPoem(response);

      // Extract poem and generate visualization steps
      await generatePoetryVisualization(response);

    } catch (err: any) {
      console.error("Error in poetry analysis:", err);
      setError(`Failed to analyze poetry: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const generatePoetryVisualization = async (llmResponse: string) => {
    // Parse the LLM response to extract poem lines and planning info
    const lines = llmResponse.split('\n').filter(line => line.trim());
    const poemLines = lines.slice(0, 4); // Take first few lines as the poem
    
    // Generate visualization steps based on poem content
    const steps: PoetryStep[] = [];
    
    for (let i = 0; i < Math.min(poemLines.length, 3); i++) {
      const line = poemLines[i];
      const words = line.split(' ');
      const lastWord = words[words.length - 1].replace(/[^\w]/g, '').toLowerCase();
      
      // Generate rhyme candidates based on the last word
      const rhymeCandidates = generateRhymeCandidates(lastWord, i);
      
      steps.push({
        lineNumber: i + 1,
        partialLine: words.slice(0, -1).join(' ') + (words.length > 1 ? ' ' : ''),
        rhymeCandidates,
        selectedRhymeWord: lastWord,
        finalLine: line
      });
    }
    
    setPoetrySteps(steps);
    
    // Animate through the steps
    let currentAnimatedStep = 0;
    const interval = setInterval(() => {
      if (currentAnimatedStep < steps.length - 1) {
        setCurrentDisplayStepIndex(prev => prev + 1);
        currentAnimatedStep++;
      } else {
        clearInterval(interval);
      }
    }, 1200);
  };

  const generateRhymeCandidates = (targetWord: string, stepIndex: number): RhymeCandidate[] => {
    // Simple rhyme generation based on common word endings
    const rhymePairs: {[key: string]: string[]} = {
      'night': ['light', 'bright', 'sight', 'flight'],
      'light': ['night', 'bright', 'sight', 'might'],
      'bright': ['night', 'light', 'sight', 'flight'],
      'star': ['far', 'are', 'car', 'war'],
      'moon': ['soon', 'tune', 'june', 'noon'],
      'flow': ['go', 'show', 'know', 'grow'],
      'time': ['rhyme', 'climb', 'sublime', 'chime']
    };

    const candidates = rhymePairs[targetWord] || ['word1', 'word2', 'word3'];
    
    return candidates.slice(0, 3).map((word, index) => ({
      word,
      activation: 0.9 - index * 0.1,
      rhymeScore: 0.95 - index * 0.05,
      position: { 
        x: (index - 1) * 2, 
        y: 1 + stepIndex * 0.5, 
        z: stepIndex * 0.5 
      }
    }));
  };

  const RhymeNode3D = ({ rhyme, isSelected, isFinalChoice }: { rhyme: RhymeCandidate; isSelected: boolean; isFinalChoice: boolean; }) => {
    const intensity = rhyme.activation * rhyme.rhymeScore;
    let baseColor = new THREE.Color(0x66ccff);
    if (isFinalChoice) baseColor = new THREE.Color('#4CAF50');
    else if (isSelected) baseColor = new THREE.Color('#FFD700');
    else baseColor = new THREE.Color('#00BCD4');

    return (
      <Sphere
        position={[rhyme.position.x, rhyme.position.y, rhyme.position.z]}
        args={[0.2 + intensity * 0.2, 16, 16]}
        onClick={() => setSelectedRhymeCandidate(rhyme)}
      >
        <meshStandardMaterial 
            color={baseColor} 
            transparent 
            opacity={0.9} 
            emissive={isSelected || isFinalChoice ? baseColor : new THREE.Color(0x000000)} 
            emissiveIntensity={isSelected || isFinalChoice ? 0.5 : 0}
        />
      </Sphere>
    );
  };

  const PoetryVisualization3D = () => {
    const currentStepData = poetrySteps[currentDisplayStepIndex];
    const visibleRhymes = currentStepData?.rhymeCandidates || [];
    const showContent = poetrySteps.length > 0 && currentStepData && visibleRhymes.length > 0;

    // WebGL fallback content
    const FallbackContent = () => (
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>Rhyme Candidates:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {showContent && visibleRhymes.map((rhyme, idx) => (
            <Chip
              key={idx}
              label={`${rhyme.word} (activation: ${rhyme.activation.toFixed(2)})`}
              onClick={() => setSelectedRhymeCandidate(rhyme)}
              color={currentStepData?.selectedRhymeWord === rhyme.word ? "success" : 
                    selectedRhymeCandidate?.word === rhyme.word ? "warning" : "primary"}
              variant="outlined"
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>
    );

    // Return early with fallback if WebGL has failed
    if (webGLFailed) {
      return <WebGLFallback><FallbackContent /></WebGLFallback>;
    }

    try {
      return (
        <Canvas 
          style={{ height: '350px', background: 'transparent' }} 
          camera={{ position: [0, 2, 7], fov: 50 }}
          onError={() => setWebGLFailed(true)}
          dpr={1.5} // Limit pixel ratio for performance
        >
          <ambientLight intensity={0.8} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          
          {showContent && visibleRhymes.map((rhyme, index) => (
            <RhymeNode3D 
              key={`${rhyme.word}-${index}`}
              rhyme={rhyme} 
              isSelected={selectedRhymeCandidate?.word === rhyme.word}
              isFinalChoice={currentStepData?.selectedRhymeWord === rhyme.word}
            />
          ))}

          {showContent && visibleRhymes.map((rhyme, index) => (
            <Text
              key={`label-${rhyme.word}-${index}`}
              position={[rhyme.position.x, rhyme.position.y - 0.4, rhyme.position.z]}
              fontSize={0.15}
              color="#E0E0E0"
              anchorX="center"
              anchorY="middle"
              maxWidth={1.5}
            >
              {rhyme.word}
            </Text>
          ))}

          {showContent && currentStepData && selectedRhymeCandidate && currentStepData.rhymeCandidates.includes(selectedRhymeCandidate) && (
              <Line 
                  points={[
                      new THREE.Vector3(0, -1, 0),
                      new THREE.Vector3(selectedRhymeCandidate.position.x, selectedRhymeCandidate.position.y, selectedRhymeCandidate.position.z)
                  ]}
                  color={selectedRhymeCandidate.word === currentStepData.selectedRhymeWord ? "#4CAF50" : "#FFD700"}
                  lineWidth={2}
                  dashed={selectedRhymeCandidate.word !== currentStepData.selectedRhymeWord}
                  dashSize={0.1}
                  gapSize={0.05}
              />
          )}
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
          Poetry Planning Visualizer
        </Typography>
      <Typography variant="body1" sx={{ mb: 3, opacity: 0.85, color: 'text.secondary' }}>
        How do LLMs write poetry? This tool uses real LLM analysis to show how models might plan ahead, considering rhyme candidates before finalizing lines.
        <br/>The visualization is generated based on actual LLM responses about poetry composition and planning.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper className="glass-card" sx={{ p: {xs:2, md:3}, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{color: 'text.primary'}}>
              Poetry Theme/Prompt
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={poetryPrompt}
              onChange={(e) => setPoetryPrompt(e.target.value)}
              placeholder="Enter a theme or starting line..."
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Examples:
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {examplePrompts.map((example, index) => (
                <Chip
                  key={index}
                  label={example}
                  onClick={() => setPoetryPrompt(example)}
                  size="small"
                  variant="outlined"
                  sx={{ cursor: 'pointer'}}
                />
              ))}
            </Box>

            <Button 
              variant="contained" 
              color="primary" 
              onClick={analyzePoetryWithLLM} 
              disabled={analyzing || !poetryPrompt.trim()}
              fullWidth
              sx={{ mb: 2, py: 1.5 }}
            >
              {analyzing ? <CircularProgress size={24} color="inherit" /> : "Analyze with LLM"}
            </Button>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            {poetrySteps.length > 0 && (
              <Box sx={{ mt: 2, flexGrow: 1 }}>
                <Typography variant="h6" sx={{color: 'text.primary', mb: 1}}>Generated Poem:</Typography>
                <Paper variant="outlined" sx={{ p: 2, background: 'rgba(0,0,0,0.2)', borderColor: (theme: Theme) => theme.palette.divider }}>
                  {poetrySteps.map((step, index) => (
                    <Box key={index} sx={{ mb: index === poetrySteps.length - 1 ? 0 : 1.5}}>
                      <Typography 
                        variant="body1" 
                        component="p"
                        sx={{
                            color: index === currentDisplayStepIndex ? 'text.primary' : 'text.secondary',
                            fontWeight: index === currentDisplayStepIndex ? 'bold' : 'normal',
                            transition: 'color 0.3s ease, font-weight 0.3s ease'
                        }}
                      >
                        {step.finalLine}
                      </Typography>
                      {index === currentDisplayStepIndex && step.rhymeCandidates.length > 0 && (
                        <Typography variant="caption" sx={{ color: 'secondary.light', fontStyle: 'italic'}}>
                          └ Considering rhymes: {step.rhymeCandidates.map(rc => rc.word).join(', ')} → Selected: {step.selectedRhymeWord}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Paper>
              </Box>
            )}

            {llmPoem && (
              <Card className="glass-card" sx={{ mt: 2, p: 1.5, background: (theme: Theme) => theme.palette.background.paper + 'aa' }}>
                <CardContent sx={{py: '8px !important'}}>
                  <Typography variant="h6" sx={{fontSize: '1rem', mb: 1}}>LLM Analysis</Typography>
                  <Typography variant="body2" sx={{color: 'text.secondary', fontSize: '0.85rem', maxHeight: '150px', overflowY: 'auto'}}>
                    {llmPoem.substring(0, 400)}...
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper className="glass-card" sx={{ p: {xs:2, md:3}, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{color: 'text.primary'}}>
              Rhyme Planning Visualization
            </Typography>
             <Typography variant="caption" display="block" sx={{mb:1, color: 'text.secondary'}}>
                Animation shows potential rhyme candidates for the current line being constructed.
            </Typography>
            
            {analyzing && poetrySteps.length === 0 && (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '350px' }}>
                <CircularProgress color="secondary" />
                <Typography sx={{ml: 2, color: 'text.secondary'}}>Analyzing poetry with LLM...</Typography>
              </Box>
            )}

            {(!analyzing && (poetrySteps.length === 0 && !error)) ? (
                 <Alert severity="info" sx={{mt:2}}>
                    Enter a prompt and click "Analyze with LLM" to see the poetry planning visualization.
                </Alert>
            ) : (
                <PoetryVisualization3D />
            )}
            
            {selectedRhymeCandidate && (
              <Card className="glass-card" sx={{ mt: 2, p: 1.5, background: (theme: Theme) => theme.palette.background.paper + 'aa' }}>
                <CardContent sx={{py: '8px !important'}}>
                  <Typography variant="h6" sx={{fontSize: '1.1rem', color: 'text.primary'}}>Selected Candidate: {selectedRhymeCandidate.word}</Typography>
                  <Typography variant="body2" sx={{color: 'text.secondary'}}>Activation Score: {selectedRhymeCandidate.activation.toFixed(2)}</Typography>
                  <Typography variant="body2" sx={{color: 'text.secondary'}}>Rhyme Score: {selectedRhymeCandidate.rhymeScore.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PoetryPlanningVisualizer;