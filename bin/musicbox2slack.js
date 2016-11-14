#!/usr/bin/env node

const musicbox2slack = require('..');

const argv = require('minimist')(process.argv.slice(2));

const musicboxHostname = argv.hostname || process.env.MUSICBOX_HOSTNAME;
const slackToken = argv.token || process.env.SLACK_TOKEN;
const slackChannel = argv.channel || process.env.SLACK_CHANNEL; // ID (not name!) of the channel
const slackPostTs = argv.post || process.env.SLACK_POST_TS; // timestamp of the pinned post to update w/ the current track info

musicbox2slack({
  musicboxHostname,
  slackToken,
  slackChannel,
  slackPostTs,
});
