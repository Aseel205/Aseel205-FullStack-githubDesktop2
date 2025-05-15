import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import axios from 'axios';

const NOTES_URL = 'http://localhost:3001/notes';

export type Note = {
  _id: string;
  title: string;
  author: { name: string; email: string };
  content: string;
};

type State = {
  notes: Note[];
  totalCount: number;
  page: number;
};

type Action =
  | { type: 'LOAD_PAGE'; payload: { notes: Note[]; totalCount: number; page: number } }
  | { type: 'CREATE'; payload: Note }
  | { type: 'UPDATE'; payload: Note }
  | { type: 'DELETE'; payload: string }
  | { type: 'SET_PAGE'; payload: number };

const initialState: State = {
  notes: [],
  totalCount: 0,
  page: 1,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_PAGE':
      return {
        notes: action.payload.notes,
        totalCount: action.payload.totalCount,
        page: action.payload.page,
      };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'CREATE':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        totalCount: state.totalCount + 1,
      };
    case 'UPDATE':
      console.log('we are in the update');
      return {
        ...state,
        notes: state.notes.map(n => (n._id === action.payload._id ? action.payload : n)),
      };
    case 'DELETE':
      return {
        ...state,
        notes: state.notes.filter(n => n._id !== action.payload),
        totalCount: state.totalCount - 1,
      };
    default:
      return state;
  }
}

const NotesContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export function NotesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <NotesContext.Provider value={{ state, dispatch }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}

// 🔁 Retry helper
async function retryFetch(fn: () => Promise<any>, retries = 5, delay = 500): Promise<any> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) {
      if (import.meta.env.MODE === 'development') {
        console.error('Backend not responding after retries:', err);
      }
      throw err;
    }
    await new Promise(res => setTimeout(res, delay));
    return retryFetch(fn, retries - 1, delay);
  }
}

/**
 * Fetch a single page of notes plus the total count (full list length).
 */
export async function fetchNotesPage(page: number, perPage = 10) {
  const start = (page - 1) * perPage;

  return retryFetch(async () => {
    // First try the modern backend with _page/_per_page and expect header
    try {
      const res = await axios.get(NOTES_URL, {
        params: { _page: page, _per_page: perPage },
      });

      const totalCountHeader = res.headers['x-total-count'];
      if (totalCountHeader !== undefined) {
        return {
          notes: res.data,
          totalCount: parseInt(totalCountHeader),
        };
      }
    } catch (err) {
      if (import.meta.env.MODE === 'development') {
        console.debug('Modern fetch failed, falling back to json-server logic');
      }
    }

    // Fallback to json-server style
    const [pageRes, countRes] = await Promise.all([
      axios.get(NOTES_URL, { params: { _start: start, _limit: perPage } }),
      axios.get(NOTES_URL),
    ]);

    const notesWithUnderscoreId = pageRes.data.map((note: any) => ({
      ...note,
      _id: note.id,
    }));

    return {
      notes: notesWithUnderscoreId,
      totalCount: countRes.data.length,
    };
  });
} 