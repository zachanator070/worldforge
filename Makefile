dev:
	docker-compose up -d dev && docker-compose logs -f

prod:
	docker-compose up -d prod

down:
	docker-compose down