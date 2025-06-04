FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf

COPY static /usr/share/nginx/html/static
COPY templates /usr/share/nginx/html/templates

ENV PORT=80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]