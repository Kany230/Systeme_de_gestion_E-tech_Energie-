import { useState, useEffect } from 'react'
import { configurationService } from '../services/configuration.service'
import type { Configuration } from '../types'

// Type séparé pour l'update — logo peut être un File (upload)
export type ConfigurationUpdateData = Omit<Partial<Configuration>, 'logo'> & {
  logo?: File | null
}

export function useConfiguration() {
  const [configuration, setConfiguration] = useState<Configuration | null>(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState<string | null>(null)
  const [saving, setSaving]               = useState(false)

  useEffect(() => {
    const charger = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await configurationService.getConfiguration()
        setConfiguration(data)
      } catch {
        setError('Impossible de charger la configuration')
      } finally {
        setLoading(false)
      }
    }
    charger()
  }, [])

  // ✅ On accepte ConfigurationUpdateData au lieu de Partial<Configuration>
  const modifier = async (data: ConfigurationUpdateData): Promise<boolean> => {
    try {
      setSaving(true)
      setError(null)
      const updated = await configurationService.updateConfiguration(data)
      setConfiguration(updated)
      return true
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Erreur lors de la sauvegarde')
      return false
    } finally {
      setSaving(false)
    }
  }

  return { configuration, loading, error, saving, modifier }
}