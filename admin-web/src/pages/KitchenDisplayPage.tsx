import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    List,
    ListItem,
    ListItemText,
    Paper
} from '@mui/material';
import { AccessTime, CheckCircle } from '@mui/icons-material';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
}

interface Order {
    id: string;
    table_number: number;
    status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';
    created_at: string;
    items: OrderItem[];
}

import api from '../services/api';
import { io, Socket } from 'socket.io-client';

const KitchenDisplayPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    // Mock kitchen ID for demonstration
    const KITCHEN_ID = 'kitchen-1';

    useEffect(() => {
        // 1. Fetch existing orders
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                // The backend returns full orders, we might need to map them to the UI format
                // For now, let's just use the mock if API fails
                setOrders(res.data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            }
        };
        fetchOrders();

        // 2. Connect to Socket.io
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            newSocket.emit('joinKitchen', KITCHEN_ID);
        });

        newSocket.on('newOrder', (orderItem: any) => {
            console.log('Received new order:', orderItem);
            // Append new order or update existing
            setOrders(prev => [...prev, orderItem]);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const updateStatus = async (orderId: string, status: string) => {
        try {
            await api.patch(`/orders/${orderId}`, { status });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as any } : o));
        } catch (err) {
            console.error('Failed to update status:', err);
            // Fallback for demo
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as any } : o));
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Kitchen Display System</Typography>

            <Grid container spacing={2}>
                {['PENDING', 'PREPARING', 'READY'].map((status) => (
                    <Grid key={status} size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '80vh' }}>
                            <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                                {status} ({orders.filter(o => o.status === status).length})
                            </Typography>

                            {orders.filter(o => o.status === status).map((order) => (
                                <Card key={order.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="h6">Table #{order.table_number}</Typography>
                                            <Chip label={new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} icon={<AccessTime />} size="small" />
                                        </Box>
                                        <List dense>
                                            {order.items.map((item, idx) => (
                                                <ListItem key={idx} disablePadding>
                                                    <ListItemText primary={`${item.quantity}x ${item.name}`} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                    <CardActions>
                                        {status === 'PENDING' && (
                                            <Button fullWidth variant="contained" color="primary" onClick={() => updateStatus(order.id, 'PREPARING')}>
                                                Start Cooking
                                            </Button>
                                        )}
                                        {status === 'PREPARING' && (
                                            <Button fullWidth variant="contained" color="success" onClick={() => updateStatus(order.id, 'READY')}>
                                                Mark Ready
                                            </Button>
                                        )}
                                        {status === 'READY' && (
                                            <Button fullWidth variant="outlined" startIcon={<CheckCircle />} onClick={() => updateStatus(order.id, 'COMPLETED')}>
                                                Complete
                                            </Button>
                                        )}
                                    </CardActions>
                                </Card>
                            ))}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default KitchenDisplayPage;
