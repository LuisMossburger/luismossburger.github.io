import csv
import urllib.request as urllib2

"""
    This script retrieves all preview images for the William Ellery Channing
    collection based on a csv with metadata in it.
"""

baseUrl = "https://api.lib.harvard.edu/v2/items?recordIdentifier="
hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
       'Accept-Encoding': 'none',
       'Accept-Language': 'en-US,en;q=0.8',
       'Connection': 'keep-alive'}

with open('../../data/data.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        try:
            req = urllib2.Request(baseUrl + row[1], headers=hdr)
            with urllib2.urlopen(req) as response:
               html = response.read().decode()
               preview = html.split('<mods:url access="preview">')[1].split('</mods:url>')[0]

               img_req = urllib2.Request(preview, headers = hdr)
               resource = urllib2.urlopen(img_req)
               output = open(row[1] + ".jpg", "wb")
               output.write(resource.read())
               output.close()
        except:
          print("Error with " + row[1]) # Will probably throw an error for the header row
