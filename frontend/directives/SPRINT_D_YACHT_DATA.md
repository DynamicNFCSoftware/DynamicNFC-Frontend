# SPRINT D — Yacht Data Companion Bundle

**Consumed by:** SPRINT_D_YACHT_DIRECTIVE.md §1 (`yachtVesselData.js` desc/features/specFeature content).
**32 yachts × 4 languages. IDs match yachtSeed.js 1:1. Do not edit copy — paste into the data factory.**

# Yacht Demo Data — Part A (GULF + USA)

Localized `desc`, `features`, `specFeature` blocks for `yachtSeed.js` / yacht demo portals.
4 languages: EN / AR (MSA, Arabic-Indic digits) / ES / FR. No fake metrics, no invented awards.

## GULF

```javascript
// YA-GULF-001 — Azimut Grande 35 Metri
desc: {
  en: "A commanding trideck presence berthed at Dubai Marina, the Grande 35 Metri pairs Italian design language with effortless entertaining — made for evenings when the skyline itself joins the guest list.",
  ar: "حضور مهيب بثلاثة طوابق في مرسى دبي، تجمع غراندي ٣٥ متري بين لغة التصميم الإيطالي وفن الضيافة الراقية — صُممت لأمسيات تكون فيها أضواء المدينة جزءاً من قائمة الضيوف.",
  es: "Una imponente presencia de tres cubiertas atracada en Dubai Marina: la Grande 35 Metri une el lenguaje del diseño italiano con un arte de recibir sin esfuerzo, pensada para veladas donde el propio horizonte forma parte de la lista de invitados.",
  fr: "Une présence majestueuse à trois ponts amarrée à Dubai Marina : la Grande 35 Metri allie le langage du design italien à un art de recevoir sans effort — conçue pour des soirées où la skyline elle-même figure sur la liste des invités."
},
features: [
  { en: "Fold-out sea terraces flanking the main-deck salon for open-air entertaining", ar: "شرفات بحرية قابلة للفتح على جانبي صالون الطابق الرئيسي للضيافة في الهواء الطلق", es: "Terrazas abatibles sobre el mar a ambos lados del salón principal para recibir al aire libre", fr: "Terrasses rabattables sur la mer de part et d'autre du salon principal pour recevoir en plein air" },
  { en: "Full-beam owner suite forward on the main deck with panoramic glazing", ar: "جناح المالك بعرض اليخت الكامل في مقدمة الطابق الرئيسي مع واجهات زجاجية بانورامية", es: "Suite del armador a toda manga en proa de la cubierta principal con acristalamiento panorámico", fr: "Suite armateur pleine largeur à l'avant du pont principal avec vitrages panoramiques" },
  { en: "Twin MTU engines with zero-speed stabilizers for glass-calm nights at anchor", ar: "محركان من طراز MTU مع مثبتات تعمل عند السكون لليالٍ هادئة تماماً أثناء الرسو", es: "Dos motores MTU con estabilizadores de velocidad cero para noches en calma total fondeados", fr: "Deux moteurs MTU avec stabilisateurs à l'arrêt pour des nuits d'un calme parfait au mouillage" }
],
specFeature: { en: "28 knots", ar: "٢٨ عقدة", es: "28 nudos", fr: "28 nœuds" }
```

```javascript
// YA-GULF-002 — Princess X95
desc: {
  en: "The X95 rewrites the flybridge rulebook at Jumeirah Bay — a super-flybridge spanning nearly the full length of the yacht turns every crossing of the Arabian Gulf into a private rooftop event.",
  ar: "تعيد X95 كتابة قواعد اليخوت في خليج جميرا — سطح علوي فائق يمتد على كامل طول اليخت تقريباً يحوّل كل رحلة عبر الخليج العربي إلى مناسبة خاصة تحت السماء المفتوحة.",
  es: "El X95 reescribe las reglas del flybridge en Jumeirah Bay: una supercubierta que recorre casi toda la eslora convierte cada travesía del Golfo Arábigo en un evento privado a cielo abierto.",
  fr: "Le X95 réécrit les règles du flybridge à Jumeirah Bay : un super-flybridge courant sur presque toute la longueur du yacht transforme chaque traversée du golfe Arabique en réception privée à ciel ouvert."
},
features: [
  { en: "Super flybridge running almost the entire length of the yacht — the largest usable deck space in its class layout", ar: "سطح علوي فائق يمتد على كامل طول اليخت تقريباً — مساحة معيشة خارجية استثنائية في فئته", es: "Super flybridge que recorre casi toda la eslora, con un espacio exterior habitable excepcional en su categoría", fr: "Super flybridge courant sur presque toute la longueur, offrant un espace extérieur exceptionnel dans sa catégorie" },
  { en: "Main-deck owner stateroom with private foredeck terrace access", ar: "جناح المالك في الطابق الرئيسي مع وصول خاص إلى شرفة المقدمة", es: "Camarote del armador en cubierta principal con acceso a terraza privada de proa", fr: "Cabine armateur sur le pont principal avec accès à une terrasse privée de plage avant" },
  { en: "Resin-infused hull with twin MAN V12 power for efficient long-legged Gulf cruising", ar: "هيكل مصنوع بتقنية حقن الراتنج مع محركين MAN V12 لإبحار طويل المدى وفعّال في الخليج", es: "Casco infusionado en resina con dos MAN V12 para travesías largas y eficientes por el Golfo", fr: "Coque infusée sous vide avec deux MAN V12 pour de longues croisières efficientes dans le Golfe" }
],
specFeature: { en: "26 knots", ar: "٢٦ عقدة", es: "26 nudos", fr: "26 nœuds" }
```

```javascript
// YA-GULF-003 — Sunseeker 88
desc: {
  en: "Berthed at Mina Rashid and built for the weekend escape, the Sunseeker 88 delivers 29-knot pace to the Palm and back — British craftsmanship tuned for Gulf waters.",
  ar: "راسية في ميناء راشد ومصممة لرحلات نهاية الأسبوع، تقدم صنسيكر ٨٨ سرعة ٢٩ عقدة إلى النخلة والعودة — حرفية بريطانية صُقلت لمياه الخليج.",
  es: "Atracado en Mina Rashid y creado para la escapada de fin de semana, el Sunseeker 88 alcanza 29 nudos hasta la Palmera y de vuelta: artesanía británica afinada para las aguas del Golfo.",
  fr: "Amarré à Mina Rashid et taillé pour l'escapade du week-end, le Sunseeker 88 file à 29 nœuds jusqu'à la Palm et retour — un savoir-faire britannique accordé aux eaux du Golfe."
},
features: [
  { en: "Hydraulic bathing platform with tender launch and swim-level sea access", ar: "منصة سباحة هيدروليكية مع إنزال القارب المرافق ووصول مباشر إلى مستوى البحر", es: "Plataforma de baño hidráulica con botadura de auxiliar y acceso al mar a nivel del agua", fr: "Plateforme de bain hydraulique avec mise à l'eau de l'annexe et accès direct à la mer" },
  { en: "Four ensuite cabins including a full-beam master amidships", ar: "أربع كبائن بحمامات خاصة تشمل جناحاً رئيسياً بعرض اليخت الكامل في الوسط", es: "Cuatro camarotes con baño, incluido un principal a toda manga en el centro del barco", fr: "Quatre cabines avec salle d'eau, dont une master pleine largeur au centre du navire" },
  { en: "Twin MTU engines pushing an agile 29-knot top end for fast marina-to-anchorage runs", ar: "محركان MTU يمنحان سرعة قصوى رشيقة تبلغ ٢٩ عقدة لرحلات سريعة من المرسى إلى المرسى", es: "Dos motores MTU que ofrecen una ágil punta de 29 nudos para trayectos rápidos entre marinas", fr: "Deux moteurs MTU offrant une pointe agile de 29 nœuds pour des liaisons rapides entre marinas" }
],
specFeature: { en: "29 knots", ar: "٢٩ عقدة", es: "29 nudos", fr: "29 nœuds" }
```

```javascript
// YA-GULF-004 — Benetti Oasis 40M
desc: {
  en: "The Oasis 40M brings the beach to Dubai Marina: an aft infinity pool framed by fold-down wings dissolves the line between yacht and sea, while a dedicated wellness deck restores before the next reception.",
  ar: "تجلب أوازيس ٤٠ متراً الشاطئ إلى مرسى دبي: مسبح لا متناهٍ في المؤخرة تحيط به أجنحة قابلة للفتح يمحو الحدود بين اليخت والبحر، بينما يمنح طابق العافية المخصص استرخاءً تاماً قبل الاستقبال التالي.",
  es: "El Oasis 40M lleva la playa a Dubai Marina: una piscina infinita a popa enmarcada por alas abatibles disuelve la frontera entre yate y mar, mientras una cubierta de bienestar dedicada restaura antes de la próxima recepción.",
  fr: "L'Oasis 40M amène la plage jusqu'à Dubai Marina : une piscine à débordement à l'arrière, encadrée d'ailes rabattables, efface la frontière entre le yacht et la mer, tandis qu'un pont bien-être dédié ressource avant la prochaine réception."
},
features: [
  { en: "Signature Oasis deck aft — infinity pool with fold-down wings opening the beach club to the sea", ar: "طابق أوازيس المميز في المؤخرة — مسبح لا متناهٍ مع أجنحة قابلة للفتح تصل النادي الشاطئي بالبحر مباشرة", es: "Icónica cubierta Oasis a popa: piscina infinita con alas abatibles que abren el beach club al mar", fr: "Pont Oasis signature à l'arrière — piscine à débordement et ailes rabattables ouvrant le beach club sur la mer" },
  { en: "Dedicated wellness deck with spa treatment space and sea-view fitness area", ar: "طابق مخصص للعافية مع مساحة للعلاجات وصالة لياقة بإطلالة على البحر", es: "Cubierta de bienestar dedicada con espacio de spa y zona de fitness con vistas al mar", fr: "Pont bien-être dédié avec espace de soins spa et salle de sport vue mer" },
  { en: "Six staterooms for twelve guests, led by a main-deck owner suite with private terrace", ar: "ست كبائن لاثني عشر ضيفاً، يتصدرها جناح المالك في الطابق الرئيسي مع شرفة خاصة", es: "Seis camarotes para doce invitados, encabezados por la suite del armador en cubierta principal con terraza privada", fr: "Six cabines pour douze invités, dominées par la suite armateur du pont principal avec terrasse privée" }
],
specFeature: { en: "Wellness Deck", ar: "طابق العافية", es: "Cubierta de bienestar", fr: "Pont bien-être" }
```

```javascript
// YA-GULF-005 — Pershing 9X
desc: {
  en: "Carbon-built and unapologetically fast, the Pershing 9X turns the run from Mina Rashid to the World Islands into minutes — 42 knots of Italian adrenaline with a couture interior waiting below.",
  ar: "مصنوعة من ألياف الكربون وسريعة بلا منازع، تحوّل بيرشينغ 9X الرحلة من ميناء راشد إلى جزر العالم إلى دقائق — ٤٢ عقدة من الأدرينالين الإيطالي مع مقصورة داخلية فاخرة في الأسفل.",
  es: "Construido en carbono y descaradamente veloz, el Pershing 9X convierte el trayecto de Mina Rashid a las World Islands en minutos: 42 nudos de adrenalina italiana con un interior de alta costura esperando abajo.",
  fr: "Construit en carbone et résolument rapide, le Pershing 9X réduit le trajet de Mina Rashid aux World Islands à quelques minutes — 42 nœuds d'adrénaline italienne avec un intérieur haute couture en contrebas."
},
features: [
  { en: "Carbon-fiber construction with MTU power and surface drives for a 42-knot top speed", ar: "بنية من ألياف الكربون مع محركات MTU ودفع سطحي لسرعة قصوى تبلغ ٤٢ عقدة", es: "Construcción en fibra de carbono con motores MTU y transmisiones de superficie para 42 nudos de máxima", fr: "Construction en fibre de carbone, motorisation MTU et transmissions de surface pour une pointe à 42 nœuds" },
  { en: "Stern garage housing a tender and jet ski, launched without disturbing guests", ar: "مرآب خلفي يضم قارباً مرافقاً ودراجة مائية، يتم إنزالهما دون إزعاج الضيوف", es: "Garaje de popa con auxiliar y moto de agua, botados sin molestar a los invitados", fr: "Garage arrière abritant annexe et jet-ski, mis à l'eau sans déranger les invités" },
  { en: "Three ensuite cabins with a full-beam owner suite amidships", ar: "ثلاث كبائن بحمامات خاصة مع جناح المالك بعرض اليخت الكامل في الوسط", es: "Tres camarotes con baño y suite del armador a toda manga en el centro", fr: "Trois cabines avec salle d'eau, dont une suite armateur pleine largeur au centre" }
],
specFeature: { en: "42 knots", ar: "٤٢ عقدة", es: "42 nudos", fr: "42 nœuds" }
```

```javascript
// YA-GULF-006 — Ferretti 1000
desc: {
  en: "Ferretti's flagship at Dubai Marina reads like a waterfront penthouse — an aft beach lounge on the water, a flybridge made for hosting, and five staterooms that keep the whole party aboard.",
  ar: "السفينة الرائدة من فيريتي في مرسى دبي أشبه بجناح فاخر على الواجهة البحرية — صالة شاطئية خلفية عند مستوى الماء، وسطح علوي مصمم للضيافة، وخمس كبائن تستوعب جميع الضيوف على المتن.",
  es: "El buque insignia de Ferretti en Dubai Marina se vive como un ático frente al mar: un beach lounge a popa al nivel del agua, un flybridge hecho para recibir y cinco camarotes que mantienen a toda la fiesta a bordo.",
  fr: "Le navire amiral de Ferretti à Dubai Marina se vit comme un penthouse sur l'eau : un beach lounge arrière au ras des flots, un flybridge fait pour recevoir et cinq cabines qui gardent tous les invités à bord."
},
features: [
  { en: "Aft beach lounge at water level with fold-down bulwark terraces", ar: "صالة شاطئية خلفية عند مستوى الماء مع شرفات جانبية قابلة للفتح", es: "Beach lounge a popa a nivel del agua con terrazas laterales abatibles", fr: "Beach lounge arrière au niveau de l'eau avec terrasses de pavois rabattables" },
  { en: "Expansive flybridge with spa pool, bar and alfresco dining for the full guest list", ar: "سطح علوي واسع مع مسبح صغير وبار ومساحة طعام في الهواء الطلق لجميع الضيوف", es: "Amplio flybridge con piscina de hidromasaje, bar y comedor al aire libre para todos los invitados", fr: "Vaste flybridge avec bain à remous, bar et salle à manger en plein air pour tous les invités" },
  { en: "Full-beam owner apartment amidships with lounge and dressing area", ar: "جناح المالك بعرض اليخت الكامل في الوسط مع صالة جلوس ومنطقة ملابس", es: "Apartamento del armador a toda manga en el centro con salón y vestidor", fr: "Appartement armateur pleine largeur au centre avec salon et dressing" }
],
specFeature: { en: "26 knots", ar: "٢٦ عقدة", es: "26 nudos", fr: "26 nœuds" }
```

```javascript
// YA-GULF-007 — Sanlorenzo SL90 Asymmetric
desc: {
  en: "The SL90 Asymmetric keeps its walkway to one side only — a quietly radical move that gifts the salon an extra measure of sea-facing space, berthed at Mina Rashid for owners who collect ideas, not just yachts.",
  ar: "تحتفظ SL90 أسيمتريك بممر جانبي واحد فقط — خطوة جريئة بهدوء تمنح الصالون مساحة إضافية مطلة على البحر، راسية في ميناء راشد لملاك يقتنون الأفكار لا اليخوت فحسب.",
  es: "El SL90 Asymmetric conserva el pasillo lateral en un solo costado: un gesto discretamente radical que regala al salón un espacio extra frente al mar, atracado en Mina Rashid para armadores que coleccionan ideas, no solo yates.",
  fr: "Le SL90 Asymmetric ne conserve sa coursive que d'un seul côté — un geste discrètement radical qui offre au salon un volume supplémentaire face à la mer, amarré à Mina Rashid pour des propriétaires qui collectionnent les idées, pas seulement les yachts."
},
features: [
  { en: "Design-awarded asymmetric layout — single side deck frees rare interior volume for the main salon", ar: "تصميم غير متماثل حائز على جوائز التصميم — ممر جانبي واحد يمنح الصالون الرئيسي مساحة داخلية نادرة", es: "Distribución asimétrica premiada por su diseño: un solo pasillo lateral libera un volumen interior excepcional para el salón principal", fr: "Agencement asymétrique primé pour son design — une seule coursive libère un volume intérieur rare pour le salon principal" },
  { en: "Four ensuite cabins with a full-beam master and sea-view bathroom", ar: "أربع كبائن بحمامات خاصة مع جناح رئيسي بعرض اليخت الكامل وحمام مطل على البحر", es: "Cuatro camarotes con baño, con principal a toda manga y baño con vistas al mar", fr: "Quatre cabines avec salle d'eau, dont une master pleine largeur avec salle de bains vue mer" },
  { en: "Aft beach area with fold-out platform and direct water access for toys and swimming", ar: "منطقة شاطئية خلفية مع منصة قابلة للفتح ووصول مباشر إلى الماء للألعاب المائية والسباحة", es: "Zona de playa a popa con plataforma abatible y acceso directo al agua para juguetes náuticos y baño", fr: "Espace plage arrière avec plateforme rabattable et accès direct à l'eau pour les toys et la baignade" }
],
specFeature: { en: "Design-awarded", ar: "حائزة على جوائز التصميم", es: "Premiada por su diseño", fr: "Primée pour son design" }
```

```javascript
// YA-GULF-008 — Lurssen 85M Custom
desc: {
  en: "A one-off Lürssen of 85 metres commanding Dubai Marina — helipad, eight staterooms and German engineering built to a single owner's brief. This is not a listing; it is an introduction.",
  ar: "لورسن فريدة من نوعها بطول ٨٥ متراً تتصدر مرسى دبي — مهبط للطائرات المروحية وثماني كبائن وهندسة ألمانية بُنيت وفق رؤية مالك واحد. هذا ليس عرضاً للبيع، بل دعوة للتعارف.",
  es: "Un Lürssen único de 85 metros que preside Dubai Marina: helipuerto, ocho camarotes e ingeniería alemana construida según el encargo de un solo armador. Esto no es un anuncio; es una presentación.",
  fr: "Un Lürssen unique de 85 mètres qui domine Dubai Marina — hélipont, huit cabines et une ingénierie allemande construite selon le cahier des charges d'un seul propriétaire. Ceci n'est pas une annonce ; c'est une introduction."
},
features: [
  { en: "Certified touch-and-go helipad with direct owner-deck access", ar: "مهبط معتمد للطائرات المروحية مع وصول مباشر إلى طابق المالك", es: "Helipuerto certificado touch-and-go con acceso directo a la cubierta del armador", fr: "Hélipont certifié touch-and-go avec accès direct au pont propriétaire" },
  { en: "Eight staterooms for sixteen guests, crowned by a private full-deck owner suite", ar: "ثماني كبائن لستة عشر ضيفاً، يتوّجها جناح المالك الخاص الذي يشغل طابقاً كاملاً", es: "Ocho camarotes para dieciséis invitados, coronados por una suite del armador que ocupa una cubierta completa", fr: "Huit cabines pour seize invités, couronnées par une suite armateur occupant un pont entier" },
  { en: "Beach club with spa, tender garage for multiple craft, and quarters for a full professional crew", ar: "نادٍ شاطئي مع منتجع صحي، ومرآب لعدة قوارب مرافقة، وأماكن إقامة لطاقم محترف كامل", es: "Beach club con spa, garaje para varias embarcaciones auxiliares y alojamiento para una tripulación profesional completa", fr: "Beach club avec spa, garage à annexes pour plusieurs embarcations et logements pour un équipage professionnel complet" }
],
specFeature: { en: "Custom", ar: "تصميم خاص", es: "Personalizado", fr: "Sur mesure" }
```

## USA

```javascript
// YA-USA-001 — Westport 40M
desc: {
  en: "America's proven 130-footer, berthed in San Diego and ready to work. Series-built consistency means known costs, known systems, and a tri-deck that hosts twelve guests without drama.",
  ar: "اليخت الأمريكي المجرّب بطول ١٣٠ قدماً، راسٍ في سان دييغو وجاهز للانطلاق. الإنتاج المتسلسل يعني تكاليف معروفة وأنظمة موثوقة وثلاثة طوابق تستضيف اثني عشر ضيفاً بكل سلاسة.",
  es: "El 130 pies americano de eficacia probada, atracado en San Diego y listo para navegar. Su construcción en serie significa costes conocidos, sistemas conocidos y tres cubiertas que reciben a doce invitados sin complicaciones.",
  fr: "Le 130 pieds américain qui a fait ses preuves, amarré à San Diego et prêt à naviguer. Sa construction en série garantit des coûts connus, des systèmes connus et trois ponts qui accueillent douze invités sans effort."
},
features: [
  { en: "Tri-deck layout with sky lounge and on-deck master suite forward", ar: "تصميم بثلاثة طوابق مع صالة علوية وجناح رئيسي في مقدمة الطابق الرئيسي", es: "Distribución de tres cubiertas con sky lounge y suite principal en cubierta a proa", fr: "Agencement trois-ponts avec sky lounge et suite principale sur le pont avant" },
  { en: "Six staterooms for twelve guests plus dedicated crew quarters for seven", ar: "ست كبائن لاثني عشر ضيفاً بالإضافة إلى أماكن مخصصة لطاقم من سبعة أفراد", es: "Seis camarotes para doce invitados más alojamiento dedicado para siete tripulantes", fr: "Six cabines pour douze invités plus des quartiers d'équipage dédiés pour sept personnes" },
  { en: "Twin MTU engines with long-range cruising capability for Pacific coast runs to Cabo and beyond", ar: "محركان MTU بقدرة إبحار طويلة المدى لرحلات ساحل المحيط الهادئ إلى كابو وما بعدها", es: "Dos motores MTU con autonomía de crucero de largo alcance para travesías por la costa del Pacífico hasta Cabo y más allá", fr: "Deux moteurs MTU offrant une grande autonomie de croisière pour rallier Cabo et au-delà le long de la côte Pacifique" }
],
specFeature: { en: "22 knots", ar: "٢٢ عقدة", es: "22 nudos", fr: "22 nœuds" }
```

```javascript
// YA-USA-002 — Viking 80 Convertible
desc: {
  en: "Point Loma's tournament weapon. The Viking 80 gets six anglers to the tuna grounds at 42 knots, fishes hard all day, and brings everyone home to four real cabins — not bunks.",
  ar: "سلاح البطولات في بوينت لوما. تنقل فايكينغ ٨٠ ستة صيادين إلى مناطق التونة بسرعة ٤٢ عقدة، وتصطاد بجدّ طوال اليوم، وتعيد الجميع إلى أربع كبائن حقيقية — لا مجرد أسرّة.",
  es: "El arma de torneo de Point Loma. El Viking 80 lleva a seis pescadores a las zonas de atún a 42 nudos, pesca duro todo el día y devuelve a todos a cuatro camarotes de verdad, no literas.",
  fr: "L'arme de tournoi de Point Loma. Le Viking 80 emmène six pêcheurs sur les zones à thon à 42 nœuds, pêche dur toute la journée et ramène tout le monde vers quatre vraies cabines — pas des couchettes."
},
features: [
  { en: "Tournament cockpit with mezzanine seating, transom fishbox and rigging station", ar: "منصة صيد للبطولات مع مقاعد مرتفعة وصندوق أسماك خلفي ومحطة لتجهيز المعدات", es: "Bañera de torneo con asientos en mezzanine, nevera de pesca en el espejo de popa y estación de aparejos", fr: "Cockpit de tournoi avec mezzanine, vivier de tableau arrière et poste de gréement" },
  { en: "Twin MTU engines delivering a 42-knot top end to reach the bite first", ar: "محركان MTU يمنحان سرعة قصوى تبلغ ٤٢ عقدة للوصول إلى مناطق الصيد أولاً", es: "Dos motores MTU con punta de 42 nudos para llegar primero a la picada", fr: "Deux moteurs MTU offrant une pointe à 42 nœuds pour arriver le premier sur la zone de pêche" },
  { en: "Seakeeper gyro stabilization for all-day comfort trolling offshore", ar: "نظام تثبيت جيروسكوبي من Seakeeper لراحة تدوم طوال اليوم أثناء الصيد في عرض البحر", es: "Estabilización giroscópica Seakeeper para pescar al curricán mar adentro con comodidad todo el día", fr: "Stabilisation gyroscopique Seakeeper pour un confort toute la journée en pêche à la traîne au large" }
],
specFeature: { en: "42 knots", ar: "٤٢ عقدة", es: "42 nudos", fr: "42 nœuds" }
```

```javascript
// YA-USA-003 — Hatteras M98 Panacera
desc: {
  en: "Hatteras heritage in a modern glass house at Harbor Island — the M98 Panacera pairs American build quality with a light-flooded salon and five staterooms for serious coastal cruising.",
  ar: "إرث هاتيراس في تصميم زجاجي عصري في هاربر آيلاند — تجمع M98 باناسيرا بين جودة الصناعة الأمريكية وصالون غارق بالضوء وخمس كبائن لإبحار ساحلي رفيع المستوى.",
  es: "La herencia Hatteras en una casa de cristal moderna en Harbor Island: el M98 Panacera combina la calidad de construcción americana con un salón inundado de luz y cinco camarotes para un crucero costero serio.",
  fr: "L'héritage Hatteras dans une maison de verre moderne à Harbor Island — le M98 Panacera associe la qualité de construction américaine à un salon baigné de lumière et cinq cabines pour une croisière côtière exigeante."
},
features: [
  { en: "Floor-to-ceiling salon glazing with open-plan galley and dining for effortless hosting", ar: "واجهات زجاجية من الأرض إلى السقف في الصالون مع مطبخ ومنطقة طعام مفتوحة لضيافة سلسة", es: "Acristalamiento del salón de suelo a techo con cocina y comedor de planta abierta para recibir sin esfuerzo", fr: "Vitrages toute hauteur dans le salon avec cuisine ouverte et salle à manger pour recevoir en toute simplicité" },
  { en: "Main-deck master stateroom with panoramic views and private access", ar: "جناح رئيسي في الطابق الرئيسي بإطلالات بانورامية ومدخل خاص", es: "Camarote principal en cubierta principal con vistas panorámicas y acceso privado", fr: "Cabine principale sur le pont principal avec vues panoramiques et accès privé" },
  { en: "Twin Caterpillar engines with a steady 24-knot cruise for Catalina and Baja itineraries", ar: "محركان من Caterpillar بسرعة إبحار ثابتة تبلغ ٢٤ عقدة لرحلات كاتالينا وباخا", es: "Dos motores Caterpillar con crucero estable de 24 nudos para itinerarios a Catalina y Baja", fr: "Deux moteurs Caterpillar assurant une croisière stable à 24 nœuds vers Catalina et la Basse-Californie" }
],
specFeature: { en: "24 knots", ar: "٢٤ عقدة", es: "24 nudos", fr: "24 nœuds" }
```

```javascript
// YA-USA-004 — Nordhavn 80
desc: {
  en: "Built to leave San Diego and simply keep going, the Nordhavn 80 is a true ocean-crossing explorer — full-displacement hull, serious tankage, and the range to make Hawaii a decision, not a dream.",
  ar: "بُنيت لتغادر سان دييغو وتواصل الإبحار بلا حدود، نوردهافن ٨٠ يخت استكشافي عابر للمحيطات بحق — هيكل إزاحة كاملة وخزانات وقود ضخمة ومدى يجعل الوصول إلى هاواي قراراً لا حلماً.",
  es: "Construido para salir de San Diego y simplemente seguir adelante, el Nordhavn 80 es un auténtico explorador transoceánico: casco de desplazamiento total, gran capacidad de combustible y la autonomía para hacer de Hawái una decisión, no un sueño.",
  fr: "Construit pour quitter San Diego et continuer, tout simplement, le Nordhavn 80 est un véritable explorateur transocéanique — coque à déplacement intégral, réservoirs généreux et l'autonomie qui fait d'Hawaï une décision, pas un rêve."
},
features: [
  { en: "True ocean-crossing range on a full-displacement hull engineered for blue-water passages", ar: "مدى حقيقي عابر للمحيطات على هيكل إزاحة كاملة مصمم للرحلات في أعالي البحار", es: "Autonomía transoceánica real sobre un casco de desplazamiento total diseñado para travesías de altura", fr: "Véritable autonomie transocéanique sur une coque à déplacement intégral conçue pour la navigation hauturière" },
  { en: "Active fin stabilizers for comfort underway on multi-day passages", ar: "مثبتات زعنفية نشطة لراحة تامة أثناء الإبحار في الرحلات الممتدة لعدة أيام", es: "Estabilizadores de aleta activos para navegar con confort en travesías de varios días", fr: "Stabilisateurs à ailerons actifs pour un confort constant lors des traversées de plusieurs jours" },
  { en: "Commercial-grade pilothouse with raised settee and watch berth for long night passages", ar: "قمرة قيادة بمواصفات تجارية مع مقعد مرتفع وسرير مناوبة للرحلات الليلية الطويلة", es: "Puente de gobierno de grado comercial con sofá elevado y litera de guardia para largas travesías nocturnas", fr: "Timonerie de qualité professionnelle avec banquette surélevée et couchette de quart pour les longues navigations de nuit" }
],
specFeature: { en: "Ocean-crossing", ar: "عابرة للمحيطات", es: "Transoceánico", fr: "Transocéanique" }
```

```javascript
// YA-USA-005 — Bertram 61 Convertible
desc: {
  en: "The Bertram 61 does one thing without compromise: put five anglers on fish faster than the fleet. Forty-four knots out of Point Loma, a cockpit built for battle, and a name that needs no introduction on the docks.",
  ar: "تفعل بيرترام ٦١ شيئاً واحداً دون مساومة: إيصال خمسة صيادين إلى الأسماك قبل بقية الأسطول. ٤٤ عقدة انطلاقاً من بوينت لوما، ومنصة صيد مجهزة للمعركة، واسم لا يحتاج إلى تعريف على الأرصفة.",
  es: "El Bertram 61 hace una sola cosa sin concesiones: poner a cinco pescadores sobre los peces más rápido que la flota. Cuarenta y cuatro nudos desde Point Loma, una bañera hecha para la batalla y un nombre que no necesita presentación en los muelles.",
  fr: "Le Bertram 61 fait une seule chose, sans compromis : amener cinq pêcheurs sur le poisson plus vite que le reste de la flotte. Quarante-quatre nœuds au départ de Point Loma, un cockpit taillé pour le combat et un nom qui n'a plus à se présenter sur les quais."
},
features: [
  { en: "Fighting-chair-ready cockpit with in-deck fishboxes and live bait wells", ar: "منصة صيد مجهزة لكرسي المصارعة مع صناديق أسماك مدمجة وأحواض طُعم حي", es: "Bañera preparada para silla de combate con neveras de pesca integradas y viveros de carnada viva", fr: "Cockpit prêt pour le siège de combat avec viviers de pont intégrés et bacs à appâts vivants" },
  { en: "Tuna tower with full upper controls for spotting and maneuvering on the strike", ar: "برج مراقبة التونة مع أجهزة تحكم علوية كاملة للرصد والمناورة لحظة الاصطياد", es: "Torre de atún con controles superiores completos para avistar y maniobrar en la picada", fr: "Tour à thon avec commandes hautes complètes pour repérer et manœuvrer à la touche" },
  { en: "Three cabins that turn tournament weekends into family cruising weeks", ar: "ثلاث كبائن تحوّل عطلات البطولات إلى أسابيع إبحار عائلية", es: "Tres camarotes que convierten los fines de semana de torneo en semanas de crucero familiar", fr: "Trois cabines qui transforment les week-ends de tournoi en semaines de croisière en famille" }
],
specFeature: { en: "44 knots", ar: "٤٤ عقدة", es: "44 nudos", fr: "44 nœuds" }
```

```javascript
// YA-USA-006 — Ocean Alexander 90R
desc: {
  en: "The 90R at Harbor Island is engineered around sightlines — a raised pilothouse frees the main deck for living, and side-opening terraces bring the Pacific to the salon floor.",
  ar: "صُممت 90R في هاربر آيلاند حول خطوط الرؤية — قمرة قيادة مرتفعة تحرر الطابق الرئيسي للمعيشة، وشرفات جانبية قابلة للفتح تجلب المحيط الهادئ إلى أرضية الصالون.",
  es: "El 90R de Harbor Island está diseñado en torno a las líneas de visión: un puente elevado libera la cubierta principal para vivir, y las terrazas laterales abatibles acercan el Pacífico al suelo del salón.",
  fr: "Le 90R de Harbor Island est conçu autour des perspectives : une timonerie surélevée libère le pont principal pour la vie à bord, et des terrasses latérales ouvrantes amènent le Pacifique jusqu'au salon."
},
features: [
  { en: "Raised pilothouse design freeing the entire main deck for guest living space", ar: "تصميم بقمرة قيادة مرتفعة يحرر الطابق الرئيسي بالكامل لمساحات معيشة الضيوف", es: "Diseño de puente elevado que libera toda la cubierta principal como espacio de vida para los invitados", fr: "Timonerie surélevée libérant l'intégralité du pont principal pour les espaces de vie des invités" },
  { en: "Fold-out side terraces and beach platform for water-level lounging", ar: "شرفات جانبية قابلة للفتح ومنصة شاطئية للاسترخاء عند مستوى الماء", es: "Terrazas laterales abatibles y plataforma de playa para relajarse a nivel del agua", fr: "Terrasses latérales rabattables et plateforme plage pour se détendre au ras de l'eau" },
  { en: "Full-beam master suite with walk-in wardrobe and his-and-hers bath", ar: "جناح رئيسي بعرض اليخت الكامل مع غرفة ملابس واسعة وحمام مزدوج", es: "Suite principal a toda manga con vestidor y baño doble", fr: "Suite principale pleine largeur avec dressing et double salle de bains" }
],
specFeature: { en: "Raised Pilothouse", ar: "قمرة قيادة مرتفعة", es: "Puente elevado", fr: "Timonerie surélevée" }
```

```javascript
// YA-USA-007 — Grady-White Canyon 456
desc: {
  en: "The biggest center console Grady-White builds, and it shows: quad Yamaha power off the transom, serious offshore fishing hardware, and enough comfort to make the run back from the banks feel short.",
  ar: "أكبر قارب بمقصورة قيادة مركزية تصنعه غرادي-وايت، ويظهر ذلك بوضوح: أربعة محركات Yamaha على المؤخرة، وتجهيزات صيد احترافية لعرض البحر، وراحة تجعل رحلة العودة من مناطق الصيد تبدو قصيرة.",
  es: "El center console más grande que construye Grady-White, y se nota: cuatro motores Yamaha en el espejo de popa, equipamiento serio de pesca de altura y el confort suficiente para que el regreso desde los bancos se haga corto.",
  fr: "Le plus grand center console jamais construit par Grady-White, et cela se voit : quatre moteurs Yamaha au tableau arrière, un équipement de pêche hauturière sérieux et assez de confort pour que le retour des bancs paraisse court."
},
features: [
  { en: "Quad Yamaha outboards for fast runs to the offshore banks and back before dark", ar: "أربعة محركات خارجية من Yamaha لرحلات سريعة إلى مناطق الصيد البعيدة والعودة قبل حلول الظلام", es: "Cuatro fuerabordas Yamaha para llegar rápido a los bancos de altura y volver antes del anochecer", fr: "Quatre hors-bords Yamaha pour rejoindre rapidement les bancs du large et rentrer avant la nuit" },
  { en: "Insulated fishboxes, pressurized livewells and full rod stowage for six anglers", ar: "صناديق أسماك معزولة وأحواض طُعم مضغوطة وتخزين كامل للصنارات لستة صيادين", es: "Neveras de pesca aisladas, viveros presurizados y estiba completa de cañas para seis pescadores", fr: "Viviers isothermes, bacs à appâts pressurisés et rangement complet des cannes pour six pêcheurs" },
  { en: "Air-conditioned console cabin with berth and head for overnight-capable day trips", ar: "مقصورة مكيفة داخل وحدة القيادة مع سرير وحمام لرحلات نهارية قابلة للمبيت", es: "Cabina climatizada en la consola con litera y baño para salidas de día con opción de pernocta", fr: "Cabine climatisée dans la console avec couchette et toilettes pour des sorties à la journée avec nuit possible à bord" }
],
specFeature: { en: "Quad Yamaha 600s", ar: "أربعة محركات Yamaha 600", es: "Cuatro Yamaha 600", fr: "Quatre Yamaha 600" }
```

```javascript
// YA-USA-008 — Feadship 80M Custom
desc: {
  en: "A Dutch flagship of 80 metres lying in San Diego — Feadship's custom pedigree expressed in steel and glass, with seven staterooms and the engineering depth to cross any ocean her owner names.",
  ar: "سفينة هولندية رائدة بطول ٨٠ متراً راسية في سان دييغو — إرث فيدشيب المخصص متجسداً في الفولاذ والزجاج، مع سبع كبائن وعمق هندسي يمكّنها من عبور أي محيط يختاره مالكها.",
  es: "Un buque insignia holandés de 80 metros fondeado en San Diego: el pedigrí custom de Feadship expresado en acero y cristal, con siete camarotes y la profundidad de ingeniería para cruzar cualquier océano que su armador elija.",
  fr: "Un navire amiral néerlandais de 80 mètres mouillé à San Diego — le pedigree sur mesure de Feadship exprimé dans l'acier et le verre, avec sept cabines et la profondeur d'ingénierie pour traverser tout océan que son propriétaire désignera."
},
features: [
  { en: "Private owner deck with forward terrace, study and full-beam suite", ar: "طابق خاص بالمالك مع شرفة أمامية ومكتب وجناح بعرض اليخت الكامل", es: "Cubierta privada del armador con terraza a proa, despacho y suite a toda manga", fr: "Pont propriétaire privé avec terrasse avant, bureau et suite pleine largeur" },
  { en: "Beach club with spa, sauna and gym opening to the sea on three sides", ar: "نادٍ شاطئي مع منتجع صحي وساونا وصالة رياضية تنفتح على البحر من ثلاث جهات", es: "Beach club con spa, sauna y gimnasio abierto al mar por tres costados", fr: "Beach club avec spa, sauna et salle de sport s'ouvrant sur la mer sur trois côtés" },
  { en: "Tender garage for multiple craft plus quarters for a full professional crew on global rotation", ar: "مرآب لعدة قوارب مرافقة بالإضافة إلى أماكن إقامة لطاقم محترف كامل بنظام مناوبات عالمي", es: "Garaje para varias embarcaciones auxiliares más alojamiento para una tripulación profesional completa en rotación global", fr: "Garage à annexes pour plusieurs embarcations et logements pour un équipage professionnel complet en rotation mondiale" }
],
specFeature: { en: "Dutch flagship", ar: "السفينة الهولندية الرائدة", es: "Buque insignia holandés", fr: "Navire amiral néerlandais" }
```

# Yacht Demo Data — Part B (Mexico + Canada)

Localized `desc`, `features`, `specFeature` blocks for the 16 MEX/CAN yachts.
Merge into `yachtSeed.js` / yacht demo data per directive. EN/AR/ES/FR — 4-language parity.

## MEXICO

```javascript
// YA-MEX-001 — Ferretti Custom Line 130
desc: {
  en: "A 40-metre Italian flagship made for grand entertaining between Cabo San Lucas and the Sea of Cortez. Six staterooms and sweeping open decks host family and friends in effortless resort style.",
  ar: "سفينة إيطالية رائدة بطول ٤٠ متراً صُممت للضيافة الفاخرة بين كابو سان لوكاس وبحر كورتيس. ست أجنحة وأسطح مفتوحة واسعة تستقبل العائلة والأصدقاء بأسلوب منتجعي راقٍ.",
  es: "Un buque insignia italiano de 40 metros pensado para recibir en grande entre Cabo San Lucas y el Mar de Cortés. Seis camarotes y cubiertas abiertas de gran amplitud reúnen a familia y amigos con el estilo relajado de un resort.",
  fr: "Un navire amiral italien de 40 mètres conçu pour recevoir en grand entre Cabo San Lucas et la mer de Cortés. Six cabines et de vastes ponts ouverts accueillent famille et amis dans un style de villégiature sans effort."
},
features: [
  { en: "Full-beam owner's suite with private terrace and six-cabin layout for twelve guests", ar: "جناح المالك بكامل عرض اليخت مع شرفة خاصة وتوزيع ست كبائن لاستقبال ١٢ ضيفاً", es: "Suite del armador a toda manga con terraza privada y distribución de seis camarotes para doce invitados", fr: "Suite propriétaire pleine largeur avec terrasse privée et aménagement de six cabines pour douze invités" },
  { en: "Vast sun deck with jacuzzi, alfresco dining and shaded lounge for sunset entertaining", ar: "سطح شمسي واسع مع جاكوزي ومنطقة طعام خارجية وصالة مظللة لأمسيات الغروب", es: "Amplia cubierta solar con jacuzzi, comedor al aire libre y salón sombreado para atardeceres inolvidables", fr: "Vaste pont soleil avec jacuzzi, salle à manger en plein air et salon ombragé pour les soirées au coucher du soleil" },
  { en: "Twin MTU engines with zero-speed stabilizers for calm anchorages off Los Cabos", ar: "محركان من طراز MTU مع مثبتات تعمل عند التوقف لرسوّ هادئ قبالة لوس كابوس", es: "Dos motores MTU con estabilizadores de velocidad cero para fondeos serenos frente a Los Cabos", fr: "Deux moteurs MTU avec stabilisateurs à l'arrêt pour des mouillages paisibles au large de Los Cabos" }
],
specFeature: { en: "22 knots", ar: "٢٢ عقدة", es: "22 nudos", fr: "22 nœuds" }
```

```javascript
// YA-MEX-002 — Azimut Magellano 66
desc: {
  en: "A long-range navetta that turns the run from Puerto Cancún to Isla Mujeres and Holbox into a weekend ritual. Dual-mode hull comfort with warm Italian interiors built for family cruising.",
  ar: "يخت نافيتا بعيد المدى يحوّل الرحلة من بويرتو كانكون إلى إيسلا موخيريس وهولبوكس إلى طقس أسبوعي. بدن مزدوج النمط يوفر راحة استثنائية مع تصميم داخلي إيطالي دافئ للرحلات العائلية.",
  es: "Una navetta de gran autonomía que convierte la travesía de Puerto Cancún a Isla Mujeres y Holbox en un ritual de fin de semana. Casco de doble modo con interiores italianos cálidos, hecha para navegar en familia.",
  fr: "Une navetta long rayon d'action qui transforme la traversée de Puerto Cancún vers Isla Mujeres et Holbox en rituel de fin de semaine. Confort de carène bimode et intérieurs italiens chaleureux pensés pour la croisière en famille."
},
features: [
  { en: "Dual-mode semi-displacement hull for efficient long-range Caribbean passages", ar: "بدن شبه إزاحي مزدوج النمط لعبور الكاريبي بكفاءة ولمسافات طويلة", es: "Casco semidesplazante de doble modo para travesías caribeñas eficientes y de largo alcance", fr: "Carène semi-planante bimode pour des traversées caribéennes efficaces et de longue portée" },
  { en: "Four-cabin layout with full-beam master and generous family galley", ar: "توزيع أربع كبائن مع جناح رئيسي بكامل العرض ومطبخ عائلي رحب", es: "Distribución de cuatro camarotes con máster a toda manga y cocina familiar generosa", fr: "Aménagement de quatre cabines avec cabine principale pleine largeur et cuisine familiale généreuse" },
  { en: "Protected raised pilothouse and covered cockpit dining for all-weather comfort", ar: "قمرة قيادة مرتفعة محمية ومنطقة طعام مغطاة في مؤخرة اليخت لراحة في جميع الأجواء", es: "Timonera elevada protegida y comedor de bañera techado para disfrutar con cualquier clima", fr: "Timonerie surélevée protégée et coin repas de cockpit couvert pour un confort par tous les temps" }
],
specFeature: { en: "Long-range", ar: "مدى طويل", es: "Gran autonomía", fr: "Long rayon d'action" }
```

```javascript
// YA-MEX-003 — Sunseeker Predator 74
desc: {
  en: "Pure adrenaline out of Puerto Vallarta — 38 knots across Banderas Bay with the hardtop open and the beach clubs of Punta Mita within easy reach. A sport yacht that entertains as fiercely as it performs.",
  ar: "أدرينالين خالص انطلاقاً من بويرتو فايارتا — ٣٨ عقدة عبر خليج بانديراس مع سقف قابل للفتح وشواطئ بونتا ميتا على مرمى البصر. يخت رياضي يضاهي أداءه في الضيافة قوته في الانطلاق.",
  es: "Pura adrenalina desde Puerto Vallarta: 38 nudos por la Bahía de Banderas con el techo rígido abierto y los beach clubs de Punta Mita a un paso. Un yate deportivo que recibe con la misma intensidad con la que navega.",
  fr: "Pure adrénaline au départ de Puerto Vallarta — 38 nœuds sur la baie de Banderas, toit rigide ouvert, avec les clubs de plage de Punta Mita à portée de main. Un yacht sport qui reçoit aussi intensément qu'il performe."
},
features: [
  { en: "Triple MAN V12 power delivering a 38-knot top end", ar: "ثلاثة محركات MAN V12 تحقق سرعة قصوى تبلغ ٣٨ عقدة", es: "Triple motorización MAN V12 que alcanza una máxima de 38 nudos", fr: "Triple motorisation MAN V12 offrant une pointe à 38 nœuds" },
  { en: "Retractable hardtop and open-plan saloon flowing to the cockpit bar", ar: "سقف صلب قابل للسحب وصالون مفتوح يمتد نحو بار مؤخرة اليخت", es: "Techo rígido retráctil y salón de planta abierta que fluye hacia el bar de la bañera", fr: "Toit rigide rétractable et salon décloisonné ouvert sur le bar du cockpit" },
  { en: "Hydraulic bathing platform with tender garage and water toys stowage", ar: "منصة سباحة هيدروليكية مع مرآب لقارب الخدمة ومساحة لتخزين الألعاب المائية", es: "Plataforma de baño hidráulica con garaje para auxiliar y estiba de juguetes acuáticos", fr: "Plateforme de bain hydraulique avec garage à annexe et rangement pour jouets nautiques" }
],
specFeature: { en: "38 knots", ar: "٣٨ عقدة", es: "38 nudos", fr: "38 nœuds" }
```

```javascript
// YA-MEX-004 — Princess Y85
desc: {
  en: "British craftsmanship tuned for the Mexican Caribbean, with a flybridge made for long lunches over the turquoise of Puerto Cancún. Four ensuite cabins welcome three generations aboard in quiet luxury.",
  ar: "حرفية بريطانية صُقلت لأجواء الكاريبي المكسيكي، مع سطح فلاي بريدج مثالي لوجبات غداء طويلة فوق فيروز بويرتو كانكون. أربع كبائن بحمامات خاصة تستقبل ثلاثة أجيال على متن فخامة هادئة.",
  es: "Artesanía británica afinada para el Caribe mexicano, con un flybridge hecho para sobremesas largas sobre el turquesa de Puerto Cancún. Cuatro camarotes con baño propio reciben a tres generaciones a bordo con lujo sereno.",
  fr: "Un savoir-faire britannique accordé aux Caraïbes mexicaines, avec un flybridge fait pour les longs repas au-dessus du turquoise de Puerto Cancún. Quatre cabines avec salle de bain privée accueillent trois générations dans un luxe discret."
},
features: [
  { en: "Expansive flybridge with wet bar, grill and shaded dining for eight", ar: "فلاي بريدج فسيح مع بار مجهز وشواية ومنطقة طعام مظللة لثمانية ضيوف", es: "Flybridge amplio con bar, parrilla y comedor sombreado para ocho personas", fr: "Flybridge spacieux avec bar, grill et coin repas ombragé pour huit convives" },
  { en: "Four ensuite cabins including a full-beam owner's stateroom amidships", ar: "أربع كبائن بحمامات خاصة تشمل جناح المالك بكامل العرض في منتصف اليخت", es: "Cuatro camarotes con baño en suite, incluido el del armador a toda manga en el centro del barco", fr: "Quatre cabines avec salle de bain, dont la suite propriétaire pleine largeur au milieu du navire" },
  { en: "Gyro stabilization for glassy-calm nights at anchor off Isla Mujeres", ar: "نظام تثبيت جيروسكوبي لليالٍ ساكنة تماماً أثناء الرسو قبالة إيسلا موخيريس", es: "Estabilización giroscópica para noches de calma absoluta fondeados frente a Isla Mujeres", fr: "Stabilisation gyroscopique pour des nuits parfaitement calmes au mouillage devant Isla Mujeres" }
],
specFeature: { en: "Flybridge", ar: "فلاي بريدج", es: "Flybridge", fr: "Flybridge" }
```

```javascript
// YA-MEX-005 — Boston Whaler 420 Outrage
desc: {
  en: "The serious angler's ticket to Cabo's legendary marlin grounds, built unsinkable and rigged to run. Quad Mercury 450s put the Gordo Banks within reach before the sun clears the Arch.",
  ar: "بوابة الصياد المحترف إلى مواقع المارلين الأسطورية في كابو، ببناء لا يغرق وتجهيز جاهز للانطلاق. أربعة محركات Mercury 450 تضع ضفاف غوردو في المتناول قبل أن تشرق الشمس فوق قوس كابو.",
  es: "El boleto del pescador serio a los legendarios bancos de marlín de Cabo, construida insumergible y equipada para correr. Cuatro Mercury 450 ponen los Bancos Gordo al alcance antes de que el sol asome sobre el Arco.",
  fr: "Le sésame du pêcheur sérieux vers les légendaires zones à marlin de Cabo, construite insubmersible et gréée pour la vitesse. Les quatre Mercury 450 mettent les bancs Gordo à portée avant que le soleil ne dépasse l'Arche."
},
features: [
  { en: "Quad Mercury Verado 450s with offshore range for the Gordo Banks and beyond", ar: "أربعة محركات Mercury Verado 450 بمدى بحري يغطي ضفاف غوردو وما بعدها", es: "Cuatro Mercury Verado 450 con autonomía offshore para los Bancos Gordo y más allá", fr: "Quatre Mercury Verado 450 avec l'autonomie hauturière pour les bancs Gordo et au-delà" },
  { en: "Tournament cockpit with twin livewells, insulated fish boxes and full rigging stations", ar: "مقصورة صيد احترافية مع خزانَي طُعم حي وصناديق أسماك معزولة ومحطات تجهيز كاملة", es: "Bañera de torneo con dos viveros, neveras insuladas para pesca y estaciones completas de aparejo", fr: "Cockpit de tournoi avec deux viviers, caissons à poisson isolés et postes de gréement complets" },
  { en: "Foam-filled unsinkable hull with air-conditioned console cabin for the run home", ar: "بدن لا يغرق محشو بالرغوة مع كابينة مكيفة في وحدة القيادة لرحلة العودة", es: "Casco insumergible relleno de espuma con cabina climatizada en consola para el regreso", fr: "Coque insubmersible remplie de mousse avec cabine de console climatisée pour le retour" }
],
specFeature: { en: "Quad Mercury 450s", ar: "أربعة محركات Mercury 450", es: "Cuatro Mercury 450", fr: "Quatre Mercury 450" }
```

```javascript
// YA-MEX-006 — Azimut S7
desc: {
  en: "Carbon-fibre sport elegance for fast escapes from Puerto Cancún to Cozumel's west-coast reefs. Three cabins and a glass-walled saloon keep the Caribbean in view at every turn.",
  ar: "أناقة رياضية من ألياف الكربون لرحلات سريعة من بويرتو كانكون إلى شعاب الساحل الغربي لكوزوميل. ثلاث كبائن وصالون بجدران زجاجية يُبقيان الكاريبي في الأفق من كل زاوية.",
  es: "Elegancia deportiva en fibra de carbono para escapadas veloces de Puerto Cancún a los arrecifes de la costa oeste de Cozumel. Tres camarotes y un salón acristalado mantienen el Caribe a la vista en todo momento.",
  fr: "Élégance sportive en fibre de carbone pour des escapades rapides de Puerto Cancún vers les récifs de la côte ouest de Cozumel. Trois cabines et un salon vitré gardent les Caraïbes en vue à chaque instant."
},
features: [
  { en: "Triple Volvo IPS pod drives reaching 34 knots with agile joystick docking", ar: "ثلاث وحدات دفع Volvo IPS تبلغ سرعة ٣٤ عقدة مع رسوّ سلس بعصا التحكم", es: "Triple propulsión Volvo IPS que alcanza 34 nudos con atraque ágil por joystick", fr: "Triple propulsion Volvo IPS atteignant 34 nœuds avec accostage agile au joystick" },
  { en: "Carbon-fibre superstructure lowering weight for sharper performance and efficiency", ar: "هيكل علوي من ألياف الكربون يخفف الوزن لأداء أكثر حدة وكفاءة أعلى", es: "Superestructura de fibra de carbono que reduce peso para mayor rendimiento y eficiencia", fr: "Superstructure en fibre de carbone allégeant le poids pour des performances et une efficacité accrues" },
  { en: "Open-air aft lounge with sunpads flowing to a wide swim platform", ar: "صالة خلفية مكشوفة مع أسرّة تشمس تمتد نحو منصة سباحة واسعة", es: "Salón de popa al aire libre con solárium que fluye hacia una amplia plataforma de baño", fr: "Salon arrière à ciel ouvert avec bains de soleil se prolongeant vers une large plateforme de baignade" }
],
specFeature: { en: "34 knots", ar: "٣٤ عقدة", es: "34 nudos", fr: "34 nœuds" }
```

```javascript
// YA-MEX-007 — Intrepid 477 Panacea
desc: {
  en: "Cabo's ultimate day boat — 55 knots of open-water freedom for spontaneous runs to Chileno Bay or a sunset lap past the Arch with friends. Serious offshore capability wrapped in day-club comfort.",
  ar: "قارب النهار الأمثل في كابو — ٥٥ عقدة من حرية المياه المفتوحة لرحلات عفوية إلى خليج تشيلينو أو جولة غروب أمام القوس مع الأصدقاء. قدرة بحرية جادة في قالب من راحة النوادي النهارية.",
  es: "La lancha de día definitiva de Cabo: 55 nudos de libertad en mar abierto para escapadas espontáneas a Bahía Chileno o una vuelta al atardecer frente al Arco con amigos. Capacidad offshore seria envuelta en confort de club de playa.",
  fr: "Le day boat ultime de Cabo — 55 nœuds de liberté en eaux libres pour des virées spontanées vers Chileno Bay ou un tour au coucher du soleil devant l'Arche entre amis. De sérieuses capacités hauturières dans un confort de club de jour."
},
features: [
  { en: "Stepped hull and quad outboards delivering a 55-knot top speed", ar: "بدن متدرج وأربعة محركات خارجية تحقق سرعة قصوى تبلغ ٥٥ عقدة", es: "Casco escalonado y cuatro fuerabordas que entregan una máxima de 55 nudos", fr: "Coque à redans et quatre hors-bords offrant une vitesse de pointe de 55 nœuds" },
  { en: "Forward lounge seating and shaded mezzanine for six guests in day-club style", ar: "جلسات أمامية ومنصة مظللة لستة ضيوف بأسلوب النوادي النهارية", es: "Asientos lounge en proa y mezzanine sombreado para seis invitados en plan beach club", fr: "Salon avant et mezzanine ombragée pour six invités dans l'esprit club de jour" },
  { en: "Side dive door and freshwater shower for effortless swimming and snorkeling stops", ar: "باب جانبي للغوص ودُش بمياه عذبة لتوقفات سباحة وغطس سهلة", es: "Puerta lateral de buceo y regadera de agua dulce para paradas de nado y esnórquel sin complicaciones", fr: "Porte de plongée latérale et douche d'eau douce pour des pauses baignade et apnée sans effort" }
],
specFeature: { en: "55 knots", ar: "٥٥ عقدة", es: "55 nudos", fr: "55 nœuds" }
```

```javascript
// YA-MEX-008 — Benetti Oasis 34M
desc: {
  en: "The Oasis deck redefines life at anchor off Cabo — an infinity pool and fold-down terraces that put the whole family at the waterline. Five cabins of Benetti craftsmanship for the Baja's golden evenings.",
  ar: "سطح Oasis يعيد تعريف الحياة أثناء الرسو قبالة كابو — مسبح إنفينيتي وشرفات قابلة للفتح تضع العائلة بأكملها عند مستوى الماء. خمس كبائن من حرفية Benetti لأمسيات باخا الذهبية.",
  es: "La cubierta Oasis redefine la vida fondeados frente a Cabo: una alberca infinita y terrazas abatibles que ponen a toda la familia al nivel del agua. Cinco camarotes de artesanía Benetti para las tardes doradas de Baja.",
  fr: "Le pont Oasis redéfinit la vie au mouillage devant Cabo — piscine à débordement et terrasses rabattables qui placent toute la famille au ras de l'eau. Cinq cabines du savoir-faire Benetti pour les soirées dorées de la Basse-Californie."
},
features: [
  { en: "Signature Oasis beach club with infinity pool and fold-down wing terraces", ar: "نادي شاطئي مميز بطراز Oasis مع مسبح إنفينيتي وشرفات جانبية قابلة للفتح", es: "Beach club Oasis insignia con alberca infinita y terrazas laterales abatibles", fr: "Beach club Oasis signature avec piscine à débordement et terrasses latérales rabattables" },
  { en: "Five ensuite staterooms for ten guests with main-deck owner's suite", ar: "خمسة أجنحة بحمامات خاصة لعشرة ضيوف مع جناح المالك على السطح الرئيسي", es: "Cinco camarotes con baño propio para diez invitados y suite del armador en cubierta principal", fr: "Cinq cabines avec salle de bain pour dix invités et suite propriétaire sur le pont principal" },
  { en: "Zero-speed stabilizers and transoceanic range for Sea of Cortez seasons", ar: "مثبتات تعمل عند التوقف ومدى عابر للمحيطات لمواسم بحر كورتيس", es: "Estabilizadores de velocidad cero y autonomía transoceánica para temporadas en el Mar de Cortés", fr: "Stabilisateurs à l'arrêt et autonomie transocéanique pour les saisons en mer de Cortés" }
],
specFeature: { en: "Beach Club", ar: "نادٍ شاطئي", es: "Beach Club", fr: "Beach Club" }
```

## CANADA

```javascript
// YA-CAN-001 — Nordhavn 86
desc: {
  en: "A true ocean-crossing expedition yacht at home in Coal Harbour and built for everything beyond it — Desolation Sound, Haida Gwaii, Alaska. Five cabins of quiet capability for the long Pacific Northwest season.",
  ar: "يخت استكشافي حقيقي عابر للمحيطات يتخذ من كول هاربر موطناً وقد بُني لكل ما يتجاوزه — ديسوليشن ساوند وهايدا غواي وألاسكا. خمس كبائن من القدرة الهادئة لموسم طويل في شمال غرب المحيط الهادئ.",
  es: "Un auténtico yate de expedición transoceánico con base en Coal Harbour y construido para todo lo que hay más allá: Desolation Sound, Haida Gwaii, Alaska. Cinco camarotes de capacidad silenciosa para la larga temporada del Pacífico Noroeste.",
  fr: "Un véritable yacht d'expédition transocéanique amarré à Coal Harbour et construit pour tout ce qui s'étend au-delà — Desolation Sound, Haida Gwaii, l'Alaska. Cinq cabines d'une capacité discrète pour la longue saison du Pacifique Nord-Ouest."
},
features: [
  { en: "Full-displacement hull with true ocean-crossing fuel range", ar: "بدن إزاحي كامل بمدى وقود حقيقي لعبور المحيطات", es: "Casco de desplazamiento total con autonomía real para cruzar océanos", fr: "Coque à déplacement intégral avec une autonomie réelle de traversée océanique" },
  { en: "Five-cabin layout with dedicated crew quarters and walk-in engine room", ar: "توزيع خمس كبائن مع أماكن مخصصة للطاقم وغرفة محركات يمكن الدخول إليها وقوفاً", es: "Distribución de cinco camarotes con zona de tripulación dedicada y sala de máquinas transitable", fr: "Aménagement de cinq cabines avec quartiers d'équipage dédiés et salle des machines accessible debout" },
  { en: "Heated pilothouse and Portuguese bridge for confident winter passages up the Inside Passage", ar: "قمرة قيادة مدفأة وجسر برتغالي لعبور شتوي واثق عبر الممر الداخلي", es: "Timonera calefaccionada y puente portugués para travesías invernales seguras por el Inside Passage", fr: "Timonerie chauffée et passerelle portugaise pour des passages hivernaux en toute confiance dans l'Inside Passage" }
],
specFeature: { en: "Ocean-crossing", ar: "عابر للمحيطات", es: "Transoceánico", fr: "Transocéanique" }
```

```javascript
// YA-CAN-002 — Grand Banks 85
desc: {
  en: "Understated Pacific Northwest elegance from the Royal Vancouver Yacht Club — an efficient 18-knot cruiser that makes Desolation Sound a long weekend, not an expedition. Warm teak interiors built for grey-sky comfort.",
  ar: "أناقة هادئة بطابع شمال غرب المحيط الهادئ من نادي فانكوفر الملكي لليخوت — يخت كفء بسرعة ١٨ عقدة يجعل ديسوليشن ساوند عطلة نهاية أسبوع طويلة لا رحلة استكشافية. تصميم داخلي دافئ من خشب الساج لراحة تحت السماء الرمادية.",
  es: "Elegancia sobria del Pacífico Noroeste desde el Royal Vancouver Yacht Club: un crucero eficiente de 18 nudos que convierte Desolation Sound en un fin de semana largo, no en una expedición. Cálidos interiores de teca hechos para el confort bajo cielos grises.",
  fr: "L'élégance discrète du Pacifique Nord-Ouest depuis le Royal Vancouver Yacht Club — un croiseur efficace de 18 nœuds qui fait de Desolation Sound une longue fin de semaine plutôt qu'une expédition. Des intérieurs chaleureux en teck pensés pour le confort sous les ciels gris."
},
features: [
  { en: "Warped V-hull cruising efficiently at 18 knots with coastal range to Alaska", ar: "بدن على شكل V محسّن يبحر بكفاءة عند ١٨ عقدة بمدى ساحلي يصل إلى ألاسكا", es: "Casco en V optimizado que cruza eficientemente a 18 nudos con autonomía costera hasta Alaska", fr: "Coque en V optimisée croisant efficacement à 18 nœuds avec une autonomie côtière jusqu'en Alaska" },
  { en: "Four staterooms with heated soles and a country-kitchen galley for rainy-day gatherings", ar: "أربع كبائن بأرضيات مدفأة ومطبخ عائلي رحب لجلسات الأيام الماطرة", es: "Cuatro camarotes con pisos calefaccionados y cocina estilo casa de campo para reuniones en días de lluvia", fr: "Quatre cabines avec planchers chauffants et cuisine de style champêtre pour les rassemblements des jours de pluie" },
  { en: "Covered aft deck and enclosed flybridge for four-season Pacific Northwest cruising", ar: "سطح خلفي مغطى وفلاي بريدج مغلق للإبحار في شمال غرب المحيط الهادئ على مدار الفصول الأربعة", es: "Cubierta de popa techada y flybridge cerrado para navegar el Pacífico Noroeste las cuatro estaciones", fr: "Pont arrière couvert et flybridge fermé pour la croisière quatre saisons dans le Pacifique Nord-Ouest" }
],
specFeature: { en: "18 knots", ar: "١٨ عقدة", es: "18 nudos", fr: "18 nœuds" }
```

```javascript
// YA-CAN-003 — Ocean Alexander 90R
desc: {
  en: "A raised-pilothouse flagship berthed at Granville with the volume of a much larger yacht and sightlines made for the North Shore mountains. Five staterooms host ten guests from False Creek to the Gulf Islands.",
  ar: "سفينة رائدة بقمرة قيادة مرتفعة راسية في غرانفيل، بمساحات تضاهي يختاً أكبر بكثير وإطلالات صُممت لجبال الشاطئ الشمالي. خمسة أجنحة تستقبل عشرة ضيوف من فولس كريك إلى جزر الخليج.",
  es: "Un buque insignia de timonera elevada atracado en Granville, con el volumen de un yate mucho mayor y vistas hechas para las montañas de North Shore. Cinco camarotes reciben a diez invitados desde False Creek hasta las Gulf Islands.",
  fr: "Un navire amiral à timonerie surélevée amarré à Granville, offrant le volume d'un yacht bien plus grand et des lignes de vue faites pour les montagnes de la rive nord. Cinq cabines accueillent dix invités de False Creek aux îles Gulf."
},
features: [
  { en: "Raised pilothouse with commanding 360-degree visibility for coastal navigation", ar: "قمرة قيادة مرتفعة برؤية بانورامية بزاوية ٣٦٠ درجة للملاحة الساحلية", es: "Timonera elevada con visibilidad dominante de 360 grados para la navegación costera", fr: "Timonerie surélevée offrant une visibilité imposante à 360 degrés pour la navigation côtière" },
  { en: "Five ensuite staterooms including a skylounge-level VIP with panoramic glazing", ar: "خمسة أجنحة بحمامات خاصة تشمل جناح VIP بمستوى الصالة العلوية مع واجهات زجاجية بانورامية", es: "Cinco camarotes con baño propio, incluido un VIP a nivel del skylounge con cristales panorámicos", fr: "Cinq cabines avec salle de bain, dont une VIP au niveau du skylounge avec vitrage panoramique" },
  { en: "Hydraulic swim platform and tender garage sized for a full water-sports program", ar: "منصة سباحة هيدروليكية ومرآب لقارب الخدمة يتسع لبرنامج كامل من الرياضات المائية", es: "Plataforma de baño hidráulica y garaje para auxiliar con espacio para un programa completo de deportes acuáticos", fr: "Plateforme de baignade hydraulique et garage à annexe dimensionné pour un programme complet de sports nautiques" }
],
specFeature: { en: "Raised Pilothouse", ar: "قمرة قيادة مرتفعة", es: "Timonera elevada", fr: "Timonerie surélevée" }
```

```javascript
// YA-CAN-004 — Nordhavn 68
desc: {
  en: "Trans-Pacific range in a couple-friendly package — the yacht that takes you from Coal Harbour to Hawaii, or simply deep into the Broughtons for a month off-grid. Engineering-first cruising with no compromise on warmth.",
  ar: "مدى عابر للمحيط الهادئ في تصميم مثالي للزوجين — اليخت الذي يأخذك من كول هاربر إلى هاواي، أو ببساطة إلى عمق أرخبيل بروتون لشهر بعيداً عن العالم. إبحار تتصدر فيه الهندسة دون أي تنازل عن الدفء.",
  es: "Autonomía transpacífica en un formato pensado para parejas: el yate que te lleva de Coal Harbour a Hawái, o simplemente a lo profundo de las Broughtons para un mes fuera de la red. Navegación de ingeniería primero sin sacrificar calidez.",
  fr: "Une autonomie transpacifique dans un format pensé pour deux — le yacht qui vous mène de Coal Harbour à Hawaï, ou simplement au cœur des Broughtons pour un mois hors réseau. Une croisière où l'ingénierie prime, sans compromis sur la chaleur."
},
features: [
  { en: "Single-engine full-displacement hull with trans-Pacific fuel capacity and wing engine backup", ar: "بدن إزاحي كامل بمحرك واحد وسعة وقود عابرة للمحيط الهادئ مع محرك احتياطي مساعد", es: "Casco de desplazamiento total monomotor con capacidad de combustible transpacífica y motor auxiliar de respaldo", fr: "Coque à déplacement intégral monomoteur avec capacité de carburant transpacifique et moteur d'appoint de secours" },
  { en: "Four-cabin layout with full-beam master and dedicated ship's office", ar: "توزيع أربع كبائن مع جناح رئيسي بكامل العرض ومكتب مخصص على متن اليخت", es: "Distribución de cuatro camarotes con máster a toda manga y oficina de a bordo dedicada", fr: "Aménagement de quatre cabines avec cabine principale pleine largeur et bureau de bord dédié" },
  { en: "Active fin stabilizers and dry-stack exhaust for quiet, steady offshore passages", ar: "مثبتات زعنفية نشطة ونظام عادم جاف لعبور بحري هادئ ومستقر", es: "Estabilizadores de aleta activos y escape seco para travesías offshore silenciosas y estables", fr: "Stabilisateurs à ailerons actifs et échappement sec pour des traversées hauturières silencieuses et stables" }
],
specFeature: { en: "Trans-Pacific", ar: "عابر للمحيط الهادئ", es: "Transpacífico", fr: "Transpacifique" }
```

```javascript
// YA-CAN-005 — Fleming 65
desc: {
  en: "The thinking sailor's bluewater trawler, refined over decades for exactly these waters — Inside Passage summers, Gulf Islands weekends, the occasional run north to Ketchikan. Quietly perfect, never showy.",
  ar: "يخت تراولر بحري للملّاح الحصيف، صُقل عبر عقود لهذه المياه تحديداً — صيف الممر الداخلي وعطلات جزر الخليج ورحلة شمالاً إلى كيتشيكان بين حين وآخر. كمالٌ هادئ بلا تباهٍ.",
  es: "El trawler de altura del navegante reflexivo, refinado durante décadas para exactamente estas aguas: veranos en el Inside Passage, fines de semana en las Gulf Islands, alguna travesía al norte hasta Ketchikan. Silenciosamente perfecto, nunca ostentoso.",
  fr: "Le trawler hauturier du navigateur réfléchi, peaufiné pendant des décennies pour exactement ces eaux — les étés dans l'Inside Passage, les fins de semaine aux îles Gulf, l'occasionnelle remontée vers Ketchikan. Discrètement parfait, jamais tape-à-l'œil."
},
features: [
  { en: "Semi-displacement bluewater hull with proven long-range coastal endurance", ar: "بدن شبه إزاحي للمياه العميقة بقدرة تحمل ساحلية بعيدة المدى مثبتة", es: "Casco semidesplazante de altura con probada resistencia costera de largo alcance", fr: "Coque semi-planante hauturière à l'endurance côtière longue distance éprouvée" },
  { en: "Three-cabin teak interior with Portuguese bridge and deep protected walkways", ar: "تصميم داخلي من خشب الساج بثلاث كبائن مع جسر برتغالي وممرات عميقة محمية", es: "Interior de teca de tres camarotes con puente portugués y pasillos protegidos de gran calado", fr: "Intérieur en teck de trois cabines avec passerelle portugaise et passavants profonds et protégés" },
  { en: "Twin-engine redundancy, stabilizers and heated decks for shoulder-season confidence", ar: "محركان مزدوجان للموثوقية ومثبتات وأسطح مدفأة لإبحار واثق في المواسم الانتقالية", es: "Redundancia bimotor, estabilizadores y cubiertas calefaccionadas para navegar con confianza en temporada baja", fr: "Redondance bimoteur, stabilisateurs et ponts chauffants pour naviguer en confiance en intersaison" }
],
specFeature: { en: "Bluewater", ar: "مياه عميقة", es: "De altura", fr: "Hauturier" }
```

```javascript
// YA-CAN-006 — Princess Y80
desc: {
  en: "Dark-hulled British luxury against the glass towers of Coal Harbour — 28 knots to Bowen Island after work, four cabins for the weekend beyond. Refined performance that suits Vancouver's understated waterfront style.",
  ar: "فخامة بريطانية بهيكل داكن أمام أبراج كول هاربر الزجاجية — ٢٨ عقدة إلى جزيرة بوين بعد العمل، وأربع كبائن لعطلة نهاية الأسبوع وما بعدها. أداء راقٍ يليق بأسلوب فانكوفر الهادئ على الواجهة البحرية.",
  es: "Lujo británico de casco oscuro frente a las torres de cristal de Coal Harbour: 28 nudos hasta Bowen Island al salir del trabajo, cuatro camarotes para el fin de semana y más allá. Rendimiento refinado a la altura del estilo sobrio del waterfront de Vancouver.",
  fr: "Le luxe britannique à coque sombre devant les tours de verre de Coal Harbour — 28 nœuds vers Bowen Island après le travail, quatre cabines pour la fin de semaine et au-delà. Une performance raffinée à l'image du style discret du littoral de Vancouver."
},
features: [
  { en: "Twin MAN V12s delivering a confident 28-knot cruise across the Strait of Georgia", ar: "محركا MAN V12 يحققان إبحاراً واثقاً بسرعة ٢٨ عقدة عبر مضيق جورجيا", es: "Dos MAN V12 que entregan un crucero seguro de 28 nudos por el Estrecho de Georgia", fr: "Deux MAN V12 assurant une croisière assurée à 28 nœuds dans le détroit de Georgia" },
  { en: "Four ensuite cabins with full-beam owner's stateroom and skylight-lit lower lobby", ar: "أربع كبائن بحمامات خاصة مع جناح المالك بكامل العرض وردهة سفلية مضاءة بنور طبيعي", es: "Cuatro camarotes con baño propio, máster a toda manga y vestíbulo inferior iluminado por tragaluz", fr: "Quatre cabines avec salle de bain, suite propriétaire pleine largeur et hall inférieur éclairé par puits de lumière" },
  { en: "Enclosable flybridge with wet bar and heating for year-round West Coast use", ar: "فلاي بريدج قابل للإغلاق مع بار مجهز وتدفئة للاستخدام على الساحل الغربي طوال العام", es: "Flybridge cerrable con bar y calefacción para uso todo el año en la Costa Oeste", fr: "Flybridge fermable avec bar et chauffage pour un usage à l'année sur la côte Ouest" }
],
specFeature: { en: "28 knots", ar: "٢٨ عقدة", es: "28 nudos", fr: "28 nœuds" }
```

```javascript
// YA-CAN-007 — Grady-White Canyon 376
desc: {
  en: "The West Coast angler's workhorse out of Granville — twin Yamaha 425s, a proper offshore hull, and room for six chasing chinook off the Fraser mouth or halibut up the coast. Built for real Pacific weather.",
  ar: "حصان العمل لصيادي الساحل الغربي انطلاقاً من غرانفيل — محركا Yamaha 425 وبدن بحري حقيقي ومتسع لستة صيادين يطاردون سلمون الشينوك عند مصب نهر فريزر أو الهلبوت على امتداد الساحل. بُني لأجواء المحيط الهادئ الحقيقية.",
  es: "El caballo de batalla del pescador de la Costa Oeste desde Granville: dos Yamaha 425, un casco offshore de verdad y espacio para seis tras el chinook en la boca del Fraser o el halibut costa arriba. Construida para el clima real del Pacífico.",
  fr: "Le cheval de trait du pêcheur de la côte Ouest au départ de Granville — deux Yamaha 425, une vraie coque hauturière et de la place pour six à la poursuite du saumon chinook à l'embouchure du Fraser ou du flétan plus haut sur la côte. Construite pour la vraie météo du Pacifique."
},
features: [
  { en: "Twin Yamaha 425 XTO outboards with range for offshore banks and back", ar: "محركان خارجيان Yamaha 425 XTO بمدى يغطي الضفاف البحرية ذهاباً وإياباً", es: "Dos fuerabordas Yamaha 425 XTO con autonomía para ir a los bancos offshore y volver", fr: "Deux hors-bords Yamaha 425 XTO avec l'autonomie pour rejoindre les bancs du large et revenir" },
  { en: "SeaV2 variable-deadrise hull that softens the Strait of Georgia chop", ar: "بدن SeaV2 متغير الزاوية يمتص أمواج مضيق جورجيا المتقطعة", es: "Casco SeaV2 de astilla muerta variable que suaviza la marejada del Estrecho de Georgia", fr: "Coque SeaV2 à V progressif qui adoucit le clapot du détroit de Georgia" },
  { en: "Heated helm enclosure, insulated fish boxes and full rigging for salmon and halibut seasons", ar: "مقصورة قيادة مدفأة وصناديق أسماك معزولة وتجهيز كامل لمواسم السلمون والهلبوت", es: "Puesto de mando cerrado con calefacción, neveras insuladas y aparejo completo para las temporadas de salmón y halibut", fr: "Poste de barre fermé et chauffé, caissons à poisson isolés et gréement complet pour les saisons du saumon et du flétan" }
],
specFeature: { en: "Twin Yamaha 425s", ar: "محركان Yamaha 425", es: "Dos Yamaha 425", fr: "Deux Yamaha 425" }
```

```javascript
// YA-CAN-008 — Burger 140 Raised Pilothouse
desc: {
  en: "The North American flagship of the Coal Harbour waterfront — a 140-foot Burger built to host twelve guests from English Bay galas to month-long Inside Passage explorations. Heritage steel craftsmanship, entirely at home in the rain.",
  ar: "السفينة الرائدة في أمريكا الشمالية على واجهة كول هاربر البحرية — يخت Burger بطول ١٤٠ قدماً بُني لاستضافة ١٢ ضيفاً من حفلات خليج إنجلش إلى استكشافات الممر الداخلي التي تمتد شهراً كاملاً. حرفية فولاذية عريقة تشعر بأنها في موطنها تحت المطر.",
  es: "El buque insignia norteamericano del waterfront de Coal Harbour: un Burger de 140 pies construido para recibir a doce invitados, desde galas en English Bay hasta exploraciones de un mes por el Inside Passage. Artesanía en acero con herencia, completamente en casa bajo la lluvia.",
  fr: "Le navire amiral nord-américain du littoral de Coal Harbour — un Burger de 140 pieds construit pour recevoir douze invités, des galas d'English Bay aux explorations d'un mois dans l'Inside Passage. Un savoir-faire patrimonial de l'acier, parfaitement chez lui sous la pluie."
},
features: [
  { en: "Six-stateroom layout for twelve guests with full-beam owner's deck and private study", ar: "توزيع ستة أجنحة لاثني عشر ضيفاً مع سطح خاص بالمالك بكامل العرض ومكتب خاص", es: "Distribución de seis camarotes para doce invitados con cubierta del armador a toda manga y estudio privado", fr: "Aménagement de six cabines pour douze invités avec pont propriétaire pleine largeur et bureau privé" },
  { en: "Raised pilothouse and steel hull engineered for extended high-latitude cruising", ar: "قمرة قيادة مرتفعة وبدن فولاذي مصمم لرحلات طويلة في خطوط العرض العليا", es: "Timonera elevada y casco de acero diseñados para cruceros prolongados en latitudes altas", fr: "Timonerie surélevée et coque en acier conçues pour la croisière prolongée en hautes latitudes" },
  { en: "Zero-speed stabilizers, heated decks and a tender garage for a full expedition program", ar: "مثبتات تعمل عند التوقف وأسطح مدفأة ومرآب لقارب الخدمة يخدم برنامجاً استكشافياً كاملاً", es: "Estabilizadores de velocidad cero, cubiertas calefaccionadas y garaje para auxiliar para un programa completo de expedición", fr: "Stabilisateurs à l'arrêt, ponts chauffants et garage à annexe pour un programme d'expédition complet" }
],
specFeature: { en: "North American flagship", ar: "السفينة الرائدة في أمريكا الشمالية", es: "Buque insignia norteamericano", fr: "Navire amiral nord-américain" }
```
