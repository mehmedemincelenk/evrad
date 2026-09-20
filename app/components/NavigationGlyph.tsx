import { Backpack, Compass, House, ListChecks } from "lucide-react";

const glyphs = { home: House, virds: ListChecks, bag: Backpack, discover: Compass } as const;

export function NavigationGlyph({ name }: { name: keyof typeof glyphs }) {
  const Glyph = glyphs[name];
  return <Glyph className={`navigation-glyph is-${name}`} aria-hidden="true" strokeWidth={1.8} />;
}
