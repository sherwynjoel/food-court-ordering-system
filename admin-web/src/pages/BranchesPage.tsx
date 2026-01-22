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
    TextField
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../services/api';

interface Branch {
    id: string;
    name: string;
    location: string;
    isActive: boolean;
}

const BranchesPage: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', location: '' });

    const fetchBranches = async () => {
        try {
            const response = await api.get('/branches');
            setBranches(response.data);
        } catch (error) {
            console.error('Failed to fetch branches', error);
            // Fallback mock data if DB is down
            setBranches([
                { id: '1', name: 'Downtown FoodCourt', location: '123 Main St', isActive: true },
                { id: '2', name: 'Mall Plaza', location: '456 Mall Ave', isActive: false },
            ]);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleCreate = async () => {
        try {
            await api.post('/branches', formData);
            setOpen(false);
            setFormData({ name: '', location: '' });
            // Refresh the list after successful creation
            fetchBranches();
        } catch (error) {
            console.error('Failed to create branch', error);
        }
    };

    // New: Delete a branch and refresh list
    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/branches/${id}`);
            // Refresh after deletion
            fetchBranches();
        } catch (error) {
            console.error('Failed to delete branch', error);
        }
    };

    // Placeholder for edit functionality (future implementation)
    const handleEdit = (branch: Branch) => {
        // Open edit dialog, pre‑fill form, then call API PUT/PATCH
        console.log('Edit requested for', branch);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Branches</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                    Add Branch
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {branches.map((branch) => (
                            <TableRow key={branch.id}>
                                <TableCell>{branch.name}</TableCell>
                                <TableCell>{branch.location}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={branch.isActive ? 'Active' : 'Inactive'}
                                        color={branch.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleEdit(branch)}><Edit /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(branch.id)}><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Branch</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Branch Name"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        fullWidth
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BranchesPage;
