import React, { useState, useEffect } from 'react';import axios from 'axios';
import { useNotes, Note } from '../contexts/NotesContext';
import './NoteForm.css';


type Props = { editingNote?: Note; onClose?: () => void };

export default function NoteForm({ editingNote, onClose }: Props) {
  const { dispatch } = useNotes();
  const isEdit = Boolean(editingNote);

  const [title, setTitle] = useState(editingNote?.title || '');
  const [author, setAuthor] = useState(editingNote?.author.name || '');
  const [email, setEmail] = useState(editingNote?.author.email || '');
  const [content, setContent] = useState(editingNote?.content || '');




    // whenever editingNote changes, re-init form fields
    useEffect(() => {
      if (editingNote) {
        setTitle(editingNote.title);
        setAuthor(editingNote.author.name);
        setEmail(editingNote.author.email);
        setContent(editingNote.content);
      } else {
        // if switching back to “new note” mode
        setTitle('');
        setAuthor('');
        setEmail('');
        setContent('');
      }
    }, [editingNote]);




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, author: { name: author, email }, content };

    try {
      if (isEdit && editingNote) {
        const res = await axios.put<Note>(
          `http://localhost:3001/notes/${editingNote._id}`,
          payload
        );
        dispatch({ type: 'UPDATE', payload: res.data });
        onClose?.();
      } else {
        const res = await axios.post<Note>('http://localhost:3001/notes', payload);
        dispatch({ type: 'CREATE', payload: res.data });
      }
      // reset form only if creating
      if (!isEdit) {
        setTitle('');
        setAuthor('');
        setEmail('');
        setContent('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card form-card">
    <form onSubmit={handleSubmit} style={{ marginBottom: 20, border: '1px solid #ddd', padding: 10 }}>
      <h3>{isEdit ? 'Edit Note' : 'New Note'}</h3>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        value={author}
        onChange={e => setAuthor(e.target.value)}
        placeholder="Author Name"
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Author Email"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <button type="submit">{isEdit ? 'Save' : 'Create'}</button>
      {isEdit && <button onClick={onClose}>Cancel</button>}
    </form>
    </div>

  );
}