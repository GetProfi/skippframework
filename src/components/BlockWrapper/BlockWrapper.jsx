import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BlockWrapper extends Component {
  constructor(props) {
    super(props);

    this.props.syncBlockElement(this.props.params.backend.index, this.props.id);

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { sync, id, params } = nextProps;

    const values = {};

    params.children.forEach((item) => {
      values[item.id] = sync[id] && sync[id][item.id];
    });

    this.setState({ values });
  }

  onBlur(ev) {
    const { values } = { ...this.state };

    if (
      ev.target.getAttribute('data-type') === 'edit' &&
      ev.target.name in this.state.values
    ) {
      values[ev.target.name] = ev.target.value;
      this.setState({ values });

      this.props.saveBLockElement(this.props.params.backend.index, values);
    }
  }

  onChange(ev) {
    const { values } = { ...this.state };

    if (
      ev.target.getAttribute('data-type') === 'edit' &&
      ev.target.name in this.state.values
    ) {
      values[ev.target.name] = ev.target.value;
      this.setState({ values });
    }
  }

  render() {
    const { children } = this.props;

    let html;

    if (React.Children.count(children) == 0) {
      html = children;
    } else if (typeof this.props.children['0'] === 'function') {
      html = children['0'];
    }

    if (!this.props.public) {
      return (
        <div
          onBlur={(ev) => {
            this.onBlur(ev);
          }}
          onChange={(ev) => {
            this.onChange(ev);
          }}
        >
          {html(this.state ? { ...this.state.values } : {})}
        </div>
      );
    }

    return <div>{html(this.state ? { ...this.state.values } : {})}</div>;
  }
}

BlockWrapper.propTypes = {
  id: PropTypes.string.isRequired
};

export default BlockWrapper;
