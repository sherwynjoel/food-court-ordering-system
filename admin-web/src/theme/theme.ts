import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#6366f1', // Indigo 600
            light: '#818cf8',
            dark: '#4f46e5',
        },
        secondary: {
            main: '#f43f5e', // Rose 500
        },
        background: {
            default: '#f8fafc', // Slate 50
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' },
        h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
        h4: { fontSize: '1.5rem', fontWeight: 700 },
        subtitle2: { fontWeight: 600, color: '#64748b' },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '10px',
                    fontWeight: 600,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    color: '#1e293b',
                    boxShadow: 'inset 0 -1px 0 0 #e2e8f0',
                },
            },
        },
    },
});

export default theme;
