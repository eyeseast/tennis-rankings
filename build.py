#!/usr/bin/env python
"""
Load scraped CSV files for men's and women's rankings into a sqlite database.
"""
import csv
import datetime
import glob
import os

import dataset
import sqlalchemy

from unidecode import unidecode

# always this database
DATABASE = "sqlite:///tennis.db"

# formats
DATE_FORMAT = "%Y-%m-%d"

# fields that should be int or date
TYPES = {
    'rank': sqlalchemy.Integer,
    'points': sqlalchemy.Integer,
    'previous': sqlalchemy.Integer,
    'date': sqlalchemy.Date
}

def main(table, csv_dir):
    """
    Load rankings into a sqlite database.
    
    table:
        a table name to load rankings into

    csv_dir:
        a directory containing CSV files for rankings
    """
    db = dataset.connect(DATABASE)
    table = db[table]
    files = glob.glob(os.path.join(csv_dir, '*.csv'))

    # loop through all csv files in the target directory
    for filename in files:

        with open(filename) as f:

            # a little output
            print "Importing %s" % filename

            # read each file as csv
            reader = csv.DictReader(f)

            # and loop through it
            for row in reader:
                row['date'] = datetime.datetime.strptime(row['date'], DATE_FORMAT).date()

                # fix strings
                for k, v in row.items():
                    if k not in TYPES:
                        row[k] = unicode(v, 'utf-8')

                table.insert(row, types=TYPES)


if __name__ == "__main__":
    main('women', 'csv/womens')
    main('men', 'csv/mens')