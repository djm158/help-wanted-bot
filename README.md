Twitter bot that searches github for issues with the label "help wanted"

It currently fetches the newest issue from github's search api every ten minutes and tweets the title of the issue along with it's url. 

https://twitter.com/helpwantedbot

## Getting Started

First, create a twitter app [here](https://apps.twitter.com/).
Then create a file in the top level of this directory called `credentials.js`.

```js
module.exports = {
  consumer_key: 'your_consumer_key',
  consumer_secret: 'your_consumer_secret',
  access_token: 'your_access_token',
  access_token_secret: 'your_token_secret'
}
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