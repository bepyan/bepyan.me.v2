import '~/styles/raycast.scss';

import { Command } from 'cmdk';
import { debounce } from 'es-toolkit';
import React from 'react';

import { pagefindSearch, type PagefindSearchData } from '~/libs/pagefind';

export function PagefindRaycast() {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [resultList, setResultList] = React.useState<PagefindSearchData[]>([]);

  React.useEffect(() => {
    const toggle = () => setOpen((open) => !open);
    document.addEventListener('openSearch', toggle);
    return () => document.removeEventListener('openSearch', toggle);
  }, []);

  React.useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  async function search(value: string) {
    try {
      const searchDataList = await pagefindSearch(value);
      setResultList(searchDataList);
    } catch (e: unknown) {
      console.log(e);
    }
  }

  function navigateToResult(value: PagefindSearchData) {
    const location = new URL(value.url, window.location.toString());
    window.location.href = location.href;
  }

  return (
    <Command.Dialog
      contentClassName="raycast fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
      overlayClassName="fixed inset-0 z-40 bg-page opacity-50"
      open={open}
      onOpenChange={setOpen}
      shouldFilter={false}
    >
      <div cmdk-raycast-top-shine="" />
      <Command.Input
        ref={inputRef}
        placeholder="Search for posts..."
        onValueChange={debounce(search, 150)}
      />
      <hr cmdk-raycast-loader="" />
      <Command.List>
        {resultList.length === 0 && (
          <Command.Empty className="animate-in fade-in">
            No results found.
          </Command.Empty>
        )}
        {resultList.map((result) => {
          return (
            <Command.Item
              key={result.id}
              onSelect={() => navigateToResult(result)}
              className="animate-in fade-in"
            >
              <div>{result.meta.title}</div>
              {/* <div className="pb-2 font-semibold">{result.meta.title}</div> */}
              {/* <div dangerouslySetInnerHTML={{ __html: result.excerpt }} /> */}
            </Command.Item>
          );
        })}
      </Command.List>
      <div cmdk-raycast-footer="" className="relative">
        <button cmdk-raycast-open-trigger="" className="ml-auto">
          Open Page
          <kbd>↵</kbd>
        </button>
      </div>
    </Command.Dialog>
  );
}
