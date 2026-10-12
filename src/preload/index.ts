import { contextBridge } from 'electron'

const api = {
  platform: process.platform
}

export type CuedeckApi = typeof api

contextBridge.exposeInMainWorld('cuedeck', api)
