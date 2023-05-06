# text-service

This is a service for sending, retrieving and deleting text messages.

## Tech stack
The server is built in Node.js with Express.js, hosted with Render.     
Data is stored and hosted in Firebase Realtime Database.    
  
## To test the service
To run this locally, run `npm install` and `node app.js` to get the server running.  

Recipient is identified with its user name.   

You can test the service with curl, as below.  
Replace the root url to http://localhost:3000 if you want to test the endpoint locally.  

1. create a user  
`curl -X POST -H "Content-Type: application/json" -d '{"name":"username"}' https://text-service.onrender.com/users`  
Replace `username` with the name of the user you want to create.

2. fetch all users  
`curl -X GET https://text-service.onrender.com/users`

3. send a message  
`curl -X POST -H "Content-Type: application/json" -d '{"senderId":"123", "receiverIdentifier":"username", "text":"Hello, world!"}' https://text-service.onrender.com/messages`  

    Replace the values for `senderId`, `receiverIdentifier`, and `text` with appropriate values to send a message.  
    The receiverIdentifier should be the user name of the recipient.

4. fetch message  
`curl -X GET https://text-service.onrender.com/messages/{userId}`  
Replace `{userId}` with the ID of the user for whom you want to fetch the messages.   

    `curl -X GET https://text-service.onrender.com/messages/{userId}?start={startIndex}&stop={stopIndex}`  
    Additionally, you can add query parameters to specify the range of messages to be fetched.   
    The start and stop parameters specify the range of messages to be fetched.   

    `curl -X GET https://text-service.onrender.com/messages/{userId}?lastFetchedTimestamp={lastFetchedTimestamp}?start={startIndex}&stop={stopIndex}`  
    The lastFetchedTimestamp parameter is used to fetch new messages that were sent after the last fetched message.   
    Replace `{lastFetchedTimestamp}` with the timestamp of the last message that has been fetched.  

5. delete message  
`curl -X DELETE -H "Content-Type: application/json" -d '{"messageIds":["messageId1","messageId2"]}' https://text-service.onrender.com/messages`  
Replace `messageId1` and `messageId2` with the IDs of the messages you want to delete. You can add as many message IDs as you want, separated by commas.

