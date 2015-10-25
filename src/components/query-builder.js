import React from 'react';

class QueryBuilder extends React.Component {
  constructor(props) {
    super(props)
    console.log("QueryBuilder was constructed!");
    this.state = { output: "waiting for input...", variables: {} };
  }

  handleInputsChanged(inputs) {
    console.log("the inputs have changed, the builder acknowledges");
    //TODO: knownValues needs to come from BindVariableList
    var knownValues = {"account_id": 42, "user_id": 4148};

    var bindVariables = this.findBindVariables(inputs.text);
    var boundVariables = this.resolveVariables(bindVariables, knownValues);
    var output = this.buildOutput(inputs.text, boundVariables);
    this.setState( {output: output, variables: bindVariables} );
  }

  resolveVariables(variables, values) {
    var resolved = {}
    for (let key of Object.keys(variables)) {
      var alias = variables[key];
      var knownValue = values[alias];
      resolved[key] = knownValue;
    }
    return resolved;
  }

  buildOutput(query, variables) {
    return query.replace(/\$\d+/g, (match) => {
      var knownVariable = variables[match]
      if(knownVariable)
        return knownVariable;
      else
        return match;
    });
  }

  findBindVariables(query) {
    var re = /([a-z\"\._]+)\"?\s*=\s*(\$\d+)/g;
    var m;
    var variables = {}
    while ((m = re.exec(query)) !== null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }
      // m[0] = user_id = $1
      // m[1] = user_id
      // m[2] = $1
      // m.index = 35
      variables[m[2]] = m[1];
      console.dir(m);
    }
    return variables;
  }

  render() {
    return (
      <div>The <strong>QueryBuilder</strong> holds all
        <QueryInput onInputsChanged={this.handleInputsChanged.bind(this)} variables={this.state.variables} />
        <BoundQueryDisplay text={this.state.output} />
      </div>
    )
  }
}

class BoundQueryDisplay extends React.Component {
  render() {
    return (
        <div style={{color: "blue"}}>
        { this.props.text }
        </div>
    );
  }
}

class QueryInput extends React.Component {
  queryTextChanged(newText) {
    console.log("parent received new text: " + newText);
    this.props.onInputsChanged({text: newText});
  }

  variableValueChanged(evt) {
    console.log("Variable value changed");
    console.dir(evt);
  }

  render() {
    return (
        <div style={{color: "red"}}>
        The QueryInput input
          <div>
            <QueryTemplateInput foo={33} onQueryChanged={this.queryTextChanged.bind(this)} />
          </div>
          <div>
            <BindVariableList variables={this.props.variables} onAnyValueChanged={this.variableValueChanged.bind(this)} />
          </div>
        </div>
        )
  }
}

class QueryTemplateInput extends React.Component {
  constructor() {
    super()
    //this.textChanged = this.tick.bind(this);
  }

  textChanged(evt) {
    console.log("the text changed " + new Date());
    this.props.onQueryChanged(evt.target.value);
  }

  render() {
    return (
      <textarea onChange={this.textChanged.bind(this)} cols="120" rows="4" >
      </textarea>
      )
  }
}

class BindVariableList extends React.Component {
  render() {
    var rows = [];
    var variables = this.props.variables || {};
    for (let key of Object.keys(variables)) {
      rows.push(
        <BindVariableRow key={key} name={key} alias={variables[key]} onValueChanged={this.props.onAnyValueChanged} />
      );
    }
    return (
        <ul>
        { rows }
        </ul>
    );
  }
}

class BindVariableRow extends React.Component {
  textChanged(evt) {
    var message = {}
    message[this.props.name] = evt.target.value;
    this.props.onValueChanged(message);
  }

  render() {
    return (
      <li>
        <label>
        {this.props.alias} ({this.props.name}):
          <input type="text" name={"entry_" + this.props.name} onChange={this.textChanged.bind(this)} />
        </label>
      </li>
    );
  }
}

export default QueryBuilder
