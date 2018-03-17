import React from 'react';
import * as firebase from 'firebase';

export class WorkshopProposalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: '',
        };
    }
    render() {
        return (
            <form className="field is-grouped" onSubmit={this.onTopicSubmit.bind(this)}>
                <div className="control is-expanded">
                    <input
                        className="input"
                        type="text"
                        placeholder="Topic of the workshop you'd like to do"
                        value={this.state.topic}
                        onChange={this.onTopicChange.bind(this)}
                    />
                </div>
                <div className="control">
                    <button className="button is-primary" type="submit" disabled={this.state.topic.length === 0}>
                        Propose new topic
                    </button>
                </div>
            </form>
        );
    }
    onTopicChange(event) {
        this.setState({ topic: event.target.value });
    }
    onTopicSubmit(event) {
        event.preventDefault();
        firebase
            .database()
            .ref('workshops')
            .push({
                topic: this.state.topic,
                author: firebase.auth().currentUser.uid,
            });
        this.setState({ topic: '' });
    }
}
