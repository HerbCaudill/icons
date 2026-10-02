import { useEffect, useRef, useState } from "react"
import { Icon } from "@iconify/react"
import { getIconData } from "@iconify/utils"
import { Button } from "@/components/ui/button"
import { Glyph } from "@/components/Glyph"
import { iconNames, iconSets } from "@/lib/constants"
import { filterIcons } from "@/lib/filterIcons"
import { readIconSet } from "@/lib/readIconSet"
import { saveIconSet } from "@/lib/saveIconSet"
import type { IconSet } from "@/lib/types"

/** Browse an entire collection and copy an icon name with one click. */
export function App(
  /** No external configuration is required. */
  _props: Props,
) {
  const [set, setSet] = useState<IconSet>(readIconSet)
  const [query, setQuery] = useState("")
  const [message, setMessage] = useState("")
  const filterRef = useRef<HTMLInputElement>(null)
  const collection = iconSets[set]
  const results = filterIcons(iconNames[set], query)

  useEffect(() => {
    /** Focus the filter from anywhere outside a text field. */
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      const editing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      if (
        (event.key === "/" && !editing) ||
        ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")
      ) {
        event.preventDefault()
        filterRef.current?.focus()
        filterRef.current?.select()
      }
      if (event.key === "Escape" && target === filterRef.current) {
        setQuery("")
        setMessage("")
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  /** Apply one collection globally and remember it for future visits. */
  function changeSet(next: IconSet) {
    setSet(next)
    saveIconSet(next)
    setMessage("")
    filterRef.current?.focus()
  }

  /** Reset the filter and keep the next keystroke in the search field. */
  function clearFilter() {
    setQuery("")
    setMessage("")
    filterRef.current?.focus()
  }

  /** Copy the canonical Iconify name directly from the clicked card. */
  async function copyName(
    /** Name within the selected collection. */
    name: string,
  ) {
    const fullName = `${set}:${name}`
    try {
      await navigator.clipboard.writeText(fullName)
      setMessage(`Copied ${fullName}`)
    } catch {
      setMessage(`Couldn't copy ${fullName}. Try again or copy the name manually.`)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="wordmark" href="/" aria-label="Icons home">
          <span className="brand-mark">
            <Glyph name="category" size={23} />
          </span>
          icons
        </a>
        <div className="search-field">
          <Glyph name="search" size={22} />
          <input
            ref={filterRef}
            type="search"
            aria-label="Filter icons"
            autoFocus
            placeholder={`Search ${collection.label} icons…`}
            value={query}
            onChange={event => {
              setQuery(event.target.value)
              setMessage("")
            }}
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button className="clear-button" aria-label="Clear filter" onClick={clearFilter}>
              <Glyph name="x" size={18} />
            </button>
          ) : (
            <kbd title="Press / or ⌘K / Ctrl K to search">/</kbd>
          )}
        </div>
        <div className="set-picker">
          <label htmlFor="icon-set">Icon set</label>
          <div className="select-wrap">
            <select
              id="icon-set"
              value={set}
              onChange={event => changeSet(event.target.value as IconSet)}
            >
              {Object.entries(iconSets).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
            <Glyph name="chevron-down" size={16} />
          </div>
        </div>
      </header>
      <main>
        <div className="results-heading">
          <div>
            <h1>{collection.label}</h1>
            <span className="count" role="status">
              {results.length.toLocaleString()} {query ? "matches" : "icons"}
            </span>
          </div>
          <span className="copy-status" role="status">
            {message || "Click an icon to copy its name"}
          </span>
        </div>
        {results.length ? (
          <div className="icon-grid">
            {results.map(name => {
              const icon = getIconData(collection.data, name)
              return (
                <button
                  className="icon-card"
                  key={name}
                  aria-label={`Copy ${name}`}
                  title={`Copy ${set}:${name}`}
                  onClick={() => void copyName(name)}
                >
                  {icon && <Icon icon={icon} width={48} height={48} aria-hidden="true" />}
                  <span>{name}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Glyph name="search-off" size={40} />
            <h2>No icons found</h2>
            <p>Try a shorter name or choose another icon set.</p>
            <Button variant="outline" onClick={clearFilter}>
              Clear filter
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

type Props = Record<string, never>
