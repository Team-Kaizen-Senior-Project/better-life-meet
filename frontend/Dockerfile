FROM node:slim
RUN mkdir -p /home/node/app
RUN chown -R node:node /home/node/app
USER node
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node ./ ./
RUN npm run postinstall
EXPOSE 3000
CMD ["npm", "run", "dev"]
