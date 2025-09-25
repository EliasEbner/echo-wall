deploy:
	go build -o start-api
	rsync -zar ./start-api ./.env  echowall@159.195.7.16:/projects/echowall/api.globalechowall.com --progress
