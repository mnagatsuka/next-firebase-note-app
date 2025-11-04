"""Logging configuration helpers."""
from __future__ import annotations

import logging
from logging.config import dictConfig
from .config import settings


def configure_logging() -> None:
    """Configure application-wide structured logging.

    Uses LOG_LEVEL from environment via settings.
    """
    level = getattr(logging, settings.log_level.upper(), logging.INFO)
    dictConfig(
        {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "default": {
                    "format": "%(asctime)s %(levelname)s [%(name)s] %(message)s",
                }
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "formatter": "default",
                    "level": level,
                }
            },
            "root": {
                "handlers": ["console"],
                "level": level,
            },
        }
    )

