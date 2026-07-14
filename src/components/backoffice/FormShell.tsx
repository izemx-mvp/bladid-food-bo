import type { ReactNode } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  width?: "md" | "lg" | "xl";
};

const widths = { md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-3xl" };

export function FormShell({ title, subtitle, icon, children, onSubmit, onCancel, submitLabel = "Enregistrer", width = "lg" }: Props) {
  return (
    <DialogContent className={`${widths[width]} glass border-primary/20 p-0 overflow-hidden`}>
      <div className="relative">
        <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
        <DialogHeader className="relative px-8 pt-8 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-11 w-11 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shadow-inner">
              {icon ?? <Sparkles className="h-5 w-5" />}
            </div>
            <div>
              <DialogTitle className="font-display text-2xl leading-tight">{title}</DialogTitle>
              {subtitle && <DialogDescription className="text-xs text-muted-foreground mt-0.5">{subtitle}</DialogDescription>}
            </div>
          </div>
        </DialogHeader>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="px-8 py-6 space-y-5 max-h-[65vh] overflow-y-auto">{children}</div>
        <DialogFooter className="px-8 py-4 border-t border-border/40 bg-secondary/30">
          {onCancel && (
            <Button type="button" variant="ghost" className="rounded-full" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" className="rounded-full bg-primary text-primary-foreground hover:opacity-90 px-6">
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-2">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}
