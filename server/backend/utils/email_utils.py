import os
from email.message import EmailMessage

import aiosmtplib

ZOHO_SMTP_HOST = os.getenv("ZOHO_SMTP_HOST", "smtp.zoho.eu")
ZOHO_SMTP_PORT = int(os.getenv("ZOHO_SMTP_PORT", 587))
ZOHO_SMTP_USER = os.getenv("ZOHO_SMTP_USER")
ZOHO_SMTP_PASS = os.getenv("ZOHO_SMTP_PASS")
DEFAULT_FROM = os.getenv("ZOHO_FROM_EMAIL", ZOHO_SMTP_USER)


async def send_email(to: str, subject: str, message: str, from_addr: str = None):
    from_addr = from_addr or DEFAULT_FROM
    if not (ZOHO_SMTP_USER and ZOHO_SMTP_PASS and from_addr):
        raise RuntimeError(
            "SMTP credentials or from address not set in environment variables."
        )

    email = EmailMessage()
    email["From"] = from_addr
    email["To"] = to
    email["Subject"] = subject
    email.set_content(message)

    await aiosmtplib.send(
        email,
        hostname=ZOHO_SMTP_HOST,
        port=ZOHO_SMTP_PORT,
        username=ZOHO_SMTP_USER,
        password=ZOHO_SMTP_PASS,
        start_tls=True,
    )
