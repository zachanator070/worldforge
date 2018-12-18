
dev:
	touch .env
	docker-compose up -d dev && docker-compose logs -f

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart
	docker-compose logs -f

stop:
	docker-compose stop

build:
	docker-compose up build-prod

prod:
	docker-compose up prod mongodb-prod redis-prod

install: build
	mkdir /srv/worldforge
	cp -r . /srv/worldforge
	cp ./example.env /srv/worldforge/.env
	install -m 644 worldforge.service /lib/systemd/system/worldforge.service
	systemctl daemon-reload
	systemctl enable worldforge
	systemctl start worldforge

upgrade: build
	systemctl stop worldforge
	cp -r . /srv/worldforge
	systemctl start worldforge

remove:
	- systemctl stop worldforge
	- systemctl disable worldforge
	- rm /lib/systemd/system/worldforge.service
	- systemctl daemon-reload
	- rm -rf /srv/worldforge
