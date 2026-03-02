# Security Policy

## Reporting a Vulnerability

**Do not** open a public GitHub issue for security vulnerabilities.

Instead, please report security issues to:
- **Email**: [security@bluefalconink.com](mailto:security@bluefalconink.com)
- **GitHub Security Advisory**: [Private vulnerability reporting](https://github.com/bluefalconink/GuitarLab/security/advisories)

Please include:
- Description of the vulnerability
- Steps to reproduce
- Impact assessment
- Suggested remediation (if any)

We will acknowledge receipt within **48 hours** and provide a security patch or workaround within **7 days** for critical issues.

---

## Security Considerations for GuitarLab MVP

This is a **Falconverse plugin MVP** with the following known constraints and recommendations:

### Current Implementation

#### ✅ What is Implemented
- **Input Validation**: File type, size, and Pillow verification on uploads
- **Error Boundaries**: Graceful degradation across all async operations
- **Safety Warnings**: Truss rod warnings, tube amp keyword blocking, soldering safety
- **API Error Codes**: Proper HTTP status codes (422, 400, 404) for all error conditions

#### ⚠️ MVP Limitations (Non-Production)
- **No authentication**: API is open access
- **No rate limiting**: Requests are unbounded
- **In-memory sessions**: Lost on server restart
- **No HTTPS enforcement**: Local dev setup HTTP-only
- **No database**: Uploads and sessions are ephemeral

### Before Production Deployment

**You must implement:**
1. **Authentication & Authorization**
   - OAuth 2.0 or API keys for user identity
   - RBAC (role-based access control) for endpoints
   
2. **Rate Limiting**
   - Per-user/IP request quotas
   - Token bucket or sliding window algorithm
   - 429 (Too Many Requests) responses
   
3. **Session Persistence**
   - Redis or PostgreSQL for session state
   - TTL and cleanup policies
   - Encrypted session cookies
   
4. **Data Protection**
   - HTTPS/TLS for all endpoints
   - Encrypt uploaded files at rest
   - Set `secure`, `samesite`, and `httponly` flags on cookies
   - PII handling policy
   
5. **Audit & Monitoring**
   - Structured logging (JSON format)
   - Error tracking (Sentry, DataDog, etc.)
   - Performance monitoring
   - Security event alerts
   
6. **API Hardening**
   - Input sanitization across all endpoints
   - Injection attack prevention
   - CORS policy tightening
   - Request size limits
   - Timeout policies
   
7. **Dependency Management**
   - Lock dependency versions
   - Regular security updates (Dependabot)
   - Vulnerability scanning (npm audit, Safety)
   - SBOM generation

### Secrets Management

- **Never commit `.env` files** (`.gitignore` excludes them)
- Use GitHub Actions Secrets for CI/CD
- Rotate keys quarterly minimum
- Use asymmetric cryptography for sensitive operations

### Known Security Notes

#### Gemini API Key Exposure
- Your `GEMINI_API_KEY` is needed for the backend to function
- Store it **only** in environment variables or GitHub Secrets
- Never log it
- Consider quota limits and billing alerts on your GCP account

#### Image Upload Safety
- Currently stores uploads in `backend/uploads/` locally
- **For production**: Use object storage (GCS, S3) with CDN
- Implement virus/malware scanning (ClamAV, etc.)
- Sanitize metadata (EXIF data) before serving

#### AI Model Safety
- Google Gemini responses are not guaranteed safe
- Implement output filtering for sensitive topics
- Log all prompts and responses for audit
- Set up guardrails via system prompts (already in place for tube amp keywords)

---

## Compliance & Standards

This project aligns with:
- **BlueFalconInk LLC** architecture and governance standards
- **OWASP Top 10** mitigation patterns
- **NIST Cybersecurity Framework** core functions
- **CWE/SANS Top 25** vulnerability prevention

---

## Security Headers for Production

When deploying, recommend these HTTP headers:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## Contact

- **Security Lead**: [security@bluefalconink.com](mailto:security@bluefalconink.com)
- **GitHub Org**: [BlueFalconInk LLC](https://github.com/bluefalconink/)
- **Architecture Standards**: [Architect AI Pro](https://architect-ai-pro-mobile-edition-484078543321.us-west1.run.app/)

---

*Last updated: March 2, 2026*
