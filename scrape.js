const got = require('got');
const cheerio = require('cheerio');

const URL_PREFIX = 'https://webjeb.mycodebytes.com/api';
const WIKI_URL_PREFIX = 'https://wiki.kerbalspaceprogram.com';
const CENTRAL_BODY = 'Kerbol';

function scrapeSystem() {
  const source = `${WIKI_URL_PREFIX}/wiki/Kerbol_System`;
  return scrapeSource(source, response => {
    console.log('Success!');
    return parseSystem(response.body);
  });
}

function scrapeBody(source) {
  return scrapeSource(source, response => {
    console.log('Successful!');
    return parseBody(response.body);
  });
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
        if (name.toLowerCase() === CENTRAL_BODY.toLowerCase()) {
          bodies.push({
            name,
            moons: null,
            aroundBody: null,
            rel: `${URL_PREFIX}/bodies/${name.toLowerCase()}`,
            source: `${WIKI_URL_PREFIX}${link}`
          });
        } else {
          bodies.push({
            name,
            moons: [],
            aroundBody: {
              body: CENTRAL_BODY.toLowerCase(),
              rel: `${URL_PREFIX}/bodies/${CENTRAL_BODY.toLowerCase()}`
            },
            rel: `${URL_PREFIX}/bodies/${name.toLowerCase()}`,
            source: `${WIKI_URL_PREFIX}${link}`
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
                rel: `${URL_PREFIX}/bodies/${name.toLowerCase()}`
              },
              rel: `${URL_PREFIX}/bodies/${moon.toLowerCase()}`,
              source: `${WIKI_URL_PREFIX}${link}`
            });
          }
        });
        currentIndex += moons.length;
      }
    });
    return bodies;
  }
}

(async () => {
  const bodies = await scrapeSystem();
  console.table(bodies);
})();
