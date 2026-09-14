import type { ReactNode } from "react";
import { DetailBlock, ExpandableCardContent } from "../../components/TrackerPrimitives";
import { t } from "../../core/i18n";
import type { BookItem } from "../../core/types";

export function BookDetails({ item, actions }: { item: Pick<BookItem, "title" | "author" | "details">; actions?: ReactNode }) {
  return (
    <ExpandableCardContent>
      <DetailBlock label={t("editor.bookTitle")}><p>{item.title}</p></DetailBlock>
      {item.author ? <DetailBlock label={t("detail.author")}><p>{item.author}</p></DetailBlock> : null}
      {item.details ? <DetailBlock label={t("detail.details")}><p className="details-copy">{item.details}</p></DetailBlock> : null}
      {actions}
    </ExpandableCardContent>
  );
}
