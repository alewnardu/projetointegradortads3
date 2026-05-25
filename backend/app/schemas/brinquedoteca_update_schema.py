from marshmallow import Schema, fields, validate, validates, ValidationError

class BrinquedotecaUpdateSchema(Schema):

    observacao = fields.String(
        required=True,
        validate=[
            validate.Length(
                min=10,
                max=255,
                error='A justificativa deve ter entre 10 e 500 caracteres.'
            )
        ],
        error_messages={
            'required': 'A justificativa é obrigatória.'
        }
    )

    @validates('observacao')
    def validar_observacao(self, value, **kwargs):

        if not value.strip():
            raise ValidationError(
                'A justificativa não pode estar vazia.'
            )