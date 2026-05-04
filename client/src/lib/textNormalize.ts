// ローマ字 → ひらがなの簡易変換（主要なパターンのみ対応）
export const romanToHiragana = (input: string): string => {
  const lower = input.toLowerCase();
  const map: Record<string, string> = {
    kya: "きゃ",
    kyu: "きゅ",
    kyo: "きょ",
    sha: "しゃ",
    shu: "しゅ",
    sho: "しょ",
    cha: "ちゃ",
    chu: "ちゅ",
    cho: "ちょ",
    nya: "にゃ",
    nyu: "にゅ",
    nyo: "にょ",
    hya: "ひゃ",
    hyu: "ひゅ",
    hyo: "ひょ",
    mya: "みゃ",
    myu: "みゅ",
    myo: "みょ",
    rya: "りゃ",
    ryu: "りゅ",
    ryo: "りょ",
    gya: "ぎゃ",
    gyu: "ぎゅ",
    gyo: "ぎょ",
    ja: "じゃ",
    ju: "じゅ",
    jo: "じょ",
    bya: "びゃ",
    byu: "びゅ",
    byo: "びょ",
    pya: "ぴゃ",
    pyu: "ぴゅ",
    pyo: "ぴょ",
    shi: "し",
    chi: "ち",
    tsu: "つ",
    fu: "ふ",
  };

  const consonantVowel: Record<string, string> = {
    a: "あ",
    i: "い",
    u: "う",
    e: "え",
    o: "お",
    ka: "か",
    ki: "き",
    ku: "く",
    ke: "け",
    ko: "こ",
    sa: "さ",
    si: "し",
    su: "す",
    se: "せ",
    so: "そ",
    ta: "た",
    ti: "ち",
    tu: "つ",
    te: "て",
    to: "と",
    na: "な",
    ni: "に",
    nu: "ぬ",
    ne: "ね",
    no: "の",
    ha: "は",
    hi: "ひ",
    hu: "ふ",
    he: "へ",
    ho: "ほ",
    ma: "ま",
    mi: "み",
    mu: "む",
    me: "め",
    mo: "も",
    ya: "や",
    yu: "ゆ",
    yo: "よ",
    ra: "ら",
    ri: "り",
    ru: "る",
    re: "れ",
    ro: "ろ",
    wa: "わ",
    wo: "を",
    ga: "が",
    gi: "ぎ",
    gu: "ぐ",
    ge: "げ",
    go: "ご",
    za: "ざ",
    zi: "じ",
    zu: "ず",
    ze: "ぜ",
    zo: "ぞ",
    da: "だ",
    di: "ぢ",
    du: "づ",
    de: "で",
    do: "ど",
    ba: "ば",
    bi: "び",
    bu: "ぶ",
    be: "べ",
    bo: "ぼ",
    pa: "ぱ",
    pi: "ぴ",
    pu: "ぷ",
    pe: "ぺ",
    po: "ぽ",
  };

  let i = 0;
  let result = "";
  while (i < lower.length) {
    // 撥音「ん」
    if (lower[i] === "n") {
      const next = lower[i + 1];
      if (!next || !"aiueony".includes(next)) {
        result += "ん";
        i += 1;
        continue;
      }
    }

    // 3 文字パターン
    const tri = lower.slice(i, i + 3);
    if (map[tri]) {
      result += map[tri];
      i += 3;
      continue;
    }

    // 2 文字パターン
    const bi = lower.slice(i, i + 2);
    if (consonantVowel[bi]) {
      result += consonantVowel[bi];
      i += 2;
      continue;
    }

    // 1 文字（母音）
    const single = lower[i];
    if (consonantVowel[single]) {
      result += consonantVowel[single];
      i += 1;
      continue;
    }

    // 変換できないものはそのまま
    result += lower[i];
    i += 1;
  }

  return result;
};

// ひらがな → カタカナ変換（その他の文字はそのまま）
export const toKatakana = (input: string): string => {
  const HIRAGANA_START = 0x3041;
  const HIRAGANA_END = 0x3096;
  const KATAKANA_START = 0x30a1;
  const offset = KATAKANA_START - HIRAGANA_START;

  return Array.from(input)
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= HIRAGANA_START && code <= HIRAGANA_END) {
        return String.fromCharCode(code + offset);
      }
      return ch;
    })
    .join("");
};

// 全角英数字 → 半角、英字は小文字化し、カタカナ基準にそろえる
export const normalizeForName = (input: string): string => {
  const fullwidthOffset = 0xfee0;
  const converted = Array.from(input)
    .map((ch) => {
      const code = ch.charCodeAt(0);
      // 全角 0-9 A-Z a-z
      if (
        (code >= 0xff10 && code <= 0xff19) ||
        (code >= 0xff21 && code <= 0xff3a) ||
        (code >= 0xff41 && code <= 0xff5a)
      ) {
        return String.fromCharCode(code - fullwidthOffset);
      }
      return ch;
    })
    .join("");

  return toKatakana(converted.toLowerCase());
};

// クエリ側の正規化（ローマ字 → かな → カタカナも含む）
export const normalizeForQuery = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) return "";

  // ローマ字だけならローマ字 → ひらがな
  if (/^[a-zA-Z]+$/.test(trimmed)) {
    const hira = romanToHiragana(trimmed);
    return normalizeForName(hira);
  }

  return normalizeForName(trimmed);
};

// マッチスコア（先頭一致 > 単語先頭一致 > その他部分一致）
export const scoreMatch = (target: string, query: string): number => {
  const index = target.indexOf(query);
  if (index === -1) return 0;
  if (index === 0) return 3;
  const prev = target[index - 1];
  if (prev === " " || prev === "・" || prev === "-" || prev === "　") {
    return 2;
  }
  return 1;
};
