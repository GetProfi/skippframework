import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import find from 'lodash/find';

import Dropdown from '../Dropdown';
import './editor-dropdown.scss';

export default class EditorDropdown extends Component {
  static propTypes = {
    changeSendingState: PropTypes.func.isRequired,
    values: PropTypes.array.isRequired
  };

  componentWillMount() {
    this.onChange = this.onChange.bind(this);
  }

  onChange(selectedValue, evt) {
    const { values, id, type, title, value } = this.props;

    const selectedItem = values.find(elem => elem.name == selectedValue.value);

    this.props.changeSendingState({
      [id]: { id, type, title, value: selectedItem.id, values }
    });
  }

  render() {
    const { value = '', name = '', status, values, title } = this.props;
    const options = map(values, item => item.name);
    const placeholder = find(values, item => item.id == value);

    return (
      <div className="clearfix">
        <label className="field-label" htmlFor="name-2">
          {title}
        </label>

        <Dropdown
          onChange={this.onChange}
          status={status}
          options={options}
          placeholder={placeholder ? placeholder.name : ''}
        />
      </div>
    );
  }
}
