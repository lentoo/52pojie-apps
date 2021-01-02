import { usePageScroll } from "@tarojs/taro";
import { useRef } from "react";

type PageScrollTop = (y: number) => void
type PageScrollBottom = (y: number) => void

export default function usePageScrollTopOrBottom(pageScrollTop?: PageScrollTop, pageScrollBottom?: PageScrollBottom) {
  const scrollRef = useRef(0)
  usePageScroll(payload => {
    const diff = payload.scrollTop - scrollRef.current
    if (diff < 0 ) {
      pageScrollTop && pageScrollTop(payload.scrollTop)
    } else {
      pageScrollBottom && pageScrollBottom(payload.scrollTop)
    }
    scrollRef.current = payload.scrollTop
  })
}