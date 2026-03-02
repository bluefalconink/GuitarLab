"""
Base Agent — shared logic for all GuitarLab agents.
Uses Google Gemini API for AI generation.
"""
from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from typing import Optional

import google.generativeai as genai

from config import settings
from models.schemas import ChatMessage, SessionState

logger = logging.getLogger("guitar_setup_buddy.agents")

# Configure the Gemini SDK once at module level
genai.configure(api_key=settings.GEMINI_API_KEY)


class BaseAgent(ABC):
    """Abstract base class for all specialised agents."""

    def __init__(self):
        self.model_name = settings.AI_MODEL
        self.max_tokens = settings.MAX_TOKENS

    @property
    @abstractmethod
    def system_prompt(self) -> str:
        """Return the system prompt for this agent."""
        ...

    @abstractmethod
    def build_context(self, session: SessionState, user_message: str) -> str:
        """Build any extra context to inject before the user message."""
        ...

    async def chat(
        self,
        user_message: str,
        session: SessionState,
        image_url: Optional[str] = None,
        rag_context: Optional[str] = None,
    ) -> str:
        """Send a message to the Gemini API and return the assistant reply."""
        logger.info(
            "Agent chat | session=%s agent=%s step=%s",
            session.session_id,
            session.agent.value,
            getattr(session, "current_step", None),
        )

        # Build the conversation history and current message
        contents = self._build_contents(session, user_message, image_url, rag_context)

        try:
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=self.system_prompt,
                generation_config=genai.GenerationConfig(
                    max_output_tokens=self.max_tokens,
                    temperature=0.7,
                ),
            )

            response = model.generate_content(contents)
            reply = response.text
            logger.info("Agent reply received (%d chars)", len(reply))
            return reply

        except Exception as e:
            error_str = str(e).lower()
            if "api key" in error_str or "authentication" in error_str:
                logger.error("Gemini API authentication error: %s", e)
                return (
                    "⚠️ API key issue — please check that your `GEMINI_API_KEY` "
                    "is set correctly in the `.env` file."
                )
            elif "quota" in error_str or "rate" in error_str:
                logger.error("Gemini API rate/quota error: %s", e)
                return (
                    "I'm being rate-limited right now. "
                    "Please wait a moment and try again."
                )
            else:
                logger.exception("Unexpected error in agent chat: %s", e)
                return (
                    "Something went wrong on my end. "
                    "Please try again or refresh the page."
                )

    def _build_contents(
        self,
        session: SessionState,
        user_message: str,
        image_url: Optional[str] = None,
        rag_context: Optional[str] = None,
    ) -> list[dict]:
        """Convert session history + current message into Gemini content format.

        Gemini uses a list of {'role': 'user'|'model', 'parts': [...]} dicts.
        """
        contents: list[dict] = []

        # Replay history (last 20 messages to stay within context limits)
        for msg in session.history[-20:]:
            role = "model" if msg.role == "assistant" else "user"
            contents.append({"role": role, "parts": [msg.content]})

        # Build current user turn
        extra_context = self.build_context(session, user_message)
        parts: list = []

        if rag_context:
            parts.append(f"[Reference Material]\n{rag_context}\n")

        if extra_context:
            parts.append(f"[Agent Context]\n{extra_context}\n")

        if image_url:
            # For MVP, pass the image URL as a text reference.
            # Gemini multimodal with uploaded files can be added in a future iteration.
            parts.append(
                f"[The user has uploaded an image of their guitar hardware. "
                f"Image URL: {image_url}. Please ask clarifying questions about "
                f"the hardware if you cannot see the image directly.]"
            )

        parts.append(user_message)
        contents.append({"role": "user", "parts": parts})

        return contents
