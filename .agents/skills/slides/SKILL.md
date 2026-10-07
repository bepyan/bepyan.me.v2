---
name: slides
description: 이 저장소의 발표 자료(src/pages/slides/<slug>)를 새로 만들거나 장표를 추가·수정할 때 사용한다. 이 저장소에서는 frontend-slides 대신 이 스킬을 쓴다.
---

# 발표 자료 만들기

발표 자료는 Astro 페이지 하나이고, 장표(`section.slide`)가 화면 높이만큼 쌓여 scroll-snap으로 넘어간다. `vw`·`clamp` 기반 유동 레이아웃이라 같은 마크업이 데스크톱과 모바일에서 다르게 흐른다.

## 작업 순서

1. **발표 자료 준비**: 새 발표 자료라면 `src/pages/slides/<slug>/`에 `index.astro`와 `_meta.ts`를 만든다([파일 구조](#파일-구조)). 완료 조건: `bun dev`에서 `/slides/<slug>`가 열리고 `/slides` 목록에 발표 자료가 보인다.
2. **초안**: 발표 내용이 아직 정해지지 않았으면 [references/draft.md](references/draft.md)를 읽고 사용자와 `_draft.md`를 다듬는다. 내용이 이미 정해졌으면 건너뛴다. 완료 조건: `_draft.md`에 TODO가 없거나, 남은 TODO를 사용자가 미뤄도 된다고 했다.
3. **장표 작성**: [밀도](#밀도)에 맞춰 쓴다. [references/layouts.md](references/layouts.md)를 읽고 장표마다 공용 레이아웃을 고른다. 맞는 레이아웃이 없을 때만 발표 자료 전용 클래스를 만든다. 등장 애니메이션을 넣을 때는 [references/animation.md](references/animation.md)를 읽는다. 완료 조건: 모든 장표가 공용 레이아웃이나 발표 자료 `<style is:global>`에 정의한 클래스만 쓴다.
4. **검증**: [검증](#검증)의 항목을 모두 통과한다.

## 파일 구조

- `index.astro` (필수): 발표 자료 본문
- `_meta.ts` (필수): 발표 자료 메타데이터
- `_draft.md`: 초안
- `_script.md`: 발표 대본
- 그 밖의 `.astro`: 발표 자료에 딸린 별도 페이지

```ts
// _meta.ts
import type { SlideMeta } from '~/libs/slides';

export default {
  title: '발표 자료 제목',
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
```

### 장표 마크업 규칙

- `<section class="slide">`를 `SlideLayout`의 직계 자식으로, 소스에 그대로 쓴다. 장표 번호, `.reveal`, 한눈에 보기, 편집 모드가 모두 `.deck > .slide`를 장표로 센다.
- 글자는 가능한 한 마크업에 직접 쓴다. `{}` 표현식으로 넣은 글자는 편집 모드에서 고칠 수 없다.
- 발표 자료 전용 클래스는 `<style is:global>`에 `.deck .<name>` 선택자로 정의한다.

### 토큰

`src/styles/slides.css` 맨 위의 `--slide-*` 변수가 기본값이고, 블로그 테마를 따른다. 발표 자료마다 바꾸려면 `index.astro`의 `<style is:global>`에서 `.deck`와 `.dark .deck`에 덮어쓴다. 다크 모드 값을 함께 정한다.

```astro
<style is:global>
  .deck {
    --slide-accent: #2f6fed;
  }

  .dark .deck {
    --slide-accent: #7aa7ff;
  }
</style>
```

### 이미지

이미지는 `public/img/<slug>/`에 보관한다.
마크업은 [layouts.md의 figure](references/layouts.md#figure) 가이드를 따른다.

리소스 효율화를 위해 기본적으로 AVIF 포맷의 파일을 사용한다.
`bun run img:avif` 명령어를 통해 PNG 파일을 AVIF로 변환할 수 있다.

## 밀도

기본은 낮은 밀도다. 장표당 메시지 하나, 목록 1~3개로 쓰고 statement·chapter 장표를 자주 쓴다.

사용자가 배포용이나 읽기 중심 자료를 요청하면 높은 밀도로 쓴다. 장표만 읽어도 이해되게 defs·cells·data-table을 쓰고 목록은 4~8개까지 둔다.

## 검증

1. `bun dev`로 발표 자료를 열고, 고친 장표를 1280×720과 390×844에서 라이트·다크 모드로 스크린샷을 찍어 확인한다. 글자 겹침, 잘림, 패널 겹침은 스크린샷으로만 보인다.
2. 브라우저 콘솔에서 넘치는 장표를 찾는다. 결과가 `[]`이어야 한다. 두 뷰포트에서 모두 실행한다.

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

3. 넘치는 장표가 있으면 장표 번호, 뷰포트, 넘친 요소를 사용자에게 보고한다.
4. `bun run check`와 `bun run build`가 통과한다.
