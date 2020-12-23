import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import './NewPlayer.css';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../util/validators';

const NewPlayer = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      country: {
        value: '',
        isValid: false,
      },
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
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', formState.inputs.name.value);
      formData.append('country', formState.inputs.country.value);
      formData.append('age', formState.inputs.age.value);
      formData.append('points', formState.inputs.points.value);
      formData.append('weight', formState.inputs.weight.value);
      formData.append('height', formState.inputs.height.value);
      formData.append('grand_slams', formState.inputs.grand_slams.value);
      formData.append('image', formState.inputs.image.value);
      await sendRequest(
        `${process.env.REACT_APP_PLAYERS_BACKEND_URL}/new`,
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token, // add auth token
        }
      );
      history.push('/');
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
      <h2 className="player-title">Add New Player</h2>
      <form className="player-form" onSubmit={formSubmitHandler}>
        <Input
          id="name"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(2)]}
          element="input"
          type="text"
          label="Name"
          errorText="Please enter a name"
        />
        <Input
          id="country"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          element="input"
          type="text"
          label="Country"
          errorText="Please enter player's country"
        />
        <Input
          id="age"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          element="input"
          type="number"
          label="Age"
          errorText="Please enter player's age"
        />
        <Input
          id="points"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          element="input"
          type="number"
          label="Points"
          errorText="Please enter player's points"
        />
        <Input
          id="weight"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          element="input"
          type="number"
          label="Weight"
          errorText="Please enter player's weight"
        />
        <Input
          id="height"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          element="input"
          type="number"
          label="Height"
          errorText="Please enter player's height"
        />
        <Input
          id="grand_slams"
          onInput={inputHandler}
          validators={[]}
          element="input"
          type="number"
          label="Grand Slams Won"
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLAYER
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlayer;
