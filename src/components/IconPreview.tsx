import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Icon } from "@iconify/react"
import { getIconData } from "@iconify/utils"
import { Button } from "@/components/ui/button"
import { Glyph } from "./Glyph"
import { getSvg } from "@/lib/getSvg"
import { iconSets } from "@/lib/constants"
import type { IconSet } from "@/lib/types"

/** Inspect an icon and copy its canonical name or standalone SVG. */
export function IconPreview(
  /** Selected icon and dismissal callback. */
  { name, set, onClose }: Props,
) {
  const [message, setMessage] = useState("")
  const collection = iconSets[set]
  const icon = getIconData(collection.data, name)

  /** Report clipboard success or failure without closing the preview. */
  async function copy(
    /** Text requested by the copy action. */
    text: string,
    /** Description of the copied value. */
    label: string,
  ) {
    try {
      await navigator.clipboard.writeText(text)
      setMessage(`${label} copied`)
    } catch {
      setMessage("Copy failed. You can select and copy the SVG below.")
    }
  }

  return (
    <Dialog.Root
      open
      onOpenChange={open => {
        if (!open) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="preview-overlay" />
        <Dialog.Content className="preview-panel">
          <div className="preview-heading">
            <span className="eyebrow">Icon details</span>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close preview">
                <Glyph name="x" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="preview-canvas">
            {icon && <Icon icon={icon} width={96} height={96} aria-hidden="true" />}
          </div>
          <Dialog.Title className="preview-title">{name}</Dialog.Title>
          <Dialog.Description className="preview-description">
            {collection.label} · {collection.license} license · {icon?.width ?? 24} ×{" "}
            {icon?.height ?? 24}
          </Dialog.Description>
          <div className="copy-actions">
            <Button onClick={() => void copy(`${set}:${name}`, "Name")}>
              <Glyph name="copy" size={17} />
              Copy name
            </Button>
            <Button variant="outline" onClick={() => void copy(getSvg(set, name), "SVG")}>
              <Glyph name="code" size={17} />
              Copy SVG
            </Button>
          </div>
          <p role="status" className="copy-status">
            {message || "Ready to use in your next project."}
          </p>
          <label className="eyebrow" htmlFor="svg-source">
            SVG source
          </label>
          <textarea
            id="svg-source"
            className="svg-source"
            readOnly
            value={getSvg(set, name)}
            spellCheck={false}
          />
          <a className="source-link" href={collection.url} target="_blank" rel="noreferrer">
            Visit {collection.label}
            <Glyph name="arrow-up-right" size={16} />
          </a>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

type Props = {
  /** Icon selected from the results. */
  name: string
  /** Global collection selection. */
  set: IconSet
  /** Dismiss the preview. */
  onClose: () => void
}
