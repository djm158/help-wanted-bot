const twit = require('twit');
const octokit = require('@octokit/rest')();
const config = require('./credentials');

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
