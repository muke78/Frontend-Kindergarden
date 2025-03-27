import { ReactNode } from "react";

interface ModalBodyProps {
  children: ReactNode;
}

export const ModalBody = ({ children }: ModalBodyProps) => {
  return <>{children}</>;
};
