const twit = require('twit');
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit()

const AWS = require('aws-sdk')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const bucketName = "helpwantedbot";
const keyName = "helpwantedbot.json";

const bucketParams = {
  Bucket: bucketName,
  Key: keyName,
}

const twitterConfig = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
}

const s3Config = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
}

const s3 = new AWS.S3(s3Config);
const Twitter = new twit(twitterConfig);
const QUERY = "label:\"help wanted\"+state:open"

/**
 *
 * @param {*} status string
 * @returns Promise
 */
const tweet = async (status) =>
  Twitter.post('statuses/update', {
    status
  })


/**
 *
 * @param {*} issue github issue object
 * @returns string containing the status of the tweet
 */
const buildStatus = async (issue) => {
  // TODO: check character count
  let tweetString = issue.title + " " + issue.html_url + " ";

  const owner_repo = issue.repository_url.split("https://api.github.com/repos/")[1].split('/');
  const [owner, repo] = owner_repo

  const { data: languages } = await octokit.repos.listLanguages({ owner, repo })
  Object.keys(languages).forEach(language => tweetString += "#" + language + " ")
  tweetString += "#opensource"
  return tweetString
}

const toAwsParams = (data) => ({
  Body: JSON.stringify({ id: data.id }),
  ContentType: "application/json",
  ...bucketParams
})

// AWS Lambda handler
exports.handler = async (event, context) => {

  let currentId
  try {
    const current = await s3.getObject(bucketParams).promise()
    currentId = parseInt(JSON.parse(current.Body.toString()).id)
  } catch (err) {
    console.error(err)
  }

  const { data: issues } = await octokit.search.issuesAndPullRequests({
    q: QUERY,
    sort: "created"
  })

  const [issue] = issues.items;

  if (currentId !== issue.id) {
    const status = buildStatus(issue)
    const tweetResponse = await tweet(status).catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

    if (tweetResponse instanceof Error) throw tweetResponse

    try {
      return s3.putObject(toAwsParams(issue)).promise()
    } catch (err) {
      console.error(err)
      return err
    }
  }

  return { "info": "no new issues" }
}
