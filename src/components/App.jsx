import React from 'react';
import PropTypes from 'prop-types';
import { Workshop } from './Workshop';
import { WorkshopProposalForm } from './WorkshopProposalForm';
import * as firebase from 'firebase';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            workshops: [],
            user: undefined,
        };
    }
    componentWillMount() {
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
        firebase
            .database()
            .ref()
            .on('value', this.onStoreUpdated.bind(this));
    }
    componentWillUnmount() {
        firebase
            .database()
            .ref()
            .off();
    }
    render() {
        if (!this.state.user || this.state.users.length === 0) {
            return false;
        }
        return (
            <section className="section">
                <div className="container">
                    <nav className="navbar">
                        <div className="navbar-menu">
                            <div className="navbar-start">
                                <h1 className="title navbar-item">WarsawJS Workshop: Topics Manager</h1>
                            </div>
                            <div className="navbar-end">
                                <div className="navbar-item">
                                    {this.state.user.isAnonymous ? (
                                        <div>
                                            <button
                                                type="button"
                                                className="button is-primary"
                                                onClick={this.onGithubAuthAsync.bind(this)}
                                            >
                                                Login with GitHub
                                            </button>
                                        </div>
                                    ) : (
                                        <p>Welcome, {this.state.users[this.state.user.uid].name}!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>
                    {!this.state.user.isAnonymous && <WorkshopProposalForm />}
                    <div className="columns is-multiline is-centered">
                        {Object.keys(this.state.workshops).map(workshopId => (
                            <Workshop
                                user={this.state.user}
                                users={this.state.users}
                                workshopId={workshopId}
                                topic={this.state.workshops[workshopId].topic}
                                author={this.state.workshops[workshopId].author}
                                votersIds={Object.keys(this.state.workshops[workshopId].votersIds || {})}
                                trainerIds={Object.keys(this.state.workshops[workshopId].trainerIds || {})}
                                key={workshopId}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }
    onStoreUpdated(snapshot) {
        const newState = snapshot.val() || {
            users: [],
            workshops: [],
        };
        this.setState({
            users: newState.users || [],
            workshops: newState.workshops || [],
        });
    }
    async onGithubAuthAsync() {
        var provider = new firebase.auth.GithubAuthProvider();
        provider.setCustomParameters({
            allow_signup: 'false',
        });
        const authData = await firebase.auth().currentUser.linkWithPopup(provider);
        this.onAuthStateChanged(authData.user);
    }
    onAuthStateChanged(user) {
        if (user) {
            const userData = user.isAnonymous
                ? {
                      isAnonymous: user.isAnonymous,
                  }
                : {
                      name: user.providerData[0].displayName,
                      email: user.email,
                      isAnonymous: user.isAnonymous,
                      photoURL: user.providerData[0].photoURL,
                  };
            firebase
                .database()
                .ref('users')
                .update({
                    [user.uid]: userData,
                });
        } else {
            firebase.auth().signInAnonymously(); // Fire & forget
        }
        this.setState({ user });
    }
}
