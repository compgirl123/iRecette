import React from 'react';
import '../styles/app.css';
import { Container } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

const RecipeNotFound = () =>{
    const history = useHistory();

    return (
        <React.Fragment>
          <main>
          <div className ="appDiv">
            <Container>
            <h2>404 Not Found</h2>
            <h3>We're sorry, the request failed since no recipe with this id could be found.
            Please go back to the
             <span className = "badRequestNotFoundStyle" onClick={() => history.push('/')}> home page</span>.</h3>
            </Container>
            </div>
          </main>
        </React.Fragment>
      );
}

export default RecipeNotFound;
