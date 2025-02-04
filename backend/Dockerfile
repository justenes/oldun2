# Backend için Dockerfile
FROM node:20

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılıkları yükle
COPY package.json package-lock.json ./
RUN npm install

# Backend dosyalarını kopyala
COPY . .

# Portu aç
EXPOSE 5000

# Backend sunucusunu çalıştır
CMD ["npm", "start"]
