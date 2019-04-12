# Horizontal PostgreSQL v11 Scaling using FDWs and Partition Tables

This is a proof-of-concept for a PostgreSQL logical+phsyical sharding strategy. Taking advantage of [postgres_fdw](https://www.postgresql.org/docs/current/postgres-fdw.html) and [table partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html), this pattern allows for spreading the data from a partition table among multiple physical servers.

Requirements:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

Usage:
1. Start up the Docker stack:
```bash
$ docker-compose up -d
```

2. Wait until you see the `Listening on port 5555...` message in the `server` container logs

3. Kick off fake data population:
```bash
$ curl http://localhost:5555/populate
```

4. Wait until you see the `Done populating DB!` message in the `server` container logs (this will take a while)

5. Browse the DB via:
```
$ docker-compose exec db_primary -U user -d scaling
```
