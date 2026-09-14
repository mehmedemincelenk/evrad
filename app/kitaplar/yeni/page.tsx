import { BookApp } from "../../features/books/BookApp";

export default function NewBookPage() {
  return <BookApp editorMode={{ type: "new" }} />;
}
