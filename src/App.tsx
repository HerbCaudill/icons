import { useEffect, useRef, useState } from "react"
import { Icon } from "@iconify/react"
import { getIconData } from "@iconify/utils"
import { Button } from "@/components/ui/button"
import { Glyph } from "@/components/Glyph"
import { IconPreview } from "@/components/IconPreview"
import { iconNames, iconSets } from "@/lib/constants"
import { filterIcons } from "@/lib/filterIcons"
import { readIconSet } from "@/lib/readIconSet"
import { saveIconSet } from "@/lib/saveIconSet"
import type { IconSet } from "@/lib/types"

/** Browse one collection with an immediately available keyboard filter. */
export function App(
  /** No external configuration is required. */
  _props: Props,
) {
  const [set, setSet] = useState<IconSet>(readIconSet)
  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(160)
  const [selected, setSelected] = useState<string | null>(null)
  const filterRef = useRef<HTMLInputElement>(null)
  const collection = iconSets[set]
  const names = iconNames[set]
  const results = filterIcons(names, query)

  useEffect(() => {
    /** Focus the filter from anywhere outside a text field or dialog. */
    function onKeyDown(event: KeyboardEvent) {
      if (selected) return
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
        setLimit(160)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selected])

  /** Apply one collection globally and remember it for future visits. */
  function changeSet(next: IconSet) {
    setSet(next)
    saveIconSet(next)
    setLimit(160)
    setSelected(null)
    filterRef.current?.focus()
  }

  /** Reset the filter and keep the next keystroke in the search field. */
  function clearFilter() {
    setQuery("")
    setLimit(160)
    filterRef.current?.focus()
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="wordmark" href="/" aria-label="Icons home">
          <span className="brand-mark">
            <Glyph name="category" size={23} />
          </span>
          icons<span className="wordmark-dot">.</span>
        </a>
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
        <section className="intro">
          <div className="eyebrow">
            <span className="small-dot" />A little less searching
          </div>
          <h1>Find your next icon.</h1>
          <p>Just start typing. The right shape is a few keystrokes away.</p>
        </section>
        <div className="search-toolbar">
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
                setLimit(160)
              }}
              autoComplete="off"
              spellCheck={false}
            />
            {query ? (
              <button className="clear-button" aria-label="Clear filter" onClick={clearFilter}>
                <Glyph name="x" size={18} />
              </button>
            ) : (
              <kbd>/</kbd>
            )}
          </div>
        </div>
        <div className="results-heading">
          <div>
            <h2>{collection.label}</h2>
            <span className="count" role="status">
              {results.length.toLocaleString()} {query ? "matches" : "icons"}
            </span>
          </div>
          <span className="results-hint">
            Click an icon to preview & copy
            <Glyph name="arrow-up-right" size={15} />
          </span>
        </div>
        {results.length ? (
          <>
            <div className="icon-grid">
              {results.slice(0, limit).map(name => {
                const icon = getIconData(collection.data, name)
                return (
                  <button
                    className="icon-card"
                    key={name}
                    aria-label={`Preview ${name}`}
                    title={name}
                    onClick={() => setSelected(name)}
                  >
                    {icon && <Icon icon={icon} width={30} height={30} aria-hidden="true" />}
                    <span>{name}</span>
                  </button>
                )
              })}
            </div>
            <div className="load-more">
              <span>
                Showing {Math.min(limit, results.length).toLocaleString()} of{" "}
                {results.length.toLocaleString()}
              </span>
              {results.length > limit && (
                <Button variant="outline" onClick={() => setLimit(current => current + 160)}>
                  Show more icons
                  <Glyph name="chevron-down" size={16} />
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Glyph name="search-off" size={40} />
            <h3>No icons found</h3>
            <p>Try a shorter name or choose another icon set.</p>
            <Button variant="outline" onClick={clearFilter}>
              Clear filter
            </Button>
          </div>
        )}
      </main>
      <footer>
        <span>Small shapes. Endless possibilities.</span>
        <div>
          <span>
            <kbd>/</kbd> or <kbd>⌘ / Ctrl K</kbd> to search
          </span>
          <a href={collection.url} target="_blank" rel="noreferrer">
            {collection.label} · {collection.license}
            <Glyph name="arrow-up-right" size={14} />
          </a>
        </div>
      </footer>
      {selected && (
        <IconPreview
          key={`${set}:${selected}`}
          name={selected}
          set={set}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

type Props = Record<string, never>
