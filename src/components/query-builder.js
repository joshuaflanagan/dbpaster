import React from 'react';

class QueryBuilder extends React.Component {
  constructor(props) {
    super(props)
    console.log("QueryBuilder was constructed!");
    this.state = {
      output: "waiting for input...",
      variables: [],
      knownValues: {}
    };
  }

  handleQueryChanged(queryTemplate) {
    // Extract placeholders from the query, store their alias
    // { "$1": "user_id", "$2": "state" }
    var bindVariables = this.findBindVariables(queryTemplate);

    // Build variable value inputs
    // [{name: "$1", alias: "user_id", value: 4}, {name: "$2", alias: "state", value: "TX"}]
    var variableList = this.buildVariableList(bindVariables, this.state.knownValues);

    // Resolve variables to values so they can be plugged into query
    // { "$1": 4, "$2": "TX" }
    var boundVariables = this.resolveVariables(variableList);

    var output = this.buildOutput(queryTemplate, boundVariables);
    this.setState( {output: output, variables: variableList, knownValues: this.state.knownValues} );
  }

  handleVariableChanged(variable) {
    console.log("A variable changed at the top!");
    console.dir(variable);
  }

  buildVariableList(variables, values) {
    var list = []
    for (let key of Object.keys(variables)) {
      var alias = variables[key];
      var knownValue = values[alias];
      list.push({name: key, alias: alias, value: knownValue})
    }
    return list;
  }

  resolveVariables(variableList) {
    var boundVariables = {}
    for(let variable of variableList){
      boundVariables[variable.name] = variable.value;
    }
    return boundVariables;
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
    var re = /([a-z\"\._]+)\"?\s*([=|>|<=]+|IN)\s*(\$\d+)/gi;
    var m;
    var variables = {}
    while ((m = re.exec(query)) !== null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }
      // m[0] = user_id = $1
      // m[1] = user_id
      // m[2] = '='
      // m[3] = $1
      // m.index = 35
      variables[m[3]] = m[1];
      console.dir(m);
    }
    return variables;
  }

  render() {
    return (
      <div>The <strong>QueryBuilder</strong> holds all
        <QueryInput
          onQueryChanged={this.handleQueryChanged.bind(this)}
          onVariableChanged={this.handleVariableChanged.bind(this)}
          variables={this.state.variables} />
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
    this.props.onQueryChanged(newText);
  }

  variableValueChanged(evt) {
    console.log("Variable value changed");
    console.dir(evt);
    this.props.onVariableChanged(evt);
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
    var variables = this.props.variables || [];
    for (let variable of variables) {
      rows.push(
        <BindVariableRow key={variable.name} name={variable.name}
          alias={variable.alias}
          initialValue={variable.value}
          onValueChanged={this.props.onAnyValueChanged} />
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
          <input type="text" name={"entry_" + this.props.name}
            value={this.initialValue}
            onChange={this.textChanged.bind(this)} />
        </label>
      </li>
    );
  }
}

export default QueryBuilder
