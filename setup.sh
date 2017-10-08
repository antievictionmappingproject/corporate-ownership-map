#!/bin/bash

set -e

check(){
  DOCKER_CHECK=$(docker version)
  if [ "$?" -ne 0 ]; then
    echo "Please enable docker for this script to work"
    exit 1
  fi
}

db_check(){
  docker run -e PGPASSWORD=password123 --net=host -it postgres sh -c 'exec psql -h localhost -p 5432 -U bob -l'  | cut -d \| -f 1 | grep -qw ownership
}

create_db(){
  docker run -e PGPASSWORD=password123 --net=host postgres sh -c 'exec psql -h localhost -p 5432 -U bob -c "CREATE DATABASE ownership;"' > /dev/null 2>&1
}


populate_db(){
  docker run -v $PWD/scripts:/scripts/ -v $PWD/rawdata:/rawdata/ -w /scripts --net=host amancevice/pandas:0.20.3-python2-slim sh -c 'pip install -r requirements.txt && ./create-table.py ../rawdata/sf-ownership.csv'
}

table_check(){
  echo $1
  docker run -it -e PGPASSWORD=password123 --net=host postgres sh -c 'exec psql -h localhost -p 5432 -U bob  ownership -c "\dt"' | grep -qw $1
}

create_owner_table(){
docker run --net=host -v $PWD/rawdata:/rawdata:ro -v $PWD/scripts:/scripts/:ro -w /scripts amancevice/pandas:0.20.3-python2-slim sh -c 'ls -alh && pip install -r requirements.txt && ./create-table.py ../rawdata/sf-ownership.csv'
}

create_corp_table(){
  docker run -it -e PGPASSWORD=password123 --net=host -v $PWD/sql:/sql/:ro -w /sql postgres sh -c 'exec \
    psql -h localhost \
    -p 5432 -U bob \
    -f create-llc.sql \
    --echo-all \
    --set ON_ERROR_STOP=on \
    ownership'
  if [ $? != 0 ]; then
      echo "psql failed while trying to run this sql script" 1>&2
      exit $psql_exit_status
  fi
}

check
db_check
if [ $? -ne 0 ]; then
  echo 'Database does not exist... setting one up'
  create_db
  if [ $? -ne 0 ]; then
    echo 'error creating db'
    exit 1
  fi
fi

echo 'Database setup. Checking if table exists'
table_check 'sf-ownership'
if [ $? -ne 0 ]; then
  echo 'Table does not exist... setting up sf ownership table'
  create_owner_table
  if [ $? -ne 0 ]; then
    echo 'error creating table'
    exit 1
  fi
fi
echo 'sf owners exists'

echo 'Checking LLC table'
create_corp_table
#table_check 'corp'
#if [ $? -ne 0 ]; then
#  echo 'Table does not exist... setting up corp table'
#  create_corp_table
#  if [ $? -ne 0 ]; then
#    echo 'error creating corp table'
#    exit 1
#  fi
#else
#  printf 'yo'
#fi

