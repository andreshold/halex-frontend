export const suggestedPrompts = {
  ht: [
    'Ki dwa mwen genyen si patwon m revoke m san avètisman?',
    'Kijan yon pwosedi divòs fèt?',
    'Kisa pou m fè si mèt kay mwen ap eksplize m?',
    'Ki dwa mwen genyen lè yo mete m an gad avi?',
  ],
  fr: [
    'Quels sont mes droits si mon employeur me licencie sans préavis ?',
    'Comment se déroule une procédure de divorce ?',
    'Que faire si mon propriétaire m\'expulse ?',
    'Quels sont mes droits lors d\'une garde à vue ?',
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
    {
      match: ['eritaj', 'siksesyon', 'testaman', 'succession', 'héritage'],
      answer:
        "Siksesyon an ayiti reglemante pa **Kòd Sivil, Atik 605 e swivan**. Si pa gen testaman, byen yo separe ant eritye lejitim yo (mari/madanm, pitit, paran) dapre yon lòd presi. Si gen yon testaman, li dwe respekte **kota rezèvatè** eritye yo, sa vle di ou pa ka prive yo de tout eritaj la. Mwen sijere w fè yon deklarasyon eritaj devan yon notè pou pwoteje dwa ou.",
    },
    {
      match: ['difamasyon', 'kalomni', 'repitasyon', 'diffamation'],
      answer:
        "Difamasyon se yon enfraksyon prevwa nan **Kòd Penal la**: deklare oswa ekri yon bagay ki atake repitasyon yon moun san prèv ka mennen nan sanksyon penal ak reparasyon sivil. Ou ka depoze yon plent nan Komisarya a oswa dirèkteman devan yon jij enstriksyon, ak prèv (temwen, mesaj, dokiman) ki montre pwopo yo te fèt e yo te fè ou mal.",
    },
    {
      match: ['ekspilze', 'eksplize', 'mèt kay', 'degèpisman', 'expulse', 'propriétaire'],
      answer:
        "Yon mèt kay pa gen dwa mete w deyò san yon **desizyon tribinal**, menm si w gen reta nan peman. Li dwe swiv yon pwosedi legal: mete w an demè, mande yon jijman devan tribinal sivil la, epi jwenn yon **òdonans degèpisman** anvan nenpòt ekspilzyon fizik (**Kòd Sivil, Atik 1741 e swivan**). Yon ekspilzyon san jijman se yon aksyon ilegal ou ka denonse nan Komisarya a.",
    },
    {
      match: ['gad avi', 'arestasyon', 'polisye', 'garde à vue', 'arrestation'],
      answer:
        "Pandan yon gad avi, ou gen dwa konnen rezon arestasyon an, dwa rete an silans, dwa kontakte yon avoka ak yon manm fanmi, ak dwa yon egzamen medikal si sa nesesè. Dapre **Kòd Enstriksyon Kriminèl la**, dire gad avi a limite (jeneralman 48 èdtan, ka pwolonje yon fwa nan ka eksepsyonèl) anvan yo dwe prezante w devan yon jij.",
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
    {
      match: ['eritaj', 'siksesyon', 'testaman', 'succession', 'héritage'],
      answer:
        "La succession en Haïti est régie par le **Code Civil, Article 605 et suivants**. En l'absence de testament, les biens sont répartis entre les héritiers légitimes (conjoint, enfants, parents) selon un ordre précis. En présence d'un testament, celui-ci doit respecter la **réserve héréditaire**, c'est-à-dire que vous ne pouvez pas priver ces héritiers de la totalité de la succession. Je vous suggère de faire une déclaration de succession devant un notaire pour protéger vos droits.",
    },
    {
      match: ['difamasyon', 'kalomni', 'repitasyon', 'diffamation'],
      answer:
        "La diffamation est une infraction prévue par le **Code Pénal** : déclarer ou écrire un propos qui porte atteinte à la réputation d'une personne sans preuve peut entraîner des sanctions pénales et une réparation civile. Vous pouvez déposer une plainte au commissariat ou directement devant un juge d'instruction, avec des preuves (témoins, messages, documents) montrant que les propos ont été tenus et vous ont causé un préjudice.",
    },
    {
      match: ['ekspilze', 'eksplize', 'mèt kay', 'degèpisman', 'expulse', 'propriétaire'],
      answer:
        "Un propriétaire n'a pas le droit de vous expulser sans une **décision de justice**, même en cas de retard de paiement. Il doit suivre une procédure légale : vous mettre en demeure, demander un jugement devant le tribunal civil, puis obtenir une **ordonnance d'expulsion** avant toute expulsion physique (**Code Civil, Article 1741 et suivants**). Une expulsion sans jugement est un acte illégal que vous pouvez dénoncer au commissariat.",
    },
    {
      match: ['gad avi', 'arestasyon', 'polisye', 'garde à vue', 'arrestation'],
      answer:
        "Pendant une garde à vue, vous avez le droit de connaître le motif de l'arrestation, le droit de garder le silence, le droit de contacter un avocat et un membre de votre famille, ainsi que le droit à un examen médical si nécessaire. Selon le **Code d'Instruction Criminelle**, la durée de la garde à vue est limitée (généralement 48 heures, prolongeable une fois dans des cas exceptionnels) avant que vous ne soyez présenté devant un juge.",
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
      category: 'labor',
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
      title: 'Dwa lokatè a',
      category: 'civil',
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
    {
      id: 'c3',
      title: 'Pwosedi divòs an Ayiti',
      category: 'family',
      updatedAt: '2026-07-07T09:15:00Z',
      messages: [
        { role: 'user', content: 'Kijan yon pwosedi divòs fèt an Ayiti?' },
        {
          role: 'assistant',
          content:
            "Divò pa **konsantman mityèl** mande akò toude epòu san diskisyon sou koz la, e li pi rapid. Divò **pou fòt** mande prèv (adiltè, abandon, vyolans) e pase devan tribinal sivil la (**Kòd Sivil, Atik 213 e swivan**).",
        },
      ],
    },
    {
      id: 'c4',
      title: 'Eritaj ak siksesyon',
      category: 'family',
      updatedAt: '2026-07-05T14:20:00Z',
      messages: [
        { role: 'user', content: 'Kijan siksesyon an fèt lè pa gen testaman?' },
        {
          role: 'assistant',
          content:
            "Siksesyon an ayiti reglemante pa **Kòd Sivil, Atik 605 e swivan**. Si pa gen testaman, byen yo separe ant eritye lejitim yo dapre yon lòd presi.",
        },
      ],
    },
    {
      id: 'c5',
      title: 'Plent pou difamasyon',
      category: 'criminal',
      updatedAt: '2026-07-02T11:45:00Z',
      messages: [
        { role: 'user', content: 'Ki jan mwen ka depoze yon plent pou difamasyon?' },
        {
          role: 'assistant',
          content:
            "Difamasyon se yon enfraksyon prevwa nan **Kòd Penal la**. Ou ka depoze yon plent nan Komisarya a oswa dirèkteman devan yon jij enstriksyon, ak prèv ki montre pwopo yo te fè ou mal.",
        },
      ],
    },
  ],
  fr: [
    {
      id: 'c1',
      title: 'Contrat de travail et licenciement',
      category: 'labor',
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
      title: 'Droits du locataire',
      category: 'civil',
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
    {
      id: 'c3',
      title: 'Procédure de divorce en Haïti',
      category: 'family',
      updatedAt: '2026-07-07T09:15:00Z',
      messages: [
        { role: 'user', content: 'Comment se déroule une procédure de divorce en Haïti ?' },
        {
          role: 'assistant',
          content:
            "Le divorce par **consentement mutuel** nécessite l'accord des deux époux sans contestation sur la cause, et il est plus rapide. Le divorce **pour faute** nécessite des preuves (adultère, abandon, violence) et passe devant le tribunal civil (**Code Civil, Article 213 et suivants**).",
        },
      ],
    },
    {
      id: 'c4',
      title: 'Héritage et succession',
      category: 'family',
      updatedAt: '2026-07-05T14:20:00Z',
      messages: [
        { role: 'user', content: 'Comment se déroule une succession en l\'absence de testament ?' },
        {
          role: 'assistant',
          content:
            "La succession en Haïti est régie par le **Code Civil, Article 605 et suivants**. En l'absence de testament, les biens sont répartis entre les héritiers légitimes selon un ordre précis.",
        },
      ],
    },
    {
      id: 'c5',
      title: 'Plainte pour diffamation',
      category: 'criminal',
      updatedAt: '2026-07-02T11:45:00Z',
      messages: [
        { role: 'user', content: 'Comment déposer une plainte pour diffamation ?' },
        {
          role: 'assistant',
          content:
            "La diffamation est une infraction prévue par le **Code Pénal**. Vous pouvez déposer une plainte au commissariat ou directement devant un juge d'instruction, avec des preuves montrant que les propos vous ont causé un préjudice.",
        },
      ],
    },
  ],
}
