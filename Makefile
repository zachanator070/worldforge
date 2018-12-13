dev-config:
	touch .env

dev: dev-config
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

prod-config:
	- mkdir /etc/worldforge
	cp example.env /etc/worldforge/.env

prod:
	docker-compose up prod mongodb-prod redis-prod

install: prod-config build
	useradd worldforge
	usermod -G docker worldforge
	mkdir /srv/worldforge
	cp -r . /srv/worldforge
	chown -R worldforge:worldforge /srv/worldforge
	install -m 644 worldforge.service /lib/systemd/system/worldforge.service
	systemctl daemon-reload
	systemctl enable worldforge
	systemctl start worldforge

remove:
	- systemctl stop worldforge
	- systemctl disable worldforge
	- rm /lib/systemd/system/worldforge.service
	- systemctl daemon-reload
	- rm -rf /srv/worldforge
	- rm -rf /etc/worldforge
	- userdel worldforge
