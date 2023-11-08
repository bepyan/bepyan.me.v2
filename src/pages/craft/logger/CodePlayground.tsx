import { useEffect } from 'react';

import logger from './logger';

export default function CodePlayground() {
  useEffect(() => {
    logger.log('hello world');
  }, []);

  return <></>;
}
