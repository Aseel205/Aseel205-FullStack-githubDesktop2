import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNoteByIndex,
  updateNoteByIndex,
  deleteNoteByIndex,
  getNoteCountOnly 
} from '../controllers/notesController';
import Note from '../models/noteModel';

const router = express.Router();

// 🔥 TEMPORARY ROUTE TO DELETE ALL NOTES
router.delete('/', async (req, res) => {
  try {
    await Note.deleteMany({});
    res.status(200).json({ message: 'All notes deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete all notes' });
  }
});


// By MongoDB _id
router.get('/count', getNoteCountOnly);
router.get('/', getNotes); // ?_page=&_per_page=
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

// By array index
router.get('/by-index/:i', getNoteByIndex);
router.put('/by-index/:i', updateNoteByIndex);
router.delete('/by-index/:i', deleteNoteByIndex);


export default router;
