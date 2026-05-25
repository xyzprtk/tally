"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { restoreDataset } from "@/lib/api";
import { GlidingPillNav } from "@/components/dashboard/GlidingPillNav";
import { SectionTransition } from "@/components/dashboard/SectionTransition";
import { ConfirmationDialog } from "@/components/dashboard/ConfirmationDialog";
import { toast } from "sonner";
import { DtypeManagement } from "./DtypeManagement";
import { MissingValues } from "./MissingValues";
import { OutlierDetection } from "./OutlierDetection";
import { Distribution } from "./Distribution";
import { ValueCounts } from "./ValueCounts";
import { DuplicateDetection } from "./DuplicateDetection";

const edaPills = [
  { key: "dtype", label: "Dtype" },
  { key: "missing", label: "Missing" },
  { key: "outliers", label: "Outliers" },
  { key: "distribution", label: "Distribution" },
  { key: "values", label: "Values" },
  { key: "duplicates", label: "Duplicates" },
];

export function EdaTabs() {
  const [activeTab, setActiveTab] = useState("dtype");
  const [restoreKey, setRestoreKey] = useState(0);
  const [restoring, setRestoring] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const handleRestore = useCallback(async () => {
    setRestoring(true);
    try {
      await restoreDataset();
      setRestoreKey((k) => k + 1);
      toast.success("Dataset restored to original state");
    } catch (e: any) {
      toast.error(e.message || "Restore failed");
    } finally {
      setRestoring(false);
      setShowRestoreConfirm(false);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dtype":
        return <DtypeManagement key={restoreKey} />;
      case "missing":
        return <MissingValues key={restoreKey} />;
      case "outliers":
        return <OutlierDetection key={restoreKey} />;
      case "distribution":
        return <Distribution key={restoreKey} />;
      case "values":
        return <ValueCounts key={restoreKey} />;
      case "duplicates":
        return <DuplicateDetection key={restoreKey} />;
      default:
        return null;
    }
  };

  return (
    <div key={restoreKey} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Exploratory Data Analysis</h2>
        <div className="flex items-center gap-3">
          <GlidingPillNav pills={edaPills} active={activeTab} onSelect={setActiveTab} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRestoreConfirm(true)}
            disabled={restoring}
            className="gap-2 shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
            Restore Original
          </Button>
        </div>
      </div>

      <SectionTransition sectionKey={activeTab}>
        {renderContent()}
      </SectionTransition>

      <ConfirmationDialog
        open={showRestoreConfirm}
        onClose={() => setShowRestoreConfirm(false)}
        onConfirm={handleRestore}
        title="Restore Original Dataset"
        description="This will undo all changes made to the dataset (dtype conversions, dropped columns, filled values, etc.). This action cannot be undone."
        confirmText="Restore"
        confirmVariant="destructive"
      />
    </div>
  );
}
