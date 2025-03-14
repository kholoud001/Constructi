# Étape de build
FROM node:20-alpine AS build
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Build l'application Angular en mode production
RUN npm run build -- --configuration production

# Étape d'exécution
FROM nginx:alpine

# Copier les fichiers de build de l'étape précédente
COPY --from=build /app/dist/your-angular-app-name /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
