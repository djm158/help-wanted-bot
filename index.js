const twit = require('twit');
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit()

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
const QUERY = "label:\"help wanted\"+state:open"

const postTweet = (tweet) =>
  Twitter.post('statuses/update', {
    status: tweet
  }, (err, data, response) => {
    if (err) {
      throw new Error(err);
    }
    return (data)
  })

// AWS Lambda handler
exports.handler = async (event, context) => {
  let tweetString = ""

  const { data: issues } = await octokit.search.issuesAndPullRequests({
    q: QUERY,
    sort: "created"
  })
  const [item] = issues.items;

  tweetString = item.title + " " + item.html_url + " ";
  // probably better to replace this w/ regex
  const owner_repo = item.repository_url.split("https://api.github.com/repos/")[1].split('/');
  const [owner, repo] = owner_repo

  const { data: languages } = await octokit.repos.listLanguages({ owner, repo })
  Object.keys(languages).forEach(language => tweetString += "#" + language + " ")
  tweetString += "#opensource"
  return postTweet(tweetString)
}
