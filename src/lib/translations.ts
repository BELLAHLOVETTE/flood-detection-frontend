// src/lib/translations.ts

export type Locale = 'en' | 'fr';

export const translations = {
  // Common / Navbar
  'nav.dashboard': {
    en: 'Dashboard',
    fr: 'Tableau de bord',
  },
  'nav.map': {
    en: 'Map',
    fr: 'Carte',
  },
  'nav.history': {
    en: 'History',
    fr: 'Historique',
  },
  'nav.alerts': {
    en: 'Alerts',
    fr: 'Alertes',
  },
  'nav.live': {
    en: 'Maga Live',
    fr: 'Maga live',
  },
  'nav.admin': {
    en: 'Admin',
    fr: 'Admin',
  },
  'nav.adminDashboard': {
    en: 'Admin Dashboard',
    fr: 'Tableau de bord Admin',
  },
  'nav.logout': {
    en: 'Logout',
    fr: 'Déconnexion',
  },
  'nav.login': {
    en: 'Login',
    fr: 'Connexion',
  },
  'nav.loginAdmin': {
    en: 'Admin Login',
    fr: 'Connexion Administration',
  },
  'nav.cameroon': {
    en: 'Cameroon',
    fr: 'Cameroun',
  },
  'toast.logout_success': {
    en: 'Logged out successfully',
    fr: 'Déconnexion réussie',
  },
  'nav.forecast': {
    en: 'Forecast',
    fr: 'Prévisions',
  },
  'nav.about': {
    en: 'About',
    fr: 'À propos',
  },
  'nav.register': {
    en: 'Register as Authority',
    fr: 'S\'inscrire comme autorité',
  },

  // Landing Page
  'landing.hero.badge': {
    en: 'REAL-TIME FLOOD INTELLIGENCE',
    fr: 'INTELLIGENCE INONDATION EN TEMPS RÉEL',
  },
  'landing.hero.title1': {
    en: 'Protecting Cameroon',
    fr: 'Protéger le Cameroun',
  },
  'landing.hero.title2': {
    en: 'from Floods',
    fr: 'des Inondations',
  },
  'landing.hero.desc': {
    en: 'Stay ahead of flood dangers with real-time monitoring, early warning systems, and actionable insights for Cameroon communities.',
    fr: 'Gardez une longueur d\'avance sur les dangers d\'inondation grâce à une surveillance en temps réel et des alertes précoces.',
  },
  'landing.hero.cta.start': {
    en: 'Start Monitoring Now',
    fr: 'Démarrer la surveillance',
  },
  'landing.hero.cta.demo': {
    en: 'View Demo Dashboard',
    fr: 'Voir le tableau de bord',
  },
  'landing.hero.stat.sat': {
    en: 'Satellite + IoT sensors',
    fr: 'Satellite + capteurs IoT',
  },
  'landing.hero.stat.updates': {
    en: 'Updates every 30s',
    fr: 'Mis à jour toutes les 30s',
  },
  'landing.hero.stat.verified': {
    en: 'Verified by WASA',
    fr: 'Vérifié par la WASA',
  },
  'landing.why.title': { en: 'Why Choose FloodWatch?', fr: 'Pourquoi choisir FloodWatch?' },
  'landing.why.desc': { en: 'Advanced early warning technology tailored for Cameroon\'s geography', fr: 'Technologie d\'alerte précoce avancée adaptée à la géographie du Cameroun' },
  // Landing Page (current aqua version)
  'land.eyebrow': {
    en: 'Maga · Far North Cameroon',
    fr: 'Maga · Extrême-Nord Cameroun',
  },
  'land.hero.title1': {
    en: 'Flood forecasting &',
    fr: 'Prévision des crues et',
  },
  'land.hero.title2': {
    en: 'early warning',
    fr: 'alerte précoce',
  },
  'land.hero.desc': {
    en: 'Satellite radar, rainfall data, and machine learning working together to give Maga communities advance warning of rising water.',
    fr: 'Radar satellite, données de pluie et apprentissage automatique réunis pour donner aux communautés de Maga une alerte anticipée face à la montée des eaux.',
  },
  'land.hero.cta.dashboard': {
    en: 'Open dashboard',
    fr: 'Ouvrir le tableau de bord',
  },
  'land.hero.cta.forecast': {
    en: 'View 7-day forecast',
    fr: 'Voir les prévisions 7 jours',
  },
  'land.mod.alerts.title': {
    en: 'Early warnings',
    fr: 'Alertes précoces',
  },
  'land.mod.alerts.body': {
    en: 'Subscribe by email to receive flood alerts before the water rises.',
    fr: 'Inscrivez-vous par email pour recevoir des alertes avant la montée des eaux.',
  },
  'land.mod.map.title': {
    en: 'Live flood map',
    fr: 'Carte des crues en direct',
  },
  'land.mod.map.body': {
    en: 'See flood-prone zones and current water extent across the region.',
    fr: 'Visualisez les zones à risque et l\'étendue actuelle des eaux dans la région.',
  },
  'land.mod.history.title': {
    en: 'Rainfall & trends',
    fr: 'Pluie et tendances',
  },
  'land.mod.history.body': {
    en: 'Track rainfall, water levels and past flood events over 25 years.',
    fr: 'Suivez la pluie, les niveaux d\'eau et les crues passées sur 25 ans.',
  },
  'land.mod.open': {
    en: 'Open →',
    fr: 'Ouvrir →',
  },
  'land.how.eyebrow': {
    en: 'How it works',
    fr: 'Comment ça marche',
  },
  'land.how.title': {
    en: 'Four data sources, one risk score, updated for the days ahead.',
    fr: 'Quatre sources de données, un score de risque, actualisé pour les jours à venir.',
  },
  'land.how.sar.body': {
    en: 'Radar sees through cloud to map standing water.',
    fr: 'Le radar traverse les nuages pour cartographier les eaux stagnantes.',
  },
  'land.how.chirps.body': {
    en: '25 years of daily rainfall feed the forecast.',
    fr: '25 ans de pluie quotidienne alimentent les prévisions.',
  },
  'land.how.jrc.body': {
    en: 'Lake Maga area tracked against its normal level.',
    fr: 'La superficie du lac Maga suivie par rapport à son niveau normal.',
  },
  'land.how.ml.body': {
    en: 'A trained model turns it all into a daily risk score.',
    fr: 'Un modèle entraîné transforme le tout en score de risque quotidien.',
  },
  'land.cta.title': {
    en: 'Stay ahead of the water',
    fr: 'Gardez une longueur d\'avance sur les eaux',
  },
  'land.cta.desc': {
    en: 'Get free flood alerts for Maga delivered to your inbox.',
    fr: 'Recevez gratuitement les alertes inondation de Maga dans votre boîte mail.',
  },
  'land.cta.btn': {
    en: 'Subscribe to alerts',
    fr: 'S\'inscrire aux alertes',
  },
  'land.footer.tagline': {
    en: 'Satellite-based flood early warning for Maga Sub-Division, Far North Cameroon.',
    fr: 'Alerte précoce aux inondations par satellite pour l\'arrondissement de Maga, Extrême-Nord Cameroun.',
  },
  'land.footer.platform': {
    en: 'Platform',
    fr: 'Plateforme',
  },
  'land.footer.forecast7': {
    en: '7-day forecast',
    fr: 'Prévisions 7 jours',
  },
  'land.footer.floodmap': {
    en: 'Flood map',
    fr: 'Carte des crues',
  },
  'land.footer.histdata': {
    en: 'Historical data',
    fr: 'Données historiques',
  },
  'land.footer.about': {
    en: 'About',
    fr: 'À propos',
  },
  'land.footer.howitworks': {
    en: 'How it works',
    fr: 'Comment ça marche',
  },
  'land.footer.authlogin': {
    en: 'Authority login',
    fr: 'Connexion autorité',
  },
  'land.footer.project': {
    en: '© 2026 Flood-Watch Cameroon · Final year project',
    fr: '© 2026 Flood-Watch Cameroun · Projet de fin d\'études',
  },
  // Dashboard Page
  'db.title': {
    en: 'Dashboard — Maga, Far North',
    fr: 'Tableau de bord — Maga, Extrême-Nord',
  },
  'db.updated': {
    en: 'Updated',
    fr: 'Mis à jour',
  },
  'db.waiting_satellite': {
    en: 'Waiting for satellite data...',
    fr: 'En attente des données satellite...',
  },
  'db.model': {
    en: 'Model',
    fr: 'Modèle',
  },
  'db.kpi.prob': {
    en: 'Flood Probability',
    fr: 'Probabilité inondation',
  },
  'db.kpi.prob_sub': {
    en: 'Level {level}',
    fr: 'Niveau {level}',
  },
  'db.kpi.rain': {
    en: 'Rainfall (latest reading)',
    fr: 'Pluie (dernier relevé)',
  },
  'db.kpi.rain_sub': {
    en: '7d: {val} mm',
    fr: '7j: {val} mm',
  },
  'db.kpi.no_data': {
    en: 'No data',
    fr: 'Aucune donnée',
  },
  'db.kpi.lake': {
    en: 'Lake Maga',
    fr: 'Lac Maga',
  },
  'db.kpi.lake_sub': {
    en: '{val}% vs normal',
    fr: '{val}% vs normale',
  },
  'db.kpi.subs': {
    en: 'Alert Subscribers',
    fr: 'Abonnés aux alertes',
  },
  'db.kpi.subs_sub': {
    en: 'Verified active subscribers',
    fr: 'Abonnés vérifiés actifs',
  },
  'db.chart.rain': {
    en: 'Precipitation — Last 90 days',
    fr: 'Précipitations — 90 derniers jours',
  },
  'db.chart.lake': {
    en: 'Lake Maga Water Level',
    fr: 'Niveau du Lac Maga',
  },
  'db.info.title': {
    en: 'About the Flood-Watch System',
    fr: 'À propos du système Flood-Watch',
  },
  'db.info.desc': {
    en: 'This system uses Sentinel-1 SAR radar imagery via Google Earth Engine and CHIRPS precipitation data to predict flood risks in the Maga region (Far North, Cameroon). The data is updated every 6 hours by automated tasks. Active ML model: ',
    fr: 'Ce système utilise des images radar Sentinel-1 SAR via Google Earth Engine et des données de précipitations CHIRPS pour prédire les risques d\'inondation dans la région de Maga (Extrême-Nord Cameroun). Les données sont actualisées toutes les 6 heures par des tâches automatisées. Modèle ML actif: ',
  },
  'db.trend.up': {
    en: 'Increase',
    fr: 'Hausse',
  },
  'db.hero.high_risk': {
    en: 'HIGH RISK ALERT',
    fr: 'ALERTE RISQUE ÉLEVÉ',
  },
  'db.hero.escalating': {
    en: 'Escalating',
    fr: 'En augmentation',
  },
  'db.hero.probability_title': {
    en: 'Flood Probability: {val}% • Maga Region',
    fr: 'Probabilité d\'inondation: {val}% • Région de Maga',
  },
  'db.hero.risk_level': {
    en: 'Risk Level',
    fr: 'Niveau de Risque',
  },
  'db.kpi.rainfall_label': {
    en: 'RECENT RAINFALL',
    fr: 'PLUIE RÉCENTE',
  },
  'db.kpi.lake_label': {
    en: 'LAKE MAGA LEVEL',
    fr: 'NIVEAU DU LAC MAGA',
  },
  'db.kpi.subs_label': {
    en: 'ACTIVE SUBSCRIBERS',
    fr: 'ABONNÉS ACTIFS',
  },
  'db.info.cycle': {
    en: '6h Update Cycle',
    fr: 'Cycle de 6h',
  },
  'db.eyebrow': {
    en: 'Maga · Far North Cameroon',
    fr: 'Maga · Extrême-Nord Cameroun',
  },
  'db.heading': {
    en: 'Flood risk dashboard',
    fr: 'Tableau de bord des risques',
  },
  'db.updated_recently': {
    en: 'recently',
    fr: 'récemment',
  },
  'db.current_risk': {
    en: 'Current risk',
    fr: 'Risque actuel',
  },
  'db.stat.prob': {
    en: 'Flood probability',
    fr: 'Probabilité d\'inondation',
  },
  'db.stat.rain': {
    en: 'Recent rainfall',
    fr: 'Pluie récente',
  },
  'db.stat.rain_7d': {
    en: '7-day {val} mm',
    fr: '7 jours {val} mm',
  },
  'db.stat.lake': {
    en: 'Lake Maga area',
    fr: 'Superficie du lac Maga',
  },
  'db.stat.vs_normal': {
    en: '{val}% vs normal',
    fr: '{val}% vs normale',
  },
  'db.stat.subs': {
    en: 'Subscribers',
    fr: 'Abonnés',
  },
  'db.stat.verified': {
    en: 'Verified',
    fr: 'Vérifiés',
  },
  'db.stat.no_data': {
    en: 'No data',
    fr: 'Aucune donnée',
  },
  'db.chart.rain_title': {
    en: 'Rainfall trends',
    fr: 'Tendances des pluies',
  },
  'db.chart.rain_caption': {
    en: 'Last 90 days · CHIRPS',
    fr: '90 derniers jours · CHIRPS',
  },
  'db.chart.water_title': {
    en: 'Water level',
    fr: 'Niveau d\'eau',
  },
  'db.chart.water_caption': {
    en: 'Lake Maga · JRC',
    fr: 'Lac Maga · JRC',
  },
  'db.about': {
    en: 'Flood-Watch combines Sentinel-1 radar, CHIRPS rainfall, and JRC water-extent data through a Random Forest model to estimate daily flood risk for the Maga region.',
    fr: 'Flood-Watch combine le radar Sentinel-1, les pluies CHIRPS et les données d\'étendue d\'eau JRC via un modèle Random Forest pour estimer le risque quotidien d\'inondation dans la région de Maga.',
  },
  'db.about.model': {
    en: 'Active model {val}.',
    fr: 'Modèle actif {val}.',
  },
  'db.risk.low': { en: 'Low', fr: 'Faible' },
  'db.risk.medium': { en: 'Medium', fr: 'Modéré' },
  'db.risk.high': { en: 'High', fr: 'Élevé' },
  'db.risk.critical': { en: 'Critical', fr: 'Critique' },
  // Forecast Page
  'fc.eyebrow': {
    en: '7-day outlook · Maga',
    fr: 'Prévisions 7 jours · Maga',
  },
  'fc.title': {
    en: 'Flood risk forecast',
    fr: 'Prévision des risques d\'inondation',
  },
  'fc.generated': {
    en: 'Generated {val}',
    fr: 'Généré le {val}',
  },
  'fc.loading': {
    en: 'Loading…',
    fr: 'Chargement…',
  },
  'fc.demo.live': {
    en: 'Live data',
    fr: 'Données en direct',
  },
  'fc.demo.rainy': {
    en: 'Demo · rainy season',
    fr: 'Démo · saison des pluies',
  },
  'fc.demo.peak': {
    en: 'Demo · peak season',
    fr: 'Démo · pic de saison',
  },
  'fc.refresh': {
    en: 'Refresh',
    fr: 'Actualiser',
  },
  'fc.error': {
    en: 'Couldn\'t load the forecast. Check your connection and try Refresh.',
    fr: 'Impossible de charger les prévisions. Vérifiez votre connexion et actualisez.',
  },
  'fc.peak.label': {
    en: 'Peak {level} risk · {day} {date}',
    fr: 'Pic de risque {level} · {day} {date}',
  },
  'fc.peak.detail': {
    en: '{prob}% flood probability · {rain} mm predicted rainfall.',
    fr: '{prob}% de probabilité d\'inondation · {rain} mm de pluie prévue.',
  },
  'fc.peak.critical': {
    en: 'Preparation and possible evacuation may be needed.',
    fr: 'Une préparation et une éventuelle évacuation peuvent être nécessaires.',
  },
  'fc.peak.high': {
    en: 'Residents and authorities should stay alert.',
    fr: 'Les habitants et les autorités doivent rester vigilants.',
  },
  'fc.tomorrow': {
    en: 'Tomorrow',
    fr: 'Demain',
  },
  'fc.peak.tag': {
    en: 'Peak',
    fr: 'Pic',
  },
  'fc.chart.prob.title': {
    en: 'Flood probability',
    fr: 'Probabilité d\'inondation',
  },
  'fc.chart.prob.caption': {
    en: '% per day',
    fr: '% par jour',
  },
  'fc.chart.prob.tooltip': {
    en: 'Probability',
    fr: 'Probabilité',
  },
  'fc.chart.rain.title': {
    en: 'Predicted rainfall',
    fr: 'Pluie prévue',
  },
  'fc.chart.rain.caption': {
    en: 'mm per day',
    fr: 'mm par jour',
  },
  'fc.chart.rain.tooltip': {
    en: 'Rainfall',
    fr: 'Pluie',
  },
  'fc.method.eyebrow': {
    en: 'How this forecast is made',
    fr: 'Comment ces prévisions sont établies',
  },
  'fc.method.body': {
    en: 'Flood probability combines a Random Forest model trained on 25 years of CHIRPS rainfall (2000–2025) with a seasonal climatology baseline for Maga. Daily rainfall estimates use CHIRPS historical averages for the time of year. Sources: NOAA GFS, CHIRPS, Sentinel-1 SAR, JRC water extent.',
    fr: 'La probabilité d\'inondation combine un modèle Random Forest entraîné sur 25 ans de pluie CHIRPS (2000–2025) avec une base climatologique saisonnière pour Maga. Les estimations quotidiennes de pluie utilisent les moyennes historiques CHIRPS pour la période. Sources : NOAA GFS, CHIRPS, Sentinel-1 SAR, étendue d\'eau JRC.',
  },
  'fc.risk.low': { en: 'Low', fr: 'Faible' },
  'fc.risk.medium': { en: 'Medium', fr: 'Modéré' },
  'fc.risk.high': { en: 'High', fr: 'Élevé' },
  'fc.risk.critical': { en: 'Critical', fr: 'Critique' },
  'fc.day.mon': { en: 'Mon', fr: 'Lun' },
  'fc.day.tue': { en: 'Tue', fr: 'Mar' },
  'fc.day.wed': { en: 'Wed', fr: 'Mer' },
  'fc.day.thu': { en: 'Thu', fr: 'Jeu' },
  'fc.day.fri': { en: 'Fri', fr: 'Ven' },
  'fc.day.sat': { en: 'Sat', fr: 'Sam' },
  'fc.day.sun': { en: 'Sun', fr: 'Dim' },

  // Login Page
  'login.toast.success': {
    en: 'Login successful!',
    fr: 'Connexion réussie!',
  },
  'login.error.fields': {
    en: 'Please fill in all fields.',
    fr: 'Veuillez remplir tous les champs.',
  },
  'login.error.failed': {
    en: 'Login failed.',
    fr: 'Erreur de connexion.',
  },
  'login.subtitle': {
    en: 'Early warning system — Cameroon',
    fr: 'Système d\'alerte précoce — Cameroun',
  },
  'login.title': {
    en: 'Admin Login',
    fr: 'Connexion Administration',
  },
  'login.desc': {
    en: 'Access restricted to authorities and administrators',
    fr: 'Accès réservé aux autorités et administrateurs',
  },
  'login.username': {
    en: 'Username',
    fr: 'Nom d\'utilisateur',
  },
  'login.password': {
    en: 'Password',
    fr: 'Mot de passe',
  },
  'login.submit': {
    en: 'Login',
    fr: 'Se connecter',
  },
  'login.submitting': {
    en: 'Logging in...',
    fr: 'Connexion en cours...',
  },
  'login.back': {
    en: '← Back to public dashboard',
    fr: '← Retour au tableau de bord public',
  },
  'login.note': {
    en: 'Public access is available on the home page without logging in',
    fr: 'Accès public disponible sur la page d\'accueil sans connexion',
  },

  // Alerts Page
  'alerts.title': {
    en: 'Flood Alerts',
    fr: 'Alertes d\'inondation',
  },
  'alerts.desc': {
    en: 'Sign up to receive automated alerts by SMS or email',
    fr: 'Inscrivez-vous pour recevoir des alertes automatiques par SMS ou email',
  },
  'alerts.form.title': {
    en: 'Subscribe to alerts',
    fr: 'S\'inscrire aux alertes',
  },
  'alerts.form.desc': {
    en: 'Receive an immediate alert when a high flood risk is detected in Maga.',
    fr: 'Recevez une alerte immédiate lorsqu\'un risque d\'inondation élevé est détecté à Maga.',
  },
  'alerts.channel.label': {
    en: 'How would you like to be alerted?',
    fr: 'Comment voulez-vous être alerté?',
  },
  'alerts.phone.label': {
    en: 'Phone number',
    fr: 'Numéro de téléphone',
  },
  'alerts.phone.format': {
    en: 'International format: +237 6XX XXX XXX',
    fr: 'Format international: +237 6XX XXX XXX',
  },
  'alerts.email.label': {
    en: 'Email address',
    fr: 'Adresse email',
  },
  'alerts.lang.label': {
    en: 'Alert language',
    fr: 'Langue des alertes',
  },
  'alerts.error.phone': {
    en: 'Please enter your phone number.',
    fr: 'Veuillez entrer votre numéro de téléphone.',
  },
  'alerts.error.email': {
    en: 'Please enter your email address.',
    fr: 'Veuillez entrer votre adresse email.',
  },
  'alerts.error.phone_or_email': {
    en: 'Please enter a phone number or an email address.',
    fr: 'Veuillez entrer un numéro de téléphone ou une adresse email.',
  },
  'alerts.error.otp_digits': {
    en: 'Please enter the 6-digit code.',
    fr: 'Veuillez entrer le code à 6 chiffres.',
  },
  'alerts.error.otp_invalid': {
    en: 'Invalid or expired code.',
    fr: 'Code invalide ou expiré.',
  },
  'alerts.error.verify_failed': {
    en: 'Verification error. Please try again.',
    fr: 'Erreur de vérification. Veuillez réessayer.',
  },
  'alerts.btn.send_code': {
    en: 'Sending code...',
    fr: 'Envoi du code...',
  },
  'alerts.btn.subscribe': {
    en: 'Subscribe to alerts',
    fr: 'S\'inscrire aux alertes',
  },
  'alerts.verify.title': {
    en: 'Verification',
    fr: 'Vérification',
  },
  'alerts.verify.sent': {
    en: 'A 6-digit code has been sent to your {channel}.',
    fr: 'Un code à 6 chiffres a été envoyé à votre {channel}.',
  },
  'alerts.verify.phone': {
    en: ' phone (****{val})',
    fr: ' téléphone (****{val})',
  },
  'alerts.verify.email': {
    en: ' email',
    fr: ' email',
  },
  'alerts.verify.label': {
    en: 'Verification code',
    fr: 'Code de vérification',
  },
  'alerts.verify.confirm': {
    en: 'Verify code',
    fr: 'Confirmer le code',
  },
  'alerts.verify.verifying': {
    en: 'Verifying...',
    fr: 'Vérification...',
  },
  'alerts.verify.back': {
    en: '← Back',
    fr: '← Retour',
  },
  'alerts.success.title': {
    en: 'Subscription successful!',
    fr: 'Inscription réussie!',
  },
  'alerts.success.desc': {
    en: 'You will now receive automatic alerts when a high or critical flood risk is detected in Maga.',
    fr: 'Vous recevrez désormais des alertes automatiques lorsqu\'un risque d\'inondation élevé ou critique sera détecté à Maga.',
  },
  'alerts.success.rules.title': {
    en: 'You will be alerted if:',
    fr: 'Vous serez alerté si:',
  },
  'alerts.success.rules.1': {
    en: 'Risk level escalates to High (probability > 60%)',
    fr: 'Le risque passe à Élevé (probabilité > 60%)',
  },
  'alerts.success.rules.2': {
    en: 'Risk level escalates to Critical (probability > 80%)',
    fr: 'Le risque passe à Critique (probabilité > 80%)',
  },
  'alerts.success.rules.3': {
    en: 'Risk level returns to Low (all-clear alert)',
    fr: 'Le risque revient à Faible (alerte de fin)',
  },
  'alerts.success.another': {
    en: 'Register another number',
    fr: 'Inscrire un autre numéro',
  },
  'alerts.history.title': {
    en: 'History of alerts sent',
    fr: 'Historique des alertes envoyées',
  },
  'alerts.history.empty': {
    en: 'No alerts sent yet',
    fr: 'Aucune alerte envoyée pour le moment',
  },
  'alerts.history.empty_desc': {
    en: 'Alerts will appear here when the system detects a high risk',
    fr: 'Les alertes apparaîtront ici lorsque le système détectera un risque élevé',
  },
  'alerts.history.all_clear': {
    en: '✓ All clear',
    fr: '✓ Fin d\'alerte',
  },
  'alerts.history.sms': {
    en: '{val} SMS',
    fr: '{val} SMS',
  },
  'alerts.history.email': {
    en: '{val} emails',
    fr: '{val} emails',
  },
  'alerts.history.recipients': {
    en: '{val} recipients',
    fr: '{val} destinataires',
  },

  // History Page
  'hist.title': {
    en: 'Flood History',
    fr: 'Historique des inondations',
  },
  'hist.desc': {
    en: 'Recorded events in Maga and the Mayo-Danay region',
    fr: 'Événements enregistrés à Maga et dans la région de Mayo Danay',
  },
  'hist.stat.events': {
    en: 'Events',
    fr: 'Événements',
  },
  'hist.stat.affected': {
    en: 'People Affected',
    fr: 'Personnes affectées',
  },
  'hist.stat.area': {
    en: 'Total Area',
    fr: 'Surface totale',
  },
  'hist.stat.critical': {
    en: 'Critical Events',
    fr: 'Événements critiques',
  },
  'hist.filter.label': {
    en: 'Filters:',
    fr: 'Filtres:',
  },
  'hist.filter.all_years': {
    en: 'All years',
    fr: 'Toutes les années',
  },
  'hist.filter.all_levels': {
    en: 'All levels',
    fr: 'Tous les niveaux',
  },
  'hist.filter.reset': {
    en: 'Reset',
    fr: 'Réinitialiser',
  },
  'hist.results': {
    en: '{val} result',
    fr: '{val} résultat',
  },
  'hist.results_plural': {
    en: '{val} results',
    fr: '{val} résultats',
  },
  'hist.empty': {
    en: 'No events found',
    fr: 'Aucun événement trouvé',
  },
  'hist.reset_filters': {
    en: 'Reset filters',
    fr: 'Réinitialiser les filtres',
  },
  'hist.confirmed': {
    en: '✓ Confirmed',
    fr: '✓ Confirmé',
  },
  'hist.flood_of': {
    en: 'Flood of {val}',
    fr: 'Inondation de {val}',
  },
  'hist.to': {
    en: 'to {val}',
    fr: 'au {val}',
  },
  'hist.source': {
    en: 'Source',
    fr: 'Source',
  },
  'hist.not_specified': {
    en: 'Not specified',
    fr: 'Non spécifié',
  },
  'hist.prev': {
    en: 'Previous',
    fr: 'Précédent',
  },
  'hist.next': {
    en: 'Next',
    fr: 'Suivant',
  },
  'hist.sources': {
    en: 'Sources: OCHA Cameroon, UNOSAT, Cameroon Government, Cameroon Red Cross',
    fr: 'Sources: OCHA Cameroun, UNOSAT, Gouvernement camerounais, Croix-Rouge Cameroun',
  },
  'hist.eyebrow': {
    en: 'Maga · Cameroon',
    fr: 'Maga · Cameroun',
  },
  'hist.people_affected': {
    en: 'People affected',
    fr: 'Personnes affectées',
  },
  'hist.area_flooded': {
    en: 'Area flooded',
    fr: 'Surface inondée',
  },

  // Map Page
  'map.title': {
    en: 'Flood Map',
    fr: 'Carte des inondations',
  },
  'map.desc': {
    en: 'Current extent of flooded areas — Maga, Far North Cameroon',
    fr: 'Étendue actuelle des zones inondées — Maga, Extrême-Nord Cameroun',
  },
  'map.current_risk': {
    en: 'Current risk:',
    fr: 'Risque actuel:',
  },
  'map.loading': {
    en: 'Loading map...',
    fr: 'Chargement de la carte...',
  },
  'map.legend.title': {
    en: 'Legend',
    fr: 'Légende',
  },
  'map.legend.flooded': {
    en: 'Detected flooded zone (SAR)',
    fr: 'Zone inondée détectée (SAR)',
  },
  'map.legend.low': {
    en: 'Village — Low risk',
    fr: 'Village — Risque faible',
  },
  'map.legend.medium': {
    en: 'Village — Medium risk',
    fr: 'Village — Risque modéré',
  },
  'map.legend.high': {
    en: 'Village — High risk',
    fr: 'Village — Risque élevé',
  },
  'map.legend.critical': {
    en: 'Village — Critical risk',
    fr: 'Village — Risque critique',
  },
  'map.table.title': {
    en: 'Risk level by village',
    fr: 'Niveau de risque par village',
  },
  'map.data_source.title': {
    en: 'Data source:',
    fr: 'Source des données:',
  },
  'map.data_source.desc': {
    en: 'Sentinel-1 SAR radar imagery via Google Earth Engine. Flood detection uses the backscatter difference method (NDR). Permanent water bodies (Lake Maga, Logone River) are excluded from the analysis.',
    fr: 'Images radar Sentinel-1 SAR via Google Earth Engine. La détection des inondations utilise la méthode de changement de rétrodiffusion (NDR). Les zones d\'eau permanente (Lac Maga, fleuve Logone) sont exclues de l\'analyse.',
  },
  'map.overlay.flood': {
    en: 'Flood extent',
    fr: 'Étendue inondation',
  },
  'map.popup.risk': {
    en: 'Risk level:',
    fr: 'Niveau de risque:',
  },
  'map.eyebrow': {
    en: 'Maga · Cameroon',
    fr: 'Maga · Cameroun',
  },
  'map.villages': {
    en: 'villages',
    fr: 'villages',
  },

  // Admin Layout
  'admin.layout.checking': {
    en: 'Verifying permissions...',
    fr: 'Vérification des permissions...',
  },

  // Admin Page
  'admin.title': {
    en: 'Dashboard — Administration',
    fr: 'Tableau de bord — Administration',
  },
  'admin.desc': {
    en: 'Control panel for authorities — Flood-Watch Cameroon',
    fr: 'Panneau de contrôle pour les autorités — Flood-Watch Cameroun',
  },
  'admin.refresh': {
    en: 'Refresh',
    fr: 'Actualiser',
  },
  'admin.kpi.risk': {
    en: 'Current risk',
    fr: 'Risque actuel',
  },
  'admin.kpi.probability': {
    en: '{val}% probability',
    fr: '{val}% probabilité',
  },
  'admin.kpi.subscribers': {
    en: 'Active subscribers',
    fr: 'Abonnés actifs',
  },
  'admin.kpi.subscribers_sub': {
    en: 'Verified and active',
    fr: 'Vérifiés et actifs',
  },
  'admin.kpi.alerts': {
    en: 'Alerts sent',
    fr: 'Alertes envoyées',
  },
  'admin.kpi.alerts_sub': {
    en: 'Historical total',
    fr: 'Total historique',
  },
  'admin.kpi.rain': {
    en: 'Rain (7d)',
    fr: 'Pluie (7j)',
  },
  'admin.kpi.rain_sub': {
    en: '7-day cumulative',
    fr: 'Cumul 7 jours',
  },
  'admin.dispatch.title': {
    en: 'Dispatch a manual alert',
    fr: 'Déclencher une alerte manuelle',
  },
  'admin.dispatch.desc': {
    en: 'Send an immediate alert to all active subscribers. Irreversible action — use with caution.',
    fr: 'Envoyez immédiatement une alerte à tous les abonnés actifs. Action irréversible — à utiliser avec précaution.',
  },
  'admin.dispatch.risk': {
    en: 'Risk level',
    fr: 'Niveau de risque',
  },
  'admin.dispatch.msg_fr': {
    en: 'Message (French) *',
    fr: 'Message (Français) *',
  },
  'admin.dispatch.msg_fr_required': {
    en: 'French message is required',
    fr: 'Le message en français est requis',
  },
  'admin.dispatch.msg_en': {
    en: 'Message (English) — optional',
    fr: 'Message (English) — optionnel',
  },
  'admin.dispatch.preview': {
    en: 'SMS Preview — {val} recipients',
    fr: 'Aperçu SMS — {val} destinataires',
  },
  'admin.dispatch.sms_alert': {
    en: '[FLOOD-WATCH] ALERT ',
    fr: '[FLOOD-WATCH] ALERTE ',
  },
  'admin.dispatch.sms_footer': {
    en: 'Region: Maga, Far North Cameroon · floodwatch.cm',
    fr: 'Zone: Maga, Far North Cameroun · floodwatch.cm',
  },
  'admin.dispatch.btn_send': {
    en: 'Send alert to {val} subscriber(s)',
    fr: 'Envoyer l\'alerte à {val} abonné(s)',
  },
  'admin.dispatch.confirm_title': {
    en: '⚠️ Confirmation required',
    fr: '⚠️ Confirmation requise',
  },
  'admin.dispatch.confirm_desc': {
    en: 'This alert will be sent immediately to {val} subscriber(s) via SMS and email. This action cannot be undone.',
    fr: 'Cette alerte sera envoyée immédiatement à {val} abonné(s) par SMS et email. Cette action ne peut pas être annulée.',
  },
  'admin.dispatch.confirm_btn': {
    en: 'Confirm and send',
    fr: 'Confirmer et envoyer',
  },
  'admin.dispatch.sending': {
    en: 'Sending...',
    fr: 'Envoi en cours...',
  },
  'admin.dispatch.cancel': {
    en: 'Cancel',
    fr: 'Annuler',
  },
  'admin.toast.success': {
    en: 'Alert sent to {val} subscriber(s)',
    fr: 'Alerte envoyée à {val} abonné(s)',
  },
  'admin.toast.error': {
    en: 'Error sending alert',
    fr: 'Erreur lors de l\'envoi de l\'alerte',
  },
  'admin.health.title': {
    en: 'System health',
    fr: 'Santé du système',
  },
  'admin.health.model': {
    en: 'Active ML model',
    fr: 'Modèle ML actif',
  },
  'admin.health.satellite': {
    en: 'Last satellite fetch',
    fr: 'Dernier fetch satellite',
  },
  'admin.health.satellite_never': {
    en: 'Never',
    fr: 'Jamais',
  },
  'admin.health.rain': {
    en: 'Last rainfall data',
    fr: 'Dernière donnée pluie',
  },
  'admin.health.rain_none': {
    en: 'None',
    fr: 'Aucune',
  },
  'admin.health.lake': {
    en: 'Last lake data',
    fr: 'Dernière donnée lac',
  },
  'admin.health.lake_none': {
    en: 'None',
    fr: 'Aucune',
  },
  'admin.health.events': {
    en: 'Total historical events',
    fr: 'Total événements historiques',
  },
  'admin.health.subscribers': {
    en: 'Active subscribers',
    fr: 'Abonnés actifs',
  },
  'admin.health.error': {
    en: 'Unable to load system data. Ensure you are logged in as admin.',
    fr: 'Impossible de charger les données système. Vérifiez que vous êtes connecté en tant qu\'admin.',
  },
  'admin.recent.title': {
    en: 'Recent alerts',
    fr: 'Alertes récentes',
  },
  'admin.recent.none': {
    en: 'No alerts sent',
    fr: 'Aucune alerte envoyée',
  },
  'admin.recent.stats': {
    en: 'Recent data',
    fr: 'Données récentes',
  },
  'admin.recent.rain_30d': {
    en: '30d cumulative rain',
    fr: 'Pluie cumulée 30j',
  },
  'admin.recent.lake_maga': {
    en: 'Lake Maga',
    fr: 'Lac Maga',
  },
  'admin.recent.filling': {
    en: 'Filling',
    fr: 'Remplissage',
  },

  // Live Risk Banner
  'banner.critical': {
    en: '🔴 CRITICAL ALERT — High flood risk detected in Maga',
    fr: '🔴 ALERTE CRITIQUE — Risque élevé d\'inondation détecté à Maga',
  },
  'banner.high': {
    en: '🟠 HIGH ALERT — Enhanced surveillance required in Maga',
    fr: '🟠 ALERTE ÉLEVÉE — Surveillance renforcée requise à Maga',
  },
  'banner.medium': {
    en: '🟡 Moderate risk — Stay informed of weather conditions',
    fr: '🟡 Risque modéré — Restez informés des conditions météo',
  },
  'banner.low': {
    en: '🟢 Normal situation — No immediate risk detected',
    fr: '🟢 Situation normale — Aucun risque immédiat détecté',
  },
  'banner.live': {
    en: 'Live',
    fr: 'En direct',
  },
  'banner.offline': {
    en: 'Offline',
    fr: 'Hors ligne',
  },
  'banner.updated': {
    en: 'Updated',
    fr: 'Mis à jour',
  },

  // WaterGauge
  'gauge.no_data': {
    en: 'No data available',
    fr: 'Aucune donnée disponible',
  },
  'gauge.status': {
    en: 'Lake status',
    fr: 'Statut du lac',
  },
  'gauge.level.critical': {
    en: 'Critical',
    fr: 'Critique',
  },
  'gauge.level.high': {
    en: 'High',
    fr: 'Élevé',
  },
  'gauge.level.above': {
    en: 'Above',
    fr: 'Au-dessus',
  },
  'gauge.level.normal': {
    en: 'Normal',
    fr: 'Normal',
  },
  'gauge.actual': {
    en: 'Current',
    fr: 'Actuel',
  },
  'gauge.normal': {
    en: 'Normal',
    fr: 'Normale',
  },
  'gauge.vs_normal': {
    en: 'vs normal',
    fr: 'vs normale',
  },
  'gauge.empty': {
    en: 'Empty',
    fr: 'Vide',
  },
  'gauge.max_percent': {
    en: '150% of normal',
    fr: '150% de la normale',
  },

  // RainfallChart
  'chart.rain': {
    en: 'Rainfall',
    fr: 'Pluie',
  },
  'chart.7d_cumul': {
    en: '7d cumulative',
    fr: '7j cumul',
  },
  'chart.threshold': {
    en: '80mm Threshold',
    fr: 'Seuil 80mm',
  },
};

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, locale: Locale, replacements?: Record<string, string | number>): string {
  const transObj = translations[key];
  if (!transObj) return String(key);

  let val = transObj[locale] || transObj['en'] || String(key);

  if (replacements) {
    Object.entries(replacements).forEach(([k, v]) => {
      val = val.replace(`{${k}}`, String(v));
    });
  }

  return val;
}
