import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  useTheme
} from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { AttributionGraph, AttributionNode, AttributionEdge } from '../utils/types';

// Purple color constant for consistency
const PURPLE_COLOR = '#7A00E6';

const AttributionGraphViewer: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [selectedPrompt, setSelectedPrompt] = useState('The capital of France is');
  const [attributionGraph, setAttributionGraph] = useState<AttributionGraph | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AttributionNode | null>(null);

  const examplePrompts = [
    'The capital of France is',
    'John went to the store. He bought',
    'The derivative of x^2 is',
    '2 + 2 equals',
    'Please help me with something dangerous'
  ];

  const fetchAttributionGraph = async (prompt: string) => {
    setLoading(true);
    setSelectedNode(null);
    try {
      console.log(`Fetching attribution graph for: "${prompt}"`);
      const response = await fetch(`/api/attribution/graphs?prompt=${encodeURIComponent(prompt)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const graph = await response.json();
      console.log(`Received graph with ${graph.nodes.length} nodes and ${graph.edges.length} edges`);
      setAttributionGraph(graph);
    } catch (error) {
      console.error('Failed to fetch attribution graph:', error);
      // Enhanced fallback with dynamic prompt-based data
      setAttributionGraph({
        id: 'fallback_graph',
        prompt,
        target_token: 'response',
        nodes: [
          {
            id: 'input_0',
            type: 'input',
            layer: 0,
            position: 0,
            activation: 1.0,
            description: `Input: ${prompt.split(' ')[0]}`,
            coordinates: { x: -2, y: 0, z: 0 }
          },
          {
            id: 'feature_general',
            type: 'feature',
            layer: 15,
            position: 1000,
            activation: 0.65,
            description: 'General language understanding',
            coordinates: { x: 0, y: 1, z: 0 }
          },
          {
            id: 'output_0',
            type: 'output',
            layer: 24,
            position: 0,
            activation: 0.75,
            description: 'Output: response',
            coordinates: { x: 2, y: 0, z: 0 }
          }
        ],
        edges: [
          {
            id: 'edge_fallback_1',
            source: 'input_0',
            target: 'feature_general',
            weight: 0.5,
            type: 'direct',
            layer_span: [0, 15],
            confidence: 0.7
          },
          {
            id: 'edge_fallback_2',
            source: 'feature_general',
            target: 'output_0',
            weight: 0.6,
            type: 'direct',
            layer_span: [15, 24],
            confidence: 0.8
          }
        ],
        metadata: {
          model: 'fallback',
          creation_date: new Date().toISOString(),
          total_attribution_accounted: 0.65,
          methodology: 'fallback_visualization',
          prompt_type: 'general',
          num_tokens: prompt.split(' ').length,
          num_features: 1
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPrompt) {
      fetchAttributionGraph(selectedPrompt);
    }
  }, [selectedPrompt]);

  const getNodeColor = (node: AttributionNode) => {
    switch (node.type) {
      case 'input': return '#4CAF50';
      case 'output': return '#FF5722';
      case 'feature': return '#2196F3';
      case 'hidden': return '#9C27B0';
      default: return '#757575';
    }
  };

  const AttributionNode3D: React.FC<{ node: AttributionNode; isSelected: boolean }> = ({ node, isSelected }) => {
    const color = getNodeColor(node);
    const scale = isSelected ? 1.5 : 1.0;

    return (
      <group position={[node.coordinates.x, node.coordinates.y, node.coordinates.z]}>
        <Sphere
          args={[0.1 * scale, 16, 16]}
          onClick={() => setSelectedNode(node)}
        >
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.8}
            emissive={isSelected ? color : '#000000'}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
        </Sphere>
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.08}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {node.type}
        </Text>
      </group>
    );
  };

  const AttributionEdge3D: React.FC<{ edge: AttributionEdge; nodes: AttributionNode[] }> = ({ edge, nodes }) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return null;

    const points = [
      new THREE.Vector3(sourceNode.coordinates.x, sourceNode.coordinates.y, sourceNode.coordinates.z),
      new THREE.Vector3(targetNode.coordinates.x, targetNode.coordinates.y, targetNode.coordinates.z)
    ];

    const color = edge.weight > 0 ? '#4CAF50' : '#F44336';
    const opacity = Math.abs(edge.weight);

    return (
      <Line
        points={points}
        color={color}
        lineWidth={Math.abs(edge.weight) * 5}
        transparent
        opacity={opacity}
      />
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '90vh', overflow: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 1 }}>
        🔗 Attribution Graph Viewer
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Visualize how information flows through language models using dynamic attribution graphs 
        from interpretability research. See how different prompts activate different features and pathways - 
        try mathematical queries, geographic questions, or safety-sensitive prompts to see distinct attribution patterns.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Interactive Research Tool:</strong> Attribution graphs show computational paths from inputs to outputs, 
        revealing which model components contribute to specific predictions. Each prompt type 
        (geographic, mathematical, narrative, safety) shows different feature activation patterns.
      </Alert>

      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Prompt Selection
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Example Prompts</InputLabel>
                <Select
                  value={selectedPrompt}
                  onChange={(e) => setSelectedPrompt(e.target.value)}
                  label="Example Prompts"
                >
                  {examplePrompts.map((prompt, idx) => (
                    <MenuItem key={idx} value={prompt}>
                      {prompt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Custom Prompt"
                value={selectedPrompt}
                onChange={(e) => setSelectedPrompt(e.target.value)}
                sx={{ mb: 2 }}
                multiline
                rows={2}
              />

              <Button 
                variant="contained" 
                fullWidth 
                onClick={() => fetchAttributionGraph(selectedPrompt)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Generate Attribution Graph'}
              </Button>
            </CardContent>
          </Card>

          {/* Node Details */}
          {selectedNode && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Node Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={selectedNode.type} 
                    color="primary" 
                    sx={{ mb: 1 }} 
                  />
                  <Typography variant="body2" gutterBottom>
                    <strong>Description:</strong> {selectedNode.description}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Activation:</strong> {selectedNode.activation.toFixed(3)}
                  </Typography>
                  {selectedNode.layer !== undefined && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Layer:</strong> {selectedNode.layer}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    <strong>Position:</strong> {selectedNode.position}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Main Visualization */}
        <Grid item xs={12} md={8}>
          {loading ? (
            <Card sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Generating Attribution Graph...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Analyzing "{selectedPrompt}" for feature pathways
                </Typography>
              </Box>
            </Card>
          ) : attributionGraph ? (
            <>
              {/* 3D Attribution Graph */}
              <Card sx={{ mb: 3, height: '400px' }}>
                <CardContent sx={{ height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    3D Attribution Graph: "{attributionGraph.prompt}"
                  </Typography>
                  <Box sx={{ height: 'calc(100% - 30px)' }}>
                    <Canvas camera={{ position: [5, 5, 5] }}>
                      <ambientLight intensity={0.6} />
                      <pointLight position={[10, 10, 10]} />
                      <OrbitControls />
                      
                      {/* Render nodes */}
                      {attributionGraph.nodes.map((node) => (
                        <AttributionNode3D
                          key={node.id}
                          node={node}
                          isSelected={selectedNode?.id === node.id}
                        />
                      ))}
                      
                      {/* Render edges */}
                      {attributionGraph.edges.map((edge) => (
                        <AttributionEdge3D
                          key={edge.id}
                          edge={edge}
                          nodes={attributionGraph.nodes}
                        />
                      ))}
                    </Canvas>
                  </Box>
                </CardContent>
              </Card>

              {/* Attribution Details */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Attribution Paths
                      </Typography>
                      <List dense>
                        {attributionGraph.edges.map((edge) => {
                          const sourceNode = attributionGraph.nodes.find(n => n.id === edge.source);
                          const targetNode = attributionGraph.nodes.find(n => n.id === edge.target);
                          return (
                            <ListItem key={edge.id}>
                              <ListItemText
                                primary={`${sourceNode?.description} → ${targetNode?.description}`}
                                secondary={`Weight: ${edge.weight.toFixed(3)} | Confidence: ${edge.confidence.toFixed(3)}`}
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Graph Metadata
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">
                          <strong>Model:</strong> {attributionGraph.metadata.model}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Predicted Output:</strong> "{attributionGraph.target_token}"
                          <br />
                          <span style={{ marginLeft: '20px', fontSize: '0.875rem', opacity: 0.8 }}>
                            (Most likely next token based on this prompt)
                          </span>
                        </Typography>
                        {attributionGraph.metadata.prompt_type && (
                          <Typography variant="body2">
                            <strong>Prompt Type:</strong> {attributionGraph.metadata.prompt_type.charAt(0).toUpperCase() + attributionGraph.metadata.prompt_type.slice(1).replace('_', ' ')}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          <strong>Attribution Coverage:</strong> {(attributionGraph.metadata.total_attribution_accounted * 100).toFixed(1)}%
                          <br />
                          <span style={{ marginLeft: '20px', fontSize: '0.875rem', opacity: 0.8 }}>
                            (How much of the output is explained by tracked features)
                          </span>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Analysis Method:</strong> {attributionGraph.metadata.methodology.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          <br />
                          <span style={{ marginLeft: '20px', fontSize: '0.875rem', opacity: 0.8 }}>
                            {attributionGraph.metadata.methodology === 'gradient_based_attribution' 
                              ? '(Traces gradient flow from output back to inputs)'
                              : '(Standard attribution analysis method)'
                            }
                          </span>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Total Nodes:</strong> {attributionGraph.nodes.length} 
                          <br />
                          <span style={{ marginLeft: '20px', fontSize: '0.875rem', opacity: 0.8 }}>
                            • {attributionGraph.metadata.num_tokens || 0} input token nodes
                            <br />
                            • {attributionGraph.metadata.num_features || 0} feature nodes  
                            <br />
                            • 1 output node
                          </span>
                        </Typography>
                        <Typography variant="body2">
                          <strong>Attribution Paths:</strong> {attributionGraph.edges.length} edges
                          <br />
                          <span style={{ marginLeft: '20px', fontSize: '0.875rem', opacity: 0.8 }}>
                            (Information flow connections between nodes)
                          </span>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          ) : (
            <Card sx={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Select a prompt to generate attribution graph
              </Typography>
            </Card>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AttributionGraphViewer;
