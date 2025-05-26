require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { AzureOpenAI } = require('openai');
const axios = require('axios');

const app = express();
const port = process.env.API_PORT || 3001;
// Use API version from environment variable if available, or fallback to default
const API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview';
console.log('Using Azure OpenAI API version:', API_VERSION);

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(helmet()); // Basic security headers
app.use(express.json()); // Parse JSON request bodies

// ---- Azure OpenAI Credentials from .env (for the free tier) ----
const azureFreeEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureFreeApiKey = process.env.AZURE_OPENAI_API_KEY;
const azureFreeDeploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

let azureFreeClient;
if (azureFreeEndpoint && azureFreeApiKey && azureFreeDeploymentName) {
  try {
    azureFreeClient = new AzureOpenAI({
      endpoint: azureFreeEndpoint,
      apiKey: azureFreeApiKey,
      deployment: azureFreeDeploymentName, // Default deployment for this client
      apiVersion: API_VERSION
    });
    console.log('Free Azure OpenAI client initialized.');
  } catch (e) {
    console.error("Failed to initialize Free Azure OpenAI client:", e);
  }
} else {
  console.warn('Free Azure OpenAI credentials (endpoint, key, or deployment name) not found in .env. The /api/azure-openai/free endpoint will not work.');
}

// ---- 1. Free GPT-4o Endpoint ----
app.post('/api/azure-openai/free', async (req, res) => {
  if (!azureFreeClient || !azureFreeDeploymentName) {
    return res.status(500).json({ error: 'Free tier Azure OpenAI is not configured on the server.' });
  }

  const { messages, max_tokens, temperature, stream } = req.body; // Common parameters

  if (!messages) {
    return res.status(400).json({ error: 'Request body must contain "messages" array.' });
  }

  try {
    if (stream) {
      const events = await azureFreeClient.chat.completions.create({
        model: azureFreeDeploymentName, // Explicitly pass model/deployment for clarity
        messages: messages,
        max_tokens: max_tokens,
        temperature: temperature,
        stream: true,
      });
      
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const event of events) {
        if (event.choices && event.choices[0] && event.choices[0].delta && event.choices[0].delta.content) {
          res.write(`data: ${JSON.stringify({ content: event.choices[0].delta.content })}\n\n`);
        }
      }
      res.end();
    } else {
      // Non-streaming response
      const result = await azureFreeClient.chat.completions.create({
        model: azureFreeDeploymentName, // Explicitly pass model/deployment
        messages: messages,
        max_tokens: max_tokens,
        temperature: temperature,
        stream: false,
      });
      res.json(result);
    }

  } catch (error) {
    console.error('Error calling free Azure OpenAI:', error.message);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      res.status(error.response.status || 500).json({ error: 'Failed to call Azure OpenAI (Free Tier)', details: error.response.data });
    } else if (error.status) { // Handle errors from the new SDK structure
        console.error('Error status:', error.status);
        console.error('Error details:', error.error);
        res.status(error.status || 500).json({ error: 'Failed to call Azure OpenAI (Free Tier)', details: error.error ? error.error.message : error.message });
    }
     else {
      res.status(500).json({ error: 'Failed to call Azure OpenAI (Free Tier)', details: error.message });
    }
  }
});

// ---- 2. Proxy Endpoint for User-Provided Keys ----
app.post('/api/llm/proxy', async (req, res) => {
  const { proxyDetails, modelName, messages, max_tokens, temperature, stream } = req.body;

  if (!proxyDetails || !modelName || !messages) {
    return res.status(400).json({ error: 'Request body must contain "proxyDetails", "modelName", and "messages".' });
  }

  const { providerType, apiKey, endpoint, deploymentName /* this is the model deployment id */ } = proxyDetails;

  try {
    if (providerType === 'azure') {
      if (!apiKey || !endpoint || !deploymentName) {
        return res.status(400).json({ error: 'Azure proxy requires apiKey, endpoint, and deploymentName in proxyDetails.' });
      }
      
      let userAzureClient;
      try {
        userAzureClient = new AzureOpenAI({
          endpoint: endpoint,
          apiKey: apiKey,
          deployment: deploymentName, // Default deployment for this client instance
          apiVersion: API_VERSION 
        });
      } catch(e) {
        console.error("Failed to initialize user Azure OpenAI client:", e);
        return res.status(500).json({ error: 'Failed to configure user Azure OpenAI client.', details: e.message });
      }
      
      if (stream) {
        const events = await userAzureClient.chat.completions.create({ 
            model: deploymentName, // Explicitly pass deployment name
            messages: messages,
            max_tokens: max_tokens, 
            temperature: temperature,
            stream: true,
        });
        res.setHeader('Content-Type', 'text/event-stream');
        for await (const event of events) {
          if (event.choices && event.choices[0] && event.choices[0].delta && event.choices[0].delta.content) {
            res.write(`data: ${JSON.stringify({ content: event.choices[0].delta.content })}\n\n`);
          }
        }
        res.end();
      } else {
        const result = await userAzureClient.chat.completions.create({
            model: deploymentName, // Explicitly pass deployment name
            messages: messages,
            max_tokens: max_tokens, 
            temperature: temperature,
            stream: false,
        });
        res.json(result);
      }

    } else if (providerType === 'openai') {
      if (!apiKey) {
        return res.status(400).json({ error: 'OpenAI proxy requires apiKey in proxyDetails.' });
      }
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model: modelName, messages, max_tokens, temperature, stream },
        { 
          headers: { 'Authorization': `Bearer ${apiKey}` },
          responseType: stream ? 'stream' : 'json'
        }
      );
      if (stream) {
        response.data.pipe(res);
      } else {
        res.json(response.data);
      }

    } else if (providerType === 'anthropic') {
      if (!apiKey) {
        return res.status(400).json({ error: 'Anthropic proxy requires apiKey in proxyDetails.' });
      }
      // Anthropic API has a different structure and headers
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: modelName,
          messages, // Assuming messages are in the correct format for Anthropic
          max_tokens: max_tokens || 1024, // Anthropic requires max_tokens
          temperature,
          stream
        },
        {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          responseType: stream ? 'stream' : 'json'
        }
      );
      if (stream) {
        // Anthropic streaming is a bit different (SSE)
        // For simplicity, piping. Frontend might need to adapt if it expects OpenAI's delta format.
        response.data.pipe(res); 
      } else {
        res.json(response.data);
      }

    } else {
      return res.status(400).json({ error: `Unsupported providerType: ${providerType}` });
    }
  } catch (error) {
    console.error(`Error calling ${providerType} API:`, error.message);
    if (error.response) { // Axios error structure
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      let errorDetails = error.message;
      if (typeof error.response.data === 'object') {
          errorDetails = error.response.data;
      } else if (typeof error.response.data === 'string') {
          try { errorDetails = JSON.parse(error.response.data); } catch (e) { errorDetails = error.response.data; }
      }
      res.status(error.response.status || 500).json({ 
        error: `Failed to call ${providerType} API`, 
        details: errorDetails
      });
    } else if (error.status) { // OpenAI SDK error structure
        console.error('Error status:', error.status);
        console.error('Error details:', error.error); // The actual error object
        res.status(error.status || 500).json({ 
            error: `Failed to call ${providerType} API`, 
            details: error.error ? error.error.message : error.message 
        });
    }
    else {
      res.status(500).json({ error: `Failed to call ${providerType} API`, details: error.message });
    }
  }
});

// Basic root route
app.get('/', (req, res) => {
  res.send('AI Biology API Server is running.');
});

// Start the server
app.listen(port, () => {
  console.log(`AI Biology API server listening on port ${port}`);
  if (!azureFreeClient) { // Simplified check, initialization logs details
    console.warn('Reminder: Free Azure OpenAI endpoint (/api/azure-openai/free) may not function if .env variables for it are missing or incorrect, or if initialization failed.');
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('API Server shutting down...');
  process.exit(0);
});
