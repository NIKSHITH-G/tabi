"use client";

import { useState } from "react";

type ContentProps = {
  content: Record<string, string>;
  editable: boolean;
  onSave: (content: Record<string, string>) => void;
};

export function TextWidgetContent({ content, editable, onSave }: ContentProps) {
  const [text, setText] = useState(content.text ?? "");

  if (!editable) {
    return (
      <p className="whitespace-pre-wrap font-display text-lg leading-snug">
        {text || "…"}
      </p>
    );
  }

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onSave({ text })}
      placeholder="Write something…"
      className="h-full w-full resize-none bg-transparent font-display text-lg leading-snug outline-none placeholder:text-ink-muted/50"
    />
  );
}

export function NotesWidgetContent({ content, editable, onSave }: ContentProps) {
  const [text, setText] = useState(content.text ?? "");

  if (!editable) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed">
        {text || "…"}
      </p>
    );
  }

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onSave({ text })}
      placeholder={"Grocery list\n\nMilk\nEggs\nCoffee"}
      className="h-full w-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-ink-muted/50"
    />
  );
}

export function PhotoWidgetContent({ content, editable, onSave }: ContentProps) {
  const [imageUrl, setImageUrl] = useState(content.imageUrl ?? "");
  const [caption, setCaption] = useState(content.caption ?? "");

  if (!editable) {
    return imageUrl ? (
      <div className="flex h-full flex-col gap-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={caption || "Photo"}
          className="min-h-0 flex-1 rounded-lg object-cover"
        />
        {caption && <p className="text-xs text-ink-muted">{caption}</p>}
      </div>
    ) : (
      <div className="flex h-full items-center justify-center text-sm text-ink-muted">
        No photo yet
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={caption || "Photo"}
          className="min-h-0 flex-1 rounded-lg object-cover"
        />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-line text-xs text-ink-muted">
          Paste an image URL below
        </div>
      )}
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        onBlur={() => onSave({ imageUrl, caption })}
        placeholder="Image URL"
        className="w-full bg-transparent text-xs outline-none placeholder:text-ink-muted/50"
      />
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        onBlur={() => onSave({ imageUrl, caption })}
        placeholder="Caption"
        className="w-full bg-transparent text-xs text-ink-muted outline-none placeholder:text-ink-muted/50"
      />
    </div>
  );
}

export function MapWidgetContent({ content, editable, onSave }: ContentProps) {
  const [label, setLabel] = useState(content.label ?? "");

  return (
    <div className="flex h-full flex-col gap-2">
      <div
        className="flex-1 rounded-lg opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, var(--color-moss) 0%, transparent 45%), radial-gradient(circle at 70% 60%, var(--color-accent) 0%, transparent 40%)",
          backgroundColor: "var(--color-line)",
        }}
      />
      {editable ? (
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={() => onSave({ label })}
          placeholder="Where is this?"
          className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-ink-muted/50"
        />
      ) : (
        <p className="text-sm font-medium">{label || "Somewhere"}</p>
      )}
    </div>
  );
}
