import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
let SelectableList = SelectableContainerEnhance(List);

import * as Colors from 'material-ui/lib/styles/colors';
import IconHome from 'material-ui/lib/svg-icons/action/home';
import IconInput from 'material-ui/lib/svg-icons/action/input';

import basecss from '../base.css';

const iconStyles = {
  marginTop: 16
};

// const IButton1 = () => (<IconButton touch={true}>
//                         <NavigationExpandMoreIcon />
//                         </IconButton>);


const ListItems = [
    { title: "Начало", href: "/", icon: <IconHome /> },
    { title: "Создание заказа", href: "/order", icon: <IconInput /> },
];


const ListExampleNested = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    reqChange(e , path) {
        this.context.router.push(path);
    },
    render() {
        const v = ListItems.reduce((pv, v) => this.context.router.isActive(v.href) ? v.href : pv, '/');
        return (
            <div>
              <SelectableList valueLink={{value: v, requestChange: this.reqChange }}>
                {ListItems.map( (i) => <ListItem primaryText={i.title} leftIcon={i.icon} value={i.href} key={i.href} /> )}
              </SelectableList>
            </div>);
    }
});


const ToolbarSimple = () => (
    <Toolbar>
      <ToolbarGroup float="left">
      </ToolbarGroup>
      <ToolbarGroup float="right">
        <ToolbarSeparator />
        <RaisedButton label="Do something" primary={true} />
      </ToolbarGroup>
    </Toolbar>
);



export default ({children}) => {
    return (
        <Grid>
          <Row>
            <Col xs={2}><div className={basecss.logo1}>Admin app</div></Col>
            <Col xs={10}><ToolbarSimple/></Col>
          </Row>
          <Row>
            <Col xs={2}>
              <br/>
              <ListExampleNested />
            </Col>
            <Col xs={10}>{children}</Col>
          </Row>
        </Grid>
    );
}
