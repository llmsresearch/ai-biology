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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ScienceIcon from '@mui/icons-material/ScienceOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { InterventionResult } from '../utils/types';
import { llmService } from '../utils/llmService';
import { Theme } from '@mui/material/styles';

interface InterventionExperiment {
  id: string;
  name: string;
  description: string;
  prompt: string;
  targetFeature: string;
  interventionType: 'ablation' | 'activation' | 'modification';
  strength: number;
}

const InterventionLaboratory: React.FC = () => {
  const [currentPrompt, setCurrentPrompt] = useState<string>("What is the capital of France?");
  const [queuedInterventions, setQueuedInterventions] = useState<InterventionExperiment[]>([]);
  const [interventionResults, setInterventionResults] = useState<InterventionResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedInterventionType, setSelectedInterventionType] = useState<'ablation' | 'activation' | 'modification'>('ablation');
  const [selectedTargetFeature, setSelectedTargetFeature] = useState<string>('factual-retrieval');
  const [interventionStrength, setInterventionStrength] = useState<number>(0.8);
  const [error, setError] = useState<string>('');

  const availableFeatures = useMemo(() => [
    { id: 'factual-retrieval', name: 'Factual Knowledge Access', layer: 18, description: 'Circuit responsible for direct fact lookup.' },
    { id: 'geographic-context', name: 'Geographic Contextualizer', layer: 12, description: 'Understands and links geographical entities.' },
    { id: 'sentiment-analysis', name: 'Sentiment Analyzer', layer: 10, description: 'Detects positive/negative sentiment in text.' },
    { id: 'reasoning-step-connector', name: 'Logical Step Connector', layer: 14, description: 'Connects sequential steps in a reasoning chain.' }
  ], []);

  const interventionTypes = useMemo(() => [
    { id: 'ablation', name: 'Feature Ablation', description: "Simulates removing or suppressing a feature's influence completely." },
    { id: 'activation', name: 'Feature Activation', description: "Simulates artificially boosting a feature's normal activation strength." },
    { id: 'modification', name: 'Feature Modification', description: "Simulates altering a feature's output or steering its direction (conceptual). " }
  ], []);

  const examplePrompts = useMemo(() => [
    "What is the capital of France? Write a sentence about it.",
    "Is Paris a large city? Explain briefly.",
    "How does the Eiffel Tower make you feel?"
  ], []);

  const addInterventionToQueue = () => {
    const featureName = availableFeatures.find(f => f.id === selectedTargetFeature)?.name || 'Unknown Feature';
    const typeName = interventionTypes.find(t => t.id === selectedInterventionType)?.name || 'Unknown Type';
    const newIntervention: InterventionExperiment = {
      id: Date.now().toString(),
      name: `${typeName} on "${featureName}"`,
      description: `Type: ${selectedInterventionType}, Strength: ${interventionStrength.toFixed(1)}, Feature: ${featureName}`,
      prompt: currentPrompt,
      targetFeature: selectedTargetFeature,
      interventionType: selectedInterventionType,
      strength: interventionStrength
    };
    setQueuedInterventions(prev => [...prev, newIntervention]);
  };

  const removeInterventionFromQueue = (id: string) => {
    setQueuedInterventions(prev => prev.filter(i => i.id !== id));
  };

  const runAllQueuedInterventions = async () => {
    if (queuedInterventions.length === 0) {
      setError("No interventions in the queue to run.");
      return;
    }
    setIsAnalyzing(true);
    setInterventionResults([]);
    setError('');
    let currentResults: InterventionResult[] = [];

    for (const experiment of queuedInterventions) {
      try {
        // Get baseline response from LLM
        const baselineMessages = [
          { role: "user" as const, content: experiment.prompt }
        ];
        
        const baselineOutput = await llmService.sendMessage(baselineMessages, experiment.prompt);
        
        // Generate intervention prompt based on type and feature
        const interventionPrompt = generateInterventionPrompt(experiment, baselineOutput);
        const interventionMessages = [
          { role: "system" as const, content: "You are simulating the effects of neural interventions on language model responses. Follow the instructions carefully to show how the specified intervention would modify the output." },
          { role: "user" as const, content: interventionPrompt }
        ];

        const modifiedOutput = await llmService.sendMessage(interventionMessages, interventionPrompt);
        
        // Calculate simulated confidence based on intervention
        let confidence = 0.90;
        if (experiment.interventionType === 'ablation') {
          confidence = Math.max(0.2, 0.9 - experiment.strength * 0.6);
        } else if (experiment.interventionType === 'activation') {
          confidence = Math.min(0.99, 0.9 + experiment.strength * 0.08);
        } else {
          confidence = Math.max(0.3, 0.9 - experiment.strength * 0.4);
        }

        const modificationEffect = `${experiment.interventionType} intervention on ${experiment.targetFeature} with strength ${experiment.strength.toFixed(1)}`;

        currentResults.push({
          experimentName: experiment.name,
          originalPrompt: experiment.prompt,
          originalOutput: baselineOutput,
          modifiedOutput,
          interventionType: experiment.interventionType,
          targetFeatures: [experiment.targetFeature],
          strength: experiment.strength,
          confidence,
          simulatedEffectDescription: modificationEffect
        });
        
        setInterventionResults([...currentResults]);
        
      } catch (err: any) {
        console.error("Error in intervention experiment:", err);
        setError(`Failed to run intervention: ${err.message}`);
        break;
      }
    }
    setIsAnalyzing(false);
  };

  const generateInterventionPrompt = (experiment: InterventionExperiment, baselineOutput: string): string => {
    const featureName = availableFeatures.find(f => f.id === experiment.targetFeature)?.name || experiment.targetFeature;
    
    let interventionDescription = '';
    switch (experiment.interventionType) {
      case 'ablation':
        interventionDescription = `completely suppress or remove the "${featureName}" capability`;
        break;
      case 'activation':
        interventionDescription = `artificially boost and enhance the "${featureName}" capability`;
        break;
      case 'modification':
        interventionDescription = `alter and redirect the "${featureName}" capability`;
        break;
    }

    return `Original prompt: "${experiment.prompt}"
Original response: "${baselineOutput}"

Now simulate what would happen if we ${interventionDescription} in the language model's processing (strength: ${experiment.strength}/1.0).

Show how this intervention would modify the response. Be specific about the changes and make them realistic based on the intervention type.`;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 1 }}>
        Intervention Laboratory
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, opacity: 0.85, color: 'text.secondary' }}>
        Design and run causal interventions on model features using real LLM responses. This playground demonstrates how modifying specific features can impact output for a given prompt.
        <br/>The interventions are simulated by prompting the LLM to show how different neural features might affect its responses.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper className="glass-card" sx={{ p: {xs:2, md:3}, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{color: 'text.primary'}}>Experiment Designer</Typography>
            
            <TextField
              fullWidth
              label="Test Prompt for this Intervention"
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Examples:</Typography>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {examplePrompts.map((ex, i) => <Chip key={i} label={ex} onClick={() => setCurrentPrompt(ex)} size="small" variant="outlined" sx={{cursor:'pointer'}}/>)}
            </Box>
            <Divider sx={{ my: 1 }} />
            <FormControl fullWidth sx={{ my: 1.5 }}>
              <InputLabel id="intervention-type-label">Intervention Type</InputLabel>
              <Select 
                labelId="intervention-type-label" 
                value={selectedInterventionType} 
                onChange={(e) => setSelectedInterventionType(e.target.value as any)} 
                label="Intervention Type"
              >
                {interventionTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
              </Select>
              <Typography variant="caption" sx={{color:'text.secondary', mt:0.5}}>{interventionTypes.find(t=>t.id === selectedInterventionType)?.description}</Typography>
            </FormControl>

            <FormControl fullWidth sx={{ my: 1.5 }}>
              <InputLabel id="target-feature-label">Target Feature (Conceptual)</InputLabel>
              <Select 
                labelId="target-feature-label" 
                value={selectedTargetFeature} 
                onChange={(e) => setSelectedTargetFeature(e.target.value)} 
                label="Target Feature (Conceptual)"
              >
                {availableFeatures.map(feature => (
                  <MenuItem key={feature.id} value={feature.id}>
                    <ListItemText primary={feature.name} secondary={`Layer ${feature.layer} (Conceptual)`} />
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" sx={{color:'text.secondary', mt:0.5}}>{availableFeatures.find(f=>f.id === selectedTargetFeature)?.description}</Typography>
            </FormControl>

            <Typography variant="subtitle2" gutterBottom sx={{color: 'text.secondary', mt:1.5}}>Intervention Strength</Typography>
            <Slider 
                value={interventionStrength} 
                onChange={(event: any, value: number | number[]) => setInterventionStrength(value as number)} 
                min={0.1} max={1} step={0.1} 
                sx={{ mb: 1, color: 'secondary.main' }}
                marks={[{value:0.1, label:'Weak'},{value:0.5, label:'Mid'},{value:1, label:'Strong'}]} 
                valueLabelDisplay="auto"
            />
            
            <Button variant="outlined" onClick={addInterventionToQueue} disabled={!currentPrompt.trim()} sx={{ my: 2, color: 'secondary.main', borderColor: 'secondary.main', '&:hover': { borderColor: 'secondary.dark', backgroundColor: (theme: Theme) => theme.palette.secondary.main + '1A'} }}>Add to Queue</Button>
            
            {queuedInterventions.length > 0 && (
              <Box sx={{flexGrow:1}}>
                <Typography variant="h6" gutterBottom sx={{color: 'text.primary', mt:1}}>Intervention Queue ({queuedInterventions.length})</Typography>
                <Paper variant="outlined" sx={{ maxHeight: '200px', overflowY: 'auto', p:1, background: 'rgba(0,0,0,0.15)', borderColor: (theme: Theme) => theme.palette.divider }}>
                  <List dense>
                    {queuedInterventions.map((exp, index) => (
                      <ListItem 
                        key={exp.id} 
                        secondaryAction={<IconButton edge="end" aria-label="delete" onClick={() => removeInterventionFromQueue(exp.id)}><DeleteIcon sx={{color: (theme: Theme) => theme.palette.text.secondary, '&:hover': {color: (theme: Theme) => theme.palette.error.light}}} /></IconButton>}>
                        <ListItemText primary={`${index + 1}. ${exp.name}`} secondary={`Prompt: "${exp.prompt.substring(0,30)}..."`} sx={{mr:3, '& .MuiListItemText-secondary': {color: 'text.disabled'}}}/>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}
            <Button variant="contained" color="primary" onClick={runAllQueuedInterventions} disabled={isAnalyzing || queuedInterventions.length === 0} fullWidth sx={{ mt: 'auto', py: 1.5 }}>
              {isAnalyzing ? <CircularProgress size={24} color="inherit" /> : `Run ${queuedInterventions.length} Intervention(s)`}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper className="glass-card" sx={{ p: {xs:2, md:3}, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" gutterBottom sx={{color: 'text.primary'}}>Results</Typography>
              {interventionResults.length > 0 && <Chip label={`${interventionResults.length} result(s)`} color="secondary" size="small" sx={{fontWeight: 500}}/>}
            </Box>

            {isAnalyzing && interventionResults.length === 0 && (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow:1, minHeight: '300px' }}>
                <CircularProgress size={40} color="secondary" />
                <Typography sx={{ml: 2, color: 'text.secondary'}}>Running interventions...</Typography>
              </Box>
            )}
            {!isAnalyzing && interventionResults.length === 0 && !error && (
              <Alert severity="info" sx={{mt:2, flexGrow:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
                Design interventions, add them to the queue, and click "Run Intervention(s)" to see real LLM-generated outcomes.
              </Alert>
            )}
            {error && <Alert severity="error" sx={{mt:2}}>{error}</Alert>}

            {interventionResults.length > 0 && (
              <Box sx={{ flexGrow: 1, overflowY: 'auto', pr:1 }}>
                {interventionResults.map((res, index) => (
                  <Card key={index} className="glass-card" sx={{ mb: 2, p:1, background: (theme: Theme) => theme.palette.background.paper + '99' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{color: 'secondary.light'}}>{index + 1}. {res.experimentName}</Typography>
                      <Typography variant="caption" display="block" sx={{color: 'text.disabled', mb:1}}>Prompt: "{res.originalPrompt}"</Typography>
                      
                      <Divider sx={{my:1, borderColor: (theme: Theme) => theme.palette.divider + '80'}}/>
                      <Typography variant="body2" sx={{color: 'text.secondary'}}><strong>Baseline Output:</strong> {res.originalOutput}</Typography>
                      <Divider sx={{my:1, borderColor: (theme: Theme) => theme.palette.divider + '80'}}/>
                      <Typography variant="body2" sx={{color: res.confidence < 0.5 ? 'error.light' : 'success.light'}}>
                        <strong>Modified Output (Confidence: {(res.confidence * 100).toFixed(0)}%):</strong> {res.modifiedOutput}
                      </Typography>
                       <Divider sx={{my:1, borderColor: (theme: Theme) => theme.palette.divider + '80'}}/>
                      <Typography variant="body2" sx={{fontStyle:'italic', color:'info.light', mt:1}}>
                        <ScienceIcon sx={{fontSize:'1rem', verticalAlign:'bottom', mr:0.5, color: 'info.main'}}/>
                        Effect: {res.simulatedEffectDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InterventionLaboratory;