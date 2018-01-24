import React, { Component } from 'react';
import map from 'lodash/map';
import each from 'lodash/each';
import filter from 'lodash/filter';
import compact from 'lodash/compact';

import ImageCoverHOC from 'containers/ImageCoverHOC';
import Input from './Input';
import Hidden from './Hidden';
import HtmlEditor from './HtmlEditor';
import EditorDropdown from './Dropdown/EditorDropdown';
import EditorTextarea from './EditorTextarea';
import Datetime from './Datetime/Datetime';
import Daypicker from './Datetime/DaypickerTime';
import FilterDropdownTabs from './FilterDropDownTabs';
import EditorCheckbox from './EditorCheckbox';

export default class IncludeEditor extends Component {
  constructor(props) {
    super(props);

    const { defaultFields = {} } = this.props;
    const fields = {};

    this.props.params.children.forEach((elem) => {
      if (defaultFields[elem.id]) {
        fields[elem.id] = { ...elem, value: defaultFields[elem.id] };
      } else {
        fields[elem.id] = { ...elem, value: this.props.data[elem.id] };
      }
    });

    this.state = {
      fields,
      savingElement: false,
      deletingElement: false,
      openDropDown: false,
    };
  }

  componentWillMount() {
    this.deleteElement = this.deleteElement.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.changeSendingState = this.changeSendingState.bind(this);
  }

  createPutUrl = (withId) => {
    const { selectedId, params: { backend } } = this.props;

    return withId ? `${backend.update}/${selectedId}` : backend.index;
  };

  createBodyFromState = () => {
    const { fields } = this.state;

    const body = {};

    each(fields, (field) => {
      body[field.id] = field.value;
    });

    return body;
  };

  hideDropDown = () => {
    this.setState({ openDropDown: false });
  };

  showDropDown = () => {
    this.setState({ openDropDown: true });
  };

  deleteElement(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    const {
      selectedId,
      removeArrayElement,
      onRemove,
      onCloseEditor,
    } = this.props;

    const confirmDelete = window.confirm("Удалить запись");

    if (confirmDelete) {
      this.setState({ deletingElement: true });

      removeArrayElement({ selectId: selectedId }).then((res) => {
        this.setState({ deletingElement: false });
        onRemove && onRemove(res);
        onCloseEditor && onCloseEditor(res);
      });
    }
  }

  changeSendingState(newStateFields) {
    const { fields } = this.state;

    this.setState({
      fields: { ...fields, ...newStateFields }
    });
  }

  createExtraString() {
    const { fields } = this.state;

    let extraData = "";

    fields.keywords.value &&
      (extraData += fields.keywords.value.toLowerCase() + ' ');
    fields.description.value &&
      (extraData += fields.description.value.toLowerCase() + ' ');
    fields.name.value && (extraData += fields.name.value.toLowerCase() + ' ');

    const createExtendFields = filter(
      fields,
      item => item.type === 'extend_data'
    )[0];
    const categories = fields.categoryIds;

    if (!categories.value) categories.value = [];

    if (createExtendFields) {
      const res = createExtendFields.data.categories.filter((item) => {
        if (categories.value.indexOf(item.id) > -1) return true;
      });

      extraData += res.map(item => item.name.toLowerCase()).join(' ');
    }

    return extraData.replace(/(\r\n|\n|\r)/gm, "");
  }

  saveChanges(ev) {
    const { putArrayElement, syncArrayBlock, onCloseEditor } = this.props;
    const { fields } = this.state;
    let body = this.createBodyFromState();

    let createExtendFields = filter(
      fields,
      item => item.type === 'extend_data'
    )[0];

    if (createExtendFields) {
      const extraString = this.createExtraString();
      body = { ...body, system_search: extraString };
    }

    this.setState({ savingElement: true });

    putArrayElement({
      url: this.createPutUrl(false),
      urlWithId: this.createPutUrl(true),
      body,
    }).then((res) => {
      this.setState({ savingElement: false });
      onCloseEditor && onCloseEditor(res);
      return undefined;
    });
  }

  renderForm() {
    const { fields } = { ...this.state };

    const elems = map(fields, (field, ix) => {
      if (
        field.role &&
        this.props.userRole &&
        field.role.indexOf(this.props.userRole)
      )
        return null;

      switch (field.type) {
        case 'text':
        case 'number':
          return (
            <Input changeSendingState={this.changeSendingState} {...field} />
          );

        case 'date':
          return (
            <Daypicker
              changeSendingState={this.changeSendingState}
              {...field}
            />
          );

        case 'datetime':
          return (
            <Datetime changeSendingState={this.changeSendingState} {...field} />
          );

        case 'hidden':
          return <Hidden {...field} key={ix} />;

        case 'image':
          return (
            <ImageCoverHOC
              changeSendingState={this.changeSendingState}
              {...field}
            />
          );

        case 'dropdown':
          return (
            <EditorDropdown
              changeSendingState={this.changeSendingState}
              {...field}
            />
          );

        case 'html':
          return (
            <HtmlEditor
              changeSendingState={this.changeSendingState}
              {...field}
            />
          );

        case 'textarea':
          return (
            <EditorTextarea
              changeSendingState={this.changeSendingState}
              {...field}
            />
          );

        case 'category':
        case 'single-category':
          return (
            <FilterDropdownTabs
              activeItems={[]}
              hideDropDown={this.hideDropDown}
              changeSendingState={this.changeSendingState}
              fieldType={field.type}
              {...field}
              key={ix}
            />
          );

        case 'checkbox':
          return (
            <EditorCheckbox
              hideDropDown={this.hideDropDown}
              changeSendingState={this.changeSendingState}
              {...field}
            />
          );

        case 'extend_data':
          return undefined;

        default:
          console.log(`field.type ${field.type} not found`);
      }
    });

    return compact(elems).map((item, idx) => {
      if (item.props.type === 'hidden') {
        return (
          <div
            key={idx}
            className="edit-block w-clearfix"
            style={{ display: 'none' }}
          >
            {item}
          </div>
        );
      }

      return (
        <div key={idx} className="edit-block w-clearfix">
          {item}
        </div>
      );
    });
  }

  render() {
    const { close } = this.props;

    return (
      <div className="edit-content clearfix" style={{ float: 'none' }}>
        <a
          style={{ cursor: 'pointer' }}
          className="close order-close w-inline-block"
          onClick={ev => {
            close(ev);
          }}
        />
        <div className="w-form">
          <div
            style={{ marginTop: 40 }}
            id="email-form"
            name="email-form"
            data-name="Email Form"
            className="w-clearfix"
          >
            {this.renderForm()}
          </div>
        </div>
        {!this.state.savingElement ? (
          <div>
            <a
              onClick={this.saveChanges}
              style={{ color: "#fff" }}
              className="btn btn-sm btn-success left w-button"
            >
              Сохранить
            </a>
            {/*<a onClick={(ev) => {close(ev)}} className="button-border w-button">отмена</a>*/}
            <a
              onClick={this.deleteElement}
              className="button-border del w-button"
            >
              Удалить запись
            </a>
          </div>
        ) : (
          <div>
            <a
              style={{
                backgroundColor: "rgba(24, 22, 53, 0.1)",
                color: "#000"
              }}
              onClick={this.saveChanges}
              className="button-border w-button"
            >
              Идет сохранение...
            </a>
          </div>
        )}
      </div>
    );
  }
}
