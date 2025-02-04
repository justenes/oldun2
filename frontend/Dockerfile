# Frontend için Dockerfile
FROM node:20

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılıkları yükle
COPY package.json package-lock.json ./
RUN npm install

# Frontend dosyalarını kopyala
COPY . .

# React uygulamasını build et
RUN npm run build

# Serve ile frontend'i çalıştır
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Portu aç
EXPOSE 3000
