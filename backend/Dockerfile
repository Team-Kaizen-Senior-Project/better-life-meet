FROM node:slim
RUN apt-get update && apt-get install -y python3
WORKDIR /opt/app
COPY package*.json ./
RUN npm install
COPY ./ ./
EXPOSE 3333
CMD npm run watch

