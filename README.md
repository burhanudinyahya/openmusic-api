# How to run this project locally

- docker-compose up -d
- cp .env.example .env
- npm install
- npm run migrate up
- npm run start-dev

## How to create AWS S3 bucket publicly

### 1. with aws console

- create bucket with name `dicoding-notesapp-public-dev-1246752213213` and `Block all public access` disabled
- after bucket created, open your bucket and add this policy to Bucket policy in tab permissions

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowPublicRead",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "*"
                },
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::dicoding-notesapp-public-dev-1246752213213/*"
            }
        ]
    }
    ```

- save, and all files and folder inside your bucket will be public

### 2. with aws cli

- create bucket

```sh
aws s3api create-bucket \
--bucket dicoding-notesapp-public-dev-1246752213213 \
--acl public-read \
--region ap-southeast-1 \
--create-bucket-configuration LocationConstraint=ap-southeast-1

```

- edit bucket policy

```sh
aws s3api put-bucket-policy \
--bucket dicoding-notesapp-public-dev-1246752213213 \
--policy '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicRead",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::dicoding-notesapp-public-dev-1246752213213/*"
        }
    ]
}'

```

## How to delete bucket (default: versioning disabled)

- empty bucket first if any

```sh
aws s3 rm s3://dicoding-notesapp-public-dev-1246752213213 --recursive

```

- delete bucket

```sh
aws s3api delete-bucket --bucket dicoding-notesapp-public-dev-1246752213213

```
