/* ==========================================================================
   ShopStock - Inventory Management Core JavaScript
   ========================================================================== */

import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_TRANSACTIONS } from './mock-data.js';

// ==========================================================================
// SUPABASE CLOUD DATABASE CONFIGURATION
// ==========================================================================
const SUPABASE_URL = "https://youqcojurypydzjfhlqq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXFjb2p1cnlweWR6amZobHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MDY4MTQsImV4cCI6MjA5Nzk4MjgxNH0.XJ27UrijnJb33MUlMCzu_D1Z2m9JfwI_XYjG0IXEI84";
const DOWNLOAD_INSTALLER_URL = "#"; // Replace with your actual installer download url when hosting

let supabase = null;
let isCloudEnabled = false;
let isDemoMode = false;

if (SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY") {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    isCloudEnabled = true;
    console.log("ShopStock Cloud: Supabase initialized successfully.");
  } catch (err) {
    console.error("ShopStock Cloud: Failed to initialize Supabase client:", err);
  }
} else {
  console.warn("ShopStock Cloud: Supabase credentials not set. Running in Local Offline-Only Mode.");
}

// ==========================================================================
// TRANSLATION DICTIONARY
// ==========================================================================

const TRANSLATIONS = {
  en: {
    // Navigation
    'inventory-hub': "Inventory Hub",
    'nav-dashboard': "Dashboard",
    'nav-products': "Products",
    'nav-history': "History Log",
    'nav-categories': "Categories",
    'nav-settings': "Settings",
    'nav-logout': "Log Out",
    'theme-mode': "Theme Mode",
    
    // Auth UI
    'auth-login-title': "Log In",
    'auth-login-desc': "Enter your credentials to access ShopStock.",
    'auth-signup-title': "Create Account",
    'auth-signup-desc': "Create a free shop inventory manager account.",
    'auth-email-label': "Email Address",
    'auth-password-label': "Password",
    'auth-shop-label': "Shop Name",
    'auth-toggle-signup': "Don't have an account? Sign Up",
    'auth-toggle-login': "Already have an account? Log In",
    'auth-btn-login': "Log In",
    'auth-btn-signup': "Sign Up",
    'toast-signup-success': "Account created successfully! Check your email to confirm.",
    'toast-login-success': "Logged in successfully!",
    'toast-login-failed': "Authentication failed: {error}",
    
    // Dashboard
    'dashboard-desc': "Here is an overview of your shop's stock metrics.",
    'add-product': "Add Product",
    'total-products': "Total Products",
    'low-stock-alerts': "Low Stock Alerts",
    'total-value-cost': "Total Value (Cost)",
    'est-profit-margin': "Est. Profit Margin",
    'inventory-analytics': "Inventory Analytics",
    'value-by-category': "Value by Category",
    'stock-levels': "Stock Levels",
    
    // Inventory
    'product-catalog': "Product Catalog",
    'product-catalog-desc': "Manage and track all inventory items.",
    'search-products-placeholder': "Search by name, SKU, or description...",
    'all-categories': "All Categories",
    'all-stock-status': "All Stock Status",
    'in-stock': "In Stock (Good)",
    'low-stock-status': "Low Stock",
    'out-of-stock-status': "Out of Stock",
    'sku': "SKU",
    'product-name': "Product Name",
    'category': "Category",
    'cost-price': "Cost Price",
    'retail-price': "Retail Price",
    'stock-qty': "Stock Qty",
    'margin': "Margin",
    'status': "Status",
    'actions': "Actions",
    
    // History
    'history-log': "History Log",
    'history-log-desc': "Audit trail of all inventory additions, sales, and corrections.",
    'clear-log': "Clear Log",
    'search-tx-placeholder': "Search transactions by product or SKU...",
    'all-tx-types': "All Transaction Types",
    'inbound-type': "Inbound (Stock In)",
    'outbound-type': "Outbound (Stock Out)",
    'adjustments-type': "Adjustments",
    'date-time': "Date & Time",
    'type': "Type",
    'qty-change': "Qty Change",
    'reason-notes': "Reason / Notes",
    
    // Categories
    'categories-desc': "Classify products to organize your stock and filter lists.",
    'add-new-category': "Add New Category",
    'category-name': "Category Name",
    'category-placeholder': "e.g. Footwear",
    'add-category-btn': "Add Category",
    'active-categories': "Active Categories",
    
    // Settings
    'settings-app-title': "Application Settings",
    'settings-app-desc': "Configure preferences and manage inventory backup operations.",
    'settings-shop-customization': "Shop Customization",
    'shop-name': "Shop Name",
    'currency-symbol': "Currency Symbol",
    'language': "Language",
    'save-shop-preferences': "Save Shop Preferences",
    'settings-backup-recovery': "Data Backup & Recovery",
    'settings-backup-desc': "Backup your inventory, categories, and audit trail regularly. All data is saved on your device and can be re-imported anytime.",
    'settings-export-btn': "Export Data Backup (.json)",
    'settings-import-btn': "Import Data Backup (.json)",
    'settings-danger-zone': "Danger Zone",
    'settings-danger-desc': "Resetting will wipe all inventory transactions and custom products. You can choose to load the sample demo mock data instead.",
    'settings-reset-demo': "Reset to Sample Demo",
    'settings-wipe-data': "Wipe All Data",
    
    // Modals
    'modal-add-product': "Add New Product",
    'modal-edit-product': "Edit Product Details",
    'modal-prod-name': "Product Name *",
    'modal-prod-sku': "SKU / Barcode *",
    'modal-prod-sku-placeholder': "e.g. WRLS-CHG",
    'modal-prod-category': "Category *",
    'modal-prod-desc': "Description",
    'modal-prod-desc-placeholder': "Enter short details about the product...",
    'modal-prod-cost': "Buying Price (Cost) *",
    'modal-prod-retail': "Selling Price (Retail) *",
    'modal-prod-qty': "Initial Stock Qty *",
    'modal-prod-min': "Min Stock Limit (Reorder Point) *",
    'modal-btn-cancel': "Cancel",
    'modal-btn-save': "Save Product",
    
    'modal-adjust-stock': "Adjust Product Stock",
    'modal-adjust-name': "Product Name",
    'modal-adjust-current': "Current Stock Qty",
    'modal-adjust-type': "Adjustment Type",
    'modal-adjust-add': "Add Stock (+)",
    'modal-adjust-sub': "Reduce / Write off (-)",
    'modal-adjust-change': "Quantity Change *",
    'modal-adjust-change-placeholder': "Enter amount",
    'modal-adjust-reason': "Reason for Change *",
    'modal-adjust-notes': "Additional Notes",
    'modal-adjust-notes-placeholder': "e.g. Supplier invoice #3991, or custom sale info",
    'modal-adjust-btn': "Process Adjustment",
    
    // Notifications & Statuses
    'status-good': "Good Stock",
    'status-low': "Low Stock",
    'status-out': "Out of Stock",
    'item-count-singular': "item",
    'item-count-plural': "items",
    'category-count-singular': "category",
    'category-count-plural': "categories",
    'requires-attention': "Requires attention",
    'healthy-levels': "All stock levels healthy",
    'retail-val-label': "Retail Value: ",
    'potential-profit-label': "Potential Profit: ",
    'no-data': "No Data",
    'chart-products-count': "Products Count",
    'no-low-stock': "No Low Stock Items",
    'inventory-healthy-desc': "Your inventory is healthy!",
    'restock-btn': "Restock",
    
    // Empty tables
    'no-products-found': "No Products Found",
    'no-products-found-desc': "Try altering your filters, search term, or add a brand new product.",
    'no-tx-logged': "No Transactions Logged",
    'no-tx-logged-desc': "All stock changes, sales, and corrections will show up here.",
    'no-categories': "No Categories",
    'no-categories-desc': "Add classification categories to organize your shop inventory.",
    
    // Alert dialogs
    'confirm-delete-category': 'Are you sure you want to delete the category "{name}"?',
    'confirm-delete-product': 'Are you sure you want to delete "{name}"? This wipes its inventory records.',
    'confirm-clear-history': 'Are you sure you want to clear the transactions log? Product counts will not change, but history will be wiped.',
    'confirm-reset-demo': 'This will overwrite all your current modifications and reload the sample shop products. Proceed?',
    'confirm-wipe-all': 'WARNING: Are you absolutely sure you want to delete ALL inventory, custom categories, and transactions? This cannot be undone.',
    
    // Toasts
    'toast-demo-loaded': "Sample demo data loaded successfully!",
    'toast-data-wiped': "All data wiped.",
    'toast-sku-exists': 'A product with SKU "{sku}" already exists.',
    'toast-details-updated': "Product details updated successfully.",
    'toast-product-added': 'Product "{name}" added.',
    'toast-qty-min': "Stock quantity cannot go below 0.",
    'toast-stock-updated': 'Stock updated for "{name}". Current Qty: {qty}',
    'toast-cat-exists': 'Category "{name}" already exists.',
    'toast-cat-added': 'Category "{name}" added successfully.',
    'toast-pref-saved': "Preferences saved.",
    'toast-cat-deleted': 'Category "{name}" deleted.',
    'toast-cat-has-products': 'Cannot delete category "{name}" because it contains {count} products.',
    'toast-prod-deleted': 'Product "{name}" has been deleted.',
    'toast-backup-downloaded': "Inventory backup downloaded.",
    'toast-backup-restored': "Data backup successfully restored!",
    'toast-backup-invalid': "Invalid backup file structure. Properties missing.",
    'toast-backup-error': "Error parsing backup JSON file.",
    'toast-history-cleared': "Transaction history cleared.",
    
    // Reasons In
    'Supplier Delivery': "Supplier Delivery",
    'Customer Return': "Customer Return",
    'Inventory Audit Corrective Add': "Inventory Audit Corrective Add",
    'Sample/Gift Inflow': "Sample/Gift Inflow",
    'Other Inbound Restock': "Other Inbound Restock",
    
    // Reasons Out
    'Customer Sale': "Customer Sale",
    'Damaged Item Write-off': "Damaged Item Write-off",
    'Theft/Loss Write-off': "Theft/Loss Write-off",
    'Inventory Audit Corrective Deduct': "Inventory Audit Corrective Deduct",
    'Sample/Promo Outflow': "Sample/Promo Outflow",
    'Other Outbound deduction': "Other Outbound deduction",
    
    // Special
    'Initial stock load': "Initial stock load",
    'Inbound': "Inbound",
    'Outbound': "Outbound",
    'Adjustment': "Adjustment",
    'associated-products': "associated products",
    'print-report': "Print Report",
    'print-receipt': "Print Receipt",
    'inventory-report-title': "Inventory Level Report",
    'receipt-title': "Transaction Receipt",
    'generated-on': "Generated on",
    'authorized-signature': "Authorized Signature",
    'total-cost-value': "Total Cost Value",
    'total-retail-value': "Total Retail Value",
    'total-margin': "Estimated Average Margin",
    'product': "Product",
    'qty': "Qty",
    'rate': "Rate",
    'total': "Total",
    'transaction-details': "Transaction Details",
    'clear-cart': "Clear Cart",
    'toast-csv-exported': "Products exported to CSV.",
    'auth-try-demo': "Try Demo (Local Mode)",
    'auth-view-pricing': "View Pricing",
    'download-desktop': "Download for Windows (.exe)",
    'download-desktop-app': "Download Desktop App (.exe)",
    'pricing-title': "ShopStock Pricing Plans",
    'price-free-title': "Local Solo",
    'price-cloud-title': "Cloud Sync",
    'price-period-forever': "/ lifetime",
    'price-period-month': "/ month",
    'price-free-desc': "For independent usage on a single computer.",
    'price-cloud-desc': "Sync stocks in real-time across PCs and mobiles.",
    'price-feat-products': "Unlimited products",
    'price-feat-local': "Secure local storage",
    'price-feat-backup': "CSV Export and JSON backups",
    'price-feat-cloud': "No cloud synchronization",
    'price-feat-devices': "Single device limit",
    'price-feat-sync': "Cloud Sync (Supabase)",
    'price-feat-devices-unlimited': "Unlimited devices (PC, mobiles)",
    'price-feat-support': "Priority support",
    'price-btn-free': "Activate Demo Mode",
    'price-btn-subscribe': "Subscribe Now",
    'demo-banner-text': "Demo Mode active (Data is saved locally on this device)",
    'demo-banner-login': "Sign In",
    'notification-low-stock-title': "Low Stock Alert",
    'toast-demo-activated': "Demo Mode activated!"
  },
  fr: {
    // Navigation
    'inventory-hub': "Centre d'Inventaire",
    'nav-dashboard': "Tableau de bord",
    'nav-products': "Produits",
    'nav-history': "Historique",
    'nav-categories': "Catégories",
    'nav-settings': "Paramètres",
    'nav-logout': "Déconnexion",
    'theme-mode': "Mode Thème",
    
    // Auth UI
    'auth-login-title': "Se connecter",
    'auth-login-desc': "Entrez vos identifiants pour accéder à ShopStock.",
    'auth-signup-title': "Créer un compte",
    'auth-signup-desc': "Créez un compte gratuit pour gérer votre stock.",
    'auth-email-label': "Adresse e-mail",
    'auth-password-label': "Mot de passe",
    'auth-shop-label': "Nom de la boutique",
    'auth-toggle-signup': "Pas de compte ? Créer un compte",
    'auth-toggle-login': "Déjà un compte ? Se connecter",
    'auth-btn-login': "Se connecter",
    'auth-btn-signup': "Créer le compte",
    'toast-signup-success': "Compte créé ! Veuillez confirmer votre email.",
    'toast-login-success': "Connexion réussie !",
    'toast-login-failed': "Échec de l'authentification : {error}",
    
    // Dashboard
    'dashboard-desc': "Voici un aperçu des indicateurs de stock de votre magasin.",
    'add-product': "Ajouter Produit",
    'total-products': "Total Produits",
    'low-stock-alerts': "Alertes de Stock Bas",
    'total-value-cost': "Valeur Totale (Coût)",
    'est-profit-margin': "Marge Bénéficiaire Est.",
    'inventory-analytics': "Analyses de Stock",
    'value-by-category': "Valeur par Catégorie",
    'stock-levels': "Niveaux de Stock",
    
    // Inventory
    'product-catalog': "Catalogue Produits",
    'product-catalog-desc': "Gerez et suivez tous les articles en stock.",
    'search-products-placeholder': "Rechercher par nom, SKU ou description...",
    'all-categories': "Toutes les Catégories",
    'all-stock-status': "Tous les Statuts de Stock",
    'in-stock': "En Stock (Bon)",
    'low-stock-status': "Stock Bas",
    'out-of-stock-status': "Rupture de Stock",
    'sku': "SKU",
    'product-name': "Nom du Produit",
    'category': "Catégorie",
    'cost-price': "Prix d'Achat",
    'retail-price': "Prix de Vente",
    'stock-qty': "Qté en Stock",
    'margin': "Marge",
    'status': "Statut",
    'actions': "Actions",
    
    // History
    'history-log': "Journal d'Historique",
    'history-log-desc': "Piste d'audit de toutes les entrées de stock, ventes et corrections.",
    'clear-log': "Effacer le Journal",
    'search-tx-placeholder': "Rechercher des transactions par produit ou SKU...",
    'all-tx-types': "Tous les Types de Transactions",
    'inbound-type': "Entrées (Stock In)",
    'outbound-type': "Sorties (Stock Out)",
    'adjustments-type': "Ajustements",
    'date-time': "Date et Heure",
    'type': "Type",
    'qty-change': "Var. Qté",
    'reason-notes': "Raison / Notes",
    
    // Categories
    'categories-desc': "Classez vos produits pour organiser votre stock et filtrer vos listes.",
    'add-new-category': "Ajouter Catégorie",
    'category-name': "Nom de la Catégorie",
    'category-placeholder': "ex. Chaussures",
    'add-category-btn': "Ajouter Catégorie",
    'active-categories': "Catégories Actives",
    
    // Settings
    'settings-app-title': "Paramètres de l'Application",
    'settings-app-desc': "Configurez vos préférences et gérez les opérations de sauvegarde.",
    'settings-shop-customization': "Personnalisation",
    'shop-name': "Nom de la Boutique",
    'currency-symbol': "Devise",
    'language': "Langue",
    'save-shop-preferences': "Enregistrer",
    'settings-backup-recovery': "Sauvegarde & Restauration",
    'settings-backup-desc': "Sauvegardez régulièrement votre inventaire, catégories et historique. Les données sont sauvegardées en local sur votre appareil.",
    'settings-export-btn': "Exporter Sauvegarde (.json)",
    'settings-import-btn': "Importer Sauvegarde (.json)",
    'settings-danger-zone': "Zone de Danger",
    'settings-danger-desc': "La réinitialisation effacera tous vos produits et historique de transactions. Vous pouvez charger les données de démo à la place.",
    'settings-reset-demo': "Réinitialiser Démo",
    'settings-wipe-data': "Effacer Toutes les Données",
    
    // Modals
    'modal-add-product': "Ajouter un Nouveau Produit",
    'modal-edit-product': "Modifier le Produit",
    'modal-prod-name': "Nom du Produit *",
    'modal-prod-sku': "SKU / Code-barres *",
    'modal-prod-sku-placeholder': "ex. CHG-SANS-FIL",
    'modal-prod-category': "Catégorie *",
    'modal-prod-desc': "Description",
    'modal-prod-desc-placeholder': "Saisir une description du produit...",
    'modal-prod-cost': "Prix d'Achat (Coût) *",
    'modal-prod-retail': "Prix de Vente (Détail) *",
    'modal-prod-qty': "Qté Initiale en Stock *",
    'modal-prod-min': "Stock Minimal d'Alerte *",
    'modal-btn-cancel': "Annuler",
    'modal-btn-save': "Enregistrer le Produit",
    
    'modal-adjust-stock': "Ajustement du Stock",
    'modal-adjust-name': "Nom du Produit",
    'modal-adjust-current': "Quantité Actuelle en Stock",
    'modal-adjust-type': "Type d'Ajustement",
    'modal-adjust-add': "Ajouter du Stock (+)",
    'modal-adjust-sub': "Réduire / Sortie de Stock (-)",
    'modal-adjust-change': "Changement de Quantité *",
    'modal-adjust-change-placeholder': "Entrer le nombre d'unités",
    'modal-adjust-reason': "Raison du Changement *",
    'modal-adjust-notes': "Notes Additionnelles",
    'modal-adjust-notes-placeholder': "ex. Facture fournisseur #3991, ou infos de vente",
    'modal-adjust-btn': "Traiter l'Ajustement",
    
    // Notifications & Statuses
    'status-good': "Stock Correct",
    'status-low': "Stock Bas",
    'status-out': "En Rupture",
    'item-count-singular': "article",
    'item-count-plural': "articles",
    'category-count-singular': "catégorie",
    'category-count-plural': "catégories",
    'requires-attention': "Requiert attention",
    'healthy-levels': "Niveaux de stock sains",
    'retail-val-label': "Val. de Vente : ",
    'potential-profit-label': "Profit Estimé : ",
    'no-data': "Pas de données",
    'chart-products-count': "Nombre de Produits",
    'no-low-stock': "Aucun Article en Stock Bas",
    'inventory-healthy-desc': "Votre stock est sain !",
    'restock-btn': "Approvisionner",
    
    // Empty tables
    'no-products-found': "Aucun Produit Trouvé",
    'no-products-found-desc': "Modifiez vos filtres ou vos termes de recherche, ou ajoutez un produit.",
    'no-tx-logged': "Aucune Transaction Enregistrée",
    'no-tx-logged-desc': "L'historique des entrées, sorties et modifications de stock apparaîtra ici.",
    'no-categories': "Aucune Catégorie",
    'no-categories-desc': "Ajoutez des catégories pour classer vos articles de stock.",
    
    // Alert dialogs
    'confirm-delete-category': 'Êtes-vous sûr de vouloir supprimer la catégorie "{name}" ?',
    'confirm-delete-product': 'Êtes-vous sûr de vouloir supprimer "{name}" ? Cela effacera toutes ses données d\'inventaire.',
    'confirm-clear-history': 'Êtes-vous sûr de vouloir effacer l\'historique des transactions ? Les quantités actuelles de produits ne changeront pas, mais l\'historique sera effacé.',
    'confirm-reset-demo': 'Cela va écraser vos modifications en cours et recharger le stock de démonstration. Continuer ?',
    'confirm-wipe-all': 'ATTENTION : Êtes-vous absolument sûr de vouloir supprimer TOUS les produits, catégories et transactions ? Cette action est irréversible.',
    
    // Toasts
    'toast-demo-loaded': "Données de démonstration chargées !",
    'toast-data-wiped': "Toutes les données de l'application ont été effacées.",
    'toast-sku-exists': 'Un produit avec le SKU "{sku}" existe déjà.',
    'toast-details-updated': "Détails du produit mis à jour avec succès.",
    'toast-product-added': 'Produit "{name}" ajouté.',
    'toast-qty-min': "La quantité en stock ne peut pas être inférieure à 0.",
    'toast-stock-updated': 'Stock mis à jour pour "{name}". Quantité actuelle : {qty}',
    'toast-cat-exists': 'La catégorie "{name}" existe déjà.',
    'toast-cat-added': 'Catégorie "{name}" ajoutée avec succès.',
    'toast-pref-saved': "Préférences enregistrées.",
    'toast-cat-deleted': 'Catégorie "{name}" supprimée.',
    'toast-cat-has-products': 'Impossible de supprimer la catégorie "{name}" car elle contient {count} produits.',
    'toast-prod-deleted': 'Le produit "{name}" a été supprimé.',
    'toast-backup-downloaded': "Sauvegarde de l'inventaire téléchargée.",
    'toast-backup-restored': "Sauvegarde restaurée avec succès !",
    'toast-backup-invalid': "Structure de fichier invalide. Propriétés manquantes.",
    'toast-backup-error': "Erreur lors du traitement du fichier JSON.",
    'toast-history-cleared': "Historique des transactions effacé.",
    
    // Reasons In
    'Supplier Delivery': "Livraison Fournisseur",
    'Customer Return': "Retour Client",
    'Inventory Audit Corrective Add': "Correction Inventaire positive (+)",
    'Sample/Gift Inflow': "Entrée Échantillon/Cadeau",
    'Other Inbound Restock': "Autre Entrée/Réapprovisionnement",
    
    // Reasons Out
    'Customer Sale': "Vente Client",
    'Damaged Item Write-off': "Perte Article Endommagé",
    'Theft/Loss Write-off': "Perte Vol/Perte de stock",
    'Inventory Audit Corrective Deduct': "Correction Inventaire négative (-)",
    'Sample/Promo Outflow': "Sortie Échantillon/Promotion",
    'Other Outbound deduction': "Autre Sortie/Déduction",
    
    // Special
    'Initial stock load': "Chargement initial du stock",
    'Inbound': "Entrée",
    'Outbound': "Sortie",
    'Adjustment': "Ajustement",
    'associated-products': "produits associés",
    'print-report': "Imprimer le rapport",
    'print-receipt': "Imprimer le reçu",
    'inventory-report-title': "Rapport d'état de l'inventaire",
    'receipt-title': "Reçu de transaction",
    'generated-on': "Généré le",
    'authorized-signature': "Signature autorisée",
    'total-cost-value': "Valeur totale d'achat",
    'total-retail-value': "Valeur totale de vente",
    'total-margin': "Marge moyenne estimée",
    'product': "Produit",
    'qty': "Qté",
    'rate': "Prix",
    'total': "Total",
    'transaction-details': "Détails de la transaction",
    'toast-csv-exported': "Produits exportés en CSV.",
    'auth-try-demo': "Tester la démo (Mode local)",
    'auth-view-pricing': "Voir les tarifs",
    'download-desktop': "Télécharger pour Windows (.exe)",
    'download-desktop-app': "Télécharger l'app PC (Windows)",
    'pricing-title': "Tarifs ShopStock",
    'price-free-title': "Local Solo",
    'price-cloud-title': "Cloud Sync",
    'price-period-forever': "/ à vie",
    'price-period-month': "/ mois",
    'price-free-desc': "Pour un usage autonome sur un seul ordinateur.",
    'price-cloud-desc': "Synchronisez vos stocks en temps réel sur PC et mobiles.",
    'price-feat-products': "Produits illimités",
    'price-feat-local': "Stockage local sécurisé",
    'price-feat-backup': "Export CSV et sauvegarde JSON",
    'price-feat-cloud': "Pas de synchronisation cloud",
    'price-feat-devices': "Un seul appareil",
    'price-feat-sync': "Synchronisation cloud (Supabase)",
    'price-feat-devices-unlimited': "Appareils illimités (PC, mobiles)",
    'price-feat-support': "Support prioritaire",
    'price-btn-free': "Activer Mode Démo",
    'price-btn-subscribe': "S'abonner",
    'demo-banner-text': "Mode Démo actif (Les données sont enregistrées localement sur cet appareil)",
    'demo-banner-login': "Se connecter",
    'notification-low-stock-title': "Alerte Stock Bas",
    'toast-demo-activated': "Mode Démo activé !"
  }
};

// State default settings modification to include language
// ==========================================================================
// STATE MANAGEMENT & LOCAL STORAGE
// ==========================================================================

let state = {
  products: [],
  categories: [],
  transactions: [],
  settings: {
    shopName: "ShopStock",
    currency: "$",
    language: "fr"
  },
  syncQueue: []
};

// Chart instances
let categoryChartInstance = null;
let stockStatusChartInstance = null;

function loadState() {
  const stored = localStorage.getItem('shopstock_state');
  if (stored) {
    try {
      state = JSON.parse(stored);
      // Ensure structural properties exist
      if (!state.products) state.products = [];
      if (!state.categories) state.categories = [];
      if (!state.transactions) state.transactions = [];
      if (!state.syncQueue) state.syncQueue = [];
      if (!state.settings) state.settings = { shopName: "ShopStock", currency: "$", language: "fr" };
      if (!state.settings.language) state.settings.language = "fr";
    } catch (e) {
      console.error("Failed to parse stored state. Loading defaults...", e);
      loadMockData();
    }
  } else {
    loadMockData();
  }
  updateSidebarBadges();
}

function saveState() {
  localStorage.setItem('shopstock_state', JSON.stringify(state));
  updateSidebarBadges();
}

function loadMockData() {
  state.categories = [...MOCK_CATEGORIES];
  state.products = [...MOCK_PRODUCTS];
  state.transactions = [...MOCK_TRANSACTIONS];
  state.settings = {
    shopName: "ShopStock Store",
    currency: "$",
    language: state.settings.language || "fr"
  };
  saveState();
  showToast(t('toast-demo-loaded'), "success");
}

function wipeAllData() {
  state.categories = [];
  state.products = [];
  state.transactions = [];
  state.settings = {
    shopName: "My Shop",
    currency: "$",
    language: state.settings.language || "fr"
  };
  saveState();
  showToast(t('toast-data-wiped'), "danger");
}

// ==========================================================================
// TRANSLATION ENGINE HELPER
// ==========================================================================

function t(key) {
  const lang = state.settings.language || 'fr';
  if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
    return TRANSLATIONS[lang][key];
  }
  if (TRANSLATIONS['en'][key]) {
    return TRANSLATIONS['en'][key];
  }
  return key;
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function translatePage() {
  const lang = state.settings.language || 'en';
  document.documentElement.setAttribute('lang', lang);

  // Helper function to handle text translation safely
  const setText = (selector, key) => {
    const el = document.querySelector(selector);
    if (!el) return;
    
    // Preserve dynamic icons if present
    const icon = el.querySelector('i');
    if (icon) {
      el.innerHTML = '';
      el.appendChild(icon);
      const textSpan = document.createElement('span');
      textSpan.textContent = ' ' + t(key);
      el.appendChild(textSpan);
    } else {
      el.textContent = t(key);
    }
  };

  const setPlaceholder = (selector, key) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('placeholder', t(key));
  };

  // 1. Sidebar translations
  setText('.sidebar-title-wrapper span', 'inventory-hub');
  setText('.nav-link[data-view="dashboard"] span', 'nav-dashboard');
  setText('.nav-link[data-view="inventory"] span', 'nav-products');
  setText('.nav-link[data-view="transactions"] span', 'nav-history');
  setText('.nav-link[data-view="categories"] span', 'nav-categories');
  setText('.nav-link[data-view="settings"] span', 'nav-settings');
  setText('#themeToggleBtn span', 'theme-mode');

  // 2. Dashboard View Translations
  setText('#dashboard-view .view-title-container p', 'dashboard-desc');
  setText('#dashboardAddStockBtn', 'add-product');
  
  // KPI Titles
  const kpiHeaders = document.querySelectorAll('.kpi-card');
  if (kpiHeaders.length >= 4) {
    kpiHeaders[0].querySelector('h3').textContent = t('total-products');
    kpiHeaders[1].querySelector('h3').textContent = t('low-stock-alerts');
    kpiHeaders[2].querySelector('h3').textContent = t('total-value-cost');
    kpiHeaders[3].querySelector('h3').textContent = t('est-profit-margin');
  }
  
  // Dashboard Card Titles
  setText('#dashboard-view .dashboard-grid .card:nth-child(1) .card-header h2', 'inventory-analytics');
  setText('#dashboard-view .dashboard-grid .card:nth-child(2) .card-header h2', 'low-stock-alerts');

  // 3. Products Catalog View
  setText('#inventory-view .view-title-container h1', 'product-catalog');
  setText('#inventory-view .view-title-container p', 'product-catalog-desc');
  setText('#printInventoryBtn', 'print-report');
  setText('#addProductBtn', 'add-product');
  setPlaceholder('#productSearch', 'search-products-placeholder');
  
  setText('#filterCategory option[value="all"]', 'all-categories');
  setText('#filterStockStatus option[value="all"]', 'all-stock-status');
  setText('#filterStockStatus option[value="ok"]', 'in-stock');
  setText('#filterStockStatus option[value="low"]', 'low-stock-status');
  setText('#filterStockStatus option[value="out"]', 'out-of-stock-status');

  const productsTableThs = document.querySelectorAll('#productsTable th');
  if (productsTableThs.length >= 9) {
    productsTableThs[0].textContent = t('sku');
    productsTableThs[1].textContent = t('product-name');
    productsTableThs[2].textContent = t('category');
    productsTableThs[3].textContent = t('cost-price');
    productsTableThs[4].textContent = t('retail-price');
    productsTableThs[5].textContent = t('stock-qty');
    productsTableThs[6].textContent = t('margin');
    productsTableThs[7].textContent = t('status');
    productsTableThs[8].textContent = t('actions');
  }



  // 4. History Log View
  setText('#transactions-view .view-title-container h1', 'history-log');
  setText('#transactions-view .view-title-container p', 'history-log-desc');
  setText('#clearHistoryBtn', 'clear-log');
  setPlaceholder('#txSearch', 'search-tx-placeholder');
  
  setText('#filterTxType option[value="all"]', 'all-tx-types');
  setText('#filterTxType option[value="in"]', 'inbound-type');
  setText('#filterTxType option[value="out"]', 'outbound-type');
  setText('#filterTxType option[value="adjustment"]', 'adjustments-type');

  const txTableThs = document.querySelectorAll('#transactionsTable th');
  if (txTableThs.length >= 6) {
    txTableThs[0].textContent = t('date-time');
    txTableThs[1].textContent = t('product-name');
    txTableThs[2].textContent = t('sku');
    txTableThs[3].textContent = t('type');
    txTableThs[4].textContent = t('qty-change');
    txTableThs[5].textContent = t('reason-notes');
  }

  // 5. Categories View
  setText('#categories-view .view-title-container h1', 'nav-categories');
  setText('#categories-view .view-title-container p', 'categories-desc');
  setText('#categories-view .category-settings-layout .card:nth-child(1) .card-header h2', 'add-new-category');
  setText('#categories-view label[for="newCategoryName"]', 'category-name');
  setPlaceholder('#newCategoryName', 'category-placeholder');
  setText('#addCategoryForm button[type="submit"]', 'add-category-btn');
  setText('#categories-view .category-settings-layout .card:nth-child(2) .card-header h2', 'active-categories');

  // 6. Settings View
  setText('#settings-view .view-title-container h1', 'settings-app-title');
  setText('#settings-view .view-title-container p', 'settings-app-desc');
  setText('#settings-view .settings-grid .card:nth-child(1) .card-header h2', 'settings-shop-customization');
  setText('#settings-view label[for="settingsShopName"]', 'shop-name');
  setPlaceholder('#settingsShopName', 'shop-name');
  setText('#settings-view label[for="settingsCurrency"]', 'currency-symbol');
  setText('#settings-view label[for="settingsLanguage"]', 'language');
  setText('#settingsForm button[type="submit"]', 'save-shop-preferences');
  
  setText('#settings-view .settings-grid .card:nth-child(2) .card-header h2', 'settings-backup-recovery');
  setText('#settings-view .settings-grid .card:nth-child(2) .settings-section-description', 'settings-backup-desc');
  setText('#exportDataBtn', 'settings-export-btn');
  setText('#importDataBtn', 'settings-import-btn');
  
  setText('#settings-view .danger-zone-header', 'settings-danger-zone');
  setText('#settings-view .danger-zone .settings-section-description', 'settings-danger-desc');
  setText('#resetMockBtn', 'settings-reset-demo');
  setText('#wipeAllBtn', 'settings-wipe-data');

  // 7. Product Modal
  setText('#productForm label[for="prodName"]', 'modal-prod-name');
  setPlaceholder('#prodName', 'product-name');
  setText('#productForm label[for="prodSku"]', 'modal-prod-sku');
  setPlaceholder('#prodSku', 'modal-prod-sku-placeholder');
  setText('#productForm label[for="prodCategory"]', 'modal-prod-category');
  setText('#productForm label[for="prodDesc"]', 'modal-prod-desc');
  setPlaceholder('#prodDesc', 'modal-prod-desc-placeholder');
  setText('#productForm label[for="prodCost"]', 'modal-prod-cost');
  setText('#productForm label[for="prodRetail"]', 'modal-prod-retail');
  setText('#productForm label[for="prodQty"]', 'modal-prod-qty');
  setText('#productForm label[for="prodMin"]', 'modal-prod-min');
  
  const prodModalCloses = document.querySelectorAll('#productModal .modal-close');
  prodModalCloses.forEach(el => {
    if (el.tagName === 'BUTTON' && el.classList.contains('btn-secondary')) {
      el.textContent = t('modal-btn-cancel');
    }
  });
  setText('#saveProductBtn', 'modal-btn-save');

  // 8. Adjustment Modal
  setText('#adjustmentModal .modal-header h2', 'modal-adjust-stock');
  setText('#adjustmentForm label[for="adjustProdName"]', 'modal-adjust-name');
  setText('#adjustmentForm label[for="adjustCurrentQty"]', 'modal-adjust-current');
  setText('#adjustmentForm label[for="adjustType"]', 'modal-adjust-type');
  setText('#adjustType option[value="in"]', 'modal-adjust-add');
  setText('#adjustType option[value="out"]', 'modal-adjust-sub');
  setText('#adjustmentForm label[for="adjustQty"]', 'modal-adjust-change');
  setPlaceholder('#adjustQty', 'modal-adjust-change-placeholder');
  setText('#adjustmentForm label[for="adjustReason"]', 'modal-adjust-reason');
  setText('#adjustmentForm label[for="adjustNotes"]', 'modal-adjust-notes');
  setPlaceholder('#adjustNotes', 'modal-adjust-notes-placeholder');
  
  const adjModalCloses = document.querySelectorAll('#adjustmentModal .modal-close');
  adjModalCloses.forEach(el => {
    if (el.tagName === 'BUTTON' && el.classList.contains('btn-secondary')) {
      el.textContent = t('modal-btn-cancel');
    }
  });
  setText('#adjustmentForm button[type="submit"]', 'modal-adjust-btn');
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = "success") {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = "check-circle";
  if (type === "danger") icon = "x-circle";
  if (type === "warning") icon = "alert-triangle";
  
  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  lucide.createIcons({ attrs: { class: 'toast-icon' } });
  
  // Fade out and remove
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3500);
}

// ==========================================================================
// THEME CONTROL (LIGHT/DARK)
// ==========================================================================

function initTheme() {
  const isDark = localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeUI();
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'theme-light');
  updateThemeUI();
  // Re-render charts to update text/grid colors for dark mode
  renderDashboardCharts();
}

function updateThemeUI() {
  const isDark = document.documentElement.classList.contains('dark');
  const icons = [document.getElementById('themeIcon'), document.querySelector('#mobileThemeToggle i')];
  
  icons.forEach(icon => {
    if (icon) {
      if (isDark) {
        icon.setAttribute('data-lucide', 'sun');
      } else {
        icon.setAttribute('data-lucide', 'moon');
      }
    }
  });
  lucide.createIcons();
}

// ==========================================================================
// NAVIGATION CONTROLLER
// ==========================================================================

function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const panels = document.querySelectorAll('.view-panel');
  const sidebar = document.getElementById('sidebar');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      
      // Update links active class
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Update panels active class
      panels.forEach(p => p.classList.remove('active'));
      const activePanel = document.getElementById(`${targetView}-view`);
      if (activePanel) activePanel.classList.add('active');

      // Close mobile sidebar if open
      sidebar.classList.remove('open');
      
      // Refresh current view data
      refreshViewData(targetView);
    });
  });

  // Mobile Hamburger toggler
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Close sidebar clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !menuToggleBtn.contains(e.target) && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    }
  });

  // Mobile Theme Button
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }

  // Desktop Theme Button
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
}

function refreshViewData(viewName) {
  // Translate static texts first
  translatePage();
  
  switch (viewName) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'inventory':
      renderInventory();
      break;
    case 'transactions':
      renderTransactions();
      break;
    case 'categories':
      renderCategories();
      break;
    case 'settings':
      renderSettings();
      break;
  }
}

// ==========================================================================
// FORMATTING HELPERS
// ==========================================================================

function formatCurrency(amount) {
  return `${state.settings.currency}${parseFloat(amount).toFixed(2)}`;
}

function formatDate(isoString) {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return t('no-data');
  const lang = state.settings.language || 'en';
  if (lang === 'fr') {
    // Format: dd MMM yyyy HH:mm
    const months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
    const month = months[d.getMonth()];
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  } else {
    // English
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  }
}

// ==========================================================================
// VIEW RENDERING: DASHBOARD
// ==========================================================================

function renderDashboard() {
  // Update Welcome Title
  document.getElementById('dashboardWelcome').textContent = `${t('welcome')} ${state.settings.shopName}`;
  
  // 1. KPI Calcs
  const totalProducts = state.products.length;
  const uniqueCategories = state.categories.length;
  
  let totalCost = 0;
  let totalRetail = 0;
  let lowStockCount = 0;
  
  state.products.forEach(p => {
    totalCost += (p.costPrice * p.quantity);
    totalRetail += (p.retailPrice * p.quantity);
    if (p.quantity <= p.minQuantity) {
      lowStockCount++;
    }
  });

  const estimatedProfit = totalRetail - totalCost;
  const marginPercent = totalRetail > 0 ? ((totalRetail - totalCost) / totalRetail) * 100 : 0;

  // DOM Updates
  document.getElementById('kpiTotalProducts').textContent = totalProducts;
  
  const catLabelKey = uniqueCategories === 1 ? 'category-count-singular' : 'category-count-plural';
  document.getElementById('kpiTotalCategories').textContent = `${uniqueCategories} ${t(catLabelKey)}`;
  
  document.getElementById('kpiLowStock').textContent = lowStockCount;
  document.getElementById('lowStockAlertBadge').textContent = `${lowStockCount} ${t(lowStockCount === 1 ? 'item-count-singular' : 'item-count-plural')}`;
  
  const lowStockSubText = document.getElementById('kpiLowStockSubtext');
  if (lowStockCount > 0) {
    lowStockSubText.textContent = t('requires-attention');
    lowStockSubText.className = "kpi-subtext critical";
  } else {
    lowStockSubText.textContent = t('healthy-levels');
    lowStockSubText.className = "kpi-subtext profit";
  }

  document.getElementById('kpiTotalCost').textContent = formatCurrency(totalCost);
  document.getElementById('kpiRetailValue').textContent = `${t('retail-val-label')}${formatCurrency(totalRetail)}`;
  
  document.getElementById('kpiMargin').textContent = `${marginPercent.toFixed(1)}%`;
  document.getElementById('kpiProfitSub').textContent = `${t('potential-profit-label')}${formatCurrency(estimatedProfit)}`;

  // 2. Low Stock Alerts List
  renderLowStockList();

  // 3. Render Visualizations
  renderDashboardCharts();
}

function renderLowStockList() {
  const container = document.getElementById('lowStockList');
  container.innerHTML = '';

  const lowStockItems = state.products.filter(p => p.quantity <= p.minQuantity);
  
  if (lowStockItems.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 24px 10px;">
        <div class="empty-state-icon" style="width: 44px; height: 44px; font-size: 1.1rem; margin-bottom: 8px;">
          <i data-lucide="check"></i>
        </div>
        <h3 style="font-size: 0.95rem;">${t('no-low-stock')}</h3>
        <p style="font-size: 0.8rem; margin-bottom: 0;">${t('inventory-healthy-desc')}</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Sort by lowest remaining quantity percentage first
  lowStockItems.sort((a, b) => {
    const aPct = a.minQuantity > 0 ? (a.quantity / a.minQuantity) : 0;
    const bPct = b.minQuantity > 0 ? (b.quantity / b.minQuantity) : 0;
    return aPct - bPct;
  });

  lowStockItems.forEach(p => {
    const item = document.createElement('div');
    item.className = 'low-stock-item';
    item.innerHTML = `
      <div class="low-stock-details">
        <span class="low-stock-name">${escapeHTML(p.name)}</span>
        <span class="low-stock-meta">${escapeHTML(p.category)} · SKU: ${escapeHTML(p.sku)}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="low-stock-qty" title="Reorder limit is ${p.minQuantity}">${p.quantity} ${t('left')}</span>
        <button class="quick-action-btn" data-id="${p.id}">${t('restock-btn')}</button>
      </div>
    `;
    
    // Quick Restock Button Trigger
    item.querySelector('.quick-action-btn').addEventListener('click', () => {
      openAdjustmentModal(p.id, "in");
    });
    
    container.appendChild(item);
  });
  lucide.createIcons();
}

function renderDashboardCharts() {
  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? '#1e1e24' : '#e4e4e7';
  const textColor = isDark ? '#fafafa' : '#09090b';
  const mutedTextColor = isDark ? '#a1a1aa' : '#71717a';

  // 1. DOUGHNUT CHART - VALUE BY CATEGORY
  const categoryVals = {};
  state.categories.forEach(c => categoryVals[c] = 0);
  state.products.forEach(p => {
    if (categoryVals[p.category] !== undefined) {
      categoryVals[p.category] += (p.retailPrice * p.quantity);
    }
  });

  const categoryLabels = Object.keys(categoryVals).filter(k => categoryVals[k] > 0);
  const categoryData = categoryLabels.map(k => categoryVals[k]);

  // Destroy previous instance
  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  const categoryCtx = document.getElementById('categoryChart').getContext('2d');
  if (categoryLabels.length === 0) {
    categoryChartInstance = new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: [t('no-data')],
        datasets: [{
          data: [1],
          backgroundColor: [isDark ? '#27272a' : '#f4f4f5'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  } else {
    categoryChartInstance = new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: categoryLabels,
        datasets: [{
          data: categoryData,
          backgroundColor: [
            '#2563eb', // Blue
            '#a855f7', // Purple
            '#16a34a', // Green
            '#fbbf24', // Amber
            '#ec4899', // Pink
            '#06b6d4', // Cyan
            '#f97316'  // Orange
          ],
          borderWidth: isDark ? 2 : 1,
          borderColor: isDark ? '#0c0c0f' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 10,
              padding: 10,
              font: { family: 'Outfit', size: 11 },
              color: textColor
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ${formatCurrency(context.raw)}`;
              }
            }
          }
        }
      }
    });
  }

  // 2. BAR CHART - STOCK LEVEL GROUPS
  let okCount = 0;
  let lowCount = 0;
  let outCount = 0;

  state.products.forEach(p => {
    if (p.quantity === 0) outCount++;
    else if (p.quantity <= p.minQuantity) lowCount++;
    else okCount++;
  });

  if (stockStatusChartInstance) {
    stockStatusChartInstance.destroy();
  }

  const stockCtx = document.getElementById('stockStatusChart').getContext('2d');
  stockStatusChartInstance = new Chart(stockCtx, {
    type: 'bar',
    data: {
      labels: [t('in-stock').split(' ')[0], t('low-stock-status'), t('out-of-stock-status')],
      datasets: [{
        label: t('chart-products-count'),
        data: [okCount, lowCount, outCount],
        backgroundColor: [
          'rgba(22, 163, 74, 0.85)', // Green
          'rgba(245, 158, 11, 0.85)', // Amber
          'rgba(220, 38, 38, 0.85)'   // Red
        ],
        borderColor: [
          '#16a34a',
          '#fbbf24',
          '#dc2626'
        ],
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: mutedTextColor, font: { family: 'Outfit' } }
        },
        y: {
          grid: { color: gridColor },
          ticks: { 
            color: mutedTextColor, 
            font: { family: 'JetBrains Mono', size: 10 },
            stepSize: 1,
            precision: 0 
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: function(tooltipItems) {
              return tooltipItems[0].label;
            }
          }
        }
      }
    }
  });
}

// ==========================================================================
// VIEW RENDERING: INVENTORY CATALOG
// ==========================================================================

function renderInventory() {
  const tableBody = document.getElementById('productsTableBody');
  tableBody.innerHTML = '';

  const searchVal = document.getElementById('productSearch').value.toLowerCase();
  const categoryFilter = document.getElementById('filterCategory').value;
  const statusFilter = document.getElementById('filterStockStatus').value;

  // Filter products
  const filteredProducts = state.products.filter(p => {
    // 1. Search text filter
    const matchesSearch = p.name.toLowerCase().includes(searchVal) || 
      p.sku.toLowerCase().includes(searchVal) || 
      (p.description && p.description.toLowerCase().includes(searchVal));
    
    // 2. Category filter
    const matchesCategory = (categoryFilter === 'all' || p.category === categoryFilter);

    // 3. Stock status filter
    let matchesStatus = true;
    if (statusFilter === 'ok') {
      matchesStatus = (p.quantity > p.minQuantity);
    } else if (statusFilter === 'low') {
      matchesStatus = (p.quantity <= p.minQuantity && p.quantity > 0);
    } else if (statusFilter === 'out') {
      matchesStatus = (p.quantity === 0);
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (filteredProducts.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="empty-state">
            <div class="empty-state-icon">
              <i data-lucide="package-search"></i>
            </div>
            <h3>${t('no-products-found')}</h3>
            <p>${t('no-products-found-desc')}</p>
          </div>
        </td>
      </tr>
    `;
    lucide.createIcons();
    return;
  }

  filteredProducts.forEach(p => {
    // Status Badge & Class
    let statusText = t('status-good');
    let badgeClass = "badge-success";
    if (p.quantity === 0) {
      statusText = t('status-out');
      badgeClass = "badge-danger";
    } else if (p.quantity <= p.minQuantity) {
      statusText = t('status-low');
      badgeClass = "badge-warning";
    }

    // Margin Calculation
    const margin = p.retailPrice > 0 ? ((p.retailPrice - p.costPrice) / p.retailPrice) * 100 : 0;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="cell-sku">${escapeHTML(p.sku)}</td>
      <td>
        <div class="cell-name">${escapeHTML(p.name)}</div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHTML(p.description || '')}">
          ${escapeHTML(p.description || '')}
        </div>
      </td>
      <td><span class="badge badge-category">${escapeHTML(p.category)}</span></td>
      <td style="text-align: right;" class="cell-mono">${formatCurrency(p.costPrice)}</td>
      <td style="text-align: right;" class="cell-mono">${formatCurrency(p.retailPrice)}</td>
      <td style="text-align: center; font-weight: 600;" class="cell-mono">${p.quantity}</td>
      <td style="text-align: center; color: ${margin >= 40 ? 'var(--success)' : 'var(--text-secondary)'}; font-weight: 500;" class="cell-mono">
        ${margin.toFixed(0)}%
      </td>
      <td><span class="badge ${badgeClass}">${statusText}</span></td>
      <td>
        <div class="cell-actions">
          <button class="icon-btn btn-adjust" data-id="${p.id}" title="${t('modal-adjust-stock')}">
            <i data-lucide="plus-minus"></i>
          </button>
          <button class="icon-btn btn-edit" data-id="${p.id}" title="${t('modal-edit-product')}">
            <i data-lucide="edit-3"></i>
          </button>
          <button class="icon-btn btn-delete" data-id="${p.id}" title="${t('settings-wipe-data')}">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    `;

    // Action Triggers
    row.querySelector('.btn-adjust').addEventListener('click', () => openAdjustmentModal(p.id));
    row.querySelector('.btn-edit').addEventListener('click', () => openProductModal(p.id));
    row.querySelector('.btn-delete').addEventListener('click', () => handleDeleteProduct(p.id, p.name));

    tableBody.appendChild(row);
  });
  lucide.createIcons();
}

function updateCategoryDropdowns() {
  const categoryFilter = document.getElementById('filterCategory');
  const prodCategorySelect = document.getElementById('prodCategory');
  
  if (!categoryFilter || !prodCategorySelect) return;

  const currentFilterVal = categoryFilter.value;
  const currentSelectVal = prodCategorySelect.value;

  categoryFilter.innerHTML = `<option value="all">${t('all-categories')}</option>`;
  prodCategorySelect.innerHTML = `<option value="" disabled selected>${t('modal-prod-category').replace(' *','')}</option>`;

  state.categories.forEach(c => {
    categoryFilter.innerHTML += `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`;
    prodCategorySelect.innerHTML += `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`;
  });

  categoryFilter.value = currentFilterVal;
  if (state.categories.includes(currentFilterVal)) {
    categoryFilter.value = currentFilterVal;
  } else {
    categoryFilter.value = 'all';
  }

  if (state.categories.includes(currentSelectVal)) {
    prodCategorySelect.value = currentSelectVal;
  }
}

// ==========================================================================
// VIEW RENDERING: TRANSACTION HISTORY LOG
// ==========================================================================

function renderTransactions() {
  const tableBody = document.getElementById('transactionsTableBody');
  tableBody.innerHTML = '';

  const searchVal = document.getElementById('txSearch').value.toLowerCase();
  const txTypeFilter = document.getElementById('filterTxType').value;

  // Filter transactions
  const filteredTxs = state.transactions.filter(t => {
    // 1. Search filter
    const matchesSearch = t.productName.toLowerCase().includes(searchVal) || 
      (t.sku && t.sku.toLowerCase().includes(searchVal)) ||
      t.reason.toLowerCase().includes(searchVal);
    
    // 2. Type filter
    const matchesType = (txTypeFilter === 'all' || t.type === txTypeFilter);

    return matchesSearch && matchesType;
  });

  // Sort descending by date (newest first)
  filteredTxs.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filteredTxs.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <div class="empty-state-icon">
              <i data-lucide="history"></i>
            </div>
            <h3>${t('no-tx-logged')}</h3>
            <p>${t('no-tx-logged-desc')}</p>
          </div>
        </td>
      </tr>
    `;
    lucide.createIcons();
    return;
  }

  filteredTxs.forEach(tNode => {
    let typeText = t('Inbound');
    let typeClass = "tx-type-in";
    let qtyPrefix = "+";

    if (tNode.type === "out") {
      typeText = t('Outbound');
      typeClass = "tx-type-out";
      qtyPrefix = ""; // quantity is negative already in model
    } else if (tNode.type === "adjustment") {
      typeText = t('Adjustment');
      typeClass = "tx-type-adj";
      qtyPrefix = tNode.quantity > 0 ? "+" : "";
    }

    // Try translating reason note
    const translatedReason = tNode.reason.split(' (').map((part, i) => {
      // If it has notes in parentheses like "Supplier Delivery (invoice #1)"
      if (i > 0) {
        return part;
      }
      return t(part);
    }).join(' (');

    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="color: var(--text-secondary);" class="cell-mono">${formatDate(tNode.date)}</td>
      <td><div class="cell-name">${escapeHTML(tNode.productName)}</div></td>
      <td class="cell-sku">${escapeHTML(tNode.sku || 'N/A')}</td>
      <td><span class="${typeClass}">${typeText}</span></td>
      <td style="text-align: center; font-weight: 600;" class="cell-mono ${tNode.quantity > 0 ? 'tx-type-in' : 'tx-type-out'}">
        ${qtyPrefix}${tNode.quantity}
      </td>
      <td style="color: var(--text-secondary); max-width: 280px; overflow: hidden; text-overflow: ellipsis;" title="${escapeHTML(translatedReason)}">
        ${escapeHTML(translatedReason)}
      </td>
      <td style="text-align: right;">
        <button class="icon-btn btn-print-tx" data-id="${tNode.id}" title="${t('print-receipt')}">
          <i data-lucide="printer"></i>
        </button>
      </td>
    `;
    row.querySelector('.btn-print-tx').addEventListener('click', () => printTransactionReceipt(tNode));
    tableBody.appendChild(row);
  });
  lucide.createIcons();
}

// ==========================================================================
// VIEW RENDERING: CATEGORIES CONFIG
// ==========================================================================

function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  container.innerHTML = '';

  if (state.categories.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 24px;">
        <div class="empty-state-icon">
          <i data-lucide="tags"></i>
        </div>
        <h3>${t('no-categories')}</h3>
        <p>${t('no-categories-desc')}</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Count products associated with each category
  const categoryCounts = {};
  state.categories.forEach(c => categoryCounts[c] = 0);
  state.products.forEach(p => {
    if (categoryCounts[p.category] !== undefined) {
      categoryCounts[p.category]++;
    }
  });

  state.categories.forEach(c => {
    const item = document.createElement('div');
    item.className = 'category-item';
    
    const count = categoryCounts[c] || 0;
    
    item.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span class="category-item-name">${escapeHTML(c)}</span>
        <span style="font-size: 0.8rem; color: var(--text-secondary);">${count} ${t('associated-products')}</span>
      </div>
      <button class="icon-btn btn-delete delete-cat-btn" data-cat="${escapeHTML(c)}" title="${t('settings-wipe-data')}">
        <i data-lucide="trash-2"></i>
      </button>
    `;
    
    // Wire up delete event
    const delBtn = item.querySelector('.delete-cat-btn');
    delBtn.addEventListener('click', () => handleDeleteCategory(c, count));

    container.appendChild(item);
  });
  lucide.createIcons();
}

function handleDeleteCategory(catName, productCount) {
  if (productCount > 0) {
    showToast(t('toast-cat-has-products').replace('{name}', catName).replace('{count}', productCount), "warning");
    return;
  }

  if (confirm(t('confirm-delete-category').replace('{name}', catName))) {
    state.categories = state.categories.filter(c => c !== catName);
    saveState();
    syncCategoryToCloud(catName, true);
    renderCategories();
    updateCategoryDropdowns();
    showToast(t('toast-cat-deleted').replace('{name}', catName), "success");
  }
}

// ==========================================================================
// VIEW RENDERING: SETTINGS PREFERENCES
// ==========================================================================

function renderSettings() {
  document.getElementById('settingsShopName').value = state.settings.shopName || '';
  document.getElementById('settingsCurrency').value = state.settings.currency || '$';
  document.getElementById('settingsLanguage').value = state.settings.language || 'en';
}

// ==========================================================================
// FORM SUBMISSIONS & TRANSACTION CREATION
// ==========================================================================

function setupForms() {
  // 1. Add/Edit Product submit
  const productForm = document.getElementById('productForm');
  productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const prodId = document.getElementById('prodId').value;
    const name = document.getElementById('prodName').value.trim();
    const sku = document.getElementById('prodSku').value.trim().toUpperCase();
    const category = document.getElementById('prodCategory').value;
    const description = document.getElementById('prodDesc').value.trim();
    const costPrice = parseFloat(document.getElementById('prodCost').value);
    const retailPrice = parseFloat(document.getElementById('prodRetail').value);
    const minQuantity = parseInt(document.getElementById('prodMin').value, 10);

    // SKU duplication check
    const skuExists = state.products.some(p => p.sku === sku && p.id !== prodId);
    if (skuExists) {
      showToast(t('toast-sku-exists').replace('{sku}', sku), "danger");
      return;
    }

    if (prodId) {
      // EDIT MODE
      const idx = state.products.findIndex(p => p.id === prodId);
      if (idx !== -1) {
        state.products[idx].name = name;
        state.products[idx].sku = sku;
        state.products[idx].category = category;
        state.products[idx].description = description;
        state.products[idx].costPrice = costPrice;
        state.products[idx].retailPrice = retailPrice;
        state.products[idx].minQuantity = minQuantity;
        
        saveState();
        syncProductToCloud(state.products[idx]);
        showToast(t('toast-details-updated'), "success");
      }
    } else {
      // NEW MODE
      const quantity = parseInt(document.getElementById('prodQty').value, 10);
      const newId = generateUUID();
      const newProduct = {
        id: newId,
        sku,
        name,
        description,
        category,
        costPrice,
        retailPrice,
        quantity,
        minQuantity
      };

      state.products.push(newProduct);
      
      // Log initial stock load transaction
      let newTx = null;
      if (quantity > 0) {
        newTx = {
          id: generateUUID(),
          productId: newId,
          productName: name,
          sku: sku,
          type: 'in',
          quantity: quantity,
          reason: "Initial stock load",
          date: new Date().toISOString()
        };
        state.transactions.push(newTx);
      }

      saveState();
      syncProductToCloud(newProduct);
      if (newTx) syncTransactionToCloud(newTx);
      showToast(t('toast-product-added').replace('{name}', name), "success");
    }

    closeModal('productModal');
    refreshViewData('inventory');
  });

  // 2. Stock Adjustment submit
  const adjustmentForm = document.getElementById('adjustmentForm');
  adjustmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productId = document.getElementById('adjustProdId').value;
    const type = document.getElementById('adjustType').value;
    const qtyChange = parseInt(document.getElementById('adjustQty').value, 10);
    const reason = document.getElementById('adjustReason').value;
    const notes = document.getElementById('adjustNotes').value.trim();

    const product = state.products.find(p => p.id === productId);
    if (!product) {
      showToast("Product not found.", "danger");
      return;
    }

    const calculatedQty = type === 'in' ? qtyChange : -qtyChange;
    const nextQty = product.quantity + calculatedQty;

    // Outbound validation
    if (nextQty < 0) {
      showToast(t('toast-qty-min'), "danger");
      return;
    }

    // Process Stock adjustment
    const previousQty = product.quantity;
    product.quantity = nextQty;

    // Check for low stock notification trigger
    if (product.quantity <= product.minQuantity && previousQty > product.minQuantity) {
      showLocalNotification(
        t('notification-low-stock-title') || "Alerte Stock Bas",
        `${product.name} (SKU: ${product.sku}) est presque épuisé (${product.quantity} restants).`
      );
    }

    // Build description
    const fullNote = notes ? `${reason} (${notes})` : reason;

    // Log transaction
    const newTx = {
      id: generateUUID(),
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      type: type,
      quantity: calculatedQty,
      reason: fullNote,
      date: new Date().toISOString()
    };
    state.transactions.push(newTx);

    saveState();
    syncProductToCloud(product);
    syncTransactionToCloud(newTx);
    closeModal('adjustmentModal');
    
    // If we're on the dashboard, refresh it, otherwise refresh inventory
    const activePanel = document.querySelector('.view-panel.active');
    if (activePanel.id === 'dashboard-view') {
      refreshViewData('dashboard');
    } else {
      refreshViewData('inventory');
    }

    showToast(t('toast-stock-updated').replace('{name}', product.name).replace('{qty}', product.quantity), "success");
  });

  // Dynamic dropdown trigger reason change on adjustment type selection
  const adjustTypeSelect = document.getElementById('adjustType');
  if (adjustTypeSelect) {
    adjustTypeSelect.addEventListener('change', () => {
      populateAdjustmentReasons(adjustTypeSelect.value);
    });
  }

  // 3. Category Form Submit
  const addCategoryForm = document.getElementById('addCategoryForm');
  addCategoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newCatInput = document.getElementById('newCategoryName');
    const newCatName = newCatInput.value.trim();
    
    if (!newCatName) return;

    // Case-insensitive duplicate check
    const duplicate = state.categories.some(c => c.toLowerCase() === newCatName.toLowerCase());
    if (duplicate) {
      showToast(t('toast-cat-exists').replace('{name}', newCatName), "warning");
      return;
    }

    // Add category
    state.categories.push(newCatName);
    state.categories.sort();
    
    saveState();
    syncCategoryToCloud(newCatName);
    newCatInput.value = '';
    
    renderCategories();
    updateCategoryDropdowns();
    showToast(t('toast-cat-added').replace('{name}', newCatName), "success");
  });

  // 4. Shop Settings Customization form submit
  const settingsForm = document.getElementById('settingsForm');
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const shopName = document.getElementById('settingsShopName').value.trim();
    const currency = document.getElementById('settingsCurrency').value;
    const language = document.getElementById('settingsLanguage').value;

    state.settings.shopName = shopName || "ShopStock";
    state.settings.currency = currency;
    state.settings.language = language;

    saveState();
    syncSettingsToCloud(state.settings);
    
    // Translate page immediately
    translatePage();

    // Update top header title references
    document.getElementById('mobileShopName').textContent = state.settings.shopName;
    document.getElementById('sidebarShopName').textContent = state.settings.shopName;

    // Redraw charts to capture translated legend names
    renderDashboardCharts();

    showToast(t('toast-pref-saved'), "success");
  });
}

function handleDeleteProduct(productId, productName) {
  if (confirm(t('confirm-delete-product').replace('{name}', productName))) {
    state.products = state.products.filter(p => p.id !== productId);
    state.transactions = state.transactions.filter(tNode => tNode.productId !== productId);
    
    saveState();
    syncProductToCloud({ id: productId }, true);
    refreshViewData('inventory');
    showToast(t('toast-prod-deleted').replace('{name}', productName), "danger");
  }
}

// Populate stock adjustment reasons depending on inbound vs outbound
function populateAdjustmentReasons(type) {
  const select = document.getElementById('adjustReason');
  if (!select) return;
  select.innerHTML = '';

  const inReasons = [
    "Supplier Delivery",
    "Customer Return",
    "Inventory Audit Corrective Add",
    "Sample/Gift Inflow",
    "Other Inbound Restock"
  ];

  const outReasons = [
    "Customer Sale",
    "Damaged Item Write-off",
    "Theft/Loss Write-off",
    "Inventory Audit Corrective Deduct",
    "Sample/Promo Outflow",
    "Other Outbound deduction"
  ];

  const reasons = type === 'in' ? inReasons : outReasons;
  reasons.forEach(r => {
    select.innerHTML += `<option value="${r}">${t(r)}</option>`;
  });
}

// ==========================================================================
// MODAL CONTROLLER HANDLERS
// ==========================================================================

function openProductModal(productId = null) {
  const modal = document.getElementById('productModal');
  const title = document.getElementById('productModalTitle');
  const form = document.getElementById('productForm');
  const initialQtyGroup = document.getElementById('initialQtyGroup');

  form.reset();
  updateCategoryDropdowns();

  if (productId) {
    title.textContent = t('modal-edit-product');
    initialQtyGroup.style.display = "none";
    document.getElementById('prodQty').removeAttribute('required');

    const product = state.products.find(p => p.id === productId);
    if (product) {
      document.getElementById('prodId').value = product.id;
      document.getElementById('prodName').value = product.name;
      document.getElementById('prodSku').value = product.sku;
      document.getElementById('prodCategory').value = product.category;
      document.getElementById('prodDesc').value = product.description || '';
      document.getElementById('prodCost').value = product.costPrice;
      document.getElementById('prodRetail').value = product.retailPrice;
      document.getElementById('prodMin').value = product.minQuantity;
    }
  } else {
    title.textContent = t('modal-add-product');
    initialQtyGroup.style.display = "flex";
    document.getElementById('prodQty').setAttribute('required', 'true');
    document.getElementById('prodId').value = '';
    document.getElementById('prodQty').value = '0';
    document.getElementById('prodMin').value = '5';
  }

  modal.classList.add('active');
  lucide.createIcons();
}

function openAdjustmentModal(productId, defaultType = "in") {
  const modal = document.getElementById('adjustmentModal');
  const product = state.products.find(p => p.id === productId);
  
  if (!product) return;

  document.getElementById('adjustProdId').value = product.id;
  document.getElementById('adjustProdName').value = product.name;
  document.getElementById('adjustCurrentQty').value = product.quantity;
  document.getElementById('adjustQty').value = '';
  document.getElementById('adjustNotes').value = '';
  
  const typeSelect = document.getElementById('adjustType');
  typeSelect.value = defaultType;
  
  populateAdjustmentReasons(defaultType);

  modal.classList.add('active');
  lucide.createIcons();
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function setupModalListeners() {
  const closeBtns = document.querySelectorAll('.modal-close');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });

  const overlays = document.querySelectorAll('.modal-overlay');
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });
}

// ==========================================================================
// DATA BACKUP & RESTORE
// ==========================================================================

function setupBackupListeners() {
  const exportBtn = document.getElementById('exportDataBtn');
  exportBtn.addEventListener('click', () => {
    const backupStr = JSON.stringify(state, null, 2);
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `shopstock-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t('toast-backup-downloaded'), "success");
  });

  const importInput = document.getElementById('importDataInput');
  const importBtn = document.getElementById('importDataBtn');

  importBtn.addEventListener('click', () => {
    importInput.click();
  });

  importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const parsed = JSON.parse(evt.target.result);
        
        if (parsed.products && parsed.categories && parsed.transactions) {
          state = parsed;
          if (!state.settings) state.settings = { shopName: "ShopStock", currency: "$", language: "en" };
          if (!state.settings.language) state.settings.language = "en";
          
          saveState();
          
          // Force UI Updates
          document.getElementById('mobileShopName').textContent = state.settings.shopName || 'ShopStock';
          document.getElementById('sidebarShopName').textContent = state.settings.shopName || 'ShopStock';
          
          translatePage();
          updateCategoryDropdowns();
          
          const activePanel = document.querySelector('.view-panel.active');
          const activeView = activePanel.id.replace('-view', '');
          refreshViewData(activeView);

          showToast(t('toast-backup-restored'), "success");
        } else {
          showToast(t('toast-backup-invalid'), "danger");
        }
      } catch (err) {
        showToast(t('toast-backup-error'), "danger");
        console.error(err);
      }
      importInput.value = '';
    };
    reader.readAsText(file);
  });

  document.getElementById('resetMockBtn').addEventListener('click', () => {
    if (confirm(t('confirm-reset-demo'))) {
      loadMockData();
      translatePage();
      const activePanel = document.querySelector('.view-panel.active');
      const activeView = activePanel.id.replace('-view', '');
      refreshViewData(activeView);
    }
  });

  document.getElementById('wipeAllBtn').addEventListener('click', () => {
    if (confirm(t('confirm-wipe-all'))) {
      wipeAllData();
      translatePage();
      updateCategoryDropdowns();
      const activePanel = document.querySelector('.view-panel.active');
      const activeView = activePanel.id.replace('-view', '');
      refreshViewData(activeView);
    }
  });
}

// ==========================================================================
// CSV EXPORT ENGINE
// ==========================================================================

function exportToCSV() {
  if (state.products.length === 0) {
    showToast(t('no-products-found'), "warning");
    return;
  }
  
  // Clean headers (with proper translations)
  const headers = [
    t('sku'), 
    t('product-name'), 
    t('category'), 
    t('cost-price'), 
    t('retail-price'), 
    t('stock-qty'), 
    t('total-cost-value'), 
    t('total-retail-value'), 
    t('modal-prod-min').replace(' *', ''), 
    t('modal-prod-desc')
  ];
  
  const csvRows = [
    headers.join(','),
    ...state.products.map(p => {
      const costValue = p.costPrice * p.quantity;
      const retailValue = p.retailPrice * p.quantity;
      return [
        `"${(p.sku || '').replace(/"/g, '""')}"`,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${(p.category || '').replace(/"/g, '""')}"`,
        p.costPrice.toFixed(2),
        p.retailPrice.toFixed(2),
        p.quantity,
        costValue.toFixed(2),
        retailValue.toFixed(2),
        p.minQuantity,
        `"${(p.description || '').replace(/"/g, '""')}"`
      ].join(',');
    })
  ];

  const csvContent = "\uFEFFsep=,\r\n" + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  a.download = `shopstock-inventory-${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(t('toast-csv-exported'), "success");
}

// ==========================================================================
// ==========================================================================


// ==========================================================================
// BADGE ALERTS & PRINT ENGINE
// ==========================================================================

function updateSidebarBadges() {
  const lowStockCount = state.products.filter(p => p.quantity <= p.minQuantity).length;
  const badge = document.getElementById('sidebarLowStockBadge');
  if (badge) {
    if (lowStockCount > 0) {
      badge.textContent = lowStockCount;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

function printInventoryReport() {
  const printArea = document.getElementById('printArea');
  if (!printArea) return;

  const dateStr = formatDate(new Date().toISOString());
  
  // Calculate Totals
  const totalProducts = state.products.length;
  let totalQty = 0;
  let totalCost = 0;
  let totalRetail = 0;
  
  const tableRowsHtml = state.products.map(p => {
    const itemCostVal = p.costPrice * p.quantity;
    const itemRetailVal = p.retailPrice * p.quantity;
    totalQty += p.quantity;
    totalCost += itemCostVal;
    totalRetail += itemRetailVal;
    
    return `
      <tr>
        <td>${escapeHTML(p.sku)}</td>
        <td><strong>${escapeHTML(p.name)}</strong></td>
        <td>${escapeHTML(p.category)}</td>
        <td style="text-align: right;">${formatCurrency(p.costPrice)}</td>
        <td style="text-align: right;">${formatCurrency(p.retailPrice)}</td>
        <td style="text-align: center;">${p.quantity}</td>
        <td style="text-align: right;">${formatCurrency(itemCostVal)}</td>
        <td style="text-align: right;">${formatCurrency(itemRetailVal)}</td>
      </tr>
    `;
  }).join('');

  printArea.innerHTML = `
    <div class="print-header">
      <div>
        <h1 style="font-size: 20pt; font-weight: bold; margin: 0;">${escapeHTML(state.settings.shopName)}</h1>
        <p style="font-size: 10pt; color: #555555; margin: 2px 0 0 0;">${t('inventory-hub')}</p>
      </div>
      <div class="print-meta">
        <strong>${t('generated-on')}:</strong> ${dateStr}
      </div>
    </div>
    
    <div class="print-title" style="font-size: 14pt; font-weight: bold; margin-bottom: 15px; text-transform: uppercase;">${t('inventory-report-title')}</div>
    
    <table class="print-table">
      <thead>
        <tr>
          <th>${t('sku')}</th>
          <th>${t('product-name')}</th>
          <th>${t('category')}</th>
          <th style="text-align: right;">${t('cost-price').split(' ')[0]}</th>
          <th style="text-align: right;">${t('retail-price').split(' ')[0]}</th>
          <th style="text-align: center;">${t('stock-qty').split(' ')[0]}</th>
          <th style="text-align: right;">${t('total-cost-value').split(' ')[0]}</th>
          <th style="text-align: right;">${t('total-retail-value').split(' ')[0]}</th>
        </tr>
      </thead>
      <tbody>
        ${tableRowsHtml}
        <tr style="font-weight: bold; border-top: 2px solid #000000; background-color: #f2f2f2 !important;">
          <td colspan="3">${t('total').toUpperCase()} (${totalProducts} ${t(totalProducts === 1 ? 'item-count-singular' : 'item-count-plural')})</td>
          <td colspan="2"></td>
          <td style="text-align: center;">${totalQty}</td>
          <td style="text-align: right;">${formatCurrency(totalCost)}</td>
          <td style="text-align: right;">${formatCurrency(totalRetail)}</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 20px; font-size: 10pt; line-height: 1.6;">
      <strong>${t('total-cost-value')}:</strong> ${formatCurrency(totalCost)}<br>
      <strong>${t('total-retail-value')}:</strong> ${formatCurrency(totalRetail)}<br>
      <strong>${t('total-margin')}:</strong> ${totalRetail > 0 ? (((totalRetail - totalCost) / totalRetail) * 100).toFixed(1) : 0}%
    </div>

    <div class="print-signatures" style="margin-top: 50px; display: flex; justify-content: space-between;">
      <div class="signature-line" style="border-top: 1px solid #000000; width: 200px; text-align: center; padding-top: 5px; font-size: 9pt;">${t('authorized-signature')}</div>
      <div class="signature-line" style="border-top: 1px solid #000000; width: 200px; text-align: center; padding-top: 5px; font-size: 9pt;">Date</div>
    </div>
  `;

  window.print();
}

function printTransactionReceipt(tx) {
  const printArea = document.getElementById('printArea');
  if (!printArea) return;

  const txDateStr = formatDate(tx.date);
  const printDateStr = formatDate(new Date().toISOString());
  
  let typeLabel = t('Adjustment');
  if (tx.type === 'in') typeLabel = t('Inbound');
  if (tx.type === 'out') typeLabel = t('Outbound');

  const translatedReason = tx.reason.split(' (').map((part, i) => {
    if (i > 0) return part;
    return t(part);
  }).join(' (');

  const product = state.products.find(p => p.id === tx.productId);
  const cost = product ? product.costPrice : 0;
  const retail = product ? product.retailPrice : 0;
  const absQty = Math.abs(tx.quantity);

  printArea.innerHTML = `
    <div class="receipt-box" style="border: 1px dashed #000000; padding: 24px; max-width: 440px; margin: 20px auto; background: #ffffff; font-family: Arial, sans-serif;">
      <div class="receipt-center" style="text-align: center; margin-bottom: 20px;">
        <div class="receipt-brand" style="font-size: 16pt; font-weight: bold; margin-bottom: 4px; text-transform: uppercase;">${escapeHTML(state.settings.shopName)}</div>
        <div style="font-size: 9pt; color: #555555; text-transform: uppercase; letter-spacing: 1px;">${t('receipt-title')}</div>
      </div>
      
      <div class="receipt-row" style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #dddddd; font-size: 10pt;">
        <span><strong>ID:</strong></span>
        <span style="font-family: monospace;">${tx.id}</span>
      </div>
      <div class="receipt-row" style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #dddddd; font-size: 10pt;">
        <span><strong>${t('date-time')}:</strong></span>
        <span>${txDateStr}</span>
      </div>
      <div class="receipt-row" style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #dddddd; font-size: 10pt;">
        <span><strong>${t('type')}:</strong></span>
        <span style="text-transform: uppercase; font-weight: bold;">${typeLabel}</span>
      </div>
      
      <div style="margin-top: 15px; border-bottom: 1.5px solid #000000; padding-bottom: 4px; font-weight: bold; font-size: 9.5pt;">
        ${t('transaction-details')}
      </div>
      
      <div class="receipt-row" style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #dddddd; font-size: 10pt;">
        <span><strong>${t('product')}:</strong></span>
        <span>${escapeHTML(tx.productName)}</span>
      </div>
      <div class="receipt-row" style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #dddddd; font-size: 10pt;">
        <span><strong>SKU:</strong></span>
        <span style="font-family: monospace;">${escapeHTML(tx.sku || 'N/A')}</span>
      </div>
      <div class="receipt-row" style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #dddddd; font-size: 10pt;">
        <span><strong>${t('qty')}:</strong></span>
        <span>${tx.quantity > 0 ? '+' : ''}${tx.quantity}</span>
      </div>
      
      <div class="receipt-row" style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #dddddd; font-size: 10pt;">
        <span><strong>${t('cost-price')}:</strong></span>
        <span>${formatCurrency(cost)} / unit</span>
      </div>
      <div class="receipt-row" style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #dddddd; font-size: 10pt;">
        <span><strong>${t('retail-price')}:</strong></span>
        <span>${formatCurrency(retail)} / unit</span>
      </div>
      
      <div class="receipt-row total" style="display: flex; justify-content: space-between; border-top: 1.5px solid #000000; border-bottom: 1.5px solid #000000; font-weight: bold; font-size: 11pt; margin-top: 12px; padding: 8px 0;">
        <span>${t('total').toUpperCase()} VALUE:</span>
        <span>${formatCurrency(retail * absQty)}</span>
      </div>
      
      <div style="margin-top: 12px; font-size: 9.5pt;">
        <strong>${t('reason-notes')}:</strong><br>
        <span style="color: #444444; font-style: italic;">${escapeHTML(translatedReason)}</span>
      </div>

      <div class="print-signatures" style="margin-top: 40px; display: flex; justify-content: space-between;">
        <div class="signature-line" style="border-top: 1px solid #000000; width: 150px; text-align: center; padding-top: 5px; font-size: 8pt;">${t('authorized-signature')}</div>
        <div class="signature-line" style="border-top: 1px solid #000000; width: 150px; text-align: center; padding-top: 5px; font-size: 8pt;">Date</div>
      </div>
      
      <div class="receipt-footer" style="text-align: center; font-size: 9pt; color: #555555; margin-top: 25px; border-top: 1px dashed #cccccc; padding-top: 15px;">
        Thank you for choosing ${escapeHTML(state.settings.shopName)}!<br>
        <span style="font-size: 7.5pt; color: #999999;">${t('generated-on')}: ${printDateStr}</span>
      </div>
    </div>
  `;

  window.print();
}

// ==========================================================================
// BOOTSTRAPPING / INITS
// ==========================================================================

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================================================
// SUPABASE ASYNC DATABASE SYNC HELPERS
// ==========================================================================

async function fetchStateFromCloud() {
  if (!isCloudEnabled) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    // 1. Fetch profile/settings
    const { data: profile } = await supabase
      .from('profiles')
      .select('shop_name, currency, language')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      state.settings.shopName = profile.shop_name;
      state.settings.currency = profile.currency;
      state.settings.language = profile.language;
    } else {
      await supabase.from('profiles').insert({
        id: user.id,
        shop_name: state.settings.shopName,
        currency: state.settings.currency,
        language: state.settings.language
      });
    }

    // 2. Fetch Categories
    const { data: dbCats } = await supabase
      .from('categories')
      .select('name')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (dbCats) {
      state.categories = dbCats.map(c => c.name);
    }

    // 3. Fetch Products
    const { data: dbProducts } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id);

    if (dbProducts) {
      state.products = dbProducts.map(p => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category,
        description: p.description,
        costPrice: parseFloat(p.cost_price),
        retailPrice: parseFloat(p.retail_price),
        quantity: p.quantity,
        minQuantity: p.min_quantity
      }));
    }

    // 4. Fetch Transactions
    const { data: dbTx } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (dbTx) {
      state.transactions = dbTx.map(t => ({
        id: t.id,
        productId: t.product_id,
        productName: t.product_name,
        sku: t.sku,
        type: t.type,
        quantity: t.quantity,
        reason: t.reason,
        date: t.date
      }));
    }
  } catch (err) {
    console.error("Failed to sync from Supabase:", err);
  }
}

// Local Low-Stock HTML5 Notification helper
function showLocalNotification(title, body) {
  if (!("Notification" in window)) return;
  
  const triggerNotification = () => {
    try {
      new Notification(title, { body });
    } catch (e) {
      console.warn("HTML5 Notification constructor failed", e);
    }
  };

  if (Notification.permission === "granted") {
    triggerNotification();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        triggerNotification();
      }
    });
  }
}

// Offline Queue sync queue action registers
function queueSyncAction(type, operation, payload) {
  if (!state.syncQueue) state.syncQueue = [];
  state.syncQueue.push({
    id: generateUUID(),
    type,
    operation,
    payload,
    timestamp: new Date().toISOString()
  });
  saveState();
  showToast("Modifications enregistrées localement. Synchronisation en attente de connexion.", "info");
}

// Background sync queue execution worker
async function processSyncQueue() {
  if (!isCloudEnabled || isDemoMode || !navigator.onLine || !state.syncQueue || state.syncQueue.length === 0) return;

  console.log(`Processing sync queue containing ${state.syncQueue.length} actions...`);
  
  const queueToProcess = [...state.syncQueue];
  state.syncQueue = [];
  
  const failedItems = [];

  for (const item of queueToProcess) {
    try {
      const { type, operation, payload } = item;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        failedItems.push(item);
        continue;
      }

      if (type === 'product') {
        if (operation === 'delete') {
          const { error } = await supabase.from('products').delete().eq('id', payload.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('products').upsert({
            id: payload.id,
            user_id: user.id,
            sku: payload.sku,
            name: payload.name,
            category: payload.category,
            description: payload.description,
            cost_price: payload.costPrice,
            retail_price: payload.retailPrice,
            quantity: payload.quantity,
            min_quantity: payload.minQuantity
          });
          if (error) throw error;
        }
      } else if (type === 'transaction') {
        const { error } = await supabase.from('transactions').upsert({
          id: payload.id,
          user_id: user.id,
          product_id: payload.productId,
          product_name: payload.productName,
          sku: payload.sku,
          type: payload.type,
          quantity: payload.quantity,
          reason: payload.reason,
          date: payload.date
        });
        if (error) throw error;
      } else if (type === 'settings') {
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          shop_name: payload.shopName,
          currency: payload.currency,
          language: payload.language,
          updated_at: new Date().toISOString()
        });
        if (error) throw error;
      } else if (type === 'category') {
        if (operation === 'delete') {
          const { error } = await supabase.from('categories').delete().eq('user_id', user.id).eq('name', payload);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('categories').insert({
            user_id: user.id,
            name: payload
          });
          if (error) throw error;
        }
      }
    } catch (err) {
      console.error("Failed to process sync queue item:", item, err);
      failedItems.push(item);
    }
  }

  if (failedItems.length > 0) {
    state.syncQueue = [...failedItems, ...state.syncQueue];
    saveState();
  } else {
    saveState();
    showToast("Toutes les données locales ont été synchronisées avec le cloud !", "success");
    refreshViewData('dashboard');
  }
}

// Online network detector listener
window.addEventListener('online', processSyncQueue);

async function syncProductToCloud(product, isDelete = false) {
  if (!isCloudEnabled || isDemoMode) return;

  if (!navigator.onLine) {
    queueSyncAction('product', isDelete ? 'delete' : 'upsert', product);
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    if (isDelete) {
      await supabase.from('products').delete().eq('id', product.id);
    } else {
      const payload = {
        id: product.id || undefined,
        user_id: user.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        description: product.description,
        cost_price: product.costPrice,
        retail_price: product.retailPrice,
        quantity: product.quantity,
        min_quantity: product.minQuantity
      };
      await supabase.from('products').upsert(payload);
    }
  } catch (err) {
    console.error("Failed to sync product to Supabase:", err);
  }
}

async function syncTransactionToCloud(tx) {
  if (!isCloudEnabled || isDemoMode) return;

  if (!navigator.onLine) {
    queueSyncAction('transaction', 'upsert', tx);
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    const payload = {
      id: tx.id || undefined,
      user_id: user.id,
      product_id: tx.productId,
      product_name: tx.productName,
      sku: tx.sku,
      type: tx.type,
      quantity: tx.quantity,
      reason: tx.reason,
      date: tx.date
    };
    await supabase.from('transactions').upsert(payload);
  } catch (err) {
    console.error("Failed to sync transaction to Supabase:", err);
  }
}

async function syncCategoryToCloud(catName, isDelete = false) {
  if (!isCloudEnabled || isDemoMode) return;

  if (!navigator.onLine) {
    queueSyncAction('category', isDelete ? 'delete' : 'insert', catName);
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    if (isDelete) {
      await supabase.from('categories').delete().eq('user_id', user.id).eq('name', catName);
    } else {
      await supabase.from('categories').insert({ user_id: user.id, name: catName });
    }
  } catch (err) {
    console.error("Failed to sync category to Supabase:", err);
  }
}

async function syncSettingsToCloud(settings) {
  if (!isCloudEnabled || isDemoMode) return;

  if (!navigator.onLine) {
    queueSyncAction('settings', 'upsert', settings);
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    await supabase.from('profiles').upsert({
      id: user.id,
      shop_name: settings.shopName,
      currency: settings.currency,
      language: settings.language,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("Failed to sync settings to Supabase:", err);
  }
}

async function checkUserSession() {
  if (isDemoMode) return;
  if (!isCloudEnabled) {
    const authOverlay = document.getElementById('authOverlay');
    if (authOverlay) authOverlay.classList.remove('active');
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  const authOverlay = document.getElementById('authOverlay');
  const logoutBtn = document.getElementById('logoutBtn');

  if (session) {
    if (authOverlay) authOverlay.classList.remove('active');
    if (logoutBtn) logoutBtn.style.display = 'flex';
    
    await fetchStateFromCloud();
    saveState();
    
    translatePage();
    document.getElementById('mobileShopName').textContent = state.settings.shopName;
    document.getElementById('sidebarShopName').textContent = state.settings.shopName;
    refreshViewData('dashboard');
  } else {
    if (authOverlay) authOverlay.classList.add('active');
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Load persistence
  loadState();

  // Initialize theme
  initTheme();

  // Translate page based on state language
  translatePage();

  // Update initial sidebar/mobile brand titles
  document.getElementById('mobileShopName').textContent = state.settings.shopName;
  document.getElementById('sidebarShopName').textContent = state.settings.shopName;

  // Setup UI Navigation
  setupNavigation();

  // Setup Form Handlers
  setupForms();

  // Setup Modals Listeners
  setupModalListeners();

  // Setup Import/Export Handlers
  setupBackupListeners();

  // Initialize view-specific DOM elements triggers
  document.getElementById('dashboardAddStockBtn').addEventListener('click', () => {
    openProductModal();
  });
  
  document.getElementById('addProductBtn').addEventListener('click', () => {
    openProductModal();
  });

  document.getElementById('printInventoryBtn').addEventListener('click', () => {
    printInventoryReport();
  });

  // CSV Exporter button
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportToCSV);
  }





  // Product List filters
  document.getElementById('productSearch').addEventListener('input', () => renderInventory());
  document.getElementById('filterCategory').addEventListener('change', () => renderInventory());
  document.getElementById('filterStockStatus').addEventListener('change', () => renderInventory());

  // Transaction Log search/filters
  document.getElementById('txSearch').addEventListener('input', () => renderTransactions());
  document.getElementById('filterTxType').addEventListener('change', () => renderTransactions());
  
  // Clear transaction history btn
  document.getElementById('clearHistoryBtn').addEventListener('click', async () => {
    if (confirm(t('confirm-clear-history'))) {
      state.transactions = [];
      saveState();
      
      if (isCloudEnabled) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('transactions').delete().eq('user_id', user.id);
        }
      }
      
      renderTransactions();
      showToast(t('toast-history-cleared'), "success");
    }
  });

  // Setup Auth Toggle Mode
  const authToggleLink = document.getElementById('authToggleLink');
  let isSignUp = false;
  
  if (authToggleLink) {
    authToggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      isSignUp = !isSignUp;
      
      const authTitle = document.getElementById('authTitle');
      const authDesc = document.getElementById('authDesc');
      const shopNameGroup = document.querySelector('.shop-name-group');
      const authSubmitBtn = document.getElementById('authSubmitBtn');
      
      if (isSignUp) {
        authTitle.setAttribute('data-i18n', 'auth-signup-title');
        authDesc.setAttribute('data-i18n', 'auth-signup-desc');
        shopNameGroup.style.display = 'block';
        authSubmitBtn.setAttribute('data-i18n', 'auth-btn-signup');
        authToggleLink.setAttribute('data-i18n', 'auth-toggle-login');
      } else {
        authTitle.setAttribute('data-i18n', 'auth-login-title');
        authDesc.setAttribute('data-i18n', 'auth-login-desc');
        shopNameGroup.style.display = 'none';
        authSubmitBtn.setAttribute('data-i18n', 'auth-btn-login');
        authToggleLink.setAttribute('data-i18n', 'auth-toggle-signup');
      }
      translatePage();
    });
  }

  // Setup Auth Form Submission
  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;
      const shopName = document.getElementById('authShopName').value.trim() || "My Shop";
      
      const submitBtn = document.getElementById('authSubmitBtn');
      submitBtn.disabled = true;
      
      try {
        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password
          });
          
          if (error) throw error;
          
          if (data.user) {
            await supabase.from('profiles').insert({
              id: data.user.id,
              shop_name: shopName,
              currency: "$",
              language: state.settings.language || "fr"
            });

            // Set shop name locally
            state.settings.shopName = shopName;
            saveState();

            // Update UI headers
            document.getElementById('mobileShopName').textContent = shopName;
            document.getElementById('sidebarShopName').textContent = shopName;
          }
          
          showToast(t('toast-signup-success'), "success");
          await checkUserSession();
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) throw error;
          await checkUserSession();
        }
      } catch (err) {
        showToast(t('toast-login-failed').replace('{error}', err.message), "danger");
        console.error(err);
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  // Setup Logout Trigger
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (isDemoMode) {
        const demoExitBtn = document.getElementById('demoExitBtn');
        if (demoExitBtn) demoExitBtn.click();
        return;
      }
      if (isCloudEnabled) {
        await supabase.auth.signOut();
        
        state.products = [];
        state.categories = [];
        state.transactions = [];
        localStorage.removeItem('shopstock_state');
        
        const authOverlay = document.getElementById('authOverlay');
        if (authOverlay) authOverlay.classList.add('active');
        logoutBtn.style.display = 'none';
        
        showToast("Session fermée.", "success");
        refreshViewData('dashboard');
      }
    });
  }

  // Request Notifications permission
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }

  // Interactive Demo handlers
  const authDemoLink = document.getElementById('authDemoLink');
  if (authDemoLink) {
    authDemoLink.addEventListener('click', (e) => {
      e.preventDefault();
      isDemoMode = true;
      
      const authOverlay = document.getElementById('authOverlay');
      if (authOverlay) authOverlay.classList.remove('active');
      
      document.body.classList.add('demo-active');
      const demoBanner = document.getElementById('demoBanner');
      if (demoBanner) demoBanner.style.display = 'flex';
      
      showToast(t('toast-demo-activated'), "success");
      
      // Load local state & populate mockup if empty
      loadState();
      if (state.products.length === 0) {
        resetToMockData();
      }
      
      refreshViewData('dashboard');
    });
  }

  const demoExitBtn = document.getElementById('demoExitBtn');
  if (demoExitBtn) {
    demoExitBtn.addEventListener('click', () => {
      isDemoMode = false;
      document.body.classList.remove('demo-active');
      const demoBanner = document.getElementById('demoBanner');
      if (demoBanner) demoBanner.style.display = 'none';
      
      const authOverlay = document.getElementById('authOverlay');
      if (authOverlay) authOverlay.classList.add('active');
      
      // Wipe state in memory to prevent leaked demo data
      state.products = [];
      state.categories = [];
      state.transactions = [];
      refreshViewData('dashboard');
    });
  }

  // Pricing Modal handlers
  const viewPricingLink = document.getElementById('viewPricingLink');
  if (viewPricingLink) {
    viewPricingLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('pricingModal');
    });
  }

  const pricingBtns = document.querySelectorAll('.pricing-select-btn');
  pricingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan');
      closeModal('pricingModal');
      if (plan === 'free') {
        const demoLink = document.getElementById('authDemoLink');
        if (demoLink) demoLink.click();
      } else if (plan === 'cloud') {
        const toggleLink = document.getElementById('authToggleLink');
        if (toggleLink) {
          const authTitle = document.getElementById('authTitle');
          if (authTitle && authTitle.textContent === t('auth-login-title')) {
            toggleLink.click();
          }
        }
        showToast("Formulaire d'inscription activé pour la synchronisation Cloud.", "info");
      }
    });
  });

  // Download Installer handlers
  const downloadInstallerBtn = document.getElementById('downloadInstallerBtn');
  if (downloadInstallerBtn) {
    downloadInstallerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (DOWNLOAD_INSTALLER_URL === "#") {
        showToast("L'installateur desktop sera disponible prochainement.", "info");
      } else {
        window.open(DOWNLOAD_INSTALLER_URL, '_blank');
      }
    });
  }

  const settingsDownloadBtn = document.getElementById('settingsDownloadBtn');
  if (settingsDownloadBtn) {
    settingsDownloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (DOWNLOAD_INSTALLER_URL === "#") {
        showToast("L'installateur desktop sera disponible prochainement.", "info");
      } else {
        window.open(DOWNLOAD_INSTALLER_URL, '_blank');
      }
    });
  }

  // Trigger generic data-i18n translation engine
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const icon = el.querySelector('i, svg');
    if (icon) {
      const text = t(key);
      el.innerHTML = '';
      el.appendChild(icon);
      el.appendChild(document.createTextNode(' ' + text));
    } else {
      el.textContent = t(key);
    }
  });

  // Check Session
  checkUserSession();

  // Render initial active view (Dashboard)
  renderDashboard();

  // Trigger Lucide to parse tags
  lucide.createIcons();
});
