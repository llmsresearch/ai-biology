import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { LLMConnectionConfig } from '../utils/types'; // Import from types.ts

interface LLMConnectorProps {
  onConnect: () => void;
}

// LLMConnectionConfig is now imported from types.ts
// interface LLMConnectionConfig { ... } // This local definition is removed

const LLMConnector: React.FC<LLMConnectorProps> = ({ onConnect }) => {
  const [provider, setProvider] = useState<string>('free-gpt4o');
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('gpt-4o');
  const [customModel, setCustomModel] = useState<string>('');
  const [useCustomModel, setUseCustomModel] = useState<boolean>(false);
  const [customEndpoint, setCustomEndpoint] = useState<string>('');
  
  const [azureEndpoint, setAzureEndpoint] = useState<string>('');
  const [azureApiKey, setAzureApiKey] = useState<string>('');
  const [azureDeploymentName, setAzureDeploymentName] = useState<string>('');
  const [azureApiVersion, setAzureApiVersion] = useState<string>('2024-12-01-preview');
  
  const [connecting, setConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const providers = [
    { value: 'free-gpt4o', label: '🎁 Free GPT-4o (Sponsored)', models: ['gpt-4o'], description: 'Use our sponsored GPT-4o for free!' },
    { value: 'openai', label: 'OpenAI (Your API Key)', models: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo', 'gpt-4o'], description: 'Use your own OpenAI API key' },
    { value: 'azure-openai', label: 'Azure OpenAI (Your Account)', models: ['gpt-4', 'gpt-35-turbo', 'gpt-4-turbo', 'gpt-4o'], description: 'Use your Azure OpenAI deployment' },
    { value: 'anthropic', label: 'Anthropic Claude (Your API Key)', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'], description: 'Use your Anthropic API key' },
    { value: 'ollama', label: 'Ollama (Local)', models: ['llama2', 'mistral', 'codellama'], description: 'Run models locally with Ollama' },
    { value: 'custom', label: 'Custom API', models: ['custom-model'], description: 'Connect to any custom endpoint' }
  ];

  const selectedProviderData = providers.find(p => p.value === provider);

  const handleConnect = async () => {
    setConnecting(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      const currentModelName = useCustomModel ? customModel : model;

      const configToStore: LLMConnectionConfig = {
        selectedProvider: provider,
        modelName: currentModelName,
        supportsFeaturesExtraction: true 
      };

      if (provider === 'free-gpt4o') {
        configToStore.isSponsored = true;
        configToStore.apiEndpoint = '/api/azure-openai/free';
        configToStore.modelName = 'gpt-4o';
      } else if (provider === 'azure-openai') {
        configToStore.apiEndpoint = '/api/llm/proxy'; 
        configToStore.proxyDetails = {
            providerType: 'azure',
            apiKey: azureApiKey,
            endpoint: azureEndpoint,
            deploymentName: azureDeploymentName,
            apiVersion: azureApiVersion
        };
      } else if (provider === 'openai') {
        configToStore.apiEndpoint = '/api/llm/proxy';
        configToStore.proxyDetails = {
            providerType: 'openai',
            apiKey: apiKey,
        };
      } else if (provider === 'anthropic') {
        configToStore.apiEndpoint = '/api/llm/proxy';
        configToStore.proxyDetails = {
            providerType: 'anthropic',
            apiKey: apiKey,
        };
      } else if (provider === 'custom') {
        configToStore.customEndpoint = customEndpoint; 
        configToStore.apiKey = apiKey; 
      } else if (provider === 'ollama') {
        configToStore.ollamaBaseUrl = customEndpoint || 'http://localhost:11434';
      }
      
      localStorage.setItem('llmConnectionConfig', JSON.stringify(configToStore));
      onConnect();
    } catch (err) {
      setError('Failed to connect to LLM. Please check your credentials and endpoint.');
    } finally {
      setConnecting(false);
    }
  };

  const isValid = () => {
    if (provider === 'free-gpt4o') return true;
    const currentModelName = useCustomModel ? customModel : model;
    if (!currentModelName) return false;
    if (provider === 'ollama') return true; // Ollama URL can be empty for default
    if (provider === 'azure-openai') {
      return azureEndpoint && azureApiKey && azureDeploymentName;
    }
    if (provider === 'custom') return customEndpoint && apiKey;
    return apiKey;
  };

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    setError('');
    setUseCustomModel(false);
    setCustomModel('');
    setApiKey('');
    setCustomEndpoint('');
    setAzureApiKey('');
    setAzureEndpoint('');
    setAzureDeploymentName('');

    const newProviderConfig = providers.find(p => p.value === newProvider);
    if (newProviderConfig && newProviderConfig.models.length > 0) {
      setModel(newProviderConfig.models[0]);
    } else {
      setModel(''); // No default model if provider has no models listed
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 150px)">
      <Paper className="glass-card" sx={{ maxWidth: 600, width: '100%', p: {xs: 2, md:4} }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3, color: 'text.primary' }}>
          Connect Your LLM
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, opacity: 0.85, color: 'text.secondary', textAlign: 'center' }}>
          To explore AI Biology concepts, connect your preferred language model. The playground will use your connected LLM for real analysis and response generation across all experiments.
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="llm-provider-label">LLM Provider</InputLabel>
          <Select
            labelId="llm-provider-label"
            value={provider}
            onChange={(e) => handleProviderChange(e.target.value)}
            label="LLM Provider"
          >
            {providers.map(p => (
              <MenuItem key={p.value} value={p.value}>
                <Box>
                  <Typography variant="body1">{p.label}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>{p.description}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {provider === 'free-gpt4o' && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>🎉 Free GPT-4o Access!</strong> You're using our sponsored Azure OpenAI GPT-4o deployment. 
              No API key required! This is perfect for exploring AI Biology concepts without any setup.
            </Typography>
          </Alert>
        )}

        {provider === 'azure-openai' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
              <Chip label="Azure" color="primary" size="small" sx={{ mr: 1 }} />
              Azure OpenAI Configuration
            </Typography>
            <TextField fullWidth label="Azure OpenAI Endpoint" value={azureEndpoint} onChange={(e) => setAzureEndpoint(e.target.value)} sx={{ mb: 2 }} placeholder="https://your-resource.openai.azure.com/" helperText="Your Azure OpenAI resource endpoint URL" />
            <TextField fullWidth label="Azure API Key" type="password" value={azureApiKey} onChange={(e) => setAzureApiKey(e.target.value)} sx={{ mb: 2 }} placeholder="Enter your Azure OpenAI API key" helperText="Found in Azure Portal > Your OpenAI Resource > Keys and Endpoint" />
            <TextField fullWidth label="Deployment Name" value={azureDeploymentName} onChange={(e) => setAzureDeploymentName(e.target.value)} sx={{ mb: 2 }} placeholder="my-gpt-4o-deployment" helperText="The name of your model deployment in Azure" />
            <TextField fullWidth label="API Version" value={azureApiVersion} onChange={(e) => setAzureApiVersion(e.target.value)} sx={{ mb: 2 }} placeholder="2024-12-01-preview" helperText="Azure OpenAI API version (e.g., 2024-12-01-preview)" />
            <Divider sx={{ my: 2 }} />
          </Box>
        )}
        
        {(provider === 'openai' || provider === 'anthropic') && (
          <Box sx={{ mb: 3 }}>
             <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
              <Chip label={selectedProviderData?.label.split(' ')[0]} color="secondary" size="small" sx={{ mr: 1 }} />
              API Key Configuration
            </Typography>
            <TextField fullWidth label="API Key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} sx={{ mb: 2 }} placeholder={`Enter your ${selectedProviderData?.label.split(' (')[0]} API key`} />
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        {(provider === 'custom' || provider === 'ollama') && (
           <Box sx={{ mb: 3 }}>
             <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
              <Chip label={provider === 'custom' ? "Custom API" : "Ollama"} color="info" size="small" sx={{ mr: 1 }} />
              Endpoint Configuration
            </Typography>
            <TextField fullWidth label={provider === 'ollama' ? "Ollama Base URL (Optional)" : "Custom API Endpoint URL"} value={customEndpoint} onChange={(e) => setCustomEndpoint(e.target.value)} sx={{ mb: 2 }} placeholder={provider === 'ollama' ? "http://localhost:11434 (default if empty)" : "https://your.custom.api/endpoint"} />
            {provider === 'custom' && 
                <TextField fullWidth label="API Key (Optional)" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} sx={{ mb: 2 }} placeholder="Enter API Key if your custom endpoint requires it" />
            }
            <Divider sx={{ my: 2 }} />
           </Box>
        )}

        {(provider !== 'free-gpt4o' && provider !== 'ollama') && (
            <>
                <FormControl fullWidth sx={{ mb: provider === 'custom' ? 0 : 3 }}>
                    <InputLabel id="model-select-label">Select Model</InputLabel>
                    <Select 
                        labelId="model-select-label"
                        value={useCustomModel ? 'custom-model-entry' : model}
                        onChange={(e) => {
                            if (e.target.value === 'custom-model-entry') {
                                setUseCustomModel(true);
                                setModel(''); // Clear standard model selection
                            } else {
                                setUseCustomModel(false);
                                setModel(e.target.value as string);
                            }
                        }}
                        label="Select Model"
                    >
                        {selectedProviderData?.models.map(m => (
                            <MenuItem key={m} value={m}>{m}</MenuItem>
                        ))}
                        {(provider === 'azure-openai' || provider === 'openai' || provider === 'custom' || provider === 'anthropic') && 
                            <MenuItem value="custom-model-entry"><em>Specify custom model name...</em></MenuItem>}
                    </Select>
                </FormControl>

                {useCustomModel && (
                    <TextField 
                        fullWidth 
                        label="Custom Model Name" 
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        sx={{ mt: 2, mb:3 }}
                        helperText={provider === 'azure-openai' ? "Ensure this matches a deployment name if different from common models." : "Specify the exact model identifier for your chosen provider."}
                    />
                )}
            </>
        )}

        {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}

        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={handleConnect} 
          disabled={connecting || !isValid()}
          sx={{ py: 1.5, color: 'white'}} // Ensure text color is white on primary button
        >
          {connecting ? <CircularProgress size={24} color="inherit"/> : (llmConnectionConfig ? 'Update Connection' : 'Connect LLM')}
        </Button>
        {llmConnectionConfig && <Typography variant="caption" display="block" sx={{mt:1, textAlign:'center', color: 'text.secondary'}}>LLM is currently connected. You can update settings or disconnect via the top bar.</Typography>}
      </Paper>
    </Box>
  );
};

// Helper to get existing config for display purposes, not used for connection logic itself
const llmConnectionConfig = localStorage.getItem('llmConnectionConfig');

export default LLMConnector;