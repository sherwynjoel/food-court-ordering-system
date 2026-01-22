import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    MenuItem,
    CardMedia,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../services/api';
import axios from 'axios'; // Added axios for the patch request

interface MenuItemType {
    id: string;
    name: string;
    price: number;
    kitchen_id: string;
    branch_id: string;
    category?: string;
    image_url?: string;
    is_available?: boolean;
    kitchen?: { name: string };
}

interface Kitchen {
    id: string;
    name: string;
}

interface Branch {
    id: string;
    name: string;
}

const MenuManagementPage: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
    const [kitchens, setKitchens] = useState<Kitchen[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', category: '', kitchen_id: '', branch_id: '', image_url: '' });

    const fetchData = async () => {
        try {
            const [menuRes, kitchensRes, branchesRes] = await Promise.all([
                api.get('/menu-items'),
                api.get('/kitchens'),
                api.get('/branches')
            ]);
            setMenuItems(menuRes.data);
            setKitchens(kitchensRes.data);
            setBranches(branchesRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
            // Mock data
            setMenuItems([
                { id: '1', name: 'Burger', price: 9.99, kitchen_id: '1', branch_id: '1', kitchen: { name: 'Grill Station' }, is_available: true },
                { id: '2', name: 'Pizza', price: 12.50, kitchen_id: '2', branch_id: '1', kitchen: { name: 'Pizza Corner' }, is_available: false },
            ]);
            setKitchens([
                { id: '1', name: 'Grill Station' },
                { id: '2', name: 'Pizza Corner' },
            ]);
            setBranches([
                { id: '1', name: 'Downtown FoodCourt' },
            ]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async () => {
        try {
            await api.post('/menu-items', { ...formData, price: parseFloat(formData.price) });
            setOpen(false);
            setFormData({ name: '', price: '', category: '', kitchen_id: '', branch_id: '', image_url: '' });
            fetchData();
        } catch (error) {
            console.error('Failed to create menu item', error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Menu Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                    Add Item
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Kitchen</TableCell>
                            <TableCell>Availability</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {menuItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {item.image_url && <Box component="img" src={item.image_url} sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }} />}
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>₹{Number(item.price).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Chip label={item.category || 'General'} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>{item.kitchen?.name || 'Unknown'}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={item.is_available !== false} // Default to true if undefined
                                        onChange={async (e) => {
                                            const newStatus = e.target.checked;
                                            // Optimistic update
                                            setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, is_available: newStatus } : i));

                                            try {
                                                // We need to send all required fields or the backend validation might fail if using PUT/PATCH depending on implementation.
                                                // Assuming PATCH or PUT that accepts partial updates or full object.
                                                // To be safe, let's just update the specific field if we had a specific endpoint, but here we likely reuse the update logic.

                                                // Ideally we should use a PATCH endpoint, but for now we'll update the item directly.
                                                await axios.patch(`http://localhost:3000/menu-items/${item.id}`, { is_available: newStatus });
                                            } catch (error) {
                                                console.error("Failed to update availability", error);
                                                // Revert on failure
                                                setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, is_available: !newStatus } : i));
                                            }
                                        }}
                                        color="success"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small"><Edit /></IconButton>
                                    <IconButton size="small" color="error"><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Menu Item</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Item Name"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        fullWidth
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Category"
                        fullWidth
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Image URL"
                        fullWidth
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Branch"
                        fullWidth
                        value={formData.branch_id}
                        onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                        sx={{ mt: 2 }}
                    >
                        {branches.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        margin="dense"
                        label="Kitchen"
                        fullWidth
                        value={formData.kitchen_id}
                        onChange={(e) => setFormData({ ...formData, kitchen_id: e.target.value })}
                        sx={{ mt: 2 }}
                    >
                        {kitchens.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MenuManagementPage;
