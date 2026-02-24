import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MOCK_CHANGES = [
    { id: 'CHG-2023-001', title: 'Migración DB a Azure SQL', status: 'En Evaluación', requester: 'Juan Pérez', updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
    { id: 'CHG-2023-002', title: 'Firewall Rule Update', status: 'Información Requerida', requester: 'Ana Gómez', updatedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString() }, // > 48h
    { id: 'CHG-2023-003', title: 'Nuevo Servidor App', status: 'Borrador', requester: 'Carlos Ruiz', updatedAt: new Date().toISOString() },
];

export default function ChangeDashboard() {
    const [changes] = useState(MOCK_CHANGES);
    const [filter, setFilter] = useState('all');

    const getAging = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        return hours;
    };

    const StatusBadge = ({ status }) => {
        let color = 'bg-primary';
        if (status === 'Información Requerida') color = 'bg-warning text-dark';
        else if (status === 'Borrador') color = 'bg-secondary';
        else if (status === 'Autorizado') color = 'bg-success';

        return <span className={`badge ${color}`}>{status}</span>;
    };

    const filtered = changes.filter(c => {
        if (filter === 'all') return true;
        // Basic demo filters
        if (filter === 'mine') return c.requester === 'Juan Pérez'; // Mock
        return true;
    });

    return (
        <div className="container mt-4 animate-in fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Dashboard de Cambios</h2>
                <Link to="/changes/new" className="btn btn-primary shadow-sm">
                    + Nuevo Cambio
                </Link>
            </div>

            {/* Quick Filters */}
            <div className="btn-group mb-4 shadow-sm">
                <button className={`btn ${filter === 'all' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilter('all')}>Todos</button>
                <button className={`btn ${filter === 'mine' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilter('mine')}>Mis Pendientes</button>
                <button className="btn btn-outline-dark">Por Aprobar</button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Título</th>
                                    <th>Solicitante</th>
                                    <th>Estado</th>
                                    <th>Aging (Horas)</th>
                                    <th className="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(change => {
                                    const aging = getAging(change.updatedAt);
                                    const isCritical = change.status === 'Información Requerida' && aging > 48;

                                    return (
                                        <tr key={change.id} className={isCritical ? 'table-danger' : ''}>
                                            <td className="ps-4 fw-bold text-primary">{change.id}</td>
                                            <td>{change.title}</td>
                                            <td>{change.requester}</td>
                                            <td><StatusBadge status={change.status} /></td>
                                            <td className={isCritical ? 'fw-bold text-danger' : ''}>
                                                {aging}h
                                                {isCritical && <i className="ms-2 bi bi-exclamation-circle-fill" title="Supera 48h"></i>}
                                            </td>
                                            <td className="text-end pe-4">
                                                <Link to={`/changes/${change.id}`} className="btn btn-sm btn-outline-secondary">
                                                    Gestionar
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
