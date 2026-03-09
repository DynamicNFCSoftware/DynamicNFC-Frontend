import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './KhalidPortal.css';

/* ═══════════════════════════════════════════════════
   DATA — All 39 units across 3 towers
   ═══════════════════════════════════════════════════ */
const units = [
  // ── LUNA / AL QAMAR TOWER ──
  {id:"luna-ph1",n:"Al Qamar Penthouse Alpha",t:"luna",b:"penthouse",ty:"Sky Penthouse",i:3800,o:1200,tt:5000,s:"available",roi:{annual:"18%",rental:"$18,000"},f:{kitchen:["Bulthaup kitchen","Gaggenau appliances","Wine cellar","Private chef station","Outdoor kitchen"],bathroom:["Spa sanctuary","Steam room","Jacuzzi tub","Heated marble","Smart mirrors"],living:["Private pool","Home theatre","Smart automation","Art gallery walls","Triple-height ceilings"]},a:["Private Elevator","Helipad Access","Pool & Spa","Concierge 24/7","Wine Vault","4 Parking"],img:{card:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Grand Living Room"},{url:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",l:"Luxury Kitchen"},{url:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",l:"Master Suite"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Main Floor Plan"},{url:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",l:"Upper Level"}]}},
  {id:"luna-ph2",n:"Al Qamar Penthouse Beta",t:"luna",b:"penthouse",ty:"Grand Penthouse",i:3200,o:900,tt:4100,s:"available",roi:{annual:"16%",rental:"$15,000"},f:{kitchen:["Italian marble island","Sub-Zero refrigeration","Wolf range","Butler pantry"],bathroom:["Ensuite spa","Rainfall shower","Freestanding tub","Radiant floors"],living:["Wraparound terrace","Media room","Home office","Climate zones"]},a:["Private Elevator","Pool & Spa","Concierge 24/7","Wine Cellar","3 Parking"],img:{card:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living Area"},{url:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",l:"Kitchen"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Floor Plan"}]}},
  {id:"luna-sph1",n:"Al Qamar Sub-Penthouse A",t:"luna",b:"penthouse",ty:"Sub-Penthouse",i:2400,o:600,tt:3000,s:"available",roi:{annual:"14%",rental:"$11,000"},f:{kitchen:["Designer kitchen","Premium appliances","Wine cooler","Breakfast bar"],bathroom:["Spa bath","Walk-in shower","Double vanity","Heated floors"],living:["Open plan","City views","Smart home","Walk-in closet"]},a:["Private Elevator","Pool & Spa","Concierge 24/7","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living Space"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Floor Plan"}]}},
  {id:"luna-sph2",n:"Al Qamar Sub-Penthouse B",t:"luna",b:"penthouse",ty:"Sub-Penthouse",i:2200,o:500,tt:2700,s:"reserved",roi:{annual:"13%",rental:"$9,500"},f:{kitchen:["Gourmet kitchen","Miele appliances","Pantry","Quartz island"],bathroom:["Ensuite bath","Rain shower","Soaking tub"],living:["Panoramic views","Entertainment area","Home office"]},a:["Pool & Spa","Concierge 24/7","Fitness","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Main Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"luna-3br1",n:"Al Qamar Signature 3BR",t:"luna",b:"3",ty:"3 Bedroom",i:1800,o:350,tt:2150,s:"available",roi:{annual:"12%",rental:"$8,500"},f:{kitchen:["Gourmet kitchen","Quartz counters","Premium range","Island"],bathroom:["Spa master","Family bath","Heated floors"],living:["Open concept","Den","Smart home","Storage"]},a:["Pool & Spa","Fitness Center","Concierge","Lounge","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"luna-3br2",n:"Al Qamar Executive 3BR",t:"luna",b:"3",ty:"3 Bedroom + Den",i:1950,o:400,tt:2350,s:"available",roi:{annual:"13%",rental:"$9,200"},f:{kitchen:["Executive kitchen","Wolf appliances","Wine fridge","Breakfast bar"],bathroom:["Master spa","Guest bath","Powder room"],living:["Executive den","Flex space","Smart controls","Walk-ins"]},a:["Pool & Spa","Fitness Center","Concierge","Business","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"luna-3br3",n:"Al Qamar Classic 3BR",t:"luna",b:"3",ty:"3 Bedroom",i:1650,o:280,tt:1930,s:"available",roi:{annual:"11%",rental:"$7,500"},f:{kitchen:["Modern kitchen","Full appliances","Island seating"],bathroom:["Two full baths","Walk-in shower"],living:["Open living","Good storage","Balcony"]},a:["Pool & Spa","Fitness","Concierge","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"luna-4br1",n:"Al Qamar Grand 4BR",t:"luna",b:"4",ty:"4 Bedroom",i:2200,o:450,tt:2650,s:"available",roi:{annual:"14%",rental:"$10,500"},f:{kitchen:["Chef kitchen","Sub-Zero","Wolf range","Double island"],bathroom:["Master spa","Family bath","Guest bath","Powder room"],living:["Library","Media room","Smart home","Wine room"]},a:["Private Elevator","Pool & Spa","Concierge 24/7","3 Parking"],img:{card:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"luna-4br2",n:"Al Qamar Premium 4BR",t:"luna",b:"4",ty:"4 Bedroom + Den",i:2400,o:500,tt:2900,s:"available",roi:{annual:"15%",rental:"$11,500"},f:{kitchen:["Luxury kitchen","Gaggenau suite","Butler pantry","Wine cellar"],bathroom:["Spa master","En-suite","Guest bath","Powder"],living:["Home theatre","Office den","Climate zones","Art walls"]},a:["Private Elevator","Pool & Spa","Concierge 24/7","Wine Vault","3 Parking"],img:{card:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"luna-2br1",n:"Al Qamar Premium 2BR",t:"luna",b:"2",ty:"2 Bedroom",i:1200,o:200,tt:1400,s:"available",roi:{annual:"10%",rental:"$5,800"},f:{kitchen:["Modern kitchen","Quartz counters","Full appliances"],bathroom:["Spa bath","Walk-in shower"],living:["Open concept","Smart home","Balcony"]},a:["Pool & Spa","Fitness","Concierge","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"luna-2br2",n:"Al Qamar Select 2BR",t:"luna",b:"2",ty:"2 Bedroom + Den",i:1350,o:220,tt:1570,s:"available",roi:{annual:"11%",rental:"$6,200"},f:{kitchen:["Designer kitchen","Gas range","Island"],bathroom:["Two baths","Soaker tub"],living:["Den/office","City views","Smart controls"]},a:["Pool & Spa","Fitness","Concierge","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"luna-2br3",n:"Al Qamar Classic 2BR",t:"luna",b:"2",ty:"2 Bedroom",i:1050,o:150,tt:1200,s:"sold",roi:{annual:"9%",rental:"$5,200"},f:{kitchen:["Efficient kitchen","Full appliances"],bathroom:["Full bath","Powder room"],living:["Smart layout","Good storage"]},a:["Pool & Spa","Fitness","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"luna-2br4",n:"Al Qamar Studio 2BR",t:"luna",b:"2",ty:"2 Bedroom",i:980,o:120,tt:1100,s:"available",roi:{annual:"9%",rental:"$4,800"},f:{kitchen:["Compact kitchen","Full appliances"],bathroom:["Full bath","Glass shower"],living:["Open plan","Juliet balcony"]},a:["Pool & Spa","Fitness","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"luna-2br5",n:"Al Qamar Boutique 2BR",t:"luna",b:"2",ty:"2 Bedroom",i:1100,o:180,tt:1280,s:"available",roi:{annual:"10%",rental:"$5,500"},f:{kitchen:["Boutique kitchen","Quartz island","Premium appliances"],bathroom:["En-suite","Guest bath"],living:["Designer finishes","Smart home","Balcony"]},a:["Pool & Spa","Fitness","Concierge","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  // ── ASTRA / AL SAFWA TOWER ──
  {id:"astra-ph1",n:"Al Safwa Penthouse Prime",t:"astra",b:"penthouse",ty:"Sky Penthouse",i:3500,o:1000,tt:4500,s:"available",roi:{annual:"16%",rental:"$16,000"},f:{kitchen:["Bulthaup kitchen","Gaggenau appliances","Wine room","Chef island"],bathroom:["Master spa","Steam room","Jacuzzi","Heated marble"],living:["Private terrace","Home cinema","Smart automation","Art walls"]},a:["Private Elevator","Pool & Spa","Concierge 24/7","Wine Vault","4 Parking"],img:{card:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"},{url:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",l:"Kitchen"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Floor Plan"}]}},
  {id:"astra-sph1",n:"Al Safwa Sub-Penthouse",t:"astra",b:"penthouse",ty:"Sub-Penthouse",i:2600,o:700,tt:3300,s:"available",roi:{annual:"14%",rental:"$12,000"},f:{kitchen:["Designer kitchen","Premium appliances","Wine fridge","Island"],bathroom:["Spa ensuite","Rain shower","Soaker tub"],living:["Open plan","Terrace","Smart home","Walk-ins"]},a:["Private Elevator","Pool & Spa","Concierge","3 Parking"],img:{card:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"astra-3br1",n:"Al Safwa Family 3BR",t:"astra",b:"3",ty:"3 Bedroom",i:1600,o:280,tt:1880,s:"available",roi:{annual:"11%",rental:"$6,500"},f:{kitchen:["Gourmet kitchen","Quartz counters","Premium appliances","Island"],bathroom:["Primary spa","Family bath","Powder room"],living:["Open living","Den/office","Smart home package"]},a:["Pool & Spa","Fitness Center","Concierge","Kids Lounge","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"astra-3br2",n:"Al Safwa Executive 3BR",t:"astra",b:"3",ty:"3 Bedroom + Den",i:1750,o:320,tt:2070,s:"available",roi:{annual:"12%",rental:"$7,200"},f:{kitchen:["Executive kitchen","Wolf appliances","Wine fridge","Breakfast nook"],bathroom:["Spa master","Dual sinks","Steam shower","Heated floors"],living:["Executive den","Flex room","Climate control","Storage"]},a:["Pool & Spa","Fitness Center","Concierge","Business Center","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"astra-3br3",n:"Al Safwa Signature 3BR",t:"astra",b:"3",ty:"3 Bedroom",i:1450,o:220,tt:1670,s:"available",roi:{annual:"10%",rental:"$6,000"},f:{kitchen:["Modern kitchen","Full appliances","Island"],bathroom:["Two baths","Walk-in shower"],living:["Open plan","Balcony","Storage"]},a:["Pool & Spa","Fitness","Concierge","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"astra-4br1",n:"Al Safwa Executive 4BR",t:"astra",b:"4",ty:"4 Bedroom",i:2100,o:400,tt:2500,s:"available",roi:{annual:"12%",rental:"$8,800"},f:{kitchen:["Chef kitchen","Premium range","Double island"],bathroom:["Master spa","Family bath","Guest bath"],living:["Library","Media room","Smart home"]},a:["Pool & Spa","Fitness","Concierge","Business","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"astra-4br2",n:"Al Safwa Premium 4BR",t:"astra",b:"4",ty:"4 Bedroom + Den",i:2300,o:480,tt:2780,s:"available",roi:{annual:"13%",rental:"$9,800"},f:{kitchen:["Luxury kitchen","Wine cellar","Butler pantry"],bathroom:["Spa master","En-suite","Guest","Powder"],living:["Home office","Media room","Art display","Climate"]},a:["Pool & Spa","Fitness","Concierge","Wine Vault","3 Parking"],img:{card:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"astra-2br1",n:"Al Safwa Premium 2BR",t:"astra",b:"2",ty:"2 Bedroom",i:1150,o:160,tt:1310,s:"available",roi:{annual:"10%",rental:"$5,000"},f:{kitchen:["Modern kitchen","Quartz counters"],bathroom:["En-suite","Guest bath"],living:["Open plan","Balcony","Smart home"]},a:["Pool & Spa","Fitness","Concierge","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"astra-2br2",n:"Al Safwa Select 2BR",t:"astra",b:"2",ty:"2 Bedroom + Den",i:1250,o:180,tt:1430,s:"available",roi:{annual:"11%",rental:"$5,400"},f:{kitchen:["Designer kitchen","Gas range"],bathroom:["Two baths","Soaker tub"],living:["Den","City views","Smart controls"]},a:["Pool & Spa","Fitness","Concierge","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"astra-2br3",n:"Al Safwa Classic 2BR",t:"astra",b:"2",ty:"2 Bedroom",i:1000,o:120,tt:1120,s:"available",roi:{annual:"9%",rental:"$4,500"},f:{kitchen:["Efficient kitchen","Full appliances"],bathroom:["Full bath","Powder"],living:["Open plan","Balcony"]},a:["Pool & Spa","Fitness","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"astra-2br4",n:"Al Safwa Studio 2BR",t:"astra",b:"2",ty:"2 Bedroom",i:920,o:100,tt:1020,s:"sold",roi:{annual:"8%",rental:"$4,200"},f:{kitchen:["Compact kitchen","Full appliances"],bathroom:["Full bath"],living:["Smart layout","Juliet balcony"]},a:["Pool & Spa","Fitness","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"astra-2br5",n:"Al Safwa Compact 2BR",t:"astra",b:"2",ty:"2 Bedroom",i:880,o:80,tt:960,s:"available",roi:{annual:"8%",rental:"$3,800"},f:{kitchen:["Efficient kitchen"],bathroom:["Full bath"],living:["Smart layout","Balcony"]},a:["Pool & Spa","Fitness","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  // ── NOVA / AL RAWDA TOWER ──
  {id:"nova-ph1",n:"Al Rawda Penthouse Elite",t:"nova",b:"penthouse",ty:"Sky Penthouse",i:3000,o:800,tt:3800,s:"available",roi:{annual:"14%",rental:"$13,000"},f:{kitchen:["Designer kitchen","Premium appliances","Wine cooler","Chef island"],bathroom:["Spa master","Steam shower","Jacuzzi"],living:["Rooftop terrace","Home theatre","Smart automation"]},a:["Private Elevator","Pool & Spa","Concierge 24/7","3 Parking"],img:{card:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"nova-sph1",n:"Al Rawda Sub-Penthouse",t:"nova",b:"penthouse",ty:"Sub-Penthouse",i:2200,o:550,tt:2750,s:"available",roi:{annual:"12%",rental:"$10,000"},f:{kitchen:["Modern kitchen","Premium range","Wine fridge"],bathroom:["Spa bath","Walk-in shower","Double vanity"],living:["Open plan","Terrace","Smart home"]},a:["Pool & Spa","Concierge","Fitness","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"nova-3br1",n:"Al Rawda Grand 3BR",t:"nova",b:"3",ty:"3 Bedroom",i:1550,o:260,tt:1810,s:"available",roi:{annual:"10%",rental:"$6,200"},f:{kitchen:["Gourmet kitchen","Quartz counters","Island"],bathroom:["Master bath","Family bath"],living:["Open concept","Smart home","Storage"]},a:["Pool & Spa","Fitness","Concierge","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"nova-3br2",n:"Al Rawda Executive 3BR",t:"nova",b:"3",ty:"3 Bedroom + Den",i:1700,o:300,tt:2000,s:"available",roi:{annual:"11%",rental:"$7,000"},f:{kitchen:["Executive kitchen","Premium appliances","Breakfast bar"],bathroom:["Spa master","Guest bath","Powder"],living:["Den/office","Smart controls","Walk-in closets"]},a:["Pool & Spa","Fitness","Concierge","Business","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"nova-4br1",n:"Al Rawda Family 4BR",t:"nova",b:"4",ty:"4 Bedroom",i:2000,o:380,tt:2380,s:"reserved",roi:{annual:"11%",rental:"$8,200"},f:{kitchen:["Family kitchen","Premium range","Island","Pantry"],bathroom:["Master spa","Family bath","Guest bath"],living:["Play area","Home office","Smart home"]},a:["Pool & Spa","Fitness","Concierge","Kids","2 Parking"],img:{card:"https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"nova-2br1",n:"Al Rawda Premium 2BR",t:"nova",b:"2",ty:"2 Bedroom",i:1100,o:150,tt:1250,s:"available",roi:{annual:"9%",rental:"$4,800"},f:{kitchen:["Modern kitchen","Full appliances"],bathroom:["En-suite","Guest bath"],living:["Open plan","Balcony","Smart"]},a:["Pool & Spa","Fitness","Concierge","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"nova-2br2",n:"Al Rawda Urban 2BR",t:"nova",b:"2",ty:"2 Bedroom + Den",i:1200,o:170,tt:1370,s:"available",roi:{annual:"10%",rental:"$5,100"},f:{kitchen:["Urban kitchen","Gas range","Island seating"],bathroom:["Two baths","Frameless shower","Soaker tub"],living:["Home office den","City exposure","Smart controls"]},a:["Pool & Spa","Fitness","Concierge","Co-working","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"nova-2br3",n:"Al Rawda Compact 2BR",t:"nova",b:"2",ty:"2 Bedroom",i:950,o:100,tt:1050,s:"available",roi:{annual:"8%",rental:"$4,000"},f:{kitchen:["Efficient kitchen","Full appliances","Counter space"],bathroom:["Full bath","Powder room","Glass shower"],living:["Smart layout","Good storage","Juliet balcony"]},a:["Pool & Spa","Fitness","Concierge","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"nova-2br4",n:"Al Rawda Classic 2BR",t:"nova",b:"2",ty:"2 Bedroom",i:1050,o:130,tt:1180,s:"sold",roi:{annual:"9%",rental:"$4,400"},f:{kitchen:["Classic kitchen","Full appliances"],bathroom:["Full bath","Glass shower"],living:["Open plan","Balcony"]},a:["Pool & Spa","Fitness","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}},
  {id:"nova-2br5",n:"Al Rawda Studio 2BR",t:"nova",b:"2",ty:"2 Bedroom",i:900,o:80,tt:980,s:"available",roi:{annual:"8%",rental:"$3,600"},f:{kitchen:["Compact kitchen"],bathroom:["Full bath"],living:["Smart layout","Balcony"]},a:["Pool & Spa","Fitness","1 Parking"],img:{card:"https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=600",fp:"https://images.unsplash.com/photo-1712696779652-dfca8766c5f8?w=800",views:[{url:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",l:"Living"}],bp:[{url:"https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800",l:"Plan"}]}}
];

/* ═══════════════════════════════════════════════════
   TRANSLATIONS
   ═══════════════════════════════════════════════════ */
const translations = {
  en: {
    homes:"Investment Properties",amenities:"Amenities",returns:"Returns",contact:"Contact",
    welcomeKhalid:"Welcome, Khalid Al-Rashid",investorSub:"Your exclusive VIP investor portal — Premium penthouses and investment opportunities",
    premiumInvestment:"Premium Investment Collection",selectTowerSub:"Exclusive penthouse and luxury units for discerning investors",
    backToTower:"Back to Tower Selection",indoorSF:"Indoor",outdoorSF:"Outdoor",totalSF:"Total",
    investmentProjections:"Investment Projections",estAnnualROI:"Est. Annual ROI",estMonthlyRental:"Est. Monthly Rental",
    requestVIPPricing:"Request VIP Pricing",requestPaymentPlan:"Request Payment Plan",downloadFloorPlan:"Download Floor Plan",scheduleViewing:"Schedule Private Viewing",
    avgRental:"Avg. Rental/SF/Year",yoyAppreciation:"YoY Appreciation",occupancyRate:"Occupancy Rate",
    allProperties:"All Properties",penthouses:"Penthouses",bed2:"2 Bedroom",bed3:"3 Bedroom",bed4:"4 Bedroom",
    annualROI:"Annual ROI",monthlyRental:"Monthly Rental",save:"Save",compare:"Compare",
    available:"Available",reserved:"Reserved",sold:"Sold",sf:"SF",br:"BR",ph:"PH",
    planDetails:"Plan Details",plans:"Plans",views:"Views",blueprints:"Blueprints",features:"Features",amenitiesTab:"Amenities",
    bedrooms:"Bedrooms",penthouse:"Penthouse",kitchen:"Kitchen",bathroom:"Bathroom",living:"Living",
    compareProperties:"Compare Properties",selected:"selected",clear:"Clear",compareNow:"Compare Now",investmentComparison:"Investment Comparison",
    type:"Type",indoorSFLabel:"Indoor SF",outdoorSFLabel:"Outdoor SF",status:"Status",
    viewFullSize:"View Full Size",maxProperties:"Max 3 properties",selectAtLeast:"Select at least 2 properties",
    addedFavorites:"Added to favorites",pricingRequestSent:"Pricing request sent for",paymentPlanSent:"Payment plan request sent",floorPlanDownload:"Floor plan downloading...",viewingRequestSent:"Private viewing request sent!",
    artistRenderings:"*Artist renderings. Actual views may vary based on floor level and unit position.",
    archBlueprints:"*Architectural blueprints for reference. Final construction may have minor variations.",
    estROI:"Est. ROI",luxuryUnits:"Luxury Units Available",premiumSuites:"Premium Suites Available",modernResidences:"Modern Residences Available",
    skyPenthouses:"Sky Penthouses · Grand Residences",execLiving:"Executive Living · Family Residences",contemporary:"Contemporary · Urban Living",
    towerQamar:"Al Qamar Tower",towerSafwa:"Al Safwa Tower",towerRawda:"Al Rawda Tower",
    dbarGateway:"CRM Gateway",dbarKhalid:"Khalid VIP",dbarAhmed:"Ahmed Family",dbarMarket:"Marketplace",dbarDash:"Dashboard",dbarEnterprise:"Enterprise",
    amPrivateElevator:"Private Elevator",amPool:"Pool",amPoolSpa:"Pool & Spa",amIndoorPool:"Indoor Pool",amConcierge247:"Concierge 24/7",amConcierge:"Concierge",amWineVault:"Wine Vault",amWineCellar:"Wine Cellar",
    amFitness:"Fitness",amFitnessCenter:"Fitness Center",amDaycare:"Daycare",amOnsiteDaycare:"On-site Daycare",amBBQ:"BBQ",amBBQDeck:"BBQ Deck",amBBQTerrace:"BBQ Terrace",amCoWorking:"Co-working",amBikeRoom:"Bike Room",amBusiness:"Business",amBusinessCenter:"Business Center",
    amParking1:"1 Parking",amParking2:"2 Parking",amParking3:"3 Parking",amParking4:"4 Parking",
    amPlayground:"Playground",amKidsClub:"Kids Club",amKidsLounge:"Kids Lounge",amKids:"Kids",amFamilyLounge:"Family Lounge",amLounge:"Lounge",amStudyRoom:"Study Room",amGarden:"Garden",amDogRun:"Dog Run",amStorageLocker:"Storage Locker",amHelipad:"Helipad Access"
  },
  ar: {
    homes:"عقارات استثمارية",amenities:"المرافق",returns:"العوائد",contact:"اتصل بنا",
    welcomeKhalid:"مرحباً، خالد الراشد",investorSub:"بوابة المستثمر VIP الحصرية — بنتهاوس فاخرة وفرص استثمارية",
    premiumInvestment:"مجموعة استثمارية فاخرة",selectTowerSub:"بنتهاوس حصري ووحدات فاخرة للمستثمرين",
    backToTower:"العودة إلى اختيار البرج",indoorSF:"داخلي",outdoorSF:"خارجي",totalSF:"إجمالي",
    investmentProjections:"توقعات الاستثمار",estAnnualROI:"العائد السنوي المتوقع",estMonthlyRental:"الإيجار الشهري المتوقع",
    requestVIPPricing:"طلب أسعار VIP",requestPaymentPlan:"طلب خطة الدفع",downloadFloorPlan:"تحميل المخطط",scheduleViewing:"جدولة معاينة خاصة",
    avgRental:"متوسط الإيجار/قدم²/سنة",yoyAppreciation:"النمو السنوي",occupancyRate:"نسبة الإشغال",
    allProperties:"جميع العقارات",penthouses:"بنتهاوس",bed2:"غرفتين نوم",bed3:"٣ غرف نوم",bed4:"٤ غرف نوم",
    annualROI:"العائد السنوي",monthlyRental:"الإيجار الشهري",save:"حفظ",compare:"مقارنة",
    available:"متاح",reserved:"محجوز",sold:"مباع",sf:"قدم²",br:"غ.ن",ph:"بنتهاوس",
    planDetails:"تفاصيل المخطط",plans:"المخططات",views:"المناظر",blueprints:"الرسومات",features:"المميزات",amenitiesTab:"المرافق",
    bedrooms:"غرف النوم",penthouse:"بنتهاوس",kitchen:"المطبخ",bathroom:"الحمام",living:"المعيشة",
    compareProperties:"مقارنة العقارات",selected:"محدد",clear:"مسح",compareNow:"قارن الآن",investmentComparison:"مقارنة الاستثمار",
    type:"النوع",indoorSFLabel:"داخلي قدم²",outdoorSFLabel:"خارجي قدم²",status:"الحالة",
    viewFullSize:"عرض بالحجم الكامل",maxProperties:"الحد الأقصى ٣ عقارات",selectAtLeast:"حدد عقارين على الأقل",
    addedFavorites:"تمت الإضافة للمفضلة",pricingRequestSent:"تم إرسال طلب التسعير لـ",paymentPlanSent:"تم إرسال طلب خطة الدفع",floorPlanDownload:"جاري تحميل المخطط...",viewingRequestSent:"تم إرسال طلب المعاينة الخاصة!",
    artistRenderings:"*رسومات فنية. قد تختلف المناظر الفعلية حسب مستوى الطابق وموقع الوحدة.",
    archBlueprints:"*رسومات معمارية للاستدلال. قد يكون هناك اختلافات طفيفة في البناء النهائي.",
    estROI:"العائد المتوقع",luxuryUnits:"وحدات فاخرة متاحة",premiumSuites:"أجنحة فاخرة متاحة",modernResidences:"وحدات عصرية متاحة",
    skyPenthouses:"بنتهاوس سماوي · إقامات كبرى",execLiving:"حياة راقية · إقامات عائلية",contemporary:"عصري · حياة حضرية",
    towerQamar:"برج القمر",towerSafwa:"برج الصفوة",towerRawda:"برج الروضة",
    dbarGateway:"بوابة CRM",dbarKhalid:"خالد VIP",dbarAhmed:"أحمد العائلة",dbarMarket:"السوق",dbarDash:"لوحة التحكم",dbarEnterprise:"المؤسسات",
    amPrivateElevator:"مصعد خاص",amPool:"مسبح",amPoolSpa:"مسبح وسبا",amIndoorPool:"مسبح داخلي",amConcierge247:"كونسيرج 24/7",amConcierge:"كونسيرج",amWineVault:"قبو نبيذ",amWineCellar:"قبو نبيذ",
    amFitness:"لياقة",amFitnessCenter:"مركز لياقة",amDaycare:"حضانة",amOnsiteDaycare:"حضانة بالموقع",amBBQ:"شواء",amBBQDeck:"منطقة شواء",amBBQTerrace:"تراس شواء",amCoWorking:"عمل مشترك",amBikeRoom:"غرفة دراجات",amBusiness:"أعمال",amBusinessCenter:"مركز أعمال",
    amParking1:"1 موقف",amParking2:"2 موقف",amParking3:"3 موقف",amParking4:"4 موقف",
    amPlayground:"ملعب أطفال",amKidsClub:"نادي الأطفال",amKidsLounge:"صالة أطفال",amKids:"أطفال",amFamilyLounge:"صالة عائلية",amLounge:"صالة",amStudyRoom:"غرفة دراسة",amGarden:"حديقة",amDogRun:"منطقة الكلاب",amStorageLocker:"خزانة تخزين",amHelipad:"مهبط طائرات"
  }
};

const amenityMap = {"Private Elevator":"amPrivateElevator","Pool":"amPool","Pool & Spa":"amPoolSpa","Indoor Pool":"amIndoorPool","Concierge 24/7":"amConcierge247","Concierge":"amConcierge","Wine Vault":"amWineVault","Wine Cellar":"amWineCellar","Fitness":"amFitness","Fitness Center":"amFitnessCenter","Daycare":"amDaycare","On-site Daycare":"amOnsiteDaycare","BBQ":"amBBQ","BBQ Deck":"amBBQDeck","BBQ Terrace":"amBBQTerrace","Co-working":"amCoWorking","Bike Room":"amBikeRoom","Business":"amBusiness","Business Center":"amBusinessCenter","1 Parking":"amParking1","2 Parking":"amParking2","3 Parking":"amParking3","4 Parking":"amParking4","Playground":"amPlayground","Kids Club":"amKidsClub","Kids Lounge":"amKidsLounge","Kids":"amKids","Family Lounge":"amFamilyLounge","Lounge":"amLounge","Study Room":"amStudyRoom","Garden":"amGarden","Dog Run":"amDogRun","Storage Locker":"amStorageLocker","Helipad Access":"amHelipad"};

const featuresAr = {
  "Bulthaup kitchen":"مطبخ بولتهاوب","Gaggenau appliances":"أجهزة غاغيناو","Wine cellar":"قبو نبيذ","Chef station":"محطة الشيف","Gourmet kitchen":"مطبخ فاخر","Quartz island":"جزيرة كوارتز",
  "Premium range":"موقد فاخر","Italian marble":"رخام إيطالي","Sub-Zero":"سب-زيرو","Wolf range":"موقد وولف","Modern kitchen":"مطبخ عصري","Full appliances":"أجهزة كاملة",
  "Breakfast bar":"بار إفطار","Executive kitchen":"مطبخ تنفيذي","Wolf appliances":"أجهزة وولف","Wine fridge":"ثلاجة نبيذ","Compact kitchen":"مطبخ مدمج","Efficient kitchen":"مطبخ فعّال",
  "Kitchen":"مطبخ","Appliances":"أجهزة","Quartz counters":"أسطح كوارتز","Designer kitchen":"مطبخ مصمم","Wine cooler":"مبرد نبيذ","Outdoor kitchen":"مطبخ خارجي",
  "Premium appliances":"أجهزة فاخرة","Gas range":"موقد غاز","Pantry":"مخزن","Butler pantry":"مخزن الخدمة","Walk-in pantry":"مخزن كبير","Urban kitchen":"مطبخ حضري",
  "Island":"جزيرة مطبخ","Island seating":"جزيرة بمقاعد","Double island":"جزيرتان","Chef island":"جزيرة الشيف","Italian marble island":"جزيرة رخام إيطالي",
  "Counter space":"مساحة كاونتر","Chef kitchen":"مطبخ الشيف","Luxury kitchen":"مطبخ فخم","Family kitchen":"مطبخ عائلي","Boutique kitchen":"مطبخ بوتيك","Classic kitchen":"مطبخ كلاسيكي",
  "Gaggenau suite":"مجموعة غاغيناو","Sub-Zero refrigeration":"ثلاجة سب-زيرو","Breakfast nook":"ركن إفطار","Wine room":"غرفة نبيذ","Private chef station":"محطة شيف خاصة","Miele appliances":"أجهزة ميلي",
  "Spa sanctuary":"ملاذ سبا","Steam room":"غرفة بخار","Jacuzzi":"جاكوزي","Smart mirrors":"مرايا ذكية","Ensuite spa":"سبا داخلي","Rain shower":"دش مطري","Freestanding tub":"حوض قائم",
  "Master spa":"سبا رئيسي","Guest bath":"حمام الضيوف","Powder room":"غرفة مسحوق","Heated floors":"أرضيات مدفأة","Ensuite":"حمام داخلي","Full bath":"حمام كامل",
  "Spa bath":"حمام سبا","Walk-in shower":"دش كبير","Double vanity":"حوضان مزدوجان","Jacuzzi tub":"حوض جاكوزي","Family bath":"حمام عائلي","Spa master":"سبا رئيسي",
  "Powder":"غرفة مسحوق","En-suite":"حمام داخلي","Two baths":"حمامان","Soaker tub":"حوض نقع","Glass shower":"دش زجاجي","Heated marble":"رخام مدفأ",
  "Steam shower":"دش بخاري","Rainfall shower":"دش مطري","Radiant floors":"أرضيات إشعاعية","Spa ensuite":"سبا داخلي","Soaking tub":"حوض نقع","Frameless shower":"دش بدون إطار",
  "Dual sinks":"حوضان","Two full baths":"حمامان كاملان","Ensuite bath":"حمام داخلي","Primary spa":"سبا رئيسي",
  "Private pool":"مسبح خاص","Home theatre":"مسرح منزلي","Smart automation":"أتمتة ذكية","Triple-height ceilings":"أسقف ثلاثية الارتفاع","Wraparound terrace":"تراس محيطي","Media room":"غرفة ميديا",
  "Climate zones":"مناطق مناخية","Open concept":"تصميم مفتوح","Den":"غرفة مكتب","Smart home":"منزل ذكي","Open plan":"تصميم مفتوح","Balcony":"شرفة","Storage":"تخزين",
  "Smart layout":"تصميم ذكي","Rooftop terrace":"تراس سطح","City views":"إطلالات المدينة","Walk-in closet":"خزانة ملابس كبيرة","Art gallery walls":"جدران معرض فني",
  "Executive den":"مكتب تنفيذي","Flex space":"مساحة مرنة","Walk-ins":"خزائن كبيرة","Smart controls":"تحكم ذكي",
  "Home office":"مكتب منزلي","Open living":"معيشة مفتوحة","Den/office":"مكتب/غرفة","Juliet balcony":"شرفة جولييت","Terrace":"تراس",
  "Play area":"منطقة لعب","Library":"مكتبة","Flex room":"غرفة مرنة","Art walls":"جدران فنية","Walk-in closets":"خزائن كبيرة","Good storage":"تخزين جيد",
  "Private terrace":"تراس خاص","Panoramic views":"إطلالات بانورامية","Entertainment area":"منطقة ترفيه","Home cinema":"سينما منزلية",
  "Climate control":"تحكم مناخي","Climate":"مناخ","City exposure":"إطلالة المدينة","Designer finishes":"تشطيبات مصممة","Smart home package":"حزمة منزل ذكي","Smart":"ذكي",
  "Home office den":"مكتب منزلي","Art display":"عرض فني","Office den":"مكتب","Wine room":"غرفة نبيذ"
};

const towerNames = { luna: "Al Qamar Tower", astra: "Al Safwa Tower", nova: "Al Rawda Tower" };

/* ═══════════════════════════════════════════════════
   TRACKING (localStorage bridge to dashboard)
   ═══════════════════════════════════════════════════ */
const DNFC_KEY = 'dnfc_events';
function track(evt, data) {
  try {
    let log = JSON.parse(localStorage.getItem(DNFC_KEY) || '[]');
    log.push({ ts: Date.now(), evt, d: data || {}, p: 'khalid', v: 'Khalid Al-Rashid', tp: 'vip' });
    if (log.length > 200) log = log.slice(-200);
    localStorage.setItem(DNFC_KEY, JSON.stringify(log));
  } catch(e) {}
}

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */
export default function KhalidPortal() {
  const navigate = useNavigate();
  const [lang, setLangState] = useState(() => localStorage.getItem('dnfc_lang') || 'en');
  const [currentTower, setCurrentTower] = useState(null);
  const [bedFilter, setBedFilter] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [compareList, setCompareList] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [modalSection, setModalSection] = useState('plans');
  const [compareOpen, setCompareOpen] = useState(false);
  const [fullsizeImg, setFullsizeImg] = useState(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const t = useCallback((key) => (translations[lang] || translations.en)[key] || translations.en[key] || key, [lang]);
  const tFeature = useCallback((f) => lang === 'ar' && featuresAr[f] ? featuresAr[f] : f, [lang]);
  const tAmenity = useCallback((a) => amenityMap[a] ? t(amenityMap[a]) : a, [t]);

  // Set RTL
  useEffect(() => {
    if (lang === 'ar') document.documentElement.setAttribute('dir', 'rtl');
    else document.documentElement.removeAttribute('dir');
  }, [lang]);

  // Track entry
  useEffect(() => {
    track('vip_portal_entry', { portal: 'khalid-al-rashid', vip_name: 'Khalid Al-Rashid', persona: 'investor' });
  }, []);

  function setLang(l) {
    setLangState(l);
    localStorage.setItem('dnfc_lang', l);
  }

  function showToast(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2500);
  }

  function selectTower(id) {
    setCurrentTower(id);
    setBedFilter('all');
    track('tower_selected', { tower: id, tower_name: towerNames[id] });
  }

  function backToTowers() {
    track('back_to_towers');
    setCurrentTower(null);
  }

  function toggleFav(id) {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); track('favorite_remove', {unit_id:id}); }
      else { next.add(id); track('favorite_add', {unit_id:id}); showToast(t('addedFavorites')); }
      return next;
    });
  }

  function toggleCompare(id) {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) { showToast(t('maxProperties')); return prev; }
      return [...prev, id];
    });
  }

  function openPropertyModal(id) {
    const u = units.find(u => u.id === id);
    if (!u) return;
    track('unit_view', { unit_id: id, type: u.ty, tower: u.t });
    setSelectedUnit(u);
    setModalSection('plans');
  }

  function openCompareModal() {
    if (compareList.length < 2) { showToast(t('selectAtLeast')); return; }
    track('comparison_view', { units: compareList });
    setCompareOpen(true);
  }

  // Derived data
  const towerUnits = currentTower ? units.filter(u => u.t === currentTower) : [];
  const bedTypes = [...new Set(towerUnits.map(u => u.b))];
  const filteredUnits = bedFilter === 'all' ? towerUnits : towerUnits.filter(u => u.b === bedFilter);
  const bedLabels = { penthouse: t('penthouses'), '2': t('bed2'), '3': t('bed3'), '4': t('bed4') };
  const statusLabels = { available: t('available'), reserved: t('reserved'), sold: t('sold') };

  const demoLinks = [
    { path: '/enterprise/crmdemo', label: t('dbarGateway') },
    { path: '/enterprise/crmdemo/khalid', label: t('dbarKhalid'), active: true },
    { path: '/enterprise/crmdemo/ahmed', label: t('dbarAhmed') },
    { path: '/enterprise/crmdemo/marketplace', label: t('dbarMarket') },
    { path: '/enterprise/crmdemo/dashboard', label: t('dbarDash') },
    { path: '/enterprise', label: t('dbarEnterprise') },
  ];

  return (
    <div className="k-root">
      <div className="k-bg-mesh" />

      {/* ═══ DEMO BAR ═══ */}
      <div className="k-demo-bar">
        {demoLinks.map((link, i) => (
          <React.Fragment key={link.path}>
            {i > 0 && <span className="k-sep">·</span>}
            <a className={link.active ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigate(link.path); }}>
              {link.label}
            </a>
          </React.Fragment>
        ))}
      </div>

      {/* ═══ HEADER ═══ */}
      <header className="k-header">
        <div className="k-header-inner">
          <span className="k-logo" onClick={() => navigate('/enterprise/crmdemo')}>
            Al Noor<span className="k-logo-gold">Residences</span>
          </span>
          <nav className="k-nav">
            <span className="k-nav-link active">{t('homes')}</span>
            <span className="k-nav-link">{t('amenities')}</span>
            <span className="k-nav-link">{t('returns')}</span>
            <span className="k-nav-link">{t('contact')}</span>
          </nav>
          <div className="k-lang-switcher">
            <button className={`k-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
            <button className={`k-lang-btn ${lang === 'ar' ? 'active' : ''}`} onClick={() => setLang('ar')}>ع</button>
          </div>
        </div>
      </header>

      {/* ═══ VIP BANNER ═══ */}
      <div className="k-vip-banner">
        <h1>{t('welcomeKhalid')}</h1>
        <p>{t('investorSub')}</p>
      </div>

      <main className="k-main">
        {/* ═══ TOWER SELECTION ═══ */}
        {!currentTower && (
          <section className="k-tower-selection">
            <h2 className="k-towers-heading">{t('premiumInvestment')}</h2>
            <p className="k-towers-sub">{t('selectTowerSub')}</p>
            <div className="k-towers-grid">
              {[
                { id: 'luna', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600', name: t('towerQamar'), count: 14, avail: t('luxuryUnits'), sub: t('skyPenthouses') },
                { id: 'astra', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600', name: t('towerSafwa'), count: 13, avail: t('premiumSuites'), sub: t('execLiving') },
                { id: 'nova', img: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?w=600', name: t('towerRawda'), count: 12, avail: t('modernResidences'), sub: t('contemporary') },
              ].map((tower, i) => (
                <div key={tower.id} className="k-tower-card k-fade-in" style={{ animationDelay: `${(i + 1) * 0.1}s` }} onClick={() => selectTower(tower.id)}>
                  <img className="k-tower-card-img" src={tower.img} alt={tower.name} />
                  <span className="k-tower-card-badge">{t('estROI')}</span>
                  <div className="k-tower-card-body">
                    <h3>{tower.name}</h3>
                    <div className="k-avail">{tower.count} {tower.avail}</div>
                    <div className="k-roi">{tower.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══ PROPERTIES SCREEN ═══ */}
        {currentTower && (
          <section className="k-properties-screen active">
            <button className="k-back-btn" onClick={backToTowers}>← {t('backToTower')}</button>
            <h2 className="k-tower-title">{towerNames[currentTower]}</h2>

            <div className="k-invest-overview">
              <div className="k-invest-stat"><div className="k-val">8-18%</div><div className="k-lbl">{t('estAnnualROI')}</div></div>
              <div className="k-invest-stat"><div className="k-val">$2,500</div><div className="k-lbl">{t('avgRental')}</div></div>
              <div className="k-invest-stat"><div className="k-val">14%</div><div className="k-lbl">{t('yoyAppreciation')}</div></div>
              <div className="k-invest-stat"><div className="k-val">99%</div><div className="k-lbl">{t('occupancyRate')}</div></div>
            </div>

            <div className="k-bed-tabs">
              <button className={`k-bed-tab ${bedFilter === 'all' ? 'active' : ''}`} onClick={() => { setBedFilter('all'); track('bedroom_filter', {filter:'all'}); }}>{t('allProperties')}</button>
              {bedTypes.map(b => (
                <button key={b} className={`k-bed-tab ${bedFilter === b ? 'active' : ''}`} onClick={() => { setBedFilter(b); track('bedroom_filter', {filter:b}); }}>
                  {bedLabels[b] || b}
                </button>
              ))}
            </div>

            <div className="k-units-grid">
              {filteredUnits.map((u, i) => (
                <div key={u.id} className="k-unit-card k-fade-in" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => openPropertyModal(u.id)}>
                  <div style={{ overflow: 'hidden' }}><img className="k-unit-card-img" src={u.img.card} alt={u.n} loading="lazy" /></div>
                  <span className={`k-unit-badge ${u.s}`}>{statusLabels[u.s] || u.s}</span>
                  <div className="k-unit-card-body">
                    <div className="k-unit-card-type">{u.ty}</div>
                    <div className="k-unit-card-name">{u.n}</div>
                    <div className="k-unit-card-specs">
                      <span>{u.tt.toLocaleString()} {t('sf')}</span>
                      <span>·</span>
                      <span>{u.b === 'penthouse' ? t('ph') : u.b + ' ' + t('br')}</span>
                    </div>
                    <div className="k-unit-card-roi">
                      <div><span className="k-roi-val">{u.roi.annual}</span><div className="k-roi-lbl">{t('annualROI')}</div></div>
                      <div style={{ textAlign: 'right' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.roi.rental}</span><div className="k-roi-lbl">{t('monthlyRental')}</div></div>
                    </div>
                  </div>
                  <div className="k-unit-card-actions" onClick={e => e.stopPropagation()}>
                    <button className={`k-unit-action-btn ${favorites.has(u.id) ? 'fav-active' : ''}`} onClick={() => toggleFav(u.id)}>♥ {t('save')}</button>
                    <button className="k-unit-action-btn" onClick={() => toggleCompare(u.id)}>⚖ {t('compare')}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ═══ PROPERTY MODAL ═══ */}
      {selectedUnit && (
        <div className="k-modal-backdrop open" onClick={() => setSelectedUnit(null)}>
          <div className="k-modal" onClick={e => e.stopPropagation()}>
            <div className="k-modal-header">
              <span className="k-modal-title">{t('planDetails')}</span>
              <button className="k-modal-close" onClick={() => setSelectedUnit(null)}>✕</button>
            </div>
            <div className="k-modal-tabs">
              {['plans','views','blueprints','features','amenities'].map(sec => (
                <button key={sec} className={`k-modal-tab ${modalSection === sec ? 'active' : ''}`}
                  onClick={() => { setModalSection(sec); track('tab_click', {section: sec, unit_id: selectedUnit.id}); }}>
                  {t(sec === 'amenities' ? 'amenitiesTab' : sec)}
                </button>
              ))}
            </div>

            {/* Plans */}
            <div className={`k-modal-section ${modalSection === 'plans' ? 'active' : ''}`}>
              <div className="k-plan-viewer">
                <div className="k-plan-image-wrap">
                  <img src={selectedUnit.img.fp} alt="Floor Plan" />
                  <button className="k-zoom-btn" onClick={() => setFullsizeImg(selectedUnit.img.fp)}>🔍 {t('viewFullSize')}</button>
                </div>
                <div className="k-plan-details">
                  <div className="k-plan-name-block">
                    <h3>{selectedUnit.n}</h3>
                    <div className="k-sub">{selectedUnit.ty} — {towerNames[selectedUnit.t]}</div>
                    <div className={`k-status-tag k-unit-badge ${selectedUnit.s}`}>{statusLabels[selectedUnit.s]}</div>
                  </div>
                  <div className="k-plan-specs-grid">
                    <div className="k-plan-spec"><div className="k-lbl">{t('indoorSF')}</div><div className="k-val">{selectedUnit.i.toLocaleString()} {t('sf')}</div></div>
                    <div className="k-plan-spec"><div className="k-lbl">{t('outdoorSF')}</div><div className="k-val">{selectedUnit.o.toLocaleString()} {t('sf')}</div></div>
                    <div className="k-plan-spec"><div className="k-lbl">{t('totalSF')}</div><div className="k-val">{selectedUnit.tt.toLocaleString()} {t('sf')}</div></div>
                    <div className="k-plan-spec"><div className="k-lbl">{t('bedrooms')}</div><div className="k-val">{selectedUnit.b === 'penthouse' ? t('penthouse') : selectedUnit.b}</div></div>
                  </div>
                  <div className="k-roi-block">
                    <h4>{t('investmentProjections')}</h4>
                    <div className="k-roi-grid">
                      <div className="k-roi-item"><div className="k-val">{selectedUnit.roi.annual}</div><div className="k-lbl">{t('estAnnualROI')}</div></div>
                      <div className="k-roi-item"><div className="k-val">{selectedUnit.roi.rental}</div><div className="k-lbl">{t('estMonthlyRental')}</div></div>
                    </div>
                  </div>
                  <div className="k-cta-grid">
                    <button className="k-cta-btn primary" onClick={() => { track('cta_click',{cta_name:'request_pricing',unit_id:selectedUnit.id}); showToast(t('pricingRequestSent')+' '+selectedUnit.n); }}>{t('requestVIPPricing')}</button>
                    <button className="k-cta-btn primary" onClick={() => { track('cta_click',{cta_name:'request_payment_plan',unit_id:selectedUnit.id}); showToast(t('paymentPlanSent')); }}>{t('requestPaymentPlan')}</button>
                    <button className="k-cta-btn" onClick={() => { track('cta_click',{cta_name:'download_brochure',unit_id:selectedUnit.id}); showToast(t('floorPlanDownload')); }}>{t('downloadFloorPlan')}</button>
                    <button className="k-cta-btn" onClick={() => { track('cta_click',{cta_name:'book_viewing',unit_id:selectedUnit.id}); showToast(t('viewingRequestSent')); }}>{t('scheduleViewing')}</button>
                  </div>
                </div>
              </div>
              <p className="k-disclaimer">{t('artistRenderings')}</p>
            </div>

            {/* Views */}
            <div className={`k-modal-section ${modalSection === 'views' ? 'active' : ''}`}>
              <div className="k-gallery-grid">
                {(selectedUnit.img.views || []).map((v, i) => (
                  <div key={i} className="k-gallery-item" onClick={() => setFullsizeImg(v.url)}>
                    <img src={v.url} alt={v.l} loading="lazy" />
                    <div className="k-gallery-label">{v.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blueprints */}
            <div className={`k-modal-section ${modalSection === 'blueprints' ? 'active' : ''}`}>
              <div className="k-gallery-grid">
                {(selectedUnit.img.bp || []).map((v, i) => (
                  <div key={i} className="k-gallery-item" onClick={() => setFullsizeImg(v.url)}>
                    <img src={v.url} alt={v.l} loading="lazy" />
                    <div className="k-gallery-label">{v.l}</div>
                  </div>
                ))}
              </div>
              <p className="k-disclaimer">{t('archBlueprints')}</p>
            </div>

            {/* Features */}
            <div className={`k-modal-section ${modalSection === 'features' ? 'active' : ''}`}>
              <div className="k-features-grid">
                {selectedUnit.f.kitchen && (
                  <div className="k-feature-group">
                    <h4>{t('kitchen')}</h4>
                    <ul>{selectedUnit.f.kitchen.map((f, i) => <li key={i}>{tFeature(f)}</li>)}</ul>
                  </div>
                )}
                {selectedUnit.f.bathroom && (
                  <div className="k-feature-group">
                    <h4>{t('bathroom')}</h4>
                    <ul>{selectedUnit.f.bathroom.map((f, i) => <li key={i}>{tFeature(f)}</li>)}</ul>
                  </div>
                )}
                {selectedUnit.f.living && (
                  <div className="k-feature-group">
                    <h4>{t('living')}</h4>
                    <ul>{selectedUnit.f.living.map((f, i) => <li key={i}>{tFeature(f)}</li>)}</ul>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className={`k-modal-section ${modalSection === 'amenities' ? 'active' : ''}`}>
              <div className="k-amenities-wrap">
                {selectedUnit.a.map((a, i) => <span key={i} className="k-amenity-chip">{tAmenity(a)}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ COMPARE BAR ═══ */}
      <div className={`k-compare-bar ${compareList.length > 0 ? 'show' : ''}`}>
        <div className="k-compare-bar-info">
          <span>{t('compareProperties')}</span> ({compareList.length}/3 {t('selected')})
        </div>
        <div className="k-compare-bar-actions">
          <button className="k-compare-bar-btn" onClick={() => setCompareList([])}>{t('clear')}</button>
          <button className="k-compare-bar-btn go" onClick={openCompareModal}>{t('compareNow')}</button>
        </div>
      </div>

      {/* ═══ COMPARE MODAL ═══ */}
      {compareOpen && (
        <div className="k-modal-backdrop open" onClick={() => setCompareOpen(false)}>
          <div className="k-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 960 }}>
            <div className="k-modal-header">
              <span className="k-modal-title">{t('investmentComparison')}</span>
              <button className="k-modal-close" onClick={() => setCompareOpen(false)}>✕</button>
            </div>
            <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
              <table className="k-compare-table">
                <thead>
                  <tr>
                    <th></th>
                    {compareList.map(id => {
                      const p = units.find(u => u.id === id);
                      return <th key={id} className="k-val-highlight">{p?.n}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {[
                    [t('type'), p => p.ty],
                    [t('totalSF') + ' ' + t('sf'), p => p.tt.toLocaleString()],
                    [t('indoorSFLabel'), p => p.i.toLocaleString()],
                    [t('outdoorSFLabel'), p => p.o.toLocaleString()],
                    [t('annualROI'), p => <span className="k-val-highlight">{p.roi.annual}</span>],
                    [t('monthlyRental'), p => p.roi.rental],
                    [t('status'), p => statusLabels[p.s] || p.s],
                    [t('amenitiesTab'), p => p.a.map(a => tAmenity(a)).join(', ')]
                  ].map(([label, fn], ri) => (
                    <tr key={ri}>
                      <td>{label}</td>
                      {compareList.map(id => {
                        const p = units.find(u => u.id === id);
                        return <td key={id}>{p ? fn(p) : '—'}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FULLSIZE OVERLAY ═══ */}
      {fullsizeImg && (
        <div className="k-fullsize-overlay open" onClick={() => setFullsizeImg(null)}>
          <img src={fullsizeImg} alt="Full Size" />
        </div>
      )}

      {/* ═══ TOAST ═══ */}
      <div className={`k-toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  );
}
