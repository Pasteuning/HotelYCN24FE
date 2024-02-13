
FROM nginx:1.10.1-alpine
COPY . /usr/share/nginx/html

RUN echo "daemon off;" >> /etc/nginx/nginx.conf

CMD nginx