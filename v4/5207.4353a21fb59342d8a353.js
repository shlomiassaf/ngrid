(self.webpackChunkpebula=self.webpackChunkpebula||[]).push([[5207],{25207:(e,t,s)=>{"use strict";s.d(t,{Lu:()=>p}),s(66735);var o=s(45430),r=s(61511),n=s(7997),i=s(64914),a=s(23607),c=s(44478),l=s(34653),u=s(94992),d=s(3055);function h(){(0,a.R)(),(0,d.l)(),u.$2.registerRootChunkSection("columnVisibility",{sourceMatcher:e=>e.grid.columnApi,stateMatcher:e=>(e.columnVisibility||(e.columnVisibility=[]),e)}),(0,l.O)("columnVisibility").handleKeys("columnVisibility").serialize((e,t)=>t.source.hiddenColumnIds).deserialize((e,t,s)=>{s.extApi.columnStore.updateColumnVisibility(t)}).register(),(0,c.f)()}var f=s(31572);let p=(()=>{class e{constructor(t){i.q5.onCreatedSafe(e,(e,s)=>{const r=t.get(o.dm);r&&!0===r.autoEnable&&s.onInit().subscribe(()=>{if(!s.hasPlugin(o.dm)){const e=s.createPlugin(o.dm);r.autoEnableOptions&&(e.loadOptions=r.autoEnableOptions.loadOptions,e.saveOptions=r.autoEnableOptions.saveOptions)}})})}}return e.NGRID_PLUGIN=(0,i.Ic)({id:o.dm,factory:"create",runOnce:h},o.Bg),e.\u0275fac=function(t){return new(t||e)(f.LFG(n.f8))},e.\u0275mod=f.oAB({type:e}),e.\u0275inj=f.cJS({providers:[],imports:[[r.ez,i.dC]]}),e})()},3055:(e,t,s)=>{"use strict";s.d(t,{l:()=>l});var o=s(64914),r=s(34653),n=s(94992);function i(e,t,s){const o=[];for(const r of s){const s={};t.runChildChunk(e,s,r),o.push(s)}return o}function a(e,t,s){const{columnStore:o}=s.extApi,{table:r}=s.source;for(const n of["header","footer"]){const i="s"===e?r:t,a=i===r?t:r;if(i[n]){const e="header"===n?o.headerColumnDef:o.footerColumnDef;a[n]||(a[n]={}),s.runChildChunk("dataMetaRow",t[n],r[n],{kind:n,active:e})}}}function c(e,t,s){const{table:r}=s.source,n="s"===e?r:t,i=n===t?e=>({colState:e,pblColumn:r.cols.find(t=>o.P6.isPblColumn(t)&&t.orgProp===e.prop||t.id===e.id||t.prop===e.prop)}):e=>({colState:t.cols[t.cols.push({})-1],pblColumn:o.P6.isPblColumn(e)&&e});if(n.cols&&n.cols.length>0)for(const a of n.cols){const{colState:e,pblColumn:t}=i(a),r={pblColumn:o.P6.isPblColumn(t)&&t,activeColumn:s.grid.columnApi.findColumn(a.id||a.prop)};s.runChildChunk("dataColumn",e,t,r)}}function l(){n.$2.registerRootChunkSection("columns",{sourceMatcher:e=>e.grid.columns,stateMatcher:e=>e.columns||(e.columns={table:{cols:[]},header:[],footer:[],headerGroup:[]})}),(0,r.O)("columns").handleKeys("table","header","headerGroup","footer").serialize((e,t)=>{switch(e){case"table":const s={cols:[]};return a("s",s,t),c("s",s,t),s;case"header":case"footer":const o=t.source[e];if(o&&o.length>0){const e=[];for(const s of o){const o={};t.runChildChunk("metaRow",o,s),o.cols=i("metaColumn",t,s.cols),e.push(o)}return e}break;case"headerGroup":const r=t.source.headerGroup;if(r&&r.length>0){const e=[];for(const s of r){const o={};t.runChildChunk("metaGroupRow",o,s),o.cols=i("metaColumn",t,s.cols),e.push(o)}return e}}}).deserialize((e,t,s)=>{switch(e){case"table":const o=t;a("d",o,s),c("d",o,s);break;case"header":case"footer":const r=s.source[e],n=t;if(n&&n.length>0)for(const e of n){const t=r.find(t=>t.rowIndex===e.rowIndex);if(t){s.runChildChunk("metaRow",e,t);for(const o of e.cols){const e=t.cols.find(e=>e.id===o.id);e&&(s.extApi.columnStore.find(o.id),s.runChildChunk("metaColumn",o,e))}}}}}).register(),(0,r.O)("dataColumn").requiredKeys("id","prop").handleKeys("label","css","type","width","minWidth","maxWidth","headerType","footerType","sort","alias","editable","pin").serialize((e,t)=>{const s=t.data.activeColumn||t.data.pblColumn;if(s)switch(e){case"prop":return s.orgProp}const o=s?s[e]:t.source[e];switch(e){case"sort":return"boolean"==typeof o?o:void 0}return o}).deserialize((e,t,s)=>{const{activeColumn:o}=s.data;if(o)switch(e){case"width":o.updateWidth(t)}if(s.source){switch(e){case"prop":return;case"type":case"headerType":case"footerType":const o=s.source[e],r=t;if(r&&"string"!=typeof r&&o&&"string"!=typeof o)return o.name=r.name,void(r.data&&(o.data=Object.assign(o.data||{},r.data)))}s.source[e]=t}}).register(),(0,r.O)("dataMetaRow").handleKeys("rowClassName","type").serialize((e,t)=>{const s=t.data.active||t.source;if(s)return s[e]}).deserialize((e,t,s)=>{s.source[e]=t}).register(),(0,r.O)("metaRow").handleKeys("rowClassName","type","rowIndex").serialize((e,t)=>t.source[e]).deserialize((e,t,s)=>{}).register(),(0,r.O)("metaGroupRow").handleKeys("rowClassName","type","rowIndex").serialize((e,t)=>t.source[e]).deserialize((e,t,s)=>{}).register(),(0,r.O)("metaColumn").requiredKeys("kind","rowIndex").handleKeys("id","label","css","type","width","minWidth","maxWidth").serialize((e,t)=>t.source[e]).deserialize((e,t,s)=>{}).register(),(0,r.O)("metaGroupColumn").requiredKeys("columnIds","rowIndex").handleKeys("id","label","css","type","width","minWidth","maxWidth").serialize((e,t)=>t.source[e]).deserialize((e,t,s)=>{}).register()}},44478:(e,t,s)=>{"use strict";s.d(t,{f:()=>n});var o=s(34653),r=s(94992);function n(){r.$2.registerRootChunkSection("columnOrder",{sourceMatcher:e=>e.grid.columnApi,stateMatcher:e=>(e.columnOrder||(e.columnOrder=[]),e)}),(0,o.O)("columnOrder").handleKeys("columnOrder").serialize((e,t)=>t.source.visibleColumnIds.slice()).deserialize((e,t,s)=>{const{grid:o}=s;let r;if((null==t?void 0:t.length)===o.columnApi.visibleColumns.length)for(let n=0,i=t.length;n<i;n++){const e=o.columnApi.visibleColumns[n];if(t[n]!==e.id){const s=o.columnApi.findColumn(t[n]);if(!s)return;r=[s,e],o.columnApi.moveColumn(s,e)}}r&&(o.columnApi.moveColumn(r[1],r[0]),o.columnApi.moveColumn(r[0],r[1]))}).register()}},23607:(e,t,s)=>{"use strict";s.d(t,{R:()=>n});var o=s(34653),r=s(94992);function n(){r.$2.registerRootChunkSection("grid",{sourceMatcher:e=>e.grid,stateMatcher:e=>e.grid||(e.grid={})}),(0,o.O)("grid").handleKeys("showHeader","showFooter","focusMode","usePagination","minDataViewHeight").serialize((e,t)=>t.source[e]).deserialize((e,t,s)=>{s.source[e]=t}).register()}},34653:(e,t,s)=>{"use strict";s.d(t,{O:()=>n});var o=s(94992);class r{constructor(e){this.chunkId=e,this.keys=new Set,this.rKeys=new Set}handleKeys(...e){for(const t of e)this.keys.add(t);return this}requiredKeys(...e){for(const t of e)this.keys.add(t),this.rKeys.add(t);return this}serialize(e){return this.sFn=e,this}deserialize(e){return this.dFn=e,this}register(){0!==this.keys.size&&this.sFn&&this.dFn&&o.$2.registerChunkHandlerDefinition({chunkId:this.chunkId,keys:Array.from(this.keys.values()),rKeys:Array.from(this.rKeys.values()),serialize:this.sFn,deserialize:this.dFn})}}function n(e){return new r(e)}},66735:(e,t,s)=>{"use strict";s.d(t,{nM:()=>m,jw:()=>v,zL:()=>g});var o=s(94992),r=(s(34653),s(64914));let n=(()=>{class e{save(e,t){try{const s=this.loadGlobalStateStore();return s[e]=t,t.__metadata__||(t.__metadata__={}),t.__metadata__.updatedAt=(new Date).toISOString(),this.saveGlobalStateStore(s),Promise.resolve()}catch(s){return Promise.reject(s)}}load(e){return Promise.resolve(this.loadGlobalStateStore()[e]||{})}exists(e){const t=this.loadGlobalStateStore()||{};return Promise.resolve(e in t)}loadGlobalStateStore(){const t=localStorage.getItem(e.globalStateKey);return t?JSON.parse(t):{}}saveGlobalStateStore(t){localStorage.setItem(e.globalStateKey,JSON.stringify(t))}}return e.globalStateKey="pebulaNgridState",e})();class i{resolveId(e){return e.grid.id}}function a(e,t){return t.identResolver.resolveId(h(e,t))}function c(e,t,s){const o=p(e.chunkId,s.options);for(const r of e.keys)(!o||e.rKeys.indexOf(r)>-1||o(r))&&(t[r]=e.serialize(r,s))}function l(e,t,s){const o=p(e.chunkId,s.options);for(const r of e.keys)r in t&&(!o||e.rKeys.indexOf(r)>-1||o(r))&&e.deserialize(r,t[r],s)}function u(e,t){if(t||(t={}),t.persistenceAdapter||(t.persistenceAdapter=new n),t.identResolver||(t.identResolver=new i),"load"===e){const e=t;e.strategy||(e.strategy="overwrite")}return t}function d(e){const t=r.q5.find(e);if(t)return t.extApi}function h(e,t){return{grid:e,extApi:d(e),options:t}}function f(e,t,s){return Object.assign(Object.assign({},e),{source:t.sourceMatcher(e),runChildChunk(t,r,n,i){const a=Object.assign(Object.assign({},e),{source:n,data:i}),u=o.$2.getDefinitionsForSection(t),d="serialize"===s?c:l;for(const e of u)d(e,r,a)}})}function p(e,t,s=!1){const o=t.include||t.exclude;if(o){const r=o===t.include?1:-1,n=o[e];if("boolean"==typeof n)return 1===r?e=>n:e=>!n;if(Array.isArray(n))return s?e=>!0:1===r?e=>n.indexOf(e)>-1:e=>-1===n.indexOf(e);if(1===r)return e=>!1}}function m(e,t){return Promise.resolve().then(()=>{t=u("save",t);const s=a(e,t);return t.persistenceAdapter.exists(s)})}function g(e,t){return Promise.resolve().then(()=>{t=u("save",t);const s=a(e,t),r={},n=h(e,t);for(const[e,i]of o.$2.getRootSections()){const s=p(e,t,!0);if(!s||s(e)){const t=i.stateMatcher(r),s=f(n,i,"serialize"),a=o.$2.getDefinitionsForSection(e);for(const e of a)c(e,t,s)}}return t.persistenceAdapter.save(s,r)})}function v(e,t){return Promise.resolve().then(()=>{t=u("load",t);const s=a(e,t);return t.persistenceAdapter.load(s).then(s=>{const r=h(e,t);for(const[e,n]of o.$2.getRootSections()){const i=p(e,t,!0);if(!i||i(e)){const t=n.stateMatcher(s),i=f(r,n,"deserialize"),a=o.$2.getDefinitionsForSection(e);for(const e of a)l(e,t,i)}}return s})})}s(23607),s(3055),s(44478)},94992:(e,t,s)=>{"use strict";let o;s.d(t,{$2:()=>n});class r{constructor(){this.rootChunkSections=new Map,this.chunkHandlers=new Map}static get(){return o||(o=new r)}registerRootChunkSection(e,t){this.rootChunkSections.has(e)||this.rootChunkSections.set(e,t)}registerChunkHandlerDefinition(e){const{chunkId:t}=e,s=this.chunkHandlers.get(t)||[];s.push(e),this.chunkHandlers.set(t,s)}getRootSections(){return Array.from(this.rootChunkSections.entries())}getDefinitionsForSection(e){return this.chunkHandlers.get(e)||[]}}const n=r.get()},45430:(e,t,s)=>{"use strict";s.d(t,{dm:()=>g,Bg:()=>v,GI:()=>y});var o=s(55959),r=s(43835),n=s(88414),i=s(79996),a=s(90611),c=s(84698),l=s(47701),u=s(7997),d=s(64914),h=s(66735);function f(...e){const t={grid:["showFooter","showHeader"],columnVisibility:!0,columnOrder:!0,columns:["table"],dataColumn:["width"]};if(e.length>0)for(const s of e)p(t,s);return t}function p(e,t){for(const s of Object.keys(t)){const o=t[s];if(s in e){const t=e[s];if(Array.isArray(t)&&Array.isArray(o)){const r=new Set([...t,...o]);e[s]=Array.from(r.values())}}else e[s]=t[s]}}var m=s(31572);const g="state";class v{constructor(e,t,s){this.grid=e,this.injector=t,this.pluginCtrl=s,this._events=new o.xQ,this._removePlugin=s.setPlugin(g,this),this.afterLoadState=this._events.pipe((0,r.h)(e=>"load"===e.phase&&"after"===e.position),(0,n.h)(void 0)),this.afterSaveState=this._events.pipe((0,r.h)(e=>"save"===e.phase&&"after"===e.position),(0,n.h)(void 0)),this.onError=this._events.pipe((0,r.h)(e=>!!e.error),(0,i.U)(e=>({phase:e.phase,error:e.error}))),s.events.pipe(u.aL,(0,a.q)(1)).subscribe(t=>{const o=Object.assign(Object.assign({},this.loadOptions||{}),{avoidRedraw:!0});(0,h.nM)(e,o).then(e=>{if(e)return this._load(o)}).then(()=>{s.events.pipe(u.qL,(0,c.T)(1),(0,l.b)(500)).subscribe(e=>this.save())})}),s.events.pipe(u.vS).subscribe(e=>{e.wait(this.save()),this._events.complete()})}static create(e,t){const s=d.q5.find(e);return new v(e,t,s)}load(){return this._load(this.loadOptions)}save(){return(0,h.zL)(this.grid,this.saveOptions).then(()=>this._events.next({phase:"save",position:"after"})).catch(e=>this._events.next({phase:"save",position:"after",error:e}))}destroy(){this._removePlugin(this.grid)}_load(e){return(0,h.jw)(this.grid,e).then(()=>this._events.next({phase:"load",position:"after"})).catch(e=>this._events.next({phase:"load",position:"after",error:e}))}}let y=(()=>{class e extends v{constructor(e,t,s){super(e,t,s),this.loadOptions={include:f()},this.saveOptions={include:f()}}ngOnDestroy(){this.destroy()}}return e.\u0275fac=function(t){return new(t||e)(m.Y36(d.eZ),m.Y36(m.zs3),m.Y36(d.q5))},e.\u0275dir=m.lG2({type:e,selectors:[["pbl-ngrid","persistState",""]],inputs:{loadOptions:"loadOptions",saveOptions:"saveOptions"},outputs:{afterLoadState:"afterLoadState",afterSaveState:"afterSaveState",onError:"onError"},features:[m.qOj]}),e})()}}]);