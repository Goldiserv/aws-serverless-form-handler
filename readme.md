# AWS Serverless Form Handler ✨

AWS Serverless Form Handler is a quick template to deploy a low-cost performant backend using Amazon API Gateway and DynamoDB.
It is designed for users who want to self-host form submission data.

## Features 🌟

- API calls are secured behind an api key
- Ability to add throttling and quotas
- Out of the box input validation
- In control of your own data and data sovereignty 
- Encryption enabled by default
- Deploy and test with ease
- Default DynamoDB sort key prioritises filtering by date

## Roadmap 🎯

- Email notitifcations on submissions via SES

## Setup ⚙️

1. Setup a new AWS account or use an existing one
1. Install and configure AWS CLI https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
1. Install AWS CDK. Run either:
    - npm install -g aws-cdk
    - yarn global add aws-cdk
1. when running deploying to a new region for the first time run:
    - cdk bootstrap aws://ACCOUNT-NUMBER/REGION
1. save the .env.example file as .env and update its variables
1. run 'yarn install' or 'npm install'

## Deploying 🚀

1. update 'app' in cdk.json if deploying a file other than .\src\apigw-ddb\index-no-stream.ts
1. Edit the .env file to update the deployment account and region
1. Search for 'EDITBEFOREDEPLOY' in index.ts and make adjustments as needed
1. run "yarn build" or "yarn watch" to transpile .ts file to .js
1. run "cdk deploy"
1. to add ApiGatway response CORS headers, there seems to be an issue with the CDK as it's missing the ability to add headers via CDK. Instead, manually enable CORS on the API post endpoint.
    - See issue desciption https://github.com/aws/aws-cdk/issues/15493. 
    - Adding CORS via console: https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors-console.html

## Testing 🧪

1. Test the newly created API via tools such as Postman, Thunder client, or Axios. An example using Axios is provided in axios-example.ts
1. Query DynamoDb entries via .\read-dynamodb\check-submissions-example.bat

## Troubleshooting 🐛

1. on an error such as "current credentials could not be used to assume 'arn:aws:iam::...', but are for the right account. Proceeding anyway.". You may need to run: 
    - cdk bootstrap aws://ACCOUNT-NUMBER/REGION

## Contributing 🤝

1. Fork the repo.
2. Create a branch.
3. Make changes and commit.
4. Push and create a pull request.

## License 📄

MIT License. 

## Author ✍️

Peter Shi ([LinkedIn](https://www.linkedin.com/in/petershicloud/))