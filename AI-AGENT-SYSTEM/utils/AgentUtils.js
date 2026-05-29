/**
 * Utility functions for AI Agent System
 */

const crypto = require('crypto');

class AgentUtils {
  /**
   * Generate unique task ID
   */
  static generateTaskId() {
    return `task_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }

  /**
   * Generate unique session ID
   */
  static generateSessionId() {
    return `session_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * Hash value for deduplication
   */
  static hashValue(value) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(value))
      .digest('hex');
  }

  /**
   * Calculate similarity between two strings (Jaccard similarity)
   */
  static calculateStringSimilarity(str1, str2) {
    const set1 = new Set(str1.toLowerCase().split(' '));
    const set2 = new Set(str2.toLowerCase().split(' '));

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  /**
   * Validate email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitize input to prevent injection
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }

    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .trim();
  }

  /**
   * Validate task input
   */
  static validateTaskInput(task) {
    const errors = [];

    if (!task.userId) {
      errors.push('userId is required');
    }

    if (!task.taskType) {
      errors.push('taskType is required');
    }

    if (!task.input) {
      errors.push('input is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate execution summary statistics
   */
  static calculateStats(numbers) {
    if (numbers.length === 0) {
      return null;
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / sorted.length;
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    const variance = sorted.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / sorted.length;
    const stdDev = Math.sqrt(variance);

    return {
      count: sorted.length,
      sum,
      mean: parseFloat(mean.toFixed(2)),
      median: parseFloat(median.toFixed(2)),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      stdDev: parseFloat(stdDev.toFixed(2))
    };
  }

  /**
   * Format timestamp
   */
  static formatTimestamp(date) {
    return new Date(date).toISOString();
  }

  /**
   * Parse query parameters
   */
  static parseQueryParams(queryString) {
    const params = {};
    const pairs = (queryString || '').split('&');

    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }

    return params;
  }

  /**
   * Merge objects deeply
   */
  static mergeObjects(obj1, obj2) {
    const result = { ...obj1 };

    for (const [key, value] of Object.entries(obj2)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = this.mergeObjects(result[key] || {}, value);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Exponential backoff retry
   */
  static async retryWithBackoff(asyncFn, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await asyncFn();
      } catch (error) {
        lastError = error;
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Truncate text to length
   */
  static truncateText(text, maxLength = 500) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Format bytes to human-readable size
   */
  static formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

module.exports = AgentUtils;
