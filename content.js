(function(root){'use strict';
const GROWTH={
 blood:{name:'浴血攻击',type:'move',rarity:1,ap:2,sp:0,weapon:'melee',range:[0,0],attack:true,hp:2,dice:1,desc:'2 行动；近战、生命至少 3。支付 2 生命，攻击额外 +1d6；未命中也支付。'},
 longshot:{name:'远射',type:'move',rarity:1,ap:2,sp:0,weapon:'bow',range:[4,4],attack:true,half:true,desc:'2 行动；弓，距离必须为 4。劣势命中，伤害减半向下取整。'},
 charge:{name:'突进攻击',type:'move',rarity:2,ap:3,sp:1,weapon:'melee',range:[1,2],attack:true,land:true,desc:'3 行动 +1 战技；陆地近战。向 1～2 区外的目标突进并攻击，离开敌人会触发借机；倒地则中止。'},
 volley:{name:'连珠射击',type:'move',rarity:3,ap:3,sp:1,weapon:'bow',range:[0,3],attack:true,desc:'3 行动 +1 战技；弓。射击两个不同目标；仅第一发享受瞄准、回声和对应增幅。'},
 taunt:{name:'挑衅',type:'move',rarity:2,ap:2,sp:1,desc:'2 行动 +1 战技。将能打到自己的已预告单体攻击转向自己；不影响扫击。'},
 snipe:{name:'蓄势狙击',type:'move',rarity:3,ap:3,sp:1,weapon:'bow',range:[0,3],attack:true,dice:2,aim:true,desc:'3 行动 +1 战技；弓，需要已有瞄准。消耗瞄准攻击，额外 +2d6，可叠加蓄势之赐。'},
 focus:{name:'蓄势之赐',type:'boon',rarity:2,aimDice:1,desc:'消耗瞄准的攻击命中后额外 +1d6；额外骰参与暴击。'},
 sureShot:{name:'神射之赐',type:'boon',rarity:3,aimAdv:true,desc:'消耗瞄准的攻击获得优势，与距离劣势抵消。'},
 fortify:{name:'坚守之赐',type:'boon',rarity:1,retain:6,desc:'回合结束最多保留 6 护盾，战斗结束清空。'},
 counter:{name:'反击之赐',type:'boon',rarity:3,counter:true,desc:'距离 0 的攻击被护盾完全挡住后，持近战武器者消耗本轮反应进行普通近战反击。'},
 hunt:{name:'追猎之赐',type:'boon',rarity:1,slowDamage:2,desc:'命中受到牵制的敌人，固定伤害 +2（暴击不翻倍）。'},
 lucky:{name:'幸运之赐',type:'boon',rarity:2,reroll:true,desc:'每次主动攻击的伤害骰中，第一颗自然 1 自动重掷一次，接受新结果。'},
 tools:{name:'采集工具',type:'operation',rarity:1,gather:3,desc:'采集成功额外 +3 口粮，失败仍为 0。'},
 cookware:{name:'行军炊具',type:'operation',rarity:2,food:1,desc:'每次跨日口粮消耗减少 1，最低 1。'},
 merchant:{name:'海商凭证',type:'operation',rarity:2,discount:1,desc:'城邦商品减价 1 银币，最低 1；住宿与招募不打折。'},
 medicine:{name:'药师药箱',type:'operation',rarity:1,heal:2,desc:'绷带额外恢复 2 生命，不改变复苏药效果。'},
 bedding:{name:'防潮卧具',type:'operation',rarity:1,sleep:1,desc:'实际完成海上睡眠时，清醒休息者额外恢复 1 生命。'},
 ledger:{name:'战利品账册',type:'operation',rarity:3,gold:2,desc:'每场路线主要战斗首次胜利额外 +2 银币；扎营遭遇不提供收益。'}
};
const ENEMIES={
 ram:{name:'冲撞海兽',kind:'beast',hp:20,ac:8,hit:1,add:1,range:0},
 spike:{name:'射刺海兽',kind:'spike',hp:16,ac:8,hit:1,add:0,range:4},
 raider:{name:'掠夺者',kind:'raider',hp:14,ac:8,hit:2,add:1,range:0},
 slinger:{name:'投石手',kind:'slinger',hp:10,ac:8,hit:1,add:0,range:2}
};
const EVENTS={
 crate:{name:'漂流货箱',sea:true,risk:'偏安全 · 补给机会',choices:[['salvage','打捞：航海 d6＋专长−疲劳 ≥6；成功 +6 口粮、3 银币，失败 +2 口粮'],['leave','离开，不获得物资']]},
 reef:{name:'暗礁水道',sea:true,risk:'偏危险 · 航海检定',choices:[['detour','绕行：额外 1 日，消耗口粮，无睡眠'],['navigate','航海 d6＋专长−疲劳 ≥6；失败操船者损失 4 生命']]},
 fruit:{name:'野果林',risk:'偏安全 · 采集机会',choices:[['gather','额外 1 日采集：d6＋专长−疲劳 ≥6；成功 +6 口粮，失败 0'],['leave','离开，不消耗额外时间']]},
 shrine:{name:'受损神龛',risk:'偏安全 · 供奉换成长',choices:[['repair','支付 3 银币修复，获得成长三选一'],['leave','离开']]},
 trader:{name:'过路商船',sea:true,risk:'偏安全 · 一次交易',choices:[['purchase','支付 4 银币，获得未知随机成长'],['sell','出售 3 口粮，获得 2 银币'],['leave','离开']]},
 ruins:{name:'封闭遗迹',risk:'偏危险 · 可选陆战',choices:[['enter','进入已确认的陆地敌群，胜利获得成长三选一'],['leave','放弃探索']]},
 fisher:{name:'落难渔民',sea:true,risk:'偏安全 · 物资交换',choices:[['aid','支付 3 口粮援助，获得 6 银币'],['leave','离开']]},
 feast:{name:'祭典余宴',risk:'偏安全 · 治疗或口粮',choices:[['heal','清醒队员恢复 3 生命，不恢复战技或复活'],['pack','打包获得 6 口粮']]}
};
const EVENT_INTROS={crate:'船头前方漂着几只破损货箱，箱缝里露出口粮袋。要派人靠近打捞，还是继续赶路？',reef:'海水变浅，船底附近浮起白色浪花。前方的暗礁水道需要小心掌舵，也可以多花一天绕开。',fruit:'林中垂着成串野果，附近似乎没有人烟。花一天寻找可食用的果实，或许能补上口粮。',shrine:'一座破损的神龛立在岬角，祭台上落满碎石。修复它需要银币，也许会得到回应。',trader:'一艘挂着商旗的船示意靠拢。船主愿意交易，但不会提前透露那份神秘货物。',ruins:'山岩间露出一道封闭遗迹的入口，里面传来脚步声。队伍可以先查看威胁，再决定是否深入。',fisher:'几名渔民在破船旁挥手求援。他们急需口粮，并承诺用银币答谢。',feast:'城外的祭典刚刚散去，桌上还有剩余食物。队伍可以在此进食疗伤，或把食物装袋带走。'};
for(const [id,intro] of Object.entries(EVENT_INTROS))EVENTS[id].intro=intro;
const MAP={layers:9,weights:{battle:4,event:3,island:2,temple:1},names:{battle:'已确认敌群',event:'未知遭遇',island:'无名荒岛',temple:'海岸神庙',city:'城邦港口',elite:'精英据点',boss:'归乡海峡'}};
const RARITY={1:{name:'常见',weight:6,price:4},2:{name:'少见',weight:3,price:6},3:{name:'稀有',weight:1,price:8}};
const API={GROWTH,ENEMIES,EVENTS,MAP,RARITY};if(typeof module!=='undefined')module.exports=API;root.ExpeditionContent=API;
})(typeof globalThis!=='undefined'?globalThis:this);
