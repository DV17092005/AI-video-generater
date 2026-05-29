# API Documentation - AI Agent System

## Base URL
```
/api/agent
```

## Authentication
All endpoints should include authentication headers (implement based on your auth system).

---

## Endpoints

### 1. Initialize Agent
**POST** `/init`

Initialize the AI Agent system.

**Response:**
```json
{
  "success": true,
  "agent": {
    "agentId": "agent_xxx",
    "version": "1.0.0",
    "initialized": true,
    "performance": {
      "metrics": {
        "successRate": 85.5,
        "avgConfidence": 0.78
      }
    }
  }
}
```

---

### 2. Process Task
**POST** `/process`

Submit a task for processing with full learning pipeline.

**Request Body:**
```json
{
  "userId": "user@example.com",
  "taskType": "generate_script",
  "input": {
    "topic": "AI",
    "duration": 60,
    "style": "educational"
  },
  "taskDescription": "Generate a video script about AI",
  "voiceMode": false,
  "promptName": "default"
}
```

For voice assistant requests, set `voiceMode` to `true` or use `promptName: "voice_assistant"`:

```json
{
  "userId": "user@example.com",
  "taskType": "voice_assistant_conversation",
  "input": {
    "userMessage": "Hey, help me summarize this article about AI ethics",
    "context": "We are building a video generation assistant"
  },
  "taskDescription": "Respond as a real-time voice assistant",
  "voiceMode": true
}
```

**Response:**
```json
{
  "success": true,
  "taskId": "task_1234567890",
  "result": {
    "taskType": "generate_script",
    "output": "Processed with strategy: optimized",
    "metadata": {
      "processingTime": 450,
      "strategy": "optimized"
    }
  },
  "confidence": 0.85,
  "executionTime": 500,
  "learned": true,
  "strategy": "optimized",
  "insights": {
    "contextUsed": true,
    "successStrategies": 2,
    "similarPastTasks": 3
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `500` - Server error

---

### 3. Submit Feedback
**POST** `/feedback`

Submit feedback for a completed task.

**Request Body:**
```json
{
  "taskId": "task_1234567890",
  "userId": "user@example.com",
  "rating": 5,
  "comment": "Excellent output, very helpful",
  "corrections": {
    "tone": "more formal"
  },
  "tags": ["excellent", "well-structured"]
}
```

**Response:**
```json
{
  "success": true,
  "taskId": "task_1234567890",
  "feedbackRecorded": true,
  "message": "Feedback submitted and processed"
}
```

---

### 4. Get Agent Status
**GET** `/status?userId=user@example.com`

Get agent status and performance metrics.

**Query Parameters:**
- `userId` (optional) - Get user-specific metrics

**Response:**
```json
{
  "agentId": "agent_xxx",
  "version": "1.0.0",
  "initialized": true,
  "timestamp": "2024-05-29T10:30:00Z",
  "performance": {
    "metrics": {
      "totalTasks": 100,
      "successfulTasks": 85,
      "successRate": 85.0,
      "avgConfidence": 0.78,
      "avgExecutionTime": 450,
      "avgUserSatisfaction": 4.5
    },
    "health": {
      "status": "EXCELLENT",
      "issues": [],
      "lastEvaluated": "2024-05-29T10:30:00Z"
    },
    "recommendations": [...]
  },
  "learning": {
    "memory": {
      "totalMemories": 45,
      "dimension": 1536,
      "storageUtilization": 0.3
    },
    "feedback": {
      "totalFeedback": 20,
      "stats": {
        "averageRating": 4.6,
        "helpfulRate": "85.0%"
      }
    }
  }
}
```

---

### 5. Get Metrics
**GET** `/metrics`

Get detailed performance metrics and recommendations.

**Response:**
```json
{
  "metrics": {
    "timestamp": "2024-05-29T10:30:00Z",
    "summary": {
      "totalTasks": 100,
      "successfulTasks": 85,
      "successRate": 85.0,
      "avgConfidence": 0.78,
      "avgExecutionTime": 450,
      "avgUserSatisfaction": 4.5
    },
    "strategies": {
      "default": {
        "total": 50,
        "wins": 42,
        "winRate": 84.0
      },
      "optimized": {
        "total": 50,
        "wins": 43,
        "winRate": 86.0
      }
    },
    "errorPatterns": {
      "timeout": 2,
      "invalid_input": 1
    },
    "health": {
      "status": "EXCELLENT",
      "issues": [],
      "lastEvaluated": "2024-05-29T10:30:00Z"
    }
  },
  "recommendations": [
    {
      "priority": "MEDIUM",
      "area": "Execution Efficiency",
      "current": "450ms",
      "target": "5000ms",
      "action": "Optimize processing pipeline"
    }
  ]
}
```

---

### 6. Set User Consent
**POST** `/consent`

Set user consent preferences for data collection and learning.

**Request Body:**
```json
{
  "userId": "user@example.com",
  "dataCollection": true,
  "personalization": true,
  "feedbackLearning": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User consent updated",
  "consent": {
    "userId": "user@example.com",
    "consentGiven": true,
    "consentedAt": "2024-05-29T10:30:00Z",
    "categories": {
      "dataCollection": true,
      "personalization": true,
      "feedbackLearning": true
    }
  }
}
```

---

### 7. Get User Consent
**GET** `/consent/:userId`

Get user consent status.

**URL Parameters:**
- `userId` - User identifier

**Response:**
```json
{
  "userId": "user@example.com",
  "consentGiven": true,
  "consentedAt": "2024-05-29T10:30:00Z",
  "categories": {
    "dataCollection": true,
    "personalization": true,
    "feedbackLearning": true
  }
}
```

---

### 8. Export User Data (GDPR)
**POST** `/data/export/:userId`

Export all user data for GDPR compliance.

**URL Parameters:**
- `userId` - User identifier

**Response:**
```json
{
  "timestamp": "2024-05-29T10:30:00Z",
  "userId": "user@example.com",
  "exports": {
    "privacy": {
      "userId": "user@example.com",
      "consentGiven": true,
      "auditLog": [...]
    },
    "memory": {
      "userId": "user@example.com",
      "totalMemories": 45,
      "exportDate": "2024-05-29T10:30:00Z"
    },
    "feedback": {
      "taskId": "...",
      "feedbackCount": 20,
      "feedback": [...]
    }
  },
  "gdprCompliant": true
}
```

---

### 9. Delete User Data (Right to be Forgotten)
**DELETE** `/data/:userId`

Permanently delete all user data (GDPR compliance).

**URL Parameters:**
- `userId` - User identifier

**Response:**
```json
{
  "success": true,
  "timestamp": "2024-05-29T10:30:00Z",
  "userId": "user@example.com",
  "deletions": {
    "privacy": {
      "success": true,
      "userId": "user@example.com",
      "timestamp": "2024-05-29T10:30:00Z"
    },
    "memory": {
      "success": true,
      "userId": "user@example.com",
      "deletedMemories": 45
    },
    "feedback": {
      "success": true,
      "feedbackRemoved": 20
    }
  },
  "gdprCompliant": true,
  "message": "All user data has been permanently deleted"
}
```

**Status Code:** `200` (Success) or `404` (User not found)

---

### 10. Get Audit Log
**GET** `/audit?userId=user@example.com&limit=10`

Get user audit log entries.

**Query Parameters:**
- `userId` (optional) - Filter by user
- `limit` (optional) - Number of entries (default: 100)

**Response:**
```json
{
  "totalEntries": 50,
  "entries": [
    {
      "timestamp": "2024-05-29T10:30:00Z",
      "userId": "user@example.com",
      "action": "TASK_PROCESSED",
      "details": {
        "taskId": "task_xxx",
        "success": true
      }
    }
  ],
  "timestamp": "2024-05-29T10:30:00Z"
}
```

---

### 11. Get Compliance Report
**GET** `/compliance`

Get GDPR and safety compliance report.

**Response:**
```json
{
  "timestamp": "2024-05-29T10:30:00Z",
  "users": {
    "total": 100,
    "withConsent": 85,
    "consentRate": "85.00%"
  },
  "safetyEnabledFeatures": {
    "contentFilter": true,
    "sensitiveDataBlocking": true,
    "rateLimit": true,
    "requiresConsent": true
  },
  "auditLogSize": 1500,
  "dataRetentionPolicy": "90 days",
  "gdprCompliant": true
}
```

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "details": []
}
```

**Common Error Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication failed)
- `404` - Not Found (resource not found)
- `500` - Server Error

---

## Rate Limiting

- **Limit:** 60 requests per minute per user
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Security

All endpoints should:
- Use HTTPS
- Require authentication
- Validate input
- Sanitize sensitive data
- Log all access

---

## Pagination

Large result sets support pagination:

```
GET /api/agent/audit?page=2&limit=20
```

---

## Webhooks (Optional)

For real-time notifications:

```javascript
POST /api/webhooks/subscribe
{
  "event": "task_completed",
  "url": "https://your-app.com/webhook"
}
```

---

## Support

For API support or issues:
- Check `README.md` for overview
- Review `INTEGRATION_GUIDE.md` for examples
- Check `SETUP.md` for configuration
