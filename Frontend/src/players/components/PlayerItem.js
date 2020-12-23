import React from 'react';
import { Link } from 'react-router-dom';

const PlayerItem = (props) => {
  return (
    <React.Fragment>
      <tr>
        <td>{props.ranking}</td>
        <td>
          {' '}
          <Link to={`/player/${props.id}`}>{props.name}</Link>
        </td>
        <td>{props.country}</td>
        <td>{props.age}</td>
        <td>{props.points}</td>
      </tr>
    </React.Fragment>
  );
};

export default PlayerItem;
