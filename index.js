const AWS = require("aws-sdk");

const QUEUE_URL = process.env.QUEUE_URL;

const sendRes = (callback, json, statusCode = 200) => {
  const res = {
    isBase64Encoded: false,
    statusCode,
    headers: { Hey: "Vsauce!" },
    body: JSON.stringify(json),
  };

  callback(null, res);
};

exports.handler = async (event, context, callback) => {
  if (event.httpMethod === "OPTIONS") {
    return true;
  }
  if (!event.body) {
    sendRes(
      callback,
      {
        message: "Body is empty, what's that supposed to mean?",
      },
      400
    );
  }

  const sqs = new AWS.SQS();

  const params = {
    MessageBody: event.body,
    QueueUrl: QUEUE_URL,
  };

  try {
    await sqs.sendMessage(params).promise();
    sendRes(
      callback,
      {
        message: "Done!",
      },
      200
    );
  } catch (_) {
    sendRes(
      callback,
      {
        message: "Failed",
      },
      500
    );
  }
};
