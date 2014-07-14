# Tennis Rankings Scrapers

Because I'm a tennis fan, and I was curious about how long a couple players had been top ranked, and I had a free evening.

Right now this covers [men's singles](http://www.atpworldtour.com/Rankings/Singles.aspx) and [women's singles](http://www.wtatennis.com/singles-rankings). They're different organizations, so the data available is slightly different, but both have weekly rankings.

## Use

    $ node womens.js  # puts files in csv/womens
    $ node mens.js    # puts files in csv/mens

That's it for now. Run that, and you'll soon have a directory of `csv` files matching every week's rankings going back to 1973 for men and 1983 for women. 

(I decided to keep the files separate, because, as I start this just after Wimbledon, there are 1,639 weeks of data. If you want one giant file, see what [csvkit](http://csvkit.readthedocs.org/en/latest/scripts/csvstack.html) has to offer.)

For more detailed analysis, run `python build.py` to load everything into a SQLite database (`tennis.db`). Rankings go into two tables, `women` and `men`.

The included `Freezefile.yaml` will export several additional CSVs:

 - Showing the weekly rankings of players who have ever been ranked best in the world. This allows you to see how top players rose and fell in rankings over the entire course of their careers (or at least as long as they stayed in the top 100)

 - Showing the number of weeks each player remained number 1. If you want to understand how dominant Steffi Graf (377), Martina Navratilova (214), Roger Federer (301) and Pete Sampras (285) have been in their careers, look at this list.
