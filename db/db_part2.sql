CREATE TABLE results_2019 (
    keyword_id INT NOT NULL,
    market_id INT NOT NULL,
    created_date DATE NOT NULL,
    entries JSONB NOT NULL,
    PRIMARY KEY (keyword_id, market_id, created_date)
);

CREATE INDEX idx_results_2019_keyword_id ON results_2019 (keyword_id);
CREATE INDEX idx_results_2019_market_id ON results_2019 (market_id);
CREATE INDEX idx_results_2019_created_date ON results_2019 (created_date);

CREATE TABLE results_2020 (
    keyword_id INT NOT NULL,
    market_id INT NOT NULL,
    created_date DATE NOT NULL,
    entries JSONB NOT NULL,
    PRIMARY KEY (keyword_id, market_id, created_date)
) PARTITION BY RANGE (created_date);

CREATE INDEX idx_results_2020_keyword_id ON results_2020 (keyword_id);
CREATE INDEX idx_results_2020_market_id ON results_2020 (market_id);
CREATE INDEX idx_results_2020_created_date ON results_2020 (created_date);

CREATE TABLE results_2020_h1 PARTITION OF results_2020
    FOR VALUES FROM ('2020-01-01') TO ('2020-07-01');

CREATE TABLE results_2020_h2 PARTITION OF results_2020
    FOR VALUES FROM ('2020-07-01') TO ('2021-01-01');
