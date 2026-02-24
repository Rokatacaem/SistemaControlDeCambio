import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChangeStepper from '../components/ChangeStepper';
import { useChangeLogic } from '../hooks/useChangeLogic';

export default function ChangeDetail() {
    const { id } = useParams(); // In real app, load by ID
    const navigate = useNavigate();

    // Using hook with dummy initial state
    const { change, transitionTo, CHANGE_STATES, error } = useChangeLogic({
        id: id || 'temp',
        title: id ? 'Cambio Existente' : '',
        status: 'Borrador',
        description: '',
        plan: '',
        rollback: '',
        versions: 1
    });

    const [formData, setFormData] = useState({ ...change });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = async (newStatus) => {
        // Confirm logic
        await transitionTo(newStatus);
    };

    return (
        <div className="container mt-5">
            <button onClick={() => navigate('/')} className="btn btn-link mb-3">&larr; Volver al Dashboard</button>

            <ChangeStepper currentStatus={change.status} />

            <div className="card shadow-sm mt-5">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Detalle de Solicitud #{change.id}</h4>
                    <div>
                        <span className="badge bg-secondary me-2">Versión {change.versions}</span>
                        <span className="badge bg-primary">{change.status}</span>
                    </div>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form>
                        <div className="mb-3">
                            <label className="form-label">Título</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Plan de Trabajo</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    name="plan"
                                    value={formData.plan}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Plan de Rollback</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    name="rollback"
                                    value={formData.rollback}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>

                        <div className="mb-3 p-4 border border-dashed text-center bg-light rounded">
                            <p className="text-muted mb-0">Drag & Drop documentos adjuntos aquí</p>
                        </div>
                    </form>
                </div>
                <div className="card-footer bg-white">
                    <div className="d-flex justify-content-end gap-2">
                        {change.status === CHANGE_STATES.DRAFT && (
                            <button
                                className="btn btn-success"
                                onClick={() => handleStatusChange(CHANGE_STATES.EVALUATION)}
                            >
                                Enviar a Evaluación
                            </button>
                        )}
                        {change.status === CHANGE_STATES.EVALUATION && (
                            <>
                                <button
                                    className="btn btn-warning"
                                    onClick={() => handleStatusChange(CHANGE_STATES.INFO_REQUIRED)}
                                >
                                    Solicitar Info
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleStatusChange(CHANGE_STATES.AUTHORIZED)}
                                >
                                    Autorizar
                                </button>
                            </>
                        )}
                        {/* More transitions... */}
                    </div>
                </div>
            </div>

            <div className="card mt-4">
                <div className="card-header">Panel de Discusión</div>
                <div className="card-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <div className="list-group list-group-flush">
                        <div className="list-group-item">
                            <small className="text-muted">Admin - 10:00 AM</small>
                            <p className="mb-0">Solicitud creada.</p>
                        </div>
                        {/* Mock comments */}
                    </div>
                </div>
                <div className="card-footer">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Escribe un comentario..." />
                        <button className="btn btn-outline-secondary">Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
