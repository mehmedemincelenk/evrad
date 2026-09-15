import { DevotionalModuleApp } from "../../../features/devotional/DevotionalModuleApp";

export default async function EditPoetryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DevotionalModuleApp moduleId="poetry" editorMode={{ type: "edit", id }} />;
}
