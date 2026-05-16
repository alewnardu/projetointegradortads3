from flask import Blueprint, jsonify, request
from app.schemas.brinquedoteca_schema import BrinquedotecaSchema
from app.services.brinquedoteca_service import BrinquedotecaService
from app.exceptions import *

brinquedoteca_bp = Blueprint('brinquedoteca_bp', __name__)

brinquedoteca_schema = BrinquedotecaSchema()
brinquedotecas_schema = BrinquedotecaSchema(many=True)

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