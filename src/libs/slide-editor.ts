import '~/styles/slide-editor.css';

const ENDPOINT = '/__slides/edit';
const EDITABLE = 'h1,h2,h3,p,li,dt,dd,th,td,small,blockquote,figcaption';
const STORAGE_KEY = 'slides:edit-mode';
const TOAST_MS = 2500;

interface Snapshot {
  html: string;
  structure: string;
  runs: string[];
}

type EditRequest = {
  page: string;
  total: number;
  slide: number;
  path: number[];
  prev: string[];
  next: string[];
  dryRun?: boolean;
};

const normalizeText = (text: string) => text.replace(/\s+/g, ' ').trim();

const getTextRuns = (el: HTMLElement) => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const runs: string[] = [];
  while (walker.nextNode()) {
    const text = normalizeText(walker.currentNode.textContent ?? '');
    if (text) runs.push(text);
  }
  return runs;
};

const getStructure = (el: HTMLElement) =>
  [...el.querySelectorAll('*')].map((child) => child.tagName).join(',');

const takeSnapshot = (el: HTMLElement): Snapshot => ({
  html: el.innerHTML,
  structure: getStructure(el),
  runs: getTextRuns(el),
});

export const createSlideEditor = (
  deck: HTMLElement,
  slides: HTMLElement[],
): { toggle: () => void; exit: () => void } => {
  const page = location.pathname.split('/').filter(Boolean)[1];
  const label = deck.querySelector('[data-action="edit"] [data-label]');

  const toast = document.createElement('output');
  toast.className = 'slide-editor-toast';
  toast.role = 'status';
  deck.append(toast);
  let toastTimer: ReturnType<typeof setTimeout> | undefined;

  const showToast = (message: string) => {
    toast.textContent = message;
    toast.dataset.visible = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => delete toast.dataset.visible, TOAST_MS);
  };

  const getTargets = () =>
    slides.flatMap((slide) =>
      [...slide.querySelectorAll<HTMLElement>(EDITABLE)].filter(
        (el) =>
          !el.parentElement!.closest(EDITABLE) && getTextRuns(el).length > 0,
      ),
    );

  const getLocation = (el: HTMLElement) => {
    const slide = el.closest<HTMLElement>('.slide')!;
    const path: number[] = [];
    for (let node = el; node !== slide; node = node.parentElement!) {
      path.unshift([...node.parentElement!.children].indexOf(node));
    }
    return { page, total: slides.length, slide: slides.indexOf(slide), path };
  };

  const request = async (
    body: EditRequest,
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return await res.json();
    } catch {
      return { ok: false, error: 'dev 서버에 연결하지 못했습니다.' };
    }
  };

  const snapshots = new WeakMap<HTMLElement, Snapshot>();

  const lock = (el: HTMLElement, snapshot: Snapshot, message: string) => {
    el.innerHTML = snapshot.html;
    el.removeAttribute('contenteditable');
    el.dataset.editLocked = '';
    el.blur();
    showToast(message);
  };

  const onFocusIn = async (e: FocusEvent) => {
    const el = e.target as HTMLElement;
    if (!el.isContentEditable || snapshots.has(el)) return;
    const snapshot = takeSnapshot(el);
    snapshots.set(el, snapshot);
    const result = await request({
      ...getLocation(el),
      prev: snapshot.runs,
      next: snapshot.runs,
      dryRun: true,
    });
    if (!result.ok) lock(el, snapshot, result.error!);
  };

  const onFocusOut = async (e: FocusEvent) => {
    const el = e.target as HTMLElement;
    const snapshot = snapshots.get(el);
    if (!snapshot) return;
    snapshots.delete(el);
    if (!el.isContentEditable) return;

    const runs = getTextRuns(el);
    if (
      getStructure(el) !== snapshot.structure ||
      runs.length !== snapshot.runs.length
    ) {
      el.innerHTML = snapshot.html;
      showToast('글자만 고칠 수 있어 되돌렸습니다.');
      return;
    }
    if (runs.every((run, i) => run === snapshot.runs[i])) return;

    const result = await request({
      ...getLocation(el),
      prev: snapshot.runs,
      next: runs,
    });
    if (result.ok) {
      showToast('저장했습니다.');
    } else {
      el.innerHTML = snapshot.html;
      showToast(result.error!);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const el = e.target as HTMLElement;
    if (!el.isContentEditable) return;
    // 한글 조합 중 Enter는 조합 확정이라 건드리지 않는다.
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key !== 'Enter' && e.key !== 'Escape') return;
    e.preventDefault();
    el.blur();
  };

  let isActive = false;

  const setActive = (next: boolean) => {
    isActive = next;
    deck.toggleAttribute('data-editing', next);
    if (label) label.textContent = next ? '편집 모드 종료' : '편집 모드';
    getTargets().forEach((el) => {
      if (next && !('editLocked' in el.dataset)) {
        el.contentEditable = 'plaintext-only';
      } else {
        el.removeAttribute('contenteditable');
      }
    });
    if (next) sessionStorage.setItem(STORAGE_KEY, '1');
    else sessionStorage.removeItem(STORAGE_KEY);
  };

  deck.addEventListener('focusin', onFocusIn);
  deck.addEventListener('focusout', onFocusOut);
  deck.addEventListener('keydown', onKeyDown);

  if (sessionStorage.getItem(STORAGE_KEY)) setActive(true);

  const toggle = () => {
    (document.activeElement as HTMLElement | null)?.blur();
    setActive(!isActive);
    showToast(
      isActive ? '편집 모드: 글자를 눌러 고칩니다.' : '편집 모드를 껐습니다.',
    );
  };

  return {
    toggle,
    exit: () => {
      if (isActive) toggle();
    },
  };
};
