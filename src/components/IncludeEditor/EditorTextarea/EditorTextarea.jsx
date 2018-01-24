import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';

export default class EditorTextarea extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(ev) {
    const { changeSendingState, id, type, title, value } = this.props;

    changeSendingState({
      [id]: { id, type, title, value: ev.target.value }
    });
  }

  render() {
    const { id, type, title, value } = this.props;

    const style = {
      display: 'block',
      width: '100%',
      borderRadius: '2px',
      minHeight: '96px',
    };

    return (
      <div>
        <label className="field-label" htmlFor="name-2">
          {title}
        </label>

        <TextareaAutosize
          className="textarea w-input"
          style={style}
          value={value}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
