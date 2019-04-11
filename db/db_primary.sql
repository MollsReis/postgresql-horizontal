CREATE EXTENSION postgres_fdw;

CREATE SERVER db_part1 FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (host 'db_part1', dbname 'scaling');

CREATE SERVER db_part2 FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (host 'db_part2', dbname 'scaling');

CREATE USER MAPPING FOR CURRENT_USER SERVER db_part1
    OPTIONS (user 'user', password 'pass');

CREATE USER MAPPING FOR CURRENT_USER SERVER db_part2
    OPTIONS (user 'user', password 'pass');

CREATE TABLE results (
    keyword_id INT NOT NULL,
    market_id INT NOT NULL,
    created_date DATE NOT NULL,
    entries JSONB NOT NULL
) PARTITION BY RANGE (created_date);

CREATE FOREIGN TABLE results_2017
    PARTITION OF results
    FOR VALUES FROM ('2017-01-01') TO ('2018-01-01')
    SERVER db_part1;

CREATE FOREIGN TABLE results_2018
    PARTITION OF results
    FOR VALUES FROM ('2018-01-01') TO ('2019-01-01')
    SERVER db_part1;

CREATE FOREIGN TABLE results_2019
    PARTITION OF results
    FOR VALUES FROM ('2019-01-01') TO ('2020-01-01')
    SERVER db_part2;

CREATE FOREIGN TABLE results_2020
    PARTITION OF results
    FOR VALUES FROM ('2020-01-01') TO ('2021-01-01')
    SERVER db_part2;
