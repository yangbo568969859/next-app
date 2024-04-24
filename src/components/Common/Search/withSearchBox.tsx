'use client';
import type { FC } from 'react';
import { useRef, useState } from 'react'
import styles from './index.module.css';
import { useClickOutside } from '@/src/hooks/react-client';

import { WithAlgoliaBy } from './WithAlgoliaBy';
import algoliasearch from 'algoliasearch';
import {
  NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY,
  NEXT_PUBLIC_ALGOLIA_INDEX
} from '@/src/utils/content.constants'

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
    handleSearch(searchTerm, 1);
  }
  console.log(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID)
  const client = algoliasearch(NEXT_PUBLIC_ALGOLIA_APP_ID, NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY)
  const index = client.initIndex(NEXT_PUBLIC_ALGOLIA_INDEX);

  const handleSearch = async (query: any, page: any) => {
    try {
      const res = await index.search(query, { page, hitsPerPage: 10 })
      console.log(res)
    } catch (error) {
      
    }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchFilterModel}></div>
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