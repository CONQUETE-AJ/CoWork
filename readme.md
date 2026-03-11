# AionUi - README Projet (Cible Entreprise)

## Présentation

AionUi est une application Electron + React orientée agents IA (CLI + WebUI) pour automatiser des tâches métier sur un environnement on-premise.

Objectif: livrer un produit entreprise sécurisé, opérable 24/7 et ergonomique pour les équipes métiers.

## Lancer le projet

## Prérequis

- Node.js `>=22 <25`
- Bun installé et disponible dans le `PATH`
- Linux/WSL recommandé pour le dev local

## Installation

```bash
cd /home/alex/CoWork
bun install
```

## Démarrage

Mode desktop (Electron):

```bash
bun run start
```

Mode WebUI (commande fonctionnelle actuelle):

```bash
bun run cli -- -- --webui
```

Mode WebUI distant:

```bash
bun run cli -- -- --webui --remote
```

URL WebUI par défaut: `http://localhost:25808`

## Ce qui est déjà implémenté

- Architecture multi-processus Electron (`main` / `renderer` / `worker`).
- WebUI serveur (Express + WebSocket) avec auth mot de passe/JWT.
- Mode WebUI distant (`--remote`).
- IPC bridge structuré.
- Base de tests (`vitest`) et lint (`eslint`).

## Contrainte produit (i18n)

- Garder uniquement deux langues supportées dans l'interface: français (`fr-FR`) et anglais (`en-US`).

## Contrainte produit (branding)

- Trouver un nouveau nom produit (nom définitif).
- Remplacer toutes les occurrences de `AiOn` et `AionUI` par ce nouveau nom dans le code, la documentation et l'interface.

## Roadmap triée par catégories

## 1) UX et Interface

- Interface épurée et centrée sur le chat.
- Supprimer les widgets en bas de l'écran d'accueil.
- Afficher le raisonnement du modèle.
- Ajouter une animation pendant la phase de réflexion.
- Afficher la TODO générée par le chat dans un panneau à droite.
- Supprimer la sidebar workflow des fichiers générés.
- Afficher les fichiers via des liens partagés dans le chat (ex: `Voici votre EXCEL: lien.xlsx`) et ouvrir le preview au clic.
- Ajouter une vue ergonomique de visualisation de la planification.

## 2) Workspace, fichiers et autorisations

- Permettre de sélectionner un dossier de travail.
- Demander une validation humaine des autorisations quand l'agent agit sur des fichiers du dossier.
- Valider les cas d'usage de tri/renommage de masse de fichiers (dont PDF, sans OCR).

## 3) Providers, modèles et compatibilité IA

- Permettre de choisir le provider CLI.
- Permettre de choisir le modèle utilisé.
- Tester la compatibilité avec des modèles servis via vLLM.
- Documenter le format de sortie attendu par l'UI pour éviter les problèmes d'affichage.
- Vérifier la gestion des questions de clarification posées par l'agent quand la demande est ambiguë.

## 4) Sécurité, admin et entreprise

- Ajouter une interface admin.
- Mettre en place un système de connexion compatible entreprise (SSO/OIDC/SAML).
- Renforcer la gouvernance des autorisations et des flux.

## 5) Connecteurs et intégrations

- Ajouter des connecteurs: Gmail, Outlook, Jira, GitHub, Teams, Slack, etc.
- Ajouter un connecteur Google Chrome pour ouvrir une fenêtre et naviguer.
- Permettre la sélection des connecteurs directement depuis le chat, par discussion, sans passer par les paramètres globaux.

## 6) Mémoire, contexte et compétences

- Revoir la liste des assistants et des skills de base activés par défaut.
- Mettre en place une mémoire de personnalité/habitudes utilisateur.
- Permettre l'import de contexte depuis un autre provider (ChatGPT, Gemini, etc.) via un format de prompt/output standard.
- Rendre la création de skills simple via le chat, avec validation humaine avant activation dans l'écosystème.

## 7) Planification et exécution différée

- Améliorer la planification des tâches.
- Ajouter une fenêtre d'information des tâches exécutées en absence utilisateur (ce qui a été fait et ce qui a été généré).
- Vérifier l'exécution planifiée en mode serveur 24/7 même sans session utilisateur active.

## 8) Fonctionnalités complémentaires

- Ajouter la génération d'images intégrée selon les besoins métier.

## 9) Extension possible

- Évoluer vers une version desktop unifiée type "suite" regroupant Chat / CoWork / Code.

## 10) Navigation et paramètres

- Revoir la sidebar et décider explicitement ce qui doit être conservé ou supprimé.
- Nettoyer les réglages non essentiels (ex: `about`, `channels`) si ces rubriques n'apportent pas de valeur produit.

## Plan de tests à effectuer

- Travailler dans un dossier volumineux (dont PDF), puis trier et renommer selon des informations extraites des PDF; valider les autorisations humaines.
- Lire les emails de la semaine passée et générer un Excel de synthèse; valider les connecteurs Outlook/Gmail (MCP).
- À partir d'un lien YouTube, générer un email newsletter; valider le connecteur Chrome + extraction transcript via service tiers.
- Tester la planification en continu sur serveur ouvert 24/7, y compris hors connexion utilisateur.

## Éléments différenciants à mettre en avant

- Déploiement on-premise.
- Contrôle fin des flux et des autorisations.
- Intégrations Microsoft (Outlook/Teams) ciblées côté CoWork.
- Planification exécutable côté serveur même quand le poste utilisateur est éteint.

## Prochaine étape courte

Transformer cette roadmap en backlog priorisé (`P0/P1/P2`) avec owner, critère d'acceptation, et date cible par item.
