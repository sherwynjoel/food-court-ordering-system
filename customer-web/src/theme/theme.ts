import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FF5722', // Vibrant Orange
            contrastText: '#fff',
        },
        secondary: {
            main: '#FFC107', // Amber
        },
        background: {
            default: '#121212',
            paper: '#1E1E1E',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 20px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 16,
                },
            },
        },
    },
});

export default theme;
