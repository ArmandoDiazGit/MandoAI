import "./skeletonStyle.css"


type SkeletonVariant = "text" | "circular" | "rectangular" | "card";

type SkeletonLoadingProps = {
  variant?: SkeletonVariant;
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  borderRadius?: React.CSSProperties["borderRadius"];
  className?: string;
  style?: React.CSSProperties;
};

export default function SkeletonLoading({
  variant = "text",
  width,
  height,
  borderRadius,
  className = "",
  style = {},
}: SkeletonLoadingProps) {
  const classes = ["skeleton", `skeleton--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  const inlineStyle: React.CSSProperties = {
    ...style,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(borderRadius !== undefined ? { borderRadius } : {}),
  };

  return <div className={classes} style={inlineStyle} aria-hidden="true" />;
}
