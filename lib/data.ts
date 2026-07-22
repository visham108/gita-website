/* ==========================================================================
   Static content data, ported 1:1 from the prototype's js/data.js.
   Sanskrit (Devanagari + IAST) is public domain; English "r" renderings and
   "e" essence notes are original placeholders pending the BBT license.
   PRODUCTS moves to the database in Phase 3 — until then it stays here so the
   Next.js port is verifiable against the static site.
   ========================================================================== */

export interface Chapter {
  n: number;
  sa: string;
  iast: string;
  en: string;
  verses: number;
  summary: string;
}

export interface Verse {
  d: string; // Devanagari
  t: string; // IAST transliteration
  r: string; // study rendering (placeholder for licensed translation)
  e: string; // essence note
}

export interface Product {
  id: string;
  type: string;
  title: string;
  price: number;
  tag: string | null;
  features: string[];
}

/** One checkable step in the reading plan. Ids stay stable (m1l1, m2l3 …)
    because completion is stored against them in course_progress. */
export interface Reading {
  id: string;
  title: string;
  time: string;
}

/** A key idea, with where to find it and where it bites in ordinary life. */
export interface PlanConcept {
  term: string;
  verse: string;
  meaning: string;
  inPractice: string;
}

export interface PlanStage {
  id: string;
  title: string;
  time: string;
  read: string;
  audience: string;
  concepts: PlanConcept[];
  readings: Reading[];
  /** Replaces the old multiple-choice quiz: something to sit with and write,
      which is what this book actually asks of a reader. */
  reflection: string;
}

export const GITA_CHAPTERS: Chapter[] = [
  { n: 1,  sa: "अर्जुनविषादयोग", iast: "Arjuna-viṣāda-yoga", en: "Observing the Armies on the Battlefield of Kurukṣetra", verses: 46,
    summary: "As the two armies stand ready for battle, the mighty warrior Arjuna sees his own relatives, teachers and friends on both sides. Overwhelmed by grief and compassion, he loses his composure and gives up his will to fight." },
  { n: 2,  sa: "साङ्ख्ययोग", iast: "Sāṅkhya-yoga", en: "Contents of the Gītā Summarized", verses: 72,
    summary: "Arjuna submits to Kṛṣṇa as His disciple, and Kṛṣṇa begins His teachings by explaining the difference between the temporary material body and the eternal soul — the essential foundation of all spiritual knowledge." },
  { n: 3,  sa: "कर्मयोग", iast: "Karma-yoga", en: "Karma-yoga", verses: 43,
    summary: "Everyone must engage in some sort of activity in this material world. Actions can either bind one to this world or liberate one from it — the art is to act as an offering, free from selfish motive." },
  { n: 4,  sa: "ज्ञानयोग", iast: "Jñāna-yoga", en: "Transcendental Knowledge", verses: 42,
    summary: "Transcendental knowledge — the spiritual knowledge of the soul, of God, and of their relationship — purifies and liberates. Such knowledge descends through an unbroken chain of teachers and is received by humble inquiry and service." },
  { n: 5,  sa: "कर्मसंन्यासयोग", iast: "Karma-sannyāsa-yoga", en: "Karma-yoga — Action in Kṛṣṇa Consciousness", verses: 29,
    summary: "Outwardly performing all actions but inwardly renouncing their fruits, the wise person, purified by the fire of transcendental knowledge, attains peace, detachment, tolerance, spiritual vision and bliss." },
  { n: 6,  sa: "ध्यानयोग", iast: "Dhyāna-yoga", en: "Dhyāna-yoga", verses: 47,
    summary: "Aṣṭāṅga-yoga, the mechanical meditative practice, controls the mind and senses and focuses concentration on the Supreme within the heart. This practice culminates in samādhi — full consciousness of the Supreme." },
  { n: 7,  sa: "ज्ञानविज्ञानयोग", iast: "Jñāna-vijñāna-yoga", en: "Knowledge of the Absolute", verses: 30,
    summary: "Kṛṣṇa is the Supreme Truth, the supreme cause and sustaining force of everything, material and spiritual. Advanced souls surrender to Him in devotion, whereas the impious divert their minds to other objects of worship." },
  { n: 8,  sa: "अक्षरब्रह्मयोग", iast: "Akṣara-brahma-yoga", en: "Attaining the Supreme", verses: 28,
    summary: "By remembering Kṛṣṇa in devotion throughout one's life, and especially at the time of death, one can attain His supreme abode, beyond the material world — never to return." },
  { n: 9,  sa: "राजविद्याराजगुह्ययोग", iast: "Rāja-vidyā-rāja-guhya-yoga", en: "The Most Confidential Knowledge", verses: 34,
    summary: "Kṛṣṇa is the Supreme Godhead and the supreme object of worship. The soul is eternally related to Him through transcendental devotional service, and by reviving one's pure devotion one returns to Him in the spiritual realm." },
  { n: 10, sa: "विभूतियोग", iast: "Vibhūti-yoga", en: "The Opulence of the Absolute", verses: 42,
    summary: "All wondrous phenomena showing power, beauty, grandeur or sublimity — in the material or spiritual worlds — are but partial manifestations of Kṛṣṇa's divine energies and opulence." },
  { n: 11, sa: "विश्वरूपदर्शनयोग", iast: "Viśvarūpa-darśana-yoga", en: "The Universal Form", verses: 55,
    summary: "Kṛṣṇa grants Arjuna divine vision and reveals His spectacular unlimited form as the cosmic universe, thus conclusively establishing His divinity — while affirming that His all-attractive humanlike form is His original form." },
  { n: 12, sa: "भक्तियोग", iast: "Bhakti-yoga", en: "Devotional Service", verses: 20,
    summary: "Bhakti-yoga, pure devotional service to Kṛṣṇa, is the highest and most expedient means for attaining pure love for Him — the highest end of spiritual existence. Those on this path develop divine qualities." },
  { n: 13, sa: "क्षेत्रक्षेत्रज्ञविभागयोग", iast: "Kṣetra-kṣetrajña-vibhāga-yoga", en: "Nature, the Enjoyer and Consciousness", verses: 35,
    summary: "One who understands the difference between the body, the soul, and the Supersoul beyond them both attains liberation from this material world." },
  { n: 14, sa: "गुणत्रयविभागयोग", iast: "Guṇa-traya-vibhāga-yoga", en: "The Three Modes of Material Nature", verses: 27,
    summary: "All embodied souls are under the control of the three modes of material nature: goodness, passion and ignorance. Kṛṣṇa explains what these modes are, how they act upon us, and how one transcends them through devotion." },
  { n: 15, sa: "पुरुषोत्तमयोग", iast: "Puruṣottama-yoga", en: "The Yoga of the Supreme Person", verses: 20,
    summary: "The ultimate purpose of Vedic knowledge is to detach oneself from the entanglement of the material world and to understand Kṛṣṇa as the Supreme Person. One who understands this engages in His devotional service." },
  { n: 16, sa: "दैवासुरसम्पद्विभागयोग", iast: "Daivāsura-sampad-vibhāga-yoga", en: "The Divine and Demoniac Natures", verses: 24,
    summary: "Those who possess demoniac qualities, living whimsically without following scripture, attain lower births and further bondage. The wise, following scriptural authority, cultivate divine qualities and gradually attain spiritual perfection." },
  { n: 17, sa: "श्रद्धात्रयविभागयोग", iast: "Śraddhā-traya-vibhāga-yoga", en: "The Divisions of Faith", verses: 28,
    summary: "There are three types of faith, corresponding to and evolving from the three modes of material nature. Acts performed by those whose faith is in passion and ignorance yield only impermanent results, while acts in goodness purify the heart." },
  { n: 18, sa: "मोक्षसंन्यासयोग", iast: "Mokṣa-sannyāsa-yoga", en: "Conclusion — The Perfection of Renunciation", verses: 78,
    summary: "Kṛṣṇa explains the meaning of renunciation and the effects of the modes of nature on human consciousness and activity. He concludes with His most confidential instruction: surrender unto Him fully — the ultimate perfection of life." }
];

/* Selected verses. Key: "chapter.verse".
   d = Devanagari · t = IAST transliteration · r = study rendering (original,
   placeholder for licensed BBT translation) · e = essence note (original). */
export const GITA_VERSES: Record<string, Verse> = {
  "1.1": {
    d: "धृतराष्ट्र उवाच —\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥",
    t: "dhṛtarāṣṭra uvāca —\ndharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ\nmāmakāḥ pāṇḍavāś caiva kim akurvata sañjaya",
    r: "Dhṛtarāṣṭra said: O Sañjaya, assembled at the holy place of pilgrimage, Kurukṣetra, and desiring to fight, what did my sons and the sons of Pāṇḍu do?",
    e: "The Gītā opens on a battlefield that is also a place of pilgrimage — dharma-kṣetra. From its first word, the text asks: on the field of duty, what will we do?"
  },
  "2.11": {
    d: "श्रीभगवानुवाच —\nअशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे ।\nगतासूनगतासूंश्च नानुशोचन्ति पण्डिताः ॥",
    t: "śrī-bhagavān uvāca —\naśocyān anvaśocas tvaṁ prajñā-vādāṁś ca bhāṣase\ngatāsūn agatāsūṁś ca nānuśocanti paṇḍitāḥ",
    r: "The Blessed Lord said: While speaking learned words, you are mourning for what is not worthy of grief. The wise lament neither for the living nor for the dead.",
    e: "Kṛṣṇa's first teaching begins here: real knowledge starts with knowing what we are not — this temporary body — and what we are: the eternal soul."
  },
  "2.13": {
    d: "देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा ।\nतथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति ॥",
    t: "dehino 'smin yathā dehe kaumāraṁ yauvanaṁ jarā\ntathā dehāntara-prāptir dhīras tatra na muhyati",
    r: "As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change.",
    e: "The body changes completely from childhood to old age, yet the same person persists. That persisting self, the Gītā teaches, continues beyond the body's final change as well."
  },
  "2.20": {
    d: "न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे ॥",
    t: "na jāyate mriyate vā kadācin\nnāyaṁ bhūtvā bhavitā vā na bhūyaḥ\najo nityaḥ śāśvato 'yaṁ purāṇo\nna hanyate hanyamāne śarīre",
    r: "For the soul there is never birth nor death. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing and primeval. It is not slain when the body is slain.",
    e: "Perhaps the most quoted verse on the immortality of the soul: consciousness is not produced by matter and is not ended by it."
  },
  "2.47": {
    d: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    t: "karmaṇy evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    r: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
    e: "The Gītā's celebrated formula for action without anxiety: work wholeheartedly as a matter of duty, offering the results to the Supreme, neither grasping at outcomes nor abandoning responsibility."
  },
  "2.62": {
    d: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते ।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते ॥",
    t: "dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate\nsaṅgāt sañjāyate kāmaḥ kāmāt krodho 'bhijāyate",
    r: "While contemplating the objects of the senses, a person develops attachment for them. From attachment lust develops, and from lust anger arises.",
    e: "A precise psychology of downfall, traced step by step from a single unguarded thought — and, in the verses that follow, the way back to steadiness."
  },
  "2.69": {
    d: "या निशा सर्वभूतानां तस्यां जागर्ति संयमी ।\nयस्यां जाग्रति भूतानि सा निशा पश्यतो मुनेः ॥",
    t: "yā niśā sarva-bhūtānāṁ tasyāṁ jāgarti saṁyamī\nyasyāṁ jāgrati bhūtāni sā niśā paśyato muneḥ",
    r: "What is night for all beings is the time of awakening for the self-controlled; and the time of awakening for all beings is night for the introspective sage.",
    e: "The sage and the worldly live in inverted days: what enthralls the world leaves the sage indifferent, and the inner life invisible to the world is where the sage is most awake."
  },
  "3.21": {
    d: "यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः ।\nस यत्प्रमाणं कुरुते लोकस्तदनुवर्तते ॥",
    t: "yad yad ācarati śreṣṭhas tat tad evetaro janaḥ\nsa yat pramāṇaṁ kurute lokas tad anuvartate",
    r: "Whatever action a great man performs, common men follow. And whatever standards he sets by exemplary acts, all the world pursues.",
    e: "Leadership in the Gītā is measured by example. Society follows those it admires — which is why those who know must still act, for the education of the world."
  },
  "3.27": {
    d: "प्रकृतेः क्रियमाणानि गुणैः कर्माणि सर्वशः ।\nअहङ्कारविमूढात्मा कर्ताहमिति मन्यते ॥",
    t: "prakṛteḥ kriyamāṇāni guṇaiḥ karmāṇi sarvaśaḥ\nahaṅkāra-vimūḍhātmā kartāham iti manyate",
    r: "The bewildered spirit soul, under the influence of the three modes of material nature, thinks himself the doer of activities that are in actuality carried out by nature.",
    e: "The ego claims authorship of what nature performs. Seeing the machinery of the modes at work is the beginning of real freedom."
  },
  "4.7": {
    d: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥",
    t: "yadā yadā hi dharmasya glānir bhavati bhārata\nabhyutthānam adharmasya tadātmānaṁ sṛjāmy aham",
    r: "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion — at that time I descend Myself.",
    e: "God is not indifferent to history. When the principles of dharma decay, the Lord personally appears to restore them — a promise, and an explanation of the divine descents."
  },
  "4.8": {
    d: "परित्राणाय साधूनां विनाशाय च दुष्कृताम् ।\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे ॥",
    t: "paritrāṇāya sādhūnāṁ vināśāya ca duṣkṛtām\ndharma-saṁsthāpanārthāya sambhavāmi yuge yuge",
    r: "To deliver the pious and to annihilate the miscreants, as well as to reestablish the principles of dharma, I Myself appear, millennium after millennium.",
    e: "The threefold purpose of the divine descent: protection of the saintly, removal of obstruction, and the re-establishment of eternal principles."
  },
  "4.9": {
    d: "जन्म कर्म च मे दिव्यमेवं यो वेत्ति तत्त्वतः ।\nत्यक्त्वा देहं पुनर्जन्म नैति मामेति सोऽर्जुन ॥",
    t: "janma karma ca me divyam evaṁ yo vetti tattvataḥ\ntyaktvā dehaṁ punar janma naiti mām eti so 'rjuna",
    r: "One who knows the transcendental nature of My appearance and activities does not, upon leaving the body, take birth again in this material world, but attains My eternal abode, O Arjuna.",
    e: "Simply understanding — in truth — who Kṛṣṇa is and why He appears is itself liberating. Knowledge of God, rightly received, carries one beyond birth and death."
  },
  "4.34": {
    d: "तद्विद्धि प्रणिपातेन परिप्रश्नेन सेवया ।\nउपदेक्ष्यन्ति ते ज्ञानं ज्ञानिनस्तत्त्वदर्शिनः ॥",
    t: "tad viddhi praṇipātena paripraśnena sevayā\nupadekṣyanti te jñānaṁ jñāninas tattva-darśinaḥ",
    r: "Just try to learn the truth by approaching a spiritual master. Inquire from him submissively and render service unto him. The self-realized souls can impart knowledge unto you because they have seen the truth.",
    e: "Spiritual knowledge descends; it is not manufactured. The Gītā's own method of transmission — humble approach, sincere inquiry, and service to one who has seen the truth."
  },
  "5.18": {
    d: "विद्याविनयसम्पन्ने ब्राह्मणे गवि हस्तिनि ।\nशुनि चैव श्वपाके च पण्डिताः समदर्शिनः ॥",
    t: "vidyā-vinaya-sampanne brāhmaṇe gavi hastini\nśuni caiva śva-pāke ca paṇḍitāḥ sama-darśinaḥ",
    r: "The humble sage, by virtue of true knowledge, sees with equal vision a learned and gentle brāhmaṇa, a cow, an elephant, a dog and an outcaste.",
    e: "Equal vision is the fruit of seeing the soul. Bodies differ endlessly; the spark of spirit within them does not."
  },
  "5.29": {
    d: "भोक्तारं यज्ञतपसां सर्वलोकमहेश्वरम् ।\nसुहृदं सर्वभूतानां ज्ञात्वा मां शान्तिमृच्छति ॥",
    t: "bhoktāraṁ yajña-tapasāṁ sarva-loka-maheśvaram\nsuhṛdaṁ sarva-bhūtānāṁ jñātvā māṁ śāntim ṛcchati",
    r: "A person in full consciousness of Me, knowing Me to be the ultimate beneficiary of all sacrifices and austerities, the Supreme Lord of all planets and demigods, and the benefactor and well-wisher of all living entities, attains peace from the pangs of material miseries.",
    e: "The Gītā's peace formula: real peace follows from knowing who is the true proprietor, the true enjoyer, and the true friend of every living being."
  },
  "6.5": {
    d: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥",
    t: "uddhared ātmanātmānaṁ nātmānam avasādayet\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    r: "One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.",
    e: "No external circumstance decides our elevation or fall so much as the disposition of our own mind — which can be trained into our greatest ally."
  },
  "6.47": {
    d: "योगिनामपि सर्वेषां मद्गतेनान्तरात्मना ।\nश्रद्धावान्भजते यो मां स मे युक्ततमो मतः ॥",
    t: "yoginām api sarveṣāṁ mad-gatenāntar-ātmanā\nśraddhāvān bhajate yo māṁ sa me yuktatamo mataḥ",
    r: "And of all yogīs, the one with great faith who always abides in Me, thinks of Me within himself, and renders transcendental loving service to Me — he is the most intimately united with Me in yoga and is the highest of all.",
    e: "The chapter on meditation ends with a hierarchy of yogīs — and its summit: the yoga of loving devotion, bhakti."
  },
  "7.7": {
    d: "मत्तः परतरं नान्यत्किञ्चिदस्ति धनञ्जय ।\nमयि सर्वमिदं प्रोतं सूत्रे मणिगणा इव ॥",
    t: "mattaḥ parataraṁ nānyat kiñcid asti dhanañjaya\nmayi sarvam idaṁ protaṁ sūtre maṇi-gaṇā iva",
    r: "O conqueror of wealth, there is no truth superior to Me. Everything rests upon Me, as pearls are strung on a thread.",
    e: "One image for the relationship of God and world: distinct pearls, one invisible thread. The world is neither identical with God nor separate from His energy."
  },
  "7.14": {
    d: "दैवी ह्येषा गुणमयी मम माया दुरत्यया ।\nमामेव ये प्रपद्यन्ते मायामेतां तरन्ति ते ॥",
    t: "daivī hy eṣā guṇa-mayī mama māyā duratyayā\nmām eva ye prapadyante māyām etāṁ taranti te",
    r: "This divine energy of Mine, consisting of the three modes of material nature, is difficult to overcome. But those who have surrendered unto Me can easily cross beyond it.",
    e: "Māyā is real, divine in origin, and insurmountable by our own strength — yet it steps aside for the soul who surrenders to its source."
  },
  "7.19": {
    d: "बहूनां जन्मनामन्ते ज्ञानवान्मां प्रपद्यते ।\nवासुदेवः सर्वमिति स महात्मा सुदुर्लभः ॥",
    t: "bahūnāṁ janmanām ante jñānavān māṁ prapadyate\nvāsudevaḥ sarvam iti sa mahātmā su-durlabhaḥ",
    r: "After many births and deaths, one who is actually in knowledge surrenders unto Me, knowing Me to be the cause of all causes and all that is. Such a great soul is very rare.",
    e: "The end of the long journey of philosophy is not a concept but a person — and the recognition 'Vāsudeva is everything' marks its rarest attainment."
  },
  "8.5": {
    d: "अन्तकाले च मामेव स्मरन्मुक्त्वा कलेवरम् ।\nयः प्रयाति स मद्भावं याति नास्त्यत्र संशयः ॥",
    t: "anta-kāle ca mām eva smaran muktvā kalevaram\nyaḥ prayāti sa mad-bhāvaṁ yāti nāsty atra saṁśayaḥ",
    r: "And whoever, at the end of his life, quits his body remembering Me alone at once attains My nature. Of this there is no doubt.",
    e: "Consciousness at the final moment carries the soul to its next destination — which is why the Gītā trains us to remember the Supreme in every moment before it."
  },
  "9.22": {
    d: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते ।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥",
    t: "ananyāś cintayanto māṁ ye janāḥ paryupāsate\nteṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham",
    r: "But those who always worship Me with exclusive devotion, meditating on My transcendental form — to them I carry what they lack, and I preserve what they have.",
    e: "A personal guarantee, unique in the Gītā: for the soul devoted without reservation, the Lord Himself assumes responsibility for maintenance and protection."
  },
  "9.26": {
    d: "पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति ।\nतदहं भक्त्युपहृतमश्नामि प्रयतात्मनः ॥",
    t: "patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati\ntad ahaṁ bhakty-upahṛtam aśnāmi prayatātmanaḥ",
    r: "If one offers Me with love and devotion a leaf, a flower, a fruit or water, I will accept it.",
    e: "Devotion is measured not by opulence but by love. The simplest offering, made with a pure heart, reaches the Supreme."
  },
  "9.27": {
    d: "यत्करोषि यदश्नासि यज्जुहोषि ददासि यत् ।\nयत्तपस्यसि कौन्तेय तत्कुरुष्व मदर्पणम् ॥",
    t: "yat karoṣi yad aśnāsi yaj juhoṣi dadāsi yat\nyat tapasyasi kaunteya tat kuruṣva mad-arpaṇam",
    r: "Whatever you do, whatever you eat, whatever you offer or give away, and whatever austerities you perform — do that, O son of Kuntī, as an offering to Me.",
    e: "The whole of life — work, food, charity, discipline — can become yoga when performed as an offering. Nothing need be abandoned; everything is transformed."
  },
  "10.8": {
    d: "अहं सर्वस्य प्रभवो मत्तः सर्वं प्रवर्तते ।\nइति मत्वा भजन्ते मां बुधा भावसमन्विताः ॥",
    t: "ahaṁ sarvasya prabhavo mattaḥ sarvaṁ pravartate\niti matvā bhajante māṁ budhā bhāva-samanvitāḥ",
    r: "I am the source of all spiritual and material worlds. Everything emanates from Me. The wise who perfectly know this engage in My devotional service and worship Me with all their hearts.",
    e: "The first of the four 'nutshell verses' (catuḥ-ślokī of the Gītā, 10.8–11), held by tradition to contain the essence of the entire book."
  },
  "10.10": {
    d: "तेषां सततयुक्तानां भजतां प्रीतिपूर्वकम् ।\nददामि बुद्धियोगं तं येन मामुपयान्ति ते ॥",
    t: "teṣāṁ satata-yuktānāṁ bhajatāṁ prīti-pūrvakam\ndadāmi buddhi-yogaṁ taṁ yena mām upayānti te",
    r: "To those who are constantly devoted to serving Me with love, I give the understanding by which they can come to Me.",
    e: "Divine knowledge is ultimately a gift, given from within to the heart that serves with affection. Intelligence guided from within — buddhi-yoga — is the devotee's compass."
  },
  "11.54": {
    d: "भक्त्या त्वनन्यया शक्य अहमेवंविधोऽर्जुन ।\nज्ञातुं द्रष्टुं च तत्त्वेन प्रवेष्टुं च परन्तप ॥",
    t: "bhaktyā tv ananyayā śakya aham evaṁ-vidho 'rjuna\njñātuṁ draṣṭuṁ ca tattvena praveṣṭuṁ ca parantapa",
    r: "My dear Arjuna, only by undivided devotional service can I be understood as I am, standing before you, and can thus be seen directly. Only in this way can you enter into the mysteries of My understanding.",
    e: "After the overwhelming vision of the universal form, the conclusion is intimate: God is known as He is only through undivided devotion."
  },
  "11.55": {
    d: "मत्कर्मकृन्मत्परमो मद्भक्तः सङ्गवर्जितः ।\nनिर्वैरः सर्वभूतेषु यः स मामेति पाण्डव ॥",
    t: "mat-karma-kṛn mat-paramo mad-bhaktaḥ saṅga-varjitaḥ\nnirvairaḥ sarva-bhūteṣu yaḥ sa mām eti pāṇḍava",
    r: "My dear Arjuna, one who engages in My pure devotional service, free from the contaminations of fruitive activities and mental speculation, who works for Me, who makes Me the supreme goal of his life, and who is friendly to every living being — he certainly comes to Me.",
    e: "Five marks of one who reaches the Supreme: working for Him, aiming at Him, devoted to Him, unattached, and a friend to all beings."
  },
  "12.8": {
    d: "मय्येव मन आधत्स्व मयि बुद्धिं निवेशय ।\nनिवसिष्यसि मय्येव अत ऊर्ध्वं न संशयः ॥",
    t: "mayy eva mana ādhatsva mayi buddhiṁ niveśaya\nnivasiṣyasi mayy eva ata ūrdhvaṁ na saṁśayaḥ",
    r: "Just fix your mind upon Me, the Supreme Personality of Godhead, and engage all your intelligence in Me. Thus you will live in Me always, without a doubt.",
    e: "Where mind and intelligence dwell, there the self resides. Fixing both on the Supreme, one lives with Him even now."
  },
  "12.13": {
    d: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च ।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥",
    t: "adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca\nnirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī",
    r: "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress, and who is tolerant…",
    e: "The opening of the Gītā's beloved portrait of the devotee dear to Kṛṣṇa (12.13–20): friendliness, humility, equanimity, forgiveness."
  },
  "13.3": {
    d: "क्षेत्रज्ञं चापि मां विद्धि सर्वक्षेत्रेषु भारत ।\nक्षेत्रक्षेत्रज्ञयोर्ज्ञानं यत्तज्ज्ञानं मतं मम ॥",
    t: "kṣetra-jñaṁ cāpi māṁ viddhi sarva-kṣetreṣu bhārata\nkṣetra-kṣetrajñayor jñānaṁ yat taj jñānaṁ mataṁ mama",
    r: "O scion of Bharata, you should understand that I am also the knower in all bodies, and to understand this body and its knower is called knowledge. That is My opinion.",
    e: "Each body has two knowers: the individual soul, who knows one field, and the Supersoul, who knows all fields. Knowledge, the Gītā says, is understanding both."
  },
  "14.4": {
    d: "सर्वयोनिषु कौन्तेय मूर्तयः सम्भवन्ति याः ।\nतासां ब्रह्म महद्योनिरहं बीजप्रदः पिता ॥",
    t: "sarva-yoniṣu kaunteya mūrtayaḥ sambhavanti yāḥ\ntāsāṁ brahma mahad yonir ahaṁ bīja-pradaḥ pitā",
    r: "It should be understood that all species of life, O son of Kuntī, are made possible by birth in this material nature, and that I am the seed-giving father.",
    e: "Universal kinship has a theological root: every living being, in every species, shares one supreme father."
  },
  "14.26": {
    d: "मां च योऽव्यभिचारेण भक्तियोगेन सेवते ।\nस गुणान्समतीत्यैतान्ब्रह्मभूयाय कल्पते ॥",
    t: "māṁ ca yo 'vyabhicāreṇa bhakti-yogena sevate\nsa guṇān samatītyaitān brahma-bhūyāya kalpate",
    r: "One who engages in full devotional service, unfailing in all circumstances, at once transcends the modes of material nature and thus comes to the level of Brahman.",
    e: "The three modes bind every embodied being — but unbroken devotional service lifts the soul beyond their reach, immediately."
  },
  "15.7": {
    d: "ममैवांशो जीवलोके जीवभूतः सनातनः ।\nमनःषष्ठानीन्द्रियाणि प्रकृतिस्थानि कर्षति ॥",
    t: "mamaivāṁśo jīva-loke jīva-bhūtaḥ sanātanaḥ\nmanaḥ-ṣaṣṭhānīndriyāṇi prakṛti-sthāni karṣati",
    r: "The living entities in this conditioned world are My eternal fragmental parts. Due to conditioned life, they are struggling very hard with the six senses, which include the mind.",
    e: "Who are we? Eternal parts of the Supreme — not products of matter — presently struggling under a mind and senses we were never meant to serve."
  },
  "15.15": {
    d: "सर्वस्य चाहं हृदि सन्निविष्टो\nमत्तः स्मृतिर्ज्ञानमपोहनं च ।\nवेदैश्च सर्वैरहमेव वेद्यो\nवेदान्तकृद्वेदविदेव चाहम् ॥",
    t: "sarvasya cāhaṁ hṛdi sanniviṣṭo\nmattaḥ smṛtir jñānam apohanaṁ ca\nvedaiś ca sarvair aham eva vedyo\nvedānta-kṛd veda-vid eva cāham",
    r: "I am seated in everyone's heart, and from Me come remembrance, knowledge and forgetfulness. By all the Vedas, I am to be known. Indeed, I am the compiler of Vedānta, and I am the knower of the Vedas.",
    e: "The Lord within the heart, the goal of all scripture, and its author: a single verse uniting God's immanence with the purpose of all sacred study."
  },
  "16.21": {
    d: "त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः ।\nकामः क्रोधस्तथा लोभस्तस्मादेतत्त्रयं त्यजेत् ॥",
    t: "tri-vidhaṁ narakasyedaṁ dvāraṁ nāśanam ātmanaḥ\nkāmaḥ krodhas tathā lobhas tasmād etat trayaṁ tyajet",
    r: "There are three gates leading to hell — lust, anger and greed. Every sane man should give these up, for they lead to the degradation of the soul.",
    e: "Three doors that open downward. The Gītā names them plainly so that the traveler may recognize — and pass by — each one."
  },
  "17.3": {
    d: "सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत ।\nश्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः ॥",
    t: "sattvānurūpā sarvasya śraddhā bhavati bhārata\nśraddhā-mayo 'yaṁ puruṣo yo yac-chraddhaḥ sa eva saḥ",
    r: "O son of Bharata, according to one's existence under the various modes of nature, one evolves a particular kind of faith. The living being is said to be of a particular faith according to the modes he has acquired.",
    e: "We are made of our faith. What we place it in shapes what we become — which makes the purification of faith the quiet center of spiritual life."
  },
  "18.65": {
    d: "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु ।\nमामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे ॥",
    t: "man-manā bhava mad-bhakto mad-yājī māṁ namaskuru\nmām evaiṣyasi satyaṁ te pratijāne priyo 'si me",
    r: "Always think of Me, become My devotee, worship Me and offer your homage unto Me. Thus you will come to Me without fail. I promise you this because you are My very dear friend.",
    e: "Four imperatives and a promise, sealed with friendship. Tradition regards this as the most confidential knowledge in the Gītā, spoken just before its final verse of surrender."
  },
  "18.66": {
    d: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥",
    t: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja\nahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ",
    r: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
    e: "The Gītā's final instruction (caramaśloka): beyond every duty and doctrine stands a person, and surrender to Him dissolves all fear. 'Mā śucaḥ — do not grieve.'"
  },
  "18.78": {
    d: "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः ।\nतत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम ॥",
    t: "yatra yogeśvaraḥ kṛṣṇo yatra pārtho dhanur-dharaḥ\ntatra śrīr vijayo bhūtir dhruvā nītir matir mama",
    r: "Wherever there is Kṛṣṇa, the master of all mystics, and wherever there is Arjuna, the supreme archer, there will also certainly be opulence, victory, extraordinary power and morality. That is my opinion.",
    e: "The last verse of the Gītā, spoken by Sañjaya: where the divine and the devoted stand together, fortune, victory and virtue follow."
  }
};

/* -------------------- Store catalog (demo pricing) -------------------- */

export const PRODUCTS: Product[] = [
  {
    id: "hardcover",
    type: "Hardcover",
    title: "Bhagavad-gītā As It Is — Deluxe Hardcover",
    price: 24.95,
    tag: "Most loved",
    features: [
      "Complete edition: 700 verses with word-for-word meanings",
      "Full purports by Śrīla Prabhupāda",
      "48 color plates · Sanskrit index · glossary",
      "Sewn binding made to last a lifetime of study"
    ]
  },
  {
    id: "paperback",
    type: "Paperback",
    title: "Bhagavad-gītā As It Is — Paperback",
    price: 12.95,
    tag: null,
    features: [
      "The complete, unabridged text",
      "Light and travel-friendly",
      "Perfect first copy or gift",
      "Same complete purports as the hardcover"
    ]
  },
  {
    id: "ebook",
    type: "eBook",
    title: "Bhagavad-gītā As It Is — Digital Edition",
    price: 7.99,
    tag: "Instant access",
    features: [
      "EPUB + Kindle formats, DRM-free",
      "Full-text search across all purports",
      "Adjustable Sanskrit display",
      "Read instantly on any device"
    ]
  },
  {
    id: "audiobook",
    type: "Audiobook",
    title: "Bhagavad-gītā As It Is — Audiobook",
    price: 14.99,
    tag: null,
    features: [
      "Complete unabridged narration · 24+ hours",
      "Verse-by-verse chapter navigation",
      "Sanskrit ślokas beautifully recited",
      "Stream or download for offline listening"
    ]
  }
];

/* -------------------- Reading plan --------------------
   NOT a taught course — a structured path through the book. Each stage says
   what to read, names the concepts devotees actually centre on, and shows
   where each one bites in ordinary working life. All wording here is original;
   Prabhupāda's translations and purports are © BBT and are never reproduced —
   we point to verse numbers so the reader meets the text in the book itself. */

export const READING_PLAN: PlanStage[] = [
  {
    id: "m1",
    title: "Before You Begin — How to Read This Book",
    time: "Week 1",
    read: "Introduction, and Chapter 1",
    audience:
      "Anyone who has started the Gītā before and stalled. This stage is about how to read it, so the rest lands.",
    concepts: [
      {
        term: "Paramparā",
        verse: "4.1–4.3",
        meaning:
          "The teaching is passed down an unbroken chain rather than re-invented by each reader. This is what the phrase “As It Is” claims: the text is presented as its speaker meant it, not bent to fit a modern thesis.",
        inPractice:
          "You already trust chains of transmission — a surgeon trained by surgeons, a craft learned from a master. Read with the same posture: receive first, argue later.",
      },
      {
        term: "Dharma-kṣetra",
        verse: "1.1",
        meaning:
          "The very first line calls the battlefield a field of dharma. The Gītā is not spoken in a monastery but in the middle of an unavoidable, messy obligation.",
        inPractice:
          "Your life does not need to be quiet or sorted before this book applies. It was spoken into exactly the kind of pressure you are already under.",
      },
      {
        term: "Viṣāda — the crisis that opens inquiry",
        verse: "1.28–1.46",
        meaning:
          "Arjuna collapses. He is not a beginner asking idle questions; he is a capable man whose competence has run out. Only then does he ask to be taught.",
        inPractice:
          "Feeling stuck is not disqualifying — in this text it is the doorway. The honest admission “I don't know what is right here” is where the teaching starts.",
      },
    ],
    readings: [
      { id: "m1l1", title: "Read the Introduction — why this edition exists", time: "Week 1" },
      { id: "m1l2", title: "Read Chapter 1 — the setting and Arjuna's collapse", time: "Week 1" },
      { id: "m1l3", title: "Learn the five layers of each verse (Sanskrit → purport)", time: "Week 1" },
    ],
    reflection:
      "Write down one decision you are currently avoiding. Is it hard because you don't know what will happen, or because you don't know what is right? The Gītā treats those as different problems.",
  },

  {
    id: "m2",
    title: "You Are Not the Body",
    time: "Weeks 2–4",
    read: "Chapter 2 — especially 2.11–2.30, 2.47, and 2.54–2.72",
    audience:
      "Students facing exams, anyone whose sense of worth rises and falls with results.",
    concepts: [
      {
        term: "Ātmā — the self is not the body",
        verse: "2.13, 2.20, 2.22",
        meaning:
          "The self that occupies childhood, youth and old age is one continuous thing; the body it wears is not. Death is described as a change of garment, not an ending.",
        inPractice:
          "Most performance anxiety assumes that if the work fails, you are diminished. This chapter separates the two: outcomes touch the garment, not the wearer.",
      },
      {
        term: "Niṣkāma-karma — work without clutching the result",
        verse: "2.47",
        meaning:
          "The most quoted verse in the book: your claim is on the action, never on its fruit. Not indifference to quality — release of ownership over the outcome.",
        inPractice:
          "Exams, appraisals, launches. Obsessing over the result actively degrades the work — attention leaks from the task to the scoreboard. Do the work; let the result be the result.",
      },
      {
        term: "The ladder from thought to ruin",
        verse: "2.62–2.63",
        meaning:
          "A precise sequence: dwelling on an object → attachment → desire → anger when thwarted → confusion → memory failure → collapse of judgement.",
        inPractice:
          "The most practical psychology in the book. Every blow-up you regret climbed these rungs. Catch it at rung one — the dwelling — and the rest never fires.",
      },
      {
        term: "Sthita-prajña — steadiness that isn't numbness",
        verse: "2.54–2.72",
        meaning:
          "Arjuna asks how such a person walks and speaks. The answer describes someone undisturbed by both gain and loss — not because they feel nothing, but because their centre isn't outside them.",
        inPractice:
          "A working definition of composure: not the absence of pressure, but the absence of being owned by it.",
      },
    ],
    readings: [
      { id: "m2l1", title: "Read 2.11–2.30 — the nature of the self", time: "Week 2" },
      { id: "m2l2", title: "Sit with 2.47 for a full week before moving on", time: "Week 3" },
      { id: "m2l3", title: "Read 2.54–2.72 — the steady mind", time: "Week 4" },
      { id: "m2l4", title: "Trace 2.62–2.63 in one real incident from your week", time: "Week 4" },
    ],
    reflection:
      "Where in your week does anxiety about the result actually damage the quality of your work? Name one task where you could commit fully to the effort and genuinely release the outcome.",
  },

  {
    id: "m3",
    title: "Work Without Burning Out",
    time: "Weeks 5–8",
    read: "Chapters 3, 4 and 5",
    audience:
      "Working professionals, anyone comparing their career to someone else's.",
    concepts: [
      {
        term: "Karma-yoga — action as offering",
        verse: "3.9",
        meaning:
          "Work done as an offering does not bind the worker; the same work done to feed the ego does. The action can look identical from outside — the difference is interior.",
        inPractice:
          "You cannot leave your job to become spiritual. This reframes the job itself: the spreadsheet done well and offered is not lesser than the retreat.",
      },
      {
        term: "Sva-dharma — your own duty, imperfectly",
        verse: "3.35, 18.47",
        meaning:
          "It is better to do your own work badly than another's well. Duty suited to your nature is safer ground than a more prestigious role that isn't yours.",
        inPractice:
          "The clearest antidote to career envy in the book. The question stops being “is this impressive?” and becomes “is this mine?”",
      },
      {
        term: "Who is actually the doer",
        verse: "3.27",
        meaning:
          "Nature's qualities carry out the work while the ego announces “I did this.” Not a denial of effort — a correction of the credit.",
        inPractice:
          "Deflates both arrogance after a win and collapse after a failure. Neither was entirely yours.",
      },
      {
        term: "Detachment is not indifference",
        verse: "5.10",
        meaning:
          "One who acts while surrendering attachment is untouched, as a lotus leaf is untouched by water. Fully in the water; not soaked by it.",
        inPractice:
          "You can care enormously about doing the work well and still not be destroyed when it goes wrong. These are compatible — most people assume they aren't.",
      },
    ],
    readings: [
      { id: "m3l1", title: "Read Chapter 3 — action and its obligations", time: "Week 5" },
      { id: "m3l2", title: "Read Chapter 4 — knowledge, and the chain of teachers", time: "Week 6" },
      { id: "m3l3", title: "Read Chapter 5 — renunciation compared with action", time: "Week 7" },
      { id: "m3l4", title: "Re-read 3.35 and write what your own dharma actually is", time: "Week 8" },
    ],
    reflection:
      "Whose career are you quietly measuring yours against? Write down what you would do differently this month if that comparison simply weren't available to you.",
  },

  {
    id: "m4",
    title: "The Mind — Friend or Enemy",
    time: "Weeks 9–11",
    read: "Chapter 6",
    audience:
      "Anyone fighting distraction, burnout, or a discipline they keep abandoning.",
    concepts: [
      {
        term: "The mind is your friend or your enemy",
        verse: "6.5–6.6",
        meaning:
          "Nobody else holds this position. The untrained mind works against you with full knowledge of your weak points; the trained one is your closest ally.",
        inPractice:
          "The voice narrating your failures is not an objective observer. It is a faculty — and faculties can be trained.",
      },
      {
        term: "Moderation — yoga is not extremity",
        verse: "6.16–6.17",
        meaning:
          "Not for one who eats too much or too little, sleeps too much or too little. Regulated eating, sleeping, working and recreation is named as the path itself.",
        inPractice:
          "Sleep and meals are not obstacles to your practice; they are part of it. Most burnout is a moderation failure dressed up as dedication.",
      },
      {
        term: "Abhyāsa and vairāgya — practice and dispassion",
        verse: "6.35",
        meaning:
          "Kṛṣṇa concedes the mind is restless and hard to curb, then gives two levers: consistent practice, and loosening the grip of craving.",
        inPractice:
          "Consistency beats intensity. Twenty unglamorous minutes daily outperforms a heroic weekend you won't repeat.",
      },
      {
        term: "The honest admission",
        verse: "6.33–6.34",
        meaning:
          "Arjuna says plainly that controlling the mind seems as hard as controlling the wind. The text records the objection rather than dismissing it.",
        inPractice:
          "Your difficulty is not a sign you're unsuited. The book's own student said the same thing to the teacher's face.",
      },
    ],
    readings: [
      { id: "m4l1", title: "Read Chapter 6 in full", time: "Week 9" },
      { id: "m4l2", title: "Apply 6.16–6.17 — audit sleep, food, work, rest for one week", time: "Week 10" },
      { id: "m4l3", title: "Re-read 6.34–6.35 after that week and note what broke", time: "Week 11" },
    ],
    reflection:
      "Name one discipline you have started and abandoned more than once. What was the unrealistic part? Write the smallest version of it you could genuinely sustain for a month.",
  },

  {
    id: "m5",
    title: "Knowing the Divine",
    time: "Weeks 12–14",
    read: "Chapters 7 through 11",
    audience:
      "Readers who came for philosophy and are meeting the devotional heart of the book.",
    concepts: [
      {
        term: "Four kinds of people who turn to God",
        verse: "7.16",
        meaning:
          "The distressed, the curious, the seeker of gain, and the one who seeks knowledge itself. Notably, none of the four is turned away.",
        inPractice:
          "If you came here in difficulty or out of curiosity, that counts. The text does not require a purer motive before you may begin.",
      },
      {
        term: "You become what you dwell on",
        verse: "8.6",
        meaning:
          "Whatever state of being one remembers at the end is the state one attains — and remembrance at the end is shaped by a lifetime of attention.",
        inPractice:
          "The most demanding idea in the book for a phone-shaped life. Attention is not neutral consumption; it is formation. What you scroll, you become.",
      },
      {
        term: "Vibhūti — recognising the Divine in excellence",
        verse: "10.41",
        meaning:
          "Wherever there is particular splendour or power, understand it as a spark of the Divine. A long list of the best of each kind is given as a training in seeing.",
        inPractice:
          "A discipline of attention for ordinary days: the excellent thing in front of you — a piece of work, a mountain, a person's skill — is a pointer, not a distraction.",
      },
      {
        term: "Viśva-rūpa — awe, and its limits",
        verse: "11.8, 11.45–11.46",
        meaning:
          "Arjuna is given cosmic vision, is terrified by it, and asks for the familiar form back. Overwhelming grandeur is not the destination; relationship is.",
        inPractice:
          "Spiritual experience is not measured by intensity. Arjuna's own preference was for the intimate over the spectacular.",
      },
    ],
    readings: [
      { id: "m5l1", title: "Read Chapters 7–8 — the two energies, and remembrance", time: "Week 12" },
      { id: "m5l2", title: "Read Chapters 9–10 — the confidential knowledge, and the splendours", time: "Week 13" },
      { id: "m5l3", title: "Read Chapter 11 — the universal form", time: "Week 14" },
    ],
    reflection:
      "What occupies your mind in unguarded moments — waiting in a queue, lying awake? Write it down honestly. Given 8.6, what is that shaping you into?",
  },

  {
    id: "m6",
    title: "Devotion, Character, and the Life Well Lived",
    time: "Weeks 15–18",
    read: "Chapters 12 through 18",
    audience:
      "Everyone — this is where the book turns from understanding to living.",
    concepts: [
      {
        term: "Bhakti — the accessible path",
        verse: "12.6–12.8",
        meaning:
          "After chapters of philosophy and discipline, the path named as most accessible is devotion — an offering of the heart rather than an intellectual or athletic feat.",
        inPractice:
          "You do not need to be scholarly or ascetically gifted. This is the chapter that opens the book to a working parent.",
      },
      {
        term: "The qualities of one dear to God",
        verse: "12.13–12.20",
        meaning:
          "A concrete list: free from envy, kind, without false ego, equal in happiness and distress, forgiving, content, self-controlled, and not a source of anxiety to others.",
        inPractice:
          "Read it as a character audit rather than poetry. “Not a source of anxiety to anyone” alone would rewrite most workplaces.",
      },
      {
        term: "The three guṇas — reading your own state",
        verse: "14.11–14.13, 17.8–17.10",
        meaning:
          "Goodness, passion and ignorance colour everything — your food, your work, your charity, your mood. Each is described with enough precision to be diagnosed.",
        inPractice:
          "A daily instrument: which quality drove that decision, that meal, that message you fired off at 11pm? Naming it is most of the correction.",
      },
      {
        term: "Deliberate fully, then choose",
        verse: "18.63",
        meaning:
          "Having explained everything, Kṛṣṇa tells Arjuna to reflect on it completely and then do as he wishes. The freedom is handed back deliberately.",
        inPractice:
          "The book refuses to coerce even at its climax. Take counsel seriously, then own the decision — that is the model it leaves you with.",
      },
    ],
    readings: [
      { id: "m6l1", title: "Read Chapter 12 — the path of devotion", time: "Week 15" },
      { id: "m6l2", title: "Read Chapters 13–15 — nature, the guṇas, the eternal tree", time: "Week 16" },
      { id: "m6l3", title: "Read Chapters 16–17 — character and the qualities of action", time: "Week 17" },
      { id: "m6l4", title: "Read Chapter 18 — the conclusion, and re-read 18.63", time: "Week 18" },
    ],
    reflection:
      "From the list in 12.13–12.20, choose the quality most absent in you. Not the one easiest to admit — the true one. What would practising it look like in one specific relationship this week?",
  },
];

/* Expose for other scripts (plain script-tag loading) */
