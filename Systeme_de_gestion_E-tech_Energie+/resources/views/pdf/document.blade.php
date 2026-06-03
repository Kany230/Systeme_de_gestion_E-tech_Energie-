<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ strtoupper($document->type ?? 'DOCUMENT') }} - {{ $document->numeroDoc ?? '' }}</title>
    <style>
        @page { 
            margin: 15mm 15mm 20mm 15mm; 
        }
        body { 
            font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; 
            font-size: 10pt; 
            color: #1e293b; 
            margin: 0; 
            padding: 0;
            line-height: 1.5;
        }
        
        /* Corporate Color Palette */
        .text-primary { color: #1e3a8a; } /* Bleu Marine Profond */
        .text-secondary { color: #2563eb; } /* Bleu Énergie */
        .text-muted { color: #64748b; }
        
        /* Header Structure */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 35px;
        }
        .header-table td {
            padding: 0;
            border: none;
            vertical-align: top;
        }
        .brand-name { 
            font-size: 24pt; 
            font-weight: 800; 
            margin: 0; 
            text-transform: uppercase; 
            letter-spacing: -0.5px;
            color: #0f172a;
        }
        .company-details { 
            font-size: 9pt; 
            color: #475569; 
            margin-top: 10px; 
            line-height: 1.6; 
        }
        .doc-meta { 
            text-align: right; 
        }
        .doc-type { 
            font-size: 20pt; 
            font-weight: 800; 
            color: #2563eb; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        .doc-number {
            font-size: 12pt;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 5px;
        }

        /* Information Boxes */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        .info-table td {
            padding: 0;
            border: none;
            vertical-align: top;
            width: 50%;
        }
        .client-box { 
            background: #f8fafc; 
            padding: 18px; 
            border-radius: 8px; 
            border-left: 4px solid #2563eb;
            margin-right: 15px;
        }
        .object-box { 
            padding: 18px;
            text-align: right;
        }
        .label { 
            font-size: 8pt; 
            color: #94a3b8; 
            text-transform: uppercase; 
            margin-bottom: 6px; 
            display: block; 
            font-weight: 700; 
            letter-spacing: 0.5px;
        }
        
        /* Professional Invoice Table */
        table.items-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px; 
        }
        table.items-table th { 
            background-color: #0f172a; 
            color: #ffffff; 
            padding: 12px 10px; 
            text-align: left; 
            font-size: 8.5pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        table.items-table td { 
            padding: 12px 10px; 
            border-bottom: 1px solid #e2e8f0; 
            font-size: 9.5pt; 
            color: #334155;
        }
        table.items-table tr:nth-child(even) td {
            background-color: #f8fafc;
        }
        .text-right { text-align: right !important; }
        .text-center { text-align: center !important; }
        
        /* Summary & Totals Breakdown */
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 35px;
        }
        .summary-table td {
            padding: 0;
            border: none;
            vertical-align: top;
        }
        .mention-lettres { 
            width: 55%; 
            font-style: italic; 
            font-size: 9pt; 
            color: #475569; 
            padding-right: 20px;
            line-height: 1.6;
        }
        .totals-box { 
            width: 45%; 
        }
        .total-row-table {
            width: 100%;
            border-collapse: collapse;
        }
        .total-row-table td {
            padding: 6px 10px;
            font-size: 9.5pt;
        }
        .total-label { 
            text-align: right; 
            color: #64748b;
            font-weight: 500;
        }
        .total-amount { 
            text-align: right; 
            font-weight: 700; 
            color: #1e293b;
            width: 40%;
        }
        .grand-total td { 
            font-size: 13pt; 
            color: #2563eb; 
            border-top: 2px dashed #cbd5e1; 
            border-bottom: 2px solid #2563eb;
            padding: 12px 10px; 
            font-weight: 800;
        }

        /* Authenticity & Signature Section */
        .signature-section { 
            margin-top: 50px; 
            text-align: right; 
        }
        .signature-box { 
            display: inline-block; 
            width: 220px; 
            text-align: center; 
        }
        .signature-line { 
            border-top: 1px solid #94a3b8; 
            margin-top: 60px; 
            padding-top: 8px; 
            font-size: 9pt;
            font-weight: 700; 
            color: #475569;
        }

        /* Fixed Legal Notice Footer */
        .legal-footer {
            position: fixed;
            bottom: 0px;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 8pt;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
        }
    </style>
</head>
<body>

<div class="container">
    
    <table class="header-table">
        <tr>
            <td>
                @if(isset($config->logo) && $config->logo)
                    <img src="{{ public_path('storage/' . $config->logo) }}" alt="Logo" style="max-height: 65px; margin-bottom: 12px;">
                @else
                    <h1 class="brand-name">
                        <span class="text-secondary">{{ substr($config->nomSociete ?? 'E', 0, 1) }}</span>{{ substr($config->nomSociete ?? 'tech Energie+', 1) }}
                    </h1>
                @endif
                <div class="company-details">
                    <strong>{{ $config->nomSociete ?? 'E-Tech Energie+' }}</strong><br>
                    NINEA : {{ $config->ninea ?? 'N/A' }}<br>
                    {{ $config->adresse ?? 'Thiès, Sénégal' }}<br>
                    Tél : {{ $config->contact ?? '' }} | Email : {{ $config->email ?? '' }}
                </div>
            </td>
            <td class="doc-meta">
                <div class="doc-type">
                    @if(($document->type ?? '') == 'facture') Facture 
                    @elseif(($document->type ?? '') == 'devis') Devis
                    @else Bon de Livraison @endif
                </div>
                <div class="doc-number">N° {{ $document->numeroDoc ?? 'Inconnu' }}</div>
                <div class="text-muted" style="font-size: 9.5pt;">Date : {{ isset($document->dateDoc) ? \Carbon\Carbon::parse($document->dateDoc)->format('d/m/Y') : date('d/m/Y') }}</div>
            </td>
        </tr>
    </table>

    <table class="info-table">
        <tr>
            <td>
                <div class="client-box">
                    <span class="label">Adressé à</span>
                    @if(isset($document->client))
                        @if($document->client->type_client === 'entreprise')
                            <strong style="font-size: 11pt; color: #0f172a;">{{ $document->client->nom_entreprise }}</strong><br>
                            <span class="text-muted" style="font-size: 8.5pt;">NINEA : {{ $document->client->ninea ?? 'N/A' }}</span><br>
                        @else
                            <strong style="font-size: 11pt; color: #0f172a;">{{ $document->client->prenom }} {{ $document->client->nom }}</strong><br>
                        @endif
                        <span style="color: #334155;">
                            {{ $document->client->addresse }}<br>
                            Tél : {{ $document->client->telephone }}
                        </span>
                    @else
                        <strong style="color: #ef4444;">Client non renseigné</strong>
                    @endif
                </div>
            </td>
            <td>
                @if(!empty($document->objet))
                <div class="object-box">
                    <span class="label">Objet du document</span>
                    <strong style="color: #1e293b; font-size: 10.5pt;">{{ $document->objet }}</strong>
                </div>
                @endif
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th width="8%" class="text-center">Qté</th>
                <th width="54%">Désignation</th>
                <th width="19%" class="text-right">P.U (FCFA)</th>
                <th width="19%" class="text-right">Total (FCFA)</th>
            </tr>
        </thead>
        <tbody>
            @if(isset($document->ligneDocument) && count($document->ligneDocument) > 0)
                @foreach($document->ligneDocument as $ligne)
                <tr>
                    <td class="text-center" style="font-weight: 600;">{{ $ligne->quantite }}</td>
                    <td>
                        <strong style="color: #0f172a;">{{ $ligne->produit->nom ?? 'Produit indéfini' }}</strong>
                        @if($ligne->description)<br><span class="text-muted" style="font-size: 8.5pt;">{{ $ligne->description }}</span>@endif
                    </td>
                    <td class="text-right">{{ number_format($ligne->prixUnitaire ?? 0, 0, ',', ' ') }}</td>
                    <td class="text-right" style="font-weight: 600;">{{ number_format($ligne->sousTotal ?? 0, 0, ',', ' ') }}</td>
                </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="4" class="text-center text-muted" style="padding: 30px;">Aucun élément enregistré sur ce document</td>
                </tr>
            @endif
        </tbody>
    </table>

    <table class="summary-table">
        <tr>
            <td class="mention-lettres">
                <p style="margin-top: 0;">Arrêté la présente {{ $document->type ?? 'pièce' }} à la somme de :<br>
                <strong class="text-primary" style="font-size: 10.5pt;">{{ ucfirst($document->prixTotalEnLettres ?? 'zéro') }} Francs CFA.</strong></p>
                
                <p class="text-muted" style="font-size: 8.5pt; margin-top: 25px;">
                    Fait à Thiès, le {{ isset($document->dateDoc) ? \Carbon\Carbon::parse($document->dateDoc)->format('d/m/Y') : date('d/m/Y') }}
                </p>
            </td>
            <td class="totals-box">
                <table class="total-row-table">
                    <tr>
                        <td class="total-label">Total Partiel :</td>
                        <td class="total-amount">{{ number_format($document->prixTotal ?? 0, 0, ',', ' ') }}</td>
                    </tr>
                    
                    @if(($document->main_doeuvre ?? 0) > 0)
                    <tr>
                        <td class="total-label">Main d'œuvre :</td>
                        <td class="total-amount">{{ number_format($document->main_doeuvre, 0, ',', ' ') }}</td>
                    </tr>
                    @endif

                    @php
                        $baseCalcul = ($document->prixTotal ?? 0) + ($document->main_doeuvre ?? 0);
                        $taxePourcent = $document->taxe ?? 0;
                        $montantTaxe = $taxePourcent > 0 ? $baseCalcul * ($taxePourcent / 100) : 0;
                        $totalFinal = $baseCalcul + $montantTaxe;
                    @endphp

                    @if($taxePourcent > 0)
                    <tr>
                        <td class="total-label">TVA ({{ $taxePourcent }}%) :</td>
                        <td class="total-amount">{{ number_format($montantTaxe, 0, ',', ' ') }}</td>
                    </tr>
                    @endif

                    <tr class="grand-total">
                        <td class="total-label" style="color: #2563eb;">NET À PAYER :</td>
                        <td class="total-amount">{{ number_format($totalFinal, 0, ',', ' ') }} FCFA</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <div class="signature-section">
        <div class="signature-box">
            <strong style="color: #0f172a; font-size: 10pt;">Le Gérant</strong>
            <div class="signature-line">
                @if(isset($config->nomSociete)) {{ $config->nomSociete }} @else E-Tech Energie+ @endif
            </div>
        </div>
    </div>
</div>

<div class="legal-footer">
    {{ $config->nomSociete ?? 'E-Tech Energie+' }} - NINEA : {{ $config->ninea ?? 'N/A' }} - {{ $config->phraseLegale ?? 'Tous nos produits sont garantis constructeur.' }}
</div>

</body>
</html>