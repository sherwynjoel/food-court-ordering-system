import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
    MenuItem,
    useTheme,
    alpha
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    Restaurant,
    People,
    Store,
    Logout,
    Fastfood,
    TableRestaurant
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';

const drawerWidth = 260;

const DashboardLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

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

    const navItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/' },
        { text: 'Branches', icon: <Store />, path: '/branches' },
        { text: 'Kitchens', icon: <Restaurant />, path: '/kitchens' },
        { text: 'Users', icon: <People />, path: '/users' },
        { text: 'Menu', icon: <Fastfood />, path: '/menu' },
        { text: 'Tables', icon: <TableRestaurant />, path: '/tables' },
        { text: 'KDS', icon: <Restaurant />, path: '/kds' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', bgcolor: 'background.default' }}>
            <Toolbar sx={{ px: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        boxShadow: '0 4px 6px -1px rgb(99 102 241 / 0.4)'
                    }}>
                        <Fastfood sx={{ color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, letterSpacing: '-0.5px' }}>
                        FC Admin
                    </Typography>
                </Box>
            </Toolbar>
            <List sx={{ px: 2 }}>
                {navItems.map((item) => {
                    const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 3,
                                    py: 1.2,
                                    px: 2,
                                    bgcolor: active ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                    color: active ? 'primary.main' : 'text.secondary',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                                        color: 'primary.main',
                                        '& .MuiListItemIcon-root': { color: 'primary.main' }
                                    },
                                }}
                            >
                                <ListItemIcon sx={{
                                    minWidth: 40,
                                    color: active ? 'primary.main' : 'text.secondary',
                                    transition: 'color 0.2s'
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: active ? 700 : 500,
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {user?.email?.split('@')[0]}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Super Admin
                            </Typography>
                        </Box>
                        <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, border: '1px solid', borderColor: 'divider' }}>
                            <Avatar sx={{
                                bgcolor: 'primary.main',
                                width: 36,
                                height: 36,
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}>
                                {user?.email?.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                sx: { mt: 1.5, minWidth: 160, borderRadius: 3, boxShadow: theme.shadows[3] }
                            }}
                        >
                            <MenuItem onClick={handleLogout} sx={{ py: 1.5, gap: 1.5 }}>
                                <Logout fontSize="small" sx={{ color: 'text.secondary' }} />
                                <Typography variant="body2" fontWeight={500}>Logout</Typography>
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
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            border: 'none',
                            borderRight: '1px solid',
                            borderColor: 'divider'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: { xs: 2, sm: 4, md: 6 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
