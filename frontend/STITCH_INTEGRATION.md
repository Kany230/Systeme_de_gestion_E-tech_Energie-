# Guide d'intégration Stitch

## Informations du projet

- **URL du projet**: https://stitch.withgoogle.com/projects/14735221948606535872
- **Nom**: Gestion Commerciale Web E-Tech
- **Écran Tableau de Bord**: ID 9ec2c82203aa4699b0a681e8e394d679

## Méthodes pour récupérer les données

### Option 1: Export depuis l'interface Stitch

1. Connectez-vous à https://stitch.withgoogle.com/projects/14735221948606535872
2. Naviguez vers l'écran "Tableau de Bord"
3. Cliquez sur les trois points (...) → "Export" ou "Télécharger"
4. Choisissez le format (HTML, React, etc.)
5. Placez les fichiers exportés dans le dossier `stitch-export/`

### Option 2: Capture d'écran

1. Ouvrez l'écran Tableau de Bord dans Stitch
2. Faites une capture d'écran complète
3. Partagez-la pour que je puisse recréer l'interface exacte

### Option 3: Copier le code directement

1. Ouvrez l'écran dans Stitch
2. Cliquez sur "View code" ou le bouton `</>`
3. Copiez le code HTML/React
4. Partagez-le avec moi

## Structure actuelle du projet

Une fois les données Stitch récupérées, nous les intégrerons dans :

```
src/
├── components/
│   ├── stitch/          # Composants exportés depuis Stitch
│   ├── layout/          # Layout global
│   └── ui/              # Composants UI réutilisables
├── pages/
│   ├── Dashboard.tsx    # À mettre à jour avec Stitch
│   ├── Produits.tsx
│   ├── Clients.tsx
│   └── Commandes.tsx
└── services/            # Services API
```

## Prochaines étapes

1. Récupérer les données Stitch avec l'une des méthodes ci-dessus
2. Analyser la structure et les composants
3. Adapter l'architecture React existante
4. Intégrer avec les services API Laravel
