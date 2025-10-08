import React from 'react';

import { serializeLexical } from './Serialize';

const RichText: React.FC<{ content: any }> = ({ content }) => {
  if (!content) {
    return null;
  }

  return (
    <div>
      {content &&
        !Array.isArray(content) &&
        typeof content === 'object' &&
        'root' in content &&
        serializeLexical({ nodes: content?.root?.children })}
    </div>
  );
};

export default RichText;
