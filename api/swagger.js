const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Biology Playground API',
      version: '1.0.0',
      description: 'Interactive API for exploring AI interpretability research data, including sparse autoencoder features, attribution graphs, and safety analysis.',
      contact: {
        name: 'LLMs Research',
        url: 'https://github.com/LLMsResearch/ai-biology-playground'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        SAEFeature: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique feature identifier',
              example: 'feature_15_4567'
            },
            layer: {
              type: 'integer',
              description: 'Model layer number',
              example: 15
            },
            position: {
              type: 'integer',
              description: 'Position within layer',
              example: 4567
            },
            description: {
              type: 'string',
              description: 'Human-readable feature description',
              example: 'Geographic locations and place names'
            },
            activation_frequency: {
              type: 'number',
              format: 'float',
              description: 'Frequency of feature activation',
              example: 0.23
            },
            top_tokens: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Most frequently associated tokens',
              example: ['Paris', 'London', 'Tokyo', 'mountain', 'river']
            },
            example_prompts: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Example prompts that trigger this feature',
              example: ['The capital of France is', 'Mountains are tall and']
            },
            confidence: {
              type: 'number',
              format: 'float',
              description: 'Confidence score for feature identification',
              example: 0.89
            },
            research_paper: {
              type: 'string',
              description: 'Source research paper',
              example: 'Anthropic SAE Research 2024'
            }
          }
        },
        AttributionNode: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'node_1'
            },
            feature_id: {
              type: 'string',
              example: 'feature_15_4567'
            },
            description: {
              type: 'string',
              example: 'Geographic locations'
            },
            activation: {
              type: 'number',
              format: 'float',
              example: 0.89
            },
            layer: {
              type: 'integer',
              example: 15
            },
            position: {
              type: 'array',
              items: {
                type: 'number',
                format: 'float'
              },
              example: [0.2, 0.5, 0.8]
            }
          }
        },
        AttributionEdge: {
          type: 'object',
          properties: {
            source: {
              type: 'string',
              example: 'node_1'
            },
            target: {
              type: 'string',
              example: 'node_2'
            },
            weight: {
              type: 'number',
              format: 'float',
              example: 0.75
            },
            attribution_type: {
              type: 'string',
              example: 'causal'
            }
          }
        },
        SafetyFeature: {
          type: 'object',
          properties: {
            feature_id: {
              type: 'string',
              example: 'safety_feature_123'
            },
            description: {
              type: 'string',
              example: 'Harmful instruction detection'
            },
            activation: {
              type: 'number',
              format: 'float',
              example: 0.92
            },
            category: {
              type: 'string',
              example: 'harmful_content'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error type'
            },
            message: {
              type: 'string',
              example: 'Human-readable error description'
            },
            code: {
              type: 'string',
              example: 'ERROR_CODE'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-06-01T12:00:00.000Z'
            }
          }
        }
      },
      responses: {
        RateLimitExceeded: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Rate Limit Exceeded',
                message: 'Too many requests. Please try again later.',
                code: 'RATE_LIMIT_EXCEEDED',
                timestamp: '2025-06-01T12:00:00.000Z'
              }
            }
          }
        },
        BadRequest: {
          description: 'Invalid request parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Bad Request',
                message: 'Invalid query parameters provided',
                code: 'INVALID_PARAMETERS',
                timestamp: '2025-06-01T12:00:00.000Z'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Not Found',
                message: 'Requested feature does not exist',
                code: 'FEATURE_NOT_FOUND',
                timestamp: '2025-06-01T12:00:00.000Z'
              }
            }
          }
        },
        InternalError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Internal Server Error',
                message: 'An unexpected error occurred',
                code: 'INTERNAL_ERROR',
                timestamp: '2025-06-01T12:00:00.000Z'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./server.js', './routes/*.js'], // Path to the API files
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};
