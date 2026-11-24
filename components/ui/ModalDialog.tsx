"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

/**
 * Native <dialog> modal following modern-web-guidance:
 * - Uses showModal() for native top-layer, inert backdrop, focus containment & Esc handling
 * - Uses overscroll-behavior: contain on dialog:modal & ::backdrop (in globals.css)
 * - No redundant role="dialog" or aria-modal, no body overflow locking
 * - Supports closedby="any" with pointerdown/pointerup fallback for Safari
 */
export function ModalDialog({
  open,
  onClose,
  titleId,
  maxWidthClass = "max-w-4xl",
  children,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = "";
      onClose();
    };

    dialog.addEventListener("close", handleClose);

    // Light-dismiss fallback when closedBy is unsupported (e.g. Safari)
    let pressedOutside = false;
    const isOutside = (e: PointerEvent) => {
      const rect = dialog.getBoundingClientRect();
      return (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );
    };

    const handlePointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const handlePointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    const supportsClosedBy = "closedBy" in HTMLDialogElement.prototype;
    if (!supportsClosedBy) {
      dialog.addEventListener("pointerdown", handlePointerDown);
      dialog.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      if (!supportsClosedBy) {
        dialog.removeEventListener("pointerdown", handlePointerDown);
        dialog.removeEventListener("pointerup", handlePointerUp);
      }
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      closedby="any"
      className={`flips-dialog ${maxWidthClass}`}
    >
      <div className="relative w-full max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-[#141414] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close modal"
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/75 text-white border border-white/15 hover:bg-[#E50914] hover:border-[#E50914] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E50914]"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
