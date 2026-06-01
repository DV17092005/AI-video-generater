param(
    [string]$Region = "us-east-1",
    [string]$RepositoryName = "amazonq-generate-suggestion",
    [string]$EcsCluster = "amazonq-cluster",
    [string]$EcsService = "amazonq-service"
)

Write-Host "Checking AWS credentials..."
try {
    $accountId = aws sts get-caller-identity --query Account --output text --region $Region
} catch {
    Write-Error "AWS credentials are not configured or not valid. Run 'aws login' or configure credentials first."
    exit 1
}

if (-not $accountId) {
    Write-Error "Unable to determine AWS account ID."
    exit 1
}

$repositoryUri = "$accountId.dkr.ecr.$Region.amazonaws.com/$RepositoryName"

Write-Host "Ensuring ECR repository exists: $RepositoryName"
aws ecr describe-repositories --repository-names $RepositoryName --region $Region --output json >$null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to query ECR repository. Check IAM permissions for ecr:DescribeRepositories."
    exit 1
}

Write-Host "Logging into Amazon ECR..."
aws ecr get-login-password --region $Region 2>$null | docker login --username AWS --password-stdin "$accountId.dkr.ecr.$Region.amazonaws.com"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to log in to ECR. Check IAM permissions for ecr:GetAuthorizationToken."
    exit 1
}

Write-Host "Building Docker image..."
docker build -t $RepositoryName .

docker tag $RepositoryName "$repositoryUri:latest"

Write-Host "Pushing image to ECR: $repositoryUri:latest"
docker push "$repositoryUri:latest"

Write-Host "Deployment package is pushed. Image URI: $repositoryUri:latest"
Write-Host "If you want to deploy to ECS, create an ECS task definition and service using this image URI."
Write-Host "Example ECS update command: aws ecs update-service --cluster $EcsCluster --service $EcsService --force-new-deployment --region $Region"
