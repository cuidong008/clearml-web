import { RefObject, useEffect } from "react"

export function useOnClickOutside<T extends HTMLAnchorElement>(
  node: RefObject<T>,
  handler: () => void,
) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (node.current?.contains(e.target as Node) ?? false) {
        return
      }
      handler()
    }
    if (node.current) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [node, handler])
}
