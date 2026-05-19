from marshmallow import Schema, fields

class FotografiaSchema(Schema):

    id = fields.Integer(dump_only=True)

    nome_arquivo = fields.String()

    caminho = fields.String()

    is_principal = fields.Boolean()

    data_upload = fields.DateTime()
