import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import './NewPlayer.css';
import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Card from '../../shared/components/UIElements/Card';
import { VALIDATOR_REQUIRE } from '../../util/validators';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const UpdatePlayer = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  const [loadedPlayer, setLoadedPlayer] = useState(null);
  const playerId = useParams().pid;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      age: {
        value: null,
        isValid: false,
      },
      points: {
        value: null,
        isValid: false,
      },
      weight: {
        value: null,
        isValid: false,
      },
      height: {
        value: null,
        isValid: false,
      },
      grand_slams: {
        value: null,
        isValid: true,
      },
    },
    false
  );

  useEffect(() => {
    const getPlayer = async () => {
      let foundPlayer;
      let responseData;

      try {
        responseData = await sendRequest(
          `${process.env.REACT_APP_PLAYERS_BACKEND_URL}/player/${playerId}`
        );
      } catch (error) {}

      foundPlayer = responseData.player;

      if (foundPlayer) {
        setLoadedPlayer(foundPlayer);
        setFormData(
          {
            age: {
              value: foundPlayer.age,
              isValid: true,
            },
            points: {
              value: foundPlayer.points,
              isValid: true,
            },
            weight: {
              value: foundPlayer.weight,
              isValid: true,
            },
            height: {
              value: foundPlayer.height,
              isValid: true,
            },
            grand_slams: {
              value: foundPlayer.grand_slams,
              isValid: true,
            },
          },
          true
        );
      }
    };
    getPlayer();
  }, [playerId, setFormData, sendRequest]);

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    console.log(formState);
    try {
      await sendRequest(
        `${process.env.REACT_APP_PLAYERS_BACKEND_URL}/update/${playerId}`,
        'PATCH',
        JSON.stringify({
          age: formState.inputs.age.value,
          points: formState.inputs.points.value,
          weight: formState.inputs.weight.value,
          height: formState.inputs.height.value,
          grand_slams: formState.inputs.grand_slams.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token, // add auth token
        }
      );
      history.push(`/player/${playerId}`);
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!loadedPlayer && !error && (
        <div className="center">
          <Card>
            <h2>Could not find the player!</h2>
          </Card>
        </div>
      )}
      <h2 className="player-title">Update Player</h2>
      {loadedPlayer && (
        <form className="player-form" onSubmit={formSubmitHandler}>
          <Input
            id="age"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            element="input"
            type="number"
            label="Age"
            errorText="Please enter player's age"
            initialValue={loadedPlayer.age}
            initialValid={true}
          />

          <Input
            id="points"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            element="input"
            type="number"
            label="Points"
            errorText="Please enter player's points"
            initialValue={loadedPlayer.points}
            initialValid={true}
          />
          <Input
            id="weight"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            element="input"
            type="number"
            label="Weight"
            errorText="Please enter player's weight"
            initialValue={loadedPlayer.weight}
            initialValid={true}
          />
          <Input
            id="height"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            element="input"
            type="number"
            label="Height"
            errorText="Please enter player's height"
            initialValue={loadedPlayer.height}
            initialValid={true}
          />
          <Input
            id="grand_slams"
            onInput={inputHandler}
            validators={[]}
            element="input"
            type="number"
            label="Grand Slams Won"
            initialValue={loadedPlayer.grand_slams}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLAYER
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlayer;
