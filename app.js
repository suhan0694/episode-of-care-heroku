const express = require('express');
const aws = require('aws-sdk');

const app = express();
const cors = require('cors');

app.use(cors());
app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);
app.listen(process.env.PORT || 3000);

console.log("App Started at Port 3000")

const S3_BUCKET = process.env.S3_BUCKET;

aws.config.region = 'us-east-1';

app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3({
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey
    });
    
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 200,
      ContentType: fileType,
      ACL: 'public-read'
    };

    console.log(s3Params)
  
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      console.log(data);
      res.json(returnData);
      //res.end();
    });
  });

  app.get('/test', (req, res) => {
      res.json({username: 'Hello'});
  })