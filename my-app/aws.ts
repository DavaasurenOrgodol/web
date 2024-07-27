import {
    DynamoDBClient,
    PutItemCommand,
    ScanCommand,
    DeleteItemCommand,
    UpdateItemCommand
   }
   from "@aws-sdk/client-dynamodb";
   
   const dynamodb = new DynamoDBClient({
    apiVersion: "2012-08-10"
   });
   
   export const handler = async (event) => {
    console.log('event', event);
    const routeKey = event.httpMethod + '/' + event.resource;
    const courseCode = event.courseCode + "";
    const teacherName = event.teacherName + "";
    switch (routeKey) {
     case 'POST/courses':
      return await Create();
     case 'GET/courses':
      return await Read();
     case 'DELETE/courses':
      return await Delete(courseCode, teacherName);
     case 'PUT/courses':
      return await Update(courseCode, teacherName);
    }
   };
   
   const Create = async () => {
    const param = {
     TableName: 'CourseTable',
     Item: {
      "courseCode": {
       S: 'CS516'
      },
      "courseName": {
       S: 'CC'
      },
      "teacherName": {
       S: 'Uno'
      }
     }
    };
    const command = new PutItemCommand(param);
    await dynamodb.send(command);
    const response = {
     statusCode: 200,
     body: JSON.stringify("Data Created Successfully"),
    };
   
    return response;
   };
   
   const Read = async () => {
    const command = new ScanCommand({
     ProjectionExpression: "#courseCode,courseName,teacherName",
     ExpressionAttributeNames: { "#courseCode": "courseCode" },
     TableName: "CourseTable",
    });
    const data = await dynamodb.send(command);
    return {
     statusCode: 200,
     body: JSON.stringify(data.Items),
    }
   };
   
   const Delete = async (courseCode, teacherName) => {
    const command = new DeleteItemCommand({
     TableName: "CourseTable",
     Key: {
      courseCode: {
       "S": courseCode
      },
      teacherName: {
       "S": teacherName
      }
     },
    });
    const response = await dynamodb.send(command);
    return response;
   };
   
   const Update = async (courseCode, teacherName) => {
    const command = new UpdateItemCommand({
     ExpressionAttributeNames: {
      "#courseName": "courseName"
     },
     ExpressionAttributeValues: {
      ":newCourseName": {
       "S": "Cloud Computing"
      }
     },
     Key: {
      courseCode: {
       "S": courseCode
      },
      teacherName: {
       "S": teacherName
      }
     },
     UpdateExpression: "SET #courseName = :newCourseName",
     TableName: "CourseTable",
     ReturnValues: "ALL_NEW"
    });
    await dynamodb.send(command);
    return {
     statusCode: 200,
     body: JSON.stringify("Data Updated"),
    };
   };
   