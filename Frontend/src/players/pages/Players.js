import React, { useContext, useState, useEffect } from 'react';

import PlayersList from '../components/PlayersList';
import './Players.css';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Players = () => {
  const [loadedPlayers, setLoadedPlayers] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_PLAYERS_BACKEND_URL}`
        );
        setLoadedPlayers(responseData.players);
      } catch (error) {}
    };
    fetchPlayers();
  }, [sendRequest]);

  const playerDeleteHandler = (deletedPlayerId) => {
    setLoadedPlayers((prevLoadedPlayers) =>
      prevLoadedPlayers.filter((player) => player.id !== deletedPlayerId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPlayers && <PlayersList items={loadedPlayers} />};
    </React.Fragment>
  );
};

export default Players;
