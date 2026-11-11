# -*- coding: utf-8 -*-
"""从天凤凤凰桌 mjlog XML 提取门清何切局面 -> positions.json
天凤事件格式: 标签名=动作+牌号, 如 <T84/> = 玩家0摸84号牌, <D33/> = 玩家0切33号牌
仅提取尚无副露、未立直玩家的自摸时点。
"""
import json, glob, os
import xml.etree.ElementTree as ET
from urllib.parse import unquote

def tile(id_):
    # 天凤牌id: 0-135, t=id>>2; 赤5(16/52/88)也满足 >>2 -> 4/13/22
    return id_ >> 2

DRAW_SEAT = {'T':0,'U':1,'V':2,'W':3}
DISC_SEAT = {'D':0,'E':1,'F':2,'G':3}

def ev_kind(tag):
    if len(tag) >= 2 and tag[0] in 'TUVWDEFG' and tag[1:].isdigit():
        n = int(tag[1:])
        if tag[0] in DRAW_SEAT:
            return ('draw', DRAW_SEAT[tag[0]], n)
        return ('disc', DISC_SEAT[tag[0]], n)
    return (tag, None, None)

positions = []
bad = 0
games = 0

for path in glob.glob(os.path.join(os.path.dirname(__file__), 'logs', '*.xml')):
    gid = os.path.basename(path)[:-4]
    try:
        root = ET.parse(path).getroot()
        games += 1
    except Exception:
        bad += 1
        continue
    names = {}
    for un in root.iter('UN'):
        for i in range(4):
            n = un.get('n%d' % i)
            if n:
                names[i] = unquote(n)

    hands = [{} for _ in range(4)]
    melded = [False]*4
    riichi = [False]*4
    draws = [0]*4
    kyoku_ctx = {}

    for ev in root:
        kind, who, num = ev_kind(ev.tag)
        if kind == 'INIT':
            seed = ev.get('seed').split(',')
            kyoku_ctx = {
                'kyoku': int(seed[0]),
                'honba': int(seed[1]),
                'dora': tile(int(seed[3])),
                'scores': [int(x) for x in ev.get('ten').split(',')],
                'oya': int(ev.get('oya')),
            }
            hands = [{} for _ in range(4)]
            melded = [False]*4
            riichi = [False]*4
            draws = [0]*4
            for i in range(4):
                h = ev.get('hai%d' % i)
                if h:
                    for x in h.split(','):
                        t = tile(int(x))
                        hands[i][t] = hands[i].get(t, 0) + 1
        elif kind == 'draw':
            t = tile(num)
            draws[who] += 1
            if not melded[who] and not riichi[who]:
                c = dict(hands[who])
                c[t] = c.get(t, 0) + 1
                if sum(c.values()) == 14:
                    positions.append({
                        'hand': c, 'draw': t,
                        'junme': draws[who], 'seat': who,
                        'player': names.get(who, '?'),
                        'ctx': dict(kyoku_ctx),
                        'game': gid,
                    })
            hands[who][t] = hands[who].get(t, 0) + 1
        elif kind == 'disc':
            t = tile(num)
            hands[who][t] = hands[who].get(t, 0) - 1
            if hands[who][t] <= 0:
                hands[who].pop(t, None)
            # 该家本次自摸后的实际切牌
            for p in reversed(positions[-8:]):
                if p['game'] == gid and p['seat'] == who and 'act' not in p:
                    p['act'] = t
                    break
        elif kind == 'N':
            melded[int(ev.get('who'))] = True
        elif kind == 'REACH':
            riichi[int(ev.get('who'))] = True

out = os.path.join(os.path.dirname(__file__), 'positions.json')
json.dump(positions, open(out, 'w'), ensure_ascii=False)
n_act = sum(1 for p in positions if 'act' in p)
print('games:', games, 'positions:', len(positions), '含实际切牌:', n_act, 'bad:', bad)
