from marshmallow import Schema, fields, validate

class BrinquedotecaSchema(Schema):

    id = fields.Integer(dump_only=True)

    observacao = fields.String(allow_none=True)

    status = fields.String(dump_only=True)

    indicacao_id = fields.Integer(dump_only=True)
