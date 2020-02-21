const got = require('got');
const cheerio = require('cheerio');
const Source = require('../models/Source');
const { applyMiddleware, RequestError } = require('../lib/applyMiddleware');
const withMongoose = require('../lib/withMongoose');
const appConfig = require('../lib/appConfig');

module.exports = applyMiddleware([withMongoose], (req, res) => {
  if (req.method !== 'GET') {
    throw new RequestError(404, 'Unsupported request method');
  }

  try {
    const bodies = fetchSystem();
    console.table(bodies);
  } catch (err) {
    throw err;
    throw new RequestError(500, 'Unable to query database');
  }
});

async function fetchSystem() {
  // Retrieve cached source record from database
  const SOURCE_URL = `${appConfig.wikiUrlPrefix}/wiki/Kerbol_System`;
  const source = await Source.findOne({ url: SOURCE_URL });

  // If record does not exist, scrape source url and cache response body
  // TODO: add timestamp field and determine when outdated cache should be updated
  if (!source) {
    console.log(
      `Cache for source '${SOURCE_URL}' does not exist. We should fetch it.`
    );

    // Scrape the SOURCE_URL and store response body in sources db
    scrapeSource(SOURCE_URL, response => {
      console.log(`Successfully scraped source: ${SOURCE_URL}`);
      const newSource = new Source({
        url: SOURCE_URL,
        responseBody: response.body
      }).save();
    });
  }
  console.log(`Using cached source: ${source.url}`);
  // TODO: Parse response body into list of system bodies
  // TODO: Scrape details for each body
  // TODO: Return list of bodies
  return [];
}

async function scrapeSource(source, callback) {
  try {
    const response = await got(source);

    if (response.statusCode != 200) {
      console.log(`Status: ${response.statusCode}`);
      console.log('Content-Type is:', response.caseless.get('Content-Type'));
      console.log(`Length: ${html.length}`);
      throw 'Invalid response code';
    }
    return callback(response);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

function parseSystem(html) {
  const $ = cheerio.load(html);
  const bodies = [];
  let currentIndex = 0;

  $('.mp-planetnav tr').each((i, el) => {
    const planet = $(el).find('td');

    const name = planet.find('.planetlabel a').attr('title');
    const link = planet.find('.planetlabel a').attr('href');
    const moons = planet.nextAll();

    if (name) {
      if (name.toLowerCase() === appConfig.centralBody.toLowerCase()) {
        bodies.push({
          name,
          moons: null,
          aroundBody: null,
          rel: `${appConfig.urlprefix}/bodies/${name.toLowerCase()}`,
          source: `${appConfig.wiki}${link}`
        });
      } else {
        bodies.push({
          name,
          moons: [],
          aroundBody: {
            body: appConfig.centralBody.toLowerCase(),
            rel: `${
              appConfig.urlprefix
            }/bodies/${appConfig.centralBody.toLowerCase()}`
          },
          rel: `${appConfig.urlprefix}/bodies/${name.toLowerCase()}`,
          source: `${appConfig.wiki}${link}`
        });
        currentIndex++;
      }

      moons.each((j, el) => {
        const moon = $(el)
          .find('.planetlabel a')
          .attr('title');
        const link = $(el)
          .find('.planetlabel a')
          .attr('href');
        if (moon) {
          bodies[currentIndex].moons.push({ moon, link });
          bodies.push({
            name: moon,
            moons: [],
            aroundBody: {
              body: name.toLowerCase(),
              rel: `${appConfig.urlPrefix}/bodies/${name.toLowerCase()}`
            },
            rel: `${appConfig.urlPrefix}/bodies/${moon.toLowerCase()}`,
            source: `${appConfig.wikiUrlPrefix}${link}`
          });
        }
      });
      currentIndex += moons.length;
    }
  });
  return bodies;
}
