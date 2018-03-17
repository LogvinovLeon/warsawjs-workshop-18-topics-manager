import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';

export class Trainer extends React.Component {
    render() {
        const { user, isAuthor, workshopId } = this.props;
        const canDelete = firebase.auth().currentUser.uid === this.props.trainerId;
        return (
            <div className="box media">
                <div className="media-left">
                    <figure className="image is-48x48">
                        <img src={user.photoURL} alt="WarsawJS" />
                    </figure>
                </div>
                <div className={`media-content ${isAuthor && 'has-text-weight-bold'}`}>{user.name}</div>
                {canDelete && (
                    <p className="media-right">
                        <button className="delete" onClick={this.onDelete.bind(this)} />
                    </p>
                )}
            </div>
        );
    }
    onDelete() {
        firebase
            .database()
            .ref(`workshops/${this.props.workshopId}/trainerIds/${this.props.trainerId}`)
            .remove();
    }
}

Trainer.propTypes = {
    isAuthor: PropTypes.bool.isRequired,
    trainerId: PropTypes.string.isRequired,
    workshopId: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
};
