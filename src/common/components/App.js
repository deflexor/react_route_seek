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

import * as Colors from 'material-ui/lib/styles/colors';
import IconBulb from 'material-ui/lib/svg-icons/action/lightbulb-outline';
import IconSort from 'material-ui/lib/svg-icons/content/sort';
import IconActionGrade from 'material-ui/lib/svg-icons/action/grade';
import IconContentInbox from 'material-ui/lib/svg-icons/content/inbox';
import IconContentDrafts from 'material-ui/lib/svg-icons/content/drafts';
import IconContentSend from 'material-ui/lib/svg-icons/content/send';

import basecss from '../base.css';

const iconStyles = {
  marginTop: 16
};

const IButton1 = () => (<IconButton touch={true}>
                        <NavigationExpandMoreIcon />
                        </IconButton>);


const ListExampleNested = () => (
    <div>
      <List subheader="Nested List Items">
        <ListItem primaryText="Sent mail" leftIcon={<IconContentSend />} />
        <ListItem primaryText="Drafts" leftIcon={<IconContentDrafts />} />
        <ListItem
           primaryText="Inbox"
           leftIcon={<IconContentInbox />}
           initiallyOpen={true}
           primaryTogglesNestedList={true}
           nestedItems={[
               <ListItem
                  key={1}
                  primaryText="Starred"
                  leftIcon={<IconActionGrade />}
               />,
               <ListItem
                  key={2}
                  primaryText="Sent Mail"
                  leftIcon={<IconContentSend />}
                  disabled={true}
                  nestedItems={[
                          <ListItem key={1} primaryText="Drafts" leftIcon={<IconContentDrafts />} />,
                  ]}
               />
           ]}
        />
        </List>
   </div>
);


const ToolbarSimple = () => (
    <Toolbar>
      <ToolbarGroup float="left">
      </ToolbarGroup>
      <ToolbarGroup float="right">
        <ToolbarTitle text="Options" />
        <IconSort style={iconStyles} />
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
        <Grid className={basecss.fullwidth}>
          <Row>
            <Col xs={2}><div className={basecss.logo1}>Admin app</div></Col>
            <Col xs={10}><ToolbarSimple/></Col>
          </Row>
          <Row>
            <Col xs={2}><ListExampleNested /></Col>
            <Col xs={10}>{children}</Col>
          </Row>
        </Grid>
    );
}
