from random import shuffle, choice
from app.services.indicacao_service import IndicacaoService

ADMINS = [1, 2, 3, 4, 5]

def seed_brinquedotecas(indicacoes):

    try:
        indicacoes = list(indicacoes)

        shuffle(indicacoes)

        indicacoes_canceladas = indicacoes[:10]
        indicacoes_rejeitadas = indicacoes[10:15]
        indicacoes_aprovadas = indicacoes[15:]

        for indicacao in indicacoes_canceladas:
            IndicacaoService.cancelar_indicacao(
                indicacao.id,
                indicacao.usuario_indicador_id
            )

        for indicacao in indicacoes_rejeitadas:
            IndicacaoService.rejeitar_indicacao(
                indicacao.id,
                choice(ADMINS)
            )

        for indicacao in indicacoes_aprovadas:
            IndicacaoService.aprovar_indicacao(
                indicacao.id,
                choice(ADMINS)
            )

        print(
            f"{len(indicacoes_aprovadas)} BRINQUEDOTECAS geradas por aprovação de indicações.\n"
            f"{len(indicacoes_rejeitadas)} INDICAÇÕES rejeitadas.\n"
            f"{len(indicacoes_canceladas)} INDICAÇÕES canceladas."
        )

    except Exception:
        raise