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

/**
 * Returns a list of planetary bodies in the Kerbol system
 *
 * @returns {Object[]} The list of `Body` objects representing planetary bodies
 */
function fetchSystem() {
  // Retrieve cached source for Kerbol System wiki page
  let response = fetchSource(`${appConfig.wikiUrlPrefix}/wiki/Kerbol_System`);

  // Parse response body and generate list of system bodies
  let bodies = parseSystem(response);

  bodies.each(body => {
    // Retrieve cached source for each planetary body's wiki page
    let response = fetchSource(body.rel);

    // Parse response body and update list of system bodies
    bodies = parseBody(response, bodies);
  });

  // TODO: Store Body objects in the database so
  // we don't have to generate them each time

  return bodies;
}

/**
 * Returns the (cached if available) response body for the provided URL
 *
 * @param {string} url The URL to be scraped
 * @return {string} The response body of the scraped URL
 */
async function fetchSource(url) {
  const source = await Source.findOne({ url });

  // If record DNE or expired, scrape source url and cache response body
  // TODO: add timestamp field and determine when cache should be updated
  if (!source) {
    if (!source) {
      console.log(
        `Cache for source '${SOURCE_URL}' does not exist. We should fetch it.`
      );
    } else if (source.expired) {
      console.log(
        `Cache for source '${SOURCE_URL}' is expired. We should fetch it.`
      );
    }

    return scrapeSource(SOURCE_URL);
  } else {
    console.log(`Using cached source: ${source.url}`);

    return source.responseBody;
  }
}

/**
 * Scrapes the provided URL and caches the response body
 *
 * @param {string} url The URL to be scraped
 * @returns {string} The response body of the scraped URL
 */
async function scrapeSource(url) {
  try {
    // Scrape the URL
    const response = await got(url);

    // Ensure correct status code
    if (response.statusCode != 200) {
      console.log(`Status: ${response.statusCode}`);
      console.log('Content-Type is:', response.caseless.get('Content-Type'));
      console.log(`Length: ${html.length}`);
      throw 'Invalid response code';
    }

    console.log(`Successfully scraped source: ${url}`);

    // Cache the response body
    // TODO: replace with upsert
    const newSource = new Source({
      url,
      responseBody: response.body
    }).save();

    return response.body;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

/**
 * Converts provided Kerbol System html into barebones list of planetary bodies
 *
 * @param {string} html The html of the Kerbol System wiki page
 * @returns {Object[]} The barebones list of planetary bodies
 */
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

/**
 * Update planetary bodies list with details from wiki page html
 *
 * @param {string} html The html of the planetary body's wiki page
 * @returns {Object[]} The updated list of planetary bodies
 */
function parseBody(html, bodies) {
  // TODO: do thing
}
