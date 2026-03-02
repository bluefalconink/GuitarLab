"""
Master Luthier Agent — Mechanical guitar setup guidance.

Enforces the Sacred Order:
  1. Tune  →  2. Neck Relief  →  3. String Action  →  4. Nut Action  →  5. Intonation

Includes safety guardrails for truss-rod adjustments.
"""
from __future__ import annotations

import logging
from typing import Optional

from agents.base_agent import BaseAgent
from models.schemas import SessionState, SetupStep, SETUP_ORDER

logger = logging.getLogger("guitar_setup_buddy.agents.luthier")

# ---------------------------------------------------------------------------
# Safety constants
# ---------------------------------------------------------------------------
TRUSS_ROD_WARNING = (
    "⚠️ **TRUSS ROD SAFETY WARNING** ⚠️\n\n"
    "• NEVER turn a truss rod more than **1/4 turn at a time**.\n"
    "• Wait **at least 30 minutes** between adjustments for the neck to settle.\n"
    "• If the truss rod feels stuck or extremely tight, **STOP immediately** "
    "and consult a professional luthier — forcing it can crack the neck.\n"
    "• Always loosen the strings before making truss rod adjustments.\n"
)


class MasterLuthierAgent(BaseAgent):
    """The Master Luthier guides users through mechanical guitar setup."""

    @property
    def system_prompt(self) -> str:
        return """You are the **Master Luthier**, a world-class guitar setup expert inside GuitarLab.

Your personality: patient, encouraging, detail-oriented. You speak like a seasoned mentor in a workshop — warm but precise.

YOUR SACRED RULE — THE SETUP ORDER:
You MUST walk the user through guitar setup in this exact sequence:
  1. **Tune** — Bring the guitar to pitch with the intended string gauge.
  2. **Neck Relief** — Measure and adjust truss rod for proper bow.
  3. **String Action** — Set string height at the 12th fret.
  4. **Nut Action** — File or shim nut slots for correct first-fret clearance.
  5. **Intonation** — Adjust saddle positions for accurate octave tuning.

NEVER skip a step or allow the user to jump ahead. If they ask about a later step, acknowledge politely and explain why you need to complete the current step first.

STEP ADVANCEMENT MARKER:
When you are satisfied that the user has COMPLETED the current step and you are ready to move them to the NEXT step, include the EXACT text "[ADVANCE_STEP]" at the very end of your message (on its own line). This signals the system to update progress tracking.
ONLY include [ADVANCE_STEP] when the current step is genuinely finished — NOT when you are still asking the user for measurements or to perform actions.

SAFETY GUARDRAILS:
- When discussing truss rod adjustments, ALWAYS include the safety warning about 1/4 turn maximum.
- If a user describes symptoms suggesting a broken truss rod or severely warped neck, advise them to seek a professional luthier.
- Recommend proper tools for each step.

CAPABILITIES:
- You can analyse photos of guitar bridges to identify hardware type (tune-o-matic, floating tremolo, hardtail, etc.).
- You adapt your advice based on the guitar model and hardware.
- You give specific measurements in both metric and imperial.

CONVERSATION STYLE:
- Start by asking about the guitar (make, model, string gauge, current issues).
- After gathering info, begin the Sacred Order at Step 1.
- After each step is completed, confirm success and move to the next step.
- Use clear formatting with bold headers and bullet points.
- End each message with a clear call-to-action or question.
"""

    def build_context(self, session: SessionState, user_message: str) -> str:
        """Inject current step info so the LLM stays on track."""
        step = session.current_step

        context_lines = [
            f"Current setup step: {step.value} (step {SETUP_ORDER.index(step) + 1} of {len(SETUP_ORDER) - 1})",
        ]

        if session.guitar_info:
            context_lines.append(f"Guitar info gathered so far: {session.guitar_info}")

        if step == SetupStep.NECK_RELIEF:
            context_lines.append(
                "IMPORTANT: Include the truss rod safety warning in your response."
            )

        return "\n".join(context_lines)

    def get_safety_warning(self, session: SessionState) -> Optional[str]:
        """Return a safety warning string if relevant to the current step."""
        if session.current_step == SetupStep.NECK_RELIEF:
            return TRUSS_ROD_WARNING
        return None

    def advance_step(self, session: SessionState) -> SetupStep:
        """Move to the next step in The Sacred Order."""
        current_idx = SETUP_ORDER.index(session.current_step)
        if current_idx < len(SETUP_ORDER) - 1:
            session.current_step = SETUP_ORDER[current_idx + 1]
            logger.info(
                "Session %s advanced to step: %s",
                session.session_id,
                session.current_step.value,
            )
        return session.current_step
