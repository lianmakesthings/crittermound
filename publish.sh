#!/usr/bin/env bash

# die on error
set -e

# install things
apt-get --assume-yes install curl

# https://gist.github.com/cjus/1047794
echo 'Retrieving latest deploy...'
url=`curl -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys`
temp=`echo $url | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w -m 1 'id'`

# https://www.netlify.com/docs/api/#deploys
echo "Publishing build ${temp##*|}..."
curl -X POST -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" -d "{}" "https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys/${temp##*|}/restore"

# https://open-api.netlify.com/#/default/lockDeploy
echo "Locking deploy to ${temp##*|}..."
curl -X POST -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" -d "{}" "https://api.netlify.com/api/v1/deploys/${temp##*|}/lock"