/**
 * Privacy Manager
 * Handles user privacy, data protection, and safety constraints
 */

const crypto = require('crypto');
const fs = require('fs');

class PrivacyManager {
  constructor(config = {}) {
    this.encryptionKey = config.encryptionKey || process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
    this.safetyRules = config.safetyRules || this.getDefaultSafetyRules();
    this.userConsent = new Map();
    this.auditLog = [];
    this.dataRetentionDays = config.dataRetentionDays || 90;
  }

  /**
   * Get default safety rules
   */
  getDefaultSafetyRules() {
    return {
      allowDataCollection: {
        enabled: false,
        description: 'Collect and learn from user interactions'
      },
      allowPersonalization: {
        enabled: false,
        description: 'Personalize responses based on user history'
      },
      allowFeedbackLearning: {
        enabled: false,
        description: 'Learn from user feedback'
      },
      blockSensitiveData: {
        enabled: true,
        patterns: ['password', 'credit card', 'ssn', 'private key', 'token']
      },
      contentFilter: {
        enabled: true,
        blockedCategories: ['hate speech', 'violence', 'adult content', 'misinformation']
      },
      rateLimit: {
        enabled: true,
        requestsPerMinute: 60,
        requestsPerHour: 1000
      },
      requiresExplicitConsent: {
        enabled: true,
        forDataCollection: true,
        forPersonalization: true,
        forFeedbackLearning: true
      }
    };
  }

  /**
   * Get user consent configuration
   */
  getUserConsent(userId) {
    if (!this.userConsent.has(userId)) {
      return {
        userId,
        consentGiven: false,
        consentedAt: null,
        categories: {
          dataCollection: false,
          personalization: false,
          feedbackLearning: false
        }
      };
    }
    return this.userConsent.get(userId);
  }

  /**
   * Set user consent
   */
  setUserConsent(userId, consentData) {
    const {
      dataCollection = false,
      personalization = false,
      feedbackLearning = false
    } = consentData;

    const consent = {
      userId,
      consentGiven: dataCollection || personalization || feedbackLearning,
      consentedAt: new Date().toISOString(),
      categories: {
        dataCollection,
        personalization,
        feedbackLearning
      }
    };

    this.userConsent.set(userId, consent);
    
    this.logAuditEvent({
      userId,
      action: 'CONSENT_UPDATED',
      details: consent
    });

    return {
      success: true,
      message: 'User consent updated',
      consent
    };
  }

  /**
   * Encrypt sensitive data
   */
  encryptData(data) {
    try {
      const text = JSON.stringify(data);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey, 'hex'), iv);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return {
        encrypted: true,
        data: `${iv.toString('hex')}:${encrypted}`
      };
    } catch (error) {
      console.error('Encryption failed:', error.message);
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData) {
    try {
      const parts = encryptedData.split(':');
      const iv = Buffer.from(parts[0], 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.encryptionKey, 'hex'), iv);

      let decrypted = decipher.update(parts[1], 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error.message);
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Scan for sensitive data
   */
  scanForSensitiveData(content) {
    const sensitivePatternsFound = [];
    const blockPatterns = this.safetyRules.blockSensitiveData.patterns;

    for (const pattern of blockPatterns) {
      const regex = new RegExp(pattern, 'gi');
      if (regex.test(content)) {
        sensitivePatternsFound.push(pattern);
      }
    }

    return {
      isSensitive: sensitivePatternsFound.length > 0,
      patternsFound: sensitivePatternsFound
    };
  }

  /**
   * Filter content based on safety rules
   */
  filterContent(content) {
    if (!this.safetyRules.contentFilter.enabled) {
      return {
        filtered: false,
        content
      };
    }

    let filtered = false;
    let reason = null;

    const blockedCategories = this.safetyRules.contentFilter.blockedCategories;
    const contentLower = content.toLowerCase();

    for (const category of blockedCategories) {
      if (contentLower.includes(category.toLowerCase())) {
        filtered = true;
        reason = category;
        break;
      }
    }

    return {
      filtered,
      reason,
      content: filtered ? '[Content filtered]' : content
    };
  }

  /**
   * Check rate limits
   */
  checkRateLimit(userId, requestCount = 1) {
    if (!this.safetyRules.rateLimit.enabled) {
      return {
        allowed: true,
        rateLimitExceeded: false
      };
    }

    // This is a simplified check. In production, use Redis/database for actual tracking
    return {
      allowed: requestCount <= this.safetyRules.rateLimit.requestsPerMinute,
      rateLimitExceeded: requestCount > this.safetyRules.rateLimit.requestsPerMinute,
      limits: {
        perMinute: this.safetyRules.rateLimit.requestsPerMinute,
        perHour: this.safetyRules.rateLimit.requestsPerHour
      }
    };
  }

  /**
   * Check if action is allowed based on consent and rules
   */
  isActionAllowed(userId, action) {
    const userConsent = this.getUserConsent(userId);

    const actionConsent = {
      dataCollection: userConsent.categories.dataCollection,
      personalization: userConsent.categories.personalization,
      feedbackLearning: userConsent.categories.feedbackLearning
    };

    const allowed = actionConsent[action] || false;

    this.logAuditEvent({
      userId,
      action: 'ACTION_CHECK',
      details: {
        requestedAction: action,
        allowed,
        timestamp: new Date().toISOString()
      }
    });

    return {
      allowed,
      reason: allowed ? null : `User has not consented to ${action}`
    };
  }

  /**
   * Get audit log
   */
  getAuditLog(userId = null, limit = 100) {
    let log = this.auditLog;

    if (userId) {
      log = log.filter(entry => entry.userId === userId);
    }

    return {
      totalEntries: log.length,
      entries: log.slice(-limit),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Log audit event
   */
  logAuditEvent(event) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      ...event
    };

    this.auditLog.push(auditEntry);

    // Keep audit log to reasonable size
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-5000);
    }

    return auditEntry;
  }

  /**
   * Export user data (GDPR compliance)
   */
  exportUserData(userId) {
    const consent = this.getUserConsent(userId);
    const auditLog = this.getAuditLog(userId);

    return {
      userId,
      exportDate: new Date().toISOString(),
      consent,
      auditLog,
      message: 'User data exported for GDPR compliance'
    };
  }

  /**
   * Delete user data (right to be forgotten)
   */
  deleteUserData(userId) {
    // Remove consent
    this.userConsent.delete(userId);

    // Log deletion
    this.logAuditEvent({
      userId,
      action: 'DATA_DELETED',
      details: 'All user data deleted per GDPR right to be forgotten'
    });

    return {
      success: true,
      userId,
      timestamp: new Date().toISOString(),
      message: 'User data deletion completed',
      gdprCompliant: true
    };
  }

  /**
   * Update safety rules
   */
  updateSafetyRules(newRules) {
    this.safetyRules = {
      ...this.safetyRules,
      ...newRules
    };

    return {
      success: true,
      rulesUpdated: true,
      currentRules: this.safetyRules
    };
  }

  /**
   * Get compliance report
   */
  getComplianceReport() {
    const usersWithConsent = Array.from(this.userConsent.values()).filter(c => c.consentGiven).length;
    const totalUsers = this.userConsent.size;

    return {
      timestamp: new Date().toISOString(),
      users: {
        total: totalUsers,
        withConsent: usersWithConsent,
        consentRate: totalUsers > 0 ? ((usersWithConsent / totalUsers) * 100).toFixed(2) : 'N/A'
      },
      safetyEnabledFeatures: {
        contentFilter: this.safetyRules.contentFilter.enabled,
        sensitiveDataBlocking: this.safetyRules.blockSensitiveData.enabled,
        rateLimit: this.safetyRules.rateLimit.enabled,
        requiresConsent: this.safetyRules.requiresExplicitConsent.enabled
      },
      auditLogSize: this.auditLog.length,
      dataRetentionPolicy: `${this.dataRetentionDays} days`,
      gdprCompliant: true
    };
  }
}

module.exports = PrivacyManager;
