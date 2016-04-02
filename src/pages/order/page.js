import React from 'react';

import RaisedButton from 'material-ui/lib/raised-button';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import TextField from 'material-ui/lib/text-field';
import fetch from 'isomorphic-fetch';

import styles from './style.css';



export default React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            users: []
        };
    },
    componentDidMount() {
        this.serverRequest = fetch('/api/users.json').then((r) => r.json()).then((j) => {
            this.setState({
                users: j.results
            });
        });
    },

    render() {
        return (
            <div className={styles.content}>
			  <h1>Новый заказ</h1>
              <Grid>
                <Row>
                  <Col xs={6}>
                    <Card className={styles.card}>
                      <CardTitle title="Добавление заказа" subtitle="данные о заказе" />
                      <CardText>
                        <TextField
                           hintText="Hint Text"
                           errorText="This field is required"
                           /><br/>
                        <TextField
                           hintText="Hint Text"
                           errorText="The error text can be as long as you want, it will wrap."
                           /><br/>
                        <TextField
                           hintText="Hint Text"
                           errorText="This field is required"
                           floatingLabelText="Floating Label Text"
                           /><br/>
                        <TextField
                           hintText="Message Field"
                           errorText="This field is required."
                           floatingLabelText="MultiLine and FloatingLabel"
                           multiLine={true}
                           rows={2}
                           /><br/>
                      </CardText>
                      <CardActions>
                        <RaisedButton label="Сохранить" primary={true} className={styles.but} />
                        <RaisedButton label="Очистить" secondary={true} className={styles.but} />
                      </CardActions>
                    </Card>
                  </Col>
                  <Col xs={6}>
                  </Col>
                </Row>
              </Grid>
            </div>
        );
    }
});

