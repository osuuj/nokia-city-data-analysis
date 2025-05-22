import logging
import os

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr

from server.backend.utils.rate_limit import rate_limit_if_production

router = APIRouter()

CONTACT_RECIPIENT = os.getenv("CONTACT_RECIPIENT_EMAIL", os.getenv("ZOHO_FROM_EMAIL"))

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("ZOHO_SMTP_USER"),
    MAIL_PASSWORD=os.getenv("ZOHO_SMTP_PASS"),
    MAIL_FROM=os.getenv("ZOHO_FROM_EMAIL"),
    MAIL_PORT=int(os.getenv("ZOHO_SMTP_PORT", 587)),
    MAIL_SERVER=os.getenv("ZOHO_SMTP_HOST", "smtp.zoho.eu"),
    MAIL_FROM_NAME="Osuuj Contact",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    profile: str = "unknown"


async def send_email(message: MessageSchema):
    fm = FastMail(conf)
    await fm.send_message(message)


@router.post("/contact", status_code=200)
@rate_limit_if_production("5/minute")
async def contact(
    request: Request, form: ContactForm, background_tasks: BackgroundTasks
):
    try:
        message = MessageSchema(
            subject=f"[Contact Form] {form.subject}",
            recipients=[CONTACT_RECIPIENT],
            body=(
                f"New contact form submission:\n\n"
                f"Profile/Page: {form.profile}\n"
                f"Name: {form.name}\n"
                f"Email: {form.email}\n"
                f"Subject: {form.subject}\n\n"
                f"Message:\n{form.message}"
            ),
            subtype=MessageType.plain,
            reply_to=[form.email],
        )
        background_tasks.add_task(send_email, message)
        return {"success": True, "message": "Message accepted and will be sent shortly"}
    except Exception as e:
        logging.exception("Failed to send contact form email")
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")
