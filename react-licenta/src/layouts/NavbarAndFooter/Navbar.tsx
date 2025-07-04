import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
    const { oktaAuth, authState } = useOktaAuth();
    const location = useLocation();

    if (!authState) {
        return <SpinnerLoading />;
    }

    const handleLogout = async () => oktaAuth.signOut();
    const isOnAboutPage = location.pathname === "/about";

    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
            <div className='container-fluid'>
                <span className='navbar-brand'>iava.doc</span>
                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#navbarNavDropdown'
                    aria-controls='navbarNavDropdown'
                    aria-expanded='false'
                    aria-label='Toggle Navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNavDropdown'>
                    <ul className='navbar-nav ms-auto'>
                        {!authState.isAuthenticated ? (
                            <>
                                <li className='nav-item m-1'>
                                    <Link
                                        type='button'
                                        className='btn btn-outline-light'
                                        to='/about'
                                    >
                                        About
                                    </Link>
                                </li>
                                <li className='nav-item m-1'>
                                    <Link
                                        type='button'
                                        className='btn btn-outline-light'
                                        to='/login'
                                    >
                                        Sign in
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className='nav-item m-1'>
                                    <Link
                                        type='button'
                                        className='btn btn-outline-light'
                                        to={isOnAboutPage ? '/building' : '/about'}
                                    >
                                        {isOnAboutPage ? 'Building' : 'About'}
                                    </Link>
                                </li>
                                <li className='nav-item m-1'>
                                    <button
                                        className='btn btn-outline-light'
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
