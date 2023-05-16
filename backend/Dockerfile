FROM alpine:3.14

# Install packages and remove default server definition
RUN apk --no-cache add \
  curl \
  nginx \
  php8 \
  php8-ctype \
  php8-curl \
  php8-dom \
  php8-fpm \
  php8-gd \
  php8-intl \
  php8-json \
  php8-mbstring \
  php8-mysqli \
  php8-opcache \
  php8-openssl \
  php8-phar \
  php8-session \
  php8-xml \
  php8-xmlreader \
  php8-zlib \
  php8-redis \
  php8-xmlwriter \
  php8-tokenizer \
  php8-pdo \
  php8-pdo_mysql

RUN ln -s /usr/bin/php8 /usr/bin/php
# if need composer to update plugin / vendor used
RUN php8 -r "copy('http://getcomposer.org/installer', 'composer-setup.php');" && \
php8 composer-setup.php --install-dir=/usr/bin --filename=composer && \
php8 -r "unlink('composer-setup.php');"

# copy all of the file in folder to /src
COPY . /var/www/appdoc_api
WORKDIR /var/www/appdoc_api

# COPY ENV FILE
RUN cp .env\ server .env

RUN chown -R :www-data /var/www && \
    chmod -R 775 storage && \
    chmod -R 775 public

COPY ./scripts/setup.sh /usr/local/bin/dockerInit

RUN chmod +x /usr/local/bin/dockerInit
# RUN composer update
#move to sh command
ENTRYPOINT ["sh","/usr/local/bin/dockerInit"]
# RUN php artisan key:generate && \
#     php artisan migrate:fresh --seed

# run the php server service
# move this command to -> docker-compose.yml
# CMD php -S 0.0.0.0:8000 -t public