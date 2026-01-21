import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper, Alert } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            // Demo Mode Check (Bypass backend if Docker is not running)
            if (email === 'admin@demo.com' && password === 'admin123') {
                login('demo-token', {
                    email: 'admin@demo.com',
                    role: 'admin',
                    sub: 'demo-user-123'
                });
                navigate('/');
                return;
            }

            const response = await api.post('/auth/login', { email, password });
            const { access_token } = response.data;

            const decoded: any = jwtDecode(access_token);

            login(access_token, {
                email: decoded.email,
                role: decoded.role,
                sub: decoded.sub,
                branchId: decoded.branchId
            });

            navigate('/dashboard');
        } catch (err: any) {
            setError('Invalid email or password');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Sign in
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, height: 48 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;
