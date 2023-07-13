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

# see for authent steam
- https://www.npmjs.com/package/passport-steam
- http://steamcommunity.com/dev/apikey
- https://stackoverflow.com/questions/36879159/login-into-a-website-with-steam-login-using-nodejs

# Petite aide
<%= moment(datas[i].date_create).format('DD/MM/YYYY HH:mm') %>
<%= Intl.NumberFormat('us-US').format(3000) %>

# Utilisation

## Configuration
1. Copier / Coller le fichier "config_template.json" dans le dossier /configs
2. Le renomer en "config_prod.json"

## Lancement du serveur
  ```cmd
  pm2 start ecosystem.json --env development
  ```
