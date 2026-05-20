from marshmallow import (
    Schema,
    fields,
    validate,
    validates,
    ValidationError
)

class AvaliacaoSchema(Schema):

    id = fields.Integer(
        dump_only=True
    )

    nota = fields.Integer(
        required=True,
        validate=validate.Range(
            min=1,
            max=5,
            error='A avaliação está fora do limite permitido.'
        ),
        error_messages={
            'required': 'A nota é obrigatória.',
            'invalid': 'A avaliação está em um formato inválido.'
        }
    )

    data_avaliacao = fields.DateTime(
        dump_only=True
    )

    comentario = fields.String(
        required=True,
        validate=validate.Length(
            min=10,
            max=500,
            error='O comentário deve ter entre 10 e 500 caracteres.'
        ),
        error_messages={
            'required': 'O comentário é obrigatório.'
        }
    )

    usuario_avaliador_id = fields.Integer(
        dump_only=True
    )

    brinquedoteca_id = fields.Integer(
        dump_only=True
    )

    @validates('comentario')
    def validar_comentario(self, value, **kwargs):

        if not value.strip():
            raise ValidationError(
                'O comentário não pode estar vazio.'
            )