deploy:
	cd frontend && npm run build
	rsync -zar ./* root@159.195.7.16:/var/www/globalechowall.com/ --progress
