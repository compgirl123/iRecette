import React from 'react';
import '../styles/app.css';
import { Container } from 'semantic-ui-react';

const RecipeNotFound = () =>{
    return (
        <React.Fragment>
          <main>
          <div className ="appDiv">
            <Container>
            <h2>400 Bad Request</h2>
            <h3>We're sorry, the page you requested is unavailable.</h3>
            </Container>
            </div>
          </main>
        </React.Fragment>
      );
}

export default RecipeNotFound;
