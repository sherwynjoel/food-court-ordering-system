import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid } from '@mui/material';
import { QrCode } from '@mui/icons-material';

const TablesPage: React.FC = () => {
    const [tableNumber, setTableNumber] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState('');

    const generateQR = () => {
        if (!tableNumber) return;
        // Assuming the customer app runs on port 5174 (default vite)
        // In production, this would be the actual domain
        const baseUrl = window.location.origin.replace('5173', '5174');
        const url = `${baseUrl}/?table=${tableNumber}`;
        setGeneratedUrl(url);
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    Table Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Generate QR codes for your tables.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 4, borderRadius: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Create Table QR
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
                            <TextField
                                label="Table Number"
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                placeholder="e.g. 101"
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                startIcon={<QrCode />}
                                onClick={generateQR}
                                sx={{ whiteSpace: 'nowrap', px: 3 }}
                            >
                                Generate
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {generatedUrl && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                QR Code for Table {tableNumber}
                            </Typography>
                            <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generatedUrl)}`}
                                    alt={`QR for Table ${tableNumber}`}
                                    style={{ border: '1px solid #eee', padding: 10, borderRadius: 8 }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 1, fontFamily: 'monospace' }}>
                                {generatedUrl}
                            </Typography>
                            <Button
                                sx={{ mt: 2 }}
                                variant="outlined"
                                onClick={() => window.open(generatedUrl, '_blank')}
                            >
                                Test Link
                            </Button>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default TablesPage;
