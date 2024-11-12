<script lang="ts" module>
  export interface DropdownItem {
    label: string;
    value: string;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { cn } from '~/libs/utils';
  import { buttonVariants } from '~/components/ui/button';
  import clickOutside from '~/libs/svelte/use-click-outside';

  interface Props {
    items?: DropdownItem[];
    selectedValue?: string | null;
    buttonClass?: string;
    menuClass?: string;
    align?: 'start' | 'end';
    button?: import('svelte').Snippet;
  }

  let {
    items = [],
    selectedValue = $bindable(null),
    buttonClass = '',
    menuClass = '',
    align = 'start',
    button,
  }: Props = $props();

  let isOpen: boolean = $state(false);
  const dispatch = createEventDispatcher<{ select: { item: DropdownItem } }>();

  let selectedItem = $derived(
    items.find(
      (item) =>
        item.value === selectedValue ||
        (selectedValue === null && item.value === undefined),
    ) ?? null,
  );

  function toggleDropdown(): void {
    isOpen = !isOpen;
  }

  function selectItem(item: DropdownItem): void {
    selectedValue = item.value;
    isOpen = false;
    dispatch('select', { item });
  }

  function dropdownTransition(node: HTMLElement) {
    return {
      delay: 0,
      duration: 100,
      css: (t: number, u: number) => `
          opacity: ${t};
          transform: scale(${0.95 + 0.05 * t}) translateY(-${2 * u}px);
        `,
    };
  }
</script>

<div
  class="relative font-sans"
  use:clickOutside={{ enabled: isOpen, callback: () => (isOpen = false) }}
>
  <button
    class={cn(
      buttonVariants({
        variant: 'ghost',
        size: 'icon',
        className: buttonClass,
      }),
    )}
    onclick={toggleDropdown}
  >
    {#if button}{@render button()}{:else}{selectedItem
        ? selectedItem.label
        : 'Select'}{/if}
  </button>
  {#if isOpen}
    <div
      transition:dropdownTransition
      class={cn(
        'absolute top-full z-50 mt-1 flex min-w-[8rem] flex-col overflow-hidden rounded-md border bg-page p-1 shadow-md',
        align === 'end' ? 'right-0' : 'left-0',
        menuClass,
      )}
    >
      {#each items as item}
        <button
          class="inline-flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm capitalize text-heading hover:bg-selection"
          onclick={() => selectItem(item)}
        >
          {item.label}
          {#if selectedItem === item}
            <!-- dot icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 256 256"
            >
              <path
                fill="currentColor"
                d="M156 128a28 28 0 1 1-28-28a28 28 0 0 1 28 28Z"
              />
            </svg>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
