'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import styles from './index.module.css';

const getLogoURL = (theme: string = 'dark') =>
  `https://website-assets.oramasearch.com/orama-when-${theme}.svg`;

export const WithAlgoliaBy = () => {
  const { resolvedTheme } = useTheme();
  const [logoURL, setLogoURL] = useState<string>();

  useEffect(() => {
    setLogoURL(getLogoURL(resolvedTheme));
  }, [resolvedTheme])
  return (
    <div className={styles.poweredBy}>
      <a href="https://www.algolia.com/" target='_blank' rel="noreferer">
        {logoURL && (
          <Image
            src={logoURL}
            alt="Powered by OramaSearch"
            className={styles.poweredByLogo}
            width={80}
            height={20}
          />
        )}
      </a>
    </div>
  )
}