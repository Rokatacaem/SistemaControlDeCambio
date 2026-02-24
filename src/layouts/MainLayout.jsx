import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">ITIL Change Manager</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link disabled">Usuario: Admin</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main className="flex-grow-1 bg-light">
                <Outlet />
            </main>

            <footer className="bg-white border-top py-3 mt-auto text-center text-muted">
                <small>&copy; 2026 ITIL Change Management System</small>
            </footer>
        </div>
    );
}
