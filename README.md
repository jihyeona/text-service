# text-service

This is a service for sending, retrieving and deleting messages.

The server is built with Express.js.  
Data is stored in Firebase Realtime Database.  
The endpoints are following RESTful convention.  

Recipient is identified with its user name. 

You can test the service with curl, as below.

1. create a user  
`curl -X POST -H "Content-Type: application/json" -d '{"name":"username"}' http://localhost:3000/users`  
Replace `username` with the name of the user you want to create.

2. fetch all users  
`curl -X GET http://localhost:3000/users`

3. send a message  
`curl -X POST -H "Content-Type: application/json" -d '{"senderId":"123", "receiverIdentifier":"username", "text":"Hello, world!"}' http://localhost:3000/messages`  
Replace the values for `senderId`, `receiverIdentifier`, and `text` with appropriate values to send a message.  
The receiverIdentifier should be the user name of the recipient.

4. fetch message  
`curl -X GET http://localhost:3000/messages/{userId}`  
Replace `{userId}` with the ID of the user for whom you want to fetch the messages.   
`curl -X GET http://localhost:3000/messages/{userId}?start={startIndex}&stop={stopIndex}`  
Additionally, you can add query parameters to specify the range of messages to be fetched.   
The start and stop parameters specify the range of messages to be fetched.   
`curl -X GET http://localhost:3000/messages/{userId}?lastFetchedTimestamp={lastFetchedTimestamp}?start={startIndex}&stop={stopIndex}`  
The lastFetchedTimestamp parameter is used to fetch new messages that were sent after the last fetched message.   
Replace `{lastFetchedTimestamp}` with the timestamp of the last message that has been fetched.  

5. delete message  
`curl -X DELETE -H "Content-Type: application/json" -d '{"messageIds":["messageId1","messageId2"]}' http://localhost:3000/messages`  
Replace `messageId1` and `messageId2` with the IDs of the messages you want to delete. You can add as many message IDs as you want, separated by commas.

