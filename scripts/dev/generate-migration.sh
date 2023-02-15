#!/usr/bin/env bash

if [ -z "$1" ]; then
  echo
  echo "Missing required migration name"
  echo
  echo "Enter the following command:"
  echo "yarn migrate:generate <migration-name>"
  echo
else
  BASEDIR=$(dirname $0)
  TIMESTAMP=$(date +"%Y%m%d%H%M%S")
  FILENAME="$TIMESTAMP-$1.ts"

  cp "$BASEDIR/migration-template.ts" "$PWD/src/migrations/$FILENAME"

  echo
  echo "Migration ./src/migrations/$FILENAME generated"
  echo
fi
