import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Avatar,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    Restaurant,
    People,
    Store,
    Logout
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';

const drawerWidth = 240;

const DashboardLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Food Court Admin
                </Typography>
            </Toolbar>
            <List>
                {['Dashboard', 'Branches', 'Kitchens', 'Users', 'Menu', 'KDS'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={() => navigate(text === 'Dashboard' ? '/' : `/${text.toLowerCase()}`)}>
                            <ListItemIcon>
                                {index === 0 && <Dashboard />}
                                {index === 1 && <Store />}
                                {index === 2 && <Restaurant />}
                                {index === 3 && <People />}
                                {index === 4 && <MenuIcon />}
                                {index === 5 && <Restaurant />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            {user?.email}
                        </Typography>
                        <IconButton onClick={handleMenuOpen} size="small">
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                {user?.email?.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
