docker run --name atomic-webui-0 --link redis-master -d -p 8000:8000 -v $PWD\app\web-ui:/app/web-ui bowzar/node-atomic-webui:0.1.1.0