# AionUi - Enterprise Delivery README

Ce document remplace le README marketing et sert de plan de référence pour transformer AionUi en produit livrable en contexte entreprise.

## 1) Objectif Produit

Construire une plateforme agentique exploitable en environnement professionnel, avec des standards de sécurité, fiabilité, conformité et opérabilité compatibles avec un déploiement en production d'entreprise.

## 2) Définition de "Livrable Entreprise"

Le produit est considéré livrable quand les critères suivants sont atteints:

- Sécurité: authentification robuste, chiffrement en transit, durcissement de surface d'attaque, gestion des secrets.
- Conformité: traçabilité des actions, politiques de rétention, gestion des données sensibles.
- Fiabilité: objectifs SLO définis, supervision active, procédures de reprise.
- Opérations: installation industrialisée, mises à jour maîtrisées, rollback documenté.
- Gouvernance: contrôle d'accès par rôles, auditabilité, gestion des environnements.
- Support: runbooks d'exploitation, SLA de support, processus d'escalade.

## 3) Priorités Stratégiques

- Stabiliser le mode WebUI serveur comme socle de déploiement centralisé.
- Introduire une couche IAM entreprise (SSO/OIDC/SAML via reverse proxy ou intégration native).
- Industrialiser l'exploitation (systemd/Kubernetes, logs centralisés, métriques, alertes).
- Structurer la qualité logicielle (tests de non-régression, sécurité, performance, e2e critiques).
- Mettre en place une gouvernance de release et de sécurité.

## 4) Architecture Cible (MVP Entreprise)

- Front d'accès: Reverse proxy HTTPS (Nginx/Traefik) avec certificats gérés.
- Service AionUi: mode `--webui --remote` sur Linux, isolé par environnement.
- Auth d'accès: SSO au niveau proxy (phase 1) puis RBAC applicatif (phase 2).
- Données: stockage local chiffré ou volume persistant, politique de sauvegarde/restauration.
- Observabilité: logs structurés + agrégation (ELK/Loki), métriques (Prometheus), alerting.
- Réseau: exposition minimale, accès via VPN/ZTNA, segmentation réseau.

## 5) Feuille de Route Exécutable

## Phase 0 - Fondations (2 semaines)

- Définir les environnements: dev, staging, prod.
- Standardiser le déploiement Linux headless (script + service manager).
- Documenter l'installation et le runbook de base.
- Poser les KPIs produit et les SLO initiaux.

Livrables:

- Guide d'installation production validé.
- Procédure de démarrage/arrêt/restart standard.
- Checklist de readiness environnement.

## Phase 1 - Hardening Sécurité/Exploitation (4 à 6 semaines)

- Forcer HTTPS et supprimer l'exposition HTTP directe en production.
- Mettre en place contrôle d'accès réseau (firewall, IP allowlist, VPN).
- Intégrer secrets management (variables chiffrées, rotation, coffre).
- Centraliser logs et mettre en place alertes critiques.
- Définir stratégie de backup/restauration et test de restauration.

Livrables:

- Baseline sécurité v1.
- Tableau de bord supervision v1.
- Runbook incident + reprise.

## Phase 2 - Fonctions Entreprise (6 à 8 semaines)

- Ajouter SSO (OIDC/SAML) et stratégie de session entreprise.
- Introduire RBAC (admin, ops, user, viewer).
- Ajouter audit trail exploitable (qui fait quoi, quand, où).
- Encadrer la gouvernance des connecteurs/outils externes (MCP, APIs).
- Définir politiques de rétention et purge.

Livrables:

- IAM entreprise v1.
- Journal d'audit exploitable pour conformité.
- Politique de gouvernance des intégrations.

## Phase 3 - Industrialisation Go-Live (2 à 4 semaines)

- Geler un plan de release (versioning, changelog, rollback).
- Valider performance et charge réalistes.
- Exécuter UAT métier + validation sécurité.
- Préparer support N1/N2 + playbooks.

Livrables:

- Go-live checklist signée.
- Dossier d'exploitation production.
- Processus de support opérationnel.

## 6) Exigences Qualité Minimales

- Tests unitaires et intégration sur parcours critiques.
- Tests e2e sur authentification, chat, actions fichiers, outils externes.
- Scan sécurité dépendances et SAST en CI.
- Contrôles qualité bloquants en pipeline (`lint`, `test`, sécurité).
- Revue de code systématique et politique de branches.

## 7) Sécurité et Conformité

- Chiffrement TLS obligatoire en production.
- Gestion stricte des secrets (aucun secret en clair dans le repo).
- Journalisation des accès et des actions sensibles.
- Politique de gestion de vulnérabilités (SLA patch).
- Politique de conservation/suppression des données.

## 8) Exploitation et Support

- Observabilité: logs, métriques, traces sur endpoints critiques.
- SLO recommandés:
- Disponibilité WebUI >= 99.5%.
- p95 latence API interne < 500 ms hors appels LLM externes.
- MTTR incident critique < 2h.
- Astreinte/ownership clair par composant.

## 9) KPI Produit et Technique

- Taux de succès des sessions utilisateur.
- Taux d'erreurs critiques par jour.
- Délai moyen de résolution incident.
- Taux de régression par release.
- Adoption des fonctionnalités entreprise (SSO, audit, RBAC).

## 10) Plan d'Exécution 30 Jours

- Semaine 1: cadrage, architecture cible, environnement staging.
- Semaine 2: déploiement standardisé + monitoring de base.
- Semaine 3: hardening réseau/HTTPS + backup/restauration.
- Semaine 4: validation qualité, runbooks, préparation go/no-go.

## 11) Risques et Contremesures

- Risque: dépendance forte aux APIs externes LLM.
- Contremesure: fallback provider + observabilité des erreurs upstream.
- Risque: dette sécurité sur flux distants.
- Contremesure: proxy sécurisé, segmentation réseau, audit régulier.
- Risque: dérive de qualité sur itérations rapides.
- Contremesure: quality gates CI/CD non contournables.

## 12) Gouvernance Projet

- Revue hebdomadaire architecture/sécurité.
- Revue bihebdomadaire des risques.
- Démo de progression à chaque fin de sprint.
- Décision go/no-go basée sur checklist objective.

## 13) Commandes Utiles (Dev)

```bash
bun install
bun run start
bun run webui
bun run test
bun run lint
```

## 14) Prochaine Étape Recommandée

Créer immédiatement un `Enterprise Readiness Board` (Jira/GitHub Projects) avec les items de phases 0 et 1, et rattacher chaque item à un owner, une date cible et un critère de validation mesurable.
