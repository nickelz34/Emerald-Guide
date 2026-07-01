# Pokemon Emerald Map Calibration Data

Source: pret/pokeemerald master branch map.json + layouts.json
Formula: `pctX = ((x*16+8)/imgWidth)*100`, `pctY = ((y*16+8)/imgHeight)*100`

## Notes on special maps
- **GraniteCave**: No exterior map exists; only interior floors (1F shown).
- **SealedChamber**: No folder named SealedChamber; use SealedChamber_OuterRoom / InnerRoom.
- **SkyPillar**: Exterior is SkyPillar_Outside.
- **VictoryRoad**: Entrance area mapped as VictoryRoad_1F.
- **MarineCave**: MarineCave_Entrance + MarineCave_End exist (no Center/Corner).

## Dimension quick reference
| Map | Tiles (W x H) | Image (W x H px) | Layout |
|-----|---------------|------------------|--------|
| LittlerootTown | 20 x 20 | 320 x 320 | LittlerootTown_Layout |
| OldaleTown | 20 x 20 | 320 x 320 | OldaleTown_Layout |
| Route101 | 20 x 20 | 320 x 320 | Route101_Layout |
| Route102 | 50 x 20 | 800 x 320 | Route102_Layout |
| Route103 | 80 x 22 | 1280 x 352 | Route103_Layout |
| Route104 | 40 x 80 | 640 x 1280 | Route104_Layout |
| Route105 | 40 x 80 | 640 x 1280 | Route105_Layout |
| Route110 | 40 x 100 | 640 x 1600 | Route110_Layout |
| Route111 | 40 x 140 | 640 x 2240 | Route111_Layout |
| Route113 | 100 x 20 | 1600 x 320 | Route113_Layout |
| Route116 | 100 x 20 | 1600 x 320 | Route116_Layout |
| Route117 | 60 x 20 | 960 x 320 | Route117_Layout |
| Route118 | 80 x 20 | 1280 x 320 | Route118_Layout |
| Route119 | 40 x 140 | 640 x 2240 | Route119_Layout |
| Route120 | 40 x 100 | 640 x 1600 | Route120_Layout |
| PetalburgCity | 30 x 30 | 480 x 480 | PetalburgCity_Layout |
| PetalburgWoods | 48 x 44 | 768 x 704 | PetalburgWoods_Layout |
| RustboroCity | 40 x 60 | 640 x 960 | RustboroCity_Layout |
| RusturfTunnel | 36 x 24 | 576 x 384 | RusturfTunnel_Layout |
| DewfordTown | 20 x 20 | 320 x 320 | DewfordTown_Layout |
| SlateportCity | 40 x 60 | 640 x 960 | SlateportCity_Layout |
| MauvilleCity | 40 x 20 | 640 x 320 | MauvilleCity_Layout |
| LavaridgeTown | 20 x 20 | 320 x 320 | LavaridgeTown_Layout |
| FallarborTown | 20 x 20 | 320 x 320 | FallarborTown_Layout |
| FortreeCity | 40 x 20 | 640 x 320 | FortreeCity_Layout |
| MossdeepCity | 80 x 40 | 1280 x 640 | MossdeepCity_Layout |
| SootopolisCity | 60 x 60 | 960 x 960 | SootopolisCity_Layout |
| LilycoveCity | 80 x 40 | 1280 x 640 | LilycoveCity_Layout |
| PacifidlogTown | 20 x 40 | 320 x 640 | PacifidlogTown_Layout |
| MtChimney | 40 x 47 | 640 x 752 | MtChimney_Layout |
| EverGrandeCity | 40 x 80 | 640 x 1280 | EverGrandeCity_Layout |
| SkyPillar_Outside | 28 x 23 | 448 x 368 | SkyPillar_Outside_Layout |
| VictoryRoad_1F | 46 x 45 | 736 x 720 | VictoryRoad_1F_Layout |
| SealedChamber_OuterRoom | 21 x 23 | 336 x 368 | SealedChamber_OuterRoom_Layout |
| SealedChamber_InnerRoom | 21 x 23 | 336 x 368 | SealedChamber_InnerRoom_Layout |
| MarineCave_Entrance | 20 x 20 | 320 x 320 | MarineCave_Entrance_Layout |
| MarineCave_End | 27 x 30 | 432 x 480 | MarineCave_End_Layout |
| GraniteCave_1F | 42 x 15 | 672 x 240 | GraniteCave_1F_Layout |

## LittlerootTown
- **Layout**: LittlerootTown_Layout (LAYOUT_LITTLEROOT_TOWN)
- **Dimensions**: 20 x 20 tiles = 320 x 320 px
- **Inferred from coords** (fallback): 17 x 18 tiles

### Warps (3)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 14 | 8 | 72.5 | 42.5 | MAP_LITTLEROOT_TOWN_MAYS_HOUSE_1F | 1 |
| 5 | 8 | 27.5 | 42.5 | MAP_LITTLEROOT_TOWN_BRENDANS_HOUSE_1F | 1 |
| 7 | 16 | 37.5 | 82.5 | MAP_LITTLEROOT_TOWN_PROFESSOR_BIRCHS_LAB | 0 |

### Signs (4)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 15 | 13 | 77.5 | 67.5 |  |
| 6 | 17 | 32.5 | 87.5 |  |
| 7 | 8 | 37.5 | 42.5 |  |
| 12 | 8 | 62.5 | 42.5 |  |

### Trainers (0)
_none_

## OldaleTown
- **Layout**: OldaleTown_Layout (LAYOUT_OLDALE_TOWN)
- **Dimensions**: 20 x 20 tiles = 320 x 320 px
- **Inferred from coords** (fallback): 17 x 20 tiles

### Warps (4)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 5 | 7 | 27.5 | 37.5 | MAP_OLDALE_TOWN_HOUSE1 | 0 |
| 15 | 16 | 77.5 | 82.5 | MAP_OLDALE_TOWN_HOUSE2 | 0 |
| 6 | 16 | 32.5 | 82.5 | MAP_OLDALE_TOWN_POKEMON_CENTER_1F | 0 |
| 14 | 6 | 72.5 | 32.5 | MAP_OLDALE_TOWN_MART | 0 |

### Signs (5)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 11 | 9 | 57.5 | 47.5 |  |
| 7 | 16 | 37.5 | 82.5 |  |
| 15 | 6 | 77.5 | 32.5 |  |
| 8 | 16 | 42.5 | 82.5 |  |
| 16 | 6 | 82.5 | 32.5 |  |

### Trainers (0)
_none_

## Route101
- **Layout**: Route101_Layout (LAYOUT_ROUTE101)
- **Dimensions**: 20 x 20 tiles = 320 x 320 px
- **Inferred from coords** (fallback): 17 x 20 tiles

### Warps (0)
_none_

### Signs (1)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 5 | 9 | 27.5 | 47.5 |  |

### Trainers (0)
_none_

## Route102
- **Layout**: Route102_Layout (LAYOUT_ROUTE102)
- **Dimensions**: 50 x 20 tiles = 800 x 320 px
- **Inferred from coords** (fallback): 41 x 16 tiles

### Warps (0)
_none_

### Signs (2)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 17 | 2 | 35.0 | 12.5 |  |
| 40 | 9 | 81.0 | 47.5 |  |

### Trainers (4)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 33 | 14 | 67.0 | 72.5 | OBJ_EVENT_GFX_YOUNGSTER | TRAINER_TYPE_NORMAL | 3 |
| 25 | 15 | 51.0 | 77.5 | OBJ_EVENT_GFX_BUG_CATCHER | TRAINER_TYPE_NORMAL | 2 |
| 8 | 7 | 17.0 | 37.5 | OBJ_EVENT_GFX_LASS | TRAINER_TYPE_NORMAL | 3 |
| 19 | 4 | 39.0 | 22.5 | OBJ_EVENT_GFX_YOUNGSTER | TRAINER_TYPE_NORMAL | 3 |

## Route103
- **Layout**: Route103_Layout (LAYOUT_ROUTE103)
- **Dimensions**: 80 x 22 tiles = 1280 x 352 px
- **Inferred from coords** (fallback): 73 x 14 tiles

### Warps (1)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 45 | 6 | 56.88 | 29.55 | MAP_ALTERING_CAVE | 0 |

### Signs (1)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 11 | 9 | 14.37 | 43.18 |  |

### Trainers (9)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 71 | 11 | 89.38 | 52.27 | OBJ_EVENT_GFX_WOMAN_2 | TRAINER_TYPE_NORMAL | 3 |
| 65 | 12 | 81.88 | 56.82 | OBJ_EVENT_GFX_TWIN | TRAINER_TYPE_NORMAL | 1 |
| 64 | 12 | 80.62 | 56.82 | OBJ_EVENT_GFX_TWIN | TRAINER_TYPE_NORMAL | 1 |
| 50 | 8 | 63.12 | 38.64 | OBJ_EVENT_GFX_FISHERMAN | TRAINER_TYPE_NORMAL | 3 |
| 56 | 13 | 70.62 | 61.36 | OBJ_EVENT_GFX_POKEFAN_M | TRAINER_TYPE_NORMAL | 5 |
| 67 | 5 | 84.38 | 25.0 | OBJ_EVENT_GFX_BLACK_BELT | TRAINER_TYPE_NORMAL | 2 |
| 67 | 9 | 84.38 | 43.18 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 2 |
| 36 | 6 | 45.62 | 29.55 | OBJ_EVENT_GFX_SWIMMER_F | TRAINER_TYPE_NORMAL | 5 |
| 36 | 13 | 45.62 | 61.36 | OBJ_EVENT_GFX_SWIMMER_M | TRAINER_TYPE_NORMAL | 5 |

## Route104
- **Layout**: Route104_Layout (LAYOUT_ROUTE104)
- **Dimensions**: 40 x 80 tiles = 640 x 1280 px
- **Inferred from coords** (fallback): 40 x 75 tiles

### Warps (8)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 17 | 50 | 43.75 | 63.12 | MAP_ROUTE104_MR_BRINEYS_HOUSE | 0 |
| 5 | 18 | 13.75 | 23.12 | MAP_ROUTE104_PRETTY_PETAL_FLOWER_SHOP | 0 |
| 10 | 30 | 26.25 | 38.12 | MAP_PETALBURG_WOODS | 0 |
| 11 | 30 | 28.75 | 38.12 | MAP_PETALBURG_WOODS | 1 |
| 10 | 38 | 26.25 | 48.12 | MAP_PETALBURG_WOODS | 2 |
| 11 | 38 | 28.75 | 48.12 | MAP_PETALBURG_WOODS | 3 |
| 32 | 42 | 81.25 | 53.12 | MAP_PETALBURG_WOODS | 4 |
| 33 | 42 | 83.75 | 53.12 | MAP_PETALBURG_WOODS | 5 |

### Signs (5)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 20 | 50 | 51.25 | 63.12 |  |
| 27 | 66 | 68.75 | 83.12 |  |
| 23 | 5 | 58.75 | 6.88 |  |
| 7 | 20 | 18.75 | 25.62 |  |
| 17 | 23 | 43.75 | 29.38 |  |

### Trainers (8)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 31 | 24 | 78.75 | 30.63 | OBJ_EVENT_GFX_LASS | TRAINER_TYPE_NORMAL | 7 |
| 29 | 8 | 73.75 | 10.62 | OBJ_EVENT_GFX_FISHERMAN | TRAINER_TYPE_NORMAL | 0 |
| 27 | 15 | 68.75 | 19.38 | OBJ_EVENT_GFX_TWIN | TRAINER_TYPE_NORMAL | 1 |
| 28 | 15 | 71.25 | 19.38 | OBJ_EVENT_GFX_TWIN | TRAINER_TYPE_NORMAL | 1 |
| 21 | 25 | 53.75 | 31.87 | OBJ_EVENT_GFX_RICH_BOY | TRAINER_TYPE_NORMAL | 3 |
| 11 | 44 | 28.75 | 55.62 | OBJ_EVENT_GFX_WOMAN_2 | TRAINER_TYPE_NORMAL | 3 |
| 18 | 67 | 46.25 | 84.38 | OBJ_EVENT_GFX_YOUNGSTER | TRAINER_TYPE_NORMAL | 2 |
| 15 | 59 | 38.75 | 74.38 | OBJ_EVENT_GFX_FISHERMAN | TRAINER_TYPE_NORMAL | 0 |

## Route105
- **Layout**: Route105_Layout (LAYOUT_ROUTE105)
- **Dimensions**: 40 x 80 tiles = 640 x 1280 px
- **Inferred from coords** (fallback): 28 x 74 tiles

### Warps (1)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 9 | 20 | 23.75 | 25.62 | MAP_ISLAND_CAVE | 0 |

### Signs (0)
_none_

### Trainers (7)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 19 | 60 | 48.75 | 75.62 | OBJ_EVENT_GFX_SWIMMER_M | TRAINER_TYPE_NORMAL | 6 |
| 27 | 36 | 68.75 | 45.62 | OBJ_EVENT_GFX_SWIMMER_M | TRAINER_TYPE_NORMAL | 3 |
| 8 | 45 | 21.25 | 56.88 | OBJ_EVENT_GFX_SWIMMER_F | TRAINER_TYPE_NORMAL | 3 |
| 19 | 9 | 48.75 | 11.88 | OBJ_EVENT_GFX_SWIMMER_F | TRAINER_TYPE_NORMAL | 3 |
| 17 | 48 | 43.75 | 60.62 | OBJ_EVENT_GFX_HIKER | TRAINER_TYPE_NORMAL | 3 |
| 4 | 54 | 11.25 | 68.12 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 2 |
| 4 | 58 | 11.25 | 73.12 | OBJ_EVENT_GFX_HIKER | TRAINER_TYPE_NORMAL | 4 |

## Route110
- **Layout**: Route110_Layout (LAYOUT_ROUTE110)
- **Dimensions**: 40 x 100 tiles = 640 x 1600 px
- **Inferred from coords** (fallback): 38 x 95 tiles

### Warps (6)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 35 | 24 | 88.75 | 24.5 | MAP_NEW_MAUVILLE_ENTRANCE | 0 |
| 11 | 66 | 28.75 | 66.5 | MAP_ROUTE110_TRICK_HOUSE_ENTRANCE | 0 |
| 15 | 16 | 38.75 | 16.5 | MAP_ROUTE110_SEASIDE_CYCLING_ROAD_NORTH_ENTRANCE | 0 |
| 18 | 16 | 46.25 | 16.5 | MAP_ROUTE110_SEASIDE_CYCLING_ROAD_NORTH_ENTRANCE | 2 |
| 16 | 88 | 41.25 | 88.5 | MAP_ROUTE110_SEASIDE_CYCLING_ROAD_SOUTH_ENTRANCE | 0 |
| 19 | 88 | 48.75 | 88.5 | MAP_ROUTE110_SEASIDE_CYCLING_ROAD_SOUTH_ENTRANCE | 2 |

### Signs (11)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 15 | 25 | 38.75 | 25.5 |  |
| 9 | 51 | 23.75 | 51.5 |  |
| 14 | 88 | 36.25 | 88.5 |  |
| 20 | 94 | 51.25 | 94.5 |  |
| 7 | 79 | 18.75 | 79.5 |  |
| 3 | 17 | 8.75 | 17.5 |  |
| 33 | 39 | 83.75 | 39.5 |  |
| 37 | 70 | 93.75 | 70.5 |  |
| 8 | 67 | 21.25 | 67.5 |  |
| 32 | 93 | 81.25 | 93.5 |  |
| 13 | 16 | 33.75 | 16.5 |  |

### Trainers (14)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 16 | 73 | 41.25 | 73.5 | OBJ_EVENT_GFX_CYCLING_TRIATHLETE_F | TRAINER_TYPE_NORMAL | 3 |
| 19 | 31 | 48.75 | 31.5 | OBJ_EVENT_GFX_CYCLING_TRIATHLETE_M | TRAINER_TYPE_NORMAL | 3 |
| 30 | 31 | 76.25 | 31.5 | OBJ_EVENT_GFX_CYCLING_TRIATHLETE_F | TRAINER_TYPE_NORMAL | 4 |
| 16 | 55 | 41.25 | 55.5 | OBJ_EVENT_GFX_CYCLING_TRIATHLETE_M | TRAINER_TYPE_NORMAL | 3 |
| 3 | 39 | 8.75 | 39.5 | OBJ_EVENT_GFX_PSYCHIC_M | TRAINER_TYPE_NORMAL | 6 |
| 33 | 15 | 83.75 | 15.5 | OBJ_EVENT_GFX_LASS | TRAINER_TYPE_NORMAL | 1 |
| 34 | 40 | 86.25 | 40.5 | OBJ_EVENT_GFX_MANIAC | TRAINER_TYPE_NORMAL | 4 |
| 10 | 19 | 26.25 | 19.5 | OBJ_EVENT_GFX_FISHERMAN | TRAINER_TYPE_NORMAL | 1 |
| 21 | 78 | 53.75 | 78.5 | OBJ_EVENT_GFX_CYCLING_TRIATHLETE_M | TRAINER_TYPE_NORMAL | 2 |
| 33 | 69 | 83.75 | 69.5 | OBJ_EVENT_GFX_YOUNGSTER | TRAINER_TYPE_NORMAL | 3 |
| 10 | 76 | 26.25 | 76.5 | OBJ_EVENT_GFX_POKEFAN_F | TRAINER_TYPE_NORMAL | 2 |
| 7 | 76 | 18.75 | 76.5 | OBJ_EVENT_GFX_POKEFAN_M | TRAINER_TYPE_NORMAL | 2 |
| 10 | 39 | 26.25 | 39.5 | OBJ_EVENT_GFX_CYCLING_TRIATHLETE_F | TRAINER_TYPE_NORMAL | 6 |
| 36 | 40 | 91.25 | 40.5 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 3 |

## Route111
- **Layout**: Route111_Layout (LAYOUT_ROUTE111)
- **Dimensions**: 40 x 140 tiles = 640 x 2240 px
- **Inferred from coords** (fallback): 38 x 133 tiles

### Warps (5)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 13 | 113 | 33.75 | 81.07 | MAP_ROUTE111_WINSTRATE_FAMILYS_HOUSE | 0 |
| 29 | 87 | 73.75 | 62.5 | MAP_DESERT_RUINS | 0 |
| 26 | 18 | 66.25 | 13.21 | MAP_ROUTE111_OLD_LADYS_REST_STOP | 0 |
| 19 | 58 | 48.75 | 41.79 | MAP_MIRAGE_TOWER_1F | 0 |
| 31 | 113 | 78.75 | 81.07 | MAP_TRAINER_HILL_ENTRANCE | 0 |

### Signs (7)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 16 | 114 | 41.25 | 81.79 |  |
| 24 | 126 | 61.25 | 90.36 |  |
| 7 | 66 | 18.75 | 47.5 |  |
| 13 | 6 | 33.75 | 4.64 |  |
| 25 | 19 | 63.75 | 13.93 |  |
| 7 | 84 | 18.75 | 60.36 |  |
| 24 | 116 | 61.25 | 83.21 |  |

### Trainers (17)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 28 | 51 | 71.25 | 36.79 | OBJ_EVENT_GFX_PICNICKER | TRAINER_TYPE_NORMAL | 3 |
| 29 | 37 | 73.75 | 26.79 | OBJ_EVENT_GFX_CAMPER | TRAINER_TYPE_NORMAL | 3 |
| 27 | 69 | 68.75 | 49.64 | OBJ_EVENT_GFX_HIKER | TRAINER_TYPE_NORMAL | 2 |
| 21 | 47 | 53.75 | 33.93 | OBJ_EVENT_GFX_CAMPER | TRAINER_TYPE_NORMAL | 4 |
| 32 | 66 | 81.25 | 47.5 | OBJ_EVENT_GFX_PICNICKER | TRAINER_TYPE_NORMAL | 3 |
| 10 | 82 | 26.25 | 58.93 | OBJ_EVENT_GFX_PICNICKER | TRAINER_TYPE_NORMAL | 2 |
| 11 | 71 | 28.75 | 51.07 | OBJ_EVENT_GFX_CAMPER | TRAINER_TYPE_NORMAL | 3 |
| 32 | 29 | 81.25 | 21.07 | OBJ_EVENT_GFX_BLACK_BELT | TRAINER_TYPE_NORMAL | 2 |
| 11 | 11 | 28.75 | 8.21 | OBJ_EVENT_GFX_WOMAN_5 | TRAINER_TYPE_NORMAL | 4 |
| 9 | 27 | 23.75 | 19.64 | OBJ_EVENT_GFX_MAN_3 | TRAINER_TYPE_NORMAL | 3 |
| 26 | 132 | 66.25 | 94.64 | OBJ_EVENT_GFX_CAMPER | TRAINER_TYPE_NORMAL | 5 |
| 20 | 132 | 51.25 | 94.64 | OBJ_EVENT_GFX_WOMAN_2 | TRAINER_TYPE_NORMAL | 5 |
| 19 | 121 | 48.75 | 86.79 | OBJ_EVENT_GFX_PICNICKER | TRAINER_TYPE_NORMAL | 2 |
| 16 | 119 | 41.25 | 85.36 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 3 |
| 29 | 77 | 73.75 | 55.36 | OBJ_EVENT_GFX_HIKER | TRAINER_TYPE_NORMAL | 7 |
| 22 | 77 | 56.25 | 55.36 | OBJ_EVENT_GFX_PICNICKER | TRAINER_TYPE_NORMAL | 6 |
| 37 | 77 | 93.75 | 55.36 | OBJ_EVENT_GFX_CAMPER | TRAINER_TYPE_NORMAL | 7 |

## Route113
- **Layout**: Route113_Layout (LAYOUT_ROUTE113)
- **Dimensions**: 100 x 20 tiles = 1600 x 320 px
- **Inferred from coords** (fallback): 95 x 16 tiles

### Warps (3)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 33 | 5 | 33.5 | 27.5 | MAP_ROUTE113_GLASS_WORKSHOP | 0 |
| 41 | 12 | 41.5 | 62.5 | MAP_TERRA_CAVE_ENTRANCE | 0 |
| 88 | 5 | 88.5 | 27.5 | MAP_TERRA_CAVE_ENTRANCE | 0 |

### Signs (4)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 85 | 6 | 85.5 | 32.5 |  |
| 12 | 9 | 12.5 | 47.5 |  |
| 58 | 4 | 58.5 | 22.5 |  |
| 31 | 5 | 31.5 | 27.5 |  |

### Trainers (11)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 62 | 8 | 62.5 | 42.5 | OBJ_EVENT_GFX_YOUNGSTER | TRAINER_TYPE_NORMAL | 3 |
| 21 | 11 | 21.5 | 57.5 | OBJ_EVENT_GFX_YOUNGSTER | TRAINER_TYPE_NORMAL | 3 |
| 51 | 11 | 51.5 | 57.5 | OBJ_EVENT_GFX_WOMAN_5 | TRAINER_TYPE_NORMAL | 2 |
| 29 | 6 | 29.5 | 32.5 | OBJ_EVENT_GFX_NINJA_BOY | TRAINER_TYPE_BURIED | 1 |
| 71 | 2 | 71.5 | 12.5 | OBJ_EVENT_GFX_NINJA_BOY | TRAINER_TYPE_BURIED | 1 |
| 45 | 6 | 45.5 | 32.5 | OBJ_EVENT_GFX_TWIN | TRAINER_TYPE_NORMAL | 1 |
| 46 | 6 | 46.5 | 32.5 | OBJ_EVENT_GFX_TWIN | TRAINER_TYPE_NORMAL | 1 |
| 75 | 3 | 75.5 | 17.5 | OBJ_EVENT_GFX_MANIAC | TRAINER_TYPE_NORMAL | 4 |
| 71 | 4 | 71.5 | 22.5 | OBJ_EVENT_GFX_CAMPER | TRAINER_TYPE_NORMAL | 1 |
| 7 | 6 | 7.5 | 32.5 | OBJ_EVENT_GFX_PICNICKER | TRAINER_TYPE_NORMAL | 6 |
| 7 | 13 | 7.5 | 67.5 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 6 |

## Route116
- **Layout**: Route116_Layout (LAYOUT_ROUTE116)
- **Dimensions**: 100 x 20 tiles = 1600 x 320 px
- **Inferred from coords** (fallback): 81 x 18 tiles

### Warps (5)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 47 | 8 | 47.5 | 42.5 | MAP_RUSTURF_TUNNEL | 0 |
| 38 | 8 | 38.5 | 42.5 | MAP_ROUTE116_TUNNELERS_REST_HOUSE | 0 |
| 65 | 10 | 65.5 | 52.5 | MAP_RUSTURF_TUNNEL | 2 |
| 59 | 13 | 59.5 | 67.5 | MAP_TERRA_CAVE_ENTRANCE | 0 |
| 79 | 6 | 79.5 | 32.5 | MAP_TERRA_CAVE_ENTRANCE | 0 |

### Signs (5)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 5 | 10 | 5.5 | 52.5 |  |
| 48 | 9 | 48.5 | 47.5 |  |
| 40 | 9 | 40.5 | 47.5 |  |
| 16 | 12 | 16.5 | 62.5 |  |
| 29 | 10 | 29.5 | 52.5 |  |

### Trainers (10)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 12 | 7 | 12.5 | 37.5 | OBJ_EVENT_GFX_YOUNGSTER | TRAINER_TYPE_NORMAL | 3 |
| 13 | 17 | 13.5 | 87.5 | OBJ_EVENT_GFX_BUG_CATCHER | TRAINER_TYPE_NORMAL | 2 |
| 36 | 17 | 36.5 | 87.5 | OBJ_EVENT_GFX_HIKER | TRAINER_TYPE_NORMAL | 3 |
| 26 | 6 | 26.5 | 32.5 | OBJ_EVENT_GFX_LASS | TRAINER_TYPE_NORMAL | 2 |
| 22 | 16 | 22.5 | 82.5 | OBJ_EVENT_GFX_GIRL_3 | TRAINER_TYPE_NORMAL | 3 |
| 28 | 8 | 28.5 | 42.5 | OBJ_EVENT_GFX_SCHOOL_KID_M | TRAINER_TYPE_NORMAL | 4 |
| 33 | 8 | 33.5 | 42.5 | OBJ_EVENT_GFX_WOMAN_2 | TRAINER_TYPE_NORMAL | 1 |
| 33 | 5 | 33.5 | 27.5 | OBJ_EVENT_GFX_BOY_2 | TRAINER_TYPE_NORMAL | 2 |
| 36 | 13 | 36.5 | 67.5 | OBJ_EVENT_GFX_YOUNGSTER | TRAINER_TYPE_NORMAL | 5 |
| 42 | 13 | 42.5 | 67.5 | OBJ_EVENT_GFX_HIKER | TRAINER_TYPE_NORMAL | 5 |

## Route117
- **Layout**: Route117_Layout (LAYOUT_ROUTE117)
- **Dimensions**: 60 x 20 tiles = 960 x 320 px
- **Inferred from coords** (fallback): 52 x 19 tiles

### Warps (1)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 51 | 5 | 85.83 | 27.5 | MAP_ROUTE117_POKEMON_DAY_CARE | 0 |

### Signs (3)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 16 | 6 | 27.5 | 32.5 |  |
| 49 | 12 | 82.5 | 62.5 |  |
| 49 | 5 | 82.5 | 27.5 |  |

### Trainers (10)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 38 | 16 | 64.17 | 82.5 | OBJ_EVENT_GFX_RUNNING_TRIATHLETE_M | TRAINER_TYPE_NORMAL | 4 |
| 8 | 10 | 14.17 | 52.5 | OBJ_EVENT_GFX_WOMAN_2 | TRAINER_TYPE_NORMAL | 3 |
| 33 | 11 | 55.83 | 57.5 | OBJ_EVENT_GFX_MAN_4 | TRAINER_TYPE_NORMAL | 4 |
| 26 | 13 | 44.17 | 67.5 | OBJ_EVENT_GFX_RUNNING_TRIATHLETE_F | TRAINER_TYPE_NORMAL | 5 |
| 17 | 12 | 29.17 | 62.5 | OBJ_EVENT_GFX_MANIAC | TRAINER_TYPE_NORMAL | 4 |
| 43 | 6 | 72.5 | 32.5 | OBJ_EVENT_GFX_LASS | TRAINER_TYPE_NORMAL | 1 |
| 42 | 6 | 70.83 | 32.5 | OBJ_EVENT_GFX_LASS | TRAINER_TYPE_NORMAL | 1 |
| 15 | 4 | 25.83 | 22.5 | OBJ_EVENT_GFX_LASS | TRAINER_TYPE_NORMAL | 4 |
| 21 | 4 | 35.83 | 22.5 | OBJ_EVENT_GFX_GIRL_3 | TRAINER_TYPE_NORMAL | 4 |
| 16 | 4 | 27.5 | 22.5 | OBJ_EVENT_GFX_RUNNING_TRIATHLETE_F | TRAINER_TYPE_NORMAL | 4 |

## Route118
- **Layout**: Route118_Layout (LAYOUT_ROUTE118)
- **Dimensions**: 80 x 20 tiles = 1280 x 320 px
- **Inferred from coords** (fallback): 70 x 16 tiles

### Warps (2)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 42 | 6 | 53.12 | 32.5 | MAP_TERRA_CAVE_ENTRANCE | 0 |
| 9 | 6 | 11.88 | 32.5 | MAP_TERRA_CAVE_ENTRANCE | 0 |

### Signs (2)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 13 | 6 | 16.88 | 32.5 |  |
| 56 | 8 | 70.62 | 42.5 |  |

### Trainers (7)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 64 | 10 | 80.62 | 52.5 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 3 |
| 7 | 12 | 9.38 | 62.5 | OBJ_EVENT_GFX_WOMAN_2 | TRAINER_TYPE_NORMAL | 4 |
| 14 | 14 | 18.12 | 72.5 | OBJ_EVENT_GFX_FISHERMAN | TRAINER_TYPE_NORMAL | 0 |
| 56 | 7 | 70.62 | 37.5 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 3 |
| 39 | 15 | 49.38 | 77.5 | OBJ_EVENT_GFX_FISHERMAN | TRAINER_TYPE_NORMAL | 2 |
| 17 | 11 | 21.88 | 57.5 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 3 |
| 7 | 7 | 9.38 | 37.5 | OBJ_EVENT_GFX_YOUNGSTER | TRAINER_TYPE_NORMAL | 4 |

## Route119
- **Layout**: Route119_Layout (LAYOUT_ROUTE119)
- **Dimensions**: 40 x 140 tiles = 640 x 2240 px
- **Inferred from coords** (fallback): 37 x 138 tiles

### Warps (2)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 6 | 32 | 16.25 | 23.21 | MAP_ROUTE119_WEATHER_INSTITUTE_1F | 0 |
| 33 | 109 | 83.75 | 78.21 | MAP_ROUTE119_HOUSE | 0 |

### Signs (3)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 9 | 33 | 23.75 | 23.93 |  |
| 27 | 19 | 68.75 | 13.93 |  |
| 28 | 9 | 71.25 | 6.79 |  |

### Trainers (17)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 12 | 123 | 31.25 | 88.21 | OBJ_EVENT_GFX_BUG_CATCHER | TRAINER_TYPE_NORMAL | 1 |
| 26 | 123 | 66.25 | 88.21 | OBJ_EVENT_GFX_MANIAC | TRAINER_TYPE_NORMAL | 1 |
| 5 | 125 | 13.75 | 89.64 | OBJ_EVENT_GFX_MANIAC | TRAINER_TYPE_NORMAL | 1 |
| 7 | 74 | 18.75 | 53.21 | OBJ_EVENT_GFX_CAMPER | TRAINER_TYPE_NORMAL | 3 |
| 28 | 116 | 71.25 | 83.21 | OBJ_EVENT_GFX_MANIAC | TRAINER_TYPE_NORMAL | 1 |
| 35 | 83 | 88.75 | 59.64 | OBJ_EVENT_GFX_PICNICKER | TRAINER_TYPE_NORMAL | 2 |
| 34 | 122 | 86.25 | 87.5 | OBJ_EVENT_GFX_BUG_CATCHER | TRAINER_TYPE_NORMAL | 1 |
| 17 | 128 | 43.75 | 91.79 | OBJ_EVENT_GFX_BUG_CATCHER | TRAINER_TYPE_NORMAL | 1 |
| 28 | 14 | 71.25 | 10.36 | OBJ_EVENT_GFX_NINJA_BOY | TRAINER_TYPE_NORMAL | 1 |
| 19 | 49 | 48.75 | 35.36 | OBJ_EVENT_GFX_NINJA_BOY | TRAINER_TYPE_NORMAL | 3 |
| 10 | 50 | 26.25 | 36.07 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 3 |
| 8 | 63 | 21.25 | 45.36 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 5 |
| 29 | 6 | 73.75 | 4.64 | OBJ_EVENT_GFX_NINJA_BOY | TRAINER_TYPE_NORMAL | 3 |
| 13 | 104 | 33.75 | 74.64 | OBJ_EVENT_GFX_FISHERMAN | TRAINER_TYPE_NORMAL | 0 |
| 8 | 68 | 21.25 | 48.93 | OBJ_EVENT_GFX_WOMAN_2 | TRAINER_TYPE_NORMAL | 5 |
| 16 | 52 | 41.25 | 37.5 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 3 |
| 32 | 15 | 81.25 | 11.07 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 4 |

## Route120
- **Layout**: Route120_Layout (LAYOUT_ROUTE120)
- **Dimensions**: 40 x 100 tiles = 640 x 1600 px
- **Inferred from coords** (fallback): 39 x 93 tiles

### Warps (2)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 7 | 55 | 18.75 | 55.5 | MAP_ANCIENT_TOMB | 0 |
| 19 | 23 | 48.75 | 23.5 | MAP_SCORCHED_SLAB | 0 |

### Signs (2)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 27 | 3 | 68.75 | 3.5 |  |
| 38 | 88 | 96.25 | 88.5 |  |

### Trainers (13)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 5 | 22 | 13.75 | 22.5 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 3 |
| 32 | 14 | 81.25 | 14.5 | OBJ_EVENT_GFX_MAN_5 | TRAINER_TYPE_NORMAL | 3 |
| 27 | 51 | 68.75 | 51.5 | OBJ_EVENT_GFX_CAMPER | TRAINER_TYPE_NORMAL | 7 |
| 36 | 45 | 91.25 | 45.5 | OBJ_EVENT_GFX_PICNICKER | TRAINER_TYPE_NORMAL | 2 |
| 19 | 80 | 48.75 | 80.5 | OBJ_EVENT_GFX_MANIAC | TRAINER_TYPE_NORMAL | 3 |
| 31 | 37 | 78.75 | 37.5 | OBJ_EVENT_GFX_WOMAN_5 | TRAINER_TYPE_NORMAL | 4 |
| 9 | 60 | 23.75 | 60.5 | OBJ_EVENT_GFX_HIKER | TRAINER_TYPE_NORMAL | 4 |
| 16 | 6 | 41.25 | 6.5 | OBJ_EVENT_GFX_WOMAN_5 | TRAINER_TYPE_NORMAL | 4 |
| 18 | 34 | 46.25 | 34.5 | OBJ_EVENT_GFX_WOMAN_5 | TRAINER_TYPE_NORMAL | 3 |
| 10 | 72 | 26.25 | 72.5 | OBJ_EVENT_GFX_NINJA_BOY | TRAINER_TYPE_NORMAL | 3 |
| 19 | 28 | 48.75 | 28.5 | OBJ_EVENT_GFX_NINJA_BOY | TRAINER_TYPE_NORMAL | 3 |
| 19 | 32 | 48.75 | 32.5 | OBJ_EVENT_GFX_GIRL_3 | TRAINER_TYPE_NORMAL | 3 |
| 14 | 34 | 36.25 | 34.5 | OBJ_EVENT_GFX_MAN_3 | TRAINER_TYPE_NORMAL | 3 |

## PetalburgCity
- **Layout**: PetalburgCity_Layout (LAYOUT_PETALBURG_CITY)
- **Dimensions**: 30 x 30 tiles = 480 x 480 px
- **Inferred from coords** (fallback): 28 x 29 tiles

### Warps (6)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 10 | 19 | 35.0 | 65.0 | MAP_PETALBURG_CITY_HOUSE1 | 0 |
| 7 | 5 | 25.0 | 18.33 | MAP_PETALBURG_CITY_WALLYS_HOUSE | 0 |
| 15 | 8 | 51.67 | 28.33 | MAP_PETALBURG_CITY_GYM | 0 |
| 20 | 16 | 68.33 | 55.0 | MAP_PETALBURG_CITY_POKEMON_CENTER_1F | 0 |
| 20 | 24 | 68.33 | 81.67 | MAP_PETALBURG_CITY_HOUSE2 | 0 |
| 25 | 12 | 85.0 | 41.67 | MAP_PETALBURG_CITY_MART | 0 |

### Signs (7)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 17 | 10 | 58.33 | 35.0 |  |
| 26 | 12 | 88.33 | 41.67 |  |
| 21 | 16 | 71.67 | 55.0 |  |
| 17 | 16 | 58.33 | 55.0 |  |
| 22 | 16 | 75.0 | 55.0 |  |
| 27 | 12 | 91.67 | 41.67 |  |
| 8 | 9 | 28.33 | 31.67 |  |

### Trainers (0)
_none_

## PetalburgWoods
- **Layout**: PetalburgWoods_Layout (LAYOUT_PETALBURG_WOODS)
- **Dimensions**: 48 x 44 tiles = 768 x 704 px
- **Inferred from coords** (fallback): 46 x 39 tiles

### Warps (6)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 14 | 5 | 30.21 | 12.5 | MAP_ROUTE104 | 2 |
| 15 | 5 | 32.29 | 12.5 | MAP_ROUTE104 | 3 |
| 16 | 38 | 34.38 | 87.5 | MAP_ROUTE104 | 4 |
| 17 | 38 | 36.46 | 87.5 | MAP_ROUTE104 | 5 |
| 36 | 38 | 76.04 | 87.5 | MAP_ROUTE104 | 6 |
| 37 | 38 | 78.12 | 87.5 | MAP_ROUTE104 | 7 |

### Signs (2)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 14 | 32 | 30.21 | 73.86 |  |
| 11 | 8 | 23.96 | 19.32 |  |

### Trainers (2)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 7 | 32 | 15.62 | 73.86 | OBJ_EVENT_GFX_BUG_CATCHER | TRAINER_TYPE_NORMAL | 3 |
| 4 | 14 | 9.38 | 32.95 | OBJ_EVENT_GFX_BUG_CATCHER | TRAINER_TYPE_NORMAL | 3 |

## RustboroCity
- **Layout**: RustboroCity_Layout (LAYOUT_RUSTBORO_CITY)
- **Dimensions**: 40 x 60 tiles = 640 x 960 px
- **Inferred from coords** (fallback): 37 x 54 tiles

### Warps (12)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 27 | 19 | 68.75 | 32.5 | MAP_RUSTBORO_CITY_GYM | 0 |
| 13 | 30 | 33.75 | 50.83 | MAP_RUSTBORO_CITY_FLAT1_1F | 0 |
| 16 | 45 | 41.25 | 75.83 | MAP_RUSTBORO_CITY_MART | 0 |
| 16 | 38 | 41.25 | 64.17 | MAP_RUSTBORO_CITY_POKEMON_CENTER_1F | 0 |
| 27 | 34 | 68.75 | 57.5 | MAP_RUSTBORO_CITY_POKEMON_SCHOOL | 0 |
| 11 | 15 | 28.75 | 25.83 | MAP_RUSTBORO_CITY_DEVON_CORP_1F | 0 |
| 12 | 15 | 31.25 | 25.83 | MAP_RUSTBORO_CITY_DEVON_CORP_1F | 1 |
| 33 | 19 | 83.75 | 32.5 | MAP_RUSTBORO_CITY_HOUSE1 | 0 |
| 9 | 38 | 23.75 | 64.17 | MAP_RUSTBORO_CITY_CUTTERS_HOUSE | 0 |
| 30 | 28 | 76.25 | 47.5 | MAP_RUSTBORO_CITY_HOUSE2 | 0 |
| 5 | 51 | 13.75 | 85.83 | MAP_RUSTBORO_CITY_FLAT2_1F | 0 |
| 26 | 46 | 66.25 | 77.5 | MAP_RUSTBORO_CITY_HOUSE3 | 0 |

### Signs (10)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 23 | 19 | 58.75 | 32.5 |  |
| 25 | 35 | 63.75 | 59.17 |  |
| 17 | 45 | 43.75 | 75.83 |  |
| 18 | 38 | 46.25 | 64.17 |  |
| 19 | 49 | 48.75 | 82.5 |  |
| 18 | 45 | 46.25 | 75.83 |  |
| 17 | 38 | 43.75 | 64.17 |  |
| 17 | 20 | 43.75 | 34.17 |  |
| 30 | 8 | 76.25 | 14.17 |  |
| 12 | 38 | 31.25 | 64.17 |  |

### Trainers (0)
_none_

## RusturfTunnel
- **Layout**: RusturfTunnel_Layout (LAYOUT_RUSTURF_TUNNEL)
- **Dimensions**: 36 x 24 tiles = 576 x 384 px
- **Inferred from coords** (fallback): 33 x 21 tiles

### Warps (3)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 4 | 10 | 12.5 | 43.75 | MAP_ROUTE116 | 0 |
| 29 | 16 | 81.94 | 68.75 | MAP_VERDANTURF_TOWN | 4 |
| 18 | 20 | 51.39 | 85.42 | MAP_ROUTE116 | 2 |

### Signs (0)
_none_

### Trainers (1)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 32 | 13 | 90.28 | 56.25 | OBJ_EVENT_GFX_HIKER | TRAINER_TYPE_NORMAL | 3 |

## DewfordTown
- **Layout**: DewfordTown_Layout (LAYOUT_DEWFORD_TOWN)
- **Dimensions**: 20 x 20 tiles = 320 x 320 px
- **Inferred from coords** (fallback): 18 x 18 tiles

### Warps (5)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 3 | 3 | 17.5 | 17.5 | MAP_DEWFORD_TOWN_HALL | 0 |
| 2 | 10 | 12.5 | 52.5 | MAP_DEWFORD_TOWN_POKEMON_CENTER_1F | 0 |
| 8 | 17 | 42.5 | 87.5 | MAP_DEWFORD_TOWN_GYM | 0 |
| 17 | 14 | 87.5 | 72.5 | MAP_DEWFORD_TOWN_HOUSE1 | 0 |
| 8 | 8 | 42.5 | 42.5 | MAP_DEWFORD_TOWN_HOUSE2 | 0 |

### Signs (5)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 10 | 10 | 52.5 | 52.5 |  |
| 11 | 16 | 57.5 | 82.5 |  |
| 4 | 10 | 22.5 | 52.5 |  |
| 3 | 10 | 17.5 | 52.5 |  |
| 2 | 4 | 12.5 | 22.5 |  |

### Trainers (0)
_none_

## SlateportCity
- **Layout**: SlateportCity_Layout (LAYOUT_SLATEPORT_CITY)
- **Dimensions**: 40 x 60 tiles = 640 x 960 px
- **Inferred from coords** (fallback): 41 x 52 tiles

### Warps (11)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 19 | 19 | 48.75 | 32.5 | MAP_SLATEPORT_CITY_POKEMON_CENTER_1F | 0 |
| 13 | 26 | 33.75 | 44.17 | MAP_SLATEPORT_CITY_MART | 0 |
| 26 | 38 | 66.25 | 64.17 | MAP_SLATEPORT_CITY_STERNS_SHIPYARD_1F | 0 |
| 10 | 12 | 26.25 | 20.83 | MAP_SLATEPORT_CITY_BATTLE_TENT_LOBBY | 0 |
| 4 | 26 | 11.25 | 44.17 | MAP_SLATEPORT_CITY_POKEMON_FAN_CLUB | 0 |
| 30 | 26 | 76.25 | 44.17 | MAP_SLATEPORT_CITY_OCEANIC_MUSEUM_1F | 0 |
| 5 | 19 | 13.75 | 32.5 | MAP_SLATEPORT_CITY_NAME_RATERS_HOUSE | 0 |
| 31 | 26 | 78.75 | 44.17 | MAP_SLATEPORT_CITY_OCEANIC_MUSEUM_1F | 1 |
| 28 | 12 | 71.25 | 20.83 | MAP_SLATEPORT_CITY_HARBOR | 0 |
| 40 | 7 | 101.25 | 12.5 | MAP_SLATEPORT_CITY_HARBOR | 2 |
| 21 | 44 | 53.75 | 74.17 | MAP_SLATEPORT_CITY_HOUSE | 0 |

### Signs (13)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 8 | 19 | 21.25 | 32.5 |  |
| 20 | 19 | 51.25 | 32.5 |  |
| 21 | 19 | 53.75 | 32.5 |  |
| 14 | 26 | 36.25 | 44.17 |  |
| 24 | 12 | 61.25 | 20.83 |  |
| 15 | 26 | 38.75 | 44.17 |  |
| 14 | 51 | 36.25 | 85.83 |  |
| 26 | 26 | 66.25 | 44.17 |  |
| 16 | 22 | 41.25 | 37.5 |  |
| 8 | 26 | 21.25 | 44.17 |  |
| 7 | 13 | 18.75 | 22.5 |  |
| 23 | 38 | 58.75 | 64.17 |  |
| 10 | 36 | 26.25 | 60.83 |  |

### Trainers (0)
_none_

## MauvilleCity
- **Layout**: MauvilleCity_Layout (LAYOUT_MAUVILLE_CITY)
- **Dimensions**: 40 x 20 tiles = 640 x 320 px
- **Inferred from coords** (fallback): 36 x 20 tiles

### Warps (7)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 8 | 5 | 21.25 | 27.5 | MAP_MAUVILLE_CITY_GYM | 0 |
| 22 | 5 | 56.25 | 27.5 | MAP_MAUVILLE_CITY_POKEMON_CENTER_1F | 0 |
| 35 | 5 | 88.75 | 27.5 | MAP_MAUVILLE_CITY_BIKE_SHOP | 0 |
| 23 | 14 | 58.75 | 72.5 | MAP_MAUVILLE_CITY_MART | 0 |
| 32 | 14 | 81.25 | 72.5 | MAP_MAUVILLE_CITY_HOUSE1 | 0 |
| 8 | 13 | 21.25 | 67.5 | MAP_MAUVILLE_CITY_GAME_CORNER | 0 |
| 19 | 14 | 48.75 | 72.5 | MAP_MAUVILLE_CITY_HOUSE2 | 0 |

### Signs (8)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 23 | 5 | 58.75 | 27.5 |  |
| 11 | 6 | 28.75 | 32.5 |  |
| 24 | 14 | 61.25 | 72.5 |  |
| 25 | 14 | 63.75 | 72.5 |  |
| 24 | 5 | 61.25 | 27.5 |  |
| 19 | 7 | 48.75 | 37.5 |  |
| 33 | 6 | 83.75 | 32.5 |  |
| 11 | 15 | 28.75 | 77.5 |  |

### Trainers (0)
_none_

## LavaridgeTown
- **Layout**: LavaridgeTown_Layout (LAYOUT_LAVARIDGE_TOWN)
- **Dimensions**: 20 x 20 tiles = 320 x 320 px
- **Inferred from coords** (fallback): 18 x 17 tiles

### Warps (6)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 12 | 15 | 62.5 | 77.5 | MAP_LAVARIDGE_TOWN_HERB_SHOP | 0 |
| 5 | 15 | 27.5 | 77.5 | MAP_LAVARIDGE_TOWN_GYM_1F | 0 |
| 15 | 5 | 77.5 | 27.5 | MAP_LAVARIDGE_TOWN_MART | 0 |
| 9 | 6 | 47.5 | 32.5 | MAP_LAVARIDGE_TOWN_POKEMON_CENTER_1F | 0 |
| 16 | 15 | 82.5 | 77.5 | MAP_LAVARIDGE_TOWN_HOUSE | 0 |
| 9 | 2 | 47.5 | 12.5 | MAP_LAVARIDGE_TOWN_POKEMON_CENTER_1F | 3 |

### Signs (7)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 14 | 16 | 72.5 | 82.5 |  |
| 7 | 15 | 37.5 | 77.5 |  |
| 17 | 5 | 87.5 | 27.5 |  |
| 13 | 8 | 67.5 | 42.5 |  |
| 10 | 6 | 52.5 | 32.5 |  |
| 16 | 5 | 82.5 | 27.5 |  |
| 11 | 6 | 57.5 | 32.5 |  |

### Trainers (0)
_none_

## FallarborTown
- **Layout**: FallarborTown_Layout (LAYOUT_FALLARBOR_TOWN)
- **Dimensions**: 20 x 20 tiles = 320 x 320 px
- **Inferred from coords** (fallback): 18 x 18 tiles

### Warps (5)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 15 | 15 | 77.5 | 77.5 | MAP_FALLARBOR_TOWN_MART | 0 |
| 8 | 7 | 42.5 | 37.5 | MAP_FALLARBOR_TOWN_BATTLE_TENT_LOBBY | 0 |
| 14 | 7 | 72.5 | 37.5 | MAP_FALLARBOR_TOWN_POKEMON_CENTER_1F | 0 |
| 6 | 17 | 32.5 | 87.5 | MAP_FALLARBOR_TOWN_COZMOS_HOUSE | 0 |
| 1 | 6 | 7.5 | 32.5 | MAP_FALLARBOR_TOWN_MOVE_RELEARNERS_HOUSE | 0 |

### Signs (7)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 16 | 15 | 82.5 | 77.5 |  |
| 15 | 7 | 77.5 | 37.5 |  |
| 6 | 8 | 32.5 | 42.5 |  |
| 16 | 7 | 82.5 | 37.5 |  |
| 10 | 11 | 52.5 | 57.5 |  |
| 17 | 15 | 87.5 | 77.5 |  |
| 3 | 7 | 17.5 | 37.5 |  |

### Trainers (0)
_none_

## FortreeCity
- **Layout**: FortreeCity_Layout (LAYOUT_FORTREE_CITY)
- **Dimensions**: 40 x 20 tiles = 640 x 320 px
- **Inferred from coords** (fallback): 38 x 17 tiles

### Warps (9)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 5 | 6 | 13.75 | 32.5 | MAP_FORTREE_CITY_POKEMON_CENTER_1F | 0 |
| 10 | 3 | 26.25 | 17.5 | MAP_FORTREE_CITY_HOUSE1 | 0 |
| 22 | 11 | 56.25 | 57.5 | MAP_FORTREE_CITY_GYM | 0 |
| 4 | 14 | 11.25 | 72.5 | MAP_FORTREE_CITY_MART | 0 |
| 17 | 3 | 43.75 | 17.5 | MAP_FORTREE_CITY_HOUSE2 | 0 |
| 25 | 3 | 63.75 | 17.5 | MAP_FORTREE_CITY_HOUSE3 | 0 |
| 32 | 2 | 81.25 | 12.5 | MAP_FORTREE_CITY_HOUSE4 | 0 |
| 12 | 13 | 31.25 | 67.5 | MAP_FORTREE_CITY_HOUSE5 | 0 |
| 37 | 13 | 93.75 | 67.5 | MAP_FORTREE_CITY_DECORATION_SHOP | 0 |

### Signs (6)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 6 | 9 | 16.25 | 47.5 |  |
| 7 | 6 | 18.75 | 32.5 |  |
| 5 | 14 | 13.75 | 72.5 |  |
| 26 | 10 | 66.25 | 52.5 |  |
| 6 | 6 | 16.25 | 32.5 |  |
| 6 | 14 | 16.25 | 72.5 |  |

### Trainers (0)
_none_

## MossdeepCity
- **Layout**: MossdeepCity_Layout (LAYOUT_MOSSDEEP_CITY)
- **Dimensions**: 80 x 40 tiles = 1280 x 640 px
- **Inferred from coords** (fallback): 68 x 36 tiles

### Warps (10)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 28 | 9 | 35.62 | 23.75 | MAP_MOSSDEEP_CITY_HOUSE1 | 0 |
| 38 | 9 | 48.12 | 23.75 | MAP_MOSSDEEP_CITY_GYM | 0 |
| 28 | 16 | 35.62 | 41.25 | MAP_MOSSDEEP_CITY_POKEMON_CENTER_1F | 0 |
| 67 | 25 | 84.38 | 63.75 | MAP_MOSSDEEP_CITY_HOUSE2 | 0 |
| 37 | 18 | 46.88 | 46.25 | MAP_MOSSDEEP_CITY_MART | 0 |
| 49 | 6 | 61.88 | 16.25 | MAP_MOSSDEEP_CITY_HOUSE3 | 0 |
| 19 | 10 | 24.38 | 26.25 | MAP_MOSSDEEP_CITY_STEVENS_HOUSE | 0 |
| 18 | 16 | 23.12 | 41.25 | MAP_MOSSDEEP_CITY_HOUSE4 | 1 |
| 64 | 15 | 80.62 | 38.75 | MAP_MOSSDEEP_CITY_SPACE_CENTER_1F | 0 |
| 36 | 24 | 45.62 | 61.25 | MAP_MOSSDEEP_CITY_GAME_CORNER_1F | 0 |

### Signs (8)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 25 | 16 | 31.87 | 41.25 |  |
| 34 | 9 | 43.12 | 23.75 |  |
| 29 | 16 | 36.88 | 41.25 |  |
| 38 | 18 | 48.12 | 46.25 |  |
| 66 | 16 | 83.12 | 41.25 |  |
| 30 | 16 | 38.12 | 41.25 |  |
| 39 | 18 | 49.38 | 46.25 |  |
| 57 | 21 | 71.88 | 53.75 |  |

### Trainers (0)
_none_

## SootopolisCity
- **Layout**: SootopolisCity_Layout (LAYOUT_SOOTOPOLIS_CITY)
- **Dimensions**: 60 x 60 tiles = 960 x 960 px
- **Inferred from coords** (fallback): 54 x 45 tiles

### Warps (13)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 43 | 31 | 72.5 | 52.5 | MAP_SOOTOPOLIS_CITY_POKEMON_CENTER_1F | 0 |
| 17 | 29 | 29.17 | 49.17 | MAP_SOOTOPOLIS_CITY_MART | 0 |
| 31 | 32 | 52.5 | 54.17 | MAP_SOOTOPOLIS_CITY_GYM_1F | 0 |
| 31 | 16 | 52.5 | 27.5 | MAP_CAVE_OF_ORIGIN_ENTRANCE | 0 |
| 9 | 6 | 15.83 | 10.83 | MAP_SOOTOPOLIS_CITY_HOUSE1 | 0 |
| 45 | 6 | 75.83 | 10.83 | MAP_SOOTOPOLIS_CITY_HOUSE2 | 0 |
| 9 | 17 | 15.83 | 29.17 | MAP_SOOTOPOLIS_CITY_HOUSE3 | 0 |
| 44 | 17 | 74.17 | 29.17 | MAP_SOOTOPOLIS_CITY_HOUSE4 | 0 |
| 9 | 26 | 15.83 | 44.17 | MAP_SOOTOPOLIS_CITY_HOUSE5 | 0 |
| 53 | 28 | 89.17 | 47.5 | MAP_SOOTOPOLIS_CITY_HOUSE6 | 0 |
| 8 | 35 | 14.17 | 59.17 | MAP_SOOTOPOLIS_CITY_HOUSE7 | 0 |
| 48 | 25 | 80.83 | 42.5 | MAP_SOOTOPOLIS_CITY_LOTAD_AND_SEEDOT_HOUSE | 0 |
| 51 | 36 | 85.83 | 60.83 | MAP_SOOTOPOLIS_CITY_MYSTERY_EVENTS_HOUSE_1F | 0 |

### Signs (6)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 33 | 34 | 55.83 | 57.5 |  |
| 19 | 29 | 32.5 | 49.17 |  |
| 44 | 31 | 74.17 | 52.5 |  |
| 45 | 31 | 75.83 | 52.5 |  |
| 18 | 29 | 30.83 | 49.17 |  |
| 41 | 37 | 69.17 | 62.5 |  |

### Trainers (0)
_none_

## LilycoveCity
- **Layout**: LilycoveCity_Layout (LAYOUT_LILYCOVE_CITY)
- **Dimensions**: 80 x 40 tiles = 1280 x 640 px
- **Inferred from coords** (fallback): 74 x 38 tiles

### Warps (14)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 27 | 6 | 34.38 | 16.25 | MAP_LILYCOVE_CITY_DEPARTMENT_STORE_1F | 0 |
| 37 | 24 | 46.88 | 61.25 | MAP_LILYCOVE_CITY_COVE_LILY_MOTEL_1F | 0 |
| 24 | 14 | 30.63 | 36.25 | MAP_LILYCOVE_CITY_POKEMON_CENTER_1F | 0 |
| 11 | 5 | 14.37 | 13.75 | MAP_LILYCOVE_CITY_LILYCOVE_MUSEUM_1F | 0 |
| 23 | 24 | 29.38 | 61.25 | MAP_LILYCOVE_CITY_CONTEST_LOBBY | 0 |
| 39 | 14 | 49.38 | 36.25 | MAP_LILYCOVE_CITY_POKEMON_TRAINER_FAN_CLUB | 1 |
| 70 | 5 | 88.12 | 13.75 | MAP_AQUA_HIDEOUT_1F | 0 |
| 36 | 6 | 45.62 | 16.25 | MAP_LILYCOVE_CITY_MOVE_DELETERS_HOUSE | 0 |
| 42 | 6 | 53.12 | 16.25 | MAP_LILYCOVE_CITY_HOUSE1 | 0 |
| 55 | 15 | 69.38 | 38.75 | MAP_LILYCOVE_CITY_HOUSE2 | 0 |
| 11 | 22 | 14.37 | 56.25 | MAP_LILYCOVE_CITY_HOUSE3 | 0 |
| 12 | 14 | 15.62 | 36.25 | MAP_LILYCOVE_CITY_HOUSE4 | 0 |
| 12 | 32 | 15.62 | 81.25 | MAP_LILYCOVE_CITY_HARBOR | 0 |
| 12 | 5 | 15.62 | 13.75 | MAP_LILYCOVE_CITY_LILYCOVE_MUSEUM_1F | 1 |

### Signs (10)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 19 | 7 | 24.38 | 18.75 |  |
| 25 | 14 | 31.87 | 36.25 |  |
| 29 | 7 | 36.88 | 18.75 |  |
| 26 | 14 | 33.12 | 36.25 |  |
| 6 | 15 | 8.12 | 38.75 |  |
| 29 | 24 | 36.88 | 61.25 |  |
| 35 | 24 | 44.38 | 61.25 |  |
| 6 | 30 | 8.12 | 76.25 |  |
| 36 | 14 | 45.62 | 36.25 |  |
| 34 | 6 | 43.12 | 16.25 |  |

### Trainers (0)
_none_

## PacifidlogTown
- **Layout**: PacifidlogTown_Layout (LAYOUT_PACIFIDLOG_TOWN)
- **Dimensions**: 20 x 40 tiles = 320 x 640 px
- **Inferred from coords** (fallback): 18 x 25 tiles

### Warps (6)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 8 | 15 | 42.5 | 38.75 | MAP_PACIFIDLOG_TOWN_POKEMON_CENTER_1F | 0 |
| 16 | 13 | 82.5 | 33.75 | MAP_PACIFIDLOG_TOWN_HOUSE1 | 0 |
| 3 | 22 | 17.5 | 56.25 | MAP_PACIFIDLOG_TOWN_HOUSE2 | 0 |
| 12 | 24 | 62.5 | 61.25 | MAP_PACIFIDLOG_TOWN_HOUSE3 | 0 |
| 2 | 12 | 12.5 | 31.25 | MAP_PACIFIDLOG_TOWN_HOUSE4 | 0 |
| 17 | 21 | 87.5 | 53.75 | MAP_PACIFIDLOG_TOWN_HOUSE5 | 0 |

### Signs (3)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 9 | 15 | 47.5 | 38.75 |  |
| 7 | 16 | 37.5 | 41.25 |  |
| 10 | 15 | 52.5 | 38.75 |  |

### Trainers (0)
_none_

## MtChimney
- **Layout**: MtChimney_Layout (LAYOUT_MT_CHIMNEY)
- **Dimensions**: 40 x 47 tiles = 640 x 752 px
- **Inferred from coords** (fallback): 33 x 42 tiles

### Warps (4)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 17 | 36 | 43.75 | 77.66 | MAP_MT_CHIMNEY_CABLE_CAR_STATION | 0 |
| 18 | 36 | 46.25 | 77.66 | MAP_MT_CHIMNEY_CABLE_CAR_STATION | 1 |
| 20 | 41 | 51.25 | 88.3 | MAP_JAGGED_PASS | 2 |
| 21 | 41 | 53.75 | 88.3 | MAP_JAGGED_PASS | 3 |

### Signs (2)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 14 | 6 | 36.25 | 13.83 |  |
| 24 | 37 | 61.25 | 79.79 |  |

### Trainers (8)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 12 | 11 | 31.25 | 24.47 | OBJ_EVENT_GFX_MAGMA_MEMBER_M | TRAINER_TYPE_NORMAL | 2 |
| 9 | 16 | 23.75 | 35.11 | OBJ_EVENT_GFX_MAGMA_MEMBER_M | TRAINER_TYPE_NORMAL | 3 |
| 16 | 18 | 41.25 | 39.36 | OBJ_EVENT_GFX_EXPERT_F | TRAINER_TYPE_NORMAL | 3 |
| 14 | 7 | 36.25 | 15.96 | OBJ_EVENT_GFX_BEAUTY | TRAINER_TYPE_NORMAL | 6 |
| 29 | 7 | 73.75 | 15.96 | OBJ_EVENT_GFX_BEAUTY | TRAINER_TYPE_NORMAL | 3 |
| 27 | 17 | 68.75 | 37.23 | OBJ_EVENT_GFX_BEAUTY | TRAINER_TYPE_NORMAL | 3 |
| 13 | 16 | 33.75 | 35.11 | OBJ_EVENT_GFX_MAGMA_MEMBER_F | TRAINER_TYPE_NORMAL | 3 |
| 7 | 7 | 18.75 | 15.96 | OBJ_EVENT_GFX_HIKER | TRAINER_TYPE_NORMAL | 6 |

## EverGrandeCity
- **Layout**: EverGrandeCity_Layout (LAYOUT_EVER_GRANDE_CITY)
- **Dimensions**: 40 x 80 tiles = 640 x 1280 px
- **Inferred from coords** (fallback): 30 x 59 tiles

### Warps (4)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 18 | 5 | 46.25 | 6.88 | MAP_EVER_GRANDE_CITY_POKEMON_LEAGUE_1F | 0 |
| 27 | 48 | 68.75 | 60.62 | MAP_EVER_GRANDE_CITY_POKEMON_CENTER_1F | 0 |
| 18 | 41 | 46.25 | 51.88 | MAP_VICTORY_ROAD_1F | 0 |
| 18 | 27 | 46.25 | 34.38 | MAP_VICTORY_ROAD_1F | 1 |

### Signs (5)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 19 | 43 | 48.75 | 54.37 |  |
| 29 | 48 | 73.75 | 60.62 |  |
| 18 | 52 | 46.25 | 65.62 |  |
| 23 | 15 | 58.75 | 19.38 |  |
| 28 | 48 | 71.25 | 60.62 |  |

### Trainers (0)
_none_

## SkyPillar_Outside
- **Layout**: SkyPillar_Outside_Layout (LAYOUT_SKY_PILLAR_OUTSIDE)
- **Dimensions**: 28 x 23 tiles = 448 x 368 px
- **Inferred from coords** (fallback): 18 x 14 tiles

### Warps (2)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 17 | 13 | 62.5 | 58.7 | MAP_SKY_PILLAR_ENTRANCE | 1 |
| 14 | 5 | 51.79 | 23.91 | MAP_SKY_PILLAR_1F | 0 |

### Signs (0)
_none_

### Trainers (0)
_none_

## VictoryRoad_1F
- **Layout**: VictoryRoad_1F_Layout (LAYOUT_VICTORY_ROAD_1F)
- **Dimensions**: 46 x 45 tiles = 736 x 720 px
- **Inferred from coords** (fallback): 43 x 41 tiles

### Warps (5)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 15 | 40 | 33.7 | 90.0 | MAP_EVER_GRANDE_CITY | 2 |
| 39 | 5 | 85.87 | 12.22 | MAP_EVER_GRANDE_CITY | 3 |
| 21 | 32 | 46.74 | 72.22 | MAP_VICTORY_ROAD_B1F | 5 |
| 42 | 38 | 92.39 | 85.56 | MAP_VICTORY_ROAD_B1F | 2 |
| 9 | 14 | 20.65 | 32.22 | MAP_VICTORY_ROAD_B1F | 4 |

### Signs (0)
_none_

### Trainers (5)
| x | y | pctX | pctY | graphics_id | trainer_type | sight_id |
|---|---|------|------|-------------|--------------|----------|
| 33 | 22 | 72.83 | 50.0 | OBJ_EVENT_GFX_MAN_3 | TRAINER_TYPE_NORMAL | 3 |
| 6 | 15 | 14.13 | 34.44 | OBJ_EVENT_GFX_WOMAN_5 | TRAINER_TYPE_NORMAL | 4 |
| 27 | 34 | 59.78 | 76.67 | OBJ_EVENT_GFX_MAN_3 | TRAINER_TYPE_NORMAL | 3 |
| 29 | 17 | 64.13 | 38.89 | OBJ_EVENT_GFX_WOMAN_5 | TRAINER_TYPE_NORMAL | 2 |
| 32 | 17 | 70.65 | 38.89 | OBJ_EVENT_GFX_MAN_3 | TRAINER_TYPE_NORMAL | 2 |

## SealedChamber_OuterRoom
- **Layout**: SealedChamber_OuterRoom_Layout (LAYOUT_SEALED_CHAMBER_OUTER_ROOM)
- **Dimensions**: 21 x 23 tiles = 336 x 368 px
- **Inferred from coords** (fallback): 17 x 16 tiles

### Warps (1)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 10 | 2 | 50.0 | 10.87 | MAP_SEALED_CHAMBER_INNER_ROOM | 0 |

### Signs (29)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 5 | 6 | 26.19 | 28.26 |  |
| 5 | 9 | 26.19 | 41.3 |  |
| 5 | 12 | 26.19 | 54.35 |  |
| 5 | 15 | 26.19 | 67.39 |  |
| 11 | 6 | 54.76 | 28.26 |  |
| 11 | 9 | 54.76 | 41.3 |  |
| 11 | 12 | 54.76 | 54.35 |  |
| 11 | 15 | 54.76 | 67.39 |  |
| 16 | 6 | 78.57 | 28.26 |  |
| 16 | 9 | 78.57 | 41.3 |  |
| 10 | 2 | 50.0 | 10.87 |  |
| 6 | 6 | 30.95 | 28.26 |  |
| 4 | 6 | 21.43 | 28.26 |  |
| 4 | 9 | 21.43 | 41.3 |  |
| 6 | 9 | 30.95 | 41.3 |  |
| 4 | 12 | 21.43 | 54.35 |  |
| 6 | 12 | 30.95 | 54.35 |  |
| 4 | 15 | 21.43 | 67.39 |  |
| 6 | 15 | 30.95 | 67.39 |  |
| 10 | 6 | 50.0 | 28.26 |  |
| 12 | 6 | 59.52 | 28.26 |  |
| 10 | 9 | 50.0 | 41.3 |  |
| 12 | 9 | 59.52 | 41.3 |  |
| 10 | 12 | 50.0 | 54.35 |  |
| 12 | 12 | 59.52 | 54.35 |  |
| 10 | 15 | 50.0 | 67.39 |  |
| 12 | 15 | 59.52 | 67.39 |  |
| 9 | 2 | 45.24 | 10.87 |  |
| 11 | 2 | 54.76 | 10.87 |  |

### Trainers (0)
_none_

## SealedChamber_InnerRoom
- **Layout**: SealedChamber_InnerRoom_Layout (LAYOUT_SEALED_CHAMBER_INNER_ROOM)
- **Dimensions**: 21 x 23 tiles = 336 x 368 px
- **Inferred from coords** (fallback): 17 x 20 tiles

### Warps (1)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 10 | 19 | 50.0 | 84.78 | MAP_SEALED_CHAMBER_OUTER_ROOM | 0 |

### Signs (9)
| x | y | pctX | pctY | bg_id |
|---|---|------|------|-------|
| 10 | 4 | 50.0 | 19.57 |  |
| 6 | 8 | 30.95 | 36.96 |  |
| 14 | 8 | 69.05 | 36.96 |  |
| 4 | 13 | 21.43 | 58.7 |  |
| 16 | 13 | 78.57 | 58.7 |  |
| 6 | 18 | 30.95 | 80.43 |  |
| 14 | 18 | 69.05 | 80.43 |  |
| 9 | 4 | 45.24 | 19.57 |  |
| 11 | 4 | 54.76 | 19.57 |  |

### Trainers (0)
_none_

## MarineCave_Entrance
- **Layout**: MarineCave_Entrance_Layout (LAYOUT_MARINE_CAVE_ENTRANCE)
- **Dimensions**: 20 x 20 tiles = 320 x 320 px
- **Inferred from coords** (fallback): 15 x 2 tiles

### Warps (1)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 14 | 1 | 72.5 | 7.5 | MAP_MARINE_CAVE_END | 0 |

### Signs (0)
_none_

### Trainers (0)
_none_

## MarineCave_End
- **Layout**: MarineCave_End_Layout (LAYOUT_MARINE_CAVE_END)
- **Dimensions**: 27 x 30 tiles = 432 x 480 px
- **Inferred from coords** (fallback): 21 x 27 tiles

### Warps (1)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 20 | 4 | 75.93 | 15.0 | MAP_MARINE_CAVE_ENTRANCE | 0 |

### Signs (0)
_none_

### Trainers (0)
_none_

## GraniteCave_1F
- **Layout**: GraniteCave_1F_Layout (LAYOUT_GRANITE_CAVE_1F)
- **Dimensions**: 42 x 15 tiles = 672 x 240 px
- **Inferred from coords** (fallback): 38 x 13 tiles

### Warps (4)
| x | y | pctX | pctY | dest_map | dest_warp_id |
|---|---|------|------|----------|--------------|
| 37 | 12 | 89.29 | 83.33 | MAP_ROUTE106 | 0 |
| 35 | 3 | 84.52 | 23.33 | MAP_GRANITE_CAVE_B1F | 0 |
| 17 | 11 | 41.67 | 76.67 | MAP_GRANITE_CAVE_B1F | 1 |
| 5 | 10 | 13.1 | 70.0 | MAP_GRANITE_CAVE_STEVENS_ROOM | 0 |

### Signs (0)
_none_

### Trainers (0)
_none_