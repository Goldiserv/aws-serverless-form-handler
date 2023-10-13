
# Setup
1. Setup a new AWS account or use an existing one
1. Install and configure AWS CLI https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
1. Install AWS CDK. Run either:
    npm install -g aws-cdk
    yarn global add aws-cdk
1. when running deploying to a new region for the first time run:
    cdk bootstrap aws://ACCOUNT-NUMBER/REGION

# Deploying
1. Edit the .env file to update the deployment account and region
1. Search for 'EDITBEFOREDEPLOY' in index.ts and make adjustments as needed
1. run "yarn build" or "yarn watch" to transpile .ts file to .js
1. run cdk deploy

# Troubleshooting
1. on an error such as "current credentials could not be used to assume 'arn:aws:iam::...', but are for the right account. Proceeding anyway.". You may need to run: 
    cdk bootstrap aws://ACCOUNT-NUMBER/REGION