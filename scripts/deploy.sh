#!/bin/sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="$PROJECT_DIR/aws.local"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Missing config file: aws.local"
  echo "Create it with:"
  echo "  FUNCTION_NAME=your-function-name"
  echo "  S3_BUCKET=your-bucket-name"
  echo "  AWS_REGION=us-east-1  # optional"
  exit 1
fi

. "$CONFIG_FILE"

if [ -z "$FUNCTION_NAME" ]; then
  echo "FUNCTION_NAME is not set in aws.local"
  exit 1
fi

if [ -z "$S3_BUCKET" ]; then
  echo "S3_BUCKET is not set in aws.local"
  exit 1
fi

REGION_FLAG=""
if [ -n "$AWS_REGION" ]; then
  REGION_FLAG="--region $AWS_REGION"
fi

# Build first
"$SCRIPT_DIR/build.sh"

echo "Copying public/ to S3 bucket: $S3_BUCKET"
aws s3 cp "$PROJECT_DIR/public" "s3://$S3_BUCKET" $REGION_FLAG --recursive

echo "Uploading pico.min.css to S3"
aws s3 cp "$PROJECT_DIR/node_modules/@picocss/pico/css/pico.min.css" \
  "s3://$S3_BUCKET/css/pico.min.css" \
  $REGION_FLAG

echo "Updating Lambda function: $FUNCTION_NAME"
aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  $REGION_FLAG \
  --zip-file "fileb://$PROJECT_DIR/dist.zip"
