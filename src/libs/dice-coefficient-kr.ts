// @see https://github.com/jaeleeps/kor-string-similarity

const HANGUL_START = 0xac00; // '가'
const HANGUL_END = 0xd7a3; // '힣'
// prettier-ignore
const CHO = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 
    'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ];
// prettier-ignore
const JUNG = [
'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 
'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];
// prettier-ignore
const JONG = [
'', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 
'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 
'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

function decomposeHangul(char: string): string[] {
  const charCode = char.charCodeAt(0) - HANGUL_START;

  // 한글이 아닌 경우
  if (charCode < 0 || charCode > 11171) {
    return [char];
  }

  const jong = charCode % 28;
  const jung = Math.floor(charCode / 28) % 21;
  const cho = Math.floor(Math.floor(charCode / 28) / 21);

  const result = [];
  result.push(CHO[cho]);
  result.push(JUNG[jung]);
  if (JONG[jong] !== '') {
    result.push(JONG[jong]);
  }

  return result;
}

function decompose(str: string): string[] {
  const result: string[] = [];

  for (const char of str) {
    const charCode = char.charCodeAt(0);
    if (charCode >= HANGUL_START && charCode <= HANGUL_END) {
      result.push(...decomposeHangul(char));
    } else {
      result.push(char);
    }
  }

  return result;
}

function createBigrams(arr: string[]): Set<string> {
  const bigrams = new Set<string>();
  for (let i = 0; i < arr.length - 1; i++) {
    bigrams.add(arr[i] + arr[i + 1]);
  }
  return bigrams;
}

export function compareTwoStrings(str1: string, str2: string): number {
  if (!str1 || !str2) {
    return 0;
  }
  if (str1 === str2) {
    return 1;
  }

  const arr1 = decompose(str1.toLowerCase());
  const arr2 = decompose(str2.toLowerCase());

  const bigrams1 = createBigrams(arr1);
  const bigrams2 = createBigrams(arr2);

  const intersection = new Set([...bigrams1].filter((x) => bigrams2.has(x)));

  if (bigrams1.size === 0 || bigrams2.size === 0) {
    return 0;
  }

  return (2.0 * intersection.size) / (bigrams1.size + bigrams2.size);
}
