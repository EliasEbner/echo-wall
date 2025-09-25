deploy:
	npm run build
	rsync -zar ./build/* root@159.195.7.16:/var/www/globalechowall.com/html --progress
