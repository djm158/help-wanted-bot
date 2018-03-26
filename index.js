const twit = require('twit');
const octokit = require('@octokit/rest')();

if (process.env.NODE_ENV !== 'production') {
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

function getNewIssue() {
  let tweetString = ""
  return octokit.search.issues({
    q: query,
    sort: "created"
  }).then(result => {
    const item = result.data.items[0];
    tweetString = item.title + " " + item.html_url + " ";
    // probably better to replace this w/ regex
    const owner_repo = item.repository_url.split("https://api.github.com/repos/")[1].split('/');
    const owner = owner_repo[0]
    const repo = owner_repo[1]
    octokit.repos.getLanguages({owner: owner, repo: repo})
    .then(result => {
      // languages are returned as object
      let languages = Object.keys(result.data);
      for(let i = 0; i < languages.length; i++) {
        tweetString += "#" + languages[i] + " ";
      }
      tweetString += "#opensource";
      // return tweetString;
      console.log(tweetString)
    })
    // .then(postTweet)
  })
  .catch(err => {console.log(err)})
}

getNewIssue()

function postTweet(data) {
  Twitter.post('statuses/update', {
    status: data
  }, function (err, data, response) {
    if(err) {
      throw new Error(err);
    }
    return(data)
  })
}

// AWS Lambda handler
exports.handler = function (event, context, callback) {
  let tweetString = ""
  return octokit.search.issues({
    q: query,
    sort: "created"
  }).then(result => {
    const item = result.data.items[0];
    tweetString = item.title + " " + item.html_url + " ";
    // probably better to replace this w/ regex
    const owner_repo = item.repository_url.split("https://api.github.com/repos/")[1].split('/');
    const owner = owner_repo[0]
    const repo = owner_repo[1]
    octokit.repos.getLanguages({owner: owner, repo: repo})
    .then(result => {
      // languages are returned as object
      let languages = Object.keys(result.data);
      for(let i = 0; i < languages.length; i++) {
        tweetString += "#" + languages[i] + " ";
      }
      return tweetString;
    })
    .then(postTweet)
    .then(callback)
  })
  .catch(err => {return err})
}
