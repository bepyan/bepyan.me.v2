# 등장 애니메이션: .reveal

장이 현재 장(`data-current`)이 되면 `.reveal` 요소가 아래에서 올라오며 나타난다. `--i`에 순서를 주면 0.1초씩 늦게 나온다.

```html
<ul>
  <li class="reveal" style="--i: 1">첫째</li>
  <li class="reveal" style="--i: 2">둘째</li>
  <li class="reveal" style="--i: 3">셋째</li>
</ul>
```

- 인쇄(PDF), 동작 줄이기 설정, 한눈에 보기 썸네일에서는 처음부터 다 보인다. 규칙이 `@media screen and (prefers-reduced-motion: no-preference)` 안의 `.deck > .slide` 선택자에만 걸려 있기 때문이다.
- 발표자가 말하면서 하나씩 짚을 목록에만 쓴다. 장마다 쓰면 넘길 때마다 기다리게 된다.
- 클릭으로 하나씩 여는 단계(fragment)는 없다. 현재 장이 되는 순간 모두 순서대로 나온다.
- 다른 효과가 필요하면 장표 `<style is:global>`에 같은 미디어 쿼리와 `.deck > .slide:not([data-current]) .<name>` 선택자로 만든다. 업무 보고처럼 차분한 장표는 0.2~0.3초로 짧게 둔다.
