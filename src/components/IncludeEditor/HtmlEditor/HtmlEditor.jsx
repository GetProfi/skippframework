import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class HtmlEditor extends Component {
  constructor(props) {
    super(props);

    const { value } = this.props;

    let editorState;
    if (value) {
      const processedHTML = DraftPasteProcessor.processHTML(value);
      const contentState = ContentState.createFromBlockArray(processedHTML);

      editorState = EditorState.createWithContent(contentState);
      editorState = EditorState.moveFocusToEnd(editorState);
    } else {
      editorState = EditorState.createEmpty();
    }

    this.state = { editorState };
  }

  onEditorStateChange = (editorState) => {
    const { id, type, title } = this.props;

    this.props.changeSendingState({
      [id]: {
        id,
        type,
        title,
        value: stateToHTML(editorState.getCurrentContent())
      }
    });

    this.setState({ editorState });
  };

  render() {
    const { title } = this.props;

    return (
      <div className="html-editor">
        <label className="field-label" htmlFor="name-2">
          {title}
        </label>

        <Editor
          onEditorStateChange={this.onEditorStateChange.bind(this)}
          editorState={this.state.editorState}
          toolbar={{
            options: [
              'blockType',
              'inline',
              'list',
              'link',
              'emoji',
              'history',
            ],
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough'],
            },
            list: {
              options: ['unordered', 'ordered'],
            },
          }}
        />
      </div>
    );
  }
}
