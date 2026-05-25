import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useToast } from '../../components/Toast';
import { useConfirm } from '../../components/ConfirmModal';
import { ModalIndicacao } from './components/ModalIndicacao';
import {
  ArrowLeft, ArrowRight, Star, MapPin, SlidersHorizontal, Plus,
  Sparkles, ShieldCheck, X, Check, Trash, Ban, MessageSquare,
  DoorOpen, DoorClosed, ChevronDown, Wind, Users, Heart, Upload, Search,
  Inbox, BarChart3 
} from 'lucide-react';
import './Brinquedotecas.css';

import { useAuth } from '../../hooks/useAuth';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch';

export function Brinquedotecas() {

  const {
    user,
    token,
    logout,
    loading: authLoading
  } = useAuth({
    required: false
  });
  const authFetch = useAuthenticatedFetch();



  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const confirm = useConfirm();

  // Tabs: 'explore' | 'recommendations' | 'admin-indicacoes'
  const [activeTab, setActiveTab] = useState('explore');

  // Lists and loading states
  const [brinquedotecas, setBrinquedotecas] = useState([]);
  const [indicacoes, setIndicacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected item modal states
  const [selectedBrinquedoteca, setSelectedBrinquedoteca] = useState(null);
  const [selectedIndicacao, setSelectedIndicacao] = useState(null);
  const [isInactivating, setIsInactivating] = useState(false);
  const [inactivateReason, setInactivateReason] = useState('');
  const [featuredPhotoUrl, setFeaturedPhotoUrl] = useState('');

  // Evaluation Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Recommendation Form State
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [recommendPhoto, setRecommendPhoto] = useState(null);
  const [recommendPhotoPreview, setRecommendPhotoPreview] = useState('');
  const [recommendData, setRecommendData] = useState({
    nome: '',
    descricao: '',
    tem_climatizacao: false,
    tem_monitores: false,
    tem_gratuidade: false,
    porte: 'MEDIO',
    endereco: {
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: 'Palmas',
      estado: 'TO',
      cep: '',
      localizacao: {
        latitude: -10.18,
        longitude: -48.33
      }
    }
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSize, setFilterSize] = useState('ALL');
  const [filterClimatizado, setFilterClimatizado] = useState(false);
  const [filterMonitores, setFilterMonitores] = useState(false);
  const [filterGratuito, setFilterGratuito] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      // rota pública
      const playroomsRes = await fetch('/api/brinquedotecas');

      const playroomsData = await playroomsRes.json();

      if (!playroomsRes.ok) {
        throw new Error(
          playroomsData.error || 'Erro ao buscar brinquedotecas'
        );
      }

      setBrinquedotecas(playroomsData.data || []);

      if (token) {
        const indicacoesRes = await authFetch('/api/indicacoes');

        if (
          indicacoesRes.status !== 401 &&
          indicacoesRes.status !== 403
        ) {
          const indicacoesData = await indicacoesRes.json();

          if (indicacoesRes.ok) {
            setIndicacoes(indicacoesData.data || []);
          }
        }
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);



  // Update featured photo when a playroom is selected
  useEffect(() => {
    if (selectedBrinquedoteca) {
      const principal = selectedBrinquedoteca.indicacao?.fotografias?.find(f => f.is_principal)
        || selectedBrinquedoteca.indicacao?.fotografias?.[0];
      setFeaturedPhotoUrl(principal ? `/api/${principal.caminho}` : '/placeholder-brinquedoteca.jpg');
    }
  }, [selectedBrinquedoteca]);

  const handleInactivate = async (e) => {
    e.preventDefault();
    if (!inactivateReason.trim()) {
      showToast('Por favor, informe uma justificativa para a inativação.', 'warning');
      return;
    }

    try {
      const response = await authFetch(`/api/brinquedotecas/${selectedBrinquedoteca.id}/inativar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ observacao: inactivateReason })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao inativar brinquedoteca');

      showToast('Brinquedoteca inativada com sucesso.', 'success');
      setSelectedBrinquedoteca(null);
      setIsInactivating(false);
      setInactivateReason('');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (reviewComment.trim().length < 10) {
      showToast('O comentário deve ter no mínimo 10 caracteres.', 'warning');
      return;
    }

    try {
      const response = await authFetch(`/api/brinquedotecas/${selectedBrinquedoteca.id}/avaliar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nota: Number(reviewRating),
          comentario: reviewComment
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao avaliar a brinquedoteca');

      showToast('Avaliação enviada com sucesso! Obrigado pela colaboração.', 'success');
      setReviewComment('');
      setReviewRating(5);
      setSelectedBrinquedoteca(data.data);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleApproveIndicacao = async (id) => {
    const ok = await confirm({
      title: 'Aprovar Indicação',
      message: 'Deseja realmente aprovar esta indicação? Isso criará uma brinquedoteca ativa automaticamente no sistema.',
      confirmText: 'Sim, Aprovar',
      cancelText: 'Cancelar',
      isDestructive: false,
    });
    if (!ok) return;

    try {
      const response = await authFetch(
        `/api/indicacoes/${id}/aprovar`,
        {
          method: 'PATCH'
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao aprovar indicação');

      showToast('Indicação aprovada! Brinquedoteca criada com sucesso.', 'success');
      setSelectedIndicacao(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRejectIndicacao = async (id) => {
    const ok = await confirm({
      title: 'Rejeitar Indicação',
      message: 'Deseja realmente rejeitar esta indicação? Esta ação não poderá ser desfeita.',
      confirmText: 'Rejeitar',
      cancelText: 'Voltar',
      isDestructive: true,
    });
    if (!ok) return;

    try {
      const response = await authFetch(`/api/indicacoes/${id}/rejeitar`, {
        method: 'PATCH',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao rejeitar indicação');

      showToast('Indicação rejeitada.', 'info');
      setSelectedIndicacao(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCancelIndicacao = async (id) => {
    const ok = await confirm({
      title: 'Cancelar Indicação',
      message: 'Deseja realmente cancelar sua indicação? Ela será removida do sistema.',
      confirmText: 'Cancelar Indicação',
      cancelText: 'Manter',
      isDestructive: true,
    });
    if (!ok) return;

    try {
      const response = await authFetch(`/api/indicacoes/${id}/cancelar`, {
        method: 'PATCH',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao cancelar indicação');

      showToast('Indicação cancelada com sucesso.', 'info');
      setSelectedIndicacao(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRecommendSubmit = async (e) => {
    e.preventDefault();
    if (!recommendPhoto) {
      showToast('Por favor, faça upload de uma foto principal do local.', 'warning');
      return;
    }

    const cepDigits = recommendData.endereco.cep.replace(/\D/g, '');
    if (cepDigits.length !== 8) {
      showToast('O CEP deve conter exatamente 8 dígitos numéricos.', 'warning');
      return;
    }

    const payload = {
      ...recommendData,
      endereco: { ...recommendData.endereco, cep: cepDigits }
    };

    const formData = new FormData();
    formData.append('dados', JSON.stringify(payload));
    formData.append('foto_principal', recommendPhoto);

    try {
      const response = await authFetch(`/api/indicacoes`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao registrar indicação');

      showToast('Indicação enviada com sucesso para análise! Obrigado pela contribuição.', 'success');
      setIsRecommendModalOpen(false);
      setRecommendPhoto(null);
      setRecommendPhotoPreview('');
      setRecommendData({
        nome: '', descricao: '', tem_climatizacao: false,
        tem_monitores: false, tem_gratuidade: false, porte: 'MEDIO',
        endereco: {
          logradouro: '', numero: '', bairro: '',
          cidade: 'Palmas', estado: 'TO', cep: '',
          localizacao: { latitude: -10.18, longitude: -48.33 }
        }
      });
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRecommendPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setRecommendPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Get initials for review avatars
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  // Helper: calculate playroom average rating
  const getAverageRating = (playroom) => {
    if (!playroom.avaliacoes || playroom.avaliacoes.length === 0) return 0;
    const sum = playroom.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
    return (sum / playroom.avaliacoes.length).toFixed(1);
  };

  // Filter playrooms
  const filteredBrinquedotecas = brinquedotecas.filter(b => {
    const nameMatch = b.indicacao?.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.indicacao?.endereco?.bairro?.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = user?.perfil === 'ADMIN' ? true : b.status === 'ATIVA';
    const sizeMatch = filterSize === 'ALL' || b.indicacao?.porte === filterSize;
    const climatizadoMatch = !filterClimatizado || b.indicacao?.tem_climatizacao;
    const monitoresMatch = !filterMonitores || b.indicacao?.tem_monitores;
    const gratuitoMatch = !filterGratuito || b.indicacao?.tem_gratuidade;

    return nameMatch && statusMatch && sizeMatch && climatizadoMatch && monitoresMatch && gratuitoMatch;
  });

  return (
    <div className="brinquedos-container">
      {/* Background Animated Blobs */}
      <div className="blob-container">
        <div className="blob blob-orange" />
        <div className="blob blob-green" />
        <div className="blob blob-yellow" />
      </div>

      {/* Header */}
      <header className="page-header">
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

      {/* Main Tabs */}
      <div className="tabs-container">
        <div className="tabs-left">
          <button
            className={`tab-item ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            Explorar Brinquedotecas
          </button>

          {user?.perfil === 'CIDADAO' && (
            <button
              className={`tab-item ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              Minhas Indicações
            </button>
          )}

          {user?.perfil === 'ADMIN' && (
            <button
              className={`tab-item ${activeTab === 'admin-indicacoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin-indicacoes')}
            >
              Gerenciar Recomendações
            </button>
          )}
        </div>
        <div className="tabs-right" style={{ marginLeft: 'auto' }}>
          {user && user?.perfil === 'ADMIN' && (
            <Button variant="secondary" onClick={() => navigate('/dashboard')} className="back-btn" style={{ marginTop: '10px', marginLeft: '5px' }}>
              <BarChart3  size={16} /> Dashboard
            </Button>
          )}

          {user && (<Button variant="secondary" onClick={() => setIsRecommendModalOpen(true)} className="back-btn" style={{ marginTop: '10px', marginLeft: '5px' }}>
            <Plus size={16} /> Indicar Espaço
          </Button>)}
        </div>

      </div>

      <main className="brinquedos-main">
        {/* Welcome Banner */}
        <section className="welcome-banner" style={{ marginBottom: '24px' }}>
          <div className="welcome-content">
            <h2>{user ? `Bem-vindo, ${user.nome?.split(' ')[0]}!` : 'Bem-vindo!'}</h2>
            <p>
              {user?.perfil === 'ADMIN'
                ? 'Acompanhe as indicações da comunidade, aprove novas brinquedotecas e mantenha as informações dos espaços sempre atualizadas.'
                : 'Descubra espaços de lazer para crianças em Palmas, compartilhe avaliações e contribua indicando novos locais para a comunidade.'}
            </p>
          </div>
        </section>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Sincronizando dados...</p>
          </div>
        ) : (
          <>
            {/* ======================== EXPLORE TAB ======================== */}
            {activeTab === 'explore' && (
              <div className="explore-section">
                {/* Collapsible Filters */}
                <Card className="filters-card">
                  <button
                    className="filters-toggle-btn"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                  >
                    <span className="filters-toggle-left">
                      <SlidersHorizontal size={18} />
                      <h3>Buscar e Filtrar</h3>
                    </span>
                    <ChevronDown
                      size={20}
                      className={`filters-chevron ${filtersOpen ? 'open' : ''}`}
                    />
                  </button>
                  <div className={`filters-body ${filtersOpen ? 'open' : ''}`}>
                    <div className="filters-grid">
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Buscar por Nome ou Bairro</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            className="input-field"
                            placeholder="Ex: Cesamar, Plano Diretor..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '42px', width: '100%' }}
                          />
                          <Search size={16} style={{
                            position: 'absolute', left: '14px', top: '50%',
                            transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', pointerEvents: 'none'
                          }} />
                        </div>
                      </div>

                      <div className="filter-group">
                        <label>Porte do Espaço</label>
                        <select value={filterSize} onChange={e => setFilterSize(e.target.value)}>
                          <option value="ALL">Todos os tamanhos</option>
                          <option value="PEQUENO">Pequeno</option>
                          <option value="MEDIO">Médio</option>
                          <option value="GRANDE">Grande</option>
                        </select>
                      </div>

                      <div>
                        <label className="filter-group" style={{ marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Características
                        </label>
                        <div className="checkboxes-group">
                          <label className={`checkbox-chip ${filterClimatizado ? 'checked' : ''}`}>
                            <input type="checkbox" checked={filterClimatizado} onChange={e => setFilterClimatizado(e.target.checked)} />
                            <Wind size={14} /> Climatizado
                          </label>
                          <label className={`checkbox-chip ${filterMonitores ? 'checked' : ''}`}>
                            <input type="checkbox" checked={filterMonitores} onChange={e => setFilterMonitores(e.target.checked)} />
                            <Users size={14} /> Monitores
                          </label>
                          <label className={`checkbox-chip ${filterGratuito ? 'checked' : ''}`}>
                            <input type="checkbox" checked={filterGratuito} onChange={e => setFilterGratuito(e.target.checked)} />
                            <Heart size={14} /> Gratuito
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Playrooms Grid */}
                {filteredBrinquedotecas.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <Inbox size={40} />
                    </div>
                    <p>Nenhuma brinquedoteca encontrada com os filtros aplicados. Tente ajustar sua busca!</p>
                  </div>
                ) : (
                  <div className="brinquedos-grid">
                    {filteredBrinquedotecas.map(b => {
                      const rating = getAverageRating(b);
                      const principalPhoto = b.indicacao?.fotografias?.find(f => f.is_principal) || b.indicacao?.fotografias?.[0];
                      const photoUrl = principalPhoto
                        ? `/api/${principalPhoto.caminho}`
                        : '/placeholder-brinquedoteca.jpg';

                      return (
                        <Card key={b.id} className="brinquedo-card" onClick={() => setSelectedBrinquedoteca(b)}>
                          <div className="card-photo-wrapper">
                            <img src={photoUrl} alt={b.indicacao?.nome} className="card-photo" />
                            <span className={`status-tag status-${b.status.toLowerCase()}`}>
                              {b.status}
                            </span>
                          </div>

                          <div className="card-details">
                            <div className="card-title-row">
                              <h3>{b.indicacao?.nome}</h3>
                              <div className="rating-pill">
                                <Star size={12} fill="currentColor" />
                                <span>{rating > 0 ? rating : 'Novo'}</span>
                              </div>
                            </div>

                            <p className="card-desc">
                              {b.indicacao?.descricao || 'Espaço recreativo monitorado com diversas opções de lazer infantil.'}
                            </p>

                            <div className="card-tags">
                              {b.indicacao?.tem_climatizacao && <span className="chip chip-blue">Climatizado</span>}
                              {b.indicacao?.tem_monitores && <span className="chip chip-green">Monitores</span>}
                              {b.indicacao?.tem_gratuidade && <span className="chip chip-orange">Gratuito</span>}
                              <span className="chip chip-gray">{b.indicacao?.porte}</span>
                            </div>

                            <div className="card-footer-location">
                              <MapPin size={13} />
                              <span>{b.indicacao?.endereco?.bairro}, {b.indicacao?.endereco?.cidade}</span>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ======================== CITIZEN RECOMMENDATIONS TAB ======================== */}
            {activeTab === 'recommendations' && (
              <div className="explore-section">
                <div className="section-title-row">
                  <h2>Minhas Indicações de Espaços</h2>
                </div>

                {indicacoes.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <Inbox size={40} />
                    </div>
                    <p>Você ainda não enviou nenhuma indicação de espaço de lazer. Que tal sugerir um agora mesmo?</p>
                  </div>
                ) : (
                  <div className="brinquedos-grid">
                    {indicacoes.map(ind => {
                      const principalPhoto = ind.fotografias?.find(f => f.is_principal) || ind.fotografias?.[0];
                      const photoUrl = principalPhoto
                        ? `/api/${principalPhoto.caminho}`
                        : '/placeholder-brinquedoteca.jpg';

                      return (
                        <Card key={ind.id} className="brinquedo-card" onClick={() => setSelectedIndicacao(ind)}>
                          <div className="card-photo-wrapper">
                            <img src={photoUrl} alt={ind.nome} className="card-photo" />
                            <span className={`status-tag status-${ind.status.toLowerCase()}`}>
                              {ind.status}
                            </span>
                          </div>

                          <div className="card-details">
                            <h3>{ind.nome}</h3>
                            <p className="card-desc">{ind.descricao || 'Nenhuma descrição fornecida.'}</p>

                            <div className="card-tags">
                              {ind.tem_climatizacao && <span className="chip chip-blue">Climatizado</span>}
                              {ind.tem_monitores && <span className="chip chip-green">Monitores</span>}
                              {ind.tem_gratuidade && <span className="chip chip-orange">Gratuito</span>}
                              <span className="chip chip-gray">{ind.porte}</span>
                            </div>

                            <div className="card-footer-location">
                              <MapPin size={13} />
                              <span>{ind.endereco?.bairro}, {ind.endereco?.cidade}</span>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ======================== ADMIN RECOMMENDATIONS TAB ======================== */}
            {activeTab === 'admin-indicacoes' && (
              <div className="explore-section">
                <div className="section-title-row">
                  <h2>Gerenciar Indicações de Cidadãos</h2>
                </div>

                {indicacoes.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <Inbox size={40} />
                    </div>
                    <p>Nenhuma recomendação de espaço cadastrada no sistema.</p>
                  </div>
                ) : (
                  <div className="brinquedos-grid">
                    {indicacoes.map(ind => {
                      const principalPhoto = ind.fotografias?.find(f => f.is_principal) || ind.fotografias?.[0];
                      const photoUrl = principalPhoto
                        ? `/api/${principalPhoto.caminho}`
                        : '/placeholder-brinquedoteca.jpg';

                      return (
                        <Card key={ind.id} className="brinquedo-card" onClick={() => setSelectedIndicacao(ind)}>
                          <div className="card-photo-wrapper">
                            <img src={photoUrl} alt={ind.nome} className="card-photo" />
                            <span className={`status-tag status-${ind.status.toLowerCase()}`}>
                              {ind.status}
                            </span>
                          </div>

                          <div className="card-details">
                            <h3>{ind.nome}</h3>
                            <p className="card-desc">{ind.descricao || 'Nenhuma descrição fornecida.'}</p>

                            <div className="card-tags">
                              {ind.tem_climatizacao && <span className="chip chip-blue">Climatizado</span>}
                              {ind.tem_monitores && <span className="chip chip-green">Monitores</span>}
                              {ind.tem_gratuidade && <span className="chip chip-orange">Gratuito</span>}
                              <span className="chip chip-gray">{ind.porte}</span>
                            </div>

                            <div className="card-footer-location">
                              <MapPin size={13} />
                              <span>{ind.endereco?.bairro}, {ind.endereco?.cidade}</span>
                            </div>

                            {ind.status === 'PENDENTE' && (
                              <div className="card-admin-quick-actions" onClick={e => e.stopPropagation()}>
                                <Button
                                  variant="secondary"
                                  onClick={() => handleApproveIndicacao(ind.id)}
                                  className="approve-action-btn"
                                >
                                  <Check size={13} /> Aprovar
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={() => handleRejectIndicacao(ind.id)}
                                  className="reject-action-btn"
                                >
                                  <Ban size={13} /> Rejeitar
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* ======================== MODAL: PLAYROOM DETAIL ======================== */}
      {selectedBrinquedoteca && (
        <div className="modal-overlay" onClick={() => { setSelectedBrinquedoteca(null); setIsInactivating(false); }}>
          <Card className="modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedBrinquedoteca.indicacao?.nome}</h2>
              <button className="close-btn" onClick={() => { setSelectedBrinquedoteca(null); setIsInactivating(false); }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-split">
              {/* Left: Images & Specs */}
              <div className="modal-body-left">
                <img src={featuredPhotoUrl} alt="Foto Principal" className="modal-featured-image" />

                {/* Clickable thumbnail gallery */}
                {selectedBrinquedoteca.indicacao?.fotografias?.length > 1 && (
                  <div className="modal-gallery">
                    {selectedBrinquedoteca.indicacao.fotografias.map(photo => {
                      const thumbUrl = `/api/${photo.caminho}`;
                      return (
                        <img
                          key={photo.id}
                          src={thumbUrl}
                          alt="Galeria"
                          className={`modal-gallery-thumb ${featuredPhotoUrl === thumbUrl ? 'active-thumb' : ''}`}
                          onClick={() => setFeaturedPhotoUrl(thumbUrl)}
                        />
                      );
                    })}
                  </div>
                )}

                <div className="modal-specs">
                  <h4>Características</h4>
                  <div className="card-tags" style={{ marginBottom: 0 }}>
                    <span className={`chip ${selectedBrinquedoteca.indicacao?.tem_climatizacao ? 'chip-blue' : 'chip-disabled'}`}>
                      {selectedBrinquedoteca.indicacao?.tem_climatizacao ? '✓ Climatizado' : '✗ Sem Ar'}
                    </span>
                    <span className={`chip ${selectedBrinquedoteca.indicacao?.tem_monitores ? 'chip-green' : 'chip-disabled'}`}>
                      {selectedBrinquedoteca.indicacao?.tem_monitores ? '✓ Monitores' : '✗ Sem Monitoria'}
                    </span>
                    <span className={`chip ${selectedBrinquedoteca.indicacao?.tem_gratuidade ? 'chip-orange' : 'chip-disabled'}`}>
                      {selectedBrinquedoteca.indicacao?.tem_gratuidade ? '✓ Gratuito' : '✗ Acesso Pago'}
                    </span>
                    <span className="chip chip-gray">Porte {selectedBrinquedoteca.indicacao?.porte}</span>
                  </div>
                </div>

                <div className="modal-specs">
                  <h4>Endereço Completo</h4>
                  <p className="address-text">
                    {selectedBrinquedoteca.indicacao?.endereco?.logradouro}, {selectedBrinquedoteca.indicacao?.endereco?.numero || 'S/N'}<br />
                    Bairro: {selectedBrinquedoteca.indicacao?.endereco?.bairro}<br />
                    CEP: {selectedBrinquedoteca.indicacao?.endereco?.cep}<br />
                    {selectedBrinquedoteca.indicacao?.endereco?.cidade} - {selectedBrinquedoteca.indicacao?.endereco?.estado}
                  </p>
                  <div className="coordinates">
                    <MapPin size={12} />
                    <span>
                      Lat: {selectedBrinquedoteca.indicacao?.endereco?.localizacao?.latitude} |
                      Long: {selectedBrinquedoteca.indicacao?.endereco?.localizacao?.longitude}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Details & Reviews */}
              <div className="modal-body-right">
                <div className="modal-title-desc">
                  <p className="status-indicator">
                    Status:
                    <span className={`status-badge status-${selectedBrinquedoteca.status.toLowerCase()}`}>
                      {selectedBrinquedoteca.status}
                    </span>
                  </p>
                  <p className="modal-description-text">
                    {selectedBrinquedoteca.indicacao?.descricao || 'Espaço reservado para o desenvolvimento cognitivo e lazer das crianças.'}
                  </p>

                  {selectedBrinquedoteca.status === 'INATIVA' && selectedBrinquedoteca.observacao && (
                    <div className="invalidation-alert">
                      <strong>Motivo da Inativação:</strong> {selectedBrinquedoteca.observacao}
                    </div>
                  )}
                </div>

                {/* Evaluations Section */}
                <div className="modal-evaluations-section">
                  <h3>
                    Avaliações ({selectedBrinquedoteca.avaliacoes?.length || 0})
                  </h3>

                  <div className="evaluations-list">
                    {!selectedBrinquedoteca.avaliacoes || selectedBrinquedoteca.avaliacoes.length === 0 ? (
                      <p className="no-reviews-note">Esta brinquedoteca ainda não tem avaliações. Seja o primeiro!</p>
                    ) : (
                      selectedBrinquedoteca.avaliacoes.map(review => (
                        <div key={review.id} className="review-item">
                          <div className="review-avatar">
                            {getInitials(review.usuario_avaliador?.nome || (review.usuario_avaliador_id === user?.id ? user?.nome : 'U'))}
                          </div>
                          <div className="review-body">
                            <div className="review-header">
                              <strong>{review.usuario_avaliador?.nome || (review.usuario_avaliador_id === user?.id ? user?.nome : 'Usuário')}</strong>
                              <div className="review-stars">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={13}
                                    fill={i < review.nota ? 'var(--tertiary)' : 'none'}
                                    color="var(--tertiary)"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="review-comment">{review.comentario}</p>
                            <span className="review-date">
                              {review.data_avaliacao ? new Date(review.data_avaliacao).toLocaleDateString('pt-BR') : 'Recente'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add review form (Citizen only, active playroom) */}
                  {user?.perfil === 'CIDADAO' && selectedBrinquedoteca.status === 'ATIVA' && (
                    <form onSubmit={handleAddReview} className="add-review-form">
                      <h4>Deixar Avaliação</h4>

                      <div>
                        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '8px' }}>
                          Sua Nota
                        </label>
                        <div className="star-rating-selector">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              className={`star-btn ${star <= (hoverRating || reviewRating) ? 'active' : ''}`}
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                            >
                              <Star size={26} fill={star <= (hoverRating || reviewRating) ? 'currentColor' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <Input
                        label="Compartilhe sua experiência"
                        placeholder="Como foi a experiência das crianças neste espaço?"
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        required
                      />

                      <Button type="submit">
                        <MessageSquare size={16} /> Enviar Avaliação
                      </Button>
                    </form>
                  )}

                  {/* Inactivate Button (Admin only) */}
                  {user?.perfil === 'ADMIN' && selectedBrinquedoteca.status === 'ATIVA' && !isInactivating && (
                    <Button
                      variant="secondary"
                      onClick={() => setIsInactivating(true)}
                      style={{ color: 'var(--error)', borderColor: 'var(--error)', width: '100%', marginTop: '16px' }}
                    >
                      <Ban size={16} /> Inativar Brinquedoteca
                    </Button>
                  )}

                  {isInactivating && (
                    <form onSubmit={handleInactivate} className="inactivate-reason-form">
                      <h4>Justificativa de Inativação</h4>
                      <Input
                        placeholder="Ex: Reformas estruturais, problemas de segurança..."
                        value={inactivateReason}
                        onChange={e => setInactivateReason(e.target.value)}
                        required
                      />
                      <div className="inactivate-form-actions">
                        <Button variant="secondary" type="button" onClick={() => setIsInactivating(false)}>Cancelar</Button>
                        <Button type="submit" style={{ backgroundColor: 'var(--error)' }}>Confirmar Inativação</Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ======================== MODAL: RECOMMENDATION DETAIL ======================== */}
      {selectedIndicacao && (
        <div className="modal-overlay" onClick={() => setSelectedIndicacao(null)}>
          <Card className="modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedIndicacao.nome}</h2>
              <button className="close-btn" onClick={() => setSelectedIndicacao(null)}><X size={20} /></button>
            </div>

            <div className="modal-body-split">
              <div className="modal-body-left">
                {(() => {
                  const principal = selectedIndicacao.fotografias?.find(f => f.is_principal) || selectedIndicacao.fotografias?.[0];
                  const photoUrl = principal ? `/api/${principal.caminho}` : '/placeholder-brinquedoteca.jpg';
                  return <img src={photoUrl} alt="Foto Principal" className="modal-featured-image" />;
                })()}

                <div className="modal-specs">
                  <h4>Endereço Recomendado</h4>
                  <p className="address-text">
                    {selectedIndicacao.endereco?.logradouro}, {selectedIndicacao.endereco?.numero || 'S/N'}<br />
                    Bairro: {selectedIndicacao.endereco?.bairro}<br />
                    CEP: {selectedIndicacao.endereco?.cep}<br />
                    {selectedIndicacao.endereco?.cidade} - {selectedIndicacao.endereco?.estado}
                  </p>
                  <div className="coordinates">
                    <MapPin size={12} />
                    <span>Lat: {selectedIndicacao.endereco?.localizacao?.latitude} | Long: {selectedIndicacao.endereco?.localizacao?.longitude}</span>
                  </div>
                </div>

                {selectedIndicacao.fotografias?.length > 0 && (
                  <div className="modal-specs">
                    <h4>Galeria Fotográfica</h4>
                    <div className="modal-gallery">
                      {selectedIndicacao.fotografias.map(photo => (
                        <img
                          key={photo.id}
                          src={`/api/${photo.caminho}`}
                          alt="Foto"
                          className="modal-gallery-thumb"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-body-right">
                <div className="modal-title-desc">
                  <p className="status-indicator">
                    Status da Análise:
                    <span className={`status-badge status-${selectedIndicacao.status.toLowerCase()}`}>
                      {selectedIndicacao.status}
                    </span>
                  </p>
                  <p className="modal-description-text">
                    {selectedIndicacao.descricao || 'O cidadão sugere transformar este local em uma brinquedoteca ativa.'}
                  </p>
                </div>

                <div className="modal-specs">
                  <h4>Atributos sugeridos</h4>
                  <div className="card-tags" style={{ marginBottom: 0 }}>
                    {selectedIndicacao.tem_climatizacao && <span className="chip chip-blue">Climatizado</span>}
                    {selectedIndicacao.tem_monitores && <span className="chip chip-green">Monitores</span>}
                    {selectedIndicacao.tem_gratuidade && <span className="chip chip-orange">Gratuito</span>}
                    <span className="chip chip-gray">Porte: {selectedIndicacao.porte}</span>
                  </div>
                </div>

                <div className="modal-specs tracking-dates">
                  <h4>Rastreabilidade</h4>
                  <ul>
                    <li>Cadastrada em: {new Date(selectedIndicacao.data_criacao).toLocaleString('pt-BR')}</li>
                    {selectedIndicacao.data_aprovacao && <li>Aprovada em: {new Date(selectedIndicacao.data_aprovacao).toLocaleString('pt-BR')}</li>}
                    {selectedIndicacao.data_rejeicao && <li>Rejeitada em: {new Date(selectedIndicacao.data_rejeicao).toLocaleString('pt-BR')}</li>}
                  </ul>
                </div>

                <div className="modal-indicacao-actions">
                  {user?.perfil === 'ADMIN' && selectedIndicacao.status === 'PENDENTE' && (
                    <div className="admin-modal-decision-buttons">
                      <Button onClick={() => handleApproveIndicacao(selectedIndicacao.id)} style={{ width: '100%' }}>
                        <Check size={18} /> Aprovar e Ativar Espaço
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleRejectIndicacao(selectedIndicacao.id)}
                        style={{ width: '100%', color: 'var(--error)', borderColor: 'var(--error)' }}
                      >
                        <Ban size={18} /> Rejeitar Indicação
                      </Button>
                    </div>
                  )}

                  {user?.perfil === 'CIDADAO' && selectedIndicacao.status === 'PENDENTE' && (
                    <Button
                      variant="secondary"
                      onClick={() => handleCancelIndicacao(selectedIndicacao.id)}
                      style={{ color: 'var(--error)', borderColor: 'var(--error)', width: '100%' }}
                    >
                      <Trash size={16} /> Cancelar Sugestão de Espaço
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ======================== MODAL: SUBMIT NEW RECOMMENDATION ======================== */}
      {isRecommendModalOpen && (
        <ModalIndicacao
          recommendData={recommendData}
          setIsRecommendModalOpen={setIsRecommendModalOpen}
          handleRecommendSubmit={handleRecommendSubmit}
          setRecommendData={setRecommendData}
          recommendPhotoPreview={recommendPhotoPreview}
          recommendPhoto={recommendPhoto}
          handlePhotoChange={handlePhotoChange}
        />
      )}
    </div>
  );
}
