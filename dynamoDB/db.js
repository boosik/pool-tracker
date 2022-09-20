import AWS from "aws-sdk";
import {awsConfig} from "../config/config.js";
import crypto from "crypto";

export function push(data) {
    AWS.config.update(awsConfig.aws_remote_config);
    const strData = JSON.stringify(data);
    const hash = crypto.createHash("sha256");
    const dataHash = hash.update(strData).digest('hex');
    const docClient = new AWS.DynamoDB.DocumentClient();
    const now = Date.now();
    const param = {
        TableName: awsConfig.aws_table_name,
        Item: {
            data_hash: dataHash,
            data: strData,
            timestamp: now
        },
    };

    console.log("##### Put data #####\n");
    console.log(`data hash : ${dataHash}\n`);
    console.log(`data : ${strData}\n`);
    docClient.put(param, function (err, data) {
       if (err) {
           console.log(`err: ${err}`)
       } else {
           console.log(`push data: ${data.toString()}`)
       }
    });
}

export function getByTime(startTime, endTime) {
    AWS.config.update(awsConfig.aws_remote_config);
    console.log(`startTime: ${startTime}`);
    console.log(`endTime: ${endTime}`);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const param = {
        TableName: awsConfig.aws_table_name,
        ExpressionAttributeValues: {
            ":startTime": parseInt(startTime),
            ":endTime": parseInt(endTime)
        },
        ExpressionAttributeNames: {
            "#ts": "timestamp"
        },
        FilterExpression: `#ts >= :startTime AND #ts <= :endTime`
    }
    return docClient.scan(param).promise();
}

export function getItems() {
    AWS.config.update(awsConfig.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const param = {
        TableName: awsConfig.aws_table_name,
    }
    return docClient.scan(param).promise();
}