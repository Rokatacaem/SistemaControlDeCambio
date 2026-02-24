import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MOCK_CHANGES = [
    { id: 1, title: 'Actualización Servidor DB', status: 'Borrador', requester: 'Admin', createdAt: '2023-10-25T10:00:00Z', updatedAt: '2023-10-25T10:00:00Z' },
    { id: 2, title: 'Parche Seguridad Firewall', status: 'Información Requerida', requester: 'NetOps', createdAt: '2023-10-20T09:00:00Z', updatedAt: '2023-10-21T09:00:00Z' },
    { id: 3, title: 'Migración Cloud', status: 'En Evaluación', requester: 'DevOps', createdAt: '2023-10-26T14:00:00Z', updatedAt: '2023-10-26T14:00:00Z' },
    { id: 4, title: 'Upgrade ERP', status: 'Información Requerida', requester: 'Finance', createdAt: '2023-10-15T08:00:00Z', updatedAt: '2023-10-15T08:00:00Z' }, // Aging warning case
];

// Helper for aging calculation (hours since update)
const getAgingHours = (dateString) => {
    const diff = new Date() - new Date(dateString);
    return Math.floor(diff / (1000 * 60 * 60));
};

export default function ChangeDashboard() {
    const [changes] = useState(MOCK_CHANGES);
    const [filter, setFilter] = useState('');

    const filteredChanges = changes.filter(c =>
        c.title.toLowerCase().includes(filter.toLowerCase()) ||
        c.status.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Dashboard de Gestión de Cambios</h2>

            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filtrar por título o estado..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="col-md-6 text-end">
                    <Link to="/changes/new" className="btn btn-primary">Nuevo Cambio</Link>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Estado</th>
                            <th>Solicitante</th>
                            <th>Aging (Horas)</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChanges.map(change => {
                            const aging = getAgingHours(change.updatedAt);
                            const isCriticalAging = change.status === 'Información Requerida' && aging > 48;

                            return (
                                <tr key={change.id} className={isCriticalAging ? 'table-danger' : ''}>
                                    <td>{change.id}</td>
                                    <td>{change.title}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(change.status)}`}>
                                            {change.status}
                                        </span>
                                    </td>
                                    <td>{change.requester}</td>
                                    <td className={isCriticalAging ? 'fw-bold text-danger' : ''}>
                                        {aging}h
                                    </td>
                                    <td>
                                        <Link to={`/changes/${change.id}`} className="btn btn-sm btn-outline-secondary">
                                            Ver Detalle
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function getStatusBadge(status) {
    switch (status) {
        case 'Borrador': return 'bg-secondary';
        case 'En Evaluación': return 'bg-info text-dark';
        case 'Información Requerida': return 'bg-warning text-dark';
        case 'Autorizado': return 'bg-success';
        case 'Cerrado': return 'bg-dark';
        default: return 'bg-primary';
    }
}
