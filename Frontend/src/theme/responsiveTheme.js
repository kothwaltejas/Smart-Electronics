import { createTheme } from '@mui/material/styles';

const responsiveTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  zIndex: {
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    // Responsive font sizes
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
      '@media (min-width:900px)': {
        fontSize: '3rem',
      },
      '@media (max-width:480px)': {
        fontSize: '1.75rem',
      },
      '@media (max-width:360px)': {
        fontSize: '1.5rem',
      },
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2.25rem',
      },
      '@media (max-width:480px)': {
        fontSize: '1.5rem',
      },
      '@media (max-width:360px)': {
        fontSize: '1.25rem',
      },
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2rem',
      },
      '@media (max-width:480px)': {
        fontSize: '1.25rem',
      },
      '@media (max-width:360px)': {
        fontSize: '1.125rem',
      },
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.75rem',
      },
      '@media (max-width:480px)': {
        fontSize: '1.125rem',
      },
      '@media (max-width:360px)': {
        fontSize: '1rem',
      },
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
      '@media (min-width:600px)': {
        fontSize: '1.25rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.5rem',
      },
      '@media (max-width:480px)': {
        fontSize: '1rem',
      },
      '@media (max-width:360px)': {
        fontSize: '0.875rem',
      },
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      '@media (min-width:600px)': {
        fontSize: '1.125rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.25rem',
      },
      '@media (max-width:480px)': {
        fontSize: '0.875rem',
      },
      '@media (max-width:360px)': {
        fontSize: '0.75rem',
      },
    },
    body1: {
      fontSize: '1rem',
      '@media (max-width:480px)': {
        fontSize: '0.875rem',
      },
      '@media (max-width:360px)': {
        fontSize: '0.75rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      '@media (max-width:480px)': {
        fontSize: '0.75rem',
      },
      '@media (max-width:360px)': {
        fontSize: '0.6875rem',
      },
    },
    subtitle1: {
      fontSize: '1rem',
      '@media (max-width:480px)': {
        fontSize: '0.875rem',
      },
      '@media (max-width:360px)': {
        fontSize: '0.75rem',
      },
    },
    subtitle2: {
      fontSize: '0.875rem',
      '@media (max-width:480px)': {
        fontSize: '0.75rem',
      },
      '@media (max-width:360px)': {
        fontSize: '0.6875rem',
      },
    },
    caption: {
      fontSize: '0.75rem',
      '@media (max-width:480px)': {
        fontSize: '0.6875rem',
      },
      '@media (max-width:360px)': {
        fontSize: '0.625rem',
      },
    },
  },
  components: {
    // Button responsive sizing
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontSize: '0.875rem',
          '@media (max-width: 480px)': {
            fontSize: '0.75rem',
            padding: '6px 12px',
            minHeight: '32px',
          },
          '@media (max-width: 360px)': {
            fontSize: '0.6875rem',
            padding: '4px 8px',
            minHeight: '28px',
          },
        },
        sizeSmall: {
          '@media (max-width: 480px)': {
            fontSize: '0.6875rem',
            padding: '4px 8px',
            minHeight: '28px',
          },
          '@media (max-width: 360px)': {
            fontSize: '0.625rem',
            padding: '2px 6px',
            minHeight: '24px',
          },
        },
      },
    },
    // Chip responsive sizing
    MuiChip: {
      styleOverrides: {
        root: {
          '@media (max-width: 480px)': {
            fontSize: '0.6875rem',
            height: '24px',
          },
          '@media (max-width: 360px)': {
            fontSize: '0.625rem',
            height: '20px',
          },
        },
        sizeSmall: {
          '@media (max-width: 480px)': {
            fontSize: '0.625rem',
            height: '20px',
          },
          '@media (max-width: 360px)': {
            fontSize: '0.5625rem',
            height: '18px',
          },
        },
      },
    },
    // TextField responsive sizing
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            '@media (max-width: 480px)': {
              fontSize: '0.875rem',
              padding: '8px 12px',
            },
            '@media (max-width: 360px)': {
              fontSize: '0.75rem',
              padding: '6px 8px',
            },
          },
          '& .MuiInputLabel-root': {
            '@media (max-width: 480px)': {
              fontSize: '0.875rem',
            },
            '@media (max-width: 360px)': {
              fontSize: '0.75rem',
            },
          },
        },
      },
    },
    // Table responsive sizing
    MuiTableCell: {
      styleOverrides: {
        root: {
          '@media (max-width: 480px)': {
            fontSize: '0.75rem',
            padding: '8px 4px',
          },
          '@media (max-width: 360px)': {
            fontSize: '0.6875rem',
            padding: '6px 2px',
          },
        },
      },
    },
    // Card responsive spacing
    MuiCard: {
      styleOverrides: {
        root: {
          '@media (max-width: 480px)': {
            margin: '8px',
          },
          '@media (max-width: 360px)': {
            margin: '4px',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '@media (max-width: 480px)': {
            padding: '12px',
            '&:last-child': {
              paddingBottom: '12px',
            },
          },
          '@media (max-width: 360px)': {
            padding: '8px',
            '&:last-child': {
              paddingBottom: '8px',
            },
          },
        },
      },
    },
    // Dialog responsive sizing
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          backdropFilter: 'none',
          '@media (max-width: 480px)': {
            margin: '8px',
            width: 'calc(100% - 16px)',
            maxHeight: 'calc(100% - 16px)',
          },
          '@media (max-width: 360px)': {
            margin: '4px',
            width: 'calc(100% - 8px)',
            maxHeight: 'calc(100% - 8px)',
          },
        },
      },
      defaultProps: {
        BackdropProps: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'none',
          }
        }
      },
    },
    // AppBar responsive height
    MuiAppBar: {
      styleOverrides: {
        root: {
          '@media (max-width: 480px)': {
            minHeight: '56px',
          },
          '@media (max-width: 360px)': {
            minHeight: '48px',
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          '@media (max-width: 480px)': {
            minHeight: '56px !important',
            paddingLeft: '8px',
            paddingRight: '8px',
          },
          '@media (max-width: 360px)': {
            minHeight: '48px !important',
            paddingLeft: '4px',
            paddingRight: '4px',
          },
        },
      },
    },
  },
});

export default responsiveTheme;
