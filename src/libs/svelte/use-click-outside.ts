export default function clickOutside(
  node: HTMLElement,
  {
    enabled: initialEnabled,
    callback,
  }: {
    enabled: boolean;
    callback: () => void;
  },
) {
  const handleOutsideClick = (event: MouseEvent) => {
    if (!node.contains(event.target as Node)) {
      callback();
    }
  };

  function update({ enabled }: { enabled: boolean }) {
    if (enabled) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
  }

  update({ enabled: initialEnabled });

  return {
    update,
    destroy() {
      document.removeEventListener('click', handleOutsideClick);
    },
  };
}
