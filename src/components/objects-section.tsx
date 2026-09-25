import Link from "next/link";

type ObjectsSectionProps = {
  username: string;
  photos: { id: string; caption: string | null }[];
  notes: { id: string; title: string | null }[];
  diaryEntries: { date: Date }[];
  places: { slug: string; name: string }[];
};

function Column({
  title,
  newHref,
  children,
  empty,
}: {
  title: string;
  newHref: string;
  children: React.ReactNode;
  empty: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-wide text-ink-muted">
          {title}
        </h2>
        <Link href={newHref} className="text-xs text-accent hover:text-accent-strong">
          + New
        </Link>
      </div>
      {empty ? (
        <p className="text-sm text-ink-muted/70">Nothing yet.</p>
      ) : (
        <ul className="flex flex-col gap-1 text-sm">{children}</ul>
      )}
    </div>
  );
}

export function ObjectsSection({
  username,
  photos,
  notes,
  diaryEntries,
  places,
}: ObjectsSectionProps) {
  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-8 px-6 py-8 sm:grid-cols-4">
      <Column title="Photos" newHref={`/${username}/photo/new`} empty={photos.length === 0}>
        {photos.map((p) => (
          <li key={p.id}>
            <Link href={`/${username}/photo/${p.id}`} className="hover:text-accent">
              {p.caption || "Untitled photo"}
            </Link>
          </li>
        ))}
      </Column>
      <Column title="Notes" newHref={`/${username}/note/new`} empty={notes.length === 0}>
        {notes.map((n) => (
          <li key={n.id}>
            <Link href={`/${username}/note/${n.id}`} className="hover:text-accent">
              {n.title || "Untitled note"}
            </Link>
          </li>
        ))}
      </Column>
      <Column
        title="Diary"
        newHref={`/${username}/diary/new`}
        empty={diaryEntries.length === 0}
      >
        {diaryEntries.map((d) => {
          const iso = d.date.toISOString().slice(0, 10);
          return (
            <li key={iso}>
              <Link href={`/${username}/diary/${iso}`} className="hover:text-accent">
                {iso}
              </Link>
            </li>
          );
        })}
      </Column>
      <Column title="Places" newHref={`/${username}/place/new`} empty={places.length === 0}>
        {places.map((p) => (
          <li key={p.slug}>
            <Link href={`/${username}/place/${p.slug}`} className="hover:text-accent">
              {p.name}
            </Link>
          </li>
        ))}
      </Column>
    </div>
  );
}
