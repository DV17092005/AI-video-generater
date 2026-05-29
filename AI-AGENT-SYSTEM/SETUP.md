# Environment Setup Guide

This guide helps you configure the AI Agent System for your environment.

## Prerequisites

- Node.js 14+
- npm or yarn
- API keys for:
  - Pinecone (vector database)
  - OpenAI (embeddings)
  - MongoDB (optional, for persistence)
  - Redis (optional, for caching)

## Installation

### 1. Install Required Packages

```bash
cd AI-AGENT-SYSTEM
npm install
```

### 2. Create .env File

Create a `.env` file in the project root:

```env
# Vector Database (Pinecone)
VECTOR_DB_API_KEY=your_pinecone_api_key_here
VECTOR_ENV=production
VECTOR_INDEX_NAME=ai-agent-memory

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Encryption
ENCRYPTION_KEY=your_32_character_hex_string_here

# Database (Optional)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-agent
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_here

# Agent Configuration
ENABLE_LEARNING=true
ENABLE_PERSONALIZATION=true
EVALUATION_INTERVAL=100
TASK_TIMEOUT=30000
```

## Getting API Keys

### Pinecone (Vector Database)

1. Sign up at https://www.pinecone.io
2. Create a new project
3. Create an index with:
   - Name: `ai-agent-memory`
   - Dimension: `1536` (for OpenAI embeddings)
   - Metric: `cosine`
4. Copy your API key from the dashboard

### OpenAI API

1. Sign up at https://platform.openai.com
2. Go to API keys section
3. Create new secret key
4. Copy and store securely

### MongoDB (Optional)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string from Atlas
4. Set `MONGODB_URI` in .env

### Redis (Optional)

```bash
# Install Redis locally
brew install redis  # macOS
apt-get install redis-server  # Linux
choco install redis  # Windows (via Chocolatey)

# Start Redis
redis-server
```

## Configuration Files

### config.json - Agent Configuration

The `integration/config.json` file contains all agent settings:

```json
{
  "agentConfig": {
    "enableLearning": true,
    "enablePersonalization": true,
    "evaluationInterval": 100
  },
  "memory": {
    "maxMemoryAge": 7776000000,
    "minRelevanceScore": 0.6
  },
  "privacy": {
    "dataRetentionDays": 90
  }
}
```

### Safety Rules Configuration

Customize safety rules in `integration/config.json`:

```json
"safetyRules": {
  "allowDataCollection": false,
  "allowPersonalization": false,
  "contentFilter": true,
  "blockSensitiveData": true,
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerHour": 1000
  }
}
```

## Encryption Key Generation

Generate a secure 32-character hex encryption key:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Integration with Express

See `INTEGRATION_GUIDE.md` for backend integration steps.

## Testing Configuration

Test your setup:

```bash
# Run basic tests
npm test

# Test vector database connection
node -e "
const { createAgent } = require('./index');
createAgent().then(agent => {
  agent.getStatus().then(status => {
    console.log('✓ Agent initialized successfully');
    console.log(status);
  });
});
"
```

## Production Deployment

### Security Checklist

- [ ] All API keys stored in environment variables
- [ ] Encryption key is strong and unique
- [ ] HTTPS enabled for all API endpoints
- [ ] Rate limiting configured
- [ ] Audit logging enabled
- [ ] GDPR compliance verified
- [ ] Data retention policies set
- [ ] Regular backups configured

### Performance Optimization

```javascript
// Increase batch processing for high volume
config.memory.batchSize = 100;

// Adjust evaluation interval
config.evaluation.evaluationInterval = 200;

// Optimize vector database indexes
// See Pinecone documentation for index optimization
```

### Monitoring Setup

Install monitoring tools:

```bash
npm install prometheus express-prometheus-middleware
```

Configure Prometheus metrics collection for:
- Agent availability
- Task success rates
- API response times
- Memory usage
- Error rates

### Scaling

For multiple instances:

1. Use Redis for shared cache
2. Configure shared vector database
3. Set up load balancer
4. Implement session management

```javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Share evaluator state across instances
await client.set('agent:metrics', JSON.stringify(metrics));
```

## Troubleshooting

### Issue: "Vector DB initialization failed"

**Solution:**
- Verify Pinecone API key is correct
- Check network connectivity
- Ensure index exists in Pinecone dashboard

### Issue: "OpenAI API error"

**Solution:**
- Verify OpenAI API key is valid
- Check API quota and rate limits
- Ensure model name is correct (text-embedding-3-small)

### Issue: "Encryption error"

**Solution:**
- Verify ENCRYPTION_KEY is 32-character hex
- Ensure all data is properly encoded
- Check for data corruption

### Issue: "Memory errors"

**Solution:**
- Monitor memory usage
- Reduce evaluation interval
- Implement garbage collection
- Archive old memories

## Support

For issues or questions:
1. Check the README.md
2. Review INTEGRATION_GUIDE.md
3. Check API documentation
4. Review error logs

## Next Steps

1. Complete the integration with your backend
2. Set up monitoring and alerting
3. Configure safety rules for your use case
4. Test with sample data
5. Deploy to production
