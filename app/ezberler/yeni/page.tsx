import { DevotionalModuleApp } from "../../features/devotional/DevotionalModuleApp";

export default function NewMemorizationPage() {
  return <DevotionalModuleApp moduleId="memorization" editorMode={{ type: "new" }} />;
}
