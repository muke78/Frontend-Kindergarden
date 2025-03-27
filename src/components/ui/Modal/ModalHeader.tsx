interface ModalHeaderProps {
  title: string;
}
export const ModalHeader = ({ title }: ModalHeaderProps) => {
  return (
    <div className="border-b border-white/40 p-2">
      <span className="text-3xl font-bold">{title}</span>
    </div>
  );
};
