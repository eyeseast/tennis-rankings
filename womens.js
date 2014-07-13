/*
Scrape WTA women's singles rankings from http://www.wtatennis.com/singles-rankings

Rankings table is rendered server-side and loaded via ajax.
*/
var cheerio = require('cheerio')
  , dsv = require('dsv')
  , csv = dsv(',')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , moment = require('moment')
  , request = require('request')
  , querystring = require('querystring');


var URL_TEMPLATE = 'http://www.wtatennis.com/fragment/wtaTennis/fragments/assets/rankings/rankingsData/type/SINGLES/date/{date}/pag/1/countryName/all'
  , DATE_FORMAT = 'DDMMYYYY'
  , START_DATE = new Date(1983, 0, 17); // Jan. 17, 1983, is the earliest available rankings


function get_dates(start) {
	// return an array of dates to get rankings for, since start
	var results = [];

	// get a moment
	var week = moment(start); 

	while (week < new Date()) {
		// results for every week until we're done
		results.push(week.clone());
		week.add('weeks', 1);
	}

	return results;
}

/*
Entrypoint function. 

Loop through weeks since START_DATE and write a csv for each week.
*/
function main() {
	// create output dir if needed
	mkdirp.sync('csv/womens');

	// get our dates and go
	var dates = get_dates(START_DATE);

	dates.forEach(function(d, i) {

		// build a url, request the page, scrape it
		var url = URL_TEMPLATE.replace('{date}', d.format(DATE_FORMAT));

		request(url, function(err, resp, body) {
			if (err) {
				// report the error and move on
				return console.error(err);
			};

			var $ = cheerio.load(body);

			var rankings = $('#myTable').find('tbody').find('tr').map(function(i, el) {
				var $el = $(el)
				  , $td = $el.find('td');

				return {
					// use the date object, formatted
					date: d.format('YYYY-MM-DD'),

					// previous rank
					previous: $td.eq(0).text().replace(']', '').replace('[', '').trim(),

					// rank this week
					rank: $td.eq(1).text().trim(),

					// player name: last, first
					player: $td.eq(2).text().trim(),

					// country name
					country: $td.eq(3).text().trim(),

					// dob, example: 02 DEC 1973
					dob: $td.eq(4).text().trim(),

					// current points, as an integer
					points: $td.eq(5).text().trim()
				};

				return data;
			});

			// write out a csv for this week
			var path = 'csv/womens/' + d.format('YYYY-MM-DD') + '.csv';
			fs.writeFile(path, csv.format(rankings.toArray()), function(err) {
			    if (err) { console.error(err); }
			});
		});
	});
}

if (require.main === module) {
    main();
}