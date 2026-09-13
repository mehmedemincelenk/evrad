import type { ModuleDefinition } from "./types";

export const modules: ModuleDefinition[] = [
  { id: "prayers", route: "/dualar", icon: "prayer", enabled: false, supportsCreate: false, createRoute: null, createTranslationKey: null, translationKey: "menu.prayers" },
  { id: "books", route: "/kitaplar", icon: "book", enabled: false, supportsCreate: false, createRoute: null, createTranslationKey: null, translationKey: "menu.books" },
  { id: "memorization", route: "/ezberler", icon: "memory", enabled: false, supportsCreate: false, createRoute: null, createTranslationKey: null, translationKey: "menu.memorization" },
  { id: "dhikr", route: "/zikirler", icon: "dhikr", enabled: true, supportsCreate: true, createRoute: "/zikirler/yeni", createTranslationKey: "menu.add", translationKey: "menu.dhikr" },
  { id: "games", route: "/oyunlar", icon: "game", enabled: false, supportsCreate: false, createRoute: null, createTranslationKey: null, translationKey: "menu.games" },
];

export const enabledModules = modules.filter((module) => module.enabled);
export const shouldShowHome = enabledModules.length > 1;
export const defaultModule = enabledModules[0] ?? modules[0];

export function getModule(id: ModuleDefinition["id"]): ModuleDefinition {
  const definition = modules.find((candidate) => candidate.id === id);
  if (!definition) throw new Error(`Unknown module: ${id}`);
  return definition;
}
