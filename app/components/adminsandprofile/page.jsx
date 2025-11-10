'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiSave,
  FiCamera,
  FiShield,
  FiUserPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX
} from 'react-icons/fi';
import {
  Card,
  CardContent,
  Button,
  TextField,
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
  Avatar,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Box,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { Add, Edit, Delete, AdminPanelSettings, Person, Security, Visibility, VisibilityOff } from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminsProfileManager({ user }) {
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: user?.avatar || null,
    phone: '+254 712 345 678',
    department: 'Administration'
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    securityAlerts: true,
    weeklyReports: false,
    twoFactorAuth: false
  });

  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@katwanyaa.ac.ke',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-03-15 14:30',
      avatar: null,
      phone: '+254 712 345 678',
      department: 'Administration',
      permissions: ['all']
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john.doe@katwanyaa.ac.ke',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-03-14 09:15',
      avatar: null,
      phone: '+254 723 456 789',
      department: 'Academic',
      permissions: ['students', 'assignments']
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane.smith@katwanyaa.ac.ke',
      role: 'moderator',
      status: 'inactive',
      lastLogin: '2024-03-10 16:45',
      avatar: null,
      phone: '+254 734 567 890',
      department: 'Communication',
      permissions: ['news', 'events']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'moderator',
    phone: '',
    department: 'Administration'
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveProfile = () => {
    // Simulate API call
    setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    console.log('Saving profile:', profile);
  };

  const handleSaveSettings = () => {
    setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' });
    console.log('Saving settings:', settings);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'error';
      case 'admin': return 'primary';
      case 'moderator': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const handleDeleteAdmin = (adminId) => {
    if (adminId === user?.id) {
      setSnackbar({ open: true, message: 'You cannot delete your own account!', severity: 'error' });
      return;
    }
    setAdmins(admins.filter(admin => admin.id !== adminId));
    setSnackbar({ open: true, message: 'Admin deleted successfully!', severity: 'success' });
  };
  
  const canModifyAdmin = (targetAdmin) => {
    // defensive checks: if missing data, deny modifications
    if (!targetAdmin) return false;
    const targetRole = targetAdmin?.role || '';
    const currentUserRole = user?.role || '';
    // Only super_admin can modify other super_admins
    if (targetRole === 'super_admin' && currentUserRole !== 'super_admin') {
      return false;
    }
    return true;
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setOpenDialog(true);
  };

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      setSnackbar({ open: true, message: 'Please fill all required fields!', severity: 'error' });
      return;
    }

    const newAdminData = {
      id: admins.length + 1,
      ...newAdmin,
      status: 'active',
      lastLogin: new Date().toLocaleString(),
      avatar: null,
      permissions: getDefaultPermissions(newAdmin.role)
    };

    setAdmins([...admins, newAdminData]);
    setNewAdmin({ name: '', email: '', role: 'moderator', phone: '', department: 'Administration' });
    setSnackbar({ open: true, message: 'New admin added successfully!', severity: 'success' });
  };

  const getDefaultPermissions = (role) => {
    switch (role) {
      case 'super_admin': return ['all'];
      case 'admin': return ['students', 'staff', 'assignments'];
      case 'moderator': return ['news', 'events', 'gallery'];
      default: return [];
    }
  };

  const handleUpdateAdmin = () => {
    if (selectedAdmin) {
      setAdmins(admins.map(admin => 
        admin.id === selectedAdmin.id ? selectedAdmin : admin
      ));
      setOpenDialog(false);
      setSnackbar({ open: true, message: 'Admin updated successfully!', severity: 'success' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admins & Profile</h1>
          <p className="text-gray-600 mt-2">Manage administrators and your profile settings</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <Card className="shadow-lg border-0 rounded-2xl">
        <CardContent className="p-0">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 600,
                minHeight: '60px'
              }
            }}
          >
            <Tab 
              icon={<Person />} 
              iconPosition="start" 
              label="My Profile" 
            />
            <Tab 
              icon={<AdminPanelSettings />} 
              iconPosition="start" 
              label="Admin Management" 
            />
            <Tab 
              icon={<Security />} 
              iconPosition="start" 
              label="Security" 
            />
          </Tabs>

          {/* Profile Tab */}
          <TabPanel value={tabValue} index={0}>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="shadow-lg border-0 rounded-2xl">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>

                    <div className="flex flex-col items-center gap-6 mb-6">
                      <div className="relative">
                        <Avatar
                          sx={{ width: 120, height: 120 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                        >
                          {user?.name?.charAt(0) || 'A'}
                        </Avatar>
                        <button className="absolute bottom-2 right-2 p-2 bg-blue-500 rounded-full text-white shadow-lg hover:bg-blue-600 transition-colors">
                          <FiCamera className="text-sm" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 text-center">
                        Click camera to update profile photo
                      </p>
                    </div>

                    <div className="space-y-4">
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <FiUser className="text-gray-400 mr-3" />
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        variant="outlined"
                        type="email"
                        InputProps={{
                          startAdornment: <FiMail className="text-gray-400 mr-3" />
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <FiUser className="text-gray-400 mr-3" />
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Department"
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        variant="outlined"
                      />

                      <Button
                        variant="contained"
                        startIcon={<FiSave />}
                        onClick={handleSaveProfile}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
                      >
                        Update Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Preferences & Quick Actions */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="shadow-lg border-0 rounded-2xl">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">Preferences</h2>

                      <div className="space-y-4">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.emailNotifications}
                              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                              color="primary"
                            />
                          }
                          label="Email Notifications"
                        />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.securityAlerts}
                              onChange={(e) => setSettings({ ...settings, securityAlerts: e.target.checked })}
                              color="primary"
                            />
                          }
                          label="Security Alerts"
                        />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.weeklyReports}
                              onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                              color="primary"
                            />
                          }
                          label="Weekly Reports"
                        />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.twoFactorAuth}
                              onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                              color="primary"
                            />
                          }
                          label="Two-Factor Authentication"
                        />

                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleSaveSettings}
                          className="bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold mt-4"
                        >
                          Save Preferences
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Account Status */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="shadow-lg border-0 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiShield className="text-white text-2xl" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">Account Status</h3>
                      <p className="text-green-600 font-bold text-lg mb-2">Active</p>
                      <p className="text-gray-600 text-sm">Last login: Today, 14:30</p>
                      <p className="text-gray-600 text-sm mt-2">Role: {user?.role ? user.role.replace('_', ' ') : 'N/A'}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabPanel>

          {/* Admin Management Tab */}
          <TabPanel value={tabValue} index={1}>
            <div className="space-y-6">
              {/* Header & Add Admin */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Admin Management</h2>
                  <p className="text-gray-600">Manage system administrators and their permissions</p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outlined"
                    startIcon={<FiUserPlus />}
                    onClick={() => setTabValue(2)}
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Add New Admin
                  </Button>
                </div>
              </div>

              {/* Search */}
              <TextField
                placeholder="Search admins by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <FiSearch className="text-gray-400 mr-3" />
                }}
                className="flex-1 max-w-md"
                variant="outlined"
              />

              {/* Admins Table */}
              <Card className="shadow-lg border-0 rounded-2xl">
                <CardContent className="p-0">
                  <TableContainer>
                    <Table>
                      <TableHead className="bg-gray-50">
                        <TableRow>
                          <TableCell className="font-semibold">Admin</TableCell>
                          <TableCell className="font-semibold">Contact</TableCell>
                          <TableCell className="font-semibold">Role</TableCell>
                          <TableCell className="font-semibold">Status</TableCell>
                          <TableCell className="font-semibold">Last Login</TableCell>
                          <TableCell className="font-semibold text-right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAdmins.map((admin) => (
                          <TableRow key={admin.id} hover>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="bg-gradient-to-r from-blue-500 to-purple-600">
                                  {admin.name.charAt(0)}
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-gray-800">{admin.name}</p>
                                  <p className="text-gray-500 text-sm">{admin.department}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-gray-800 text-sm">{admin.email}</p>
                              <p className="text-gray-500 text-xs">{admin.phone}</p>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={admin.role.replace('_', ' ')} 
                                color={getRoleColor(admin.role)}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={admin.status} 
                                color={getStatusColor(admin.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">
                              {admin.lastLogin}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <IconButton 
                                  onClick={() => handleEditAdmin(admin)}
                                  className="text-blue-600 hover:bg-blue-50"
                                  disabled={!canModifyAdmin(admin)}
                                  title={!canModifyAdmin(admin) ? "You cannot modify this admin" : "Edit admin"}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton 
                                  onClick={() => handleDeleteAdmin(admin.id)}
                                  className="text-red-600 hover:bg-red-50"
                                  disabled={!canModifyAdmin(admin)}
                                  title={!canModifyAdmin(admin) ? "You cannot delete this admin" : "Delete admin"}
                                >
                                  <Delete />
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </div>
          </TabPanel>

          {/* Security & Add Admin Tab */}
          <TabPanel value={tabValue} index={2}>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add New Admin */}
              <Card className="shadow-lg border-0 rounded-2xl">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Admin</h2>
                  <div className="space-y-4">
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      variant="outlined"
                    />
                    
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      variant="outlined"
                      type="email"
                    />

                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={newAdmin.phone}
                      onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                      variant="outlined"
                    />

                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={newAdmin.role}
                        onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                        label="Role"
                      >
                        <MenuItem value="moderator">Moderator</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                        {user?.role === 'super_admin' && (
                          <MenuItem value="super_admin">Super Admin</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Department</InputLabel>
                      <Select
                        value={newAdmin.department}
                        onChange={(e) => setNewAdmin({ ...newAdmin, department: e.target.value })}
                        label="Department"
                      >
                        <MenuItem value="Administration">Administration</MenuItem>
                        <MenuItem value="Academic">Academic</MenuItem>
                        <MenuItem value="Communication">Communication</MenuItem>
                        <MenuItem value="Finance">Finance</MenuItem>
                      </Select>
                    </FormControl>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<FiUserPlus />}
                      onClick={handleAddAdmin}
                      className="bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold"
                    >
                      Add Admin User
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="shadow-lg border-0 rounded-2xl">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
                  <div className="space-y-4">
                    <TextField
                      fullWidth
                      label="Current Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <FiLock className="text-gray-400 mr-3" />,
                        endAdornment: (
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        )
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <FiLock className="text-gray-400 mr-3" />
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <FiLock className="text-gray-400 mr-3" />
                      }}
                    />

                    <Button
                      variant="contained"
                      startIcon={<FiShield />}
                      fullWidth
                      className="bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
                    >
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Edit Admin Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Admin - {selectedAdmin?.name}
        </DialogTitle>
        <DialogContent>
          {selectedAdmin && (
            <div className="space-y-4 mt-4">
              <TextField
                fullWidth
                label="Full Name"
                value={selectedAdmin.name}
                onChange={(e) => setSelectedAdmin({ ...selectedAdmin, name: e.target.value })}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email"
                value={selectedAdmin.email}
                onChange={(e) => setSelectedAdmin({ ...selectedAdmin, email: e.target.value })}
                variant="outlined"
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedAdmin.role}
                  onChange={(e) => setSelectedAdmin({ ...selectedAdmin, role: e.target.value })}
                  label="Role"
                  disabled={!canModifyAdmin(selectedAdmin)}
                >
                  <MenuItem value="moderator">Moderator</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  {user?.role === 'super_admin' && (
                    <MenuItem value="super_admin">Super Admin</MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedAdmin.status}
                  onChange={(e) => setSelectedAdmin({ ...selectedAdmin, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateAdmin}
            variant="contained"
            disabled={!canModifyAdmin(selectedAdmin)}
          >
            Update Admin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}