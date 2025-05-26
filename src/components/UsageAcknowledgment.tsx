import React, { useState } from 'react';
import { Alert, AlertTitle, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Info, CheckCircle } from '@mui/icons-material';

interface UsageAcknowledgmentProps {
  variant?: 'banner' | 'modal';
}

export const UsageAcknowledgment: React.FC<UsageAcknowledgmentProps> = ({ variant = 'banner' }) => {
  const [showModal, setShowModal] = useState(false);
  const [acknowledged, setAcknowledged] = useState(() => {
    return localStorage.getItem('ai-biology-usage-acknowledged') === 'true';
  });

  const handleAcknowledge = () => {
    localStorage.setItem('ai-biology-usage-acknowledged', 'true');
    setAcknowledged(true);
    setShowModal(false);
  };

  const openModal = () => setShowModal(true);

  if (variant === 'banner') {
    return (
      <Alert 
        severity="info" 
        icon={<Info />}
        sx={{ 
          mb: 2, 
          backgroundColor: '#e3f2fd',
          border: '1px solid #2196f3',
          borderRadius: 1
        }}
        action={
          <Button 
            color="primary" 
            size="small" 
            onClick={openModal}
            sx={{ textTransform: 'none' }}
          >
            Learn More
          </Button>
        }
      >
        <AlertTitle sx={{ fontWeight: 600 }}>
          Free GPT-4o Access Provided
        </AlertTitle>
        This educational tool provides free AI access for research. Please use responsibly - this service has real costs.
      </Alert>
    );
  }

  // Welcome Modal for first-time users
  if (variant === 'modal' && !acknowledged) {
    return (
      <Dialog 
        open={true} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
          <CheckCircle color="primary" />
          <Typography variant="h6" component="span">
            Welcome to AI Biology Playground
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1" paragraph>
            This educational tool provides <strong>free access to GPT-4o</strong> to help you explore 
            Anthropic's groundbreaking AI interpretability research.
          </Typography>
          
          <Typography variant="body2" paragraph sx={{ color: 'text.secondary' }}>
            <strong>Please use this service responsibly:</strong>
          </Typography>
          
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              This is provided at personal cost to support education
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Focus on learning and research purposes
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              Avoid excessive or automated requests
            </Typography>
            <Typography component="li" variant="body2">
              Be mindful that AI services have real-world costs
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ 
            fontStyle: 'italic', 
            color: 'text.secondary',
            backgroundColor: '#f5f5f5',
            p: 1,
            borderRadius: 1,
            border: '1px solid #e0e0e0'
          }}>
            By continuing, you agree to use this service ethically and responsibly 
            for educational purposes.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={handleAcknowledge}
            variant="contained"
            color="primary"
            size="large"
            sx={{ minWidth: 120 }}
          >
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Detailed Modal (triggered by "Learn More")
  return (
    <Dialog 
      open={showModal} 
      onClose={() => setShowModal(false)}
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>Responsible Usage Guidelines</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          This AI Biology Playground provides free GPT-4o access to make AI interpretability 
          research accessible to everyone.
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Why This Matters
        </Typography>
        <Typography variant="body2" paragraph>
          • AI API calls have real monetary costs<br/>
          • This service is funded personally to benefit education<br/>
          • Responsible usage helps keep it available for everyone
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Best Practices
        </Typography>
        <Typography variant="body2" paragraph>
          • Use for exploring the specific research concepts in this tool<br/>
          • Ask thoughtful questions related to AI interpretability<br/>
          • Avoid repetitive or excessive requests<br/>
          • Report any technical issues to help improve the service
        </Typography>
        
        <Typography variant="body2" sx={{ 
          mt: 2, 
          fontWeight: 600, 
          color: 'primary.main' 
        }}>
          Thank you for helping keep this educational resource available! 🧬
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowModal(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsageAcknowledgment;
