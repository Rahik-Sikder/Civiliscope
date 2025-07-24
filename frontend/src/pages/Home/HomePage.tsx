import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import PaperFloating from "../../components/layout/PageContainer";

export default function HomePage() {
  return (
    <MainLayout>
      <PaperFloating>
        <div className="my-8 prose">
          <h1>
            Welcome to <span className="text-secondary">Civiliscope</span>
          </h1>
          <p>Explore the US Congress, one seat at a time.</p>
        </div>
      </PaperFloating>
    </MainLayout>
  );
}
