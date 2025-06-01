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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import BiotechIcon from '@mui/icons-material/Biotech';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CodeIcon from '@mui/icons-material/Code';
import { useTheme } from '@mui/material/styles';
import { useTheme as useAppTheme } from '../App';

// Import research components
import IntroductionTour from './IntroductionTour';
import FeatureAttributionVisualizer from './FeatureAttributionVisualizer';
import SafetyFeaturesDetector from './SafetyFeaturesDetector';
import RealSAEExplorer from './RealSAEExplorer';
import AttributionGraphViewer from './AttributionGraphViewer';
import APIPlayground from './APIPlayground';

const drawerWidth = 260;

const researchTools = [
  {
    label: 'Tutorial',
    icon: <SchoolIcon />,
    component: <IntroductionTour />,
    description: 'Interactive introduction to AI interpretability research.'
  },
  {
    label: 'Real SAE Explorer',
    icon: <BiotechIcon />,
    component: <RealSAEExplorer />,
    description: 'Explore authentic sparse autoencoder features from published research.'
  },
  {
    label: 'Attribution Graph Viewer',
    icon: <AccountTreeIcon />,
    component: <AttributionGraphViewer />,
    description: 'Visualize attention flow and feature attribution networks in 3D.'
  },
  {
    label: 'Feature Attribution Visualizer',
    icon: <TrendingUpIcon />,
    component: <FeatureAttributionVisualizer />,
    description: 'Analyze how features contribute to specific token predictions.'
  },
  {
    label: 'Safety Features Detector',
    icon: <SecurityIcon />,
    component: <SafetyFeaturesDetector />,
    description: 'Detect and analyze safety-relevant features in AI model behavior.'
  },
  {
    label: 'API Playground',
    icon: <CodeIcon />,
    component: <APIPlayground />,
    description: 'Interactive API testing interface for all research endpoints.'
  }
];

const AppLayout: React.FC = () => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useAppTheme();
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
        <Typography variant="h6" fontWeight="bold">🔬 AI Research Lab</Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {researchTools.map((item, idx) => (
          <ListItem button key={item.label} selected={selectedIndex === idx} onClick={() => handleSelect(idx)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, textAlign: 'center', fontSize: 13, color: 'text.secondary' }}>
        Research laboratory for AI interpretability<br />
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
            AI Interpretability Research Lab
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={toggleTheme}
            sx={{ 
              ml: 1,
              color: '#7A00E6',
              '&:hover': {
                backgroundColor: 'rgba(122, 0, 230, 0.1)'
              }
            }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
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
              {researchTools[selectedIndex].label}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {researchTools[selectedIndex].description}
            </Typography>
            {researchTools[selectedIndex].component}
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
    </Box>
  );
};

export default AppLayout; 