import React from 'react';
import { Paper, Typography, Box, Card, CardContent, Button, Divider, Link } from '@mui/material';
import { Biotech as BiotechIcon, AccountTree as AccountTreeIcon, TrendingUp as TrendingUpIcon, Security as SecurityIcon, Launch as LaunchIcon, Explore as ExploreIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const PURPLE_COLOR = '#7A00E6';

const IntroductionTour: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Hero Section - The Interpretability Revolution */}
      <Paper className="glass-card" sx={{ p: { xs: 3, md: 5 }, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 'bold',
          mb: 2
        }}>
          AI Interpretability Research Lab
        </Typography>
        <Typography variant="h5" sx={{ 
          opacity: 0.9, 
          mb: 3, 
          color: theme.palette.text.primary, 
          fontWeight: 300 
        }}>
          Interactive Exploration of Breakthrough Research
        </Typography>
        <Typography variant="body1" sx={{ 
          maxWidth: 900, 
          mx: 'auto', 
          lineHeight: 1.8, 
          color: theme.palette.text.secondary,
          fontSize: '1.1rem',
          mb: 3
        }}>
          The years 2024-2025 marked a revolution in AI interpretability. From extracting 16 million interpretable features 
          to mapping computational pathways, researchers have opened the "black box" of language models. 
          This lab provides hands-on access to these breakthrough discoveries.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ 
            backgroundColor: isDarkMode ? '#333333' : '#F0F0F0',
            color: theme.palette.text.primary,
            px: 2,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 'bold',
            border: `1px solid ${isDarkMode ? '#555555' : '#E0E0E0'}`
          }}>
            300 Features → 16M Features
          </Typography>
          <Typography variant="caption" sx={{ 
            backgroundColor: isDarkMode ? '#2A2A2A' : '#E8E8E8',
            color: theme.palette.text.primary,
            px: 2,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 'bold',
            border: `1px solid ${isDarkMode ? '#555555' : '#E0E0E0'}`
          }}>
            Attribution Graphs
          </Typography>
          <Typography variant="caption" sx={{ 
            backgroundColor: isDarkMode ? '#1E1E1E' : '#E0E0E0',
            color: theme.palette.text.primary,
            px: 2,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 'bold',
            border: `1px solid ${isDarkMode ? '#555555' : '#E0E0E0'}`
          }}>
            AI Biology Revealed
          </Typography>
        </Box>
      </Paper>

      {/* Section 1: Decoding AI Neurons */}
      <Paper className="glass-card" sx={{ p: { xs: 3, md: 5 }, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: theme.palette.text.primary,
          mb: 3,
          fontWeight: 600
        }}>
          Decoding AI Neurons: Sparse Autoencoders in Action
        </Typography>
        
        <Typography variant="body1" sx={{ 
          lineHeight: 1.8, 
          color: theme.palette.text.secondary,
          mb: 3,
          fontSize: '1rem'
        }}>
          Traditional activation analysis fails at scale because neurons in large models are <strong>polysemantic</strong> - 
          each responds to multiple unrelated concepts. The breakthrough came through <strong>sparse autoencoders</strong>, 
          which decompose neural activations into millions of <strong>monosemantic features</strong> - each representing a single, interpretable concept.
        </Typography>

        <Box sx={{ 
          background: isDarkMode ? '#2A2A2A' : '#F5F5F5',
          p: 3,
          borderRadius: 2,
          mb: 3,
          border: `1px solid ${isDarkMode ? '#444444' : '#E0E0E0'}`
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            mb: 2, 
            color: theme.palette.text.primary 
          }}>
            Technical Innovation
          </Typography>
          <Box component="pre" sx={{ 
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: theme.palette.text.secondary,
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}>
{`Traditional: 1 neuron → multiple concepts (polysemantic)
Breakthrough: 1 feature → 1 concept (monosemantic)
Scale: Claude 3 Sonnet 34M parameters → 16M interpretable features

Sparse Coding Objective: f(x) = Encoder(x) where ||f(x)||₀ is minimized
Result: Features activate for specific concepts like "Golden Gate Bridge" or "DNA sequences"`}
          </Box>
        </Box>

        <Card sx={{ 
          border: `1px solid ${isDarkMode ? '#555555' : '#E0E0E0'}`,
          borderRadius: 2,
          background: isDarkMode ? '#2A2A2A' : '#FFFFFF'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BiotechIcon sx={{ fontSize: 32, color: PURPLE_COLOR, mr: 2 }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary 
              }}>
                Explore Real Features
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ 
              mb: 3, 
              color: theme.palette.text.secondary 
            }}>
              See the actual 16 million features extracted from Claude 3 Sonnet. Search through authentic research data, 
              examine activation patterns, and understand how sparse autoencoders reveal AI's internal concepts.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              endIcon={<ExploreIcon />}
              sx={{ 
                backgroundColor: PURPLE_COLOR,
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#5A00B3'
                }
              }}
            >
              Real SAE Explorer
            </Button>
          </CardContent>
        </Card>
      </Paper>

      {/* Section 2: Computational Pathways */}
      <Paper className="glass-card" sx={{ p: { xs: 3, md: 5 }, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: theme.palette.text.primary,
          mb: 3,
          fontWeight: 600
        }}>
          Computational Pathways: Tracing AI Reasoning
        </Typography>
        
        <Typography variant="body1" sx={{ 
          lineHeight: 1.8, 
          color: theme.palette.text.secondary,
          mb: 3,
          fontSize: '1rem'
        }}>
          Individual features are just the beginning. The real breakthrough came from understanding how features <strong>connect and influence each other</strong>. 
          Attribution graphs reveal the <strong>computational pathways</strong> that transform inputs into outputs, showing step-by-step reasoning chains that were previously invisible.
        </Typography>

        <Typography variant="body1" sx={{ 
          lineHeight: 1.8, 
          color: theme.palette.text.secondary,
          mb: 3,
          fontSize: '1rem'
        }}>
          Unlike attention weights (which show where the model looks), <strong>attribution scores</strong> reveal causal influence. 
          Through <strong>activation patching</strong> and <strong>gradient-based attribution</strong>, researchers can now prove 
          which features actually cause specific outputs.
        </Typography>

        <Box sx={{ 
          background: isDarkMode ? '#2A2A2A' : '#F5F5F5',
          p: 3,
          borderRadius: 2,
          mb: 3,
          border: `1px solid ${isDarkMode ? '#444444' : '#E0E0E0'}`
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            mb: 2, 
            color: theme.palette.text.primary 
          }}>
            Attribution vs Attention
          </Typography>
          <Box component="pre" sx={{ 
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: theme.palette.text.secondary,
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}>
{`Input → [Feature A] → [Feature B] → [Feature C] → Output
       0.8 attribution  0.6 attribution  0.9 attribution

Attention: Where the model looks (correlation)
Attribution: What actually influences output (causation)

Validation: Intervention experiments prove causal relationships`}
          </Box>
        </Box>

        {/* Interactive Tools Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card sx={{ 
            border: `1px solid ${isDarkMode ? '#555555' : '#E0E0E0'}`,
            borderRadius: 2,
            background: isDarkMode ? '#2A2A2A' : '#FFFFFF'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountTreeIcon sx={{ fontSize: 32, color: PURPLE_COLOR, mr: 2 }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.text.primary 
                }}>
                  Navigate Reasoning Networks
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ 
                mb: 3, 
                color: theme.palette.text.secondary 
              }}>
                Explore 3D visualizations of how AI models chain reasoning steps. See computational pathways 
                that were invisible before attribution graph analysis.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                endIcon={<ExploreIcon />}
                sx={{ 
                  backgroundColor: PURPLE_COLOR,
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#5A00B3'
                  }
                }}
              >
                Attribution Graph Viewer
              </Button>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            border: `1px solid ${isDarkMode ? '#555555' : '#E0E0E0'}`,
            borderRadius: 2,
            background: isDarkMode ? '#2A2A2A' : '#FFFFFF'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 32, color: PURPLE_COLOR, mr: 2 }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.text.primary 
                }}>
                  Analyze Feature Contributions
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ 
                mb: 3, 
                color: theme.palette.text.secondary 
              }}>
                Examine how individual features contribute to specific predictions. Test your understanding 
                of attribution mechanics with real model analysis.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                endIcon={<ExploreIcon />}
                sx={{ 
                  backgroundColor: PURPLE_COLOR,
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#5A00B3'
                  }
                }}
              >
                Feature Attribution Visualizer
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Paper>

      {/* Section 3: AI Biology in Practice */}
      <Paper className="glass-card" sx={{ p: { xs: 3, md: 5 }, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: theme.palette.text.primary,
          mb: 3,
          fontWeight: 600
        }}>
          AI Biology in Practice: From Circuits to Behavior
        </Typography>
        
        <Typography variant="body1" sx={{ 
          lineHeight: 1.8, 
          color: theme.palette.text.secondary,
          mb: 3,
          fontSize: '1rem'
        }}>
          When individual features combine through attribution circuits, <strong>emergent AI behaviors</strong> arise. 
          Comprehensive analysis of Claude 3.5 Haiku revealed sophisticated capabilities: <strong>multi-step reasoning chains</strong>, 
          <strong>creative planning mechanisms</strong>, and <strong>built-in safety architectures</strong>.
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          mb: 3
        }}>
          <Box sx={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #2A2A2A 0%, #333333 100%)' 
              : 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
            p: 3,
            borderRadius: 2,
            border: `1px solid ${isDarkMode ? '#444444' : '#E0E0E0'}`,
            textAlign: 'center',
            flex: 1,
            boxShadow: isDarkMode 
              ? '0 4px 12px rgba(0,0,0,0.3)' 
              : '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary, 
              mb: 1 
            }}>
              Multi-Step Reasoning
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Genuine logical chains like "Dallas → Texas → Austin"
            </Typography>
          </Box>
          <Box sx={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #2A2A2A 0%, #333333 100%)' 
              : 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
            p: 3,
            borderRadius: 2,
            border: `1px solid ${isDarkMode ? '#444444' : '#E0E0E0'}`,
            textAlign: 'center',
            flex: 1,
            boxShadow: isDarkMode 
              ? '0 4px 12px rgba(0,0,0,0.3)' 
              : '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary, 
              mb: 1 
            }}>
              Creative Planning
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Forward-thinking in poetry: identifying rhymes before writing
            </Typography>
          </Box>
          <Box sx={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #2A2A2A 0%, #333333 100%)' 
              : 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
            p: 3,
            borderRadius: 2,
            border: `1px solid ${isDarkMode ? '#444444' : '#E0E0E0'}`,
            textAlign: 'center',
            flex: 1,
            boxShadow: isDarkMode 
              ? '0 4px 12px rgba(0,0,0,0.3)' 
              : '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary, 
              mb: 1 
            }}>
              Safety Architecture
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Built-in protective mechanisms and harm detection
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          background: isDarkMode ? '#2A2A2A' : '#F5F5F5',
          p: 3,
          borderRadius: 2,
          mb: 3,
          border: `1px solid ${isDarkMode ? '#444444' : '#E0E0E0'}`
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            mb: 2, 
            color: theme.palette.text.primary 
          }}>
            Technical Implementation
          </Typography>
          <Box component="pre" sx={{ 
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: theme.palette.text.secondary,
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}>
{`Individual Features + Attribution Circuits = Emergent AI Behaviors

Cross-Domain Validation:
✓ Mathematical reasoning: Step-by-step logical chains
✓ Creative writing: Planning mechanisms for coherent narratives  
✓ Multilingual processing: Universal vs language-specific circuits
✓ Safety filtering: Real-time harm detection and mitigation

Evaluation: Multi-domain behavioral analysis with circuit intervention`}
          </Box>
        </Box>

        <Card sx={{ 
          border: `1px solid ${isDarkMode ? '#555555' : '#E0E0E0'}`,
          borderRadius: 2,
          background: isDarkMode ? '#2A2A2A' : '#FFFFFF'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ fontSize: 32, color: PURPLE_COLOR, mr: 2 }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary 
              }}>
                Investigate Safety Features
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ 
              mb: 3, 
              color: theme.palette.text.secondary 
            }}>
              Analyze how AI models detect and respond to potentially harmful inputs. Explore the technical mechanisms 
              behind AI safety through real feature analysis and intervention experiments.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              endIcon={<ExploreIcon />}
              sx={{ 
                backgroundColor: PURPLE_COLOR,
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#5A00B3'
                }
              }}
            >
              Safety Features Detector
            </Button>
          </CardContent>
        </Card>
      </Paper>

      {/* Section 4: Research Implications & Your Journey */}
      <Paper className="glass-card" sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: theme.palette.text.primary,
          mb: 3,
          fontWeight: 600
        }}>
          Research Implications & Your Exploration Path
        </Typography>
        
        <Typography variant="body1" sx={{ 
          lineHeight: 1.8, 
          color: theme.palette.text.secondary,
          mb: 3,
          fontSize: '1rem'
        }}>
          These breakthroughs transform how we build and understand AI systems. <strong>Scalable interpretability</strong> enables 
          real-time analysis of model behavior, <strong>safety applications</strong> improve AI alignment, and 
          <strong>development insights</strong> guide the creation of more reliable AI systems.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom sx={{ 
          color: theme.palette.text.primary,
          mb: 2,
          fontWeight: 600
        }}>
          Your Research Journey
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4,
          alignItems: 'stretch'
        }}>
          <Box sx={{ 
            flex: 1,
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              mb: 2, 
              color: theme.palette.text.primary 
            }}>
              🔬 Start with Building Blocks
            </Typography>
            <Typography variant="body2" sx={{ 
              mb: 2, 
              color: theme.palette.text.secondary 
            }}>
              Begin in the <strong>Real SAE Explorer</strong> to understand individual features - the fundamental units of AI cognition.
            </Typography>
            
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              mb: 2, 
              color: theme.palette.text.primary 
            }}>
              📊 Analyze Contributions
            </Typography>
            <Typography variant="body2" sx={{ 
              mb: 2, 
              color: theme.palette.text.secondary 
            }}>
              Deep dive with <strong>Feature Attribution Visualizer</strong> to understand causal relationships in predictions.
            </Typography>
          </Box>
          
          <Box sx={{ 
            flex: 1,
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              mb: 2, 
              color: theme.palette.text.primary 
            }}>
              🌐 Trace Connections
            </Typography>
            <Typography variant="body2" sx={{ 
              mb: 2, 
              color: theme.palette.text.secondary 
            }}>
              Move to <strong>Attribution Graph Viewer</strong> to visualize how features connect in 3D reasoning networks.
            </Typography>
            
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              mb: 2, 
              color: theme.palette.text.primary 
            }}>
              🛡️ Test Safety Mechanisms
            </Typography>
            <Typography variant="body2" sx={{ 
              mb: 2, 
              color: theme.palette.text.secondary 
            }}>
              Investigate protective mechanisms with <strong>Safety Features Detector</strong> to understand AI alignment.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            <strong>Research Foundation:</strong> All tools use authentic data and methods from published Anthropic research
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Link 
              href="https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html" 
              target="_blank"
              sx={{ textDecoration: 'none' }}
            >
              <Button 
                variant="outlined" 
                size="small"
                endIcon={<LaunchIcon />}
                sx={{ 
                  fontSize: '0.8rem',
                  borderColor: PURPLE_COLOR,
                  color: PURPLE_COLOR,
                  '&:hover': {
                    borderColor: '#5A00B3',
                    backgroundColor: 'rgba(122, 0, 230, 0.1)'
                  }
                }}
              >
                Scaling Monosemanticity
              </Button>
            </Link>
            <Link 
              href="https://transformer-circuits.pub/2025/attribution-graphs/methods.html" 
              target="_blank"
              sx={{ textDecoration: 'none' }}
            >
              <Button 
                variant="outlined" 
                size="small"
                endIcon={<LaunchIcon />}
                sx={{ 
                  fontSize: '0.8rem',
                  borderColor: PURPLE_COLOR,
                  color: PURPLE_COLOR,
                  '&:hover': {
                    borderColor: '#5A00B3',
                    backgroundColor: 'rgba(122, 0, 230, 0.1)'
                  }
                }}
              >
                Circuit Tracing Methods
              </Button>
            </Link>
            <Link 
              href="https://transformer-circuits.pub/2025/attribution-graphs/biology.html" 
              target="_blank"
              sx={{ textDecoration: 'none' }}
            >
              <Button 
                variant="outlined" 
                size="small"
                endIcon={<LaunchIcon />}
                sx={{ 
                  fontSize: '0.8rem',
                  borderColor: PURPLE_COLOR,
                  color: PURPLE_COLOR,
                  '&:hover': {
                    borderColor: '#5A00B3',
                    backgroundColor: 'rgba(122, 0, 230, 0.1)'
                  }
                }}
              >
                Biology of LLMs
              </Button>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default IntroductionTour;