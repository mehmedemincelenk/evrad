import type { ContentSpace, ModuleDefinition, ModuleId, TrackableModuleDefinition, TrackableModuleId } from "./types";

export const modules = [
  createTrackableModule("prayers", "devotional", "prayer", "/dualar", "menu.prayers", "menu.addPrayer"),
  createTrackableModule("books", "books", "book", "/kitaplar", "menu.books", "menu.addBook"),
  createTrackableModule("memorization", "devotional", "memory", "/ezberler", "menu.memorization", "menu.addMemorization"),
  createTrackableModule("dhikr", "devotional", "dhikr", "/zikirler", "menu.dhikr", "menu.addDhikr"),
  createTrackableModule("poetry", "devotional", "poetry", "/siirler", "menu.poetry", "menu.addPoetry"),
  {
    id: "games",
    kind: "games",
    route: "/oyunlar",
    discoverRoute: "/kesfet/oyunlar",
    icon: "game",
    create: null,
    copy: {
      menu: "menu.games",
      title: "module.games.title",
      eyebrow: "module.games.eyebrow",
      tagline: "module.games.tagline",
      discoverTitle: "discover.games.title",
    },
  },
] as const satisfies readonly ModuleDefinition[];

export const trackableNavigationModules: readonly TrackableModuleId[] = [
  "dhikr",
  "prayers",
  "memorization",
  "poetry",
  "books",
];

function createTrackableModule(
  id: TrackableModuleId,
  kind: TrackableModuleDefinition["kind"],
  icon: TrackableModuleDefinition["icon"],
  route: string,
  menu: TrackableModuleDefinition["copy"]["menu"],
  addLabel: TrackableModuleDefinition["create"]["label"],
): TrackableModuleDefinition {
  const copyPrefix = `module.${id}` as const;
  return {
    id,
    kind,
    icon,
    route,
    discoverRoute: `/kesfet${route}`,
    create: { route: `${route}/yeni`, label: addLabel },
    copy: {
      menu,
      title: `${copyPrefix}.title`,
      singular: `${copyPrefix}.singular`,
      eyebrow: `${copyPrefix}.eyebrow`,
      tagline: `${copyPrefix}.tagline`,
      discoverTitle: `discover.${id}.title`,
    },
  } as TrackableModuleDefinition;
}

export function getModule(id: ModuleId): ModuleDefinition {
  const definition = modules.find((candidate) => candidate.id === id);
  if (!definition) throw new Error(`Unknown module: ${id}`);
  return definition;
}

export function getTrackableModule(id: TrackableModuleId): TrackableModuleDefinition {
  return getModule(id) as TrackableModuleDefinition;
}

export function getModuleRoute(id: ModuleId, space: ContentSpace): string {
  const definition = getModule(id);
  return space === "library" ? definition.route : definition.discoverRoute;
}
