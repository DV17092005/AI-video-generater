# Quick Start Guide - AI Agent System

Get up and running with the AI Agent System in 5 minutes.

## Prerequisites

- Node.js 14+
- npm or yarn
- API keys for:
  - Pinecone (https://www.pinecone.io)
  - OpenAI (https://platform.openai.com)

## 1. Installation (1 minute)

```bash
# Navigate to AI-AGENT-SYSTEM
cd AI-AGENT-SYSTEM

# Install dependencies
npm install
```

## 2. Configuration (2 minutes)

Create a `.env` file in the project root:

```env
# Required
VECTOR_DB_API_KEY=pk_xxxxxxxxxxxx
OPENAI_API_KEY=sk_xxxxxxxxxxxx
ENCRYPTION_KEY=your_32_char_hex_string_here

# Optional
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://localhost:6379
```

Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Initialize (1 minute)

```bash
# Run example
node EXAMPLES.js
```

Expected output:
```
🚀 Initializing AI Agent System...
1️⃣  Setting user consent preferences...
✓ Consent set: {...}
...
🎉 Example completed successfully!
```

## 4. Backend Integration (1 minute)

Add to your Express `app.js`:

```javascript
const express = require('express');
const agentRoutes = require('./AI-AGENT-SYSTEM/integration/routes');

const app = express();
app.use(express.json());

// Mount agent routes
app.use('/api/agent', agentRoutes);

// Your other routes...
app.listen(3000);
```

## 5. Test Integration

```bash
# Start your backend
npm run dev

# Test the API
curl -X POST http://localhost:3000/api/agent/process \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test@example.com",
    "taskType": "test_task",
    "input": {"message": "Hello agent"},
    "taskDescription": "Test task"
  }'
```

Expected response:
```json
{
  "success": true,
  "taskId": "task_xxx",
  "result": {...},
  "confidence": 0.85,
  "learned": true
}
```

## Common Tasks

### Process a Task

```javascript
const { createAgent } = require('./AI-AGENT-SYSTEM');

const agent = await createAgent();

const result = await agent.process({
  userId: 'user@example.com',
  taskType: 'my_task_type',
  input: { data: 'your data' }
});

console.log('Result:', result);
```

### Submit Feedback

```javascript
await agent.submitFeedback(result.taskId, {
  userId: 'user@example.com',
  rating: 5,
  comment: 'Great result!'
});
```

### Get Status

```javascript
const status = await agent.getStatus('user@example.com');
console.log('Success rate:', status.performance.metrics.successRate + '%');
console.log('Health:', status.performance.health.status);
```

### Set User Consent

```javascript
agent.setUserConsent('user@example.com', {
  dataCollection: true,
  personalization: true,
  feedbackLearning: true
});
```

## Key Concepts

### Learning Pipeline

1. **Input** → User request
2. **Memory Retrieval** → Find similar past tasks
3. **Strategy Selection** → Choose best approach
4. **Execution** → Perform task
5. **Evaluation** → Assess performance
6. **Storage** → Save learnings
7. **Feedback Loop** → Improve from feedback

### Metrics to Monitor

- **Success Rate** - % of successful tasks (target: >80%)
- **Confidence** - Model certainty (target: >0.75)
- **Satisfaction** - User rating (target: >=4.0)
- **Speed** - Execution time (target: <5s)

### Privacy by Default

- Data collection disabled by default
- User consent required for learning
- GDPR-compliant data handling
- Full audit logging
- User data export/deletion support

## Next Steps

1. **Read Full Documentation**
   - `README.md` - System overview
   - `INTEGRATION_GUIDE.md` - Detailed integration
   - `API_DOCUMENTATION.md` - All endpoints

2. **Setup Environment**
   - Follow `SETUP.md` for full configuration
   - Configure API keys securely
   - Setup database (optional)

3. **Implement in Your App**
   - Follow `INTEGRATION_GUIDE.md`
   - Update backend controllers
   - Add user consent UI
   - Test all endpoints

4. **Deploy to Production**
   - Follow `IMPLEMENTATION_CHECKLIST.md`
   - Security hardening
   - Monitoring setup
   - Performance optimization

## Troubleshooting

### "Vector DB initialization failed"
```bash
# Check API key
echo $VECTOR_DB_API_KEY

# Verify Pinecone index exists
# Visit https://app.pinecone.io
```

### "OpenAI API error"
```bash
# Check API key
echo $OPENAI_API_KEY

# Verify rate limits
# Visit https://platform.openai.com/account/billing/overview
```

### "Encryption error"
```bash
# Verify key is 32-char hex
echo $ENCRYPTION_KEY | wc -c  # Should print 65 (64 chars + newline)
```

## Performance Tips

1. **Batch Operations**
   ```javascript
   // Process multiple tasks efficiently
   const results = await Promise.all(
     tasks.map(task => agent.process(task))
   );
   ```

2. **Reuse Agent Instance**
   ```javascript
   // Don't create new agent for each task
   const agent = await createAgent();
   // Reuse for multiple tasks
   ```

3. **Implement Caching**
   ```javascript
   // Cache frequently used results
   const cache = new Map();
   ```

## Security Checklist

- [ ] API keys in environment variables
- [ ] HTTPS enabled for all endpoints
- [ ] Input validation implemented
- [ ] Rate limiting enforced
- [ ] Audit logging active
- [ ] GDPR compliance verified
- [ ] User consent collected
- [ ] Data encryption enabled

## Support Resources

| Resource | Purpose |
|----------|---------|
| README.md | System overview |
| SETUP.md | Configuration guide |
| INTEGRATION_GUIDE.md | Backend integration |
| API_DOCUMENTATION.md | API reference |
| IMPLEMENTATION_CHECKLIST.md | Full implementation plan |
| EXAMPLES.js | Code examples |

## Getting Help

1. Check documentation files
2. Review GitHub issues
3. Contact support team
4. Check API provider docs

## What's Next?

Once running:

1. ✅ Monitor performance metrics
2. ✅ Collect user feedback
3. ✅ Analyze learning patterns
4. ✅ Iterate and improve
5. ✅ Scale to production

---

**Estimated total setup time: 5-15 minutes**

For detailed setup instructions, see `SETUP.md` and `INTEGRATION_GUIDE.md`.
