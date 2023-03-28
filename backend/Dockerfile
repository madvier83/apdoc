# Set the base image to use.
FROM php:8.2.3-fpm-alpine

# Developer Label Application
LABEL author="Cursor Developer"
LABEL company="PT. Oasis Mitra Tritunggal" web="https://www.cursor.id"

# Set the working directory in the container.
WORKDIR /var/www/appdoc_api

# Copy the codebase into the container.
COPY . /var/www/appdoc_api

# Install Nginx.
RUN apk add --no-cache nginx

# Copy the custom Nginx configuration file into the container.
COPY nginx.conf /etc/nginx/conf.d/
# COPY nginx.conf /etc/nginx/

# Remove the default Nginx configuration file.
RUN ls /etc/nginx/conf.d/
# RUN ls /etc/nginx/

# Install required PHP extensions.
RUN docker-php-ext-install pdo pdo_mysql

# Expose port 80 for Nginx.
EXPOSE 80

# Start Nginx and PHP-FPM when the container starts.
CMD ["/bin/sh", "-c", "nginx && php-fpm"]