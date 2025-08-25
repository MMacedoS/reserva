import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmPopoverProps = {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  align?: "left" | "right";
  className?: string;
};

export function ConfirmPopover({
  open,
  loading = false,
  onCancel,
  onConfirm,
  title = "Excluir item?",
  description = "Esta ação não pode ser desfeita.",
  align = "right",
  className,
}: ConfirmPopoverProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 w-64 rounded-md border bg-background p-3 shadow-lg",
        align === "right" ? "right-0" : "left-0",
        className
      )}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="text-amber-500 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">{title}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Excluir"}
        </Button>
      </div>
    </div>
  );
}

export default ConfirmPopover;
