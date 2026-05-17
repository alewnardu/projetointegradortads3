from marshmallow import Schema, fields

class UsuarioPublicoSchema(Schema):
    
    id = fields.Integer(dump_only=True)
    
    nome = fields.String(required=True)
    
    email = fields.String(required=True)
    
    senha = fields.String(required=True, load_only=True)

    confirmacao_senha = fields.String(required=True, load_only=True)
    