export const PAGES = {
    brinquedotecas: {
        title: 'Início',
        subTitle: 'Encontre espaços incríveis para a diversão das crianças',
        listTitle: 'Brinquedotecas em destaque',
        routes: {
            list: '/brinquedotecas',
            view: `/brinquedotecas/${idBrinquedoteca}/detalhes`,
            avaliar:`/brinquedotecas/${idBrinquedoteca}/avaliar`,
            inativar:`/brinquedotecas/${idBrinquedoteca}/inativar`,
        },
    },
    indicaoes: {
        title: 'Indicações',
        subTitle: 'Gerencie as indicações de brinquedotecas',
        listTitle: '',
        routes: {
            list: '/indicacoes',
            new: '/indicacoes/cadastrar',
            view: `/indicacoes/${idIndicacao}/detalhes`,
            edit: `/indicacoes/${idIndicacao}/editar`,
            aprovar:`/indicacoes/${idIndicacao}/aprovar`,
            rejeitar:`/indicacoes/${idIndicacao}/rejeitar`,
            cancelar:`/indicacoes/${idIndicacao}/cancelar`,
            deletarFotografia:`/indicacoes/${idIndicacao}/fotografias/${idFotografia}`,
            adicionarFotografia:`/indicacoes/${idIndicacao}/fotografias`,
        },
    },
    usuarios: {
        title: 'Usuários',
        subTitle: 'Gerenciamento de usuários',
        listTitle: 'Lista de Usuários',

        routes: {
            list: '/usuarios',
            view: (id) => `/usuarios/${id}`,
            create: '/usuarios/novo',
            edit: (id) => `/usuarios/${id}/editar`,
            delete: (id) => `/usuarios/${id}/excluir`,
        },
    },
};