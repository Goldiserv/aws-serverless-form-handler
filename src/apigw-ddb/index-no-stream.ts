import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as iam from 'aws-cdk-lib/aws-iam';
// import { DynamoEventSource, DynamoEventSourceProps } from 'aws-cdk-lib/aws-lambda-event-sources';
// import * as logs from 'aws-cdk-lib/aws-logs';
// import * as path from 'path';
import { Construct } from 'constructs';
import { ApiGatewayToDynamoDBProps, ApiGatewayToDynamoDB } from './aws-apigateway-dynamodb';
import * as dotenv from 'dotenv';
dotenv.config();

class ApigwDynamoDBStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps, createRowRequestItemTemplate?: any) {
    super(scope, id, props);

    // Define a DynamoDB table with backup enabled
    const dynamoTable = new dynamodb.Table(this, 'MyFormDataTable', { // EDITBEFOREDEPLOY table name
      partitionKey: {
        name: 'formSourceId', // EDITBEFOREDEPLOY Replace with your partition key name
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timeAndRequestId', // EDITBEFOREDEPLOY Replace with your sort key name. Adding a sort key allows the partition key to repeat
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // EDITBEFOREDEPLOY Use with caution in production
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // EDITBEFOREDEPLOY PPR or PROVISIONED as needed
      pointInTimeRecovery: true, // EDITBEFOREDEPLOY Enable backup (Point-in-Time Recovery)
    });

    const createRowRequestTemplate = {
      "TableName": dynamoTable.tableName,
      "Item": createRowRequestItemTemplate
    }

    // Use the AWS Solutions Constructs library to create an API Gateway that interacts with DynamoDB
    const apiToDynamoProps: ApiGatewayToDynamoDBProps = {
      apiGatewayProps: {
        defaultMethodOptions: {
          authorizationType: apigateway.AuthorizationType.NONE,
          apiKeyRequired: true, // EDITBEFOREDEPLOY update as needed
        }
      },
      existingTableObj: dynamoTable,
      createRequestTemplate: JSON.stringify(createRowRequestTemplate),
      allowCreateOperation: true, // EDITBEFOREDEPLOY Allow create entry
      allowReadOperation: false, // EDITBEFOREDEPLOY Disallow read entry via ApiGateway
    };

    new ApiGatewayToDynamoDB(this, 'ApiGatewayToDynamoDB', apiToDynamoProps);
  }
}

const app = new cdk.App();
const props = {
  description: "Apigw and DynamoDB to collect for submissions",
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
  }
}
const responseTemplate = {}; // EDITBEFOREDEPLOY agigw response as needed
const createRowRequestItemTemplate = { // EDITBEFOREDEPLOY update form input template as needed
  "formSourceId": {
    "S": "$input.path('$.sourceAndPath')"
  },
  "timeAndRequestId": {
    "S": "$input.path('$.requestDate')_$context.RequestId" // formatted as 2011-10-05T14:48:00.000Z_{id}
  },
  "requestDate": { // for filtering
    "S": "$input.path('$.requestDate')" // formatted as 2011-10-05T14:48:00.000Z i.e. new Date().toISOString()
  },
  "userName": {
    "S": "$input.path('$.userName')"
  },
  "userEmail": {
    "S": "$input.path('$.userEmail')"
  },
  "subject": {
    "S": "$input.path('$.subject')"
  },
  "message": {
    "S": "$input.path('$.message')"
  }
}
const usagePlanDetails = {
  throttle: {
    rateLimit: 10,
    burstLimit: 2
  },
  quota: {
    limit: 1200,
    period: apigateway.Period.MONTH
  }
};
/**
 * EDITBEFOREDEPLOY 
 * for usagePlanDetails to apply automatically, edit the file at: \node_modules\@aws-solutions-constructs\core\lib\apigateway-helper.js 
 * in the function configureRestApi, add to 'const usagePlanProps' the usagePlanDetails above
 * otherwise you can do this manually via the AWS console
 */
console.log("deploying to:", { env: props.env });
new ApigwDynamoDBStack(app, 'ApigwDynamoDBStack', props, createRowRequestItemTemplate);
app.synth();
