import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import OrderPage from '../../pages/order/page';
import HomePage from '../../pages/home/page';

//console.log(HomePage);

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/" component={HomePage} />
    <Route path="/order" component={OrderPage} />
  </Route>
);
