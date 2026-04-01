/**
 * Configuration de l'environnement de développement pour MacSpace.
 * apiUrl pointe vers l'IP locale du PC pour que le mobile puisse
 * communiquer avec le backend Spring Boot sur le réseau WiFi.
 */
export const environment = {
  production: false,
  apiUrl: 'http://192.168.1.84:8080/gestiondestock/v1'
};