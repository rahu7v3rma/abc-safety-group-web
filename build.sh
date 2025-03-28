#!/bin/bash

git pull origin master &&
docker compose -f docker-compose.yml build &&
docker compose -f docker-compose.yml push &&
docker stack rm abc_web &&
sleep 5 &&
docker stack deploy -c docker-compose.yml abc_web