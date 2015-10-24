import React from 'react';
import QueryBuilder from 'components/query-builder';

class Main extends React.Component {
  render() {
    return (
      <div>
        <h1>Still From Main component, via index.js</h1>
        <QueryBuilder />
      </div>
    );
  }
}

export default Main;
