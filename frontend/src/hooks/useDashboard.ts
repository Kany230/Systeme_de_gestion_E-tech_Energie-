import { useEffect, useState, useCallback } from 'react'
import api from '../services/api'

export function useDashboard() {
  // États existants pour le Dashboard d'accueil
  const [stats, setStats] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Nouveaux États dédiés aux 3 onglets du menu de Rapports
  const [rapportEventsData, setRapportEventsData] = useState<any>(null)
  const [rapportActionData, setRapportActionData] = useState<any>(null)
  const [rapportClientsData, setRapportClientsData] = useState<any>(null)
  const [loadingRapport, setLoadingRapport] = useState(false)

  // 1. Chargement initial de la page d'accueil (Dashboard principal)
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        // Aligné avec tes méthodes de contrôleur existantes
        const [statsRes, ordersRes, stockRes] = await Promise.all([
          api.get('/dashboard/statistics'),
          api.get('/dashboard/commandes'), // Correspond à ton backend : derniersCommandes()
          api.get('/dashboard/stock-faible'),        // Correspond à ton backend : stockFaible()
        ])

        const statsData = statsRes.data
        setStats({
          commandesJour:   statsData.commandes_jour,
          produitsStock:   statsData.produits_stock,
          clientsActifs:   statsData.clients_actifs,
          chiffreAffaires: statsData.chiffre_affaires,
        })
        setRecentOrders(ordersRes.data)
        setLowStockProducts(stockRes.data)

      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  // 2. Charger les données de l'onglet "$ Évents"
  const fetchRapportEvents = useCallback(async () => {
    setLoadingRapport(true)
    setError(null)
    try {
      const res = await api.get('/dashboard/rapports/events')
      setRapportEventsData(res.data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoadingRapport(false)
    }
  }, [])

  // 3. Charger les données de l'onglet "lI Action" (Stocks)
  const fetchRapportAction = useCallback(async () => {
    setLoadingRapport(true)
    setError(null)
    try {
      const res = await api.get('/dashboard/rapports/action')
      setRapportActionData(res.data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoadingRapport(false)
    }
  }, [])

  // 4. Charger les données de l'onglet "Clients" (Portefeuille commercial)
  const fetchRapportClients = useCallback(async () => {
    setLoadingRapport(true)
    setError(null)
    try {
      const res = await api.get('/dashboard/rapports/clients')
      setRapportClientsData(res.data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoadingRapport(false)
    }
  }, [])

  return { 
    // Accueil Dashboard
    stats, 
    recentOrders, 
    lowStockProducts, 
    loading, 
    error,
    
    // Rapports d'onglets
    loadingRapport,
    rapportEventsData,
    rapportActionData,
    rapportClientsData,
    fetchRapportEvents,
    fetchRapportAction,
    fetchRapportClients
  }
}