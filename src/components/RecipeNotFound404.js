import React from 'react';
import '../styles/app.css';
import { Container } from 'semantic-ui-react';

const RecipeNotFound = () =>{
    return (
        <React.Fragment>
          <main>
          <div className ="appDiv">
            <Container>
            <h2>404 Not Found</h2>
            <h3>We're sorry, the request failed since no recipe with this id could be found.</h3>
            </Container>
            </div>
          </main>
        </React.Fragment>
      );
}

export default RecipeNotFound;
