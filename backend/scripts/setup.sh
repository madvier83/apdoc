#!/bin/bash
# Create log file for Laravel and give it write access
# www-data is a standard apache user that must have an
# access to the folder structure
# chgrp -R www-data storage /app && \
# chown -R www-data storage /app && \
# chmod -R ug+rwx storage /app && \
# chmod 776 storage/ -R
# running composer update
composer update
# running artisan command
php artisan key:generate
# migrate tables and seeder
php artisan migrate:fresh --seed
echo "Setup Done"
exec "$@"