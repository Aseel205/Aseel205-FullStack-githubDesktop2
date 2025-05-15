// src/App.tsx
import { useEffect, useState } from 'react';
import { NotesProvider, useNotes, fetchNotesPage, Note } from './contexts/NotesContext';
import NotesList from './components/NotesList';
import Pagination from './components/Pagination';
import NoteForm from './components/NoteForm';
import './App.css';    // contains .app-container, .sidebar, .content

const POSTS_PER_PAGE = 10;

function InnerApp() {
  const {
    state: { page, totalCount },
    dispatch,
  } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotesPage(page, POSTS_PER_PAGE)
      .then(({ notes, totalCount }) =>
        dispatch({ type: 'LOAD_PAGE', payload: { notes, totalCount, page } })
      )
      .catch(console.error);
  }, [page, dispatch]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="app-container">
      {/* Sidebar: ONLY this form lives here */}
      <div className="sidebar">
        <div className="card form-card">
          <NoteForm
            editingNote={editingNote || undefined}
            onClose={() => setEditingNote(null)}
          />
        </div>
      </div>

      {/* Main content: no form here */}
      <div className="content">
        <NotesList onEdit={setEditingNote} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          setPage={(p) => dispatch({ type: 'SET_PAGE', payload: p })}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <NotesProvider>
      <InnerApp />
    </NotesProvider>
  );
}