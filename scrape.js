const request = require('request');
const cheerio = require('cheerio');

request(
  'https://wiki.kerbalspaceprogram.com/wiki/Kerbol_System',
  (error, response, html) => {
    if (error || response.statusCode != 200) {
      console.error(`Error: ${error}`);
      console.log(`Status: ${response.statusCode}`);
      console.log('Content-Type is:', response.caseless.get('Content-Type'));
      console.log(`Length: ${html.length}`);
      return;
    }

    console.log('Success!');
    const $ = cheerio.load(html);

    const bodies = [];

    const planetaryBodies = $('.mp-planetnav');
    let currentIndex = 0;
    planetaryBodies.find('tr').each((i, el) => {
      const planet = $(el).find('td');

      const name = planet.find('.planetlabel a').attr('title');
      const link = planet.find('.planetlabel a').attr('href');
      const moons = planet.nextAll();

      if (name) {
        if (name.toLowerCase() === 'kerbol') {
          bodies.push({
            name,
            moons: null,
            aroundBody: null,
            rel: `/bodies/${name.toLowerCase()}`,
            link
          });
        } else {
          bodies.push({
            name,
            moons: [],
            aroundBody: {
              body: 'kerbol',
              rel: '/bodies/kerbol'
            },
            rel: `/bodies/${name.toLowerCase()}`,
            link
          });
          currentIndex++;
        }

        moons.each((j, el) => {
          // console.log(el);
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
                rel: `/bodies/${name.toLowerCase()}`
              },
              rel: `/bodies/${moon.toLowerCase()}`,
              link
            });
          }
        });
        currentIndex += moons.length;
      }
    });
    console.table(bodies);
  }
);
