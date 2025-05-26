import React from 'react';
import { Paper, Typography, Box, Grid, Card, CardContent, Chip } from '@mui/material';
import { Psychology, Timeline, Language, Science } from '@mui/icons-material';
import { Theme } from '@mui/material/styles';

const IntroductionTour: React.FC = () => {
  const concepts = [
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: "Features: Building Blocks of Thought",
      description: "Features are interpretable concepts embedded in model activations, similar to neurons in the brain. Recent work on monosemanticity shows how to extract features that correspond to single, human-understandable ideas."
    },
    {
      icon: <Timeline sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Attribution Graphs: Computational Pathways",
      description: "Attribution graphs map how features interact to produce a model's output, as described in Circuit Tracing. This makes it possible to trace reasoning steps inside the model."
    },
    {
      icon: <Language sx={{ fontSize: 40, color: '#00ACC1' /* Teal variant */ }} />,
      title: "Circuit Tracing: Neural Wiring",
      description: "Circuit tracing reveals the 'wiring diagram' of a model's internal computation, much like mapping neural circuits in biology."
    },
    {
      icon: <Science sx={{ fontSize: 40, color: '#78909C' /* Blue Grey */ }} />,
      title: "Interventions: Controlled Experiments",
      description: "By modifying features and observing changes in output, researchers can test causal hypotheses about model behavior, as demonstrated in Circuit Tracing."
    }
  ];

  const discoveries = [
    {
      title: "Multi-Step Reasoning",
      description: "Models perform genuine reasoning with intermediate steps, not just memorization",
      example: "Dallas → Texas → Austin"
    },
    {
      title: "Planning Ahead",
      description: "Models think several words ahead when generating text, especially in poetry",
      example: "Pre-selecting rhyme words before writing lines"
    },
    {
      title: "Universal Language",
      description: "Shared conceptual space across different languages in model internals",
      example: "Same features for 'cat' in English, French, and Chinese"
    },
    {
      title: "Hallucination Detection",
      description: "Models can be caught fabricating reasoning when given incorrect hints",
      example: "Making up mathematical steps to agree with wrong answers"
    }
  ];

  return (
    <Box>
      <Paper className="glass-card" sx={{ p: {xs: 2, md: 4}, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ 
          background: (theme: Theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold' 
        }}>
          Welcome to AI Biology
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9, mb: 1, color: 'text.primary' }}>
          Explore the Internal Mechanisms of Language Models
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.7, color: 'text.secondary' }}>
            This playground lets you visualize how language models think internally. Just as neuroscientists study brain circuits, we can now examine the "neural pathways" of AI systems, revealing features, connections, and reasoning processes that were previously invisible.
            <br/><br/>
            <strong>Key Research Areas:</strong>
          </Typography>
        </Box>
        <Box sx={{ maxWidth: 700, mx: 'auto', textAlign: 'left' }}>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li><strong>Mapping Model Internals:</strong> Understanding how language models process and transform information internally</li>
            <li><strong>Circuit Tracing:</strong> Revealing computational graphs that show how features interact to produce outputs</li>
            <li><strong>Feature Interpretation:</strong> Extracting interpretable, single-concept features from large models</li>
            <li><strong>Intervention Analysis:</strong> Testing causal hypotheses about model behavior through controlled experiments</li>
          </ul>
        </Box>
      </Paper>

      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
        Core Concepts
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {concepts.map((concept, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card className="glass-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: (theme: Theme) => `0 12px 20px 0 ${theme.palette.mode === 'dark' ? 'rgba(10, 20, 80, 0.3)' : 'rgba(0,0,0,0.1)'}` } }}>
              <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box sx={{ mr: 2 }}>
                    {concept.icon} 
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    {concept.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.6, color: 'text.secondary' }}>
                  {concept.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
        Key Discoveries from Research
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}> 
        {discoveries.map((discovery, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper className="glass-card" sx={{ p: 3, height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" gutterBottom color="secondary.light">
                  {discovery.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.85, color: 'text.secondary' }}>
                  {discovery.description}
                </Typography>
              </Box>
              <Chip 
                label={discovery.example} 
                size="small" 
                variant="outlined"
                sx={{ 
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  mt: 'auto'
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper className="glass-card" sx={{ p: {xs:2, md:4}, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom color="text.primary">
          Ready to Explore?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.85, color: 'text.secondary' }}>
          Select a playground from the navigation menu to dive into interactive experiments and visualize these concepts in action.
          Each experiment demonstrates different aspects of AI interpretability research with interactive visualizations.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          <Chip label="🔬 Intervention Laboratory" color="primary" variant="outlined" />
          <Chip label="🌐 Multilingual Circuits" color="secondary" variant="outlined" />
          <Chip label="🧠 Multi-Step Reasoning" color="primary" variant="outlined" />
          <Chip label="📝 Poetry Planning" color="secondary" variant="outlined" />
        </Box>
      </Paper>
    </Box>
  );
};

export default IntroductionTour;