import type { ModuleDefinition } from "./types";

export const modules: ModuleDefinition[] = [
  { id: "prayers", route: "/dualar", discoverRoute: "/kesfet/dualar", icon: "prayer", enabled: true, supportsCreate: true, createRoute: "/dualar/yeni", createTranslationKey: "menu.addPrayer", translationKey: "menu.prayers" },
  { id: "books", route: "/kitaplar", discoverRoute: "/kesfet/kitaplar", icon: "book", enabled: true, supportsCreate: true, createRoute: "/kitaplar/yeni", createTranslationKey: "menu.addBook", translationKey: "menu.books" },
  { id: "memorization", route: "/ezberler", discoverRoute: "/kesfet/ezberler", icon: "memory", enabled: true, supportsCreate: true, createRoute: "/ezberler/yeni", createTranslationKey: "menu.addMemorization", translationKey: "menu.memorization" },
  { id: "dhikr", route: "/zikirler", discoverRoute: "/kesfet/zikirler", icon: "dhikr", enabled: true, supportsCreate: true, createRoute: "/zikirler/yeni", createTranslationKey: "menu.addDhikr", translationKey: "menu.dhikr" },
  { id: "games", route: "/oyunlar", discoverRoute: "/kesfet/oyunlar", icon: "game", enabled: true, supportsCreate: false, createRoute: null, createTranslationKey: null, translationKey: "menu.games" },
];

export const enabledModules = modules.filter((module) => module.enabled);
export const shouldShowHome = enabledModules.length > 1;
export const defaultModule = enabledModules[0] ?? modules[0];

export function getModule(id: ModuleDefinition["id"]): ModuleDefinition {
  const definition = modules.find((candidate) => candidate.id === id);
  if (!definition) throw new Error(`Unknown module: ${id}`);
  return definition;
}

export function getModuleRoute(id: ModuleDefinition["id"], space: "library" | "discover"): string {
  const definition = getModule(id);
  return space === "library" ? definition.route : definition.discoverRoute;
}
