import { DevotionalModuleApp } from "../../features/devotional/DevotionalModuleApp";

export default function NewDhikrPage() {
  return <DevotionalModuleApp moduleId="dhikr" editorMode={{ type: "new" }} />;
}
