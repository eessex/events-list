import React from 'react';
import {convertToRaw,
				convertFromHTML,
        CompositeDecorator,
        ContentState,
        Editor,
        EditorState,
        RichUtils,
	      getVisibleSelectionRect} from 'draft-js';

let sampleMarkup = ''
// sampleMarkup = '<p>Bold text, <i>Italic text</i> <a href="http://www.facebook.com">Example link</a></p>';

class FreshCaption extends React.Component {
  constructor(props) {
    super(props);
    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    const blocksFromHTML = convertFromHTML(sampleMarkup);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    let editorState;
    if (sampleMarkup.length) {
    	editorState = EditorState.createWithContent(state, decorator)
    } else {
    	editorState = EditorState.createEmpty(decorator)
    }

    this.state = {
    	editorState,
      showURLInput: false,
      urlValue: '',
    };

   	this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.refs.editor.focus();
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };

    this.promptForLink = this._promptForLink.bind(this);
    this.onURLChange = (e) => this.setState({urlValue: e.target.value});
    this.confirmLink = this._confirmLink.bind(this);
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
    this.removeLink = this._removeLink.bind(this);
  }

  _promptForLink(e) {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      this.setState({
        showURLInput: true,
        urlValue: url,
      }, () => {
        setTimeout(() => this.refs.url.focus(), 0);
      });
    }
  }

  _confirmLink(e) {
    e.preventDefault();
    const {editorState, urlValue} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: urlValue}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.setState({
      editorState: RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      ),
      showURLInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this.refs.editor.focus(), 0);
    });
  }

  _onLinkInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmLink(e);
    }
  }

  _removeLink(e) {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    const urlValue = ''
    const showURLInput = false
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
        urlValue,
        showURLInput,
      });
    }
  }
	_onStyleClick(e) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, e.target.id));
  }

  render() {
    let urlInput;
    if (this.state.showURLInput) {
      urlInput =
        <div style={styles.urlInputContainer}>
          <input
            onChange={this.onURLChange}
            ref="url"
            style={styles.urlInput}
            type="text"
            value={this.state.urlValue}
            onKeyDown={this.onLinkInputKeyDown} />
          <button onMouseDown={this.confirmLink}>
            Confirm
          </button>
          <button onMouseDown={this.removeLink}>
            Remove
          </button>
        </div>;
    }

    return (
      <div style={styles.caption}>
	      <div style={styles.editor}>
	        <Editor
	        	ref='editor'
	        	placeholder='Image caption'
	          editorState={this.state.editorState}
	          spellCheck={true}
	          stripPastedStyles={true}
	          handleKeyCommand={this.handleKeyCommand}
	          onChange={this.onChange} />
	      </div>
        <div style={styles.buttons}>
	        <button
	        	id='ITALIC'
	        	onClick={this._onStyleClick.bind(this)}
	        	style={styles.button}>
	        	Italic
	        </button>
          <button
            onMouseDown={this.promptForLink}
            style={styles.button}>
            <svg>
            	{linkIcon}
						</svg>
          </button>
        </div>
        {urlInput}
      </div>
    );
  }
}

module.exports = FreshCaption

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  );
};

const LinkIcon = () => {
	return (
			<path fill="#231F20" d="M14.7,1c-1.3-1.3-3.7-1.3-5,0L7.1,3.6c-0.7,0.7-1,1.6-1,2.5c-0.9,0-1.8,0.3-2.5,1L1,9.7
		c-1.4,1.4-1.4,3.6,0,5c0.7,0.7,1.6,1,2.5,1c0.9,0,1.8-0.4,2.5-1l2.6-2.6c0.7-0.7,1-1.6,1-2.5c0.9,0,1.8-0.4,2.5-1L14.7,6
		c0.7-0.7,1-1.6,1-2.5S15.4,1.7,14.7,1z M7.3,10.8l-2.6,2.6C4.1,14,3,14,2.3,13.4c-0.7-0.7-0.7-1.8,0-2.4l2.6-2.6
		c0.3-0.3,0.8-0.5,1.2-0.5c0.1,0,0.3,0,0.4,0L5.2,9.2c-0.4,0.4-0.4,0.9,0,1.3c0.2,0.2,0.4,0.3,0.6,0.3c0.2,0,0.5-0.1,0.6-0.3l1.3-1.3
		C7.9,9.8,7.8,10.4,7.3,10.8z M13.4,4.7l-2.6,2.6c-0.3,0.3-0.8,0.5-1.2,0.5c-0.1,0-0.3,0-0.4,0l1.1-1.1c0.4-0.4,0.4-0.9,0-1.3
		C10,5,9.4,5,9,5.4L8,6.5C7.8,5.9,8,5.3,8.4,4.9L11,2.3c0.3-0.3,0.8-0.5,1.2-0.5c0.5,0,0.9,0.2,1.2,0.5c0.3,0.3,0.5,0.8,0.5,1.2
		C13.9,4,13.7,4.4,13.4,4.7z"/>
	)
}

const styles = {
  // root: {
  //   fontFamily: '\'Georgia\', serif',
  //   width: 600,
  // },
  // buttons: {
  //   marginBottom: 10,
  // },
  // urlInputContainer: {
  //   marginBottom: 10,
  // },
  // urlInput: {
  //   fontFamily: '\'Georgia\', serif',
  //   marginRight: 10,
  //   padding: 3,
  // },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    width: 250,
    padding: 10,
  },
  button: {
    padding: 10,
    textAlign: 'center',
    display: 'inline-block'
  },
  link: {
    color: '#3b5998',
    textDecoration: 'underline',
  },
};