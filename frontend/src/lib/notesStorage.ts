import { Note } from '../types/notes';

const STORAGE_KEY = 'vocalnote_notes';

function getStoredNotes(): Note[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load notes:', e);
    return [];
  }
}

function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes:', e);
  }
}

export function createNote(content: string): Note {
  const notes = getStoredNotes();
  const newNote: Note = {
    id: Date.now(),
    content: content.trim(),
    created_at: new Date().toISOString()
  };
  notes.unshift(newNote); // Add to beginning
  saveNotes(notes);
  return newNote;
}

export function listNotes(): Note[] {
  const notes = getStoredNotes();
  // Return latest 100 notes
  return notes.slice(0, 100);
}

export function deleteNote(id: number): void {
  const notes = getStoredNotes();
  const filtered = notes.filter(note => note.id !== id);
  saveNotes(filtered);
}

export function updateNote(id: number, newContent: string): Note | null {
  const notes = getStoredNotes();
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) {
    console.error('Note not found:', id);
    return null;
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    content: newContent.trim()
  };
  
  saveNotes(notes);
  return notes[noteIndex];
}

export function deleteAllNotes(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to delete notes:', e);
  }
}
