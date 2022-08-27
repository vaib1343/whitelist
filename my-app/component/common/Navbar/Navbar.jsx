import React from 'react';
import styles from './Navbar.module.scss';

function Navbar() {
    return (
        <div className={styles.navbarContainer}>
            <div className={styles.logo}>DEVS-NFT</div>
        </div>
    );
}

export default Navbar;
