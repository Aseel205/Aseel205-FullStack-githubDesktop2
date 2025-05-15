// src/components/NotesList.tsx
import axios from 'axios';
import { useNotes, Note } from '../contexts/NotesContext';
import './Component.css';
import './NotesList.css';

type Props = { onEdit: (note: Note) => void };

export default function NotesList({ onEdit }: Props) {
  const {
    state: { notes },
    dispatch,
  } = useNotes();

  const handleDelete = async (_id: string) => {

    console.log(_id) ; 

    if (confirm('Delete this note?')) {
      await axios.delete(`http://localhost:3001/notes/${_id}`);
      dispatch({ type: 'DELETE', payload: _id });
    }
  };
  return (
    <div>
    {notes.map((n) => (
      <div key={n._id} className="card note">
        <h2>{n.title}</h2>
        <small>By {n.author.name}</small>+
        <p>{n.content}</p>
        <button onClick={() => onEdit(n)}>Edit</button>
        <button onClick={() => handleDelete(n._id)}>Delete</button>
      </div>
    ))}
  </div>
  );
}