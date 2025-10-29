const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [req.user.userId];

    // Add filters
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [tasks] = await db.query(query, params);
    res.json({ tasks });
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task: tasks[0] });
  } catch (error) {
    console.error('Fetch task error:', error);
    res.status(500).json({ message: 'Server error fetching task' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, status, priority } = req.body;

      const [result] = await db.query(
        'INSERT INTO tasks (user_id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)',
        [req.user.userId, title, description || '', status || 'pending', priority || 'medium']
      );

      const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);

      res.status(201).json({
        message: 'Task created successfully',
        task: newTask[0]
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ message: 'Server error creating task' });
    }
  }
);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim(),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, status, priority } = req.body;
      const updates = [];
      const values = [];

      if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
      }

      if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
      }

      if (status) {
        updates.push('status = ?');
        values.push(status);
      }

      if (priority) {
        updates.push('priority = ?');
        values.push(priority);
      }

      if (updates.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      values.push(req.params.id, req.user.userId);

      const [result] = await db.query(
        `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const [updatedTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);

      res.json({
        message: 'Task updated successfully',
        task: updatedTask[0]
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ message: 'Server error updating task' });
    }
  }
);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

module.exports = router;