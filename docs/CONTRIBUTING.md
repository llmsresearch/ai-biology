# Contributing to AI Biology Playground

Thank you for your interest in contributing to the AI Biology Playground! This project aims to make AI interpretability research accessible through interactive educational tools.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Types of Contributions](#types-of-contributions)
- [Code Standards](#code-standards)
- [Submission Process](#submission-process)
- [Research Attribution](#research-attribution)

## Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **Git** for version control
- **Basic understanding** of React, TypeScript, and AI concepts
- **Familiarity** with AI interpretability research (helpful but not required)

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/ai-biology-playground.git
   cd ai-biology-playground
   ```
3. **Install dependencies**:
   ```bash
   npm install
   cd api && npm install && cd ..
   ```
4. **Start development servers**:
   ```bash
   ./start-servers.sh
   ```
5. **Verify everything works** by visiting http://localhost:5173

## Contributing Guidelines

### Code of Conduct

- **Be respectful** and inclusive in all interactions
- **Focus on education** and making AI research accessible
- **Provide constructive feedback** and help others learn
- **Respect the research** this project is based on

### Communication

- **Open issues** for bugs, feature requests, or questions
- **Use clear, descriptive titles** for issues and pull requests
- **Provide context** and examples when reporting bugs
- **Reference related issues** in pull requests

## Types of Contributions

### 🐛 Bug Fixes

Help improve the reliability and user experience:

- **Frontend bugs**: UI issues, component errors, styling problems
- **Backend bugs**: API errors, data processing issues
- **Documentation bugs**: Typos, outdated information, missing details
- **Performance issues**: Slow loading, memory leaks, inefficient code

**Example bug report:**
```markdown
**Bug**: SAE Explorer crashes when searching for features

**Steps to reproduce:**
1. Navigate to Real SAE Explorer
2. Enter "emotion" in search box
3. Click search button

**Expected**: Show filtered results
**Actual**: Component crashes with TypeError

**Environment**: Chrome 125, macOS 14.5
```

### ✨ Feature Enhancements

Expand the educational value and research capabilities:

- **New visualizations**: Additional 3D views, chart types, interactive elements
- **Research tools**: New analysis capabilities, data exploration features
- **Educational content**: Tutorials, explanations, guided tours
- **Accessibility**: Screen reader support, keyboard navigation, color contrast

**Example feature request:**
```markdown
**Feature**: Add feature clustering visualization

**Description**: Group similar SAE features by semantic similarity and display as interactive clusters

**Educational value**: Helps users understand how features relate to each other

**Implementation ideas**: 
- Use t-SNE or UMAP for dimensionality reduction
- Color-code by semantic category
- Interactive hover for feature details
```

### 📚 Documentation

Improve understanding and onboarding:

- **API documentation**: More examples, better descriptions
- **Code comments**: Explain complex algorithms and research concepts
- **Educational content**: Background on AI interpretability concepts
- **Setup guides**: Platform-specific instructions, troubleshooting

### 🧪 Research Integration

Add new authentic research data and methods:

- **New research datasets**: Additional SAE features, attribution data
- **Research methods**: New analysis techniques from recent papers
- **Validation tools**: Methods to verify research findings
- **Educational examples**: Real-world use cases and case studies

## Code Standards

### TypeScript/React Standards

```typescript
// Use functional components with hooks
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<StateType>(initialValue);
  
  // Clear, descriptive function names
  const handleUserInteraction = (event: Event) => {
    // Implementation
  };
  
  return (
    <Box sx={{ p: 2 }}>
      {/* JSX content */}
    </Box>
  );
};

// Export with clear naming
export default MyComponent;
```

### Component Structure

```typescript
// 1. Imports (React, libraries, local)
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { MyLocalType } from '../utils/types';

// 2. Type definitions
interface ComponentProps {
  prop1: string;
  prop2: number;
  onAction?: (data: any) => void;
}

// 3. Component implementation
const MyComponent: React.FC<ComponentProps> = ({ prop1, prop2, onAction }) => {
  // 4. State and hooks
  const [loading, setLoading] = useState(false);
  
  // 5. Event handlers
  const handleClick = () => {
    // Implementation
  };
  
  // 6. Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // 7. Render
  return (
    // JSX
  );
};

// 8. Export
export default MyComponent;
```

### Styling Guidelines

```typescript
// Use MUI sx prop for component styling
<Box sx={{
  p: 2,                    // Padding
  m: 1,                    // Margin
  bgcolor: 'primary.main', // Theme colors
  borderRadius: 1,         // Consistent border radius
  boxShadow: 1            // Elevation
}}>

// Responsive design
<Box sx={{
  width: { xs: '100%', md: '50%' },
  display: { xs: 'block', md: 'flex' }
}}>

// Custom styling when needed
const useStyles = () => ({
  customComponent: {
    '& .MuiButton-root': {
      textTransform: 'none',
      fontWeight: 600
    }
  }
});
```

### API Standards

```javascript
// Consistent error handling
app.get('/api/endpoint', async (req, res) => {
  try {
    // Rate limiting check
    if (!checkRateLimit(req.ip)) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Please wait before making another request'
      });
    }
    
    // Input validation
    const { param1, param2 } = req.query;
    if (!param1) {
      return res.status(400).json({
        error: 'Missing parameter',
        message: 'param1 is required'
      });
    }
    
    // Business logic
    const result = await processData(param1, param2);
    
    // Consistent response format
    res.json({
      data: result,
      metadata: {
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    });
  }
});
```

## Submission Process

### Before Submitting

1. **Test your changes** thoroughly:
   ```bash
   # Test frontend
   npm run build
   npm run preview
   
   # Test backend
   cd api && npm test && cd ..
   
   # Test integration
   ./start-servers.sh
   ```

2. **Check code quality**:
   ```bash
   # TypeScript type checking
   npm run type-check
   
   # Linting (if configured)
   npm run lint
   ```

3. **Update documentation** if needed:
   - Update README.md for new features
   - Add API documentation for new endpoints
   - Update DEVELOPMENT.md for new development patterns

### Pull Request Process

1. **Create a branch** with a descriptive name:
   ```bash
   git checkout -b feature/sae-clustering-visualization
   git checkout -b fix/attribution-graph-loading
   git checkout -b docs/api-examples-update
   ```

2. **Make your changes** following code standards

3. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add SAE feature clustering visualization
   
   - Implement t-SNE dimensionality reduction for features
   - Add interactive cluster selection and hover details
   - Include educational tooltips explaining clustering
   - Add responsive design for mobile devices
   
   Resolves #123"
   ```

4. **Push and create pull request**:
   ```bash
   git push origin feature/sae-clustering-visualization
   ```

5. **Pull request template**:
   ```markdown
   ## Description
   Brief description of changes and motivation
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement
   
   ## Testing
   - [ ] Tested locally
   - [ ] All existing functionality works
   - [ ] New functionality works as expected
   
   ## Educational Value
   How does this improve the learning experience?
   
   ## Screenshots
   If applicable, add screenshots of UI changes
   ```

### Review Process

- **Maintainers will review** within 48-72 hours
- **Address feedback** constructively and promptly
- **Make requested changes** in additional commits
- **Squash commits** before merging if requested

## Research Attribution

### Important Guidelines

This project is based on published AI interpretability research. When contributing:

1. **Respect original research**: All core concepts belong to original authors
2. **Proper attribution**: Credit research papers and authors appropriately
3. **Educational focus**: Ensure contributions enhance learning, not commercialization
4. **Data authenticity**: Use genuine research data when possible
5. **Citation requirements**: Include proper citations for new research concepts

### Adding New Research Data

When integrating new research findings:

```typescript
// Example: Adding new SAE features from recent research
const newFeature = {
  id: 'feature_18_5678',
  description: 'Temporal reasoning patterns',
  research_paper: 'Smith et al. (2025). Temporal Circuits in LLMs',
  research_url: 'https://example.com/paper',
  confidence: 0.92,
  // ... other properties
};
```

Always include:
- **Source paper** title and authors
- **Publication date** and venue
- **Confidence scores** from original research
- **Proper licensing** information if applicable

## Getting Help

### Community Resources

- **GitHub Issues**: Ask questions, report bugs, request features
- **Documentation**: Check docs/ folder for detailed guides
- **Code Comments**: Read inline documentation for complex algorithms

### Contribution Ideas for Beginners

1. **Improve error messages**: Make them more user-friendly
2. **Add loading states**: Better UX for API calls
3. **Fix typos**: Documentation and UI text improvements
4. **Add tooltips**: Explain research concepts to newcomers
5. **Mobile responsiveness**: Improve mobile experience
6. **Accessibility**: Add ARIA labels, keyboard navigation

### Advanced Contribution Ideas

1. **New 3D visualizations**: Advanced WebGL rendering techniques
2. **Research integrations**: Connect to new papers and datasets
3. **Performance optimization**: Faster data processing and rendering
4. **Educational content**: Interactive tutorials and explanations
5. **API enhancements**: New endpoints and data processing capabilities

## Recognition

Contributors will be:
- **Listed in README.md** contributors section
- **Credited in release notes** for significant contributions
- **Acknowledged** in documentation for major features
- **Invited** to participate in project direction discussions

## License Agreement

By contributing to this project, you agree that your contributions will be licensed under the MIT License. This ensures that educational improvements remain accessible to the research and learning community.

## Research Attribution

When contributing features based on published research:
1. **Cite original papers** in code comments and documentation
2. **Link to source material** in relevant documentation
3. **Respect intellectual property** of original researchers
4. **Focus on educational value** rather than commercial applications

Thank you for helping make AI interpretability research more accessible and educational! 🔬✨
