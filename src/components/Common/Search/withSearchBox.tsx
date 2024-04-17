'use client';
import type { FC } from 'react';
import { useRef, useState } from 'react'
import styles from './index.module.css';
import { useClickOutside } from '@/src/hooks/react-client';

import { WithAlgoliaBy } from './WithAlgoliaBy';

type SearchBoxProps = { onClose: () => void };

export const WithSearchBox: FC<SearchBoxProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  // const [searchResults, setSearchResults] = useState<SearchResults>(null);
  // const [selectedFacet, setSelectedFacet] = useState<number>(0);
  // const [searchError, setSearchError] = useState<Nullable<Error>>(null);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  useClickOutside(searchBoxRef, () => {
    onClose();
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('onSubmit');
    e.preventDefault();
    // dosome
    // onClose();
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchModelPanel} ref={searchBoxRef}>
        <div className={styles.searchBoxInputContainer}>
          <form onSubmit={onSubmit}>
            <input
                ref={searchInputRef}
                type="search"
                className={styles.searchBoxInput}
                onChange={event => setSearchTerm(event.target.value)}
                value={searchTerm}
              />
          </form>
        </div>

        <div className={styles.fulltextSearchSections}></div>

        <div className={styles.fulltextResultsContainer}></div>

        <div className={styles.fulltextSearchFooter}>
          <WithAlgoliaBy />
        </div>
      </div>
    </div>
  )
}