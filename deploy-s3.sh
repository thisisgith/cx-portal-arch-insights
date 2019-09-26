#!/bin/bash

### If last command returned non-zero exit code, abort
function exitIfError () {
	rc=$?
	if [[ $rc != 0 ]]; then
		echo "[ERROR]"
		exit $rc
	fi
}

### Gets a session token from AWS using provided MFA token
function resetAws () {
	unset AWS_ACCESS_KEY_ID ; unset AWS_SECRET_ACCESS_KEY ; unset AWS_SESSION_TOKEN
	out=`aws sts get-session-token --serial-number arn:aws:iam::728174137439:mfa/$USER --token-code "${1}"`
	echo $out
	export AWS_ACCESS_KEY_ID=`echo $out | grep -Eow 'AccessKeyId": ".*?"' | cut -f 2 -d " " | tr -d \"`
	export AWS_SECRET_ACCESS_KEY=`echo $out | grep -Eow 'SecretAccessKey": ".*?"' | cut -f 2 -d " " | tr -d \"`
	export AWS_SESSION_TOKEN=`echo $out | grep -Eow 'SessionToken": ".*?"' | cut -f 2 -d " " | tr -d \"`
	exitIfError
}

### Shows usage and exits
function showUsage () {
	echo "Usage as user: ./deploy-s3.sh <qa | lt | prd> <authy-token>"
	echo "Usage as Jenkins:  ./deploy-s3.sh <qa | lt | prd>"
	exit 0;
}

### Sets environment-specific variables
function setEnv () {
	env="$1"
	case $env in
		"lt")
			dist_id="E2HK2RIKERL8A4"
			deploy_command="cxportal-lt"
			bucket="s3://cisco-cx-customer-portal-lt"
			;;
		"prd")
			dist_id="E1W168M67WH64S"
			deploy_command="production"
			bucket="s3://cisco-cx-customer-portal-prd"
			;;
		"qa")
			dist_id="E18XZLV8ZX5K4N"
			deploy_command="cxportal-qa"
			bucket="s3://cisco-cx-customer-portal"
			;;
	  "qa2")
	     dist_id="EWCEMDJ2O4JUM"
	     deploy_command="cxportal-qa"
	     bucket="s3://cisco-cx-customer-portal-qa2"
	    ;;
	  "lt2")
	     dist_id="E250CLJCD4Z158"
	     deploy_command="cxportal-lt"
	     bucket="s3://cisco-cx-customer-portal-lt2"
	    ;;
	esac
}

# Note, as an API user Jenkins deployments do no require 2FA, otherwise you must include the authy-token

# set AWS session env vars
if [ "$#" -lt 1 ]; then
	# need to provide at least 1 argument
	showUsage
else
	if [ "$1" != "qa" ] && [ "$1" != 'lt' ] && [ "$1" != 'prd' ] && [ "$1" != 'qa2' ] && [ "$1" != 'lt2' ]; then
		# 1st argument must be environment
		showUsage
	fi
	setEnv "$1"
	if [ "$#" -eq 3 ]; then
		# 2nd argument is only required for AWS users needing MFA auth
		echo "Assuming you are an MFA user and have provided an authy-token"
		resetAws $1
	else
		# Jenkins doesn't require MFA token
		echo "Assuming Jenkins"
	fi
fi

# build the project
npx ng build -c $deploy_command --aot --build-optimizer --optimization=true --baseHref /
exitIfError
# gzip the dist files
npm run gzip
exitIfError

# Add a revision sha into the directory
git rev-parse HEAD > dist/rev

#sync dist files to s3
aws s3 sync --delete dist $bucket
exitIfError

# invalidate the previous cache
invalidate=`aws cloudfront create-invalidation --distribution-id $dist_id --paths '/*'`
exitIfError
id=`echo $invalidate | grep -Eow 'Id": ".*?"' | cut -f 2 -d " " | tr -d \"`
echo "Invalidation in progress: $id. This may take 5-10 minutes..."
# check every 3 seconds to see if the cache has been invalidated
# complete='incomplete'
# while [[ $complete != *"Completed"* ]]; do
# 	complete=`aws cloudfront get-invalidation --distribution-id E18XZLV8ZX5K4N --id $id`
# 	echo "Still invalidating..."
#     sleep 3
# done
