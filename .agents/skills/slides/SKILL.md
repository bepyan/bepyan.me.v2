---
name: slides
description: 이 저장소의 발표 장표(src/pages/slides/<slug>)를 새로 만들거나 장을 추가·수정할 때 사용한다. 이 저장소에서는 frontend-slides 대신 이 스킬을 쓴다.
---

# 장표

장표는 Astro 페이지 하나이고, 장(`section.slide`)이 화면 높이만큼 쌓여 scroll-snap으로 넘어간다. 고정 스테이지(1920×1080 배율 조정)가 아니라 `vw`·`clamp` 기반 유동 레이아웃이라 같은 마크업이 데스크톱과 모바일에서 다르게 흐른다.

## 작업 순서

1. **장표 준비**: 새 장표라면 `src/pages/slides/<slug>/`에 `index.astro`와 `_meta.ts`를 만든다([장표 구조](#장표-구조)). 완료 조건: `bun dev`에서 `/slides/<slug>`가 열리고 `/slides` 목록에 장표가 보인다.
2. **밀도 결정**: [밀도 모드](#밀도-모드) 중 하나를 고른다. 사용자가 정하지 않았으면 발표 상황을 묻는다. 완료 조건: 모드 하나가 정해졌다.
3. **장 작성**: [references/layouts.md](references/layouts.md)를 읽고 장마다 공용 레이아웃을 고른다. 맞는 레이아웃이 없을 때만 장표 전용 클래스를 만든다. 등장 애니메이션을 넣을 때는 [references/animation.md](references/animation.md)를 읽는다. 완료 조건: 모든 장이 공용 레이아웃이나 장표 `<style is:global>`에 정의한 클래스만 쓴다.
4. **검증**: [검증](#검증)의 항목을 모두 통과한다.

## 장표 구조

| 파일             | 라우팅 | 역할                                           |
| ---------------- | ------ | ---------------------------------------------- |
| `index.astro`    | 됨     | 장표 본문                                      |
| `_meta.ts`       | 안 됨  | `SlideMeta` default export. 목록과 head에 쓰임 |
| `_draft.md`      | 안 됨  | 장 구성 초안                                   |
| `_script.md`     | 안 됨  | 발표 대본. 장 번호는 `#N`으로 적는다           |
| 그 밖의 `.astro` | 됨     | 실습 자료처럼 장표에 딸린 별도 페이지          |

`_`로 시작하는 파일은 Astro가 라우팅하지 않는다.

```ts
// _meta.ts
import type { SlideMeta } from '~/libs/slides';

export default {
  title: '장표 제목',
  date: new Date('2026-10-01'),
  event: '행사명', // 선택
  description: '한 줄 설명', // 선택
} satisfies SlideMeta;
```

```astro
---
// index.astro
import SlideLayout from '~/layouts/slide-layout.astro';

import meta from './_meta';
---

<SlideLayout {meta}>
  <section class="slide">
    <h1>{meta.title}</h1>
  </section>
</SlideLayout>

<style is:global>
  .deck {
    --slide-accent: #2f6fed;
  }

  .dark .deck {
    --slide-accent: #7aa7ff;
  }
</style>
```

### 장 마크업 규칙

- `<section class="slide">`를 `SlideLayout`의 직계 자식으로, 소스에 그대로 쓴다. `{items.map(...)}`이나 컴포넌트로 장을 만들지 않는다. 장 번호, `.reveal`, 한눈에 보기, 편집 모드가 모두 `.deck > .slide`를 장으로 센다.
- 글자는 가능한 한 마크업에 직접 쓴다. `{}` 표현식으로 넣은 글자는 편집 모드에서 고칠 수 없다.
- 장표 전용 클래스는 `<style is:global>`에 `.deck .<name>` 선택자로 정의한다.

### 토큰

`src/styles/slides.css` 맨 위의 `--slide-*` 변수를 장표 `<style is:global>`에서 `.deck`와 `.dark .deck`에 덮어쓴다. 다크 모드 값을 함께 정한다.

### 이미지

`public/img/<slug>/`에 PNG로 넣고 `bun run img:avif`로 AVIF로 바꾼다. 변환 후 PNG는 지워지고, 스크립트는 MDX 참조만 고치므로 `index.astro`에는 처음부터 `.avif` 경로를 쓴다. 마크업은 [layouts.md의 figure](references/layouts.md#figure)를 따른다.

## 밀도 모드

| 모드               | 쓰는 경우                     | 장 구성                                                      |
| ------------------ | ----------------------------- | ------------------------------------------------------------ |
| 낮음 (발표자 중심) | 강연, 특강처럼 말로 설명할 때 | 장당 메시지 하나, 목록 1~3개, statement·chapter 장을 자주 씀 |
| 높음 (읽기 중심)   | 배포 자료, 비동기 리뷰        | 장만 읽어도 이해되게. defs·cells·data-table, 목록 4~8개      |

섞인 상황이면 가까운 쪽 하나를 고른다. 청중 앞 발표는 낮음, 나중에 읽힐 자료는 높음이 기본이다. 어느 모드든 장이 넘치면 글자를 줄이지 말고 장을 나눈다.

## 장 안의 동작

- 단축키: `← →`·Space 이동, `F` 전체화면, `T` 테마, `Q` QR, `O` 한눈에 보기. 우클릭이나 여백 더블 탭으로 메뉴를 연다.
- 한눈에 보기는 각 장을 복제해 실제 뷰포트 크기로 그린 뒤 줄인다. `vw`·`dvh`로 잡은 크기는 썸네일에서도 같은 비율로 보인다. 복제본에서는 `id`가 지워지고 `.reveal`은 처음부터 보인다.
- 편집 모드(`E`, `bun dev`에서만): 제목·문단·목록 항목 같은 글자를 눌러 고치면 `index.astro`에 저장되고 같은 장으로 다시 불러온다. 표현식이나 컴포넌트로 만든 글자, `<kbd>`·`<code>` 같은 인라인 태그를 지우거나 합치는 수정은 거부된다. 구조를 바꾸려면 소스를 직접 고친다.

## 검증

1. `bun dev`로 장표를 열고, 고친 장을 1280×720과 390×844에서 라이트·다크 모드로 스크린샷을 찍어 확인한다. 글자 겹침, 잘림, 패널 겹침은 스크린샷으로만 보인다.
2. 브라우저 콘솔에서 넘치는 장을 찾는다. 결과가 `[]`이어야 한다. 두 뷰포트에서 모두 실행한다.

   ```js
   [...document.querySelectorAll('.deck > .slide')].flatMap((slide, i) => {
     const box = slide.getBoundingClientRect();
     const isOut = [...slide.querySelectorAll('*')].some((el) => {
       if (el.closest('.code')) return false; // 가로 스크롤하는 코드 블록은 제외
       const r = el.getBoundingClientRect();
       return r.width && (r.bottom > box.bottom + 1 || r.right > box.right + 1);
     });
     return slide.scrollHeight > slide.clientHeight + 1 || isOut ? [i + 1] : [];
   });
   ```

3. 넘치는 장은 내용을 다른 장으로 나눈다. 글자 크기나 여백을 줄여 맞추지 않는다.
4. `bun run check`와 `bun run build`가 통과한다.
