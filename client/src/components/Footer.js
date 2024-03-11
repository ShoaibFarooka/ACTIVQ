import React from 'react';
import '../styles/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div>
            <footer className='footer text-white '>
                <div className="container">
                    <footer className="py-4">
                        <div className='d-flex justify-content-between pt-4  mt-4 border-top'>
                            <p>&#169; 2023 ACTIV-Q Company, Inc. All rights reserved.</p>
                        </div>
                    </footer>
                </div>
            </footer>
        </div>
    );
}

export default Footer;