// Usage: node send_message <username> <message> (auto-add timestamp, don't want users to be able to backdate their messages or do anything weird here)

const axios = require('axios').default;

var myArgs = process.argv.slice(2);

function send_message(username, body, timestamp) {
	axios.post('http://localhost:8080/messages', {
		username: username,
		body: body,
		timestamp: timestamp ?? Date.now(),
	}).then(function (response) {
		console.log(response.data);
	}).catch(function (error) {
		console.log(error);
	});
};

if (myArgs.length != 2) {
    console.log('Error: Incorrect number of arguments.\nUsage: node send_message <username> <message>')
}
send_message(myArgs[0], myArgs[1], Date.now());