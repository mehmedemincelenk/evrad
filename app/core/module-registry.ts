import type { ModuleDefinition } from "./types";

export const modules: ModuleDefinition[] = [
  { id: "prayers", route: "/dualar", icon: "prayer", enabled: false, supportsCreate: false, translationKey: "menu.prayers" },
  { id: "books", route: "/kitaplar", icon: "book", enabled: false, supportsCreate: false, translationKey: "menu.books" },
  { id: "memorization", route: "/ezberler", icon: "memory", enabled: false, supportsCreate: false, translationKey: "menu.memorization" },
  { id: "dhikr", route: "/zikirler", icon: "dhikr", enabled: true, supportsCreate: true, translationKey: "menu.dhikr" },
  { id: "games", route: "/oyunlar", icon: "game", enabled: false, supportsCreate: false, translationKey: "menu.games" },
];

export const enabledModules = modules.filter((module) => module.enabled);
export const shouldShowHome = enabledModules.length > 1;
