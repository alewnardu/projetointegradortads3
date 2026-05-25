from flask import Blueprint, jsonify, request
from app.schemas.brinquedoteca_schema import BrinquedotecaSchema
from app.schemas.brinquedoteca_update_schema import BrinquedotecaUpdateSchema
from app.services.brinquedoteca_service import BrinquedotecaService
from app.exceptions import *
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.schemas.avaliacao_schema import AvaliacaoSchema

brinquedoteca_bp = Blueprint('brinquedoteca_bp', __name__)

brinquedoteca_schema = BrinquedotecaSchema()
brinquedotecas_schema = BrinquedotecaSchema(many=True)
brinquedoteca_update_schema = BrinquedotecaUpdateSchema()
avaliacao_schema = AvaliacaoSchema()

@brinquedoteca_bp.route('/brinquedotecas', methods=['GET'])
def listar_brinquedotecas():
    try:        
        brinquedotecas = BrinquedotecaService.listar_brinquedotecas()
        return jsonify({
            'data': brinquedotecas_schema.dump(brinquedotecas)
        }), 200
    except Exception:
        return jsonify({
            'error': 'Erro interno do servidor'
        }), 500

@brinquedoteca_bp.route('/brinquedotecas/<int:brinquedoteca_id>', methods=['GET'])
def buscar_brinquedoteca(brinquedoteca_id):
    try:
        brinquedoteca = BrinquedotecaService.buscar_brinquedoteca(brinquedoteca_id)
        return jsonify({
            "success": True,
            'message': 'Brinquedoteca inativada',
            'data': brinquedoteca_schema.dump(brinquedoteca)
        }), 200
    except NotFoundError as e:
        return jsonify({
            'error': str(e)
        }), 404
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@brinquedoteca_bp.route("/brinquedotecas/<int:brinquedoteca_id>/inativar", methods=['PATCH'])
@jwt_required()
def inativar_brinquedoteca(brinquedoteca_id):
    try:
        dados = brinquedoteca_update_schema.load(request.get_json())
        usuario_logado_id = get_jwt_identity()
        brinquedoteca = BrinquedotecaService.inativar_brinquedoteca(usuario_logado_id, brinquedoteca_id, dados)
        return jsonify({
            "success": True,
            'message': 'Brinquedoteca inativada',
            'data': brinquedoteca_schema.dump(brinquedoteca)
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
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@brinquedoteca_bp.route("/brinquedotecas/<int:brinquedoteca_id>/avaliar", methods=['PATCH'])
@jwt_required()
def avaliar_brinquedoteca(brinquedoteca_id):
    try:
        dados = avaliacao_schema.load(request.get_json())
        usuario_logado_id = get_jwt_identity()
        brinquedoteca = BrinquedotecaService.avaliar_brinquedoteca(usuario_logado_id, brinquedoteca_id, dados)
        return jsonify({
            "success": True,
            'message': 'Brinquedoteca avaliada',
            'data': brinquedoteca_schema.dump(brinquedoteca)
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
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500