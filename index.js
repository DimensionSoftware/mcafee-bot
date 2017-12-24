const Promise = require('bluebird')
const Twit    = require('twit')
const bittrex = require('bittrex')

const Bot = require('./lib/bot')

const opts = {
  twitter: {
    key:    process.env.TWITTER_KEY,
    secret: process.env.TWITTER_SECRET
  },
  bittrex: {
    key:    process.env.BITTREX_KEY,
    secret: process.env.BITTREX_SECRET
  }
}

const bot = new Bot(opts);

;(async function() {
  let result = await bot.init();
})();
