import { useState } from 'react';

// State Machine Definition
const CHANGE_STATES = {
    DRAFT: 'Borrador',
    EVALUATION: 'En Evaluación',
    INFO_REQUIRED: 'Información Requerida',
    AUTHORIZED: 'Autorizado',
    SCHEDULED: 'Programado',
    IMPLEMENTATION: 'En Implementación',
    PIR: 'PIR/Review',
    CLOSED: 'Cerrado'
};

const ALLOWED_TRANSITIONS = {
    [CHANGE_STATES.DRAFT]: [CHANGE_STATES.EVALUATION],
    [CHANGE_STATES.EVALUATION]: [CHANGE_STATES.INFO_REQUIRED, CHANGE_STATES.AUTHORIZED],
    [CHANGE_STATES.INFO_REQUIRED]: [CHANGE_STATES.EVALUATION],
    [CHANGE_STATES.AUTHORIZED]: [CHANGE_STATES.SCHEDULED],
    [CHANGE_STATES.SCHEDULED]: [CHANGE_STATES.IMPLEMENTATION],
    [CHANGE_STATES.IMPLEMENTATION]: [CHANGE_STATES.PIR],
    [CHANGE_STATES.PIR]: [CHANGE_STATES.CLOSED],
    [CHANGE_STATES.CLOSED]: []
};

export function useChangeLogic(initialChange = null) {
    const [change, setChange] = useState(initialChange || {
        status: CHANGE_STATES.DRAFT,
        history: [],
        versions: 1
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const canTransitionTo = (targetStatus) => {
        const currentStatus = change.status;
        const allowed = ALLOWED_TRANSITIONS[currentStatus];
        return allowed && allowed.includes(targetStatus);
    };

    const transitionTo = async (targetStatus, payload = {}) => {
        if (!canTransitionTo(targetStatus)) {
            setError(`No se puede mover de ${change.status} a ${targetStatus}`);
            return false;
        }

        // Logic specific to transitions
        if (targetStatus === CHANGE_STATES.CLOSED) {
            // Check PIR Requirement
            if (!payload.pirCompleted) {
                setError("El formulario PIR es obligatorio antes de cerrar.");
                return false;
            }
        }

        if (targetStatus === CHANGE_STATES.EVALUATION && change.status === CHANGE_STATES.INFO_REQUIRED) {
            // Versioning Logic
            payload.newVersion = (change.versions || 0) + 1;
        }

        // Simulate API update
        setLoading(true);
        try {
            // In real app, call ChangeService.updateStatus logic here
            // await ChangeService.updateStatus(change.id, targetStatus, ...);

            setChange(prev => ({
                ...prev,
                status: targetStatus,
                versions: payload.newVersion || prev.versions,
                // Update history etc.
            }));
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return false;
        }
    };

    return {
        change,
        loading,
        error,
        canTransitionTo,
        transitionTo,
        CHANGE_STATES
    };
}
