#!/usr/bin/env bun

/**
 * Learning Capture Hook
 *
 * Runs on Stop event to detect and save learnings from conversations.
 * Analyzes transcript for learning indicators and saves to history/learnings/
 *
 * Learning indicators:
 * - CAPTURE: field in response format
 * - Keywords: "learned", "mistake", "should always", "never again", "lesson"
 * - Error corrections acknowledged by user
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// PAI paths - use lowercase 'history' as that's the actual directory
const PAI_DIR = process.env.PAI_DIR || join(homedir(), '.claude');
const HISTORY_DIR = join(PAI_DIR, 'history'); // lowercase!

interface LearningIndicator {
  type: 'capture_field' | 'keyword' | 'error_correction' | 'explicit_lesson';
  content: string;
  context: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Detect learning indicators in text
 */
function detectLearningIndicators(text: string): LearningIndicator[] {
  const indicators: LearningIndicator[] = [];

  // 1. CAPTURE field from response format (HIGH confidence)
  const captureMatch = text.match(/CAPTURE:\s*(.+?)(?:\n[A-Z]+:|$)/s);
  if (captureMatch && captureMatch[1].trim().length > 10) {
    const captureContent = captureMatch[1].trim();
    // Skip generic captures like "N/A" or "None"
    if (!captureContent.match(/^(n\/a|none|nothing|na)$/i)) {
      indicators.push({
        type: 'capture_field',
        content: captureContent,
        context: 'Response format CAPTURE field',
        confidence: 'high'
      });
    }
  }

  // 2. Explicit lesson keywords (HIGH confidence)
  const lessonPatterns = [
    /(?:lesson|learning|takeaway):\s*(.+?)(?:\n|$)/gi,
    /(?:important|critical|key)\s+(?:lesson|learning|insight):\s*(.+?)(?:\n|$)/gi,
    /(?:we|I)\s+(?:learned|discovered)\s+(?:that\s+)?(.+?)(?:\.|$)/gi,
  ];

  for (const pattern of lessonPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].trim().length > 15) {
        indicators.push({
          type: 'explicit_lesson',
          content: match[1].trim(),
          context: match[0].substring(0, 50),
          confidence: 'high'
        });
      }
    }
  }

  // 3. Error correction patterns (MEDIUM confidence)
  const errorPatterns = [
    /(?:erreur|error|mistake|bug).*(?:corrig|fix|correct)/gi,
    /(?:should|must)\s+(?:always|never)\s+(.+?)(?:\.|$)/gi,
    /(?:ne\s+jamais|toujours)\s+(.+?)(?:\.|$)/gi, // French
    /(?:mea culpa|my bad|I was wrong)/gi,
  ];

  for (const pattern of errorPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const content = match[1] || match[0];
      if (content && content.trim().length > 10) {
        indicators.push({
          type: 'error_correction',
          content: content.trim(),
          context: match[0].substring(0, 80),
          confidence: 'medium'
        });
      }
    }
  }

  // 4. Profile/config verification patterns (HIGH confidence for this specific case)
  const configPatterns = [
    /(?:vérifier|check|verify)\s+(?:le\s+)?(?:profile\.json|config|settings)/gi,
    /(?:inventé|fabricated|made up|invented)\s+(?:le\s+)?(?:nom|name|prénom)/gi,
  ];

  for (const pattern of configPatterns) {
    const match = text.match(pattern);
    if (match) {
      indicators.push({
        type: 'explicit_lesson',
        content: `Toujours vérifier les fichiers de configuration avant d'utiliser des informations personnelles`,
        context: match[0],
        confidence: 'high'
      });
    }
  }

  return indicators;
}

/**
 * Extract text content from Claude message content
 */
function contentToText(content: any): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((c) => {
        if (typeof c === 'string') return c;
        if (c?.text) return c.text;
        if (c?.content) return String(c.content);
        return '';
      })
      .join(' ')
      .trim();
  }
  return '';
}

/**
 * Generate a slug from text for filename
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
    .replace(/-$/, '');
}

/**
 * Format learning document
 */
function formatLearningDocument(indicators: LearningIndicator[], sessionContext: string): string {
  const now = new Date();
  const date = now.toISOString().split('T')[0];

  // Group by type
  const highConfidence = indicators.filter(i => i.confidence === 'high');
  const mediumConfidence = indicators.filter(i => i.confidence === 'medium');

  // Generate tags
  const tags = new Set<string>();
  for (const indicator of indicators) {
    if (indicator.content.toLowerCase().includes('profile')) tags.add('profile');
    if (indicator.content.toLowerCase().includes('config')) tags.add('configuration');
    if (indicator.content.toLowerCase().includes('verif') || indicator.content.toLowerCase().includes('check')) tags.add('verification');
    if (indicator.type === 'error_correction') tags.add('error-correction');
  }

  // Build document
  let doc = `---
date: ${date}
capture_type: LEARNING
category: auto-captured
severity: ${highConfidence.length > 0 ? 'high' : 'medium'}
tags: [${Array.from(tags).join(', ')}]
session_context: ${sessionContext}
auto_captured: true
---

# Apprentissage Automatique - ${date}

`;

  if (highConfidence.length > 0) {
    doc += `## Points Clés (Haute Confiance)\n\n`;
    for (const indicator of highConfidence) {
      doc += `### ${indicator.type === 'capture_field' ? 'CAPTURE' : indicator.type === 'explicit_lesson' ? 'Leçon' : 'Correction'}\n\n`;
      doc += `${indicator.content}\n\n`;
      if (indicator.context && indicator.context !== indicator.content) {
        doc += `> Contexte: ${indicator.context}\n\n`;
      }
    }
  }

  if (mediumConfidence.length > 0) {
    doc += `## Points Secondaires (Confiance Moyenne)\n\n`;
    for (const indicator of mediumConfidence) {
      doc += `- ${indicator.content}\n`;
    }
    doc += '\n';
  }

  doc += `---\n\n*Capturé automatiquement par capture-learning.ts*\n`;

  return doc;
}

async function main() {
  const timestamp = new Date().toISOString();
  console.error(`\n📚 CAPTURE-LEARNING HOOK TRIGGERED AT ${timestamp}`);

  // Get input
  let input = '';
  const decoder = new TextDecoder();
  const reader = Bun.stdin.stream().getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      input += decoder.decode(value, { stream: true });
    }
  } catch (e) {
    console.error(`❌ Error reading input: ${e}`);
    process.exit(0);
  }

  if (!input) {
    console.error('❌ No input received');
    process.exit(0);
  }

  let transcriptPath: string;
  try {
    const parsed = JSON.parse(input);
    transcriptPath = parsed.transcript_path;
    console.error(`📁 Transcript path: ${transcriptPath}`);
  } catch (e) {
    console.error(`❌ Error parsing input JSON: ${e}`);
    process.exit(0);
  }

  if (!transcriptPath) {
    console.error('❌ No transcript_path in input');
    process.exit(0);
  }

  // Read the transcript
  let transcript: string;
  try {
    transcript = readFileSync(transcriptPath, 'utf-8');
    console.error(`📜 Transcript loaded: ${transcript.split('\n').length} lines`);
  } catch (e) {
    console.error(`❌ Error reading transcript: ${e}`);
    process.exit(0);
  }

  // Parse transcript and collect all assistant responses
  const lines = transcript.trim().split('\n');
  let allAssistantText = '';
  let lastUserQuery = '';

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);

      if (entry.type === 'user' && entry.message?.content) {
        const text = contentToText(entry.message.content);
        if (text && !text.startsWith('[Tool:')) {
          lastUserQuery = text.substring(0, 100);
        }
      }

      if (entry.type === 'assistant' && entry.message?.content) {
        allAssistantText += contentToText(entry.message.content) + '\n\n';
      }
    } catch (e) {
      // Skip invalid JSON lines
    }
  }

  // Detect learning indicators
  const indicators = detectLearningIndicators(allAssistantText);

  console.error(`🔍 Found ${indicators.length} learning indicators`);

  // Only save if we have high confidence indicators
  const highConfidenceCount = indicators.filter(i => i.confidence === 'high').length;

  if (highConfidenceCount === 0) {
    console.error('📭 No high-confidence learnings detected, skipping save');
    process.exit(0);
  }

  console.error(`✅ ${highConfidenceCount} high-confidence learnings found`);

  // Generate filename
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const yearMonth = dateStr.substring(0, 7);

  // Create slug from first indicator
  const slug = generateSlug(indicators[0].content.substring(0, 40)) || 'learning';
  const filename = `${dateStr}_${slug}.md`;

  // Ensure directory exists
  const learningsDir = join(HISTORY_DIR, 'learnings', yearMonth);
  if (!existsSync(learningsDir)) {
    mkdirSync(learningsDir, { recursive: true });
    console.error(`📁 Created directory: ${learningsDir}`);
  }

  // Check if similar learning already exists today
  const targetPath = join(learningsDir, filename);
  if (existsSync(targetPath)) {
    console.error(`⚠️ Learning file already exists: ${filename}, skipping duplicate`);
    process.exit(0);
  }

  // Format and save
  const document = formatLearningDocument(indicators, lastUserQuery);
  writeFileSync(targetPath, document);

  console.error(`💾 Learning saved: ${targetPath}`);
  console.error(`📚 CAPTURE-LEARNING HOOK COMPLETED\n`);
}

main().catch((e) => {
  console.error(`❌ Hook error: ${e}`);
  process.exit(0);
});
