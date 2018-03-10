FROM node

ENV HTTP_PORT 8000

COPY . /app  
WORKDIR /app

RUN npm install --registry=https://registry.npm.taobao.org

EXPOSE 8000

CMD ["node", "index.js"]  