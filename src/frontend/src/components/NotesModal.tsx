import { useState, useEffect } from 'react';
import { X, Edit2, Check, XCircle } from 'lucide-react';
import { listNotes, deleteNote, updateNote } from '../lib/notesStorage';
import { Note } from '../types/notes';

interface NotesModalProps {
  onClose: () => void;
  onNoteDeleted: () => void;
  onNoteUpdated: () => void;
  notesVersion: number;
}

export function NotesModal({ onClose, onNoteDeleted, onNoteUpdated, notesVersion }: NotesModalProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    setNotes(listNotes());
  }, [notesVersion]);

  const handleDeleteNote = (id: number) => {
    deleteNote(id);
    setNotes(listNotes());
    setDeleteConfirmId(null);
    onNoteDeleted();
  };

  const handleStartEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: number) => {
    const trimmedContent = editContent.trim();
    if (trimmedContent) {
      updateNote(id, trimmedContent);
      setNotes(listNotes());
      onNoteUpdated();
    }
    setEditingId(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
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
                  {editingId === note.id ? (
                    <div className="note-edit-container">
                      <textarea
                        className="note-edit-textarea"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        autoFocus
                        rows={4}
                        aria-label="Edit note content"
                      />
                      <div className="note-edit-actions">
                        <button
                          className="note-edit-save"
                          onClick={() => handleSaveEdit(note.id)}
                          aria-label="Save changes"
                        >
                          <Check size={16} />
                          <span>Save</span>
                        </button>
                        <button
                          className="note-edit-cancel"
                          onClick={handleCancelEdit}
                          aria-label="Cancel editing"
                        >
                          <XCircle size={16} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="note-content" onClick={() => handleStartEdit(note)}>
                        {note.content}
                      </div>
                      <div className="note-footer">
                        <span className="note-date">{formatDate(note.created_at)}</span>
                        <div className="note-actions">
                          <button
                            className="note-edit-btn"
                            onClick={() => handleStartEdit(note)}
                            aria-label="Edit note"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="note-delete-btn"
                            onClick={() => setDeleteConfirmId(note.id)}
                            aria-label="Delete note"
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    </>
                  )}

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
