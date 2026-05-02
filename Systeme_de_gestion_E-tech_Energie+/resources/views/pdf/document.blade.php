<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ strtoupper($document->type) }} - {{ $document->numeroDoc }}</title>
    <style>
        @page { margin: 0; }
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            font-size: 10pt; 
            color: #333; 
            margin: 0; 
            padding: 0;
            line-height: 1.4;
        }
        .container { padding: 30px 40px; }
        
        /* Header & Logo */
        .header { margin-bottom: 40px; min-height: 120px; }
        .brand { float: left; width: 60%; }
        .brand-name { font-size: 22pt; font-weight: bold; margin: 0; text-transform: uppercase; }
        .e-blue { color: #0056b3; }
        .company-details { font-size: 9pt; color: #555; margin-top: 8px; line-height: 1.5; }
        
        .doc-meta { float: right; text-align: right; width: 35%; }
        .doc-type { 
            font-size: 18pt; 
            font-weight: bold; 
            color: #0056b3; 
            text-transform: uppercase; 
            margin-bottom: 5px;
        }

        /* Infos Client & Objet */
        .info-section { margin-bottom: 30px; }
        .client-box { 
            float: left; 
            width: 45%; 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 8px; 
            min-height: 100px;
        }
        .object-box { 
            float: right; 
            width: 45%; 
            text-align: right; 
            padding: 15px;
        }
        .label { font-size: 8pt; color: #888; text-transform: uppercase; margin-bottom: 5px; display: block; font-weight: bold; }
        
        /* Table */
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { 
            background-color: #0056b3; 
            color: white; 
            padding: 10px; 
            text-align: left; 
            font-size: 9pt;
            text-transform: uppercase;
        }
        td { padding: 10px; border-bottom: 1px solid #eee; font-size: 10pt; }
        .text-right { text-align: right; }
        
        /* Totaux */
        .footer-section { margin-top: 30px; }
        .mention-lettres { float: left; width: 55%; font-style: italic; font-size: 9pt; color: #555; }
        .totals-box { float: right; width: 40%; }
        .total-row { padding: 4px 0; clear: both; }
        .total-label { float: left; width: 60%; text-align: right; padding-right: 10px; }
        .total-amount { float: right; width: 35%; text-align: right; font-weight: bold; }
        
        .grand-total { 
            font-size: 13pt; 
            color: #0056b3; 
            border-top: 2px solid #0056b3; 
            margin-top: 10px; 
            padding-top: 10px; 
        }

        .signature-section { margin-top: 60px; text-align: right; }
        .signature-box { display: inline-block; width: 200px; text-align: center; }
        .signature-line { border-top: 1px solid #333; margin-top: 50px; padding-top: 5px; font-weight: bold; }

        .legal-footer {
            position: fixed;
            bottom: 20px;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 8pt;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }

        .clear { clear: both; }
    </style>
</head>
<body>

<div class="container">
    <!-- EN-TETE DYNAMIQUE -->
    <div class="header">
        <div class="brand">
            @if($config->logo)
                <img src="{{ public_path('storage/' . $config->logo) }}" alt="Logo" style="max-height: 70px; margin-bottom: 10px;">
            @else
                <h1 class="brand-name">
                    <span class="e-blue">{{ substr($config->nomSociete, 0, 1) }}</span>{{ substr($config->nomSociete, 1) }}
                </h1>
            @endif
            <div class="company-details">
                <strong>{{ $config->nomSociete }}</strong><br>
                NINEA : {{ $config->ninea }}<br>
                {{ $config->adresse }}<br>
                Tél : {{ $config->contact }} | Email : {{ $config->email }}
            </div>
        </div>
        
        <div class="doc-meta">
            <div class="doc-type">
                @if($document->type == 'facture') Facture 
                @elseif($document->type == 'devis') Devis
                @else Bon de Livraison @endif
            </div>
            <div style="font-size: 12pt; font-weight: bold;">N° {{ $document->numeroDoc }}</div>
            <div style="color: #666;">Date : {{ \Carbon\Carbon::parse($document->dateDoc)->format('d/m/Y') }}</div>
        </div>
        <div class="clear"></div>
    </div>

    <!-- INFOS CLIENT -->
    <div class="info-section">
        <div class="client-box">
            <span class="label">Adressé à</span>
            @if($document->client->type_client === 'entreprise')
                <strong>{{ $document->client->nom_entreprise }}</strong><br>
                <small>NINEA : {{ $document->client->ninea }}</small><br>
            @else
                <strong>{{ $document->client->prenom }} {{ $document->client->nom }}</strong><br>
            @endif
            {{ $document->client->addresse }}<br>
            Tél : {{ $document->client->telephone }}
        </div>
        
        @if($document->objet)
        <div class="object-box">
            <span class="label">Objet du document</span>
            <strong>{{ $document->objet }}</strong>
        </div>
        @endif
        <div class="clear"></div>
    </div>

    <!-- TABLEAU DES PRODUITS -->
    <table>
        <thead>
            <tr>
                <th width="10%">Qté</th>
                <th width="50%">Désignation</th>
                <th width="20%" class="text-right">P.U (FCFA)</th>
                <th width="20%" class="text-right">Total (FCFA)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($document->ligneDocument as $ligne)
            <tr>
                <td>{{ $ligne->quantite }}</td>
                <td>
                    <strong>{{ $ligne->produit->nom }}</strong>
                    @if($ligne->description)<br><small>{{ $ligne->description }}</small>@endif
                </td>
                <td class="text-right">{{ number_format($ligne->prixUnitaire, 0, ',', ' ') }}</td>
                <td class="text-right">{{ number_format($ligne->sousTotal, 0, ',', ' ') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- TOTAL ET ARRETE EN LETTRES -->
    <div class="footer-section">
        <div class="mention-lettres">
            <p>Arrêté la présente {{ $document->type }} à la somme de :<br>
            <strong style="color: #333;">{{ ucfirst($document->prixTotalEnLettres) }} Francs CFA.</strong></p>
            <p style="font-size: 8pt; color: #999; margin-top: 15px;">
                Fait à Thiès, le {{ \Carbon\Carbon::parse($document->dateDoc)->format('d/m/Y') }}
            </p>
        </div>

        <div class="totals-box">
            <div class="total-row">
                <span class="total-label">Total Partiel :</span>
                <span class="total-amount">{{ number_format($document->prixTotal, 0, ',', ' ') }}</span>
            </div>
            
            @if($document->main_doeuvre > 0)
            <div class="total-row">
                <span class="total-label">Main d'œuvre :</span>
                <span class="total-amount">{{ number_format($document->main_doeuvre, 0, ',', ' ') }}</span>
            </div>
            @endif

            @php
                $baseCalcul = $document->prixTotal + $document->main_doeuvre;
                $montantTaxe = $document->taxe > 0 ? $baseCalcul * ($document->taxe / 100) : 0;
                $totalFinal = $baseCalcul + $montantTaxe;
            @endphp

            @if($document->taxe > 0)
            <div class="total-row">
                <span class="total-label">TVA ({{ $document->taxe }}%) :</span>
                <span class="total-amount">{{ number_format($montantTaxe, 0, ',', ' ') }}</span>
            </div>
            @endif

            <div class="total-row grand-total">
                <span class="total-label">NET À PAYER :</span>
                <span class="total-amount" style="font-size: 14pt;">{{ number_format($totalFinal, 0, ',', ' ') }} FCFA</span>
            </div>
        </div>
        <div class="clear"></div>
    </div>

    <!-- SIGNATURE -->
    <div class="signature-section">
        <div class="signature-box">
            <strong>Le Gérant</strong>
            <div class="signature-line">
                @if($config->nomSociete) {{ $config->nomSociete }} @endif
            </div>
        </div>
    </div>
</div>

<!-- PIED DE PAGE LEGAL -->
<div class="legal-footer">
    {{ $config->nomSociete }} - NINEA : {{ $config->ninea }} - {{ $config->phraseLegale }}
</div>

</body>
</html>