import type { BookItem } from "../../core/types";
import { createTrackableRepository } from "../../data/trackable-repository";

export const bookRepository = createTrackableRepository<BookItem>("books");
