import React, { type ReactNode } from "react";

interface PageContainerProps {
    children: ReactNode;
}

const PaperFloating: React.FC<PageContainerProps> = ({ children }) => (
    <div className="w-full max-w-5xl p-6 bg-base-100 rounded-box shadow-lg">
        {children}
    </div>
);

export default PaperFloating;