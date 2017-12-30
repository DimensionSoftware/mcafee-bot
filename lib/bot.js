const Promise = require('bluebird')
const Twit    = require('twit')
const bittrex = require('node-bittrex-api')
const Lazy    = require('lazy.js')
const clone   = require('clone')

const currencies = require('./currencies')
const coinPattern = 'Coin of the (week|day)'

module.exports = class Bot {

  constructor(opts) {
    this.verbose = false
    this.btcSpend = opts.btcSpend || 0.001
    this.adjustment = 0.03
    this.T = new Twit({
      consumer_key:        opts.twitter.key,
      consumer_secret:     opts.twitter.secret,
      access_token:        opts.twitter.token,
      access_token_secret: opts.twitter.tokenSecret
    })

    this.bittrex = Promise.promisifyAll(clone(bittrex))
    this.bittrex.options({
      apikey:                     opts.bittrex.key,
      apisecret:                  opts.bittrex.secret,
      inverse_callback_arguments: true
    })

    this.mcafeeId = '961445378'

    this.follow = [
      // @officialmcafee
      '961445378'
      // @mbb777_ (dummy account for testing tweets)
      ,'944877775705464832'
    ]
  }

  /**
   * Perform the asynchronous part of bot initialization and start listening for tweets.
   */
  async init() {
    // Twitter
    // https://stackoverflow.com/questions/15652361/can-not-use-follow-in-the-streaming-api-in-ntwitter-recieving-unspecified-er
    // https://stackoverflow.com/questions/47384200/how-to-stream-tweets-of-one-user-using-follow
    this.stream = this.T.stream('statuses/filter', { follow: this.follow })
    this.stream.on('tweet', this.handleTweet.bind(this))
    this.stream.on('connect', () => console.warn('connect'))
    this.stream.on('error', (err) => { console.warn('error', err) })
  }

  /**
   * Analyze a tweet and try to buy if it's a coin of the day announcement.
   *
   * @param {Object} tweet          tweet data + metadata
   */
  async handleTweet(tweet) {
    if (this.verbose) console.warn(`${tweet.created_at} | ${tweet.user.screen_name} ${tweet.user.id_str} | ${tweet.text}`)
    if (this.isCoinOfTheWeek(tweet)) {
      const coin = this.identifyCoin(tweet)
      console.warn('COIN OF THE DAY!', tweet.text, coin)
      if (coin.found) {
        console.warn(`attempting to buy ${coin.symbol}`)
        let result = await this.buy(coin.symbol, this.btcSpend, this.adjustment)
        console.warn(result)
      } else {
        console.warn(coin)
      }
    }
  }

  /**
   * Is this tweet a coin of the day announcement from officialmcafee
   * (and not a retweet from someone else)?
   *
   * @param   {Object} tweet        tweet data + metadata
   * @returns {Boolean}
   */
  isCoinOfTheWeek(tweet) {
    if (tweet.user.id_str == this.mcafeeId) {
      if (tweet.text.match(new RexExp(coinPattern, 'i'))) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  /**
   * Guess what coin he's talking about.
   *
   * @param   {Object} tweet        tweet data + metadata
   * @returns {Object}              coin metadata
   */
  identifyCoin(tweet) {
    const text = tweet.text
    if (text.match(new RexExp(coinPattern, 'i'))) {
      const match = text.match(new RexExp(`${coinPattern}:?\s*([\w ]*)`, 'i'))
      if (this.verbose)
        console.log(match)
      const longName = match[1].trim()
      const pattern = new RegExp(`^${longName}$`, 'i')
      const c = currencies.find((c) => {
        if (c.CurrencyLong.match(pattern)) {
          return true
        } else if (c.Currency.match(pattern)) {
          return true
        } else {
          return false;
        }
      })
      if (c) {
        return { found: true, symbol: c.Currency, name: c.CurrencyLong }
      } else {
        return { found: false, reason: `Couldn't find ${longName} in currencies list.` }
      }
    } else {
      return { found: false, reason: 'Tweet could not be parsed.' }
    }
  }

  /**
   * Buy a coin
   *
   * @param   {String} symbol       symbol for coin
   * @param   {Number} btcSpend     maximum BTC you are willing to spend
   * @param   {Number} adjustment   multiplier to apply to price to get ahead of the pump
   * @returns {Object}              result of bittrex.tradebuy
   */
  async buy(symbol, btcSpend, adjustment) {
    const market   = `BTC-${symbol}`
    const res0     = await this.bittrex.gettickerAsync({ market })
    const ticker   = res0.result
    const rate     = ticker.Ask + (ticker.Ask * adjustment)
    const quantity = btcSpend / rate
    const opts = {
      MarketName:    market,
      OrderType:     'LIMIT',
      Quantity:      quantity,
      Rate:          rate,
      TimeInEffect:  'IMMEDIATE_OR_CANCEL',
      ConditionType: 'NONE',
      Target:        0
    }
    const res1 = await this.bittrex.tradebuyAsync(opts)
    return res1
  }
}
