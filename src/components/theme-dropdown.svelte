<script>
  import { THEME_MAP, theme$ } from '~/libs/stores/theme';
  import { cn } from '~/libs/utils';

  let isDropdownOpen = false;

  const handleDropdownClick = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }) => {
    if (
      relatedTarget instanceof HTMLElement &&
      currentTarget.contains(relatedTarget)
    ) {
      return;
    }

    isDropdownOpen = false;
  };

  const handleItemClick = (theme) => {
    $theme$ = theme;
    isDropdownOpen = false;
  };
</script>

<div
  class="font-sans font-normal relative text-sm text-heading"
  on:focusout={handleDropdownFocusLoss}
>
  <button
    class="h-9 w-16 rounded-md capitalize font-medium transition-color focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-200 hover:bg-selection hover:text-gray-900"
    on:click={handleDropdownClick}
  >
    {THEME_MAP[$theme$] ?? 'system'}
  </button>
  <div
    class={cn(
      'z-50 absolute top-full mt-1 flex flex-col min-w-[8rem] overflow-hidden rounded-md border bg-page p-1 shadow-md',
      !isDropdownOpen && 'invisible',
    )}
  >
    {#each Object.keys(THEME_MAP) as themeKey}
      <button
        class={cn(
          'w-full text-left capitalize px-2 py-1.5 rounded-sm hover:bg-selection',
          $theme$ === THEME_MAP[themeKey] && 'underline font-medium',
        )}
        on:click={() => handleItemClick(THEME_MAP[themeKey])}
      >
        {themeKey}
      </button>
    {/each}
  </div>
</div>
