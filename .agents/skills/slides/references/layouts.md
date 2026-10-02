# 공용 레이아웃

`src/styles/slides.css`의 `/* ---- layouts ---- */` 구간에 정의되어 있다. 실제 모양은 `/slides/hello-slides` 갤러리에서 장마다 하나씩 볼 수 있다.

장 안의 요소는 `.slide`의 `gap`(1.5rem)으로 세로 간격이 잡힌다. 요소마다 margin을 따로 주지 않는다.

## 기본 장: eyebrow · ul · source

언제: 제목 하나와 설명 목록. 대부분의 장.
밀도: 낮음은 목록 1~3개, 높음은 4~8개.

```html
<section class="slide">
  <small class="eyebrow">2. 맥락 관리</small>
  <h2>제목</h2>
  <ul>
    <li>항목</li>
  </ul>
  <small class="source"
    ><a href="https://example.com" target="_blank" rel="noopener noreferrer"
      >example.com</a
    ></small
  >
</section>
```

- `eyebrow`는 장이 속한 장(章)이나 맥락을 적는다.
- `source`는 왼쪽 아래에 고정되고, 오른쪽 아래 페이지 번호와 겹치지 않게 비워 둔다. 출처가 여럿이면 `·`로 잇는다.

## chapter

언제: 큰 구간이 시작될 때. 제목을 1.2배로 키운다.

```html
<section class="slide chapter">
  <small class="eyebrow">확률 높이기</small>
  <h1>1. 작업 지침</h1>
</section>
```

## end

언제: 마지막 장, Q&A. 내용을 가로 가운데로 모은다.

```html
<section class="slide end">
  <h1>Q&A</h1>
</section>
```

## ol.chips

언제: 순서 없는 구성 요소나 키워드를 가로로 나열. 4~6개.

```html
<ol class="chips">
  <li>F 전체화면</li>
  <li>T 테마</li>
</ol>
```

## ol.chips.flow

언제: 단계, 파이프라인, 타임라인. 항목 사이에 `→`가 붙고 고정폭 글꼴로 바뀐다. 3~5개.

```html
<ol class="chips flow">
  <li>초안</li>
  <li>검증</li>
  <li>발표</li>
</ol>
```

## dl.defs

언제: 용어와 설명을 한 줄씩. 이름 열 너비는 가장 긴 이름에 맞춰진다.
밀도: 3~6줄. 설명이 두 줄을 넘으면 `cells`를 쓴다.

```html
<dl class="defs">
  <dt>장표</dt>
  <dd>발표 하나를 이루는 장의 묶음</dd>
</dl>
```

## dl.cells

언제: 사례나 항목을 카드로 나란히. 너비에 따라 열 수가 바뀐다(최소 18rem).
밀도: 2~4칸. 1280×720에서 한 줄에 3칸이 들어가므로 4칸이면 두 줄이 된다.

```html
<dl class="cells">
  <div>
    <dt>사례 · 토스</dt>
    <dd>설명</dd>
  </div>
</dl>
```

- `<dt>`가 작은 라벨, `<dd>`가 본문이다. `<div>`로 한 칸을 묶는다.

## table.data-table

언제: 행마다 여러 속성을 비교. 행 머리글(`tbody th`)은 고정폭 글꼴로, 그 안의 `<small>`은 아래 줄 설명으로 표시된다.
밀도: 3~5행, 2~3열. 모바일에서 열이 좁아지므로 셀 글자를 짧게 쓴다.

```html
<table class="data-table">
  <thead>
    <tr>
      <th>패턴</th>
      <th>예시</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>체이닝<small>앞 단계 결과가 다음 입력</small></th>
      <td>설명</td>
    </tr>
  </tbody>
</table>
```

- `<thead>`와 `<tbody>`를 생략하지 않는다. 브라우저가 `<tbody>`를 끼워 넣으면 편집 모드가 요소 위치를 찾지 못한다.
- 셀 안의 `<strong>`은 제목 색으로 강조된다.

## figure

언제: 스크린샷, 도표 이미지. `--ratio`(너비 / 높이)로 높이 상한(`--figure-max-height`, 기본 42dvh)을 너비로 바꿔 장을 넘지 않게 한다.

```html
<img
  class="figure"
  style="--ratio: 2000 / 1343"
  src="/img/<slug>/name.avif"
  alt="무엇을 보여 주는지"
  width="2000"
  height="1343"
  loading="lazy"
/>
```

- 세로로 긴 이미지는 `class="figure portrait"`(높이 상한 60dvh).
- 상한을 바꾸려면 `style`에 `--figure-max-height: 56dvh`를 더한다.
- 배경이 흰색으로 깔리므로 투명 PNG도 다크 모드에서 읽힌다.

## split

언제: 글과 이미지를 좌우로. 900px 이하에서는 위아래로 쌓인다.

```html
<div class="split">
  <div class="split-text">
    <p>설명</p>
    <ul>
      <li>항목</li>
    </ul>
  </div>
  <img class="figure" ... />
</div>
```

### 비교 2단

`split` 안에 `split-text`를 두 개 둔다. 각 단의 제목은 `<h3>`.

```html
<div class="split">
  <div class="split-text">
    <h3>A</h3>
    <p>설명</p>
  </div>
  <div class="split-text">
    <h3>B</h3>
    <p>설명</p>
  </div>
</div>
```

## pre.code

언제: 명령어, 짧은 코드. 한두 줄.

```html
<pre class="code"><code>"strawberry".count("r")  # 3</code></pre>
```

### pre.code.tree

언제: 폴더 구조, 들여쓰기가 의미 있는 텍스트. 좁은 화면에서 줄바꿈 대신 가로 스크롤된다. 10줄을 넘으면 `.dense`를 더한다.

```astro
<pre class="code tree"><code>{`src/
├── index.astro   # 설명
└── _meta.ts`}</code></pre>
```

- 템플릿 리터럴(`{`...`}`)로 감싸야 공백과 `<`가 보존된다. 그래서 편집 모드에서는 고칠 수 없다.

## blockquote.statement

언제: 한 문장을 크게 보여 주는 장. 낮은 밀도에서 구간을 정리하거나 핵심 메시지를 강조할 때.

```html
<section class="slide">
  <small class="eyebrow">정리</small>
  <blockquote class="statement">
    <p>한 장에는 하나의 메시지만 담는다.</p>
  </blockquote>
</section>
```

- 인용이면 출처를 `.source`로 단다.

## dl.stats

언제: 숫자 2~4개를 크게. 이름은 위에 작게, 숫자는 제목 크기로 표시된다.

```html
<dl class="stats">
  <div>
    <dt>응답 시간</dt>
    <dd>120ms</dd>
  </div>
</dl>
```

- 숫자에 단위를 붙여 짧게 쓴다. 모바일에서는 한 열로 쌓인다.
