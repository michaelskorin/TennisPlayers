import React from 'react';
import Table from 'react-bootstrap/Table';
// import Card from '../../shared/components/UIElements/Card';
import Card from '../../shared/components/UIElements/Card';

import PlayerItem from './PlayerItem';
import './PlayersList.css';

const PlayersList = (props) => {
  if (!props.items || props.items.length === 0) {
    return (
      <div className="center">
        <Card className="card-medium">No players found.</Card>
      </div>
    );
  }
  return (
    <React.Fragment>
      <h1 className="center">ATP Tennis Ranking</h1>
      <Table
        className="players-table"
        striped
        style={{ marginTop: '3rem' }}
        bordered
        hover
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Country</th>
            <th>Age</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {props.items.map((player) => (
            <PlayerItem
              key={player.id}
              name={player.name}
              country={player.country}
              age={player.age}
              ranking={player.ranking}
              points={player.points}
              id={player.id}
            />
          ))}
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export default PlayersList;
