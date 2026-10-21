(function(root){'use strict';
const C=typeof module!=='undefined'?require('./content.js'):root.ExpeditionContent;
Object.assign(C.RARITY,{1:{name:'普通',weight:60,price:4},2:{name:'精良',weight:30,price:6},3:{name:'稀有',weight:9,price:8},4:{name:'史诗',weight:1,price:12}});
C.LOOT_WEIGHTS={small:[70,25,5,0],normal:[45,35,18,2],elite:[10,35,45,10],boss:[0,20,50,30]};
Object.assign(C.GROWTH.taunt,{ap:1,desc:'1 行动＋1 战技，每人每轮一次。将本轮攻击或突进可及的敌方单体攻击转向自己，可接着防御；不影响扫击。'});
C.GROWTH.counter.desc='距离 0 的敌方攻击命中且护盾实际吸收至少 1 伤害，自身仍清醒并持近战时，消耗本轮反应反击；不要求全挡住。';
C.GROWTH.hunt.aimSlow=true;
C.GROWTH.hunt.desc='攻击已受牵制者伤害 +2。消耗瞄准的主动攻击命中后施加牵制，持续至下一轮末；新施加状态不加成本次伤害。';
Object.assign(C.GROWTH,{
 rupture:{name:'破甲打击',type:'move',rarity:2,ap:2,sp:1,weapon:'melee',attack:true,status:'exposed',desc:'2 行动＋1 战技；近战普通攻击，命中使敌人防护 −2，持续至下一轮末，不叠加。'},
 pin:{name:'绊足箭',type:'move',rarity:2,ap:2,sp:1,weapon:'bow',attack:true,half:true,status:'slow',desc:'2 行动＋1 战技；弓，半伤并施加牵制。任何学会者均可使用。'},
 feint:{name:'佯攻',type:'move',rarity:1,ap:2,sp:0,weapon:'melee',attack:true,half:true,status:'cover',desc:'2 行动；近战半伤，命中使敌人本轮下一次攻击命中 −3，不消耗战技。'},
 sacrifice:{name:'孤注一掷',type:'move',rarity:4,ap:3,sp:0,weapon:'melee',attack:true,hp:3,dice:2,desc:'3 行动；近战、生命至少 4。先支付 3 生命，攻击额外 +2d6；未命中仍支付。'},
 bloodlust:{name:'浴血之赐',type:'boon',rarity:2,bloodDice:1,desc:'支付生命的攻击命中后额外 +1d6，参与暴击；反应攻击不生效。'},
 execution:{name:'收割之赐',type:'boon',rarity:3,killHeal:2,desc:'主动攻击击杀敌人后，自身恢复 2 生命；不会超过生命上限。'},
 bulwark:{name:'壁垒之赐',type:'boon',rarity:2,defShield:2,desc:'主动防御非大失败时额外获得 2 护盾，可与披风和坚守配合。'},
 ambusher:{name:'先机之赐',type:'boon',rarity:2,openingHit:2,desc:'每场战斗自己的第一次主动攻击命中 +2，未命中也消耗；反应不消耗。'},
 heart:{name:'战意之赐',type:'boon',rarity:4,killSp:1,desc:'每场战斗首次由自己主动攻击击杀敌人，恢复 1 战技，最多恢复至 3。'},
 calm:{name:'静心之赐',type:'boon',rarity:1,aimShield:2,desc:'使用瞄准时获得 2 护盾；按普通护盾清理，可与坚守配合。'},
 vengeance:{name:'复仇之赐',type:'boon',rarity:3,revenge:2,desc:'受到敌方攻击的实际生命伤害后蓄积复仇：下一次主动攻击命中伤害 +2；不叠加，未命中也消耗，战后清除。'},
 breaker:{name:'裂隙之赐',type:'boon',rarity:2,exposedDamage:2,desc:'攻击被破甲的目标，命中伤害固定 +2；可让队友先破甲再输出。'},
 pantry:{name:'密封粮桶',type:'operation',rarity:1,victoryFood:1,desc:'路线主要战斗首次胜利额外获得 1 口粮；营地不生效。'},
 tents:{name:'修补帐篷',type:'operation',rarity:2,landHeal:1,desc:'实际完成陆地睡眠的清醒队员额外恢复 1 生命，守夜者不受益。'},
 salvageKit:{name:'打捞绞盘',type:'operation',rarity:2,salvageGold:2,desc:'漂流货箱成功打捞额外获得 2 银币；失败没有额外银币。'},
 offering:{name:'祭司信物',type:'operation',rarity:3,cleanseDiscount:2,desc:'支付银币解除诅咒或修复受损神龛时费用减少 2，最低 1；不会减免其他交易。'}
});
C.EQUIPMENT={
 spearCharm:{name:'尖锋护符',type:'equipment',rarity:1,meleeAdd:1,desc:'饰品；近战伤害固定 +1。'},
 sight:{name:'鹰眼指环',type:'equipment',rarity:2,aimHit:2,desc:'饰品；消耗瞄准的主动攻击额外命中 +2。'},
 guardSeal:{name:'青铜盾徽',type:'equipment',rarity:2,defShield:1,retain:2,desc:'饰品；非大失败防御额外 +1 护盾，每轮最多保留 2 护盾；保留上限与坚守相加。'},
 bloodStone:{name:'赤铁坠饰',type:'equipment',rarity:3,bloodAdd:2,desc:'饰品；支付生命的主动攻击命中后伤害固定 +2。'},
 hunterMark:{name:'猎踪徽记',type:'equipment',rarity:2,slowDamage:1,desc:'饰品；攻击受到牵制的目标，伤害固定 +1。'},
 aegis:{name:'埃吉斯碎片',type:'equipment',rarity:4,openingShield:4,desc:'饰品；每场战斗开始获得 4 护盾，非每回合；仍按护盾规则清理。'}
};
C.SUPPLIES={
 rationParcel:{name:'干粮包',type:'supply',rarity:1,food:4,desc:'领取立即获得 4 口粮，可重复。'},
 bandageParcel:{name:'洁净绷带',type:'supply',rarity:1,bandages:1,desc:'领取立即获得 1 绷带，可重复。'},
 silverPurse:{name:'商旅钱袋',type:'supply',rarity:2,gold:5,desc:'领取立即获得 5 银币，可重复。'},
 reviveParcel:{name:'复苏药匣',type:'supply',rarity:3,revives:1,desc:'领取立即获得 1 复苏药，可重复；不会自动复活队员。'}
};
Object.assign(C.ENEMIES,{
 shell:{name:'甲壳海兽',kind:'shell',hp:17,ac:11,hit:1,add:1,range:0,trait:'厚甲：防护较高，破甲与瞄准更有价值'},
 eel:{name:'电鳗',kind:'eel',hp:12,ac:8,hit:2,add:0,range:2,drain:true,trait:'电击：造成生命伤害时消耗目标 1 战技'},
 sentinel:{name:'持盾卫士',kind:'sentinel',hp:13,ac:11,hit:1,add:1,range:0,trait:'持盾：防护较高，常与远程敌人同行'},
 berserker:{name:'狂战掠夺者',kind:'berserker',hp:17,ac:7,hit:1,add:1,range:0,enrage:true,trait:'狂怒：生命不高于一半时攻击固定伤害额外 +2'}
});
// Encounters keep distinct answers to retreat: charge, ranged pressure, and slow armour.
for(const key of ['ram','raider','berserker']){C.ENEMIES[key].chargeAttack=true;C.ENEMIES[key].trait=(C.ENEMIES[key].trait||'')+' 突进攻击：移动 2～3 档，进入射程后同轮攻击；贴身后撤会追击 1 档并攻击。';}
C.ENEMIES.shell.range=2;C.ENEMIES.shell.trait+='；可向距离 0～2 喷吐碎石。';
Object.assign(C.GROWTH.longshot,{range:[0,4],half:false,farHalf:true,desc:'2 行动；弓，射程 0～4。0～3 为普通射击，距离 4 劣势且伤害减半；贴身仍可用但有劣势。'});
C.GROWTH.volley.desc='3 行动＋1 战技；射程 0～3。两箭可集中同一目标，也可分射；第一箭击杀后，指定同目标的第二箭不自动转移。仅第一箭消耗瞄准／回声，贴身有劣势。';
Object.assign(C.GROWTH,{
 bleedingArrow:{name:'倒钩射击',type:'move',rarity:1,ap:2,sp:0,attack:true,weapon:'bow',range:[0,3],half:true,bleed:2,desc:'2 行动，无需战技；弓，射程 0～3，贴身可用但劣势。半伤，命中施加 2 层流血：接下来两个敌方阶段各损失层数生命，上限 6 层。'},
 thunderArrow:{name:'雷鸣射击',type:'move',rarity:3,ap:3,sp:1,attack:true,weapon:'bow',range:[0,3],dice:1,lightning:true,desc:'3 行动＋1 战技；弓，射程 0～3，贴身仍可用但劣势。命中额外 +1d6；与主目标相隔至多 1 档的其他敌人各受 1d6 雷击。每个受击存活目标 d6≥5 麻痹：本轮命中 −3、移动 −1，不跳过整轮。'},
 barbed:{name:'荆棘之赐',type:'boon',rarity:1,bowBleed:1,desc:'每次主动弓箭命中施加 1 层流血，持续两个敌方阶段，上限 6；连珠两箭各可触发，反应与雷击溅射不触发。'},
 bloodScent:{name:'嗜血之赐',type:'boon',rarity:2,bleedDamage:2,desc:'命中已经流血的敌人，固定伤害 +2；本击新施加的流血不计。队友也可先施加流血。'},
 stormAim:{name:'雷云之赐',type:'boon',rarity:2,aimShock:1,desc:'消耗瞄准的主动攻击命中，必定麻痹目标至本轮末：命中 −3、移动 −1；不叠加、不跳过整轮。'},
 conductor:{name:'导雷之赐',type:'boon',rarity:2,shockDamage:2,desc:'主动攻击命中已麻痹的敌人，固定伤害 +2，自己获得 2 护盾；可由队友先麻痹。本击新施加的麻痹不计，溅射不触发。'}
});
// Structured event effects are shared by the rule engine and the choice descriptions.
const choice=(id,label,effect)=>({id,label,...effect});
const event=(name,intro,choices,extra={})=>({name,intro,risk:'未知遭遇 · 抉择',...extra,options:choices,choices:choices.map(c=>[c.id,c.label])});
C.EXTRA_EVENTS={
 healer:event('流浪医师','一位医师愿用药草换取旅费。',[choice('treat','支付 3 银币：全体清醒者恢复 4 生命',{costGold:3,heal:4}),choice('leave','继续赶路',{})]),
 arms:event('遗落兵器架','废弃营地里留着一架武器，搜寻也会消耗时间。',[choice('search','额外 1 天、耗粮且不睡眠：获得随机普通档战利品',{days:1,loot:'normal'}),choice('leave','直接离开',{})]),
 oracle:event('盲眼先知','先知听出了海神留下的印记，愿以祭仪指引归途。',[choice('cleanse','支付 3 银币：解除全部迷雾与迷航诅咒',{costGold:3,cleanse:true}),choice('gift','支付 5 银币：获得一次普通档战利品三选一',{costGold:5,loot:'normal',choose:true}),choice('leave','离开',{})]),
 altar:event('阿瑞斯祭坛','祭坛要求以自己的鲜血换取兵刃的启示。',[choice('blood','执行者支付 3 生命（至少 4）：战斗成长三选一',{costHp:3,loot:'elite',choose:true,combatOnly:true}),choice('leave','不献祭',{})]),
 cache:event('封存粮窖','石门后堆着干粮和药物，只能带走其中一批。',[choice('food','获得 6 口粮',{food:6}),choice('medicine','获得 2 绷带',{bandages:2})]),
 pilgrims:event('朝圣队伍','旅人请求借用口粮，并献出一路守护他们的符物。',[choice('trade','支付 4 口粮：获得随机普通档战利品',{costFood:4,loot:'normal'}),choice('leave','婉拒',{})]),
 poseidon:event('波塞冬的诅咒','海水倒映出三叉戟。海神要求祭品，否则将扰乱下一处分岔。',[choice('appease','支付 4 银币献祭，免受诅咒',{costGold:4,cleanse:true}),choice('endure','承受诅咒：前方地图遮蔽 2 段，下一处分岔随机选路',{fog:2,lost:1})],{incident:true,sea:true}),
 mist:event('骤起海雾','浓雾吞没了远方海岸，历史航线仍清晰记在日志里。',[choice('wait','额外 1 天、耗粮无睡眠：等待雾散',{days:1}),choice('sail','继续航行：遮蔽下一段前方地点，但仍可自行选路',{fog:1})],{incident:true,sea:true}),
 dolphins:event('海豚引航','海豚围绕船舷跃起，带来片刻安宁。',[choice('rest','全体清醒队员恢复 2 生命，不恢复战技',{heal:2}),choice('fish','顺势捕鱼：获得 3 口粮',{food:3})],{incident:true,sea:true}),
 wreck:event('漂来的遗物','一只密封匣随浪靠近，船员需要决定是否消耗物资打捞。',[choice('salvage','支付 2 口粮：获得随机小型档战利品',{costFood:2,loot:'small'}),choice('leave','让它漂走',{})],{incident:true,sea:true}),
 hermes:event('赫尔墨斯的交易','一名陌生旅人提出交换，他的货物也许值得冒险。',[choice('buy','支付 3 银币：普通档战利品三选一',{costGold:3,loot:'normal',choose:true}),choice('coin','接受旅费：获得 2 银币',{gold:2})],{incident:true}),
 rain:event('骤雨与漏水','船舱的药物即将受潮，船员只能优先抢救一批物资。',[choice('food','牺牲 2 口粮：保住药物（口粮不足不可选）',{costFood:2}),choice('medicine','损失最多 1 绷带，保住口粮',{loseBandage:1})],{incident:true,sea:true})
};
Object.assign(C.EVENTS,C.EXTRA_EVENTS);
if(typeof module!=='undefined')module.exports=C;root.ExpeditionContent=C;
})(typeof globalThis!=='undefined'?globalThis:this);
