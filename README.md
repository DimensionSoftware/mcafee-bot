# mcafee-bot

When [@officialmcafee](https://twitter.com/officialmcafee) posts his coin of the day, buy it ASAP.

# How it works

* Read @officialmcafee's tweets in real time.
* Determine whether the tweet is a coin of the day announcement.
* If so, determine what coin it is.
* If it's on bittrex, buy it.

## IT DOES NOT SELL!

That is left as an exercise for you.

# Installation

```sh
git clone git@github.com:DimensionSoftware/mcafee-bot.git
cd mcafee-bot
yarn
```

## API Keys

You have to go to both twitter and bittrex to get your own API keys.
Once acquired, I recommend putting them in `secrets.env`.

* Twitter:  https://apps.twitter.com/
  * Create an application.
  * You can leave callback URL blank.
  * After that's done go to **Keys and Access Tokens** and make some access tokens.
* Bittrex:  https://bittrex.com/Manage#sectionApi
  * **Read Info** should be **ON**.
  * **Trade Limit** should be **ON**.
  * **Trade Market** doesn't matter.
  * **Withdraw** should be **OFF** for your safety.

# Usage

```sh
source secrets.env  # You have to get your own API keys from twitter and bittrex!
bin/repl
```

This will drop you into a node REPL with an instantiated bot you can command interactively.

```javascript
// The bot.
bot

// How much BTC are you willing to spend per purchase?
bot.btcSpend = 0.25

// To get ahead of the pump, 
// what multiplier do you want to apply to the current price when putting in the buy order?
bot.adjustment = 0.05

// Make the bot connect to twitter and monitor tweets.
bot.init()

// If you want to see it read tweets:
bot.verbose = true

// If you want it to shut up (which is the default):
bot.verbose = false

```

It is now waiting for @officialmcafee to tweet his coin of the day.

# Tweets

* https://twitter.com/officialmcafee/status/944929837671690241
* https://twitter.com/officialmcafee/status/944555048880746497
* https://twitter.com/officialmcafee/status/944206175100424193
