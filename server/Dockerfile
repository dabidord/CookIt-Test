FROM node:15
WORKDIR /app
COPY package.json .
RUN yarn install 
COPY . ./
EXPOSE 8000
CMD ["node", "server.js"]