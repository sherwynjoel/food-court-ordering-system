import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, alpha, useTheme } from '@mui/material';
import { AttachMoney, People, Restaurant, ShoppingCart, TrendingUp } from '@mui/icons-material';
import api from '../services/api';

const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
}> = ({ title, value, icon, color, trend }) => {
    const theme = useTheme();
    return (
        <Paper sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: 160,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            border: '1px solid',
            borderColor: 'divider',
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(color, 0.02)} 100%)`,
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 24px -10px ${alpha(color, 0.2)}`,
                borderColor: alpha(color, 0.2),
            }
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 2.5,
                bgcolor: alpha(color, 0.1),
                color: color,
                mb: 2
            }}>
                {icon}
            </Box>

            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'nowrap', gap: 1, overflow: 'hidden' }}>
                <Typography variant="h4" sx={{
                    fontWeight: 800,
                    color: 'text.primary',
                    fontSize: { xs: '1.25rem', md: '1.4rem', lg: '1.6rem' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {value}
                </Typography>
                {trend && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main
                    }}>
                        <TrendingUp sx={{ fontSize: 13, mr: 0.2 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem' }}>{trend}</Typography>
                    </Box>
                )}
            </Box>

            {/* Background Decorative Circle */}
            <Box sx={{
                position: 'absolute',
                right: -24,
                bottom: -24,
                width: 96,
                height: 96,
                borderRadius: '50%',
                bgcolor: alpha(color, 0.04)
            }} />
        </Paper>
    );
};

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        activeKitchens: 0,
        activeUsers: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/analytics/dashboard');
                // The API returns { totalOrders, totalRevenue, activeKitchens, activeUsers }
                // We map it to the state structure
                setStats({
                    totalOrders: response.data.totalOrders,
                    totalRevenue: response.data.totalRevenue,
                    activeKitchens: response.data.activeKitchens,
                    activeUsers: response.data.activeUsers
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <Box sx={{ pb: 8 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h4" sx={{ color: 'text.primary', mb: 1, fontWeight: 800 }}>
                    Dashboard Overview
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
                    Welcome back! Here's what's happening today in your food court.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Revenue"
                        value={`₹${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        icon={<AttachMoney />}
                        color="#6366f1"
                        trend="+12.5%"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Orders Completed"
                        value={stats.totalOrders}
                        icon={<ShoppingCart />}
                        color="#10b981"
                        trend="+8.2%"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Stall Kitchens"
                        value={stats.activeKitchens}
                        icon={<Restaurant />}
                        color="#f59e0b"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Active Staff"
                        value={stats.activeUsers}
                        icon={<People />}
                        color="#ec4899"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 8 }} sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, px: 1 }}>
                        Recent Activity
                    </Typography>
                    <Paper sx={{
                        p: 6,
                        borderRadius: 5,
                        textAlign: 'center',
                        minHeight: 340,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                    }}>
                        <Box sx={{
                            p: 3,
                            borderRadius: '50%',
                            bgcolor: 'background.default',
                            color: 'text.secondary',
                            mb: 3,
                            display: 'flex'
                        }}>
                            <ShoppingCart sx={{ fontSize: 48, opacity: 0.2 }} />
                        </Box>
                        <Typography variant="h6" fontWeight={800} gutterBottom>
                            No new activity
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, opacity: 0.7 }}>
                            When orders are placed or status updates occur, they will appear here in real-time.
                        </Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, px: 1 }}>
                        Branch Quick Health
                    </Typography>
                    <Paper sx={{
                        p: 1,
                        borderRadius: 5,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                    }}>
                        {[
                            { name: 'City Center Mall', status: 'Online', color: '#10b981', orders: 42 },
                            { name: 'Central Square', status: 'Busy', color: '#f59e0b', orders: 89 },
                            { name: 'Airport T3 Express', status: 'Online', color: '#10b981', orders: 23 },
                        ].map((branch, i) => (
                            <Box key={i} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                borderRadius: 4,
                                mb: i === 2 ? 0 : 0.5,
                                '&:hover': { bgcolor: 'background.default' }
                            }}>
                                <Box>
                                    <Typography variant="body2" fontWeight={700}>{branch.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{branch.orders} current orders</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                    <Box sx={{ px: 1, py: 0.25, borderRadius: 1.5, bgcolor: alpha(branch.color, 0.1), color: branch.color, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: branch.color }} />
                                        <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.65rem' }}>
                                            {branch.status}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;
