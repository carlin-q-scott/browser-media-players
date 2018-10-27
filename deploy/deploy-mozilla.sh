#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
artifactList=($DIR/../web-ext-artifacts/*.zip)

token=$(node $DIR/auth-mozilla.js)
curl "https://addons.mozilla.org/api/v4/addons/" \
    -g -XPOST -F "upload=@$artifactList" \
    -H "Authorization: JWT $token"
