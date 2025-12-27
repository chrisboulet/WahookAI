#!/usr/bin/env bun
/**
 * UltraCTO Bridge Tool
 *
 * Bridges WahookAI/PAI to UltraCTO-OS for Fractional CTO operations.
 * Provides CLI access to CRM, planning, and document generation.
 *
 * Usage:
 *   bun ultracto-bridge.ts <command> [args...]
 *
 * Commands:
 *   status          - Show UltraCTO-OS status and connection
 *   datetime        - Get current Quebec datetime
 *   crm <action>    - CRM operations (list, get, revenue)
 *   activate        - Activate UltraCTO mode with full context
 */

import { $ } from "bun";
import { existsSync } from "fs";
import { resolve } from "path";

// Configuration
const ULTRACTO_DIR = resolve(process.env.HOME || "~", "UltraCTO-OS");
const SCRIPTS_DIR = resolve(ULTRACTO_DIR, "scripts");

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message: string, color: string = colors.reset): void {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title: string): void {
  console.log(`\n${colors.bold}${colors.blue}═══ ${title} ═══${colors.reset}\n`);
}

// Check if UltraCTO-OS is available
function checkUltraCTOAvailable(): boolean {
  if (!existsSync(ULTRACTO_DIR)) {
    log(`UltraCTO-OS not found at ${ULTRACTO_DIR}`, colors.red);
    return false;
  }
  return true;
}

// Get current Quebec datetime
async function getDateTime(): Promise<string> {
  try {
    const result = await $`python ${SCRIPTS_DIR}/datetime_utils.py summary`.text();
    return result.trim();
  } catch (error) {
    // Fallback to system date with Quebec timezone
    const now = new Date().toLocaleString("fr-CA", {
      timeZone: "America/Toronto",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return now;
  }
}

// CRM operations
async function crmCommand(action: string, args: string[]): Promise<void> {
  const script = resolve(SCRIPTS_DIR, "prospect_supabase.py");

  if (!existsSync(script)) {
    log(`CRM script not found: ${script}`, colors.red);
    return;
  }

  switch (action) {
    case "list":
      const list = await $`python ${script} list`.text();
      console.log(list);
      break;

    case "get":
      if (args.length < 1) {
        log("Usage: crm get <company>", colors.yellow);
        return;
      }
      const company = args[0];
      const details = await $`python ${script} get ${company}`.text();
      console.log(details);
      break;

    case "revenue":
      const revenue = await $`python ${script} revenue`.text();
      console.log(revenue);
      break;

    case "clients":
      const clients = await $`python ${script} clients`.text();
      console.log(clients);
      break;

    default:
      log(`Unknown CRM action: ${action}`, colors.red);
      log("Available: list, get, revenue, clients", colors.yellow);
  }
}

// Show status
async function showStatus(): Promise<void> {
  logSection("UltraCTO-OS Status");

  // Check directory
  if (existsSync(ULTRACTO_DIR)) {
    log(`✓ UltraCTO-OS directory: ${ULTRACTO_DIR}`, colors.green);
  } else {
    log(`✗ UltraCTO-OS not found at ${ULTRACTO_DIR}`, colors.red);
    return;
  }

  // Check scripts
  const scripts = [
    "datetime_utils.py",
    "prospect_supabase.py",
    "budget_calc.py",
    "upload_to_drive.py",
  ];

  console.log("\nScripts:");
  for (const script of scripts) {
    const path = resolve(SCRIPTS_DIR, script);
    if (existsSync(path)) {
      log(`  ✓ ${script}`, colors.green);
    } else {
      log(`  ✗ ${script}`, colors.red);
    }
  }

  // Check env
  const envFile = resolve(ULTRACTO_DIR, ".env.local");
  console.log("\nConfiguration:");
  if (existsSync(envFile)) {
    log("  ✓ .env.local exists", colors.green);
  } else {
    log("  ✗ .env.local missing", colors.yellow);
  }

  // Get datetime
  console.log("\nDateTime:");
  const datetime = await getDateTime();
  log(`  ${datetime}`, colors.cyan);
}

// Activate UltraCTO mode
async function activate(): Promise<void> {
  logSection("Activating UltraCTO Mode");

  if (!checkUltraCTOAvailable()) {
    return;
  }

  // Get datetime
  const datetime = await getDateTime();
  log(`📅 ${datetime}`, colors.cyan);

  // Get CRM summary
  console.log("\n📊 CRM Status:");
  try {
    const revenue = await $`python ${SCRIPTS_DIR}/prospect_supabase.py revenue`.text();
    console.log(revenue);
  } catch (error) {
    log("  Could not fetch CRM data", colors.yellow);
  }

  log("\n🎯 Mode UltraCTO activé!", colors.green);
  log("\nCommandes disponibles:", colors.bold);
  console.log("  /plan day       - Routine matin");
  console.log("  /crm pipeline   - Vue CRM");
  console.log("  /generate       - Documents clients");
  console.log("  /strategy check - Analyse 4L");
}

// Main CLI
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] || "help";
  const subArgs = args.slice(1);

  switch (command) {
    case "status":
      await showStatus();
      break;

    case "datetime":
      const dt = await getDateTime();
      console.log(dt);
      break;

    case "crm":
      if (!checkUltraCTOAvailable()) break;
      await crmCommand(subArgs[0] || "list", subArgs.slice(1));
      break;

    case "activate":
      await activate();
      break;

    case "help":
    default:
      console.log(`
${colors.bold}UltraCTO Bridge${colors.reset}
Bridges WahookAI/PAI to UltraCTO-OS

${colors.bold}Usage:${colors.reset}
  bun ultracto-bridge.ts <command> [args...]

${colors.bold}Commands:${colors.reset}
  status              Show UltraCTO-OS status
  datetime            Get current Quebec datetime
  crm <action>        CRM operations
    list              List all prospects
    get <company>     Get prospect details
    revenue           Revenue dashboard
    clients           List active clients
  activate            Activate UltraCTO mode
  help                Show this help

${colors.bold}Examples:${colors.reset}
  bun ultracto-bridge.ts status
  bun ultracto-bridge.ts crm revenue
  bun ultracto-bridge.ts activate
`);
  }
}

main().catch(console.error);
