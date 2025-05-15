import { Icon } from "@/components/ui/Icon";

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
        <Icon name="iconoCerrar" size="text-xl" />
        Cerrar
      </button>
      {onSave && (
        <button className="btn btn-info" onClick={onSave}>
          <Icon name="iconoGuardar" size="text-xl" />
          {saveButtonText}
        </button>
      )}
    </div>
  );
};
