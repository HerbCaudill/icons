import { useEffect, useRef, useState } from "react"
import { registerSW } from "virtual:pwa-register"
import { Button } from "@/components/ui/button"
import { Glyph } from "@/components/Glyph"

/** Offer an explicit update while keeping other open windows in place. */
export function UpdateNotice(
  /** No external configuration. */
  _props: Props,
) {
  const [waiting, setWaiting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string>()
  const update = useRef<ReturnType<typeof registerSW>>(undefined)
  const readyToReload = useRef(false)
  const requested = useRef(false)
  const registration = useRef<ServiceWorkerRegistration>(undefined)
  const observedWorker = useRef<ServiceWorker>(undefined)

  /** Reload the requesting window, or offer the activated update to other windows. */
  function finishUpdate() {
    if (readyToReload.current) return
    readyToReload.current = true
    if (requested.current) {
      location.reload()
      return
    }
    setUpdating(false)
    setWaiting(true)
  }

  /** Observe activation even when this window has no service-worker controller yet. */
  function watchWaitingWorker() {
    const worker = registration.current?.waiting
    if (!worker || worker === observedWorker.current) return
    observedWorker.current = worker
    /** Stop listening when this downloaded worker activates or is replaced. */
    function onStateChange() {
      if (worker!.state === "activated") finishUpdate()
      if (worker!.state === "activated" || worker!.state === "redundant")
        worker!.removeEventListener("statechange", onStateChange)
    }
    worker.addEventListener("statechange", onStateChange)
  }

  useEffect(() => {
    // Strict Mode repeats effects; registration and its callbacks must stay singular.
    if (update.current) return
    update.current = registerSW({
      onNeedRefresh: () => {
        setWaiting(true)
        watchWaitingWorker()
      },
      onNeedReload: finishUpdate,
      onRegisteredSW: (_url, next) => {
        registration.current = next
        watchWaitingWorker()
      },
    })
  }, [])

  /** Activate the downloaded worker and reload only this consenting window. */
  async function installUpdate() {
    if (requested.current) return
    setError(undefined)
    if (readyToReload.current) {
      location.reload()
      return
    }
    requested.current = true
    setUpdating(true)
    try {
      await update.current?.(true)
    } catch {
      requested.current = false
      setUpdating(false)
      setError("Could not install the update. Try again.")
    }
  }

  return waiting ? (
    <aside
      aria-label="App update"
      className="bg-background fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-40 max-w-[calc(100vw-2rem)] rounded-lg border p-3 text-sm shadow-lg"
    >
      <div className="flex items-center gap-3">
        <p role="status">An update is ready.</p>
        <Button size="sm" disabled={updating} onClick={() => void installUpdate()}>
          <Glyph name="refresh" size={16} />
          {updating ? "Updating…" : "Update now"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-2 max-w-72">
          {error}
        </p>
      )}
    </aside>
  ) : null
}

type Props = Record<string, never>
