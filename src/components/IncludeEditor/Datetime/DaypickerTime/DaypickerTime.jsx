import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { days } from 'constants/days';
import SmoothCollapse from 'react-smooth-collapse';
import { getDayShortMonthFullYear } from 'utils/date';

import './editor-timepicker.scss';

export default class DaypickerTime extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.state = {
      show: false,
      ...this.getInitialState()
    };
  }

  getInitialState() {
    return {
      from: this.props.value && new Date(this.props.value.split(' ')[0]),
      to: this.props.value && new Date(this.props.value.split(' ')[1]),
      enteredTo: null, // Keep track of the last day for mouseEnter.
    };
  }

  resetValues() {
    return {
      from: null,
      to: null,
      enteredTo: null, // Keep track of the last day for mouseEnter.
    };
  }

  isSelectingFirstDay(from, to, day) {
    const isBeforeFirtDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirtDay || isRangeSelected;
  }

  handleDayClick(day) {
    const { from, to, enteredTo } = this.state;
    const { changeSendingState, id, type, title, value } = this.props;

    if (from && to) {
      this.handleResetClick(true);
      return;
    }
    if (this.isSelectingFirstDay(from, to, day)) {
      this.setState({ from: day, to: null, enteredTo: null });
    } else {
      this.setState({ to: day, enteredTo: day });
      changeSendingState({
        [id]: {
          id,
          type,
          title,
          value:
            new Date(from).toISOString() + ' ' + new Date(day).toISOString()
        }
      });
    }
  }

  handleDayMouseEnter(day) {
    const { from, to } = this.state;

    if (!this.isSelectingFirstDay(from, to, day)) {
      this.setState({ enteredTo: day });
    }
  }

  handleResetClick(reset) {
    this.setState(reset ? this.resetValues() : this.getInitialState());
  }

  showCalendar = (ev) => {
    this.setState({ show: !this.state.show });
  };

  render() {
    const { from, to, enteredTo, show } = this.state;
    const modifiers = { start: from, end: enteredTo };
    const disabledDays = { before: this.state.from };
    const selectedDays = [from, { from, to: enteredTo }];

    return (
      <div className="clearfix">
        <label className="field-label" htmlFor="name-2">
          {this.props.title}
        </label>
        <div className="dropdown-root" style={{ position: 'relative' }}>
          <div
            className="dropdown-control"
            style={{ float: 'none' }}
            onClick={this.showCalendar}
          >
            <div className="dropdown-placeholder">
              {from && to
                ? `c ${getDayShortMonthFullYear(this.state.from)} по ${getDayShortMonthFullYear(this.state.to)}`
                : 'Выберите дату'}
            </div>
            <span className="dropdown-arrow" />
          </div>
          <SmoothCollapse expanded={show}>
            <DayPicker
              className="DayPicker-Time"
              numberOfMonths={1}
              fromMonth={from}
              selectedDays={selectedDays}
              disabledDays={disabledDays}
              modifiers={modifiers}
              onDayClick={this.handleDayClick}
              weekdaysLong={days.weekDaysLong}
              weekdaysShort={days.weekDaysShort}
              months={days.monthsLong}
              onDayMouseEnter={this.handleDayMouseEnter}
            />
          </SmoothCollapse>
        </div>
      </div>
    );
  }
}
