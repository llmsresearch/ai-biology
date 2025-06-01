import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  Alert,
  Tabs,
  Tab,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Code as CodeIcon,
  Send as SendIcon
} from '@mui/icons-material';

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: { [key: string]: Response };
  tags: string[];
}

interface Parameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'body';
  required: boolean;
  type: string;
  description: string;
  example?: any;
}

interface RequestBody {
  required: boolean;
  content: {
    'application/json': {
      schema: any;
      example: any;
    };
  };
}

interface Response {
  description: string;
  content?: {
    'application/json': {
      schema: any;
      example: any;
    };
  };
}

const APIPlayground: React.FC = () => {
  const theme = useTheme();
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [requestBody, setRequestBody] = useState<string>('');
  const [queryParams, setQueryParams] = useState<{ [key: string]: string }>({});
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const endpoints: APIEndpoint[] = [
    {
      method: 'GET',
      path: '/health',
      summary: 'Health Check',
      description: 'Check API server status and configuration',
      responses: {
        '200': {
          description: 'Server is healthy',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                status: 'healthy',
                timestamp: '2025-05-31T10:30:00.000Z',
                azure_openai_configured: true
              }
            }
          }
        }
      },
      tags: ['Health']
    },
    {
      method: 'GET',
      path: '/api/sae/features',
      summary: 'Get SAE Features',
      description: 'Retrieve sparse autoencoder features with filtering options',
      parameters: [
        { name: 'layer', in: 'query', required: false, type: 'number', description: 'Filter by model layer', example: 15 },
        { name: 'category', in: 'query', required: false, type: 'string', description: 'Filter by feature category', example: 'factual' },
        { name: 'search', in: 'query', required: false, type: 'string', description: 'Search feature descriptions', example: 'geographic' },
        { name: 'limit', in: 'query', required: false, type: 'number', description: 'Maximum number of results', example: 10 }
      ],
      responses: {
        '200': {
          description: 'List of SAE features',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                features: [
                  {
                    id: 'feature_15_4567',
                    layer: 15,
                    description: 'Geographic locations and place names',
                    activation_frequency: 0.23,
                    category: 'factual',
                    confidence: 0.87
                  }
                ],
                total: 1,
                filters_applied: { layer: 15, category: 'factual', limit: 10 }
              }
            }
          }
        }
      },
      tags: ['SAE']
    },
    {
      method: 'POST',
      path: '/api/sae/analyze',
      summary: 'Analyze Text with SAE',
      description: 'Analyze text input using sparse autoencoder features',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                layer: { type: 'number' },
                model: { type: 'string' }
              },
              required: ['text']
            },
            example: {
              text: 'The capital of France is Paris.',
              layer: 15,
              model: 'claude-3'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'SAE analysis results',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                text: 'The capital of France is Paris.',
                layer: 15,
                model: 'claude-3',
                activations: [
                  {
                    token: 'Paris',
                    position: 5,
                    features: [
                      {
                        feature_id: 4567,
                        activation: 0.73,
                        description: 'Geographic locations',
                        confidence: 0.91
                      }
                    ]
                  }
                ],
                metadata: {
                  total_features: 16,
                  inference_time_ms: 45
                }
              }
            }
          }
        }
      },
      tags: ['SAE']
    },
    {
      method: 'GET',
      path: '/api/attribution/graphs',
      summary: 'Get Attribution Graph',
      description: 'Generate computational pathway visualization',
      parameters: [
        { name: 'prompt', in: 'query', required: true, type: 'string', description: 'Input text to analyze', example: 'The capital of France is' },
        { name: 'model', in: 'query', required: false, type: 'string', description: 'Model name', example: 'claude-3' }
      ],
      responses: {
        '200': {
          description: 'Attribution graph data',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                id: 'graph_1640995200123',
                prompt: 'The capital of France is',
                target_token: 'Paris',
                nodes: [
                  {
                    id: 'input_0',
                    type: 'input',
                    layer: 0,
                    position: 0,
                    activation: 1.0,
                    description: 'Input token: The',
                    coordinates: { x: -3, y: 0, z: 0 }
                  }
                ],
                edges: [
                  {
                    id: 'edge_1',
                    source: 'input_0',
                    target: 'feature_15_0',
                    weight: 0.65,
                    type: 'direct',
                    confidence: 0.82
                  }
                ]
              }
            }
          }
        }
      },
      tags: ['Attribution']
    },
    {
      method: 'POST',
      path: '/api/features/attribution',
      summary: 'Feature Attribution Analysis',
      description: 'Analyze how specific features contribute to target token predictions',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                inputText: { type: 'string' },
                targetToken: { type: 'string' }
              },
              required: ['inputText', 'targetToken']
            },
            example: {
              inputText: 'The capital of France is',
              targetToken: 'Paris'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Feature attribution results',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                features: [
                  {
                    id: 'attribution_feature_0',
                    name: 'Geographic knowledge',
                    layer: 15,
                    activation: 0.73,
                    attribution_strength: 0.82,
                    confidence: 0.91
                  }
                ],
                targetToken: 'Paris',
                totalAttribution: 0.78
              }
            }
          }
        }
      },
      tags: ['Attribution']
    },
    {
      method: 'POST',
      path: '/api/safety/analyze',
      summary: 'Safety Analysis',
      description: 'Analyze text for safety features and risk assessment',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                inputText: { type: 'string' }
              },
              required: ['inputText']
            },
            example: {
              inputText: 'How to bypass security systems and hack into networks'
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Safety analysis results',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                overallRisk: 'danger',
                riskScore: 0.85,
                features: [
                  {
                    id: 'safety-0',
                    name: 'Harmful Content Filter',
                    activation: 0.92,
                    riskLevel: 'critical',
                    triggered: true,
                    confidence: 0.94
                  }
                ],
                recommendations: [
                  'CRITICAL: Block response generation and escalate to human review'
                ]
              }
            }
          }
        }
      },
      tags: ['Safety']
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return '#4CAF50';
      case 'POST': return '#2196F3';
      case 'PUT': return '#FF9800';
      case 'DELETE': return '#F44336';
      default: return '#757575';
    }
  };

  const executeRequest = async () => {
    if (!selectedEndpoint) return;

    setLoading(true);
    setResponse(null);

    try {
      const baseUrl = 'http://localhost:3002';
      let url = baseUrl + selectedEndpoint.path;

      // Add query parameters
      if (selectedEndpoint.method === 'GET' && Object.keys(queryParams).length > 0) {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        url += '?' + params.toString();
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (selectedEndpoint.method !== 'GET' && requestBody) {
        options.body = requestBody;
      }

      const response = await fetch(url, options);
      const data = await response.json();

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: data
      });
    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Network Error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const groupedEndpoints = endpoints.reduce((groups, endpoint) => {
    const tag = endpoint.tags[0] || 'Other';
    if (!groups[tag]) groups[tag] = [];
    groups[tag].push(endpoint);
    return groups;
  }, {} as { [key: string]: APIEndpoint[] });

  return (
    <Paper elevation={3} sx={{ p: 3, height: '90vh', overflow: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 1 }}>
        🔧 API Playground
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Interactive API documentation and testing interface. Select an endpoint below to test it directly.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Server Required:</strong> Make sure the API server is running on http://localhost:3002 before testing endpoints.
      </Alert>

      <Grid container spacing={3}>
        {/* Endpoint List */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>API Endpoints</Typography>
              
              {Object.entries(groupedEndpoints).map(([tag, endpoints]) => (
                <Accordion key={tag} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {tag}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {endpoints.map((endpoint, index) => (
                        <Card
                          key={index}
                          variant="outlined"
                          sx={{
                            cursor: 'pointer',
                            border: selectedEndpoint === endpoint ? 2 : 1,
                            borderColor: selectedEndpoint === endpoint ? 'primary.main' : 'divider',
                            '&:hover': { borderColor: 'primary.main' }
                          }}
                          onClick={() => {
                            setSelectedEndpoint(endpoint);
                            setRequestBody(JSON.stringify(endpoint.requestBody?.content['application/json']?.example || {}, null, 2));
                            setQueryParams({});
                            setResponse(null);
                          }}
                        >
                          <CardContent sx={{ py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Chip
                                label={endpoint.method}
                                size="small"
                                sx={{
                                  bgcolor: getMethodColor(endpoint.method),
                                  color: 'white',
                                  fontWeight: 'bold',
                                  minWidth: 60
                                }}
                              />
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {endpoint.path}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {endpoint.summary}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Request/Response Panel */}
        <Grid item xs={12} md={7}>
          {selectedEndpoint ? (
            <Card>
              <CardContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab label="Request" />
                    <Tab label="Response" />
                    <Tab label="Documentation" />
                  </Tabs>
                </Box>

                {/* Request Tab */}
                {tabValue === 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Chip
                        label={selectedEndpoint.method}
                        sx={{
                          bgcolor: getMethodColor(selectedEndpoint.method),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                        {selectedEndpoint.path}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedEndpoint.description}
                    </Typography>

                    {/* Query Parameters */}
                    {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Query Parameters</Typography>
                        <Grid container spacing={2}>
                          {selectedEndpoint.parameters.map((param, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                              <TextField
                                fullWidth
                                size="small"
                                label={`${param.name} ${param.required ? '*' : ''}`}
                                value={queryParams[param.name] || ''}
                                onChange={(e) => setQueryParams({
                                  ...queryParams,
                                  [param.name]: e.target.value
                                })}
                                placeholder={param.example?.toString() || param.description}
                                helperText={param.description}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}

                    {/* Request Body */}
                    {selectedEndpoint.requestBody && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Request Body</Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={8}
                          value={requestBody}
                          onChange={(e) => setRequestBody(e.target.value)}
                          placeholder="Request body JSON"
                          sx={{ fontFamily: 'monospace' }}
                        />
                      </Box>
                    )}

                    <Button
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
                      onClick={executeRequest}
                      disabled={loading}
                      size="large"
                    >
                      {loading ? 'Sending...' : 'Send Request'}
                    </Button>
                  </Box>
                )}

                {/* Response Tab */}
                {tabValue === 1 && (
                  <Box>
                    {response ? (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Chip
                            label={`${response.status} ${response.statusText}`}
                            color={response.status >= 200 && response.status < 300 ? 'success' : 'error'}
                          />
                        </Box>

                        {response.error ? (
                          <Alert severity="error">
                            <Typography variant="body2">{response.error}</Typography>
                          </Alert>
                        ) : (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>Response Body</Typography>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 2,
                                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                overflow: 'auto',
                                maxHeight: 400
                              }}
                            >
                              <pre>{JSON.stringify(response.data, null, 2)}</pre>
                            </Paper>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Alert severity="info">
                        Send a request to see the response here.
                      </Alert>
                    )}
                  </Box>
                )}

                {/* Documentation Tab */}
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>{selectedEndpoint.summary}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {selectedEndpoint.description}
                    </Typography>

                    {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>Parameters</Typography>
                        {selectedEndpoint.parameters.map((param, index) => (
                          <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                {param.name}
                              </Typography>
                              <Chip label={param.type} size="small" variant="outlined" />
                              {param.required && <Chip label="required" size="small" color="error" />}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {param.description}
                            </Typography>
                            {param.example && (
                              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                Example: {JSON.stringify(param.example)}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}

                    <Typography variant="subtitle1" gutterBottom>Response Examples</Typography>
                    {Object.entries(selectedEndpoint.responses).map(([status, response]) => (
                      <Box key={status} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Status {status}: {response.description}
                        </Typography>
                        {response.content && (
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                              fontFamily: 'monospace',
                              fontSize: '0.875rem'
                            }}
                          >
                            <pre>{JSON.stringify(response.content['application/json'].example, null, 2)}</pre>
                          </Paper>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <CodeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Select an API endpoint
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose an endpoint from the list to test it and view documentation.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default APIPlayground;
