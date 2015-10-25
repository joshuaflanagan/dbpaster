import React from 'react';
import QueryBuilder from 'components/query-builder';

var valuesLoadedFromLocalStorage = {"x": 88, "y": 'josh'};

class Main extends React.Component {
  render() {
    return (
      <div>
        <h1>Still From Main component, via index.js</h1>
        <QueryBuilder historicalValues={valuesLoadedFromLocalStorage} />
      </div>
    );
  }
}

export default Main;
