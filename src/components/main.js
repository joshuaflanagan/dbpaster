import React from 'react';
import QueryBuilder from 'components/query-builder';

class Main extends React.Component {
  render() {
    return (
      <div>
        <h1>db Paster</h1>
        <QueryBuilder />
      </div>
    );
  }
}

export default Main;
