import React from 'react';
import ReactDOM from 'react-dom';
import { convertToRaw,
        convertFromHTML,
        CompositeDecorator,
        ContentState,
        Editor,
        EditorState,
        RichUtils } from 'draft-js';

import {stateToHTML} from 'draft-js-export-html'

const sampleMarkup =
  '<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
  '<a href="http://www.facebook.com">Example link</a>' +
  '<ul><li>Example list</li></ul>' +
  '<a className="is-follow-link" href="http://artsy.net/artist/jeff-wall">Thing</a>';

class TestEditor extends React.Component {
  constructor(props) {
    super(props);
    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
      {
        strategy: findArtistEntities,
        component: Artist,
      },
    ]);

    //convert props into entitymap
    const blocksFromHTML = convertFromHTML(sampleMarkup);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    this.state = {
    	// editorState: EditorState.createEmpty(decorator),
      editorState: EditorState.createWithContent(state, decorator),
    	showLinkInput: false,
      showArtistInput: false,
    	linkValue: '',
      artistValue: '',
      html: ''
    };

		this.focus = () => this.refs.editor.focus();
    this.logState = () => {
      debugger
      const content = convertToRaw(this.state.editorState.getCurrentContent());
      console.log(JSON.stringify(content));
      let options = {
        blockRenderers: {
          ARTIST: (block) => {
            let data = block.getData();
            debugger
            // if (data.class === 'is-follow-link') {
              return '<a>' + escape(block.getText()) + '</a>';
            // }
          },
        },
      };

      let html = stateToHTML(this.state.editorState.getCurrentContent(), options)
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
    //artist methods
    this.promptForArtist = this._promptForArtist.bind(this);
    this.onArtistChange = (e) => this.setState({artistValue: e.target.value});
    this.confirmArtist = this._confirmArtist.bind(this);
    this.onArtistInputKeyDown = this._onArtistInputKeyDown.bind(this);
    this.removeArtist = this._removeArtist.bind(this);

    // rich text methods
    this.onTab = (e) => this._onTab(e);
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);

  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(this.state.editorState, blockType)
    );
  }
   _toggleInlineStyle(inlineStyle) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  }
  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
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
        showLinkInput: true,
        linkValue: url,
      }, () => {
        setTimeout(() => this.refs.url.focus(), 0);
      });
    }
  }

  _confirmLink(e) {
    e.preventDefault();
    const {editorState, linkValue} = this.state;
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

  _promptForArtist(e) {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithArtistAtBeginning = contentState.getBlockForKey(startKey);
      const artistKey = blockWithArtistAtBeginning.getEntityAt(startOffset);

      let url = '';
      if (artistKey) {
        const artistInstance = contentState.getEntity(artistKey);
        url = artistInstance.getData().url;
      }

      this.setState({
        showArtistInput: true,
        artistValue: url,
      }, () => {
        setTimeout(() => this.refs.artist_url.focus(), 0);
      });
    }
  }

  _confirmArtist(e) {
    e.preventDefault();
    const {editorState, artistValue} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'ARTIST',
      'MUTABLE',
      { url: artistValue,
        className: 'is-follow-link' }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.setState({
      editorState: RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      ),
      showArtistInput: false,
      artistValue: '',
    }, () => {
      setTimeout(() => this.refs.editor.focus(), 0);
    });
  }

  _onArtistInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmArtist(e);
    }
  }

  _removeArtist(e) {
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
    let artistInput;
    if (this.state.showArtistInput) {
      linkInput =
        <div style={styles.urlInputContainer}>
          <input
            onChange={this.onArtistChange}
            ref="artist_url"
            style={styles.urlInput}
            type="text"
            value={this.state.artistValue}
            onKeyDown={this.onArtistInputKeyDown} />
          <button onMouseDown={this.confirmArtist}>
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
          <BlockStyleControls
            editorState={this.state.editorState}
            onToggle={this.toggleBlockType} />
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
          <div style={styles.buttons}>
            <button
              onMouseDown={this.promptForArtist}>
              Add Artist
            </button>
            <button onMouseDown={this.removeArtist}>
              Remove Artist
            </button>
          </div>
          {artistInput}
        </div>
        <div style={styles.editor} onClick={this.focus}>
	        <Editor
	        	ref='editor'
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
}

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

function findArtistEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      debugger
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'ARTIST'
      );
    },
    callback
  );
}

// const HANDLE_TOC = /<a name=['"]+/g;

// function findToc(contentBlock, callback, contentState) {
//   // debugger
//   findWithRegex(HANDLE_TOC, contentBlock, callback);
// }

// function findWithRegex(regex, contentBlock, callback) {
//   const text = contentBlock.getText();
//   let matchArr, start;
//   debugger
//   while ((matchArr = regex.exec(text)) !== null) {
//     start = matchArr.index;
//     callback(start, start + matchArr[0].length);
//   }
// }

function getBlockStyle(block) {
  switch (block.getType()) {
    default: return null;
  }
}

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

const BLOCK_TYPES = [
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style} />
      )}
    </div>
  );
};

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

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  );
};

const Artist = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={styles.artist} className='is-follow-link'>
      {props.children}
    </a>
  );
};

const Toc = (props) => {
  const {name} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a name={name} style={styles.toc}>
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
  artist: {
    backgroundColor: 'yellow',
  },
  toc: {
    backgroundColor: '#aaaaaa',
  },
};

module.exports = TestEditor