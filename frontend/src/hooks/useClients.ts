import { useState, useEffect, useCallback } from 'react'
import { clientService } from '../services/client.service'
import type { Client } from '../types'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clientService.getAll()
      setClients(data)
    } catch (err) {
      setError('Erreur lors du chargement des clients')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const addClient = async (client: Omit<Client, 'id'>) => {
    try {
      const newClient = await clientService.create(client)   
      setClients(prev => [...prev, newClient])
    } catch (err) {
      setError('Erreur lors de l\'ajout du client')
    }   
  }

  const updateClient = async (id: number, updatedData: Partial<Client>) => {
    try {
      const updated = await clientService.update(id, updatedData)
      setClients(prev => prev.map(c => c.id === id ? updated : c))
    } catch (err) {
      throw new Error("Impossible de modifier le client")
    }
  }

  const deleteClient = async (id: number) => {
    try {
      await clientService.delete(id)  
      setClients(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      throw new Error("Impossible de supprimer le client")
    }
  }

  const removeClient = async (id: number) => {
    try {
      await clientService.delete(id)
      setClients(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      throw err
    }
  }

  return { clients, loading, error, refetch: fetchClients, addClient, updateClient, deleteClient, removeClient }
}
