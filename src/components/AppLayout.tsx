import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  CssBaseline,
  useMediaQuery,
  Fab,
  Divider,
  Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';
import LanguageIcon from '@mui/icons-material/Language';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CreateIcon from '@mui/icons-material/Create';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

// Import playground/tool components
import IntroductionTour from './IntroductionTour';
import InterventionLaboratory from './InterventionLaboratory';
import MultilingualCircuitMapper from './MultilingualCircuitMapper';
import MultiStepReasoningPlayground from './MultiStepReasoningPlayground';
import PoetryPlanningVisualizer from './PoetryPlanningVisualizer';
import LLMConnector from './LLMConnector';

const drawerWidth = 260;

const playgrounds = [
  {
    label: 'Tutorial',
    icon: <SchoolIcon />,
    component: <IntroductionTour />,
    description: 'Interactive introduction and guided tour.'
  },
  {
    label: 'Intervention Laboratory',
    icon: <ScienceIcon />,
    component: <InterventionLaboratory />,
    description: 'Experiment with interventions in simulated systems.'
  },
  {
    label: 'Multilingual Circuit Mapper',
    icon: <LanguageIcon />,
    component: <MultilingualCircuitMapper />,
    description: 'Visualize language model concepts across languages.'
  },
  {
    label: 'Multi-Step Reasoning',
    icon: <PsychologyIcon />,
    component: <MultiStepReasoningPlayground />,
    description: 'Explore multi-step reasoning in LLMs.'
  },
  {
    label: 'Poetry Planning Visualizer',
    icon: <CreateIcon />,
    component: <PoetryPlanningVisualizer />,
    description: 'See how AI plans and generates poetry.'
  },
  {
    label: 'LLM Connector',
    icon: <SettingsIcon />,
    component: <LLMConnector onConnect={() => {}} />, // onConnect can be handled in App
    description: 'Connect to and configure LLMs.'
  }
];

const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
    if (isMobile) setDrawerOpen(false);
  };

  const drawer = (
    <Box sx={{ width: drawerWidth, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold">AI Biology</Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {playgrounds.map((item, idx) => (
          <ListItem button key={item.label} selected={selectedIndex === idx} onClick={() => handleSelect(idx)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, textAlign: 'center', fontSize: 13, color: 'text.secondary' }}>
        Inspired by Anthropic Research<br />
        <a href="https://www.anthropic.com/research" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Research</a>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar position="sticky" color="default" elevation={2} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            AI Biology Project
          </Typography>
          {/* Theme toggle placeholder */}
          <IconButton color="inherit" aria-label="toggle theme">
            🌙
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexGrow: 1, width: '100%' }}>
        {/* Sidebar/Drawer */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            open
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
            }}
          >
            {drawer}
          </Drawer>
        )}
        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 }, width: '100%', minHeight: '80vh' }}>
          <Container maxWidth="md">
            <Typography variant="h5" fontWeight="bold" mb={1}>
              {playgrounds[selectedIndex].label}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {playgrounds[selectedIndex].description}
            </Typography>
            {playgrounds[selectedIndex].component}
          </Container>
        </Box>
      </Box>
      {/* FAB for mobile */}
      {isMobile && !drawerOpen && (
        <Fab
          color="primary"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          sx={{ position: 'fixed', bottom: 24, left: 24, zIndex: theme.zIndex.drawer + 2 }}
        >
          <MenuIcon />
        </Fab>
      )}
      {/* Footer */}
      <Box component="footer" sx={{ p: 2, textAlign: 'center', fontSize: 13, color: 'text.secondary', mt: 'auto', bgcolor: 'background.paper', borderTop: '1px solid #2228' }}>
        © {new Date().getFullYear()} AI Biology Project. All rights reserved.
        <Box sx={{ mt: 2, textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Research References:</Typography>
          <ul style={{margin: 0, paddingLeft: 18, fontSize: 13}}>
            <li><a href="https://www.anthropic.com/research" target="_blank" rel="noopener noreferrer">Anthropic Research Overview</a>: Anthropic's main research portal.</li>
            <li><a href="https://www.anthropic.com/news/mapping-the-mind-of-a-large-language-model" target="_blank" rel="noopener noreferrer">Mapping the Mind of a Large Language Model</a>: Blog post on understanding LLM internals.</li>
            <li><a href="https://transformer-circuits.pub/2025/attribution-graphs/methods.html" target="_blank" rel="noopener noreferrer">Circuit Tracing: Revealing Computational Graphs in Language Models</a>: Paper on attribution graphs and circuit tracing.</li>
            <li><a href="https://transformer-circuits.pub/2025/attribution-graphs/biology.html" target="_blank" rel="noopener noreferrer">On the Biology of a Large Language Model</a>: Biological analogies for LLM circuits.</li>
            <li><a href="https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html" target="_blank" rel="noopener noreferrer">Scaling Monosemanticity</a>: Extracting interpretable features from Claude 3 Sonnet.</li>
          </ul>
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout; 