function k(){}const lt=t=>t;function ot(t,e){for(const n in e)t[n]=e[n];return t}function J(t){return t()}function H(){return Object.create(null)}function x(t){t.forEach(J)}function K(t){return typeof t=="function"}function Dt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let N;function Lt(t,e){return N||(N=document.createElement("a")),N.href=e,t===N.href}function ct(t){return Object.keys(t).length===0}function Q(t,...e){if(t==null)return k;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Tt(t){let e;return Q(t,n=>e=n)(),e}function zt(t,e,n){t.$$.on_destroy.push(Q(e,n))}function Bt(t,e,n,s){if(t){const r=U(t,e,n,s);return t[0](r)}}function U(t,e,n,s){return t[1]&&s?ot(n.ctx.slice(),t[1](s(e))):n.ctx}function Ft(t,e,n,s){if(t[2]&&s){const r=t[2](s(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const c=[],i=Math.max(e.dirty.length,r.length);for(let o=0;o<i;o+=1)c[o]=e.dirty[o]|r[o];return c}return e.dirty|r}return e.dirty}function Ht(t,e,n,s,r,c){if(r){const i=U(e,n,s,c);t.p(i,r)}}function It(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let s=0;s<n;s++)e[s]=-1;return e}return-1}const V=typeof window!="undefined";let ut=V?()=>window.performance.now():()=>Date.now(),B=V?t=>requestAnimationFrame(t):k;const b=new Set;function X(t){b.forEach(e=>{e.c(t)||(b.delete(e),e.f())}),b.size!==0&&B(X)}function at(t){let e;return b.size===0&&B(X),{promise:new Promise(n=>{b.add(e={c:t,f:n})}),abort(){b.delete(e)}}}let O=!1;function ft(){O=!0}function _t(){O=!1}function dt(t,e,n,s){for(;t<e;){const r=t+(e-t>>1);n(r)<=s?t=r+1:e=r}return t}function ht(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let u=0;u<e.length;u++){const _=e[u];_.claim_order!==void 0&&l.push(_)}e=l}const n=new Int32Array(e.length+1),s=new Int32Array(e.length);n[0]=-1;let r=0;for(let l=0;l<e.length;l++){const u=e[l].claim_order,_=(r>0&&e[n[r]].claim_order<=u?r+1:dt(1,r,a=>e[n[a]].claim_order,u))-1;s[l]=n[_]+1;const f=_+1;n[f]=l,r=Math.max(f,r)}const c=[],i=[];let o=e.length-1;for(let l=n[r]+1;l!=0;l=s[l-1]){for(c.push(e[l-1]);o>=l;o--)i.push(e[o]);o--}for(;o>=0;o--)i.push(e[o]);c.reverse(),i.sort((l,u)=>l.claim_order-u.claim_order);for(let l=0,u=0;l<i.length;l++){for(;u<c.length&&i[l].claim_order>=c[u].claim_order;)u++;const _=u<c.length?c[u]:null;t.insertBefore(i[l],_)}}function mt(t,e){t.appendChild(e)}function Y(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function pt(t){const e=Z("style");return yt(Y(t),e),e.sheet}function yt(t,e){mt(t.head||t,e)}function gt(t,e){if(O){for(ht(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentElement!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Wt(t,e,n){O&&!n?gt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function bt(t){t.parentNode.removeChild(t)}function Z(t){return document.createElement(t)}function xt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function F(t){return document.createTextNode(t)}function Gt(){return F(" ")}function Jt(){return F("")}function Kt(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function Qt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function $t(t){return Array.from(t.childNodes)}function wt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function tt(t,e,n,s,r=!1){wt(t);const c=(()=>{for(let i=t.claim_info.last_index;i<t.length;i++){const o=t[i];if(e(o)){const l=n(o);return l===void 0?t.splice(i,1):t[i]=l,r||(t.claim_info.last_index=i),o}}for(let i=t.claim_info.last_index-1;i>=0;i--){const o=t[i];if(e(o)){const l=n(o);return l===void 0?t.splice(i,1):t[i]=l,r?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=i,o}}return s()})();return c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,c}function et(t,e,n,s){return tt(t,r=>r.nodeName===e,r=>{const c=[];for(let i=0;i<r.attributes.length;i++){const o=r.attributes[i];n[o.name]||c.push(o.name)}c.forEach(i=>r.removeAttribute(i))},()=>s(e))}function Ut(t,e,n){return et(t,e,n,Z)}function Vt(t,e,n){return et(t,e,n,xt)}function vt(t,e){return tt(t,n=>n.nodeType===3,n=>{const s=""+e;if(n.data.startsWith(s)){if(n.data.length!==s.length)return n.splitText(s.length)}else n.data=s},()=>F(e),!0)}function Xt(t){return vt(t," ")}function Yt(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function Zt(t,e){t.value=e==null?"":e}function te(t,e,n,s){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,s?"important":"")}function ee(t,e,n){t.classList[n?"add":"remove"](e)}function Et(t,e,{bubbles:n=!1,cancelable:s=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,n,s,e),r}function ne(t,e=document.body){return Array.from(e.querySelectorAll(t))}const M=new Map;let q=0;function kt(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function At(t,e){const n={stylesheet:pt(e),rules:{}};return M.set(t,n),n}function I(t,e,n,s,r,c,i,o=0){const l=16.666/s;let u=`{
`;for(let p=0;p<=1;p+=l){const g=e+(n-e)*c(p);u+=p*100+`%{${i(g,1-g)}}
`}const _=u+`100% {${i(n,1-n)}}
}`,f=`__svelte_${kt(_)}_${o}`,a=Y(t),{stylesheet:d,rules:h}=M.get(a)||At(a,t);h[f]||(h[f]=!0,d.insertRule(`@keyframes ${f} ${_}`,d.cssRules.length));const y=t.style.animation||"";return t.style.animation=`${y?`${y}, `:""}${f} ${s}ms linear ${r}ms 1 both`,q+=1,f}function Nt(t,e){const n=(t.style.animation||"").split(", "),s=n.filter(e?c=>c.indexOf(e)<0:c=>c.indexOf("__svelte")===-1),r=n.length-s.length;r&&(t.style.animation=s.join(", "),q-=r,q||Ct())}function Ct(){B(()=>{q||(M.forEach(t=>{const{stylesheet:e}=t;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.rules={}}),M.clear())})}let E;function v(t){E=t}function P(){if(!E)throw new Error("Function called outside component initialization");return E}function ie(t){P().$$.on_mount.push(t)}function re(t){P().$$.after_update.push(t)}function se(t,e){return P().$$.context.set(t,e),e}function le(t){return P().$$.context.get(t)}const w=[],W=[],S=[],G=[],nt=Promise.resolve();let z=!1;function it(){z||(z=!0,nt.then(rt))}function oe(){return it(),nt}function R(t){S.push(t)}const L=new Set;let C=0;function rt(){const t=E;do{for(;C<w.length;){const e=w[C];C++,v(e),St(e.$$)}for(v(null),w.length=0,C=0;W.length;)W.pop()();for(let e=0;e<S.length;e+=1){const n=S[e];L.has(n)||(L.add(n),n())}S.length=0}while(w.length);for(;G.length;)G.pop()();z=!1,L.clear(),v(t)}function St(t){if(t.fragment!==null){t.update(),x(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(R)}}let $;function jt(){return $||($=Promise.resolve(),$.then(()=>{$=null})),$}function T(t,e,n){t.dispatchEvent(Et(`${e?"intro":"outro"}${n}`))}const j=new Set;let m;function ce(){m={r:0,c:[],p:m}}function ue(){m.r||x(m.c),m=m.p}function Mt(t,e){t&&t.i&&(j.delete(t),t.i(e))}function ae(t,e,n,s){if(t&&t.o){if(j.has(t))return;j.add(t),m.c.push(()=>{j.delete(t),s&&(n&&t.d(1),s())}),t.o(e)}}const qt={duration:0};function fe(t,e,n,s){let r=e(t,n),c=s?0:1,i=null,o=null,l=null;function u(){l&&Nt(t,l)}function _(a,d){const h=a.b-c;return d*=Math.abs(h),{a:c,b:a.b,d:h,duration:d,start:a.start,end:a.start+d,group:a.group}}function f(a){const{delay:d=0,duration:h=300,easing:y=lt,tick:p=k,css:g}=r||qt,D={start:ut()+d,b:a};a||(D.group=m,m.r+=1),i||o?o=D:(g&&(u(),l=I(t,c,a,h,d,y,g)),a&&p(0,1),i=_(D,h),R(()=>T(t,a,"start")),at(A=>{if(o&&A>o.start&&(i=_(o,h),o=null,T(t,i.b,"start"),g&&(u(),l=I(t,c,i.b,i.duration,0,y,r.css))),i){if(A>=i.end)p(c=i.b,1-c),T(t,i.b,"end"),o||(i.b?u():--i.group.r||x(i.group.c)),i=null;else if(A>=i.start){const st=A-i.start;c=i.a+i.d*y(st/i.duration),p(c,1-c)}}return!!(i||o)}))}return{run(a){K(r)?jt().then(()=>{r=r(),f(a)}):f(a)},end(){u(),i=o=null}}}function _e(t,e){const n={},s={},r={$$scope:1};let c=t.length;for(;c--;){const i=t[c],o=e[c];if(o){for(const l in i)l in o||(s[l]=1);for(const l in o)r[l]||(n[l]=o[l],r[l]=1);t[c]=o}else for(const l in i)r[l]=1}for(const i in s)i in n||(n[i]=void 0);return n}function de(t){return typeof t=="object"&&t!==null?t:{}}function he(t){t&&t.c()}function me(t,e){t&&t.l(e)}function Rt(t,e,n,s){const{fragment:r,on_mount:c,on_destroy:i,after_update:o}=t.$$;r&&r.m(e,n),s||R(()=>{const l=c.map(J).filter(K);i?i.push(...l):x(l),t.$$.on_mount=[]}),o.forEach(R)}function Ot(t,e){const n=t.$$;n.fragment!==null&&(x(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Pt(t,e){t.$$.dirty[0]===-1&&(w.push(t),it(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function pe(t,e,n,s,r,c,i,o=[-1]){const l=E;v(t);const u=t.$$={fragment:null,ctx:null,props:c,update:k,not_equal:r,bound:H(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(l?l.$$.context:[])),callbacks:H(),dirty:o,skip_bound:!1,root:e.target||l.$$.root};i&&i(u.root);let _=!1;if(u.ctx=n?n(t,e.props||{},(f,a,...d)=>{const h=d.length?d[0]:a;return u.ctx&&r(u.ctx[f],u.ctx[f]=h)&&(!u.skip_bound&&u.bound[f]&&u.bound[f](h),_&&Pt(t,f)),a}):[],u.update(),_=!0,x(u.before_update),u.fragment=s?s(u.ctx):!1,e.target){if(e.hydrate){ft();const f=$t(e.target);u.fragment&&u.fragment.l(f),f.forEach(bt)}else u.fragment&&u.fragment.c();e.intro&&Mt(t.$$.fragment),Rt(t,e.target,e.anchor,e.customElement),_t(),rt()}v(l)}class ye{$destroy(){Ot(this,1),this.$destroy=k}$on(e,n){const s=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return s.push(n),()=>{const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}$set(e){this.$$set&&!ct(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{de as A,Ot as B,ot as C,oe as D,k as E,le as F,Lt as G,ee as H,gt as I,zt as J,Bt as K,xt as L,Vt as M,Ht as N,It as O,Ft as P,ne as Q,Tt as R,ye as S,Zt as T,Kt as U,x as V,R as W,fe as X,$t as a,Qt as b,Ut as c,bt as d,Z as e,te as f,Wt as g,vt as h,pe as i,Yt as j,Gt as k,Jt as l,Xt as m,ce as n,ae as o,ue as p,Mt as q,se as r,Dt as s,F as t,re as u,ie as v,he as w,me as x,Rt as y,_e as z};
