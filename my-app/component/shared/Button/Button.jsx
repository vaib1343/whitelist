import React from 'react';
import styles from './Button.module.scss';

function Button(props) {
    const { label, size, className, ...remainProps } = props;
    return (
        <button {...remainProps} className={`${className} ${styles.button}`}>
            {label}
        </button>
    );
}

export default Button;
