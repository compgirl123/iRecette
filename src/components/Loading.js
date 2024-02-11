import React from 'react';
import '../styles/app.css';
import { Container } from 'semantic-ui-react';

const RecipeNotFound = () =>{
    return (
        <React.Fragment>
          <main>
          <div className ="appDiv">
            <Container>
            <h2>Loading...</h2>
            </Container>
            </div>
          </main>
        </React.Fragment>
      );
}

export default RecipeNotFound;
