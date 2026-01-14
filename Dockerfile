FROM node:latest
WORKDIR /data
COPY . /data
COPY env.example /data/.env
RUN cd /data && npm install --force
EXPOSE 3000/tcp
CMD ["node", "server.js"]
