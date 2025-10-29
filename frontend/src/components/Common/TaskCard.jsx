import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'primary';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'default';
  }
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Typography variant="h6" component="div">
            {task.title}
          </Typography>
          <Box>
            <Chip
              label={task.status.replace('_', ' ').toUpperCase()}
              color={getStatusColor(task.status)}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={task.priority.toUpperCase()}
              color={getPriorityColor(task.priority)}
              size="small"
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {task.description || 'No description'}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Created: {new Date(task.created_at).toLocaleDateString()}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(task)}
          aria-label="edit task"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(task.id)}
          aria-label="delete task"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TaskCard;