import React from "react";

import "./Chamber.css";
import PaperFloating from "../layout/PageContainer";
import { senatorDesks } from "./senatorDesks";


export default function SenateChamber() {
  return (
    <PaperFloating>
    <div className="relative h-[600px] bg-secondary">
      <div className="absolute inset-0 scale-[1.35] origin-top-left w-full h-full">
        {senatorDesks.map(({ id, left, top, rotation }) => (
          <button
            key={id}
            className="absolute btn btn-sm bg-primary text-primary-content shadow-md"
            style={{
              left,
              top,
              transform: `rotate(${rotation}deg)`,
              width: "4.5%", // relative to parent width
              height: "2.8%", // relative to parent height
              minWidth: "unset",
              minHeight: "unset",
              paddingLeft: "0.5vw",
              paddingRight: "0.5vw",
              paddingTop: "0.3vh",
              paddingBottom: "0.3vh",
            }}
          >
            <span className="senatorDeskButton_text">{id}</span>
          </button>
        ))}
      </div>
    </div>
    </PaperFloating>
  );
}
