'use strict';
// Directory access is granted by the browser, then remembered for this origin.
const RecordExport=(()=>{
 let directory=null;
 function database(){return new Promise((resolve,reject)=>{let r=indexedDB.open('ithaca-export',1);r.onupgradeneeded=()=>r.result.createObjectStore('preferences');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
 async function remember(handle){let db=await database();try{await new Promise((resolve,reject)=>{let tx=db.transaction('preferences','readwrite');tx.objectStore('preferences').put(handle,'directory');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}finally{db.close()}}
 async function restore(){try{let db=await database();try{directory=await new Promise((resolve,reject)=>{let r=db.transaction('preferences').objectStore('preferences').get('directory');r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)})}finally{db.close()}}catch{directory=null}}
 const ready=restore();
 async function choose(){if(!window.showDirectoryPicker)throw Error('当前浏览器不支持记住导出目录。请使用 Chrome 或 Edge；也可以使用浏览器下载。');const handle=await window.showDirectoryPicker({id:'ithaca-test-records',mode:'readwrite'});await ready;directory=handle;try{await remember(handle)}catch{return `已选择“${handle.name}”，但浏览器无法记住它，下次打开需重新选择。`}return `以后优先导出到“${handle.name}”。`}
 async function save(contents){
  const name='归航-测试记录-'+Date.now()+'-'+Math.random().toString(16).slice(2,8)+'.json';
  // Ask immediately on first use to retain the export button's user gesture.
  if(!directory&&window.showDirectoryPicker)await choose();else await ready;
  if(directory){let permission=await directory.queryPermission({mode:'readwrite'});if(permission!=='granted')permission=await directory.requestPermission({mode:'readwrite'});if(permission!=='granted')throw Error('未获得写入权限，请点击“导出目录”重新选择测试记录文件夹。');const file=await directory.getFileHandle(name,{create:true}),writer=await file.createWritable();await writer.write(contents);await writer.close();return `已导出到“${directory.name}”：${name}`}
  const url=URL.createObjectURL(new Blob([contents],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return '已交给浏览器下载。此浏览器无法指定目录，请保留下载的记录文件，反馈时可一并发送给开发者。';
 }
 return{choose,save};
})();
