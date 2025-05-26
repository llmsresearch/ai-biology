import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppLayout from './components/AppLayout';

// Enhanced Dark Theme with improved visibility
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4A90E2', // Brighter blue for better visibility
      light: '#6BA3E8',
      dark: '#357ABD'
    },
    secondary: {
      main: '#00E676', // Vibrant green for secondary elements
      light: '#33EA84',
      dark: '#00C853'
    },
    background: {
      default: 'transparent', // Handled by global CSS
      paper: 'rgba(25, 35, 60, 0.75)', // More opaque and lighter for better contrast
    },
    text: {
      primary: '#F5F5F5', // Brighter primary text
      secondary: '#D0D8E8', // Much brighter secondary text for better readability
    },
    info: {
      main: '#29B6F6',
      light: '#4FC3F7',
      dark: '#0288D1'
    },
    success: {
      main: '#66BB6A',
      light: '#81C784',
      dark: '#388E3C'
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00'
    },
    error: {
      main: '#EF5350',
      light: '#E57373',
      dark: '#C62828'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.05em'},
    h4: { fontWeight: 700, color: '#F8F9FA' }, // Brighter white for h4
    h5: { fontWeight: 600, color: '#E9ECEF' }, // Brighter for h5
    h6: { fontWeight: 600, color: '#DEE2E6' }, // Brighter for h6
    body1: { color: '#F5F5F5' }, // Explicit bright color for body text
    body2: { color: '#E0E0E0' }, // Bright secondary body text
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 40, 70, 0.8)', // Lighter and more opaque
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(20, 30, 55, 0.85)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          color: '#D0D8E8', // Brighter tab text
          '&.Mui-selected': {
            color: '#FFFFFF',
            fontWeight: 700,
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 230, 118, 0.1)',
            color: '#E8F5E8',
          }
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: '3px',
          borderRadius: '3px 3px 0 0',
          backgroundColor: '#00E676',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
        },
        containedPrimary: {
          color: '#FFFFFF',
          backgroundColor: '#4A90E2',
          '&:hover': {
            backgroundColor: '#357ABD',
          }
        },
        containedSecondary: {
            color: '#FFFFFF',
            backgroundColor: '#00E676',
            '&:hover': {
                backgroundColor: '#00C853',
            }
        },
        outlinedPrimary: {
            borderColor: '#4A90E2',
            color: '#4A90E2',
            '&:hover': {
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                borderColor: '#357ABD',
                color: '#6BA3E8'
            }
        },
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#D0D8E8',
          '&:hover': {
            backgroundColor: 'rgba(0, 230, 118, 0.15)',
            color: '#00E676'
          }
        }
      }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                fontWeight: 500,
            },
            outlined: {
                borderColor: 'rgba(0, 230, 118, 0.7)',
                color: '#00E676',
                backgroundColor: 'rgba(0, 230, 118, 0.08)',
                '&:hover': {
                    backgroundColor: 'rgba(0, 230, 118, 0.2)',
                    borderColor: '#00E676'
                }
            },
            filled: {
                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                color: '#F5F5F5'
            }
        }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#4FC3F7', // Bright cyan for links
          textDecoration: 'underline',
          '&:hover': {
            color: '#29B6F6',
            textDecoration: 'underline'
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          '& .MuiAlert-message': {
            color: '#F5F5F5' // Ensure alert text is bright
          }
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppLayout />
    </ThemeProvider>
  );
}

export default App;