# mcafee-bot

When @officialmcafee posts his coin of the day, buy it ASAP.

# How it works

* Read @officialmcafee's tweets in real time.
* Determine whether the tweet is a coin of the day announcement.
* If so, determine what coin it is.
* If it's on bittrex, buy it.

# Installation

```sh
git clone ...
cd mcafee-bot
yarn
export BITTREX_API_KEY='your_key'
yarn start
```

This will drop you into a node REPL with a running bot you can interact with while it runs.

```javascript
// The bot.
bot

// How much BTC are you willing to spend per purchase?
bot.btcSpend = 0.25

// To get ahead of the pump, 
// what multiplier do you want to apply to the price you're willing to buy for?
bot.adjustment = 0.03

// Start the bot.
bot.init()

```

It is now waiting for @officialmcafee to tweet his coin of the day.
