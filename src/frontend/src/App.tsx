import { useState, useEffect } from 'react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { NotesModal } from './components/NotesModal';
import { DeleteAllConfirmDialog } from './components/DeleteAllConfirmDialog';
import { InlineNotice } from './components/InlineNotice';
import { createNote, deleteAllNotes, listNotes } from './lib/notesStorage';
import { Mic, FileText, Trash2, Square } from 'lucide-react';

function App() {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [notesVersion, setNotesVersion] = useState(0);
  const [notesCount, setNotesCount] = useState(0);

  const { transcript, isListening, isSupported, error, startListening, stopListening, getFinalTranscript, clearTranscript } = useSpeechRecognition();

  // Update notes count whenever notesVersion changes
  useEffect(() => {
    const notes = listNotes();
    setNotesCount(notes.length);
  }, [notesVersion]);

  const handleRecordClick = () => {
    if (isListening) {
      // Stop current recording
      stopListening();
      
      // Get final transcript and save if there's content
      const finalText = getFinalTranscript();
      if (finalText) {
        createNote(finalText);
        setNotesVersion(v => v + 1);
        setSuccessMessage('Note enregistrée avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
      
      // Clear transcript state completely before restarting
      clearTranscript();
      
      // Restart listening immediately for next note
      // Use a small delay to ensure the previous session is fully stopped
      setTimeout(() => {
        startListening();
      }, 150);
    } else {
      startListening();
    }
  };

  const handleDeleteAll = () => {
    deleteAllNotes();
    setNotesVersion(v => v + 1);
    setShowDeleteDialog(false);
    setSuccessMessage('Toutes les notes ont été supprimées');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleNoteDeleted = () => {
    setNotesVersion(v => v + 1);
  };

  const handleNoteUpdated = () => {
    setNotesVersion(v => v + 1);
  };

  return (
    <div className="app-container">
      <div className="app-frame">
        {/* Note Counter */}
        <div className="note-counter-section">
          <div className="note-counter">
            <span className="note-counter-icon">📝</span>
            <span className="note-counter-text">
              {notesCount} {notesCount === 1 ? 'note enregistrée' : 'notes enregistrées'}
            </span>
          </div>
        </div>

        {/* Transcription Area - Expanded */}
        <div className="transcription-section">
          <textarea
            className="transcription-textarea"
            value={transcript}
            readOnly
            placeholder="Votre transcription apparaîtra ici…"
            aria-label="Transcription text area"
          />
        </div>

        {/* Error Message */}
        {error && <InlineNotice message={error} variant="error" />}

        {/* Success Message */}
        {successMessage && <InlineNotice message={successMessage} variant="success" />}

        {/* Action Buttons - Three Prominent Blue Rectangular Buttons */}
        <div className="actions-section">
          <button
            className={`blue-rect-button ${isListening ? 'recording' : ''}`}
            onClick={handleRecordClick}
            disabled={!isSupported}
            aria-label={isListening ? 'Arrêter l\'enregistrement' : 'Enregistrer mes notes'}
          >
            {isListening ? (
              <>
                <Square className="button-icon" size={24} />
                <span className="button-text">Arrêter l'enregistrement</span>
              </>
            ) : (
              <>
                <Mic className="button-icon" size={24} />
                <span className="button-text">Enregistrer mes notes</span>
              </>
            )}
          </button>

          <button
            className="blue-rect-button blue-rect-button-secondary"
            onClick={() => setShowNotesModal(true)}
            aria-label="Voir mes notes"
          >
            <FileText className="button-icon" size={24} />
            <span className="button-text">Voir mes notes</span>
          </button>

          <button
            className="blue-rect-button blue-rect-button-tertiary"
            onClick={() => setShowDeleteDialog(true)}
            aria-label="Effacer mes notes"
          >
            <Trash2 className="button-icon" size={24} />
            <span className="button-text">Effacer mes notes</span>
          </button>
        </div>

        {/* Footer - Compact with VocalNoteOne and Orange Mic */}
        <footer className="footer-section">
          <div className="footer-content">
            <div className="footer-text">VocalNoteOne</div>
            <div className="footer-mic-badge">
              <span className="footer-mic-icon">🎤</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      {showNotesModal && (
        <NotesModal
          onClose={() => setShowNotesModal(false)}
          onNoteDeleted={handleNoteDeleted}
          onNoteUpdated={handleNoteUpdated}
          notesVersion={notesVersion}
        />
      )}

      {showDeleteDialog && (
        <DeleteAllConfirmDialog
          onConfirm={handleDeleteAll}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
}

export default App;
