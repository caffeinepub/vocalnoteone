import { useState } from 'react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { NotesModal } from './components/NotesModal';
import { DeleteAllConfirmDialog } from './components/DeleteAllConfirmDialog';
import { InlineNotice } from './components/InlineNotice';
import { createNote, deleteAllNotes } from './lib/notesStorage';

function App() {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [notesVersion, setNotesVersion] = useState(0);

  const { transcript, isListening, isSupported, error, startListening, stopListening, getFinalTranscript } = useSpeechRecognition();

  const handleRecordClick = () => {
    if (isListening) {
      stopListening();
      // Auto-save note if there's content (use final transcript only)
      const finalText = getFinalTranscript();
      if (finalText) {
        createNote(finalText);
        setNotesVersion(v => v + 1);
      }
    } else {
      startListening();
    }
  };

  const handleDeleteAll = () => {
    deleteAllNotes();
    setNotesVersion(v => v + 1);
    setShowDeleteDialog(false);
    setSuccessMessage('All notes have been deleted');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleNoteDeleted = () => {
    setNotesVersion(v => v + 1);
  };

  return (
    <div className="app-container">
      <div className="app-frame">
        {/* Transcription Area */}
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

        {/* Action Buttons */}
        <div className="actions-section">
          <button
            className={`action-button ${isListening ? 'recording' : ''}`}
            onClick={handleRecordClick}
            disabled={!isSupported}
            aria-label={isListening ? 'Arrêter l\'enregistrement' : 'Enregistrer mes notes'}
          >
            {isListening ? (
              <>
                <span className="button-emoji">⏹️</span>
                <span>Arrêter l'enregistrement</span>
              </>
            ) : (
              <>
                <span className="button-emoji">🎤</span>
                <span>Enregistrer mes notes</span>
              </>
            )}
          </button>

          <button
            className="action-button"
            onClick={() => setShowNotesModal(true)}
            aria-label="Voir mes notes"
          >
            <span className="button-emoji">📄</span>
            <span>Voir mes notes</span>
          </button>

          <button
            className="action-button"
            onClick={() => setShowDeleteDialog(true)}
            aria-label="Effacer mes notes"
          >
            <span className="button-emoji">🗑️</span>
            <span>Effacer mes notes</span>
          </button>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <div className="footer-content">
            <div className="app-name">VocalNoteOne</div>
            <div className="mic-circle">
              <span className="mic-emoji">🎤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showNotesModal && (
        <NotesModal
          onClose={() => setShowNotesModal(false)}
          onNoteDeleted={handleNoteDeleted}
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
