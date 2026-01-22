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

interface User {
    id: string;
    email: string;
    role: string;
    branch_id?: string;
}

interface Branch {
    id: string;
    name: string;
}

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', role: 'BRANCH_ADMIN', branch_id: '' });

    const fetchData = async () => {
        try {
            const [usersRes, branchesRes] = await Promise.all([
                api.get('/users'),
                api.get('/branches')
            ]);
            setUsers(usersRes.data);
            setBranches(branchesRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
            // Fallback mock data
            setUsers([
                { id: '1', email: 'admin@example.com', role: 'SUPER_ADMIN' },
                { id: '2', email: 'branch1@test.com', role: 'BRANCH_ADMIN', branch_id: '1' },
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
            await api.post('/auth/register', formData); // Register via Auth API
            setOpen(false);
            setFormData({ email: '', password: '', role: 'BRANCH_ADMIN', branch_id: '' });
            // Refresh the list after successful creation
            fetchData();
        } catch (error) {
            console.error('Failed to create user', error);
        }
    };

    // Delete a user and refresh list
    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/users/${id}`);
            // Refresh after deletion
            fetchData();
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    };

    // Placeholder for edit functionality (future implementation)
    const handleEdit = (user: User) => {
        // Open edit dialog, pre-fill form, then call API PUT/PATCH
        console.log('Edit requested for', user);
    };

    const getBranchName = (id?: string) => {
        if (!id) return '-';
        const branch = branches.find(b => b.id === id);
        return branch ? branch.name : 'Unknown Branch';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Users</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                    Add User
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={user.role === 'SUPER_ADMIN' ? 'secondary' : 'primary'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{getBranchName(user.branch_id)}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleEdit(user)}><Edit /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Role"
                        fullWidth
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                        <MenuItem value="BRANCH_ADMIN">Branch Admin</MenuItem>
                        <MenuItem value="KITCHEN_STAFF">Kitchen Staff</MenuItem>
                    </TextField>
                    {formData.role !== 'SUPER_ADMIN' && (
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
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersPage;
