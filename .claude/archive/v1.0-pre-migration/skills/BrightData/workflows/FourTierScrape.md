# Five-Tier URL Content Scraping

**Purpose:** Progressive escalation strategy to retrieve URL content using five fallback tiers

**When to Use:**
- User requests scraping or fetching content from any URL
- Standard methods are failing or blocked
- Site has bot detection or access restrictions
- Need reliable content extraction in markdown format

**Prerequisites:**
- URL to scrape (provided by user)
- WebFetch tool (built-in)
- Firecrawl MCP available
- Bash tool for curl commands
- Browser automation capability (Playwright)
- Bright Data MCP available

---

## Workflow Steps

### Step 1: Tier 1 - WebFetch (Fast & Simple)

**Description:** Attempt to fetch URL using Claude Code's built-in WebFetch tool

**Actions:**
```
Use WebFetch tool with:
- URL: [user-provided URL]
- Prompt: "Extract all content from this page and convert to markdown"
```

**Expected Outcomes:**
- **Success:** Content retrieved in markdown format → Skip to Step 6 (Output)
- **Failure:** WebFetch blocked, timeout, or error → Proceed to Step 2 (Tier 2)

**Typical Success Cases:**
- Public websites without bot detection
- Simple content sites
- Sites with permissive access policies

**Typical Failure Cases:**
- Sites with user-agent filtering
- Sites with basic bot detection
- Sites requiring specific headers

---

### Step 2: Tier 2 - Firecrawl (LLM-Ready Output)

**Description:** Use Firecrawl MCP for optimized LLM-ready markdown output with JS rendering

**Actions:**
```
Use mcp__firecrawl__scrape tool with:
- URL: [user-provided URL]
- Format: markdown (default)
```

**What Firecrawl Provides:**
- Clean markdown output optimized for LLMs
- JavaScript rendering built-in
- Automatic content cleaning (removes ads, popups)
- Structured data extraction capability
- Site crawling (multi-page) when needed

**Expected Outcomes:**
- **Success:** Clean markdown content → Skip to Step 6 (Output)
- **Failure:** Blocked or timeout → Proceed to Step 3 (Tier 3)

**Typical Success Cases:**
- Most modern websites
- JavaScript-heavy sites (React, Vue, Angular)
- Sites needing clean markdown for AI processing
- Multi-page crawling needs

**Typical Failure Cases:**
- Sites with aggressive Cloudflare protection
- Sites with CAPTCHA
- Sites requiring residential IPs

---

### Step 3: Tier 3 - Customized Curl (Chrome-like Headers)

**Description:** Use curl with comprehensive Chrome browser headers to bypass basic bot detection

**Actions:**
```bash
curl -L -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
  -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8" \
  -H "Accept-Language: en-US,en;q=0.9" \
  -H "Accept-Encoding: gzip, deflate, br" \
  -H "DNT: 1" \
  -H "Connection: keep-alive" \
  -H "Upgrade-Insecure-Requests: 1" \
  -H "Sec-Fetch-Dest: document" \
  -H "Sec-Fetch-Mode: navigate" \
  -H "Sec-Fetch-Site: none" \
  -H "Sec-Fetch-User: ?1" \
  -H "Cache-Control: max-age=0" \
  --compressed \
  "[URL]"
```

**Header Explanation:**
- **User-Agent:** Latest Chrome on macOS (most common, least suspicious)
- **Accept headers:** Legitimate browser accept patterns
- **Sec-Fetch-* headers:** Chrome's security headers (critical for bypassing detection)
- **DNT:** Do Not Track (common privacy setting)
- **--compressed:** Handle gzip/br encoding like real browsers

**Expected Outcomes:**
- **Success:** HTML content retrieved → Convert to markdown → Skip to Step 6 (Output)
- **Failure:** Still blocked, CAPTCHA, or JavaScript required → Proceed to Step 4 (Tier 4)

**Typical Success Cases:**
- Sites with basic user-agent checking
- Sites with simple header validation
- Sites without JavaScript rendering requirements

**Typical Failure Cases:**
- Sites with CAPTCHA
- Sites requiring JavaScript execution
- Sites with advanced fingerprinting
- Sites with IP-based rate limiting

---

### Step 4: Tier 4 - Browser Automation (Playwright)

**Description:** Use full browser automation with Playwright to handle JavaScript-heavy sites

**Actions:**
```typescript
// Use browser automation to navigate to URL and extract content
// Playwright provides full Chrome/Firefox browser automation
// Handles JavaScript rendering, dynamic content, and complex interactions
```

**What Browser Automation Provides:**
- Real browser execution (Chrome/Firefox)
- Full JavaScript rendering and execution
- DOM manipulation and dynamic content loading
- Cookie/session handling
- Screenshot and PDF capabilities
- Network request interception
- Proper browser fingerprinting

**Expected Outcomes:**
- **Success:** Content extracted from fully rendered page → Convert to markdown → Skip to Step 6 (Output)
- **Failure:** CAPTCHA or advanced bot detection → Proceed to Step 5 (Tier 5)

**Typical Success Cases:**
- Single-page applications (SPAs)
- Sites with heavy JavaScript frameworks (React, Vue, Angular)
- Sites with dynamic content loading
- Sites requiring cookies/sessions
- Sites with complex DOM structures

**Typical Failure Cases:**
- Sites with CAPTCHA challenges
- Sites with advanced bot detection that fingerprint browser automation
- Sites requiring residential IP addresses
- Sites with aggressive rate limiting based on datacenter IPs

---

### Step 5: Tier 5 - Bright Data MCP (Professional Scraping)

**Description:** Use Bright Data MCP's professional scraping service with bot detection bypass

**Actions:**
```
Use mcp__Brightdata__scrape_as_markdown tool with:
- URL: [user-provided URL]
```

**What Bright Data Provides:**
- Residential proxy network (real IP addresses)
- Automatic CAPTCHA solving
- JavaScript rendering (headless browser)
- Anti-bot detection bypass
- Automatic retry logic
- Content extraction and markdown conversion

**Expected Outcomes:**
- **Success:** Content retrieved in markdown format → Proceed to Step 6 (Output)
- **Failure:** Extremely rare - site may be completely inaccessible or down

**Typical Success Cases:**
- Sites with CAPTCHA challenges
- Sites with advanced bot detection and fingerprinting
- Sites requiring residential IP addresses
- Sites with aggressive rate limiting
- Any site that blocked Tiers 1-4

**Typical Failure Cases:**
- Site is completely down
- Site requires authentication (login)
- Site has legal restrictions (e.g., paywall, geographic restrictions)

---

### Step 6: Output & Verification

**Description:** Present retrieved content to user with tier information

**Actions:**
- Present content in markdown format
- Indicate which tier was successful
- Provide any warnings or notes about content quality

**Verification:**
- Content is readable and properly formatted
- Content matches expected URL
- No major sections missing

**Example Output:**
```markdown
Successfully retrieved content from [URL] using Tier [1/2/3/4/5]

[Content in markdown format...]
```

---

## Outputs

**Primary Output:**
- URL content in markdown format
- Includes title, headers, paragraphs, links, images (as markdown)

**Metadata:**
- Which tier was successful
- Any warnings or notes
- Execution time

**Where outputs are stored:**
- Returned directly to user in conversation
- No persistent storage (unless user requests it)

---

## Decision Logic

```
START
  ↓
Attempt Tier 1 (WebFetch)
  ↓
Success? → Yes → Return content ✓
  ↓
  No
  ↓
Attempt Tier 2 (Firecrawl)
  ↓
Success? → Yes → Return content ✓
  ↓
  No
  ↓
Attempt Tier 3 (Curl + Chrome Headers)
  ↓
Success? → Yes → Return content ✓
  ↓
  No
  ↓
Attempt Tier 4 (Browser Automation)
  ↓
Success? → Yes → Return content ✓
  ↓
  No
  ↓
Attempt Tier 5 (Bright Data MCP)
  ↓
Success? → Yes → Return content ✓
  ↓
  No
  ↓
Report failure + suggest alternatives
```

---

## Error Handling

**If Tier 1 Fails:**
- Log failure reason (blocked, timeout, error)
- Automatically proceed to Tier 2
- No user intervention required

**If Tier 2 Fails:**
- Log failure reason
- Automatically proceed to Tier 3
- No user intervention required

**If Tier 3 Fails:**
- Log failure reason
- Automatically proceed to Tier 4
- No user intervention required

**If Tier 4 Fails:**
- Log failure reason
- Automatically proceed to Tier 5
- No user intervention required

**If Tier 5 Fails:**
- Report to user that site is inaccessible
- Suggest alternatives:
  - Check if URL is correct
  - Check if site requires authentication
  - Check if site has geographic restrictions
  - Try accessing manually in browser to verify site is up

---

## Optimization Notes

**When to Skip Tiers:**
- If user explicitly requests "use Firecrawl" → Skip directly to Tier 2
- If user explicitly requests "use Bright Data" → Skip directly to Tier 5
- If user explicitly requests "use browser" → Skip to Tier 4
- If previous scrape of same domain failed at Tier 1 → Start at Tier 2
- If URL is known SPA or JavaScript-heavy → Consider starting at Tier 2 (Firecrawl)
- If URL is known difficult site with CAPTCHA → Consider starting at Tier 5
- If need multi-page crawling → Use Tier 2 (Firecrawl) directly

**Cost Considerations:**
- Tier 1: Free (built-in)
- Tier 2: Firecrawl credits (500 free/month, then $19+/month)
- Tier 3: Free (built-in)
- Tier 4: Free (local browser automation)
- Tier 5: Uses Bright Data credits (usage-based)
- Always try cheaper tiers first unless user specifies otherwise

**Performance:**
- Tier 1: ~2-5 seconds
- Tier 2: ~5-10 seconds (best quality/speed ratio for LLM output)
- Tier 3: ~3-7 seconds
- Tier 4: ~10-20 seconds
- Tier 5: ~5-15 seconds
- Total worst-case: ~50 seconds for all five attempts

---

## Related Workflows

- None (this is the primary workflow for brightdata skill)

**Future Enhancements:**
- Add caching layer to avoid re-scraping same URLs
- Add batch scraping for multiple URLs
- Add domain-specific optimizations (known difficult sites)
- Add custom header profiles for different site types

---

## Examples

**Example 1: Public Site (Tier 1 Success)**

Input: https://example.com

Process:
1. Attempt Tier 1 (WebFetch)
2. Success in 3 seconds
3. Return content

Output:
```markdown
Successfully retrieved content from https://example.com using Tier 1 (WebFetch)

# Example Domain

This domain is for use in illustrative examples...
```

**Example 2: Modern Web App (Tier 2 Success)**

Input: https://modern-webapp.com

Process:
1. Attempt Tier 1 (WebFetch) → Partial content (JavaScript not rendered)
2. Attempt Tier 2 (Firecrawl) → Success in 7 seconds
3. Return clean markdown

Output:
```markdown
Successfully retrieved content from https://modern-webapp.com using Tier 2 (Firecrawl)

Note: Content retrieved with JavaScript rendering and optimized for LLM consumption.

# Modern Web App

[Clean markdown content...]
```

**Example 3: JavaScript-Heavy Site (Tier 4 Success)**

Input: https://complex-spa.com

Process:
1. Attempt Tier 1 (WebFetch) → Blocked (403)
2. Attempt Tier 2 (Firecrawl) → Timeout
3. Attempt Tier 3 (Curl) → Returns empty (JavaScript required)
4. Attempt Tier 4 (Browser Automation) → Success in 15 seconds
5. Return content

Output:
```markdown
Successfully retrieved content from https://complex-spa.com using Tier 4 (Browser Automation)

Note: This site requires full browser rendering. Content was retrieved using Playwright.

# SPA Site Content

[Content retrieved successfully...]
```

**Example 4: Protected Site with CAPTCHA (Tier 5 Success)**

Input: https://protected-site.com

Process:
1. Attempt Tier 1 (WebFetch) → Blocked (403)
2. Attempt Tier 2 (Firecrawl) → Blocked (Cloudflare)
3. Attempt Tier 3 (Curl) → Blocked (bot detection)
4. Attempt Tier 4 (Browser Automation) → Blocked (CAPTCHA)
5. Attempt Tier 5 (Bright Data) → Success in 12 seconds
6. Return content

Output:
```markdown
Successfully retrieved content from https://protected-site.com using Tier 5 (Bright Data MCP)

Note: This site has advanced bot detection and CAPTCHA. Content was retrieved using professional scraping service.

# Protected Site Content

[Content retrieved successfully...]
```

**Example 5: Explicit Firecrawl Request**

Input: "Use Firecrawl to scrape https://any-site.com"

Process:
1. User explicitly requested Firecrawl
2. Skip directly to Tier 2
3. Success in 6 seconds
4. Return content

Output:
```markdown
Retrieved content from https://any-site.com using Tier 2 (Firecrawl) as requested

[Clean LLM-ready markdown content...]
```

**Example 6: Multi-Page Crawl Request**

Input: "Crawl the entire docs section of https://docs-site.com"

Process:
1. Multi-page crawl requested → Use Tier 2 (Firecrawl) directly
2. Firecrawl crawls sitemap/links
3. Returns aggregated content
4. Success

Output:
```markdown
Crawled 15 pages from https://docs-site.com/docs using Tier 2 (Firecrawl)

[Aggregated documentation content...]
```

---

**Last Updated:** 2025-12-31
