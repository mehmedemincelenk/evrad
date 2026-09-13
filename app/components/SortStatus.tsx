export function SortStatus({ active, announcement, activeLabel }: { active: boolean; announcement: string; activeLabel: string }) {
  return (
    <>
      <p className="sr-only" aria-live="polite">{announcement}</p>
      {active ? <div className="sort-status" role="status">{activeLabel}</div> : null}
    </>
  );
}
