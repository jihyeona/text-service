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

  const { email } = req.body;

  newUserRef
    .set({
      email: email,
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

  try {
    const { senderId, receiverIdentifier, text } = req.body;
    // check if the recipient exists
    const receiverSnapshot = await database.ref("users").orderByChild("email").equalTo(receiverIdentifier).once("value");
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

app.get("/messages/:userId", async (req, res) => {
  const userId = req.params.userId;
  const start = parseInt(req.query.start) || 0;
  const stop = parseInt(req.query.stop) || 10;
  const database = admin.database();
  const ref = database.ref("messages");
  
  try {
    const snapshot = await ref
      .orderByChild("receiver_id")
      .equalTo(userId)
      .limitToLast(stop - start)
      .once("value");

    let messages = [];

    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      console.log('message:', message)
      message.id = childSnapshot.key;
      console.log('message.id:', message.id)
      messages.push(message);
    });

    messages.reverse();
    messages = messages.slice(messages.length - stop, messages.length - start);

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
