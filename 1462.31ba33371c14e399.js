"use strict";(self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[]).push([[1462],{21462:(I,w,r)=>{r.d(w,{Lu:()=>a}),r(45811);var m=r(28027),O=r(69808),v=r(3805),l=r(14625),S=r(73375),A=r(54131),k=r(65590),s=r(29552),o=r(26517),i=r(5e3);class a{constructor(h){l.q5.onCreatedSafe(a,(f,g)=>{const p=h.get(m.dm);p&&!0===p.autoEnable&&g.onInit().subscribe(()=>{if(!g.hasPlugin(m.dm)){const n=g.createPlugin(m.dm);p.autoEnableOptions&&(n.loadOptions=p.autoEnableOptions.loadOptions,n.saveOptions=p.autoEnableOptions.saveOptions)}})})}}a.NGRID_PLUGIN=(0,l.Ic)({id:m.dm,factory:"create",runOnce:function u(){(0,S.R)(),(0,o.l)(),function t(){s.$2.registerRootChunkSection("columnVisibility",{sourceMatcher:d=>d.grid.columnApi,stateMatcher:d=>(d.columnVisibility||(d.columnVisibility=[]),d)}),(0,k.O)("columnVisibility").handleKeys("columnVisibility").serialize((d,h)=>h.source.hiddenColumnIds).deserialize((d,h,f)=>{f.extApi.columnStore.updateColumnVisibility(h)}).register()}(),(0,A.f)()}},m.Bg),a.\u0275fac=function(h){return new(h||a)(i.LFG(v.f8))},a.\u0275mod=i.oAB({type:a}),a.\u0275inj=i.cJS({imports:[O.ez,l.dC]})},26517:(I,w,r)=>{r.d(w,{l:()=>k});var b=r(14625),m=r(65590),O=r(29552);function l(s,t,o){const u=[];for(const i of o){const a={};t.runChildChunk(s,a,i),u.push(a)}return u}function S(s,t,o){const{columnStore:u}=o.extApi,{table:i}=o.source;for(const a of["header","footer"]){const d="s"===s?i:t,h=d===i?t:i;if(d[a]){const f="header"===a?u.headerColumnDef:u.footerColumnDef;h[a]||(h[a]={}),o.runChildChunk("dataMetaRow",t[a],i[a],{kind:a,active:f})}}}function A(s,t,o){const{table:u}=o.source,i="s"===s?u:t,a=i===t?d=>({colState:d,pblColumn:u.cols.find(h=>b.P6.isPblColumn(h)&&h.orgProp===d.prop||h.id===d.id||h.prop===d.prop)}):d=>({colState:t.cols[t.cols.push({})-1],pblColumn:b.P6.isPblColumn(d)&&d});if(i.cols&&i.cols.length>0)for(const d of i.cols){const{colState:h,pblColumn:f}=a(d),g={pblColumn:b.P6.isPblColumn(f)&&f,activeColumn:o.grid.columnApi.findColumn(d.id||d.prop)};o.runChildChunk("dataColumn",h,f,g)}}function k(){O.$2.registerRootChunkSection("columns",{sourceMatcher:s=>s.grid.columns,stateMatcher:s=>s.columns||(s.columns={table:{cols:[]},header:[],footer:[],headerGroup:[]})}),(0,m.O)("columns").handleKeys("table","header","headerGroup","footer").serialize((s,t)=>{switch(s){case"table":const o={cols:[]};return S("s",o,t),A("s",o,t),o;case"header":case"footer":const u=t.source[s];if(u&&u.length>0){const a=[];for(const d of u){const h={};t.runChildChunk("metaRow",h,d),h.cols=l("metaColumn",t,d.cols),a.push(h)}return a}break;case"headerGroup":const i=t.source.headerGroup;if(i&&i.length>0){const a=[];for(const d of i){const h={};t.runChildChunk("metaGroupRow",h,d),h.cols=l("metaColumn",t,d.cols),a.push(h)}return a}}}).deserialize((s,t,o)=>{switch(s){case"table":const u=t;S("d",u,o),A("d",u,o);break;case"header":case"footer":const i=o.source[s],a=t;if(a&&a.length>0)for(const d of a){const h=i.find(f=>f.rowIndex===d.rowIndex);if(h){o.runChildChunk("metaRow",d,h);for(const f of d.cols){const g=h.cols.find(p=>p.id===f.id);g&&(o.extApi.columnStore.find(f.id),o.runChildChunk("metaColumn",f,g))}}}}}).register(),function v(){(0,m.O)("dataColumn").requiredKeys("id","prop").handleKeys("label","css","type","width","minWidth","maxWidth","headerType","footerType","sort","alias","editable","pin").serialize((s,t)=>{const o=t.data.activeColumn||t.data.pblColumn;if(o&&"prop"===s)return o.orgProp;const u=o?o[s]:t.source[s];return"sort"===s?"boolean"==typeof u?u:void 0:u}).deserialize((s,t,o)=>{const{activeColumn:u}=o.data;if(u&&"width"===s&&u.updateWidth(t),o.source){switch(s){case"prop":return;case"type":case"headerType":case"footerType":const i=o.source[s],a=t;if(a&&"string"!=typeof a&&i&&"string"!=typeof i)return i.name=a.name,void(a.data&&(i.data=Object.assign(i.data||{},a.data)))}o.source[s]=t}}).register(),(0,m.O)("dataMetaRow").handleKeys("rowClassName","type").serialize((s,t)=>{const o=t.data.active||t.source;if(o)return o[s]}).deserialize((s,t,o)=>{o.source[s]=t}).register(),(0,m.O)("metaRow").handleKeys("rowClassName","type","rowIndex").serialize((s,t)=>t.source[s]).deserialize((s,t,o)=>{}).register(),(0,m.O)("metaGroupRow").handleKeys("rowClassName","type","rowIndex").serialize((s,t)=>t.source[s]).deserialize((s,t,o)=>{}).register(),(0,m.O)("metaColumn").requiredKeys("kind","rowIndex").handleKeys("id","label","css","type","width","minWidth","maxWidth").serialize((s,t)=>t.source[s]).deserialize((s,t,o)=>{}).register(),(0,m.O)("metaGroupColumn").requiredKeys("columnIds","rowIndex").handleKeys("id","label","css","type","width","minWidth","maxWidth").serialize((s,t)=>t.source[s]).deserialize((s,t,o)=>{}).register()}()}},54131:(I,w,r)=>{r.d(w,{f:()=>O});var b=r(65590),m=r(29552);function O(){m.$2.registerRootChunkSection("columnOrder",{sourceMatcher:v=>v.grid.columnApi,stateMatcher:v=>(v.columnOrder||(v.columnOrder=[]),v)}),(0,b.O)("columnOrder").handleKeys("columnOrder").serialize((v,l)=>l.source.visibleColumnIds.slice()).deserialize((v,l,S)=>{const{grid:k}=S;let s;if((null==l?void 0:l.length)===k.columnApi.visibleColumns.length)for(let t=0,o=l.length;t<o;t++){const u=k.columnApi.visibleColumns[t];if(l[t]!==u.id){const i=k.columnApi.findColumn(l[t]);if(!i)return;s=[i,u],k.columnApi.moveColumn(i,u)}}s&&(k.columnApi.moveColumn(s[1],s[0]),k.columnApi.moveColumn(s[0],s[1]))}).register()}},73375:(I,w,r)=>{r.d(w,{R:()=>O});var b=r(65590),m=r(29552);function O(){m.$2.registerRootChunkSection("grid",{sourceMatcher:v=>v.grid,stateMatcher:v=>v.grid||(v.grid={})}),(0,b.O)("grid").handleKeys("showHeader","showFooter","focusMode","usePagination","minDataViewHeight").serialize((v,l)=>l.source[v]).deserialize((v,l,S)=>{S.source[v]=l}).register()}},65590:(I,w,r)=>{r.d(w,{O:()=>O});var b=r(29552);class m{constructor(l){this.chunkId=l,this.keys=new Set,this.rKeys=new Set}handleKeys(...l){for(const S of l)this.keys.add(S);return this}requiredKeys(...l){for(const S of l)this.keys.add(S),this.rKeys.add(S);return this}serialize(l){return this.sFn=l,this}deserialize(l){return this.dFn=l,this}register(){0!==this.keys.size&&(!this.sFn||!this.dFn||b.$2.registerChunkHandlerDefinition({chunkId:this.chunkId,keys:Array.from(this.keys.values()),rKeys:Array.from(this.rKeys.values()),serialize:this.sFn,deserialize:this.dFn}))}}function O(v){return new m(v)}},45811:(I,w,r)=>{r.d(w,{nM:()=>a,jw:()=>h,zL:()=>d});var b=r(29552),O=(r(65590),r(14625));let v=(()=>{class n{save(c,y){try{const C=this.loadGlobalStateStore();return C[c]=y,y.__metadata__||(y.__metadata__={}),y.__metadata__.updatedAt=(new Date).toISOString(),this.saveGlobalStateStore(C),Promise.resolve()}catch(C){return Promise.reject(C)}}load(c){return Promise.resolve(this.loadGlobalStateStore()[c]||{})}exists(c){const y=this.loadGlobalStateStore()||{};return Promise.resolve(c in y)}loadGlobalStateStore(){const c=localStorage.getItem(n.globalStateKey);return c?JSON.parse(c):{}}saveGlobalStateStore(c){localStorage.setItem(n.globalStateKey,JSON.stringify(c))}}return n.globalStateKey="pebulaNgridState",n})();class l{resolveId(e){return e.grid.id}}function S(n,e){return e.identResolver.resolveId(o(n,e))}function A(n,e,c){const y=i(n.chunkId,c.options);for(const C of n.keys)(!y||n.rKeys.indexOf(C)>-1||y(C))&&(e[C]=n.serialize(C,c))}function k(n,e,c){const y=i(n.chunkId,c.options);for(const C of n.keys)C in e&&(!y||n.rKeys.indexOf(C)>-1||y(C))&&n.deserialize(C,e[C],c)}function s(n,e){if(e||(e={}),e.persistenceAdapter||(e.persistenceAdapter=new v),e.identResolver||(e.identResolver=new l),"load"===n){const c=e;c.strategy||(c.strategy="overwrite")}return e}function t(n){const e=O.q5.find(n);if(e)return e.extApi}function o(n,e){return{grid:n,extApi:t(n),options:e}}function u(n,e,c){return Object.assign(Object.assign({},n),{source:e.sourceMatcher(n),runChildChunk(y,C,P,z){const M=Object.assign(Object.assign({},n),{source:P,data:z}),D=b.$2.getDefinitionsForSection(y),K="serialize"===c?A:k;for(const R of D)K(R,C,M)}})}function i(n,e,c=!1){const y=e.include||e.exclude;if(y){const C=y===e.include?1:-1,P=y[n];if("boolean"==typeof P)return 1===C?z=>P:z=>!P;if(Array.isArray(P))return c?z=>!0:1===C?z=>P.indexOf(z)>-1:z=>-1===P.indexOf(z);if(1===C)return z=>!1}}function a(n,e){return Promise.resolve().then(()=>{e=s("save",e);const c=S(n,e);return e.persistenceAdapter.exists(c)})}function d(n,e){return Promise.resolve().then(()=>{e=s("save",e);const c=S(n,e),y={},C=o(n,e);for(const[P,z]of b.$2.getRootSections()){const M=i(P,e,!0);if(!M||M(P)){const D=z.stateMatcher(y),K=u(C,z,"serialize"),R=b.$2.getDefinitionsForSection(P);for(const E of R)A(E,D,K)}}return e.persistenceAdapter.save(c,y)})}function h(n,e){return Promise.resolve().then(()=>{e=s("load",e);const c=S(n,e);return e.persistenceAdapter.load(c).then(y=>{const C=o(n,e);for(const[P,z]of b.$2.getRootSections()){const M=i(P,e,!0);if(!M||M(P)){const D=z.stateMatcher(y),K=u(C,z,"deserialize"),R=b.$2.getDefinitionsForSection(P);for(const E of R)k(E,D,K)}}return y})})}r(73375),r(26517),r(54131)},29552:(I,w,r)=>{let b;r.d(w,{$2:()=>O});class m{constructor(){this.rootChunkSections=new Map,this.chunkHandlers=new Map}static get(){return b||(b=new m)}registerRootChunkSection(l,S){this.rootChunkSections.has(l)||this.rootChunkSections.set(l,S)}registerChunkHandlerDefinition(l){const{chunkId:S}=l,A=this.chunkHandlers.get(S)||[];A.push(l),this.chunkHandlers.set(S,A)}getRootSections(){return Array.from(this.rootChunkSections.entries())}getDefinitionsForSection(l){return this.chunkHandlers.get(l)||[]}}const O=m.get()},28027:(I,w,r)=>{r.d(w,{dm:()=>a,Bg:()=>d,GI:()=>h});var b=r(8929),m=r(92198),O=r(77604),v=r(24850),l=r(72986),S=r(31307),A=r(80013),k=r(3805),s=r(14625),t=r(45811);function o(...f){const g={grid:["showFooter","showHeader"],columnVisibility:!0,columnOrder:!0,columns:["table"],dataColumn:["width"]};if(f.length>0)for(const p of f)u(g,p);return g}function u(f,g){for(const p of Object.keys(g)){const n=g[p];if(p in f){const e=f[p];if(Array.isArray(e)&&Array.isArray(n)){const c=new Set([...e,...n]);f[p]=Array.from(c.values())}}else f[p]=g[p]}}var i=r(5e3);const a="state";class d{constructor(g,p,n){this.grid=g,this.injector=p,this.pluginCtrl=n,this._events=new b.xQ,this._removePlugin=n.setPlugin(a,this),this.afterLoadState=this._events.pipe((0,m.h)(e=>"load"===e.phase&&"after"===e.position),(0,O.h)(void 0)),this.afterSaveState=this._events.pipe((0,m.h)(e=>"save"===e.phase&&"after"===e.position),(0,O.h)(void 0)),this.onError=this._events.pipe((0,m.h)(e=>!!e.error),(0,v.U)(e=>({phase:e.phase,error:e.error}))),n.events.pipe(k.aL,(0,l.q)(1)).subscribe(e=>{const c=Object.assign(Object.assign({},this.loadOptions||{}),{avoidRedraw:!0});(0,t.nM)(g,c).then(y=>{if(y)return this._load(c)}).then(()=>{n.events.pipe(k.qL,(0,S.T)(1),(0,A.b)(500)).subscribe(y=>this.save())})}),n.events.pipe(k.vS).subscribe(e=>{e.wait(this.save()),this._events.complete()})}static create(g,p){const n=s.q5.find(g);return new d(g,p,n)}load(){return this._load(this.loadOptions)}save(){return(0,t.zL)(this.grid,this.saveOptions).then(()=>this._events.next({phase:"save",position:"after"})).catch(g=>this._events.next({phase:"save",position:"after",error:g}))}destroy(){this._removePlugin(this.grid)}_load(g){return(0,t.jw)(this.grid,g).then(()=>this._events.next({phase:"load",position:"after"})).catch(p=>this._events.next({phase:"load",position:"after",error:p}))}}let h=(()=>{class f extends d{constructor(p,n,e){super(p,n,e),this.loadOptions={include:o()},this.saveOptions={include:o()}}ngOnDestroy(){this.destroy()}}return f.\u0275fac=function(p){return new(p||f)(i.Y36(s.eZ),i.Y36(i.zs3),i.Y36(s.q5))},f.\u0275dir=i.lG2({type:f,selectors:[["pbl-ngrid","persistState",""]],inputs:{loadOptions:"loadOptions",saveOptions:"saveOptions"},outputs:{afterLoadState:"afterLoadState",afterSaveState:"afterSaveState",onError:"onError"},features:[i.qOj]}),f})()}}]);