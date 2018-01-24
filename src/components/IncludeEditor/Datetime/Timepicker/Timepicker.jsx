import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import ScrollIntoView from 'dom-scroll-into-view';
import SmoothCollapse from 'react-smooth-collapse';
import enhanceWithClickOutside from 'react-click-outside';

class Timepicker extends Component {
  constructor(props) {
    super(props);
    const time = [];
    const timeWithMinutes = [];

    for (let i = 0; i < 24; i++) {
      if (i == 24) {
        time.push('00');
      } else {
        time.push(i < 10 ? `0${i}` : `${i}`);
      }
    }

    time.forEach((item) => {
      for (let k = 0; k < 60; k += this.props.step) {
        timeWithMinutes.push(item + ":" + (k === 0 ? "00" : k));
      }
    });

    this.state = {
      time: timeWithMinutes,
      selTime: '',
      showDropTime: false,
    };
  }

  scrollToActive() {
    const container = document.querySelector(".popover-time");
    const activeElem = container.querySelector(".active");
    if (activeElem) {
      ScrollIntoView(activeElem, container, { alignWithTop: true });
    }
  }

  handleClickOutside() {
    const { onChangeTime } = this.props;

    const time = this.timeValidator(this.timeInput.value);

    if (this.state.showDropTime) {
      this.setState(
        {
          showDropTime: false,
          selTime: time,
        },
        () => {
          this.scrollToActive();
          onChangeTime(time);
        }
      );
    }
  }

  timeValidator(time) {
    const [hours = '', minutes = ''] = time.split(':');
    const [initHours = '', initMinutes = ''] = this.props.initialValue.split(':');

    const validateHours = (hours) => {
      if (hours.length >= 3 || hours > 24) {
        return initHours;
      }

      return hours;
    };

    const validateMinutes = (minutes) => {
      if (minutes.length >= 3 || minutes > 59) {
        return initMinutes;
      }

      return minutes;
    };

    if (!hours && !minutes) {
      return '';
    }

    const h = validateHours(hours);
    const m = validateMinutes(minutes);

    return `${h}:${m}`;
  }

  toogleDropdown = () => {
    const { onChangeTime } = this.props;

    const time = this.timeValidator(this.timeInput.value);

    this.setState(
      {
        showDropTime: !this.state.showDropTime,
        selTime: time,
      },
      () => {
        this.scrollToActive();
        onChangeTime(time);
      }
    );
  };

  hideDropdown = (ev) => {
    const { onChangeTime } = this.props;

    const time = this.timeValidator(this.timeInput.value);

    if (ev.key == 'Enter') {
      this.setState(
        {
          showDropTime: false,
          selTime: time,
        },
        () => {
          this.scrollToActive();
          onChangeTime(time);
        }
      );
    }
  };

  selectTime = (time) => {
    const { onChangeTime } = this.props;

    this.setState(
      {
        selTime: time,
        showDropTime: false,
      },
      () => {
        this.scrollToActive();
        onChangeTime(time);
      }
    );
  };

  onChangeTime = (ev) => {
    const time = ev.target.value;
    const { onChangeTime } = this.props;

    this.setState(
      { selTime: time },
      () => this.scrollToActive()
    );
  };

  render() {
    const { time, selTime, showDropTime } = this.state;
    const { placeholder } = this.props;

    return (
      <div className="input-root time" onKeyDown={this.hideDropdown}>
        <input
          onClick={this.toogleDropdown}
          onChange={this.onChangeTime}
          value={selTime ? selTime : this.props.initialValue}
          style={{ marginBottom: 0 }}
          className="input time w-input"
          placeholder={placeholder}
          ref={(input) => {
            this.timeInput = input;
          }}
          type="text"
          defaultValue={this.props.initialValue}
        />
        <SmoothCollapse expanded={showDropTime}>
          <div
            style={{ opacity: 1, overflowX: 'auto' }}
            className="popover-time"
            data-ix="show-time"
          >
            {time.map(item => (
              <div
                onClick={() => {
                  this.selectTime(item);
                }}
                key={item}
                className={cn('dropdown-field', { active: selTime == item })}
              >
                <div className={cn('dropdown-placeholder no-state')}>
                  {item}
                </div>
              </div>
            ))}
          </div>
        </SmoothCollapse>
      </div>
    );
  }
}

export default enhanceWithClickOutside(Timepicker);

Timepicker.defaultProps = {
  step: 30,
};

Timepicker.propTypes = {
  changeTime: PropTypes.func.isRequired,
};
