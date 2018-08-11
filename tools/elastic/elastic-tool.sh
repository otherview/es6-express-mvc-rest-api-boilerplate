#!/bin/sh
# Probably a more serious tool would be better here
# Using this as an easy teardown and setup tool for elastic

host=$1
index=$2
index_file=$3

if [ -n "$host" ] && [ -n "$index" ] && [ -n "$index_file" ]; then
    echo "$host - $index - $index_file"
else
    echo "argument error"
fi

echo "Deleting $index index"
curl -XDELETE $host/$index?pretty

echo "Deleting test_$index index"
curl -XDELETE $host/test_$index?pretty

echo "Creating $index index"
curl -XPUT $host/$index?pretty --header 'Content-Type: application/json' -d @$index_file

echo "Creating test_$index index"
curl -XPUT $host/test_$index?pretty --header 'Content-Type: application/json' -d @$index_file

echo "Adding users_test_dataset data to test_$index"
curl -XPUT $host/test_$index/docs/123?pretty --header 'Content-Type: application/json' -d @../../src/Tests/assets/users_test_dataset.json


