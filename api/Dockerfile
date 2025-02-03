# Usa a imagem oficial do Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto para o container
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Instala as dependências
RUN npm install

# Compila o código TypeScript
RUN npm run build

# Expõe a porta 3000 dentro do container
EXPOSE 3000

# Define o comando para rodar a API
CMD ["npm", "run", "start:prod"]

