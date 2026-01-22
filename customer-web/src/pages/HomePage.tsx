import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Chip, Container, Skeleton, TextField } from '@mui/material';
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
    category?: string;
    kitchen?: { name: string };
}

const HomePage: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
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
                    { id: '1', name: 'Classic Burger', price: 12.99, category: 'Burgers', kitchen: { name: 'Grill Master' }, image_url: 'https://placehold.co/400x300/ff9f43/ffffff?text=Classic+Burger' },
                    { id: '2', name: 'Cheese Pizza', price: 14.50, category: 'Pizza', kitchen: { name: 'Pizza Corner' }, image_url: 'https://placehold.co/400x300/e0e0e0/333333?text=Pizza' },
                    { id: '3', name: 'Coke', price: 2.99, category: 'Drinks', kitchen: { name: 'Grill Master' }, image_url: 'https://placehold.co/400x300/e0e0e0/333333?text=Coke' },
                ] as any);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category || 'General')))];

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || (item.category || 'General') === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Banner Section */}
            <Box sx={{
                background: 'linear-gradient(135deg, #FE6B8B 30%, #FF8E53 90%)',
                borderRadius: 4,
                p: 5,
                mb: 5,
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(255, 107, 139, 0.3)'
            }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Delicious Food, Delivered.
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Order from the best kitchens in town.
                </Typography>
            </Box>

            {/* Search and Filter Section */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search for food..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <Chip
                            key={cat}
                            label={cat}
                            clickable
                            color={selectedCategory === cat ? 'primary' : 'default'}
                            onClick={() => setSelectedCategory(cat)}
                            sx={{ fontWeight: 'bold' }}
                        />
                    ))}
                </Box>
            </Box>

            <Grid container spacing={3}>
                {loading ? (
                    Array.from(new Array(4)).map((_, i) => (
                        <Grid item key={i} xs={12} sm={6}>
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                        </Grid>
                    ))
                ) : (
                    filteredItems.map((item, index) => (
                        <Grid item key={item.id} xs={12} sm={6}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={item.image_url || 'https://placehold.co/400x300/e0e0e0/333333?text=Dish'}
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
                                            <Star fontSize="inherit" color="warning" /> 4.5 • {item.kitchen?.name || 'Local Kitchen'}
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
