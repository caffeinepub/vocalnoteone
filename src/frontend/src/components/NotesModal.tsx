import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { listNotes, deleteNote } from '../lib/notesStorage';
import { Note } from '../types/notes';

interface NotesModalProps {
  onClose: () => void;
  onNoteDeleted: () => void;
  notesVersion: number;
}

export function NotesModal({ onClose, onNoteDeleted, notesVersion }: NotesModalProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    setNotes(listNotes());
  }, [notesVersion]);

  const handleDeleteNote = (id: number) => {
    deleteNote(id);
    setNotes(listNotes());
    setDeleteConfirmId(null);
    onNoteDeleted();
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">My notes</h2>
        </div>

        <div className="modal-body">
          {notes.length === 0 ? (
            <div className="empty-state">No notes yet. Start recording to create your first note!</div>
          ) : (
            <div className="notes-list">
              {notes.map((note) => (
                <div key={note.id} className="note-card">
                  <div className="note-content">{note.content}</div>
                  <div className="note-footer">
                    <span className="note-date">{formatDate(note.created_at)}</span>
                    <button
                      className="note-delete-btn"
                      onClick={() => setDeleteConfirmId(note.id)}
                      aria-label="Delete note"
                    >
                      ❌
                    </button>
                  </div>

                  {deleteConfirmId === note.id && (
                    <div className="delete-confirm-overlay">
                      <div className="delete-confirm-box">
                        <p>Delete this note?</p>
                        <div className="delete-confirm-actions">
                          <button
                            className="delete-confirm-cancel"
                            onClick={() => setDeleteConfirmId(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="delete-confirm-delete"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
