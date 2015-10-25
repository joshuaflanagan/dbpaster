import React from 'react';

class QueryBuilder extends React.Component {
  constructor(props) {
    super(props)
    console.log("QueryBuilder was constructed!");
    this.state = {
      templateText: "",
      variables: {},
      variableValues: {}
    };
  }

  handleQueryChanged(queryTemplate) {
    // Extract placeholders from the query, store their alias
    // { "$1": "user_id", "$2": "state" }
    var placeholders = this.findVariablePlaceholders(queryTemplate);

    this.setState( {templateText: queryTemplate, variables: placeholders} );
  }

  handleVariableChanged(variable) {
    var variableValues = this.state.variableValues;
    variableValues[variable.name] = variable.value;
    this.setState( {variableValues: variableValues} );
  }

  findVariablePlaceholders(query) {
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
    }
    return variables;
  }

  render() {
    return (
      <div>The <strong>QueryBuilder</strong> holds all
        <div style={{color: "red"}}>
          <div>
            <QueryTemplateInput onQueryChanged={this.handleQueryChanged.bind(this)} />
          </div>
          <div>
            <BindVariableList variables={this.state.variables} onAnyValueChanged={this.handleVariableChanged.bind(this)} />
          </div>
        </div>

        <BoundQueryDisplay template={this.state.templateText} values={this.state.variableValues} />
      </div>
    )
  }
}

class BoundQueryDisplay extends React.Component {
  buildOutput(query, values) {
    return query.replace(/\$\d+/g, (match) => {
      var knownVariable = values[match]
      if(knownVariable)
        return knownVariable;
      else
        return match;
    });
  }

  render() {
    var output = this.buildOutput(this.props.template, this.props.values);
    return (
        <div style={{color: "blue"}}>
        { output }
        </div>
    );
  }
}

class QueryTemplateInput extends React.Component {
  constructor() {
    super()
  }

  textChanged(evt) {
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
    for (let variable of Object.keys(variables)) {
      rows.push(
        <BindVariableRow key={variable} name={variable}
          alias={variables[variable]}
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
    var message = {
      "name": this.props.name,
      "alias": this.props.alias,
      "value": evt.target.value
    };
    this.props.onValueChanged(message);
  }

  render() {
    return (
      <li>
        <label>
        {this.props.alias} ({this.props.name}):
          <input type="text" name={"entry_" + this.props.name}
            defaultValue={this.props.initialValue}
            onChange={this.textChanged.bind(this)} />
        </label>
      </li>
    );
  }
}

export default QueryBuilder
