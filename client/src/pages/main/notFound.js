import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>404 - Page Not Found</h1>
            <p style={styles.text}>Sorry, the page you're looking for doesn't exist.</p>
            <Link to="/" style={styles.button}>Go Home</Link>
        </div>
    );
};

// CSS in JS styles
const styles = {
    container: {
        textAlign: 'center',
        marginTop: '100px',
    },
    header: {
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#ff6347', // Warna merah-oranye (Tomato)
    },
    text: {
        fontSize: '20px',
        color: '#555',
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#ff6347', // Warna merah-oranye (Tomato)
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};

export default NotFound;
