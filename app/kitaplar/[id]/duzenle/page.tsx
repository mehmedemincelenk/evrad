import { BookApp } from "../../../features/books/BookApp";

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookApp editorMode={{ type: "edit", id }} />;
}
