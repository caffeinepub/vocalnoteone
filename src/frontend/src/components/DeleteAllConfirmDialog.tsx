interface DeleteAllConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteAllConfirmDialog({ onConfirm, onCancel }: DeleteAllConfirmDialogProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-title">Delete ALL notes?</h3>
        <p className="confirm-message">This action is irreversible.</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-delete" onClick={onConfirm}>
            Delete all
          </button>
        </div>
      </div>
    </div>
  );
}
