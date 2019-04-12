const PostgreSQL = require('./postgresql');
const faker = require('faker');
const hl = require('highland');
const moment = require('moment');

const SEED = 42;
const BATCH_SIZE = 1000;

faker.seed(SEED);
const COMPANIES = [ ...Array(1000) ].map(() =>
  ({
    name: `${faker.company.companyName()} ${faker.company.bs()}`,
    domain: faker.internet.domainName(),
  })
);

function* ids (year, keywordCount, marketCount) {
  const a = moment(`${year}-01-01`);
  const b = moment(`${year + 1}-01-01`);
  for (let d = moment(a); d.isBefore(b); d.add(1, 'days')) {
    for (let k = 1; k <= keywordCount; k++) {
      for (let m = 1; m <= marketCount; m++) {
        yield {
          keyword_id: k,
          market_id: m,
          created_date: d.format('YYYY-MM-DD'),
          entries: JSON.stringify([ ...Array(50) ].map((_, i) =>
            ({ rank: i + 1, ...faker.random.arrayElement(COMPANIES) })
          )),
        };
      }
    }
  }
}

module.exports = {
  generateFakeData: async (year, keywordCount, marketCount) => {
    return hl(ids(year, keywordCount, marketCount)).
      batch(BATCH_SIZE).
      map(hl.curry(PostgreSQL.bulkInsert, 'results')).
      flatMap(hl).
      collect().
      toPromise(Promise);
  },
};
