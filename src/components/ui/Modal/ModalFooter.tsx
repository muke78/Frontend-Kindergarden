interface ModalFooterProps {
  onClose: () => void;
  onSave?: () => void;
  saveButtonText?: string;
}

export const ModalFooter = ({
  onClose,
  onSave,
  saveButtonText,
}: ModalFooterProps) => {
  return (
    <div className="modal-action">
      <button className="btn" onClick={onClose}>
        Cerrar
      </button>
      {onSave && (
        <button className="btn btn-info" onClick={onSave}>
          {saveButtonText}
        </button>
      )}
    </div>
  );
};
