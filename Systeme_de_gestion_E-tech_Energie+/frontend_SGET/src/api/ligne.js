import axiosInstance from './axios';

/**
 * Service pour gérer les lignes spécifiques d'un document (Devis/Facture)
 */
const ligne = {
  
  /**
   * Modifie la quantité d'un article déjà présent dans le document
   * @param {number} id - L'ID de la ligne de commande (ligne_commandes)
   * @param {number} quantite - La nouvelle quantité
   */
  updateQuantity: async (id, quantite) => {
    try {
      const response = await axiosInstance.put(`/api/lignes-commande/${id}`, {
        quantite: quantite
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour' };
    }
  },

  /**
   * Supprime un article du document
   * @param {number} id - L'ID de la ligne de commande
   */
  deleteItem: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/lignes-commande/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression' };
    }
  }
};

export default ligne;