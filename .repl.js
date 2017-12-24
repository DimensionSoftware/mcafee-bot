function reload(module){
  delete require.cache[require.resolve(module)]
  return require(module)
}

global.reload   = reload
global.rl       = reload
global.cl       = console.log

global.Promise  = require('bluebird')
global.Bot      = require('./lib/bot')

global.bot = new Bot({
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
})
