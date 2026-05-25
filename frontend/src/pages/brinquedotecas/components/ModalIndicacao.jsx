import React from 'react';
import { Card } from '../../../components/Card';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

import {
    Sparkles,
    X,
    Upload,
    Check
} from 'lucide-react';

export function ModalIndicacao({
    recommendData,
    setIsRecommendModalOpen,
    handleRecommendSubmit,
    setRecommendData,

    photos,
    photoPreviews,
    handlePhotosChange
}) {

    const fotoPrincipal = photos?.[0];
    const previewPrincipal = photoPreviews?.[0];

    const fotosAdicionais = photos?.slice(1) || [];
    const previewsAdicionais = photoPreviews?.slice(1) || [];

    return (
        <div
            className="modal-overlay"
            onClick={() => setIsRecommendModalOpen(false)}
        >
            <Card
                className="modal-content glass"
                onClick={e => e.stopPropagation()}
                style={{ maxWidth: '860px' }}
            >
                <div className="modal-header">
                    <h2>Indicar Novo Espaço de Lazer</h2>

                    <button
                        className="close-btn"
                        onClick={() => setIsRecommendModalOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleRecommendSubmit}
                    className="recommend-form"
                >
                    <div className="form-sections-grid">

                        {/* COLUNA 1 */}

                        <div className="form-column">
                            <h3>Informações do Local</h3>

                            <Input
                                label="Nome Sugerido do Espaço"
                                placeholder="Ex: Brinquedoteca do Parque Cesamar"
                                value={recommendData.nome}
                                onChange={e =>
                                    setRecommendData({
                                        ...recommendData,
                                        nome: e.target.value
                                    })
                                }
                                required
                            />

                            <div className="input-group">
                                <label>Breve Descrição do Local</label>

                                <textarea
                                    className="form-textarea"
                                    placeholder="Descreva a estrutura, brinquedos disponíveis, o que precisa de melhoria..."
                                    value={recommendData.descricao}
                                    onChange={e =>
                                        setRecommendData({
                                            ...recommendData,
                                            descricao: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Porte Sugerido</label>

                                <select
                                    value={recommendData.porte}
                                    onChange={e =>
                                        setRecommendData({
                                            ...recommendData,
                                            porte: e.target.value
                                        })
                                    }
                                >
                                    <option value="PEQUENO">
                                        Pequeno (Até 50m²)
                                    </option>

                                    <option value="MEDIO">
                                        Médio (50m² a 150m²)
                                    </option>

                                    <option value="GRANDE">
                                        Grande (Mais de 150m²)
                                    </option>
                                </select>
                            </div>

                            <div className="form-checkboxes">
                                <h4>Características Disponíveis</h4>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={recommendData.tem_climatizacao}
                                        onChange={e =>
                                            setRecommendData({
                                                ...recommendData,
                                                tem_climatizacao: e.target.checked
                                            })
                                        }
                                    />

                                    O espaço é climatizado (Ar condicionado)
                                </label>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={recommendData.tem_monitores}
                                        onChange={e =>
                                            setRecommendData({
                                                ...recommendData,
                                                tem_monitores: e.target.checked
                                            })
                                        }
                                    />

                                    O espaço possui monitores para supervisionar as crianças
                                </label>

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={recommendData.tem_gratuidade}
                                        onChange={e =>
                                            setRecommendData({
                                                ...recommendData,
                                                tem_gratuidade: e.target.checked
                                            })
                                        }
                                    />

                                    O acesso é 100% público e gratuito
                                </label>
                            </div>
                        </div>

                        {/* COLUNA 2 */}

                        <div className="form-column">
                            <h3>Localização e Evidência</h3>

                            <Input
                                label="CEP (Apenas 8 números)"
                                placeholder="77000000"
                                maxLength={8}
                                value={recommendData.endereco.cep}
                                onChange={e =>
                                    setRecommendData({
                                        ...recommendData,
                                        endereco: {
                                            ...recommendData.endereco,
                                            cep: e.target.value
                                        }
                                    })
                                }
                                required
                            />

                            <Input
                                label="Logradouro / Avenida"
                                placeholder="Ex: Av. NS 2, Quadra 102 Sul"
                                value={recommendData.endereco.logradouro}
                                onChange={e =>
                                    setRecommendData({
                                        ...recommendData,
                                        endereco: {
                                            ...recommendData.endereco,
                                            logradouro: e.target.value
                                        }
                                    })
                                }
                                required
                            />

                            <div className="form-row-2">
                                <Input
                                    label="Número (opcional)"
                                    placeholder="S/N ou Lote 4"
                                    value={recommendData.endereco.numero}
                                    onChange={e =>
                                        setRecommendData({
                                            ...recommendData,
                                            endereco: {
                                                ...recommendData.endereco,
                                                numero: e.target.value
                                            }
                                        })
                                    }
                                />

                                <Input
                                    label="Bairro"
                                    placeholder="Plano Diretor Sul"
                                    value={recommendData.endereco.bairro}
                                    onChange={e =>
                                        setRecommendData({
                                            ...recommendData,
                                            endereco: {
                                                ...recommendData.endereco,
                                                bairro: e.target.value
                                            }
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-row-2">
                                <Input
                                    label="Cidade"
                                    value={recommendData.endereco.cidade}
                                    disabled
                                />

                                <Input
                                    label="Estado (UF)"
                                    value={recommendData.endereco.estado}
                                    disabled
                                />
                            </div>

                            {/* Upload único */}

                            <div>
                                <label
                                    style={{
                                        fontFamily: 'var(--font-headings)',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        color: 'var(--on-surface-variant)',
                                        display: 'block',
                                        marginBottom: '8px'
                                    }}
                                >
                                    Fotografias do Local (até 5 imagens) *
                                </label>

                                <div
                                    className={`upload-zone ${photos?.length ? 'has-file' : ''
                                        }`}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePhotosChange}
                                        required={!photos?.length}
                                    />

                                    <div className="upload-zone-icon">
                                        {photos?.length
                                            ? <Check size={36} />
                                            : <Upload size={36} />}
                                    </div>

                                    <span className="upload-zone-text">
                                        {photos?.length
                                            ? `${photos.length} imagem(ns) selecionada(s)`
                                            : 'Clique ou arraste até 5 fotos'}
                                    </span>

                                    <span className="upload-zone-subtext">
                                        A primeira imagem será utilizada como foto principal
                                    </span>
                                </div>

                                {/* Principal */}

                                {previewPrincipal && (
                                    <>
                                        <h4 style={{ marginTop: '16px' }}>
                                            Foto Principal
                                        </h4>

                                        <img
                                            src={previewPrincipal}
                                            alt="Principal"
                                            className="upload-preview"
                                        />
                                    </>
                                )}

                                {/* Adicionais */}

                                {previewsAdicionais.length > 0 && (
                                    <>
                                        <h4 style={{ marginTop: '16px' }}>
                                            Fotos Adicionais
                                        </h4>

                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns:
                                                    'repeat(auto-fill, minmax(90px, 1fr))',
                                                gap: '10px',
                                                marginTop: '10px'
                                            }}
                                        >
                                            {previewsAdicionais.map((preview, index) => (
                                                <img
                                                    key={index}
                                                    src={preview}
                                                    alt={`Foto ${index + 2}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '90px',
                                                        objectFit: 'cover',
                                                        borderRadius: '10px'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setIsRecommendModalOpen(false)}
                        >
                            Cancelar
                        </Button>

                        <Button type="submit">
                            <Sparkles size={16} />
                            Enviar Indicação
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}