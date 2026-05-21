import React, { createContext, useContext, useState, useRef } from 'react';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import './ConfirmModal.css';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [modalState, setModalState] = useState(null); // { title, message, resolve, reject, options }
  const resolverRef = useRef(null);

  const confirm = (options) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setModalState({
        title: options.title || 'Confirmação',
        message: options.message || 'Deseja realmente prosseguir?',
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        isDestructive: options.isDestructive || false,
        icon: options.icon || 'question'
      });
    });
  };

  const handleConfirm = () => {
    if (resolverRef.current) resolverRef.current(true);
    setModalState(null);
  };

  const handleCancel = () => {
    if (resolverRef.current) resolverRef.current(false);
    setModalState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {modalState && (
        <div className="confirm-overlay" onClick={handleCancel}>
          <Card className="confirm-card glass" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header">
              <div className={`confirm-icon-box ${modalState.isDestructive ? 'destructive' : 'primary'}`}>
                {modalState.isDestructive ? (
                  <AlertTriangle size={24} />
                ) : (
                  <HelpCircle size={24} />
                )}
              </div>
              <div className="confirm-info">
                <h3>{modalState.title}</h3>
                <p>{modalState.message}</p>
              </div>
            </div>
            <div className="confirm-actions">
              <Button variant="secondary" onClick={handleCancel} className="confirm-cancel-btn">
                {modalState.cancelText}
              </Button>
              <Button
                variant={modalState.isDestructive ? 'primary' : 'primary'}
                onClick={handleConfirm}
                className={`confirm-action-btn ${modalState.isDestructive ? 'btn-danger-accent' : ''}`}
              >
                {modalState.confirmText}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}
