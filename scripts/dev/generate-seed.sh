#!/usr/bin/env bash

BASEDIR=$(dirname $0)
FILENAME="$1.ts"

if [ -z "$1" ]; then
  echo
  echo "Missing required seeder name"
  echo
  echo "Enter the following command:"
  echo "yarn seed:generate <seeder-name>"
  echo
elif [ -f "$PWD/src/e2e/seeders/$FILENAME" ]; then
  echo
  echo "Seeder with the specified name already exists"
  echo
  echo "Enter the following command:"
  echo "yarn seed:generate <seeder-name>"
  echo
else
  cp "$BASEDIR/migration-template.ts" "$PWD/src/e2e/seeders/$FILENAME"

  echo
  echo "Migration ./src/e2e/seeders/$FILENAME generated"
  echo
fi
