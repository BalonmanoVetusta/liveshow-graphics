import { PropsWithChildren, ReactElement, useId } from "react";
import { StyledSvg, StyledSvgProps } from "./StyledSvg";

export interface SvgProps extends PropsWithChildren, StyledSvgProps {
  children: ReactElement;
  title: string;
  description?: string;
  titleId?: string;
  descriptionId?: string;
  id?: string;
  xmlns?: string;
  xmlnsXlink?: string;
  role?: string;
  preserveAspectRatio?: string;
  viewBox?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: any; // Could not find a type definition for this, please issue if you know 😰
}

// Shadow Value must be full css property and value:
// filter: drop-shadow(5px 5px 3px var(${cssVariablePrefix}-shadow, rgba(0, 0, 0, 0.8)));
export function Svg({
  children,
  title,
  description = undefined,
  titleId = undefined,
  descriptionId = undefined,
  ...props
}: SvgProps): ReactElement {
  // fillValue = "transparent",
  // strokeValue = undefined,
  // shadowValue = undefined,
  // fillDarkModeValue = "transparent",
  // strokeDarkModeValue = undefined,
  // shadowDarkModeValue = undefined,
  // ids & default css variable name

  // Svg Id
  const generatedId = useId();
  props.id ??= generatedId;
  description ??= title;

  // Default values for of SVG files
  props.xmlns = props.xmlns || "http://www.w3.org/2000/svg";
  props.xmlnsXlink = props.xmlnsXlink || "http://www.w3.org/1999/xlink";
  props.role = props.role || "img";
  props.preserveAspectRatio = props.preserveAspectRatio || "xMidYMid meet";

  // Title and description
  titleId = titleId || `${props.id}-title`;
  descriptionId = descriptionId || `${props.id}-description`;
  if (!props["aria-labelledby"] && (title || description)) {
    const labelledby =
      (title ? titleId : "") + (description ? ` ${descriptionId}` : "");
    props["aria-labelledby"] = props["aria-labelledby"] || labelledby;
  }

  return (
    <StyledSvg {...props}>
      <title id={titleId}>{title}</title>
      <desc id={descriptionId}>{description}</desc>
      {children}
    </StyledSvg>
  );
}
