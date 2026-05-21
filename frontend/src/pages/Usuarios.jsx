import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmModal';
import { ArrowLeft, UserPlus, Edit2, Trash2, X, ShieldCheck, User } from 'lucide-react';
import './Usuarios.css';

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

  // Get initials for avatars
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao carregar usuários');
      setUsuarios(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [navigate]);

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
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao deletar usuário');
      }

      setUsuarios(usuarios.filter(u => u.id !== id));
      showToast(`Usuário "${nome}" excluído com sucesso.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({ nome: user.nome, email: user.email, senha: '', perfil: user.perfil || 'CIDADAO' });
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
      const token = localStorage.getItem('token');
      const url = editingUser
        ? `http://localhost:5000/usuarios/${editingUser.id}`
        : 'http://localhost:5000/usuarios';

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

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
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

  return (
    <div className="usuarios-container">
      {/* Background Blobs */}
      <div className="blob-container">
        <div className="blob blob-orange" />
        <div className="blob blob-green" />
      </div>

      <header className="usuarios-header">
        <Button variant="secondary" onClick={() => navigate('/dashboard')} className="back-btn">
          <ArrowLeft size={16} /> Voltar
        </Button>
        <h1>Gerenciar Usuários</h1>
        <Button className="add-btn" onClick={() => openModal()}>
          <UserPlus size={16} /> Novo Usuário
        </Button>
      </header>

      <main className="usuarios-main">
        {error && <div className="error-message">{error}</div>}

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
          <div className="usuarios-list">
            {usuarios.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum usuário encontrado no sistema.</p>
              </div>
            ) : (
              usuarios.map(usuario => (
                <Card key={usuario.id} className="usuario-card">
                  <div className="usuario-card-left">
                    <div className={`user-avatar ${usuario.perfil === 'ADMIN' ? 'admin' : 'cidadao'}`}>
                      {getInitials(usuario.nome)}
                    </div>
                    <div className="usuario-info">
                      <h3>{usuario.nome}</h3>
                      <p>{usuario.email}</p>
                      <span className={`role-badge ${usuario.perfil === 'ADMIN' ? 'admin' : 'cidadao'}`}>
                        {usuario.perfil === 'ADMIN' ? <><ShieldCheck size={11} /> Administrador</> : <><User size={11} /> Cidadão</>}
                      </span>
                    </div>
                  </div>
                  <div className="usuario-actions">
                    <Button variant="secondary" className="edit-btn" onClick={() => openModal(usuario)} title="Editar usuário">
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="secondary" className="delete-btn" onClick={() => handleDelete(usuario.id, usuario.nome)} title="Excluir usuário">
                      <Trash2 size={16} />
                    </Button>
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
