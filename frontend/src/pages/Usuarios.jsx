import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmModal';
import './Usuarios.css';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { useAuth } from '../hooks/useAuth';
import { SlidersHorizontal, ChevronDown, Search, ArrowLeft, UserPlus, RotateCcw, Edit2, Trash2, X, ShieldCheck, User, DoorOpen, DoorClosed, Plus, BarChart3 } from 'lucide-react';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const confirm = useConfirm();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', perfil: 'CIDADAO' });

  const [filtersOpen, setFiltersOpen] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPerfil, setFilterPerfil] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ATIVO');

  const {
    user,
    token,
    logout,
    loading: authLoading
  } = useAuth({
    required: false
  });
  const authFetch = useAuthenticatedFetch();

  // Get initials for avatars
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  const fetchUsuarios = async () => {
    if (token) {
      console.log("Token: ", token);
      try {
        const response = await authFetch('/api/usuarios', {
          method: 'GET'
        });

        const data = await response.json();
        console.log("USUARIOS: ", data.data);
        if (!response.ok) throw new Error(data.error || 'Erro ao carregar usuários');
        setUsuarios(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [user]);

  const handleReativar = async (id, nome) => {
    const ok = await confirm({
      title: 'Reativar Usuário',
      message: `Deseja reativar o usuário "${nome}"?`,
      confirmText: 'Sim, Reativar',
      cancelText: 'Cancelar',
    });

    if (!ok) return;

    try {
      const response = await authFetch(`/api/usuarios/${id}/reativar`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao reativar usuário');
      }

      fetchUsuarios();

      showToast(
        `Usuário "${nome}" reativado com sucesso.`,
        'success'
      );
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, nome) => {
    const ok = await confirm({
      title: 'Excluir Usuário',
      message: `Tem certeza que deseja excluir o usuário "${nome}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Sim, Excluir',
      cancelText: 'Cancelar',
      isDestructive: true,
    });
    if (!ok) return;

    try {
      const response = await authFetch(`/api/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao deletar usuário');
      }

      fetchUsuarios();
      showToast(`Usuário "${nome}" excluído com sucesso.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({ nome: user.nome, email: user.email, senha: '', perfil: user.perfil || 'CIDADAO', status: user.status, data_inativacao: user.data_inativacao });
    } else {
      setFormData({ nome: '', email: '', senha: '', perfil: 'CIDADAO' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingUser
        ? `/api/usuarios/${editingUser.id}`
        : '/api/usuarios';

      const method = editingUser ? 'PATCH' : 'POST';

      const payload = {
        nome: formData.nome,
        email: formData.email,
        perfil: formData.perfil
      };
      if (editingUser) {
        if (formData.senha) {
          payload.senha = formData.senha;
          payload.confirmacao_senha = formData.senha;
        }
      } else {
        payload.senha = formData.senha;
        payload.confirmacao_senha = formData.senha;
      }

      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao salvar usuário');

      showToast(
        editingUser ? `Usuário "${formData.nome}" atualizado com sucesso.` : `Usuário "${formData.nome}" criado com sucesso.`,
        'success'
      );
      fetchUsuarios();
      closeModal();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {

    const busca =
      usuario.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const perfil =
      filterPerfil === 'ALL' ||
      usuario.perfil === filterPerfil;

    const status =
      filterStatus === 'ALL' ||
      (filterStatus === 'ATIVO' && usuario.status) ||
      (filterStatus === 'INATIVO' && !usuario.status);

    return busca && perfil && status;
  });

  return (
    <div className="usuarios-container">
      {/* Background Blobs */}
      <div className="blob-container">
        <div className="blob blob-orange" />
        <div className="blob blob-green" />
      </div>

      <header className="usuarios-header">
        <div className="page-brand">
          <img src="/logo.png" alt="TO Brincando" className="page-logo" />
          <h1>TO Brincando</h1>
        </div>

        {!user ? (<Button variant="secondary" onClick={() => navigate('/login')} className="back-btn">
          <DoorOpen size={16} /> Entrar
        </Button>) : (<Button variant="secondary" onClick={logout} className="back-btn">
          <DoorClosed size={16} /> Sair
        </Button>)}

      </header>
      <div className="tabs-container">
        <div className="tabs-right" style={{ marginLeft: 'auto' }}>
          {user && user?.perfil === 'ADMIN' && (
            <Button variant="secondary" onClick={() => navigate('/dashboard')} className="back-btn" style={{ marginLeft: '5px' }}>
              <BarChart3 size={16} /> Dashboard
            </Button>
          )}
          {user && user?.perfil === 'ADMIN' && (<Button variant="secondary" onClick={() => openModal()} className="back-btn" style={{ marginLeft: '5px' }}>
            <UserPlus size={16} /> Novo Usuário
          </Button>
          )}
        </div>
      </div>


      <main className="usuarios-main">
        {error && <div className="error-message">{error}</div>}

        <Card className="filters-card">

          <button
            className="filters-toggle-btn"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <span className="filters-toggle-left">
              <SlidersHorizontal size={18} />
              <h3>Buscar e Filtrar Usuários</h3>
            </span>

            <ChevronDown
              size={20}
              className={`filters-chevron ${filtersOpen ? 'open' : ''}`}
            />
          </button>

          <div className={`filters-body ${filtersOpen ? 'open' : ''}`}>

            <div className="filters-grid">

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Nome ou E-mail</label>

                <div style={{ position: 'relative' }}>
                  <input
                    className="input-field"
                    placeholder="Digite um nome ou e-mail..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      paddingLeft: '42px',
                      width: '100%'
                    }}
                  />

                  <Search
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--on-surface-variant)',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Perfil</label>

                <select
                  value={filterPerfil}
                  onChange={e => setFilterPerfil(e.target.value)}
                >
                  <option value="ALL">Todos</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="CIDADAO">Cidadão</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Status</label>

                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="ALL">Todos</option>
                  <option value="ATIVO">Ativos</option>
                  <option value="INATIVO">Excluídos</option>
                </select>
              </div>

            </div>

          </div>

        </Card>

        {isLoading ? (
          <div className="loading-state">
            <div style={{
              width: '48px', height: '48px',
              border: '4px solid var(--surface-container-highest)',
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              animation: 'spin 0.9s linear infinite'
            }} />
            <p style={{ color: 'var(--on-surface-variant)', fontFamily: 'var(--font-headings)', fontWeight: '700' }}>
              Carregando usuários...
            </p>
          </div>
        ) : (
          <div
            className="usuarios-list">
            {usuariosFiltrados.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum usuário encontrado no sistema.</p>
              </div>
            ) : (
              usuariosFiltrados
                .map(usuario => (
                  <Card key={usuario.id} className="usuario-card">
                    <div className="usuario-card-left">
                      <div className={`user-avatar ${usuario.perfil === 'ADMIN' ? 'admin' : 'cidadao'}`}>
                        {getInitials(usuario.nome)}
                      </div>
                      <div className="usuario-info">
                        <h3>{usuario.nome}</h3>
                        <p>{usuario.email}</p>
                        <div>
                          <span className={`role-badge ${usuario.perfil === 'ADMIN' ? 'admin' : 'cidadao'}`} style={{ marginLeft: '5px' }}>
                            {usuario.perfil === 'ADMIN' ? <><ShieldCheck size={11} /> Administrador</> : <><User size={11} /> Cidadão</>}
                          </span>
                          <span className={`role-badge ${usuario.status ? 'success' : 'danger'}`} style={{ marginLeft: '5px' }}>
                            <ShieldCheck size={11} /> {usuario.status ? "ATIVO" : "EXCLUÍDO"}
                          </span>
                          {!usuario.status && usuario.data_inativacao && (
                            <p><small>Momento da exclusão: {new Date(usuario.data_inativacao).toLocaleString('pt-BR')}</small></p>
                          )}
                        </div>

                      </div>
                    </div>
                    <div className="usuario-actions">
                      {usuario.id && usuario.status && (
                        <><Button variant="secondary" className="edit-btn" onClick={() => openModal(usuario)} title="Editar usuário">
                          <Edit2 size={16} />
                        </Button>
                          <Button variant="secondary" className="delete-btn" onClick={() => handleDelete(usuario.id, usuario.nome)} title="Excluir usuário">
                            <Trash2 size={16} />
                          </Button></>
                      )}
                      {usuario.id && !usuario.status && (
                        <Button variant="secondary" className="edit-btn" onClick={() => handleReativar(usuario.id, usuario.nome)} title="Reverter exclusão">
                          <RotateCcw size={16} />
                        </Button>)}
                    </div>
                  </Card>
                ))
            )}
          </div>
        )}
      </main>

      {/* User Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <Card className="modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
              <button className="close-btn" onClick={closeModal}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <Input
                label="Nome Completo"
                value={formData.nome}
                placeholder="Nome do usuário"
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                required
              />
              <Input
                label="E-mail"
                type="email"
                value={formData.email}
                placeholder="email@exemplo.com"
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label={editingUser ? 'Nova Senha (opcional)' : 'Senha'}
                type="password"
                placeholder={editingUser ? 'Deixe em branco para manter a senha atual' : 'Mínimo 6 caracteres'}
                value={formData.senha}
                onChange={e => setFormData({ ...formData, senha: e.target.value })}
                required={!editingUser}
              />
              <div className="input-group">
                <label>Perfil de Acesso</label>
                <select
                  className="cargo-select"
                  value={formData.perfil}
                  onChange={e => setFormData({ ...formData, perfil: e.target.value })}
                >
                  <option value="CIDADAO">Cidadão</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="modal-actions">
                <Button variant="secondary" type="button" onClick={closeModal}>Cancelar</Button>
                <Button type="submit">{editingUser ? 'Salvar Alterações' : 'Criar Usuário'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
