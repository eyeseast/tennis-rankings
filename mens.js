/*
Scrape ATP men's singles rankings from http://www.atpworldtour.com/Rankings/Singles.aspx
*/

var cheerio = require('cheerio')
  , dsv = require('dsv')
  , csv = dsv(',')
  , fs = require('fs')
  , moment = require('moment')
  , request = require('request')
  , querystring = require('querystring')
  , queue = require('queue-async')
  , url = require('url');


var BASE_URL = 'http://www.atpworldtour.com/Rankings/Singles.aspx?'
  , DATE_FORMAT = 'DD.MM.YYYY';

/*
Extract dates for which rankings are available. Takes a built cheerio object.
*/
function get_dates($) {
    // grab the dropdown and loop through options
    var select = $('select#singlesDates')
      , options = select.children('option');

    return options.map(function(i, el) {

        // return a parsed moment object
        // example 23.06.2014
        return moment(el.attribs.value, DATE_FORMAT);
    }).toArray();
}

/*
Entrypoint function. 

Grab the root rankings page, loop through available dates and write a csv to STDOUT.
*/
function main() {
    // grab the root rankings page
    request(BASE_URL, function(err, resp, body) {
        // parse the response body
        var $ = cheerio.load(body);

        // grab dates
        var dates = get_dates($);

        dates.forEach(function(d) {
            var qs = querystring.stringify({
                d: d.format(DATE_FORMAT),
                r: 1 // top 100
            });

            request(BASE_URL + qs, function(err, resp, body) {
                // put our data somewhere and parse teh page
                var $ = cheerio.load(body);

                // lets get some rankings, skipping the header row
                var rankings = $('table.bioTableAlt').find('tr').slice(1).map(function(i, el) {
                    var $el = $(el)
                      , $td = $el.find('td');

                    return { 
                        // use the date object from above
                        date: d.format('YYYY-MM-DD'),

                        // player is the first link text
                        player: $el.find('a').first().text(),

                        // rank is in span.rank
                        rank: $el.find('span.rank').text(),

                        points: $td.eq(1).text().replace(',', ''),

                        change: $td.eq(2).text(),

                        tournaments: $td.eq(3).text()
                    }
                });
                // write out a csv for this week
                var path = 'csv/mens/' + d.format('YYYY-MM-DD') + '.csv';
                fs.writeFile(path, csv.format(rankings.toArray()), function(err) {
                    if (err) { console.error(err); }
                });
            });
        });
    });
}

if (require.main === module) {
    main();
}