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
  flint.debug('We heard hello, time to say hi back!');
  console.log('hello? ok');
  bot.say('Hello %s! Fun room %s. Keep talking to me.', trigger.personDisplayName, trigger.roomTitle);
});

//Add Flint event listeners
flint.on('initialized', function() {
    flint.debug('initilized %s rooms ana', flint.bots.length);

}
  );

flint.on('message', function(bot, trigger, id) {
    console.log('we are on message');
    flint.debug('%s said %s in room %s. Wow', trigger.personDisplayName, trigger.text, trigger.roomTitle);
    bot.say('Hey there, you said something?');
}
  );

flint.on('messageCreated', function(message, bot) {
    console.log('"%s" said "%s" in room "%s"', message.personEmail, message.text, bot.myroom.title);
    flint.debug('"%s" said "%s" in room "%s"', message.personEmail, message.text, bot.myroom.title);
    flint.debug('%s said %s in room %s. Wow', trigger.personDisplayName, trigger.text, trigger.roomTitle);
    bot.say('Hey there, you said something?');

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