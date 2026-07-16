"use client";

/* "Every verse, in five layers" — the interactive anatomy of verse 2.13. */

import { useState } from "react";

const LAYERS = [
  { label: "Devanāgarī", hint: "The original Sanskrit script" },
  { label: "Transliteration", hint: "Roman IAST — read it aloud" },
  { label: "Word for word", hint: "Every Sanskrit word, glossed" },
  { label: "Translation", hint: "Faithful, complete English" },
  { label: "Purport", hint: "The verse, brought to life" },
];

const GLOSS: Array<[string, string]> = [
  ["dehinaḥ", "of the embodied"],
  ["asmin", "in this"],
  ["yathā", "as"],
  ["dehe", "body"],
  ["kaumāram", "boyhood"],
  ["yauvanam", "youth"],
  ["jarā", "old age"],
  ["tathā", "similarly"],
  ["deha-antara-prāptiḥ", "attaining another body"],
  ["dhīraḥ", "the sober"],
  ["na muhyati", "is not bewildered"],
];

export default function Anatomy() {
  const [active, setActive] = useState(0);

  return (
    <div className="anatomy reveal">
      <div className="layers" role="tablist" aria-label="The five layers of verse 2.13">
        {LAYERS.map((layer, i) => (
          <button
            key={layer.label}
            className="layer-btn"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
          >
            <b>{layer.label}</b>
            <span>{layer.hint}</span>
          </button>
        ))}
      </div>
      <div className="stage">
        <p className="stage__ref">Bhagavad-gītā 2.13</p>
        <div className={active === 0 ? "is-active" : ""} data-panel="">
          <p className="sanskrit">देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा ।<br />तथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति ॥</p>
        </div>
        <div className={active === 1 ? "is-active" : ""} data-panel="">
          <p className="iast">dehino &rsquo;smin yathā dehe<br />kaumāraṁ yauvanaṁ jarā<br />tathā dehāntara-prāptir<br />dhīras tatra na muhyati</p>
        </div>
        <div className={active === 2 ? "is-active" : ""} data-panel="">
          <div className="gloss">
            {GLOSS.map(([word, meaning]) => (
              <span key={word}><i>{word}</i> <em>— {meaning}</em></span>
            ))}
          </div>
        </div>
        <div className={active === 3 ? "is-active" : ""} data-panel="">
          <p className="stage__translation">As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change.</p>
        </div>
        <div className={active === 4 ? "is-active" : ""} data-panel="">
          <p className="stage__note"><em>Study note.</em> You have already survived the death of the child&rsquo;s body you once wore; the person reading this outlived it. The verse asks you to notice that the self persisting through those changes will persist through the last one too — and that sobriety, not grief, is the mark of one who sees it. <em>The licensed purport by Śrīla Prabhupāda appears here in the production edition.</em></p>
        </div>
      </div>
    </div>
  );
}
