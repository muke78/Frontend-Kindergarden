import { ReactNode } from "react";

import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";

interface ModalProps {
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSave?: () => void;
  saveButtonText?: string;
}

export const Modal = ({
  onClose,
  title,
  children,
  onSave,
  saveButtonText,
}: ModalProps) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <ModalHeader title={title} />
        <ModalBody>{children}</ModalBody>
        <ModalFooter
          onClose={onClose}
          onSave={onSave}
          saveButtonText={saveButtonText}
        />
      </div>
    </div>
  );
};
