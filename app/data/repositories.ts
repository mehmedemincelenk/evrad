import type { BookItem } from "../core/types";
import { createTrackableRepository } from "./trackable-repository";

export const bookRepository = createTrackableRepository<BookItem>("books");
