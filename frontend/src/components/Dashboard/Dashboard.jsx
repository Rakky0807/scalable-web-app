import React from 'react';
import { Container, Box, Paper, Typography } from '@mui/material';
import TaskManager from './TaskManager';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Manage your tasks efficiently and stay productive.
          </Typography>

          <Box mt={4}>
            <TaskManager />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;