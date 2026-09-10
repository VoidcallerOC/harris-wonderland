# Harris in Wonderland Production Audit

**Audit date:** 2026-09-09  
**Audit basis:** the live Square catalog endpoint and the locally rendered production-facing routes.

## Result

The audit verified **251 rendered Square-linked product-image instances** across the home page, the cart drawer, the full Current Inventory view, and every care-sheet route. Those instances resolve to **136 distinct current Square products**. All linked Square destinations returned a successful HTTP response during this audit. The inventory image components now use each product's supplied Square URL directly; the code compares that destination against the same live catalog record that supplied the product ID.

The dynamic Current Inventory image cards, feeder-family image cards, care-sheet essential-product images, and cart thumbnails now expose a direct Square destination. Each destination is based on its exact catalog product ID or exact product-name match; no similar-name matching, guessed URLs, or invented Square links are used.

## Dynamic Square Image-Link Coverage

| Product | Square product ID | Verified destination | HTTP status |
|---|---|---|---|
| Arcadia Deep Heat Projector | `JY4533YSDXLVHMS6XSHZTASN` | [Square listing](https://my-hiwsite-6573.square.site/product/arcadia-deep-heat-projector/71) | 200 |
| Arcadia Halogen Heat Lamp | `JNLK22L5JYC25KDHXGIYM3U5` | [Square listing](https://my-hiwsite-6573.square.site/product/arcadia-halogen-heat-lamp/72) | 200 |
| Arcadia Jungle Dawn LED Light Bar | `U2PECMMV7XVCZVICUYMCWG35` | [Square listing](https://my-hiwsite-6573.square.site/product/arcadia-jungle-dawn-led-light-bar/73) | 200 |
| Arcadia Shade Dweller ProT5 7% UVB | `ROLYNH3IYD6QX3PQESGJ22QH` | [Square listing](https://my-hiwsite-6573.square.site/product/arcadia-shade-dweller-prot5-7-uvb/194) | 200 |
| Ball Python - 081 Pastel Pied Het Lavender Female | `77QMX3LIXJBQGIJMSKVTGZ2D` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-081-pastel-pied-het-lavender-female/432) | 200 |
| Ball Python - 082 Lavender Albino Het Pied Female | `YMJWWPQ5BFK5BGX3G5IMVA5N` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-082-lavender-albino-het-pied-female/544) | 200 |
| Ball Python - 083 Lavender Albino Het Pied Male | `OGJRJTLGSZLVMAT323E5LZCS` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-083-lavender-albino-het-pied-male/409) | 200 |
| Ball Python - 084 Pastel OD YB Female | `3FR4IV5A2B6UCRCHCEKFC6IR` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-084-pastel-od-yb-female/436) | 200 |
| Ball Python - 085 Enchi Pied Male | `QAJFZVDH7F4VBUDO4TDDAREE` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-085-enchi-pied-male/246) | 200 |
| Ball Python - 086 Lesser Nanny Black Pewter PH Clown Male | `MFRGV5G27OMWIQDMP5Q7232S` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-086-lesser-nanny-black-pewter-ph-clown-male/407) | 200 |
| Ball Python - 087 Desert Ghost Crypton Yellowbelly Male | `WAN3OAEG6ENVNB3E5NKAXTZ2` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-087-desert-ghost-crypton-yellowbelly-male/434) | 200 |
| Ball Python - 088 Enchi Pied Female | `YRRRKBX4BEOOGWZYLVH5LE5H` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-088-enchi-pied-female/408) | 200 |
| Ball Python - 089 Pastel Desert Ghost Het Cryptic Male | `EK7OAFJO2IHPRXNDUCRSIKI5` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-089-pastel-desert-ghost-het-cryptic-male/433) | 200 |
| Ball Python - 09 Vanilla Scream Bee Female | `BPANEHY3PVV46WI6GHRPSACD` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-09-vanilla-scream-bee-female/232) | 200 |
| Ball Python - 091 Lesser Black Pewter PH Clown | `6VVWZK4P3TFN6BV326ZFGPHM` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-091-lesser-black-pewter-ph-clown/230) | 200 |
| Ball Python - 092 Pastel Highway Male | `OPIBNDSJYZZQRGKD45FF7OTB` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-092-pastel-highway-male/235) | 200 |
| Ball python - 093 Mystic Potion Female | `QIDOLHUE4VTEJFQWFFNSDWIC` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-093-mystic-potion-female/260) | 200 |
| Ball Python - 094 GHI Lesser Clown Female | `4HAO3O7MXPPDKPPT23DNJR4R` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-094-ghi-lesser-clown-female/410) | 200 |
| Ball Python - 095 Pastel Lesser Clown Male | `VM3JEUJOXZRYI6HYAE5XLVGL` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-095-pastel-lesser-clown-male/483) | 200 |
| Ball Python - 096 High White Pied Male | `3WSDROSSWHQLWDMG7TV7G4VU` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-096-high-white-pied-male/234) | 200 |
| Ball Python - 097 High White Pied Male | `UTUXSNPF6ASCIKEVGTU7AJFQ` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-097-high-white-pied-male/277) | 200 |
| Ball Python - 098 High White Pied Female  | `JNVU572GLFTMKOQFSBTHKOAJ` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-098-high-white-pied-female-/242) | 200 |
| Ball Python - 099 Butter Clown Poss OD Female | `HB2SMAGXXXKT5SAGO4KYXACG` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-099-butter-clown-poss-od-female/233) | 200 |
| Ball Python - 100 Pastel Desert Ghost Male | `3JLLQ7H2AESXIVSI5YTZ5ASV` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-100-pastel-desert-ghost-male/280) | 200 |
| Ball Python - 101 Orange Dream Enchi Male | `BMJQXPHHMVAIOPB2FACZOU3M` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-101-orange-dream-enchi-male/245) | 200 |
| Ball Python - 102 Super Enchi Yellowbelly Orange Dream Male | `FSUO2B2DFYA3ILVZK3ZU7UJX` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-102-super-enchi-yellowbelly-orange-dream-male/238) | 200 |
| Ball Python - 103 Lesser Banana Leopard Male | `6EJD4WBSGGSKQMPKAQIZAVHQ` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-103-lesser-banana-leopard-male/279) | 200 |
| Ball Python - 104 Banana Enchi Pied Male | `KGF22XP63ZGTGURISUNOYUAZ` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-104-banana-enchi-pied-male/240) | 200 |
| Ball Python - 105 Pastel Cypress Coral Glow Yellowbelly Male | `JVMIH6TJ555GCMKXJO4NHO7U` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-105-pastel-cypress-coral-glow-yellowbelly-male/244) | 200 |
| Ball Python - 106 Banana Pied Female | `OWINGOJ5CDALUVAZB5NUZJB3` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-106-banana-pied-female/239) | 200 |
| Ball Python - 107 Pastel Clown Super Enchi Male | `TDG3Z5UQDXBD2USE56G34EKE` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-107-pastel-clown-super-enchi-male/243) | 200 |
| Ball Python - 108 Albino Pinstripe Pied Male | `P7CT7JS5SP4OJAXV3OVJC6IU` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-108-albino-pinstripe-pied-male/293) | 200 |
| Ball Python - 109 Banana Pastel Male | `YWCENW27NHDXLJL4EI6QIVQS` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-109-banana-pastel-male/278) | 200 |
| Ball Python - 110 Fire Yellowbelly Male | `SOETTWF2FPMGCDFYL4JWQKGH` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-110-fire-yellowbelly-male/330) | 200 |
| Ball Python - 111 Blackhead Mojave or Phantom Female | `JB4ZWA2SI7L2CG5D6BQTXLD4` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-111-blackhead-mojave-or-phantom-female/390) | 200 |
| Ball Python - 112 Pastel Adult Female | `BHJAKCEVUO24N4MVXDIMYEO6` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-112-pastel-adult-female/241) | 200 |
| Ball Python - 113 Coral Glow Spector Yellowbelly Male | `BCN2IVGN2GNI4A4I65LLFCIG` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-113-coral-glow-spector-yellowbelly-male/511) | 200 |
| Ball Python - 114 Fire Calico Female | `JBHPQGLP64UH5IY3TMLQCRVL` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-114-fire-calico-female/380) | 200 |
| Ball Python - 118 Mojave Yellowbelly Female | `P2LNL6UFUZD5DMC4GKDZI3VU` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-118-mojave-yellowbelly-female/512) | 200 |
| Ball Python - 119 Leopard Pinstripe Het Pied Male | `7NZ42TZFLHVJKQ2YXI26EO4U` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-119-leopard-pinstripe-het-pied-male/435) | 200 |
| Ball Python - 120 Fire Yellowbelly Male | `ERNBQW3JNEWBTBHAMJJIBRWZ` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-120-fire-yellowbelly-male/437) | 200 |
| Ball Python - 121 | `ZPSL6YKKCTWYLJQ64Z5GYDL5` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-121/485) | 200 |
| Ball Python - 123 | `DE3FXY42UOZRIQ5FFXX6N2HW` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-123/486) | 200 |
| Ball Python - 124 | `G6V26XI6MMHW2FB3MKTHZAJG` | [Square listing](https://my-hiwsite-6573.square.site/product/ball-python-124/231) | 200 |
| Bedding/Substrates | `QR2JKWYO7GPG4YHSPQRD7D2Q` | [Square listing](https://my-hiwsite-6573.square.site/product/bedding-substrates/25) | 200 |
| Boa - 011 Dumeril's Boa | `LXUOICB637H3VA7X2US75ZWH` | [Square listing](https://my-hiwsite-6573.square.site/product/boa-011-dumeril-s-boa/381) | 200 |
| Boa - 012 Ghost 100% Het Snow Female | `74KDCYI6ZNCEK46R2GNE6XBH` | [Square listing](https://my-hiwsite-6573.square.site/product/boa-012-ghost-100-het-snow-female/382) | 200 |
| Boa - 017 Anery Het Snow Female | `IAB5S4OUHRQONXIA2FRPTARS` | [Square listing](https://my-hiwsite-6573.square.site/product/boa-017-anery-het-snow-female/673) | 200 |
| Boa - 018 Anery Het Snow Male | `LDNTR3WRTQT2BNSG2MPMMYEG` | [Square listing](https://my-hiwsite-6573.square.site/product/boa-018-anery-het-snow-male/674) | 200 |
| Boa - 019 Poss Het Snow Male | `ZJPFFSBFOR2ASQSJHKDUP642` | [Square listing](https://my-hiwsite-6573.square.site/product/boa-019-poss-het-snow-male/675) | 200 |
| Boa - 020 Poss Het Snow Female | `BYSE2MAKBMDI3W4ZDMPN4HOA` | [Square listing](https://my-hiwsite-6573.square.site/product/boa-020-poss-het-snow-female/672) | 200 |
| Boa - 163 Leucistic Colombian Rainbow Boa | `VD2NJTRTV5RJSMGNBHSLPDC6` | [Square listing](https://my-hiwsite-6573.square.site/product/boa-163-leucistic-colombian-rainbow-boa/671) | 200 |
| Boa - Female Brazilian Rainbow Boa | `WDETKT2LBOG7L4WL3VW5NAHZ` | [Square listing](https://my-hiwsite-6573.square.site/product/boa-female-brazilian-rainbow-boa/386) | 200 |
| Boa - Male Brazilian Rainbow Boa | `QP5HX2X5DT4LLVT3ZVJVBQAM` | [Square listing](https://my-hiwsite-6573.square.site/product/boa-male-brazilian-rainbow-boa/385) | 200 |
| Burmese Python - 021 Female Albino | `KN6DY2WPUOOSOPKUSKWWYWIG` | [Square listing](https://my-hiwsite-6573.square.site/product/burmese-python-021-female-albino/301) | 200 |
| Burmese Python - 023 Female Hypo | `CLA6VFY7VSKT23OXD7E54HDA` | [Square listing](https://my-hiwsite-6573.square.site/product/burmese-python-023-female-hypo/291) | 200 |
| Burmese Python - 024 Female Normal | `YWR77Q67VIMA4V22D7BAAKOA` | [Square listing](https://my-hiwsite-6573.square.site/product/burmese-python-024-female-normal/292) | 200 |
| Burmese Python - 029 | `V3EBULDI7D6NLTJP5IXBTLLH` | [Square listing](https://my-hiwsite-6573.square.site/product/burmese-python-029/290) | 200 |
| Cleaning Supplies And Medications | `JRWRDGH3WNFGVBYULG7L4A2P` | [Square listing](https://my-hiwsite-6573.square.site/product/cleaning-supplies-and-medications/48) | 200 |
| Corn Snake - 147 Albino Reverse Okeetee Corn Male | `7DWDV666V7WSKJYJWAISBVKQ` | [Square listing](https://my-hiwsite-6573.square.site/product/corn-snake-147-albino-reverse-okeetee-corn-male/658) | 200 |
| Corn Snake - 148 Albino Reverse Okeetee Corn Female | `T6XJNGA57X4XJ2HDXIDE42NZ` | [Square listing](https://my-hiwsite-6573.square.site/product/corn-snake-148-albino-reverse-okeetee-corn-female/659) | 200 |
| Corn Snake - 149 Ultra Corn Female | `275KPGMW7NESXQZCVUOCC3U7` | [Square listing](https://my-hiwsite-6573.square.site/product/corn-snake-149-ultra-corn-female/660) | 200 |
| Corn Snake - 150 Caramel Corn Male | `5YS7WYIBG4T3KQCSIBPD3WOZ` | [Square listing](https://my-hiwsite-6573.square.site/product/corn-snake-150-caramel-corn-male/661) | 200 |
| Corn Snake - 151 Anerythristic Corn Male | `SC6AF5T6K5QYY5MKEW3PGE2K` | [Square listing](https://my-hiwsite-6573.square.site/product/corn-snake-151-anerythristic-corn-male/662) | 200 |
| Corn Snake - 152 Black Eyed Leucistic Texas Rat Female | `QVXHXNA4MGPW6ZDJR4UNYED3` | [Square listing](https://my-hiwsite-6573.square.site/product/corn-snake-152-black-eyed-leucistic-texas-rat-female/663) | 200 |
| Corn Snake - 153 Anery 50% het Motley/Sunkissed/Lav/Hypo Corn Male | `JZ2XYOIRP7TZJ4GT6PEQICV5` | [Square listing](https://my-hiwsite-6573.square.site/product/corn-snake-153-anery-50-het-motley-sunkissed-lav-hypo-corn-male/664) | 200 |
| Corn Snake - 154 Het Anery 50% het Motley/Sunkissed/Lav/Hypo Corn Male | `CVH6D4K3QZAJOOTJJ5PR64DT` | [Square listing](https://my-hiwsite-6573.square.site/product/corn-snake-154-het-anery-50-het-motley-sunkissed-lav-hypo-corn-male/665) | 200 |
| Corn Snake - 155 Het Anery 50% het Motley/Sunkissed/Lav/Hypo Corn Female | `YI2J267VCWDOD37VMR5WP7GI` | [Square listing](https://my-hiwsite-6573.square.site/product/corn-snake-155-het-anery-50-het-motley-sunkissed-lav-hypo-corn-female/666) | 200 |
| Dubia Roaches On Line Purchasing | `JC7KV4KHP7557QKHATN2DMFL` | [Square listing](https://my-hiwsite-6573.square.site/product/dubia-roaches-on-line-purchasing/431) | 200 |
| EN Instant HPW | `HU3F35G3CR4W3T3GR47UH4VJ` | [Square listing](https://my-hiwsite-6573.square.site/product/en-instant-hpw/67) | 200 |
| EN Sugar Glider Complete | `PAAJHLSPGDHOMKCUDE7ULZPV` | [Square listing](https://my-hiwsite-6573.square.site/product/en-sugar-glider-complete/68) | 200 |
| Equipment | `HVME5LB3RP4OVT3IBID4Y7S7` | [Square listing](https://my-hiwsite-6573.square.site/product/equipment/38) | 200 |
| ExoTerra Coco Husk | `OTLE2GGAAYXU2RLRBI66HSIQ` | [Square listing](https://my-hiwsite-6573.square.site/product/exoterra-coco-husk/184) | 200 |
| ExoTerra Daylight Basking Spot | `EX7HBPNCOZQMC2LHTKNTBKBK` | [Square listing](https://my-hiwsite-6573.square.site/product/exoterra-daylight-basking-spot/141) | 200 |
| ExoTerra Daytime Heat Lamp | `ZZPO7EP3ECRLVFW6R3ROVNIG` | [Square listing](https://my-hiwsite-6573.square.site/product/exoterra-daytime-heat-lamp/143) | 200 |
| ExoTerra Hand Sprayers | `YHOGCTJFR3HTZUH65WKH5DIG` | [Square listing](https://my-hiwsite-6573.square.site/product/exoterra-hand-sprayers/181) | 200 |
| ExoTerra Heat Mat | `LK4NLDPF55WAZ3ENBMGETXFP` | [Square listing](https://my-hiwsite-6573.square.site/product/exoterra-heat-mat/206) | 200 |
| ExoTerra Jungle And Moss Vines | `NKD7QPANXR5OFAVDHOEIT6X7` | [Square listing](https://my-hiwsite-6573.square.site/product/exoterra-jungle-and-moss-vines/171) | 200 |
| ExoTerra Night Heat Lamp | `DTMOSDYICW6ELLYJ2CAIQARW` | [Square listing](https://my-hiwsite-6573.square.site/product/exoterra-night-heat-lamp/144) | 200 |
| ExoTerra Reptile UVB 150 Desert | `XYOTXTNNRY3JSLN3SWZVPP5F` | [Square listing](https://my-hiwsite-6573.square.site/product/exoterra-reptile-uvb-150-desert/146) | 200 |
| ExoTerra Reptile UVB 200 Intense | `GE4WGWI6E2MONLM2526CVGMC` | [Square listing](https://my-hiwsite-6573.square.site/product/exoterra-reptile-uvb-200-intense/147) | 200 |
| ExoTerra Terrariums | `YQUDHKHEQARE6PBITCFJSDJX` | [Square listing](https://my-hiwsite-6573.square.site/product/exoterra-terrariums/35) | 200 |
| Filters | `ICLUVH37AWHYX27THBWCVLFB` | [Square listing](https://my-hiwsite-6573.square.site/product/filters/47) | 200 |
| Fish Foods Omega One | `5OCO4XDBDIRYNPGPIOJOTUOY` | [Square listing](https://my-hiwsite-6573.square.site/product/fish-foods-omega-one/44) | 200 |
| Fluker's Black Nightlight Bulbs | `OB52YC3XNUGY62MXIHH3PCEK` | [Square listing](https://my-hiwsite-6573.square.site/product/fluker-s-black-nightlight-bulbs/28) | 200 |
| Frozen Mice | `NCZP6JAR7E7UZE7IQ6ZMV357` | [Square listing](https://my-hiwsite-6573.square.site/product/frozen-mice/53) | 200 |
| Gargoyle Gecko- GG1 | `4F6QI6P4PWT7VOUNX3ESRNIE` | [Square listing](https://my-hiwsite-6573.square.site/product/gargoyle-gecko-gg1/262) | 200 |
| Gargoyle Gecko- GG2 | `EZABI4VCURP3A2HY45VYVS2X` | [Square listing](https://my-hiwsite-6573.square.site/product/gargoyle-gecko-gg2/261) | 200 |
| Gargoyle Gecko- GG3 | `4NGTDD5FVEY4DZ3XQLY6CQBA` | [Square listing](https://my-hiwsite-6573.square.site/product/gargoyle-gecko-gg3/263) | 200 |
| Heating Devices | `DWACHBBEPYIFKDJREB5MU4XF` | [Square listing](https://my-hiwsite-6573.square.site/product/heating-devices/18) | 200 |
| Hognose - 163 Male Albino | `WGOO5DGXFZSWQYXJHSSWB25M` | [Square listing](https://my-hiwsite-6573.square.site/product/hognose-163-male-albino/281) | 200 |
| Hognose - 165 Female Super Arctic | `BTBA754BUAJX6YGS5A4LUZUI` | [Square listing](https://my-hiwsite-6573.square.site/product/hognose-165-female-super-arctic/286) | 200 |
| Hognose - 173 Male Normal | `3EESHY2SJ3T7HCEUEWCZSBFG` | [Square listing](https://my-hiwsite-6573.square.site/product/hognose-173-male-normal/285) | 200 |
| Hognose - 174 Female Normal | `NV4OG4EC455UYIWMTCSI66ME` | [Square listing](https://my-hiwsite-6573.square.site/product/hognose-174-female-normal/282) | 200 |
| Hognose - 176 Normal 66% Het Albino | `H3R2IO2ZKFPSMSSVK4Y257IB` | [Square listing](https://my-hiwsite-6573.square.site/product/hognose-176-normal-66-het-albino/284) | 200 |
| Humidity Hut | `FAOWABCDWPA7M3U3EQ74SOLM` | [Square listing](https://my-hiwsite-6573.square.site/product/humidity-hut/76) | 200 |
| Kingsnake - 020 | `TRW65ABV5M5X6YKOAI75TKE5` | [Square listing](https://my-hiwsite-6573.square.site/product/kingsnake-020/459) | 200 |
| Kingsnake - 022 Male Banana Kingsnake | `G3GIDPHHG4W6SDEHX2YG2IU5` | [Square listing](https://my-hiwsite-6573.square.site/product/kingsnake-022-male-banana-kingsnake/455) | 200 |
| Kingsnake - 1150 Mexican Black King Male | `FZJ6MU5CMB6YKV3I7ZHZ4NUQ` | [Square listing](https://my-hiwsite-6573.square.site/product/kingsnake-1150-mexican-black-king-male/456) | 200 |
| Kingsnake - 160 Female Mexican Black Kingsnake | `SUW7MIPEO3QDQQIBOU2TILXG` | [Square listing](https://my-hiwsite-6573.square.site/product/kingsnake-160-female-mexican-black-kingsnake/383) | 200 |
| Kingsnake - 170 Ghost Whitesided King Female | `HFHBDVLEIULXXILFO6VVEWYR` | [Square listing](https://my-hiwsite-6573.square.site/product/kingsnake-170-ghost-whitesided-king-female/384) | 200 |
| Magnaturals | `BKBFFGLXREAW2333Y3BKOQH5` | [Square listing](https://my-hiwsite-6573.square.site/product/magnaturals/43) | 200 |
| Mammal Diets | `IRMBHUAGSLDPX6ADFG2GTNZN` | [Square listing](https://my-hiwsite-6573.square.site/product/mammal-diets/39) | 200 |
| Mealworms | `4KPAKESFYTW3NAYIIFLHERIP` | [Square listing](https://my-hiwsite-6573.square.site/product/mealworms/11) | 200 |
| Milk Snake - 146 Pueblan Milk Male | `CQA7RYRJAOHJO5LXMO32OWB5` | [Square listing](https://my-hiwsite-6573.square.site/product/milk-snake-146-pueblan-milk-male/657) | 200 |
| Milksnake - 1055 Black Milksnake Male | `W2K27MSD3C7FA5T4JX2NQP6N` | [Square listing](https://my-hiwsite-6573.square.site/product/milksnake-1055-black-milksnake-male/457) | 200 |
| Other Feeders | `OK2OBCBVRRG5M63I5PYZ77BY` | [Square listing](https://my-hiwsite-6573.square.site/product/other-feeders/4) | 200 |
| Pangea Diet Apricot | `S3XJZ4VK5JKFFCWYY4IERTX2` | [Square listing](https://my-hiwsite-6573.square.site/product/pangea-diet-apricot/22) | 200 |
| Pangea Diet Papaya | `IBPO7LDQD2HL2XDR2PYFEJHP` | [Square listing](https://my-hiwsite-6573.square.site/product/pangea-diet-papaya/21) | 200 |
| Rabbits/Guineas | `AJZSCHT6YV333TU6HCDOOQBU` | [Square listing](https://my-hiwsite-6573.square.site/product/rabbits-guineas/23) | 200 |
| Rat Snake - 157 Leucistic Texas Rat Snake Male | `JKXTBHHNOR7AWMZI2HRDQNDV` | [Square listing](https://my-hiwsite-6573.square.site/product/rat-snake-157-leucistic-texas-rat-snake-male/668) | 200 |
| Repashy Diets/Products | `ELCF7AYSX2JTVFQ7TKH5XTAU` | [Square listing](https://my-hiwsite-6573.square.site/product/repashy-diets-products/52) | 200 |
| Reptile Specialty Diets | `HFOP7T3RMNINYGJB7DKCN5LG` | [Square listing](https://my-hiwsite-6573.square.site/product/reptile-specialty-diets/51) | 200 |
| Test Kits And Water Maintenance | `MLNNGWP4XQGTS4BJPZQHI6WG` | [Square listing](https://my-hiwsite-6573.square.site/product/test-kits-and-water-maintenance/46) | 200 |
| Thermostats | `MMLMNO5HOXOIWZR2AA5ZPEV4` | [Square listing](https://my-hiwsite-6573.square.site/product/thermostats/36) | 200 |
| Vitamin And Mineral Suppliments | `WFJ5S3FSK24QWVXNKMVFRW2R` | [Square listing](https://my-hiwsite-6573.square.site/product/vitamin-and-mineral-suppliments/15) | 200 |
| Zilla Brand | `MNB2Q5TDGQAHVPGGN7HUI2PG` | [Square listing](https://my-hiwsite-6573.square.site/product/zilla-brand/20) | 200 |
| Zilla Mini Halogen Bulbs | `HXVJ4A56QSN3AAMUSNVQSXJ3` | [Square listing](https://my-hiwsite-6573.square.site/product/zilla-mini-halogen-bulbs/12) | 200 |
| ZM Aspen Snake Bedding | `R5A2DS5LOF36I5LCHOFJYXKC` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-aspen-snake-bedding/123) | 200 |
| ZM Ceramic Infrared Heat Emitter | `KGNH6CDUSR2THMW6T6IGKID7` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-ceramic-infrared-heat-emitter/157) | 200 |
| ZM Daylight Blue Reptile Bulb | `RH5CJRN6WUKI2ESXBGKITAVU` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-daylight-blue-reptile-bulb/167) | 200 |
| ZM Eco Earth | `KY72ESC5BOGEBMCFDHFBXCTI` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-eco-earth/129) | 200 |
| ZM Forest Floor Cypress Bedding | `V7LQBIUJ4TFF5NOGEWMT4FPT` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-forest-floor-cypress-bedding/124) | 200 |
| ZM Frog Moss 80 cu in CF3-FM | `U3KPZDBO557MLMOAJFSK3MFY` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-frog-moss-80-cu-in-cf3-fm/192) | 200 |
| ZM Hydro Balls VC-10 | `5A6LEGUKS2RO2A2SP2M32FEY` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-hydro-balls-vc-10/150) | 200 |
| ZM PowerSun UVB Mercury Vapor Lamp | `RYJIIFXT73B722ZP3SEL2FVI` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-powersun-uvb-mercury-vapor-lamp/168) | 200 |
| ZM Repti Basking Spot Lamp | `JKX3W62P6LFGCTZZTOCIV5CJ` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-repti-basking-spot-lamp/164) | 200 |
| ZM ReptiBark | `GFS4SLCRAR7GMOEA32HCBGGR` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-reptibark/121) | 200 |
| ZM ReptiSoil | `IFCOWLFR2CMUBI6PDI3XDFPE` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-reptisoil/128) | 200 |
| ZM ReptiSun T5 10.0 UVB Bulbs | `WR7TB2KWODHDQTZI2PKNUNHE` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-reptisun-t5-10-0-uvb-bulbs/169) | 200 |
| ZM ReptiSun T5 5.0 HO Hood | `SLX6QXVEV4KAWL4MCS3JXQYJ` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-reptisun-t5-5-0-ho-hood/161) | 200 |
| ZM Reptisun T5 5.0 UVB Bulbs | `7LM2QT23Q6VIKJJBMGBKPVME` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-reptisun-t5-5-0-uvb-bulbs/92) | 200 |
| ZM ReptiSun T8 10.0 UVB Bulbs | `GDDV7N43YW3S2XKTRC2LIVVT` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-reptisun-t8-10-0-uvb-bulbs/134) | 200 |
| ZM Sphagnum Moss | `RIP6QERIWXQWJM5MRH7VL5DR` | [Square listing](https://my-hiwsite-6573.square.site/product/zm-sphagnum-moss/122) | 200 |
| ZooMed Brand Bulbs | `PQZ3FNZJVTGK56HTIN7YJFKE` | [Square listing](https://my-hiwsite-6573.square.site/product/zoomed-brand-bulbs/33) | 200 |
| ZooMed Terrariums & Screen Cages | `OUW7L4G7WW643ICLBPBHVSU4` | [Square listing](https://my-hiwsite-6573.square.site/product/zoomed-terrariums-screen-cages/37) | 200 |

## Static Photography Kept Unlinked

The following client-supplied photos are not tied to a specific current Square SKU in the repository or catalog. They remain on their existing intended destinations, such as care-sheet, gallery, Instagram, or informational content, rather than being attached to a guessed product. This preserves the photography and avoids sending a visitor to an unrelated listing.

| Image | Render source | Reason not linked to Square |
|---|---|---|
| `/images/ball-python.jpg` | `components/hero.tsx`, `lib/species.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/blue-tongue.jpg` | `lib/species.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/boa.jpg` | `lib/species.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/case-amphibians.jpg` | `components/hero.tsx`, `lib/species.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/case-lizards.jpg` | `components/hero.tsx`, `lib/species.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/corn-snake.jpg` | `lib/species.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/drive-blue-frog.jpg` | `lib/species.ts`, `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/drive-color-chameleon.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/drive-gecko.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/drive-hero.jpg` | `components/hero.tsx`, `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/drive-poison-frog.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/fish-room.jpg` | `routes/fish.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/chameleon-casque.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/dart-frog-rose.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/dart-frog-yellow.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/day-gecko-hand.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/day-gecko-neon.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/day-geckos-hand.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/gecko-bark.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/gecko-chainmail.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/gecko-emerald.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/gecko-ghost.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/gecko-hatchling.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/gecko-pocket.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/gecko-seafoam.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/floor/lizard-arrival.jpg` | `routes/index.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/hero.jpg` | `components/hero.tsx`, `lib/species.ts`, `routes/story.tsx` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/hognose.jpg` | `lib/species.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/kingsnake.jpg` | `lib/species.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/leopard-gecko.jpg` | `lib/species.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/redfoot.jpg` | `components/hero.tsx`, `lib/species.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/social/fb-cave.jpg` | `lib/social-posts.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/social/fb-gecko.jpg` | `lib/social-posts.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/social/fb-skink.jpg` | `lib/social-posts.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |
| `/images/sugar-glider.jpg` | `components/mammals-section.tsx`, `lib/mammals.ts` | Client photography or editorial imagery; no exact current Square product match is encoded. |

## Outstanding Owner Decisions

No implementation blocker was found. If the owner later wants editorial photos to open a live product, they will need to provide the exact Square product or SKU for each photo; current generic species, gallery, fish-room, and sugar-glider photography cannot be matched safely to a specific live listing.

## Automated Check Results

- Live Square catalog products retrieved: **136**.
- Rendered Square-linked image instances inspected: **251**.
- Distinct Square products linked and HTTP-verified: **136**.
- Incorrect, missing, or non-successful Square image links: **0**.
