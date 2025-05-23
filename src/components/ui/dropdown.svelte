<script lang="ts" module>
  export interface DropdownItem {
    label: string;
    value: string;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { buttonVariants } from '~/components/ui/button';
  import clickOutside from '~/libs/svelte/use-click-outside';
  import { cn } from '~/libs/utils';

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

  function dropdownTransition(_node: HTMLElement) {
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
    aria-label="trigger dropdown"
    onclick={toggleDropdown}
  >
    {#if button}
      {@render button()}
    {:else if selectedItem}
      {selectedItem.label}
    {:else}
      Select
    {/if}
  </button>
  {#if isOpen}
    <div
      class={cn(
        'bg-page absolute top-full z-50 mt-1 flex min-w-[8rem] flex-col overflow-hidden rounded-md border p-1 shadow-md',
        align === 'end' ? 'right-0' : 'left-0',
        menuClass,
      )}
      transition:dropdownTransition
    >
      {#each items as item (item.value)}
        <button
          class="text-heading hover:bg-selection inline-flex w-full items-center justify-between rounded-xs px-2 py-1.5 text-left text-sm capitalize"
          onclick={() => selectItem(item)}
        >
          {item.label}
          {#if selectedItem === item}
            <!-- dot icon -->
            <svg
              height="1em"
              viewBox="0 0 256 256"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M156 128a28 28 0 1 1-28-28a28 28 0 0 1 28 28Z"
                fill="currentColor"
              />
            </svg>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
