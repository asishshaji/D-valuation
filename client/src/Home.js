import College from './College'
import Container from 'react-bootstrap/Container'
import Ktu from './Ktu';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import React from 'react';

export default function App() {
    return (
        <div>
            <Navbar bg="light" variant="light">
                <Navbar.Brand href="#home">
                    Home
                    </Navbar.Brand>
            </Navbar>

            <Container style={{ marginTop: "2rem", padding: '2rem' }}>
                <ul>
                    <li>
                        <Link to="/ktu">KTU</Link>

                    </li>
                    <li>
                        <Link to="/college">College</Link>
                    </li>
                    <li>
                        <Link to="/valutor">Valuator</Link>
                    </li>
                </ul>
            </Container>
        </div>
    );
}