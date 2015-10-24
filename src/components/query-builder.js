import React from 'react';

class QueryBuilder extends React.Component {
  render() {
    return (
      <div>The <strong>QueryBuilder</strong> holds all
        <QueryInput />
        <BoundQueryDisplay />
      </div>
    )
  }
}

class BoundQueryDisplay extends React.Component {
  render() {
    return (
        <div style={{color: "blue"}}>
        THE RENDERED OUTPUT
        </div>
    );
  }
}

class QueryInput extends React.Component {
  render() {
    return (
        <div data-friendly="josh" style={{color: "red"}}>
        The QueryInput input
          <div>
            <QueryTemplateInput />
          </div>
          <div>
            <BindVariableList />
          </div>
        </div>
        )
  }
}

class QueryTemplateInput extends React.Component {
  render() {
    return (<textarea cols="120" rows="4"></textarea>)
  }
}

class BindVariableList extends React.Component {
  render() {
    return (
        <ul>
          <BindVariableRow />
        </ul>
    );
  }
}

class BindVariableRow extends React.Component {
  render() {
    return (<li>row</li>);
  }
}

export default QueryBuilder
