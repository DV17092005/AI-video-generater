# AmazonQ Suggestion AWS Deployment

This folder includes a simple Python CLI tool, a Dockerfile, and a PowerShell deployment helper.

## What was fixed
- Corrected the runtime behavior of `AmazonQ_generate_suggestion.py`.
- Added grammatical agreement for plural product names like "Wireless earbuds".
- Added container packaging via `Dockerfile`.
- Added AWS deployment helper script `deploy_to_aws.ps1`.

## Prerequisites
- Docker installed and running.
- AWS CLI installed.
- AWS credentials configured in the environment (`aws login` or `aws configure`).
- An AWS account with ECR permissions.

## Build locally
```powershell
cd AWS\amazonq-suggestion
docker build -t amazonq-generate-suggestion .
```

## Run locally
```powershell
python .\AmazonQ_generate_suggestion.py --product "Wireless earbuds" --features "noise cancellation,battery life,bluetooth 5.3"
```

## Deploy to AWS ECR
From this folder:
```powershell
.\deploy_to_aws.ps1 -Region us-east-1 -RepositoryName amazonq-generate-suggestion
```

After the image is pushed, the script prints the image URI.

## ECS deployment
If you already have an ECS cluster and service, update the service manually:
```powershell
aws ecs update-service --cluster amazonq-cluster --service amazonq-service --force-new-deployment --region us-east-1
```

If you need a new ECS cluster/service, create them in the AWS Console or with the AWS CLI.
