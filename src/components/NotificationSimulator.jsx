import React from 'react';

export default function NotificationSimulator({ approvers, onRespond }) {
    const pendingCount = approvers.filter(a => a.status === 'PENDING').length;

    if (pendingCount === 0) return null;

    return (
        <div className="card shadow border-primary position-fixed bottom-0 end-0 m-3" style={{ width: '350px', zIndex: 1050 }}>
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <span className="fw-bold">📬 Simulador de Notificaciones</span>
                <span className="badge bg-white text-primary rounded-pill">{pendingCount}</span>
            </div>
            <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className="list-group list-group-flush">
                    {approvers.filter(a => a.status === 'PENDING').map(approver => (
                        <div key={approver.email} className="list-group-item p-3 border-start border-4 border-warning">
                            <div className="small text-muted mb-1">Para: {approver.email}</div>
                            <h6 className="mb-2">Nuevo Cambio por Revisar</h6>
                            <p className="extra-small text-secondary mb-3">
                                Se ha solicitado su aprobación para un nuevo cambio tecnológico. Por favor, revise los detalles y responda.
                            </p>
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => onRespond(approver.email, 'APPROVED')}
                                >
                                    ✅ Aprobar Cambio
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-warning"
                                    onClick={() => onRespond(approver.email, 'INFO_REQUESTED')}
                                >
                                    🤔 Pedir más información
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="card-footer small text-center text-muted">
                Simulación local - Sin envío de correos reales.
            </div>
        </div>
    );
}
