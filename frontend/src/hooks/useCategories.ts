import { useEffect, useState, useCallback } from 'react';
import { catalogueService } from '../services/catalogue.service';
import type { Categorie } from '../types';

export function useCategories() {
    const [categories, setCategories] = useState<Categorie[]>([]);  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //Fonction isolee pour charger/recharger les données
    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            const data = await catalogueService.getAllCategories();
            const formatData = data.map((cat: any) => ({
                ...cat,
                produitsCount: cat.produits_count ?? cat.produitsCount ?? 0
            }));
            setCategories(formatData);
            setError(null);
        } catch (err: any) {
            console.error('Erreur lors du chargement des catégories:', err);
            setError(err.message || 'Impossible de charger les catégories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    //Création
    const addCategory = async (nom: string, description?: string) => {
        try {
            const newCat = await catalogueService.createCategorie({ nom, description });
            await loadCategories();
            return newCat;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Erreur lors de la création');
        }
    };

    //Suppression
    const removeCategory = async (id: number) => {
        try {
            await catalogueService.deleteCategorie(id); 
            setCategories(prev => prev.filter(cat => cat.id !== id));
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    return { 
        categories, 
        loading, 
        error, 
        refetch: loadCategories, 
        addCategory, 
        removeCategory 
    };
}