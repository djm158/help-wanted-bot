const twit = require('twit');
const octokit = require('@octokit/rest')();

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const config = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
}

const Twitter = new twit(config);
const query = "label:\"help wanted\"+state:open"
const repeatTime = 1000 * 60 * 10

function getNewIssue() {
  octokit.search.issues({
    q: query,
    sort: "created"
  }).then(result => {
    const item = result.data.items[0];
    postTweet(item.title + " " + item.html_url)
  })
}

function postTweet(data) {
  Twitter.post('statuses/update', { status: data }, function(err, data, response) {
    console.log(data)
  })
}

setInterval(getNewIssue, repeatTime)
