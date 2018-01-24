import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import each from 'lodash/each';

import IncludeEditor from '../IncludeEditor';
import ImageCover from '../ImageCover';

class ImagesWrapper extends Component {
  constructor(props) {
    super(props);

    const { params } = this.props;

    this.state = {
      params,
      modalState: false,
      image: '',
    };

    this.putArrayElement = this.putArrayElement.bind(this);
    this.syncArrayBlock = this.syncArrayBlock.bind(this);
    this.removeArrayElement = this.removeArrayElement.bind(this);
    this.addArrayElement = this.addArrayElement.bind(this);
    this.addNewElement = this.addNewElement.bind(this);
    this.changeSendingState = this.changeSendingState.bind(this);
    this.addFile = this.addFile.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  componentWillMount() {
    const { params, id, syncArrayBlock } = this.props;

    if (this.props.filter) {
      syncArrayBlock(params.backend.index, id, this.props.filter);
    } else {
      syncArrayBlock(params.backend.index, id);
    }
  }

  componentWillUpdate(nextProps) {
    const { params, id, syncArrayBlock } = this.props;

    if (this.props.filter !== nextProps.filter) {
      syncArrayBlock(params.backend.index, id, nextProps.filter);
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
    );
  }

  async putArrayElement(data = {}, actionType) {
    const { url, body, urlWithId } = data;

    if (actionType == 'edit') {
      await this.props.putArrayElement(urlWithId, body);
    } else if (actionType == 'add') {
      await this.props.addArrayElement(url, this.props.id, body);
    }

    await this.props.syncArrayBlock(url, this.props.id, this.props.filter);
  }

  async syncArrayBlock(url, blockName) {
    return this.props.syncArrayBlock(url, blockName, this.props.filter);
  }

  changeSendingState(newImg) {
    this.setState({
      image: { image: newImg }
    });
  }

  addNewElement(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.setState({
      modalState: true,
      selectedItem: {},
      actionType: 'add',
      selectedId: {},
    });
  }

  addFile(ev) {
    this.fileToBase64(ev.target.files[0]).then((result) => {
      this.changeSendingState(result);
    });
  }

  deleteImage(ev, item) {
    ev.preventDefault();
    ev.stopPropagation();

    const { params, id } = this.props;

    this.changeSendingState('', item['_id']);
    this.removeArrayElement({ params, id, selectId: item['_id'] });
  }

  renderEditor() {
    const { params, id, sync, nameFields } = this.props;

    let selectedData;

    if (this.state.actionType == 'edit') {
      selectedData =
        sync[id] && sync[id].find(item => item['_id'] == this.state.selectedId);
    } else if (this.state.actionType == 'add') {
      const fake = { ...sync[id][0] };
      selectedData = fake;

      delete fake['_acl'];
      delete fake['_kmd'];
      delete fake['_id'];

      each(selectedData, (elem, key) => {
        selectedData[key] = '';
      });
    }

    return (
      <IncludeEditor
        className="includeEditor"
        id={id}
        fields={nameFields}
        params={params}
        data={selectedData}
        selectedId={this.state.selectedId}
        removeArrayElement={this.removeArrayElement}
        putArrayElement={this.putArrayElement}
        close={this.closeModalWindow}
      />
    );
  }

  render() {
    const { params, id, sync, children } = this.props;

    let mainHtml;
    let addButton;

    const htmlData = sync[id];

    if (!htmlData) return null;

    if (Children.count(children) == 0) {
      mainHtml = children;
    } else if (Children.count(children) > 0) {
      children.forEach((child) => {
        if (!mainHtml && typeof child == 'function') {
          mainHtml = child;
        }
        if (
          typeof child == 'object' &&
          child.props &&
          child.props['data-type'] == 'drag-add'
        ) {
          addButton = child;
        }
      });
    }

    htmlData[htmlData.length - 1].fake ||
      htmlData.push({ ...sync[id][0], fake: true });

    return (
      <div>
        {htmlData.map((item, ix) => (
          <ImageCover
            key={ix}
            withChildren={true}
            putArrayElement={this.putArrayElement}
            changeSendingState={this.changeSendingState}
            removeArrayElement={this.removeArrayElement}
            {...item}
            addButton={addButton}
            params={params}
            item={item}
          >
            {!item.fake ? mainHtml(item) : addButton}
          </ImageCover>
          ))}
      </div>
    );
  }
}

ImagesWrapper.propTypes = {
  params: PropTypes.shape({
    backend: PropTypes.object.isRequired,
    children: PropTypes.array.isRequired,
  }),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ImagesWrapper;
