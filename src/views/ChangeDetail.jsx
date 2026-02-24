import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChangeProcess } from '../hooks/useChangeProcess';
import ChangeStepper from '../components/ChangeStepper';
import { generateFileHash } from '../utils/cryptoHandler';

// Dummy initial data for demo
const MOCK_DATA = {
    id: 'CHG-2023-001',
    title: 'Migración DB a Azure SQL',
    status: 'En Evaluación',
    description: 'Se requiere mover la base de datos on-premise a la nube.',
    plan: '1. Backup\n2. Restore\n3. Verify',
    rollback: 'Restore from Backup',
    proposedDate: '2023-11-20',
    approvers: 'J. Doe, M. Smith',
    projectId: 'INT-001',
    history: [],
    attachments: [],
    version: 1,
    pir: { result: '', lessons: '', evidence: [] }
};

export default function ChangeDetail() {
    const { id } = useParams();
    const {
        change, setChange, updateStatus, error, loading,
        STATUS, ROLES, userRole, setUserRole, addAttachment
    } = useChangeProcess(id === 'new' ? null : MOCK_DATA);

    const [comment, setComment] = useState('');

    const handleFileUpload = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const hash = await generateFileHash(file);
                addAttachment(file, hash);
                // In real app, upload file content to blob storage here
            } catch (err) {
                console.error("Hashing error", err);
            }
        }
    };

    const StatusBadge = ({ status }) => {
        let color = 'bg-primary';
        if (status === STATUS.INFO_REQUIRED) color = 'bg-danger text-white';
        if (status === STATUS.CLOSED) color = 'bg-dark';
        if (status === STATUS.AUTHORIZED) color = 'bg-success';
        return <span className={`badge ${color} rounded-pill`}>{status}</span>;
    };

    return (
        <div className="container mt-4 animate-in fade-in">
            {/* Header / Nav */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <Link to="/" className="text-decoration-none text-muted mb-2 d-inline-block">&larr; Volver al Dashboard</Link>
                    <h3>
                        {change.id ? change.id : 'Nuevo Cambio'}
                        <small className="text-muted ms-3 fs-6">
                            Version: <span className="badge bg-secondary">V{change.version}</span>
                        </small>
                    </h3>
                </div>
                <div className="text-end">
                    <small className="d-block text-muted">Debug Role:</small>
                    <div className="btn-group btn-group-sm">
                        {Object.values(ROLES).map(r => (
                            <button
                                key={r}
                                className={`btn ${userRole === r ? 'btn-dark' : 'btn-outline-dark'}`}
                                onClick={() => setUserRole(r)}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <ChangeStepper currentStatus={change.status} />

            {error && <div className="alert alert-danger shadow-sm">{error}</div>}

            <div className="row">
                {/* Main Content */}
                <div className="col-lg-8">
                    <div className="accordion custom-accordion" id="changeAccordion">
                        {/* Section 1: General Info */}
                        <div className="accordion-item border-0 shadow-sm mb-3">
                            <h2 className="accordion-header">
                                <button className="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true">
                                    1. Información General
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#changeAccordion">
                                <div className="accordion-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Título del Cambio</label>
                                        <input
                                            className="form-control"
                                            value={change.title}
                                            onChange={e => setChange(prev => ({ ...prev, title: e.target.value }))}
                                            disabled={change.status !== STATUS.DRAFT && change.status !== STATUS.INFO_REQUIRED}
                                        />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Project ID Alloy</label>
                                            <div className="input-group">
                                                <input
                                                    className="form-control"
                                                    placeholder="Ej: INT-001 o CLT-999"
                                                    value={change.projectId || ''}
                                                    onChange={e => setChange(prev => ({ ...prev, projectId: e.target.value }))}
                                                    disabled={change.status !== STATUS.DRAFT && change.status !== STATUS.INFO_REQUIRED}
                                                />
                                                <span className="input-group-text">
                                                    {(change.projectId || '').startsWith('INT') ? '🏢 Proredes' : '👤 Cliente'}
                                                </span>
                                            </div>
                                            <div className="form-text">
                                                Si el ID comienza con "INT" se considera cambio interno (Proredes).
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Fecha Propuesta</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={change.proposedDate || ''}
                                                onChange={e => setChange(prev => ({ ...prev, proposedDate: e.target.value }))}
                                                disabled={change.status !== STATUS.DRAFT && change.status !== STATUS.INFO_REQUIRED}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Aprobadores Requeridos</label>
                                        <input
                                            className="form-control"
                                            placeholder="Nombres o correos separados por coma"
                                            value={change.approvers || ''}
                                            onChange={e => setChange(prev => ({ ...prev, approvers: e.target.value }))}
                                            disabled={change.status !== STATUS.DRAFT && change.status !== STATUS.INFO_REQUIRED}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Justificación / Descripción</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={change.description}
                                            onChange={e => setChange(prev => ({ ...prev, description: e.target.value }))}
                                            disabled={change.status !== STATUS.DRAFT && change.status !== STATUS.INFO_REQUIRED}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Technical Plan */}
                        <div className="accordion-item border-0 shadow-sm mb-3">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                                    2. Plan de Trabajo & Rollback
                                </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#changeAccordion">
                                <div className="accordion-body">
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <label className="form-label fw-bold">Plan de Implementación</label>
                                            <textarea
                                                className="form-control"
                                                rows="5"
                                                value={change.plan}
                                                onChange={e => setChange(prev => ({ ...prev, plan: e.target.value }))}
                                                disabled={change.status !== STATUS.DRAFT && change.status !== STATUS.INFO_REQUIRED}
                                            ></textarea>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label fw-bold text-danger">Plan de Rollback</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={change.rollback}
                                                onChange={e => setChange(prev => ({ ...prev, rollback: e.target.value }))}
                                                disabled={change.status !== STATUS.DRAFT && change.status !== STATUS.INFO_REQUIRED}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: PIR (Conditional) */}
                        <div className="accordion-item border-0 shadow-sm mb-3">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                                    3. Post-Implementation Review (PIR)
                                </button>
                            </h2>
                            <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#changeAccordion">
                                <div className="accordion-body">
                                    {(change.status === STATUS.IMPLEMENTATION || change.status === STATUS.PIR || change.status === STATUS.CLOSED) ? (
                                        <>
                                            <div className="mb-3">
                                                <label className="form-label">Resultado</label>
                                                <select
                                                    className="form-select"
                                                    value={change.pir.result}
                                                    onChange={e => setChange(prev => ({ ...prev, pir: { ...prev.pir, result: e.target.value } }))}
                                                    disabled={change.status === STATUS.CLOSED}
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="Exitoso">Exitoso</option>
                                                    <option value="Exitoso con Incidencias">Exitoso con Incidencias</option>
                                                    <option value="Fallido">Fallido</option>
                                                    <option value="Rollback Ejecutado">Rollback Ejecutado</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Lecciones Aprendidas</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    value={change.pir.lessons}
                                                    onChange={e => setChange(prev => ({ ...prev, pir: { ...prev.pir, lessons: e.target.value } }))}
                                                    disabled={change.status === STATUS.CLOSED}
                                                ></textarea>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-muted fst-italic">Disponible en fase de Post-Implementación.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Actions & Iteration */}
                <div className="col-lg-4">
                    {/* Actions Card */}
                    <div className="card shadow-sm border-0 mb-3 bg-light">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Acciones de Flujo</h5>
                            <div className="d-grid gap-2">
                                {/* Requester Actions */}
                                {userRole === ROLES.REQUESTER && change.status === STATUS.DRAFT && (
                                    <button className="btn btn-primary" onClick={() => updateStatus(STATUS.EVALUATION)}>
                                        Enviar a Evaluación
                                    </button>
                                )}
                                {userRole === ROLES.REQUESTER && change.status === STATUS.INFO_REQUIRED && (
                                    <button className="btn btn-warning text-dark" onClick={() => updateStatus(STATUS.EVALUATION, 'Info Adicional Provista')}>
                                        Responder / Re-enviar
                                    </button>
                                )}

                                {/* Approver Logic */}
                                {userRole === ROLES.APPROVER && change.status === STATUS.EVALUATION && (
                                    <>
                                        <button className="btn btn-success" onClick={() => updateStatus(STATUS.AUTHORIZED)}>
                                            Autorizar Cambio
                                        </button>
                                        <button className="btn btn-warning" onClick={() => updateStatus(STATUS.INFO_REQUIRED)}>
                                            Solicitar Información (Bloquear)
                                        </button>
                                    </>
                                )}

                                {/* Implementation Actions */}
                                {change.status === STATUS.AUTHORIZED && (
                                    <button className="btn btn-outline-primary" onClick={() => updateStatus(STATUS.SCHEDULED)}>Programar</button>
                                )}
                                {change.status === STATUS.SCHEDULED && (
                                    <button className="btn btn-primary" onClick={() => updateStatus(STATUS.IMPLEMENTATION)}>Iniciar Implementación</button>
                                )}
                                {change.status === STATUS.IMPLEMENTATION && (
                                    <button className="btn btn-info text-white" onClick={() => updateStatus(STATUS.PIR)}>Finalizar / Ir a PIR</button>
                                )}
                                {change.status === STATUS.PIR && (
                                    <button className="btn btn-dark" onClick={() => updateStatus(STATUS.CLOSED)}>Cerrar Ticket</button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Attachments Card */}
                    <div className="card shadow-sm border-0 mb-3">
                        <div className="card-header bg-white fw-bold">Documentación</div>
                        <div className="card-body">
                            <input type="file" className="form-control mb-2" onChange={handleFileUpload} />
                            <ul className="list-group list-group-flush small">
                                {change.attachments.map((att, i) => (
                                    <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <span className="text-truncate" style={{ maxWidth: '150px' }} title={att.hash}>{att.name}</span>
                                        <span className={`badge ${att.tag === 'V-Actual' ? 'bg-success' : 'bg-secondary'}`}>{att.tag}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Iteration Wall */}
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white fw-bold">Muro de Iteración</div>
                        <div className="card-body bg-light" style={{ height: '300px', overflowY: 'auto' }}>
                            {change.history.length === 0 && <p className="text-center text-muted small mt-5">Sin actividad registrada.</p>}
                            {change.history.map((h, i) => (
                                <div key={i} className="mb-2 p-2 bg-white rounded border border-light shadow-sm">
                                    <div className="d-flex justify-content-between">
                                        <strong className="small">{h.user}</strong>
                                        <span className="text-muted extra-small" style={{ fontSize: '0.7rem' }}>
                                            {new Date(h.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="mb-0 small text-secondary">{h.comment || `Cambio a estado: ${h.status}`}</p>
                                </div>
                            ))}
                        </div>
                        <div className="card-footer bg-white">
                            <input className="form-control form-control-sm" placeholder="Comentario..." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
