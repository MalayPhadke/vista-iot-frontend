import { create } from 'zustand'
import yaml from 'js-yaml'
import { defaultConfig } from '../config/default-config'

interface ConfigState {
  config: typeof defaultConfig
  updateConfig: (path: string[], value: any) => void
  resetConfig: () => void
  getYamlString: () => string
  getLastUpdated: () => string
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: defaultConfig,
  
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
      current[path[path.length - 1]] = value
      
      return { config: newConfig }
    })
  },

  resetConfig: () => {
    set({ config: defaultConfig })
  },

  getYamlString: () => {
    return yaml.dump(get().config, { indent: 2 })
  },

  getLastUpdated: () => {
    return new Date().toISOString()
  }
})) 