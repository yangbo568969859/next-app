import type { RefObject } from 'react'
import { useEffect } from 'react'

const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  fn: () => void,
) => {
  useEffect(() => {
    const ele = ref?.current;
    const handleClickOutside = (event: Event) => {
      if (ele && !ele.contains(event.target as Node)) {
        fn()
      }
    };
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [ref, fn])
}

export default useClickOutside;
