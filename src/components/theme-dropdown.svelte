<script lang="ts">
  import { THEME_MAP, themeStore, type ThemeValue } from '~/libs/stores/theme';
  import Dropdown from './ui/dropdown.svelte';
  import type { DropdownItem } from './ui/dropdown.svelte';

  interface Props {
    align?: 'start' | 'end';
  }

  let { align = 'start' }: Props = $props();

  type Theme = keyof typeof THEME_MAP;

  const themeItems: DropdownItem[] = Object.entries(THEME_MAP).map(
    ([key, value]) => ({
      label: key,
      value: value as Theme,
    }),
  );

  function handleThemeSelect(event: CustomEvent<{ item: DropdownItem }>): void {
    const { item } = event.detail;
    $themeStore = item.value as ThemeValue;
  }
</script>

<Dropdown
  {align}
  items={themeItems}
  selectedValue={$themeStore}
  on:select={handleThemeSelect}
>
  {#snippet button()}
    <!-- sun icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    >
      <g fill="currentColor">
        <path d="M17 12a5 5 0 1 1-10 0a5 5 0 0 1 10 0Z" />
        <path
          fill-rule="evenodd"
          d="M12 1.25a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75ZM3.669 3.716a.75.75 0 0 1 1.06-.047L6.95 5.7a.75.75 0 1 1-1.012 1.107L3.716 4.776a.75.75 0 0 1-.047-1.06Zm16.662 0a.75.75 0 0 1-.047 1.06l-2.222 2.031A.75.75 0 0 1 17.05 5.7l2.222-2.031a.75.75 0 0 1 1.06.047ZM1.25 12a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75Zm18 0a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75Zm-2.224 5.025a.75.75 0 0 1 1.06 0l2.222 2.223a.75.75 0 0 1-1.06 1.06l-2.223-2.222a.75.75 0 0 1 0-1.06Zm-10.051 0a.75.75 0 0 1 0 1.061l-2.223 2.222a.75.75 0 0 1-1.06-1.06l2.222-2.223a.75.75 0 0 1 1.06 0ZM12 19.25a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Z"
          clip-rule="evenodd"
        />
      </g>
    </svg>
    <!-- moon icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    >
      <g fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M22 12c0 5.523-4.477 10-10 10a9.986 9.986 0 0 1-3.321-.564A8.973 8.973 0 0 1 8 18a8.97 8.97 0 0 1 2.138-5.824A6.493 6.493 0 0 0 15.5 15a6.496 6.496 0 0 0 5.567-3.143c.24-.396.933-.32.933.143Z"
          clip-rule="evenodd"
          opacity=".5"
        />
        <path
          d="M2 12c0 4.359 2.789 8.066 6.679 9.435A8.973 8.973 0 0 1 8 18c0-2.221.805-4.255 2.138-5.824A6.47 6.47 0 0 1 9 8.5a6.496 6.496 0 0 1 3.143-5.567C12.54 2.693 12.463 2 12 2C6.477 2 2 6.477 2 12Z"
        />
      </g>
    </svg>
  {/snippet}
</Dropdown>
