import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Input extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(ev) {
    const {changeSendingState, id, type, title, value} = this.props;

    changeSendingState({
      [id]: {
        id,
        type,
        title,
        value: type == 'text' ? ev.target.value : parseFloat(ev.target.value)
      }
    });
  }

  render() {
    const {id, type, title, value} = this.props;

    return (
      <div>
        <label className="field-label" htmlFor="name-2">
          {title}
        </label>
        <input
          onChange={this.onChange}
          value={value}
          className="input w-input"
          id="name-2"
          name="name-2"
          placeholder="Введите текст"
          type={type == 'text' ? 'text' : 'number'}
        />
      </div>
    );
  }
}
