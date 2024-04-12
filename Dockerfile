FROM node:21-alpine3.18
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 4000
CMD [ "npm", "run", "start" ]
