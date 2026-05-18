from marshmallow import Schema, fields, validate, validates_schema

class UsuarioSchema(Schema):
    
    id = fields.Integer(dump_only=True)
    
    nome = fields.String(required=True)
    
    email = fields.Email(
        required=True,
        error_messages={
            'required': 'Email é obrigatório',
            'invalid': 'Email inválido'
        }
    )
    
    senha = fields.String(
        required=True,
        load_only=True,
        validate=validate.Length(
            min=8,
            error='A senha deve ter no mínimo 8 caracteres'
        ),
        error_messages={
            'required': 'Senha é obrigatória'
        }
    )

    confirmacao_senha = fields.String(required=True, load_only=True)
    
    perfil = fields.String(
        required=True,
        validate=validate.OneOf(
            ['ADMIN', 'CIDADAO'],
            error='Perfil inválido. Os valores permitidos são ADMIN ou CIDADAO'
        )
    )

    @validates_schema
    def validar_senhas(self, data, **kwargs):

        if data['senha'] != data['confirmacao_senha']:
            raise ValidationError({
                'confirmacao_senha':
                ['A senha e a confirmação não coincidem']
            })