**Chat Setup and Run Instructions**

*Setup:*
Navigate into the `chat_server` directory and run:
`npm install`

*Start server:*
`node server.js`


*Sending messages:*
`node send_message "<username>" "<message_body>"`


*Retrieving a user's messages:*
`node get_messages "<username>" [<hours_back_in_time>]`

- NOTE: The default number of hours of messages to show is 6. Specifying 
        `<hours_back_in_time>` will show all messages starting at that time until the present.



