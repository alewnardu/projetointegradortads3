from flask import Blueprint, jsonify
from app.models.fotografia import Fotografia
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.exceptions import *
from app.services.fotografia_service import FotografiaService

fotografia_bp = Blueprint('fotografia', __name__)

@fotografia_bp.route("/indicacoes/<int:indicacao_id>/fotografias/<int:fotografia_id>", methods=["DELETE"])
@jwt_required()
def deletar_fotografia(indicacao_id, fotografia_id):

    try:
        usuario_logado_id = get_jwt_identity()
        FotografiaService.deletar_fotografia(usuario_logado_id, indicacao_id, fotografia_id)
        return "", 204
    except UnauthorizedError as e:
        return jsonify({
            'error': str(e)
        }), 401
    except ForbiddenError as e:
        return jsonify({
            'error': str(e)
        }), 403
    except NotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404
    except ValidationError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'error': f'Erro interno do servidor - {str(e)}'
        }), 500 