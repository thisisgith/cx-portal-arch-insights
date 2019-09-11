#!/bin/sh
function resetAws () {
	unset AWS_ACCESS_KEY_ID ; unset AWS_SECRET_ACCESS_KEY ; unset AWS_SESSION_TOKEN
	out=`aws sts get-session-token --serial-number arn:aws:iam::728174137439:mfa/$USER --token-code "${1}"`
	echo $out
	export AWS_ACCESS_KEY_ID=`echo $out | grep -Eow 'AccessKeyId": ".*?"' | cut -f 2 -d " " | tr -d \"`
	export AWS_SECRET_ACCESS_KEY=`echo $out | grep -Eow 'SecretAccessKey": ".*?"' | cut -f 2 -d " " | tr -d \"`
	export AWS_SESSION_TOKEN=`echo $out | grep -Eow 'SessionToken": ".*?"' | cut -f 2 -d " " | tr -d \"`
}

function resetAwsNo2FA () {
	unset AWS_ACCESS_KEY_ID ; unset AWS_SECRET_ACCESS_KEY ; unset AWS_SESSION_TOKEN
	out=`aws sts get-session-token --serial-number arn:aws:iam::728174137439:mfa/$USER`
	echo $out
	export AWS_ACCESS_KEY_ID=`echo $out | grep -Eow 'AccessKeyId": ".*?"' | cut -f 2 -d " " | tr -d \"`
	export AWS_SECRET_ACCESS_KEY=`echo $out | grep -Eow 'SecretAccessKey": ".*?"' | cut -f 2 -d " " | tr -d \"`
	export AWS_SESSION_TOKEN=`echo $out | grep -Eow 'SessionToken": ".*?"' | cut -f 2 -d " " | tr -d \"`
}

# Note, as an API user Jenkins deployments do no require 2FA
echo "Usage: ./deploy-s3-prd.sh <authy-token>"

# Note, as an API user Jenkins deployments do no require 2FA, otherwise you must include the authy-token
echo "Usage as user: ./deploy-s3.sh <authy-token>"
echo "Usage as Jenkins:  ./deploy-s3-prd.sh"

# set AWS session env vars
if [ "$#" -ne 1 ]; then
  echo "Assuming you are the Jenkins user"
	resetAwsNo2FA
else
  echo "Assuming you are an API user and have provided an authy-token"
  resetAws $1
fi

# build the project
npx ng build -c production --aot --build-optimizer --optimization=true --baseHref /
npm run gzip

# Add a revision sha into the directory
git rev-parse HEAD > dist/rev

# sync dist files to s3
aws s3 sync dist s3://cisco-cx-customer-portal-prd

# invalidate the previous cache
invalidate=`aws cloudfront create-invalidation --distribution-id E1W168M67WH64S --paths '/*'`
id=`echo $invalidate | grep -Eow 'Id": ".*?"' | cut -f 2 -d " " | tr -d \"`
echo "Invalidation in progress: $id"
# check every 3 seconds to see if the cache has been invalidated
complete='incomplete'
while [[ $complete != *"Completed"* ]]; do
	complete=`aws cloudfront get-invalidation --distribution-id E1W168M67WH64S --id $id`
	echo "Still invalidating..."
    sleep 3
done
