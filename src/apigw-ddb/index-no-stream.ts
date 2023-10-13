import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { ApiGatewayToDynamoDBProps, ApiGatewayToDynamoDB } from '../lib/aws-apigateway-dynamodb';
import * as dotenv from 'dotenv';
dotenv.config();

class ApigwDynamoDBStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps, createRowRequestItemTemplate?: any, createIntegrationResponseStructure?: cdk.aws_apigateway.IntegrationResponse[]) {
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
      encryption: dynamodb.TableEncryption.AWS_MANAGED // EDITBEFOREDEPLOY 
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
      createIntegrationResponses: createIntegrationResponseStructure,
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
  },
}

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

/**
 * EDITBEFOREDEPLOY 
 * for usagePlanDetails to apply automatically, edit the file at: \node_modules\@aws-solutions-constructs\core\lib\apigateway-helper.js 
 * in the function configureRestApi, add to 'const usagePlanProps' the usagePlanDetails above
 * otherwise you can do this manually via the AWS console
 */
const usagePlanDetailsEXAMPLE = {
  throttle: {
    rateLimit: 10,
    burstLimit: 2
  },
  quota: {
    limit: 1200,
    period: apigateway.Period.MONTH
  }
};

const createIntegrationResponseStructure = [ // EDITBEFOREDEPLOY
  {
    statusCode: "200",
    responseTemplates: {
      "application/json": JSON.stringify({
        message: "Success: Entry created successfully.", 
        // You can add more response data here if needed
      })
    },
    responseParameters: {
      "method.response.header.Content-Type": "'application/json'",
      // You can add more response headers here if needed
    }
  }
];

console.log("deploying to:", { env: props.env });
new ApigwDynamoDBStack(app, 'ApigwDynamoDBStack', props, createRowRequestItemTemplate, createIntegrationResponseStructure);
app.synth();
