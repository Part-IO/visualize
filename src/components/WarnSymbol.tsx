import { CSSProperties } from "react";

const WarnSymbol = ({
    style,
    size,
    color,
    onClick,
}: {
    style?: CSSProperties;
    size?: number;
    color?: string;
    onClick?: () => void;
}): JSX.Element => {
    return (
        <svg
            onClick={onClick}
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            color={color}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-alert-triangle"
            style={{
                cursor: "pointer",
                ...style,
            }}
        >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
};

export default WarnSymbol;
