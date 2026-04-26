import { useClients } from '../hooks/useClients'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Clients() {
  const { clients, loading, error } = useClients()

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
        <Button>Ajouter un Client</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Nom</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Téléphone</th>
                <th className="text-left py-3 px-4">Adresse</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Aucun client trouvé
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{client.nom}</td>
                    <td className="py-3 px-4 text-gray-600">{client.email}</td>
                    <td className="py-3 px-4">{client.telephone}</td>
                    <td className="py-3 px-4 text-gray-600">{client.adresse}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary">Modifier</Button>
                        <Button size="sm" variant="danger">Supprimer</Button>
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
