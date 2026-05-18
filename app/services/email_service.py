from app.extensions import mail
from flask_mail import Message

class EmailService:

    @staticmethod
    def enviar_email(assunto, destinatario, corpo_html):

        mensagem = Message(
            subject=assunto,
            recipients=[destinatario],
            html=corpo_html
        )

        mail.send(mensagem)

    @staticmethod
    def enviar_email_recuperacao_senha(usuario, reset_link):

        assunto = 'Recuperação de Senha'

        corpo_html = f"""
            <div style="
                font-family: Arial, sans-serif;
                margin: auto;
                padding: 20px;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
            ">
                <h2 style="color: #2c3e50;">
                    Recuperação de Senha
                </h2>
                <p>
                    Olá, <strong>{usuario.nome}</strong>!
                </p>
                <p>
                    Recebemos uma solicitação para recuperação de senha.
                </p>
                <p>
                    Clique no botão abaixo para redefinir sua senha:
                </p>
                <div style="margin: 30px 0;">
                    <a
                        href="{reset_link}"
                        style="
                            background-color: #2563eb;
                            color: white;
                            padding: 12px 20px;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: bold;
                        "
                    >
                        Redefinir Senha
                    </a>
                </div>
                <p>
                    Este link vai expirar em alguns minutos e deixará de funcionar.
                </p>
                <p style="color: #666;">
                    Se você não solicitou a recuperação,
                    ignore este email.
                </p>
                <hr>
                <p style="
                    font-size: 12px;
                    color: #999;
                ">
                    TADS - Projeto Integrador: Sistema de Brinquedotecas
                </p>
            </div>
        """

        EmailService.enviar_email(
            assunto,
            usuario.email,
            corpo_html
        )