#!/bin/bash
cd `dirname $(readlink -f $0)`

if [[ $1 == "" ]]; then
    echo "Usage $0 datadir <backup.sql.gz>"
    echo "      if datadir values VOLATILE, datadir will be kept inside container and a blank database will be created (otherwise, you have to init db yourself)"
    echo "      if datadir values VOLATILE_FILE, datadir will be kept inside container and a database will be created using provided file. If a script is specified as third argument, it will be executed after checkmateDB has been mounted"
    exit
fi

docker container rm -fv postgresql-checkmate
PG_VOLUMES="-v $PWD/files/root/scripts:/root/scripts/"
if [[ $1 != "VOLATILE" ]] && [[ $1 != "VOLATILE_FILE" ]]; then
    PG_VOLUMES="$PG_VOLUMES -v $1:/var/lib/postgresql/data/"
fi
if [[ $1 == "VOLATILE_FILE" ]]; then
    VOLUME_TAR="$(realpath $2)-volume-checkmate.tar"
    VOLUME_DIR="$2-volume"
    echo "Clean $VOLUME_DIR"
    rm -rf "$VOLUME_DIR"
    mkdir "$VOLUME_DIR"
    if [[ -f "$VOLUME_TAR" ]]; then
        echo "Extract tar $VOLUME_TAR with DB volume mounted into $VOLUME_DIR"
        pushd "$VOLUME_DIR"
        tar -xf "$VOLUME_TAR"
        popd
    else
        echo "Remove old tar files"
        find "$(dirname $VOLUME_TAR)" -maxdepth 1 -regex '.*-volume-checkmate\.tar' -delete
    fi
    PG_VOLUMES="$PG_VOLUMES -v $VOLUME_DIR:/var/lib/postgresql/data/"
fi
PG_ENV="-e POSTGRES_DB=checkmate"
PG_ENV="$PG_ENV -e POSTGRES_PASSWORD=postgres"
PG_ENV="$PG_ENV -e LC_ALL=en_US.UTF-8"
PG_ENV="$PG_ENV -e LC_CTYPE=en_US.UTF-8"

docker run --shm-size=256M -p 5432:5432 -e TZ=Europe/Amsterdam --name postgresql-checkmate --network=host $PG_VOLUMES $PG_ENV -d postgis/postgis:17-3.5

waitForPostgres () {
  echo "Waiting for Postgres to be ready..."
  docker exec postgresql-checkmate /root/scripts/wait-for-db.sh postgres 'select 1'
  echo "... Postgres is ready!"
}
docker exec postgresql-checkmate /root/scripts/init-db.sh /tmp/checkmate.sql

if [[ $1 == "VOLATILE" ]]; then
	docker exec postgresql-checkmate bash -c "ln -fs /usr/share/zoneinfo/Europe/Paris /etc/localtime && dpkg-reconfigure --frontend noninteractive tzdata"
	waitForPostgres
	docker exec postgresql-checkmate /root/scripts/init-db.sh
fi

if [[ $1 == "VOLATILE_FILE" ]] && [[ ! -f "$VOLUME_TAR" ]]; then
	docker exec postgresql-checkmate bash -c "ln -fs /usr/share/zoneinfo/Europe/Paris /etc/localtime && dpkg-reconfigure --frontend noninteractive tzdata"
	gunzip -c $2  > /tmp/checkmate.sql
	docker cp /tmp/checkmate.sql postgresql-checkmate:/tmp/checkmate.sql
	waitForPostgres 
	docker exec postgresql-checkmate /root/scripts/init-db.sh /tmp/checkmate.sql
	waitForcheckmateDB
	rm /tmp/checkmate.sql
	if [[ -f "$3" ]]; then
	  echo "Execute SQL scripts post checkmateDB"
	  bash $3
	fi
	echo "Creating $VOLUME_TAR from DB volume"
	TAR_NAME=`basename $VOLUME_TAR`
	docker exec postgresql-checkmate bash -c "tar -C /var/lib/postgresql/data/ -c -f /tmp/$TAR_NAME . "
	docker cp postgresql-checkmate:/tmp/$TAR_NAME "$VOLUME_TAR"
	docker exec postgresql-checkmate bash -c "chmod -R 777 /var/lib/postgresql/data/"
fi

if [[ $1 == "VOLATILE_FILE" ]]; then
  waitForPostgres
  waitForcheckmateDB
  docker exec postgresql-checkmate bash -c "chmod -R 777 /var/lib/postgresql/data/"
fi
