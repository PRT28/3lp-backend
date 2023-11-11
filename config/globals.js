const jwt =require ("jsonwebtoken");

const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, proccess.env.TWILIO_TOKEN);

 const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendMessage = (number, template) => {
  client.messages
  .create({
    body: template,
    to: number, // Text this number
    from: procces.env.TWILIO_NUMBER, // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
}

module.exports = {verifyToken, sendMessage}