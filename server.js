const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 8080;
app.use(
	express.urlencoded({
		extended: true
	})
);
app.use(express.json());

// Setup database
/* messages (table)
*	id 			INTEGER 		PRIMARY KEY
*	username	VARCHAR(128)	NOT NULL
*	body 		TEXT 			NOT NULL
* 	sent_ts		TIMESTAMP		DEFAULT CURRENT_TIMESTAMP
*/
var db = new sqlite3.Database('db.sqlite3');
db.serialize(function() {
	db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, username VARCHAR(128), body TEXT NOT NULL, sent_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
});

// Convert timestamp to readable string (note: this could be handled in client/frontend)
function toDateString(timestamp) {
	var date = new Date(timestamp);

	var YYYY = date.getFullYear();
	var MM = ("0" + (date.getMonth() + 1)).slice(-2);
	var DD = ("0" + date.getDate()).slice(-2);

	var hh = ("0" + date.getHours()).slice(-2);
	var mm = ("0" + date.getMinutes()).slice(-2);

	return `${YYYY}-${MM}-${DD} ${hh}:${mm}`;
}

// Add new message from <username> at <timestamp> with <body>
app.post('/messages', (req, res) => {
	db.serialize(function() {
		db.run(`INSERT INTO messages (username, body, sent_ts) VALUES ("${req.body.username}", "${req.body.body}", ${req.body.timestamp})`,
			function(err, row) {
				// this.lastID set only on success
				if (err || !this.lastID) {
					res.statusCode(400);
					res.send(err);
				}

				db.get(`SELECT * FROM messages WHERE id = ${this.lastID}`, function(err, row) {
					if (err) {
						res.statusCode(400);
						res.send(err);
					}
					var data = {
						'timestamp': toDateString(row.sent_ts),
						'username': row.username,
						'body': row.body,
					}
					res.send(data);
				});
				
			});
	});
});

// Get all messages for <username> from <timestamp> to most recent
app.get('/messages', (req, res) => {
	var data = {
		'messages': [],
	}
	db.serialize(function() {
		db.each(`SELECT * FROM messages WHERE username LIKE '${req.query.username}' AND sent_ts >= ${req.query.timestamp}`, function(err, row) {
			if (err) {
				res.statusCode(400);
				res.send(err);
			}
			data['messages'].push({
				'timestamp': toDateString(row.sent_ts),
				'username': row.username,
				'body': row.body,
			});
		}, function() {
			res.send(data);
		});
	});
});

app.listen(port, () => {
	console.log(`Chat server listening at http://localhost:${port}!`);
});