# Tennis Rankings Scrapers

Because I'm a tennis fan, and I was curious about how long a couple players had been top ranked, and I had a free evening.

Right now this only covers [men's singles](http://www.atpworldtour.com/Rankings/Singles.aspx). Women's singles is next, but it's an [entirely different internaional organization](http://www.wtatennis.com/singles-rankings), so it needs its own scraper.

## Use

    $ node mens.js

That's it for now. Run that, and you'll soon have a directory of `csv` files matching every week's rankings going back to 1973. I decided to keep the files separate, because, as I start this just after Wimbledon, there are 1,639 weeks of data. If you want one giant file, see what [csvkit](http://csvkit.readthedocs.org/en/latest/scripts/csvstack.html) has to offer.