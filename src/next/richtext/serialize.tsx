import { SerializedElementNode, ElementFormatType } from 'node_modules/lexical/nodes/LexicalElementNode';
import { SerializedLexicalNode } from 'node_modules/lexical/LexicalNode';
import type {
  LinkFields,
  SerializedLinkNode,
  SerializedParagraphNode,
  SerializedHeadingNode,
  SerializedQuoteNode,
  SerializedTextNode,
  SerializedListNode,
  SerializedListItemNode,
} from '@payloadcms/richtext-lexical';

import Link from 'next/link';
import React, { JSX, Fragment, CSSProperties } from 'react';

import escapeHTML from 'escape-html';

// Text node formatting
// from https://github.com/facebook/lexical/blob/c2ceee223f46543d12c574e62155e619f9a18a5d/packages/lexical/src/LexicalConstants.ts
const IS_BOLD = 1;
const IS_ITALIC = 1 << 1;
const IS_STRIKETHROUGH = 1 << 2;
const IS_UNDERLINE = 1 << 3;
const IS_CODE = 1 << 4;
const IS_SUBSCRIPT = 1 << 5;
const IS_SUPERSCRIPT = 1 << 6;

type Heading = Extract<keyof JSX.IntrinsicElements, 'h1' | 'h2' | 'h3' | 'h4' | 'h5'>;
type List = Extract<keyof JSX.IntrinsicElements, 'ol' | 'ul'>;

interface Props {
  nodes: SerializedLexicalNode[];
}

export function serializeLexical({ nodes }: Props): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((_node, index): JSX.Element | null => {
        // early exit
        if (_node == null || _node === undefined) {
          return null;
        }
        // handle children
        const serializedChildren =
          'children' in _node ? serializeChildrenRecursion(_node as SerializedElementNode) : null;

        switch (_node.type) {
          case 'text': {
            return handleTextNode(_node as SerializedTextNode, index);
          }
          case 'linebreak': {
            return <br key={index} />;
          }
          case 'paragraph': {
            const node = _node as SerializedParagraphNode;
            return (
              <p key={index} style={handleNodeFormat(node.format, node.indent)}>
                {serializedChildren}
              </p>
            );
          }
          case 'heading': {
            const node = _node as SerializedHeadingNode;
            const Tag = node?.tag as Heading;
            return (
              <Tag key={index} style={handleNodeFormat(node.format, node.indent)}>
                {serializedChildren}
              </Tag>
            );
          }
          case 'list': {
            const node = _node as SerializedListNode;
            const Tag = node?.tag as List;
            return (
              <Tag className={node?.listType} key={index}>
                {serializedChildren}
              </Tag>
            );
          }
          case 'listitem': {
            return handleListItemNode(_node as SerializedListItemNode, index, serializedChildren);
          }
          case 'quote': {
            const node = _node as SerializedQuoteNode;
            return <blockquote key={index}>{serializedChildren}</blockquote>;
          }
          case 'link': {
            return handleLinkNode(_node as SerializedLinkNode, index, serializedChildren);
          }
          default: {
            console.log('Unhandled node:', _node?.type);
            return null;
          }
        }
      })}
    </Fragment>
  );
}

const serializeChildrenRecursion = (node: SerializedElementNode): JSX.Element | null => {
  if (node.children == null) {
    return null;
  }
  // NOTE: Hacky fix for
  // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
  // which does not return checked: false (only true - i.e. there is no prop for false)
  if (node?.type === 'list' && (node as SerializedListNode)?.listType === 'check') {
    for (const item of node.children) {
      if ('checked' in item) {
        if (!item?.checked) {
          item.checked = false;
        }
      }
    }
  }
  return serializeLexical({ nodes: node.children });
};

function handleTextNode(node: SerializedTextNode, index: number) {
  /*
   * Baseline: just text -> We put it in a span.
   */
  let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} key={index} />;
  /*
   * Now we apply formatting with additional tags around the span.
   */
  if (node.format & IS_BOLD) {
    text = <strong key={index}>{text}</strong>;
  }
  if (node.format & IS_ITALIC) {
    text = <em key={index}>{text}</em>;
  }
  if (node.format & IS_STRIKETHROUGH) {
    text = (
      <span key={index} style={{ textDecoration: 'line-through' }}>
        {text}
      </span>
    );
  }
  if (node.format & IS_UNDERLINE) {
    text = (
      <span key={index} style={{ textDecoration: 'underline' }}>
        {text}
      </span>
    );
  }
  if (node.format & IS_CODE) {
    text = <code key={index}>{text}</code>;
  }
  if (node.format & IS_SUBSCRIPT) {
    text = <sub key={index}>{text}</sub>;
  }
  if (node.format & IS_SUPERSCRIPT) {
    text = <sup key={index}>{text}</sup>;
  }
  return text;
}

const handleNodeFormat = (format: ElementFormatType, indent: number): CSSProperties | undefined => {
  let style = {};
  switch (format) {
    case 'left':
      style = { ...style, ...{ textAlign: 'left' } };
      break;
    case 'start':
      style = { ...style, ...{ textAlign: 'start' } };
      break;
    case 'end':
      style = { ...style, ...{ textAlign: 'end' } };
      break;
    case 'center':
      style = { ...style, ...{ textAlign: 'center' } };
      break;
    case 'right':
      style = { ...style, ...{ textAlign: 'right' } };
      break;
    case 'justify':
      style = { ...style, ...{ textAlign: 'justify' } };
      break;
  }
  if (indent > 0) {
    style = { ...style, ...{ paddingInline: `${indent * 40}px` } };
  }
  return style;
};

const handleListItemNode = (node: SerializedListItemNode, index: number, serializedChildren: JSX.Element | null) => {
  if (node.checked != null) {
    return (
      <li
        aria-checked={node.checked ? 'true' : 'false'}
        className={`component--list-item-checkbox ${handleNodeFormat(node.format, node.indent)} ${
          node.checked ? 'component--list-item-checkbox-checked' : 'component--list-item-checked-unchecked'
        }`}
        key={index}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
        role="checkbox"
        tabIndex={-1}
        value={node.value}
      >
        {serializedChildren}
      </li>
    );
  } else {
    return (
      <li key={index} value={node.value} style={handleNodeFormat(node.format, node.indent)}>
        {serializedChildren}
      </li>
    );
  }
};

const handleLinkNode = (node: SerializedLinkNode, index: number, serializedChildren: JSX.Element | null) => {
  const fields: LinkFields = node.fields;

  if (fields.linkType === 'custom') {
    const rel = fields.newTab ? 'noopener noreferrer' : undefined;
    return (
      <Link
        href={escapeHTML(fields.url)}
        key={index}
        style={handleNodeFormat(node.format, node.indent)}
        {...(fields?.newTab
          ? {
              rel: 'noopener noreferrer',
              target: '_blank',
            }
          : {})}
      >
        {serializedChildren}
      </Link>
    );
  }
  return (
    <span key={index} style={handleNodeFormat(node.format, node.indent)}>
      Internal link coming soon
    </span>
  );
};
