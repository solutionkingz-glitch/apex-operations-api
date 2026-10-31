
import { jest } from '@jest/globals';
import request from 'supertest';

const mockQuery = jest.fn();

jest.unstable_mockModule('../src/config/database.js', () => ({
  default: {
    query: mockQuery
  }
}));

const { default: app } = await import('../src/app.js');

describe('Health and readiness endpoints', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  test('GET /health should return healthy status', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });

  test('GET /ready should return ready when database is connected', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });

    const response = await request(app).get('/ready');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: 'ready',
      database: 'connected'
    });
  });

  test('GET /ready should return 503 when database is unavailable', async () => {
    mockQuery.mockRejectedValueOnce(new Error('Database unavailable'));

    const response = await request(app).get('/ready');

    expect(response.statusCode).toBe(503);
    expect(response.body).toEqual({
      status: 'not ready',
      database: 'unavailable'
    });
  });

  test('GET / should return application information', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.body.application).toBe('Apex Operations API');
    expect(response.body.version).toBe('1.0.0');
  });
});

describe('Operations API endpoints', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  const sampleOperation = {
    id: 1,
    name: 'Server maintenance',
    description: 'Routine server maintenance',
    status: 'pending'
  };

  test('GET /api/operations should return all operations', async () => {
    mockQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [sampleOperation]
    });

    const response = await request(app).get('/api/operations');

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.operations[0].name).toBe('Server maintenance');
  });

  test('GET /api/operations/:id should return an operation', async () => {
    mockQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [sampleOperation]
    });

    const response = await request(app).get('/api/operations/1');

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe('Server maintenance');
  });

  test('GET /api/operations/:id should reject an invalid ID', async () => {
    const response = await request(app).get('/api/operations/0');

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid operation ID');
    expect(mockQuery).not.toHaveBeenCalled();
  });

  test('GET /api/operations/:id should return 404 when operation does not exist', async () => {
    mockQuery.mockResolvedValueOnce({
      rowCount: 0,
      rows: []
    });

    const response = await request(app).get('/api/operations/999');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Operation not found');
  });

  test('POST /api/operations should create a new operation', async () => {
    mockQuery.mockResolvedValueOnce({
      rowCount: 1,
      rows: [sampleOperation]
    });

    const response = await request(app)
      .post('/api/operations')
      .send({
        name: 'Server maintenance',
        description: 'Routine server maintenance'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe('Server maintenance');
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO operations'),
      ['Server maintenance', 'Routine server maintenance', 'pending']
    );
  });

  test('POST /api/operations should reject an empty name', async () => {
    const response = await request(app)
      .post('/api/operations')
      .send({ name: '   ' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('A valid operation name is required');
    expect(mockQuery).not.toHaveBeenCalled();
  });

  test('POST /api/operations should reject an invalid status', async () => {
    const response = await request(app)
      .post('/api/operations')
      .send({
        name: 'Server maintenance',
        status: 'unknown'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid operation status');
    expect(mockQuery).not.toHaveBeenCalled();
  });
});
