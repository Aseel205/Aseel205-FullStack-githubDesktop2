import request from 'supertest';
import mongoose from 'mongoose';        // <-- add this
import app from '../server'; // Import app from the server

describe('CRUD operations', () => {
  let noteId: string;

  // Test for creating a note
  it('should create a new note', async () => {
    const response = await request(app)
      .post('/notes')
      .send({
        title: 'Test Note',
        content: 'This is a test note.',
        author: { name: 'Test Author', email: 'test@example.com' },
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    noteId = response.body._id;
  });

  // Test for reading notes
  it('should read notes', async () => {
    const response = await request(app).get('/notes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test for updating a note
  it('should update a note', async () => {
    const response = await request(app)
      .put(`/notes/${noteId}`)
      .send({ title: 'Updated Title' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Title');
  });

  // Test for deleting a note
  it('should delete a note', async () => {
    const response = await request(app).delete(`/notes/${noteId}`);
    expect(response.status).toBe(204);
  });

  it('should return 400 when required fields are missing', async () => {
    const response = await request(app).post('/notes').send({
      title: 'Missing content and author',
    });
    expect(response.status).toBe(400);
  });

  it('should retrieve a specific note by ID', async () => {
    const create = await request(app).post('/notes').send({
      title: 'Get by ID',
      content: 'Content',
      author: { name: 'Author', email: 'a@example.com' },
    });

    const noteId = create.body._id;

    const response = await request(app).get(`/notes/${noteId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', noteId);
  });

  it('should return 404 when updating a nonexistent note', async () => {
    const response = await request(app)
      .put('/notes/000000000000000000000000')
      .send({ title: 'Nonexistent' });

    expect(response.status).toBe(404);
  });

  it('should return 404 when deleting a nonexistent note', async () => {
    const response = await request(app).delete('/notes/000000000000000000000000');
    expect(response.status).toBe(404);
  });

  it('should return paginated results', async () => {
    const response = await request(app).get('/notes?page=1&limit=5');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(5);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
