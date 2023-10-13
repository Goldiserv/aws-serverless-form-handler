# AWS Serverless Form Handler (ASFM) ✨

ASFM is a quick template to deploy a low-cost performant backend using Amazon API Gateway and DynamoDB.
ASFM is designed for users who want to self-host form submission data.

## Features 🌟

- API calls are secured behind an api key
- Ability to add throttling and quotas
- Out of the box input validation
- In control of your own data
- Encrption enabled by default
- Deploy and test with ease

## Setup ⚙️

1. Setup a new AWS account or use an existing one
1. Install and configure AWS CLI https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
1. Install AWS CDK. Run either:
    npm install -g aws-cdk
    yarn global add aws-cdk
1. when running deploying to a new region for the first time run:
    cdk bootstrap aws://ACCOUNT-NUMBER/REGION
1. save the .env.example file as .env and update its variables

## Deploying 🚀

1. Edit the .env file to update the deployment account and region
1. Search for 'EDITBEFOREDEPLOY' in index.ts and make adjustments as needed
1. run "yarn build" or "yarn watch" to transpile .ts file to .js
1. run cdk deploy

## Testing 🧪

1. Test the newly created API via tools such as Postman, Thunder client, or Axios. An example using Axios is provided in axios-example.ts
1. Query DynamoDb entries via .\read-dynamodb\check-submissions-example.bat

## Troubleshooting 🐛
1. on an error such as "current credentials could not be used to assume 'arn:aws:iam::...', but are for the right account. Proceeding anyway.". You may need to run: 
    cdk bootstrap aws://ACCOUNT-NUMBER/REGION

## Contributing 🤝

1. Fork the repo.
2. Create a branch.
3. Make changes and commit.
4. Push and create a pull request.

## License 📄
MIT License. 