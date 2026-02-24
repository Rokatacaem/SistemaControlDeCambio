import React from 'react';
import { useChangeProcess } from '../hooks/useChangeProcess';

const STATUS_ORDER = [
    'Borrador',
    'En Evaluación',
    'Autorizado',
    'Programado',
    'En Implementación',
    'PIR/Review',
    'Cerrado'
];

export default function ChangeStepper({ currentStatus }) {
    // Determine active index
    let activeIndex = STATUS_ORDER.indexOf(currentStatus);
    let isInfoReq = false;

    if (currentStatus === 'Información Requerida') {
        activeIndex = 1; // Map to En Evaluación
        isInfoReq = true;
    }

    return (
        <div className="card mb-4 shadow-sm border-0">
            <div className="card-body">
                <div className="position-relative my-2">
                    <div className="progress" style={{ height: '3px' }}>
                        <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: `${(activeIndex / (STATUS_ORDER.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                    <div className="d-flex justify-content-between position-absolute top-0 w-100" style={{ transform: 'translateY(-50%)' }}>
                        {STATUS_ORDER.map((step, index) => {
                            const completed = index <= activeIndex;
                            const current = index === activeIndex;
                            let btnClass = completed ? 'btn-primary' : 'btn-secondary opacity-25';

                            if (current && isInfoReq && step === 'En Evaluación') {
                                btnClass = 'btn-danger';
                            }

                            return (
                                <div key={step} className="text-center" style={{ width: '14%' }}>
                                    <button
                                        className={`btn btn-sm rounded-circle ${btnClass} mb-2`}
                                        style={{ width: '30px', height: '30px', padding: 0, zIndex: 10 }}
                                        title={step}
                                        disabled
                                    >
                                        {index + 1}
                                    </button>
                                    <div className="d-none d-md-block" style={{ fontSize: '0.75rem', fontWeight: current ? '700' : '400' }}>
                                        {step} <br />
                                        {current && isInfoReq && <span className="text-danger fw-bold blink">(Info Requerida)</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
