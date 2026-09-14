import type { TranslationKey } from "../../core/i18n";
import type { DevotionalItem, DevotionalModuleId } from "../../core/types";
import { getModule } from "../../core/module-registry";
import { createTrackableRepository } from "../../data/trackable-repository";

interface DevotionalConfig {
  id: DevotionalModuleId;
  titleKey: TranslationKey;
  singularKey: TranslationKey;
  eyebrowKey: TranslationKey;
  taglineKey: TranslationKey;
  repository: ReturnType<typeof createTrackableRepository<DevotionalItem>>;
  route: string;
  createRoute: string;
}

const configs: Record<DevotionalModuleId, DevotionalConfig> = {
  dhikr: createConfig("dhikr", "module.dhikr.title", "module.dhikr.singular", "module.dhikr.eyebrow", "module.dhikr.tagline"),
  prayers: createConfig("prayers", "module.prayers.title", "module.prayers.singular", "module.prayers.eyebrow", "module.prayers.tagline"),
  memorization: createConfig("memorization", "module.memorization.title", "module.memorization.singular", "module.memorization.eyebrow", "module.memorization.tagline"),
};

function createConfig(
  id: DevotionalModuleId,
  titleKey: TranslationKey,
  singularKey: TranslationKey,
  eyebrowKey: TranslationKey,
  taglineKey: TranslationKey,
): DevotionalConfig {
  const definition = getModule(id);
  if (!definition.createRoute) throw new Error(`${id} needs a create route`);
  return {
    id,
    titleKey,
    singularKey,
    eyebrowKey,
    taglineKey,
    repository: createTrackableRepository<DevotionalItem>(id),
    route: definition.route,
    createRoute: definition.createRoute,
  };
}

export function getDevotionalConfig(id: DevotionalModuleId): DevotionalConfig {
  return configs[id];
}
