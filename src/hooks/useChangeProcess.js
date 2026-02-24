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
    approvers: '',
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

    return {
        change,
        setChange, // For form updates
        loading,
        error,
        userRole,
        setUserRole, // For demo purposes to switch roles
        STATUS,
        ROLES,
        updateStatus,
        addAttachment
    };
}
