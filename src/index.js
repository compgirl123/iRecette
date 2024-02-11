import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import RecipeDetails from './views/SpecificRecipeDetails';
import RecipeBadRequest from './components/RecipeBadRequest400';
import App from './views/App';
import 'sanitize.css/sanitize.css';
import 'semantic-ui-css/semantic.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/details/:idMeal" component={RecipeDetails} />
            <Route path="*" component={RecipeBadRequest} />
        </Switch>
    </Router>,
);
