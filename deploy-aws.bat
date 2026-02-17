@echo off
echo Building frontend...
call npm run build

echo Installing server dependencies...
cd server
call npm install

echo Ready for AWS deployment!
echo Run: eb init -p node.js-18 terraform-ai --region us-east-1
echo Then: eb create terraform-ai-env --single --instance-type t2.micro
