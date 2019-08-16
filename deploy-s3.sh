#!/bin/sh
function resetAws () {
	unset AWS_ACCESS_KEY_ID ; unset AWS_SECRET_ACCESS_KEY ; unset AWS_SESSION_TOKEN
	out=`aws sts get-session-token --serial-number arn:aws:iam::728174137439:mfa/$USER --token-code "${1}"`
	echo $out
	export AWS_ACCESS_KEY_ID=`echo $out | grep -Eow 'AccessKeyId": ".*?"' | cut -f 2 -d " " | tr -d \"`
	export AWS_SECRET_ACCESS_KEY=`echo $out | grep -Eow 'SecretAccessKey": ".*?"' | cut -f 2 -d " " | tr -d \"`
	export AWS_SESSION_TOKEN=`echo $out | grep -Eow 'SessionToken": ".*?"' | cut -f 2 -d " " | tr -d \"`
}
if [ "$#" -ne 1 ]; then
	echo "Usage: ./deploy-s3.sh <authy-token>"
	exit
fi

# set AWS session env vars
resetAws $1
# build the project
npx ngdeploy cxportal-qa -vn --ci --source='src' --gzip --no-push --no-validate --ng-build="--aot --optimization=true --baseHref /"
# sync dist files to s3
aws s3 sync dist s3://cisco-cx-customer-portal
# invalidate the previous cache
invalidate=`aws cloudfront create-invalidation --distribution-id E18XZLV8ZX5K4N --paths '/*'`
id=`echo $invalidate | grep -Eow 'Id": ".*?"' | cut -f 2 -d " " | tr -d \"`
echo "Invalidation in progress: $id"
# check every 3 seconds to see if the cache has been invalidated
complete='incomplete'
while [[ $complete != *"Completed"* ]]; do
	complete=`aws cloudfront get-invalidation --distribution-id E18XZLV8ZX5K4N --id $id`
	echo "Still invalidating..."
    sleep 3
done
