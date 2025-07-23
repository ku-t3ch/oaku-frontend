import { useEffect } from 'react';

export function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  handler: () => void,
  isOpen?: boolean // เพิ่ม parameter นี้
) {
  useEffect(() => {
    // ถ้า dropdown ไม่เปิดอยู่ ไม่ต้องทำอะไร
    if (!isOpen) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, isOpen]);
}