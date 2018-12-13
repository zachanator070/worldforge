dev:
	docker-compose up -d dev && docker-compose logs -f

prod:
	docker-compose up -d prod

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

install: build
	mkdir /srv/worldforge
	cp -r . /srv/worldforge
	install -m 644 worldforge.service /lib/systemd/system/worldforge.service
	systemctl daemon-reload
	systemctl enable worldforge
	systemctl start worldforge

remove:
	- systemctl stop worldforge
	- systemctl disable worldforge
	- rm /etc/systemd/system/worldforge.service
	- systemctl daemon-reload
	- rm -rf /srv/worldforge
