# Système de Gestion E-tech Énergie

Frontend React avec TypeScript et Tailwind CSS pour le système de gestion commerciale.

## Structure du Projet

```
frontend/
├── public/              # Assets statiques
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── layout/      # Layout (Navbar, Sidebar, etc.)
│   │   └── ui/          # Composants UI (Button, Card, Input, etc.)
│   ├── pages/           # Pages de l'application
│   ├── services/        # Services API
│   ├── hooks/           # Hooks personnalisés
│   ├── types/           # Types TypeScript
│   └── utils/           # Fonctions utilitaires
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## Architecture Modulaire

Le projet utilise une architecture modulaire avec séparation des responsabilités :

- **Components**: Composants UI réutilisables et layouts
- **Pages**: Vues principales de l'application
- **Services**: Couche d'accès aux API (auth, produits, clients, commandes)
- **Hooks**: Hooks personnalisés pour la gestion d'état
- **Types**: Définitions TypeScript partagées

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à la racine:

```
VITE_API_URL=http://localhost:8000/api
```

## Démarrage

```bash
npm run dev
```

## Build

```bash
npm run build
```
