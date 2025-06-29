'use client';
import React, { createContext, useMemo, useState, useContext, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme, Theme } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#607d8b',
    },
    background: {
      default: mode === 'light' ? '#f4f6f8' : '#181a1b',
      paper: mode === 'light' ? '#fff' : '#23272f',
    },
    text: {
      primary: mode === 'light' ? '#222' : '#fff',
      secondary: mode === 'light' ? '#607d8b' : '#b0bec5',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: 16,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 500 as const,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(60,72,88,0.07)',
        },
      },
    },
  },
});

const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'light' as 'light' | 'dark' });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // Always start with 'dark' to match SSR
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  // On mount, update to user's preferred mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const colorMode = useMemo(() => ({
    mode,
    toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
  }), [mode]);

  const theme: Theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
} 