export interface LegalSection {
    id: string;
    title: string;
    content: string | string[];
}

export const TERMS_OF_SERVICE = {
    title: "Conditions Générales d'Utilisation",
    lastUpdated: "08/03/2026",
    sections: [
        {
            id: "preambule",
            title: "Préambule",
            content: [
                "Les présentes Conditions Générales d'Utilisation (ci-après les « CGU ») ont pour objet d'encadrer juridiquement les modalités de mise à disposition de la plateforme Qreta et de définir les conditions d'accès et d'utilisation des services par tout utilisateur (ci-après l'« Utilisateur »).",
                "Qreta est une plateforme en ligne permettant notamment aux professionnels de créer, gérer et diffuser un catalogue digital accessible via un lien web ou un QR code.",
                "Toute inscription, tout accès ou toute utilisation de la plateforme implique l'acceptation pleine, entière et sans réserve des présentes CGU. Lors de son inscription, l'Utilisateur reconnaît avoir pris connaissance des présentes CGU et les accepter.",
                "En cas de non-acceptation des présentes CGU, l'Utilisateur doit renoncer à l'accès aux services proposés par Qreta.",
                "L'Éditeur se réserve le droit de modifier à tout moment les présentes CGU. Les CGU applicables sont celles en vigueur à la date de l'utilisation du service."
            ]
        },
        {
            id: "mentions-legales",
            title: "Article 1 : Mentions légales",
            content: [
                "Éditeur : Samuel TOMEN NANA.",
                "Forme juridique : Entrepreneur Individuel (Auto-entrepreneur).",
                "Siège social : Créteil, France.",
                "Directeur de la publication : Samuel TOMEN NANA.",
                "Adresse e-mail : support@qreta.fr.",
                "Hébergement du nom de domaine : Hostinger International Ltd (61 Lordou Vironos Street, 6023 Larnaca, Chypre).",
                "Hébergement de la plateforme (Infrastructure) : Vercel Inc. (650 California St, San Francisco, CA 94108, USA).",
                "Stockage des données : Google Cloud Platform (Firebase) - Région : Europe."
            ]
        },
        {
            id: "definitions",
            title: "Article 2 : Définitions",
            content: [
                "Plateforme / Qreta : le site internet et l'application web édités par l'Éditeur.",
                "Utilisateur : toute personne physique ou morale accédant à la plateforme.",
                "Compte : espace personnel créé par l'Utilisateur pour accéder aux fonctionnalités de Qreta.",
                "Catalogue : page ou espace numérique créé via Qreta permettant de présenter des produits, services, prestations, informations commerciales ou visuels.",
                "Abonnement : formule éventuellement payante souscrite par l'Utilisateur pour accéder à certaines fonctionnalités de la plateforme."
            ]
        },
        {
            id: "objet-service",
            title: "Article 3 : Objet du service",
            content: [
                "Qreta met à disposition de ses Utilisateurs une solution SaaS permettant notamment de créer et administrer un ou plusieurs catalogues digitaux.",
                "La plateforme permet de publier des produits, services, prestations, catégories, textes, images et visuels.",
                "Qreta permet de rendre un catalogue accessible publiquement via un lien web ou un QR code.",
                "Certaines options de personnalisation et fonctionnalités peuvent dépendre de la formule souscrite.",
                "Qreta constitue une vitrine digitale. Sauf stipulation contraire expressément indiquée sur la plateforme, Qreta n'intervient pas comme vendeur, revendeur, mandataire, intermédiaire de paiement ou partie au contrat conclu entre l'Utilisateur et ses propres clients."
            ]
        },
        {
            id: "acces-plateforme",
            title: "Article 4 : Accès à la plateforme",
            content: [
                "La plateforme est accessible, sous réserve des restrictions techniques éventuelles, à toute personne disposant d'un accès à Internet.",
                "L'accès à certaines fonctionnalités nécessite la création d'un Compte. À cette fin, l'Utilisateur s'engage à fournir des informations exactes, complètes et à jour.",
                "L'Utilisateur est seul responsable des moyens techniques lui permettant d'accéder à la plateforme, notamment son matériel informatique, ses logiciels, son navigateur et sa connexion Internet.",
                "L'Éditeur se réserve le droit de suspendre, limiter ou interrompre l'accès à tout ou partie de la plateforme pour des raisons de maintenance, de mise à jour, de sécurité ou d'amélioration du service, sans que cela n'ouvre droit à indemnisation."
            ]
        },
        {
            id: "compte-securite",
            title: "Article 5 : Création de compte et sécurité",
            content: [
                "Pour accéder aux services réservés, l'Utilisateur doit créer un Compte au moyen des informations demandées lors de l'inscription.",
                "L'Utilisateur s'engage à fournir des informations sincères, exactes et à jour, à ne pas usurper l'identité d'un tiers, à conserver la confidentialité de ses identifiants de connexion et à informer sans délai l'Éditeur de toute utilisation non autorisée de son Compte.",
                "L'Utilisateur demeure seul responsable de toute activité réalisée depuis son Compte, sauf preuve d'un accès frauduleux non imputable à sa négligence.",
                "L'Éditeur se réserve le droit de suspendre ou supprimer tout Compte en cas de violation des présentes CGU, de fraude, de comportement abusif ou d'atteinte à la sécurité de la plateforme."
            ]
        },
        {
            id: "abonnements-facturation",
            title: "Article 6 : Formules, abonnements et facturation",
            content: [
                "Qreta propose trois formules : 'Free' (gratuit, limité à 1 catalogue), 'Pro' (9€/mois, catalogues illimités).",
                "Les conditions tarifaires, fonctionnalités incluses et limitations de quotas sont précisées sur la plateforme lors de la souscription.",
                "Lorsqu'un Abonnement payant est souscrit, l'Utilisateur accepte le prix indiqué au moment de la commande.",
                "Le paiement est effectué via le prestataire sécurisé Stripe.",
                "Sauf mention contraire, l'Abonnement est reconduit tacitement selon la périodicité choisie.",
                "L'Utilisateur peut mettre fin à son Abonnement ou gérer ses factures à tout moment via son espace personnel (Portail de facturation Stripe).",
                "En cas d'incident ou de défaut de paiement, l'Éditeur se réserve le droit de suspendre l'accès aux fonctionnalités payantes jusqu'à régularisation."
            ]
        },
        {
            id: "obligations-utilisateur",
            title: "Article 7 : Obligations de l'Utilisateur",
            content: [
                "L'Utilisateur s'engage à utiliser Qreta dans le respect des lois et règlements en vigueur, ainsi que des présentes CGU.",
                "À ce titre, il lui est notamment interdit de publier des contenus illicites, diffamatoires, injurieux, haineux, violents, pornographiques ou portant atteinte à l'ordre public.",
                "Il lui est interdit de porter atteinte aux droits de tiers, notamment aux droits de propriété intellectuelle, au droit à l'image ou à la vie privée.",
                "Il lui est interdit d'utiliser la plateforme à des fins frauduleuses ou malveillantes.",
                "L'Utilisateur garantit que les contenus qu'il diffuse sur Qreta sont licites et qu'il dispose de tous les droits nécessaires à leur exploitation."
            ]
        },
        {
            id: "contenus-utilisateur",
            title: "Article 8 : Contenus publiés par l'Utilisateur",
            content: [
                "L'Utilisateur demeure seul responsable de l'ensemble des contenus (images, logos, descriptions de produits) qu'il publie via Qreta.",
                "L'Utilisateur conserve ses droits de propriété intellectuelle sur ses contenus.",
                "Il concède toutefois à l'Éditeur une licence mondiale et gratuite pour héberger, stocker et diffuser lesdits contenus uniquement pour les besoins du service.",
                "L'Éditeur se réserve le droit de retirer tout contenu manifestement illicite ou contraire aux présentes CGU sans préavis."
            ]
        },
        {
            id: "pages-publiques",
            title: "Article 9 : Pages publiques, visibilité et partage",
            content: [
                "L'Utilisateur reconnaît que les catalogues qu'il décide de rendre publics sont accessibles à des tiers via un lien direct ou un QR code.",
                "Lorsque le catalogue est public, l'Utilisateur accepte que son contenu puisse être consulté et potentiellement indexé par des moteurs de recherche.",
                "Il appartient à l'Utilisateur de ne publier aucune donnée confidentielle dans les contenus rendus accessibles publiquement."
            ]
        },
        {
            id: "donnees-personnelles",
            title: "Article 10 : Données personnelles",
            content: [
                "L'Éditeur traite les données personnelles conformément au RGPD et à la loi Informatique et Libertés.",
                "Les modalités détaillées sont disponibles dans la Politique de confidentialité de Qreta.",
                "Toute demande relative aux données personnelles peut être adressée à : support@qreta.fr."
            ]
        },
        {
            id: "cookies",
            title: "Article 11 : Cookies et traceurs",
            content: [
                "Qreta utilise des cookies nécessaires au fonctionnement technique et à la sécurisation des accès.",
                "L'Utilisateur peut paramétrer ses choix via les réglages de son navigateur.",
                "Pour plus d'informations, consultez la Politique de confidentialité."
            ]
        },
        {
            id: "propriete-intellectuelle-plateforme",
            title: "Article 12 : Propriété intellectuelle de la plateforme",
            content: [
                "L'ensemble des éléments composant Qreta (structure, code, logos, marques) appartient exclusivement à l'Éditeur.",
                "Toute reproduction ou exploitation totale ou partielle sans autorisation écrite est strictement interdite.",
                "L'accès au service ne confère aucun droit de propriété intellectuelle à l'Utilisateur sur l'outil lui-même."
            ]
        },
        {
            id: "disponibilite-service",
            title: "Article 13 : Disponibilité du service",
            content: [
                "L'Éditeur s'efforce d'assurer la disponibilité du service 24h/24 mais n'est tenu qu'à une obligation de moyens.",
                "Des opérations de maintenance ou de mise à jour peuvent entraîner une suspension temporaire sans préavis."
            ]
        },
        {
            id: "responsabilite",
            title: "Article 14 : Responsabilité",
            content: [
                "L'Éditeur n'est pas responsable des contenus publiés par les Utilisateurs ni des litiges commerciaux entre l'Utilisateur et ses propres clients.",
                "La responsabilité de l'Éditeur est limitée aux dommages directs prouvés et ne saurait excéder, pour les professionnels, le montant payé au titre de l'Abonnement lors des 12 derniers mois."
            ]
        },
        {
            id: "prestataires-tiers",
            title: "Article 15 : Prestataires tiers",
            content: [
                "Le fonctionnement de Qreta repose sur des tiers (Stripe pour le paiement, Firebase pour les données, Vercel pour l'hébergement).",
                "L'Éditeur ne peut être tenu responsable des pannes majeures ou indisponibilités imputables à ces prestataires externes."
            ]
        },
        {
            id: "suspension-compte",
            title: "Article 16 : Suspension et suppression de compte",
            content: [
                "En cas de manquement grave aux présentes CGU, l'Éditeur peut suspendre ou supprimer le Compte de l'Utilisateur.",
                "L'Utilisateur peut demander la suppression de son Compte via le support."
            ]
        },
        {
            id: "liens-hypertextes",
            title: "Article 17 : Liens hypertextes",
            content: "L'Éditeur n'exerce aucun contrôle sur les sites tiers vers lesquels Qreta pourrait renvoyer et décline toute responsabilité quant à leur contenu."
        },
        {
            id: "force-majeure",
            title: "Article 18 : Force majeure",
            content: "L'Éditeur ne pourra être tenu responsable en cas d'inexécution résultant d'un cas de force majeure (pannes réseau généralisées, catastrophes naturelles, etc.)."
        },
        {
            id: "nullite-partielle",
            title: "Article 19 : Nullité partielle",
            content: "Si une stipulation des présentes est déclarée nulle, les autres conservent toute leur force."
        },
        {
            id: "droit-applicable",
            title: "Article 20 : Droit applicable et juridiction compétente",
            content: [
                "Les présentes CGU sont régies par le droit français.",
                "À défaut d'accord amiable, compétence expresse est attribuée aux tribunaux français (Ressort de Créteil)."
            ]
        },
        {
            id: "contact",
            title: "Article 21 : Contact",
            content: "Pour toute question, l'Utilisateur peut contacter l'Éditeur à l'adresse suivante : support@qreta.fr."
        }
    ]
};

export const PRIVACY_POLICY = {
    title: "Politique de Confidentialité",
    lastUpdated: "08/03/2026",
    introduction: "La présente politique de confidentialité explique en toute transparence l'usage qui est fait des données personnelles des utilisateurs sur la plateforme Qreta. Elle a pour but de vous informer sur la collecte, le traitement et la protection de vos données conformément au Règlement Général sur la Protection des Données (RGPD).",
    sections: [
        {
            id: "identite-contact",
            title: "1. Identité du responsable de traitement",
            content: [
                "Le site qreta.fr est édité par Samuel TOMEN NANA, Entrepreneur Individuel, domicilié à Créteil, France.",
                "Le responsable du traitement des données à caractère personnel est Samuel TOMEN NANA.",
                "Pour toute question ou exercice de vos droits, vous pouvez nous contacter à : support@qreta.fr."
            ]
        },
        {
            id: "donnees-collectees",
            title: "2. Données collectées et finalités",
            content: [
                "Nous collectons les données suivantes pour des finalités précises :",
                "Données de compte : Nom, prénom et adresse e-mail pour la création et la gestion de votre espace membre.",
                "Données de catalogue : Textes, prix et descriptions pour la génération de vos vitrines digitales.",
                "Images et Médias : Photos de produits ou services téléchargées pour illustrer vos catalogues. Ces images sont stockées sur Google Firebase Storage.",
                "Données techniques : Adresse IP et logs de connexion pour assurer la sécurité du site et prévenir les fraudes.",
                "Données de facturation : Statut de paiement et historique de facturation gérés par Stripe. Qreta ne stocke aucune donnée bancaire (carte de crédit)."
            ]
        },
        {
            id: "bases-legales",
            title: "3. Bases légales du traitement",
            content: [
                "Conformément au RGPD, nos traitements reposent sur les bases suivantes :",
                "Exécution du contrat : Pour vous fournir les services de création de catalogue auxquels vous avez souscrit.",
                "Consentement : Pour l'utilisation de cookies non essentiels et la publication de vos photos sur vos catalogues publics.",
                "Obligation légale : Pour la conservation des documents comptables et des factures via Stripe.",
                "Intérêt légitime : Pour la sécurisation de la plateforme et la lutte contre la fraude informatique."
            ]
        },
        {
            id: "caractere-obligatoire",
            title: "4. Caractère obligatoire de la collecte",
            content: "La fourniture de votre adresse e-mail et de votre identité est obligatoire pour créer un compte. Sans ces informations, l'accès aux services de création de catalogue est impossible. Les photos et descriptions de produits sont facultatives mais nécessaires au bon fonctionnement de l'outil de catalogue."
        },
        {
            id: "destinataires",
            title: "5. Destinataires des données",
            content: [
                "Vos données sont réservées à l'usage exclusif de Qreta. Elles sont toutefois partagées avec nos sous-traitants techniques indispensables :",
                "Google Cloud (Firebase) : Hébergement des données et authentification (Région Europe).",
                "Stripe : Gestion des paiements et des abonnements.",
                "Vercel : Hébergement de l'infrastructure web."
            ]
        },
        {
            id: "transferts-ue",
            title: "6. Transferts de données hors Union Européenne",
            content: "Les données sont prioritairement hébergées en Europe. Certains sous-traitants (Vercel, Stripe) peuvent transférer des données vers les États-Unis. Ces transferts sont encadrés par des clauses contractuelles types de la Commission Européenne garantissant un niveau de protection adéquat."
        },
        {
            id: "conservation",
            title: "7. Durée de conservation des données",
            content: [
                "Données de compte : Conservées pendant toute la durée de l'adhésion et supprimées dans un délai de 30 jours après la résiliation du compte.",
                "Images : Supprimées immédiatement lors de la suppression du produit ou du compte par l'Utilisateur.",
                "Données de facturation : Conservées 10 ans pour répondre aux obligations légales fiscales françaises."
            ]
        },
        {
            id: "droits-personnes",
            title: "8. Vos droits et exercice",
            content: [
                "Vous disposez d'un droit d'accès, de rectification, d'effacement (droit à l'oubli) et de portabilité de vos données personnelles.",
                "Vous pouvez également vous opposer au traitement de vos données ou demander la limitation de celui-ci.",
                "Pour exercer ces droits, contactez-nous par mail : support@qreta.fr.",
                "Vous avez également le droit d'introduire une réclamation auprès de la CNIL (cnil.fr)."
            ]
        },
        {
            id: "securite",
            title: "9. Sécurité des données",
            content: "Nous mettons en œuvre des mesures techniques rigoureuses (HTTPS, chiffrement, règles de sécurité Firebase) pour protéger vos données contre tout accès non autorisé, perte ou détournement."
        }
    ]
};