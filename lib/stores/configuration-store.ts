import { create } from 'zustand'
import YAML from 'yaml'
import { defaultConfig } from '@/lib/config/default-config'

interface ConfigState {
  config: typeof defaultConfig
  lastUpdated: string
  isDirty: boolean
  updateConfig: (path: string[], value: any) => void
  resetConfig: () => void
  getYamlString: () => string
  getLastUpdated: () => string
  setDirty: (isDirty: boolean) => void
  getConfig: () => typeof defaultConfig
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: defaultConfig,
  lastUpdated: new Date().toISOString(),
  isDirty: false,

  updateConfig: (path: string[], value: any) => {
    set(state => {
      const newConfig = { ...state.config }
      let current = newConfig
      
      // Navigate to the nested property
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {}
        current = current[path[i]]
      }
      
      // Set the value
      if (path.length > 0) {
        current[path[path.length - 1]] = value
      } else {
        // If path is empty, update entire config
        return { 
          config: value,
          lastUpdated: new Date().toISOString(),
          isDirty: true 
        }
      }
      
      return { 
        config: newConfig,
        lastUpdated: new Date().toISOString(),
        isDirty: true 
      }
    })
  },

  resetConfig: () => {
    set({ 
      config: defaultConfig,
      lastUpdated: new Date().toISOString(),
      isDirty: true 
    })
  },

  getYamlString: () => {
    return YAML.stringify(get().config, { indent: 2 })
  },

  getLastUpdated: () => {
    return get().lastUpdated
  },

  setDirty: (isDirty: boolean) => {
    set({ isDirty })
  },

  getConfig: () => {
    return get().config
  }
})) 