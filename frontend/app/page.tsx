"use client";

import { useState } from "react";
import { useDataset } from "@/hooks/useDataset";
import { useSettings } from "@/hooks/useSettings";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { UploadZone } from "@/components/upload/UploadZone";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { AnalyticsTabs } from "@/components/analytics/AnalyticsTabs";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Button } from "@/components/ui/button";
import { Settings, MessageSquare } from "lucide-react";

export default function Home() {
  const { dataset, isLoading: uploadLoading, error: uploadError, upload, clearDataset } = useDataset();
  const settings = useSettings();
  const [chatOpen, setChatOpen] = useState(false);

  const handleUpload = async (file: File) => {
    clearDataset();
    setChatOpen(false);
    await upload(file);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-3 border-b bg-background shrink-0">
        <h1 className="text-lg font-semibold">AI Data Analyst</h1>
        <div className="flex items-center gap-2">
          {dataset && (
            <Button variant="outline" size="sm" onClick={() => setChatOpen(!chatOpen)} className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={settings.open} className="relative">
            <Settings className="h-5 w-5" />
            {!settings.settings?.api_key && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {!dataset ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <UploadZone onUpload={handleUpload} isLoading={uploadLoading} error={uploadError} />
          </div>
        ) : (
          <>
            <Sidebar dataset={dataset} onUploadNew={handleUpload} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-auto p-6">
                <AnalyticsTabs />
              </div>
              {chatOpen && (
                <div className="border-t shrink-0" style={{ height: "40%" }}>
                  <ChatPanel settings={settings.settings} />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <SettingsModal open={settings.isOpen} onClose={settings.close} onSave={settings.save} settings={settings.settings} />
    </div>
  );
}
