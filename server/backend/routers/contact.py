import os

from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr

from server.backend.main import rate_limit_if_production

router = APIRouter()

CONTACT_RECIPIENT = os.getenv("CONTACT_RECIPIENT_EMAIL", os.getenv("ZOHO_FROM_EMAIL"))

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("ZOHO_SMTP_USER"),
    MAIL_PASSWORD=os.getenv("ZOHO_SMTP_PASS"),
    MAIL_FROM=os.getenv("ZOHO_FROM_EMAIL"),
    MAIL_PORT=int(os.getenv("ZOHO_SMTP_PORT", 587)),
    MAIL_SERVER=os.getenv("ZOHO_SMTP_HOST", "smtp.zoho.eu"),
    MAIL_FROM_NAME="Osuuj Contact",
    MAIL_TLS=True,
    MAIL_SSL=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    profile: str = "unknown"


@router.post("/contact", status_code=200)
@rate_limit_if_production("5/minute")
async def contact(form: ContactForm, background_tasks: BackgroundTasks):
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
        fm = FastMail(conf)
        await fm.send_message(message, background=background_tasks)
        return {"success": True, "message": "Message sent."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")
