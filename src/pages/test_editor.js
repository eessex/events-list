import React from 'react';
import ReactDOM from 'react-dom';
import { convertToRaw,
        CompositeDecorator,
        ContentState,
        Editor,
        EditorState,
        RichUtils } from 'draft-js';

class TestEditor extends React.Component {
  constructor(props) {
    super(props);

		const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    this.state = {
    	editorState: EditorState.createEmpty(decorator),
    	showURLInput: false,
    	urlValue: ''
    };

		this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };
  }

  componentDidMount() {
  	this.refs.editor.focus()
  }

   _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  _onItalicClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }


  render() {
    return (
  		<div style={styles.root}>
    		<h1>Test Editor</h1>
    		<div style={styles.buttons}>
	        <button onClick={this._onBoldClick.bind(this)}>Bold</button>
	        <button onClick={this._onItalicClick.bind(this)}>Italic</button>
        </div>
        <div style={styles.editor} onClick={this.focus}>
	        <Editor
	        	ref='editor'
	        	editorState={this.state.editorState}
	        	onChange={this.onChange} />
        </div>
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

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
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

module.exports = TestEditor