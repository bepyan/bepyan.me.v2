<script lang="ts">
  import Dropdown, { type DropdownItem } from '~/components/ui/dropdown.svelte';
  import { getDefaultPathname, languages, useI18n } from '~/libs/i18n';

  interface Props {
    url: URL;
    align?: 'start' | 'end';
  }

  let { url, align = 'start' }: Props = $props();

  const { lang, p } = useI18n(url);
  const pathname = getDefaultPathname(url);

  const languageItems = Object.entries(languages).map(([value, label]) => ({
    label,
    value,
    href: p(pathname, value),
  }));

  let selectedValue = $derived(lang);

  function handleLanguageSelect(
    event: CustomEvent<{ item: DropdownItem }>,
  ): void {
    const { item } = event.detail;

    window.location.href = p(pathname, item.value);
  }
</script>

<Dropdown
  items={languageItems}
  {align}
  {selectedValue}
  on:select={handleLanguageSelect}
>
  {#snippet button()}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      class="h-5 w-5"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="m10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138A47.63 47.63 0 0 1 15 5.621m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
      />
    </svg>
    <span class="sr-only">select language</span>
  {/snippet}
</Dropdown>
