import ReactDOM from 'react-dom';
import classNames from 'classnames';
import React from 'react';

const DEFAULT_PLACEHOLDER_STRING = 'Select...';

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.value || {
        label: props.placeholder || DEFAULT_PLACEHOLDER_STRING,
        value: ''
      },
      isOpen: false,
    };
    this.mounted = true;
    this.firstOpen = true;
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.fireChangeEvent = this.fireChangeEvent.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value && newProps.value !== this.state.selected) {
      this.setState({ selected: newProps.value });
    } else if (!newProps.value) {
      this.setState({
        selected: {
          label: newProps.placeholder || DEFAULT_PLACEHOLDER_STRING,
          value: '',
        }
      });
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
    document.addEventListener('touchend', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('touchend', this.handleDocumentClick, false);
  }

  handleMouseDown(event) {
    if (this.props.onFocus && typeof this.props.onFocus === 'function') {
      this.props.onFocus(this.state.isOpen);
    }
    if (event.type === 'mousedown' && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    if (!this.props.disabled) {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }

  setValue(value, label) {
    const newState = {
      selected: {
        value,
        label,
      },
      isOpen: false,
    };
    this.fireChangeEvent(newState);
    this.firstOpen = false;
    this.setState(newState);
  }

  fireChangeEvent(newState) {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  }

  renderOption(option, status) {
    const { statusColors } = this.props;

    let optionClass = classNames({
      [`${this.props.baseClassName}-field`]: true,
      'is-selected':
        option === this.state.selected ||
        (option.toLowerCase() == this.props.placeholder.toLowerCase() &&
          this.firstOpen)
    });

    let statusColor;

    const value = option.value || option.label || option;
    const label = option.label || option.value || option;

    if (status) {
      statusColors.forEach(item => {
        if (item[0].toLowerCase() == label.toLowerCase()) {
          statusColor = item[1];
        }
      });
      if (!statusColor) statusColor = '';
    }

    return (
      <div
        key={value}
        className={optionClass}
        onMouseDown={this.setValue.bind(this, value, label)}
        onClick={this.setValue.bind(this, value, label)}
      >
        {status && (
          <div
            style={{ backgroundColor: statusColor }}
            className={`${this.props.baseClassName}-state`}
          />
        )}
        <div className={`${this.props.baseClassName}-placeholder`}>{label}</div>
      </div>
    );
  }

  buildMenu(status) {
    const { options, baseClassName } = this.props;
    const ops = options.map((option) => {
      if (option.type === 'group') {
        const groupTitle = (
          <div className={`${baseClassName}-title`}>{option.name}</div>
        );
        const _options = option.items.map(item => this.renderOption(item));

        return (
          <div className={`${baseClassName}-group`} key={option.name}>
            {groupTitle}
            {_options}
          </div>
        );
      }

      return this.renderOption(option, status);
    });

    return ops.length ? (
      ops
    ) : (
      <div className={`${baseClassName}-noresults`}>No options found</div>
    );
  }

  handleDocumentClick(event) {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        this.setState({ isOpen: false });
      }
    }
  }

  render() {
    const { baseClassName, status, statusColors } = this.props;
    const disabledClass = this.props.disabled
      ? `${baseClassName}-disabled`
      : '';
    const placeHolderValue =
      typeof this.state.selected === 'string'
        ? this.state.selected
        : this.state.selected.label;
    const value = (
      <div className={`${baseClassName}-placeholder`}>{placeHolderValue}</div>
    );
    const menu = this.state.isOpen ? (
      <div className={`${baseClassName}-menu`}>{this.buildMenu(status)}</div>
    ) : null;

    const dropdownClass = classNames({
      [`${baseClassName}-root`]: true,
      'is-open': this.state.isOpen
    });

    let statusColor;

    if (status) {
      statusColors.forEach((item) => {
        if (item[0].toLowerCase() == placeHolderValue.toLowerCase()) {
          statusColor = item[1];
        }
      });
      if (!statusColor) statusColor = '';
    }

    if (this.props.skolkovo) {
      return (
        <div className={dropdownClass}>
          <div
            className={`${baseClassName}-control ${disabledClass} ${
              status ? '' : `${baseClassName}-no-state`
            }`}
            onMouseDown={this.handleMouseDown.bind(this)}
            onTouchEnd={this.handleMouseDown.bind(this)}
          >
            {status && (
              <div
                style={{ backgroundColor: statusColor }}
                className={`${baseClassName}-state`}
              />
            )}
            {value}
            <span className={`${baseClassName}-arrow`} />
          </div>
          {menu}
        </div>
      );
    }

    return (
      <div className={dropdownClass}>
        <div
          className={`${baseClassName}-control ${disabledClass} ${
            status ? "" : `${baseClassName}-no-state`
          }`}
          onMouseDown={this.handleMouseDown.bind(this)}
          onTouchEnd={this.handleMouseDown.bind(this)}
        >
          {status && (
            <div
              style={{ backgroundColor: statusColor }}
              className={`${baseClassName}-state`}
            />
          )}
          {value}
          <span className={`${baseClassName}-arrow`} />
        </div>
        {menu}
      </div>
    );
  }
}

Dropdown.defaultProps = { baseClassName: 'editor-dropdown' };
export default Dropdown;
