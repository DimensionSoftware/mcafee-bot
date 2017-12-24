const Promise = require('bluebird')
const Twit    = require('twit')

const Bot = require('./lib/bot')

const opts = {
  twitter: {
    key:         process.env.TWITTER_KEY,
    secret:      process.env.TWITTER_SECRET,
    token:       process.env.TWITTER_TOKEN,
    tokenSecret: process.env.TWITTER_TOKEN_SECRET
  },
  bittrex: {
    key:    process.env.BITTREX_KEY,
    secret: process.env.BITTREX_SECRET
  }
}

const bot = new Bot(opts);

if (process.env.BTC_SPEND) {
  bot.btcSpend = parseFloat(process.env.BTC_SPEND)
}

if (process.env.ADJUSTMENT) {
  bot.adjustment = parseFloat(process.env.ADJUSTMENT)
}

;(async function() {
  let result = await bot.init();
})();
