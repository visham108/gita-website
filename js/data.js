/* ==========================================================================
   Data layer — chapters, verses, products, course curriculum.
   Sanskrit text (Devanagari + IAST) is from the public-domain original.
   English "rendering" and "essence" texts are original study renderings
   written for this prototype. In production these fields are replaced by
   the official Bhagavad-gītā As It Is translations and purports under
   license from the Bhaktivedanta Book Trust (BBT).
   ========================================================================== */

const GITA_CHAPTERS = [
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
const GITA_VERSES = {
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

const PRODUCTS = [
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

/* -------------------- Course curriculum -------------------- */

const COURSE = [
  {
    id: "m1", title: "Orientation — The Setting of the Gītā", time: "Week 1 · 4 lessons · 55 min",
    lessons: [
      { id: "m1l1", title: "Why the Gītā, why now", time: "12 min" },
      { id: "m1l2", title: "Kurukṣetra: the battlefield and the crisis", time: "14 min" },
      { id: "m1l3", title: "Who is Kṛṣṇa? Who is Arjuna?", time: "15 min" },
      { id: "m1l4", title: "How to read As It Is: paramparā and purports", time: "14 min" }
    ]
  },
  {
    id: "m2", title: "You Are Not the Body — Chapters 1–2", time: "Weeks 2–3 · 5 lessons · 80 min",
    lessons: [
      { id: "m2l1", title: "Arjuna's grief and ours", time: "14 min" },
      { id: "m2l2", title: "The eternal soul (2.11–2.30)", time: "18 min" },
      { id: "m2l3", title: "Duty without attachment (2.47)", time: "16 min" },
      { id: "m2l4", title: "The steady sage (2.54–2.72)", time: "17 min" },
      { id: "m2l5", title: "Practice: a week of sacred reading", time: "15 min" }
    ]
  },
  {
    id: "m3", title: "The Art of Work — Chapters 3–6", time: "Weeks 4–6 · 5 lessons · 85 min",
    lessons: [
      { id: "m3l1", title: "Karma-yoga: work as offering", time: "17 min" },
      { id: "m3l2", title: "Knowledge that liberates (4.7–4.9)", time: "18 min" },
      { id: "m3l3", title: "Approaching a teacher (4.34)", time: "15 min" },
      { id: "m3l4", title: "Meditation and the mind (6.5–6.6)", time: "18 min" },
      { id: "m3l5", title: "The highest yogī (6.47)", time: "17 min" }
    ]
  },
  {
    id: "m4", title: "Knowing the Absolute — Chapters 7–12", time: "Weeks 7–10 · 5 lessons · 90 min",
    lessons: [
      { id: "m4l1", title: "Kṛṣṇa as the source of everything (7.7, 10.8)", time: "18 min" },
      { id: "m4l2", title: "Remembering at the end (8.5–8.6)", time: "16 min" },
      { id: "m4l3", title: "The most confidential knowledge (9.22–9.34)", time: "20 min" },
      { id: "m4l4", title: "The universal form (Chapter 11)", time: "18 min" },
      { id: "m4l5", title: "The path of devotion (Chapter 12)", time: "18 min" }
    ]
  },
  {
    id: "m5", title: "Nature, Modes and Faith — Chapters 13–17", time: "Weeks 11–14 · 4 lessons · 70 min",
    lessons: [
      { id: "m5l1", title: "The field and its knower (13.1–13.35)", time: "18 min" },
      { id: "m5l2", title: "The three modes in daily life (14.5–14.27)", time: "18 min" },
      { id: "m5l3", title: "The supreme person (15.7, 15.15)", time: "16 min" },
      { id: "m5l4", title: "Divine and demoniac natures; faith (16–17)", time: "18 min" }
    ]
  },
  {
    id: "m6", title: "Surrender and Beyond — Chapter 18", time: "Weeks 15–18 · 4 lessons · 75 min",
    lessons: [
      { id: "m6l1", title: "Renunciation in action (18.1–18.49)", time: "18 min" },
      { id: "m6l2", title: "The most confidential instruction (18.64–18.66)", time: "20 min" },
      { id: "m6l3", title: "Living the Gītā: sādhana for a lifetime", time: "19 min" },
      { id: "m6l4", title: "Final integration + course assessment", time: "18 min" }
    ]
  }
];

const QUIZ_M1 = [
  {
    q: "Where is the Bhagavad-gītā spoken?",
    options: ["In the forest of Vṛndāvana", "On the battlefield of Kurukṣetra", "On the bank of the Ganges", "In the palace at Hastināpura"],
    answer: 1,
    why: "The Gītā is spoken on dharma-kṣetra kuru-kṣetra — the battlefield that is also a place of pilgrimage (1.1)."
  },
  {
    q: "What does the phrase 'As It Is' signify in the title of Śrīla Prabhupāda's edition?",
    options: [
      "It is a literal word-for-word dictionary",
      "The Gītā is presented without speculative interpretation, as Kṛṣṇa spoke it and as the disciplic succession carries it",
      "It contains only the Sanskrit text",
      "It is an abridged summary"
    ],
    answer: 1,
    why: "Prabhupāda's edition presents Kṛṣṇa's words through the unbroken paramparā, without diluting or explaining away the speaker's own stated purpose."
  },
  {
    q: "According to Chapter 2, what happens to the soul when the body dies?",
    options: ["It dies with the body", "It merges and loses identity forever", "It continues, passing to another body, as it passed from youth to old age", "Nothing can be known about it"],
    answer: 2,
    why: "Dehāntara-prāptiḥ (2.13): as the self persists through the body's changes in this life, it persists through the change called death."
  }
];

/* Expose for other scripts (plain script-tag loading) */
window.GITA_CHAPTERS = GITA_CHAPTERS;
window.GITA_VERSES = GITA_VERSES;
window.PRODUCTS = PRODUCTS;
window.COURSE = COURSE;
window.QUIZ_M1 = QUIZ_M1;
