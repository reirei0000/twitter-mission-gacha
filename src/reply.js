const csv = require('csvtojson');
var twitter = require('twitter');

let missions;
csv().fromFile('src/missions.csv').then(m => missions = m);

var client = new twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

client.stream('statuses/filter', { track : '@ingress_mission' }, function( stream ) {
  stream.on( 'data', function( data ) {
    var msg = `${ data.user.name }( @${ data.user.screen_name } ) Next Mission！ \r\n ${ missions[Math.floor(Math.random() * missions.length) ]['Bannergress'] }`

    client.post('statuses/update', { status: msg, in_reply_to_status_id: data.id_str },
        function(error, tweet, response) {
          if (!error) {
            console.log("ok, reply.")
        }
      }
    )
  });
});
