[![Build Status](https://travis-ci.org/djm158/help-wanted-bot.svg?branch=master)](https://travis-ci.org/djm158/help-wanted-bot)
Twitter bot that searches github for issues with the label "help wanted"

It currently fetches the newest issue from github's search api every ten minutes and tweets the title of the issue along with it's url. 

https://twitter.com/helpwantedbot

## Getting Started

First, create a twitter app [here](https://apps.twitter.com/).

In development, the app uses [dotenv](https://github.com/motdotla/dotenv) to source environment variables to authenticate your twitter app. 

.env file:

```
CONSUMER_KEY=your_consumer_key
CONSUMER_SECRET=your_consumer_secret
ACCESS_TOKEN=your_access_token
ACCESS_TOKEN_SECRET=your_access_token_secret
```

Install dependencies and run:

```sh
$ npm install
$ npm start
```

## Debug

The app uses [octokit](https://github.com/octokit/rest.js) as a client to Github's api, which provides an optional debug parameter:

```sh
$ DEBUG=octokit:rest* npm start
```