import { Router } from 'express';
import pool from '../config/database.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM operations ORDER BY created_at DESC'
    );

    res.status(200).json({
      count: result.rowCount,
      operations: result.rows
    });
  } catch (error) {
    console.error('Failed to retrieve operations:', error.message);
    res.status(500).json({ error: 'Unable to retrieve operations' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid operation ID' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM operations WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Operation not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Failed to retrieve operation:', error.message);
    res.status(500).json({ error: 'Unable to retrieve operation' });
  }
});

router.post('/', async (req, res) => {
  const { name, description, status = 'pending' } = req.body;

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'A valid operation name is required' });
  }

  if (name.trim().length > 150) {
    return res.status(400).json({ error: 'Operation name must not exceed 150 characters' });
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== 'string'
  ) {
    return res.status(400).json({ error: 'Description must be a string' });
  }

  if (!['pending', 'in_progress', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid operation status' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO operations (name, description, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name.trim(), description ?? null, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Failed to create operation:', error.message);
    res.status(500).json({ error: 'Unable to create operation' });
  }
});

export default router;
