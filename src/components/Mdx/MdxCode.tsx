// import React from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// const MdxCode = ({ className, children }) => {
//   const language = className?.replace(/language-/, '');
//   console.log('language', language);
//   return (
//     <SyntaxHighlighter language={language} style={atomDark}>
//       {children}
//     </SyntaxHighlighter>
//   );
// }

// export default MdxCode;

import React from 'react';
import { getHighlighter } from 'shiki';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const MdxCode = async ({ className, children }) => {
  const language = className?.replace(/language-/, '');
  const highlighter = await getHighlighter({
    theme: 'nord',
  });

  const code = Array.isArray(children) ? children.join('') : children;
  console.log(code)
  const html = highlighter.codeToHtml(code, language);
  return (
    <div className='dangerouslySetInnerHTML' dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export default MdxCode;