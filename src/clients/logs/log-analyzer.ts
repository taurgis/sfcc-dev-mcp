/**
 * Log analysis, summarization, and pattern detection
 */

import { Logger } from '../../utils/logger.js';
import { LogProcessor } from './log-processor.js';
import { LogFormatter } from './log-formatter.js';
import type { LogSummary, LogFileMetadata, ProcessedLogEntry } from './log-types.js';

export class LogAnalyzer {
  private logger: Logger;
  private processor: LogProcessor;

  constructor(logger: Logger) {
    this.logger = logger;
    this.processor = new LogProcessor(logger);
  }

  /**
   * Analyze log files and generate comprehensive summary
   */
  async analyzeLogs(
    files: LogFileMetadata[],
    fileContents: Map<string, string>,
    date: string,
  ): Promise<LogSummary> {
    const summary: LogSummary = {
      date,
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
      debugCount: 0,
      keyIssues: [],
      files: files.map((f: LogFileMetadata) => f.filename),
    };

    // Analyze each log file for counts and patterns
    for (const file of files) {
      const content = fileContents.get(file.filename);
      if (!content) {
        this.logger.warn(`No content found for analysis: ${file.filename}`);
        continue;
      }

      try {
        // Count different log levels
        const counts = this.processor.countLogLevels(content);
        summary.errorCount += counts.errorCount;
        summary.warningCount += counts.warningCount;
        summary.infoCount += counts.infoCount;
        summary.debugCount += counts.debugCount;

        // Extract key issues from error files
        if (this.isErrorFile(file.filename)) {
          const issues = this.processor.extractKeyIssues(content);
          summary.keyIssues.push(...issues);
        }
      } catch (error) {
        this.logger.error(`Error analyzing file ${file.filename}:`, error);
      }
    }

    // Remove duplicate key issues
    summary.keyIssues = [...new Set(summary.keyIssues)];

    return summary;
  }

  /**
   * Detect patterns and anomalies in logs
   */
  detectPatterns(entries: ProcessedLogEntry[]): {
    frequentErrors: Map<string, number>;
    timePatterns: Map<string, number>;
    sourcePatterns: Map<string, number>;
  } {
    const frequentErrors = new Map<string, number>();
    const timePatterns = new Map<string, number>();
    const sourcePatterns = new Map<string, number>();

    for (const entry of entries) {
      // Count error patterns
      if (entry.level === 'error') {
        const errorPattern = this.extractErrorPattern(entry.content);
        frequentErrors.set(errorPattern, (frequentErrors.get(errorPattern) ?? 0) + 1);
      }

      // Count time patterns (hour-based)
      if (entry.timestamp) {
        const hour = new Date(entry.timestamp).getHours();
        const hourKey = `${hour}:00-${hour + 1}:00`;
        timePatterns.set(hourKey, (timePatterns.get(hourKey) ?? 0) + 1);
      }

      // Count source patterns
      if (entry.source) {
        sourcePatterns.set(entry.source, (sourcePatterns.get(entry.source) ?? 0) + 1);
      }
    }

    return {
      frequentErrors,
      timePatterns,
      sourcePatterns,
    };
  }

  /**
   * Generate health score based on log analysis
   */
  calculateHealthScore(summary: LogSummary): {
    score: number;
    level: 'excellent' | 'good' | 'warning' | 'critical';
    factors: string[];
  } {
    const factors: string[] = [];
    let score = 100;

    // Deduct points for errors
    if (summary.errorCount > 0) {
      const errorPenalty = Math.min(summary.errorCount * 2, 30);
      score -= errorPenalty;
      factors.push(`Errors detected: -${errorPenalty} points`);
    }

    // Deduct points for warnings
    if (summary.warningCount > 10) {
      const warningPenalty = Math.min((summary.warningCount - 10) * 0.5, 15);
      score -= warningPenalty;
      factors.push(`High warning count: -${warningPenalty} points`);
    }

    // Deduct points for key issues
    if (summary.keyIssues.length > 0) {
      const issuePenalty = Math.min(summary.keyIssues.length * 5, 25);
      score -= issuePenalty;
      factors.push(`Key issues: -${issuePenalty} points`);
    }

    // Determine level
    let level: 'excellent' | 'good' | 'warning' | 'critical';
    if (score >= 90) {
      level = 'excellent';
    } else if (score >= 75) {
      level = 'good';
    } else if (score >= 50) {
      level = 'warning';
    } else {
      level = 'critical';
    }

    return { score: Math.max(0, score), level, factors };
  }

  /**
   * Find trending issues across time periods
   */
  findTrendingIssues(
    currentSummary: LogSummary,
    previousSummaries: LogSummary[],
  ): {
    increasing: string[];
    decreasing: string[];
    new: string[];
  } {
    const trending = {
      increasing: [] as string[],
      decreasing: [] as string[],
      new: [] as string[],
    };

    // Compare current issues with previous periods
    const previousIssues = new Set(
      previousSummaries.flatMap(summary => summary.keyIssues),
    );

    for (const issue of currentSummary.keyIssues) {
      if (!previousIssues.has(issue)) {
        trending.new.push(issue);
      }
    }

    // For increasing/decreasing, we'd need more sophisticated tracking
    // This is a simplified version
    const currentErrorCount = currentSummary.errorCount;
    const avgPreviousErrors = previousSummaries.length > 0
      ? previousSummaries.reduce((sum, s) => sum + s.errorCount, 0) / previousSummaries.length
      : 0;

    if (currentErrorCount > avgPreviousErrors * 1.5) {
      trending.increasing.push('Overall error rate');
    } else if (currentErrorCount < avgPreviousErrors * 0.5) {
      trending.decreasing.push('Overall error rate');
    }

    return trending;
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(summary: LogSummary, patterns: ReturnType<typeof this.detectPatterns>): string[] {
    const recommendations: string[] = [];

    if (summary.errorCount > 10) {
      recommendations.push('High error count detected. Review error logs for critical issues.');
    }

    if (summary.warningCount > 50) {
      recommendations.push('High warning count. Consider addressing warnings to prevent future errors.');
    }

    if (patterns.frequentErrors.size > 0) {
      const topError = Array.from(patterns.frequentErrors.entries())
        .sort((a, b) => b[1] - a[1])[0];
      recommendations.push(`Most frequent error: "${topError[0]}" (${topError[1]} occurrences)`);
    }

    if (patterns.timePatterns.size > 0) {
      const peakHour = Array.from(patterns.timePatterns.entries())
        .sort((a, b) => b[1] - a[1])[0];
      recommendations.push(`Peak activity time: ${peakHour[0]} (${peakHour[1]} events)`);
    }

    if (summary.keyIssues.length === 0 && summary.errorCount === 0) {
      recommendations.push('System appears to be running smoothly with no critical issues detected.');
    }

    return recommendations;
  }

  /**
   * Extract error pattern for categorization
   */
  private extractErrorPattern(errorContent: string): string {
    // Extract the core error message, removing dynamic parts
    const patterns = [
      /Exception: (.+?)(\s+at\s|$)/,
      /Error: (.+?)(\s+at\s|$)/,
      /Failed to (.+?)(\s+\(|$)/,
      /Cannot (.+?)(\s+\(|$)/,
    ];

    for (const pattern of patterns) {
      const match = errorContent.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    // Fallback: use first 50 characters
    return LogFormatter.truncateText(errorContent, 50);
  }

  /**
   * Check if filename indicates an error log file
   */
  private isErrorFile(filename: string): boolean {
    const normalizedName = filename.toLowerCase();
    return normalizedName.includes('error-') || normalizedName.includes('customerror-');
  }

  /**
   * Format analysis results for display
   */
  formatAnalysisResults(
    summary: LogSummary,
    patterns: ReturnType<typeof this.detectPatterns>,
    healthScore: ReturnType<typeof this.calculateHealthScore>,
    recommendations: string[],
  ): string {
    const sections = [
      LogFormatter.formatLogSummary(summary),
      '',
      `🏥 Health Score: ${healthScore.score}/100 (${healthScore.level})`,
      healthScore.factors.length > 0 ? `Factors: ${healthScore.factors.join(', ')}` : '',
      '',
      '🔍 Pattern Analysis:',
      `- Unique error patterns: ${patterns.frequentErrors.size}`,
      `- Active time periods: ${patterns.timePatterns.size}`,
      `- Different sources: ${patterns.sourcePatterns.size}`,
      '',
      '💡 Recommendations:',
      ...recommendations.map(rec => `- ${rec}`),
    ].filter(Boolean);

    return sections.join('\n');
  }
}
