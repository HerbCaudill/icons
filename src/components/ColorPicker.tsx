import { useEffect, useState, type CSSProperties } from "react"
import { Popover } from "@base-ui/react/popover"
import { tailwindPalette } from "@/lib/constants"

/** Choose a Tailwind shade or enter a custom hex color. */
export function ColorPicker(
  /** Current icon color and its update handler. */
  { value, onChange }: Props,
) {
  const [draft, setDraft] = useState(value)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => setDraft(value), [value])

  /** Keep the field and icon color synchronized when choosing a swatch. */
  function choose(
    /** Complete six-digit hex value. */
    hex: string,
  ) {
    setDraft(hex)
    setInvalid(false)
    onChange(hex)
  }

  /** Accept three- or six-digit hex values without applying incomplete input. */
  function commitHex() {
    const hex = draft.trim().replace(/^#/, "")
    if (!/^(?:[\da-f]{3}|[\da-f]{6})$/i.test(hex)) {
      setInvalid(true)
      return
    }
    choose(
      `#${(hex.length === 3 ? [...hex].map(character => character.repeat(2)).join("") : hex).toLowerCase()}`,
    )
  }

  return (
    <div className="color-picker">
      <span>Icon color</span>
      <Popover.Root>
        <Popover.Trigger className="color-trigger" aria-label="Icon color" title={value}>
          <span style={{ backgroundColor: value }} />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner className="color-positioner" sideOffset={8} align="end">
            <Popover.Popup
              className="color-popup"
              style={{ "--palette-rows": tailwindPalette.length } as CSSProperties}
            >
              <Popover.Title className="sr-only">Icon color</Popover.Title>
              <div className="hex-row">
                <label htmlFor="hex-color">Hex color</label>
                <input
                  id="hex-color"
                  value={draft}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? "hex-error" : undefined}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={event => {
                    const next = event.target.value
                    setDraft(next)
                    setInvalid(false)
                    if (/^#?[\da-f]{6}$/i.test(next.trim()))
                      onChange(`#${next.trim().replace(/^#/, "").toLowerCase()}`)
                  }}
                  onBlur={commitHex}
                  onKeyDown={event => {
                    if (event.key === "Enter") commitHex()
                  }}
                />
                {(["#000000", "#ffffff"] as const).map((hex, index) => (
                  <button
                    key={hex}
                    className="color-swatch"
                    aria-label={index ? "white" : "black"}
                    aria-pressed={value === hex}
                    title={index ? "white · #ffffff" : "black · #000000"}
                    style={{ backgroundColor: hex }}
                    onClick={() => choose(hex)}
                  />
                ))}
              </div>
              {invalid && (
                <p id="hex-error" className="hex-error">
                  Enter 3 or 6 hex digits.
                </p>
              )}
              <div className="tailwind-palette">
                {tailwindPalette.map(({ name, shades }) => (
                  <div className="palette-row" key={name}>
                    {shades.map(({ shade, hex }) => (
                      <button
                        key={shade}
                        className="color-swatch"
                        aria-label={`${name}-${shade}`}
                        aria-pressed={value === hex}
                        title={`${name}-${shade} · ${hex}`}
                        style={{ backgroundColor: hex }}
                        onClick={() => choose(hex)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}

type Props = {
  /** Current six-digit hex color. */
  value: string
  /** Apply a valid color to all visible icons. */
  onChange: (hex: string) => void
}
