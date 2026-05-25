from marshmallow import Schema, fields, validate

class LoginSchema(Schema):

    email = fields.Email(
        required=True,
        error_messages={
            'required': 'Email é obrigatório',
            'invalid': 'Email inválido'
        }
    )

    senha = fields.String(
        required=True,
        validate=validate.Length(
            min=8,
            error='A senha deve ter no mínimo 8 caracteres'
        ),
        error_messages={
            'required': 'Senha é obrigatória'
        }
    )