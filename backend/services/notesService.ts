import NoteModel from '../models/noteModel';
import { SortOrder } from 'mongoose';  // Import SortOrder from Mongoose



export const getNotes = async (
  page: number,
  perPage: number,
  sort: Record<string, SortOrder> = { _id: 1 } // default: newest first
) => {
  const skip = (page - 1) * perPage;
  return NoteModel.find({})
    .sort(sort)
    .skip(skip)
    .limit(perPage)
    .exec();
};
export const getTotalNotesCount = async (): Promise<number> => {
  return await NoteModel.countDocuments();
};

export const getNoteById = async (id: string) => {
  return NoteModel.findById(id);
};

export const createNote = async (noteData: { title: string; author: string; content: string }) => {
  const newNote = new NoteModel(noteData);
  return newNote.save();
};

export const updateNote = async (id: string, updates: Partial<{ title: string; author: string; content: string }>) => {
  return NoteModel.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteNote = async (id: string) => {
  const result = await NoteModel.findByIdAndDelete(id);
  return result !== null;
};

export const getNoteByIndex = async (index: number) => {
  const notes = await NoteModel.find().skip(index).limit(1);
  return notes[0] || null;
};

export const updateNoteByIndex = async (index: number, updates: Partial<{ title: string; author: string; content: string }>) => {
  const notes = await NoteModel.find().skip(index).limit(1);
  if (!notes[0]) return null;
  return NoteModel.findByIdAndUpdate(notes[0]._id, updates, { new: true });
};

export const deleteNoteByIndex = async (index: number) => {
  const notes = await NoteModel.find().skip(index).limit(1);
  if (!notes[0]) return false;
  const result = await NoteModel.findByIdAndDelete(notes[0]._id);
  return result !== null;
};
