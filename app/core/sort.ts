export function normalizeOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return items.map((item, sortOrder) => ({ ...item, sortOrder }));
}

export function moveItem<T extends { id: string; sortOrder: number }>(
  items: T[],
  id: string,
  targetId: string,
): T[] {
  const from = items.findIndex((item) => item.id === id);
  const to = items.findIndex((item) => item.id === targetId);
  if (from < 0 || to < 0 || from === to) return items;

  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return normalizeOrder(next);
}
