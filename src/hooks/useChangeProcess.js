import { useState } from 'react';
import api from '../services/api';

const ROLES = {
    REQUESTER: 'Solicitante',
    APPROVER: 'Aprobador',
    MANAGER: 'Service Manager'
};

const STATUS = {
    DRAFT: 'Borrador',
    EVALUATION: 'En Evaluación',
    INFO_REQUIRED: 'Información Requerida',
    AUTHORIZED: 'Autorizado',
    SCHEDULED: 'Programado',
    IMPLEMENTATION: 'En Implementación',
    PIR: 'PIR/Review',
    CLOSED: 'Cerrado'
};

const TRANSITIONS = {
    [STATUS.DRAFT]: [STATUS.EVALUATION],
    [STATUS.EVALUATION]: [STATUS.INFO_REQUIRED, STATUS.AUTHORIZED, STATUS.DRAFT], // Draft for rejection
    [STATUS.INFO_REQUIRED]: [STATUS.EVALUATION],
    [STATUS.AUTHORIZED]: [STATUS.SCHEDULED],
    [STATUS.SCHEDULED]: [STATUS.IMPLEMENTATION],
    [STATUS.IMPLEMENTATION]: [STATUS.PIR],
    [STATUS.PIR]: [STATUS.CLOSED],
    [STATUS.CLOSED]: []
};

// Initial state template
const INITIAL_CHANGE = {
    id: null,
    title: '',
    status: STATUS.DRAFT,
    description: '',
    plan: '',
    rollback: '',
    proposedDate: '',
    approvers: [], // Array of { email, status, notifiedAt }
    projectId: '',
    pir: {
        result: '',
        lessons: '',
        evidence: []
    },
    history: [],
    attachments: [],
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export function useChangeProcess(initialData = null) {
    const [change, setChange] = useState(initialData || INITIAL_CHANGE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Mock current user role
    const [userRole, setUserRole] = useState(ROLES.REQUESTER);

    const canTransition = (targetStatus) => {
        const allowed = TRANSITIONS[change.status];
        return allowed && allowed.includes(targetStatus);
    };

    const validateTransition = (targetStatus) => {
        if (!canTransition(targetStatus)) return `Transición no permitida: ${change.status} -> ${targetStatus}`;

        // Initial Validation for Evaluation
        if (targetStatus === STATUS.EVALUATION) {
            if (!change.title.trim()) return 'El título del cambio es obligatorio.';
            if (change.approvers.length === 0) return 'Debe especificar al menos un aprobador.';
        }

        // RF-PIR Validation
        if (targetStatus === STATUS.CLOSED) {
            if (!change.pir.result || !change.pir.lessons) {
                return 'Debe completar el formulario PIR (Resultado y Lecciones) antes de cerrar.';
            }
        }
        return null;
    };

    const updateStatus = async (targetStatus, comment = '') => {
        const validationError = validateTransition(targetStatus);
        if (validationError) {
            setError(validationError);
            return false;
        }

        setLoading(true);
        setError(null);

        try {
            // Versioning Logic for Info Requested -> Evaluation
            let newVersion = change.version;
            if (change.status === STATUS.INFO_REQUIRED && targetStatus === STATUS.EVALUATION) {
                newVersion += 1;
            }

            // Simulate API Call
            // const res = await api.patch(`/changes/${change.id}/status`, { status: targetStatus, comment });

            setChange(prev => ({
                ...prev,
                status: targetStatus,
                version: newVersion,
                updatedAt: new Date().toISOString(),
                history: [
                    ...prev.history,
                    {
                        status: targetStatus,
                        comment,
                        timestamp: new Date().toISOString(),
                        user: 'CurrentUser' // Replace with real user
                    }
                ]
            }));

            setLoading(false);
            return true;
        } catch (err) {
            setError('Error al actualizar el estado: ' + err.message);
            setLoading(false);
            return false;
        }
    };

    const addAttachment = (file, hash) => {
        // RF-Integridad & Versionamiento
        const isInfoReq = change.status === STATUS.INFO_REQUIRED;
        const statusTag = isInfoReq ? 'V-Actual' : 'V1';

        const newAttachment = {
            name: file.name,
            hash,
            tag: statusTag,
            uploadedAt: new Date().toISOString()
        };

        setChange(prev => {
            // If V-Actual exists, demo logic could mark old ones as V-Prev
            const updatedAttachments = prev.attachments.map(att =>
                (isInfoReq && att.tag === 'V-Actual') ? { ...att, tag: 'V-Prev' } : att
            );
            return {
                ...prev,
                attachments: [...updatedAttachments, newAttachment]
            };
        });
    };

    const addApprover = (email) => {
        if (!email || !email.includes('@')) return;
        if (change.approvers.some(a => a.email === email)) return;

        setChange(prev => ({
            ...prev,
            approvers: [...prev.approvers, {
                email,
                status: 'PENDING',
                notifiedAt: new Date().toISOString()
            }]
        }));
    };

    const respondAsApprover = (email, response) => {
        // response: 'APPROVED' or 'INFO_REQUESTED'
        setChange(prev => ({
            ...prev,
            approvers: prev.approvers.map(a =>
                a.email === email ? { ...a, status: response } : a
            ),
            history: [
                ...prev.history,
                {
                    status: response === 'APPROVED' ? 'Aprobación Recibida' : 'Info Solicitada',
                    comment: `Respuesta de ${email}: ${response}`,
                    timestamp: new Date().toISOString(),
                    user: email
                }
            ]
        }));
    };

    return {
        change,
        setChange,
        loading,
        error,
        userRole,
        setUserRole,
        STATUS,
        ROLES,
        updateStatus,
        addAttachment,
        addApprover,
        respondAsApprover
    };
}
