import { useEffect, useState, type ReactNode } from "react"
import { Popover } from "@base-ui/react/popover"
import { Glyph } from "@/components/Glyph"

/** Keep desktop controls inline and place mobile controls in a settings popover. */
export function HeaderSettings(
  /** Controls shared by both layouts. */
  { children }: Props,
) {
  const [mobile, setMobile] = useState(() => window.matchMedia(mobileQuery).matches)

  useEffect(() => {
    const media = window.matchMedia(mobileQuery)
    /** Switch layouts when the viewport crosses the mobile breakpoint. */
    function updateLayout() {
      setMobile(media.matches)
    }
    media.addEventListener("change", updateLayout)
    updateLayout()
    return () => media.removeEventListener("change", updateLayout)
  }, [])

  if (!mobile) return children

  return (
    <Popover.Root>
      <Popover.Trigger className="settings-trigger" aria-label="Settings" title="Settings">
        <Glyph name="settings" size={20} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner className="settings-positioner" sideOffset={8} align="end">
          <Popover.Popup className="settings-popup">
            <Popover.Title className="sr-only">Settings</Popover.Title>
            {children}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

const mobileQuery = "(max-width: 700px)"

type Props = {
  /** Color, size, stroke, and collection controls. */
  children: ReactNode
}
