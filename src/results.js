const PostgreSQL = require('./postgresql');
const faker = require('faker');
const moment = require('moment');

faker.seed(42);
const COMPANIES = [ ...Array(1000) ].map(() =>
  ({
    name: `${faker.company.companyName()} ${faker.company.bs()}`,
    url: faker.internet.url(),
  })
);

module.exports = {
  // TODO stream this shit
  generateFakeData: async (year, keywordCount, marketCount) => {
    let values = [];
    const a = moment(`${year}-01-01`);
    const b = moment(`${year + 1}-01-01`);
    for (let d = moment(a); d.isBefore(b); d.add(1, 'days')) {
      for (let k = 1; k <= keywordCount; k++) {
        for (let m = 1; m <= marketCount; m++) {
          const row = {
            keyword_id: k,
            market_id: m,
            created_date: d.format('YYYY-MM-DD'),
            entries: JSON.stringify([ ...Array(50) ].map((_, i) =>
              ({ rank: i + 1, ...faker.random.arrayElement(COMPANIES) })
            )),
          };
          values = [ ...values, row ];
        }
      }
    }
    console.log(`Generated data for ${year}...`);
    return PostgreSQL.bulkInsert('results', values);
  },
};
