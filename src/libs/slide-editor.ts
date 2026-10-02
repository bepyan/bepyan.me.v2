import '~/styles/slide-editor.css';

/**
 * dev 전용 슬라이드 편집 모드. 고친 글자는 plugins/slide-editor.ts가 소스에 저장한다.
 * slide-layout.astro가 import.meta.env.DEV 분기에서만 import해 prod 번들에 들어가지 않는다.
 */

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

// 서버의 normalizeText와 같은 규칙이어야 한다.
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

// 인라인 태그를 지우거나 합치면 소스와 1:1 대응이 깨지므로 구조를 비교한다.
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

  // 바깥 편집 대상만 고른다. li 안의 p처럼 겹치면 바깥 하나로 묶는다.
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

  // 표현식으로 만든 글자는 입력하기 전에 미리 거부한다.
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

    // 저장되면 dev 서버가 페이지를 다시 불러온다.
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

  // Enter와 Esc는 줄바꿈·취소 대신 편집을 끝낸다. 한글 조합 중 Enter는 조합 확정이라 건드리지 않는다.
  const onKeyDown = (e: KeyboardEvent) => {
    const el = e.target as HTMLElement;
    if (!el.isContentEditable) return;
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
    // 저장 후 페이지를 다시 불러와도 편집 모드를 이어 간다.
    if (next) sessionStorage.setItem(STORAGE_KEY, '1');
    else sessionStorage.removeItem(STORAGE_KEY);
  };

  deck.addEventListener('focusin', onFocusIn);
  deck.addEventListener('focusout', onFocusOut);
  deck.addEventListener('keydown', onKeyDown);

  if (sessionStorage.getItem(STORAGE_KEY)) setActive(true);

  // 편집 중이던 요소를 먼저 blur해 고친 내용을 저장한다.
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
