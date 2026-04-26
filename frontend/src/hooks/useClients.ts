import { useState, useEffect } from 'react'
import { clientService } from '../services/client.service'
import type { Client } from '../types'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setLoading(true)
      const data = await clientService.getAll()
      setClients(data)
    } catch (err) {
      setError('Erreur lors du chargement des clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return { clients, loading, error, refetch: fetchClients }
}
