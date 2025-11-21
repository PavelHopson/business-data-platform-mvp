from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, Optional
import logging
from app.core.telegram_alerts import get_telegram_alerter

router = APIRouter(prefix="/api/internal", tags=["internal"])
logger = logging.getLogger(__name__)

class AlertManagerAlert(BaseModel):
    status: str
    labels: Dict[str, str]
    annotations: Dict[str, str]
    startsAt: Optional[str] = None
    endsAt: Optional[str] = None
    generatorURL: Optional[str] = None

class AlertManagerWebhook(BaseModel):
    receiver: str
    status: str
    alerts: list[AlertManagerAlert]
    groupLabels: Dict[str, str]
    commonLabels: Dict[str, str]
    commonAnnotations: Dict[str, str]
    externalURL: Optional[str] = None
    version: str
    groupKey: str

@router.post("/webhook/telegram")
async def telegram_webhook(request: Request):
    
    try:
        data = await request.json()
        logger.info(f"🚨 Received Alertmanager webhook: {data}")
        
        # Проверяем, есть ли алерты в данных
        if "alerts" not in data:
            logger.warning("⚠️ No alerts in webhook data")
            return {"status": "success", "message": "No alerts to process"}
        
        # Обрабатываем каждый алерт
        for alert_data in data["alerts"]:
            try:
                alert = AlertManagerAlert(**alert_data)
                logger.info(f"🔔 Processing alert: {alert}")
                await process_alert(alert, data)
            except Exception as e:
                logger.error(f"❌ Error processing individual alert: {e}")
                continue
        
        logger.info("✅ All alerts processed successfully")
        return {"status": "success", "message": "Alerts processed"}
        
    except Exception as e:
        logger.error(f"❌ Error processing Alertmanager webhook: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

async def process_alert(alert: AlertManagerAlert, webhook_data: dict):
    
    try:
        severity = alert.labels.get("severity", "warning")
        alertname = alert.labels.get("alertname", "Unknown Alert")
        logger.info(
            f"🔍 Processing alert: {alertname}, severity: {severity}, "
            f"status: {alert.status}"
        )
        
        if alert.status == "firing":
            emoji = "🚨" if severity == "critical" else "⚠️"
            status_text = "СРАБОТАЛ"
        else:
            emoji = "✅"
            status_text = "РЕШЕН"
        
        message = f"{emoji} *{alertname}* - {status_text}\n\n"
        message += f"*Статус:* {alert.status}\n"
        message += f"*Серьезность:* {severity.upper()}\n"
        
        if alert.annotations:
            if "summary" in alert.annotations:
                message += f"*Описание:* {alert.annotations['summary']}\n"
            if "description" in alert.annotations:
                message += f"*Детали:* {alert.annotations['description']}\n"
        
        if alert.startsAt:
            message += f"*Начало:* {alert.startsAt}\n"
        if alert.endsAt:
            message += f"*Конец:* {alert.endsAt}\n"
        
        if alert.labels:
            message += "\n*Метки:*\n"
            for key, value in alert.labels.items():
                message += f"• {key}: `{value}`\n"
        
        level = "CRITICAL" if severity == "critical" else "WARNING"
        logger.info(f"📤 Sending alert to Telegram: {alertname}, level: {level}")
        
        telegram_alerter = get_telegram_alerter()
        logger.info(
            f"🤖 Telegram alerter status: enabled={telegram_alerter.enabled}, "
            f"bot_token={'***' if telegram_alerter.bot_token else None}, "
            f"chat_id={telegram_alerter.chat_id}"
        )
        
        success = await telegram_alerter.send_alert(
            message=message,
            level=level,
            context={
                "alertname": alertname,
                "severity": severity,
                "status": alert.status,
                "receiver": webhook_data.get("receiver", "unknown")
            }
        )
        
        if success:
            logger.info(f"✅ Alert sent to Telegram successfully: {alertname}")
        else:
            logger.error(f"❌ Failed to send alert to Telegram: {alertname}")
            
    except Exception as e:
        logger.error(f"Error processing alert: {e}")

@router.get("/webhook/telegram/health")
async def webhook_health():
    
    telegram_alerter = get_telegram_alerter()
    return {
        "status": "healthy",
        "service": "telegram-webhook",
        "telegram_enabled": telegram_alerter.enabled
    }
