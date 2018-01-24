import React, { Component } from 'react';
import DayPicker from 'react-day-picker';
import SmoothCollapse from 'react-smooth-collapse';
import { getDayShortMonthFullYear } from 'utils/date';
import TimePicker from '../Timepicker';
import './editor-daypicker.scss';

class Datetime extends Component {
  state = {
    show: false,
    showTime: false,
    selectedDay: '',
    selectedTime: '',
  };

  componentDidMount() {
    const { value } = this.props;
    const time = new Date(value);

    const selectedHours = time.getHours();
    const selectedMinutes = time.getMinutes() == 0 ? '00' : time.getMinutes();

    if (value) {
      this.setState({
        selectedDay: value,
        selectedTime: `${selectedHours}:${selectedMinutes}`,
      });
    }
  }

  showCalendar = () => {
    this.setState({ show: !this.state.show });
  };

  showTime = () => {
    this.setState({ showTime: true });
  };

  hideTime = () => {
    this.setState({ showTime: false });
  };

  clickTime = (time) => {
    const { changeSendingState, id, type, title, value } = this.props;
    const { selectedDay } = this.state;
    const [hours, minutes] = time.split(':');

    const parseDate = new Date(selectedDay);
    parseDate.setHours(hours);
    parseDate.setMinutes(minutes);

    changeSendingState({
      [id]: { id, type, title, value: parseDate }
    });

    this.hideTime();
    this.setState({ selectedTime: time, selectDay: parseDate });
  };

  selectDay = (selectDay) => {
    const { changeSendingState, id, type, title, value } = this.props;

    changeSendingState({
      [id]: { id, type, title, value: selectDay }
    });

    this.setState({
      selectedDay: selectDay,
      show: false,
    });
  };

  changeTime = (time) => {
    this.setState({ selectedTime: time });
  };

  render() {
    const {
      type,
      weekDaysLong,
      weekDaysShort,
      monthsLong,
    } = this.props;
    const { selectedDay, show, showTime, selectedTime } = this.state;

    return (
      <div className="clearfix">
        <div className="dropdown-root" style={{ position: 'relative' }}>
          <div className="dropdown-control" onClick={this.showCalendar}>
            <div className="dropdown-placeholder">
              {selectedDay
                ? getDayShortMonthFullYear(selectedDay)
                : 'Выберите дату'}
            </div>
            <span className="dropdown-arrow" />
          </div>
          <SmoothCollapse expanded={show}>
            <DayPicker
              locale="ru"
              months={monthsLong}
              className="DayPicker-Editor"
              weekdaysLong={weekDaysLong}
              weekdaysShort={weekDaysShort}
              selectedDay={this.state.selectedDay}
              onDayClick={this.selectDay}
            />
          </SmoothCollapse>
        </div>
        {type !== 'date' && (
          <TimePicker
            placeholder="ВРЕМЯ"
            onChangeTime={this.clickTime}
            changeTime={this.clickTime}
            showTime={showTime}
            initialValue={selectedTime}
          />
        )}
      </div>
    );
  }
}

Datetime.defaultProps = {
  weekDaysLong: [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ],
  weekDaysShort: ['В', 'П', 'В', 'С', 'Ч', 'П', 'С'],
  monthsLong: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'ноябрь',
    'Декабрь',
  ],
};

export default Datetime;
