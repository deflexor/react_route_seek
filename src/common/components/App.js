import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import basecss from '../base.css';

const IButton1 = () => (<IconButton touch={true}>
                        <NavigationExpandMoreIcon />
                        </IconButton>);

const ToolbarSimple = () => (
    <Toolbar>
      <ToolbarGroup firstChild={true} float="left">
        <DropDownMenu value={3}>
          <MenuItem value={1} primaryText="All Broadcasts" />
          <MenuItem value={2} primaryText="All Voice" />
          <MenuItem value={3} primaryText="All Text" />
          <MenuItem value={4} primaryText="Complete Voice" />
          <MenuItem value={5} primaryText="Complete Text" />
          <MenuItem value={6} primaryText="Active Voice" />
          <MenuItem value={7} primaryText="Active Text" />
        </DropDownMenu>
      </ToolbarGroup>
      <ToolbarGroup float="right">
        <ToolbarTitle text="Options" />
        <FontIcon className="muidocs-icon-custom-sort" />
        <IconMenu iconButtonElement={IButton1()}>
          <MenuItem primaryText="Download" />
          <MenuItem primaryText="More Info" />
        </IconMenu>
        <ToolbarSeparator />
        <RaisedButton label="Create Broadcast" primary={true} />
      </ToolbarGroup>
    </Toolbar>
);

export default ({children}) => {
    return (
        <Grid>
          <Row>
            <Col xs={1}><div className={basecss.logo1}>Admin app</div></Col>
            <Col xs={11}><ToolbarSimple/></Col>
          </Row>
          <Row>
            <Col xs={1}>menu</Col>
            <Col xs={11}>{children}</Col>
          </Row>
        </Grid>
    );
}
