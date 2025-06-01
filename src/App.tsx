import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppLayout from './components/AppLayout';

// Theme Context
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Unified purple color for all interactive elements
const PURPLE_COLOR = '#7A00E6';

// Light Theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PURPLE_COLOR,
      light: '#9A33FF',
      dark: '#5A00B3'
    },
    secondary: {
      main: '#666666',
      light: '#888888',
      dark: '#444444'
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8F9FA',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
    },
    info: {
      main: PURPLE_COLOR,
      light: '#9A33FF',
      dark: '#5A00B3'
    },
    success: {
      main: PURPLE_COLOR,
      light: '#9A33FF',
      dark: '#5A00B3'
    },
    warning: {
      main: PURPLE_COLOR,
      light: '#9A33FF',
      dark: '#5A00B3'
    },
    error: {
      main: PURPLE_COLOR,
      light: '#9A33FF',
      dark: '#5A00B3'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700, letterSpacing: '0.05em'},
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#F8F9FA',
          backgroundImage: 'none',
          border: '1px solid #E0E0E0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          backdropFilter: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #E0E0E0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          color: '#666666',
          '&.Mui-selected': {
            color: PURPLE_COLOR,
            fontWeight: 700,
          },
          '&:hover': {
            backgroundColor: 'rgba(122, 0, 230, 0.05)',
            color: PURPLE_COLOR,
          }
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: '2px',
          borderRadius: '2px 2px 0 0',
          backgroundColor: PURPLE_COLOR,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
        },
        contained: {
          color: '#FFFFFF',
          backgroundColor: PURPLE_COLOR,
          '&:hover': {
            backgroundColor: '#5A00B3',
          }
        },
        outlined: {
          borderColor: PURPLE_COLOR,
          color: PURPLE_COLOR,
          '&:hover': {
            backgroundColor: 'rgba(122, 0, 230, 0.1)',
            borderColor: '#5A00B3',
            color: '#5A00B3'
          }
        },
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#666666',
          '&:hover': {
            backgroundColor: 'rgba(122, 0, 230, 0.05)',
            color: PURPLE_COLOR
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: PURPLE_COLOR,
          textDecoration: 'none',
          '&:hover': {
            color: '#5A00B3',
            textDecoration: 'underline'
          }
        }
      }
    },
  }
});

// Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: PURPLE_COLOR,
      light: '#9A33FF',
      dark: '#5A00B3'
    },
    secondary: {
      main: '#9E9E9E',
      light: '#EEEEEE',
      dark: '#757575'
    },
    background: {
      default: '#0A0A0A',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    info: {
      main: PURPLE_COLOR,
      light: '#9A33FF',
      dark: '#5A00B3'
    },
    success: {
      main: PURPLE_COLOR,
      light: '#9A33FF',
      dark: '#5A00B3'
    },
    warning: {
      main: PURPLE_COLOR,
      light: '#9A33FF',
      dark: '#5A00B3'
    },
    error: {
      main: PURPLE_COLOR,
      light: '#9A33FF',
      dark: '#5A00B3'
    }
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700, letterSpacing: '0.05em'},
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          backgroundImage: 'none',
          border: '1px solid #333333',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#0D0D0D',
          backdropFilter: 'none',
          boxShadow: '0 1px 3px rgba(255,255,255,0.1)',
          borderBottom: '1px solid #333333',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          color: '#B0B0B0',
          '&.Mui-selected': {
            color: PURPLE_COLOR,
            fontWeight: 700,
          },
          '&:hover': {
            backgroundColor: 'rgba(122, 0, 230, 0.1)',
            color: PURPLE_COLOR,
          }
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: '2px',
          borderRadius: '2px 2px 0 0',
          backgroundColor: PURPLE_COLOR,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
        },
        contained: {
          color: '#FFFFFF',
          backgroundColor: PURPLE_COLOR,
          '&:hover': {
            backgroundColor: '#5A00B3',
          }
        },
        outlined: {
          borderColor: PURPLE_COLOR,
          color: PURPLE_COLOR,
          '&:hover': {
            backgroundColor: 'rgba(122, 0, 230, 0.1)',
            borderColor: '#5A00B3',
            color: '#5A00B3'
          }
        },
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#B0B0B0',
          '&:hover': {
            backgroundColor: 'rgba(122, 0, 230, 0.1)',
            color: PURPLE_COLOR
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: PURPLE_COLOR,
          textDecoration: 'none',
          '&:hover': {
            color: '#9A33FF',
            textDecoration: 'underline'
          }
        }
      }
    },
  }
});

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Update body background color when theme changes
  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#0A0A0A' : '#FFFFFF';
    document.body.style.color = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <AppLayout />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;