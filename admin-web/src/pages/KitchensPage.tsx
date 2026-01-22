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
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../services/api';

interface Kitchen {
    id: string;
    name: string;
    status: string;
    branch?: {
        id: string;
        name: string;
    };
    branch_id?: string;
}

interface Branch {
    id: string;
    name: string;
}

const KitchensPage: React.FC = () => {
    const [kitchens, setKitchens] = useState<Kitchen[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', branch_id: '' });

    const fetchData = async () => {
        try {
            const [kitchensRes, branchesRes] = await Promise.all([
                api.get('/kitchens'),
                api.get('/branches')
            ]);
            setKitchens(kitchensRes.data);
            setBranches(branchesRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
            // Fallback mock data
            setKitchens([
                { id: '1', name: 'Main Kitchen', status: 'ACTIVE', branch_id: '1' },
                { id: '2', name: 'Grill Station', status: 'CLOSED', branch_id: '1' },
            ]);
            setBranches([
                { id: '1', name: 'Downtown FoodCourt' },
                { id: '2', name: 'Mall Plaza' },
            ]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async () => {
        try {
            await api.post('/kitchens', formData);
            setOpen(false);
            setFormData({ name: '', branch_id: '' });
            // Refresh the list after successful creation
            fetchData();
        } catch (error) {
            console.error('Failed to create kitchen', error);
        }
    };

    // Delete a kitchen and refresh list
    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/kitchens/${id}`);
            // Refresh after deletion
            fetchData();
        } catch (error) {
            console.error('Failed to delete kitchen', error);
        }
    };

    // Placeholder for edit functionality (future implementation)
    const handleEdit = (kitchen: Kitchen) => {
        // Open edit dialog, pre-fill form, then call API PUT/PATCH
        console.log('Edit requested for', kitchen);
    };

    const getBranchName = (id: string) => {
        const branch = branches.find(b => b.id === id);
        return branch ? branch.name : 'Unknown Branch';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Kitchens</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                    Add Kitchen
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {kitchens.map((kitchen) => (
                            <TableRow key={kitchen.id}>
                                <TableCell>{kitchen.name}</TableCell>
                                <TableCell>{kitchen.branch?.name || 'Unknown Branch'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={kitchen.status}
                                        color={kitchen.status === 'ACTIVE' ? 'success' : 'warning'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleEdit(kitchen)}><Edit /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(kitchen.id)}><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Kitchen</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Kitchen Name"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Branch"
                        fullWidth
                        value={formData.branch_id}
                        onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                    >
                        {branches.map((option) => (
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

export default KitchensPage;
