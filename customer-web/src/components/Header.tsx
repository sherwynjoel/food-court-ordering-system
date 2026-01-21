import React from 'react';
import { AppBar, Toolbar, Typography, Badge, IconButton } from '@mui/material';
import { ShoppingCart, RestaurantMenu } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { itemCount } = useCart();

    return (
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid #333' }}>
            <Toolbar>
                <IconButton edge="start" color="primary" onClick={() => navigate('/')}>
                    <RestaurantMenu />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'text.primary', ml: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    FoodCourt
                </Typography>
                <IconButton color="primary" onClick={() => navigate('/cart')}>
                    <Badge badgeContent={itemCount} color="secondary">
                        <ShoppingCart />
                    </Badge>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
