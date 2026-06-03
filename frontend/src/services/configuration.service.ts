import api from './api'
import type { Configuration } from '../types'
import type { ConfigurationUpdateData } from '../hooks/useConfiguration'

export const configurationService = {

  async getConfiguration(): Promise<Configuration> {
    const response = await api.get<Configuration>('/configuration')
    return response.data
  },

  // ✅ On utilise ConfigurationUpdateData — logo est File | null ici
  async updateConfiguration(data: ConfigurationUpdateData): Promise<Configuration> {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof typeof data] as unknown

      if (value === undefined || value === null) return

      if (value instanceof File) {
        formData.append(key, value)
      } else {
        formData.append(key, String(value as string | number | boolean))
      }
    })

    formData.append('_method', 'PUT')

    const response = await api.post<Configuration>('/configuration', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}