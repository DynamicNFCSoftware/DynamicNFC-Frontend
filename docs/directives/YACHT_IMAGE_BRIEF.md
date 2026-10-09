# Yacht Portal Image Brief — 32 vessels

**Format (same as Automotive):** one .jpg per vessel → `frontend/src/pages/YachtDemo/assets/<filename>.jpg` → IMG map in `yachtVesselData.js` maps key → import. Silhouette placeholder stays as automatic fallback for any missing image, so images can arrive in batches.

**Specs:** 1600×1000 landscape, JPG quality 80, ≤ 350 KB each (build size). Photographic realism, no text/watermarks, no people's faces.

**AI prompt template (Artistly v6 / any image gen):**
> Luxury yacht photography, {SUBJECT}, {SETTING}, golden-hour light, calm water, slight aerial three-quarter bow angle, photorealistic, no text, no watermark

**Region settings:**
- GULF → "Dubai Marina skyline in background, warm desert dusk"
- USA → "San Diego bay, Point Loma coastline, clear Pacific light"
- MEXICO → "Cabo San Lucas arch / Cancún turquoise water, vibrant tropical light"
- CANADA → "Vancouver Coal Harbour, mountains and glass towers, cool Pacific-Northwest light"

| Card ID | Filename (key) | SUBJECT |
|---|---|---|
| YA-GULF-001 | azimut-grande-35.jpg | Azimut Grande 35 Metri white motor yacht, 35m flybridge |
| YA-GULF-002 | princess-x95.jpg | Princess X95 superfly motor yacht |
| YA-GULF-003 | sunseeker-88.jpg | Sunseeker 88 Yacht sport flybridge |
| YA-GULF-004 | benetti-oasis-40m.jpg | Benetti Oasis 40M with open beach club stern |
| YA-GULF-005 | pershing-9x.jpg | Pershing 9X fast sport yacht underway |
| YA-GULF-006 | ferretti-1000.jpg | Ferretti 1000 flagship flybridge yacht |
| YA-GULF-007 | sanlorenzo-sl90a.jpg | Sanlorenzo SL90 Asymmetric modern yacht |
| YA-GULF-008 | lurssen-85m.jpg | 85-meter custom Lürssen superyacht with helipad |
| YA-USA-001 | westport-40m.jpg | Westport 40M tri-deck motor yacht |
| YA-USA-002 | viking-80.jpg | Viking 80 Convertible sportfish with tuna tower |
| YA-USA-003 | hatteras-m98.jpg | Hatteras M98 Panacera motor yacht |
| YA-USA-004 | nordhavn-80.jpg | Nordhavn 80 expedition trawler yacht |
| YA-USA-005 | bertram-61.jpg | Bertram 61 Convertible sportfish running offshore |
| YA-USA-006 | ocean-alexander-90r.jpg | Ocean Alexander 90R raised-pilothouse yacht |
| YA-USA-007 | grady-white-456.jpg | Grady-White Canyon 456 center console, quad outboards |
| YA-USA-008 | feadship-80m.jpg | 80-meter Feadship custom superyacht |
| YA-MEX-001 | ferretti-cl130.jpg | Ferretti Custom Line 130 superyacht |
| YA-MEX-002 | azimut-magellano-66.jpg | Azimut Magellano 66 long-range cruiser |
| YA-MEX-003 | sunseeker-predator-74.jpg | Sunseeker Predator 74 sport yacht at speed |
| YA-MEX-004 | princess-y85.jpg | Princess Y85 flybridge motor yacht |
| YA-MEX-005 | boston-whaler-420.jpg | Boston Whaler 420 Outrage, quad Mercury outboards |
| YA-MEX-006 | azimut-s7.jpg | Azimut S7 sport coupe yacht |
| YA-MEX-007 | intrepid-477.jpg | Intrepid 477 Panacea fast day boat |
| YA-MEX-008 | benetti-oasis-34m.jpg | Benetti Oasis 34M with beach club |
| YA-CAN-001 | nordhavn-86.jpg | Nordhavn 86 explorer yacht, ocean-crossing trawler |
| YA-CAN-002 | grand-banks-85.jpg | Grand Banks 85 classic long-range motor yacht |
| YA-CAN-003 | ocean-alexander-90r-can.jpg | Ocean Alexander 90R raised pilothouse |
| YA-CAN-004 | nordhavn-68.jpg | Nordhavn 68 trans-Pacific trawler |
| YA-CAN-005 | fleming-65.jpg | Fleming 65 bluewater pilothouse yacht |
| YA-CAN-006 | princess-y80.jpg | Princess Y80 motor yacht |
| YA-CAN-007 | grady-white-376.jpg | Grady-White Canyon 376, twin Yamaha outboards |
| YA-CAN-008 | burger-140.jpg | Burger 140 raised-pilothouse superyacht |

**When images are ready:** drop the .jpg files into `frontend/src/pages/YachtDemo/assets/`, then a 15-minute Cursor task wires the IMG map (import lines + key mapping — same structure as `automotiveVehicleData.js` IMG map). Batches are fine; the silhouette fallback covers gaps.
