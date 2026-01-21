import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { AttachMoney, People, Restaurant, ShoppingCart } from '@mui/icons-material';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', right: -10, top: -10, opacity: 0.1, transform: 'scale(2.5)', color }}>
            {icon}
        </Box>
        <Typography variant="subtitle2" color="textSecondary">{title}</Typography>
        <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>{value}</Typography>
    </Paper>
);

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
                // In a real app, you'd have a specific stats endpoint
                // const response = await api.get('/stats');
                // setStats(response.data);

                // Mocking data for now
                setStats({
                    totalOrders: 154,
                    totalRevenue: 3450.00,
                    activeKitchens: 5,
                    activeUsers: 12
                });
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toFixed(2)}`}
                        icon={<AttachMoney />}
                        color="#4caf50"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={<ShoppingCart />}
                        color="#2196f3"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Active Kitchens"
                        value={stats.activeKitchens}
                        icon={<Restaurant />}
                        color="#ff9800"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Active Users"
                        value={stats.activeUsers}
                        icon={<People />}
                        color="#9c27b0"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                <Paper sx={{ p: 2 }}>
                    <Typography color="textSecondary">No recent activity to display.</Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default DashboardPage;
