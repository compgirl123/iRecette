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
            <h2>400 Bad Request</h2>
            <h3>We're sorry, the page you requested is unavailable.
            Please go back to the
            <span className="badRequestNotFoundStyle" onClick={() => history.push('/')}> home page</span>.</h3>
            </Container>
            </div>
          </main>
        </React.Fragment>
      );
}

export default RecipeNotFound;
