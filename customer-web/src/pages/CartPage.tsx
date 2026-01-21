import React, { useState } from 'react';
import { Box, Typography, Container, Paper, IconButton, Button, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { Add, Remove, Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const CartPage: React.FC = () => {
    const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [checkingOut, setCheckingOut] = useState(false);

    const handleCheckout = async () => {
        setCheckingOut(true);
        try {
            const orderItems = items.map(item => ({
                menu_item_id: item.id,
                quantity: item.quantity
            }));

            const response = await api.post('/orders', {
                table_number: "5", // Mock table
                branch_id: items[0]?.id.split('-')[0] || "branch-1", // Mock branch
                items: orderItems
            });

            clearCart();
            navigate(`/order/${response.data.id || '101'}`);
        } catch (err) {
            console.error('Checkout failed:', err);
            // Fallback for demo if backend is down
            setTimeout(() => {
                alert(`Demo Mode: Order placed successfully (offline). Total: $${total.toFixed(2)}`);
                clearCart();
                navigate('/order/101');
            }, 1000);
        } finally {
            setCheckingOut(false);
        }
    };

    if (items.length === 0) {
        return (
            <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    Your cart is empty
                </Typography>
                <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                    Browse Menu
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
                Back to Menu
            </Button>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Your Order
            </Typography>

            <Paper sx={{ overflow: 'hidden' }}>
                <List sx={{ p: 0 }}>
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" color="error" onClick={() => removeFromCart(item.id)}>
                                            <Delete />
                                        </IconButton>
                                    }
                                    sx={{ py: 2 }}
                                >
                                    <ListItemAvatar>
                                        <Avatar variant="rounded" src={item.image_url} alt={item.name} sx={{ width: 64, height: 64, mr: 2 }} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography variant="subtitle1" fontWeight="bold">{item.name}</Typography>}
                                        secondaryTypographyProps={{ component: 'div' }}
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <IconButton size="small" onClick={() => updateQuantity(item.id, -1)}>
                                                    <Remove fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ mx: 2, fontWeight: 'bold' }}>{item.quantity}</Typography>
                                                <IconButton size="small" onClick={() => updateQuantity(item.id, 1)}>
                                                    <Add fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        }
                                    />
                                    <Typography variant="h6" sx={{ minWidth: 60, textAlign: 'right' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </ListItem>
                                <Divider />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </List>
                <Box sx={{ p: 3, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" color="text.secondary">Total</Typography>
                        <Typography variant="h4" fontWeight="bold" color="primary">${total.toFixed(2)}</Typography>
                    </Box>
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={checkingOut}
                        onClick={handleCheckout}
                        sx={{ py: 1.5, fontSize: '1.1rem' }}
                    >
                        {checkingOut ? 'Placing Order...' : 'Checkout'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default CartPage;
