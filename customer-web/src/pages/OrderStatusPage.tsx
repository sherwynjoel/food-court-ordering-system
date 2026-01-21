import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Stepper, Step, StepLabel, CircularProgress, Button, Paper } from '@mui/material';
import { CheckCircle, Restaurant, AccessTime, LocalDining } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const steps = ['Order Placed', 'Preparing', 'Ready for Pickup', 'Completed'];

const OrderStatusPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        // Mock status updates
        const timer = setInterval(() => {
            setActiveStep((prev) => {
                if (prev < 2) return prev + 1;
                return prev;
            });
        }, 5000); // Advance step every 5 seconds for demo

        return () => clearInterval(timer);
    }, []);

    const getStepIcon = (index: number) => {
        if (index === 0) return <AccessTime />;
        if (index === 1) return <Restaurant />;
        if (index === 2) return <CheckCircle />;
        if (index === 3) return <LocalDining />;
        return null;
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                        Order #{id || '123'}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6 }}>
                        Estimated time: {activeStep === 2 ? 'NOW' : '15 mins'}
                    </Typography>

                    <Box sx={{ width: '100%', mb: 6 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel icon={getStepIcon(index)}>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        {activeStep === 1 && <CircularProgress color="secondary" />}
                        {activeStep === 2 && (
                            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                                <Restaurant sx={{ fontSize: 60, color: 'success.main' }} />
                            </motion.div>
                        )}
                    </Box>

                    <Typography variant="h5" sx={{ mb: 4 }}>
                        {activeStep === 0 && "We've received your order!"}
                        {activeStep === 1 && "The chefs are cooking..."}
                        {activeStep === 2 && "Your food is READY!"}
                        {activeStep === 3 && "Enjoy your meal!"}
                    </Typography>

                    {activeStep === 2 && (
                        <Button variant="contained" size="large" color="success" fullWidth sx={{ mb: 2 }}>
                            I'm at the counter
                        </Button>
                    )}

                    <Button variant="outlined" onClick={() => window.print()} sx={{ mb: 2 }} fullWidth>
                        Print Receipt
                    </Button>

                    <Button variant="text" onClick={() => navigate('/')}>
                        Place Another Order
                    </Button>

                </motion.div>
            </Paper>
        </Container>
    );
};

export default OrderStatusPage;
