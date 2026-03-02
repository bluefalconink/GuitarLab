# Contributing to GuitarLab

Thanks for your interest in contributing to **GuitarLab**, a Falconverse plugin by **BlueFalconInk LLC**!

## Code of Conduct

We are committed to providing a welcoming and inclusive community. All contributors must adhere to the following principles:

- **Respect**: Treat all community members with respect and professionalism
- **Inclusivity**: Welcome contributions from all backgrounds
- **Transparency**: Communicate openly and honestly
- **Accountability**: Hold ourselves to the highest standards

Violations should be reported to [conduct@bluefalconink.com](mailto:conduct@bluefalconink.com).

---

## Getting Started

### 1. Fork & Clone
```bash
git clone https://github.com/bluefalconink/GuitarLab.git
cd GuitarLab
```

### 2. Set Up Development Environment
```bash
# Backend
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8001

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 3. Make Your Changes
- Create a feature branch: `git checkout -b feature/your-feature-name`
- Follow the [Development Guidelines](#development-guidelines) below
- Commit often with clear, descriptive messages

### 4. Test Locally
```bash
# Backend unit tests (when available)
cd backend
pytest tests/

# Frontend tests
cd frontend
npm test

# Type checking
npx tsc --noEmit
```

### 5. Submit a Pull Request
- Push your branch to your fork
- Open a pull request to `main` branch
- Reference any related issues (e.g., `Fixes #42`)
- Provide a clear description of changes
- Ensure CI checks pass

---

## Development Guidelines

### Code Style

#### Python (Backend)
- Follow [PEP 8](https://pep8.org/)
- Use type hints on all function signatures
- Docstrings for all public functions (Google style)
- Max line length: 100 characters

```python
def analyze_guitar(image_path: str, model: str = "default") -> dict[str, Any]:
    """
    Analyze a guitar image and return hardware identification.
    
    Args:
        image_path: Path to guitar image file.
        model: ML model to use for inference.
        
    Returns:
        Dictionary with hardware type and confidence scores.
    """
    # Implementation ...
    pass
```

#### JavaScript/React (Frontend)
- Use [Prettier](https://prettier.io/) for formatting
- Use ESLint with the provided config
- Prefer functional components and hooks
- Add PropTypes or TypeScript for all components

```javascript
/**
 * Guitar hardware analysis result display.
 * @param {Object} props
 * @param {string} props.hardwareType - Type of hardware identified
 * @param {number} props.confidence - Confidence score 0-1
 */
export default function HardwareResult({ hardwareType, confidence }) {
  // Implementation ...
}
```

### Commit Messages
- Use the [Conventional Commits](https://www.conventionalcommits.org/) format
- Prefix: `feat|fix|docs|style|refactor|test|chore`
- Example: `feat: allow users to specify tuning preferences`
- Keep subject line under 72 characters
- Add body explaining *why* (not what) if needed

### Branch Naming
- Feature: `feature/agent-improvement`
- Bug fix: `bugfix/session-loss-on-reload`
- Documentation: `docs/add-security-guide`
- Chore: `chore/update-dependencies`

---

## Architecture & Design Patterns

### Agent Development
When adding new agents or enhancing existing ones:

1. **Extend `BaseAgent`**: All agents inherit from the base class
2. **Override `system_prompt` property**: Define agent personality and constraints
3. **Implement safety checks**: Use `get_safety_refusal()` pattern for sensitive operations
4. **Test Sacred Order enforcement**: Verify step ordering for Luthier agent
5. **Add RAG context**: Include relevant knowledge base documents in prompts

Example:
```python
class NewExpertAgent(BaseAgent):
    """Documentation for your new agent."""
    
    @property
    def system_prompt(self) -> str:
        return """You are the [Role], an expert in [Domain].
        
        Rules:
        1. Always be respectful
        2. Refuse unsafe requests
        """
    
    def get_safety_refusal(self) -> str | None:
        # Check for keywords that require refusal
        # Return refusal string or None if safe
        pass
    
    def build_context(self) -> str:
        # Inject relevant knowledge base info
        return super().build_context()
```

### Upload Handling
All file uploads must:
1. Validate MIME type against whitelist
2. Verify file size <= 10MB
3. Use Pillow to verify image integrity
4. Store with UUID filename in `backend/uploads/`
5. Return URL path for reference in chat

### Error Handling
- Never expose stack traces to frontend
- Always return proper HTTP status codes
- Log errors server-side with context
- Use error boundary component for React

---

## Testing Expectations

### What to Test
- ✅ Agent response quality and safety
- ✅ Upload validation and storage
- ✅ Session state persistence
- ✅ RAG knowledge retrieval
- ✅ Error states and boundaries

### Running Tests
```bash
# Backend
cd backend && python -m pytest tests/ -v

# Frontend
cd frontend && npm test -- --coverage

# End-to-end (with servers running)
npm run e2e
```

### Coverage Requirements
- **Minimum**: 70% statement coverage
- **Target**: 85%+ on new code
- Excluded: vendor code, types, fixtures

---

## Documentation

### What to Document
- ✅ New features in inline code comments
- ✅ Complex algorithms in dedicated docs
- ✅ API changes in code + CHANGELOG
- ✅ Configuration options in `.env.example`

### Docs Style
- Use Markdown for readability
- Include examples for complex features
- Keep docs in sync with code
- Architecture diagrams auto-generate via `architecture.yml` workflow

---

## Before Your PR Gets Merged

1. **Code Review**: Two approvals from maintainers
2. **CI Checks**: All GitHub Actions must pass
   - Linting (ESLint, Pylint)
   - Type checking (Pyright, tsc)
   - Tests pass
   - No security vulnerabilities (Dependabot, Safety)
3. **Architecture Alignment**: Diagram workflow runs successfully
4. **Foreman Compliance**: Auto-generated docs pass Foreman audit
5. **Documentation**: README/DEPLOYMENT updated if needing
6. **Changelog**: PR description clearly explains changes

---

## Security Contributions

Found a vulnerability? **Do not open a public issue.**

Instead:
1. Report privately to [security@bluefalconink.com](mailto:security@bluefalconink.com)
2. Or use GitHub's private [Security Advisory](https://github.com/bluefalconink/GuitarLab/security/advisories)
3. Provide: description, reproduction steps, impact, suggested fix
4. We'll acknowledge within 48 hours

Thank you for helping keep GuitarLab secure!

---

## Questions?

- **Discussions**: [GitHub Discussions](https://github.com/bluefalconink/GuitarLab/discussions)
- **Email**: [contributors@bluefalconink.com](mailto:contributors@bluefalconink.com)
- **Discord**: [BlueFalconInk Community](https://discord.gg/bluefalconink)

---

**Happy contributing! 🎸**

*Last updated: March 2, 2026*
