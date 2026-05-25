"use client";

import { useState } from "react";
import { useDataset } from "@/hooks/useDataset";
import { useSettings } from "@/hooks/useSettings";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { UploadZone } from "@/components/upload/UploadZone";
import { DashboardNavbar, type DashboardSection } from "@/components/dashboard/DashboardNavbar";
import { DataPanel } from "@/components/dashboard/DataPanel";
import { SectionTransition } from "@/components/dashboard/SectionTransition";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { DataPreview } from "@/components/analytics/DataPreview";
import { DescriptiveStats } from "@/components/analytics/DescriptiveStats";
import { Visualizations } from "@/components/analytics/Visualizations";
import { DataOperations } from "@/components/analytics/DataOperations";
import { EdaTabs } from "@/components/eda/EdaTabs";

export default function AppPage() {
  const { dataset, isLoading: uploadLoading, error: uploadError, upload, clearDataset } = useDataset();
  const settings = useSettings();
  const [activeSection, setActiveSection] = useState<DashboardSection>("preview");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatWidth, setChatWidth] = useState(380);

  const handleUpload = async (file: File) => {
    clearDataset();
    setChatOpen(false);
    await upload(file);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "preview":
        return <DataPreview />;
      case "stats":
        return <DescriptiveStats />;
      case "viz":
        return <Visualizations />;
      case "ops":
        return <DataOperations />;
      case "eda":
        return <EdaTabs />;
      default:
        return <DataPreview />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardNavbar
        active={activeSection}
        onNavigate={setActiveSection}
        onOpenSettings={settings.open}
        chatOpen={chatOpen}
        chatWidth={chatWidth}
      />

      <div className="flex flex-1 overflow-hidden pt-20">
        {!dataset ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <UploadZone onUpload={handleUpload} isLoading={uploadLoading} error={uploadError} />
          </div>
        ) : (
          <>
            <DataPanel dataset={dataset} onUploadNew={handleUpload} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-auto p-6">
                <SectionTransition sectionKey={activeSection}>
                  {renderSection()}
                </SectionTransition>
              </div>
            </div>
          </>
        )}
      </div>

      <ChatPanel
        settings={settings.settings}
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        onOpen={() => setChatOpen(true)}
        onWidthChange={setChatWidth}
      />

      <SettingsModal
        open={settings.isOpen}
        onClose={settings.close}
        onSave={settings.save}
        settings={settings.settings}
      />
    </div>
  );
}
