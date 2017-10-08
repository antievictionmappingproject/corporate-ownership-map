#!/bin/bash
docker-compose up &
sleep 30
export PGHOST='localhost'
export PGUSER=bob
export PGDATABASE=ownership
export PGPASSWORD=password123
export PGPORT=5432
node server.js
