FROM node:slim
RUN apt-get update && apt-get install -y python3 python3-pip
RUN mkdir -p /home/node/app
RUN chown -R node:node /home/node/app
USER node
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node ./ ./
EXPOSE 3333
CMD ["npm", "run", "watch"]
