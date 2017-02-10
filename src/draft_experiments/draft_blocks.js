import React from 'react';
import ReactDOM from 'react-dom';
import { ContentState } from 'draft-js';

// GENERIC LINK BLOCK

export function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK' &&
        contentState.getEntity(entityKey).getData().className !== 'is-follow-link'
      );
    },
    callback
  );
}

export var Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData().url;
  return (
    <a href={url} style={block_styles.link}>
      {props.children}
    </a>
  );
};

// ARTIST BLOCK

export function findArtistEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      if (entityKey) {
        console.log('className: ' + contentState.getEntity(entityKey).getData().className)
      }
      debugger
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getData().className === 'is-follow-link'
      );
    },
    callback
  );
}

export var Artist = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  debugger
  return (
    <a href={url} style={block_styles.artist} className='is-follow-link'>
      {props.children}
    </a>
  );
};

const Toc = (props) => {
  const {name} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a name={name} style={block_styles.toc}>
      {props.children}
    </a>
  );
};

export const block_styles = {
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