var Twit = require('twit');

var T = new Twit(require('./config.js'));

//Search for user who @FabioBot2
var selfSearch = {q: "to:FabioBot2", count: 100, result_type: "recent"};

//Reply to user with "Knock knock"
function tweetEvent() {

	T.get('search/tweets', selfSearch, function(error, data) {

		var tweet = data.statuses[0];
		var reply_to = tweet.in_reply_to_screen_name;
		var txt = tweet.text;
		var id = tweet.id_str;

		//Only respond to initial tweets that @FabioBot2
		if (reply_to == 'FabioBot2' && txt != "@FabioBot2 Who\'s there?") {

			//Replies Knock knock
			var replyText = '@' + tweet.user.screen_name + ' Knock knock';
			T.post('statuses/update', { status: replyText, in_reply_to_status_id: id}, tweeted);

			function tweeted(err, reply) {
				if (err) {
				console.log(err.message);
				} else {
				console.log('Tweeted: ' + reply.text);
				}
			}
		}
	});
}

//Search for user who replies to @FabioBot2 with "Who's there?"
var whosThereSearch = {q: "to:FabioBot2+Who\'s+There", count:100, result_type: "recent"};

function whosThereEvent() {
	T.get('search/tweets', whosThereSearch, function(error, data) {

		var whosThere = data.statuses[0];
		var reply_to = whosThere.in_reply_to_screen_name;
		var txt = whosThere.text;
		var id = whosThere.id_str;

		//Replies only if a user replies to @FabioBot2 with "Who's there?"
		if (reply_to == 'FabioBot2' && txt == "@FabioBot2 Who\'s there?") {

			//Replies with joke here -- UPDATE
			var replyText = '@' + whosThere.user.screen_name + ' Boo!';
			T.post('statuses/update', { status: replyText, in_reply_to_status_id: id}, tweeted);

			function tweeted(err, reply) {
				if (err) {
				console.log(err.message);
				} else {
				console.log('Tweeted: ' + reply.text);
				}
			}
		}
	})
}

function replyFirst() {
	T.get('search/tweets', selfSearch, function (error, data) {

	  console.log(error, data);

	  if (!error) {
	  	//initial check for @FabioBot2
		tweetEvent();
		//whos there check for @FabioBot2 and "Who's there?"
		whosThereEvent();
		console.log('SUCCESS');
	  }
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

replyFirst();

setInterval(replyFirst, 1000 * 60 * 60);
