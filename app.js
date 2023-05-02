require("dotenv").config();

const express = require("express");
const admin = require("firebase-admin");

const serviceAccount = require(process.env.FIREBASE_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const app = express();
app.use(express.json());
const port = 3000;

app.get("/", (req, res) => {
  const database = admin.database();
  const ref = database.ref("test");
  ref
    .set("Hello, world, again!")
    .then(() => {
      res.send("Firebase initialised successfully!");
    })
    .catch((error) => {
      console.error("Error writing to Firebase:", error);
      res.status(500).send("Error writing to Firebase");
    });
});

app.get("/users", (req, res) => {
  const database = admin.database();
  const ref = database.ref("users");
  ref
    .once("value")
    .then((snapshot) => {
      const users = snapshot.val();
      res.json(users);
    })
    .catch((error) => {
      console.error("Error reading from Firebase:", error);
      res.status(500).send("Error reading from Firebase");
    });
})

app.post("/users", (req, res) => {
  const database = admin.database();
  const ref = database.ref("users");
  const newUserRef = ref.push();
  const { name } = req.body;

  newUserRef
    .set({
      name: name,
    }).then(() => {
      res.send("User created successfully!");
    }).catch(error => {
      console.log('Error creating user:', error);
      res.status(500).send("Error creating user");
    })
})

app.post("/messages", async (req, res) => {
  const database = admin.database();
  const ref = database.ref("messages");
  const newMessageRef = ref.push();
  const { senderId, receiverIdentifier, text } = req.body;

  try {
    // check if the recipient exists
    const receiverSnapshot = await database.ref("users").orderByChild("name").equalTo(receiverIdentifier).once("value");
    if (!receiverSnapshot.exists()) {
      return res.status(400).send('Recipient does not exist');
    }
  
    const receiverId = Object.keys(receiverSnapshot.val())[0];
    
    newMessageRef
    .set({
      sender_id: senderId,
      receiver_id: receiverId,
      text: text,
      timestamp: Date.now(),
    })
    .then(() => {
      res.send("Message sent successfully!");
    }).catch(error => {
      console.log('Error sending the message:', error);
    });
  } catch (error)  {
      console.log("Error sending the message:", error);
      res.status(500).send("Error sending the message");
    }
});

app.delete("/messages", async (req, res) => {
  const database = admin.database();
  const ref = database.ref("messages");
  const { messageIds } = req.body;

  try {
    const promises = messageIds.map(async (messageId) => {
      // check if the message with matching id exists
      const snapshot = await ref.child(messageId).once("value");
      if (snapshot.exists()) {
        return ref.child(messageId).remove();
      } else {
      throw new Error(`Message with id ${messageId} not found`);
      }
    });

    await Promise.all(promises).then(() => {
        console.log("Messages deleted successfully!");
        res.send("Messages deleted successfully!");
    });
  } catch (error) {
    console.log("Error deleting the messages:", error);
    res.status(500).send("Error deleting the messages");
  }
});

app.get("/messages/:userId", async (req, res) => {
  const userId = req.params.userId;
  const start = parseInt(req.query.start) || 0;
  const stop = parseInt(req.query.stop) || 10;
  const lastFetchedTimestamp = parseInt(req.query.lastFetchedTimestamp); 

  const database = admin.database();
  const query = database.ref("messages").orderByChild('receiver_id_timestamp');
  
  try {
    const snapshot = await query.once("value");

    let messages = [];

    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      if (message.receiver_id === userId) {
        message.id = childSnapshot.key;
        messages.push(message);
      }
    });

    messages.sort((a, b) => a.timestamp - b.timestamp);

    if (lastFetchedTimestamp) {
      messages = messages.filter((message) => message.timestamp > lastFetchedTimestamp);
    }

    messages = messages.slice(start, stop);
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
