# Version
- Under construction not finish

# Pré-requis
- Installation de NodeJs ==> https://nodejs.org/en/
- Récupérer clé pour steam (voir section "see for authent steam ci-dessous)
- Installation de Pm2 ==> https://pm2.keymetrics.io/

# Pour Pm2 sous windows
- https://go.microsoft.com/fwlink/?LinkID=135170
- Sinon faire les commandes à la suite uniquement pour le powershell ouvert en admin
  ```code
  Get-ExecutionPolicy -List
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
  ```

# Installation (mise en place des packages)
```cmd
npm install
```

# Utilisation

## Configuration
1. Créer ou set un fichier .env
```code
DATABASE_URL="mysql://<LOGIN_DB>:<PASS_DB>@<IP_DB>:<PORT_DB>/Reality_Police"
NODE_ENV="<dev OU prod>"
PROTOCOL="<http OU https>"
URL="<URL>"
ENV_PORT="<TOKEN>"
WEB_SERVER_TOKEN="<PERSONNAL TOKEN>"
```
2. Utiliser le fichier "mysql_init.sql" pour initialiser votre base de donnée
3. Run votre serveur node avec la commande ci-dessous, je vous conseil pm2 pour gérer le service

## Lancement du serveur
  ```cmd
  pm2 start ecosystem.json --env development
  ```


# NOTA: Petite aide
<%= moment(datas[i].date_create).format('DD/MM/YYYY HH:mm') %>
<%= Intl.NumberFormat('us-US').format(3000) %>
