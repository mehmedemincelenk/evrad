"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEventHandler,
  type PointerEventHandler,
} from "react";
import { moveItem } from "../core/sort";

const HOLD_DELAY_MS = 280;
const CANCEL_DISTANCE_PX = 10;

interface SortableItem {
  id: string;
  sortOrder: number;
}

interface PendingPress {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  active: boolean;
  handle: HTMLButtonElement;
}

export function useLongPressSort<T extends SortableItem>({
  items,
  onChange,
  onPersist,
  getAnnouncement,
  onError,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  onPersist: (items: T[]) => Promise<void>;
  getAnnouncement: (item: T, position: number) => string;
  onError: () => void;
}) {
  const itemsRef = useRef(items);
  const pendingRef = useRef<PendingPress | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => { itemsRef.current = items; }, [items]);

  const clearTimer = useCallback(() => {
    if (holdTimerRef.current !== null) window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;
  }, []);

  const finish = useCallback((persist: boolean) => {
    const press = pendingRef.current;
    clearTimer();
    if (!press) return;
    if (press.handle.hasPointerCapture(press.pointerId)) press.handle.releasePointerCapture(press.pointerId);

    if (press.active) {
      const item = itemsRef.current.find((candidate) => candidate.id === press.id);
      const position = itemsRef.current.findIndex((candidate) => candidate.id === press.id) + 1;
      if (item) setAnnouncement(getAnnouncement(item, position));
      if (persist) onPersist(itemsRef.current).catch(onError);
    }

    document.body.classList.remove("is-sorting");
    pendingRef.current = null;
    setDraggingId(null);
    setDragOffsetY(0);
  }, [clearTimer, getAnnouncement, onError, onPersist]);

  useEffect(() => () => {
    clearTimer();
    document.body.classList.remove("is-sorting");
  }, [clearTimer]);

  const pointerDown = useCallback<PointerEventHandler<HTMLButtonElement>>((event) => {
    if (event.button !== 0 || pendingRef.current) return;
    const id = event.currentTarget.dataset.sortId;
    if (!id) return;
    event.preventDefault();
    setDragOffsetY(event.clientY - press.startY);
    event.currentTarget.setPointerCapture(event.pointerId);
    pendingRef.current = {
      id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      handle: event.currentTarget,
    };

    holdTimerRef.current = window.setTimeout(() => {
      const press = pendingRef.current;
      if (!press || press.id !== id) return;
      press.active = true;
      document.body.classList.add("is-sorting");
      setDraggingId(id);
      if ("vibrate" in navigator) navigator.vibrate(12);
    }, HOLD_DELAY_MS);
  }, []);

  const pointerMove = useCallback<PointerEventHandler<HTMLButtonElement>>((event) => {
    const press = pendingRef.current;
    if (!press || press.pointerId !== event.pointerId) return;
    const distance = Math.hypot(event.clientX - press.startX, event.clientY - press.startY);
    if (!press.active) {
      if (distance > CANCEL_DISTANCE_PX) finish(false);
      return;
    }

    event.preventDefault();
    const currentIndex = itemsRef.current.findIndex((item) => item.id === press.id);
    if (currentIndex < 0) return;
    const direction = event.clientY >= press.startY ? 1 : -1;
    const target = itemsRef.current[currentIndex + direction];
    if (!target) return;
    const targetElement = document.querySelector<HTMLElement>(`[data-card-id="${CSS.escape(target.id)}"]`);
    if (!targetElement) return;
    const bounds = targetElement.getBoundingClientRect();
    const crossed = direction > 0
      ? event.clientY > bounds.top + bounds.height / 2
      : event.clientY < bounds.top + bounds.height / 2;
    if (!crossed) return;

    const next = moveItem(itemsRef.current, press.id, target.id);
    itemsRef.current = next;
    onChange(next);
    press.startY = event.clientY;
    setDragOffsetY(0);
  }, [finish, onChange]);

  const pointerUp = useCallback<PointerEventHandler<HTMLButtonElement>>(() => finish(true), [finish]);

  const keyDown = useCallback<KeyboardEventHandler<HTMLButtonElement>>((event) => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const id = event.currentTarget.dataset.sortId;
    if (!id) return;
    event.preventDefault();
    const currentIndex = itemsRef.current.findIndex((item) => item.id === id);
    if (currentIndex < 0) return;
    const targetIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? itemsRef.current.length - 1
        : Math.max(0, Math.min(itemsRef.current.length - 1, currentIndex + (event.key === "ArrowUp" ? -1 : 1)));
    const target = itemsRef.current[targetIndex];
    if (!target || target.id === id) return;
    const next = moveItem(itemsRef.current, id, target.id);
    itemsRef.current = next;
    onChange(next);
    const item = next.find((candidate) => candidate.id === id);
    const position = next.findIndex((candidate) => candidate.id === id) + 1;
    if (item) setAnnouncement(getAnnouncement(item, position));
    onPersist(next).catch(onError);
  }, [getAnnouncement, onChange, onError, onPersist]);

  return {
    draggingId,
    dragOffsetY,
    announcement,
    handleProps: {
      onPointerDown: pointerDown,
      onPointerMove: pointerMove,
      onPointerUp: pointerUp,
      onPointerCancel: pointerUp,
      onKeyDown: keyDown,
    },
  };
}
