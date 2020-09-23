# Deployment to Azure App Services

## Configuring app settings

Set the following app settings:
- **PORT** - desired port number `P`
- **WEBSITES_PORT** - desired port number `P`

## Configuring site startup

Set the startup command to `npm i -g serve && serve -l <P> -s build`, where `<P>` is the port number, in Configuration -> General Settings. Otherwise the site will attempt to start up with `npm start`, which is only the development server.

## Enabling HTTPS redirection

Enable HTTPS Only in the TLS/SSL settings panel.
