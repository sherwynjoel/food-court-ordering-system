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
    DialogActions
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../services/api';

interface MenuItemType {
    id: string;
    name: string;
    price: number;
    kitchen_id: string;
    branch_id: string;
    image_url?: string;
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
    const [formData, setFormData] = useState({ name: '', price: '', kitchen_id: '', branch_id: '', image_url: '' });

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
                { id: '1', name: 'Burger', price: 9.99, kitchen_id: '1', branch_id: '1', kitchen: { name: 'Grill Station' } },
                { id: '2', name: 'Pizza', price: 12.50, kitchen_id: '2', branch_id: '1', kitchen: { name: 'Pizza Corner' } },
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
            setFormData({ name: '', price: '', kitchen_id: '', branch_id: '', image_url: '' });
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
                            <TableCell>Kitchen</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {menuItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {item.image_url && <CardMedia component="img" sx={{ width: 50, height: 50, borderRadius: 1 }} image={item.image_url} alt={item.name} />}
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>${item.price}</TableCell>
                                <TableCell>{item.kitchen?.name || 'Unknown'}</TableCell>
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
