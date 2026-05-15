from app.extensions import mail
from flask_mail import Message

class EmailService:

    @staticmethod
    def enviar_email(assunto, destinatario, corpo):
        mensagem = Message(
            subject=assunto,
            recipients=[destinatario],
            body=corpo
        )
        mail.send(mensagem)
    
    @staticmethod
    def enviar_email_recuperacao_senha(usuario, reset_link):
        assunto = "Recuperação de Senha"
        corpo = f"""
            Olá, {usuario.nome}!
            Recebemos uma solicitação para recuperação de senha. Clique no link abaixo para redefinir sua senha. Este link é válido por 1 minuto.
            Link\n: {reset_link}
            \nSe você não solicitou a recuperação de senha, por favor ignore este email.
            Atenciosamente,
            Equipe de Suporte
        """
        EmailService.enviar_email(assunto, usuario.email, corpo)