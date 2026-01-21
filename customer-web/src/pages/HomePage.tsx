import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Chip, Container, Skeleton } from '@mui/material';
import { Add, Star } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useCart } from '../context/CartContext';

// Mock data types same as admin
interface MenuItem {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    kitchen_id: string;
    branch_id: string;
    kitchen?: { name: string };
}

const HomePage: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await api.get('/menu-items');
                setMenuItems(res.data);
            } catch (err) {
                console.error('Failed to fetch menu:', err);
                // Fallback to minimal mock if API fails
                setMenuItems([
                    { id: '1', name: 'Classic Burger', price: 12.99, kitchen: { name: 'Grill Master' }, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
                ] as any);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                Hungry?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Order form the best kitchens in town.
            </Typography>

            <Grid container spacing={3}>
                {loading ? (
                    Array.from(new Array(4)).map((_, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6 }}>
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                        </Grid>
                    ))
                ) : (
                    menuItems.map((item, index) => (
                        <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={item.image_url || 'https://via.placeholder.com/400x300'}
                                        alt={item.name}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                            <Typography variant="h6" gutterBottom>
                                                {item.name}
                                            </Typography>
                                            <Chip label={`$${item.price}`} color="primary" size="small" />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Star fontSize="inherit" color="secondary" /> 4.5 • {item.kitchen?.name}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            startIcon={<Add />}
                                            onClick={() => addToCart({
                                                id: item.id,
                                                name: item.name,
                                                price: item.price,
                                                image_url: item.image_url,
                                                kitchen_name: item.kitchen?.name
                                            })}
                                        >
                                            Add to Order
                                        </Button>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default HomePage;
