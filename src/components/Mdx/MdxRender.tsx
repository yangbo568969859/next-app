import type { MDXComponents, MDXContent } from 'mdx/types';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import { Fragment, isValidElement, useRef } from 'react';
import CodeBox from './CodeBox';

type CodeBoxProps = { className?: string; showCopyButton?: string };
const MDXCodeBox: FC<PropsWithChildren<CodeBoxProps>> = ({
  children: code,
  className,
  showCopyButton,
}) => {
  const matches = className?.match(/language-(?<language>.*)/);
  const language = matches?.groups?.language ?? '';

  return (
    <CodeBox
      language={language}
    >
      {code}
    </CodeBox>
  );
};

const htmlComponents = {
  pre: MDXCodeBox,
}

const combinedComponents: MDXComponents = {
  ...htmlComponents
};

export const MDXRenderer: FC<{ Component: MDXContent }> = ({ Component }) => {
  return <Component components={combinedComponents} />
}
