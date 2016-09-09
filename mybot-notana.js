var Flint = require('node-flint');
var webhook = require('node-flint/webhook');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

// flint options
var config = {
  webhookUrl: 'http://localhost/flint',
  token: 'ZDU4NjlkNTAtMTUyNS00MjRlLTg3ZTQtNzk2YWNmYTkyMzcxZjk5NjUyOTItYjE4',
  port: 3001,
  removeWebhooksOnStart: false,
  maxConcurrent: 5,
  minTime: 50
};

// init flint
var flint = new Flint(config);
flint.start();

// say hello
flint.hears('/hello', function(bot, trigger) {
  bot.say('Hello %s! My mail is %s', trigger.personDisplayName, bot.email);
});

// Promise Example with arrow functions in version Flint 4.x
/*ana - didn't work on centos? */

flint.hears('/add', (bot, trigger) => 
{
  var email = trigger.args[1];

  bot.add(email)
    .then(membership => membership.personEmail)
    .then(email => {
      return bot.say('Flint has added %s to this room %s', email, trigger.displayName);
    })
    .catch(function(err) {
      console.log(err);
    });
}); 

flint.hears(/(^| )beer( |.|$)/i, function(bot, trigger, id) {
  bot.say('Enjoy a beer, %s! 🍻', trigger.personDisplayName);
});

flint.hears(/(^| )(version WSA|WSA version)( |.|$)/i, function(bot, trigger, id) {
  bot.say('**Current WSA GD Versions** \n - 8.5.3-069 \n - 9.1.1-074');
  flint.debug("In WSA version section");
});

flint.hears(/(^| )Carsten( |.|$)/i, function(bot, trigger, id) {
  bot.say('Ah, he is such a good guy %s, so is neighbor', trigger.personDisplayName);
});

flint.hears('/help', function(bot, trigger, id) {
  bot.say('**Cloud Security Support Bot** \n - I can not do much today, but keep watching me tomorrow. \n - Try typing \\\hello', trigger.personDisplayName);
});

// add flint event listeners
flint.on('message', function(bot, trigger, id) {
  flint.debug('"%s" said "%s" in room "%s"', trigger.personEmail, trigger.text, trigger.roomTitle);
  //bot.say('Hello %s! My mail is %s', trigger.personDisplayName, bot.email);
 });

flint.on('initialized', function() {
  flint.debug('initialized %s rooms', flint.bots.length);
});

// define express path for incoming webhooks
app.post('/flint', webhook(flint));

// start express server
var server = app.listen(config.port, function () {
  flint.debug('Flint listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function() {
  flint.debug('stoppping...');
  server.close();
  flint.stop().then(function() {
    process.exit();
  });
});
