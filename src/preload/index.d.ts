import type { CuedeckApi } from './index'

declare global {
  interface Window {
    cuedeck: CuedeckApi
  }
}
