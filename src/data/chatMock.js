export const suggestedPrompts = {
  ht: [
    'Ki dwa mwen genyen si patwon m revoke m san avètisman?',
    'Kijan pou m fè yon kontra lwaye ki valab legalman?',
    "Ki etap pou m depoze yon plent nan biwo Komisarya a?",
    'Ki diferans ant divò pa konsantman mityèl ak divò pou fòt?',
  ],
  fr: [
    'Quels sont mes droits si mon employeur me licencie sans préavis ?',
    'Comment rédiger un contrat de location valable légalement ?',
    'Quelles sont les étapes pour déposer une plainte au commissariat ?',
    'Quelle est la différence entre un divorce par consentement mutuel et un divorce pour faute ?',
  ],
}

const responseBank = {
  ht: [
    {
      match: ['revoke', 'travay', 'licansye', 'salè', 'licencie', 'préavis'],
      answer:
        "Dapre **Kòd Travay la, Atik 45–52**, yon patwon dwe respekte yon peryòd avètisman anvan li revoke yon anplwaye, sof si gen yon fòt grav. Si sa pa fèt, ou gen dwa reklame yon **endemnite pou revokasyon abizif**. Mwen rekòmande w konsève tout dokiman travay ou (kontra, fich pewòl, kominikasyon) e kontakte yon avoka travay oswa Ministè Afè Sosyal la nan 48 èdtan.",
    },
    {
      match: ['lwaye', 'kontra', 'kay', 'lokasyon', 'location', 'loyer'],
      answer:
        "Yon kontra lwaye valab dwe genyen: idantite de pati yo, deskripsyon lojman an, montan lwaye a, dire kontra a, ak siyati toude pati (dapre **Kòd Sivil, Atik 1714 e swivan**). Mwen sijere w fè kontra a devan yon notè oswa avoka pou l gen fòs pwobatwa pi solid si gen konfli pita.",
    },
    {
      match: ['plent', 'komisarya', 'polis', 'ankèt', 'plainte', 'commissariat'],
      answer:
        "Pou depoze yon plent, ale nan Komisarya ki pi pre lakay ou avèk yon pyès idantite. Ofisye a dwe redije yon **pwosè-vèbal** (dapre **Kòd Enstriksyon Kriminèl, Atik 8–12**). Ou gen dwa mande yon kopi dokiman sa a — se prèv ofisyèl ke plent ou depoze.",
    },
    {
      match: ['divò', 'maryaj', 'separasyon', 'divorce'],
      answer:
        "Divò pa **konsantman mityèl** mande akò toude epòu san diskisyon sou koz la, e li pi rapid. Divò **pou fòt** mande prèv (adiltè, abandon, vyolans) e pase devan tribinal sivil la (**Kòd Sivil, Atik 213 e swivan**). Chak wout gen konsekans diferan sou pansyon alimantè ak pataj byen.",
    },
  ],
  fr: [
    {
      match: ['revoke', 'travay', 'licansye', 'salè', 'licencie', 'préavis'],
      answer:
        "Selon le **Code du Travail, Articles 45–52**, un employeur doit respecter une période de préavis avant de licencier un employé, sauf en cas de faute grave. Si ce n'est pas le cas, vous avez le droit de réclamer une **indemnité pour licenciement abusif**. Je vous recommande de conserver tous vos documents de travail (contrat, fiches de paie, communications) et de contacter un avocat du travail ou le Ministère des Affaires Sociales dans les 48 heures.",
    },
    {
      match: ['lwaye', 'kontra', 'kay', 'lokasyon', 'location', 'loyer'],
      answer:
        "Un contrat de location valable doit contenir : l'identité des deux parties, la description du logement, le montant du loyer, la durée du contrat, et la signature des deux parties (selon le **Code Civil, Article 1714 et suivants**). Je vous suggère de faire établir le contrat devant un notaire ou un avocat afin qu'il ait une force probante plus solide en cas de conflit ultérieur.",
    },
    {
      match: ['plent', 'komisarya', 'polis', 'ankèt', 'plainte', 'commissariat'],
      answer:
        "Pour déposer une plainte, rendez-vous au commissariat le plus proche de chez vous avec une pièce d'identité. L'officier doit rédiger un **procès-verbal** (selon le **Code d'Instruction Criminelle, Articles 8–12**). Vous avez le droit de demander une copie de ce document — c'est la preuve officielle que votre plainte a été déposée.",
    },
    {
      match: ['divò', 'maryaj', 'separasyon', 'divorce'],
      answer:
        "Le divorce par **consentement mutuel** nécessite l'accord des deux époux sans contestation sur la cause, et il est plus rapide. Le divorce **pour faute** nécessite des preuves (adultère, abandon, violence) et passe devant le tribunal civil (**Code Civil, Article 213 et suivants**). Chaque voie a des conséquences différentes sur la pension alimentaire et le partage des biens.",
    },
  ],
}

const fallbackReply = {
  ht: "Mèsi pou kesyon ou. Dapre analiz preliminè m sou kòd legal ayisyen yo, sitiyasyon w dekri a ka konsène plizyè atik nan **Kòd Sivil** oswa **Konstitisyon 1987** la. Pou yon repons pi presi ak sitasyon egzat, ban m plis detay sou kontèks la (dat, moun ki enplike, dokiman ou genyen deja).",
  fr: "Merci pour votre question. D'après mon analyse préliminaire des codes légaux haïtiens, la situation que vous décrivez pourrait concerner plusieurs articles du **Code Civil** ou de la **Constitution de 1987**. Pour une réponse plus précise avec des citations exactes, donnez-moi plus de détails sur le contexte (date, personnes impliquées, documents que vous avez déjà).",
}

export function generateMockReply(userMessage, lang = 'ht') {
  const lower = userMessage.toLowerCase()
  const bank = responseBank[lang] || responseBank.ht
  const found = bank.find((r) => r.match.some((kw) => lower.includes(kw)))
  if (found) return found.answer
  return fallbackReply[lang] || fallbackReply.ht
}

export const seedConversations = {
  ht: [
    {
      id: 'c1',
      title: 'Kontra travay ak revokasyon',
      updatedAt: '2026-07-11T10:00:00Z',
      messages: [
        { role: 'user', content: 'Ki dwa mwen genyen si patwon m revoke m san avètisman?' },
        {
          role: 'assistant',
          content:
            "Dapre **Kòd Travay la, Atik 45–52**, yon patwon dwe respekte yon peryòd avètisman anvan li revoke yon anplwaye, sof si gen yon fòt grav. Si sa pa fèt, ou gen dwa reklame yon **endemnite pou revokasyon abizif**.",
        },
      ],
    },
    {
      id: 'c2',
      title: 'Kontra lokasyon apatman',
      updatedAt: '2026-07-09T15:30:00Z',
      messages: [
        { role: 'user', content: 'Kijan pou m fè yon kontra lwaye ki valab legalman?' },
        {
          role: 'assistant',
          content:
            "Yon kontra lwaye valab dwe genyen idantite de pati yo, deskripsyon lojman an, montan lwaye a, dire kontra a, ak siyati toude pati (dapre **Kòd Sivil, Atik 1714 e swivan**).",
        },
      ],
    },
  ],
  fr: [
    {
      id: 'c1',
      title: 'Contrat de travail et licenciement',
      updatedAt: '2026-07-11T10:00:00Z',
      messages: [
        { role: 'user', content: 'Quels sont mes droits si mon employeur me licencie sans préavis ?' },
        {
          role: 'assistant',
          content:
            "Selon le **Code du Travail, Articles 45–52**, un employeur doit respecter une période de préavis avant de licencier un employé, sauf en cas de faute grave. Si ce n'est pas le cas, vous avez le droit de réclamer une **indemnité pour licenciement abusif**.",
        },
      ],
    },
    {
      id: 'c2',
      title: "Contrat de location d'appartement",
      updatedAt: '2026-07-09T15:30:00Z',
      messages: [
        { role: 'user', content: 'Comment rédiger un contrat de location valable légalement ?' },
        {
          role: 'assistant',
          content:
            "Un contrat de location valable doit contenir l'identité des deux parties, la description du logement, le montant du loyer, la durée du contrat, et la signature des deux parties (selon le **Code Civil, Article 1714 et suivants**).",
        },
      ],
    },
  ],
}
