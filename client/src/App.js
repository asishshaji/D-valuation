import { BrowserRouter, Route, Switch } from 'react-router-dom';

import College from './College'
import Home from './Home'
import Ktu from './Ktu';
import React from 'react';

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/ktu" exact component={Ktu} />
                <Route path="/college" exact component={College} />
            </Switch>
        </BrowserRouter>
    );
}