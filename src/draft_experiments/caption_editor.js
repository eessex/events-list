import React from 'react';
import ReactDOM from 'react-dom';
import { convertToRaw,
        convertFromHTML,
        CompositeDecorator,
        ContentState,
        Editor,
        EditorState,
        RichUtils,
        Modifier } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html'
import Immutable from 'immutable'

const sampleMarkup =
  '<p><b>Bold text</b>, <i>Italic text</i><br/ ></p>' +
  '<a href="http://www.facebook.com">Example link</a> ' +
  '<a className="is-follow-link" href="http://artsy.net/artist/jeff-wall">Thing</a>';

class CaptionEditor extends React.Component {
  constructor(props) {
    super(props);
    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);
    //convert props into entitymap
    const blocksFromHTML = convertFromHTML(sampleMarkup);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

		const blockRenderMap = Immutable.Map({
		  'header-two': {
		    element: 'h2'
		  },
		  'unstyled': {
		    element: 'h2'
		  }
		});

    this.state = {
      // if state is empty, need to make an empty editorstate
    	// editorState: EditorState.createEmpty(decorator),
      editorState: EditorState.createWithContent(state, decorator),
    	showLinkInput: false,
    	linkValue: '',
      html: ''
    };

		this.focus = () => this.refs.editor.focus();
    this.logState = () => {
      const content = convertToRaw(this.state.editorState.getCurrentContent());
      console.log(JSON.stringify(content));
      let html = stateToHTML(this.state.editorState.getCurrentContent())
      this.setState({html})
    }
    this.onChange = (editorState) => {
      this.setState({editorState});
      this.logState()
    }
    // link methods
    this.promptForLink = this._promptForLink.bind(this);
    this.onLinkChange = (e) => this.setState({linkValue: e.target.value});
    this.confirmLink = this._confirmLink.bind(this);
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
    this.removeLink = this._removeLink.bind(this);


    this.blockRendererFn = (block) => this._blockRendererFn(block)
    // rich text methods
    // this.onTab = (e) => this._onTab(e);
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    // this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
  }

  _blockRendererFn(block) {
  	debugger
  }

  // _toggleBlockType(blockType) {
  //   this.onChange(
  //     RichUtils.toggleBlockType(this.state.editorState, blockType)
  //   );
  // }
   _toggleInlineStyle(inlineStyle) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  }
  // _onTab(e) {
  //   const maxDepth = 4;
  //   this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  // }

  _handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
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
      debugger
      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      this.setState({
        showLinkInput: true,
        linkValue: url,
      }, () => {
        setTimeout(() => this.refs.url.focus(), 0);
      });
    }
  }

  _confirmLink(e) {
  	debugger
    e.preventDefault();
    const {editorState, linkValue} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: linkValue}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.setState({
      editorState: RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      ),
      showLinkInput: false,
      linkValue: '',
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
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
    }
  }

  render() {
    let linkInput;
    if (this.state.showLinkInput) {
      linkInput =
        <div style={styles.urlInputContainer}>
          <input
            onChange={this.onLinkChange}
            ref="url"
            style={styles.urlInput}
            type="text"
            value={this.state.linkValue}
            onKeyDown={this.onLinkInputKeyDown} />
          <button onMouseDown={this.confirmLink}>
            Confirm
          </button>
        </div>;
    }
    return (
  		<div style={styles.root}>
    		<h1>Test Editor</h1>
        <div className='toolbar'>
          <InlineStyleControls
            editorState={this.state.editorState}
            onToggle={this.toggleInlineStyle} />
          <div style={styles.buttons}>
            <button
              onMouseDown={this.promptForLink}>
              Add Link
            </button>
            <button onMouseDown={this.removeLink}>
              Remove Link
            </button>
          </div>
          {linkInput}
        </div>
        <div style={styles.editor} onClick={this.focus}>
	        <Editor
	        	ref='editor'
	        	blockRendererFn={this.blockRendererFn}
	        	blockRenderMap={this.blockRenderMap}
	        	editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onTab={this.onTab}
            spellCheck={true}
	        	onChange={this.onChange} />
        </div>
        {this.state.html}
    	</div>
    );
  }
} module.exports = CaptionEditor

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }
    return (
      <button className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </button>
    );
  }
}

const InlineStyleControls = (props) => {
  var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
  ];
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style} />
      )}
    </div>
  );
};

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

var Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData().url;
  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  );
};

const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
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
    color: '#3b5998',
    textDecoration: 'underline',
  },
};