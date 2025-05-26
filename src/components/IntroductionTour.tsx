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

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Hero Section */}
      <Paper className="glass-card" sx={{ p: { xs: 3, md: 5 }, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ 
          background: (theme: Theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold',
          mb: 2
        }}>
          AI Biology Playground
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9, mb: 3, color: 'text.primary', fontWeight: 300 }}>
          Explore the Internal Mechanisms of Language Models
        </Typography>
        <Typography variant="body1" sx={{ 
          maxWidth: 800, 
          mx: 'auto', 
          lineHeight: 1.8, 
          color: 'text.secondary',
          fontSize: '1.1rem'
        }}>
          Just as neuroscientists study brain circuits, we can now examine the "neural pathways" of AI systems, 
          revealing features, connections, and reasoning processes that were previously invisible.
        </Typography>
      </Paper>

      {/* Unified Research & Concepts Section */}
      <Paper className="glass-card" sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="h4" gutterBottom sx={{ 
          textAlign: 'center', 
          color: 'text.primary',
          mb: 4,
          fontWeight: 600
        }}>
          Research Areas & Technical Foundations
        </Typography>
        
        {/* Unified Research Areas & Technical Foundations */}
        <Box>
          <Grid container spacing={3}>
            {/* Research Areas Cards */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%', 
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: 3,
                  borderColor: 'primary.main'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" mb={2}>
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                      <Science sx={{ fontSize: 40, color: 'primary.main' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: 'text.primary',
                        mb: 1.5,
                        fontSize: '1.1rem'
                      }}>
                        Mapping Model Internals
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                      }}>
                        Understanding how language models process and transform information internally, revealing the computational pathways that lead to outputs.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%', 
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: 3,
                  borderColor: 'secondary.main'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" mb={2}>
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                      <Timeline sx={{ fontSize: 40, color: 'secondary.main' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: 'text.primary',
                        mb: 1.5,
                        fontSize: '1.1rem'
                      }}>
                        Circuit Tracing & Attribution
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                      }}>
                        Revealing computational graphs that show how features interact to produce outputs, mapping the "wiring diagram" of model computation.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%', 
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: 3,
                  borderColor: 'primary.main'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" mb={2}>
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                      <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: 'text.primary',
                        mb: 1.5,
                        fontSize: '1.1rem'
                      }}>
                        Features & Interpretation
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                      }}>
                        Extracting interpretable, single-concept features from large models - the building blocks of thought similar to neurons in the brain.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%', 
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: 3,
                  borderColor: 'secondary.main'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="flex-start" mb={2}>
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                      <Language sx={{ fontSize: 40, color: 'secondary.main' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: 'text.primary',
                        mb: 1.5,
                        fontSize: '1.1rem'
                      }}>
                        Intervention Analysis
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                      }}>
                        Testing causal hypotheses about model behavior through controlled experiments by modifying features and observing output changes.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default IntroductionTour;