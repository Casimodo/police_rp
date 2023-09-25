**Pour télécharger cliquer sur l'une des étiquettes ci-dessous**

[![GitHub release](https://img.shields.io/github/v/release/Casimodo/police_rp.svg)](https://github.com/Casimodo/police_rp/releases)
[![Github All Releases](https://img.shields.io/github/downloads/Casimodo/police_rp/total.svg)](https://github.com/Casimodo/police_rp/releases)

# Qui suis-je
  Joueur de tout et surtout rôle Play ! Développeur depuis plus de 30 ans dans différentes technos (web, embarqué...), Créateur 3 D, Mods, Script Arma, GTAv... Je joue sur un peu de tout Arma, GTA, Farming, Satisfactory. Mais le RP reste mon dada ! 
  Suivez-moi sur 
  - Twitch : https://www.twitch.tv/tontoncasi/about *(bas de page Discord)*
  - Kick : https://kick.com/tontoncasi
  - Youtube : https://www.youtube.com/@tontonCasi/streams

# Présentation
  Ce site web vous permet d'avoir tout un site web pour gérer votre Police, Gendarmaerie ou autre sur votre serveur Arma ou GTA voir autre pour le rôle play. Vous pourrait y accéder à l'aide d'un simple navigateur web. Il est compatible pour les navigateurs de votre PC, Mac ou Linux sur tablette et mobile. Cela vous donne une imerssion plus importante et permet de bien renseigner les fiches plus besoins de discord ou google sheet mal renseigné et qui vous oblige en jeux à faire un Alt+F4 utilisé votre téléphone portable IRL comme dans la vrai vie pour rester plus impliqué.

  # En vidéos (présentation & installation)
  - Twitch : https://www.twitch.tv/videos/1933946740
  - Youtube : https://www.youtube.com/live/v0403AWHffQ?si=z8nltXtASwQ597eA


# Patch-Notes
- **Version** : 1.0
- **2023-09-24** : Remise en forme du code + debug init sql

# Fonctionnalitées
- Gestion de vos effectifs (possibilité de mettre un effectif en démission ou standby pour bloquer ses accès en cas de mise à pied définitif ou temporaire)
- Gestion droits d'accès (admin, effectif standart, investigation et leur système d'enquêtes)
- Gestion recherche instannées des ammendes avec prix, pennes etc (en un seule champ)
- Création, recherche, classement de rapport de Police ou GN (plainte, main courante...)
- Création, recherche, classement de casier judiciaire avec photo desciptif
- Etablissement des ammendes attaché au casier avec calcul automatique des sommes des amandes, heures prisons, TIG avec calul aussi des avances données par le joueur pour atténuer sa penne
- Investigation menu spécifique avec droit : Création, recherche, classement de rapport de Police ou GN (plainte, main courante...), avec moteur de recherche pour enquêtes croisé.
- Système de partage avec URL encodé pour donner l'url à un joueur sans accès ou juge pour voir le dépot de plainte enquête en cours ou autre...

*(Tous les rapports, casier ont la possibilités d'avoir des photos il vous suffit d'y mettre l'url vers l'image vous pouvez didier un salon sur votre discord pour cela et click droit sur l'images et coller le lien.)*

# Compatibilitées
- Windows, Mac, Linux

# Pré-requis
- NodeJs (https://nodejs.org/en/)
- Base de donnée Maria ou MySql

# Installation (mise en place des packages)
1. Copier et renomer le fichier ".env_model" en ".env"
2. Ouvrir et adapter le contenu du fichier ".env"
3. Exécuter la ligne ci-dessous à la racine du projet (le système vas automatiquement chercher les dépendances en fonction de votre système)
```cmd
npm install
```
2. Utiliser le fichier "mysql_init.sql" pour initialiser votre base de donnée
5. Lancer votre serveur une première fois pour y créer votre compte admin (voir ci-dessous "lancement du serveur)
6. Aller en base de donnée, dans la table "players" ajouter une ligne avec "username" = "admin" et mettre 1 dans le champ "admin"
7. Aller sur la page d'accueil de votre site (voir image A ci-dessous), cliquer sur "S'authentifier" (bouton en vert)
8. Saisir admin et mot de passe au choix (attention cette opération requis WEB_SERVER_TOKEN dans env et NODE_ENV en mode dev)
9. Retourner sur votre terminal (voir image B ci-dessous) et récupérer le mot de passe crypté
10. Le coller dans le champ "password" de votre base de donnée
11. Vous pouvez utiliser votre site ***(attention si vous changer WEB_SERVER_TOKEN tous les mots de passe sont à refaire !)***

## Lancement du serveur
Run votre serveur node avec la commande ci-dessous, je vous conseil pm2 pour gérer le service
  ```cmd
  node app.js
  ```
NOTA: Pour la production et rendre plus solide votre site utilisez pm2 (https://pm2.keymetrics.io/)

## Les images (pour la doc voir ci-dessus)

### Image A
![image A](https://github.com/Casimodo/police_rp/blob/main/imageA.jpg?raw=true)

### Image B
![image B](https://github.com/Casimodo/police_rp/blob/main/imageB.jpg?raw=true)

# Petit conseil sur les outils de developpement (Free !)
- Cross-platform JavaScript runtime environment "NodeJs" (https://nodejs.org/fr)
- Editeur de code "Visual Studio Code" (https://code.visualstudio.com/)
- Installation micro machine "Docker" (https://www.docker.com/)
- Base de donnée Open "MariaDb" (https://mariadb.org/)
- Gestionnaire de base de donnée "HeidiSql" (https://www.heidisql.com/)

# Tips !!!
- Win + V : Permet le multi-collé (faire plusieur copier ou couper et les retrouver)
- Ctrl + Molette souris : Zoom sur les applications compatibles (marche sur les navigateur)
- Ctrl + 0 : Revenir au zoom standard 100%
- Ctrl + + : Zoom +
- Ctrl + - : Zoom -

## Sous VBS "Visual Studio Code"
- Shift + Alt + (flèche bas) : Copie de la ligne ou l'on ce trouve (si bloque séléctionné tout le block)
- Ctrl + ":" : Mise en commentaire de la ligne (s'adapte au code de la page)
- Ctrl + A : Mise en commentaire par bloque (s'adapte au code de la page)

