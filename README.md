[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=tluolamo_boilerplate-project-urlshortener&metric=alert_status)](https://sonarcloud.io/dashboard?id=tluolamo_boilerplate-project-urlshortener)
![CircleCI](https://img.shields.io/circleci/build/github/tluolamo/boilerplate-project-urlshortener)
[![codecov](https://codecov.io/gh/tluolamo/boilerplate-project-urlshortener/branch/gomix/graph/badge.svg)](https://codecov.io/gh/tluolamo/boilerplate-project-urlshortener)
[![Dependency Status](https://david-dm.org/tluolamo/boilerplate-project-filemetadata.svg)](https://david-dm.org/tluolamo/boilerplate-project-filemetadata)
[![Dev Dependency Status](https://david-dm.org/tluolamo/boilerplate-project-filemetadata/dev-status.svg)](https://david-dm.org/tluolamo/boilerplate-project-filemetadata)

# API Project: URL Shortener Microservice for freeCodeCamp


### User Stories

1. I can POST a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":1}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`. *HINT*: to be sure that the submitted url points to a valid site you can use the function `dns.lookup(host, cb)` from the `dns` core module.
3. When I visit the shortened URL, it will redirect me to my original link.


#### Creation Example:

POST [project_url]/api/shorturl/new - body (urlencoded) :  url=https://www.google.com

#### Usage:

[this_project_url]/api/shorturl/3

#### Will redirect to:

https://www.freecodecamp.org/forum/
