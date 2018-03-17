import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { Trainer } from './Trainer';

export class Workshop extends React.Component {
    render() {
        const { topic, users, trainerIds, votersIds, user, workshopId } = this.props;
        const hasUserAlreadyVoted = votersIds.includes(user.uid);
        const canDelete = this.props.author === user.uid;
        const canJoinAsTrainer = this.props.user.isAnonymous === false && !trainerIds.includes(this.props.user.uid);
        return (
            <div className="column is-3">
                <div className="card">
                    <header className="card-header media">
                        <p className="card-header-title media-content">{topic}</p>
                        {canDelete && (
                            <p className="card-header-icon media-right">
                                <button className="delete" onClick={this.onDelete.bind(this)} />
                            </p>
                        )}
                    </header>
                    <div className="card-content">
                        {(trainerIds || []).map(trainerId => (
                            <Trainer
                                user={users[trainerId]}
                                key={trainerId}
                                trainerId={trainerId}
                                workshopId={workshopId}
                                isAuthor={this.props.author === trainerId}
                            />
                        ))}
                    </div>
                    <footer className="card-footer is-unselectable">
                        <div className="card-footer-item" onClick={this.onVote.bind(this)}>
                            {hasUserAlreadyVoted ? '❤️' : '♡'} {(votersIds || []).length}
                        </div>
                        {canJoinAsTrainer && (
                            <div className="card-footer-item" onClick={this.onTrainerJoin.bind(this)}>
                                ➕
                            </div>
                        )}
                    </footer>
                </div>
            </div>
        );
    }
    onDelete() {
        firebase
            .database()
            .ref(`workshops/${this.props.workshopId}`)
            .remove();
    }
    onVote() {
        if (this.props.votersIds.includes(this.props.user.uid)) {
            firebase
                .database()
                .ref(`workshops/${this.props.workshopId}/votersIds/${this.props.user.uid}`)
                .remove();
        } else {
            firebase
                .database()
                .ref(`workshops/${this.props.workshopId}/votersIds`)
                .set({ [this.props.user.uid]: this.props.user.uid });
        }
    }
    onTrainerJoin() {
        firebase
            .database()
            .ref(`workshops/${this.props.workshopId}/trainerIds/${this.props.user.uid}`)
            .set(this.props.user.uid);
    }
}

Workshop.propTypes = {
    workshopId: PropTypes.string.isRequired,
    votersIds: PropTypes.array.isRequired,
    topic: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    users: PropTypes.object.isRequired,
    trainerIds: PropTypes.array,
    user: PropTypes.object.isRequired,
};
