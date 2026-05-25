from marshmallow import Schema, fields

class LocalizacaoUpdateSchema(Schema):

    latitude = fields.Float()

    longitude = fields.Float()