// components/SectionDivider.tsx
import React from "react";

type DividerProps = {
  orientation?: "horizontal" | "vertical";
  thickness?: string; // e.g. "16px"
  className?: string;
};

const SectionDivider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  thickness = "48px",
  className = "",
}) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={`
        ${isHorizontal ? "w-full" : "h-full"}
        ${className}
      `}
      style={{
        backgroundImage: "url('/passa-africantenge.webp')",
        backgroundRepeat: "repeat",
        backgroundSize: "48px 48px",
        height: isHorizontal ? thickness : "100%",
        width: isHorizontal ? "100%" : thickness,
      }}
    />
  );
};

export default SectionDivider;