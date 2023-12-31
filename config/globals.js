const jwt =require ("jsonwebtoken");
const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const aws = require("aws-sdk")

aws.config.update({region: 'us-east-1'});

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

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET
  }
})

// async function createFolder(Bucket, Key) {
//   const client = new S3Client();
//   const command = new PutObjectCommand({ Bucket, Key });
//   return client.send(command);
// }

// async function existsFolder(Bucket, Key) {
//   const client = new S3Client();
//   const command = new HeadObjectCommand({ Bucket, Key });

//   try {
//     await client.send(command);
//     return true;
//   } catch (error) {
//     if (error.name === "NotFound") {
//       return false;
//     } else {
//       throw error;
//     }
//   }
// }

// async function createFolderIfNotExist(Bucket, Key) {
//   if (!(await existsFolder(Bucket, Key))) {
//     return createFolder(Bucket, Key);
//   }
// }

// async function deleteFolder(Bucket, Key) {
//   const client = new S3Client();
//   const command = new DeleteObjectCommand({ Bucket, Key });
//   return client.send(command);
// }

const s3Upload = (params, id) => {
  const uploadParams = {
    ...params,
    Bucket: `randomjoy/${id}/`,
    ACL: 'public-read'
  }

  s3.upload(uploadParams, (err, data) => {
    if (data) {
      return data.Location;
    }
    if (err) {
      return err
    }
  })
}

module.exports = {verifyToken, sendMessage, s3Upload}