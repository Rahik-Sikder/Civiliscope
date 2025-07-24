import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import SenateChamber from "../../components/chambers/SenateChamber";
import PaperFloating from "../../components/layout/PageContainer";

export default function SenatePage() {
  return (
    <MainLayout>
        <PaperFloating>
        <div className="prose">
          <h2>Senate Visualization Coming Soon</h2>
        </div>
        </PaperFloating>

        <SenateChamber />

        <PaperFloating>
        <div className="prose">
          <p>bottom text</p>
        </div>
        </PaperFloating>
    
    </MainLayout>
  );
}
