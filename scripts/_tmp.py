import json, urllib.request
BASE='https://raw.githubusercontent.com/pret/pokeemerald/master/data/maps'
layouts=json.loads(urllib.request.urlopen('https://raw.githubusercontent.com/pret/pokeemerald/master/data/layouts/layouts.json', timeout=15).read())['layouts']
layout_by_id={l['id']:l for l in layouts}
for name in ['Route106','BattleFrontier_OutsideWest','BattleFrontier_OutsideEast']:
    m=json.loads(urllib.request.urlopen(BASE+'/'+name+'/map.json', timeout=15).read())
    lay=layout_by_id[m['layout']]
    tw,th=lay['width'],lay['height']
    print(name, tw, th, 'px', tw*16, th*16)
    for w in m['warp_events']:
        d=w.get('dest_map','')
        if any(k in d for k in ['GRANITE','BATTLE_TOWER','BATTLE_ARENA','BATTLE_FACTORY','BATTLE_DOME']):
            px=round(((w['x']*16+8)/(tw*16))*100,1)
            py=round(((w['y']*16+8)/(th*16))*100,1)
            print(' ',d, w['x'], w['y'], px, py)
