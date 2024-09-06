FROM byjg/nginx-extras:1.25

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

COPY LARPlaner.crt /etc/ssl/certs/larplaner.com.crt
COPY LARPlaner.key /etc/ssl/private/larplaner.com.key
COPY example_password_file /etc/ssl/private/larplaner.com.pass
