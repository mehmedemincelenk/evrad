import type { EntityEditorMode } from "../../core/editor";
import { DevotionalModuleApp } from "../devotional/DevotionalModuleApp";

export type DhikrEditorMode = EntityEditorMode;

export function DhikrApp({ editorMode = null }: { editorMode?: DhikrEditorMode }) {
  return <DevotionalModuleApp moduleId="dhikr" editorMode={editorMode} />;
}
