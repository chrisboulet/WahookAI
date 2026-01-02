# Audiobook Server Infrastructure - Product Requirements Document (PRD)

**Project:** Self-Hosted Audiobook Server with AI Agent Integration
**Platform:** Arch Linux
**Date:** 2025-12-27
**Architect:** Atlas (PAI Digital Assistant)

---

## Executive Summary

### Project Overview
Design and implement a comprehensive self-hosted audiobook server infrastructure using Docker Compose. The system will manage Audible audiobook downloads, DRM removal, streaming, and provide both family access (iOS/Android apps with external internet access) and AI agent access (REST API + direct file access via MCP server).

### Success Metrics
- **Uptime:** 99.5% availability for streaming services
- **Conversion Speed:** Automated AAX to MP3 conversion within 10 minutes of new audiobook detection
- **External Access:** Sub-2 second response time for HTTPS external connections
- **AI Integration:** MCP server responding to metadata queries within 500ms
- **User Experience:** Zero-configuration mobile app access for children

### Technical Stack

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Audiobook Server** | Audiobookshelf | Best-in-class open-source audiobook server with native mobile apps, multi-user support, and REST API |
| **Audible Manager** | Libation (Docker headless) | Official Docker support, automated scanning/downloading, DRM removal capabilities |
| **DRM Conversion** | AAXtoMP3 + audible-cli | Industry standard, integrated with Libation, preserves metadata and chapter markers |
| **Reverse Proxy** | Caddy v2 | Automatic HTTPS with Let's Encrypt, simplest configuration, WebSocket support built-in, ideal for home lab 2025 |
| **Container Orchestration** | Docker Compose v2 | Declarative infrastructure, easy rollback, integrated with Docker Desktop/CLI |
| **MCP Server** | FastAPI + FastAPI-MCP | Native FastAPI integration, auto-generates MCP tools from OpenAPI spec, ASGI transport |
| **Storage** | External USB/Thunderbolt | Dedicated storage for large audiobook library (100GB-1TB+ expected) |

### Timeline Estimate
- **Phase 1 - Infrastructure Setup:** 4-6 hours (Docker install, directory structure, external disk mounting)
- **Phase 2 - Core Services:** 6-8 hours (Audiobookshelf, Libation, conversion pipeline)
- **Phase 3 - External Access:** 2-4 hours (Caddy reverse proxy, DNS, Let's Encrypt)
- **Phase 4 - MCP Server:** 4-6 hours (FastAPI development, Claude Desktop integration)
- **Phase 5 - Testing & Optimization:** 4-6 hours (Multi-user testing, mobile app validation, performance tuning)
- **Total:** 20-30 hours

### Resource Requirements
- **Expertise Needed:**
  - Linux system administration (Arch Linux)
  - Docker/container orchestration
  - Network configuration (reverse proxy, DNS, SSL)
  - Python development (FastAPI for MCP server)
  - API integration (Audiobookshelf REST API)

---

## System Architecture

### High-Level Architecture

```
                                    INTERNET
                                       |
                                       | (Ports 80/443)
                                       v
                        ┌──────────────────────────┐
                        │   Caddy Reverse Proxy    │
                        │  (Auto HTTPS/Let's Encrypt)│
                        └──────────────────────────┘
                                       |
                      ┌────────────────┼────────────────┐
                      |                |                |
                      v                v                v
          ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐
          │ Audiobookshelf  │  │  MCP Server  │  │   Libation   │
          │   (Port 13378)  │  │ (Port 8000)  │  │  (Headless)  │
          └─────────────────┘  └──────────────┘  └──────────────┘
                  |                    |                |
                  v                    v                v
          ┌───────────────────────────────────────────────────┐
          │         External USB/Thunderbolt Disk             │
          │   /mnt/audiobooks/                                │
          │   ├── library/          (Audiobookshelf library)  │
          │   ├── inbox/            (Libation output)         │
          │   ├── raw/              (Original AAX files)      │
          │   ├── config/           (App configurations)      │
          │   └── metadata/         (Cover art, NFO files)    │
          └───────────────────────────────────────────────────┘
                                       ^
                                       |
                            ┌──────────────────────┐
                            │   AAXtoMP3 Worker    │
                            │  (Conversion daemon) │
                            └──────────────────────┘

ACCESS METHODS:
┌──────────────────────────┐  ┌──────────────────────────┐
│  Mobile Apps (Children)  │  │  Claude AI Agents (MCP)  │
│  - iOS Audiobookshelf    │  │  - Metadata queries      │
│  - Android Audiobookshelf│  │  - File access           │
│  - External HTTPS        │  │  - Library management    │
└──────────────────────────┘  └──────────────────────────┘
```

### Network Architecture

```
Docker Network: audiobook-net (bridge)
├── caddy (proxy gateway)
│   └── Ports: 80:80, 443:443 (host-exposed)
│
├── audiobookshelf
│   └── Internal: 80 (reverse proxied via Caddy)
│   └── External: https://audiobooks.yourdomain.com
│
├── libation
│   └── Internal only (no external exposure)
│   └── Scheduled scanning: Every 30 minutes
│
└── mcp-server (audiobook-mcp)
    └── Internal: 8000 (reverse proxied via Caddy)
    └── External: https://audiobooks-api.yourdomain.com/mcp
    └── Claude Desktop: ASGI stdio transport
```

### Data Flow Diagram

```
ACQUISITION FLOW:
Audible Account → Libation (scan) → Download AAX → Save to /raw/
                                                        ↓
                                            AAXtoMP3 (watch /raw/)
                                                        ↓
                                            Convert AAX → MP3/M4B
                                                        ↓
                                            Output to /inbox/
                                                        ↓
                                    Audiobookshelf (scan /inbox/)
                                                        ↓
                                            Import to /library/
                                                        ↓
                                    ┌───────────────────┴──────────────┐
                                    v                                  v
                            Mobile Apps (Stream)              AI Agents (Query)

STREAMING FLOW:
Mobile App → Caddy (HTTPS) → Audiobookshelf → Read /library/ → Stream Audio
                                                                        ↓
                                                            Track progress in DB

AI AGENT FLOW:
Claude → MCP Server → Audiobookshelf API → Return metadata/files
                  └→ Direct file access → /library/ (read-only)
```

### Technology Decisions

#### Why Caddy over Nginx/Traefik?

**Caddy Advantages:**
- **Automatic HTTPS:** Zero-configuration Let's Encrypt integration (critical for family external access)
- **Simplest Configuration:** Caddyfile is dramatically simpler than nginx.conf or Traefik labels
- **WebSocket Support:** Built-in WebSocket proxying (required for Audiobookshelf real-time updates)
- **2025 Momentum:** Growing adoption in homelab community, actively maintained
- **Docker-First:** Native Docker integration via caddy-docker-proxy

**Nginx Disadvantages:**
- Manual certbot configuration required
- Complex SSL/WebSocket configuration
- Requires separate renewal scripts

**Traefik Disadvantages:**
- Overkill for single-host deployment
- Label-based configuration harder to debug
- Higher resource overhead

#### Why Libation over OpenAudible?

**Libation Advantages:**
- Official Docker support with headless mode
- Active development (2025)
- Native integration with audible-cli and AAXtoMP3
- Automated scanning on schedule
- Open source (GPLv3)

**OpenAudible Disadvantages:**
- No official Docker image
- GUI-focused (harder to automate)
- Commercial licensing concerns

---

## Infrastructure Requirements

### External Disk Setup (Arch Linux)

#### Disk Preparation
```bash
# Identify the USB/Thunderbolt disk
lsblk -f

# Create GPT partition table (if new disk)
sudo parted /dev/sdX mklabel gpt

# Create single ext4 partition
sudo parted /dev/sdX mkpart primary ext4 0% 100%

# Format as ext4 with label
sudo mkfs.ext4 -L AUDIOBOOKS /dev/sdX1

# Create mount point
sudo mkdir -p /mnt/audiobooks

# Get UUID for fstab
sudo blkid /dev/sdX1
```

#### Persistent Mount Configuration
```bash
# Add to /etc/fstab
UUID=your-uuid-here /mnt/audiobooks ext4 defaults,nofail,x-systemd.automount 0 2

# Test mount
sudo mount -a
sudo systemctl daemon-reload
```

#### Directory Structure Creation
```bash
# Create application directories
sudo mkdir -p /mnt/audiobooks/{library,inbox,raw,config,metadata}
sudo mkdir -p /mnt/audiobooks/config/{audiobookshelf,libation,mcp}

# Set ownership (1000:1000 is typical first user on Arch)
sudo chown -R 1000:1000 /mnt/audiobooks

# Set permissions
sudo chmod -R 755 /mnt/audiobooks
```

### Docker Installation (Arch Linux)

```bash
# Install Docker
sudo pacman -S docker docker-compose

# Enable and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Add user to docker group (logout/login required after)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker compose version
```

---

## Feature Breakdown

### Feature 1: Audiobookshelf Server

#### User Stories
- **As a parent**, I want my children to stream audiobooks from their mobile devices, so they can listen anywhere with internet access
- **As a family**, I want separate user accounts with progress tracking, so each person maintains their own listening history
- **As an AI agent**, I want to query audiobook metadata via REST API, so I can answer questions about the library

#### Functional Requirements

**FR-1.1: Multi-User Authentication**
- Support minimum 5 user accounts (expandable)
- Each user has unique credentials (username/password)
- Admin account for library management
- User-specific listening progress tracking
- Age-appropriate content filtering per user (optional)

**FR-1.2: Mobile App Support**
- iOS app (Audiobookshelf iOS) fully functional
- Android app (Audiobookshelf Android) fully functional
- Offline download capability (download audiobooks to device)
- Background playback with lock screen controls
- Resume playback across devices

**FR-1.3: Library Management**
- Automatic library scanning (every 10 minutes)
- Metadata extraction (title, author, narrator, duration, cover art)
- Chapter marker preservation
- Search functionality (by title, author, narrator, series)
- Collection/series organization

**FR-1.4: REST API**
- Full REST API for library queries
- Authentication via API tokens
- Endpoints for:
  - List all audiobooks
  - Search audiobooks
  - Get audiobook metadata
  - User progress tracking
  - Library statistics

#### Non-Functional Requirements

**NFR-1.1: Performance**
- Library scan completes within 5 minutes for 500 audiobooks
- API response time under 500ms (95th percentile)
- Stream startup latency under 2 seconds
- Support concurrent streaming for 5 users

**NFR-1.2: Reliability**
- 99.5% uptime (excluding planned maintenance)
- Automatic restart on failure
- Database backup every 24 hours

**NFR-1.3: Security**
- HTTPS-only external access
- Strong password requirements
- Session timeout after 30 days inactivity
- Rate limiting on API endpoints

#### API Specifications

**Base URL:** `https://audiobooks.yourdomain.com/api`

**Authentication:** Bearer token in Authorization header

**Key Endpoints:**

```http
GET /api/libraries
Response: {
  "libraries": [
    {
      "id": "lib_xxxxx",
      "name": "Audiobooks",
      "folders": [...],
      "items": 150
    }
  ]
}

GET /api/libraries/{id}/items
Response: {
  "results": [
    {
      "id": "book_xxxxx",
      "metadata": {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "narrator": "Andy Serkis",
        "duration": 43200
      },
      "media": {
        "tracks": [...],
        "chapters": [...]
      }
    }
  ],
  "total": 150
}

GET /api/items/{id}
Response: {
  "id": "book_xxxxx",
  "libraryId": "lib_xxxxx",
  "metadata": {...},
  "media": {...},
  "path": "/audiobooks/library/Author/Title",
  "size": 523441152
}

GET /api/me/progress
Response: {
  "libraryItems": [
    {
      "id": "book_xxxxx",
      "progress": 0.35,
      "currentTime": 15120,
      "isFinished": false
    }
  ]
}
```

#### Database Schema

Audiobookshelf uses SQLite database (managed internally). Key tables:

```sql
-- Users table
users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  pash TEXT,  -- hashed password
  type TEXT,  -- 'admin' or 'user'
  isActive BOOLEAN,
  createdAt INTEGER
)

-- Library Items
libraryItems (
  id TEXT PRIMARY KEY,
  libraryId TEXT,
  mediaId TEXT,
  mediaType TEXT,  -- 'book' or 'podcast'
  path TEXT,
  size INTEGER,
  mtime INTEGER,
  metadata TEXT    -- JSON blob
)

-- User Progress
mediaProgress (
  id TEXT PRIMARY KEY,
  userId TEXT,
  libraryItemId TEXT,
  progress REAL,
  currentTime REAL,
  isFinished BOOLEAN,
  lastUpdate INTEGER
)
```

---

### Feature 2: Libation Automated Audible Manager

#### User Stories
- **As a book collector**, I want Libation to automatically download new Audible purchases, so I don't have to manually intervene
- **As a system administrator**, I want DRM removed automatically during download, so audiobooks are usable in any player

#### Functional Requirements

**FR-2.1: Automated Scanning**
- Scan Audible account every 30 minutes
- Detect new audiobooks not yet downloaded
- Download new audiobooks automatically
- Save original AAX files to `/mnt/audiobooks/raw/`

**FR-2.2: DRM Removal**
- Extract activation bytes from Audible account
- Decrypt AAX files during download
- Preserve all metadata (title, author, narrator, cover art)
- Preserve chapter markers with timestamps
- Output format: MP3 (320kbps) or M4B with chapters

**FR-2.3: Configuration Management**
- Store Audible credentials securely (AccountsSettings.json)
- Persist configuration across container restarts
- Support multiple Audible accounts (optional)

**FR-2.4: Download History**
- Track downloaded audiobooks to prevent re-downloading
- Log download timestamps and file sizes
- Maintain download queue for failed downloads

#### Non-Functional Requirements

**NFR-2.1: Performance**
- Download speed limited only by internet bandwidth
- Parallel downloads (up to 3 concurrent)
- CPU usage under 50% during conversion

**NFR-2.2: Reliability**
- Retry failed downloads (3 attempts with exponential backoff)
- Resume interrupted downloads
- Validate file integrity after download (checksum)

**NFR-2.3: Security**
- Encrypt stored Audible credentials
- No external network access except Audible API
- Run as non-root user in container

#### Implementation Checklist

**Development Checklist:**
- [ ] Install Libation Desktop on Windows/Linux for initial credential setup
- [ ] Log into Audible account and generate `AccountsSettings.json`
- [ ] Configure download settings (format, quality, chapter splitting)
- [ ] Export `AccountsSettings.json` and `Settings.json`
- [ ] Create Docker volume mount for configuration
- [ ] Create Docker volume mount for output directories
- [ ] Configure `SLEEP_TIME` environment variable (30m)
- [ ] Test single manual download to verify credentials
- [ ] Verify AAX file appears in `/mnt/audiobooks/raw/`
- [ ] Verify metadata extraction (cover art, chapters)

**Testing Checklist:**
- [ ] Verify automated scanning triggers every 30 minutes
- [ ] Test new audiobook detection (add test book to Audible account)
- [ ] Confirm download completes successfully
- [ ] Verify AAX file integrity (playable in Audible app)
- [ ] Test container restart persistence (config survives restart)
- [ ] Verify error handling (disconnect internet during download)
- [ ] Test credential refresh (token expiration after 30 days)

**Security Checklist:**
- [ ] Verify `AccountsSettings.json` has restricted permissions (600)
- [ ] Confirm container runs as non-root user (UID 1000)
- [ ] Validate no credentials appear in container logs
- [ ] Test network isolation (container cannot access local network)
- [ ] Verify encrypted credential storage in config file

**Performance Checklist:**
- [ ] Measure download speed vs baseline internet speed
- [ ] Monitor CPU usage during peak conversion
- [ ] Verify memory usage under 512MB
- [ ] Test parallel download limit (3 concurrent max)

**Documentation Checklist:**
- [ ] Document credential generation process
- [ ] Create troubleshooting guide for failed downloads
- [ ] Document how to add new Audible account
- [ ] Write backup/restore procedure for configuration

**Deployment Checklist:**
- [ ] Add health check to Docker Compose
- [ ] Configure automatic restart policy (`restart: unless-stopped`)
- [ ] Set resource limits (memory: 1GB, CPU: 1.0)
- [ ] Create log rotation policy (max 100MB)
- [ ] Schedule configuration backup (daily cron job)

---

### Feature 3: AAXtoMP3 Conversion Pipeline

#### User Stories
- **As a user**, I want AAX files automatically converted to MP3 after download, so they're compatible with Audiobookshelf
- **As a quality-focused listener**, I want chapter markers and metadata preserved during conversion

#### Functional Requirements

**FR-3.1: Automated Conversion**
- Monitor `/mnt/audiobooks/raw/` for new AAX files (inotify watch)
- Trigger conversion automatically on new file detection
- Delete original AAX file after successful conversion (optional)
- Move converted files to `/mnt/audiobooks/inbox/`

**FR-3.2: Conversion Options**
- Support multiple output formats: MP3 (320kbps), M4B (AAC 128kbps), OPUS
- Preserve chapter markers with exact timestamps
- Extract and embed cover art
- Preserve metadata tags (title, author, narrator, year, genre)
- Support single-file output or per-chapter splitting

**FR-3.3: Quality Control**
- Validate input AAX file before conversion (ffmpeg probe)
- Verify output file duration matches input (within 1 second tolerance)
- Check output file size is reasonable (expected compression ratio)
- Generate conversion report (input size, output size, duration, errors)

**FR-3.4: Integration with Libation**
- Use activation bytes from Libation configuration
- Support `--use-audible-cli-data` flag for enhanced metadata
- Inherit chapter files from audible-cli output

#### Non-Functional Requirements

**NFR-3.1: Performance**
- Conversion speed: Minimum 2x real-time (30-minute book converts in 15 minutes)
- Support parallel conversion (2 concurrent jobs max)
- CPU usage under 80% during conversion

**NFR-3.2: Reliability**
- Retry failed conversions (3 attempts)
- Quarantine problematic files after failure
- Log all conversion attempts with timestamps and errors

**NFR-3.3: Maintainability**
- Modular script design (separation of watch, convert, validate functions)
- Comprehensive logging (DEBUG level for troubleshooting)
- Configuration file for all parameters (no hardcoded paths)

#### Conversion Workflow Specification

```bash
# Watch script (runs as daemon)
#!/bin/bash
WATCH_DIR="/mnt/audiobooks/raw"
OUTPUT_DIR="/mnt/audiobooks/inbox"
ACTIVATION_BYTES="your-activation-bytes"
LOG_FILE="/var/log/aax-converter.log"

# Monitor directory with inotifywait
inotifywait -m -e close_write --format '%w%f' "$WATCH_DIR" | while read FILE
do
  if [[ "$FILE" == *.aax ]]; then
    log "Detected new AAX file: $FILE"
    convert_aax "$FILE"
  fi
done

# Conversion function
convert_aax() {
  INPUT_FILE="$1"
  FILENAME=$(basename "$INPUT_FILE" .aax)

  # Run AAXtoMP3 with metadata preservation
  AAXtoMP3 \
    --authcode "$ACTIVATION_BYTES" \
    --single \
    --target_dir "$OUTPUT_DIR" \
    --use-audible-cli-data \
    --level 2 \
    "$INPUT_FILE"

  # Validate conversion
  if validate_conversion "$OUTPUT_DIR/$FILENAME.mp3"; then
    log "Conversion successful: $FILENAME"
    # Optional: Delete original AAX
    # rm "$INPUT_FILE"
  else
    log "ERROR: Conversion failed: $FILENAME"
    # Move to quarantine
    mv "$INPUT_FILE" "/mnt/audiobooks/quarantine/"
  fi
}
```

#### Implementation Checklist

**Development Checklist:**
- [ ] Create Docker container with AAXtoMP3 and dependencies (ffmpeg, bash, inotify-tools)
- [ ] Write watcher script with inotify monitoring
- [ ] Implement conversion function with error handling
- [ ] Create validation function (duration check, file size check)
- [ ] Configure logging with rotation
- [ ] Set up quarantine directory for failed conversions
- [ ] Create configuration file for activation bytes and paths
- [ ] Implement conversion queue (prevent overwhelming CPU)

**Testing Checklist:**
- [ ] Test single AAX file conversion end-to-end
- [ ] Verify chapter markers preserved in output
- [ ] Confirm cover art embedded in MP3
- [ ] Test metadata tags (all fields present)
- [ ] Verify duration accuracy (within 1 second)
- [ ] Test parallel conversion (2 files simultaneously)
- [ ] Simulate conversion failure (corrupt AAX file)
- [ ] Verify quarantine process for failed files
- [ ] Test with various audiobook lengths (1 hour, 10 hours, 30 hours)

**Security Checklist:**
- [ ] Store activation bytes securely (environment variable, not hardcoded)
- [ ] Validate input files to prevent path traversal attacks
- [ ] Run conversion process as non-root user
- [ ] Restrict file permissions on output directory (755)

**Performance Checklist:**
- [ ] Benchmark conversion speed (measure real-time ratio)
- [ ] Monitor CPU usage during peak load
- [ ] Verify parallel conversion limit prevents CPU saturation
- [ ] Test with SSD vs HDD storage (measure I/O impact)

**Documentation Checklist:**
- [ ] Document how to retrieve activation bytes
- [ ] Create troubleshooting guide for common conversion errors
- [ ] Write manual conversion procedure (bypass automation)
- [ ] Document quarantine recovery process

**Deployment Checklist:**
- [ ] Add watcher script to Docker entrypoint
- [ ] Configure health check (verify inotify process running)
- [ ] Set resource limits (CPU: 2.0, Memory: 2GB)
- [ ] Implement log rotation (max 50MB per log file)
- [ ] Create systemd service for container (auto-restart)

---

### Feature 4: Caddy Reverse Proxy with HTTPS

#### User Stories
- **As a parent**, I want my children to access audiobooks securely from school/friends' houses via HTTPS
- **As a system administrator**, I want automatic SSL certificate renewal so I don't have to manually manage certificates

#### Functional Requirements

**FR-4.1: Reverse Proxy Configuration**
- Route `https://audiobooks.yourdomain.com` → Audiobookshelf (internal port 80)
- Route `https://audiobooks-api.yourdomain.com/mcp` → MCP Server (internal port 8000)
- Support WebSocket connections for Audiobookshelf real-time features
- Preserve client IP addresses in X-Forwarded-For headers

**FR-4.2: Automatic HTTPS**
- Request Let's Encrypt certificates on first startup
- Automatically renew certificates 30 days before expiration
- Support HTTP-01 challenge (ports 80/443 required)
- Redirect all HTTP traffic to HTTPS

**FR-4.3: Security Headers**
- HSTS (HTTP Strict Transport Security) with 1-year max-age
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

**FR-4.4: Access Logging**
- Log all access requests with timestamps
- Include client IP, request method, path, response code, user agent
- Rotate logs daily
- Retain logs for 30 days

#### Non-Functional Requirements

**NFR-4.1: Performance**
- Sub-50ms proxy overhead (95th percentile)
- Support 100 concurrent connections
- HTTP/2 support for multiplexing

**NFR-4.2: Reliability**
- 99.9% uptime
- Graceful reload on configuration changes (zero-downtime)
- Health checks for backend services

**NFR-4.3: Security**
- TLS 1.2 minimum (TLS 1.3 preferred)
- Strong cipher suites only (no weak ciphers)
- Certificate transparency logging
- OCSP stapling for performance

#### Caddyfile Configuration

```caddyfile
# Global options
{
  email your-email@example.com
  # Use Let's Encrypt production
  acme_ca https://acme-v02.api.letsencrypt.org/directory
}

# Audiobookshelf
audiobooks.yourdomain.com {
  reverse_proxy audiobookshelf:80 {
    # WebSocket support
    header_up X-Real-IP {remote_host}
    header_up X-Forwarded-For {remote_host}
    header_up X-Forwarded-Proto {scheme}
  }

  # Security headers
  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains"
    X-Frame-Options "SAMEORIGIN"
    X-Content-Type-Options "nosniff"
    Referrer-Policy "strict-origin-when-cross-origin"
  }

  # Access logging
  log {
    output file /var/log/caddy/audiobooks-access.log {
      roll_size 100MB
      roll_keep 30
    }
    format json
  }
}

# MCP Server
audiobooks-api.yourdomain.com {
  reverse_proxy /mcp* mcp-server:8000 {
    header_up X-Real-IP {remote_host}
    header_up X-Forwarded-For {remote_host}
    header_up X-Forwarded-Proto {scheme}
  }

  # Rate limiting for API
  rate_limit {
    zone api {
      key {remote_host}
      events 100
      window 1m
    }
  }

  # Security headers
  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains"
    X-Frame-Options "DENY"
    X-Content-Type-Options "nosniff"
  }

  log {
    output file /var/log/caddy/api-access.log {
      roll_size 100MB
      roll_keep 30
    }
    format json
  }
}
```

#### DNS Configuration

**Required DNS Records:**

```
# A record for IPv4
audiobooks.yourdomain.com.          A       YOUR_PUBLIC_IP
audiobooks-api.yourdomain.com.      A       YOUR_PUBLIC_IP

# AAAA record for IPv6 (optional but recommended)
audiobooks.yourdomain.com.          AAAA    YOUR_PUBLIC_IPv6
audiobooks-api.yourdomain.com.      AAAA    YOUR_PUBLIC_IPv6
```

**Firewall Configuration:**

```bash
# Allow HTTP (for Let's Encrypt challenge)
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Verify rules
sudo ufw status
```

#### Implementation Checklist

**Development Checklist:**
- [ ] Create Caddyfile with reverse proxy configuration
- [ ] Configure Let's Encrypt email for certificate notifications
- [ ] Set up Docker volume for Caddy data persistence (`/data`)
- [ ] Set up Docker volume for log storage (`/var/log/caddy`)
- [ ] Configure WebSocket support for Audiobookshelf
- [ ] Add security headers to Caddyfile
- [ ] Implement rate limiting for API endpoints
- [ ] Create health check endpoints

**Testing Checklist:**
- [ ] Test HTTP to HTTPS redirect (curl http://audiobooks.yourdomain.com)
- [ ] Verify Let's Encrypt certificate issued successfully
- [ ] Test SSL Labs score (aim for A+ rating)
- [ ] Validate WebSocket connections (Audiobookshelf real-time features)
- [ ] Test mobile app connectivity via HTTPS
- [ ] Verify client IP preservation in Audiobookshelf logs
- [ ] Test certificate auto-renewal (manually trigger renewal)
- [ ] Validate security headers with securityheaders.com
- [ ] Test rate limiting (exceed 100 requests/minute)

**Security Checklist:**
- [ ] Verify TLS 1.2 minimum (disable TLS 1.0/1.1)
- [ ] Check cipher suite configuration (no weak ciphers)
- [ ] Validate HSTS header present and correct
- [ ] Confirm certificate transparency logging enabled
- [ ] Test OCSP stapling functionality
- [ ] Verify no sensitive data in access logs

**Performance Checklist:**
- [ ] Measure proxy overhead (compare direct vs proxied response time)
- [ ] Test concurrent connection limit (simulate 100 clients)
- [ ] Verify HTTP/2 enabled (check with browser dev tools)
- [ ] Benchmark WebSocket latency
- [ ] Monitor CPU/memory usage under load

**Documentation Checklist:**
- [ ] Document DNS configuration requirements
- [ ] Create firewall rule documentation
- [ ] Write certificate renewal troubleshooting guide
- [ ] Document how to add new domains
- [ ] Create rollback procedure for Caddyfile changes

**Deployment Checklist:**
- [ ] Verify DNS records propagated (nslookup/dig)
- [ ] Ensure ports 80/443 forwarded from router (if behind NAT)
- [ ] Configure Caddy data volume persistence
- [ ] Set up log rotation (daily, 30-day retention)
- [ ] Create backup of Caddy data directory (includes certificates)
- [ ] Test graceful reload (caddy reload)

---

### Feature 5: MCP Server for AI Agent Access

#### User Stories
- **As Claude AI**, I want to query the audiobook library via MCP server, so I can answer user questions about available books
- **As Claude AI**, I want to access audiobook metadata and files directly, so I can perform analysis or generate recommendations
- **As a developer**, I want the MCP server to auto-generate tools from the Audiobookshelf API, so I don't manually define each endpoint

#### Functional Requirements

**FR-5.1: MCP Server Core**
- Expose Audiobookshelf REST API as MCP tools
- Support authentication via Audiobookshelf API tokens
- Provide direct file system access to `/mnt/audiobooks/library/` (read-only)
- Auto-generate MCP tools from OpenAPI specification

**FR-5.2: MCP Tools**
Required tools:
1. `list_libraries` - List all audiobook libraries
2. `list_audiobooks` - List audiobooks with optional filtering (author, narrator, series)
3. `search_audiobooks` - Full-text search across metadata
4. `get_audiobook_details` - Get detailed metadata for specific audiobook
5. `get_user_progress` - Get listening progress for user
6. `get_library_stats` - Get library statistics (total books, total duration, genres)
7. `read_audiobook_file` - Read audiobook file metadata (chapters, duration, codec)
8. `list_directory` - List files in library directory (for file exploration)

**FR-5.3: Transport Support**
- ASGI transport for Claude Desktop (stdio via MCP proxy)
- HTTP transport for web-based Claude access (reverse proxied via Caddy)
- SSE transport for streaming responses (optional)

**FR-5.4: Error Handling**
- Graceful handling of Audiobookshelf API errors (404, 401, 500)
- Timeout handling (5-second timeout for API calls)
- Retry logic with exponential backoff (3 attempts)
- Detailed error messages in MCP responses

#### Non-Functional Requirements

**NFR-5.1: Performance**
- MCP tool response time under 500ms (95th percentile)
- Support 10 concurrent MCP requests
- Cache frequently accessed metadata (15-minute TTL)

**NFR-5.2: Reliability**
- 99.5% uptime
- Automatic reconnection to Audiobookshelf on connection loss
- Health check endpoint (`/health`)

**NFR-5.3: Security**
- Read-only file system access (no write/delete operations)
- API token validation on every request
- Rate limiting (100 requests/minute per client)
- No exposure of internal file paths in responses

#### MCP Server Implementation (FastAPI)

```python
# /app/main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi_mcp import FastApiMCP
from pydantic import BaseModel
import httpx
import os
from pathlib import Path
from typing import List, Optional

app = FastAPI(
    title="Audiobook MCP Server",
    description="MCP server for Audiobookshelf library access",
    version="1.0.0"
)

# Environment configuration
AUDIOBOOKSHELF_URL = os.getenv("AUDIOBOOKSHELF_URL", "http://audiobookshelf:80")
AUDIOBOOKSHELF_TOKEN = os.getenv("AUDIOBOOKSHELF_TOKEN")
LIBRARY_PATH = Path("/mnt/audiobooks/library")

# Initialize MCP
mcp = FastApiMCP(app)

# HTTP client for Audiobookshelf API
async def get_abs_client():
    async with httpx.AsyncClient(
        base_url=AUDIOBOOKSHELF_URL,
        headers={"Authorization": f"Bearer {AUDIOBOOKSHELF_TOKEN}"},
        timeout=5.0
    ) as client:
        yield client

# ============ MCP Tools ============

@app.get("/api/libraries")
async def list_libraries(client: httpx.AsyncClient = Depends(get_abs_client)):
    """List all audiobook libraries"""
    response = await client.get("/api/libraries")
    response.raise_for_status()
    return response.json()

@app.get("/api/libraries/{library_id}/items")
async def list_audiobooks(
    library_id: str,
    filter: Optional[str] = None,
    client: httpx.AsyncClient = Depends(get_abs_client)
):
    """List audiobooks with optional filtering"""
    params = {"filter": filter} if filter else {}
    response = await client.get(f"/api/libraries/{library_id}/items", params=params)
    response.raise_for_status()
    return response.json()

@app.get("/api/search/books")
async def search_audiobooks(
    q: str,
    limit: int = 20,
    client: httpx.AsyncClient = Depends(get_abs_client)
):
    """Full-text search across audiobook metadata"""
    response = await client.get("/api/search/books", params={"q": q, "limit": limit})
    response.raise_for_status()
    return response.json()

@app.get("/api/items/{item_id}")
async def get_audiobook_details(
    item_id: str,
    client: httpx.AsyncClient = Depends(get_abs_client)
):
    """Get detailed metadata for specific audiobook"""
    response = await client.get(f"/api/items/{item_id}")
    response.raise_for_status()
    return response.json()

@app.get("/api/me/progress")
async def get_user_progress(client: httpx.AsyncClient = Depends(get_abs_client)):
    """Get listening progress for authenticated user"""
    response = await client.get("/api/me/progress")
    response.raise_for_status()
    return response.json()

@app.get("/api/stats")
async def get_library_stats(client: httpx.AsyncClient = Depends(get_abs_client)):
    """Get library statistics (total books, duration, genres)"""
    # Custom endpoint - may need to aggregate from multiple API calls
    libraries_response = await client.get("/api/libraries")
    libraries = libraries_response.json()["libraries"]

    stats = {
        "total_libraries": len(libraries),
        "total_items": sum(lib["items"] for lib in libraries),
        "total_duration": sum(lib.get("duration", 0) for lib in libraries)
    }
    return stats

@app.get("/api/fs/list")
async def list_directory(path: str = ""):
    """List files in library directory (read-only)"""
    # Validate path to prevent directory traversal
    safe_path = LIBRARY_PATH / path
    if not safe_path.resolve().is_relative_to(LIBRARY_PATH):
        raise HTTPException(status_code=403, detail="Access denied")

    if not safe_path.exists():
        raise HTTPException(status_code=404, detail="Path not found")

    items = []
    for item in safe_path.iterdir():
        items.append({
            "name": item.name,
            "type": "directory" if item.is_dir() else "file",
            "size": item.stat().st_size if item.is_file() else None
        })

    return {"path": str(path), "items": items}

@app.get("/api/fs/metadata")
async def read_audiobook_file(file_path: str):
    """Read audiobook file metadata using ffprobe"""
    safe_path = LIBRARY_PATH / file_path
    if not safe_path.resolve().is_relative_to(LIBRARY_PATH):
        raise HTTPException(status_code=403, detail="Access denied")

    if not safe_path.exists() or not safe_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    # Use ffprobe to extract metadata
    import subprocess
    import json

    try:
        result = subprocess.run(
            ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", "-show_chapters", str(safe_path)],
            capture_output=True,
            text=True,
            check=True
        )
        metadata = json.loads(result.stdout)
        return metadata
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail="Failed to read file metadata")

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

# Mount MCP server
mcp.mount()

# Run with: uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "audiobook-library": {
      "command": "mcp-proxy",
      "args": ["http://localhost:8000/mcp"]
    }
  }
}
```

#### Docker Compose MCP Service

```yaml
mcp-server:
  build: ./mcp-server
  container_name: audiobook-mcp
  environment:
    - AUDIOBOOKSHELF_URL=http://audiobookshelf:80
    - AUDIOBOOKSHELF_TOKEN=${AUDIOBOOKSHELF_TOKEN}
  volumes:
    - /mnt/audiobooks/library:/mnt/audiobooks/library:ro
  networks:
    - audiobook-net
  restart: unless-stopped
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
    interval: 30s
    timeout: 10s
    retries: 3
```

#### Implementation Checklist

**Development Checklist:**
- [ ] Create FastAPI application with base structure
- [ ] Install dependencies (fastapi, fastapi-mcp, httpx, uvicorn)
- [ ] Implement authentication with Audiobookshelf API token
- [ ] Create all 8 MCP tool endpoints
- [ ] Implement file system access with path validation
- [ ] Add ffprobe integration for file metadata reading
- [ ] Create health check endpoint
- [ ] Mount MCP server via fastapi-mcp
- [ ] Create Dockerfile for MCP server
- [ ] Write docker-compose.yml service definition

**Testing Checklist:**
- [ ] Test each MCP tool individually (manual API calls)
- [ ] Verify authentication with valid/invalid tokens
- [ ] Test path traversal prevention (attempt ../../../etc/passwd)
- [ ] Validate file metadata extraction (ffprobe output)
- [ ] Test MCP proxy connection from Claude Desktop
- [ ] Verify error handling (simulate Audiobookshelf downtime)
- [ ] Test concurrent requests (10 simultaneous MCP calls)
- [ ] Validate timeout handling (5-second limit)
- [ ] Test with actual Claude conversation (end-to-end)

**Security Checklist:**
- [ ] Verify read-only file system access (no write operations)
- [ ] Validate path traversal prevention works
- [ ] Confirm API token required for all endpoints
- [ ] Test rate limiting (exceed 100 requests/minute)
- [ ] Verify no internal paths exposed in error messages
- [ ] Validate CORS configuration (if using HTTP transport)

**Performance Checklist:**
- [ ] Measure response time for each MCP tool (< 500ms target)
- [ ] Test caching effectiveness (repeated queries faster)
- [ ] Benchmark concurrent request handling (10 simultaneous)
- [ ] Monitor memory usage (< 256MB target)

**Documentation Checklist:**
- [ ] Document each MCP tool with examples
- [ ] Create Claude Desktop configuration guide
- [ ] Write troubleshooting guide for MCP connection issues
- [ ] Document how to regenerate Audiobookshelf API token
- [ ] Create example Claude prompts that use MCP tools

**Deployment Checklist:**
- [ ] Build Docker image for MCP server
- [ ] Configure environment variables securely
- [ ] Set resource limits (CPU: 0.5, Memory: 512MB)
- [ ] Test container restart behavior
- [ ] Verify volume mounts (library access)
- [ ] Configure health check in docker-compose

---

## Complete Docker Compose Configuration

```yaml
version: '3.8'

networks:
  audiobook-net:
    driver: bridge

volumes:
  caddy_data:
  caddy_config:

services:
  # ============ Caddy Reverse Proxy ============
  caddy:
    image: caddy:2-alpine
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
      - /var/log/caddy:/var/log/caddy
    networks:
      - audiobook-net
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:2019/config/"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ============ Audiobookshelf Server ============
  audiobookshelf:
    image: advplyr/audiobookshelf:latest
    container_name: audiobookshelf
    restart: unless-stopped
    environment:
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    volumes:
      - /mnt/audiobooks/config/audiobookshelf:/config
      - /mnt/audiobooks/metadata:/metadata
      - /mnt/audiobooks/library:/audiobooks
    networks:
      - audiobook-net
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ============ Libation (Audible Manager) ============
  libation:
    image: rmcrackan/libation:latest
    container_name: libation
    restart: unless-stopped
    environment:
      - SLEEP_TIME=30m
    volumes:
      - /mnt/audiobooks/config/libation:/config
      - /mnt/audiobooks/raw:/data
    networks:
      - audiobook-net
    healthcheck:
      test: ["CMD", "pgrep", "-f", "LibationCli"]
      interval: 60s
      timeout: 10s
      retries: 3

  # ============ AAXtoMP3 Conversion Worker ============
  aax-converter:
    build: ./aax-converter
    container_name: aax-converter
    restart: unless-stopped
    environment:
      - ACTIVATION_BYTES=${ACTIVATION_BYTES}
      - WATCH_DIR=/raw
      - OUTPUT_DIR=/inbox
    volumes:
      - /mnt/audiobooks/raw:/raw
      - /mnt/audiobooks/inbox:/inbox
      - /var/log/aax-converter:/var/log
    networks:
      - audiobook-net
    depends_on:
      - libation

  # ============ MCP Server (AI Agent Access) ============
  mcp-server:
    build: ./mcp-server
    container_name: audiobook-mcp
    restart: unless-stopped
    environment:
      - AUDIOBOOKSHELF_URL=http://audiobookshelf:80
      - AUDIOBOOKSHELF_TOKEN=${AUDIOBOOKSHELF_TOKEN}
    volumes:
      - /mnt/audiobooks/library:/mnt/audiobooks/library:ro
    networks:
      - audiobook-net
    depends_on:
      - audiobookshelf
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Environment Variables (.env file)

```bash
# Audiobookshelf
JWT_SECRET_KEY=generate-64-character-random-string-here

# Libation / AAXtoMP3
ACTIVATION_BYTES=your-audible-activation-bytes

# MCP Server
AUDIOBOOKSHELF_TOKEN=your-audiobookshelf-api-token

# Caddy (for Let's Encrypt)
CADDY_EMAIL=your-email@example.com
DOMAIN=yourdomain.com
```

---

## Implementation Plan

### Directory Structure

```
/home/chris/audiobook-server/
├── docker-compose.yml
├── .env
├── .env.example
├── Caddyfile
├── README.md
├── aax-converter/
│   ├── Dockerfile
│   ├── watcher.sh
│   └── requirements.txt
├── mcp-server/
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
└── scripts/
    ├── setup-external-disk.sh
    ├── generate-secrets.sh
    ├── backup-config.sh
    └── restore-config.sh

/mnt/audiobooks/  (External USB/Thunderbolt disk)
├── library/          # Audiobookshelf library (final location)
├── inbox/            # AAXtoMP3 output (staged for import)
├── raw/              # Original AAX files from Libation
├── quarantine/       # Failed conversions
├── config/           # Application configurations
│   ├── audiobookshelf/
│   ├── libation/
│   │   ├── AccountsSettings.json
│   │   └── Settings.json
│   └── mcp/
└── metadata/         # Cover art, NFO files
```

---

## Step-by-Step Implementation Checklist

### Phase 1: Infrastructure Setup (4-6 hours)

**Step 1.1: Install Docker on Arch Linux**
- [ ] Update system: `sudo pacman -Syu`
- [ ] Install Docker: `sudo pacman -S docker docker-compose`
- [ ] Enable Docker service: `sudo systemctl enable --now docker`
- [ ] Add user to docker group: `sudo usermod -aG docker $USER`
- [ ] Logout and login to apply group changes
- [ ] Verify installation: `docker --version && docker compose version`

**Step 1.2: Prepare External Disk**
- [ ] Identify disk: `lsblk -f`
- [ ] Create GPT partition: `sudo parted /dev/sdX mklabel gpt`
- [ ] Create partition: `sudo parted /dev/sdX mkpart primary ext4 0% 100%`
- [ ] Format as ext4: `sudo mkfs.ext4 -L AUDIOBOOKS /dev/sdX1`
- [ ] Get UUID: `sudo blkid /dev/sdX1`
- [ ] Create mount point: `sudo mkdir -p /mnt/audiobooks`
- [ ] Add to /etc/fstab: `UUID=... /mnt/audiobooks ext4 defaults,nofail,x-systemd.automount 0 2`
- [ ] Test mount: `sudo mount -a`
- [ ] Verify: `df -h | grep audiobooks`

**Step 1.3: Create Directory Structure**
- [ ] Create app dirs: `sudo mkdir -p /mnt/audiobooks/{library,inbox,raw,quarantine,config,metadata}`
- [ ] Create config subdirs: `sudo mkdir -p /mnt/audiobooks/config/{audiobookshelf,libation,mcp}`
- [ ] Set ownership: `sudo chown -R $(id -u):$(id -g) /mnt/audiobooks`
- [ ] Set permissions: `sudo chmod -R 755 /mnt/audiobooks`
- [ ] Verify: `ls -la /mnt/audiobooks`

**Step 1.4: Create Project Directory**
- [ ] Create project: `mkdir -p ~/audiobook-server`
- [ ] Create subdirs: `mkdir -p ~/audiobook-server/{aax-converter,mcp-server,scripts}`
- [ ] Initialize git: `cd ~/audiobook-server && git init`
- [ ] Create .gitignore: (exclude .env, secrets)

---

### Phase 2: Core Services (6-8 hours)

**Step 2.1: Configure Audiobookshelf**
- [ ] Create docker-compose.yml (add audiobookshelf service)
- [ ] Generate JWT secret: `openssl rand -hex 32`
- [ ] Create .env file with JWT_SECRET_KEY
- [ ] Start Audiobookshelf: `docker compose up -d audiobookshelf`
- [ ] Wait for startup: `docker compose logs -f audiobookshelf`
- [ ] Access web UI: `http://localhost:13378` (if port-forwarded for testing)
- [ ] Complete initial setup (create admin user)
- [ ] Create library pointing to `/audiobooks`
- [ ] Create user accounts for family members
- [ ] Generate API token: Settings → Users → Generate Token
- [ ] Save token to .env: `AUDIOBOOKSHELF_TOKEN=...`

**Step 2.2: Configure Libation**
- [ ] Install Libation Desktop on another machine (Windows/Linux GUI)
- [ ] Log into Audible account
- [ ] Configure download settings:
  - [ ] Output format: MP3 or M4B
  - [ ] Audio quality: High (320kbps for MP3)
  - [ ] Chapter splitting: Yes
  - [ ] Cover art: Yes
- [ ] Locate config files: `~/.config/Libation/` or `%APPDATA%\Libation\`
- [ ] Copy `AccountsSettings.json` to `/mnt/audiobooks/config/libation/`
- [ ] Copy `Settings.json` to `/mnt/audiobooks/config/libation/`
- [ ] Get activation bytes from config files
- [ ] Add to .env: `ACTIVATION_BYTES=your-bytes-here`
- [ ] Add Libation service to docker-compose.yml
- [ ] Start Libation: `docker compose up -d libation`
- [ ] Verify scanning: `docker compose logs -f libation`
- [ ] Test manual download (add test book to Audible account)
- [ ] Confirm AAX file appears in `/mnt/audiobooks/raw/`

**Step 2.3: Create AAX Conversion Worker**
- [ ] Create `aax-converter/Dockerfile`:
  ```dockerfile
  FROM ubuntu:22.04

  RUN apt-get update && apt-get install -y \
      ffmpeg \
      wget \
      bash \
      inotify-tools \
      && rm -rf /var/lib/apt/lists/*

  # Install AAXtoMP3
  RUN wget https://github.com/KrumpetPirate/AAXtoMP3/archive/refs/heads/master.zip \
      && unzip master.zip \
      && mv AAXtoMP3-master/AAXtoMP3 /usr/local/bin/ \
      && chmod +x /usr/local/bin/AAXtoMP3 \
      && rm -rf master.zip AAXtoMP3-master

  COPY watcher.sh /usr/local/bin/watcher.sh
  RUN chmod +x /usr/local/bin/watcher.sh

  CMD ["/usr/local/bin/watcher.sh"]
  ```
- [ ] Create `aax-converter/watcher.sh` (see conversion script in Feature 3)
- [ ] Add aax-converter service to docker-compose.yml
- [ ] Build image: `docker compose build aax-converter`
- [ ] Start converter: `docker compose up -d aax-converter`
- [ ] Test conversion: Copy test AAX file to `/mnt/audiobooks/raw/`
- [ ] Monitor logs: `docker compose logs -f aax-converter`
- [ ] Verify MP3 appears in `/mnt/audiobooks/inbox/`
- [ ] Check metadata preservation (ffprobe on output file)

**Step 2.4: Verify Audiobookshelf Import**
- [ ] Configure Audiobookshelf to watch `/audiobooks` (inbox symlink or direct)
- [ ] Trigger manual library scan in Audiobookshelf UI
- [ ] Verify converted audiobook appears in library
- [ ] Test playback in web UI
- [ ] Verify metadata (cover art, chapters, author, narrator)
- [ ] Test resume/progress tracking

---

### Phase 3: External Access (2-4 hours)

**Step 3.1: DNS Configuration**
- [ ] Choose domain name (e.g., audiobooks.yourdomain.com)
- [ ] Get your public IP: `curl ifconfig.me`
- [ ] Create DNS A record: `audiobooks.yourdomain.com → YOUR_PUBLIC_IP`
- [ ] Create DNS A record: `audiobooks-api.yourdomain.com → YOUR_PUBLIC_IP`
- [ ] Wait for DNS propagation: `nslookup audiobooks.yourdomain.com`
- [ ] Verify resolution: `dig audiobooks.yourdomain.com`

**Step 3.2: Firewall & Port Forwarding**
- [ ] Configure router port forwarding: 80 → server:80, 443 → server:443
- [ ] Allow ports in firewall: `sudo ufw allow 80/tcp && sudo ufw allow 443/tcp`
- [ ] Verify external access: Test from external network (phone on cellular)

**Step 3.3: Configure Caddy**
- [ ] Create Caddyfile (see Feature 4 configuration)
- [ ] Add email to .env: `CADDY_EMAIL=your-email@example.com`
- [ ] Add Caddy service to docker-compose.yml
- [ ] Start Caddy: `docker compose up -d caddy`
- [ ] Monitor logs: `docker compose logs -f caddy`
- [ ] Wait for Let's Encrypt certificate issuance (30-60 seconds)
- [ ] Verify HTTPS: `curl -I https://audiobooks.yourdomain.com`
- [ ] Test SSL Labs: https://www.ssllabs.com/ssltest/
- [ ] Verify HTTP redirect: `curl -I http://audiobooks.yourdomain.com`

**Step 3.4: Mobile App Testing**
- [ ] Install Audiobookshelf app on iOS device
- [ ] Configure server URL: `https://audiobooks.yourdomain.com`
- [ ] Login with user credentials
- [ ] Verify library loads correctly
- [ ] Test audiobook playback
- [ ] Test download for offline listening
- [ ] Verify resume/progress sync
- [ ] Repeat for Android device

---

### Phase 4: MCP Server (4-6 hours)

**Step 4.1: Create MCP Server**
- [ ] Create `mcp-server/requirements.txt`:
  ```
  fastapi==0.104.1
  fastapi-mcp==0.1.0
  uvicorn[standard]==0.24.0
  httpx==0.25.0
  pydantic==2.5.0
  ```
- [ ] Create `mcp-server/main.py` (see Feature 5 implementation)
- [ ] Create `mcp-server/Dockerfile`:
  ```dockerfile
  FROM python:3.11-slim

  WORKDIR /app

  # Install ffmpeg for file metadata reading
  RUN apt-get update && apt-get install -y \
      ffmpeg \
      && rm -rf /var/lib/apt/lists/*

  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt

  COPY main.py .

  CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
  ```
- [ ] Add mcp-server service to docker-compose.yml
- [ ] Build image: `docker compose build mcp-server`
- [ ] Start MCP server: `docker compose up -d mcp-server`

**Step 4.2: Test MCP Server**
- [ ] Test health check: `curl http://localhost:8000/health`
- [ ] Test list_libraries: `curl -H "Authorization: Bearer $AUDIOBOOKSHELF_TOKEN" http://localhost:8000/api/libraries`
- [ ] Test search: `curl http://localhost:8000/api/search/books?q=hobbit`
- [ ] Test file listing: `curl http://localhost:8000/api/fs/list`
- [ ] Verify all 8 MCP tools respond correctly

**Step 4.3: Configure Claude Desktop**
- [ ] Locate Claude Desktop config: `~/.config/Claude/claude_desktop_config.json`
- [ ] Add MCP server configuration (see Feature 5)
- [ ] Install mcp-proxy: `npm install -g mcp-proxy`
- [ ] Restart Claude Desktop
- [ ] Verify MCP server appears in Claude: "What MCP servers are available?"
- [ ] Test MCP tool: "List my audiobook libraries"
- [ ] Test search: "Search for audiobooks by Tolkien"
- [ ] Test file access: "What audiobook files are in the library directory?"

**Step 4.4: Add Caddy Route for MCP (Optional)**
- [ ] Update Caddyfile with `audiobooks-api.yourdomain.com` block
- [ ] Reload Caddy: `docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile`
- [ ] Test external MCP access: `curl https://audiobooks-api.yourdomain.com/health`
- [ ] Update Claude Desktop config to use HTTPS endpoint

---

### Phase 5: Testing & Optimization (4-6 hours)

**Step 5.1: End-to-End Workflow Test**
- [ ] Add new audiobook to Audible account
- [ ] Wait for Libation scan (30 minutes max)
- [ ] Verify download to `/mnt/audiobooks/raw/`
- [ ] Wait for AAX conversion (5-15 minutes depending on length)
- [ ] Verify MP3 in `/mnt/audiobooks/inbox/`
- [ ] Trigger Audiobookshelf scan
- [ ] Verify audiobook appears in library
- [ ] Test playback on mobile app
- [ ] Query via Claude MCP: "What new audiobooks were added today?"

**Step 5.2: Multi-User Testing**
- [ ] Test simultaneous playback (3+ family members)
- [ ] Verify independent progress tracking
- [ ] Test user permissions (admin vs regular user)
- [ ] Verify content filtering works (if configured)

**Step 5.3: Performance Testing**
- [ ] Benchmark library scan time (measure for current library size)
- [ ] Test external streaming latency (measure from mobile app)
- [ ] Test MCP query performance (run 10 concurrent searches)
- [ ] Monitor resource usage: `docker stats`
- [ ] Verify disk I/O is acceptable (not saturating USB bus)

**Step 5.4: Security Audit**
- [ ] Run SSL test: https://www.ssllabs.com/ssltest/
- [ ] Verify security headers: https://securityheaders.com/
- [ ] Test path traversal attempts on MCP server
- [ ] Verify no sensitive data in logs: `docker compose logs | grep -i password`
- [ ] Test rate limiting on MCP server
- [ ] Verify firewall rules: `sudo ufw status`

**Step 5.5: Backup & Recovery**
- [ ] Create backup script for configs:
  ```bash
  #!/bin/bash
  tar -czf ~/audiobook-backup-$(date +%Y%m%d).tar.gz \
    /mnt/audiobooks/config \
    ~/audiobook-server/docker-compose.yml \
    ~/audiobook-server/Caddyfile \
    ~/audiobook-server/.env
  ```
- [ ] Test config restoration from backup
- [ ] Document recovery procedure
- [ ] Set up automated daily backups (cron job)

**Step 5.6: Documentation**
- [ ] Create README.md with architecture overview
- [ ] Document user account creation process
- [ ] Write mobile app setup guide for family
- [ ] Create troubleshooting guide (common issues)
- [ ] Document how to add new audiobooks manually
- [ ] Write MCP server usage examples for Claude

---

## Security Considerations

### Network Security

**Firewall Configuration:**
- Only expose ports 80 and 443 externally
- All other services (Libation, MCP internal access) should be accessible only via Docker network
- Use UFW on Arch Linux for host firewall:
  ```bash
  sudo ufw default deny incoming
  sudo ufw default allow outgoing
  sudo ufw allow 22/tcp  # SSH (restrict to your IP if possible)
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```

**Docker Network Isolation:**
- Use dedicated bridge network (`audiobook-net`) to isolate containers
- Do NOT use `network_mode: host` (prevents isolation)
- Only Caddy should have ports exposed to host (80, 443)

### Authentication & Authorization

**Audiobookshelf:**
- Enforce strong passwords (min 12 characters, mixed case, numbers, symbols)
- Use unique passwords for each family member
- Admin account should have different password than regular users
- API tokens should be rotated every 90 days
- Enable session timeout (30-day inactivity)

**MCP Server:**
- Require Audiobookshelf API token for all requests
- Implement rate limiting (100 requests/minute per IP)
- Read-only file system access (no write/delete operations)
- Path traversal prevention (validate all file paths)

**Caddy:**
- HTTPS-only (redirect HTTP → HTTPS)
- HSTS header with 1-year max-age
- Strong TLS configuration (TLS 1.2 minimum, TLS 1.3 preferred)
- Certificate transparency logging enabled

### Data Security

**Secrets Management:**
- Store all secrets in .env file (NEVER commit to git)
- Add .env to .gitignore
- Use strong random values:
  - JWT_SECRET_KEY: `openssl rand -hex 32`
  - Audiobookshelf passwords: `openssl rand -base64 24`
- Restrict .env permissions: `chmod 600 .env`

**Audible Credentials:**
- Libation stores encrypted credentials in `AccountsSettings.json`
- Restrict config directory permissions: `chmod 700 /mnt/audiobooks/config/libation`
- Never log or expose activation bytes

**File Permissions:**
- Application configs: `chmod 700` (owner read/write/execute only)
- Audiobook library: `chmod 755` (owner read/write, others read)
- Log files: `chmod 640` (owner read/write, group read only)

### Container Security

**Run as Non-Root:**
- All containers should run as non-root user (UID 1000)
- Use `user: "1000:1000"` in docker-compose.yml where supported

**Resource Limits:**
- Set memory limits to prevent DoS: `mem_limit: 1g`
- Set CPU limits: `cpus: 1.0`
- Prevent fork bombs: `pids_limit: 100`

**Read-Only Filesystems (where applicable):**
- Caddy: `read_only: true` with tmpfs for /tmp
- MCP Server: Read-only mount for library directory

**Security Updates:**
- Use specific image tags (not `:latest`) for reproducibility
- Update images monthly: `docker compose pull && docker compose up -d`
- Subscribe to security mailing lists for used images

### Audit Logging

**What to Log:**
- All access attempts (successful and failed)
- Authentication events (login, logout, token generation)
- File access via MCP server
- Configuration changes
- Container restarts/crashes

**Log Retention:**
- Access logs: 30 days
- Error logs: 90 days
- Security events: 1 year

**Log Analysis:**
- Monitor for repeated failed login attempts (brute force)
- Alert on unusual access patterns (geographic, time-based)
- Track API rate limit violations

### Incident Response Plan

**If compromise suspected:**
1. Immediately disable external access (stop Caddy container)
2. Rotate all passwords and API tokens
3. Review access logs for unauthorized activity
4. Check for unauthorized file modifications: `find /mnt/audiobooks -type f -mtime -1`
5. Scan for malware: `clamscan -r /mnt/audiobooks`
6. Restore from backup if necessary
7. Update all containers and restart services

---

## MCP Server Specification for AI Agents

### Overview
The MCP server provides Claude AI agents with structured access to the audiobook library through both REST API and direct file system access.

### Architecture

```
Claude Desktop
      ↓
   MCP Proxy (stdio transport)
      ↓
   FastAPI MCP Server
      ↓
   ┌──────────────┬─────────────────┐
   │              │                 │
   v              v                 v
Audiobookshelf  File System     ffprobe
   API          (/library)     (metadata)
```

### MCP Tools Catalog

| Tool Name | Purpose | Input Parameters | Output |
|-----------|---------|------------------|--------|
| `list_libraries` | Get all audiobook libraries | None | Array of library objects |
| `list_audiobooks` | List books in library | library_id, filter (optional) | Array of audiobook objects |
| `search_audiobooks` | Full-text search | query, limit | Ranked search results |
| `get_audiobook_details` | Get detailed metadata | item_id | Complete audiobook object |
| `get_user_progress` | Get listening progress | None (uses auth token) | Progress array |
| `get_library_stats` | Get aggregate statistics | None | Statistics object |
| `read_audiobook_file` | Extract file metadata | file_path | FFprobe metadata JSON |
| `list_directory` | List library directory | path | File/directory listing |

### Example MCP Conversations

**Example 1: Library Overview**
```
User: What audiobooks do I have?
Claude: [Calls list_libraries, then list_audiobooks for each library]
Response: You have 150 audiobooks across 2 libraries. Your main library
contains 142 books including recent additions like "Project Hail Mary"
by Andy Weir and "The Hobbit" narrated by Andy Serkis. Your "Kids"
library has 8 books including several Harry Potter titles.
```

**Example 2: Search and Recommend**
```
User: Find me science fiction audiobooks over 10 hours long
Claude: [Calls search_audiobooks with query="science fiction", then
filters results by duration using get_audiobook_details]
Response: I found 12 science fiction audiobooks over 10 hours:
1. "Dune" by Frank Herbert (21h 2m) - Narrated by Scott Brick
2. "The Expanse: Leviathan Wakes" (19h 9m) - Narrated by Jefferson Mays
...
Would you like me to start playing any of these?
```

**Example 3: Progress Tracking**
```
User: What am I currently listening to?
Claude: [Calls get_user_progress]
Response: You're currently 35% through "The Hobbit" (15 hours 20 minutes
elapsed of 43 hours total). You last listened 2 days ago and left off
in Chapter 7: "Queer Lodgings". Would you like to resume?
```

**Example 4: File System Analysis**
```
User: How much disk space is my audiobook library using?
Claude: [Calls list_directory recursively, sums file sizes]
Response: Your audiobook library is using 487 GB across 150 titles.
The largest audiobook is "The Stand Unabridged" at 47 GB. You have
approximately 1,250 hours of listening content.
```

### Transport Configuration

**ASGI Transport (Claude Desktop):**
```json
{
  "mcpServers": {
    "audiobook-library": {
      "command": "mcp-proxy",
      "args": ["http://localhost:8000/mcp"]
    }
  }
}
```

**HTTP Transport (Web-based Claude):**
```
URL: https://audiobooks-api.yourdomain.com/mcp
Authentication: Bearer token in Authorization header
```

### Error Handling

MCP server returns structured errors:

```json
{
  "error": {
    "code": "AUDIOBOOK_NOT_FOUND",
    "message": "Audiobook with ID 'book_12345' not found",
    "details": {
      "item_id": "book_12345",
      "library_id": "lib_main"
    }
  }
}
```

**Error Codes:**
- `AUDIOBOOK_NOT_FOUND` - Requested audiobook doesn't exist
- `LIBRARY_NOT_FOUND` - Requested library doesn't exist
- `AUTHENTICATION_FAILED` - Invalid or missing API token
- `PATH_TRAVERSAL_DENIED` - Attempted access outside library directory
- `FILE_NOT_FOUND` - Requested file doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `UPSTREAM_SERVICE_ERROR` - Audiobookshelf API error

### Performance Characteristics

**Response Time Targets:**
- `list_libraries`: < 100ms
- `list_audiobooks`: < 300ms (for 500 books)
- `search_audiobooks`: < 500ms
- `get_audiobook_details`: < 200ms
- `get_user_progress`: < 150ms
- `get_library_stats`: < 500ms (aggregated queries)
- `read_audiobook_file`: < 1000ms (depends on file size, ffprobe execution)
- `list_directory`: < 200ms (for 100 files)

**Caching Strategy:**
- Library metadata: 15-minute TTL
- Audiobook details: 30-minute TTL
- User progress: No caching (always fresh)
- File metadata: 1-hour TTL

### Security Controls

**Authentication:**
- Every request requires valid Audiobookshelf API token
- Token validated on each request (no session state)
- Expired tokens rejected with `AUTHENTICATION_FAILED`

**Authorization:**
- Read-only access to library (no write/delete operations)
- Path traversal prevention (all file paths validated)
- Rate limiting: 100 requests/minute per client

**Audit Trail:**
- All MCP tool invocations logged with:
  - Timestamp
  - Tool name
  - Input parameters
  - Response code
  - Execution time
  - Client identifier (if available)

---

## Monitoring & Maintenance

### Health Checks

All containers include health checks:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**Monitor health:**
```bash
docker compose ps
# Look for "(healthy)" status
```

### Log Monitoring

**View logs:**
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f audiobookshelf

# Last 100 lines
docker compose logs --tail=100 caddy

# Since specific time
docker compose logs --since 2024-01-01T10:00:00 libation
```

**Log rotation configured via Docker:**
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Backup Strategy

**Daily automated backup:**
```bash
#!/bin/bash
# /home/chris/scripts/backup-audiobooks.sh

BACKUP_DIR="/mnt/backup/audiobooks"
DATE=$(date +%Y%m%d)

# Backup configurations
tar -czf "$BACKUP_DIR/config-$DATE.tar.gz" \
  /mnt/audiobooks/config \
  ~/audiobook-server/docker-compose.yml \
  ~/audiobook-server/Caddyfile \
  ~/audiobook-server/.env

# Backup Audiobookshelf database
docker compose exec -T audiobookshelf tar -czf - /config > \
  "$BACKUP_DIR/abs-db-$DATE.tar.gz"

# Retain only last 7 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

# Log backup completion
echo "$(date): Backup completed successfully" >> /var/log/audiobook-backup.log
```

**Cron job:**
```bash
# crontab -e
0 3 * * * /home/chris/scripts/backup-audiobooks.sh
```

### Update Procedure

**Monthly security updates:**
```bash
cd ~/audiobook-server

# Pull latest images
docker compose pull

# Recreate containers with new images
docker compose up -d

# Verify all containers healthy
docker compose ps

# Check logs for errors
docker compose logs --tail=50
```

### Troubleshooting Common Issues

**Issue: Audiobookshelf not accessible**
```bash
# Check container status
docker compose ps audiobookshelf

# Check logs
docker compose logs audiobookshelf

# Restart container
docker compose restart audiobookshelf
```

**Issue: Libation not downloading**
```bash
# Check credentials
cat /mnt/audiobooks/config/libation/AccountsSettings.json

# Check logs
docker compose logs libation

# Force manual scan
docker compose exec libation /usr/bin/LibationCli scan
```

**Issue: AAX conversion failing**
```bash
# Check activation bytes
echo $ACTIVATION_BYTES

# Check quarantine directory
ls -lh /mnt/audiobooks/quarantine/

# Test manual conversion
docker compose exec aax-converter AAXtoMP3 --authcode $ACTIVATION_BYTES --single /raw/test.aax
```

**Issue: Let's Encrypt certificate failure**
```bash
# Check DNS resolution
nslookup audiobooks.yourdomain.com

# Check port 80 accessibility
curl -I http://audiobooks.yourdomain.com

# Check Caddy logs
docker compose logs caddy | grep -i certificate

# Force certificate renewal
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
```

**Issue: MCP server not responding**
```bash
# Check health
curl http://localhost:8000/health

# Check logs
docker compose logs mcp-server

# Test authentication
curl -H "Authorization: Bearer $AUDIOBOOKSHELF_TOKEN" \
  http://localhost:8000/api/libraries

# Restart MCP server
docker compose restart mcp-server
```

---

## Conclusion

This PRD provides a comprehensive blueprint for building a production-grade audiobook server infrastructure with:

- **Automated Acquisition:** Libation downloads new Audible purchases automatically
- **Automated Conversion:** AAXtoMP3 converts to open formats preserving metadata
- **Streaming Server:** Audiobookshelf provides multi-user streaming with mobile apps
- **Secure External Access:** Caddy provides automatic HTTPS with Let's Encrypt
- **AI Integration:** MCP server enables Claude agents to query and analyze the library

**Total Implementation Time:** 20-30 hours over 3-5 days

**Ongoing Maintenance:** ~2 hours/month (updates, monitoring, backups)

**Recommended Next Steps After Implementation:**
1. Set up automated daily backups
2. Configure monitoring/alerting (uptime monitoring, disk space alerts)
3. Test disaster recovery procedure
4. Create user documentation for family members
5. Optimize library organization (collections, series, playlists)

---

**Document Version:** 1.0
**Last Updated:** 2025-12-27
**Status:** Ready for Implementation
