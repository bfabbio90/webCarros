# Usa a imagem do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependência (package.json etc.)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Compila a aplicação para produção
RUN npm run build

# Usa uma imagem leve para servir a aplicação (nginx)
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Comando padrão ao iniciar o contêiner
CMD ["nginx", "-g", "daemon off;"]
