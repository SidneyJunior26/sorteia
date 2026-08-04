"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EditableTitleProps {
  value: string;
  onSave: (next: string) => Promise<string | null>;
  className?: string;
  inputClassName?: string;
  maxLength?: number;
  /** Screen-reader name for the pencil, e.g. "Renomear prateleira". */
  editLabel: string;
  as?: "h1" | "h2" | "h3";
}

/**
 * Click-to-edit heading, shared by the library title and each shelf name.
 * `onSave` resolves to an error message, or null when it worked.
 */
export default function EditableTitle({
  value,
  onSave,
  className,
  inputClassName,
  maxLength = 60,
  editLabel,
  as: Heading = "h2",
}: EditableTitleProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  // Keep the draft in step when the value changes underneath us (another
  // tab, or an optimistic update being rolled back).
  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  function cancel() {
    setDraft(value);
    setError(null);
    setEditing(false);
  }

  async function commit() {
    const next = draft.trim();

    if (!next || next === value) {
      cancel();
      return;
    }

    setSaving(true);
    const message = await onSave(next);
    setSaving(false);

    if (message) {
      setError(message);
      return;
    }

    setError(null);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-1.5 min-w-0">
        <Heading className={cn("truncate", className)}>{value}</Heading>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 text-muted-foreground opacity-60 hover:opacity-100"
          onClick={() => setEditing(true)}
          aria-label={editLabel}
        >
          <Pencil className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <Input
          ref={inputRef}
          value={draft}
          maxLength={maxLength}
          disabled={saving}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void commit();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              cancel();
            }
          }}
          className={cn("h-8", inputClassName)}
          aria-label={editLabel}
          aria-invalid={Boolean(error)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={() => void commit()}
          disabled={saving}
          aria-label="Salvar"
        >
          <Check className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={cancel}
          disabled={saving}
          aria-label="Cancelar"
        >
          <X className="size-4" />
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
