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
            font-size: 11pt; 
            color: #333; 
            margin: 0; 
            padding: 0;
            line-height: 1.4;
        }
        .container { padding: 40px; }
        
        /* Header & Logo */
        .header { margin-bottom: 50px; }
        .brand { float: left; }
        .brand-name { font-size: 24pt; font-weight: bold; margin: 0; }
        .e-blue { color: #0056b3; } /* Le 'e' en bleu */
        .company-details { font-size: 9pt; color: #666; margin-top: 5px; }
        
        .doc-meta { float: right; text-align: right; }
        .doc-type { 
            font-size: 18pt; 
            font-weight: bold; 
            color: #0056b3; 
            text-transform: uppercase; 
            margin-bottom: 5px;
        }

        /* Infos Client & Objet */
        .info-section { margin-bottom: 40px; }
        .client-box { 
            float: left; 
            width: 45%; 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 8px; 
        }
        .object-box { 
            float: right; 
            width: 45%; 
            text-align: right; 
            padding: 15px;
        }
        .label { font-size: 9pt; color: #888; text-transform: uppercase; margin-bottom: 5px; display: block; }
        
        /* Table */
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { 
            background-color: #0056b3; 
            color: white; 
            padding: 12px 10px; 
            text-align: left; 
            font-size: 10pt;
            border: none;
        }
        td { padding: 12px 10px; border-bottom: 1px solid #eee; }
        .text-right { text-align: right; }
        
        /* Totaux */
        .footer-section { margin-top: 30px; }
        .mention-lettres { float: left; width: 55%; font-style: italic; font-size: 10pt; color: #555; }
        .totals-box { float: right; width: 35%; }
        .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .grand-total { 
            font-size: 14pt; 
            font-weight: bold; 
            color: #0056b3; 
            border-top: 2px solid #0056b3; 
            margin-top: 10px; 
            padding-top: 10px; 
        }

        .signature-section { margin-top: 80px; text-align: right; }
        .signature-box { display: inline-block; width: 200px; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }

        .clear { clear: both; }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <div class="brand">
            <h1 class="brand-name"><span class="e-blue">e</span>-Tech Energie +</h1>
            <div class="company-details">
                NINEA : {{ $config->ninea }}<br>
                {{ $config->adresse }}<br>
                Tél : {{ $config->telephone }} | Email : etechenergieplus@gmail.com
            </div>
        </div>
        <div class="doc-meta">
            <div class="doc-type">
                @if($document->type == 'facture') Facture 
                @elseif($document->type == 'devis') Devis
                @else Bon de Livraison @endif
            </div>
            <div>N° {{ $document->numeroDoc }}</div>
            <div style="color: #888;">Date : {{ \Carbon\Carbon::parse($document->dateDoc)->format('d/m/Y') }}</div>
        </div>
        <div class="clear"></div>
    </div>

    <div class="info-section">
        <div class="client-box">
            <span class="label">Facturé à</span>
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
            <span class="label">Objet</span>
            <strong>{{ $document->objet }}</strong>
        </div>
        @endif
        <div class="clear"></div>
    </div>

    <table>
        <thead>
            <tr>
                @if($document->type == 'devis')
                    <th>Quantité</th>
                    <th>Désignation</th>
                    <th class="text-right">P. Unitaire (FCFA)</th>
                @else
                    <th>Désignation</th>
                    <th class="text-right">P. Unitaire (FCFA)</th>
                    <th class="text-right">Quantité</th>
                @endif
                <th class="text-right">Total (FCFA)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($document->ligneDocument as $ligne)
            <tr>
                @if($document->type == 'devis')
                    <td>{{ $ligne->quantite }}</td>
                    <td>{{ $ligne->produit->nom }}</td>
                    <td class="text-right">{{ number_format($ligne->prixUnitaire, 0, ',', ' ') }}</td>
                @else
                    <td>{{ $ligne->produit->nom }}</td>
                    <td class="text-right">{{ number_format($ligne->prixUnitaire, 0, ',', ' ') }}</td>
                    <td class="text-right">{{ $ligne->quantite }}</td>
                @endif
                <td class="text-right">{{ number_format($ligne->sousTotal, 0, ',', ' ') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer-section">
        <div class="mention-lettres">
            <p>Arrêté la présente {{ $document->type }} à la somme de :<br>
            <strong>{{ ucfirst($document->prixTotalEnLettres) }} Francs CFA.</strong></p>
            <p style="font-size: 8pt; color: #aaa; margin-top: 20px;">
                Fait à Thiès, le {{ \Carbon\Carbon::parse($document->dateDoc)->format('d/m/Y') }}
            </p>
        </div>

        <div class="totals-box">
            <div class="total-row">
                <span>Total Matériel :</span>
                <span class="text-right">{{ number_format($document->prixTotal, 0, ',', ' ') }}</span>
            </div>
            @if($document->main_doeuvre > 0)
            <div class="total-row">
                <span>Main d'œuvre :</span>
                <span class="text-right">{{ number_format($document->main_doeuvre, 0, ',', ' ') }}</span>
            </div>
            @endif
            @if($document->taxe > 0)
            <div class="total-row">
                <span>TVA ({{ $document->taxe }}%) :</span>
                <span class="text-right">{{ number_format(($document->prixTotal + $document->main_doeuvre) * ($document->taxe/100), 0, ',', ' ') }}</span>
            </div>
            @endif
            <div class="total-row grand-total">
                <span>TOTAL :</span>
                <span class="text-right">
                    @php
                        $totalFinal = ($document->prixTotal + $document->main_doeuvre) * (1 + ($document->taxe/100));
                    @endphp
                    {{ number_format($totalFinal, 0, ',', ' ') }} FCFA
                </span>
            </div>
        </div>
        <div class="clear"></div>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <strong>Le Gérant</strong><br>
            <small style="color: #ccc;">(Signature et Cachet)</small>
        </div>
    </div>
</div>

</body>
</html>