'use strict';
let feedbackTitle='',feedbackHidden=false,feedbackCollapsed=false;
function beginFeedback(cmd,args){
 feedbackHidden=false;feedbackCollapsed=false;
 const names={drift:'迷航选路',cleanse:'解除诅咒',event:'事件抉择',assign:'分配成长',endExpedition:'结束远征',attack:'普通攻击',strong:'强力攻击',cover:'掩护射击',slow:'牵制射击',press:'压制打击',defend:'自我防御',aim:'瞄准',shipBack:'操船后撤',shipForward:'操船前进',safe:'稳舵脱离',escape:'脱离检定',revive:'战后救治',continueRetreat:'撤退结算',rescue:'旧版救援',heal:'治疗',switch:'切换武器',moveBack:'移动',moveForward:'移动',advance:'航行遭遇',scout:'遭遇抉择',gather:'采集',rest:'扎营',lodge:'全队休息',reward:'获得奖励',route:'选择航线',buy:'团队补给',end:'敌方回合结算'};
 feedbackTitle=names[cmd==='action'?args.action:cmd]||'本次操作';
}
function renderFeedback(){
 const el=document.querySelector('#resolution');
 if(feedbackHidden||latestLogEnd<=latestLogStart){el.hidden=true;return}
 const batch=game.s.logs.slice(latestLogStart,latestLogEnd),checks=batch.filter(x=>x.check),rolls=batch.filter(x=>x.kind==='roll');
 el.hidden=false;
 const outcomes=checks.map(x=>x.check.outcome).filter((x,i,a)=>a.indexOf(x)===i).join(' / ');
 el.innerHTML=`<div class="resolution-head"><div><small>本次结算</small><strong>${esc(feedbackTitle)}${outcomes?' · '+esc(outcomes):''}</strong></div><button id="toggleFeedback">${feedbackCollapsed?'展开':'收起'}</button><button id="closeFeedback" aria-label="关闭本次结算">×</button></div>${feedbackCollapsed?'':`<div class="resolution-body">${batch.filter(x=>x.kind!=='roll'&&!/第 \d+ 回合开始/.test(x.msg)).map(x=>{if(!x.check)return `<p class="resolution-event">${esc(x.msg)}</p>`;const c=x.check,bad=['大失败','失败','未命中','遭遇敌人','遭遇海兽'].includes(c.outcome);return `<article class="check-card ${bad?'check-bad':'check-good'}"><div><b>${esc(c.label)}</b><span class="check-outcome">${esc(c.outcome)}</span></div><p>规则：${esc(c.target)}</p><p class="check-math">骰面 [${c.faces.join('，')}] → 采用 ${c.selected}${c.mod?' '+(c.mod>0?'+':'−')+' '+Math.abs(c.mod):''} = <b>${c.total}</b></p>${c.effect?`<p>${esc(c.effect)}</p>`:''}</article>`}).join('')}${rolls.length?`<details><summary>原始骰面（${rolls.length} 条）</summary>${rolls.map(x=>`<p>${esc(x.msg)}</p>`).join('')}</details>`:''}</div>`}`;
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(b?.id==='toggleFeedback'){feedbackCollapsed=!feedbackCollapsed;renderFeedback()}if(b?.id==='closeFeedback'){feedbackHidden=true;renderFeedback()}});
