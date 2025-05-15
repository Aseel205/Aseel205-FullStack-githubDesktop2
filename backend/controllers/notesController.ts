import { RequestHandler } from 'express';
import * as notesService from '../services/notesService';
import { formatNote } from '../utils/formatNode';




export const getNoteCountOnly: RequestHandler = async (_req, res, next) => {
  try {
    const count = await notesService.getTotalNotesCount();
    res.setHeader('X-Total-Count', count.toString());
    res.status(204).send(); // No content, but includes the header
  } catch (error) {
    next(error);
  }
};



export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query._page as string, 10) || 1 ; // Default to page 1
    const perPage = parseInt(req.query._per_page as string, 10)     ; // Default to 10 notes per page

    const notes = await notesService.getNotes(page, perPage, { _id: -1 });
    const totalCount = await notesService.getTotalNotesCount();

    const formattedNotes = notes.map(formatNote);
    res.setHeader('X-Total-Count', totalCount.toString());
    res.status(200).json(formattedNotes);
  } catch (error) {
    next(error);
  }
}; 



export const getNoteById: RequestHandler = async (req, res, next) => {
  try {
    const note = await notesService.getNoteById(req.params.id);
    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    res.status(200).json(formatNote(note));
  } catch (error) {
    next(error);
  }
};

export const createNote: RequestHandler = async (req, res, next) => {
  try {
    const { title, author, content } = req.body;
    if (!title || !author || !content) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const note = await notesService.createNote({ title, author, content });
    res.status(201).json(formatNote(note));
  } catch (error) {
    next(error);
  }
};

export const updateNote: RequestHandler = async (req, res, next) => {
  try {
    const updated = await notesService.updateNote(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    res.status(200).json(formatNote(updated));
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  try {
    const success = await notesService.deleteNote(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getNoteByIndex: RequestHandler = async (req, res, next) => {
  try {
    const index = parseInt(req.params.i, 10);
    const note = await notesService.getNoteByIndex(index);
    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    res.status(200).json(formatNote(note));
  } catch (error) {
    next(error);
  }
};

export const updateNoteByIndex: RequestHandler = async (req, res, next) => {
  try {
    const index = parseInt(req.params.i, 10);
    const updated = await notesService.updateNoteByIndex(index, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    res.status(200).json(formatNote(updated));
  } catch (error) {
    next(error);
  }
};

export const deleteNoteByIndex: RequestHandler = async (req, res, next) => {
  try {
    const index = parseInt(req.params.i, 10);
    const success = await notesService.deleteNoteByIndex(index);
    if (!success) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


