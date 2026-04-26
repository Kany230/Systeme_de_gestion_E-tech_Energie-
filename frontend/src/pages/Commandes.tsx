import { useCommandes } from '../hooks/useCommandes'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Commandes() {
  const { commandes, loading, error } = useCommandes()

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Commandes</h1>
        <Button>Nouvelle Commande</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">N° Commande</th>
                <th className="text-left py-3 px-4">Client</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Statut</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commandes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                commandes.map((commande) => (
                  <tr key={commande.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">CMD-{commande.id}</td>
                    <td className="py-3 px-4">Client {commande.clientId}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(commande.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {commande.total.toLocaleString()} FCFA
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        commande.statut === 'en_cours'
                          ? 'bg-yellow-100 text-yellow-800'
                          : commande.statut === 'terminee'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {commande.statut.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary">Voir</Button>
                        <Button size="sm" variant="secondary">Modifier</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
