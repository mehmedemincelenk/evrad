"use client";

import type { ReactNode } from "react";
import { DetailBlock, ExpandableCardContent } from "../../components/TrackerPrimitives";
import { t } from "../../core/i18n";
import type { DevotionalItem } from "../../core/types";

const fontSizes = ["1.75rem", "2.1rem", "2.5rem", "2.95rem", "3.45rem"];

export function DevotionalDetails({
  item,
  fontLevel,
  onChangeFont,
  actions,
}: {
  item: Pick<DevotionalItem, "name" | "arabic" | "translation" | "details">;
  fontLevel: 0 | 1 | 2 | 3 | 4;
  onChangeFont: (direction: -1 | 1) => void;
  actions?: ReactNode;
}) {
  return (
    <ExpandableCardContent>
      {item.name ? <DetailBlock label={t("detail.name")}><p>{item.name}</p></DetailBlock> : null}
      {item.arabic ? (
        <DetailBlock label={t("detail.arabic")} className="arabic-detail">
          <div className="font-controls">
            <button type="button" onClick={() => onChangeFont(-1)} aria-label={t("detail.fontSmaller")} disabled={fontLevel === 0}>A−</button>
            <span>{t("detail.fontLevel", { level: fontLevel + 1 })}</span>
            <button type="button" onClick={() => onChangeFont(1)} aria-label={t("detail.fontLarger")} disabled={fontLevel === 4}>A+</button>
          </div>
          <p className="expanded-arabic" lang="ar" dir="rtl" style={{ fontSize: fontSizes[fontLevel] }}>{item.arabic}</p>
        </DetailBlock>
      ) : null}
      {item.translation ? <DetailBlock label={t("detail.translation")}><p>{item.translation}</p></DetailBlock> : null}
      {item.details ? <DetailBlock label={t("detail.details")}><p className="details-copy">{item.details}</p></DetailBlock> : null}
      {actions}
    </ExpandableCardContent>
  );
}
