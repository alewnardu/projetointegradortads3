import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { 
  ArrowLeft, Star, MapPin, SlidersHorizontal, Plus, 
  Sparkles, ShieldCheck, X, Check, Eye, Trash, Ban, MessageSquare,
  LogOut
} from 'lucide-react';
import './Brinquedos.css';

export function Brinquedos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

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

  // Evaluation Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Recommendation Form State
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [recommendPhoto, setRecommendPhoto] = useState(null);
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

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!storedToken || !storedUser) {
      navigate('/login');
      return;
    }

    setToken(storedToken);
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Auto-set tab based on navigation state or profile
      if (location.state?.activeTab) {
        setActiveTab(location.state.activeTab);
      } else if (parsedUser.perfil === 'ADMIN') {
        setActiveTab('explore');
      } else {
        setActiveTab('explore');
      }
    } catch (e) {
      console.error(e);
      navigate('/login');
    }
  }, [navigate, location]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError('');

    try {
      // 1. Fetch playrooms (brinquedotecas)
      const playroomsRes = await fetch('http://localhost:5000/brinquedotecas');
      const playroomsData = await playroomsRes.json();
      if (!playroomsRes.ok) throw new Error(playroomsData.error || 'Erro ao buscar brinquedotecas');
      setBrinquedotecas(playroomsData.data || []);

      // 2. Fetch space recommendations (indicacoes)
      const reqHeaders = { 'Authorization': `Bearer ${token}` };
      const indicacoesRes = await fetch('http://localhost:5000/indicacoes', { headers: reqHeaders });
      if (indicacoesRes.status !== 401 && indicacoesRes.status !== 403) {
        const indicacoesData = await indicacoesRes.json();
        if (indicacoesRes.ok) {
          setIndicacoes(indicacoesData.data || []);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Handle Playroom Inactivation (Admin only)
  const handleInactivate = async (e) => {
    e.preventDefault();
    if (!inactivateReason.trim()) {
      alert('Por favor, informe uma observação ou justificativa.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/brinquedotecas/${selectedBrinquedoteca.id}/inativar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ observacao: inactivateReason })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao inativar brinquedoteca');

      alert('Brinquedoteca inativada com sucesso.');
      setSelectedBrinquedoteca(null);
      setIsInactivating(false);
      setInactivateReason('');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (reviewComment.trim().length < 10) {
      alert('O comentário deve ter no mínimo 10 caracteres.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/brinquedotecas/${selectedBrinquedoteca.id}/avaliar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nota: Number(reviewRating),
          comentario: reviewComment
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao avaliar a brinquedoteca');

      alert('Avaliação enviada com sucesso!');
      setReviewComment('');
      // Update selected playroom details to render new reviews
      setSelectedBrinquedoteca(data.data);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Suggestion Approval (Admin only)
  const handleApproveIndicacao = async (id) => {
    if (!window.confirm('Deseja realmente aprovar esta indicação? Isso criará uma brinquedoteca ativa automaticamente.')) return;

    try {
      const response = await fetch(`http://localhost:5000/indicacoes/${id}/aprovar`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao aprovar indicação');

      alert('Indicação aprovada e Brinquedoteca criada com sucesso!');
      setSelectedIndicacao(null);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Suggestion Rejection (Admin only)
  const handleRejectIndicacao = async (id) => {
    if (!window.confirm('Deseja realmente rejeitar esta indicação?')) return;

    try {
      const response = await fetch(`http://localhost:5000/indicacoes/${id}/rejeitar`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao rejeitar indicação');

      alert('Indicação rejeitada.');
      setSelectedIndicacao(null);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Suggestion Cancellation (Citizen owner only)
  const handleCancelIndicacao = async (id) => {
    if (!window.confirm('Deseja realmente cancelar sua indicação?')) return;

    try {
      const response = await fetch(`http://localhost:5000/indicacoes/${id}/cancelar`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao cancelar indicação');

      alert('Indicação cancelada com sucesso.');
      setSelectedIndicacao(null);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Recommendation Space submission
  const handleRecommendSubmit = async (e) => {
    e.preventDefault();
    if (!recommendPhoto) {
      alert('Por favor, faça upload de uma foto principal do local.');
      return;
    }

    // Basic CEP validation
    const cepDigits = recommendData.endereco.cep.replace(/\D/g, '');
    if (cepDigits.length !== 8) {
      alert('O CEP deve conter exatamente 8 dígitos numéricos.');
      return;
    }

    const payload = {
      ...recommendData,
      endereco: {
        ...recommendData.endereco,
        cep: cepDigits
      }
    };

    const formData = new FormData();
    formData.append('dados', JSON.stringify(payload));
    formData.append('foto_principal', recommendPhoto);

    try {
      const response = await fetch('http://localhost:5000/indicacoes', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao registrar indicação');

      alert('Indicação de brinquedoteca enviada com sucesso para análise!');
      setIsRecommendModalOpen(false);
      setRecommendPhoto(null);
      // Reset form
      setRecommendData({
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
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Helper: calculate playroom average rating
  const getAverageRating = (playroom) => {
    if (!playroom.avaliacoes || playroom.avaliacoes.length === 0) return 0;
    const sum = playroom.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
    return (sum / playroom.avaliacoes.length).toFixed(1);
  };

  // Filter playrooms
  const filteredBrinquedotecas = brinquedotecas.filter(b => {
    // 1. Text Search
    const nameMatch = b.indicacao?.nome?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      b.observacao?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Status check: Citizens only see ATIVA, Admins see all
    const statusMatch = user?.perfil === 'ADMIN' ? true : b.status === 'ATIVA';

    // 3. Filters
    const sizeMatch = filterSize === 'ALL' || b.indicacao?.porte === filterSize;
    const climatizadoMatch = !filterClimatizado || b.indicacao?.tem_climatizacao;
    const monitoresMatch = !filterMonitores || b.indicacao?.tem_monitores;
    const gratuitoMatch = !filterGratuito || b.indicacao?.tem_gratuidade;

    return nameMatch && statusMatch && sizeMatch && climatizadoMatch && monitoresMatch && gratuitoMatch;
  });

  return (
    <div className="brinquedos-container">
      {/* Header */}
      <header className="page-header">
        {user?.perfil === 'ADMIN' ? (
          <Button variant="secondary" onClick={() => navigate('/dashboard')} className="back-btn">
            <ArrowLeft size={18} /> Voltar
          </Button>
        ) : (
          <Button variant="secondary" onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Sair
          </Button>
        )}
        <div className="page-brand">
          <img src="/logo.png" alt="TO Brincando" className="page-logo" />
          <h1>Central TO Brincando</h1>
        </div>
        {user?.perfil === 'CIDADAO' && (
          <Button className="add-btn" onClick={() => setIsRecommendModalOpen(true)}>
            <Plus size={18} /> Indicar Novo Espaço
          </Button>
        )}
      </header>

      {/* Main Tabs Selection */}
      <div className="tabs-container">
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

      <main className="brinquedos-main">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Sincronizando dados...</p>
          </div>
        ) : (
          <>
            {/* EXPLORE TAB */}
            {activeTab === 'explore' && (
              <div className="explore-section">
                {/* Filters Row */}
                <Card className="filters-card">
                  <div className="filters-header">
                    <SlidersHorizontal size={18} />
                    <h3>Buscar e Filtrar</h3>
                  </div>
                  <div className="filters-grid">
                    <Input 
                      placeholder="Pesquisar por nome ou bairro..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />

                    <div className="filter-group">
                      <label>Porte do Espaço</label>
                      <select value={filterSize} onChange={e => setFilterSize(e.target.value)}>
                        <option value="ALL">Todos os tamanhos</option>
                        <option value="PEQUENO">Pequeno</option>
                        <option value="MEDIO">Médio</option>
                        <option value="GRANDE">Grande</option>
                      </select>
                    </div>

                    <div className="checkboxes-group">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={filterClimatizado} 
                          onChange={e => setFilterClimatizado(e.target.checked)} 
                        />
                        Climatizado
                      </label>
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={filterMonitores} 
                          onChange={e => setFilterMonitores(e.target.checked)} 
                        />
                        Monitores Supervisionados
                      </label>
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={filterGratuito} 
                          onChange={e => setFilterGratuito(e.target.checked)} 
                        />
                        Gratuidade Completa
                      </label>
                    </div>
                  </div>
                </Card>

                {/* Grid Lists */}
                {filteredBrinquedotecas.length === 0 ? (
                  <div className="empty-state">
                    <p>Nenhuma brinquedoteca corresponde aos seus critérios de busca.</p>
                  </div>
                ) : (
                  <div className="brinquedos-grid">
                    {filteredBrinquedotecas.map(b => {
                      const rating = getAverageRating(b);
                      const principalPhoto = b.indicacao?.fotografias?.find(f => f.is_principal) || b.indicacao?.fotografias?.[0];
                      const photoUrl = principalPhoto 
                        ? `http://localhost:5000/${principalPhoto.caminho}` 
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
                                <Star size={14} fill="currentColor" />
                                <span>{rating > 0 ? rating : 'Novo'}</span>
                              </div>
                            </div>
                            
                            <p className="card-desc">
                              {b.indicacao?.descricao || 'Parquinho recreativo monitorado com diversas opções de lazer.'}
                            </p>

                            <div className="card-tags">
                              {b.indicacao?.tem_climatizacao && <span className="chip chip-blue">Climatizado</span>}
                              {b.indicacao?.tem_monitores && <span className="chip chip-green">Monitores</span>}
                              {b.indicacao?.tem_gratuidade && <span className="chip chip-orange">Gratuito</span>}
                              <span className="chip chip-gray">{b.indicacao?.porte}</span>
                            </div>

                            <div className="card-footer-location">
                              <MapPin size={14} />
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

            {/* RECOMMENDATIONS TAB (Citizen only) */}
            {activeTab === 'recommendations' && (
              <div className="explore-section">
                <div className="section-title-row">
                  <h2>Acompanhe Suas Sugestões de Espaços</h2>
                  <Button className="add-btn" onClick={() => setIsRecommendModalOpen(true)}>
                    <Plus size={18} /> Sugerir Novo Local
                  </Button>
                </div>

                {indicacoes.length === 0 ? (
                  <div className="empty-state">
                    <p>Você ainda não enviou nenhuma indicação de espaço de lazer. Que tal sugerir um agora mesmo?</p>
                  </div>
                ) : (
                  <div className="brinquedos-grid">
                    {indicacoes.map(ind => {
                      const principalPhoto = ind.fotografias?.find(f => f.is_principal) || ind.fotografias?.[0];
                      const photoUrl = principalPhoto 
                        ? `http://localhost:5000/${principalPhoto.caminho}` 
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
                              <MapPin size={14} />
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

            {/* ADMIN RECOMMENDATIONS TAB */}
            {activeTab === 'admin-indicacoes' && (
              <div className="explore-section">
                <h2>Gerenciar Indicações Enviadas por Cidadãos</h2>

                {indicacoes.length === 0 ? (
                  <div className="empty-state">
                    <p>Nenhuma recomendação de espaço cadastrada no sistema.</p>
                  </div>
                ) : (
                  <div className="brinquedos-grid">
                    {indicacoes.map(ind => {
                      const principalPhoto = ind.fotografias?.find(f => f.is_principal) || ind.fotografias?.[0];
                      const photoUrl = principalPhoto 
                        ? `http://localhost:5000/${principalPhoto.caminho}` 
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
                              <MapPin size={14} />
                              <span>{ind.endereco?.bairro}, {ind.endereco?.cidade}</span>
                            </div>

                            {ind.status === 'PENDENTE' && (
                              <div className="card-admin-quick-actions" onClick={e => e.stopPropagation()}>
                                <Button 
                                  variant="secondary" 
                                  onClick={() => handleApproveIndicacao(ind.id)}
                                  className="approve-action-btn"
                                >
                                  <Check size={14} /> Aprovar
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  onClick={() => handleRejectIndicacao(ind.id)}
                                  className="reject-action-btn"
                                  style={{ color: 'var(--error)' }}
                                >
                                  <Ban size={14} /> Rejeitar
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

      {/* DETAIL MODAL: PLAYROOM (BRINQUEDOTECA) */}
      {selectedBrinquedoteca && (
        <div className="modal-overlay" onClick={() => { setSelectedBrinquedoteca(null); setIsInactivating(false); }}>
          <Card className="modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes da Brinquedoteca</h2>
              <button className="close-btn" onClick={() => { setSelectedBrinquedoteca(null); setIsInactivating(false); }}><X size={24} /></button>
            </div>

            <div className="modal-body-split">
              {/* Left Side: Images and Quick specs */}
              <div className="modal-body-left">
                {(() => {
                  const principalPhoto = selectedBrinquedoteca.indicacao?.fotografias?.find(f => f.is_principal) || selectedBrinquedoteca.indicacao?.fotografias?.[0];
                  const photoUrl = principalPhoto 
                    ? `http://localhost:5000/${principalPhoto.caminho}` 
                    : '/placeholder-brinquedoteca.jpg';
                  return <img src={photoUrl} alt="Foto Principal" className="modal-featured-image" />;
                })()}

                {/* Additional gallery if exists */}
                {selectedBrinquedoteca.indicacao?.fotografias?.length > 1 && (
                  <div className="modal-gallery">
                    {selectedBrinquedoteca.indicacao.fotografias.map(photo => (
                      <img 
                        key={photo.id} 
                        src={`http://localhost:5000/${photo.caminho}`} 
                        alt="Galeria" 
                        className="modal-gallery-thumb" 
                      />
                    ))}
                  </div>
                )}

                <div className="modal-specs">
                  <h4>Características Técnicas</h4>
                  <div className="card-tags">
                    <span className={`chip ${selectedBrinquedoteca.indicacao?.tem_climatizacao ? 'chip-blue' : 'chip-disabled'}`}>
                      {selectedBrinquedoteca.indicacao?.tem_climatizacao ? 'Climatizado' : 'Sem Ar Condicionado'}
                    </span>
                    <span className={`chip ${selectedBrinquedoteca.indicacao?.tem_monitores ? 'chip-green' : 'chip-disabled'}`}>
                      {selectedBrinquedoteca.indicacao?.tem_monitores ? 'Monitores' : 'Sem Monitoria'}
                    </span>
                    <span className={`chip ${selectedBrinquedoteca.indicacao?.tem_gratuidade ? 'chip-orange' : 'chip-disabled'}`}>
                      {selectedBrinquedoteca.indicacao?.tem_gratuidade ? 'Gratuito' : 'Acesso Pago'}
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
                    <MapPin size={14} /> 
                    <span>
                      Lat: {selectedBrinquedoteca.indicacao?.endereco?.localizacao?.latitude} | 
                      Long: {selectedBrinquedoteca.indicacao?.endereco?.localizacao?.longitude}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Details, reviews and ratings */}
              <div className="modal-body-right">
                <div className="modal-title-desc">
                  <h2>{selectedBrinquedoteca.indicacao?.nome}</h2>
                  <p className="status-indicator">
                    Status Atual: 
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
                  <h3>Comentários e Avaliações</h3>
                  
                  <div className="evaluations-list">
                    {!selectedBrinquedoteca.avaliacoes || selectedBrinquedoteca.avaliacoes.length === 0 ? (
                      <p className="no-reviews-note">Esta brinquedoteca ainda não recebeu avaliações dos pais. Seja o primeiro a opinar!</p>
                    ) : (
                      selectedBrinquedoteca.avaliacoes.map(review => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <strong>{review.usuario_avaliador?.nome || (review.usuario_avaliador_id === user?.id ? user?.nome : 'Usuário')}</strong>
                            <div className="review-stars">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={12} 
                                  fill={i < review.nota ? "var(--tertiary-container)" : "none"} 
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
                      ))
                    )}
                  </div>

                  {/* Add review form (Citizen only and playroom must be active) */}
                  {user?.perfil === 'CIDADAO' && selectedBrinquedoteca.status === 'ATIVA' && (
                    <form onSubmit={handleAddReview} className="add-review-form">
                      <h4>Escrever Avaliação</h4>
                      
                      <div className="input-group">
                        <label>Nota (1 a 5 Estrelas)</label>
                        <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))}>
                          <option value="5">⭐⭐⭐⭐⭐ (Excelente)</option>
                          <option value="4">⭐⭐⭐⭐ (Muito bom)</option>
                          <option value="3">⭐⭐⭐ (Regular)</option>
                          <option value="2">⭐⭐ (Ruim)</option>
                          <option value="1">⭐ (Péssimo)</option>
                        </select>
                      </div>

                      <Input 
                        label="Opinião/Observações"
                        placeholder="Compartilhe como foi a experiência das crianças..."
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        required
                      />

                      <Button type="submit">Enviar Avaliação</Button>
                    </form>
                  )}

                  {/* Inactivate Button (Admin only) */}
                  {user?.perfil === 'ADMIN' && selectedBrinquedoteca.status === 'ATIVA' && !isInactivating && (
                    <Button 
                      variant="secondary" 
                      onClick={() => setIsInactivating(true)}
                      className="inactivate-btn"
                      style={{ color: 'var(--error)', width: '100%', marginTop: '20px' }}
                    >
                      <Ban size={16} /> Inativar Brinquedoteca
                    </Button>
                  )}

                  {isInactivating && (
                    <form onSubmit={handleInactivate} className="inactivate-reason-form">
                      <h4>Justificativa de Inativação</h4>
                      <Input 
                        placeholder="Descreva o motivo (Ex: reformas estruturais, quebra de contratos...)" 
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

      {/* DETAIL MODAL: RECOMMENDATION (INDICAÇÃO) */}
      {selectedIndicacao && (
        <div className="modal-overlay" onClick={() => setSelectedIndicacao(null)}>
          <Card className="modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes da Indicação de Espaço</h2>
              <button className="close-btn" onClick={() => setSelectedIndicacao(null)}><X size={24} /></button>
            </div>

            <div className="modal-body-split">
              {/* Left Side: Images and Address */}
              <div className="modal-body-left">
                {(() => {
                  const principalPhoto = selectedIndicacao.fotografias?.find(f => f.is_principal) || selectedIndicacao.fotografias?.[0];
                  const photoUrl = principalPhoto 
                    ? `http://localhost:5000/${principalPhoto.caminho}` 
                    : '/placeholder-brinquedoteca.jpg';
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
                    <MapPin size={14} /> 
                    <span>
                      Lat: {selectedIndicacao.endereco?.localizacao?.latitude} | 
                      Long: {selectedIndicacao.endereco?.localizacao?.longitude}
                    </span>
                  </div>
                </div>

                <div className="modal-specs">
                  <h4>Galeria Fotográfica</h4>
                  {selectedIndicacao.fotografias?.length > 0 ? (
                    <div className="modal-gallery">
                      {selectedIndicacao.fotografias.map(photo => (
                        <img 
                          key={photo.id} 
                          src={`http://localhost:5000/${photo.caminho}`} 
                          alt="Foto" 
                          className="modal-gallery-thumb" 
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="no-reviews-note">Nenhuma outra foto anexada.</p>
                  )}
                </div>
              </div>

              {/* Right Side: Details & Actions */}
              <div className="modal-body-right">
                <div className="modal-title-desc">
                  <h2>{selectedIndicacao.nome}</h2>
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
                  <h4>Atributos sugeridos pelo cidadão</h4>
                  <div className="card-tags">
                    {selectedIndicacao.tem_climatizacao && <span className="chip chip-blue">Possui Climatização</span>}
                    {selectedIndicacao.tem_monitores && <span className="chip chip-green">Possui Monitores</span>}
                    {selectedIndicacao.tem_gratuidade && <span className="chip chip-orange">Livre e Gratuito</span>}
                    <span className="chip chip-gray">Porte sugerido: {selectedIndicacao.porte}</span>
                  </div>
                </div>

                {/* Dates Tracking */}
                <div className="modal-specs tracking-dates">
                  <h4>Rastreabilidade</h4>
                  <ul>
                    <li>Cadastrada em: {new Date(selectedIndicacao.data_criacao).toLocaleString('pt-BR')}</li>
                    {selectedIndicacao.data_aprovacao && <li>Aprovada em: {new Date(selectedIndicacao.data_aprovacao).toLocaleString('pt-BR')}</li>}
                    {selectedIndicacao.data_rejeicao && <li>Rejeitada em: {new Date(selectedIndicacao.data_rejeicao).toLocaleString('pt-BR')}</li>}
                  </ul>
                </div>

                {/* Actions */}
                <div className="modal-indicacao-actions">
                  {/* Admin actions */}
                  {user?.perfil === 'ADMIN' && selectedIndicacao.status === 'PENDENTE' && (
                    <div className="admin-modal-decision-buttons">
                      <Button 
                        onClick={() => handleApproveIndicacao(selectedIndicacao.id)}
                        className="approve-action-large-btn"
                        style={{ width: '100%', marginBottom: '10px' }}
                      >
                        <Check size={18} /> Aprovar e Ativar Espaço
                      </Button>
                      <Button 
                        variant="secondary"
                        onClick={() => handleRejectIndicacao(selectedIndicacao.id)}
                        className="reject-action-large-btn"
                        style={{ width: '100%', color: 'var(--error)' }}
                      >
                        <Ban size={18} /> Rejeitar Indicação
                      </Button>
                    </div>
                  )}

                  {/* Citizen owner cancel action */}
                  {user?.perfil === 'CIDADAO' && selectedIndicacao.status === 'PENDENTE' && (
                    <Button 
                      variant="secondary"
                      onClick={() => handleCancelIndicacao(selectedIndicacao.id)}
                      style={{ color: 'var(--error)', width: '100%' }}
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

      {/* MODAL: SUBMIT NEW PLAYROOM RECOMMENDATION (INDICAÇÃO) */}
      {isRecommendModalOpen && (
        <div className="modal-overlay" onClick={() => setIsRecommendModalOpen(false)}>
          <Card className="modal-content glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Indicar Novo Espaço de Lazer</h2>
              <button className="close-btn" onClick={() => setIsRecommendModalOpen(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleRecommendSubmit} className="recommend-form">
              <div className="form-sections-grid">
                {/* Section A: Info */}
                <div className="form-column">
                  <h3>Informações do Local</h3>
                  
                  <Input 
                    label="Nome Sugerido do Espaço"
                    placeholder="Ex: Brinquedoteca do Parque Cesamar"
                    value={recommendData.nome}
                    onChange={e => setRecommendData({ ...recommendData, nome: e.target.value })}
                    required
                  />

                  <div className="input-group">
                    <label>Breve Descrição do Local</label>
                    <textarea 
                      className="form-textarea"
                      placeholder="Descreva a estrutura, brinquedos disponíveis, o que precisa de melhoria..."
                      value={recommendData.descricao}
                      onChange={e => setRecommendData({ ...recommendData, descricao: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Porte Sugerido</label>
                    <select 
                      value={recommendData.porte} 
                      onChange={e => setRecommendData({ ...recommendData, porte: e.target.value })}
                    >
                      <option value="PEQUENO">Pequeno (Até 50m²)</option>
                      <option value="MEDIO">Médio (50m² a 150m²)</option>
                      <option value="GRANDE">Grande (Mais de 150m²)</option>
                    </select>
                  </div>

                  <div className="form-checkboxes">
                    <h4>Características Disponíveis</h4>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox"
                        checked={recommendData.tem_climatizacao}
                        onChange={e => setRecommendData({ ...recommendData, tem_climatizacao: e.target.checked })}
                      />
                      O espaço é climatizado (Ar condicionado)
                    </label>

                    <label className="checkbox-label">
                      <input 
                        type="checkbox"
                        checked={recommendData.tem_monitores}
                        onChange={e => setRecommendData({ ...recommendData, tem_monitores: e.target.checked })}
                      />
                      O espaço possui monitores para supervisionar as crianças
                    </label>

                    <label className="checkbox-label">
                      <input 
                        type="checkbox"
                        checked={recommendData.tem_gratuidade}
                        onChange={e => setRecommendData({ ...recommendData, tem_gratuidade: e.target.checked })}
                      />
                      O acesso é 100% público e gratuito
                    </label>
                  </div>
                </div>

                {/* Section B: Address & Photo */}
                <div className="form-column">
                  <h3>Localização e Endereço</h3>

                  <Input 
                    label="CEP (Apenas 8 números)"
                    placeholder="77000000"
                    maxLength={8}
                    value={recommendData.endereco.cep}
                    onChange={e => setRecommendData({ 
                      ...recommendData, 
                      endereco: { ...recommendData.endereco, cep: e.target.value } 
                    })}
                    required
                  />

                  <Input 
                    label="Logradouro / Avenida"
                    placeholder="Ex: Av. NS 2, Quadra 102 Sul"
                    value={recommendData.endereco.logradouro}
                    onChange={e => setRecommendData({ 
                      ...recommendData, 
                      endereco: { ...recommendData.endereco, logradouro: e.target.value } 
                    })}
                    required
                  />

                  <div className="form-row-2">
                    <Input 
                      label="Número (opcional)"
                      placeholder="Ex: S/N ou Lote 4"
                      value={recommendData.endereco.numero}
                      onChange={e => setRecommendData({ 
                        ...recommendData, 
                        endereco: { ...recommendData.endereco, numero: e.target.value } 
                      })}
                    />

                    <Input 
                      label="Bairro"
                      placeholder="Ex: Plano Diretor Sul"
                      value={recommendData.endereco.bairro}
                      onChange={e => setRecommendData({ 
                        ...recommendData, 
                        endereco: { ...recommendData.endereco, bairro: e.target.value } 
                      })}
                      required
                    />
                  </div>

                  <div className="form-row-2">
                    <Input 
                      label="Cidade"
                      value={recommendData.endereco.cidade}
                      disabled
                      required
                    />

                    <Input 
                      label="Estado (UF)"
                      value={recommendData.endereco.estado}
                      disabled
                      required
                    />
                  </div>



                  <div className="input-group">
                    <label>Fotografia Principal do Local (Obrigatório)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => setRecommendPhoto(e.target.files[0])}
                      required
                    />
                    <span className="input-file-help">Envie fotos nos formatos .png, .jpg ou .webp</span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <Button variant="secondary" type="button" onClick={() => setIsRecommendModalOpen(false)}>Cancelar</Button>
                <Button type="submit">Enviar Indicação</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
