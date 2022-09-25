import { motion } from "framer-motion";
import { ReactElement } from "react";
interface SeparatorProps {
  char: string;
  children?: ReactElement;
  className?: string;
}

export function Separator({
  char = ":",
  children,
  className = "separator",
  ...props
}: Partial<SeparatorProps>): ReactElement<SeparatorProps> {
  return (
    <motion.span className={className} {...props}>
      {children ? children : ` ${char} `}
    </motion.span>
  );
}
