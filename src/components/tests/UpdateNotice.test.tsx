import { StrictMode } from "react"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import type { RegisterSWOptions } from "vite-plugin-pwa/types"

const { registerSW, update } = vi.hoisted(() => ({ registerSW: vi.fn(), update: vi.fn() }))
vi.mock("virtual:pwa-register", () => ({ registerSW }))
import { UpdateNotice } from "../UpdateNotice"

let options: RegisterSWOptions

beforeEach(() => {
  vi.stubGlobal("location", { reload: vi.fn() })
  update.mockReset().mockResolvedValue(undefined)
  registerSW.mockReset().mockImplementation((next: RegisterSWOptions) => {
    options = next
    return update
  })
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it("offers a ready update and reloads only after the user requests it", async () => {
  render(<UpdateNotice />)
  expect(screen.queryByRole("button", { name: "Update now" })).not.toBeInTheDocument()
  act(() => options.onNeedRefresh?.())
  expect(screen.getByRole("status")).toHaveTextContent("An update is ready.")
  expect(location.reload).not.toHaveBeenCalled()
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Update now" })))
  expect(update).toHaveBeenCalledOnce()
  expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled()
  act(() => options.onNeedReload?.())
  expect(location.reload).toHaveBeenCalledOnce()
})

it("keeps this window open when another window activates the update", async () => {
  render(<UpdateNotice />)
  act(() => options.onNeedReload?.())
  expect(screen.getByRole("button", { name: "Update now" })).toBeEnabled()
  expect(location.reload).not.toHaveBeenCalled()
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Update now" })))
  expect(location.reload).toHaveBeenCalledOnce()
  expect(update).not.toHaveBeenCalled()
})

it("offers a retry when installing the update fails", async () => {
  update.mockRejectedValueOnce(new Error("Unavailable"))
  render(<UpdateNotice />)
  act(() => options.onNeedRefresh?.())
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Update now" })))
  expect(screen.getByRole("alert")).toHaveTextContent("Could not install the update. Try again.")
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Update now" })))
  expect(update).toHaveBeenCalledTimes(2)
})

it("registers once when Strict Mode repeats effects", () => {
  render(
    <StrictMode>
      <UpdateNotice />
    </StrictMode>,
  )
  expect(registerSW).toHaveBeenCalledOnce()
})

it("reloads after activation even when the browser has not given the window a controller", async () => {
  const worker = Object.assign(new EventTarget(), { state: "installed" })
  const registration = { waiting: worker } as unknown as ServiceWorkerRegistration
  render(<UpdateNotice />)
  act(() => options.onRegisteredSW?.("/sw.js", registration))
  act(() => options.onNeedRefresh?.())
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Update now" })))
  act(() => {
    worker.state = "activated"
    worker.dispatchEvent(new Event("statechange"))
  })
  expect(location.reload).toHaveBeenCalledOnce()
  act(() => options.onNeedReload?.())
  expect(location.reload).toHaveBeenCalledOnce()
})
