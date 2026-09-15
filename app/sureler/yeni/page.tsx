import { DevotionalModuleApp } from "../../features/devotional/DevotionalModuleApp";

export default function NewSurahPage() {
  return <DevotionalModuleApp moduleId="memorization" editorMode={{ type: "new" }} />;
}
