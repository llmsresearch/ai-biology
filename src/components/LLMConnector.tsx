import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { CheckCircle, Speed } from '@mui/icons-material';
import { LLMConnectionConfig } from '../utils/types';
import UsageAcknowledgment from './UsageAcknowledgment';

interface LLMConnectorProps {
  onConnect: () => void;
}

const LLMConnector: React.FC<LLMConnectorProps> = ({ onConnect }) => {
  const [connecting, setConnecting] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Auto-connect to free GPT-4o on component mount
  useEffect(() => {
    handleConnect();
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    setError('');

    try {
      // Test connection to free GPT-4o service
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'free-gpt4o',
          model: 'gpt-4o'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to GPT-4o service');
      }

      // Store the free GPT-4o configuration
      const configToStore: LLMConnectionConfig = {
        selectedProvider: 'free-gpt4o',
        modelName: 'gpt-4o',
        supportsFeaturesExtraction: true,
        isSponsored: true,
        apiEndpoint: '/api/free-gpt4o'
      };
      
      localStorage.setItem('llmConnectionConfig', JSON.stringify(configToStore));
      setConnected(true);
      onConnect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setConnected(false);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <>
      <UsageAcknowledgment variant="modal" />
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 150px)">
        <Paper className="glass-card" sx={{ maxWidth: 600, width: '100%', p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3, color: 'text.primary' }}>
          AI Biology Playground
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, opacity: 0.85, color: 'text.secondary', textAlign: 'center' }}>
          Ready to explore AI interpretability research with free GPT-4o access. 
          No setup required - just start experimenting!
        </Typography>

        {/* Connection Status Card */}
        <Card sx={{ mb: 3, backgroundColor: connected ? '#e8f5e8' : '#fff3e0' }}>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
              {connected ? (
                <>
                  <CheckCircle color="success" />
                  <Typography variant="h6" color="success.main">
                    Connected to GPT-4o
                  </Typography>
                </>
              ) : (
                <>
                  <Speed color="warning" />
                  <Typography variant="h6" color="warning.main">
                    Connecting to GPT-4o...
                  </Typography>
                </>
              )}
            </Box>
            
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              {connected 
                ? "✨ Free access provided for educational research"
                : "Setting up your AI research environment"
              }
            </Typography>
          </CardContent>
        </Card>

        {/* Features Display */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ 
            textAlign: 'center', 
            color: 'text.secondary',
            fontStyle: 'italic',
            opacity: 0.8
          }}>
            Free educational access to GPT-4o for AI interpretability research
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
            <Box sx={{ mt: 1 }}>
              <Button 
                size="small" 
                onClick={handleConnect}
                disabled={connecting}
              >
                Retry Connection
              </Button>
            </Box>
          </Alert>
        )}

        {!connected && (
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={handleConnect} 
            disabled={connecting}
            sx={{ py: 1.5, mb: 2 }}
          >
            {connecting ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} color="inherit" />
                <span>Connecting...</span>
              </Box>
            ) : (
              'Connect to GPT-4o'
            )}
          </Button>
        )}

        {connected && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>🎉 Ready to Explore!</strong> Your free GPT-4o connection is active. 
              You can now use all the AI interpretability research tools.
            </Typography>
          </Alert>
        )}

      </Paper>
    </Box>
    </>
  );
};

export default LLMConnector;