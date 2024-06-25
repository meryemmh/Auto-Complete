import React from 'react';

interface ArrowDropDownIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

const ArrowDropDownIcon: React.FC<ArrowDropDownIconProps> = ({
  width = 24,
  height = 24,
  color = "#000",
  className,
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 24 24"
      className={className}
      onClick={onClick}
    >
      <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 13l-2.5-2h5L12 13z" />
    </svg>
  );
};

export default ArrowDropDownIcon;
