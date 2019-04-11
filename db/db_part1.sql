CREATE TABLE results_2017 (
    keyword_id INT NOT NULL,
    market_id INT NOT NULL,
    created_date DATE NOT NULL,
    entries JSONB NOT NULL,
    PRIMARY KEY (keyword_id, market_id, created_date)
);

CREATE INDEX idx_results_2017_keyword_id ON results_2017 (keyword_id);
CREATE INDEX idx_results_2017_market_id ON results_2017 (market_id);
CREATE INDEX idx_results_2017_created_date ON results_2017 (created_date);

CREATE TABLE results_2018 (
    keyword_id INT NOT NULL,
    market_id INT NOT NULL,
    created_date DATE NOT NULL,
    entries JSONB NOT NULL,
    PRIMARY KEY (keyword_id, market_id, created_date)
);

CREATE INDEX idx_results_2018_keyword_id ON results_2018 (keyword_id);
CREATE INDEX idx_results_2018_market_id ON results_2018 (market_id);
CREATE INDEX idx_results_2018_created_date ON results_2018 (created_date);
