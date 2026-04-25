import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/products';
import { getClients } from '../api/clients';
import { getDocuments } from '../api/documents';
import { Package, Users, FileText, TrendingUp, Plus } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({ products: 0, clients: 0, documents: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, clients, documents] = await Promise.all([
          getProducts().catch(() => []),
          getClients().catch(() => []),
          getDocuments().catch(() => [])
        ]);

        setData({
          products: Array.isArray(products) ? products.length : 0,
          clients: Array.isArray(clients) ? clients.length : 0,
          documents: Array.isArray(documents) ? documents.length : 0
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-sm text-slate-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
        Erreur: {error}
      </div>
    );
  }

  const stats = [
    { label: 'Produits', value: data.products, icon: Package, color: 'amber' },
    { label: 'Clients', value: data.clients, icon: Users, color: 'emerald' },
    { label: 'Documents', value: data.documents, icon: FileText, color: 'sky' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tableau de Bord</h1>
        <p className="mt-1 text-sm text-slate-500">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            amber: 'bg-amber-50 text-amber-600 border-amber-200',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
            sky: 'bg-sky-50 text-sky-600 border-sky-200',
          };
          return (
            <div
              key={stat.label}
              className={`relative p-6 rounded-xl border ${colorClasses[stat.color]} overflow-hidden`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="mt-2 text-4xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-slate-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                Total enregistré
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl bg-white border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-3 gap-3">
            <a
              href="/products"
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <Package className="h-4 w-4 mr-2" />
              Nouveau Produit
            </a>
            <a
              href="/clients"
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <Users className="h-4 w-4 mr-2" />
              Nouveau Client
            </a>
            <a
              href="/documents"
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Document
            </a>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Documents Récents</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-slate-400 mr-2" />
                <span className="text-sm text-slate-700">Dernier devis</span>
              </div>
              <span className="text-xs text-slate-400">Aujourd'hui</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-slate-400 mr-2" />
                <span className="text-sm text-slate-700">Dernière facture</span>
              </div>
              <span className="text-xs text-slate-400">Cette semaine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
