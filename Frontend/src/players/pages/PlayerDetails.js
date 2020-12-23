import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import './PlayerDetails.css';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const PlayerDetails = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [loadedPlayer, setLoadedPlayer] = useState();
  const { isLoading, sendRequest, error, clearError } = useHttpClient();

  const playerId = useParams().pid;

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_PLAYERS_BACKEND_URL}/player/${playerId}`
        );
        setLoadedPlayer(responseData.player);
      } catch (error) {}
    };
    fetchPlayer();
  }, [playerId, sendRequest]);

  const showDeleteWarning = () => {
    setShowModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowModal(false);
  };

  const deletePlayer = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_PLAYERS_BACKEND_URL}/delete/${playerId}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token, // add auth token
        }
      );
    } catch (error) {}
    history.push('/');
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <Modal
        show={showModal}
        onCancel={cancelDeleteHandler}
        header="Are You Sure?"
        footerClass="player-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={deletePlayer}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Are you sure you want to delete this player? Please note that it can't
          be undone.
        </p>
      </Modal>
      {!isLoading && loadedPlayer && (
        <div className="player-wrapper">
          <Card className="player-item__content">
            <div className="player-item__image">
              <img
                src={`${process.env.REACT_APP_ASSET_URL}/${loadedPlayer.image}`}
                alt={loadedPlayer.name}
              />
            </div>
            <div className="player-item__info">
              <h1>{loadedPlayer.name}</h1>
              <h2>{loadedPlayer.country}</h2>
              <p>Age: {loadedPlayer.age}</p>
              <p>Grand Slam titles: {loadedPlayer.grand_slams}</p>
              <p>Current ATP rank: {loadedPlayer.ranking}</p>
              <p>Current ATP points: {loadedPlayer.points}</p>
            </div>
            <div className="player-item__actions">
              {auth.isLoggedIn && (
                <Button to={`/players/update/${playerId}`}>EDIT</Button>
              )}
              {auth.isLoggedIn && (
                <Button onClick={showDeleteWarning} danger>
                  DELETE
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
      {!isLoading && !loadedPlayer && (
        <div className="center">
          <Card className="card-medium">No player found.</Card>
        </div>
      )}
    </React.Fragment>
  );
};

export default PlayerDetails;
