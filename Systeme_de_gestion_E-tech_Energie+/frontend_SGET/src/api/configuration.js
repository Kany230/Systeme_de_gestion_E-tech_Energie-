import axiosInstance from './axios';

const configService = {
  // Récupérer les paramètres (Nom de l'entreprise, logo, adresse, etc.)
  getConfig: async () => {
    try {
      const response = await axiosInstance.get('/api/configuration');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de chargement de la config' };
    }
  },

  // Mettre à jour les paramètres (avec support du logo via FormData)
  updateConfig: async (data) => {
    try {
      // Si data contient un fichier (logo), on utilise FormData
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      // Note: On utilise souvent POST avec _method=PUT pour le support des fichiers sous Laravel
      const response = await axiosInstance.post('/api/configuration?_method=PUT', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de mise à jour' };
    }
  }
};

export default configService;