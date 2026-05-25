from marshmallow import Schema, fields

class LocalizacaoSchema(Schema):

    id = fields.Integer(dump_only=True)

    latitude = fields.Float(required=True)

    longitude = fields.Float(required=True)

    endereco_id = fields.Integer(dump_only=True)