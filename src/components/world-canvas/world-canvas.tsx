"use client";

import { useState, useTransition } from "react";
import { Rnd } from "react-rnd";
import type { WidgetType } from "@/generated/prisma/client";
import {
  addWidget,
  bringWidgetToFront,
  removeWidget,
  updateWidgetContent,
  updateWidgetLayout,
} from "@/lib/canvas-actions";
import {
  MapWidgetContent,
  NotesWidgetContent,
  PhotoWidgetContent,
  TextWidgetContent,
} from "./widget-content";

export type CanvasWidget = {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  content: Record<string, string>;
};

const WIDGET_LABELS: Record<WidgetType, string> = {
  TEXT: "Text",
  NOTES: "Notes",
  PHOTO: "Photo",
  MAP: "Map",
};

function WidgetBody({
  widget,
  editable,
  onSave,
}: {
  widget: CanvasWidget;
  editable: boolean;
  onSave: (content: Record<string, string>) => void;
}) {
  switch (widget.type) {
    case "TEXT":
      return (
        <TextWidgetContent
          content={widget.content}
          editable={editable}
          onSave={onSave}
        />
      );
    case "NOTES":
      return (
        <NotesWidgetContent
          content={widget.content}
          editable={editable}
          onSave={onSave}
        />
      );
    case "PHOTO":
      return (
        <PhotoWidgetContent
          content={widget.content}
          editable={editable}
          onSave={onSave}
        />
      );
    case "MAP":
      return (
        <MapWidgetContent
          content={widget.content}
          editable={editable}
          onSave={onSave}
        />
      );
  }
}

export function WorldCanvas({
  worldId,
  initialWidgets,
  isOwner,
}: {
  worldId: string;
  initialWidgets: CanvasWidget[];
  isOwner: boolean;
}) {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [, startTransition] = useTransition();

  const canvasHeight = Math.max(
    560,
    ...widgets.map((w) => w.y + w.height + 48),
  );

  function handleAdd(type: WidgetType) {
    startTransition(async () => {
      const created = await addWidget(worldId, type);
      setWidgets((prev) => [
        ...prev,
        {
          id: created.id,
          type: created.type,
          x: created.x,
          y: created.y,
          width: created.width,
          height: created.height,
          zIndex: created.zIndex,
          content: created.content as Record<string, string>,
        },
      ]);
    });
  }

  function handleRemove(id: string) {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    startTransition(async () => {
      await removeWidget(id);
    });
  }

  function handleLayout(
    id: string,
    layout: { x: number; y: number; width: number; height: number },
  ) {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...layout } : w)),
    );
    startTransition(async () => {
      await updateWidgetLayout(id, layout);
    });
  }

  function handleContentSave(id: string, content: Record<string, string>) {
    startTransition(async () => {
      await updateWidgetContent(id, content);
    });
  }

  function handleFocus(id: string) {
    const top = Math.max(0, ...widgets.map((w) => w.zIndex)) + 1;
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: top } : w)),
    );
    startTransition(async () => {
      await bringWidgetToFront(id);
    });
  }

  const addButtons = (
    <div className="flex flex-wrap justify-center gap-2">
      {(Object.keys(WIDGET_LABELS) as WidgetType[]).map((type) => (
        <button
          key={type}
          onClick={() => handleAdd(type)}
          className="rounded-full border border-line bg-paper-raised px-4 py-1.5 text-sm text-ink-muted transition-colors hover:border-accent hover:text-ink"
        >
          + {WIDGET_LABELS[type]}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-4">
      {isOwner && widgets.length > 0 && (
        <div className="mx-auto w-full max-w-5xl px-6">{addButtons}</div>
      )}

      <div className="mx-auto w-full max-w-5xl flex-1 px-6 pb-24">
        <div
          className={
            widgets.length === 0
              ? "relative w-full rounded-2xl border border-dashed border-line bg-paper-raised/20"
              : "relative w-full rounded-2xl border border-line bg-paper-raised/40"
          }
          style={{ height: canvasHeight }}
        >
          {widgets.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <p className="text-ink-muted">
                {isOwner
                  ? "Tell the story behind your places."
                  : "This world is just getting started."}
              </p>
              {isOwner && addButtons}
            </div>
          )}

          {widgets.map((widget) =>
            isOwner ? (
              <Rnd
                key={widget.id}
                bounds="parent"
                size={{ width: widget.width, height: widget.height }}
                position={{ x: widget.x, y: widget.y }}
                style={{ zIndex: widget.zIndex }}
                minWidth={180}
                minHeight={120}
                dragHandleClassName="widget-drag-handle"
                onDragStart={() => handleFocus(widget.id)}
                onDragStop={(_e, d) =>
                  handleLayout(widget.id, {
                    x: d.x,
                    y: d.y,
                    width: widget.width,
                    height: widget.height,
                  })
                }
                onResizeStop={(_e, _dir, ref, _delta, position) =>
                  handleLayout(widget.id, {
                    x: position.x,
                    y: position.y,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  })
                }
              >
                <div className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-paper-raised shadow-sm">
                  <div className="widget-drag-handle flex cursor-grab items-center justify-between border-b border-line px-3 py-1.5 active:cursor-grabbing">
                    <span className="text-[10px] uppercase tracking-wide text-ink-muted">
                      {WIDGET_LABELS[widget.type]}
                    </span>
                    <button
                      onClick={() => handleRemove(widget.id)}
                      className="text-ink-muted opacity-0 transition-opacity hover:text-accent-strong group-hover:opacity-100"
                      aria-label="Remove widget"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 p-3">
                    <WidgetBody
                      widget={widget}
                      editable
                      onSave={(content) =>
                        handleContentSave(widget.id, content)
                      }
                    />
                  </div>
                </div>
              </Rnd>
            ) : (
              <div
                key={widget.id}
                className="absolute overflow-hidden rounded-xl border border-line bg-paper-raised p-3 shadow-sm"
                style={{
                  left: widget.x,
                  top: widget.y,
                  width: widget.width,
                  height: widget.height,
                  zIndex: widget.zIndex,
                }}
              >
                <WidgetBody
                  widget={widget}
                  editable={false}
                  onSave={() => {}}
                />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
