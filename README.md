# text-service

This is a service for sending, retrieving and deleting plain text messages.

## Tech stack
The server is built with Express.js, and hosted with Render.   
Data is stored and hosted in Firebase Realtime Database.  
The endpoints are implemented in RESTful convention.  

## API documentation

### Base URL
`https://text-service.onrender.com`  

### Endpoints

#### GET /users  
    Retrieve all users in the database  

#### POST /users  
    Create a new user  
    Request:
    Content-Type: application/json  
    {"name": "Michael Scott"}  

#### DELETE /messages  
    Delete messages by message ID  
    Request:  
    Content-Type: application/json  
    {"messageIds": ["message-id-1", "message-id-2"]}  

#### POST /messages  
    Send a message
    Request:
    Content-Type: application/json  
    {"senderId": "-NUcHV-azaCfdNQ5Z5Aw", "receiverIdentifier": "Dwight Schrute", "text": "Hello, Dwight!"}  

#### GET /messages/:userId  
    Get messages for a user
    Request:  
    GET /messages/:userId?start=0&stop=10&lastFetchedTimestamp=1620704560992

## To test the service
You can test the service with curl, for example, as below.  

To run the server locally, run `npm install` and `node app.js`.  
If you want to test the endpoints locally, you will need a secret file for firebase database configuration and change the FIREBASE_KEY_PATH at .env file with the path of directory where you have stored the secret. Finally, replace the base url with http://localhost:3000.  

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

