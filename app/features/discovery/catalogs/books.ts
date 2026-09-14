import type { BookItem } from "../../../core/types";

export type BookTemplate = Omit<BookItem, "sortOrder" | "createdAt" | "updatedAt">;

export const bookCatalog: BookTemplate[] = [
  {
    id: "discover-book-riyazus-salihin",
    title: "Riyâzü’s-Sâlihîn",
    author: "İmam Nevevî",
    details: "Ahlâk, ibadet ve günlük hayata dair hadisleri konu başlıkları altında bir araya getiren klasik eser.",
    targetCount: null,
    targetUnit: "custom",
    targetUnitLabel: "sayfa",
  },
  {
    id: "discover-book-mesnevi",
    title: "Mesnevî",
    author: "Mevlânâ Celâleddîn-i Rûmî",
    details: "Hikâyeler ve temsiller yoluyla insanın iç dünyasına, ahlâka ve mânevî yolculuğa odaklanan klasik eser.",
    targetCount: null,
    targetUnit: "custom",
    targetUnitLabel: "sayfa",
  },
  {
    id: "discover-book-ihya",
    title: "İhyâü Ulûmi’d-Dîn",
    author: "İmam Gazâlî",
    details: "İbadet, günlük yaşayış, kalbi olgunlaştıran davranışlar ve sakınılması gereken huyları ele alan kapsamlı klasik.",
    targetCount: null,
    targetUnit: "custom",
    targetUnitLabel: "sayfa",
  },
];
