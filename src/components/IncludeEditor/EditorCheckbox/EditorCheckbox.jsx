import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

export default class EditorCheckbox extends Component {
  constructor(props) {
    super(props);

    const { value } = this.props;

    this.state = {
      switcherState: !!value,
    };
  }

  switchState() {
    const { changeSendingState, id, type, title, value } = this.props;

    this.setState({ switcherState: !this.state.switcherState });

    changeSendingState({
      [id]: { id, type, title, value: !this.state.switcherState }
    });
  }

  render() {
    const { switcherState } = this.state;
    const { title } = this.props;

    return (
      <div className="clearfix">
        <label className="field-label" htmlFor="email-2">
          {title}
        </label>
        <div
          onClick={this.switchState.bind(this)}
          className={cn("switcher w-clearfix", switcherState ? 'on' : 'off')}
        >
          <div
            style={{ float: switcherState ? 'right' : 'left' }}
            className={cn('switcher-pin', switcherState ? 'on' : 'off')}
          />
        </div>
      </div>
    );
  }
}

EditorCheckbox.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  switcherState: PropTypes.bool,
  switchState: PropTypes.func
};