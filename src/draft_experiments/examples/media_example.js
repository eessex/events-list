import React from 'react';
import ReactDOM from 'react-dom';

import {
  AtomicBlockUtils,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
} from 'draft-js'

class MediaEditorExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      showURLInput: false,
      url: '',
      urlType: '',
    };

    this.focus = () => this.refs.editor.focus();
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };
    this.onChange = (editorState) => this.setState({editorState});
    this.onURLChange = (e) => this.setState({urlValue: e.target.value});

    this.addLink = this._addLink.bind(this);
    this.addImage = this._addImage.bind(this);
    this.addVideo = this._addVideo.bind(this);
    this.confirmLink = this._confirmLink.bind(this);
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.onURLInputKeyDown = this._onURLInputKeyDown.bind(this);
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _confirmLink(e) {
    e.preventDefault();
    debugger
    const {editorState, urlValue, urlType} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      urlType,
      'MUTABLE',
      {href: urlValue}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    );

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      ),
      showURLInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this.focus(), 0);
    });
  }

  _onURLInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmLink(e);
    }
  }

  _promptForLink(type) {
    const {editorState} = this.state;
    debugger
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
        url = linkInstance.getData().href;
      }

	    this.setState({
	      showURLInput: true,
	      urlValue: url,
	      urlType: type,
	    }, () => {
	      setTimeout(() => this.refs.url.focus(), 0);
	    });
	  }
	}

  _addLink() {
    this._promptForLink('link');
  }

  _addImage() {
    this._promptForLink('image').bind(this);
  }

  _addVideo() {
    this._promptForLink('video').bind(this);
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
            onKeyDown={this.onURLInputKeyDown} />
          <button onMouseDown={this.confirmLink}>
            Confirm
          </button>
        </div>;
    }

    return (
      <div style={styles.root}>
        <div style={{marginBottom: 10}}>
          Use the buttons to add link, image, or video.
        </div>
        <div style={{marginBottom: 10}}>
          Here are some local examples that can be entered as a URL:
          <ul>
            <li>link.mp3</li>
            <li>link.png</li>
            <li>link.mp4</li>
          </ul>
        </div>
        <div style={styles.buttons}>
          <button onMouseDown={this.addLink} style={{marginRight: 10}}>
            Add Link
          </button>
          <button onMouseDown={this.addImage} style={{marginRight: 10}}>
            Add Image
          </button>
          <button onMouseDown={this.addVideo} style={{marginRight: 10}}>
            Add Video
          </button>
        </div>
        {urlInput}
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            blockRendererFn={linkBlockRenderer}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            placeholder="again..."
            ref="editor" />
        </div>
        <input
          onClick={this.logState}
          style={styles.button}
          type="button"
          value="Log State" />
      </div>
    );
  }
}

module.exports = MediaEditorExample



function linkBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: CustomLink,
    };
  }

  return null;
}

const Link = (props) => {
	debugger
  return (
  	<a href={props.href} style={styles.link}>link</a>
  	);
};

const Image = (props) => {
  return <img src={props.src} style={styles.link} />;
};

const Video = (props) => {
  return <video controls src={props.src} style={styles.link} />;
};

const CustomLink = (props) => {
	debugger
  const entity = props.contentState.getEntity(
    props.block.getEntityAt(0)
  );
  debugger
  const {href} = entity.getData();
  const type = entity.getType();

  let customLink;
  if (type === 'link') {
  	debugger
    customLink = <Link props={props} />;
  } else if (type === 'image') {
    customLink = <Image src={src} />;
  } else if (type === 'video') {
    customLink = <Video src={src} />;
  }

  return customLink;
};

const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    padding: 20,
    width: 600,
  },
  buttons: {
    marginBottom: 10,
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
  },
  artist: {
    color: 'blue',
  },
  toc: {
    color: 'blue',
  },
};