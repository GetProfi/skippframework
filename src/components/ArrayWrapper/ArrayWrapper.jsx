import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import SmoothCollapse from 'react-smooth-collapse';
import map from 'lodash/map';

import IncludeEditor from 'components/IncludeEditor';
import { createFieldsFromChildren } from 'utils';

class ArrayWrapper extends Component {
  constructor(props) {
    super(props);

    const { params } = this.props;

    this.state = {
      params,
      modalState: false,
      fetch: true,
    };

    this.putArrayElement = this.putArrayElement.bind(this);
    this.syncArrayBlock = this.syncArrayBlock.bind(this);
    this.removeArrayElement = this.removeArrayElement.bind(this);
    this.addArrayElement = this.addArrayElement.bind(this);
    this.addNewElement = this.addNewElement.bind(this);
    this.clickHandl = this.clickHandl.bind(this);
    this.showModalWindow = this.showModalWindow.bind(this);
    this.closeModalWindow = this.closeModalWindow.bind(this);
  }

  async componentWillMount() {
    const { params, id, syncArrayBlock } = this.props;

    if (this.props.filter) {
      this.setState({ fetch: false });
      await syncArrayBlock(
        params.backend.index,
        id,
        this.props.filter,
        this.props.sort,
      );
      this.setState({ fetch: true });
    } else {
      syncArrayBlock(params.backend.index, id, null, this.props.sort);
    }
  }

  async componentWillUpdate(nextProps) {
    const { syncArrayBlock } = this.props;
    const { params: { backend } } = nextProps;

    if (
      JSON.stringify(this.props.filter) !== JSON.stringify(nextProps.filter) ||
      this.props.id !== nextProps.id
    ) {
      await syncArrayBlock(
        backend.index,
        nextProps.id,
        nextProps.filter,
        nextProps.sort,
      );
    }
  }

  async addArrayElement(url, body) {
    const { params, id } = this.props;

    return this.props.addArrayElement(params.backend.index, id, body);
  }

  async removeArrayElement(data = {}) {
    const { params, id } = this.props;
    const { selectId } = data;

    await this.props.removeArrayElement(`${params.backend.index}/${selectId}`);
    await this.props.syncArrayBlock(
      params.backend.index,
      id,
      this.props.filter,
      this.props.sort,
    );

    this.closeModalWindow();
  }

  async putArrayElement(data = {}) {
    const { url, body, urlWithId } = data;

    if (this.state.actionType === 'edit') {
      await this.props.putArrayElement(urlWithId, body);
    } else if (this.state.actionType === 'add') {
      await this.props.addArrayElement(url, this.props.id, body);
    }

    const res = await this.props.syncArrayBlock(
      url,
      this.props.id,
      this.props.filter,
      this.props.sort,
    );
    this.closeModalWindow();
    return res;
  }

  async syncArrayBlock(url, blockName) {
    return this.props.syncArrayBlock(
      url,
      blockName,
      this.props.filter,
      this.props.sort,
    );
  }

  clickHandl(ev, item) {
    const editElement = ev.target.getAttribute('data-type') === 'edit';
    const isActionType = ev.target.getAttribute('data-action');

    if (ev.target.getAttribute('data-type') === 'edit') {
      this.setState({
        modalState: true,
        selectedItem: { ...item },
        actionType: 'edit',
        selectedId: item['_id'],
        dataAction: isActionType,
      });
    }
  }

  addNewElement(ev, action) {
    ev.preventDefault();
    ev.stopPropagation();

    this.setState({
      modalState: true,
      selectedItem: {},
      selectedId: {},
      actionType: 'add',
      dataAction: action,
    });
  }

  showModalWindow() {
    this.setState({ modalState: true });
  }

  closeModalWindow(ev) {
    const { onCloseEditor } = this.props;

    this.setState({ modalState: false, selectedId: 0, actionType: '' });

    onCloseEditor && onCloseEditor();
  }

  render() {
    const { params, id, sync, children } = this.props;

    let mainHtml;
    let addButton;
    let selectedData;
    let emptyTemplate;

    let htmlData = sync;

    if (!htmlData) return null;

    if (Children.count(children) == 0) {
      mainHtml = children;
    } else if (Children.count(children) > 0) {
      children.forEach((child) => {
        if (!mainHtml && typeof child === 'function') {
          mainHtml = child;
        }
        if (
          typeof child == 'object' &&
          child.props &&
          child.props['data-type'] === 'add'
        ) {
          addButton = child;
        }
        if (
          typeof child == 'object' &&
          child.props &&
          child.props['data-type'] === 'empty'
        ) {
          emptyTemplate = child;
        }
      });
    }

    if (this.props.filterFunc) {
      htmlData = this.props.filterFunc(htmlData);
    }

    if (this.state.actionType === 'edit') {
      selectedData = htmlData.find(item => item._id === this.state.selectedId);
    } else if (this.state.actionType == 'add') {
      selectedData = createFieldsFromChildren(
        this.props.params.children,
        this.props.defaultFields,
      );
    }

    const checkUiStateEditor = (item, ix) => {
      const { modalState, actionType, selectedId } = this.state;

      return (
        (modalState && item._id == selectedId) ||
        (actionType === 'add' && modalState && ix == 0)
      );
    };

    if (this.props.filter && !this.state.fetch) {
      return null;
    }

    return (
      <div>
        {addButton && (
          <SmoothCollapse expanded={this.state.actionType !== 'add'}>
            <div
              onClick={(ev) => {
                this.addNewElement(ev, addButton.props["data-action"]);
              }}
              className="clearfix"
            >
              {addButton}
            </div>
          </SmoothCollapse>
        )}
        <SmoothCollapse
          expanded={this.state.actionType === 'add' && htmlData.length == 0}
        >
          {this.state.actionType === 'add' &&
            htmlData.length === 0 && (
              <IncludeEditor
                className="includeEditor"
                selectedId={this.state.selectedId}
                removeArrayElement={this.removeArrayElement}
                putArrayElement={this.putArrayElement}
                params={params}
                data={selectedData}
                id={id}
                close={this.closeModalWindow}
                fields={this.props.nameFields}
                onRemove={this.props.onRemove}
                onCloseEditor={this.props.onCloseEditor}
                userRole={this.props.userRole}
                deleteButton={this.props.deleteButton}
                defaultFields={this.props.defaultFields}
              />
            )}
        </SmoothCollapse>
        {!!mainHtml &&
          map(htmlData, (item, ix) => {
            return (
              <div
                onClick={(ev) => {
                  this.clickHandl(ev, item);
                }}
                key={item['_id']}
              >
                <SmoothCollapse expanded={checkUiStateEditor(item, ix)}>
                  {checkUiStateEditor(item, ix) && (
                    <IncludeEditor
                      className="includeEditor"
                      selectedId={this.state.selectedId}
                      removeArrayElement={this.removeArrayElement}
                      putArrayElement={this.putArrayElement}
                      params={params}
                      data={selectedData}
                      id={id}
                      close={this.closeModalWindow}
                      fields={this.props.nameFields}
                      onRemove={this.props.onRemove}
                      onCloseEditor={this.props.onCloseEditor}
                      userRole={this.props.userRole}
                      deleteButton={this.props.deleteButton}
                      defaultFields={this.props.defaultFields}
                    />
                  )}
                </SmoothCollapse>
                <SmoothCollapse
                  expanded={this.state.selectedId !== item['_id']}
                >
                  {this.state.selectedId !== item['_id'] && (
                    <div>
                      {' '}
                      {mainHtml(
                        { ...item, ...params, index: ix },
                        htmlData,
                      )}{' '}
                    </div>
                  )}
                </SmoothCollapse>
              </div>
            );
          })}
        {!htmlData.length && emptyTemplate}
      </div>
    );
  }
}

ArrayWrapper.propTypes = {
  params: PropTypes.shape({
    backend: PropTypes.object.isRequired,
    children: PropTypes.array.isRequired
  }),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ArrayWrapper;
