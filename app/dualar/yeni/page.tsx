import { DevotionalModuleApp } from "../../features/devotional/DevotionalModuleApp";

export default function NewPrayerPage() {
  return <DevotionalModuleApp moduleId="prayers" editorMode={{ type: "new" }} />;
}
