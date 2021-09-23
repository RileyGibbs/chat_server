//Usage: node get_messages <username> [<hours_to_view>, default=6]

const axios = require('axios').default;

var myArgs = process.argv.slice(2);

function get_messages(username, hours) {
    // If no amount of hours provided, show messages from last 6 hours
    if (!hours) hours = 6

    timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - hours);
    timestamp = timestamp.getTime();

    axios.get('http://localhost:8080/messages', { params: {
        username: username,
        timestamp: timestamp,
    }}).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.log(error);
    });
};

if (myArgs.length != 1 && myArgs.length != 2) {
    console.log('Error: Incorrect number of arguments.\nUsage: node get_messages <username> [<hours_to_view>, default=6]')
}
get_messages(myArgs[0], myArgs[1]);