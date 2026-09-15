import type { ContentSpace } from "../core/types";

const glyphs = {
  home: "⌂",
  library: "▤",
  discover: "✦",
} as const;

export function NavigationGlyph({ name }: { name: "home" | ContentSpace }) {
  return <span className={`navigation-glyph is-${name}`} aria-hidden="true">{glyphs[name]}</span>;
}
