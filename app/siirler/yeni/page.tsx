import { DevotionalModuleApp } from "../../features/devotional/DevotionalModuleApp";

export default function NewPoetryPage() {
  return <DevotionalModuleApp moduleId="poetry" editorMode={{ type: "new" }} />;
}
