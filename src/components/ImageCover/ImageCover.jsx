import React from 'react';
import PropTypes from 'prop-types';

class ImageCover extends React.Component {
  state = {
    over: false
  };

  componentWillMount() {
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.addFile = this.addFile.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  fileToBlob = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  addFile(ev) {
    ev.stopPropagation();

    const {
      changeSendingState,
      id,
      _id: serverId,
      type,
      title,
      withChildren,
      putArrayElement,
      params,
      item,
    } = this.props;
    const file = ev.target.files[0];

    this.fileToBlob(file).then((result) => {
      this.props.createImage(file, result).then(() => {
        if (withChildren) {
          putArrayElement(
            {
              url: params.backend.update,
              urlWithId: `${params.backend.update}/${serverId}`,
              body: { image: this.props.sync.image },
            },
            item.fake ? 'add' : 'edit',
          );
        } else {
          changeSendingState({
            [id]: { id, type, title, value: this.props.sync.image }
          });
        }
      });
    });
  }

  onDragStart(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.state.over || this.setState({ over: true });
  }

  onDragOver(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.state.over || this.setState({ over: true });
  }

  onDrop(ev, item) {
    ev.preventDefault();
    ev.stopPropagation();

    const {
      changeSendingState,
      id,
      _id: serverId,
      type,
      title,
      withChildren,
      putArrayElement,
      params,
    } = this.props;
    const file = ev.dataTransfer.files[0];

    this.fileToBlob(file).then((result) => {
      this.props.createImage(file, result).then(() => {
        if (withChildren) {
          putArrayElement(
            {
              url: params.backend.update,
              urlWithId: `${params.backend.update}/${serverId}`,
              body: { image: this.props.sync.image }
            },
            item.fake ? 'add' : 'edit',
          );
        } else {
          changeSendingState({
            [id]: { id, type, title, value: this.props.sync.image }
          });
        }

        this.setState({ over: false });
      });
    });
  }

  deleteImage(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    const {
      changeSendingState,
      id,
      _id: serverId,
      type,
      title,
      withChildren,
      removeArrayElement,
    } = this.props;

    if (withChildren) {
      removeArrayElement({ selectId: serverId });
    } else {
      changeSendingState({
        [id]: { id, type, title, value: '' }
      });
    }
  }

  onDragLeave(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.state.over && this.setState({ over: false });
  }

  render() {
    const {
      value,
      title,
      withChildren,
      item,
      fake,
    } = this.props;

    if (withChildren) {
      return (
        <div
          className="dnd-wrapper"
          onDrop={(ev) => {
            this.onDrop(ev, item);
          }}
          onDragStart={this.onDragStart}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
        >
          {this.props.children}
          {fake || (
            <a
              onClick={(ev) => {
                this.deleteImage(ev, item);
              }}
              className="small-icon w-button white-buttone delete-image"
            />
          )}
          <input
            className="dnd-wrapper-file"
            onChange={this.addFile}
            type="file"
          />
        </div>
      );
    }

    return (
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
          display: 'inline-block',
        }}
        onDrop={this.onDrop}
        onDragStart={this.onDragStart}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
      >
        <label className="field-label" htmlFor="name-2">
          {title}
        </label>

        {value ? (
          <div
            style={{
              backgroundImage: `url(${value})`,
              backgroundSize: 'cover',
              border: this.state.over ? '2px solid rgba(24, 22, 53, .4)' : '',
            }}
            className="logo placeholder w-clearfix"
          >
            <a
              onClick={this.deleteImage}
              className="small-icon w-button white-buttone delete-image"
            />
            <input
              className="image-cover-add_file"
              onChange={this.addFile}
              type="file"
            />
          </div>
        ) : (
          <div
            style={{
              overflow: 'hidden',
              position: 'relative',
              display: 'inline-block',
              border: this.state.over ? '2px solid rgba(24, 22, 53, .4)' : '',
            }}
          >
            <div className="add logo placeholder" />
            <input
              onChange={this.addFile}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                opacity: 0,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
              type="file"
            />
          </div>
        )}
      </div>
    );
  }
}

ImageCover.propTypes = {
  changeSendingState: PropTypes.func.isRequired
};

export default ImageCover;
