/**
 * Performance Evaluator
 * Assesses agent performance and identifies improvement areas
 */

class PerformanceEvaluator {
  constructor(config = {}) {
    this.metrics = {
      taskSuccess: { total: 0, successful: 0 },
      confidenceScores: [],
      executionTimes: [],
      userSatisfaction: { total: 0, sum: 0 },
      strategyWinRate: {},
      errorPatterns: {}
    };
    
    this.thresholds = {
      successRate: config.successRateThreshold || 0.8,
      avgConfidence: config.avgConfidenceThreshold || 0.75,
      userSatisfaction: config.userSatisfactionThreshold || 4.0,
      maxExecutionTime: config.maxExecutionTimeThreshold || 5000
    };
    
    this.evaluationWindow = config.evaluationWindow || 100; // Evaluate last N tasks
  }

  /**
   * Record task execution
   */
  recordExecution(taskExecution) {
    const {
      taskId,
      success = false,
      confidence = 0.5,
      executionTime = 0,
      strategy = 'default',
      error = null
    } = taskExecution;

    // Update task success metrics
    this.metrics.taskSuccess.total += 1;
    if (success) {
      this.metrics.taskSuccess.successful += 1;
    }

    // Record confidence
    this.metrics.confidenceScores.push({
      taskId,
      score: confidence,
      timestamp: new Date()
    });

    // Record execution time
    this.metrics.executionTimes.push({
      taskId,
      time: executionTime,
      timestamp: new Date()
    });

    // Track strategy performance
    if (!this.metrics.strategyWinRate[strategy]) {
      this.metrics.strategyWinRate[strategy] = { total: 0, wins: 0 };
    }
    this.metrics.strategyWinRate[strategy].total += 1;
    if (success) {
      this.metrics.strategyWinRate[strategy].wins += 1;
    }

    // Track error patterns
    if (error) {
      const errorType = error.type || 'unknown';
      if (!this.metrics.errorPatterns[errorType]) {
        this.metrics.errorPatterns[errorType] = 0;
      }
      this.metrics.errorPatterns[errorType] += 1;
    }

    return {
      recorded: true,
      taskId,
      metricsUpdated: true
    };
  }

  /**
   * Record user feedback
   */
  recordFeedback(taskId, feedback) {
    const { rating = 5, helpful = true, correctionNeeded = false } = feedback;

    this.metrics.userSatisfaction.total += 1;
    this.metrics.userSatisfaction.sum += rating;

    return {
      taskId,
      ratingRecorded: rating,
      averageSatisfaction: (this.metrics.userSatisfaction.sum / this.metrics.userSatisfaction.total).toFixed(2),
      correctionNeeded
    };
  }

  /**
   * Calculate current performance metrics
   */
  getPerformanceMetrics() {
    const totalTasks = this.metrics.taskSuccess.total;
    const successfulTasks = this.metrics.taskSuccess.successful;
    
    const successRate = totalTasks > 0 ? (successfulTasks / totalTasks) : 0;
    const avgConfidence = this.metrics.confidenceScores.length > 0
      ? this.metrics.confidenceScores.reduce((sum, item) => sum + item.score, 0) / this.metrics.confidenceScores.length
      : 0;
    
    const avgExecutionTime = this.metrics.executionTimes.length > 0
      ? this.metrics.executionTimes.reduce((sum, item) => sum + item.time, 0) / this.metrics.executionTimes.length
      : 0;

    const avgUserSatisfaction = this.metrics.userSatisfaction.total > 0
      ? parseFloat((this.metrics.userSatisfaction.sum / this.metrics.userSatisfaction.total).toFixed(2))
      : 0;

    // Calculate strategy effectiveness
    const strategyStats = {};
    for (const [strategy, stats] of Object.entries(this.metrics.strategyWinRate)) {
      strategyStats[strategy] = {
        total: stats.total,
        wins: stats.wins,
        winRate: parseFloat(((stats.wins / stats.total) * 100).toFixed(2))
      };
    }

    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalTasks,
        successfulTasks,
        successRate: parseFloat((successRate * 100).toFixed(2)),
        avgConfidence: parseFloat(avgConfidence.toFixed(3)),
        avgExecutionTime: Math.round(avgExecutionTime),
        avgUserSatisfaction
      },
      strategies: strategyStats,
      errorPatterns: this.metrics.errorPatterns,
      health: this.evaluateHealth(successRate, avgConfidence, avgUserSatisfaction)
    };
  }

  /**
   * Evaluate agent health status
   */
  evaluateHealth(successRate, avgConfidence, avgSatisfaction) {
    const issues = [];
    let healthStatus = 'EXCELLENT';

    if (successRate < this.thresholds.successRate) {
      issues.push(`Success rate ${(successRate * 100).toFixed(1)}% below target ${(this.thresholds.successRate * 100)}%`);
      healthStatus = 'DEGRADED';
    }

    if (avgConfidence < this.thresholds.avgConfidence) {
      issues.push(`Average confidence ${avgConfidence.toFixed(3)} below target ${this.thresholds.avgConfidence}`);
      healthStatus = 'DEGRADED';
    }

    if (avgSatisfaction < this.thresholds.userSatisfaction) {
      issues.push(`User satisfaction ${avgSatisfaction} below target ${this.thresholds.userSatisfaction}`);
      healthStatus = 'DEGRADED';
    }

    // Check for critical issues
    if (issues.length > 2) {
      healthStatus = 'CRITICAL';
    }

    return {
      status: healthStatus,
      issues,
      lastEvaluated: new Date().toISOString()
    };
  }

  /**
   * Get improvement recommendations
   */
  getImprovementRecommendations() {
    const metrics = this.getPerformanceMetrics();
    const recommendations = [];

    // Analyze success rate
    if (metrics.summary.successRate < 80) {
      recommendations.push({
        priority: 'HIGH',
        area: 'Task Success Rate',
        current: `${metrics.summary.successRate.toFixed(1)}%`,
        target: `${this.thresholds.successRate * 100}%`,
        action: 'Review failed task patterns and improve error handling strategies'
      });
    }

    // Analyze confidence
    if (metrics.summary.avgConfidence < this.thresholds.avgConfidence) {
      recommendations.push({
        priority: 'HIGH',
        area: 'Confidence Scores',
        current: metrics.summary.avgConfidence.toFixed(3),
        target: this.thresholds.avgConfidence,
        action: 'Improve model calibration and uncertainty estimation'
      });
    }

    // Analyze execution time
    if (metrics.summary.avgExecutionTime > this.thresholds.maxExecutionTime) {
      recommendations.push({
        priority: 'MEDIUM',
        area: 'Execution Efficiency',
        current: `${metrics.summary.avgExecutionTime}ms`,
        target: `${this.thresholds.maxExecutionTime}ms`,
        action: 'Optimize processing pipeline and reduce computational overhead'
      });
    }

    // Analyze user satisfaction
    if (metrics.summary.avgUserSatisfaction < 4.0) {
      recommendations.push({
        priority: 'HIGH',
        area: 'User Satisfaction',
        current: metrics.summary.avgUserSatisfaction,
        target: 4.0,
        action: 'Analyze user feedback and adjust output format/quality'
      });
    }

    // Find underperforming strategies
    for (const [strategy, stats] of Object.entries(metrics.strategies)) {
      if (stats.winRate < 50) {
        recommendations.push({
          priority: 'MEDIUM',
          area: `Strategy: ${strategy}`,
          current: `${stats.winRate}% win rate`,
          target: '75% win rate',
          action: `Review and improve ${strategy} strategy implementation`
        });
      }
    }

    // Identify error patterns
    if (Object.keys(metrics.errorPatterns).length > 0) {
      const topErrors = Object.entries(metrics.errorPatterns)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      recommendations.push({
        priority: 'HIGH',
        area: 'Error Patterns',
        patterns: topErrors.map(([error, count]) => `${error} (${count}x)`),
        action: 'Implement preventive measures for most common errors'
      });
    }

    return recommendations;
  }

  /**
   * Compare performance across time periods
   */
  comparePerformance(previousMetrics, currentMetrics) {
    const comparison = {};

    for (const [key, currentValue] of Object.entries(currentMetrics.summary)) {
      const previousValue = previousMetrics.summary[key];
      
      if (typeof currentValue === 'number' && typeof previousValue === 'number') {
        const change = currentValue - previousValue;
        const percentChange = previousValue !== 0 ? ((change / previousValue) * 100).toFixed(2) : 'N/A';

        comparison[key] = {
          previous: previousValue,
          current: currentValue,
          change: parseFloat(change.toFixed(2)),
          percentChange: percentChange && `${percentChange}%`
        };
      }
    }

    return {
      timestamp: new Date().toISOString(),
      comparison,
      trending: this.determineTrending(comparison)
    };
  }

  /**
   * Determine if performance is trending up or down
   */
  determineTrending(comparison) {
    const improvements = [];
    const regressions = [];

    for (const [metric, data] of Object.entries(comparison)) {
      if (data.change > 0) {
        improvements.push(metric);
      } else if (data.change < 0) {
        regressions.push(metric);
      }
    }

    return {
      improving: improvements,
      regressing: regressions,
      overallTrend: improvements.length > regressions.length ? 'POSITIVE' : 'NEGATIVE'
    };
  }

  /**
   * Reset metrics for fresh evaluation period
   */
  resetMetrics() {
    this.metrics = {
      taskSuccess: { total: 0, successful: 0 },
      confidenceScores: [],
      executionTimes: [],
      userSatisfaction: { total: 0, sum: 0 },
      strategyWinRate: {},
      errorPatterns: {}
    };

    return {
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Metrics reset for new evaluation period'
    };
  }
}

module.exports = PerformanceEvaluator;
