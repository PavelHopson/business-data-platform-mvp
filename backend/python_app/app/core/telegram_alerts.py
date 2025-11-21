import asyncio
import logging
from typing import Optional, Dict, Any
from datetime import datetime
import httpx
from app.config import settings

logger = logging.getLogger(__name__)


class TelegramAlerter:
    

    def __init__(
        self,
        bot_token: Optional[str] = None,
        chat_id: Optional[str] = None,
        enabled: bool = False,
    ):
        self.bot_token = bot_token or getattr(settings, "TELEGRAM_BOT_TOKEN", None)
        self.chat_id = chat_id or getattr(settings, "TELEGRAM_CHAT_ID", None)
        settings_enabled = getattr(settings, "TELEGRAM_ALERTS_ENABLED", "false")
        if isinstance(settings_enabled, str):
            settings_enabled = settings_enabled.lower() == 'true'
        self.enabled = enabled or settings_enabled
        
        # Если переменные окружения установлены, но settings не загрузил их
        import os
        if not self.bot_token:
            self.bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
        if not self.chat_id:
            self.chat_id = os.getenv('TELEGRAM_CHAT_ID')
        # Всегда проверяем переменные окружения для enabled
        env_enabled = os.getenv('TELEGRAM_ALERTS_ENABLED', 'false').lower() == 'true'
        if env_enabled:
            self.enabled = True
        self.api_url = (
            f"https://api.telegram.org/bot{self.bot_token}/sendMessage"
            if self.bot_token
            else None
        )

        if self.enabled and (not self.bot_token or not self.chat_id):
            logger.warning(
                f"Telegram alerts are enabled but bot_token or chat_id is missing. "
                f"Bot token: {bool(self.bot_token)}, Chat ID: {bool(self.chat_id)}"
            )
            self.enabled = False
        
        # Отладочная информация
        logger.debug(f"TelegramAlerter initialized: enabled={self.enabled}, "
                    f"bot_token={'***' if self.bot_token else None}, "
                    f"chat_id={self.chat_id}, api_url={bool(self.api_url)}")

    async def send_alert(
        self,
        message: str,
        level: str = "ERROR",
        context: Optional[Dict[str, Any]] = None,
    ) -> bool:
        
        if not self.enabled or not self.api_url:
            logger.debug("Telegram alerts disabled, skipping notification")
            return False

        try:
            emoji_map = {
                "CRITICAL": "🔥",
                "ERROR": "❌",
                "WARNING": "⚠️",
                "INFO": "ℹ️",
            }
            emoji = emoji_map.get(level, "📢")

            formatted_message = f"{emoji} *{level}* - Company API Alert\n\n"
            formatted_message += f"*Message:* {message}\n"
            formatted_message += f"*Time:* {datetime.utcnow().isoformat()}Z\n"
            formatted_message += f"*Environment:* {settings.ENVIRONMENT}\n"

            if context:
                formatted_message += "\n*Context:*\n"
                for key, value in context.items():
                    formatted_message += f"• {key}: `{value}`\n"

            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    self.api_url,
                    json={
                        "chat_id": self.chat_id,
                        "text": formatted_message,
                        "parse_mode": "Markdown",
                    },
                )

                if response.status_code == 200:
                    logger.info("Telegram alert sent successfully")
                    return True
                else:
                    logger.error(
                        f"Failed to send Telegram alert: "
                        f"{response.status_code} - {response.text}"
                    )
                    return False

        except Exception as e:
            logger.error(f"Error sending Telegram alert: {e}", exc_info=True)
            return False

    def send_alert_sync(
        self,
        message: str,
        level: str = "ERROR",
        context: Optional[Dict[str, Any]] = None,
    ) -> bool:
        
        if not self.enabled:
            return False

        try:
            try:
                asyncio.get_running_loop()
                asyncio.create_task(self.send_alert(message, level, context))
                return True
            except RuntimeError:
                return asyncio.run(self.send_alert(message, level, context))
        except Exception as e:
            logger.error(f"Error in sync Telegram alert: {e}", exc_info=True)
            return False


telegram_alerter = TelegramAlerter()

def get_telegram_alerter() -> TelegramAlerter:
    return TelegramAlerter()


async def send_error_alert(
    error_message: str, context: Optional[Dict[str, Any]] = None
) -> None:
    
    await telegram_alerter.send_alert(error_message, level="ERROR", context=context)


async def send_critical_alert(
    message: str, context: Optional[Dict[str, Any]] = None
) -> None:
    
    await telegram_alerter.send_alert(message, level="CRITICAL", context=context)


async def send_warning_alert(
    message: str, context: Optional[Dict[str, Any]] = None
) -> None:
    
    await telegram_alerter.send_alert(message, level="WARNING", context=context)

