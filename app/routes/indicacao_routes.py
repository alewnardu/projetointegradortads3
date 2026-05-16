from flask import Blueprint, request, jsonify
from app.schemas.indicacao_schema import IndicacaoSchema
from app.services.indicacao_service import IndicacaoService
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.exceptions import *

indicacao_bp = Blueprint('indicacao_bp', __name__)

indicacao_schema = IndicacaoSchema()
indicacoes_schema = IndicacaoSchema(many=True)

@indicacao_bp.route('/indicacoes', methods=['GET'])
@jwt_required()
def listar_indicacoes():
    try:
        usuario_logado_id = get_jwt_identity()
        indicacoes = IndicacaoService.listar_indicacoes(usuario_logado_id)
        return jsonify({
            'data': indicacoes_schema.dump(indicacoes)
        }), 200
    except UnauthorizedError as e:
        return jsonify({
            'error': str(e)
        }), 401
    except ForbiddenError as e:
        return jsonify({
            'error': str(e)
        }), 403
    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500

@indicacao_bp.route("/indicacoes/<int:indicacao_id>", methods=["GET"])
@jwt_required()
def buscar_indicacao(indicacao_id):
    try:
        usuario_logado_id = get_jwt_identity()
        indicacao = IndicacaoService.buscar_indicacao(indicacao_id, usuario_logado_id)
        return jsonify({
            'data': indicacao_schema.dump(indicacao)
        }), 200
    except NotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404
    except UnauthorizedError as e:
        return jsonify({
            'error': str(e)
        }), 401
    except ForbiddenError as e:
        return jsonify({
            'error': str(e)
        }), 403
    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500
