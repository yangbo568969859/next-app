'use client';

import type { FC } from 'react';

type SearchBoxProps = { onClose: () => void };

export const WithSearchBox: FC<SearchBoxProps> = ({ onClose }) => {
  return (
    <div>
      WithSearchBox
    </div>
  )
}