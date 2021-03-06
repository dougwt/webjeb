const got = require('got');
const cheerio = require('cheerio');
const Source = require('../models/Source');
const Body = require('../models/Body');
const { applyMiddleware, RequestError } = require('../lib/applyMiddleware');
const logger = require('../lib/logger');
const appConfig = require('../lib/appConfig');

module.exports = applyMiddleware(async (req, res) => {
  const start = new Date().getTime();
  if (req.method !== 'GET') {
    throw new RequestError(404, 'Unsupported request method');
  }

  try {
    const { updated, bodies } = await fetchSystem();
    const end = new Date().getTime();
    const executionTime = end - start;

    logger.debug(`Total execution time: ${executionTime} ms`);
    // logger.debug(bodies);

    res.json({
      success: true,
      updated,
      executionTime
    });
  } catch (err) {
    res.json({
      success: false,
      error: err
    });
  }
});

/**
 * Returns a list of planetary bodies in the Kerbol system
 *
 * @returns {Object[]} The list of `Body` objects representing planetary bodies
 */
async function fetchSystem() {
  // Retrieve cached source for Kerbol System wiki page
  let { updated, response } = await fetchSource(
    `${appConfig.wikiUrlPrefix}/wiki/Kerbol_System`
  );

  // Parse response body and generate list of system bodies
  let bodies = parseSystem(response);

  if (updated) {
    let index = 0;
    for (let body of bodies) {
      // Retrieve cached source for each planetary body's wiki page
      let { _, response } = await fetchSource(body.source);

      // Parse response body and update planetary body
      body = parseBody(response, body);
      bodies[index++] = body;

      // Store Body objects in the database so
      // we don't have to generate them each time
      const { name, ...rest } = body;
      await Body.findOneAndUpdate({ name }, { ...rest }, { upsert: true });
      logger.debug(`Database record updated for '${name}'`);
    }
  }

  return { updated, bodies };
}

/**
 * Returns the (cached if available) response body for the provided URL
 *
 * @param {string} url The URL to be scraped
 * @return {string} The response body of the scraped URL
 */
async function fetchSource(url) {
  try {
    let updated = false;
    let responseBody;
    const source = await Source.findOne({ url });
    // If record DNE or expired, scrape source url and cache response body
    if (!source || source.expired) {
      if (!source) {
        logger.debug(
          `Cache for source '${url}' does not exist. We should fetch it.`
        );
      } else if (source.expired) {
        logger.debug(
          `Cache for source '${url}' has expired. We should fetch it.`
        );
      }
      updated = true;
      responseBody = await scrapeSource(url);
    } else {
      logger.debug(`Using cached source: ${source.url}`);

      responseBody = source.responseBody;
    }
    return { updated, response: responseBody };
  } catch (error) {
    logger.debug('Unable to fetch source');
    logger.error(error);
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
      logger.debug(`Status: ${response.statusCode}`);
      logger.debug('Content-Type is:', response.caseless.get('Content-Type'));
      logger.debug(`Length: ${html.length}`);
      throw 'Invalid response code';
    }

    logger.debug(`Successfully scraped source: ${url}`);

    // Cache the response body
    await Source.findOneAndUpdate(
      { url },
      { responseBody: response.body },
      { upsert: true }
    );

    return response.body;
  } catch (error) {
    // TODO: handle this better
    logger.error(`Error: ${error}`);
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
        bodies.push(generateSun(name, link));
      } else {
        bodies.push(generatePlanet(name, link));
        currentIndex++;
      }

      moons.each((j, el) => {
        const parent = name;
        const moon = $(el)
          .find('.planetlabel a')
          .attr('title');
        const link = $(el)
          .find('.planetlabel a')
          .attr('href');
        if (moon) {
          bodies[currentIndex].moons.push({
            moon,
            rel: `/bodies/${moon.toLowerCase()}`
          });
          bodies.push(generateMoon(moon, parent, link));
        }
      });
      currentIndex += moons.length;
    }
  });
  return bodies;
}

/**
 * Generates a object representing the Sun
 *
 * @param {string} name The name of the star
 * @param {string} link The source link for the star
 * @returns The object describing the Sun
 */
function generateSun(name, link) {
  return {
    name,
    moons: null,
    aroundBody: null,
    source: `${appConfig.wikiUrlPrefix}${link}`,
    rel: `/bodies/${name.toLowerCase()}`
  };
}

/**
 * Generates an object representing a planet
 *
 * @param {string} name The name of the planet
 * @param {string} link The source link for the planet
 * @returns The object describing the planet
 */
function generatePlanet(name, link) {
  return {
    name,
    moons: [],
    aroundBody: {
      body: appConfig.centralBody.toLowerCase(),
      rel: `/bodies/${appConfig.centralBody.toLowerCase()}`
    },
    source: `${appConfig.wikiUrlPrefix}${link}`,
    rel: `/bodies/${name.toLowerCase()}`
  };
}

/**
 * Generates an object representing a moon
 *
 * @param {string} name The name of the moon
 * @param {string} parent The name of the moon's planet
 * @param {string} link The source link for the moon
 * @returns The object describing the moon
 */
function generateMoon(name, parent, link) {
  return {
    name,
    moons: [],
    aroundBody: {
      body: parent.toLowerCase(),
      rel: `/bodies/${parent.toLowerCase()}`
    },
    source: `${appConfig.wikiUrlPrefix}${link}`,
    rel: `/bodies/${name.toLowerCase()}`
  };
}

/**
 * Update planetary bodies list with details from wiki page html
 *
 * @param {string} html The html of the planetary body's wiki page
 * @returns {Object[]} The updated list of planetary bodies
 */
function parseBody(html, body) {
  const $ = cheerio.load(html);

  const { name, moons, aroundBody, ...rest } = body;

  const mass = {
    massValue: parseFloat(
      $('a[title="w:Mass"]')
        .parent()
        .next()
        .find('span')
        .text()
    ),
    massExponent: parseInt(
      $('a[title="w:Mass"]')
        .parent()
        .next()
        .find('sup')
        .text()
    )
  };
  const equatorialRadius = parseInt(
    $('a[title="w:Radius"]')
      .parent()
      .next()
      .find('span')
      .text()
      .replace(/\s/g, '')
  );
  const surfaceGravity = parseFloat(
    $('a[title="w:Surface gravity"]')
      .parent()
      .next()
      .find('span')
      .text()
  );

  return {
    name,
    name_lower: name.toLowerCase(),
    moons,
    equatorialRadius,
    mass,
    surfaceGravity,
    aroundBody,
    ...rest
  };
}
