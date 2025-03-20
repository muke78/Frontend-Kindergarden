import { v } from "../../styles/variables";

interface IconProps {
  name: keyof typeof v;
  size?: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size, className = "" }) => {
  const IconComponent = v[name];

  if (!IconComponent) return null;

  return <IconComponent className={`${size} ${className}`} />;
};
