import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from '../../components/Header';
import HomePage from '../HomePage';

const App = () => {
    return (
        <div className="appDiv">
            <Container>
                <Header />
                <HomePage />
            </Container>
        </div>
    );
};

export default App;
