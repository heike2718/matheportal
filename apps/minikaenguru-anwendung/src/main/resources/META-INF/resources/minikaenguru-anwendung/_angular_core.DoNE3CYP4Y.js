import { a as bc, b as nt, f as Ac } from "@nf-internal/chunk-6XNIWKD6";
import { B as _c, E as Sc, F as ih, G as sh, H as Rc, I as ah, J as ch, K as lh, L as vM, a as se, b as R, c as bi, f as wc, g as Ai, n as qo, p as Ri, r as ki, s as Ot, w as Oi, x as oh, y as rh } from "@nf-internal/chunk-GR3R5SHV";
import { a as z, b as we, d as ze } from "@nf-internal/chunk-4CLCTAJ7";
import { BehaviorSubject as EM, Observable as IM, Subject as DM, Subscription as TM } from "rxjs";
import { setActiveConsumer as Ln } from "@angular/core/primitives/signals";
import { isNotFound as CM } from "@angular/core/primitives/di";
var Pi = class {
    full;
    major;
    minor;
    patch;
    constructor(t) { this.full = t; let n = t.split("."); this.major = n[0], this.minor = n[1], this.patch = n.slice(2).join("."); }
}, MM = new Pi("21.2.6");
var Hi = "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss", D = class extends Error {
    code;
    constructor(t, n) { super(Ko(t, n)), this.code = t; }
};
function NM(e) { return `NG0${Math.abs(e)}`; }
function Ko(e, t) { return `${NM(e)}${t ? ": " + t : ""}`; }
var Se = globalThis;
function j(e) { for (let t in e)
    if (e[t] === j)
        return t; throw Error(""); }
function gh(e, t) { for (let n in t)
    t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]); }
function Jo(e) {
    if (typeof e == "string")
        return e;
    if (Array.isArray(e))
        return `[${e.map(Jo).join(", ")}]`;
    if (e == null)
        return "" + e;
    let t = e.overriddenName || e.name;
    if (t)
        return `${t}`;
    let n = e.toString();
    if (n == null)
        return "" + n;
    let o = n.indexOf(`
`);
    return o >= 0 ? n.slice(0, o) : n;
}
function Bi(e, t) { return e ? t ? `${e} ${t}` : e : t || ""; }
function wM(e, t = 100) { if (!e || t < 1 || e.length <= t)
    return e; if (t == 1)
    return e.substring(0, 1) + "..."; let n = Math.round(t / 2); return e.substring(0, n) + "..." + e.substring(e.length - n); }
var _M = j({ __forward_ref__: j });
function Xo(e) { return e.__forward_ref__ = Xo, e; }
function x(e) { return er(e) ? e() : e; }
function er(e) { return typeof e == "function" && e.hasOwnProperty(_M) && e.__forward_ref__ === Xo; }
function mh(e, t, n) { e != t && Gc(n, e, t, "=="); }
function Gc(e, t, n, o) { throw new Error(`ASSERTION ERROR: ${e}` + (o == null ? "" : ` [Expected=> ${n} ${o} ${t} <=Actual]`)); }
function B(e) { return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 }; }
function tr(e) { return { providers: e.providers || [], imports: e.imports || [] }; }
function nr(e) { return bM(e, jn); }
function SM(e) { return nr(e) !== null; }
function bM(e, t) { return e.hasOwnProperty(t) && e[t] || null; }
function AM(e) { let t = e?.[jn] ?? null; return t || null; }
function Oc(e) { return e && e.hasOwnProperty(Wo) ? e[Wo] : null; }
var jn = j({ \u0275prov: j }), Wo = j({ \u0275inj: j }), T = class {
    _desc;
    ngMetadataName = "InjectionToken";
    \u0275prov;
    constructor(t, n) { this._desc = t, this.\u0275prov = void 0, typeof n == "number" ? this.__NG_ELEMENT_ID__ = n : n !== void 0 && (this.\u0275prov = B({ token: this, providedIn: n.providedIn || "root", factory: n.factory })); }
    get multi() { return this; }
    toString() { return `InjectionToken ${this._desc}`; }
}, uh;
function RM(e) { Gc("setInjectorProfilerContext should never be called in production mode"); let t = uh; return uh = e, t; }
function Wc(e) { return e && !!e.\u0275providers; }
var rn = j({ \u0275cmp: j }), or = j({ \u0275dir: j }), rr = j({ \u0275pipe: j }), Ui = j({ \u0275mod: j }), ot = j({ \u0275fac: j }), sn = j({ __NG_ELEMENT_ID__: j }), dh = j({ __NG_ENV_ID__: j });
function an(e) { return qi(e, "@NgModule"), e[Ui] || null; }
function $i(e) { let t = an(e); if (!t)
    throw new D(915, !1); return t; }
function W(e) { return qi(e, "@Component"), e[rn] || null; }
function be(e) { return qi(e, "@Directive"), e[or] || null; }
function Qe(e) { return qi(e, "@Pipe"), e[rr] || null; }
function qi(e, t) { if (e == null)
    throw new D(-919, !1); }
function ir(e) { let t = W(e) || be(e) || Qe(e); return t !== null && t.standalone; }
function b(e) { return typeof e == "string" ? e : e == null ? "" : String(e); }
function Pe(e) { return typeof e == "function" ? e.name || e.toString() : typeof e == "object" && e != null && typeof e.type == "function" ? e.type.name || e.type.toString() : b(e); }
var yh = j({ ngErrorCode: j }), kM = j({ ngErrorMessage: j }), OM = j({ ngTokenPath: j });
function zc(e, t) { return vh("", -200, t); }
function Gi(e, t) { throw new D(-201, !1); }
function vh(e, t, n) { let o = new D(t, e); return o[yh] = t, o[kM] = e, n && (o[OM] = n), o; }
function xM(e) { return e[yh]; }
var xc;
function Eh() { return xc; }
function Ie(e) { let t = xc; return xc = e, t; }
function Qc(e, t, n) { let o = nr(e); if (o && o.providedIn == "root")
    return o.value === void 0 ? o.value = o.factory() : o.value; if (n & 8)
    return null; if (t !== void 0)
    return t; Gi(e, ""); }
var PM = {}, en = PM, Pc = "__NG_DI_FLAG__", Lc = class {
    injector;
    constructor(t) { this.injector = t; }
    retrieve(t, n) { let o = tn(n) || 0; try {
        return this.injector.get(t, o & 8 ? null : en, o);
    }
    catch (r) {
        if (Ac(r))
            return r;
        throw r;
    } }
};
function LM(e, t = 0) { let n = bc(); if (n === void 0)
    throw new D(-203, !1); if (n === null)
    return Qc(e, void 0, t); {
    let o = FM(t), r = n.retrieve(e, o);
    if (Ac(r)) {
        if (o.optional)
            return null;
        throw r;
    }
    return r;
} }
function pe(e, t = 0) { return (Eh() || LM)(x(e), t); }
function Wi(e) { throw new D(202, !1); }
function v(e, t) { return pe(e, tn(t)); }
function tn(e) { return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4); }
function FM(e) { return { optional: !!(e & 8), host: !!(e & 1), self: !!(e & 2), skipSelf: !!(e & 4) }; }
function Fc(e) { let t = []; for (let n = 0; n < e.length; n++) {
    let o = x(e[n]);
    if (Array.isArray(o)) {
        if (o.length === 0)
            throw new D(900, !1);
        let r, i = 0;
        for (let s = 0; s < o.length; s++) {
            let a = o[s], c = jM(a);
            typeof c == "number" ? c === -1 ? r = a.token : i |= c : r = a;
        }
        t.push(pe(r, i));
    }
    else
        t.push(pe(o));
} return t; }
function Vn(e, t) { return e[Pc] = t, e.prototype[Pc] = t, e; }
function jM(e) { return e[Pc]; }
function xt(e, t) { let n = e.hasOwnProperty(ot); return n ? e[ot] : null; }
function Ih(e, t, n) { if (e.length !== t.length)
    return !1; for (let o = 0; o < e.length; o++) {
    let r = e[o], i = t[o];
    if (n && (r = n(r), i = n(i)), i !== r)
        return !1;
} return !0; }
function Ze(e) { return e.flat(Number.POSITIVE_INFINITY); }
function zi(e, t) { e.forEach(n => Array.isArray(n) ? zi(n, t) : t(n)); }
function Zc(e, t, n) { t >= e.length ? e.push(n) : e.splice(t, 0, n); }
function sr(e, t) { return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]; }
function ar(e, t) { let n = []; for (let o = 0; o < e; o++)
    n.push(t); return n; }
function Yc(e, t, n) { let o = e.length - n; for (; t < o;)
    e[t] = e[t + n], t++; for (; n--;)
    e.pop(); }
function Kc(e, t, n, o) { let r = e.length; if (r == t)
    e.push(n, o);
else if (r === 1)
    e.push(o, e[0]), e[0] = n;
else {
    for (r--, e.push(e[r - 1], e[r]); r > t;) {
        let i = r - 2;
        e[r] = e[i], r--;
    }
    e[t] = n, e[t + 1] = o;
} }
function cr(e, t, n) { let o = Hn(e, t); return o >= 0 ? e[o | 1] = n : (o = ~o, Kc(e, o, t, n)), o; }
function Qi(e, t) { let n = Hn(e, t); if (n >= 0)
    return e[n | 1]; }
function Hn(e, t) { return VM(e, t, 1); }
function VM(e, t, n) { let o = 0, r = e.length >> n; for (; r !== o;) {
    let i = o + (r - o >> 1), s = e[i << n];
    if (t === s)
        return i << n;
    s > t ? r = i : o = i + 1;
} return ~(r << n); }
var Le = {}, F = [], Fe = new T(""), Jc = new T("", -1), Xc = new T(""), zo = class {
    get(t, n = en) { if (n === en) {
        let r = vh("", -201);
        throw r.name = "\u0275NotFound", r;
    } return n; }
};
function Ye(e) { return { \u0275providers: e }; }
function Dh(e) { return Ye([{ provide: Fe, multi: !0, useValue: e }]); }
function Th(...e) { return { \u0275providers: Zi(!0, e), \u0275fromNgModule: !0 }; }
function Zi(e, ...t) { let n = [], o = new Set, r, i = s => { n.push(s); }; return zi(t, s => { let a = s; Li(a, i, [], o) && (r ||= [], r.push(a)); }), r !== void 0 && Ch(r, i), n; }
function Ch(e, t) { for (let n = 0; n < e.length; n++) {
    let { ngModule: o, providers: r } = e[n];
    el(r, i => { t(i, o); });
} }
function Li(e, t, n, o) { if (e = x(e), !e)
    return !1; let r = null, i = Oc(e), s = !i && W(e); if (!i && !s) {
    let c = e.ngModule;
    if (i = Oc(c), i)
        r = c;
    else
        return !1;
}
else {
    if (s && !s.standalone)
        return !1;
    r = e;
} let a = o.has(r); if (s) {
    if (a)
        return !1;
    if (o.add(r), s.dependencies) {
        let c = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
        for (let l of c)
            Li(l, t, n, o);
    }
}
else if (i) {
    if (i.imports != null && !a) {
        o.add(r);
        let l;
        zi(i.imports, u => { Li(u, t, n, o) && (l ||= [], l.push(u)); }), l !== void 0 && Ch(l, t);
    }
    if (!a) {
        let l = xt(r) || (() => new r);
        t({ provide: r, useFactory: l, deps: F }, r), t({ provide: Xc, useValue: r, multi: !0 }, r), t({ provide: Fe, useValue: () => pe(r), multi: !0 }, r);
    }
    let c = i.providers;
    if (c != null && !a) {
        let l = e;
        el(c, u => { t(u, l); });
    }
}
else
    return !1; return r !== e && e.providers !== void 0; }
function el(e, t) { for (let n of e)
    Wc(n) && (n = n.\u0275providers), Array.isArray(n) ? el(n, t) : t(n); }
var HM = j({ provide: String, useValue: j });
function Mh(e) { return e !== null && typeof e == "object" && HM in e; }
function BM(e) { return !!(e && e.useExisting); }
function UM(e) { return !!(e && e.useFactory); }
function nn(e) { return typeof e == "function"; }
function Nh(e) { return !!e.useClass; }
var tl = new T(""), xi = {}, fh = {}, kc;
function Bn() { return kc === void 0 && (kc = new zo), kc; }
var _e = class {
}, on = class extends _e {
    parent;
    source;
    scopes;
    records = new Map;
    _ngOnDestroyHooks = new Set;
    _onDestroyHooks = [];
    get destroyed() { return this._destroyed; }
    _destroyed = !1;
    injectorDefTypes;
    constructor(t, n, o, r) { super(), this.parent = n, this.source = o, this.scopes = r, Vc(t, s => this.processProvider(s)), this.records.set(Jc, Fn(void 0, this)), r.has("environment") && this.records.set(_e, Fn(void 0, this)); let i = this.records.get(tl); i != null && typeof i.value == "string" && this.scopes.add(i.value), this.injectorDefTypes = new Set(this.get(Xc, F, { self: !0 })); }
    retrieve(t, n) { let o = tn(n) || 0; try {
        return this.get(t, en, o);
    }
    catch (r) {
        if (CM(r))
            return r;
        throw r;
    } }
    destroy() { Go(this), this._destroyed = !0; let t = Ln(null); try {
        for (let o of this._ngOnDestroyHooks)
            o.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let o of n)
            o();
    }
    finally {
        this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), Ln(t);
    } }
    onDestroy(t) { return Go(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t); }
    runInContext(t) { Go(this); let n = nt(this), o = Ie(void 0), r; try {
        return t();
    }
    finally {
        nt(n), Ie(o);
    } }
    get(t, n = en, o) { if (Go(this), t.hasOwnProperty(dh))
        return t[dh](this); let r = tn(o), i, s = nt(this), a = Ie(void 0); try {
        if (!(r & 4)) {
            let l = this.records.get(t);
            if (l === void 0) {
                let u = zM(t) && nr(t);
                u && this.injectableDefInScope(u) ? l = Fn(jc(t), xi) : l = null, this.records.set(t, l);
            }
            if (l != null)
                return this.hydrate(t, l, r);
        }
        let c = r & 2 ? Bn() : this.parent;
        return n = r & 8 && n === en ? null : n, c.get(t, n);
    }
    catch (c) {
        let l = xM(c);
        throw l === -200 || l === -201 ? new D(l, null) : c;
    }
    finally {
        Ie(a), nt(s);
    } }
    resolveInjectorInitializers() { let t = Ln(null), n = nt(this), o = Ie(void 0), r; try {
        let i = this.get(Fe, F, { self: !0 });
        for (let s of i)
            s();
    }
    finally {
        nt(n), Ie(o), Ln(t);
    } }
    toString() { return "R3Injector[...]"; }
    processProvider(t) { t = x(t); let n = nn(t) ? t : x(t && t.provide), o = qM(t); if (!nn(t) && t.multi === !0) {
        let r = this.records.get(n);
        r || (r = Fn(void 0, xi, !0), r.factory = () => Fc(r.multi), this.records.set(n, r)), n = t, r.multi.push(t);
    } this.records.set(n, o); }
    hydrate(t, n, o) { let r = Ln(null); try {
        if (n.value === fh)
            throw zc("");
        return n.value === xi && (n.value = fh, n.value = n.factory(void 0, o)), typeof n.value == "object" && n.value && WM(n.value) && this._ngOnDestroyHooks.add(n.value), n.value;
    }
    finally {
        Ln(r);
    } }
    injectableDefInScope(t) { if (!t.providedIn)
        return !1; let n = x(t.providedIn); return typeof n == "string" ? n === "any" || this.scopes.has(n) : this.injectorDefTypes.has(n); }
    removeOnDestroy(t) { let n = this._onDestroyHooks.indexOf(t); n !== -1 && this._onDestroyHooks.splice(n, 1); }
};
function jc(e) { let t = nr(e), n = t !== null ? t.factory : xt(e); if (n !== null)
    return n; if (e instanceof T)
    throw new D(-204, !1); if (e instanceof Function)
    return $M(e); throw new D(-204, !1); }
function $M(e) { if (e.length > 0)
    throw new D(-204, !1); let n = AM(e); return n !== null ? () => n.factory(e) : () => new e; }
function qM(e) { if (Mh(e))
    return Fn(void 0, e.useValue); {
    let t = nl(e);
    return Fn(t, xi);
} }
function nl(e, t, n) { let o; if (nn(e)) {
    let r = x(e);
    return xt(r) || jc(r);
}
else if (Mh(e))
    o = () => x(e.useValue);
else if (UM(e))
    o = () => e.useFactory(...Fc(e.deps || []));
else if (BM(e))
    o = (r, i) => pe(x(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
else {
    let r = x(e && (e.useClass || e.provide));
    if (GM(e))
        o = () => new r(...Fc(e.deps));
    else
        return xt(r) || jc(r);
} return o; }
function Go(e) { if (e.destroyed)
    throw new D(-205, !1); }
function Fn(e, t, n = !1) { return { factory: e, value: t, multi: n ? [] : void 0 }; }
function GM(e) { return !!e.deps; }
function WM(e) { return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"; }
function zM(e) { return typeof e == "function" || typeof e == "object" && e.ngMetadataName === "InjectionToken"; }
function Vc(e, t) { for (let n of e)
    Array.isArray(n) ? Vc(n, t) : n && Wc(n) ? Vc(n.\u0275providers, t) : t(n); }
function Yi(e, t) { let n; e instanceof on ? (Go(e), n = e) : n = new Lc(e); let o, r = nt(n), i = Ie(void 0); try {
    return t();
}
finally {
    nt(r), Ie(i);
} }
function Ki() { return Eh() !== void 0 || bc() != null; }
function QM(e) { if (!Ki())
    throw new D(-203, !1); }
var $ = 0, m = 1, N = 2, Q = 3, he = 4, ce = 5, le = 6, Lt = 7, U = 8, P = 9, je = 10, w = 11, Ft = 12, lr = 13, cn = 14, ee = 15, jt = 16, ln = 17, rt = 18, Ve = 19, ol = 20, mt = 21, Ji = 22, Pt = 23, Ae = 24, un = 25, it = 26, E = 27, rl = 1, Re = 6, Ke = 7, ur = 8, dn = 9, G = 10;
function ne(e) { return Array.isArray(e) && typeof e[rl] == "object"; }
function K(e) { return Array.isArray(e) && e[rl] === !0; }
function il(e) { return (e.flags & 4) !== 0; }
function De(e) { return e.componentOffset > -1; }
function Un(e) { return (e.flags & 1) === 1; }
function He(e) { return !!e.template; }
function st(e) { return (e[N] & 512) !== 0; }
function sl(e) { return (e.type & 16) === 16; }
function wh(e) { return (e[N] & 32) === 32; }
function at(e) { return (e[N] & 256) === 256; }
var al = "svg", cl = "math";
function L(e) { for (; Array.isArray(e);)
    e = e[$]; return e; }
function dr(e) { for (; Array.isArray(e);) {
    if (typeof e[rl] == "object")
        return e;
    e = e[$];
} return null; }
function fn(e, t) { return L(t[e]); }
function ue(e, t) { return L(t[e.index]); }
function _h(e, t) { let n = e === null ? -1 : e.index; return n !== -1 ? L(t[n]) : null; }
function Vt(e, t) { return e.data[t]; }
function Ht(e, t) { return e[t]; }
function fr(e, t, n, o) { n >= e.data.length && (e.data[n] = null, e.blueprint[n] = null), t[n] = o; }
function ye(e, t) { let n = t[e]; return ne(n) ? n : n[$]; }
function Sh(e) { return (e[N] & 4) === 4; }
function Xi(e) { return (e[N] & 128) === 128; }
function bh(e) { return K(e[Q]); }
function ge(e, t) { return t == null ? null : e[t]; }
function ll(e) { e[ln] = 0; }
function es(e) { e[N] & 1024 || (e[N] |= 1024, Xi(e) && pn(e)); }
function ul(e, t) { for (; e > 0;)
    t = t[cn], e--; return t; }
function $n(e) { return !!(e[N] & 9216 || e[Ae]?.dirty); }
function ts(e) { e[je].changeDetectionScheduler?.notify(8), e[N] & 64 && (e[N] |= 1024), $n(e) && pn(e); }
function pn(e) { e[je].changeDetectionScheduler?.notify(0); let t = yt(e); for (; t !== null && !(t[N] & 8192 || (t[N] |= 8192, !Xi(t)));)
    t = yt(t); }
function pr(e, t) { if (at(e))
    throw new D(911, !1); e[mt] === null && (e[mt] = []), e[mt].push(t); }
function ns(e, t) { if (e[mt] === null)
    return; let n = e[mt].indexOf(t); n !== -1 && e[mt].splice(n, 1); }
function yt(e) { let t = e[Q]; return K(t) ? t[Q] : t; }
function dl(e) { return e[Lt] ??= []; }
function fl(e) { return e.cleanup ??= []; }
function Ah(e, t, n, o) { let r = dl(t); r.push(n), e.firstCreatePass && fl(e).push(o, r.length - 1); }
var S = { lFrame: jh(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var Hc = !1;
function Rh() { return S.lFrame.elementDepthCount; }
function kh() { S.lFrame.elementDepthCount++; }
function pl() { S.lFrame.elementDepthCount--; }
function os() { return S.bindingsEnabled; }
function hr() { return S.skipHydrationRootTNode !== null; }
function hl(e) { return S.skipHydrationRootTNode === e; }
function gl() { S.bindingsEnabled = !0; }
function Oh(e) { S.skipHydrationRootTNode = e; }
function ml() { S.bindingsEnabled = !1; }
function yl() { S.skipHydrationRootTNode = null; }
function g() { return S.lFrame.lView; }
function A() { return S.lFrame.tView; }
function vl(e) { return S.lFrame.contextLView = e, e[U]; }
function El(e) { return S.lFrame.contextLView = null, e; }
function _() { let e = Il(); for (; e !== null && e.type === 64;)
    e = e.parent; return e; }
function Il() { return S.lFrame.currentTNode; }
function qn() { let e = S.lFrame, t = e.currentTNode; return e.isParent ? t : t.parent; }
function ct(e, t) { let n = S.lFrame; n.currentTNode = e, n.isParent = t; }
function Dl() { return S.lFrame.isParent; }
function Tl() { S.lFrame.isParent = !1; }
function Cl() { return S.lFrame.contextLView; }
function Ml() { return Hc; }
function Qo(e) { let t = Hc; return Hc = e, t; }
function me() { let e = S.lFrame, t = e.bindingRootIndex; return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t; }
function lt() { return S.lFrame.bindingIndex; }
function Nl(e) { return S.lFrame.bindingIndex = e; }
function ve() { return S.lFrame.bindingIndex++; }
function ut(e) { let t = S.lFrame, n = t.bindingIndex; return t.bindingIndex = t.bindingIndex + e, n; }
function xh() { return S.lFrame.inI18n; }
function wl(e) { S.lFrame.inI18n = e; }
function Ph(e, t) { let n = S.lFrame; n.bindingIndex = n.bindingRootIndex = e, rs(t); }
function Lh() { return S.lFrame.currentDirectiveIndex; }
function rs(e) { S.lFrame.currentDirectiveIndex = e; }
function is(e) { let t = S.lFrame.currentDirectiveIndex; return t === -1 ? null : e[t]; }
function ss() { return S.lFrame.currentQueryIndex; }
function gr(e) { S.lFrame.currentQueryIndex = e; }
function ZM(e) { let t = e[m]; return t.type === 2 ? t.declTNode : t.type === 1 ? e[ce] : null; }
function _l(e, t, n) { if (n & 4) {
    let r = t, i = e;
    for (; r = r.parent, r === null && !(n & 1);)
        if (r = ZM(i), r === null || (i = i[cn], r.type & 10))
            break;
    if (r === null)
        return !1;
    t = r, e = i;
} let o = S.lFrame = Fh(); return o.currentTNode = t, o.lView = e, !0; }
function as(e) { let t = Fh(), n = e[m]; S.lFrame = t, t.currentTNode = n.firstChild, t.lView = e, t.tView = n, t.contextLView = e, t.bindingIndex = n.bindingStartIndex, t.inI18n = !1; }
function Fh() { let e = S.lFrame, t = e === null ? null : e.child; return t === null ? jh(e) : t; }
function jh(e) { let t = { currentTNode: null, isParent: !0, lView: null, tView: null, selectedIndex: -1, contextLView: null, elementDepthCount: 0, currentNamespace: null, currentDirectiveIndex: -1, bindingRootIndex: -1, bindingIndex: -1, currentQueryIndex: 0, parent: e, child: null, inI18n: !1 }; return e !== null && (e.child = t), t; }
function Vh() { let e = S.lFrame; return S.lFrame = e.parent, e.currentTNode = null, e.lView = null, e; }
var Sl = Vh;
function cs() { let e = Vh(); e.isParent = !0, e.tView = null, e.selectedIndex = -1, e.contextLView = null, e.elementDepthCount = 0, e.currentDirectiveIndex = -1, e.currentNamespace = null, e.bindingRootIndex = -1, e.bindingIndex = -1, e.currentQueryIndex = 0; }
function Hh(e) { return (S.lFrame.contextLView = ul(e, S.lFrame.contextLView))[U]; }
function de() { return S.lFrame.selectedIndex; }
function Bt(e) { S.lFrame.selectedIndex = e; }
function ke() { let e = S.lFrame; return Vt(e.tView, e.selectedIndex); }
function bl() { S.lFrame.currentNamespace = al; }
function Al() { S.lFrame.currentNamespace = cl; }
function Rl() { YM(); }
function YM() { S.lFrame.currentNamespace = null; }
function kl() { return S.lFrame.currentNamespace; }
var Bh = !0;
function mr() { return Bh; }
function Je(e) { Bh = e; }
function Bc(e, t = null, n = null, o) { let r = Ol(e, t, n, o); return r.resolveInjectorInitializers(), r; }
function Ol(e, t = null, n = null, o, r = new Set) { let i = [n || F, Th(e)], s; return new on(i, t || Bn(), s || null, r); }
var ae = class e {
    static THROW_IF_NOT_FOUND = en;
    static NULL = new zo;
    static create(t, n) { if (Array.isArray(t))
        return Bc({ name: "" }, n, t, ""); {
        let o = t.name ?? "";
        return Bc({ name: o }, t.parent, t.providers, o);
    } }
    static \u0275prov = B({ token: e, providedIn: "any", factory: () => pe(Jc) });
    static __NG_ELEMENT_ID__ = -1;
}, Ut = new T(""), Be = (() => { class e {
    static __NG_ELEMENT_ID__ = KM;
    static __NG_ENV_ID__ = n => n;
} return e; })(), Fi = class extends Be {
    _lView;
    constructor(t) { super(), this._lView = t; }
    get destroyed() { return at(this._lView); }
    onDestroy(t) { let n = this._lView; return pr(n, t), () => ns(n, t); }
};
function KM() { return new Fi(g()); }
var xl = !1, Pl = new T(""), Et = (() => { class e {
    taskId = 0;
    pendingTasks = new Set;
    destroyed = !1;
    pendingTask = new EM(!1);
    debugTaskTracker = v(Pl, { optional: !0 });
    get hasPendingTasks() { return this.destroyed ? !1 : this.pendingTask.value; }
    get hasPendingTasksObservable() { return this.destroyed ? new IM(n => { n.next(!1), n.complete(); }) : this.pendingTask; }
    add() { !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0); let n = this.taskId++; return this.pendingTasks.add(n), this.debugTaskTracker?.add(n), n; }
    has(n) { return this.pendingTasks.has(n); }
    remove(n) { this.pendingTasks.delete(n), this.debugTaskTracker?.remove(n), this.pendingTasks.size === 0 && this.hasPendingTasks && this.pendingTask.next(!1); }
    ngOnDestroy() { this.pendingTasks.clear(), this.hasPendingTasks && this.pendingTask.next(!1), this.destroyed = !0, this.pendingTask.unsubscribe(); }
    static \u0275prov = B({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), Uc = class extends DM {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t = !1) { super(), this.__isAsync = t, Ki() && (this.destroyRef = v(Be, { optional: !0 }) ?? void 0, this.pendingTasks = v(Et, { optional: !0 }) ?? void 0); }
    emit(t) { let n = R(null); try {
        super.next(t);
    }
    finally {
        R(n);
    } }
    subscribe(t, n, o) { let r = t, i = n || (() => null), s = o; if (t && typeof t == "object") {
        let c = t;
        r = c.next?.bind(c), i = c.error?.bind(c), s = c.complete?.bind(c);
    } this.__isAsync && (i = this.wrapInTimeout(i), r && (r = this.wrapInTimeout(r)), s && (s = this.wrapInTimeout(s))); let a = super.subscribe({ next: r, error: i, complete: s }); return t instanceof TM && t.add(a), a; }
    wrapInTimeout(t) { return n => { let o = this.pendingTasks?.add(); setTimeout(() => { try {
        t(n);
    }
    finally {
        o !== void 0 && this.pendingTasks?.remove(o);
    } }); }; }
}, gt = Uc;
function ji(...e) { }
function Ll(e) { let t, n; function o() { e = ji; try {
    n !== void 0 && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(n), t !== void 0 && clearTimeout(t);
}
catch { } } return t = setTimeout(() => { e(), o(); }), typeof requestAnimationFrame == "function" && (n = requestAnimationFrame(() => { e(), o(); })), () => o(); }
function Uh(e) { return queueMicrotask(() => e()), () => { e = ji; }; }
var Fl = "isAngularZone", Zo = Fl + "_ID", JM = 0, q = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new gt(!1);
    onMicrotaskEmpty = new gt(!1);
    onStable = new gt(!1);
    onError = new gt(!1);
    constructor(t) { let { enableLongStackTrace: n = !1, shouldCoalesceEventChangeDetection: o = !1, shouldCoalesceRunChangeDetection: r = !1, scheduleInRootZone: i = xl } = t; if (typeof Zone > "u")
        throw new D(908, !1); Zone.assertZonePatched(); let s = this; s._nesting = 0, s._outer = s._inner = Zone.current, Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec)), n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)), s.shouldCoalesceEventChangeDetection = !r && o, s.shouldCoalesceRunChangeDetection = r, s.callbackScheduled = !1, s.scheduleInRootZone = i, tN(s); }
    static isInAngularZone() { return typeof Zone < "u" && Zone.current.get(Fl) === !0; }
    static assertInAngularZone() { if (!e.isInAngularZone())
        throw new D(909, !1); }
    static assertNotInAngularZone() { if (e.isInAngularZone())
        throw new D(909, !1); }
    run(t, n, o) { return this._inner.run(t, n, o); }
    runTask(t, n, o, r) { let i = this._inner, s = i.scheduleEventTask("NgZoneEvent: " + r, t, XM, ji, ji); try {
        return i.runTask(s, n, o);
    }
    finally {
        i.cancelTask(s);
    } }
    runGuarded(t, n, o) { return this._inner.runGuarded(t, n, o); }
    runOutsideAngular(t) { return this._outer.run(t); }
}, XM = {};
function jl(e) { if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
        e._nesting++, e.onMicrotaskEmpty.emit(null);
    }
    finally {
        if (e._nesting--, !e.hasPendingMicrotasks)
            try {
                e.runOutsideAngular(() => e.onStable.emit(null));
            }
            finally {
                e.isStable = !0;
            }
    } }
function eN(e) { if (e.isCheckStableRunning || e.callbackScheduled)
    return; e.callbackScheduled = !0; function t() { Ll(() => { e.callbackScheduled = !1, $c(e), e.isCheckStableRunning = !0, jl(e), e.isCheckStableRunning = !1; }); } e.scheduleInRootZone ? Zone.root.run(() => { t(); }) : e._outer.run(() => { t(); }), $c(e); }
function tN(e) { let t = () => { eN(e); }, n = JM++; e._inner = e._inner.fork({ name: "angular", properties: { [Fl]: !0, [Zo]: n, [Zo + n]: !0 }, onInvokeTask: (o, r, i, s, a, c) => { if (nN(c))
        return o.invokeTask(i, s, a, c); try {
        return ph(e), o.invokeTask(i, s, a, c);
    }
    finally {
        (e.shouldCoalesceEventChangeDetection && s.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && t(), hh(e);
    } }, onInvoke: (o, r, i, s, a, c, l) => { try {
        return ph(e), o.invoke(i, s, a, c, l);
    }
    finally {
        e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !oN(c) && t(), hh(e);
    } }, onHasTask: (o, r, i, s) => { o.hasTask(i, s), r === i && (s.change == "microTask" ? (e._hasPendingMicrotasks = s.microTask, $c(e), jl(e)) : s.change == "macroTask" && (e.hasPendingMacrotasks = s.macroTask)); }, onHandleError: (o, r, i, s) => (o.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1) }); }
function $c(e) { e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.callbackScheduled === !0 ? e.hasPendingMicrotasks = !0 : e.hasPendingMicrotasks = !1; }
function ph(e) { e._nesting++, e.isStable && (e.isStable = !1, e.onUnstable.emit(null)); }
function hh(e) { e._nesting--, jl(e); }
var Yo = class {
    hasPendingMicrotasks = !1;
    hasPendingMacrotasks = !1;
    isStable = !0;
    onUnstable = new gt;
    onMicrotaskEmpty = new gt;
    onStable = new gt;
    onError = new gt;
    run(t, n, o) { return t.apply(n, o); }
    runGuarded(t, n, o) { return t.apply(n, o); }
    runOutsideAngular(t) { return t(); }
    runTask(t, n, o, r) { return t.apply(n, o); }
};
function nN(e) { return $h(e, "__ignore_ng_zone__"); }
function oN(e) { return $h(e, "__scheduler_tick__"); }
function $h(e, t) { return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0; }
var vt = class {
    _console = console;
    handleError(t) { this._console.error("ERROR", t); }
}, It = new T("", { factory: () => { let e = v(q), t = v(_e), n; return o => { e.runOutsideAngular(() => { t.destroyed && !n ? setTimeout(() => { throw o; }) : (n ??= t.get(vt), n.handleError(o)); }); }; } }), Vl = { provide: Fe, useValue: () => { let e = v(vt, { optional: !0 }); }, multi: !0 }, rN = new T("", { factory: () => { if (typeof ngServerMode < "u" && ngServerMode)
        return; let e = v(Ut).defaultView; if (!e)
        return; let t = v(It), n = i => { t(i.reason), i.preventDefault(); }, o = i => { i.error ? t(i.error) : t(new Error(i.message, { cause: i })), i.preventDefault(); }, r = () => { e.addEventListener("unhandledrejection", n), e.addEventListener("error", o); }; typeof Zone < "u" ? Zone.root.run(r) : r(), v(Be).onDestroy(() => { e.removeEventListener("error", o), e.removeEventListener("unhandledrejection", n); }); } });
function iN() { return Ye([Dh(() => { v(rN); })]); }
function sN(e) { return null; }
function $t(e, t) { let [n, o, r] = rh(e, t?.equal), i = n, s = i[se]; return i.set = o, i.update = r, i.asReadonly = Gn.bind(i), i; }
function Gn() { let e = this[se]; if (e.readonlyFn === void 0) {
    let t = () => this();
    t[se] = e, e.readonlyFn = t;
} return e.readonlyFn; }
function aN(e, t) { if (bi() !== null)
    throw new D(-602, !1); }
var Wn = (() => { class e {
    view;
    node;
    constructor(n, o) { this.view = n, this.node = o; }
    static __NG_ELEMENT_ID__ = cN;
} return e; })();
function cN() { return new Wn(g(), _()); }
var xe = class {
}, zn = new T("", { factory: () => !0 }), lN = new T("", { factory: () => !1 }), ls = new T(""), yr = (() => { class e {
    internalPendingTasks = v(Et);
    scheduler = v(xe);
    errorHandler = v(It);
    add() { let n = this.internalPendingTasks.add(); return () => { this.internalPendingTasks.has(n) && (this.scheduler.notify(11), this.internalPendingTasks.remove(n)); }; }
    run(n) { let o = this.add(); n().catch(this.errorHandler).finally(o); }
    static \u0275prov = B({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), us = (() => { class e {
    static \u0275prov = B({ token: e, providedIn: "root", factory: () => new qc });
} return e; })(), qc = class {
    dirtyEffectCount = 0;
    queues = new Map;
    add(t) { this.enqueue(t), this.schedule(t); }
    schedule(t) { t.dirty && this.dirtyEffectCount++; }
    remove(t) { let n = t.zone, o = this.queues.get(n); o.has(t) && (o.delete(t), t.dirty && this.dirtyEffectCount--); }
    enqueue(t) { let n = t.zone; this.queues.has(n) || this.queues.set(n, new Set); let o = this.queues.get(n); o.has(t) || o.add(t); }
    flush() { for (; this.dirtyEffectCount > 0;) {
        let t = !1;
        for (let [n, o] of this.queues)
            n === null ? t ||= this.flushQueue(o) : t ||= n.run(() => this.flushQueue(o));
        t || (this.dirtyEffectCount = 0);
    } }
    flushQueue(t) { let n = !1; for (let o of t)
        o.dirty && (this.dirtyEffectCount--, n = !0, o.run()); return n; }
}, Vi = class {
    [se];
    constructor(t) { this[se] = t; }
    destroy() { this[se].destroy(); }
};
function Hl(e, t) { let n = t?.injector ?? v(ae), o = t?.manualCleanup !== !0 ? n.get(Be) : null, r, i = n.get(Wn, null, { optional: !0 }), s = n.get(xe); return i !== null ? (r = fN(i.view, s, e), o instanceof Fi && o._lView === i.view && (o = null)) : r = pN(e, n.get(us), s), r.injector = n, o !== null && (r.onDestroyFns = [o.onDestroy(() => r.destroy())]), new Vi(r); }
var qh = we(z({}, ih), { cleanupFns: void 0, zone: null, onDestroyFns: null, run() { let e = Qo(!1); try {
        sh(this);
    }
    finally {
        Qo(e);
    } }, cleanup() { if (!this.cleanupFns?.length)
        return; let e = R(null); try {
        for (; this.cleanupFns.length;)
            this.cleanupFns.pop()();
    }
    finally {
        this.cleanupFns = [], R(e);
    } } }), uN = we(z({}, qh), { consumerMarkedDirty() { this.scheduler.schedule(this), this.notifier.notify(12); }, destroy() { if (Ot(this), this.onDestroyFns !== null)
        for (let e of this.onDestroyFns)
            e(); this.cleanup(), this.scheduler.remove(this); } }), dN = we(z({}, qh), { consumerMarkedDirty() { this.view[N] |= 8192, pn(this.view), this.notifier.notify(13); }, destroy() { if (Ot(this), this.onDestroyFns !== null)
        for (let e of this.onDestroyFns)
            e(); this.cleanup(), this.view[Pt]?.delete(this); } });
function fN(e, t, n) { let o = Object.create(dN); return o.view = e, o.zone = typeof Zone < "u" ? Zone.current : null, o.notifier = t, o.fn = Gh(o, n), e[Pt] ??= new Set, e[Pt].add(o), o.consumerMarkedDirty(o), o; }
function pN(e, t, n) { let o = Object.create(uN); return o.fn = Gh(o, e), o.scheduler = t, o.notifier = n, o.zone = typeof Zone < "u" ? Zone.current : null, o.scheduler.add(o), o.notifier.notify(12), o; }
function Gh(e, t) { return () => { t(n => (e.cleanupFns ??= []).push(n)); }; }
import { setActiveConsumer as Yn } from "@angular/core/primitives/signals";
import { Subject as am, Subscription as hN } from "rxjs";
import { map as gN } from "rxjs/operators";
var Qn = { JSACTION: "jsaction" };
function ft(e) { return { toString: e }.toString(); }
var Kn = "__annotations__", Jn = "__parameters__", Xn = "__prop__metadata__";
function Xr(e, t, n, o, r) { return ft(() => { let i = pd(t); function s(...a) { if (this instanceof s)
    return i.call(this, ...a), this; let c = new s(...a); return function (u) { return r && r(u, ...a), (u.hasOwnProperty(Kn) ? u[Kn] : Object.defineProperty(u, Kn, { value: [] })[Kn]).push(c), u; }; } return n && (s.prototype = Object.create(n.prototype)), s.prototype.ngMetadataName = e, s.annotationCls = s, s; }); }
function pd(e) { return function (...n) { if (e) {
    let o = e(...n);
    for (let r in o)
        this[r] = o[r];
} }; }
function Do(e, t, n) { return ft(() => { let o = pd(t); function r(...i) { if (this instanceof r)
    return o.apply(this, i), this; let s = new r(...i); return a.annotation = s, a; function a(c, l, u) { let d = c.hasOwnProperty(Jn) ? c[Jn] : Object.defineProperty(c, Jn, { value: [] })[Jn]; for (; d.length <= u;)
    d.push(null); return (d[u] = d[u] || []).push(s), c; } } return r.prototype.ngMetadataName = e, r.annotationCls = r, r; }); }
function wt(e, t, n, o) { return ft(() => { let r = pd(t); function i(...s) { if (this instanceof i)
    return r.apply(this, s), this; let a = new i(...s); function c(l, u) { if (l === void 0)
    throw new Error("Standard Angular field decorators are not supported in JIT mode."); let d = l.constructor, f = d.hasOwnProperty(Xn) ? d[Xn] : Object.defineProperty(d, Xn, { value: {} })[Xn]; f[u] = f.hasOwnProperty(u) && f[u] || [], f[u].unshift(a); } return c; } return n && (i.prototype = Object.create(n.prototype)), i.prototype.ngMetadataName = e, i.annotationCls = i, i; }); }
var cm = Vn(Do("Inject", e => ({ token: e })), -1), lm = Vn(Do("Optional"), 8), um = Vn(Do("Self"), 2), dm = Vn(Do("SkipSelf"), 4), fm = Vn(Do("Host"), 1);
function re(e) { let t = Se.ng; if (t && t.\u0275compilerFacade)
    return t.\u0275compilerFacade; throw new Error("JIT compiler unavailable"); }
var Wh = { \u0275\u0275defineInjectable: B, \u0275\u0275defineInjector: tr, \u0275\u0275inject: pe, \u0275\u0275invalidFactoryDep: Wi, resolveForwardRef: x }, pm = Function;
function Ir(e) { return typeof e == "function"; }
var mN = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*(arguments|(?:[^()]+\(\[\],)?[^()]+\(arguments\).*)\)/, yN = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{/, vN = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{[\s\S]*constructor\s*\(/, EN = /^class\s+[A-Za-z\d$_]*\s*extends\s+[^{]+{[\s\S]*constructor\s*\(\)\s*{[^}]*super\(\.\.\.arguments\)/;
function IN(e) { return mN.test(e) || EN.test(e) || yN.test(e) && !vN.test(e); }
var ks = class {
    _reflect;
    constructor(t) { this._reflect = t || Se.Reflect; }
    factory(t) { return (...n) => new t(...n); }
    _zipTypesAndAnnotations(t, n) { let o; typeof t > "u" ? o = ar(n.length) : o = ar(t.length); for (let r = 0; r < o.length; r++)
        typeof t > "u" ? o[r] = [] : t[r] && t[r] != Object ? o[r] = [t[r]] : o[r] = [], n && n[r] != null && (o[r] = o[r].concat(n[r])); return o; }
    _ownParameters(t, n) { let o = t.toString(); if (IN(o))
        return null; if (t.parameters && t.parameters !== n.parameters)
        return t.parameters; let r = t.ctorParameters; if (r && r !== n.ctorParameters) {
        let a = typeof r == "function" ? r() : r, c = a.map(u => u && u.type), l = a.map(u => u && Bl(u.decorators));
        return this._zipTypesAndAnnotations(c, l);
    } let i = t.hasOwnProperty(Jn) && t[Jn], s = this._reflect && this._reflect.getOwnMetadata && this._reflect.getOwnMetadata("design:paramtypes", t); return s || i ? this._zipTypesAndAnnotations(s, i) : ar(t.length); }
    parameters(t) { if (!Ir(t))
        return []; let n = ds(t), o = this._ownParameters(t, n); return !o && n !== Object && (o = this.parameters(n)), o || []; }
    _ownAnnotations(t, n) { if (t.annotations && t.annotations !== n.annotations) {
        let o = t.annotations;
        return typeof o == "function" && o.annotations && (o = o.annotations), o;
    } return t.decorators && t.decorators !== n.decorators ? Bl(t.decorators) : t.hasOwnProperty(Kn) ? t[Kn] : null; }
    annotations(t) { if (!Ir(t))
        return []; let n = ds(t), o = this._ownAnnotations(t, n) || []; return (n !== Object ? this.annotations(n) : []).concat(o); }
    _ownPropMetadata(t, n) { if (t.propMetadata && t.propMetadata !== n.propMetadata) {
        let o = t.propMetadata;
        return typeof o == "function" && o.propMetadata && (o = o.propMetadata), o;
    } if (t.propDecorators && t.propDecorators !== n.propDecorators) {
        let o = t.propDecorators, r = {};
        return Object.keys(o).forEach(i => { r[i] = Bl(o[i]); }), r;
    } return t.hasOwnProperty(Xn) ? t[Xn] : null; }
    propMetadata(t) { if (!Ir(t))
        return {}; let n = ds(t), o = {}; if (n !== Object) {
        let i = this.propMetadata(n);
        Object.keys(i).forEach(s => { o[s] = i[s]; });
    } let r = this._ownPropMetadata(t, n); return r && Object.keys(r).forEach(i => { let s = []; o.hasOwnProperty(i) && s.push(...o[i]), s.push(...r[i]), o[i] = s; }), o; }
    ownPropMetadata(t) { return Ir(t) ? this._ownPropMetadata(t, ds(t)) || {} : {}; }
    hasLifecycleHook(t, n) { return t instanceof pm && n in t.prototype; }
};
function Bl(e) { return e ? e.map(t => { let o = t.type.annotationCls, r = t.args ? t.args : []; return new o(...r); }) : []; }
function ds(e) { let t = e.prototype ? Object.getPrototypeOf(e.prototype) : null; return (t ? t.constructor : null) || Object; }
function hm(e, t, n, o) { t !== null ? t.applyValueToInputSignal(t, o) : e[n] = o; }
var Os = class {
    previousValue;
    currentValue;
    firstChange;
    constructor(t, n, o) { this.previousValue = t, this.currentValue = n, this.firstChange = o; }
    isFirstChange() { return this.firstChange; }
}, gm = (() => { let e = () => mm; return e.ngInherit = !0, e; })();
function mm(e) { return e.type.prototype.ngOnChanges && (e.setInput = TN), DN; }
function DN() { let e = vm(this), t = e?.current; if (t) {
    let n = e.previous;
    if (n === Le)
        e.previous = t;
    else
        for (let o in t)
            n[o] = t[o];
    e.current = null, this.ngOnChanges(t);
} }
function TN(e, t, n, o, r) { let i = this.declaredInputs[o], s = vm(e) || CN(e, { previous: Le, current: null }), a = s.current || (s.current = {}), c = s.previous, l = c[i]; a[i] = new Os(l && l.currentValue, n, c === Le), hm(e, t, r, n); }
var ym = "__ngSimpleChanges__";
function vm(e) { return e[ym] || null; }
function CN(e, t) { return e[ym] = t; }
var zh = [];
var V = function (e, t = null, n) { for (let o = 0; o < zh.length; o++) {
    let r = zh[o];
    r(e, t, n);
} }, k = (function (e) { return e[e.TemplateCreateStart = 0] = "TemplateCreateStart", e[e.TemplateCreateEnd = 1] = "TemplateCreateEnd", e[e.TemplateUpdateStart = 2] = "TemplateUpdateStart", e[e.TemplateUpdateEnd = 3] = "TemplateUpdateEnd", e[e.LifecycleHookStart = 4] = "LifecycleHookStart", e[e.LifecycleHookEnd = 5] = "LifecycleHookEnd", e[e.OutputStart = 6] = "OutputStart", e[e.OutputEnd = 7] = "OutputEnd", e[e.BootstrapApplicationStart = 8] = "BootstrapApplicationStart", e[e.BootstrapApplicationEnd = 9] = "BootstrapApplicationEnd", e[e.BootstrapComponentStart = 10] = "BootstrapComponentStart", e[e.BootstrapComponentEnd = 11] = "BootstrapComponentEnd", e[e.ChangeDetectionStart = 12] = "ChangeDetectionStart", e[e.ChangeDetectionEnd = 13] = "ChangeDetectionEnd", e[e.ChangeDetectionSyncStart = 14] = "ChangeDetectionSyncStart", e[e.ChangeDetectionSyncEnd = 15] = "ChangeDetectionSyncEnd", e[e.AfterRenderHooksStart = 16] = "AfterRenderHooksStart", e[e.AfterRenderHooksEnd = 17] = "AfterRenderHooksEnd", e[e.ComponentStart = 18] = "ComponentStart", e[e.ComponentEnd = 19] = "ComponentEnd", e[e.DeferBlockStateStart = 20] = "DeferBlockStateStart", e[e.DeferBlockStateEnd = 21] = "DeferBlockStateEnd", e[e.DynamicComponentStart = 22] = "DynamicComponentStart", e[e.DynamicComponentEnd = 23] = "DynamicComponentEnd", e[e.HostBindingsUpdateStart = 24] = "HostBindingsUpdateStart", e[e.HostBindingsUpdateEnd = 25] = "HostBindingsUpdateEnd", e; })(k || {});
function MN(e, t, n) { let { ngOnChanges: o, ngOnInit: r, ngDoCheck: i } = t.type.prototype; if (o) {
    let s = mm(t);
    (n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s);
} r && (n.preOrderHooks ??= []).push(0 - e, r), i && ((n.preOrderHooks ??= []).push(e, i), (n.preOrderCheckHooks ??= []).push(e, i)); }
function Em(e, t) { for (let n = t.directiveStart, o = t.directiveEnd; n < o; n++) {
    let i = e.data[n].type.prototype, { ngAfterContentInit: s, ngAfterContentChecked: a, ngAfterViewInit: c, ngAfterViewChecked: l, ngOnDestroy: u } = i;
    s && (e.contentHooks ??= []).push(-n, s), a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)), c && (e.viewHooks ??= []).push(-n, c), l && ((e.viewHooks ??= []).push(n, l), (e.viewCheckHooks ??= []).push(n, l)), u != null && (e.destroyHooks ??= []).push(n, u);
} }
function Ts(e, t, n) { Im(e, t, 3, n); }
function Cs(e, t, n, o) { (e[N] & 3) === n && Im(e, t, n, o); }
function Ul(e, t) { let n = e[N]; (n & 3) === t && (n &= 16383, n += 1, e[N] = n); }
function Im(e, t, n, o) { let r = o !== void 0 ? e[ln] & 65535 : 0, i = o ?? -1, s = t.length - 1, a = 0; for (let c = r; c < s; c++)
    if (typeof t[c + 1] == "number") {
        if (a = t[c], o != null && a >= o)
            break;
    }
    else
        t[c] < 0 && (e[ln] += 65536), (a < i || i == -1) && (NN(e, n, t, c), e[ln] = (e[ln] & 4294901760) + c + 2), c++; }
function Qh(e, t) { V(k.LifecycleHookStart, e, t); let n = R(null); try {
    t.call(e);
}
finally {
    R(n), V(k.LifecycleHookEnd, e, t);
} }
function NN(e, t, n, o) { let r = n[o] < 0, i = n[o + 1], s = r ? -n[o] : n[o], a = e[s]; r ? e[N] >> 14 < e[ln] >> 16 && (e[N] & 3) === t && (e[N] += 16384, Qh(a, i)) : Qh(a, i); }
var oo = -1, In = class {
    factory;
    name;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, n, o, r) { this.factory = t, this.name = r, this.canSeeViewProviders = n, this.injectImpl = o; }
};
function aa(e) { return e != null && typeof e == "object" && (e.insertBeforeIndex === null || typeof e.insertBeforeIndex == "number" || Array.isArray(e.insertBeforeIndex)); }
function Dm(e) { return !!(e.type & 128); }
function wN(e) { return (e.flags & 8) !== 0; }
function _N(e) { return (e.flags & 16) !== 0; }
function SN(e, t, n) { let o = 0; for (; o < n.length;) {
    let r = n[o];
    if (typeof r == "number") {
        if (r !== 0)
            break;
        o++;
        let i = n[o++], s = n[o++], a = n[o++];
        e.setAttribute(t, s, a, i);
    }
    else {
        let i = r, s = n[++o];
        bN(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), o++;
    }
} return o; }
function Tm(e) { return e === 3 || e === 4 || e === 6; }
function bN(e) { return e.charCodeAt(0) === 64; }
function lo(e, t) { if (!(t === null || t.length === 0))
    if (e === null || e.length === 0)
        e = t.slice();
    else {
        let n = -1;
        for (let o = 0; o < t.length; o++) {
            let r = t[o];
            typeof r == "number" ? n = r : n === 0 || (n === -1 || n === 2 ? Zh(e, n, r, null, t[++o]) : Zh(e, n, r, null, null));
        }
    } return e; }
function Zh(e, t, n, o, r) { let i = 0, s = e.length; if (t === -1)
    s = -1;
else
    for (; i < e.length;) {
        let a = e[i++];
        if (typeof a == "number") {
            if (a === t) {
                s = -1;
                break;
            }
            else if (a > t) {
                s = i - 1;
                break;
            }
        }
    } for (; i < e.length;) {
    let a = e[i];
    if (typeof a == "number")
        break;
    if (a === n) {
        r !== null && (e[i + 1] = r);
        return;
    }
    i++, r !== null && i++;
} s !== -1 && (e.splice(s, 0, t), i = s + 1), e.splice(i++, 0, n), r !== null && e.splice(i++, 0, r); }
function Cm(e) { return e !== oo; }
function xs(e) { return e & 32767; }
function AN(e) { return e >> 16; }
function Ps(e, t) { let n = AN(e), o = t; for (; n > 0;)
    o = o[cn], n--; return o; }
var du = !0;
function Ls(e) { let t = du; return du = e, t; }
var RN = 256, Mm = RN - 1, Nm = 5, kN = 0, dt = {};
function ON(e, t, n) { let o; typeof n == "string" ? o = n.charCodeAt(0) || 0 : n.hasOwnProperty(sn) && (o = n[sn]), o == null && (o = n[sn] = kN++); let r = o & Mm, i = 1 << r; t.data[e + (r >> Nm)] |= i; }
function Fs(e, t) { let n = wm(e, t); if (n !== -1)
    return n; let o = t[m]; o.firstCreatePass && (e.injectorIndex = t.length, $l(o.data, e), $l(t, null), $l(o.blueprint, null)); let r = hd(e, t), i = e.injectorIndex; if (Cm(r)) {
    let s = xs(r), a = Ps(r, t), c = a[m].data;
    for (let l = 0; l < 8; l++)
        t[i + l] = a[s + l] | c[s + l];
} return t[i + 8] = r, i; }
function $l(e, t) { e.push(0, 0, 0, 0, 0, 0, 0, 0, t); }
function wm(e, t) { return e.injectorIndex === -1 || e.parent && e.parent.injectorIndex === e.injectorIndex || t[e.injectorIndex + 8] === null ? -1 : e.injectorIndex; }
function hd(e, t) { if (e.parent && e.parent.injectorIndex !== -1)
    return e.parent.injectorIndex; let n = 0, o = null, r = t; for (; r !== null;) {
    if (o = km(r), o === null)
        return oo;
    if (n++, r = r[cn], o.injectorIndex !== -1)
        return o.injectorIndex | n << 16;
} return oo; }
function fu(e, t, n) { ON(e, t, n); }
function xN(e, t) { if (t === "class")
    return e.classes; if (t === "style")
    return e.styles; let n = e.attrs; if (n) {
    let o = n.length, r = 0;
    for (; r < o;) {
        let i = n[r];
        if (Tm(i))
            break;
        if (i === 0)
            r = r + 2;
        else if (typeof i == "number")
            for (r++; r < o && typeof n[r] == "string";)
                r++;
        else {
            if (i === t)
                return n[r + 1];
            r = r + 2;
        }
    }
} return null; }
function _m(e, t, n) { if (n & 8 || e !== void 0)
    return e; Gi(t, "NodeInjector"); }
function Sm(e, t, n, o) { if (n & 8 && o === void 0 && (o = null), (n & 3) === 0) {
    let r = e[P], i = Ie(void 0);
    try {
        return r ? r.get(t, o, n & 8) : Qc(t, o, n & 8);
    }
    finally {
        Ie(i);
    }
} return _m(o, t, n); }
function bm(e, t, n, o = 0, r) { if (e !== null) {
    if (t[N] & 2048 && !(o & 2)) {
        let s = jN(e, t, n, o, dt);
        if (s !== dt)
            return s;
    }
    let i = Am(e, t, n, o, dt);
    if (i !== dt)
        return i;
} return Sm(t, n, o, r); }
function Am(e, t, n, o, r) { let i = LN(n); if (typeof i == "function") {
    if (!_l(t, e, o))
        return o & 1 ? _m(r, n, o) : Sm(t, n, o, r);
    try {
        let s;
        if (s = i(o), s == null && !(o & 8))
            Gi(n);
        else
            return s;
    }
    finally {
        Sl();
    }
}
else if (typeof i == "number") {
    let s = null, a = wm(e, t), c = oo, l = o & 1 ? t[ee][ce] : null;
    for ((a === -1 || o & 4) && (c = a === -1 ? hd(e, t) : t[a + 8], c === oo || !Kh(o, !1) ? a = -1 : (s = t[m], a = xs(c), t = Ps(c, t))); a !== -1;) {
        let u = t[m];
        if (Yh(i, a, u.data)) {
            let d = PN(a, t, n, s, o, l);
            if (d !== dt)
                return d;
        }
        c = t[a + 8], c !== oo && Kh(o, t[m].data[a + 8] === l) && Yh(i, a, t) ? (s = u, a = xs(c), t = Ps(c, t)) : a = -1;
    }
} return r; }
function PN(e, t, n, o, r, i) { let s = t[m], a = s.data[e + 8], c = o == null ? De(a) && du : o != s && (a.type & 3) !== 0, l = r & 1 && i === a, u = Ms(a, s, n, c, l); return u !== null ? Or(t, s, u, a, r) : dt; }
function Ms(e, t, n, o, r) { let i = e.providerIndexes, s = t.data, a = i & 1048575, c = e.directiveStart, l = e.directiveEnd, u = i >> 20, d = o ? a : a + u, f = r ? a + u : l; for (let p = d; p < f; p++) {
    let h = s[p];
    if (p < c && n === h || p >= c && h.type === n)
        return p;
} if (r) {
    let p = s[c];
    if (p && He(p) && p.type === n)
        return c;
} return null; }
function Or(e, t, n, o, r) { let i = e[n], s = t.data; if (i instanceof In) {
    let a = i;
    if (a.resolving)
        throw zc("");
    let c = Ls(a.canSeeViewProviders);
    a.resolving = !0;
    let l = s[n].type || s[n], u, d = a.injectImpl ? Ie(a.injectImpl) : null, f = _l(e, o, 0);
    try {
        i = e[n] = a.factory(void 0, r, s, e, o), t.firstCreatePass && n >= o.directiveStart && MN(n, s[n], t);
    }
    finally {
        d !== null && Ie(d), Ls(c), a.resolving = !1, Sl();
    }
} return i; }
function LN(e) { if (typeof e == "string")
    return e.charCodeAt(0) || 0; let t = e.hasOwnProperty(sn) ? e[sn] : void 0; return typeof t == "number" ? t >= 0 ? t & Mm : FN : t; }
function Yh(e, t, n) { let o = 1 << e; return !!(n[t + (e >> Nm)] & o); }
function Kh(e, t) { return !(e & 2) && !(e & 1 && t); }
var Wt = class {
    _tNode;
    _lView;
    constructor(t, n) { this._tNode = t, this._lView = n; }
    get(t, n, o) { return bm(this._tNode, this._lView, t, tn(o), n); }
};
function FN() { return new Wt(_(), g()); }
function Rm(e) { return ft(() => { let t = e.prototype.constructor, n = t[ot] || pu(t), o = Object.prototype, r = Object.getPrototypeOf(e.prototype).constructor; for (; r && r !== o;) {
    let i = r[ot] || pu(r);
    if (i && i !== n)
        return i;
    r = Object.getPrototypeOf(r);
} return i => new i; }); }
function pu(e) { return er(e) ? () => { let t = pu(x(e)); return t && t(); } : xt(e); }
function jN(e, t, n, o, r) { let i = e, s = t; for (; i !== null && s !== null && s[N] & 2048 && !st(s);) {
    let a = Am(i, s, n, o | 2, dt);
    if (a !== dt)
        return a;
    let c = i.parent;
    if (!c) {
        let l = s[ol];
        if (l) {
            let u = l.get(n, dt, o & -5);
            if (u !== dt)
                return u;
        }
        c = km(s), s = s[cn];
    }
    i = c;
} return r; }
function km(e) { let t = e[m], n = t.type; return n === 2 ? t.declTNode : n === 1 ? e[ce] : null; }
function ca(e) { return xN(_(), e); }
var Om = Do("Attribute", e => ({ attributeName: e, __NG_ELEMENT_ID__: () => ca(e) })), Jh = null;
function gd() { return Jh = Jh || new ks; }
function la(e) { return xm(gd().parameters(e)); }
function xm(e) { return e.map(t => VN(t)); }
function VN(e) { let t = { token: null, attribute: null, host: !1, optional: !1, self: !1, skipSelf: !1 }; if (Array.isArray(e) && e.length > 0)
    for (let n = 0; n < e.length; n++) {
        let o = e[n];
        if (o === void 0)
            continue;
        let r = Object.getPrototypeOf(o);
        if (o instanceof lm || r.ngMetadataName === "Optional")
            t.optional = !0;
        else if (o instanceof dm || r.ngMetadataName === "SkipSelf")
            t.skipSelf = !0;
        else if (o instanceof um || r.ngMetadataName === "Self")
            t.self = !0;
        else if (o instanceof fm || r.ngMetadataName === "Host")
            t.host = !0;
        else if (o instanceof cm)
            t.token = o.token;
        else if (o instanceof Om) {
            if (o.attributeName === void 0)
                throw new D(-204, !1);
            t.attribute = o.attributeName;
        }
        else
            t.token = o;
    }
else
    e === void 0 || Array.isArray(e) && e.length === 0 ? t.token = null : t.token = e; return t; }
function HN(e, t) { let n = null, o = null; e.hasOwnProperty(jn) || Object.defineProperty(e, jn, { get: () => (n === null && (n = re({ usage: 0, kind: "injectable", type: e }).compileInjectable(Wh, `ng:///${e.name}/\u0275prov.js`, qN(e, t))), n) }), e.hasOwnProperty(ot) || Object.defineProperty(e, ot, { get: () => { if (o === null) {
        let r = re({ usage: 0, kind: "injectable", type: e });
        o = r.compileFactory(Wh, `ng:///${e.name}/\u0275fac.js`, { name: e.name, type: e, typeArgumentCount: 0, deps: la(e), target: r.FactoryTarget.Injectable });
    } return o; }, configurable: !0 }); }
var BN = j({ provide: String, useValue: j });
function Xh(e) { return e.useClass !== void 0; }
function UN(e) { return BN in e; }
function eg(e) { return e.useFactory !== void 0; }
function $N(e) { return e.useExisting !== void 0; }
function qN(e, t) { let n = t || { providedIn: null }, o = { name: e.name, type: e, typeArgumentCount: 0, providedIn: n.providedIn }; return (Xh(n) || eg(n)) && n.deps !== void 0 && (o.deps = xm(n.deps)), Xh(n) ? o.useClass = n.useClass : UN(n) ? o.useValue = n.useValue : eg(n) ? o.useFactory = n.useFactory : $N(n) && (o.useExisting = n.useExisting), o; }
var GN = Xr("Injectable", void 0, void 0, void 0, (e, t) => HN(e, t));
function WN() { return To(_(), g()); }
function To(e, t) { return new ei(ue(e, t)); }
var ei = (() => { class e {
    nativeElement;
    constructor(n) { this.nativeElement = n; }
    static __NG_ELEMENT_ID__ = WN;
} return e; })();
function Pm(e) { return e instanceof ei ? e.nativeElement : e; }
function zN() { return this._results[Symbol.iterator](); }
var js = class {
    _emitDistinctChangesOnly;
    dirty = !0;
    _onDirty = void 0;
    _results = [];
    _changesDetected = !1;
    _changes = void 0;
    length = 0;
    first = void 0;
    last = void 0;
    get changes() { return this._changes ??= new am; }
    constructor(t = !1) { this._emitDistinctChangesOnly = t; }
    get(t) { return this._results[t]; }
    map(t) { return this._results.map(t); }
    filter(t) { return this._results.filter(t); }
    find(t) { return this._results.find(t); }
    reduce(t, n) { return this._results.reduce(t, n); }
    forEach(t) { this._results.forEach(t); }
    some(t) { return this._results.some(t); }
    toArray() { return this._results.slice(); }
    toString() { return this._results.toString(); }
    reset(t, n) { this.dirty = !1; let o = Ze(t); (this._changesDetected = !Ih(this._results, o, n)) && (this._results = o, this.length = o.length, this.last = o[this.length - 1], this.first = o[0]); }
    notifyOnChanges() { this._changes !== void 0 && (this._changesDetected || !this._emitDistinctChangesOnly) && this._changes.next(this); }
    onDirty(t) { this._onDirty = t; }
    setDirty() { this.dirty = !0, this._onDirty?.(); }
    destroy() { this._changes !== void 0 && (this._changes.complete(), this._changes.unsubscribe()); }
    [Symbol.iterator] = zN;
}, Co = "ngSkipHydration", QN = "ngskiphydration";
function md(e) { let t = e.mergedAttrs; if (t === null)
    return !1; for (let n = 0; n < t.length; n += 2) {
    let o = t[n];
    if (typeof o == "number")
        return !1;
    if (typeof o == "string" && o.toLowerCase() === QN)
        return !0;
} return !1; }
function Lm(e) { return e.hasAttribute(Co); }
function xr(e) { return (e.flags & 128) === 128; }
function Mo(e) { if (xr(e))
    return !0; let t = e.parent; for (; t;) {
    if (xr(e) || md(t))
        return !0;
    t = t.parent;
} return !1; }
function Fm(e) { return xr(e) || md(e) || Mo(e); }
var ua = (function (e) { return e[e.OnPush = 0] = "OnPush", e[e.Eager = 1] = "Eager", e[e.Default = 1] = "Default", e; })(ua || {}), da = new Map, ZN = 0;
function YN() { return ZN++; }
function KN(e) { da.set(e[Ve], e); }
function jm(e) { return da.get(e) || null; }
function hu(e) { da.delete(e[Ve]); }
function JN() { return da; }
var Vs = class {
    lViewId;
    nodeIndex;
    native;
    component;
    directives;
    localRefs;
    get lView() { return jm(this.lViewId); }
    constructor(t, n, o) { this.lViewId = t, this.nodeIndex = n, this.native = o; }
};
function Me(e) { let t = Ns(e); if (t) {
    if (ne(t)) {
        let n = t, o, r, i;
        if (Vm(e)) {
            if (o = nw(n, e), o == -1)
                throw new Error("The provided component was not found in the application");
            r = e;
        }
        else if (ew(e)) {
            if (o = ow(n, e), o == -1)
                throw new Error("The provided directive was not found in the application");
            i = Hm(o, n);
        }
        else if (o = ng(n, e), o == -1)
            return null;
        let s = L(n[o]), a = Ns(s), c = a && !Array.isArray(a) ? a : tg(n, o, s);
        if (r && c.component === void 0 && (c.component = r, Ue(c.component, c)), i && c.directives === void 0) {
            c.directives = i;
            for (let l = 0; l < i.length; l++)
                Ue(i[l], c);
        }
        Ue(c.native, c), t = c;
    }
}
else {
    let n = e, o = n;
    for (; o = o.parentNode;) {
        let r = Ns(o);
        if (r) {
            let i = Array.isArray(r) ? r : r.lView;
            if (!i)
                return null;
            let s = ng(i, n);
            if (s >= 0) {
                let a = L(i[s]), c = tg(i, s, a);
                Ue(a, c), t = c;
                break;
            }
        }
    }
} return t || null; }
function tg(e, t, n) { return new Vs(e[Ve], t, n); }
var gu = "__ngContext__";
function Ue(e, t) { ne(t) ? (e[gu] = t[Ve], KN(t)) : e[gu] = t; }
function Ns(e) { let t = e[gu]; return typeof t == "number" ? jm(t) : t || null; }
function XN(e) { let t = Ns(e); return t ? ne(t) ? t : t.lView : null; }
function Vm(e) { return e && e.constructor && e.constructor.\u0275cmp; }
function ew(e) { return e && e.constructor && e.constructor.\u0275dir; }
function ng(e, t) { let n = e[m]; for (let o = E; o < n.bindingStartIndex; o++)
    if (L(e[o]) === t)
        return o; return -1; }
function tw(e) { if (e.child)
    return e.child; if (e.next)
    return e.next; for (; e.parent && !e.parent.next;)
    e = e.parent; return e.parent && e.parent.next; }
function nw(e, t) { let n = e[m].components; if (n)
    for (let o = 0; o < n.length; o++) {
        let r = n[o];
        if (ye(r, e)[U] === t)
            return r;
    }
else if (ye(E, e)[U] === t)
    return E; return -1; }
function ow(e, t) { let n = e[m].firstChild; for (; n;) {
    let o = n.directiveStart, r = n.directiveEnd;
    for (let i = o; i < r; i++)
        if (e[i] === t)
            return n.index;
    n = tw(n);
} return -1; }
function Hm(e, t) { let n = t[m].data[e]; if (n.directiveStart === 0)
    return F; let o = []; for (let r = n.directiveStart; r < n.directiveEnd; r++) {
    let i = t[r];
    Vm(i) || o.push(i);
} return o; }
function rw(e, t) { let n = t[m].data[e]; return De(n) ? t[n.directiveStart + n.componentOffset] : null; }
function iw(e, t) { let n = e[m].data[t]; if (n && n.localNames) {
    let o = {}, r = n.index + 1;
    for (let i = 0; i < n.localNames.length; i += 2)
        o[n.localNames[i]] = e[r], r++;
    return o;
} return null; }
function Bm(e) { return $m(e[Ft]); }
function Um(e) { return $m(e[he]); }
function $m(e) { for (; e !== null && !K(e);)
    e = e[he]; return e; }
function og(e) { let t = Me(e); if (t === null)
    return null; if (t.component === void 0) {
    let n = t.lView;
    if (n === null)
        return null;
    t.component = rw(t.nodeIndex, n);
} return t.component; }
function sw(e) { mw(e); let t = Me(e), n = t ? t.lView : null; return n === null ? null : n[U]; }
function aw(e) { let t = Me(e), n = t ? t.lView : null; if (n === null)
    return null; let o; for (; n[m].type === 2 && (o = yt(n));)
    n = o; return st(n) ? null : n[U]; }
function cw(e) { let t = Me(e), n = t ? t.lView : null; if (n === null)
    return ae.NULL; let o = n[m].data[t.nodeIndex]; return new Wt(o, n); }
function lw(e) { let t = Me(e), n = t ? t.lView : null; if (n === null)
    return []; let o = n[m], r = o.data[t.nodeIndex], i = [], s = r.providerIndexes & 1048575, a = r.directiveEnd; for (let c = s; c < a; c++) {
    let l = o.data[c];
    gw(l) && (l = l.type), i.push(l);
} return i; }
function uw(e) { if (e instanceof Text)
    return []; let t = Me(e), n = t ? t.lView : null; if (n === null)
    return []; let o = n[m], r = t.nodeIndex; return o?.data[r] ? (t.directives === void 0 && (t.directives = Hm(r, n)), t.directives === null ? [] : [...t.directives]) : []; }
var qm = (function (e) { return e[e.Default = 0] = "Default", e[e.OnPush = 1] = "OnPush", e; })(qm || {}), Gm = (function (e) { return e[e.Emulated = 0] = "Emulated", e[e.None = 1] = "None", e; })(Gm || {});
function dw(e) { let t = Me(e); if (t === null)
    return {}; if (t.localRefs === void 0) {
    let n = t.lView;
    if (n === null)
        return {};
    t.localRefs = iw(n, t.nodeIndex);
} return t.localRefs || {}; }
function fw(e) { return Me(e).native; }
function pw(e) { let t = Me(e), n = t === null ? null : t.lView; if (n === null)
    return []; let o = n[m], r = n[Lt], i = o.cleanup, s = []; if (i && r)
    for (let a = 0; a < i.length;) {
        let c = i[a++], l = i[a++];
        if (typeof c == "string") {
            let u = c, d = L(n[l]), f = r[i[a++]], p = i[a++], h = typeof p == "boolean" || p >= 0 ? "dom" : "output", y = typeof p == "boolean" ? p : !1;
            e == d && s.push({ element: e, name: u, callback: f, useCapture: y, type: h });
        }
    } return s.sort(hw), s; }
function hw(e, t) { return e.name == t.name ? 0 : e.name < t.name ? -1 : 1; }
function gw(e) { return e.type !== void 0 && e.declaredInputs !== void 0 && e.resolveHostDirectives !== void 0; }
function mw(e) { if (typeof Element < "u" && !(e instanceof Element))
    throw new Error("Expecting instance of DOM Element"); }
var mu;
function yw(e) { mu = e; }
function fa() { if (mu !== void 0)
    return mu; if (typeof document < "u")
    return document; throw new D(210, !1); }
var _t = new T("", { factory: () => vw }), vw = "ng";
var yd = new T(""), Ew = new T("", { providedIn: "platform", factory: () => "unknown" }), Iw = new T(""), Dw = new T("", { factory: () => v(Ut).body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null }), Wm = { breakpoints: [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840], placeholderResolution: 30, disableImageSizeWarning: !1, disableImageLazyLoadWarning: !1 }, Tw = new T("", { factory: () => Wm });
function Cw(e) { return e; }
var No = (() => { class e {
    static \u0275prov = B({ token: e, providedIn: "root", factory: () => { let n = new e; return (typeof ngServerMode > "u" || !ngServerMode) && (n.store = zm(v(Ut), v(_t))), n; } });
    store = {};
    onSerializeCallbacks = {};
    get(n, o) { return this.store[n] !== void 0 ? this.store[n] : o; }
    set(n, o) { this.store[n] = o; }
    remove(n) { delete this.store[n]; }
    hasKey(n) { return this.store.hasOwnProperty(n); }
    get isEmpty() { return Object.keys(this.store).length === 0; }
    onSerialize(n, o) { this.onSerializeCallbacks[n] = o; }
    toJson() { for (let n in this.onSerializeCallbacks)
        if (this.onSerializeCallbacks.hasOwnProperty(n))
            try {
                this.store[n] = this.onSerializeCallbacks[n]();
            }
            catch (o) {
                console.warn("Exception in onSerialize callback: ", o);
            } return JSON.stringify(this.store).replace(/</g, "\\u003C"); }
} return e; })();
function zm(e, t) { let n = e.getElementById(t + "-state"); if (n?.textContent)
    try {
        return JSON.parse(n.textContent);
    }
    catch (o) {
        console.warn("Exception while restoring TransferState for app " + t, o);
    } return {}; }
var vd = "h", Ed = "b", Qm = "f", Zm = "n", ti = "e", pa = "t", wo = "c", ni = "x", Mt = "r", ha = "i", oi = "n", _o = "d", ga = "l", ma = "di", ri = "s", Id = "p", ii = "t", An = new T(""), Ym = !1, Dd = new T("", { factory: () => Ym }), Td = new T(""), ya = new T(""), Cd = !1, Km = new T("", { factory: () => [] }), Md = new T(""), si = new T("", { factory: () => new Map }), Mw = new T(""), Hs = { passive: !0, capture: !0 }, ql = new WeakMap, Gl = new WeakMap, Gt = new WeakMap, Bs = ["click", "keydown"], Us = ["mouseenter", "mouseover", "focusin"], fs = new Map, Pr = class {
    callbacks = new Set;
    listener = () => { for (let t of this.callbacks)
        t(); };
};
function Jm(e, t) { let n = Gl.get(e); if (!n) {
    n = new Pr, Gl.set(e, n);
    for (let o of Bs)
        e.addEventListener(o, n.listener, Hs);
} return n.callbacks.add(t), () => { let { callbacks: o, listener: r } = n; if (o.delete(t), o.size === 0) {
    Gl.delete(e);
    for (let i of Bs)
        e.removeEventListener(i, r, Hs);
} }; }
function Xm(e, t) { let n = ql.get(e); if (!n) {
    n = new Pr, ql.set(e, n);
    for (let o of Us)
        e.addEventListener(o, n.listener, Hs);
} return n.callbacks.add(t), () => { let { callbacks: o, listener: r } = n; if (o.delete(t), o.size === 0) {
    for (let i of Us)
        e.removeEventListener(i, r, Hs);
    ql.delete(e);
} }; }
function Nw(e) { let t = ey(e); return new IntersectionObserver(n => { for (let o of n)
    o.isIntersecting && Gt.has(o.target) && Gt.get(o.target)?.get(t)?.listener(); }, e); }
function ww(e, t, n, o) { let r = ey(o), i = Gt.get(e)?.get(r); fs.has(r) || fs.set(r, { observer: n(o), count: 0 }); let s = fs.get(r); if (!i) {
    i = new Pr, s.observer.observe(e);
    let a = Gt.get(e);
    a ? a.set(r, i) : (a = new Map, Gt.set(e, a)), a.set(r, i), s.count++;
} return i.callbacks.add(t), () => { if (Gt.get(e)?.has(r)) {
    if (i.callbacks.delete(t), i.callbacks.size === 0) {
        s.observer.unobserve(e), s.count--;
        let a = Gt.get(e);
        a && (a.delete(r), a.size === 0 && Gt.delete(e));
    }
    s.count === 0 && (s.observer.disconnect(), fs.delete(r));
} }; }
function ey(e) {
    return e ? `${e.rootMargin}/${typeof e.threshold == "number" ? e.threshold : e.threshold?.join(`
`)}` : "";
}
var So = "ngb";
function Nd(e, t, n = null) { if (t.length === 0 || e.nodeType !== Node.ELEMENT_NODE)
    return; let o = e.getAttribute(Qn.JSACTION), r = t.reduce((s, a) => (o?.indexOf(a) ?? -1) === -1 ? s + a + ":;" : s, ""); e.setAttribute(Qn.JSACTION, `${o ?? ""}${r}`); let i = n ?? ""; i !== "" && r.length > 0 && e.setAttribute(So, i); }
var ty = (e, t, n) => { let o = e, r = o.__jsaction_fns ?? new Map, i = r.get(t) ?? []; i.push(n), r.set(t, i), o.__jsaction_fns = r; }, wd = (e, t) => { let n = e, o = n.getAttribute(So) ?? "", r = t.get(o) ?? new Set; r.has(n) || r.add(n), t.set(o, r); };
function _w(e, t) { if (e.length > 0) {
    let n = [];
    for (let r of e)
        t.has(r) && (n = [...n, ...t.get(r)]);
    new Set(n).forEach(_d);
} }
var _d = e => { e.removeAttribute(Qn.JSACTION), e.removeAttribute(So), e.__jsaction_fns = void 0; }, Sd = new T("", { factory: () => ({}) });
function bd(e, t) { let n = t?.__jsaction_fns?.get(e.type); if (!(!n || !t?.isConnected))
    for (let o of n)
        o(e); }
var yu = new Map;
function ny(e, t) { return yu.set(e, t), () => yu.delete(e); }
var rg = !1, oy = (e, t, n, o) => { };
function Sw(e, t, n, o) { oy(e, t, n, o); }
function ry() { rg || (oy = (e, t, n, o) => { let r = e[P].get(_t); yu.get(r)?.(t, n, o); }, rg = !0); }
var St = new T(""), iy = (() => { class e {
    registry = new Map;
    cleanupFns = new Map;
    jsActionMap = v(si);
    contract = v(Sd);
    add(n, o) { if (this.registry.set(n, o), this.awaitingCallbacks.has(n)) {
        let r = this.awaitingCallbacks.get(n);
        for (let i of r)
            i();
    } }
    get(n) { return this.registry.get(n) ?? null; }
    has(n) { return this.registry.has(n); }
    cleanup(n) { _w(n, this.jsActionMap); for (let o of n)
        this.registry.delete(o), this.jsActionMap.delete(o), this.invokeTriggerCleanupFns(o), this.hydrating.delete(o), this.awaitingCallbacks.delete(o); this.size === 0 && this.contract.instance?.cleanUp(); }
    get size() { return this.registry.size; }
    addCleanupFn(n, o) { let r = []; this.cleanupFns.has(n) && (r = this.cleanupFns.get(n)), r.push(o), this.cleanupFns.set(n, r); }
    invokeTriggerCleanupFns(n) { let o = this.cleanupFns.get(n) ?? []; for (let r of o)
        r(); this.cleanupFns.delete(n); }
    hydrating = new Map;
    awaitingCallbacks = new Map;
    awaitParentBlock(n, o) { let r = this.awaitingCallbacks.get(n) ?? []; r.push(o), this.awaitingCallbacks.set(n, r); }
    static \u0275prov = B({ token: e, providedIn: null, factory: () => new e });
} return e; })();
function bo(e) { return (e.flags & 32) === 32; }
var sy = "__nghData__", va = sy, ay = "__nghDeferData__", Ea = ay;
function bw(e) { return e === sy || e === ay; }
var ro = "ngh", cy = "nghm", ly = () => null;
function Aw(e, t, n = !1) { let o = e.getAttribute(ro); if (o == null)
    return null; let [r, i] = o.split("|"); if (o = n ? i : r, !o)
    return null; let s = i ? `|${i}` : "", a = n ? r : s, c = {}; if (o !== "") {
    let u = t.get(No, null, { optional: !0 });
    u !== null && (c = u.get(va, [])[Number(o)]);
} let l = { data: c, firstChild: e.firstChild ?? null }; return n && (l.firstChild = e, Ia(l, 0, e.nextSibling)), a ? e.setAttribute(ro, a) : e.removeAttribute(ro), l; }
function uy() { ly = Aw; }
function dy(e, t, n = !1) { return ly(e, t, n); }
function Ad(e) { let t = e._lView; return t[m].type === 2 ? null : (st(t) && (t = t[E]), t); }
function Rw(e) { return e.textContent?.replace(/\s/gm, ""); }
function kw(e) { let t = fa(), n = t.createNodeIterator(e, NodeFilter.SHOW_COMMENT, { acceptNode(i) { let s = Rw(i); return s === "ngetn" || s === "ngtns" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } }), o, r = []; for (; o = n.nextNode();)
    r.push(o); for (let i of r)
    i.textContent === "ngetn" ? i.replaceWith(t.createTextNode("")) : i.remove(); }
var fy = (function (e) { return e.Hydrated = "hydrated", e.Skipped = "skipped", e.Mismatched = "mismatched", e; })(fy || {}), Ow = "__ngDebugHydrationInfo__";
function xw(e) { return e[Ow] ?? null; }
function Ia(e, t, n) { e.segmentHeads ??= {}, e.segmentHeads[t] = n; }
function vu(e, t) { return e.segmentHeads?.[t] ?? null; }
function ai(e) { return e.get(Md, !1, { optional: !0 }); }
var Pw = !1;
function Lw() { Pw = !1; }
function py(e, t) { let n = e.data, o = n[ti]?.[t] ?? null; return o === null && n[wo]?.[t] && (o = Rd(e, t)), o; }
function Fw(e, t) { return e.data[ti]?.[t] !== void 0; }
function hy(e, t) { return e.data[wo]?.[t] ?? null; }
function Rd(e, t) { let n = hy(e, t) ?? [], o = 0; for (let r of n)
    o += r[Mt] * (r[ni] ?? 1); return o; }
function gy(e) { if (typeof e.disconnectedNodes > "u") {
    let t = e.data[_o];
    e.disconnectedNodes = t ? new Set(t) : null;
} return e.disconnectedNodes; }
function Da(e, t) { if (typeof e.disconnectedNodes > "u") {
    let n = e.data[_o];
    e.disconnectedNodes = n ? new Set(n) : null;
} return !!gy(e)?.has(t); }
function Ta(e, t) { let n = e[le]; return n !== null && !hr() && !bo(t) && !Da(n, t.index - E); }
function kd(e, t) { let n = t, o = e.corruptedTextNodes; n.textContent === "" ? o.set(n, "ngetn") : n.nextSibling?.nodeType === Node.TEXT_NODE && o.set(n, "ngtns"); }
function my(e) { let t = []; return e !== null && (e.has(4) && t.push(...Us), e.has(3) && t.push(...Bs)), t; }
function jw(e, t) { let n = t.get(St), r = t.get(No).get(Ea, {}), i = !1, s = e, a = null, c = []; for (; !i && s;) {
    i = n.has(s);
    let l = n.hydrating.get(s);
    if (a === null && l != null) {
        a = l.promise;
        break;
    }
    c.unshift(s), s = r[s][Id];
} return { parentBlockPromise: a, hydrationQueue: c }; }
function Vw(e) { let t = e.body.querySelectorAll("[jsaction]"), n = new Set, o = [Us.join(":;"), Bs.join(":;")].join("|"); for (let r of t) {
    let i = r.getAttribute("jsaction"), s = r.getAttribute("ngb");
    i?.match(o) && s !== null && n.add(r);
} return n; }
function yy(e, t) { let n = Vw(e), o = t.get(si); for (let r of n)
    wd(r, o); }
var vy = () => ({});
function Hw(e) { let t = e.get(No, null, { optional: !0 }); return t !== null ? t.get(Ea, {}) : {}; }
function Ey() { vy = Hw; }
function Bw(e) { return vy(e); }
function Uw(e) { return typeof e == "object" && e.trigger === 5; }
function $w(e) { return e[ii]?.find(n => Uw(n))?.delay ?? null; }
function qw(e) { let t = e[ii]; if (t)
    for (let n of t) {
        if (n === 2)
            return !0;
        if (typeof n == "object" && n.trigger === 2)
            return n.intersectionObserverOptions || !0;
    } return null; }
function ig(e, t) { return e[ii]?.includes(t) ?? !1; }
function Gw(e) { return { data: e, hydrate: { idle: ig(e, 0), immediate: ig(e, 1), timer: $w(e), viewport: qw(e) } }; }
function Iy(e) { let t = Bw(e), n = new Map; for (let o in t)
    n.set(o, Gw(t[o])); return n; }
function Wl(e) { return !!e && e.nodeType === Node.COMMENT_NODE && e.textContent?.trim() === cy; }
function sg(e) { for (; e && e.nodeType === Node.TEXT_NODE;)
    e = e.previousSibling; return e; }
function Dy(e) { for (let o of e.body.childNodes)
    if (Wl(o))
        return; let t = sg(e.body.previousSibling); if (Wl(t))
    return; let n = sg(e.head.lastChild); if (!Wl(n))
    throw new D(-507, !1); }
function Ty(e, t) { let n = e.contentQueries; if (n !== null) {
    let o = R(null);
    try {
        for (let r = 0; r < n.length; r += 2) {
            let i = n[r], s = n[r + 1];
            if (s !== -1) {
                let a = e.data[s];
                gr(i), a.contentQueries(2, t[s], s);
            }
        }
    }
    finally {
        R(o);
    }
} }
function Eu(e, t, n) { gr(0); let o = R(null); try {
    t(e, n);
}
finally {
    R(o);
} }
function Od(e, t, n) { if (il(t)) {
    let o = R(null);
    try {
        let r = t.directiveStart, i = t.directiveEnd;
        for (let s = r; s < i; s++) {
            let a = e.data[s];
            if (a.contentQueries) {
                let c = n[s];
                a.contentQueries(1, c, s);
            }
        }
    }
    finally {
        R(o);
    }
} }
var $e = (function (e) { return e[e.Emulated = 0] = "Emulated", e[e.None = 2] = "None", e[e.ShadowDom = 3] = "ShadowDom", e[e.ExperimentalIsolatedShadowDom = 4] = "ExperimentalIsolatedShadowDom", e; })($e || {}), Ww = { name: "custom-elements" }, zw = { name: "no-errors-schema" }, Cy = !1;
function Qw(e) { Cy = e; }
function Zw() { return Cy; }
var My = !1;
function Yw(e) { My = e; }
function Kw() { return My; }
var ps;
function Ny() { if (ps === void 0 && (ps = null, Se.trustedTypes))
    try {
        ps = Se.trustedTypes.createPolicy("angular", { createHTML: e => e, createScript: e => e, createScriptURL: e => e });
    }
    catch { } return ps; }
function Ao(e) { return Ny()?.createHTML(e) || e; }
function Jw(e) { return Ny()?.createScriptURL(e) || e; }
var hs;
function xd() { if (hs === void 0 && (hs = null, Se.trustedTypes))
    try {
        hs = Se.trustedTypes.createPolicy("angular#unsafe-bypass", { createHTML: e => e, createScript: e => e, createScriptURL: e => e });
    }
    catch { } return hs; }
function ag(e) { return xd()?.createHTML(e) || e; }
function cg(e) { return xd()?.createScript(e) || e; }
function lg(e) { return xd()?.createScriptURL(e) || e; }
var Nt = class {
    changingThisBreaksApplicationSecurity;
    constructor(t) { this.changingThisBreaksApplicationSecurity = t; }
    toString() { return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Hi})`; }
}, Iu = class extends Nt {
    getTypeName() { return "HTML"; }
}, Du = class extends Nt {
    getTypeName() { return "Style"; }
}, Tu = class extends Nt {
    getTypeName() { return "Script"; }
}, Cu = class extends Nt {
    getTypeName() { return "URL"; }
}, Mu = class extends Nt {
    getTypeName() { return "ResourceURL"; }
};
function bt(e) { return e instanceof Nt ? e.changingThisBreaksApplicationSecurity : e; }
function Ro(e, t) { let n = wy(e); if (n != null && n !== t) {
    if (n === "ResourceURL" && t === "URL")
        return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${Hi})`);
} return n === t; }
function wy(e) { return e instanceof Nt && e.getTypeName() || null; }
function Xw(e) { return new Iu(e); }
function e_(e) { return new Du(e); }
function t_(e) { return new Tu(e); }
function n_(e) { return new Cu(e); }
function o_(e) { return new Mu(e); }
function _y(e) { let t = new wu(e); return r_() ? new Nu(t) : t; }
var Nu = class {
    inertDocumentHelper;
    constructor(t) { this.inertDocumentHelper = t; }
    getInertBodyElement(t) { t = "<body><remove></remove>" + t; try {
        let n = new window.DOMParser().parseFromString(Ao(t), "text/html").body;
        return n === null ? this.inertDocumentHelper.getInertBodyElement(t) : (n.firstChild?.remove(), n);
    }
    catch {
        return null;
    } }
}, wu = class {
    defaultDoc;
    inertDocument;
    constructor(t) { this.defaultDoc = t, this.inertDocument = this.defaultDoc.implementation.createHTMLDocument("sanitization-inert"); }
    getInertBodyElement(t) { let n = this.inertDocument.createElement("template"); return n.innerHTML = Ao(t), n; }
};
function r_() { try {
    return !!new window.DOMParser().parseFromString(Ao(""), "text/html");
}
catch {
    return !1;
} }
var i_ = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function ci(e) { return e = String(e), e.match(i_) ? e : "unsafe:" + e; }
function pt(e) { let t = {}; for (let n of e.split(","))
    t[n] = !0; return t; }
function ko(...e) { let t = {}; for (let n of e)
    for (let o in n)
        n.hasOwnProperty(o) && (t[o] = !0); return t; }
var Sy = pt("area,br,col,hr,img,wbr"), by = pt("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"), Ay = pt("rp,rt"), s_ = ko(Ay, by), a_ = ko(by, pt("address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul")), c_ = ko(Ay, pt("a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video")), _u = ko(Sy, a_, c_, s_), Pd = pt("background,cite,href,itemtype,longdesc,poster,src,xlink:href"), l_ = pt("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"), u_ = pt("aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"), Su = ko(Pd, l_, u_), d_ = pt("script,style,template"), bu = ko(Pd, pt("action,formaction,data,codebase")), Au = class {
    sanitizedSomething = !1;
    buf = [];
    sanitizeChildren(t) { let n = t.firstChild, o = !0, r = []; for (; n;) {
        if (n.nodeType === Node.ELEMENT_NODE ? o = this.startElement(n) : n.nodeType === Node.TEXT_NODE ? this.chars(n.nodeValue) : this.sanitizedSomething = !0, o && n.firstChild) {
            r.push(n), n = h_(n);
            continue;
        }
        for (; n;) {
            n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
            let i = p_(n);
            if (i) {
                n = i;
                break;
            }
            n = r.pop();
        }
    } return this.buf.join(""); }
    startElement(t) { let n = ug(t).toLowerCase(); if (!_u.hasOwnProperty(n))
        return this.sanitizedSomething = !0, !d_.hasOwnProperty(n); this.buf.push("<"), this.buf.push(n); let o = t.attributes; for (let r = 0; r < o.length; r++) {
        let i = o.item(r), s = i.name, a = s.toLowerCase();
        if (!Su.hasOwnProperty(a)) {
            this.sanitizedSomething = !0;
            continue;
        }
        let c = i.value;
        Pd[a] && (c = ci(c)), this.buf.push(" ", s, '="', dg(c), '"');
    } return this.buf.push(">"), !0; }
    endElement(t) { let n = ug(t).toLowerCase(); _u.hasOwnProperty(n) && !Sy.hasOwnProperty(n) && (this.buf.push("</"), this.buf.push(n), this.buf.push(">")); }
    chars(t) { this.buf.push(dg(t)); }
};
function f_(e, t) { return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) !== Node.DOCUMENT_POSITION_CONTAINED_BY; }
function p_(e) { let t = e.nextSibling; if (t && e !== t.previousSibling)
    throw Ry(t); return t; }
function h_(e) { let t = e.firstChild; if (t && f_(e, t))
    throw Ry(t); return t; }
function ug(e) { let t = e.nodeName; return typeof t == "string" ? t : "FORM"; }
function Ry(e) { return new Error(`Failed to sanitize html because the element is clobbered: ${e.outerHTML}`); }
var g_ = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g, m_ = /([^\#-~ |!])/g;
function dg(e) { return e.replace(/&/g, "&amp;").replace(g_, function (t) { let n = t.charCodeAt(0), o = t.charCodeAt(1); return "&#" + ((n - 55296) * 1024 + (o - 56320) + 65536) + ";"; }).replace(m_, function (t) { return "&#" + t.charCodeAt(0) + ";"; }).replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
var gs;
function ky(e, t) { let n = null; try {
    gs = gs || _y(e);
    let o = t ? String(t) : "";
    n = gs.getInertBodyElement(o);
    let r = 5, i = o;
    do {
        if (r === 0)
            throw new Error("Failed to sanitize html because the input is unstable");
        r--, o = i, i = n.innerHTML, n = gs.getInertBodyElement(o);
    } while (o !== i);
    let a = new Au().sanitizeChildren(Ru(n) || n);
    return Ao(a);
}
finally {
    if (n) {
        let o = Ru(n) || n;
        for (; o.firstChild;)
            o.firstChild.remove();
    }
} }
function Ru(e) { return "content" in e && y_(e) ? e.content : null; }
function y_(e) { return e.nodeType === Node.ELEMENT_NODE && e.nodeName === "TEMPLATE"; }
var v_ = /^>|^->|<!--|-->|--!>|<!-$/g, E_ = /(<|>)/g, I_ = "\u200B$1\u200B";
function D_(e) { return e.replace(v_, t => t.replace(E_, I_)); }
function Ld(e, t) { return e.createText(t); }
function Oy(e, t, n) { e.setValue(t, n); }
function Fd(e, t) { return e.createComment(D_(t)); }
function Ca(e, t, n) { return e.createElement(t, n); }
function Dn(e, t, n, o, r) { e.insertBefore(t, n, o, r); }
function xy(e, t, n) { e.appendChild(t, n); }
function fg(e, t, n, o, r) { o !== null ? Dn(e, t, n, o, r) : xy(e, t, n); }
function li(e, t, n, o) { e.removeChild(null, t, n, o); }
function Py(e) { e.textContent = ""; }
function T_(e, t, n) { e.setAttribute(t, "style", n); }
function C_(e, t, n) { n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n); }
function Ly(e, t, n) { let { mergedAttrs: o, classes: r, styles: i } = n; o !== null && SN(e, t, o), r !== null && C_(e, t, r), i !== null && T_(e, t, i); }
function M_(e) { let t = g(); e.src = "", e.srcdoc = Ao(""), li(t[w], e); }
var Rn = (function (e) { return e[e.NONE = 0] = "NONE", e[e.HTML = 1] = "HTML", e[e.STYLE = 2] = "STYLE", e[e.SCRIPT = 3] = "SCRIPT", e[e.URL = 4] = "URL", e[e.RESOURCE_URL = 5] = "RESOURCE_URL", e; })(Rn || {});
function Fy(e) { let t = ui(); return t ? ag(t.sanitize(Rn.HTML, e) || "") : Ro(e, "HTML") ? ag(bt(e)) : ky(fa(), b(e)); }
function jy(e) { let t = ui(); return t ? t.sanitize(Rn.STYLE, e) || "" : Ro(e, "Style") ? bt(e) : b(e); }
function jd(e) { let t = ui(); return t ? t.sanitize(Rn.URL, e) || "" : Ro(e, "URL") ? bt(e) : ci(b(e)); }
function Vd(e) { let t = ui(); if (t)
    return lg(t.sanitize(Rn.RESOURCE_URL, e) || ""); if (Ro(e, "ResourceURL"))
    return lg(bt(e)); throw new D(904, !1); }
function Vy(e) { let t = ui(); if (t)
    return cg(t.sanitize(Rn.SCRIPT, e) || ""); if (Ro(e, "Script"))
    return cg(bt(e)); throw new D(905, !1); }
function Hy(e) { return Ao(e[0]); }
function By(e) { return Jw(e[0]); }
var N_ = new Set(["embed", "frame", "iframe", "media", "script"]), w_ = new Set(["base", "link", "script"]);
function __(e, t) { return t === "src" && N_.has(e) || t === "href" && w_.has(e) || t === "xlink:href" && e === "script" ? Vd : jd; }
function Uy(e, t, n) { return __(t, n)(e); }
function ui() { let e = g(); return e && e[je].sanitizer; }
var ms = new Set(["attributename"]), S_ = { iframe: new Set(["sandbox", "allow", "allowfullscreen", "referrerpolicy", "csp", "fetchpriority"]), animate: ms, set: ms, animatemotion: ms, animatetransform: ms };
function $y(e, t, n) { let o = t.toLowerCase(), r = n.toLowerCase(); if (!S_[o]?.has(r))
    return e; let i = ke(); if (i.type !== 2)
    return e; let s = g(); if (o === "iframe") {
    let c = ue(i, s);
    M_(c);
} let a = !1; throw new D(-910, a); }
function b_() { return Ye([]); }
function qy(e) { return e.ownerDocument.defaultView; }
function Gy(e) { return e.ownerDocument; }
function Hd(e) { return e.ownerDocument.body; }
var A_ = "\uFFFD";
function eo(e) { return e instanceof Function ? e() : e; }
function R_(e, t, n) { let o = e.length; for (;;) {
    let r = e.indexOf(t, n);
    if (r === -1)
        return r;
    if (r === 0 || e.charCodeAt(r - 1) <= 32) {
        let i = t.length;
        if (r + i === o || e.charCodeAt(r + i) <= 32)
            return r;
    }
    n = r + 1;
} }
var Wy = "ng-template";
function k_(e, t, n, o) { let r = 0; if (o) {
    for (; r < t.length && typeof t[r] == "string"; r += 2)
        if (t[r] === "class" && R_(t[r + 1].toLowerCase(), n, 0) !== -1)
            return !0;
}
else if (Bd(e))
    return !1; if (r = t.indexOf(1, r), r > -1) {
    let i;
    for (; ++r < t.length && typeof (i = t[r]) == "string";)
        if (i.toLowerCase() === n)
            return !0;
} return !1; }
function Bd(e) { return e.type === 4 && e.value !== Wy; }
function O_(e, t, n) { let o = e.type === 4 && !n ? Wy : e.value; return t === o; }
function x_(e, t, n) { let o = 4, r = e.attrs, i = r !== null ? F_(r) : 0, s = !1; for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "number") {
        if (!s && !Xe(o) && !Xe(c))
            return !1;
        if (s && Xe(c))
            continue;
        s = !1, o = c | o & 1;
        continue;
    }
    if (!s)
        if (o & 4) {
            if (o = 2 | o & 1, c !== "" && !O_(e, c, n) || c === "" && t.length === 1) {
                if (Xe(o))
                    return !1;
                s = !0;
            }
        }
        else if (o & 8) {
            if (r === null || !k_(e, r, c, n)) {
                if (Xe(o))
                    return !1;
                s = !0;
            }
        }
        else {
            let l = t[++a], u = P_(c, r, Bd(e), n);
            if (u === -1) {
                if (Xe(o))
                    return !1;
                s = !0;
                continue;
            }
            if (l !== "") {
                let d;
                if (u > i ? d = "" : d = r[u + 1].toLowerCase(), o & 2 && l !== d) {
                    if (Xe(o))
                        return !1;
                    s = !0;
                }
            }
        }
} return Xe(o) || s; }
function Xe(e) { return (e & 1) === 0; }
function P_(e, t, n, o) { if (t === null)
    return -1; let r = 0; if (o || !n) {
    let i = !1;
    for (; r < t.length;) {
        let s = t[r];
        if (s === e)
            return r;
        if (s === 3 || s === 6)
            i = !0;
        else if (s === 1 || s === 2) {
            let a = t[++r];
            for (; typeof a == "string";)
                a = t[++r];
            continue;
        }
        else {
            if (s === 4)
                break;
            if (s === 0) {
                r += 4;
                continue;
            }
        }
        r += i ? 1 : 2;
    }
    return -1;
}
else
    return j_(t, e); }
function zy(e, t, n = !1) { for (let o = 0; o < t.length; o++)
    if (x_(e, t[o], n))
        return !0; return !1; }
function L_(e) { let t = e.attrs; if (t != null) {
    let n = t.indexOf(5);
    if ((n & 1) === 0)
        return t[n + 1];
} return null; }
function F_(e) { for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (Tm(n))
        return t;
} return e.length; }
function j_(e, t) { let n = e.indexOf(4); if (n > -1)
    for (n++; n < e.length;) {
        let o = e[n];
        if (typeof o == "number")
            return -1;
        if (o === t)
            return n;
        n++;
    } return -1; }
function V_(e, t) { e: for (let n = 0; n < t.length; n++) {
    let o = t[n];
    if (e.length === o.length) {
        for (let r = 0; r < e.length; r++)
            if (e[r] !== o[r])
                continue e;
        return !0;
    }
} return !1; }
function pg(e, t) { return e ? ":not(" + t.trim() + ")" : t; }
function H_(e) { let t = e[0], n = 1, o = 2, r = "", i = !1; for (; n < e.length;) {
    let s = e[n];
    if (typeof s == "string")
        if (o & 2) {
            let a = e[++n];
            r += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
        }
        else
            o & 8 ? r += "." + s : o & 4 && (r += " " + s);
    else
        r !== "" && !Xe(s) && (t += pg(i, r), r = ""), o = s, i = i || !Xe(o);
    n++;
} return r !== "" && (t += pg(i, r)), t; }
function B_(e) { return e.map(H_).join(","); }
function U_(e) { let t = [], n = [], o = 1, r = 2; for (; o < e.length;) {
    let i = e[o];
    if (typeof i == "string")
        r === 2 ? i !== "" && t.push(i, e[++o]) : r === 8 && n.push(i);
    else {
        if (!Xe(r))
            break;
        r = i;
    }
    o++;
} return n.length && t.push(1, ...n), t; }
var H = {};
function Ud(e, t, n, o, r, i, s, a, c, l, u) { let d = E + o, f = d + r, p = $_(d, f), h = typeof l == "function" ? l() : l; return p[m] = { type: e, blueprint: p, template: n, queries: null, viewQuery: a, declTNode: t, data: p.slice().fill(null, d), bindingStartIndex: d, expandoStartIndex: f, hostBindingOpCodes: null, firstCreatePass: !0, firstUpdatePass: !0, staticViewQueries: !1, staticContentQueries: !1, preOrderHooks: null, preOrderCheckHooks: null, contentHooks: null, contentCheckHooks: null, viewHooks: null, viewCheckHooks: null, destroyHooks: null, cleanup: null, contentQueries: null, components: null, directiveRegistry: typeof i == "function" ? i() : i, pipeRegistry: typeof s == "function" ? s() : s, firstChild: null, schemas: c, consts: h, incompleteFirstPass: !1, ssrId: u }; }
function $_(e, t) { let n = []; for (let o = 0; o < t; o++)
    n.push(o < e ? null : H); return n; }
function Qy(e) { let t = e.tView; return t === null || t.incompleteFirstPass ? e.tView = Ud(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t; }
function Ma(e, t, n, o, r, i, s, a, c, l, u) { let d = t.blueprint.slice(); return d[$] = r, d[N] = o | 4 | 128 | 8 | 64 | 1024, (l !== null || e && e[N] & 2048) && (d[N] |= 2048), ll(d), d[Q] = d[cn] = e, d[U] = n, d[je] = s || e && e[je], d[w] = a || e && e[w], d[P] = c || e && e[P] || null, d[ce] = i, d[Ve] = YN(), d[le] = u, d[ol] = l, d[ee] = t.type == 2 ? e[ee] : d, d; }
function q_(e, t, n) { let o = ue(t, e), r = Qy(n), i = e[je].rendererFactory, s = qd(e, Ma(e, r, null, $d(n), o, t, null, i.createRenderer(o, n), null, null, null)); return e[t.index] = s; }
function $d(e) { let t = 16; return e.signals ? t = 4096 : e.onPush && (t = 64), t; }
function di(e, t, n, o) { if (n === 0)
    return -1; let r = t.length; for (let i = 0; i < n; i++)
    t.push(o), e.blueprint.push(o), e.data.push(null); return r; }
function qd(e, t) { return e[Ft] ? e[lr][he] = t : e[Ft] = t, e[lr] = t, t; }
function Zy(e = 1) { Yy(A(), g(), de() + e, !1); }
function Yy(e, t, n, o) { if (!o)
    if ((t[N] & 3) === 3) {
        let i = e.preOrderCheckHooks;
        i !== null && Ts(t, i, n);
    }
    else {
        let i = e.preOrderHooks;
        i !== null && Cs(t, i, 0, n);
    } Bt(n); }
var Na = (function (e) { return e[e.None = 0] = "None", e[e.SignalBased = 1] = "SignalBased", e[e.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform", e; })(Na || {});
function zt(e, t, n, o) { let r = R(null); try {
    let [i, s, a] = e.inputs[n], c = null;
    (s & Na.SignalBased) !== 0 && (c = t[i][se]), c !== null && c.transformFn !== void 0 ? o = c.transformFn(o) : a !== null && (o = a.call(t, o)), e.setInput !== null ? e.setInput(t, c, o, n, i) : hm(t, c, i, o);
}
finally {
    R(r);
} }
var $s = (function (e) { return e[e.Important = 1] = "Important", e[e.DashCase = 2] = "DashCase", e; })($s || {}), ku;
function Gd(e, t) { return ku(e, t); }
function G_(e) { ku === void 0 && (ku = e()); }
var Ky = new T("", { factory: () => !1 }), Jy = new T("", { factory: () => W_ }), W_ = 4e3, z_ = !1, kn = (typeof ngServerMode > "u" || !ngServerMode) && typeof document < "u" && typeof document?.documentElement?.getAnimations == "function";
function wa(e) { return e[P].get(Ky, z_); }
function Q_(e, t, n) { let o = uo.get(e); if (o) {
    for (let r of t)
        o.classList.push(r);
    for (let r of n)
        o.cleanupFns.push(r);
}
else
    uo.set(e, { classList: t, cleanupFns: n }); }
function Wd(e) { let t = uo.get(e); if (t) {
    for (let n of t.cleanupFns)
        n();
    uo.delete(e);
} En.delete(e); }
var Z_ = () => { }, uo = new WeakMap, En = new WeakMap, Lr = new WeakMap, Dr = new WeakSet;
function Ou(e, t) { let n = Lr.get(e); if (n && n.length > 0) {
    let o = n.findIndex(r => r === t);
    o > -1 && n.splice(o, 1);
} n?.length === 0 && Lr.delete(e); }
function Y_(e, t) { let n = Lr.get(e); if (!n || n.length === 0)
    return; let o = t.parentNode, r = t.previousSibling; for (let i = n.length - 1; i >= 0; i--) {
    let s = n[i], a = s.parentNode;
    s === t ? (n.splice(i, 1), Dr.add(s), s.dispatchEvent(new CustomEvent("animationend", { detail: { cancel: !0 } }))) : (r && s === r || a && o && a !== o) && (n.splice(i, 1), s.dispatchEvent(new CustomEvent("animationend", { detail: { cancel: !0 } })), s.parentNode?.removeChild(s));
} }
function zd(e, t) { let n = Lr.get(e); n ? n.includes(t) || n.push(t) : Lr.set(e, [t]); }
function qs(e) { let t = e[it] ??= {}; return t.enter ??= new Map; }
function Tn(e) { let t = e[it] ??= {}; return t.leave ??= new Map; }
function Xy(e) { let t = typeof e == "function" ? e() : e, n = Array.isArray(t) ? t : null; return typeof t == "string" && (n = t.trim().split(/\s+/).filter(o => o)), n; }
function K_(e, t) { if (!kn)
    return; let n = uo.get(e); if (n && n.classList.length > 0 && J_(e, n.classList))
    for (let o of n.classList)
        t.removeClass(e, o); Wd(e); }
function J_(e, t) { for (let n of t)
    if (e.classList.contains(n))
        return !0; return !1; }
function Fr(e) { return e.composedPath ? e.composedPath()[0] : e.target; }
function Qd(e, t) { let n = En.get(t); return n === void 0 ? !0 : t === Fr(e) && (n.animationName !== void 0 && e.animationName === n.animationName || n.propertyName !== void 0 && (n.propertyName === "all" || e.propertyName === n.propertyName)); }
function _a(e, t, n) { let o = e.get(t.index) ?? { animateFns: [] }; o.animateFns.push(n), e.set(t.index, o); }
function xu(e, t) { if (e)
    for (let n of e)
        n(); for (let n of t)
    n(); }
function Pu(e, t) { let n = Tn(e).get(t.index); n && (n.resolvers = void 0); }
function ys(e, t, n, o, r) { Ou(t, n), xu(o, r), Pu(e, t); }
function Gs(e) { if (!e)
    return 0; let t = e.toLowerCase().indexOf("ms") > -1 ? 1 : 1e3; return parseFloat(e) * t; }
function yn(e, t) { return e.getPropertyValue(t).split(",").map(o => o.trim()); }
function X_(e) { let t = yn(e, "transition-property"), n = yn(e, "transition-duration"), o = yn(e, "transition-delay"), r = { propertyName: "", duration: 0, animationName: void 0 }; for (let i = 0; i < t.length; i++) {
    let s = Gs(o[i]) + Gs(n[i]);
    s > r.duration && (r.propertyName = t[i], r.duration = s);
} return r; }
function eS(e) { let t = yn(e, "animation-name"), n = yn(e, "animation-delay"), o = yn(e, "animation-duration"), r = yn(e, "animation-iteration-count"), i = { animationName: "", propertyName: void 0, duration: 0 }; for (let s = 0; s < t.length; s++) {
    let a = Gs(n[s]) + Gs(o[s]), c = r[s];
    a > i.duration && c !== "infinite" && (i.animationName = t[s], i.duration = a);
} return i; }
function ev(e, t) { return e !== void 0 && e.duration > t.duration; }
function tv(e) { return (e.animationName != null || e.propertyName != null) && e.duration > 0; }
function tS(e, t) { let n = getComputedStyle(e), o = eS(n), r = X_(n), i = o.duration > r.duration ? o : r; ev(t.get(e), i) || tv(i) && t.set(e, i); }
function nv(e, t, n) { if (!n)
    return; let o = e.getAnimations(); return o.length === 0 ? tS(e, t) : nS(e, t, o); }
function nS(e, t, n) { let o = { animationName: void 0, propertyName: void 0, duration: 0 }; for (let r of n) {
    let i = r.effect?.getTiming();
    if (i?.iterations === 1 / 0)
        continue;
    let s = typeof i?.duration == "number" ? i.duration : 0, a = (i?.delay ?? 0) + s, c = r.playbackRate;
    c !== void 0 && c !== 0 && c !== 1 && (a /= Math.abs(c));
    let l, u;
    r.animationName ? u = r.animationName : l = r.transitionProperty, a >= o.duration && (o = { animationName: u, propertyName: l, duration: a });
} ev(t.get(e), o) || tv(o) && t.set(e, o); }
var Cn = new Set, Sa = (function (e) { return e[e.CHANGE_DETECTION = 0] = "CHANGE_DETECTION", e[e.AFTER_NEXT_RENDER = 1] = "AFTER_NEXT_RENDER", e; })(Sa || {}), On = new T(""), hg = new Set;
function J(e) { hg.has(e) || (hg.add(e), performance?.mark?.("mark_feature_usage", { detail: { feature: e } })); }
var ba = (() => { class e {
    impl = null;
    execute() { this.impl?.execute(); }
    static \u0275prov = B({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), Zd = [0, 1, 2, 3], Yd = (() => { class e {
    ngZone = v(q);
    scheduler = v(xe);
    errorHandler = v(vt, { optional: !0 });
    sequences = new Set;
    deferredRegistrations = new Set;
    executing = !1;
    constructor() { v(On, { optional: !0 }); }
    execute() { let n = this.sequences.size > 0; n && V(k.AfterRenderHooksStart), this.executing = !0; for (let o of Zd)
        for (let r of this.sequences)
            if (!(r.erroredOrDestroyed || !r.hooks[o]))
                try {
                    r.pipelinedValue = this.ngZone.runOutsideAngular(() => this.maybeTrace(() => { let i = r.hooks[o]; return i(r.pipelinedValue); }, r.snapshot));
                }
                catch (i) {
                    r.erroredOrDestroyed = !0, this.errorHandler?.handleError(i);
                } this.executing = !1; for (let o of this.sequences)
        o.afterRun(), o.once && (this.sequences.delete(o), o.destroy()); for (let o of this.deferredRegistrations)
        this.sequences.add(o); this.deferredRegistrations.size > 0 && this.scheduler.notify(7), this.deferredRegistrations.clear(), n && V(k.AfterRenderHooksEnd); }
    register(n) { let { view: o } = n; o !== void 0 ? ((o[un] ??= []).push(n), pn(o), o[N] |= 8192) : this.executing ? this.deferredRegistrations.add(n) : this.addSequence(n); }
    addSequence(n) { this.sequences.add(n), this.scheduler.notify(7); }
    unregister(n) { this.executing && this.sequences.has(n) ? (n.erroredOrDestroyed = !0, n.pipelinedValue = void 0, n.once = !0) : (this.sequences.delete(n), this.deferredRegistrations.delete(n)); }
    maybeTrace(n, o) { return o ? o.run(Sa.AFTER_NEXT_RENDER, n) : n(); }
    static \u0275prov = B({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), jr = class {
    impl;
    hooks;
    view;
    once;
    snapshot;
    erroredOrDestroyed = !1;
    pipelinedValue = void 0;
    unregisterOnDestroy;
    constructor(t, n, o, r, i, s = null) { this.impl = t, this.hooks = n, this.view = o, this.once = r, this.snapshot = s, this.unregisterOnDestroy = i?.onDestroy(() => this.destroy()); }
    afterRun() { this.erroredOrDestroyed = !1, this.pipelinedValue = void 0, this.snapshot?.dispose(), this.snapshot = null; }
    destroy() { this.impl.unregister(this), this.unregisterOnDestroy?.(); let t = this.view?.[un]; t && (this.view[un] = t.filter(n => n !== this)); }
};
function ov(e, t) { let n = t?.injector ?? v(ae); return typeof ngServerMode < "u" && ngServerMode ? Aa : (J("NgAfterRender"), rv(e, n, t, !1)); }
function Kd(e, t) { let n = t?.injector ?? v(ae); return typeof ngServerMode < "u" && ngServerMode ? Aa : (J("NgAfterNextRender"), rv(e, n, t, !0)); }
function oS(e) { return e instanceof Function ? [void 0, void 0, e, void 0] : [e.earlyRead, e.write, e.mixedReadWrite, e.read]; }
function rv(e, t, n, o) { let r = t.get(ba); r.impl ??= t.get(Yd); let i = t.get(On, null, { optional: !0 }), s = n?.manualCleanup !== !0 ? t.get(Be) : null, a = t.get(Wn, null, { optional: !0 }), c = new jr(r.impl, oS(e), a?.view, o, s, i?.snapshot(null)); return r.impl.register(c), c; }
var Aa = { destroy() { } }, Ra = new T("", { factory: () => ({ queue: new Set, isScheduled: !1, scheduler: null, injector: v(_e) }) });
function iv(e, t, n) { let o = e.get(Ra); if (Array.isArray(t))
    for (let r of t)
        o.queue.add(r), n?.detachedLeaveAnimationFns?.push(r);
else
    o.queue.add(t), n?.detachedLeaveAnimationFns?.push(t); o.scheduler && o.scheduler(e); }
function rS(e, t) { let n = e.get(Ra); if (t.detachedLeaveAnimationFns) {
    for (let o of t.detachedLeaveAnimationFns)
        n.queue.delete(o);
    t.detachedLeaveAnimationFns = void 0;
} }
function iS(e) { let t = e.get(Ra); t.isScheduled || (Kd(() => { t.isScheduled = !1; for (let n of t.queue)
    n(); t.queue.clear(); }, { injector: t.injector }), t.isScheduled = !0); }
function ka(e) { let t = e.get(Ra); t.scheduler = iS, t.scheduler(e); }
function Jd(e, t) { for (let [n, o] of t)
    iv(e, o.animateFns); }
function gg(e, t, n, o) { let r = e?.[it]?.enter; t !== null && r && r.has(n.index) && Jd(o, r); }
function to(e, t, n, o, r, i, s, a) { if (r != null) {
    let c, l = !1;
    K(r) ? c = r : ne(r) && (l = !0, r = r[$]);
    let u = L(r);
    e === 0 && o !== null ? (gg(a, o, i, n), s == null ? xy(t, o, u) : Dn(t, o, u, s || null, !0)) : e === 1 && o !== null ? (gg(a, o, i, n), Dn(t, o, u, s || null, !0), Y_(i, u)) : e === 2 ? (a?.[it]?.leave?.has(i.index) && zd(i, u), Dr.delete(u), mg(a, i, n, d => { if (Dr.has(u)) {
        Dr.delete(u);
        return;
    } li(t, u, l, d); })) : e === 3 && (Dr.delete(u), mg(a, i, n, () => { t.destroyNode(u); })), c != null && fS(t, e, n, c, i, o, s);
} }
function sv(e, t) { av(e, t), t[$] = null, t[ce] = null; }
function sS(e, t, n, o, r, i) { o[$] = r, o[ce] = t, Oa(e, o, n, 1, r, i); }
function av(e, t) { t[je].changeDetectionScheduler?.notify(9), Oa(e, t, t[w], 2, null, null); }
function aS(e) { let t = e[Ft]; if (!t)
    return zl(e[m], e); for (; t;) {
    let n = null;
    if (ne(t))
        n = t[Ft];
    else {
        let o = t[G];
        o && (n = o);
    }
    if (!n) {
        for (; t && !t[he] && t !== e;)
            ne(t) && zl(t[m], t), t = t[Q];
        t === null && (t = e), ne(t) && zl(t[m], t), n = t && t[he];
    }
    t = n;
} }
function Xd(e, t) { let n = e[dn], o = n.indexOf(t); n.splice(o, 1); }
function fi(e, t) { if (at(t))
    return; let n = t[w]; n.destroyNode && Oa(e, t, n, 3, null, null), aS(t); }
function zl(e, t) { if (at(t))
    return; let n = R(null); try {
    t[N] &= -129, t[N] |= 256, t[Ae] && Ot(t[Ae]), uS(e, t), lS(e, t), t[m].type === 1 && t[w].destroy();
    let o = t[jt];
    if (o !== null && K(t[Q])) {
        o !== t[Q] && Xd(o, t);
        let r = t[rt];
        r !== null && r.detachView(e);
    }
    hu(t);
}
finally {
    R(n);
} }
function mg(e, t, n, o) { let r = e?.[it]; if (r == null || r.leave == null || !r.leave.has(t.index))
    return o(!1); e && Cn.add(e[Ve]), iv(n, () => { if (r.leave && r.leave.has(t.index)) {
    let s = r.leave.get(t.index), a = [];
    if (s) {
        for (let c = 0; c < s.animateFns.length; c++) {
            let l = s.animateFns[c], { promise: u } = l();
            a.push(u);
        }
        r.detachedLeaveAnimationFns = void 0;
    }
    r.running = Promise.allSettled(a), cS(e, o);
}
else
    e && Cn.delete(e[Ve]), o(!1); }, r); }
function cS(e, t) { let n = e[it]?.running; if (n) {
    n.then(() => { e[it].running = void 0, Cn.delete(e[Ve]), t(!0); });
    return;
} t(!1); }
function lS(e, t) { let n = e.cleanup, o = t[Lt]; if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
        if (typeof n[s] == "string") {
            let a = n[s + 3];
            a >= 0 ? o[a]() : o[-a].unsubscribe(), s += 2;
        }
        else {
            let a = o[n[s + 1]];
            n[s].call(a);
        } o !== null && (t[Lt] = null); let r = t[mt]; if (r !== null) {
    t[mt] = null;
    for (let s = 0; s < r.length; s++) {
        let a = r[s];
        a();
    }
} let i = t[Pt]; if (i !== null) {
    t[Pt] = null;
    for (let s of i)
        s.destroy();
} }
function uS(e, t) { let n; if (e != null && (n = e.destroyHooks) != null)
    for (let o = 0; o < n.length; o += 2) {
        let r = t[n[o]];
        if (!(r instanceof In)) {
            let i = n[o + 1];
            if (Array.isArray(i))
                for (let s = 0; s < i.length; s += 2) {
                    let a = r[i[s]], c = i[s + 1];
                    V(k.LifecycleHookStart, a, c);
                    try {
                        c.call(a);
                    }
                    finally {
                        V(k.LifecycleHookEnd, a, c);
                    }
                }
            else {
                V(k.LifecycleHookStart, r, i);
                try {
                    i.call(r);
                }
                finally {
                    V(k.LifecycleHookEnd, r, i);
                }
            }
        }
    } }
function ef(e, t, n) { return cv(e, t.parent, n); }
function cv(e, t, n) { let o = t; for (; o !== null && o.type & 168;)
    t = o, o = t.parent; if (o === null)
    return n[$]; if (De(o)) {
    let { encapsulation: r } = e.data[o.directiveStart + o.componentOffset];
    if (r === $e.None || r === $e.Emulated)
        return null;
} return ue(o, n); }
function lv(e, t, n) { return dv(e, t, n); }
function uv(e, t, n) { return e.type & 40 ? ue(e, n) : null; }
var dv = uv, Lu;
function fv(e, t) { dv = e, Lu = t; }
function tf(e, t, n, o) { let r = ef(e, o, t), i = t[w], s = o.parent || t[ce], a = lv(s, o, t); if (r != null)
    if (Array.isArray(n))
        for (let c = 0; c < n.length; c++)
            fg(i, r, n[c], a, !1);
    else
        fg(i, r, n, a, !1); Lu !== void 0 && Lu(i, o, t, n, r); }
function vn(e, t) { if (t !== null) {
    let n = t.type;
    if (n & 3)
        return ue(t, e);
    if (n & 4)
        return Fu(-1, e[t.index]);
    if (n & 8) {
        let o = t.child;
        if (o !== null)
            return vn(e, o);
        {
            let r = e[t.index];
            return K(r) ? Fu(-1, r) : L(r);
        }
    }
    else {
        if (n & 128)
            return vn(e, t.next);
        if (n & 32)
            return Gd(t, e)() || L(e[t.index]);
        {
            let o = pv(e, t);
            if (o !== null) {
                if (Array.isArray(o))
                    return o[0];
                let r = yt(e[ee]);
                return vn(r, o);
            }
            else
                return vn(e, t.next);
        }
    }
} return null; }
function pv(e, t) { if (t !== null) {
    let o = e[ee][ce], r = t.projection;
    return o.projection[r];
} return null; }
function Fu(e, t) { let n = G + e + 1; if (n < t.length) {
    let o = t[n], r = o[m].firstChild;
    if (r !== null)
        return vn(o, r);
} return t[Ke]; }
function nf(e, t, n, o, r, i, s) { for (; n != null;) {
    let a = o[P];
    if (n.type === 128) {
        n = n.next;
        continue;
    }
    let c = o[n.index], l = n.type;
    if (s && t === 0 && (c && Ue(L(c), o), n.flags |= 2), !bo(n))
        if (l & 8)
            nf(e, t, n.child, o, r, i, !1), to(t, e, a, r, c, n, i, o);
        else if (l & 32) {
            let u = Gd(n, o), d;
            for (; d = u();)
                to(t, e, a, r, d, n, i, o);
            to(t, e, a, r, c, n, i, o);
        }
        else
            l & 16 ? hv(e, t, o, n, r, i) : to(t, e, a, r, c, n, i, o);
    n = s ? n.projectionNext : n.next;
} }
function Oa(e, t, n, o, r, i) { nf(n, o, e.firstChild, t, r, i, !1); }
function dS(e, t, n) { let o = t[w], r = ef(e, n, t), i = n.parent || t[ce], s = lv(i, n, t); hv(o, 0, t, n, r, s); }
function hv(e, t, n, o, r, i) { let s = n[ee], c = s[ce].projection[o.projection]; if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
        let u = c[l];
        to(t, e, n[P], r, u, o, i, n);
    }
else {
    let l = c, u = s[Q];
    xr(o) && (l.flags |= 128), nf(e, t, l, u, r, i, !0);
} }
function fS(e, t, n, o, r, i, s) { let a = o[Ke], c = L(o); a !== c && to(t, e, n, i, a, r, s); for (let l = G; l < o.length; l++) {
    let u = o[l];
    Oa(u[m], u, e, t, i, a);
} }
function pS(e, t, n, o, r) { if (t)
    r ? e.addClass(n, o) : e.removeClass(n, o);
else {
    let i = o.indexOf("-") === -1 ? void 0 : $s.DashCase;
    r == null ? e.removeStyle(n, o, i) : (typeof r == "string" && r.endsWith("!important") && (r = r.slice(0, -10), i |= $s.Important), e.setStyle(n, o, r, i));
} }
function gv(e, t, n, o, r) { let i = de(), s = o & 2; try {
    Bt(-1), s && t.length > E && Yy(e, t, E, !1);
    let a = s ? k.TemplateUpdateStart : k.TemplateCreateStart;
    V(a, r, n), n(o, r);
}
finally {
    Bt(i);
    let a = s ? k.TemplateUpdateEnd : k.TemplateCreateEnd;
    V(a, r, n);
} }
function xa(e, t, n) { vS(e, t, n), (n.flags & 64) === 64 && ES(e, t, n); }
function Oo(e, t, n = ue) { let o = t.localNames; if (o !== null) {
    let r = t.index + 1;
    for (let i = 0; i < o.length; i += 2) {
        let s = o[i + 1], a = s === -1 ? n(t, e) : e[s];
        e[r++] = a;
    }
} }
function hS(e, t, n, o) { let i = o.get(Dd, Ym) || n === $e.ShadowDom || n === $e.ExperimentalIsolatedShadowDom, s = e.selectRootElement(t, i); return gS(s), s; }
function gS(e) { mv(e); }
var mv = () => null;
function mS(e) { Lm(e) ? Py(e) : kw(e); }
function yv() { mv = mS; }
function yS(e) { return e === "class" ? "className" : e === "for" ? "htmlFor" : e === "formaction" ? "formAction" : e === "innerHtml" ? "innerHTML" : e === "readonly" ? "readOnly" : e === "tabindex" ? "tabIndex" : e; }
function of(e, t, n, o, r, i) { let s = t[m]; if (ja(e, s, t, n, o)) {
    De(e) && vv(t, e.index);
    return;
} e.type & 3 && (n = yS(n)), rf(e, t, n, o, r, i); }
function rf(e, t, n, o, r, i) { if (e.type & 3) {
    let s = ue(e, t);
    o = i != null ? i(o, e.value || "", n) : o, r.setProperty(s, n, o);
}
else
    e.type & 12; }
function vv(e, t) { let n = ye(t, e); n[N] & 16 || (n[N] |= 64); }
function vS(e, t, n) { let o = n.directiveStart, r = n.directiveEnd; De(n) && q_(t, n, e.data[o + n.componentOffset]), e.firstCreatePass || Fs(n, t); let i = n.initialInputs; for (let s = o; s < r; s++) {
    let a = e.data[s], c = Or(t, e, s, n);
    if (Ue(c, t), i !== null && TS(t, s - o, c, a, n, i), He(a)) {
        let l = ye(n.index, t);
        l[U] = Or(t, e, s, n);
    }
} }
function ES(e, t, n) { let o = n.directiveStart, r = n.directiveEnd, i = n.index, s = Lh(); try {
    Bt(i);
    for (let a = o; a < r; a++) {
        let c = e.data[a], l = t[a];
        rs(a), (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && IS(c, l);
    }
}
finally {
    Bt(-1), rs(s);
} }
function IS(e, t) { e.hostBindings !== null && e.hostBindings(1, t); }
function sf(e, t) { let n = e.directiveRegistry, o = null; if (n)
    for (let r = 0; r < n.length; r++) {
        let i = n[r];
        zy(t, i.selectors, !1) && (o ??= [], He(i) ? o.unshift(i) : o.push(i));
    } return o; }
function DS(e, t, n, o, r, i) { let s = ue(e, t); Pa(t[w], s, i, e.value, n, o, r); }
function Pa(e, t, n, o, r, i, s) { if (i == null)
    e.removeAttribute(t, r, n);
else {
    let a = s == null ? b(i) : s(i, o || "", r);
    e.setAttribute(t, r, a, n);
} }
function TS(e, t, n, o, r, i) { let s = i[t]; if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
        let c = s[a], l = s[a + 1];
        zt(o, n, c, l);
    } }
function La(e, t, n, o, r) { let i = E + n, s = t[m], a = r(s, t, e, o, n); t[i] = a, ct(e, !0); let c = e.type === 2; return c ? (Ly(t[w], a, e), (Rh() === 0 || Un(e)) && Ue(a, t), kh()) : Ue(a, t), mr() && (!c || !bo(e)) && tf(s, t, a, e), e; }
function Fa(e) { let t = e; return Dl() ? Tl() : (t = t.parent, ct(t, !1)), t; }
function Ev(e, t, n) { return (e === null || He(e)) && (n = dr(n[t.index])), n[w]; }
function af(e, t) { let n = e[P]; if (!n)
    return; let o; try {
    o = n.get(It, null);
}
catch {
    o = null;
} o?.(t); }
function ja(e, t, n, o, r) { let i = e.inputs?.[o], s = e.hostDirectiveInputs?.[o], a = !1; if (s)
    for (let c = 0; c < s.length; c += 2) {
        let l = s[c], u = s[c + 1], d = t.data[l];
        zt(d, n[l], u, r), a = !0;
    } if (i)
    for (let c of i) {
        let l = n[c], u = t.data[c];
        zt(u, l, o, r), a = !0;
    } return a; }
function CS(e, t, n, o, r, i) { let s = null, a = null, c = null, l = !1, u = e.directiveToIndex.get(o.type); if (typeof u == "number" ? s = u : [s, a, c] = u, a !== null && c !== null && e.hostDirectiveInputs?.hasOwnProperty(r)) {
    let d = e.hostDirectiveInputs[r];
    for (let f = 0; f < d.length; f += 2) {
        let p = d[f];
        if (p >= a && p <= c) {
            let h = t.data[p], y = d[f + 1];
            zt(h, n[p], y, i), l = !0;
        }
        else if (p > c)
            break;
    }
} return s !== null && o.inputs.hasOwnProperty(r) && (zt(o, n[s], r, i), l = !0), l; }
function MS(e, t) { let n = ye(t, e), o = n[m]; NS(o, n); let r = n[$]; r !== null && n[le] === null && (n[le] = dy(r, n[P])), V(k.ComponentStart); try {
    Va(o, n, n[U]);
}
finally {
    V(k.ComponentEnd, n[U]);
} }
function NS(e, t) { for (let n = t.length; n < e.blueprint.length; n++)
    t.push(e.blueprint[n]); }
function Va(e, t, n) { as(t); try {
    let o = e.viewQuery;
    o !== null && Eu(1, o, n);
    let r = e.template;
    r !== null && gv(e, t, r, 1, n), e.firstCreatePass && (e.firstCreatePass = !1), t[rt]?.finishViewCreation(e), e.staticContentQueries && Ty(e, t), e.staticViewQueries && Eu(2, e.viewQuery, n);
    let i = e.components;
    i !== null && wS(t, i);
}
catch (o) {
    throw e.firstCreatePass && (e.incompleteFirstPass = !0, e.firstCreatePass = !1), o;
}
finally {
    t[N] &= -5, cs();
} }
function wS(e, t) { for (let n = 0; n < t.length; n++)
    MS(e, t[n]); }
function xo(e, t, n, o) { let r = R(null); try {
    let i = t.tView, a = e[N] & 4096 ? 4096 : 16, c = Ma(e, i, n, a, null, t, null, null, o?.injector ?? null, o?.embeddedViewInjector ?? null, o?.dehydratedView ?? null), l = e[t.index];
    c[jt] = l;
    let u = e[rt];
    return u !== null && (c[rt] = u.createEmbeddedView(i)), Va(i, c, n), c;
}
finally {
    R(r);
} }
function Mn(e, t) { return !t || t.firstChild === null || xr(e); }
function fo(e, t, n, o, r = !1) { for (; n !== null;) {
    if (n.type === 128) {
        n = r ? n.projectionNext : n.next;
        continue;
    }
    let i = t[n.index];
    i !== null && o.push(L(i)), K(i) && Ha(i, o);
    let s = n.type;
    if (s & 8)
        fo(e, t, n.child, o);
    else if (s & 32) {
        let a = Gd(n, t), c;
        for (; c = a();)
            o.push(c);
    }
    else if (s & 16) {
        let a = pv(t, n);
        if (Array.isArray(a))
            o.push(...a);
        else {
            let c = yt(t[ee]);
            fo(c[m], c, a, o, !0);
        }
    }
    n = r ? n.projectionNext : n.next;
} return o; }
function Ha(e, t) { for (let n = G; n < e.length; n++) {
    let o = e[n], r = o[m].firstChild;
    r !== null && fo(o[m], o, r, t);
} e[Ke] !== e[$] && t.push(e[Ke]); }
function Iv(e) { if (e[un] !== null) {
    for (let t of e[un])
        t.impl.addSequence(t);
    e[un].length = 0;
} }
var Dv = [];
function _S(e) { return e[Ae] ?? SS(e); }
function SS(e) { let t = Dv.pop() ?? Object.create(AS); return t.lView = e, t; }
function bS(e) { e.lView[Ae] !== e && (e.lView = null, Dv.push(e)); }
var AS = we(z({}, wc), { consumerIsAlwaysLive: !0, kind: "template", consumerMarkedDirty: e => { pn(e.lView); }, consumerOnSignalRead() { this.lView[Ae] = this; } });
function RS(e) { let t = e[Ae] ?? Object.create(kS); return t.lView = e, t; }
var kS = we(z({}, wc), { consumerIsAlwaysLive: !0, kind: "template", consumerMarkedDirty: e => { let t = yt(e.lView); for (; t && !Tv(t[m]);)
        t = yt(t); t && es(t); }, consumerOnSignalRead() { this.lView[Ae] = this; } });
function Tv(e) { return e.type !== 2; }
function Cv(e) { if (e[Pt] === null)
    return; let t = !0; for (; t;) {
    let n = !1;
    for (let o of e[Pt])
        o.dirty && (n = !0, o.zone === null || Zone.current === o.zone ? o.run() : o.zone.run(() => o.run()));
    t = n && !!(e[N] & 8192);
} }
var OS = 100;
function Mv(e, t = 0) { let o = e[je].rendererFactory, r = !1; r || o.begin?.(); try {
    xS(e, t);
}
finally {
    r || o.end?.();
} }
function xS(e, t) { let n = Ml(); try {
    Qo(!0), ju(e, t);
    let o = 0;
    for (; $n(e);) {
        if (o === OS)
            throw new D(103, !1);
        o++, ju(e, 1);
    }
}
finally {
    Qo(n);
} }
function Nv(e, t, n, o) { if (at(t))
    return; let r = t[N], i = !1, s = !1; as(t); let a = !0, c = null, l = null; i || (Tv(e) ? (l = _S(t), c = qo(l)) : bi() === null ? (a = !1, l = RS(t), c = qo(l)) : t[Ae] && (Ot(t[Ae]), t[Ae] = null)); try {
    ll(t), Nl(e.bindingStartIndex), n !== null && gv(e, t, n, 2, o);
    let u = (r & 3) === 3;
    if (!i)
        if (u) {
            let p = e.preOrderCheckHooks;
            p !== null && Ts(t, p, null);
        }
        else {
            let p = e.preOrderHooks;
            p !== null && Cs(t, p, 0, null), Ul(t, 0);
        }
    if (s || PS(t), Cv(t), wv(t, 0), e.contentQueries !== null && Ty(e, t), !i)
        if (u) {
            let p = e.contentCheckHooks;
            p !== null && Ts(t, p);
        }
        else {
            let p = e.contentHooks;
            p !== null && Cs(t, p, 1), Ul(t, 1);
        }
    FS(e, t);
    let d = e.components;
    d !== null && Sv(t, d, 0);
    let f = e.viewQuery;
    if (f !== null && Eu(2, f, o), !i)
        if (u) {
            let p = e.viewCheckHooks;
            p !== null && Ts(t, p);
        }
        else {
            let p = e.viewHooks;
            p !== null && Cs(t, p, 2), Ul(t, 2);
        }
    if (e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Ji]) {
        for (let p of t[Ji])
            p();
        t[Ji] = null;
    }
    i || (Iv(t), t[N] &= -73);
}
catch (u) {
    throw i || pn(t), u;
}
finally {
    l !== null && (Ri(l, c), a && bS(l)), cs();
} }
function wv(e, t) { for (let n = Bm(e); n !== null; n = Um(n))
    for (let o = G; o < n.length; o++) {
        let r = n[o];
        _v(r, t);
    } }
function PS(e) { for (let t = Bm(e); t !== null; t = Um(t)) {
    if (!(t[N] & 2))
        continue;
    let n = t[dn];
    for (let o = 0; o < n.length; o++) {
        let r = n[o];
        es(r);
    }
} }
function LS(e, t, n) { V(k.ComponentStart); let o = ye(t, e); try {
    _v(o, n);
}
finally {
    V(k.ComponentEnd, o[U]);
} }
function _v(e, t) { Xi(e) && ju(e, t); }
function ju(e, t) { let o = e[m], r = e[N], i = e[Ae], s = !!(t === 0 && r & 16); if (s ||= !!(r & 64 && t === 0), s ||= !!(r & 1024), s ||= !!(i?.dirty && ki(i)), s ||= !1, i && (i.dirty = !1), e[N] &= -9217, s)
    Nv(o, e, o.template, e[U]);
else if (r & 8192) {
    let a = R(null);
    try {
        Cv(e), wv(e, 1);
        let c = o.components;
        c !== null && Sv(e, c, 1), Iv(e);
    }
    finally {
        R(a);
    }
} }
function Sv(e, t, n) { for (let o = 0; o < t.length; o++)
    LS(e, t[o], n); }
function FS(e, t) { let n = e.hostBindingOpCodes; if (n !== null)
    try {
        for (let o = 0; o < n.length; o++) {
            let r = n[o];
            if (r < 0)
                Bt(~r);
            else {
                let i = r, s = n[++o], a = n[++o];
                Ph(s, i);
                let c = t[i];
                V(k.HostBindingsUpdateStart, c);
                try {
                    a(2, c);
                }
                finally {
                    V(k.HostBindingsUpdateEnd, c);
                }
            }
        }
    }
    finally {
        Bt(-1);
    } }
function pi(e, t) { let n = Ml() ? 64 : 1088; for (e[je].changeDetectionScheduler?.notify(t); e;) {
    e[N] |= n;
    let o = yt(e);
    if (st(e) && !o)
        return e;
    e = o;
} return null; }
function bv(e, t, n, o) { return [e, !0, 0, t, null, o, null, n, null, null]; }
function Av(e, t) { let n = G + t; if (n < e.length)
    return e[n]; }
function Po(e, t, n, o = !0) { let r = t[m]; if (jS(r, t, e, n), o) {
    let s = Fu(n, e), a = t[w], c = a.parentNode(e[Ke]);
    c !== null && sS(r, e[ce], a, t, c, s);
} let i = t[le]; i !== null && i.firstChild !== null && (i.firstChild = null); }
function cf(e, t) { let n = Vr(e, t); return n !== void 0 && fi(n[m], n), n; }
function Vr(e, t) { if (e.length <= G)
    return; let n = G + t, o = e[n]; if (o) {
    let r = o[jt];
    r !== null && r !== e && Xd(r, o), t > 0 && (e[n - 1][he] = o[he]);
    let i = sr(e, G + t);
    sv(o[m], o);
    let s = i[rt];
    s !== null && s.detachView(i[m]), o[Q] = null, o[he] = null, o[N] &= -129;
} return o; }
function jS(e, t, n, o) { let r = G + o, i = n.length; o > 0 && (n[r - 1][he] = t), o < i - G ? (t[he] = n[r], Zc(n, G + o, t)) : (n.push(t), t[he] = null), t[Q] = n; let s = t[jt]; s !== null && n !== s && Rv(s, t); let a = t[rt]; a !== null && a.insertView(e), ts(t), t[N] |= 128; }
function Rv(e, t) { let n = e[dn], o = t[Q]; if (ne(o))
    e[N] |= 2;
else {
    let r = o[Q][ee];
    t[ee] !== r && (e[N] |= 2);
} n === null ? e[dn] = [t] : n.push(t); }
var Zt = class {
    _lView;
    _cdRefInjectingView;
    _appRef = null;
    _attachedToViewContainer = !1;
    exhaustive;
    get rootNodes() { let t = this._lView, n = t[m]; return fo(n, t, n.firstChild, []); }
    constructor(t, n) { this._lView = t, this._cdRefInjectingView = n; }
    get context() { return this._lView[U]; }
    set context(t) { this._lView[U] = t; }
    get destroyed() { return at(this._lView); }
    destroy() { if (this._appRef)
        this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
        let t = this._lView[Q];
        if (K(t)) {
            let n = t[ur], o = n ? n.indexOf(this) : -1;
            o > -1 && (Vr(t, o), sr(n, o));
        }
        this._attachedToViewContainer = !1;
    } fi(this._lView[m], this._lView); }
    onDestroy(t) { pr(this._lView, t); }
    markForCheck() { pi(this._cdRefInjectingView || this._lView, 4); }
    detach() { this._lView[N] &= -129; }
    reattach() { ts(this._lView), this._lView[N] |= 128; }
    detectChanges() { this._lView[N] |= 1024, Mv(this._lView); }
    checkNoChanges() { }
    attachToViewContainerRef() { if (this._appRef)
        throw new D(902, !1); this._attachedToViewContainer = !0; }
    detachFromAppRef() { this._appRef = null; let t = st(this._lView), n = this._lView[jt]; n !== null && !t && Xd(n, this._lView), av(this._lView[m], this._lView); }
    attachToAppRef(t) { if (this._attachedToViewContainer)
        throw new D(902, !1); this._appRef = t; let n = st(this._lView), o = this._lView[jt]; o !== null && !n && Rv(o, this._lView), ts(this._lView); }
};
function VS(e) { return $n(e._lView) || !!(e._lView[N] & 64); }
function HS(e) { es(e._lView); }
var Hr = (() => { class e {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    static __NG_ELEMENT_ID__ = BS;
    constructor(n, o, r) { this._declarationLView = n, this._declarationTContainer = o, this.elementRef = r; }
    get ssrId() { return this._declarationTContainer.tView?.ssrId || null; }
    createEmbeddedView(n, o) { return this.createEmbeddedViewImpl(n, o); }
    createEmbeddedViewImpl(n, o, r) { let i = xo(this._declarationLView, this._declarationTContainer, n, { embeddedViewInjector: o, dehydratedView: r }); return new Zt(i); }
} return e; })();
function BS() { return Ba(_(), g()); }
function Ba(e, t) { return e.type & 4 ? new Hr(t, e, To(e, t)) : null; }
var Vu = "<-- AT THIS LOCATION";
function US(e) { switch (e) {
    case 4: return "view container";
    case 2: return "element";
    case 8: return "ng-container";
    case 32: return "icu";
    case 64: return "i18n";
    case 16: return "projection";
    case 1: return "text";
    case 128: return "@let";
    default: return "<unknown>";
} }
function $S(e, t) {
    let n = `During serialization, Angular was unable to find an element in the DOM:

`, o = `${zS(e, t, !1)}

`, r = ZS();
    throw new D(-502, n + o + r);
}
function kv(e) {
    let t = "During serialization, Angular detected DOM nodes that were created outside of Angular context and provided as projectable nodes (likely via `ViewContainerRef.createComponent` or `createComponent` APIs). Hydration is not supported for such cases, consider refactoring the code to avoid this pattern or using `ngSkipHydration` on the host element of the component.\n\n", n = `${QS(e)}

`, o = t + n + YS();
    return new D(-503, o);
}
function qS(e) { let t = []; if (e.attrs)
    for (let n = 0; n < e.attrs.length;) {
        let o = e.attrs[n++];
        if (typeof o == "number")
            break;
        let r = e.attrs[n++];
        t.push(`${o}="${Ws(r)}"`);
    } return t.join(" "); }
var GS = new Set(["ngh", "ng-version", "ng-server-context"]);
function WS(e) { let t = []; for (let n = 0; n < e.attributes.length; n++) {
    let o = e.attributes[n];
    GS.has(o.name) || t.push(`${o.name}="${Ws(o.value)}"`);
} return t.join(" "); }
function Ql(e, t = "\u2026") { switch (e.type) {
    case 1: return `#text${e.value ? `(${e.value})` : ""}`;
    case 2:
        let o = qS(e), r = e.value.toLowerCase();
        return `<${r}${o ? " " + o : ""}>${t}</${r}>`;
    case 8: return "<!-- ng-container -->";
    case 4: return "<!-- container -->";
    default: return `#node(${US(e.type)})`;
} }
function ws(e, t = "\u2026") { let n = e; switch (n.nodeType) {
    case Node.ELEMENT_NODE:
        let o = n.tagName.toLowerCase(), r = WS(n);
        return `<${o}${r ? " " + r : ""}>${t}</${o}>`;
    case Node.TEXT_NODE:
        let i = n.textContent ? Ws(n.textContent) : "";
        return `#text${i ? `(${i})` : ""}`;
    case Node.COMMENT_NODE: return `<!-- ${Ws(n.textContent ?? "")} -->`;
    default: return `#node(${n.nodeType})`;
} }
function zS(e, t, n) {
    let r = "";
    t.prev ? (r += `  \u2026
`, r += "  " + Ql(t.prev) + `
`) : t.type && t.type & 12 && (r += `  \u2026
`), n ? (r += "  " + Ql(t) + `
`, r += `  <!-- container -->  ${Vu}
`) : r += "  " + Ql(t) + `  ${Vu}
`, r += `  \u2026
`;
    let i = t.type ? ef(e[m], t, e) : null;
    return i && (r = ws(i, `
` + r)), r;
}
function QS(e) {
    let n = "", o = e;
    return o.previousSibling && (n += `  \u2026
`, n += "  " + ws(o.previousSibling) + `
`), n += "  " + ws(o) + `  ${Vu}
`, e.nextSibling && (n += `  \u2026
`), e.parentNode && (n = ws(o.parentNode, `
` + n)), n;
}
function ZS(e) {
    return `To fix this problem:
  * check ${e ? `the "${e}"` : "corresponding"} component for hydration-related issues
  * check to see if your template has valid HTML structure
  * or skip hydration by adding the \`ngSkipHydration\` attribute to its host node in a template

`;
}
function YS() {
    return `Note: attributes are only displayed to better represent the DOM but have no effect on hydration mismatches.

`;
}
function KS(e) { return e.replace(/\s+/gm, ""); }
function Ws(e, t = 50) { return e ? (e = KS(e), e.length > t ? `${e.substring(0, t - 1)}\u2026` : e) : ""; }
function Ov(e, t, n) { let o = t.insertBeforeIndex, r = Array.isArray(o) ? o[0] : o; return r === null ? uv(e, t, n) : L(n[r]); }
function xv(e, t, n, o, r) { let i = t.insertBeforeIndex; if (Array.isArray(i)) {
    let s = o, a = null;
    if (t.type & 3 || (a = s, s = r), s !== null && t.componentOffset === -1)
        for (let c = 1; c < i.length; c++) {
            let l = n[i[c]];
            Dn(e, s, l, a, !1);
        }
} }
function xn(e, t, n, o, r) { let i = e.data[t]; if (i === null)
    i = lf(e, t, n, o, r), xh() && (i.flags |= 32);
else if (i.type & 64) {
    i.type = n, i.value = o, i.attrs = r;
    let s = qn();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
} return ct(i, !0), i; }
function lf(e, t, n, o, r) { let i = Il(), s = Dl(), a = s ? i : i && i.parent, c = e.data[t] = XS(e, a, n, t, o, r); return JS(e, c, i, s), c; }
function JS(e, t, n, o) { e.firstChild === null && (e.firstChild = t), n !== null && (o ? n.child == null && t.parent !== null && (n.child = t) : n.next === null && (n.next = t, t.prev = n)); }
function XS(e, t, n, o, r, i) { let s = t ? t.injectorIndex : -1, a = 0; return hr() && (a |= 128), { type: n, index: o, insertBeforeIndex: null, injectorIndex: s, directiveStart: -1, directiveEnd: -1, directiveStylingLast: -1, componentOffset: -1, controlDirectiveIndex: -1, customControlIndex: -1, propertyBindings: null, flags: a, providerIndexes: 0, value: r, attrs: i, mergedAttrs: null, localNames: null, initialInputs: null, inputs: null, hostDirectiveInputs: null, outputs: null, hostDirectiveOutputs: null, directiveToIndex: null, tView: null, next: null, prev: null, projectionNext: null, child: null, parent: t, projection: null, styles: null, stylesWithoutHost: null, residualStyles: void 0, classes: null, classesWithoutHost: null, residualClasses: void 0, classBindings: 0, styleBindings: 0 }; }
function Pv(e, t) { if (e.push(t), e.length > 1)
    for (let n = e.length - 2; n >= 0; n--) {
        let o = e[n];
        Lv(o) || eb(o, t) && tb(o) === null && nb(o, t.index);
    } }
function Lv(e) { return !(e.type & 64); }
function eb(e, t) { return Lv(t) || e.index > t.index; }
function tb(e) { let t = e.insertBeforeIndex; return Array.isArray(t) ? t[0] : t; }
function nb(e, t) { let n = e.insertBeforeIndex; Array.isArray(n) ? n[0] = t : (fv(Ov, xv), e.insertBeforeIndex = t); }
function Cr(e, t) { let n = e.data[t]; return n === null || typeof n == "string" ? null : n.hasOwnProperty("currentCaseLViewIndex") ? n : n.value; }
function ob(e, t, n) { let o = e.data[t]; o === null ? e.data[t] = n : o.value = n; }
function rb(e, t) { let n = e.insertBeforeIndex; n === null ? (fv(Ov, xv), n = e.insertBeforeIndex = [null, t]) : (mh(Array.isArray(n), !0, "Expecting array here"), n.push(t)); }
function ib(e, t, n) { let o = lf(e, n, 64, null, null); return Pv(t, o), o; }
function Ua(e, t) { let n = t[e.currentCaseLViewIndex]; return n === null ? n : n < 0 ? ~n : n; }
function sb(e) { return e >>> 17; }
function ab(e) { return (e & 131070) >>> 1; }
function cb(e, t, n) { return e | t << 17 | n << 1; }
function Fv(e) { return e === -1; }
function uf(e, t, n) { e.index = 0; let o = Ua(t, n); o !== null ? e.removes = t.remove[o] : e.removes = F; }
function zs(e) { if (e.index < e.removes.length) {
    let t = e.removes[e.index++];
    if (t > 0)
        return e.lView[t];
    {
        e.stack.push(e.index, e.removes);
        let n = ~t, o = e.lView[m].data[n];
        return uf(e, o, e.lView), zs(e);
    }
}
else
    return e.stack.length === 0 ? (e.lView = void 0, null) : (e.removes = e.stack.pop(), e.index = e.stack.pop(), zs(e)); }
function lb() { let e = { stack: [], index: -1 }; function t(n, o) { for (e.lView = o; e.stack.length;)
    e.stack.pop(); return uf(e, n.value, o), zs.bind(null, e); } return t; }
function ub(e, t) { let n = { stack: [], index: -1, lView: t }; return uf(n, e, t), zs.bind(null, n); }
var db = new RegExp(`^(\\d+)*(${Ed}|${vd})*(.*)`);
function fb(e, t) { let n = [e]; for (let o of t) {
    let r = n.length - 1;
    if (r > 0 && n[r - 1] === o) {
        let i = n[r] || 1;
        n[r] = i + 1;
    }
    else
        n.push(o, "");
} return n.join(""); }
function pb(e) { let t = e.match(db), [n, o, r, i] = t, s = o ? parseInt(o, 10) : r, a = []; for (let [c, l, u] of i.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    a.push(l, d);
} return [s, ...a]; }
function hb(e) { return !e.prev && e.parent?.type === 8; }
function Zl(e) { return e.index - E; }
function Lo(e, t) { return !(e.type & 144) && !!t[e.index] && jv(L(t[e.index])); }
function jv(e) { return !!e && !e.isConnected; }
function Vv(e, t) { let n = e.i18nNodes; if (n)
    return n.get(t); }
function gb(e, t, n) { let r = e.data[oi]?.[n]; return r ? Hv(r, t) : null; }
function hi(e, t, n, o) { let r = Zl(o), i = Vv(e, r); if (i === void 0) {
    let s = e.data[oi];
    if (s?.[r])
        i = Hv(s[r], n);
    else if (t.firstChild === o)
        i = e.firstChild;
    else {
        let a = o.prev === null, c = o.prev ?? o.parent;
        if (hb(o)) {
            let l = Zl(o.parent);
            i = vu(e, l);
        }
        else {
            let l = ue(c, n);
            if (a)
                i = l.firstChild;
            else {
                let u = Zl(c), d = vu(e, u);
                if (c.type === 2 && d) {
                    let p = Rd(e, u) + 1;
                    i = $a(p, d);
                }
                else
                    i = l.nextSibling;
            }
        }
    }
} return i; }
function $a(e, t) { let n = t; for (let o = 0; o < e; o++)
    n = n.nextSibling; return n; }
function mb(e, t) { let n = e; for (let o = 0; o < t.length; o += 2) {
    let r = t[o], i = t[o + 1];
    for (let s = 0; s < i; s++)
        switch (r) {
            case Qm:
                n = n.firstChild;
                break;
            case Zm:
                n = n.nextSibling;
                break;
        }
} return n; }
function Hv(e, t) { let [n, ...o] = pb(e), r; if (n === vd)
    r = t[ee][$];
else if (n === Ed)
    r = Hd(t[ee][$]);
else {
    let i = Number(n);
    r = L(t[i + E]);
} return mb(r, o); }
function Hu(e, t) { if (e === t)
    return []; if (e.parentElement == null || t.parentElement == null)
    return null; if (e.parentElement === t.parentElement)
    return yb(e, t); {
    let n = t.parentElement, o = Hu(e, n), r = Hu(n.firstChild, t);
    return !o || !r ? null : [...o, Qm, ...r];
} }
function yb(e, t) { let n = [], o = null; for (o = e; o != null && o !== t; o = o.nextSibling)
    n.push(Zm); return o == null ? null : n; }
function yg(e, t, n) { let o = Hu(e, t); return o === null ? null : fb(n, o); }
function Bv(e, t, n) { let o = e.parent, r, i, s; for (; o !== null && (Lo(o, t) || n?.has(o.index));)
    o = o.parent; o === null || !(o.type & 3) ? (r = s = vd, i = t[ee][$]) : (r = o.index, i = L(t[r]), s = b(r - E)); let a = L(t[e.index]); if (e.type & 44) {
    let l = vn(t, e);
    l && (a = l);
} let c = yg(i, a, s); if (c === null && i !== a) {
    let l = i.ownerDocument.body;
    if (c = yg(l, a, Ed), c === null)
        throw $S(t, e);
} return c; }
function Uv(e, t) { let n = e.createNodeIterator(t, NodeFilter.SHOW_COMMENT, { acceptNode: vb }), o, r = new Map; for (; o = n.nextNode();) {
    let i = "ngh=", s = o?.textContent, a = s?.indexOf(i) ?? -1;
    if (a > -1) {
        let c = s.substring(a + i.length).trim();
        r.set(c, o);
    }
} return r; }
function vb(e) { return e.textContent?.trimStart().startsWith("ngh=") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }
var $v = !1, qv = () => { };
function df(e) { $v = e; }
function qa() { return $v; }
function Eb(e, t, n, o) { qv(e, t, n, o); }
function Gv() { qv = Mb; }
function Wv(e) { return e = e ?? v(ae), e.get(Td, !1); }
function zv(e, t) { let n = t.i18nChildren.get(e); return n === void 0 && (n = Ib(e), t.i18nChildren.set(e, n)), n; }
function Ib(e) { let t = new Set; function n(o) { switch (t.add(o.index), o.kind) {
    case 1:
    case 2: {
        for (let r of o.children)
            n(r);
        break;
    }
    case 3: {
        for (let r of o.cases)
            for (let i of r)
                n(i);
        break;
    }
} } for (let o = E; o < e.bindingStartIndex; o++) {
    let r = e.data[o];
    if (!(!r || !r.ast))
        for (let i of r.ast)
            n(i);
} return t.size === 0 ? null : t; }
function Qv(e, t, n) { if (!n.isI18nHydrationEnabled)
    return null; let o = e[m], r = o.data[t]; if (!r || !r.ast)
    return null; let i = o.data[r.parentTNodeIndex]; if (i && Fm(i))
    return null; let s = { caseQueue: [], disconnectedNodes: new Set, disjointNodes: new Set }; return Bu(e, s, n, r.ast), s.caseQueue.length === 0 && s.disconnectedNodes.size === 0 && s.disjointNodes.size === 0 ? null : s; }
function Bu(e, t, n, o) { let r = null; for (let i of o) {
    let s = Tb(e, t, n, i);
    s && (Db(r, s) && t.disjointNodes.add(i.index - E), r = s);
} return r; }
function Db(e, t) { return e && e.nextSibling !== t; }
function Tb(e, t, n, o) { let r = L(e[o.index]); if (!r || jv(r))
    return t.disconnectedNodes.add(o.index - E), null; let i = r; switch (o.kind) {
    case 0: {
        kd(n, i);
        break;
    }
    case 1:
    case 2: {
        Bu(e, t, n, o.children);
        break;
    }
    case 3: {
        let s = e[o.currentCaseLViewIndex];
        if (s != null) {
            let a = s < 0 ? ~s : s;
            t.caseQueue.push(a), Bu(e, t, n, o.cases[a]);
        }
        break;
    }
} return Cb(e, o); }
function Cb(e, t) { let o = e[m].data[t.index]; return aa(o) ? vn(e, o) : t.kind === 3 ? ub(o, e)() ?? L(e[t.index]) : L(e[t.index]) ?? null; }
function hn(e, t) { e.currentNode = t; }
function vr(e, t, n) { let o = n.index - E, { disconnectedNodes: r } = e, i = t.currentNode; return t.isConnected ? (e.i18nNodes.set(o, i), r.delete(o)) : r.add(o), i; }
function Yl(e, t) { let n = e.currentNode; for (let o = 0; o < t && n; o++)
    n = n?.nextSibling ?? null; return n; }
function Kl(e, t) { return { currentNode: t, isConnected: e.isConnected }; }
function Mb(e, t, n, o) { let r = e[le]; if (!r || !qa() || n && (Fm(n) || Da(r, n.index - E)))
    return; let i = e[m], s = i.data[t]; function a() { if (Fv(o)) {
    let p = hi(r, i, e, n);
    return n.type & 8 ? p : p.firstChild;
} return r?.firstChild; } let c = a(), l = gy(r) ?? new Set, u = r.i18nNodes ??= new Map, d = r.data[ga]?.[t - E] ?? [], f = r.dehydratedIcuData ??= new Map; Zn({ hydrationInfo: r, lView: e, i18nNodes: u, disconnectedNodes: l, caseQueue: d, dehydratedIcuData: f }, { currentNode: c, isConnected: !0 }, s.ast), r.disconnectedNodes = l.size === 0 ? null : l; }
function Zn(e, t, n) { if (Array.isArray(n)) {
    let o = t;
    for (let r of n) {
        let i = gb(e.hydrationInfo, e.lView, r.index - E);
        i && (o = Kl(t, i)), Zn(e, o, r);
    }
}
else {
    if (e.disconnectedNodes.has(n.index - E))
        return;
    switch (n.kind) {
        case 0: {
            let o = vr(e, t, n);
            hn(t, o?.nextSibling ?? null);
            break;
        }
        case 1: {
            Zn(e, Kl(t, t.currentNode?.firstChild ?? null), n.children);
            let o = vr(e, t, n);
            hn(t, o?.nextSibling ?? null);
            break;
        }
        case 2: {
            let o = n.index - E, { hydrationInfo: r } = e, i = py(r, o);
            switch (n.type) {
                case 0: {
                    let s = vr(e, t, n);
                    if (Fw(r, o)) {
                        Zn(e, t, n.children);
                        let a = Yl(t, 1);
                        hn(t, a);
                    }
                    else if (Zn(e, Kl(t, t.currentNode?.firstChild ?? null), n.children), hn(t, s?.nextSibling ?? null), i !== null) {
                        let a = Yl(t, i + 1);
                        hn(t, a);
                    }
                    break;
                }
                case 1: {
                    vr(e, t, n);
                    let s = Yl(t, i + 1);
                    hn(t, s);
                    break;
                }
            }
            break;
        }
        case 3: {
            let o = t.isConnected ? e.caseQueue.shift() : null, r = { currentNode: null, isConnected: !1 };
            for (let s = 0; s < n.cases.length; s++)
                Zn(e, s === o ? t : r, n.cases[s]);
            o !== null && e.dehydratedIcuData.set(n.index, { case: o, node: n });
            let i = vr(e, t, n);
            hn(t, i?.nextSibling ?? null);
            break;
        }
    }
} }
var Zv = () => { };
function Nb(e, t, n) { Zv(e, t, n); }
function Yv() { Zv = wb; }
function wb(e, t, n) { let o = e[le]?.dehydratedIcuData; o && o.get(t)?.case === n && o.delete(t); }
function _b(e) { let t = e[le]; if (t) {
    let { i18nNodes: n, dehydratedIcuData: o } = t;
    if (n && o) {
        let r = e[w];
        for (let i of o.values())
            Sb(r, n, i);
    }
    t.i18nNodes = void 0, t.dehydratedIcuData = void 0;
} }
function Sb(e, t, n) { for (let o of n.node.cases[n.case]) {
    let r = t.get(o.index - E);
    r && li(e, r, !1);
} }
function Ga(e) { let t = e[Re] ?? [], o = e[Q][w], r = []; for (let i of t)
    i.data[ma] !== void 0 ? r.push(i) : Kv(i, o); e[Re] = r; }
function bb(e) { let { lContainer: t } = e, n = t[Re]; if (n === null)
    return; let r = t[Q][w]; for (let i of n)
    Kv(i, r); }
function Kv(e, t) { let n = 0, o = e.firstChild; if (o) {
    let r = e.data[Mt];
    for (; n < r;) {
        let i = o.nextSibling;
        li(t, o, !1), o = i, n++;
    }
} }
function Wa(e) { Ga(e); let t = e[$]; ne(t) && Br(t); for (let n = G; n < e.length; n++)
    Br(e[n]); }
function Br(e) { _b(e); let t = e[m]; for (let n = E; n < t.bindingStartIndex; n++)
    if (K(e[n])) {
        let o = e[n];
        Wa(o);
    }
    else
        ne(e[n]) && Br(e[n]); }
function ff(e) { let t = e._views; for (let n of t) {
    let o = Ad(n);
    o !== null && o[$] !== null && (ne(o) ? Br(o) : Wa(o));
} }
function Ab(e, t, n, o) { e !== null && (n.cleanup(t), Wa(e.lContainer), ff(o)); }
function Rb(e, t) { let n = []; for (let o of t)
    for (let r = 0; r < (o[ni] ?? 1); r++) {
        let i = { data: o, firstChild: null };
        o[Mt] > 0 && (i.firstChild = e, e = $a(o[Mt], e)), n.push(i);
    } return [e, n]; }
var Jv = () => null, Xv = () => null;
function eE() { Jv = kb, Xv = Ob; }
function kb(e, t) { return nE(e, t) ? e[Re].shift() : (Ga(e), null); }
function Ur(e, t) { return Jv(e, t); }
function Ob(e, t, n) { if (t.tView.ssrId === null)
    return null; let o = Ur(e, t.tView.ssrId); return n[m].firstUpdatePass && o === null && xb(n, t), o; }
function tE(e, t, n) { return Xv(e, t, n); }
function xb(e, t) { let n = t; for (; n;) {
    if (vg(e, n))
        return;
    if ((n.flags & 256) === 256)
        break;
    n = n.prev;
} for (n = t.next; n && (n.flags & 512) === 512;) {
    if (vg(e, n))
        return;
    n = n.next;
} }
function nE(e, t) { let n = e[Re]; return !t || n === null || n.length === 0 ? !1 : n[0].data[ha] === t; }
function vg(e, t) { let n = t.tView?.ssrId; if (n == null)
    return !1; let o = e[t.index]; return K(o) && nE(o, n) ? (Ga(o), !0) : !1; }
var oE = class {
}, za = class {
}, Uu = class {
    resolveComponentFactory(t) { throw new D(917, !1); }
}, gi = class {
    static NULL = new Uu;
}, $r = class {
}, Pb = (() => { class e {
    destroyNode = null;
    static __NG_ELEMENT_ID__ = () => Lb();
} return e; })();
function Lb() { let e = g(), t = _(), n = ye(t.index, e); return (ne(n) ? n : e)[w]; }
var rE = (() => { class e {
    static \u0275prov = B({ token: e, providedIn: "root", factory: () => null });
} return e; })();
function pf(e) { return e.ngModule !== void 0; }
function gn(e) { return !!an(e); }
function vs(e) { return !!Qe(e); }
function Eg(e) { return !!be(e); }
function Mr(e) { return !!W(e); }
function Fb(e) { return W(e) ? "component" : be(e) ? "directive" : Qe(e) ? "pipe" : "type"; }
function jb(e, t) { if (er(e) && (e = x(e), !e))
    throw new Error(`Expected forwardRef function, imported from "${Pe(t)}", to return a standalone entity or NgModule but got "${Pe(e) || e}".`); if (an(e) == null) {
    let n = W(e) || be(e) || Qe(e);
    if (n != null) {
        if (!n.standalone) {
            let o = Fb(e);
            throw new Error(`The "${Pe(e)}" ${o}, imported from "${Pe(t)}", is not standalone. Does the ${o} have the standalone: false flag?`);
        }
    }
    else
        throw pf(e) ? new Error(`A module with providers was imported from "${Pe(t)}". Modules with providers are not supported in standalone components imports.`) : new Error(`The "${Pe(e)}" type, imported from "${Pe(t)}", must be a standalone component / directive / pipe or an NgModule. Did you forget to add the required @Component / @Directive / @Pipe or @NgModule annotation?`);
} }
var $u = class {
    ownerNgModule = new WeakMap;
    ngModulesWithSomeUnresolvedDecls = new Set;
    ngModulesScopeCache = new WeakMap;
    standaloneComponentsScopeCache = new WeakMap;
    resolveNgModulesDecls() { if (this.ngModulesWithSomeUnresolvedDecls.size !== 0) {
        for (let t of this.ngModulesWithSomeUnresolvedDecls) {
            let n = an(t);
            if (n?.declarations)
                for (let o of eo(n.declarations))
                    Mr(o) && this.ownerNgModule.set(o, t);
        }
        this.ngModulesWithSomeUnresolvedDecls.clear();
    } }
    getComponentDependencies(t, n) { this.resolveNgModulesDecls(); let o = W(t); if (o === null)
        throw new Error(`Attempting to get component dependencies for a type that is not a component: ${t}`); if (o.standalone) {
        let r = this.getStandaloneComponentScope(t, n);
        return r.compilation.isPoisoned ? { dependencies: [] } : { dependencies: [...r.compilation.directives, ...r.compilation.pipes, ...r.compilation.ngModules] };
    }
    else {
        if (!this.ownerNgModule.has(t))
            return { dependencies: [] };
        let r = this.getNgModuleScope(this.ownerNgModule.get(t));
        return r.compilation.isPoisoned ? { dependencies: [] } : { dependencies: [...r.compilation.directives, ...r.compilation.pipes] };
    } }
    registerNgModule(t, n) { if (!gn(t))
        throw new Error(`Attempting to register a Type which is not NgModule as NgModule: ${t}`); this.ngModulesWithSomeUnresolvedDecls.add(t); }
    clearScopeCacheFor(t) { this.ngModulesScopeCache.delete(t), this.standaloneComponentsScopeCache.delete(t); }
    getNgModuleScope(t) { if (this.ngModulesScopeCache.has(t))
        return this.ngModulesScopeCache.get(t); let n = this.computeNgModuleScope(t); return this.ngModulesScopeCache.set(t, n), n; }
    computeNgModuleScope(t) { let n = $i(t), o = { exported: { directives: new Set, pipes: new Set }, compilation: { directives: new Set, pipes: new Set } }; for (let r of eo(n.imports))
        if (gn(r)) {
            let i = this.getNgModuleScope(r);
            qt(i.exported.directives, o.compilation.directives), qt(i.exported.pipes, o.compilation.pipes);
        }
        else if (ir(r))
            if (Eg(r) || Mr(r))
                o.compilation.directives.add(r);
            else if (vs(r))
                o.compilation.pipes.add(r);
            else
                throw new D(980, "The standalone imported type is neither a component nor a directive nor a pipe");
        else {
            o.compilation.isPoisoned = !0;
            break;
        } if (!o.compilation.isPoisoned)
        for (let r of eo(n.declarations)) {
            if (gn(r) || ir(r)) {
                o.compilation.isPoisoned = !0;
                break;
            }
            vs(r) ? o.compilation.pipes.add(r) : o.compilation.directives.add(r);
        } for (let r of eo(n.exports))
        if (gn(r)) {
            let i = this.getNgModuleScope(r);
            qt(i.exported.directives, o.exported.directives), qt(i.exported.pipes, o.exported.pipes), qt(i.exported.directives, o.compilation.directives), qt(i.exported.pipes, o.compilation.pipes);
        }
        else
            vs(r) ? o.exported.pipes.add(r) : o.exported.directives.add(r); return o; }
    getStandaloneComponentScope(t, n) { if (this.standaloneComponentsScopeCache.has(t))
        return this.standaloneComponentsScopeCache.get(t); let o = this.computeStandaloneComponentScope(t, n); return this.standaloneComponentsScopeCache.set(t, o), o; }
    computeStandaloneComponentScope(t, n) { let o = { compilation: { directives: new Set([t]), pipes: new Set, ngModules: new Set } }; for (let r of Ze(n ?? [])) {
        let i = x(r);
        try {
            jb(i, t);
        }
        catch {
            return o.compilation.isPoisoned = !0, o;
        }
        if (gn(i)) {
            o.compilation.ngModules.add(i);
            let s = this.getNgModuleScope(i);
            if (s.exported.isPoisoned)
                return o.compilation.isPoisoned = !0, o;
            qt(s.exported.directives, o.compilation.directives), qt(s.exported.pipes, o.compilation.pipes);
        }
        else if (vs(i))
            o.compilation.pipes.add(i);
        else if (Eg(i) || Mr(i))
            o.compilation.directives.add(i);
        else
            return o.compilation.isPoisoned = !0, o;
    } return o; }
    isOrphanComponent(t) { let n = W(t); return !n || n.standalone ? !1 : (this.resolveNgModulesDecls(), !this.ownerNgModule.has(t)); }
};
function qt(e, t) { for (let n of e)
    t.add(n); }
var po = new $u, _s = {}, io = class {
    injector;
    parentInjector;
    constructor(t, n) { this.injector = t, this.parentInjector = n; }
    get(t, n, o) { let r = this.injector.get(t, _s, o); return r !== _s || n === _s ? r : this.parentInjector.get(t, n, o); }
};
function Qs(e, t, n) { let o = n ? e.styles : null, r = n ? e.classes : null, i = 0; if (t !== null)
    for (let s = 0; s < t.length; s++) {
        let a = t[s];
        if (typeof a == "number")
            i = a;
        else if (i == 1)
            r = Bi(r, a);
        else if (i == 2) {
            let c = a, l = t[++s];
            o = Bi(o, c + ": " + l + ";");
        }
    } n ? e.styles = o : e.stylesWithoutHost = o, n ? e.classes = r : e.classesWithoutHost = r; }
function Fo(e, t = 0) { let n = g(); if (n === null)
    return pe(e, t); let o = _(); return bm(o, n, x(e), t); }
function iE() { let e = "invalid"; throw new Error(e); }
function sE(e, t, n, o, r) { let i = o === null ? null : { "": -1 }, s = r(e, n); if (s !== null) {
    let a = s, c = null, l = null;
    for (let u of s)
        if (u.resolveHostDirectives !== null) {
            [a, c, l] = u.resolveHostDirectives(s);
            break;
        }
    Bb(e, t, n, a, i, c, l);
} i !== null && o !== null && Vb(n, o, i); }
function Vb(e, t, n) { let o = e.localNames = []; for (let r = 0; r < t.length; r += 2) {
    let i = n[t[r + 1]];
    if (i == null)
        throw new D(-301, !1);
    o.push(t[r], i);
} }
function Hb(e, t, n) { t.componentOffset = n, (e.components ??= []).push(t.index); }
function Bb(e, t, n, o, r, i, s) { let a = o.length, c = null; for (let f = 0; f < a; f++) {
    let p = o[f];
    c === null && He(p) && (c = p, Hb(e, n, f)), fu(Fs(n, t), e, p.type);
} zb(n, e.data.length, a), c?.viewProvidersResolver && c.viewProvidersResolver(c); for (let f = 0; f < a; f++) {
    let p = o[f];
    p.providersResolver && p.providersResolver(p);
} let l = !1, u = !1, d = di(e, t, a, null); a > 0 && (n.directiveToIndex = new Map); for (let f = 0; f < a; f++) {
    let p = o[f];
    if (n.mergedAttrs = lo(n.mergedAttrs, p.hostAttrs), $b(e, n, t, d, p), Wb(d, p, r), s !== null && s.has(p)) {
        let [y, I] = s.get(p);
        n.directiveToIndex.set(p.type, [d, y + n.directiveStart, I + n.directiveStart]);
    }
    else
        (i === null || !i.has(p)) && n.directiveToIndex.set(p.type, d);
    p.contentQueries !== null && (n.flags |= 4), (p.hostBindings !== null || p.hostAttrs !== null || p.hostVars !== 0) && (n.flags |= 64);
    let h = p.type.prototype;
    !l && (h.ngOnChanges || h.ngOnInit || h.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index), l = !0), !u && (h.ngOnChanges || h.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index), u = !0), d++;
} Ub(e, n, i); }
function Ub(e, t, n) { for (let o = t.directiveStart; o < t.directiveEnd; o++) {
    let r = e.data[o];
    if (n === null || !n.has(r))
        Ig(0, t, r, o), Ig(1, t, r, o), Tg(t, o, !1);
    else {
        let i = n.get(r);
        Dg(0, t, i, o), Dg(1, t, i, o), Tg(t, o, !0);
    }
} }
function Ig(e, t, n, o) { let r = e === 0 ? n.inputs : n.outputs; for (let i in r)
    if (r.hasOwnProperty(i)) {
        let s;
        e === 0 ? s = t.inputs ??= {} : s = t.outputs ??= {}, s[i] ??= [], s[i].push(o), aE(t, i);
    } }
function Dg(e, t, n, o) { let r = e === 0 ? n.inputs : n.outputs; for (let i in r)
    if (r.hasOwnProperty(i)) {
        let s = r[i], a;
        e === 0 ? a = t.hostDirectiveInputs ??= {} : a = t.hostDirectiveOutputs ??= {}, a[s] ??= [], a[s].push(o, i), aE(t, s);
    } }
function aE(e, t) { t === "class" ? e.flags |= 8 : t === "style" && (e.flags |= 16); }
function Tg(e, t, n) { let { attrs: o, inputs: r, hostDirectiveInputs: i } = e; if (o === null || !n && r === null || n && i === null || Bd(e)) {
    e.initialInputs ??= [], e.initialInputs.push(null);
    return;
} let s = null, a = 0; for (; a < o.length;) {
    let c = o[a];
    if (c === 0) {
        a += 4;
        continue;
    }
    else if (c === 5) {
        a += 2;
        continue;
    }
    else if (typeof c == "number")
        break;
    if (!n && r.hasOwnProperty(c)) {
        let l = r[c];
        for (let u of l)
            if (u === t) {
                s ??= [], s.push(c, o[a + 1]);
                break;
            }
    }
    else if (n && i.hasOwnProperty(c)) {
        let l = i[c];
        for (let u = 0; u < l.length; u += 2)
            if (l[u] === t) {
                s ??= [], s.push(l[u + 1], o[a + 1]);
                break;
            }
    }
    a += 2;
} e.initialInputs ??= [], e.initialInputs.push(s); }
function $b(e, t, n, o, r) { e.data[o] = r; let i = r.factory || (r.factory = xt(r.type, !0)), s = new In(i, He(r), Fo, null); e.blueprint[o] = s, n[o] = s, qb(e, t, o, di(e, n, r.hostVars, H), r); }
function qb(e, t, n, o, r) { let i = r.hostBindings; if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    Gb(s) != a && s.push(a), s.push(n, o, i);
} }
function Gb(e) { let t = e.length; for (; t > 0;) {
    let n = e[--t];
    if (typeof n == "number" && n < 0)
        return n;
} return 0; }
function Wb(e, t, n) { if (n) {
    if (t.exportAs)
        for (let o = 0; o < t.exportAs.length; o++)
            n[t.exportAs[o]] = e;
    He(t) && (n[""] = e);
} }
function zb(e, t, n) { e.flags |= 1, e.directiveStart = t, e.directiveEnd = t + n, e.providerIndexes = t; }
function hf(e, t, n, o, r, i, s, a) { let c = t[m], l = c.consts, u = ge(l, s), d = xn(c, e, n, o, u); return i && sE(c, t, d, ge(l, a), r), d.mergedAttrs = lo(d.mergedAttrs, d.attrs), d.attrs !== null && Qs(d, d.attrs, !1), d.mergedAttrs !== null && Qs(d, d.mergedAttrs, !0), c.queries !== null && c.queries.elementStart(c, d), d; }
function gf(e, t) { Em(e, t), il(t) && e.queries.elementEnd(t); }
function cE(e, t, n, o, r, i) { let s = t.consts, a = ge(s, r), c = xn(t, e, n, o, a); if (c.mergedAttrs = lo(c.mergedAttrs, c.attrs), i != null) {
    let l = ge(s, i);
    c.localNames = [];
    for (let u = 0; u < l.length; u += 2)
        c.localNames.push(l[u], -1);
} return c.attrs !== null && Qs(c, c.attrs, !1), c.mergedAttrs !== null && Qs(c, c.mergedAttrs, !0), t.queries !== null && t.queries.elementStart(t, c), c; }
function qr(e) { return Qa(e) ? Array.isArray(e) || !(e instanceof Map) && Symbol.iterator in e : !1; }
function Qb(e, t, n) { let o = e[Symbol.iterator](), r = t[Symbol.iterator](); for (;;) {
    let i = o.next(), s = r.next();
    if (i.done && s.done)
        return !0;
    if (i.done || s.done || !n(i.value, s.value))
        return !1;
} }
function lE(e, t) { if (Array.isArray(e))
    for (let n = 0; n < e.length; n++)
        t(e[n]);
else {
    let n = e[Symbol.iterator](), o;
    for (; !(o = n.next()).done;)
        t(o.value);
} }
function Qa(e) { return e !== null && (typeof e == "function" || typeof e == "object"); }
function uE(e, t) { let n = qr(e), o = qr(t); return n && o ? Qb(e, t, uE) : !n && (e && (typeof e == "object" || typeof e == "function")) && !o && (t && (typeof t == "object" || typeof t == "function")) ? !0 : Object.is(e, t); }
function et(e, t, n) { return e[t] = n; }
function jo(e, t) { return e[t]; }
function Y(e, t, n) { if (n === H)
    return !1; let o = e[t]; return Object.is(o, n) ? !1 : (e[t] = n, !0); }
function Nn(e, t, n, o) { let r = Y(e, t, n); return Y(e, t + 1, o) || r; }
function Za(e, t, n, o, r) { let i = Nn(e, t, n, o); return Y(e, t + 2, r) || i; }
function qe(e, t, n, o, r, i) { let s = Nn(e, t, n, o); return Nn(e, t + 2, r, i) || s; }
function Qt(e, t, n) { return function o(r) { let i = De(e) ? ye(e.index, t) : t; pi(i, 5); let s = t[U], a = Cg(t, s, n, r), c = o.__ngNextListenerFn__; for (; c;)
    a = Cg(t, s, c, r) && a, c = c.__ngNextListenerFn__; return a; }; }
function Cg(e, t, n, o) { let r = Yn(null); try {
    return V(k.OutputStart, t, n), n(o) !== !1;
}
catch (i) {
    return af(e, i), !1;
}
finally {
    V(k.OutputEnd, t, n), Yn(r);
} }
function mf(e, t, n, o, r, i, s, a) { let c = Un(e), l = !1, u = null; if (!o && c && (u = Yb(t, n, i, e.index)), u !== null) {
    let d = u.__ngLastListenerFn__ || u;
    d.__ngNextListenerFn__ = s, u.__ngLastListenerFn__ = s, l = !0;
}
else {
    let d = ue(e, n), f = o ? o(d) : d;
    Sw(n, f, i, a);
    let p = r.listen(f, i, a);
    if (!Zb(i)) {
        let h = o ? y => o(L(y[e.index])) : e.index;
        dE(h, t, n, i, a, p, !1);
    }
} return l; }
function Zb(e) { return e.startsWith("animation") || e.startsWith("transition"); }
function Yb(e, t, n, o) { let r = e.cleanup; if (r != null)
    for (let i = 0; i < r.length - 1; i += 2) {
        let s = r[i];
        if (s === n && r[i + 1] === o) {
            let a = t[Lt], c = r[i + 2];
            return a && a.length > c ? a[c] : null;
        }
        typeof s == "string" && (i += 2);
    } return null; }
function dE(e, t, n, o, r, i, s) { let a = t.firstCreatePass ? fl(t) : null, c = dl(n), l = c.length; c.push(r, i), a && a.push(o, e, l, (l + 1) * (s ? -1 : 1)); }
function Kb(e, t, n, o, r) { let i = Qt(e, t, n), s = Jb(e, t, o, r, i); }
function Jb(e, t, n, o, r) { let i = null, s = null, a = null, c = !1, l = e.directiveToIndex.get(n.type); if (typeof l == "number" ? i = l : [i, s, a] = l, s !== null && a !== null && e.hostDirectiveOutputs?.hasOwnProperty(o)) {
    let u = e.hostDirectiveOutputs[o];
    for (let d = 0; d < u.length; d += 2) {
        let f = u[d];
        if (f >= s && f <= a)
            c = !0, ho(e, t, f, u[d + 1], o, r);
        else if (f > a)
            break;
    }
} return n.outputs.hasOwnProperty(o) && (c = !0, ho(e, t, i, o, o, r)), c; }
function ho(e, t, n, o, r, i) { let s = t[n], a = t[m], l = a.data[n].outputs[o], d = s[l].subscribe(i); dE(e.index, a, t, r, i, d, !0); }
function fE() { pE(); }
function pE() { let e = g(), t = A(), n = _(); if (t.firstCreatePass && Xb(t, n), n.controlDirectiveIndex === -1)
    return; J("NgSignalForms"); let o = e[n.controlDirectiveIndex]; t.data[n.controlDirectiveIndex].controlDef.create(o, new Zs(e, t, n)); }
function hE() { gE(); }
function gE() { let e = g(), t = A(), n = ke(); if (n.controlDirectiveIndex === -1)
    return; let o = t.data[n.controlDirectiveIndex].controlDef, r = e[n.controlDirectiveIndex]; o.update(r, new Zs(e, t, n)); }
var Zs = class {
    lView;
    tView;
    tNode;
    hasPassThrough;
    constructor(t, n, o) { this.lView = t, this.tView = n, this.tNode = o, this.hasPassThrough = !!(o.flags & 4096); }
    get customControl() { return this.tNode.customControlIndex !== -1 ? this.lView[this.tNode.customControlIndex] : void 0; }
    get descriptor() { return `<${this.tNode.value}>`; }
    listenToCustomControlOutput(t, n) { mE(this.tView.data[this.tNode.customControlIndex], t) && ho(this.tNode, this.lView, this.tNode.customControlIndex, t, t, Qt(this.tNode, this.lView, n)); }
    listenToCustomControlModel(t) { let n = this.tNode.flags & 1024 ? "valueChange" : "checkedChange"; ho(this.tNode, this.lView, this.tNode.customControlIndex, n, n, Qt(this.tNode, this.lView, t)); }
    listenToDom(t, n) { mf(this.tNode, this.tView, this.lView, void 0, this.lView[w], t, n, Qt(this.tNode, this.lView, n)); }
    setInputOnDirectives(t, n) { let o = this.tNode.inputs?.[t], r = this.tNode.hostDirectiveInputs?.[t]; if (!o && !r)
        return !1; if (o)
        for (let i of o) {
            let s = this.tView.data[i], a = this.lView[i];
            zt(s, a, t, n);
        } if (r)
        for (let i = 0; i < r.length; i += 2) {
            let s = r[i], a = r[i + 1], c = this.tView.data[s], l = this.lView[s];
            zt(c, l, a, n);
        } return !0; }
    setCustomControlModelInput(t) { let n = this.lView[this.tNode.customControlIndex], o = this.tView.data[this.tNode.customControlIndex], r = this.tNode.flags & 1024 ? "value" : "checked"; zt(o, n, r, t); }
    customControlHasInput(t) { return this.tNode.customControlIndex === -1 ? !1 : this.tView.data[this.tNode.customControlIndex].inputs[t] != null; }
};
function Xb(e, t, n) { for (let r = t.directiveStart; r < t.directiveEnd; r++)
    if (e.data[r].controlDef) {
        t.controlDirectiveIndex = r;
        break;
    } if (t.controlDirectiveIndex === -1)
    return; let o = e.data[t.controlDirectiveIndex].controlDef; if (o.passThroughInput && (t.inputs?.[o.passThroughInput]?.length ?? 0) > 1) {
    t.flags |= 4096;
    return;
} eA(e, t); }
function eA(e, t) { for (let n = t.directiveStart; n < t.directiveEnd; n++) {
    let o = e.data[n];
    if (Mg(o, "value")) {
        t.flags |= 1024, t.customControlIndex = n;
        return;
    }
    if (Mg(o, "checked")) {
        t.flags |= 2048, t.customControlIndex = n;
        return;
    }
} }
function Mg(e, t) { return tA(e, t) && mE(e, t + "Change"); }
function tA(e, t) { return t in e.inputs; }
function mE(e, t) { return t in e.outputs; }
var Ct = Symbol("BINDING"), Ng = { kind: "input", requiredVars: 1 }, nA = { kind: "output", requiredVars: 0 };
function wg(e, t, n) { let o = g(), r = ve(); if (Y(o, r, n)) {
    let i = o[m], s = ke(), a = ye(s.index, o);
    pi(a, 1);
    let c = i.directiveRegistry[e], l = CS(s, i, o, c, t, n);
} }
function yE(e, t) { if (e === "formField") {
    let o = { [Ct]: Ng, create: () => { pE(); }, update: () => { wg(o.targetIdx, e, t()), gE(); } };
    return o;
} let n = { [Ct]: Ng, update: () => wg(n.targetIdx, e, t()) }; return n; }
function vE(e, t) { let n = { [Ct]: nA, create: () => { let o = g(), r = _(), s = o[m].directiveRegistry[n.targetIdx]; Kb(r, o, t, s, e); } }; return n; }
function oA(e, t) { let n = yE(e, t), o = vE(e + "Change", i => t.set(i)); return { [Ct]: { kind: "twoWay", requiredVars: n[Ct].requiredVars + o[Ct].requiredVars }, set targetIdx(i) { n.targetIdx = i, o.targetIdx = i; }, create: o.create, update: n.update }; }
function rA(e) { let t = e; for (; t;) {
    let n = XN(t);
    if (n !== null)
        for (let o = E; o < n.length; o++) {
            let r = n[o];
            if (!ne(r) && !K(r) || r[$] !== t)
                continue;
            let i = n[m], s = Vt(i, o);
            if (De(s)) {
                let a = i.data[s.directiveStart + s.componentOffset], c = yf(a);
                if (c !== null)
                    return c;
                break;
            }
        }
    t = t.parentNode;
} return null; }
function yf(e) { return e.debugInfo?.className || e.type.name || null; }
var Ys = class extends gi {
    ngModule;
    constructor(t) { super(), this.ngModule = t; }
    resolveComponentFactory(t) { let n = W(t); return new Yt(n, this.ngModule); }
};
function iA(e) { return Object.keys(e).map(t => { let [n, o, r] = e[t], i = { propName: n, templateName: t, isSignal: (o & Na.SignalBased) !== 0 }; return r && (i.transform = r), i; }); }
function sA(e) { return Object.keys(e).map(t => ({ propName: e[t], templateName: t })); }
function aA(e, t, n) { let o = t instanceof _e ? t : t?.injector; return o && e.getStandaloneInjector !== null && (o = e.getStandaloneInjector(o) || o), o ? new io(n, o) : n; }
function cA(e) { let t = e.get($r, null); if (t === null)
    throw new D(407, !1); let n = e.get(rE, null), o = e.get(xe, null), r = e.get(On, null, { optional: !0 }); return { rendererFactory: t, sanitizer: n, changeDetectionScheduler: o, ngReflect: !1, tracingService: r }; }
function lA(e, t) { let n = EE(e); return Ca(t, n, n === "svg" ? al : n === "math" ? cl : null); }
function EE(e) { return (e.selectors[0][0] || "div").toLowerCase(); }
var Yt = class extends za {
    componentDef;
    ngModule;
    selector;
    componentType;
    ngContentSelectors;
    isBoundToModule;
    cachedInputs = null;
    cachedOutputs = null;
    get inputs() { return this.cachedInputs ??= iA(this.componentDef.inputs), this.cachedInputs; }
    get outputs() { return this.cachedOutputs ??= sA(this.componentDef.outputs), this.cachedOutputs; }
    constructor(t, n) { super(), this.componentDef = t, this.ngModule = n, this.componentType = t.type, this.selector = B_(t.selectors), this.ngContentSelectors = t.ngContentSelectors ?? [], this.isBoundToModule = !!n; }
    create(t, n, o, r, i, s) { V(k.DynamicComponentStart); let a = R(null); try {
        let c = this.componentDef, l = aA(c, r || this.ngModule, t), u = cA(l), d = u.tracingService;
        return d && d.componentCreate ? d.componentCreate(yf(c), () => this.createComponentRef(u, l, n, o, i, s)) : this.createComponentRef(u, l, n, o, i, s);
    }
    finally {
        R(a);
    } }
    createComponentRef(t, n, o, r, i, s) { let a = this.componentDef, c = uA(r, a, s, i), l = t.rendererFactory.createRenderer(null, a), u = r ? hS(l, r, a.encapsulation, n) : lA(a, l), d = s?.some(_g) || i?.some(h => typeof h != "function" && h.bindings.some(_g)), f = Ma(null, c, null, 512 | $d(a), null, null, t, l, n, null, dy(u, n, !0)); f[E] = u, as(f); let p = null; try {
        let h = hf(E, f, 2, "#host", () => c.directiveRegistry, !0, 0);
        Ly(l, u, h), Ue(u, f), xa(c, f, h), Od(c, h, f), gf(c, h), o !== void 0 && fA(h, this.ngContentSelectors, o), p = ye(h.index, f), f[U] = p[U], Va(c, f, null);
    }
    catch (h) {
        throw p !== null && hu(p), hu(f), h;
    }
    finally {
        V(k.DynamicComponentEnd), cs();
    } return new Ks(this.componentType, f, !!d); }
};
function uA(e, t, n, o) { let r = e ? ["ng-version", "21.2.6"] : U_(t.selectors[0]), i = null, s = null, a = 0; if (n)
    for (let u of n)
        a += u[Ct].requiredVars, u.create && (u.targetIdx = 0, (i ??= []).push(u)), u.update && (u.targetIdx = 0, (s ??= []).push(u)); if (o)
    for (let u = 0; u < o.length; u++) {
        let d = o[u];
        if (typeof d != "function")
            for (let f of d.bindings) {
                a += f[Ct].requiredVars;
                let p = u + 1;
                f.create && (f.targetIdx = p, (i ??= []).push(f)), f.update && (f.targetIdx = p, (s ??= []).push(f));
            }
    } let c = [t]; if (o)
    for (let u of o) {
        let d = typeof u == "function" ? u : u.type, f = be(d);
        c.push(f);
    } return Ud(0, null, dA(i, s), 1, a, c, null, null, null, [r], null); }
function dA(e, t) { return !e && !t ? null : n => { if (n & 1 && e)
    for (let o of e)
        o.create(); if (n & 2 && t)
    for (let o of t)
        o.update(); }; }
function _g(e) { let t = e[Ct].kind; return t === "input" || t === "twoWay"; }
var Ks = class extends oE {
    _rootLView;
    _hasInputBindings;
    instance;
    hostView;
    changeDetectorRef;
    componentType;
    location;
    previousInputValues = null;
    _tNode;
    constructor(t, n, o) { super(), this._rootLView = n, this._hasInputBindings = o, this._tNode = Vt(n[m], E), this.location = To(this._tNode, n), this.instance = ye(this._tNode.index, n)[U], this.hostView = this.changeDetectorRef = new Zt(n, void 0), this.componentType = t; }
    setInput(t, n) { this._hasInputBindings; let o = this._tNode; if (this.previousInputValues ??= new Map, this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n))
        return; let r = this._rootLView, i = ja(o, r[m], r, t, n); this.previousInputValues.set(t, n); let s = ye(o.index, r); pi(s, 1); }
    get injector() { return new Wt(this._tNode, this._rootLView); }
    destroy() { this.hostView.destroy(); }
    onDestroy(t) { this.hostView.onDestroy(t); }
};
function fA(e, t, n) { let o = e.projection = []; for (let r = 0; r < t.length; r++) {
    let i = n[r];
    o.push(i != null && i.length ? Array.from(i) : null);
} }
var Ya = (() => { class e {
    static __NG_ELEMENT_ID__ = pA;
} return e; })();
function pA() { let e = _(); return IE(e, g()); }
var qu = class e extends Ya {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(t, n, o) { super(), this._lContainer = t, this._hostTNode = n, this._hostLView = o; }
    get element() { return To(this._hostTNode, this._hostLView); }
    get injector() { return new Wt(this._hostTNode, this._hostLView); }
    get parentInjector() { let t = hd(this._hostTNode, this._hostLView); if (Cm(t)) {
        let n = Ps(t, this._hostLView), o = xs(t), r = n[m].data[o + 8];
        return new Wt(r, n);
    }
    else
        return new Wt(null, this._hostLView); }
    clear() { for (; this.length > 0;)
        this.remove(this.length - 1); }
    get(t) { let n = Sg(this._lContainer); return n !== null && n[t] || null; }
    get length() { return this._lContainer.length - G; }
    createEmbeddedView(t, n, o) { let r, i; typeof o == "number" ? r = o : o != null && (r = o.index, i = o.injector); let s = Ur(this._lContainer, t.ssrId), a = t.createEmbeddedViewImpl(n || {}, i, s); return this.insertImpl(a, r, Mn(this._hostTNode, s)), a; }
    createComponent(t, n, o, r, i, s, a) { let c = t && !Ir(t), l; if (c)
        l = n;
    else {
        let I = n || {};
        l = I.index, o = I.injector, r = I.projectableNodes, i = I.environmentInjector || I.ngModuleRef, s = I.directives, a = I.bindings;
    } let u = c ? t : new Yt(W(t)), d = o || this.parentInjector; if (!i && u.ngModule == null) {
        let C = (c ? d : this.parentInjector).get(_e, null);
        C && (i = C);
    } let f = W(u.componentType ?? {}), p = Ur(this._lContainer, f?.id ?? null), h = p?.firstChild ?? null, y = u.create(d, r, h, i, s, a); return this.insertImpl(y.hostView, l, Mn(this._hostTNode, p)), y; }
    insert(t, n) { return this.insertImpl(t, n, !0); }
    insertImpl(t, n, o) { let r = t._lView; if (bh(r)) {
        let a = this.indexOf(t);
        if (a !== -1)
            this.detach(a);
        else {
            let c = r[Q], l = new e(c, c[ce], c[Q]);
            l.detach(l.indexOf(t));
        }
    } let i = this._adjustIndex(n), s = this._lContainer; return Po(s, r, i, o), t.attachToViewContainerRef(), Zc(Jl(s), i, t), t; }
    move(t, n) { return this.insert(t, n); }
    indexOf(t) { let n = Sg(this._lContainer); return n !== null ? n.indexOf(t) : -1; }
    remove(t) { let n = this._adjustIndex(t, -1), o = Vr(this._lContainer, n); o && (sr(Jl(this._lContainer), n), fi(o[m], o)); }
    detach(t) { let n = this._adjustIndex(t, -1), o = Vr(this._lContainer, n); return o && sr(Jl(this._lContainer), n) != null ? new Zt(o) : null; }
    _adjustIndex(t, n = 0) { return t ?? this.length + n; }
};
function Sg(e) { return e[ur]; }
function Jl(e) { return e[ur] || (e[ur] = []); }
function IE(e, t) { let n, o = t[e.index]; return K(o) ? n = o : (n = bv(o, t, null, e), t[e.index] = n, qd(t, n)), DE(n, t, e, o), new qu(n, e, t); }
function hA(e, t) { let n = e[w], o = n.createComment(""), r = ue(t, e), i = n.parentNode(r); return Dn(n, i, o, n.nextSibling(r), !1), o; }
var DE = CE, vf = () => !1;
function TE(e, t, n) { return vf(e, t, n); }
function CE(e, t, n, o) { if (e[Ke])
    return; let r; n.type & 8 ? r = L(o) : r = hA(t, n), e[Ke] = r; }
function gA(e, t, n) { if (e[Ke] && e[Re])
    return !0; let o = n[le], r = t.index - E; if (!o || Mo(t) || Da(o, r))
    return !1; let s = vu(o, r), a = o.data[wo]?.[r], [c, l] = Rb(s, a); return e[Ke] = c, e[Re] = l, !0; }
function mA(e, t, n, o) { vf(e, n, t) || CE(e, t, n, o); }
function ME() { DE = mA, vf = gA; }
var Gu = class e {
    queryList;
    matches = null;
    constructor(t) { this.queryList = t; }
    clone() { return new e(this.queryList); }
    setDirty() { this.queryList.setDirty(); }
}, Wu = class e {
    queries;
    constructor(t = []) { this.queries = t; }
    createEmbeddedView(t) { let n = t.queries; if (n !== null) {
        let o = t.contentQueries !== null ? t.contentQueries[0] : n.length, r = [];
        for (let i = 0; i < o; i++) {
            let s = n.getByIndex(i), a = this.queries[s.indexInDeclarationView];
            r.push(a.clone());
        }
        return new e(r);
    } return null; }
    insertView(t) { this.dirtyQueriesWithMatches(t); }
    detachView(t) { this.dirtyQueriesWithMatches(t); }
    finishViewCreation(t) { this.dirtyQueriesWithMatches(t); }
    dirtyQueriesWithMatches(t) { for (let n = 0; n < this.queries.length; n++)
        If(t, n).matches !== null && this.queries[n].setDirty(); }
}, Js = class {
    flags;
    read;
    predicate;
    constructor(t, n, o = null) { this.flags = n, this.read = o, typeof t == "string" ? this.predicate = DA(t) : this.predicate = t; }
}, zu = class e {
    queries;
    constructor(t = []) { this.queries = t; }
    elementStart(t, n) { for (let o = 0; o < this.queries.length; o++)
        this.queries[o].elementStart(t, n); }
    elementEnd(t) { for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementEnd(t); }
    embeddedTView(t) { let n = null; for (let o = 0; o < this.length; o++) {
        let r = n !== null ? n.length : 0, i = this.getByIndex(o).embeddedTView(t, r);
        i && (i.indexInDeclarationView = o, n !== null ? n.push(i) : n = [i]);
    } return n !== null ? new e(n) : null; }
    template(t, n) { for (let o = 0; o < this.queries.length; o++)
        this.queries[o].template(t, n); }
    getByIndex(t) { return this.queries[t]; }
    get length() { return this.queries.length; }
    track(t) { this.queries.push(t); }
}, Qu = class e {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = !1;
    _declarationNodeIndex;
    _appliesToNextNode = !0;
    constructor(t, n = -1) { this.metadata = t, this._declarationNodeIndex = n; }
    elementStart(t, n) { this.isApplyingToNode(n) && this.matchTNode(t, n); }
    elementEnd(t) { this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1); }
    template(t, n) { this.elementStart(t, n); }
    embeddedTView(t, n) { return this.isApplyingToNode(t) ? (this.crossesNgTemplate = !0, this.addMatch(-t.index, n), new e(this.metadata)) : null; }
    isApplyingToNode(t) { if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex, o = t.parent;
        for (; o !== null && o.type & 8 && o.index !== n;)
            o = o.parent;
        return n === (o !== null ? o.index : -1);
    } return this._appliesToNextNode; }
    matchTNode(t, n) { let o = this.metadata.predicate; if (Array.isArray(o))
        for (let r = 0; r < o.length; r++) {
            let i = o[r];
            this.matchTNodeWithReadOption(t, n, yA(n, i)), this.matchTNodeWithReadOption(t, n, Ms(n, t, i, !1, !1));
        }
    else
        o === Hr ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1) : this.matchTNodeWithReadOption(t, n, Ms(n, t, o, !1, !1)); }
    matchTNodeWithReadOption(t, n, o) { if (o !== null) {
        let r = this.metadata.read;
        if (r !== null)
            if (r === ei || r === Ya || r === Hr && n.type & 4)
                this.addMatch(n.index, -2);
            else {
                let i = Ms(n, t, r, !1, !1);
                i !== null && this.addMatch(n.index, i);
            }
        else
            this.addMatch(n.index, o);
    } }
    addMatch(t, n) { this.matches === null ? this.matches = [t, n] : this.matches.push(t, n); }
};
function yA(e, t) { let n = e.localNames; if (n !== null) {
    for (let o = 0; o < n.length; o += 2)
        if (n[o] === t)
            return n[o + 1];
} return null; }
function vA(e, t) { return e.type & 11 ? To(e, t) : e.type & 4 ? Ba(e, t) : null; }
function EA(e, t, n, o) { return n === -1 ? vA(t, e) : n === -2 ? IA(e, t, o) : Or(e, e[m], n, t); }
function IA(e, t, n) { if (n === ei)
    return To(t, e); if (n === Hr)
    return Ba(t, e); if (n === Ya)
    return IE(t, e); }
function NE(e, t, n, o) { let r = t[rt].queries[o]; if (r.matches === null) {
    let i = e.data, s = n.matches, a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
        let l = s[c];
        if (l < 0)
            a.push(null);
        else {
            let u = i[l];
            a.push(EA(t, u, s[c + 1], n.metadata.read));
        }
    }
    r.matches = a;
} return r.matches; }
function Zu(e, t, n, o) { let r = e.queries.getByIndex(n), i = r.matches; if (i !== null) {
    let s = NE(e, t, r, n);
    for (let a = 0; a < i.length; a += 2) {
        let c = i[a];
        if (c > 0)
            o.push(s[a / 2]);
        else {
            let l = i[a + 1], u = t[-c];
            for (let d = G; d < u.length; d++) {
                let f = u[d];
                f[jt] === f[Q] && Zu(f[m], f, l, o);
            }
            if (u[dn] !== null) {
                let d = u[dn];
                for (let f = 0; f < d.length; f++) {
                    let p = d[f];
                    Zu(p[m], p, l, o);
                }
            }
        }
    }
} return o; }
function Ef(e, t) { return e[rt].queries[t].queryList; }
function wE(e, t, n) { let o = new js((n & 4) === 4); return Ah(e, t, o, o.destroy), (t[rt] ??= new Wu).queries.push(new Gu(o)) - 1; }
function _E(e, t, n) { let o = A(); return o.firstCreatePass && (bE(o, new Js(e, t, n), -1), (t & 2) === 2 && (o.staticViewQueries = !0)), wE(o, g(), t); }
function SE(e, t, n, o) { let r = A(); if (r.firstCreatePass) {
    let i = _();
    bE(r, new Js(t, n, o), i.index), TA(r, e), (n & 2) === 2 && (r.staticContentQueries = !0);
} return wE(r, g(), n); }
function DA(e) { return e.split(",").map(t => t.trim()); }
function bE(e, t, n) { e.queries === null && (e.queries = new zu), e.queries.track(new Qu(t, n)); }
function TA(e, t) { let n = e.contentQueries || (e.contentQueries = []), o = n.length ? n[n.length - 1] : -1; t !== o && n.push(e.queries.length - 1, t); }
function If(e, t) { return e.queries.getByIndex(t); }
function AE(e, t) { let n = e[m], o = If(n, t); return o.crossesNgTemplate ? Zu(n, e, t, []) : NE(n, e, o, t); }
function Df(e, t, n) { let o, r = Oi(() => { o._dirtyCounter(); let i = CA(o, e); if (t && i === void 0)
    throw new D(-951, !1); return i; }); return o = r[se], o._dirtyCounter = $t(0), o._flatValue = void 0, r; }
function Tf(e) { return Df(!0, !1, e); }
function Cf(e) { return Df(!0, !0, e); }
function Mf(e) { return Df(!1, !1, e); }
function RE(e, t) { let n = e[se]; n._lView = g(), n._queryIndex = t, n._queryList = Ef(n._lView, t), n._queryList.onDirty(() => n._dirtyCounter.update(o => o + 1)); }
function CA(e, t) { let n = e._lView, o = e._queryIndex; if (n === void 0 || o === void 0 || n[N] & 4)
    return t ? void 0 : F; let r = Ef(n, o), i = AE(n, o); return r.reset(i, Pm), t ? r.first : r._changesDetected || e._flatValue === void 0 ? e._flatValue = r.toArray() : e._flatValue; }
var wn = new Map, Gr = new Set;
function kE(e) { return ze(this, null, function* () { let t = wn; wn = new Map; let n = new Map; function o(i) { let s = n.get(i); if (s)
    return s; let a = e(i).then(c => SA(i, c)); return n.set(i, a), a; } let r = Array.from(t).map(a => ze(null, [a], function* ([i, s]) { if (s.styleUrl && s.styleUrls?.length)
    throw new Error("@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"); let c = []; s.templateUrl && c.push(o(s.templateUrl).then(f => { s.template = f; })); let l = typeof s.styles == "string" ? [s.styles] : s.styles ?? []; s.styles = l; let { styleUrl: u, styleUrls: d } = s; if (u && (d = [u], s.styleUrl = void 0), d?.length) {
    let f = Promise.all(d.map(p => o(p))).then(p => { l.push(...p), s.styleUrls = void 0; });
    c.push(f);
} yield Promise.all(c), Gr.delete(i); })); yield Promise.all(r); }); }
function MA(e, t) { OE(t) && (wn.set(e, t), Gr.add(e)); }
function NA(e) { return Gr.has(e); }
function OE(e) { return !!(e.templateUrl && !e.hasOwnProperty("template") || e.styleUrls?.length || e.styleUrl); }
function wA() { let e = wn; return wn = new Map, e; }
function _A(e) { Gr.clear(); for (let t of e.keys())
    Gr.add(t); wn = e; }
function xE() { return wn.size === 0; }
function SA(e, t) { return ze(this, null, function* () { if (typeof t == "string")
    return t; if (t.status !== void 0 && t.status !== 200)
    throw new D(918, !1); return t.text(); }); }
var Yu = new Map, PE = !0;
function bA(e, t, n) { if (t && t !== n && PE)
    throw new D(921, !1); }
function Nf(e, t) { let n = Yu.get(t) || null; bA(t, n, e), Yu.set(t, e); }
function wf(e) { return Yu.get(e); }
function AA(e) { PE = !e; }
var go = class {
}, LE = class {
};
function FE(e, t) { return new mo(e, t ?? null, []); }
var RA = FE, mo = class extends go {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new Ys(this);
    constructor(t, n, o, r = !0) { super(), this.ngModuleType = t, this._parent = n; let i = an(t); this._bootstrapComponents = eo(i.bootstrap), this._r3Injector = Ol(t, n, [{ provide: go, useValue: this }, { provide: gi, useValue: this.componentFactoryResolver }, ...o], Jo(t), new Set(["environment"])), r && this.resolveInjectorInitializers(); }
    resolveInjectorInitializers() { this._r3Injector.resolveInjectorInitializers(), this.instance = this._r3Injector.get(this.ngModuleType); }
    get injector() { return this._r3Injector; }
    destroy() { let t = this._r3Injector; !t.destroyed && t.destroy(), this.destroyCbs.forEach(n => n()), this.destroyCbs = null; }
    onDestroy(t) { this.destroyCbs.push(t); }
}, yo = class extends LE {
    moduleType;
    constructor(t) { super(), this.moduleType = t; }
    create(t) { return new mo(this.moduleType, t, []); }
};
function jE(e, t, n) { return new mo(e, t, n, !1); }
var Wr = class extends go {
    injector;
    componentFactoryResolver = new Ys(this);
    instance = null;
    constructor(t) { super(); let n = new on([...t.providers, { provide: go, useValue: this }, { provide: gi, useValue: this.componentFactoryResolver }], t.parent || Bn(), t.debugName, new Set(["environment"])); this.injector = n, t.runEnvironmentInitializers && n.resolveInjectorInitializers(); }
    destroy() { this.injector.destroy(); }
    onDestroy(t) { this.injector.onDestroy(t); }
};
function _f(e, t, n = null) { return new Wr({ providers: e, parent: t, debugName: n, runEnvironmentInitializers: !0 }).injector; }
var kA = (() => { class e {
    _injector;
    cachedInjectors = new Map;
    constructor(n) { this._injector = n; }
    getOrCreateStandaloneInjector(n) { if (!n.standalone)
        return null; if (!this.cachedInjectors.has(n)) {
        let o = Zi(!1, n.type), r = o.length > 0 ? _f([o], this._injector, "") : null;
        this.cachedInjectors.set(n, r);
    } return this.cachedInjectors.get(n); }
    ngOnDestroy() { try {
        for (let n of this.cachedInjectors.values())
            n !== null && n.destroy();
    }
    finally {
        this.cachedInjectors.clear();
    } }
    static \u0275prov = B({ token: e, providedIn: "environment", factory: () => new e(pe(_e)) });
} return e; })();
function VE(e) { return ft(() => { let t = $E(e), n = we(z({}, t), { decls: e.decls, vars: e.vars, template: e.template, consts: e.consts || null, ngContentSelectors: e.ngContentSelectors, onPush: e.changeDetection === ua.OnPush, directiveDefs: null, pipeDefs: null, dependencies: t.standalone && e.dependencies || null, getStandaloneInjector: t.standalone ? r => r.get(kA).getOrCreateStandaloneInjector(n) : null, getExternalStyles: null, signals: e.signals ?? !1, data: e.data || {}, encapsulation: e.encapsulation || $e.Emulated, styles: e.styles || F, _: null, schemas: e.schemas || null, tView: null, id: "" }); t.standalone && J("NgStandalone"), qE(n); let o = e.dependencies; return n.directiveDefs = Xs(o, HE), n.pipeDefs = Xs(o, Qe), n.id = LA(n), n; }); }
function HE(e) { return W(e) || be(e); }
function Sf(e) { return ft(() => ({ type: e.type, bootstrap: e.bootstrap || F, declarations: e.declarations || F, imports: e.imports || F, exports: e.exports || F, transitiveCompileScopes: null, schemas: e.schemas || null, id: e.id || null })); }
function OA(e, t) { if (e == null)
    return Le; let n = {}; for (let o in e)
    if (e.hasOwnProperty(o)) {
        let r = e[o], i, s, a, c;
        Array.isArray(r) ? (a = r[0], i = r[1], s = r[2] ?? i, c = r[3] || null) : (i = r, s = r, a = Na.None, c = null), n[i] = [o, a, c], t[i] = s;
    } return n; }
function xA(e) { if (e == null)
    return Le; let t = {}; for (let n in e)
    e.hasOwnProperty(n) && (t[e[n]] = n); return t; }
function BE(e) { return ft(() => { let t = $E(e); return qE(t), t; }); }
function UE(e) { return { type: e.type, name: e.name, factory: null, pure: e.pure !== !1, standalone: e.standalone ?? !0, onDestroy: e.type.prototype.ngOnDestroy || null }; }
function $E(e) { let t = {}; return { type: e.type, providersResolver: null, viewProvidersResolver: null, factory: null, hostBindings: e.hostBindings || null, hostVars: e.hostVars || 0, hostAttrs: e.hostAttrs || null, contentQueries: e.contentQueries || null, declaredInputs: t, inputConfig: e.inputs || Le, exportAs: e.exportAs || null, standalone: e.standalone ?? !0, signals: e.signals === !0, selectors: e.selectors || F, viewQuery: e.viewQuery || null, features: e.features || null, setInput: null, resolveHostDirectives: null, hostDirectives: null, controlDef: null, inputs: OA(e.inputs, t), outputs: xA(e.outputs), debugInfo: null }; }
function qE(e) { e.features?.forEach(t => t(e)); }
function Xs(e, t) { return e ? () => { let n = typeof e == "function" ? e() : e, o = []; for (let r of n) {
    let i = t(r);
    i !== null && o.push(i);
} return o; } : null; }
var PA = new Map;
function LA(e) { let t = 0, n = typeof e.consts == "function" ? "" : e.consts, o = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, n, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery]; for (let i of o.join("|"))
    t = Math.imul(31, t) + i.charCodeAt(0) << 0; return t += 2147483648, "c" + t; }
function GE(e) { return t => { t.controlDef = { create: (n, o) => { n?.\u0275ngControlCreate(o); }, update: (n, o) => { n?.\u0275ngControlUpdate?.(o); }, passThroughInput: e }; }; }
function WE(e) { let t = n => { let o = Array.isArray(e); n.hostDirectives === null ? (n.resolveHostDirectives = FA, n.hostDirectives = o ? e.map(Ku) : [e]) : o ? n.hostDirectives.unshift(...e.map(Ku)) : n.hostDirectives.unshift(e); }; return t.ngInherit = !0, t; }
function FA(e) { let t = [], n = !1, o = null, r = null; for (let i = 0; i < e.length; i++) {
    let s = e[i];
    if (s.hostDirectives !== null) {
        let a = t.length;
        o ??= new Map, r ??= new Map, zE(s, t, o), r.set(s, [a, t.length - 1]);
    }
    i === 0 && He(s) && (n = !0, t.push(s));
} for (let i = n ? 1 : 0; i < e.length; i++)
    t.push(e[i]); return [t, o, r]; }
function zE(e, t, n) { if (e.hostDirectives !== null)
    for (let o of e.hostDirectives)
        if (typeof o == "function") {
            let r = o();
            for (let i of r)
                bg(Ku(i), t, n);
        }
        else
            bg(o, t, n); }
function bg(e, t, n) { let o = be(e.directive); jA(o.declaredInputs, e.inputs), zE(o, t, n), n.set(o, e), t.push(o); }
function Ku(e) { return typeof e == "function" ? { directive: x(e), inputs: Le, outputs: Le } : { directive: x(e.directive), inputs: Ag(e.inputs), outputs: Ag(e.outputs) }; }
function Ag(e) { if (e === void 0 || e.length === 0)
    return Le; let t = {}; for (let n = 0; n < e.length; n += 2)
    t[e[n]] = e[n + 1]; return t; }
function jA(e, t) { for (let n in t)
    if (t.hasOwnProperty(n)) {
        let o = t[n], r = e[n];
        e[o] = r;
    } }
function VA(e) { return Object.getPrototypeOf(e.prototype).constructor; }
function bf(e) { let t = VA(e.type), n = !0, o = [e]; for (; t;) {
    let r;
    if (He(e))
        r = t.\u0275cmp || t.\u0275dir;
    else {
        if (t.\u0275cmp)
            throw new D(903, !1);
        r = t.\u0275dir;
    }
    if (r) {
        if (n) {
            o.push(r);
            let s = e;
            s.inputs = Xl(e.inputs), s.declaredInputs = Xl(e.declaredInputs), s.outputs = Xl(e.outputs);
            let a = r.hostBindings;
            a && qA(e, a);
            let c = r.viewQuery, l = r.contentQueries;
            if (c && UA(e, c), l && $A(e, l), HA(e, r), gh(e.outputs, r.outputs), He(r) && r.data.animation) {
                let u = e.data;
                u.animation = (u.animation || []).concat(r.data.animation);
            }
        }
        let i = r.features;
        if (i)
            for (let s = 0; s < i.length; s++) {
                let a = i[s];
                a && a.ngInherit && a(e), a === bf && (n = !1);
            }
    }
    t = Object.getPrototypeOf(t);
} BA(o); }
function HA(e, t) { for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n))
        continue;
    let o = t.inputs[n];
    o !== void 0 && (e.inputs[n] = o, e.declaredInputs[n] = t.declaredInputs[n]);
} }
function BA(e) { let t = 0, n = null; for (let o = e.length - 1; o >= 0; o--) {
    let r = e[o];
    r.hostVars = t += r.hostVars, r.hostAttrs = lo(r.hostAttrs, n = lo(n, r.hostAttrs));
} }
function Xl(e) { return e === Le ? {} : e === F ? [] : e; }
function UA(e, t) { let n = e.viewQuery; n ? e.viewQuery = (o, r) => { t(o, r), n(o, r); } : e.viewQuery = t; }
function $A(e, t) { let n = e.contentQueries; n ? e.contentQueries = (o, r, i) => { t(o, r, i), n(o, r, i); } : e.contentQueries = t; }
function qA(e, t) { let n = e.hostBindings; n ? e.hostBindings = (o, r) => { t(o, r), n(o, r); } : e.hostBindings = t; }
function QE(e, t, n, o, r, i, s, a) { if (n.firstCreatePass) {
    e.mergedAttrs = lo(e.mergedAttrs, e.attrs);
    let u = e.tView = Ud(2, e, r, i, s, n.directiveRegistry, n.pipeRegistry, null, n.schemas, n.consts, null);
    n.queries !== null && (n.queries.template(n, e), u.queries = n.queries.embeddedTView(e));
} a && (e.flags |= a), ct(e, !1); let c = ZE(n, t, e, o); mr() && tf(n, t, c, e), Ue(c, t); let l = bv(c, t, c, e); t[o + E] = l, qd(t, l), TE(l, e, t); }
function GA(e, t, n, o, r, i, s, a, c, l, u) { let d = n + E, f; return t.firstCreatePass ? (f = xn(t, d, 4, s || null, a || null), os() && sE(t, e, f, ge(t.consts, l), sf), Em(t, f)) : f = t.data[d], QE(f, e, t, n, o, r, i, c), Un(f) && xa(t, e, f), l != null && Oo(e, f, u), f; }
function _n(e, t, n, o, r, i, s, a, c, l, u) { let d = n + E, f; if (t.firstCreatePass) {
    if (f = xn(t, d, 4, s || null, a || null), l != null) {
        let p = ge(t.consts, l);
        f.localNames = [];
        for (let h = 0; h < p.length; h += 2)
            f.localNames.push(p[h], -1);
    }
}
else
    f = t.data[d]; return QE(f, e, t, n, o, r, i, c), l != null && Oo(e, f, u), f; }
function Af(e, t, n, o, r, i, s, a) { let c = g(), l = A(), u = ge(l.consts, i); return GA(c, l, e, t, n, o, r, u, void 0, s, a), Af; }
function Rf(e, t, n, o, r, i, s, a) { let c = g(), l = A(), u = ge(l.consts, i); return _n(c, l, e, t, n, o, r, u, void 0, s, a), Rf; }
var ZE = YE;
function YE(e, t, n, o) { return Je(!0), t[w].createComment(""); }
function WA(e, t, n, o) { let r = !Ta(t, n); Je(r); let i = t[le]?.data[pa]?.[o] ?? null; if (i !== null && n.tView !== null && n.tView.ssrId === null && (n.tView.ssrId = i), r)
    return YE(e, t); let s = t[le], a = hi(s, e, t, n); Ia(s, o, a); let c = Rd(s, o); return $a(c, a); }
function KE() { ZE = WA; }
var oe = (function (e) { return e[e.NOT_STARTED = 0] = "NOT_STARTED", e[e.IN_PROGRESS = 1] = "IN_PROGRESS", e[e.COMPLETE = 2] = "COMPLETE", e[e.FAILED = 3] = "FAILED", e; })(oe || {}), Rg = 0, zA = 1, Z = (function (e) { return e[e.Placeholder = 0] = "Placeholder", e[e.Loading = 1] = "Loading", e[e.Complete = 2] = "Complete", e[e.Error = 3] = "Error", e; })(Z || {}), zr = (function (e) { return e[e.Initial = -1] = "Initial", e; })(zr || {}), so = 0, At = 1, Tr = 2, Es = 3, QA = 4, ZA = 5, Ka = 6, YA = 7, ao = 8, KA = 9, kf = (function (e) { return e[e.Manual = 0] = "Manual", e[e.Playthrough = 1] = "Playthrough", e; })(kf || {});
function mi(e, t, n) { let o = XE(e); t[o] === null && (t[o] = []), t[o].push(n); }
function Ss(e, t) { let n = XE(e), o = t[n]; if (o !== null) {
    for (let r of o)
        r();
    t[n] = null;
} }
function JE(e) { Ss(1, e), Ss(0, e), Ss(2, e); }
function XE(e) { let t = QA; return e === 1 ? t = ZA : e === 2 && (t = KA), t; }
function yi(e) { return e + 1; }
function Te(e, t) { let n = e[m], o = yi(t.index); return e[o]; }
function JA(e, t, n) { let o = e[m], r = yi(t); e[r] = n; }
function fe(e, t) { let n = yi(t.index); return e.data[n]; }
function XA(e, t, n) { let o = yi(t); e.data[o] = n; }
function eR(e, t, n) { let o = t[m], r = fe(o, n); switch (e) {
    case Z.Complete: return r.primaryTmplIndex;
    case Z.Loading: return r.loadingTmplIndex;
    case Z.Error: return r.errorTmplIndex;
    case Z.Placeholder: return r.placeholderTmplIndex;
    default: return null;
} }
function Ju(e, t) { return t === Z.Placeholder ? e.placeholderBlockConfig?.[Rg] ?? null : t === Z.Loading ? e.loadingBlockConfig?.[Rg] ?? null : null; }
function eI(e) { return e.loadingBlockConfig?.[zA] ?? null; }
function kg(e, t) { if (!e || e.length === 0)
    return t; let n = new Set(e); for (let o of t)
    n.add(o); return e.length === n.size ? e : Array.from(n); }
function tR(e, t) { let n = t.primaryTmplIndex + E; return Vt(e, n); }
function tI(e) { return e !== null && typeof e == "object" && typeof e.primaryTmplIndex == "number"; }
function nI(e, t) { let n = null, o = yi(t.index); return E < o && o < e.bindingStartIndex && (n = fe(e, t)), !!n && tI(n); }
function Of(e, t, n, o) { let r = n.get(q); return ww(e, () => r.run(t), i => r.runOutsideAngular(() => Nw(i)), o); }
function nR(e, t, n) { return n == null ? e : n >= 0 ? ul(n, e) : e[t.index][G] ?? null; }
function oR(e, t) { return fn(E + t, e); }
function Vo(e, t, n, o, r, i, s, a) { let c = e[P], l = c.get(q), u; function d() { if (at(e)) {
    u.destroy();
    return;
} let f = Te(e, t), p = f[At]; if (p !== zr.Initial && p !== Z.Placeholder) {
    u.destroy();
    return;
} let h = nR(e, t, o); if (!h || (u.destroy(), at(h)))
    return; let y = oR(h, n), I = r(y, () => { l.run(() => { e !== h && ns(h, I), i(); }); }, c, a); e !== h && pr(h, I), mi(s, f, I); } u = ov({ read: d }, { injector: c }); }
function Ja(e, t) { let n = t.get(sR), o = () => n.remove(e); return n.add(e), o; }
var rR = () => typeof requestIdleCallback < "u" ? requestIdleCallback : setTimeout, iR = () => typeof requestIdleCallback < "u" ? cancelIdleCallback : clearTimeout, sR = (() => { class e {
    executingCallbacks = !1;
    idleId = null;
    current = new Set;
    deferred = new Set;
    ngZone = v(q);
    requestIdleCallbackFn = rR().bind(globalThis);
    cancelIdleCallbackFn = iR().bind(globalThis);
    add(n) { (this.executingCallbacks ? this.deferred : this.current).add(n), this.idleId === null && this.scheduleIdleCallback(); }
    remove(n) { let { current: o, deferred: r } = this; o.delete(n), r.delete(n), o.size === 0 && r.size === 0 && this.cancelIdleCallback(); }
    scheduleIdleCallback() { let n = () => { this.cancelIdleCallback(), this.executingCallbacks = !0; for (let o of this.current)
        o(); if (this.current.clear(), this.executingCallbacks = !1, this.deferred.size > 0) {
        for (let o of this.deferred)
            this.current.add(o);
        this.deferred.clear(), this.scheduleIdleCallback();
    } }; this.idleId = this.requestIdleCallbackFn(() => this.ngZone.run(n)); }
    cancelIdleCallback() { this.idleId !== null && (this.cancelIdleCallbackFn(this.idleId), this.idleId = null); }
    ngOnDestroy() { this.cancelIdleCallback(), this.current.clear(), this.deferred.clear(); }
    static \u0275prov = B({ token: e, providedIn: "root", factory: () => new e });
} return e; })();
function Xa(e) { return (t, n) => oI(e, t, n); }
function oI(e, t, n) { let o = n.get(rI), r = n.get(q), i = () => o.remove(t); return o.add(e, t, r), i; }
var rI = (() => { class e {
    executingCallbacks = !1;
    timeoutId = null;
    invokeTimerAt = null;
    current = [];
    deferred = [];
    add(n, o, r) { let i = this.executingCallbacks ? this.deferred : this.current; this.addToQueue(i, Date.now() + n, o), this.scheduleTimer(r); }
    remove(n) { let { current: o, deferred: r } = this; this.removeFromQueue(o, n) === -1 && this.removeFromQueue(r, n), o.length === 0 && r.length === 0 && this.clearTimeout(); }
    addToQueue(n, o, r) { let i = n.length; for (let s = 0; s < n.length; s += 2)
        if (n[s] > o) {
            i = s;
            break;
        } Kc(n, i, o, r); }
    removeFromQueue(n, o) { let r = -1; for (let i = 0; i < n.length; i += 2)
        if (n[i + 1] === o) {
            r = i;
            break;
        } return r > -1 && Yc(n, r, 2), r; }
    scheduleTimer(n) { let o = () => { this.clearTimeout(), this.executingCallbacks = !0; let i = [...this.current], s = Date.now(); for (let c = 0; c < i.length; c += 2) {
        let l = i[c], u = i[c + 1];
        if (l <= s)
            u();
        else
            break;
    } let a = -1; for (let c = 0; c < this.current.length && this.current[c] <= s; c += 2)
        a = c + 1; if (a >= 0 && Yc(this.current, 0, a + 1), this.executingCallbacks = !1, this.deferred.length > 0) {
        for (let c = 0; c < this.deferred.length; c += 2) {
            let l = this.deferred[c], u = this.deferred[c + 1];
            this.addToQueue(this.current, l, u);
        }
        this.deferred.length = 0;
    } this.scheduleTimer(n); }; if (this.current.length > 0) {
        let i = Date.now(), s = this.current[0];
        if (this.timeoutId === null || this.invokeTimerAt && this.invokeTimerAt - s > 16) {
            this.clearTimeout();
            let a = Math.max(s - i, 16);
            this.invokeTimerAt = s, this.timeoutId = n.runOutsideAngular(() => setTimeout(() => n.run(o), a));
        }
    } }
    clearTimeout() { this.timeoutId !== null && (clearTimeout(this.timeoutId), this.timeoutId = null); }
    ngOnDestroy() { this.clearTimeout(), this.current.length = 0, this.deferred.length = 0; }
    static \u0275prov = B({ token: e, providedIn: "root", factory: () => new e });
} return e; })(), aR = (() => { class e {
    cachedInjectors = new Map;
    getOrCreateInjector(n, o, r, i) { if (!this.cachedInjectors.has(n)) {
        let s = r.length > 0 ? _f(r, o, i) : null;
        this.cachedInjectors.set(n, s);
    } return this.cachedInjectors.get(n); }
    ngOnDestroy() { try {
        for (let n of this.cachedInjectors.values())
            n !== null && n.destroy();
    }
    finally {
        this.cachedInjectors.clear();
    } }
    static \u0275prov = B({ token: e, providedIn: "environment", factory: () => new e });
} return e; })(), cR = new T("DEFER_BLOCK_DEPENDENCY_INTERCEPTOR"), iI = new T("");
function eu(e, t, n) { return e.get(aR).getOrCreateInjector(t, e, n, ""); }
function lR(e, t, n) { if (e instanceof io) {
    let r = e.injector, i = e.parentInjector, s = eu(i, t, n);
    return new io(r, s);
} let o = e.get(_e); if (o !== e) {
    let r = eu(o, t, n);
    return new io(e, r);
} return eu(e, t, n); }
function Tt(e, t, n, o = !1) { let r = n[Q], i = r[m]; if (at(r))
    return; let s = Te(r, t), a = s[At], c = s[YA]; if (!(c !== null && e < c) && xg(a, e) && xg(s[so] ?? -1, e)) {
    let l = fe(i, t), d = !o && (typeof ngServerMode > "u" || !ngServerMode) && (eI(l) !== null || Ju(l, Z.Loading) !== null || Ju(l, Z.Placeholder)) ? Xu : sI;
    try {
        d(e, s, n, t, r);
    }
    catch (f) {
        af(r, f);
    }
} }
function uR(e, t) { let n = e[Re]?.findIndex(r => r.data[ri] === t[At]) ?? -1; return { dehydratedView: n > -1 ? e[Re][n] : null, dehydratedViewIx: n }; }
function sI(e, t, n, o, r) { V(k.DeferBlockStateStart); let i = eR(e, r, o); if (i !== null) {
    t[At] = e;
    let s = r[m], a = i + E, c = Vt(s, a), l = 0;
    cf(n, l);
    let u;
    if (e === Z.Complete) {
        let h = fe(s, o), y = h.providers;
        y && y.length > 0 && (u = lR(r[P], h, y));
    }
    let { dehydratedView: d, dehydratedViewIx: f } = uR(n, t), p = xo(r, c, null, { injector: u, dehydratedView: d });
    if (Po(n, p, l, Mn(c, d)), pi(p, 2), f > -1 && n[Re]?.splice(f, 1), (e === Z.Complete || e === Z.Error) && Array.isArray(t[ao])) {
        for (let h of t[ao])
            h();
        t[ao] = null;
    }
} V(k.DeferBlockStateEnd); }
function dR(e, t, n, o, r) { let i = Date.now(), s = r[m], a = fe(s, o); if (t[Tr] === null || t[Tr] <= i) {
    t[Tr] = null;
    let c = eI(a), l = t[Es] !== null;
    if (e === Z.Loading && c !== null && !l) {
        t[so] = e;
        let u = Og(c, t, o, n, r);
        t[Es] = u;
    }
    else {
        e > Z.Loading && l && (t[Es](), t[Es] = null, t[so] = null), sI(e, t, n, o, r);
        let u = Ju(a, e);
        u !== null && (t[Tr] = i + u, Og(u, t, o, n, r));
    }
}
else
    t[so] = e; }
function Og(e, t, n, o, r) { return oI(e, () => { let s = t[so]; t[Tr] = null, t[so] = null, s !== null && Tt(s, n, o); }, r[P]); }
function xg(e, t) { return e < t; }
function Ho(e, t) { let n = e[t.index]; Tt(Z.Placeholder, t, n); }
function Pg(e, t, n) { e.loadingPromise.then(() => { e.loadingState === oe.COMPLETE ? Tt(Z.Complete, t, n) : e.loadingState === oe.FAILED && Tt(Z.Error, t, n); }); }
var Xu = null;
function aI(e, t, n, o) { let r = e.consts; n != null && (t.placeholderBlockConfig = ge(r, n)), o != null && (t.loadingBlockConfig = ge(r, o)), Xu === null && (Xu = dR); }
var bs = "__ngAsyncComponentMetadataFn__";
function fR(e) { return e[bs] ?? null; }
function cI(e, t, n) { let o = e; return o[bs] = () => Promise.all(t()).then(r => (n(...r), o[bs] = null, r)), o[bs]; }
function xf(e, t, n, o) { return ft(() => { let r = e; t !== null && (r.hasOwnProperty("decorators") && r.decorators !== void 0 ? r.decorators.push(...t) : r.decorators = t), n !== null && (r.ctorParameters = n), o !== null && (r.hasOwnProperty("propDecorators") && r.propDecorators !== void 0 ? r.propDecorators = z(z({}, r.propDecorators), o) : r.propDecorators = o); }); }
var pR = (() => { class e {
    log(n) { console.log(n); }
    warn(n) { console.warn(n); }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = B({ token: e, factory: e.\u0275fac, providedIn: "platform" });
} return e; })();
function Pf(e) { return typeof e == "function" && e[se] !== void 0; }
function Lf(e) { return Pf(e) && typeof e.set == "function"; }
function As(e, t) { let n = e[m]; for (let o = E; o < n.bindingStartIndex; o++)
    if (K(e[o])) {
        let r = e[o];
        if (!(o === n.bindingStartIndex - 1)) {
            let s = n.data[o], a = fe(n, s);
            if (tI(a)) {
                t.push({ lContainer: r, lView: e, tNode: s, tDetails: a });
                continue;
            }
        }
        ne(r[$]) && As(r[$], t);
        for (let s = G; s < r.length; s++)
            As(r[s], t);
    }
    else
        ne(e[o]) && As(e[o], t); }
function hR() { return J("Chrome DevTools profiling"), () => { }; }
function gR(e) { let t = e.get(Ut), n = e.get(_t), o = zm(t, n), r = {}; for (let [i, s] of Object.entries(o))
    bw(i) || (r[i] = s); return r; }
var Lg = "ng";
function mR(e, t) { yR(e, t); }
function yR(e, t) { if (typeof COMPILED > "u" || !COMPILED) {
    let n = Se;
    n[Lg] ??= {}, n[Lg][e] = t;
} }
var lI = new T(""), uI = new T(""), vR = (() => { class e {
    _ngZone;
    registry;
    _isZoneStable = !0;
    _callbacks = [];
    _taskTrackingZone = null;
    _destroyRef;
    constructor(n, o, r) { this._ngZone = n, this.registry = o, Ki() && (this._destroyRef = v(Be, { optional: !0 }) ?? void 0), Ff || (fI(r), r.addToWindow(o)), this._watchAngularEvents(), n.run(() => { this._taskTrackingZone = typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone"); }); }
    _watchAngularEvents() { let n = this._ngZone.onUnstable.subscribe({ next: () => { this._isZoneStable = !1; } }), o = this._ngZone.runOutsideAngular(() => this._ngZone.onStable.subscribe({ next: () => { q.assertNotInAngularZone(), queueMicrotask(() => { this._isZoneStable = !0, this._runCallbacksIfReady(); }); } })); this._destroyRef?.onDestroy(() => { n.unsubscribe(), o.unsubscribe(); }); }
    isStable() { return this._isZoneStable && !this._ngZone.hasPendingMacrotasks; }
    _runCallbacksIfReady() { if (this.isStable())
        queueMicrotask(() => { for (; this._callbacks.length !== 0;) {
            let n = this._callbacks.pop();
            clearTimeout(n.timeoutId), n.doneCb();
        } });
    else {
        let n = this.getPendingTasks();
        this._callbacks = this._callbacks.filter(o => o.updateCb && o.updateCb(n) ? (clearTimeout(o.timeoutId), !1) : !0);
    } }
    getPendingTasks() { return this._taskTrackingZone ? this._taskTrackingZone.macroTasks.map(n => ({ source: n.source, creationLocation: n.creationLocation, data: n.data })) : []; }
    addCallback(n, o, r) { let i = -1; o && o > 0 && (i = setTimeout(() => { this._callbacks = this._callbacks.filter(s => s.timeoutId !== i), n(); }, o)), this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: r }); }
    whenStable(n, o, r) { if (r && !this._taskTrackingZone)
        throw new Error('Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'); this.addCallback(n, o, r), this._runCallbacksIfReady(); }
    registerApplication(n) { this.registry.registerApplication(n, this); }
    unregisterApplication(n) { this.registry.unregisterApplication(n); }
    findProviders(n, o, r) { return []; }
    static \u0275fac = function (o) { return new (o || e)(pe(q), pe(dI), pe(uI)); };
    static \u0275prov = B({ token: e, factory: e.\u0275fac });
} return e; })(), dI = (() => { class e {
    _applications = new Map;
    registerApplication(n, o) { this._applications.set(n, o); }
    unregisterApplication(n) { this._applications.delete(n); }
    unregisterAllApplications() { this._applications.clear(); }
    getTestability(n) { return this._applications.get(n) || null; }
    getAllTestabilities() { return Array.from(this._applications.values()); }
    getAllRootElements() { return Array.from(this._applications.keys()); }
    findTestabilityInTree(n, o = !0) { return Ff?.findTestabilityInTree(this, n, o) ?? null; }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = B({ token: e, factory: e.\u0275fac, providedIn: "platform" });
} return e; })();
function fI(e) { Ff = e; }
var Ff;
function jf(e) { return !!e && typeof e.then == "function"; }
function pI(e) { return !!e && typeof e.subscribe == "function"; }
var Vf = new T("");
function hI(e) { return Ye([{ provide: Vf, multi: !0, useValue: e }]); }
var Hf = (() => { class e {
    resolve;
    reject;
    initialized = !1;
    done = !1;
    donePromise = new Promise((n, o) => { this.resolve = n, this.reject = o; });
    appInits = v(Vf, { optional: !0 }) ?? [];
    injector = v(ae);
    constructor() { }
    runInitializers() { if (this.initialized)
        return; let n = []; for (let r of this.appInits) {
        let i = Yi(this.injector, r);
        if (jf(i))
            n.push(i);
        else if (pI(i)) {
            let s = new Promise((a, c) => { i.subscribe({ complete: a, error: c }); });
            n.push(s);
        }
    } let o = () => { this.done = !0, this.resolve(); }; Promise.all(n).then(() => { o(); }).catch(r => { this.reject(r); }), n.length === 0 && o(), this.initialized = !0; }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = B({ token: e, factory: e.\u0275fac, providedIn: "root" });
} return e; })(), vi = new T("");
function Bf() { oh(() => { let e = ""; throw new D(600, e); }); }
function gI(e) { return e.isBoundToModule; }
var ER = 10;
function Uf(e, t) { return Array.isArray(t) ? t.reduce(Uf, e) : z(z({}, e), t); }
var Ge = (() => { class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = v(It);
    afterRenderManager = v(ba);
    zonelessEnabled = v(zn);
    rootEffectScheduler = v(us);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set;
    autoDetectTestViews = new Set;
    includeAllTestViews = !1;
    afterTick = new am;
    get allViews() { return [...(this.includeAllTestViews ? this.allTestViews : this.autoDetectTestViews).keys(), ...this._views]; }
    get destroyed() { return this._destroyed; }
    componentTypes = [];
    components = [];
    internalPendingTask = v(Et);
    get isStable() { return this.internalPendingTask.hasPendingTasksObservable.pipe(gN(n => !n)); }
    constructor() { v(On, { optional: !0 }); }
    whenStable() { let n; return new Promise(o => { n = this.isStable.subscribe({ next: r => { r && o(); } }); }).finally(() => { n.unsubscribe(); }); }
    _injector = v(_e);
    _rendererFactory = null;
    get injector() { return this._injector; }
    bootstrap(n, o) { return this.bootstrapImpl(n, o); }
    bootstrapImpl(n, o, r = ae.NULL) { return this._injector.get(q).run(() => { V(k.BootstrapComponentStart); let s = n instanceof za; if (!this._injector.get(Hf).done) {
        let h = "";
        throw new D(405, h);
    } let c; s ? c = n : c = this._injector.get(gi).resolveComponentFactory(n), this.componentTypes.push(c.componentType); let l = gI(c) ? void 0 : this._injector.get(go), u = o || c.selector, d = c.create(r, [], u, l), f = d.location.nativeElement, p = d.injector.get(lI, null); return p?.registerApplication(f), d.onDestroy(() => { this.detachView(d.hostView), Nr(this.components, d), p?.unregisterApplication(f); }), this._loadComponent(d), V(k.BootstrapComponentEnd, d), d; }); }
    tick() { this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick(); }
    _tick() { V(k.ChangeDetectionStart), this.tracingSnapshot !== null ? this.tracingSnapshot.run(Sa.CHANGE_DETECTION, this.tickImpl) : this.tickImpl(); }
    tickImpl = () => { if (this._runningTick)
        throw V(k.ChangeDetectionEnd), new D(101, !1); let n = R(null); try {
        this._runningTick = !0, this.synchronize();
    }
    finally {
        this._runningTick = !1, this.tracingSnapshot?.dispose(), this.tracingSnapshot = null, R(n), this.afterTick.next(), V(k.ChangeDetectionEnd);
    } };
    synchronize() { this._rendererFactory === null && !this._injector.destroyed && (this._rendererFactory = this._injector.get($r, null, { optional: !0 })); let n = 0; for (; this.dirtyFlags !== 0 && n++ < ER;) {
        V(k.ChangeDetectionSyncStart);
        try {
            this.synchronizeOnce();
        }
        finally {
            V(k.ChangeDetectionSyncEnd);
        }
    } }
    synchronizeOnce() { this.dirtyFlags & 16 && (this.dirtyFlags &= -17, this.rootEffectScheduler.flush()); let n = !1; if (this.dirtyFlags & 7) {
        let o = !!(this.dirtyFlags & 1);
        this.dirtyFlags &= -8, this.dirtyFlags |= 8;
        for (let { _lView: r } of this.allViews) {
            if (!o && !$n(r))
                continue;
            let i = o && !this.zonelessEnabled ? 0 : 1;
            Mv(r, i), n = !0;
        }
        if (this.dirtyFlags &= -5, this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23)
            return;
    } n || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()), this.dirtyFlags & 8 && (this.dirtyFlags &= -9, this.afterRenderManager.execute()), this.syncDirtyFlagsWithViews(); }
    syncDirtyFlagsWithViews() { if (this.allViews.some(({ _lView: n }) => $n(n))) {
        this.dirtyFlags |= 2;
        return;
    }
    else
        this.dirtyFlags &= -8; }
    attachView(n) { let o = n; this._views.push(o), o.attachToAppRef(this); }
    detachView(n) { let o = n; Nr(this._views, o), o.detachFromAppRef(); }
    _loadComponent(n) { this.attachView(n.hostView); try {
        this.tick();
    }
    catch (r) {
        this.internalErrorHandler(r);
    } this.components.push(n), this._injector.get(vi, []).forEach(r => r(n)); }
    ngOnDestroy() { if (!this._destroyed)
        try {
            this._destroyListeners.forEach(n => n()), this._views.slice().forEach(n => n.destroy());
        }
        finally {
            this._destroyed = !0, this._views = [], this._destroyListeners = [];
        } }
    onDestroy(n) { return this._destroyListeners.push(n), () => Nr(this._destroyListeners, n); }
    destroy() { if (this._destroyed)
        throw new D(406, !1); let n = this._injector; n.destroy && !n.destroyed && n.destroy(); }
    get viewCount() { return this._views.length; }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = B({ token: e, factory: e.\u0275fac, providedIn: "root" });
} return e; })();
function Nr(e, t) { let n = e.indexOf(t); n > -1 && e.splice(n, 1); }
function ec() { let e, t; return { promise: new Promise((o, r) => { e = o, t = r; }), resolve: e, reject: t }; }
function mI(e) { let t = g(), n = _(); if (Ho(t, n), !EI(0, t))
    return; let o = t[P], r = Te(t, n), i = e(() => Ce(0, t, n), o); mi(0, r, i); }
function yI(e) { if (typeof ngServerMode < "u" && ngServerMode)
    return; let t = g(), n = t[P], o = _(), r = t[m], i = fe(r, o); if (i.loadingState === oe.NOT_STARTED) {
    let s = Te(t, o), c = e(() => Ei(i, t, o), n);
    mi(1, s, c);
} }
function vI(e, t, n) { if (typeof ngServerMode < "u" && ngServerMode)
    return; let o = t[P], r = Te(t, n), i = r[Ka], s = e(() => Rt(o, i), o); mi(2, r, s); }
function Ei(e, t, n) { tc(e, t, n); }
function tc(e, t, n) { let o = t[P], r = t[m]; if (e.loadingState !== oe.NOT_STARTED)
    return e.loadingPromise ?? Promise.resolve(); let i = Te(t, n), s = tR(r, e); e.loadingState = oe.IN_PROGRESS, Ss(1, i); let a = e.dependencyResolverFn, c = o.get(yr).add(); return a ? (e.loadingPromise = Promise.allSettled(a()).then(l => { let u = !1, d = [], f = []; for (let p of l)
    if (p.status === "fulfilled") {
        let h = p.value, y = W(h) || be(h);
        if (y)
            d.push(y);
        else {
            let I = Qe(h);
            I && f.push(I);
        }
    }
    else {
        u = !0;
        break;
    } if (u) {
    if (e.loadingState = oe.FAILED, e.errorTmplIndex === null) {
        let h = new D(-750, !1);
        af(t, h);
    }
}
else {
    e.loadingState = oe.COMPLETE;
    let p = s.tView;
    if (d.length > 0) {
        p.directiveRegistry = kg(p.directiveRegistry, d);
        let h = d.map(I => I.type), y = Zi(!1, ...h);
        e.providers = y;
    }
    f.length > 0 && (p.pipeRegistry = kg(p.pipeRegistry, f));
} }), e.loadingPromise.finally(() => { e.loadingPromise = null, c(); })) : (e.loadingPromise = Promise.resolve().then(() => { e.loadingPromise = null, e.loadingState = oe.COMPLETE, c(); }), e.loadingPromise); }
function EI(e, t) { return !(e === 0 && typeof ngServerMode < "u" && ngServerMode || t[P].get(iI, null, { optional: !0 })?.behavior === kf.Manual); }
function Ce(e, t, n) { let o = t[m], r = t[n.index]; if (!EI(e, t))
    return; let i = Te(t, n), s = fe(o, n); switch (JE(i), s.loadingState) {
    case oe.NOT_STARTED:
        Tt(Z.Loading, n, r), tc(s, t, n), s.loadingState === oe.IN_PROGRESS && Pg(s, n, r);
        break;
    case oe.IN_PROGRESS:
        Tt(Z.Loading, n, r), Pg(s, n, r);
        break;
    case oe.COMPLETE:
        Tt(Z.Complete, n, r);
        break;
    case oe.FAILED:
        Tt(Z.Error, n, r);
        break;
    default:
} }
function Rt(e, t, n) { return ze(this, null, function* () { let o = e.get(St); if (o.hydrating.has(t))
    return; let { parentBlockPromise: i, hydrationQueue: s } = jw(t, e); if (s.length === 0)
    return; i !== null && s.shift(), TR(o, s), i !== null && (yield i); let a = s[0]; o.has(a) ? yield Fg(e, s, n) : o.awaitParentBlock(a, () => ze(null, null, function* () { return yield Fg(e, s, n); })); }); }
function Fg(e, t, n) { return ze(this, null, function* () { let o = e.get(St), r = o.hydrating, i = e.get(Et), s = i.add(); for (let c = 0; c < t.length; c++) {
    let l = t[c], u = o.get(l);
    if (u != null) {
        if (yield MR(u), yield CR(e), IR(u)) {
            bb(u), jg(t.slice(c), o);
            break;
        }
        r.get(l).resolve();
    }
    else {
        DR(c, t, o), jg(t.slice(c), o);
        break;
    }
} let a = t[t.length - 1]; yield r.get(a)?.promise, i.remove(s), n && n(t), Ab(o.get(a), t, o, e.get(Ge)); }); }
function IR(e) { return Te(e.lView, e.tNode)[At] === Z.Error; }
function DR(e, t, n) { let o = e - 1, r = o > -1 ? n.get(t[o]) : null; r && Wa(r.lContainer); }
function jg(e, t) { let n = t.hydrating; for (let o in e)
    n.get(o)?.reject(); t.cleanup(e); }
function TR(e, t) { for (let n of t)
    e.hydrating.set(n, ec()); }
function CR(e) { return new Promise(t => Kd(t, { injector: e })); }
function MR(e) { return ze(this, null, function* () { let { tNode: t, lView: n } = e, o = Te(n, t); return new Promise(r => { NR(o, r), Ce(2, n, t); }); }); }
function NR(e, t) { Array.isArray(e[ao]) || (e[ao] = []), e[ao].push(t); }
function X(e, t, n) { return e === 0 ? Vg(t, n) : e === 2 ? !Vg(t, n) : !(typeof ngServerMode < "u" && ngServerMode); }
function wR(e) { return e != null && (e & 1) === 1; }
function Vg(e, t) { let n = e[P], o = fe(e[m], t), r = ai(n), i = wR(o.flags); if (typeof ngServerMode < "u" && ngServerMode)
    return !r || !i; let a = Te(e, t)[Ka] !== null; return !(i && a && r); }
function Kt(e, t) { let n = fe(e, t); return n.hydrateTriggers ??= new Map; }
function II(e, t, n) { let o = [], r = [], i = [], s = []; for (let [a, c] of t) {
    let l = n.get(a);
    if (l !== void 0) {
        let u = c.data[Mt], d = l;
        for (let f = 0; f < u; f++) {
            if (d = d.previousSibling, d.nodeType !== Node.ELEMENT_NODE)
                continue;
            let p = { el: d, blockName: a };
            c.hydrate.idle && o.push(p), c.hydrate.immediate && s.push(p), c.hydrate.timer !== null && (p.delay = c.hydrate.timer, r.push(p)), c.hydrate.viewport && (typeof c.hydrate.viewport != "boolean" && (p.intersectionObserverOptions = c.hydrate.viewport), i.push(p));
        }
    }
} _R(e, o), AR(e, s), SR(e, i), bR(e, r); }
function _R(e, t) { for (let n of t) {
    let o = e.get(St), i = Ja(() => Rt(e, n.blockName), e);
    o.addCleanupFn(n.blockName, i);
} }
function SR(e, t) { if (t.length > 0) {
    let n = e.get(St);
    for (let o of t) {
        let r = Of(o.el, () => Rt(e, o.blockName), e, o.intersectionObserverOptions);
        n.addCleanupFn(o.blockName, r);
    }
} }
function bR(e, t) { for (let n of t) {
    let o = e.get(St), r = () => Rt(e, n.blockName), s = Xa(n.delay)(r, e);
    o.addCleanupFn(n.blockName, s);
} }
function AR(e, t) { for (let n of t)
    Rt(e, n.blockName); }
function DI(e, t, n, o, r, i, s, a, c, l) { let u = g(), d = A(), f = e + E, p = _n(u, d, e, null, 0, 0), h = u[P], y = ai(h); if (d.firstCreatePass) {
    J("NgDefer");
    let ht = { primaryTmplIndex: t, loadingTmplIndex: o ?? null, placeholderTmplIndex: r ?? null, errorTmplIndex: i ?? null, placeholderBlockConfig: null, loadingBlockConfig: null, dependencyResolverFn: n ?? null, loadingState: oe.NOT_STARTED, loadingPromise: null, providers: null, hydrateTriggers: null, debug: null, flags: l ?? 0 };
    c?.(d, ht, a, s), XA(d, f, ht);
} let I = u[f]; TE(I, p, u); let C = null, O = null; if (I[Re]?.length > 0) {
    let ht = I[Re][0].data;
    O = ht[ma] ?? null, C = ht[ri];
} let te = [null, zr.Initial, null, null, null, null, O, C, null, null]; JA(u, f, te); let We = null; O !== null && y && (We = h.get(St), We.add(O, { lView: u, tNode: p, lContainer: I })); let Oe = () => { JE(te), O !== null && We?.cleanup([O]); }; mi(0, te, () => ns(u, Oe)), pr(u, Oe); }
function TI(e) { let t = g(), n = ke(); if (!X(0, t, n))
    return; let o = ve(); if (Y(t, o, e)) {
    let r = R(null);
    try {
        let i = !!e, a = Te(t, n)[At];
        i === !1 && a === zr.Initial ? Ho(t, n) : i === !0 && (a === zr.Initial || a === Z.Placeholder) && Ce(0, t, n);
    }
    finally {
        R(r);
    }
} }
function CI(e) { let t = g(), n = ke(); if (!X(1, t, n))
    return; let o = ve(); if (Y(t, o, e)) {
    let r = R(null);
    try {
        let i = !!e, s = t[m], a = fe(s, n);
        i === !0 && a.loadingState === oe.NOT_STARTED && Ei(a, t, n);
    }
    finally {
        R(r);
    }
} }
function MI(e) { let t = g(), n = ke(); if (!X(2, t, n))
    return; let o = ve(), r = A(); if (Kt(r, n).set(6, null), Y(t, o, e))
    if (typeof ngServerMode < "u" && ngServerMode)
        Ce(2, t, n);
    else {
        let s = t[P], a = R(null);
        try {
            if (!!e === !0) {
                let u = Te(t, n)[Ka];
                Rt(s, u);
            }
        }
        finally {
            R(a);
        }
    } }
function NI() { let e = g(), t = _(); if (!X(2, e, t))
    return; Kt(A(), t).set(7, null), typeof ngServerMode < "u" && ngServerMode && Ce(2, e, t); }
function wI() { let e = g(), t = _(); X(0, e, t) && mI(Ja); }
function _I() { let e = g(), t = _(); X(1, e, t) && yI(Ja); }
function SI() { let e = g(), t = _(); if (!X(2, e, t))
    return; Kt(A(), t).set(0, null), typeof ngServerMode < "u" && ngServerMode ? Ce(2, e, t) : vI(Ja, e, t); }
function bI() { let e = g(), t = _(); if (!X(0, e, t))
    return; fe(e[m], t).loadingTmplIndex === null && Ho(e, t), Ce(0, e, t); }
function AI() { let e = g(), t = _(); if (!X(1, e, t))
    return; let n = e[m], o = fe(n, t); o.loadingState === oe.NOT_STARTED && tc(o, e, t); }
function RI() { let e = g(), t = _(); if (!X(2, e, t))
    return; if (Kt(A(), t).set(1, null), typeof ngServerMode < "u" && ngServerMode)
    Ce(2, e, t);
else {
    let o = e[P], i = Te(e, t)[Ka];
    Rt(o, i);
} }
function kI(e) { let t = g(), n = _(); X(0, t, n) && mI(Xa(e)); }
function OI(e) { let t = g(), n = _(); X(1, t, n) && yI(Xa(e)); }
function xI(e) { let t = g(), n = _(); if (!X(2, t, n))
    return; Kt(A(), n).set(5, { type: 5, delay: e }), typeof ngServerMode < "u" && ngServerMode ? Ce(2, t, n) : vI(Xa(e), t, n); }
function PI(e, t) { let n = g(), o = _(); X(0, n, o) && (Ho(n, o), typeof ngServerMode < "u" && ngServerMode || Vo(n, o, e, t, Xm, () => Ce(0, n, o), 0)); }
function LI(e, t) { let n = g(), o = _(); if (!X(1, n, o))
    return; let r = n[m], i = fe(r, o); i.loadingState === oe.NOT_STARTED && Vo(n, o, e, t, Xm, () => Ei(i, n, o), 1); }
function FI() { let e = g(), t = _(); if (!X(2, e, t))
    return; Kt(A(), t).set(4, null), typeof ngServerMode < "u" && ngServerMode && Ce(2, e, t); }
function jI(e, t) { let n = g(), o = _(); X(0, n, o) && (Ho(n, o), typeof ngServerMode < "u" && ngServerMode || Vo(n, o, e, t, Jm, () => Ce(0, n, o), 0)); }
function VI(e, t) { let n = g(), o = _(); if (!X(1, n, o))
    return; let r = n[m], i = fe(r, o); i.loadingState === oe.NOT_STARTED && Vo(n, o, e, t, Jm, () => Ei(i, n, o), 1); }
function HI() { let e = g(), t = _(); if (!X(2, e, t))
    return; Kt(A(), t).set(3, null), typeof ngServerMode < "u" && ngServerMode && Ce(2, e, t); }
function BI(e, t, n) { let o = g(), r = _(); X(0, o, r) && (Ho(o, r), typeof ngServerMode < "u" && ngServerMode || Vo(o, r, e, t, Of, () => Ce(0, o, r), 0, n)); }
function UI(e, t, n) { let o = g(), r = _(); if (!X(1, o, r))
    return; let i = o[m], s = fe(i, r); s.loadingState === oe.NOT_STARTED && Vo(o, r, e, t, Of, () => Ei(s, o, r), 1, n); }
function $I(e) { let t = g(), n = _(); if (!X(2, t, n))
    return; Kt(A(), n).set(2, e ? { type: 2, intersectionObserverOptions: e } : null), typeof ngServerMode < "u" && ngServerMode && Ce(2, t, n); }
function $f(e, t) { let n = g(), o = ve(); if (Y(n, o, t)) {
    let r = A(), i = ke();
    if (ja(i, r, n, e, t))
        De(i) && vv(n, i.index);
    else {
        let a = ue(i, n);
        Pa(n[w], a, null, i.value, e, t, null);
    }
} return $f; }
function qf(e, t, n, o) { let r = g(), i = ve(); if (Y(r, i, t)) {
    let s = A(), a = ke();
    DS(a, r, e, t, n, o);
} return qf; }
function wr(e) { if (J("NgAnimateEnter"), typeof ngServerMode < "u" && ngServerMode || !kn)
    return wr; let t = g(); if (wa(t))
    return wr; let n = _(), o = t[P].get(q); return _a(qs(t), n, () => RR(t, n, e, o)), ka(t[P]), Jd(t[P], qs(t)), wr; }
function RR(e, t, n, o) { let r = ue(t, e), i = e[w], s = Xy(n), a = [], c = !1, l = d => { if (Fr(d) !== r)
    return; let f = d instanceof AnimationEvent ? "animationend" : "transitionend"; o.runOutsideAngular(() => { i.listen(r, f, u); }); }, u = d => { Fr(d) === r && (Qd(d, r) && (c = !0), kR(d, r, i)); }; if (s && s.length > 0) {
    o.runOutsideAngular(() => { a.push(i.listen(r, "animationstart", l)), a.push(i.listen(r, "transitionstart", l)); }), Q_(r, s, a);
    for (let d of s)
        i.addClass(r, d);
    o.runOutsideAngular(() => { requestAnimationFrame(() => { if (!c && (nv(r, En, kn), !En.has(r))) {
        for (let d of s)
            i.removeClass(r, d);
        Wd(r);
    } }); });
} }
function kR(e, t, n) { let o = uo.get(t); if (!(Fr(e) !== t || !o) && Qd(e, t)) {
    e.stopPropagation();
    for (let r of o.classList)
        n.removeClass(t, r);
    Wd(t);
} }
function _r(e) { if (J("NgAnimateEnter"), typeof ngServerMode < "u" && ngServerMode || !kn)
    return _r; let t = g(); if (wa(t))
    return _r; let n = _(); return _a(qs(t), n, () => OR(t, n, e)), ka(t[P]), Jd(t[P], qs(t)), _r; }
function OR(e, t, n) { let o = ue(t, e); n.call(e[U], { target: o, animationComplete: Z_ }); }
function Sr(e) { if (J("NgAnimateLeave"), typeof ngServerMode < "u" && ngServerMode || !kn)
    return Sr; let t = g(); if (wa(t))
    return Sr; let o = _(), r = t[P].get(q); return _a(Tn(t), o, () => xR(t, o, e, r)), ka(t[P]), Sr; }
function xR(e, t, n, o) { let { promise: r, resolve: i } = ec(), s = ue(t, e), a = e[w]; Cn.add(e[Ve]), (Tn(e).get(t.index).resolvers ??= []).push(i); let c = Xy(n); return c && c.length > 0 ? PR(s, t, e, c, a, o) : i(), { promise: r, resolve: i }; }
function PR(e, t, n, o, r, i) { K_(e, r); let s = [], a = Tn(n).get(t.index)?.resolvers, c, l = !1, u = d => { if (!(Fr(d) !== e && d.type !== "animation-fallback") && (d.type === "animation-fallback" || Qd(d, e))) {
    if (l = !0, c && clearTimeout(c), d.type !== "animation-fallback" && d.stopPropagation(), En.delete(e), Ou(t, e), Array.isArray(t.projection))
        for (let p of o)
            r.removeClass(e, p);
    xu(a, s), Pu(n, t);
} }; i.runOutsideAngular(() => { s.push(r.listen(e, "animationend", u)), s.push(r.listen(e, "transitionend", u)); }), zd(t, e); for (let d of o)
    r.addClass(e, d); i.runOutsideAngular(() => { requestAnimationFrame(() => { if (l)
    return; nv(e, En, kn); let d = En.get(e); d ? (c = setTimeout(() => { u(new CustomEvent("animation-fallback")); }, d.duration + 50), s.push(() => clearTimeout(c))) : (Ou(t, e), xu(a, s), Pu(n, t)); }); }); }
function ea(e) { if (J("NgAnimateLeave"), typeof ngServerMode < "u" && ngServerMode || !kn)
    return ea; let t = g(), n = _(); Cn.add(t[Ve]); let o = t[P].get(q), r = t[P].get(Jy); return _a(Tn(t), n, () => LR(t, n, e, o, r)), ka(t[P]), ea; }
function LR(e, t, n, o, r) { let { promise: i, resolve: s } = ec(), a = ue(t, e), c = [], l = e[w], u = wa(e); (Tn(e).get(t.index).resolvers ??= []).push(s); let d = Tn(e).get(t.index)?.resolvers; if (u)
    ys(e, t, a, d, c);
else {
    let f = setTimeout(() => ys(e, t, a, d, c), r), p = { target: a, animationComplete: () => { ys(e, t, a, d, c), clearTimeout(f); } };
    zd(t, a), o.runOutsideAngular(() => { c.push(l.listen(a, "animationend", () => { ys(e, t, a, d, c), clearTimeout(f); }, { once: !0 })); }), n.call(e[U], p);
} return { promise: i, resolve: s }; }
function qI() { return g()[ee][U]; }
var ed = class {
    destroy(t) { }
    updateValue(t, n) { }
    swap(t, n) { let o = Math.min(t, n), r = Math.max(t, n), i = this.detach(r); if (r - o > 1) {
        let s = this.detach(o);
        this.attach(o, i), this.attach(r, s);
    }
    else
        this.attach(o, i); }
    move(t, n) { this.attach(n, this.detach(t)); }
};
function tu(e, t, n, o, r) { return e === n && Object.is(t, o) ? 1 : Object.is(r(e, t), r(n, o)) ? -1 : 0; }
function FR(e, t, n, o) { let r, i, s = 0, a = e.length - 1, c = void 0; if (Array.isArray(t)) {
    Yn(o);
    let l = t.length - 1;
    for (Yn(null); s <= a && s <= l;) {
        let u = e.at(s), d = t[s], f = tu(s, u, s, d, n);
        if (f !== 0) {
            f < 0 && e.updateValue(s, d), s++;
            continue;
        }
        let p = e.at(a), h = t[l], y = tu(a, p, l, h, n);
        if (y !== 0) {
            y < 0 && e.updateValue(a, h), a--, l--;
            continue;
        }
        let I = n(s, u), C = n(a, p), O = n(s, d);
        if (Object.is(O, C)) {
            let te = n(l, h);
            Object.is(te, I) ? (e.swap(s, a), e.updateValue(a, h), l--, a--) : e.move(a, s), e.updateValue(s, d), s++;
            continue;
        }
        if (r ??= new ta, i ??= Bg(e, s, a, n), td(e, r, s, O))
            e.updateValue(s, d), s++, a++;
        else if (i.has(O))
            r.set(I, e.detach(s)), a--;
        else {
            let te = e.create(s, t[s]);
            e.attach(s, te), s++, a++;
        }
    }
    for (; s <= l;)
        Hg(e, r, n, s, t[s]), s++;
}
else if (t != null) {
    Yn(o);
    let l = t[Symbol.iterator]();
    Yn(null);
    let u = l.next();
    for (; !u.done && s <= a;) {
        let d = e.at(s), f = u.value, p = tu(s, d, s, f, n);
        if (p !== 0)
            p < 0 && e.updateValue(s, f), s++, u = l.next();
        else {
            r ??= new ta, i ??= Bg(e, s, a, n);
            let h = n(s, f);
            if (td(e, r, s, h))
                e.updateValue(s, f), s++, a++, u = l.next();
            else if (!i.has(h))
                e.attach(s, e.create(s, f)), s++, a++, u = l.next();
            else {
                let y = n(s, d);
                r.set(y, e.detach(s)), a--;
            }
        }
    }
    for (; !u.done;)
        Hg(e, r, n, e.length, u.value), u = l.next();
} for (; s <= a;)
    e.destroy(e.detach(a--)); r?.forEach(l => { e.destroy(l); }); }
function td(e, t, n, o) { return t !== void 0 && t.has(o) ? (e.attach(n, t.get(o)), t.delete(o), !0) : !1; }
function Hg(e, t, n, o, r) { if (td(e, t, o, n(o, r)))
    e.updateValue(o, r);
else {
    let i = e.create(o, r);
    e.attach(o, i);
} }
function Bg(e, t, n, o) { let r = new Set; for (let i = t; i <= n; i++)
    r.add(o(i, e.at(i))); return r; }
var ta = class {
    kvMap = new Map;
    _vMap = void 0;
    has(t) { return this.kvMap.has(t); }
    delete(t) { if (!this.has(t))
        return !1; let n = this.kvMap.get(t); return this._vMap !== void 0 && this._vMap.has(n) ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n)) : this.kvMap.delete(t), !0; }
    get(t) { return this.kvMap.get(t); }
    set(t, n) { if (this.kvMap.has(t)) {
        let o = this.kvMap.get(t);
        this._vMap === void 0 && (this._vMap = new Map);
        let r = this._vMap;
        for (; r.has(o);)
            o = r.get(o);
        r.set(o, n);
    }
    else
        this.kvMap.set(t, n); }
    forEach(t) { for (let [n, o] of this.kvMap)
        if (t(o, n), this._vMap !== void 0) {
            let r = this._vMap;
            for (; r.has(o);)
                o = r.get(o), t(o, n);
        } }
};
function GI(e, t, n, o, r, i, s, a) { J("NgControlFlow"); let c = g(), l = A(), u = ge(l.consts, i); return _n(c, l, e, t, n, o, r, u, 256, s, a), nc; }
function nc(e, t, n, o, r, i, s, a) { J("NgControlFlow"); let c = g(), l = A(), u = ge(l.consts, i); return _n(c, l, e, t, n, o, r, u, 512, s, a), nc; }
function WI(e, t) { J("NgControlFlow"); let n = g(), o = ve(), r = n[o] !== H ? n[o] : -1, i = r !== -1 ? na(n, E + r) : void 0, s = 0; if (Y(n, o, e)) {
    let a = R(null);
    try {
        if (i !== void 0 && cf(i, s), e !== -1) {
            let c = E + e, l = na(n, c), u = id(n[m], c), d = tE(l, u, n), f = xo(n, u, t, { dehydratedView: d });
            Po(l, f, s, Mn(u, d));
        }
    }
    finally {
        R(a);
    }
}
else if (i !== void 0) {
    let a = Av(i, s);
    a !== void 0 && (a[U] = t);
} }
var nd = class {
    lContainer;
    $implicit;
    $index;
    constructor(t, n, o) { this.lContainer = t, this.$implicit = n, this.$index = o; }
    get $count() { return this.lContainer.length - G; }
};
function zI(e) { return e; }
function QI(e, t) { return t; }
var od = class {
    hasEmptyBlock;
    trackByFn;
    liveCollection;
    constructor(t, n, o) { this.hasEmptyBlock = t, this.trackByFn = n, this.liveCollection = o; }
};
function ZI(e, t, n, o, r, i, s, a, c, l, u, d, f) { J("NgControlFlow"); let p = g(), h = A(), y = c !== void 0, I = g(), C = a ? s.bind(I[ee][U]) : s, O = new od(y, C); I[E + e] = O, _n(p, h, e + 1, t, n, o, r, ge(h.consts, i), 256), y && _n(p, h, e + 2, c, l, u, d, ge(h.consts, f), 512); }
var rd = class extends ed {
    lContainer;
    hostLView;
    templateTNode;
    operationsCounter = void 0;
    needsIndexUpdate = !1;
    constructor(t, n, o) { super(), this.lContainer = t, this.hostLView = n, this.templateTNode = o; }
    get length() { return this.lContainer.length - G; }
    at(t) { return this.getLView(t)[U].$implicit; }
    attach(t, n) { let o = n[le]; this.needsIndexUpdate ||= t !== this.length, Po(this.lContainer, n, t, Mn(this.templateTNode, o)), jR(this.lContainer, t); }
    detach(t) { return this.needsIndexUpdate ||= t !== this.length - 1, VR(this.lContainer, t), HR(this.lContainer, t); }
    create(t, n) { let o = Ur(this.lContainer, this.templateTNode.tView.ssrId); return xo(this.hostLView, this.templateTNode, new nd(this.lContainer, n, t), { dehydratedView: o }); }
    destroy(t) { fi(t[m], t); }
    updateValue(t, n) { this.getLView(t)[U].$implicit = n; }
    reset() { this.needsIndexUpdate = !1; }
    updateIndexes() { if (this.needsIndexUpdate)
        for (let t = 0; t < this.length; t++)
            this.getLView(t)[U].$index = t; }
    getLView(t) { return BR(this.lContainer, t); }
};
function YI(e) { let t = R(null), n = de(); try {
    let o = g(), r = o[m], i = o[n], s = n + 1, a = na(o, s);
    if (i.liveCollection === void 0) {
        let l = id(r, s);
        i.liveCollection = new rd(a, o, l);
    }
    else
        i.liveCollection.reset();
    let c = i.liveCollection;
    if (FR(c, e, i.trackByFn, t), c.updateIndexes(), i.hasEmptyBlock) {
        let l = ve(), u = c.length === 0;
        if (Y(o, l, u)) {
            let d = n + 2, f = na(o, d);
            if (u) {
                let p = id(r, d), h = tE(f, p, o), y = xo(o, p, void 0, { dehydratedView: h });
                Po(f, y, 0, Mn(p, h));
            }
            else
                r.firstUpdatePass && Ga(f), cf(f, 0);
        }
    }
}
finally {
    R(t);
} }
function na(e, t) { return e[t]; }
function jR(e, t) { if (e.length <= G)
    return; let n = G + t, o = e[n], r = o ? o[it] : void 0; if (o && r && r.detachedLeaveAnimationFns && r.detachedLeaveAnimationFns.length > 0) {
    let i = o[P];
    rS(i, r), Cn.delete(o[Ve]), r.detachedLeaveAnimationFns = void 0;
} }
function VR(e, t) { if (e.length <= G)
    return; let n = G + t, o = e[n], r = o ? o[it] : void 0; r && r.leave && r.leave.size > 0 && (r.detachedLeaveAnimationFns = []); }
function HR(e, t) { return Vr(e, t); }
function BR(e, t) { return Av(e, t); }
function id(e, t) { return Vt(e, t); }
function Gf(e, t, n) { let o = g(), r = ve(); if (Y(o, r, t)) {
    let i = A(), s = ke();
    of(s, o, e, t, o[w], n);
} return Gf; }
function sd(e, t, n, o, r) { ja(t, e, n, r ? "class" : "style", o); }
function Qr(e, t, n, o) { let r = g(), i = r[m], s = e + E, a = i.firstCreatePass ? hf(s, r, 2, t, sf, os(), n, o) : i.data[s]; if (De(a)) {
    let c = r[je].tracingService;
    if (c && c.componentCreate) {
        let l = i.data[a.directiveStart + a.componentOffset];
        return c.componentCreate(yf(l), () => (Ug(e, t, r, a, o), Qr));
    }
} return Ug(e, t, r, a, o), Qr; }
function Ug(e, t, n, o, r) { if (La(o, n, e, t, Qf), Un(o)) {
    let i = n[m];
    xa(i, n, o), Od(i, o, n);
} r != null && Oo(n, o); }
function oc() { let e = A(), t = _(), n = Fa(t); return e.firstCreatePass && gf(e, n), hl(n) && yl(), pl(), n.classesWithoutHost != null && wN(n) && sd(e, n, g(), n.classesWithoutHost, !0), n.stylesWithoutHost != null && _N(n) && sd(e, n, g(), n.stylesWithoutHost, !1), oc; }
function Wf(e, t, n, o) { return Qr(e, t, n, o), oc(), Wf; }
function rc(e, t, n, o) { let r = g(), i = r[m], s = e + E, a = i.firstCreatePass ? cE(s, i, 2, t, n, o) : i.data[s]; return La(a, r, e, t, Qf), o != null && Oo(r, a), rc; }
function ic() { let e = _(), t = Fa(e); return hl(t) && yl(), pl(), ic; }
function zf(e, t, n, o) { return rc(e, t, n, o), ic(), zf; }
var Qf = (e, t, n, o, r) => (Je(!0), Ca(t[w], o, kl()));
function UR(e, t, n, o, r) { let i = !Ta(t, n); if (Je(i), i)
    return Ca(t[w], o, kl()); let s = t[le], a = hi(s, e, t, n); return hy(s, r) && Ia(s, r, a.nextSibling), s && (md(n) || Lm(a)) && De(n) && (Oh(n), Py(a)), a; }
function KI() { Qf = UR; }
function sc(e, t, n) { let o = g(), r = o[m], i = e + E, s = r.firstCreatePass ? hf(i, o, 8, "ng-container", sf, os(), t, n) : r.data[i]; if (La(s, o, e, "ng-container", Jf), Un(s)) {
    let a = o[m];
    xa(a, o, s), Od(a, s, o);
} return n != null && Oo(o, s), sc; }
function Ii() { let e = A(), t = _(), n = Fa(t); return e.firstCreatePass && gf(e, n), Ii; }
function Zf(e, t, n) { return sc(e, t, n), Ii(), Zf; }
function ac(e, t, n) { let o = g(), r = o[m], i = e + E, s = r.firstCreatePass ? cE(i, r, 8, "ng-container", t, n) : r.data[i]; return La(s, o, e, "ng-container", Jf), n != null && Oo(o, s), ac; }
function Yf() { let e = _(), t = Fa(e); return Ii; }
function Kf(e, t, n) { return ac(e, t, n), Yf(), Kf; }
var Jf = (e, t, n, o, r) => (Je(!0), Fd(t[w], ""));
function $R(e, t, n, o, r) { let i, s = !Ta(t, n); if (Je(s), s)
    return Fd(t[w], ""); let a = t[le], c = hi(a, e, t, n), l = py(a, r); return Ia(a, r, c), i = $a(l, c), i; }
function JI() { Jf = $R; }
function XI() { return g(); }
function Xf(e, t, n) { let o = g(), r = ve(); if (Y(o, r, t)) {
    let i = A(), s = ke();
    rf(s, o, e, t, o[w], n);
} return Xf; }
function ep(e, t, n) { let o = g(), r = ve(); if (Y(o, r, t)) {
    let i = A(), s = ke(), a = is(i.data), c = Ev(a, s, o);
    rf(s, o, e, t, c, n);
} return ep; }
var Er = void 0;
function qR(e) { let t = Math.floor(Math.abs(e)), n = e.toString().replace(/^[^.]*\.?/, "").length; return t === 1 && n === 0 ? 1 : 5; }
var GR = ["en", [["a", "p"], ["AM", "PM"]], [["AM", "PM"]], [["S", "M", "T", "W", "T", "F", "S"], ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]], Er, [["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]], Er, [["B", "A"], ["BC", "AD"], ["Before Christ", "Anno Domini"]], 0, [6, 0], ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"], ["h:mm\u202Fa", "h:mm:ss\u202Fa", "h:mm:ss\u202Fa z", "h:mm:ss\u202Fa zzzz"], ["{1}, {0}", Er, Er, Er], [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"], ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"], "USD", "$", "US Dollar", {}, "ltr", qR], co = {};
function WR(e, t, n) { typeof t != "string" && (n = t, t = e[vo.LocaleId]), t = t.toLowerCase().replace(/_/g, "-"), co[t] = e, n && (co[t][vo.ExtraData] = n); }
function tp(e) { let t = ZR(e), n = $g(t); if (n)
    return n; let o = t.split("-")[0]; if (n = $g(o), n)
    return n; if (o === "en")
    return GR; throw new D(701, !1); }
function zR(e) { return tp(e)[vo.CurrencyCode] || null; }
function eD(e) { return tp(e)[vo.PluralCase]; }
function $g(e) { return e in co || (co[e] = Se.ng && Se.ng.common && Se.ng.common.locales && Se.ng.common.locales[e]), co[e]; }
function QR() { co = {}; }
var vo = (function (e) { return e[e.LocaleId = 0] = "LocaleId", e[e.DayPeriodsFormat = 1] = "DayPeriodsFormat", e[e.DayPeriodsStandalone = 2] = "DayPeriodsStandalone", e[e.DaysFormat = 3] = "DaysFormat", e[e.DaysStandalone = 4] = "DaysStandalone", e[e.MonthsFormat = 5] = "MonthsFormat", e[e.MonthsStandalone = 6] = "MonthsStandalone", e[e.Eras = 7] = "Eras", e[e.FirstDayOfWeek = 8] = "FirstDayOfWeek", e[e.WeekendRange = 9] = "WeekendRange", e[e.DateFormat = 10] = "DateFormat", e[e.TimeFormat = 11] = "TimeFormat", e[e.DateTimeFormat = 12] = "DateTimeFormat", e[e.NumberSymbols = 13] = "NumberSymbols", e[e.NumberFormats = 14] = "NumberFormats", e[e.CurrencyCode = 15] = "CurrencyCode", e[e.CurrencySymbol = 16] = "CurrencySymbol", e[e.CurrencyName = 17] = "CurrencyName", e[e.Currencies = 18] = "Currencies", e[e.Directionality = 19] = "Directionality", e[e.PluralCase = 20] = "PluralCase", e[e.ExtraData = 21] = "ExtraData", e; })(vo || {});
function ZR(e) { return e.toLowerCase().replace(/_/g, "-"); }
var YR = ["zero", "one", "two", "few", "many"];
function KR(e, t) { let n = eD(t)(parseInt(e, 10)), o = YR[n]; return o !== void 0 ? o : "other"; }
var Di = "en-US", JR = "USD", tD = { marker: "element" }, nD = { marker: "ICU" }, Dt = (function (e) { return e[e.SHIFT = 2] = "SHIFT", e[e.APPEND_EAGERLY = 1] = "APPEND_EAGERLY", e[e.COMMENT = 2] = "COMMENT", e; })(Dt || {}), oD = Di;
function rD(e) { typeof e == "string" && (oD = e.toLowerCase().replace(/_/g, "-")); }
function XR() { return oD; }
var Zr = 0, br = 0;
function ek(e) { e && (Zr = Zr | 1 << Math.min(br, 31)), br++; }
function tk(e, t, n) { if (br > 0) {
    let o = e.data[n], r = Array.isArray(o) ? o : o.update, i = lt() - br - 1;
    cD(e, t, r, i, Zr);
} Zr = 0, br = 0; }
function iD(e, t, n) { let o = e[w]; switch (n) {
    case Node.COMMENT_NODE: return Fd(o, t);
    case Node.TEXT_NODE: return Ld(o, t);
    case Node.ELEMENT_NODE: return Ca(o, t, null);
} }
var Ar = (e, t, n, o) => (Je(!0), iD(e, n, o));
function nk(e, t, n, o) { let r = e[le], i = t - E, s = !qa() || !r || hr() || Da(r, i); return Je(s), s ? iD(e, n, o) : Vv(r, i); }
function sD() { Ar = nk; }
function ok(e, t, n, o) { let r = e[w]; for (let i = 0; i < t.length; i++) {
    let s = t[i++], a = t[i], c = (s & Dt.COMMENT) === Dt.COMMENT, l = (s & Dt.APPEND_EAGERLY) === Dt.APPEND_EAGERLY, u = s >>> Dt.SHIFT, d = e[u], f = !1;
    d === null && (d = e[u] = Ar(e, u, a, c ? Node.COMMENT_NODE : Node.TEXT_NODE), f = mr()), l && n !== null && f && Dn(r, n, d, o, !1);
} }
function aD(e, t, n, o) { let r = n[w], i = null, s; for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "string") {
        let l = t[++a];
        n[l] === null && (n[l] = Ar(n, l, c, Node.TEXT_NODE));
    }
    else if (typeof c == "number")
        switch (c & 1) {
            case 0:
                let l = sb(c);
                i === null && (i = l, s = r.parentNode(o));
                let u, d;
                if (l === i ? (u = o, d = s) : (u = null, d = L(n[l])), d !== null) {
                    let y = ab(c), I = n[y];
                    Dn(r, d, I, u, !1);
                    let C = Cr(e, y);
                    if (C !== null && typeof C == "object") {
                        let O = Ua(C, n);
                        O !== null && aD(e, C.create[O], n, n[C.anchorIdx]);
                    }
                }
                break;
            case 1:
                let f = c >>> 1, p = t[++a], h = t[++a];
                Pa(r, fn(f, n), null, null, p, h, null);
                break;
            default:
        }
    else
        switch (c) {
            case nD:
                let l = t[++a], u = t[++a];
                if (n[u] === null) {
                    let p = n[u] = Ar(n, u, l, Node.COMMENT_NODE);
                    Ue(p, n);
                }
                break;
            case tD:
                let d = t[++a], f = t[++a];
                if (n[f] === null) {
                    let p = n[f] = Ar(n, f, d, Node.ELEMENT_NODE);
                    Ue(p, n);
                }
                break;
            default:
        }
} }
function cD(e, t, n, o, r) { for (let i = 0; i < n.length; i++) {
    let s = n[i], a = n[++i];
    if (s & r) {
        let c = "";
        for (let l = i + 1; l <= i + a; l++) {
            let u = n[l];
            if (typeof u == "string")
                c += u;
            else if (typeof u == "number")
                if (u < 0)
                    c += b(t[o - u]);
                else {
                    let d = u >>> 2;
                    switch (u & 3) {
                        case 1:
                            let f = n[++l], p = n[++l], h = e.data[d];
                            typeof h == "string" ? Pa(t[w], t[d], null, h, f, c, p) : of(h, t, f, c, t[w], p);
                            break;
                        case 0:
                            let y = t[d];
                            y !== null && Oy(t[w], y, c);
                            break;
                        case 2:
                            rk(e, Cr(e, d), t, c);
                            break;
                        case 3:
                            qg(e, Cr(e, d), o, t);
                            break;
                    }
                }
        }
    }
    else {
        let c = n[i + 1];
        if (c > 0 && (c & 3) === 3) {
            let l = c >>> 2, u = Cr(e, l);
            t[u.currentCaseLViewIndex] < 0 && qg(e, u, o, t);
        }
    }
    i += a;
} }
function qg(e, t, n, o) { let r = o[t.currentCaseLViewIndex]; if (r !== null) {
    let i = Zr;
    r < 0 && (r = o[t.currentCaseLViewIndex] = ~r, i = -1), cD(e, o, t.update[r], n, i);
} }
function rk(e, t, n, o) { let r = ik(t, o); if (Ua(t, n) !== r && (lD(e, t, n), n[t.currentCaseLViewIndex] = r === null ? null : ~r, r !== null)) {
    let s = n[t.anchorIdx];
    s && aD(e, t.create[r], n, s), Nb(n, t.anchorIdx, r);
} }
function lD(e, t, n) { let o = Ua(t, n); if (o !== null) {
    let r = t.remove[o];
    for (let i = 0; i < r.length; i++) {
        let s = r[i];
        if (s > 0) {
            let a = fn(s, n);
            a !== null && li(n[w], a);
        }
        else
            lD(e, Cr(e, ~s), n);
    }
} }
function ik(e, t) { let n = e.cases.indexOf(t); if (n === -1)
    switch (e.type) {
        case 1: {
            let o = KR(t, XR());
            n = e.cases.indexOf(o), n === -1 && o !== "other" && (n = e.cases.indexOf("other"));
            break;
        }
        case 0: {
            n = e.cases.indexOf("other");
            break;
        }
    } return n === -1 ? null : n; }
var oa = /�(\d+):?\d*�/gi, sk = /({\s*�\d+:?\d*�\s*,\s*\S{6}\s*,[\s\S]*})/gi, ak = /�(\d+)�/, uD = /^\s*(�\d+:?\d*�)\s*,\s*(select|plural)\s*,/, Rr = "\uFFFD", ck = /�\/?\*(\d+:\d+)�/gi, lk = /�(\/?[#*]\d+):?\d*�/gi, uk = /\uE500/g;
function dk(e) { return e.replace(uk, " "); }
function fk(e, t, n, o, r, i) { let s = qn(), a = [], c = [], l = [[]], u = [[]]; r = mk(r, i); let d = dk(r).split(lk); for (let f = 0; f < d.length; f++) {
    let p = d[f];
    if ((f & 1) === 0) {
        let h = ad(p);
        for (let y = 0; y < h.length; y++) {
            let I = h[y];
            if ((y & 1) === 0) {
                let C = I;
                C !== "" && pk(u[0], e, s, l[0], a, c, n, C);
            }
            else {
                let C = I;
                if (typeof C != "object")
                    throw new Error(`Unable to parse ICU expression in "${r}" message.`);
                let te = dD(e, s, l[0], n, a, "", !0).index;
                pD(u[0], e, n, c, t, C, te);
            }
        }
    }
    else {
        let h = p.charCodeAt(0) === 47, y = p.charCodeAt(h ? 1 : 0), I = E + Number.parseInt(p.substring(h ? 2 : 1));
        if (h)
            l.shift(), u.shift(), ct(qn(), !1);
        else {
            let C = ib(e, l[0], I);
            l.unshift([]), ct(C, !0);
            let O = { kind: 2, index: I, children: [], type: y === 35 ? 0 : 1 };
            u[0].push(O), u.unshift(O.children);
        }
    }
} e.data[o] = { create: a, update: c, ast: u[0], parentTNodeIndex: t }; }
function dD(e, t, n, o, r, i, s) { let a = di(e, o, 1, null), c = a << Dt.SHIFT, l = qn(); t === l && (l = null), l === null && (c |= Dt.APPEND_EAGERLY), s && (c |= Dt.COMMENT, G_(lb)), r.push(c, i === null ? "" : i); let u = lf(e, a, s ? 32 : 1, i === null ? "" : i, null); Pv(n, u); let d = u.index; return ct(u, !1), l !== null && t !== l && rb(l, d), u; }
function pk(e, t, n, o, r, i, s, a) { let c = a.match(oa), u = dD(t, n, o, s, r, c ? null : a, !1).index; c && ra(i, a, u, null, 0, null), e.push({ kind: 0, index: u }); }
function hk(e, t, n) { let r = _().index, i = []; if (e.firstCreatePass && e.data[t] === null) {
    for (let s = 0; s < n.length; s += 2) {
        let a = n[s], c = n[s + 1];
        if (c !== "") {
            if (sk.test(c))
                throw new Error(`ICU expressions are not supported in attributes. Message: "${c}".`);
            ra(i, c, r, a, gk(i), bu[a.toLowerCase()] ? ci : null);
        }
    }
    e.data[t] = i;
} }
function ra(e, t, n, o, r, i) { let s = e.length, a = s + 1; e.push(null, null); let c = s + 2, l = t.split(oa), u = 0; for (let d = 0; d < l.length; d++) {
    let f = l[d];
    if (d & 1) {
        let p = r + parseInt(f, 10);
        e.push(-1 - p), u = u | fD(p);
    }
    else
        f !== "" && e.push(f);
} return e.push(n << 2 | (o ? 1 : 0)), o && e.push(o, i), e[s] = u, e[a] = e.length - c, u; }
function gk(e) { let t = 0; for (let n = 0; n < e.length; n++) {
    let o = e[n];
    typeof o == "number" && o < 0 && t++;
} return t; }
function fD(e) { return 1 << Math.min(e, 31); }
function Gg(e) { let t, n = "", o = 0, r = !1, i; for (; (t = ck.exec(e)) !== null;)
    r ? t[0] === `${Rr}/*${i}${Rr}` && (o = t.index, r = !1) : (n += e.substring(o, t.index + t[0].length), i = t[1], r = !0); return n += e.slice(o), n; }
function mk(e, t) { if (Fv(t))
    return Gg(e); {
    let n = e.indexOf(`:${t}${Rr}`) + 2 + t.toString().length, o = e.search(new RegExp(`${Rr}\\/\\*\\d+:${t}${Rr}`));
    return Gg(e.substring(n, o));
} }
function pD(e, t, n, o, r, i, s) { let a = 0, c = { type: i.type, currentCaseLViewIndex: di(t, n, 1, null), anchorIdx: s, cases: [], create: [], remove: [], update: [] }; Ik(o, i, s), ob(t, s, c); let l = i.values, u = []; for (let d = 0; d < l.length; d++) {
    let f = l[d], p = [];
    for (let y = 0; y < f.length; y++) {
        let I = f[y];
        if (typeof I != "string") {
            let C = p.push(I) - 1;
            f[y] = `<!--\uFFFD${C}\uFFFD-->`;
        }
    }
    let h = [];
    u.push(h), a = vk(h, t, c, n, o, r, i.cases[d], f.join(""), p) | a;
} a && Dk(o, a, s), e.push({ kind: 3, index: s, cases: u, currentCaseLViewIndex: c.currentCaseLViewIndex }); }
function yk(e) { let t = [], n = [], o = 1, r = 0; e = e.replace(uD, function (s, a, c) { return c === "select" ? o = 0 : o = 1, r = parseInt(a.slice(1), 10), ""; }); let i = ad(e); for (let s = 0; s < i.length;) {
    let a = i[s++].trim();
    o === 1 && (a = a.replace(/\s*(?:=)?(\w+)\s*/, "$1")), a.length && t.push(a);
    let c = ad(i[s++]);
    t.length > n.length && n.push(c);
} return { type: o, mainBinding: r, cases: t, values: n }; }
function ad(e) { if (!e)
    return []; let t = 0, n = [], o = [], r = /[{}]/g; r.lastIndex = 0; let i; for (; i = r.exec(e);) {
    let a = i.index;
    if (i[0] == "}") {
        if (n.pop(), n.length == 0) {
            let c = e.substring(t, a);
            uD.test(c) ? o.push(yk(c)) : o.push(c), t = a + 1;
        }
    }
    else {
        if (n.length == 0) {
            let c = e.substring(t, a);
            o.push(c), t = a + 1;
        }
        n.push("{");
    }
} let s = e.substring(t); return o.push(s), o; }
function vk(e, t, n, o, r, i, s, a, c) { let l = [], u = [], d = []; n.cases.push(s), n.create.push(l), n.remove.push(u), n.update.push(d); let p = _y(fa()).getInertBodyElement(a), h = Ru(p) || p; return h ? hD(e, t, n, o, r, l, u, d, h, i, c, 0) : 0; }
function hD(e, t, n, o, r, i, s, a, c, l, u, d) { let f = 0, p = c.firstChild; for (; p;) {
    let h = di(t, o, 1, null);
    switch (p.nodeType) {
        case Node.ELEMENT_NODE:
            let y = p, I = y.tagName.toLowerCase();
            if (_u.hasOwnProperty(I)) {
                nu(i, tD, I, l, h), t.data[h] = I;
                let We = y.attributes;
                for (let ht = 0; ht < We.length; ht++) {
                    let Xt = We.item(ht), Si = Xt.name.toLowerCase();
                    !!Xt.value.match(oa) ? Su.hasOwnProperty(Si) && ra(a, Xt.value, h, Xt.name, 0, bu[Si] ? ci : null) : Su[Si] && (bu[Si] ? zg(i, h, Xt.name, "unsafe:blocked") : zg(i, h, Xt.name, Xt.value));
                }
                let Oe = { kind: 1, index: h, children: [] };
                e.push(Oe), f = hD(Oe.children, t, n, o, r, i, s, a, p, h, u, d + 1) | f, Wg(s, h, d);
            }
            break;
        case Node.TEXT_NODE:
            let C = p.textContent || "", O = C.match(oa);
            nu(i, null, O ? "" : C, l, h), Wg(s, h, d), O && (f = ra(a, C, h, null, 0, null) | f), e.push({ kind: 0, index: h });
            break;
        case Node.COMMENT_NODE:
            let te = ak.exec(p.textContent || "");
            if (te) {
                let We = parseInt(te[1], 10), Oe = u[We];
                nu(i, nD, "", l, h), pD(e, t, o, r, l, Oe, h), Ek(s, h, d);
            }
            break;
    }
    p = p.nextSibling;
} return f; }
function Wg(e, t, n) { n === 0 && e.push(t); }
function Ek(e, t, n) { n === 0 && (e.push(~t), e.push(t)); }
function Ik(e, t, n) { e.push(fD(t.mainBinding), 2, -1 - t.mainBinding, n << 2 | 2); }
function Dk(e, t, n) { e.push(t, 1, n << 2 | 3); }
function nu(e, t, n, o, r) { t !== null && e.push(t), e.push(n, r, cb(0, o, r)); }
function zg(e, t, n, o) { e.push(t << 1 | 1, n, o); }
var Qg = 0, Tk = /\[(�.+?�?)\]/, Ck = /\[(�.+?�?)\]|(�\/?\*\d+:\d+�)/g, Mk = /({\s*)(VAR_(PLURAL|SELECT)(_\d+)?)(\s*,)/g, Nk = /{([A-Z0-9_]+)}/g, wk = /�I18N_EXP_(ICU(_\d+)?)�/g, _k = /\/\*/, Sk = /\d+\:(\d+)/;
function bk(e, t = {}) { let n = e; if (Tk.test(e)) {
    let o = {}, r = [Qg];
    n = n.replace(Ck, (i, s, a) => { let c = s || a, l = o[c] || []; if (l.length || (c.split("|").forEach(y => { let I = y.match(Sk), C = I ? parseInt(I[1], 10) : Qg, O = _k.test(y); l.push([C, O, y]); }), o[c] = l), !l.length)
        throw new Error(`i18n postprocess: unmatched placeholder - ${c}`); let u = r[r.length - 1], d = 0; for (let y = 0; y < l.length; y++)
        if (l[y][0] === u) {
            d = y;
            break;
        } let [f, p, h] = l[d]; return p ? r.pop() : u !== f && r.push(f), l.splice(d, 1), h; });
} return Object.keys(t).length && (n = n.replace(Mk, (o, r, i, s, a, c) => t.hasOwnProperty(i) ? `${r}${t[i]}${c}` : o), n = n.replace(Nk, (o, r) => t.hasOwnProperty(r) ? t[r] : o), n = n.replace(wk, (o, r) => { if (t.hasOwnProperty(r)) {
    let i = t[r];
    if (!i.length)
        throw new Error(`i18n postprocess: unmatched ICU - ${o} with key: ${r}`);
    return i.shift();
} return o; })), n; }
function np(e, t, n = -1) { let o = A(), r = g(), i = E + e, s = ge(o.consts, t), a = qn(); if (o.firstCreatePass && fk(o, a === null ? 0 : a.index, r, i, s, n), o.type === 2) {
    let f = r[ee];
    f[N] |= 32;
}
else
    r[N] |= 32; let c = o.data[i], l = a === r[ce] ? null : a, u = cv(o, l, r), d = a && a.type & 8 ? r[a.index] : null; Eb(r, i, a, n), ok(r, c.create, u, d), wl(!0); }
function op() { wl(!1); }
function gD(e, t, n) { np(e, t, n), op(); }
function mD(e, t) { let n = A(), o = ge(n.consts, t); hk(n, e + E, o); }
function rp(e) { let t = g(); return ek(Y(t, ve(), e)), rp; }
function yD(e) { tk(A(), g(), e + E); }
function vD(e, t = {}) { return bk(e, t); }
function ip(e, t, n) { let o = g(), r = A(), i = _(); return cp(r, o, o[w], i, e, t, n), ip; }
function sp(e, t) { let n = _(), o = g(), r = A(), i = is(r.data), s = Ev(i, n, o); return cp(r, o, s, n, e, t), sp; }
function ap(e, t, n) { let o = g(), r = A(), i = _(); return (i.type & 3 || n) && mf(i, r, o, n, o[w], e, t, Qt(i, o, t)), ap; }
function cp(e, t, n, o, r, i, s) { let a = !0, c = null; if ((o.type & 3 || s) && (c ??= Qt(o, t, i), mf(o, e, t, s, n, r, i, c) && (a = !1)), a) {
    let l = o.outputs?.[r], u = o.hostDirectiveOutputs?.[r];
    if (u && u.length)
        for (let d = 0; d < u.length; d += 2) {
            let f = u[d], p = u[d + 1];
            c ??= Qt(o, t, i), ho(o, t, f, p, r, c);
        }
    if (l && l.length)
        for (let d of l)
            c ??= Qt(o, t, i), ho(o, t, d, r, r, c);
} }
function ED(e = 1) { return Hh(e); }
function Ak(e, t) { let n = null, o = L_(e); for (let r = 0; r < t.length; r++) {
    let i = t[r];
    if (i === "*") {
        n = r;
        continue;
    }
    if (o === null ? zy(e, i, !0) : V_(o, i))
        return r;
} return n; }
function ID(e) { let t = g()[ee][ce]; if (!t.projection) {
    let n = e ? e.length : 1, o = t.projection = ar(n, null), r = o.slice(), i = t.child;
    for (; i !== null;) {
        if (i.type !== 128) {
            let s = e ? Ak(i, e) : 0;
            s !== null && (r[s] ? r[s].projectionNext = i : o[s] = i, r[s] = i);
        }
        i = i.next;
    }
} }
function DD(e, t = 0, n, o, r, i) { let s = g(), a = A(), c = o ? e + 1 : null; c !== null && _n(s, a, c, o, r, i, null, n); let l = xn(a, E + e, 16, null, n || null); l.projection === null && (l.projection = t), Tl(); let d = !s[le] || hr(); s[ee][ce].projection[l.projection] === null && c !== null ? Rk(s, a, c) : d && !bo(l) && dS(a, s, l); }
function Rk(e, t, n) { let o = E + n, r = t.data[o], i = e[o], s = Ur(i, r.tView.ssrId), a = xo(e, r, void 0, { dehydratedView: s }); Po(i, a, 0, Mn(r, s)); }
function lp(e, t, n, o) { return SE(e, t, n, o), lp; }
function up(e, t, n) { return _E(e, t, n), up; }
function TD(e) { let t = g(), n = A(), o = ss(); gr(o + 1); let r = If(n, o); if (e.dirty && Sh(t) === ((r.metadata.flags & 2) === 2)) {
    if (r.matches === null)
        e.reset([]);
    else {
        let i = AE(t, o);
        e.reset(i, Pm), e.notifyOnChanges();
    }
    return !0;
} return !1; }
function CD() { return Ef(g(), ss()); }
function dp(e, t, n, o, r) { return RE(t, SE(e, n, o, r)), dp; }
function fp(e, t, n, o) { return RE(e, _E(t, n, o)), fp; }
function MD(e = 1) { gr(ss() + e); }
function ND(e) { let t = Cl(); return Ht(t, E + e); }
function Is(e, t) { return e << 17 | t << 2; }
function Sn(e) { return e >> 17 & 32767; }
function kk(e) { return (e & 2) == 2; }
function Ok(e, t) { return e & 131071 | t << 17; }
function cd(e) { return e | 2; }
function Eo(e) { return (e & 131068) >> 2; }
function ou(e, t) { return e & -131069 | t << 2; }
function xk(e) { return (e & 1) === 1; }
function ld(e) { return e | 1; }
function Pk(e, t, n, o, r, i) { let s = i ? t.classBindings : t.styleBindings, a = Sn(s), c = Eo(s); e[o] = n; let l = !1, u; if (Array.isArray(n)) {
    let d = n;
    u = d[1], (u === null || Hn(d, u) > 0) && (l = !0);
}
else
    u = n; if (r)
    if (c !== 0) {
        let f = Sn(e[a + 1]);
        e[o + 1] = Is(f, a), f !== 0 && (e[f + 1] = ou(e[f + 1], o)), e[a + 1] = Ok(e[a + 1], o);
    }
    else
        e[o + 1] = Is(a, 0), a !== 0 && (e[a + 1] = ou(e[a + 1], o)), a = o;
else
    e[o + 1] = Is(c, 0), a === 0 ? a = o : e[c + 1] = ou(e[c + 1], o), c = o; l && (e[o + 1] = cd(e[o + 1])), Zg(e, u, o, !0), Zg(e, u, o, !1), Lk(t, u, e, o, i), s = Is(a, c), i ? t.classBindings = s : t.styleBindings = s; }
function Lk(e, t, n, o, r) { let i = r ? e.residualClasses : e.residualStyles; i != null && typeof t == "string" && Hn(i, t) >= 0 && (n[o + 1] = ld(n[o + 1])); }
function Zg(e, t, n, o) { let r = e[n + 1], i = t === null, s = o ? Sn(r) : Eo(r), a = !1; for (; s !== 0 && (a === !1 || i);) {
    let c = e[s], l = e[s + 1];
    Fk(c, t) && (a = !0, e[s + 1] = o ? ld(l) : cd(l)), s = o ? Sn(l) : Eo(l);
} a && (e[n + 1] = o ? cd(r) : ld(r)); }
function Fk(e, t) { return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t ? !0 : Array.isArray(e) && typeof t == "string" ? Hn(e, t) >= 0 : !1; }
var ie = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function wD(e) { return e.substring(ie.key, ie.keyEnd); }
function jk(e) { return e.substring(ie.value, ie.valueEnd); }
function Vk(e) { return bD(e), _D(e, Io(e, 0, ie.textEnd)); }
function _D(e, t) { let n = ie.textEnd; return n === t ? -1 : (t = ie.keyEnd = Bk(e, ie.key = t, n), Io(e, t, n)); }
function Hk(e) { return bD(e), SD(e, Io(e, 0, ie.textEnd)); }
function SD(e, t) { let n = ie.textEnd, o = ie.key = Io(e, t, n); return n === o ? -1 : (o = ie.keyEnd = Uk(e, o, n), o = Yg(e, o, n, 58), o = ie.value = Io(e, o, n), o = ie.valueEnd = $k(e, o, n), Yg(e, o, n, 59)); }
function bD(e) { ie.key = 0, ie.keyEnd = 0, ie.value = 0, ie.valueEnd = 0, ie.textEnd = e.length; }
function Io(e, t, n) { for (; t < n && e.charCodeAt(t) <= 32;)
    t++; return t; }
function Bk(e, t, n) { for (; t < n && e.charCodeAt(t) > 32;)
    t++; return t; }
function Uk(e, t, n) { let o; for (; t < n && ((o = e.charCodeAt(t)) === 45 || o === 95 || (o & -33) >= 65 && (o & -33) <= 90 || o >= 48 && o <= 57);)
    t++; return t; }
function Yg(e, t, n, o) { return t = Io(e, t, n), t < n && t++, t; }
function $k(e, t, n) { let o = -1, r = -1, i = -1, s = t, a = s; for (; s < n;) {
    let c = e.charCodeAt(s++);
    if (c === 59)
        return a;
    c === 34 || c === 39 ? a = s = Kg(e, c, s, n) : t === s - 4 && i === 85 && r === 82 && o === 76 && c === 40 ? a = s = Kg(e, 41, s, n) : c > 32 && (a = s), i = r, r = o, o = c & -33;
} return a; }
function Kg(e, t, n, o) { let r = -1, i = n; for (; i < o;) {
    let s = e.charCodeAt(i++);
    if (s == t && r !== 92)
        return i;
    s == 92 && r === 92 ? r = 0 : r = s;
} throw new Error; }
function pp(e, t, n) { return kD(e, t, n, !1), pp; }
function hp(e, t) { return kD(e, t, null, !0), hp; }
function AD(e) { OD(LD, qk, e, !1); }
function qk(e, t) { for (let n = Hk(t); n >= 0; n = SD(t, n))
    LD(e, wD(t), jk(t)); }
function RD(e) { OD(Kk, Gk, e, !0); }
function Gk(e, t) { for (let n = Vk(t); n >= 0; n = _D(t, n))
    cr(e, wD(t), !0); }
function kD(e, t, n, o) { let r = g(), i = A(), s = ut(2); if (i.firstUpdatePass && PD(i, e, s, o), t !== H && Y(r, s, t)) {
    let a = i.data[de()];
    FD(i, a, r, r[w], e, r[s + 1] = Xk(t, n), o, s);
} }
function OD(e, t, n, o) { let r = A(), i = ut(2); r.firstUpdatePass && PD(r, null, i, o); let s = g(); if (n !== H && Y(s, i, n)) {
    let a = r.data[de()];
    if (jD(a, o) && !xD(r, i)) {
        let c = o ? a.classesWithoutHost : a.stylesWithoutHost;
        c !== null && (n = Bi(c, n || "")), sd(r, a, s, n, o);
    }
    else
        Jk(r, a, s, s[w], s[i + 1], s[i + 1] = Yk(e, t, n), o, i);
} }
function xD(e, t) { return t >= e.expandoStartIndex; }
function PD(e, t, n, o) { let r = e.data; if (r[n + 1] === null) {
    let i = r[de()], s = xD(e, n);
    jD(i, o) && t === null && !s && (t = !1), t = Wk(r, i, t, o), Pk(r, i, t, n, s, o);
} }
function Wk(e, t, n, o) { let r = is(e), i = o ? t.residualClasses : t.residualStyles; if (r === null)
    (o ? t.classBindings : t.styleBindings) === 0 && (n = ru(null, e, t, n, o), n = Yr(n, t.attrs, o), i = null);
else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== r)
        if (n = ru(r, e, t, n, o), i === null) {
            let c = zk(e, t, o);
            c !== void 0 && Array.isArray(c) && (c = ru(null, e, t, c[1], o), c = Yr(c, t.attrs, o), Qk(e, t, o, c));
        }
        else
            i = Zk(e, t, o);
} return i !== void 0 && (o ? t.residualClasses = i : t.residualStyles = i), n; }
function zk(e, t, n) { let o = n ? t.classBindings : t.styleBindings; if (Eo(o) !== 0)
    return e[Sn(o)]; }
function Qk(e, t, n, o) { let r = n ? t.classBindings : t.styleBindings; e[Sn(r)] = o; }
function Zk(e, t, n) { let o, r = t.directiveEnd; for (let i = 1 + t.directiveStylingLast; i < r; i++) {
    let s = e[i].hostAttrs;
    o = Yr(o, s, n);
} return Yr(o, t.attrs, n); }
function ru(e, t, n, o, r) { let i = null, s = n.directiveEnd, a = n.directiveStylingLast; for (a === -1 ? a = n.directiveStart : a++; a < s && (i = t[a], o = Yr(o, i.hostAttrs, r), i !== e);)
    a++; return e !== null && (n.directiveStylingLast = a), o; }
function Yr(e, t, n) { let o = n ? 1 : 2, r = -1; if (t !== null)
    for (let i = 0; i < t.length; i++) {
        let s = t[i];
        typeof s == "number" ? r = s : r === o && (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]), cr(e, s, n ? !0 : t[++i]));
    } return e === void 0 ? null : e; }
function Yk(e, t, n) { if (n == null || n === "")
    return F; let o = [], r = bt(n); if (Array.isArray(r))
    for (let i = 0; i < r.length; i++)
        e(o, r[i], !0);
else if (r instanceof Set)
    for (let i of r)
        e(o, i, !0);
else if (typeof r == "object")
    for (let i in r)
        r.hasOwnProperty(i) && e(o, i, r[i]);
else
    typeof r == "string" && t(o, r); return o; }
function LD(e, t, n) { cr(e, t, bt(n)); }
function Kk(e, t, n) { let o = String(t); o !== "" && !o.includes(" ") && cr(e, o, n); }
function Jk(e, t, n, o, r, i, s, a) { r === H && (r = F); let c = 0, l = 0, u = 0 < r.length ? r[0] : null, d = 0 < i.length ? i[0] : null; for (; u !== null || d !== null;) {
    let f = c < r.length ? r[c + 1] : void 0, p = l < i.length ? i[l + 1] : void 0, h = null, y;
    u === d ? (c += 2, l += 2, f !== p && (h = d, y = p)) : d === null || u !== null && u < d ? (c += 2, h = u) : (l += 2, h = d, y = p), h !== null && FD(e, t, n, o, h, y, s, a), u = c < r.length ? r[c] : null, d = l < i.length ? i[l] : null;
} }
function FD(e, t, n, o, r, i, s, a) { if (!(t.type & 3))
    return; let c = e.data, l = c[a + 1], u = xk(l) ? Jg(c, t, n, r, Eo(l), s) : void 0; if (!ia(u)) {
    ia(i) || kk(l) && (i = Jg(c, null, n, r, a, s));
    let d = fn(de(), n);
    pS(o, s, d, r, i);
} }
function Jg(e, t, n, o, r, i) { let s = t === null, a; for (; r > 0;) {
    let c = e[r], l = Array.isArray(c), u = l ? c[1] : c, d = u === null, f = n[r + 1];
    f === H && (f = d ? F : void 0);
    let p = d ? Qi(f, o) : u === o ? f : void 0;
    if (l && !ia(p) && (p = Qi(c, o)), ia(p) && (a = p, s))
        return a;
    let h = e[r + 1];
    r = s ? Sn(h) : Eo(h);
} if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = Qi(c, o));
} return a; }
function ia(e) { return e !== void 0; }
function Xk(e, t) { return e == null || e === "" || (typeof t == "string" ? e = e + t : typeof e == "object" && (e = Jo(bt(e)))), e; }
function jD(e, t) { return (e.flags & (t ? 8 : 16)) !== 0; }
function VD(e, t = "") { let n = g(), o = A(), r = e + E, i = o.firstCreatePass ? xn(o, r, 1, t, null) : o.data[r], s = HD(o, n, i, t); n[r] = s, mr() && tf(o, n, s, i), ct(i, !1); }
var HD = (e, t, n, o) => (Je(!0), Ld(t[w], o));
function eO(e, t, n, o) { let r = !Ta(t, n); if (Je(r), r)
    return Ld(t[w], o); let i = t[le]; return hi(i, e, t, n); }
function BD() { HD = eO; }
function UD(e, t) { let n = !1, o = lt(); for (let i = 1; i < t.length; i += 2)
    n = Y(e, o++, t[i]) || n; if (Nl(o), !n)
    return H; let r = t[0]; for (let i = 1; i < t.length; i += 2)
    r += b(t[i]) + (i + 1 !== t.length ? t[i + 1] : ""); return r; }
function $D(e, t, n, o = "") { return Y(e, ve(), n) ? t + b(n) + o : H; }
function qD(e, t, n, o, r, i = "") { let s = lt(), a = Nn(e, s, n, r); return ut(2), a ? t + b(n) + o + b(r) + i : H; }
function GD(e, t, n, o, r, i, s, a = "") { let c = lt(), l = Za(e, c, n, r, s); return ut(3), l ? t + b(n) + o + b(r) + i + b(s) + a : H; }
function WD(e, t, n, o, r, i, s, a, c, l = "") { let u = lt(), d = qe(e, u, n, r, s, c); return ut(4), d ? t + b(n) + o + b(r) + i + b(s) + a + b(c) + l : H; }
function zD(e, t, n, o, r, i, s, a, c, l, u, d = "") { let f = lt(), p = qe(e, f, n, r, s, c); return p = Y(e, f + 4, u) || p, ut(5), p ? t + b(n) + o + b(r) + i + b(s) + a + b(c) + l + b(u) + d : H; }
function QD(e, t, n, o, r, i, s, a, c, l, u, d, f, p = "") { let h = lt(), y = qe(e, h, n, r, s, c); return y = Nn(e, h + 4, u, f) || y, ut(6), y ? t + b(n) + o + b(r) + i + b(s) + a + b(c) + l + b(u) + d + b(f) + p : H; }
function ZD(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, y = "") { let I = lt(), C = qe(e, I, n, r, s, c); return C = Za(e, I + 4, u, f, h) || C, ut(7), C ? t + b(n) + o + b(r) + i + b(s) + a + b(c) + l + b(u) + d + b(f) + p + b(h) + y : H; }
function YD(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, y, I, C = "") { let O = lt(), te = qe(e, O, n, r, s, c); return te = qe(e, O + 4, u, f, h, I) || te, ut(8), te ? t + b(n) + o + b(r) + i + b(s) + a + b(c) + l + b(u) + d + b(f) + p + b(h) + y + b(I) + C : H; }
function gp(e) { return cc("", e), gp; }
function cc(e, t, n) { let o = g(), r = $D(o, e, t, n); return r !== H && kt(o, de(), r), cc; }
function mp(e, t, n, o, r) { let i = g(), s = qD(i, e, t, n, o, r); return s !== H && kt(i, de(), s), mp; }
function yp(e, t, n, o, r, i, s) { let a = g(), c = GD(a, e, t, n, o, r, i, s); return c !== H && kt(a, de(), c), yp; }
function vp(e, t, n, o, r, i, s, a, c) { let l = g(), u = WD(l, e, t, n, o, r, i, s, a, c); return u !== H && kt(l, de(), u), vp; }
function Ep(e, t, n, o, r, i, s, a, c, l, u) { let d = g(), f = zD(d, e, t, n, o, r, i, s, a, c, l, u); return f !== H && kt(d, de(), f), Ep; }
function Ip(e, t, n, o, r, i, s, a, c, l, u, d, f) { let p = g(), h = QD(p, e, t, n, o, r, i, s, a, c, l, u, d, f); return h !== H && kt(p, de(), h), Ip; }
function Dp(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h) { let y = g(), I = ZD(y, e, t, n, o, r, i, s, a, c, l, u, d, f, p, h); return I !== H && kt(y, de(), I), Dp; }
function Tp(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, y, I) { let C = g(), O = YD(C, e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, y, I); return O !== H && kt(C, de(), O), Tp; }
function Cp(e) { let t = g(), n = UD(t, e); return n !== H && kt(t, de(), n), Cp; }
function kt(e, t, n) { let o = fn(t, e); Oy(e[w], o, n); }
function Mp(e, t, n) { Lf(t) && (t = t()); let o = g(), r = ve(); if (Y(o, r, t)) {
    let i = A(), s = ke();
    of(s, o, e, t, o[w], n);
} return Mp; }
function KD(e, t) { let n = Lf(e); return n && e.set(t), n; }
function Np(e, t) { let n = g(), o = A(), r = _(); return cp(o, n, n[w], r, e, t), Np; }
var JD = {};
function wp(e) { J("NgLet"); let t = A(), n = g(), o = e + E, r = xn(t, o, 128, null, null); return ct(r, !1), fr(t, n, o, JD), wp; }
function XD(e) { let t = A(), n = g(), o = de(); return fr(t, n, o, e), e; }
function eT(e) { let t = Cl(), n = Ht(t, E + e); if (n === JD)
    throw new D(314, !1); return n; }
function tT(e, t) { let n = A(), o = g(), r = o[w], i = "data-ng-source-location"; for (let [s, a, c, l] of t) {
    let u = Vt(n, s + E), d = fn(s + E, o);
    if (!d.hasAttribute(i)) {
        let f = `${e}@o:${a},l:${c},c:${l}`;
        r.setAttribute(d, i, f);
    }
} }
function nT(e) { return Y(g(), ve(), e) ? b(e) : H; }
function oT(e, t, n = "") { return $D(g(), e, t, n); }
function rT(e, t, n, o, r = "") { return qD(g(), e, t, n, o, r); }
function iT(e, t, n, o, r, i, s = "") { return GD(g(), e, t, n, o, r, i, s); }
function sT(e, t, n, o, r, i, s, a, c = "") { return WD(g(), e, t, n, o, r, i, s, a, c); }
function aT(e, t, n, o, r, i, s, a, c, l, u = "") { return zD(g(), e, t, n, o, r, i, s, a, c, l, u); }
function cT(e, t, n, o, r, i, s, a, c, l, u, d, f = "") { return QD(g(), e, t, n, o, r, i, s, a, c, l, u, d, f); }
function lT(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h = "") { return ZD(g(), e, t, n, o, r, i, s, a, c, l, u, d, f, p, h); }
function uT(e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, y, I = "") { return YD(g(), e, t, n, o, r, i, s, a, c, l, u, d, f, p, h, y, I); }
function dT(e) { return UD(g(), e); }
function fT(e, t, n) { let o = me() + e, r = g(); return r[o] === H ? et(r, o, t(n, r)) : jo(r, o); }
function Xg(e, t, n) { let o = A(); o.firstCreatePass && pT(t, o.data, o.blueprint, He(e), n); }
function pT(e, t, n, o, r) { if (e = x(e), Array.isArray(e))
    for (let i = 0; i < e.length; i++)
        pT(e[i], t, n, o, r);
else {
    let i = A(), s = g(), a = _(), c = nn(e) ? e : x(e.provide), l = nl(e), u = a.providerIndexes & 1048575, d = a.directiveStart, f = a.providerIndexes >> 20;
    if (nn(e) || !e.multi) {
        let p = new In(l, r, Fo, null), h = su(c, t, r ? u : u + f, d);
        h === -1 ? (fu(Fs(a, s), i, c), iu(i, e, t.length), t.push(c), a.directiveStart++, a.directiveEnd++, r && (a.providerIndexes += 1048576), n.push(p), s.push(p)) : (n[h] = p, s[h] = p);
    }
    else {
        let p = su(c, t, u + f, d), h = su(c, t, u, u + f), y = p >= 0 && n[p], I = h >= 0 && n[h];
        if (r && !I || !r && !y) {
            fu(Fs(a, s), i, c);
            let C = oO(r ? nO : tO, n.length, r, o, l, e);
            !r && I && (n[h].providerFactory = C), iu(i, e, t.length, 0), t.push(c), a.directiveStart++, a.directiveEnd++, r && (a.providerIndexes += 1048576), n.push(C), s.push(C);
        }
        else {
            let C = hT(n[r ? h : p], l, !r && o);
            iu(i, e, p > -1 ? p : h, C);
        }
        !r && o && I && n[h].componentProviders++;
    }
} }
function iu(e, t, n, o) { let r = nn(t), i = Nh(t); if (r || i) {
    let c = (i ? x(t.useClass) : t).prototype.ngOnDestroy;
    if (c) {
        let l = e.destroyHooks || (e.destroyHooks = []);
        if (!r && t.multi) {
            let u = l.indexOf(n);
            u === -1 ? l.push(n, [o, c]) : l[u + 1].push(o, c);
        }
        else
            l.push(n, c);
    }
} }
function hT(e, t, n) { return n && e.componentProviders++, e.multi.push(t) - 1; }
function su(e, t, n, o) { for (let r = n; r < o; r++)
    if (t[r] === e)
        return r; return -1; }
function tO(e, t, n, o, r) { return ud(this.multi, []); }
function nO(e, t, n, o, r) { let i = this.multi, s; if (this.providerFactory) {
    let a = this.providerFactory.componentProviders, c = Or(o, o[m], this.providerFactory.index, r);
    s = c.slice(0, a), ud(i, s);
    for (let l = a; l < c.length; l++)
        s.push(c[l]);
}
else
    s = [], ud(i, s); return s; }
function ud(e, t) { for (let n = 0; n < e.length; n++) {
    let o = e[n];
    t.push(o());
} return t; }
function oO(e, t, n, o, r, i) { let s = new In(e, n, Fo, null); return s.multi = [], s.index = t, s.componentProviders = 0, hT(s, r, o && !n), s; }
function gT(e, t) { return n => { n.providersResolver = (o, r) => Xg(o, r ? r(e) : e, !1), t && (n.viewProvidersResolver = (o, r) => Xg(o, r ? r(t) : t, !0)); }; }
function mT(e) { return t => { e.length < 1 || (t.getExternalStyles = n => e.map(r => r + "?ngcomp" + (n ? "=" + encodeURIComponent(n) : "") + "&e=" + t.encapsulation)); }; }
function yT(e, t, n) { let o = e.\u0275cmp; o.directiveDefs = Xs(t, HE), o.pipeDefs = Xs(n, Qe); }
function vT(e, t) { return ft(() => { let n = $i(e); n.declarations = Ds(t.declarations || F), n.imports = Ds(t.imports || F), n.exports = Ds(t.exports || F), t.bootstrap && (n.bootstrap = Ds(t.bootstrap)), po.registerNgModule(e, t); }); }
function Ds(e) { if (typeof e == "function")
    return e; let t = Ze(e); return t.some(er) ? () => t.map(x).map(em) : t.map(em); }
function em(e) { return pf(e) ? e.ngModule : e; }
function ET(e, t) { let n = me() + e, o = g(); return o[n] === H ? et(o, n, t()) : jo(o, n); }
function IT(e, t, n) { return bT(g(), me(), e, t, n); }
function DT(e, t, n, o) { return AT(g(), me(), e, t, n, o); }
function TT(e, t, n, o, r) { return RT(g(), me(), e, t, n, o, r); }
function CT(e, t, n, o, r, i, s) { return kT(g(), me(), e, t, n, o, r, i); }
function MT(e, t, n, o, r, i, s) { let a = me() + e, c = g(), l = qe(c, a, n, o, r, i); return Y(c, a + 4, s) || l ? et(c, a + 5, t(n, o, r, i, s)) : jo(c, a + 5); }
function NT(e, t, n, o, r, i, s, a) { let c = me() + e, l = g(), u = qe(l, c, n, o, r, i); return Nn(l, c + 4, s, a) || u ? et(l, c + 6, t(n, o, r, i, s, a)) : jo(l, c + 6); }
function wT(e, t, n, o, r, i, s, a, c) { let l = me() + e, u = g(), d = qe(u, l, n, o, r, i); return Za(u, l + 4, s, a, c) || d ? et(u, l + 7, t(n, o, r, i, s, a, c)) : jo(u, l + 7); }
function _T(e, t, n, o, r, i, s, a, c, l) { let u = me() + e, d = g(), f = qe(d, u, n, o, r, i); return qe(d, u + 4, s, a, c, l) || f ? et(d, u + 8, t(n, o, r, i, s, a, c, l)) : jo(d, u + 8); }
function ST(e, t, n) { return OT(g(), me(), e, t, n); }
function Ti(e, t) { let n = e[t]; return n === H ? void 0 : n; }
function bT(e, t, n, o, r, i) { let s = t + n; return Y(e, s, r) ? et(e, s + 1, i ? o.call(i, r) : o(r)) : Ti(e, s + 1); }
function AT(e, t, n, o, r, i, s) { let a = t + n; return Nn(e, a, r, i) ? et(e, a + 2, s ? o.call(s, r, i) : o(r, i)) : Ti(e, a + 2); }
function RT(e, t, n, o, r, i, s, a) { let c = t + n; return Za(e, c, r, i, s) ? et(e, c + 3, a ? o.call(a, r, i, s) : o(r, i, s)) : Ti(e, c + 3); }
function kT(e, t, n, o, r, i, s, a, c) { let l = t + n; return qe(e, l, r, i, s, a) ? et(e, l + 4, c ? o.call(c, r, i, s, a) : o(r, i, s, a)) : Ti(e, l + 4); }
function OT(e, t, n, o, r, i) { let s = t + n, a = !1; for (let c = 0; c < r.length; c++)
    Y(e, s++, r[c]) && (a = !0); return a ? et(e, s, o.apply(i, r)) : Ti(e, s); }
function xT(e, t) { let n = A(), o, r = e + E; n.firstCreatePass ? (o = rO(t, n.pipeRegistry), n.data[r] = o, o.onDestroy && (n.destroyHooks ??= []).push(r, o.onDestroy)) : o = n.data[r]; let i = o.factory || (o.factory = xt(o.type, !0)), s, a = Ie(Fo); try {
    let c = Ls(!1), l = i();
    return Ls(c), fr(n, g(), r, l), l;
}
finally {
    Ie(a);
} }
function rO(e, t) { if (t)
    for (let n = t.length - 1; n >= 0; n--) {
        let o = t[n];
        if (e === o.name)
            return o;
    } }
function PT(e, t, n) { let o = e + E, r = g(), i = Ht(r, o); return Ci(r, o) ? bT(r, me(), t, i.transform, n, i) : i.transform(n); }
function LT(e, t, n, o) { let r = e + E, i = g(), s = Ht(i, r); return Ci(i, r) ? AT(i, me(), t, s.transform, n, o, s) : s.transform(n, o); }
function FT(e, t, n, o, r) { let i = e + E, s = g(), a = Ht(s, i); return Ci(s, i) ? RT(s, me(), t, a.transform, n, o, r, a) : a.transform(n, o, r); }
function jT(e, t, n, o, r, i) { let s = e + E, a = g(), c = Ht(a, s); return Ci(a, s) ? kT(a, me(), t, c.transform, n, o, r, i, c) : c.transform(n, o, r, i); }
function VT(e, t, n) { let o = e + E, r = g(), i = Ht(r, o); return Ci(r, o) ? OT(r, me(), t, i.transform, n, i) : i.transform.apply(i, n); }
function Ci(e, t) { return e[m].data[t].pure; }
function HT(e, t) { return Ba(e, t); }
function BT(e, t) { return () => { try {
    return po.getComponentDependencies(e, t).dependencies;
}
catch (n) {
    throw console.error(`Computing dependencies in local compilation mode for the component "${e.name}" failed with the exception:`, n), n;
} }; }
function UT(e, t) { let n = W(e); n !== null && (n.debugInfo = t); }
function $T(e, t, n) { let o = `./@ng/component?c=${e}&t=${encodeURIComponent(t)}`; return new URL(o, n).href; }
function qT(e, t, n, o, r = null, i = null) { let s = W(e); t.apply(null, [e, n, ...o]); let { newDef: a, oldDef: c } = iO(s, W(e)); if (e[rn] = a, c.tView) {
    let l = JN().values();
    for (let u of l)
        st(u) && u[Q] === null && Rs(r, i, a, c, u);
} }
function iO(e, t) { let n = z({}, e); return { newDef: Object.assign(e, t, { directiveDefs: n.directiveDefs, pipeDefs: n.pipeDefs, setInput: n.setInput, type: n.type }), oldDef: n }; }
function Rs(e, t, n, o, r) { let i = r[m]; if (i === o.tView) {
    aO(e, t, n, o, r);
    return;
} for (let s = E; s < i.bindingStartIndex; s++) {
    let a = r[s];
    if (K(a)) {
        ne(a[$]) && Rs(e, t, n, o, a[$]);
        for (let c = G; c < a.length; c++)
            Rs(e, t, n, o, a[c]);
    }
    else
        ne(a) && Rs(e, t, n, o, a);
} }
function sO(e, t) { e.componentReplaced?.(t.id); }
function aO(e, t, n, o, r) { let i = r[U], s = r[$], a = r[Q], c = r[ce], l = r[P].get(q, null), u = () => { if (o.encapsulation === $e.ShadowDom || o.encapsulation === $e.ExperimentalIsolatedShadowDom) {
    let h = s.cloneNode(!1);
    s.replaceWith(h), s = h;
} let d = Qy(n), f = Ma(a, d, i, $d(n), s, c, null, null, null, null, null); cO(a, r, f, c.index), fi(r[m], r), Br(r); let p = r[je].rendererFactory; sO(p, o), f[w] = p.createRenderer(s, n), sv(r[m], r), lO(c), Va(d, f, i), Nv(d, f, d.template, i); }; l === null ? tm(e, t, u) : l.run(() => tm(e, t, u)); }
function tm(e, t, n) {
    try {
        n();
    }
    catch (o) {
        let r = o;
        if (t !== null && r.message) {
            let i = r.message + (r.stack ? `
` + r.stack : "");
            e?.hot?.send?.("angular:invalidate", { id: t, message: i, error: !0 });
        }
        throw o;
    }
}
function cO(e, t, n, o) { for (let r = E; r < e[m].bindingStartIndex; r++) {
    let i = e[r];
    if ((ne(i) || K(i)) && i[he] === t) {
        i[he] = n;
        break;
    }
} e[Ft] === t && (e[Ft] = n), e[lr] === t && (e[lr] = n), n[he] = t[he], t[he] = null, e[o] = n; }
function lO(e) { if (e.projection !== null) {
    for (let t of e.projection)
        aa(t) && (t.projectionNext = null, t.flags &= -3);
    e.projection = null;
} }
var Ee = { \u0275\u0275animateEnter: wr, \u0275\u0275animateEnterListener: _r, \u0275\u0275animateLeave: Sr, \u0275\u0275animateLeaveListener: ea, \u0275\u0275attribute: qf, \u0275\u0275defineComponent: VE, \u0275\u0275defineDirective: BE, \u0275\u0275defineInjectable: B, \u0275\u0275defineInjector: tr, \u0275\u0275defineNgModule: Sf, \u0275\u0275definePipe: UE, \u0275\u0275directiveInject: Fo, \u0275\u0275getInheritedFactory: Rm, \u0275\u0275inject: pe, \u0275\u0275injectAttribute: ca, \u0275\u0275invalidFactory: iE, \u0275\u0275invalidFactoryDep: Wi, \u0275\u0275templateRefExtractor: HT, \u0275\u0275resetView: El, \u0275\u0275HostDirectivesFeature: WE, \u0275\u0275NgOnChangesFeature: gm, \u0275\u0275ControlFeature: GE, \u0275\u0275ProvidersFeature: gT, \u0275\u0275InheritDefinitionFeature: bf, \u0275\u0275ExternalStylesFeature: mT, \u0275\u0275nextContext: ED, \u0275\u0275namespaceHTML: Rl, \u0275\u0275namespaceMathML: Al, \u0275\u0275namespaceSVG: bl, \u0275\u0275enableBindings: gl, \u0275\u0275disableBindings: ml, \u0275\u0275elementStart: Qr, \u0275\u0275elementEnd: oc, \u0275\u0275element: Wf, \u0275\u0275elementContainerStart: sc, \u0275\u0275elementContainerEnd: Ii, \u0275\u0275domElement: zf, \u0275\u0275domElementStart: rc, \u0275\u0275domElementEnd: ic, \u0275\u0275domElementContainer: Kf, \u0275\u0275domElementContainerStart: ac, \u0275\u0275domElementContainerEnd: Yf, \u0275\u0275domTemplate: Rf, \u0275\u0275domListener: ap, \u0275\u0275elementContainer: Zf, \u0275\u0275pureFunction0: ET, \u0275\u0275pureFunction1: IT, \u0275\u0275pureFunction2: DT, \u0275\u0275pureFunction3: TT, \u0275\u0275pureFunction4: CT, \u0275\u0275pureFunction5: MT, \u0275\u0275pureFunction6: NT, \u0275\u0275pureFunction7: wT, \u0275\u0275pureFunction8: _T, \u0275\u0275pureFunctionV: ST, \u0275\u0275getCurrentView: XI, \u0275\u0275restoreView: vl, \u0275\u0275listener: ip, \u0275\u0275projection: DD, \u0275\u0275syntheticHostProperty: ep, \u0275\u0275syntheticHostListener: sp, \u0275\u0275pipeBind1: PT, \u0275\u0275pipeBind2: LT, \u0275\u0275pipeBind3: FT, \u0275\u0275pipeBind4: jT, \u0275\u0275pipeBindV: VT, \u0275\u0275projectionDef: ID, \u0275\u0275domProperty: Xf, \u0275\u0275ariaProperty: $f, \u0275\u0275property: Gf, \u0275\u0275control: hE, \u0275\u0275controlCreate: fE, \u0275\u0275pipe: xT, \u0275\u0275queryRefresh: TD, \u0275\u0275queryAdvance: MD, \u0275\u0275viewQuery: up, \u0275\u0275viewQuerySignal: fp, \u0275\u0275loadQuery: CD, \u0275\u0275contentQuery: lp, \u0275\u0275contentQuerySignal: dp, \u0275\u0275reference: ND, \u0275\u0275classMap: RD, \u0275\u0275styleMap: AD, \u0275\u0275styleProp: pp, \u0275\u0275classProp: hp, \u0275\u0275advance: Zy, \u0275\u0275template: Af, \u0275\u0275conditional: WI, \u0275\u0275conditionalCreate: GI, \u0275\u0275conditionalBranchCreate: nc, \u0275\u0275defer: DI, \u0275\u0275deferWhen: TI, \u0275\u0275deferOnIdle: wI, \u0275\u0275deferOnImmediate: bI, \u0275\u0275deferOnTimer: kI, \u0275\u0275deferOnHover: PI, \u0275\u0275deferOnInteraction: jI, \u0275\u0275deferOnViewport: BI, \u0275\u0275deferPrefetchWhen: CI, \u0275\u0275deferPrefetchOnIdle: _I, \u0275\u0275deferPrefetchOnImmediate: AI, \u0275\u0275deferPrefetchOnTimer: OI, \u0275\u0275deferPrefetchOnHover: LI, \u0275\u0275deferPrefetchOnInteraction: VI, \u0275\u0275deferPrefetchOnViewport: UI, \u0275\u0275deferHydrateWhen: MI, \u0275\u0275deferHydrateNever: NI, \u0275\u0275deferHydrateOnIdle: SI, \u0275\u0275deferHydrateOnImmediate: RI, \u0275\u0275deferHydrateOnTimer: xI, \u0275\u0275deferHydrateOnHover: FI, \u0275\u0275deferHydrateOnInteraction: HI, \u0275\u0275deferHydrateOnViewport: $I, \u0275\u0275deferEnableTimerScheduling: aI, \u0275\u0275repeater: YI, \u0275\u0275repeaterCreate: ZI, \u0275\u0275repeaterTrackByIndex: zI, \u0275\u0275repeaterTrackByIdentity: QI, \u0275\u0275componentInstance: qI, \u0275\u0275text: VD, \u0275\u0275textInterpolate: gp, \u0275\u0275textInterpolate1: cc, \u0275\u0275textInterpolate2: mp, \u0275\u0275textInterpolate3: yp, \u0275\u0275textInterpolate4: vp, \u0275\u0275textInterpolate5: Ep, \u0275\u0275textInterpolate6: Ip, \u0275\u0275textInterpolate7: Dp, \u0275\u0275textInterpolate8: Tp, \u0275\u0275textInterpolateV: Cp, \u0275\u0275i18n: gD, \u0275\u0275i18nAttributes: mD, \u0275\u0275i18nExp: rp, \u0275\u0275i18nStart: np, \u0275\u0275i18nEnd: op, \u0275\u0275i18nApply: yD, \u0275\u0275i18nPostprocess: vD, \u0275\u0275resolveWindow: qy, \u0275\u0275resolveDocument: Gy, \u0275\u0275resolveBody: Hd, \u0275\u0275setComponentScope: yT, \u0275\u0275setNgModuleScope: vT, \u0275\u0275registerNgModuleType: Nf, \u0275\u0275getComponentDepsFactory: BT, \u0275setClassDebugInfo: UT, \u0275\u0275declareLet: wp, \u0275\u0275storeLet: XD, \u0275\u0275arrowFunction: fT, \u0275\u0275readContextLet: eT, \u0275\u0275attachSourceLocations: tT, \u0275\u0275interpolate: nT, \u0275\u0275interpolate1: oT, \u0275\u0275interpolate2: rT, \u0275\u0275interpolate3: iT, \u0275\u0275interpolate4: sT, \u0275\u0275interpolate5: aT, \u0275\u0275interpolate6: cT, \u0275\u0275interpolate7: lT, \u0275\u0275interpolate8: uT, \u0275\u0275interpolateV: dT, \u0275\u0275sanitizeHtml: Fy, \u0275\u0275sanitizeStyle: jy, \u0275\u0275sanitizeResourceUrl: Vd, \u0275\u0275sanitizeScript: Vy, \u0275\u0275validateAttribute: $y, \u0275\u0275sanitizeUrl: jd, \u0275\u0275sanitizeUrlOrResourceUrl: Uy, \u0275\u0275trustConstantHtml: Hy, \u0275\u0275trustConstantResourceUrl: By, forwardRef: Xo, resolveForwardRef: x, \u0275\u0275twoWayProperty: Mp, \u0275\u0275twoWayBindingSet: KD, \u0275\u0275twoWayListener: Np, \u0275\u0275replaceMetadata: qT, \u0275\u0275getReplaceMetadataURL: $T }, no = null;
function GT(e) { no !== null && (e.defaultEncapsulation !== no.defaultEncapsulation || e.preserveWhitespaces !== no.preserveWhitespaces) || (no = e); }
function uO() { return no; }
function dO() { no = null; }
var kr = [];
function fO(e, t) { kr.push({ moduleType: e, ngModule: t }); }
var au = !1;
function WT() { if (!au) {
    au = !0;
    try {
        for (let e = kr.length - 1; e >= 0; e--) {
            let { moduleType: t, ngModule: n } = kr[e];
            n.declarations && n.declarations.every(zT) && (kr.splice(e, 1), yO(t, n));
        }
    }
    finally {
        au = !1;
    }
} }
function zT(e) { return Array.isArray(e) ? e.every(zT) : !!x(e); }
function QT(e, t = {}) { ZT(e, t), t.id !== void 0 && Nf(e, t.id), fO(e, t); }
function ZT(e, t, n = !1) { let o = Ze(t.declarations || F), r = null; Object.defineProperty(e, Ui, { configurable: !0, get: () => (r === null && (r = re({ usage: 0, kind: "NgModule", type: e }).compileNgModule(Ee, `ng:///${e.name}/\u0275mod.js`, { type: e, bootstrap: Ze(t.bootstrap || F).map(x), declarations: o.map(x), imports: Ze(t.imports || F).map(x).map(nm), exports: Ze(t.exports || F).map(x).map(nm), schemas: t.schemas ? Ze(t.schemas) : null, id: t.id || null }), r.schemas || (r.schemas = [])), r) }); let i = null; Object.defineProperty(e, ot, { get: () => { if (i === null) {
        let a = re({ usage: 0, kind: "NgModule", type: e });
        i = a.compileFactory(Ee, `ng:///${e.name}/\u0275fac.js`, { name: e.name, type: e, deps: la(e), target: a.FactoryTarget.NgModule, typeArgumentCount: 0 });
    } return i; }, configurable: !1 }); let s = null; Object.defineProperty(e, Wo, { get: () => { if (s === null) {
        let a = { name: e.name, type: e, providers: t.providers || F, imports: [(t.imports || F).map(x), (t.exports || F).map(x)] };
        s = re({ usage: 0, kind: "NgModule", type: e }).compileInjector(Ee, `ng:///${e.name}/\u0275inj.js`, a);
    } return s; }, configurable: !1 }); }
function pO(e, t) { let n = `Unexpected "${Pe(e)}" found in the "declarations" array of the`, o = `"${Pe(e)}" is marked as standalone and can't be declared in any NgModule - did you intend to import it instead (by adding it to the "imports" array)?`; return `${n} ${t}, ${o}`; }
var hO = new WeakMap, gO = new WeakMap;
function mO() { hO = new WeakMap, gO = new WeakMap, kr.length = 0, PA.clear(); }
function yO(e, t) { let n = Ze(t.declarations || F), o = Sp(e); n.forEach(r => { if (r = x(r), r.hasOwnProperty(rn)) {
    let s = W(r);
    _p(s, o);
}
else
    !r.hasOwnProperty(or) && !r.hasOwnProperty(rr) && (r.ngSelectorScope = e); }); }
function _p(e, t) { e.directiveDefs = () => Array.from(t.compilation.directives).map(n => n.hasOwnProperty(rn) ? W(n) : be(n)).filter(n => !!n), e.pipeDefs = () => Array.from(t.compilation.pipes).map(n => Qe(n)), e.schemas = t.schemas, e.tView = null; }
function Sp(e) { if (gn(e)) {
    let t = po.getNgModuleScope(e), n = $i(e);
    return z({ schemas: n.schemas || null }, t);
}
else if (ir(e)) {
    if ((W(e) || be(e)) !== null)
        return { schemas: null, compilation: { directives: new Set, pipes: new Set }, exported: { directives: new Set([e]), pipes: new Set } };
    if (Qe(e) !== null)
        return { schemas: null, compilation: { directives: new Set, pipes: new Set }, exported: { directives: new Set, pipes: new Set([e]) } };
} throw new Error(`${e.name} does not have a module def (\u0275mod property)`); }
function nm(e) { return pf(e) ? e.ngModule : e; }
var cu = 0;
function YT(e, t) {
    let n = null;
    MA(e, t), JT(e, t), Object.defineProperty(e, rn, { get: () => {
            if (n === null) {
                let o = re({ usage: 0, kind: "component", type: e });
                if (OE(t)) {
                    let u = [`Component '${e.name}' is not resolved:`];
                    throw t.templateUrl && u.push(` - templateUrl: ${t.templateUrl}`), t.styleUrls && t.styleUrls.length && u.push(` - styleUrls: ${JSON.stringify(t.styleUrls)}`), t.styleUrl && u.push(` - styleUrl: ${t.styleUrl}`), u.push("Did you run and wait for 'resolveComponentResources()'?"), new Error(u.join(`
`));
                }
                let r = uO(), i = t.preserveWhitespaces;
                i === void 0 && (r !== null && r.preserveWhitespaces !== void 0 ? i = r.preserveWhitespaces : i = !1);
                let s = t.encapsulation;
                s === void 0 && (r !== null && r.defaultEncapsulation !== void 0 ? s = r.defaultEncapsulation : s = $e.Emulated);
                let a = t.templateUrl || `ng:///${e.name}/template.html`, c = XT(e, t), l = we(z({}, c), { typeSourceSpan: o.createParseSourceSpan("Component", e.name, a), template: t.template || "", preserveWhitespaces: i, styles: typeof t.styles == "string" ? [t.styles] : t.styles || F, animations: t.animations, declarations: [], changeDetection: t.changeDetection, encapsulation: s, viewProviders: t.viewProviders || null, hasDirectiveDependencies: !c.isStandalone || t.imports != null && t.imports.length > 0 });
                cu++;
                try {
                    if (l.usesInheritance && eC(e), n = o.compileComponent(Ee, a, l), l.isStandalone) {
                        let u = Ze(t.imports || F), { directiveDefs: d, pipeDefs: f } = vO(e, u);
                        n.directiveDefs = d, n.pipeDefs = f, n.dependencies = () => u.map(x);
                    }
                }
                finally {
                    cu--;
                }
                if (cu === 0 && WT(), EO(e)) {
                    let u = Sp(e.ngSelectorScope);
                    _p(n, u);
                }
                if (t.schemas)
                    if (l.isStandalone)
                        n.schemas = t.schemas;
                    else
                        throw new Error(`The 'schemas' was specified for the ${Pe(e)} but is only valid on a component that is standalone.`);
                else
                    l.isStandalone && (n.schemas = []);
            }
            return n;
        }, set: o => { n = o; }, configurable: !1 });
}
function vO(e, t) { return { directiveDefs: () => Mr(e) ? [...po.getStandaloneComponentScope(e, t).compilation.directives].map(i => W(i) || be(i)).filter(i => i !== null) : [], pipeDefs: () => Mr(e) ? [...po.getStandaloneComponentScope(e, t).compilation.pipes].map(i => Qe(i)).filter(i => i !== null) : [] }; }
function EO(e) { return e.ngSelectorScope !== void 0; }
function bp(e, t) { let n = null; JT(e, t || {}), Object.defineProperty(e, or, { get: () => { if (n === null) {
        let o = KT(e, t || {});
        n = re({ usage: 0, kind: "directive", type: e }).compileDirective(Ee, o.sourceMapUrl, o.metadata);
    } return n; }, configurable: !1 }); }
function KT(e, t) { let n = e && e.name, o = `ng:///${n}/\u0275dir.js`, r = re({ usage: 0, kind: "directive", type: e }), i = XT(e, t); return i.typeSourceSpan = r.createParseSourceSpan("Directive", n, o), i.usesInheritance && eC(e), { metadata: i, sourceMapUrl: o }; }
function JT(e, t) { let n = null; Object.defineProperty(e, ot, { get: () => { if (n === null) {
        let o = KT(e, t), r = re({ usage: 0, kind: "directive", type: e });
        n = r.compileFactory(Ee, `ng:///${e.name}/\u0275fac.js`, { name: o.metadata.name, type: o.metadata.type, typeArgumentCount: 0, deps: la(e), target: r.FactoryTarget.Directive });
    } return n; }, configurable: !1 }); }
function IO(e) { return Object.getPrototypeOf(e.prototype) === Object.prototype; }
function XT(e, t) { let n = gd(), o = n.ownPropMetadata(e); return { name: e.name, type: e, selector: t.selector !== void 0 ? t.selector : null, host: t.host || Le, propMetadata: o, inputs: t.inputs || F, outputs: t.outputs || F, queries: om(e, o, tC), lifecycle: { usesOnChanges: n.hasLifecycleHook(e, "ngOnChanges") }, controlCreate: null, typeSourceSpan: null, usesInheritance: !IO(e), exportAs: CO(t.exportAs), providers: t.providers || null, viewQueries: om(e, o, nC), isStandalone: t.standalone === void 0 ? !0 : !!t.standalone, isSignal: !!t.signals, hostDirectives: t.hostDirectives?.map(r => typeof r == "function" ? { directive: r } : r) || null }; }
function eC(e) { let t = Object.prototype, n = Object.getPrototypeOf(e.prototype).constructor; for (; n && n !== t;)
    !be(n) && !W(n) && NO(n) && bp(n, null), n = Object.getPrototypeOf(n); }
function DO(e) { return typeof e == "string" ? rC(e) : x(e); }
function TO(e, t) { return { propertyName: e, predicate: DO(t.selector), descendants: t.descendants, first: t.first, read: t.read ? t.read : null, static: !!t.static, emitDistinctChangesOnly: !!t.emitDistinctChangesOnly, isSignal: !!t.isSignal }; }
function om(e, t, n) { let o = []; for (let r in t)
    if (t.hasOwnProperty(r)) {
        let i = t[r];
        i.forEach(s => { if (n(s)) {
            if (!s.selector)
                throw new Error(`Can't construct a query for the property "${r}" of "${Pe(e)}" since the query selector wasn't defined.`);
            if (i.some(oC))
                throw new Error("Cannot combine @Input decorators with query decorators");
            o.push(TO(r, s));
        } });
    } return o; }
function CO(e) { return e === void 0 ? null : rC(e); }
function tC(e) { let t = e.ngMetadataName; return t === "ContentChild" || t === "ContentChildren"; }
function nC(e) { let t = e.ngMetadataName; return t === "ViewChild" || t === "ViewChildren"; }
function oC(e) { return e.ngMetadataName === "Input"; }
function rC(e) { return e.split(",").map(t => t.trim()); }
var MO = ["ngOnChanges", "ngOnInit", "ngOnDestroy", "ngDoCheck", "ngAfterViewInit", "ngAfterViewChecked", "ngAfterContentInit", "ngAfterContentChecked"];
function NO(e) { let t = gd(); if (MO.some(o => t.hasLifecycleHook(e, o)))
    return !0; let n = t.propMetadata(e); for (let o in n) {
    let r = n[o];
    for (let i = 0; i < r.length; i++) {
        let s = r[i], a = s.ngMetadataName;
        if (oC(s) || tC(s) || nC(s) || a === "Output" || a === "HostBinding" || a === "HostListener")
            return !0;
    }
} return !1; }
function iC(e, t) { let n = null, o = null; Object.defineProperty(e, ot, { get: () => { if (o === null) {
        let r = rm(e, t), i = re({ usage: 0, kind: "pipe", type: r.type });
        o = i.compileFactory(Ee, `ng:///${r.name}/\u0275fac.js`, { name: r.name, type: r.type, typeArgumentCount: 0, deps: la(e), target: i.FactoryTarget.Pipe });
    } return o; }, configurable: !1 }), Object.defineProperty(e, rr, { get: () => { if (n === null) {
        let r = rm(e, t);
        n = re({ usage: 0, kind: "pipe", type: r.type }).compilePipe(Ee, `ng:///${r.name}/\u0275pipe.js`, r);
    } return n; }, configurable: !1 }); }
function rm(e, t) { return { type: e, name: e.name, pipeName: t.name, pure: t.pure !== void 0 ? t.pure : !0, isStandalone: t.standalone === void 0 ? !0 : !!t.standalone }; }
var sC = Xr("Directive", (e = {}) => e, void 0, void 0, (e, t) => bp(e, t)), wO = Xr("Component", (e = {}) => z({ changeDetection: ua.Eager }, e), sC, void 0, (e, t) => YT(e, t)), _O = Xr("Pipe", e => z({ pure: !0 }, e), void 0, void 0, (e, t) => iC(e, t)), SO = wt("Input", e => e ? typeof e == "string" ? { alias: e } : e : {}), bO = wt("Output", e => ({ alias: e })), AO = wt("HostBinding", e => ({ hostPropertyName: e })), RO = wt("HostListener", (e, t) => ({ eventName: e, args: t })), kO = Xr("NgModule", e => e, void 0, void 0, (e, t) => QT(e, t)), sa = class {
    ngModuleFactory;
    componentFactories;
    constructor(t, n) { this.ngModuleFactory = t, this.componentFactories = n; }
}, OO = (() => { class e {
    compileModuleSync(n) { return new yo(n); }
    compileModuleAsync(n) { return Promise.resolve(this.compileModuleSync(n)); }
    compileModuleAndAllComponentsSync(n) { let o = this.compileModuleSync(n), r = an(n), i = eo(r.declarations).reduce((s, a) => { let c = W(a); return c && s.push(new Yt(c)), s; }, []); return new sa(o, i); }
    compileModuleAndAllComponentsAsync(n) { return Promise.resolve(this.compileModuleAndAllComponentsSync(n)); }
    clearCache() { }
    clearCacheFor(n) { }
    getModuleId(n) { }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = B({ token: e, factory: e.\u0275fac, providedIn: "root" });
} return e; })(), aC = new T(""), dd = class {
};
var cC = (() => { class e {
    applicationErrorHandler = v(It);
    appRef = v(Ge);
    taskService = v(Et);
    ngZone = v(q);
    zonelessEnabled = v(zn);
    tracing = v(On, { optional: !0 });
    zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new hN;
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(Zo) : null;
    scheduleInRootZone = !this.zonelessEnabled && this.zoneIsDefined && (v(ls, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() { this.subscriptions.add(this.appRef.afterTick.subscribe(() => { let n = this.taskService.add(); if (!this.runningTick && (this.cleanup(), !this.zonelessEnabled || this.appRef.includeAllTestViews)) {
        this.taskService.remove(n);
        return;
    } this.switchToMicrotaskScheduler(), this.taskService.remove(n); })), this.subscriptions.add(this.ngZone.onUnstable.subscribe(() => { this.runningTick || this.cleanup(); })); }
    switchToMicrotaskScheduler() { this.ngZone.runOutsideAngular(() => { let n = this.taskService.add(); this.useMicrotaskScheduler = !0, queueMicrotask(() => { this.useMicrotaskScheduler = !1, this.taskService.remove(n); }); }); }
    notify(n) { if (!this.zonelessEnabled && n === 5)
        return; switch (n) {
        case 0: {
            this.appRef.dirtyFlags |= 2;
            break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
            this.appRef.dirtyFlags |= 4;
            break;
        }
        case 6: {
            this.appRef.dirtyFlags |= 2;
            break;
        }
        case 12: {
            this.appRef.dirtyFlags |= 16;
            break;
        }
        case 13: {
            this.appRef.dirtyFlags |= 2;
            break;
        }
        case 11: break;
        default: this.appRef.dirtyFlags |= 8;
    } if (this.appRef.tracingSnapshot = this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null, !this.shouldScheduleTick())
        return; let o = this.useMicrotaskScheduler ? Uh : Ll; this.pendingRenderTaskId = this.taskService.add(), this.scheduleInRootZone ? this.cancelScheduledCallback = Zone.root.run(() => o(() => this.tick())) : this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() => o(() => this.tick())); }
    shouldScheduleTick() { return !(this.appRef.destroyed || this.pendingRenderTaskId !== null || this.runningTick || this.appRef._runningTick || !this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(Zo + this.angularZoneId)); }
    tick() { if (this.runningTick || this.appRef.destroyed)
        return; if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
    } !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1); let n = this.taskService.add(); try {
        this.ngZone.run(() => { this.runningTick = !0, this.appRef._tick(); }, void 0, this.schedulerTickApplyArgs);
    }
    catch (o) {
        this.applicationErrorHandler(o);
    }
    finally {
        this.taskService.remove(n), this.cleanup();
    } }
    ngOnDestroy() { this.subscriptions.unsubscribe(), this.cleanup(); }
    cleanup() { if (this.runningTick = !1, this.cancelScheduledCallback?.(), this.cancelScheduledCallback = null, this.pendingRenderTaskId !== null) {
        let n = this.pendingRenderTaskId;
        this.pendingRenderTaskId = null, this.taskService.remove(n);
    } }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = B({ token: e, factory: e.\u0275fac, providedIn: "root" });
} return e; })();
function xO() { return J("NgZoneless"), Ye([...lc(), []]); }
function lc() { return [{ provide: xe, useExisting: cC }, { provide: q, useClass: Yo }, { provide: zn, useValue: !0 }]; }
function PO() { return typeof $localize < "u" && $localize.locale || Di; }
var Ap = new T("", { factory: () => v(Ap, { optional: !0, skipSelf: !0 }) || PO() }), LO = new T("", { factory: () => JR }), FO = new T(""), jO = new T(""), lC = (function (e) { return e[e.Error = 0] = "Error", e[e.Warning = 1] = "Warning", e[e.Ignore = 2] = "Ignore", e; })(lC || {}), fd = class {
    name;
    callback;
    constructor(t, n) { this.name = t, this.callback = n; }
};
function VO(e) { return e.map(t => t.nativeElement); }
var Kr = class {
    nativeNode;
    constructor(t) { this.nativeNode = t; }
    get parent() { let t = this.nativeNode.parentNode; return t ? new bn(t) : null; }
    get injector() { return cw(this.nativeNode); }
    get componentInstance() { let t = this.nativeNode; return t && (og(t) || aw(t)); }
    get context() { return og(this.nativeNode) || sw(this.nativeNode); }
    get listeners() { return pw(this.nativeNode).filter(t => t.type === "dom"); }
    get references() { return dw(this.nativeNode); }
    get providerTokens() { return lw(this.nativeNode); }
}, bn = class extends Kr {
    constructor(t) { super(t); }
    get nativeElement() { return this.nativeNode.nodeType == Node.ELEMENT_NODE ? this.nativeNode : null; }
    get name() { let t = Me(this.nativeNode), n = t ? t.lView : null; return n !== null ? n[m].data[t.nodeIndex].value : this.nativeNode.nodeName; }
    get properties() { let t = Me(this.nativeNode), n = t ? t.lView : null; if (n === null)
        return {}; let o = n[m].data, r = o[t.nodeIndex], i = {}; return HO(this.nativeElement, i), UO(i, r, n, o), i; }
    get attributes() { let t = {}, n = this.nativeElement; if (!n)
        return t; let o = Me(n), r = o ? o.lView : null; if (r === null)
        return {}; let i = r[m].data[o.nodeIndex].attrs, s = []; if (i) {
        let a = 0;
        for (; a < i.length;) {
            let c = i[a];
            if (typeof c != "string")
                break;
            let l = i[a + 1];
            t[c] = l, s.push(c.toLowerCase()), a += 2;
        }
    } for (let a of n.attributes)
        s.includes(a.name) || (t[a.name] = a.value); return t; }
    get styles() { return this.nativeElement?.style ?? {}; }
    get classes() { let t = {}, o = this.nativeElement.className; return (typeof o != "string" ? o.baseVal.split(" ") : o.split(" ")).forEach(i => t[i] = !0), t; }
    get childNodes() { let t = this.nativeNode.childNodes, n = []; for (let o = 0; o < t.length; o++) {
        let r = t[o];
        n.push(Jr(r));
    } return n; }
    get children() { let t = this.nativeElement; if (!t)
        return []; let n = t.children, o = []; for (let r = 0; r < n.length; r++) {
        let i = n[r];
        o.push(Jr(i));
    } return o; }
    query(t) { return this.queryAll(t)[0] || null; }
    queryAll(t) { let n = []; return im(this, t, n, !0), n; }
    queryAllNodes(t) { let n = []; return im(this, t, n, !1), n; }
    triggerEventHandler(t, n) { let o = this.nativeNode, r = []; this.listeners.forEach(i => { if (i.name === t) {
        let s = i.callback;
        s.call(o, n), r.push(s);
    } }), typeof o.eventListeners == "function" && o.eventListeners(t).forEach(i => { if (i.toString().indexOf("__ngUnwrap__") !== -1) {
        let s = i("__ngUnwrap__");
        return r.indexOf(s) === -1 && s.call(o, n);
    } }); }
};
function HO(e, t) { if (e) {
    let n = Object.getPrototypeOf(e), o = Node.prototype;
    for (; n !== null && n !== o;) {
        let r = Object.getOwnPropertyDescriptors(n);
        for (let i in r)
            if (!i.startsWith("__") && !i.startsWith("on")) {
                let s = e[i];
                BO(s) && (t[i] = s);
            }
        n = Object.getPrototypeOf(n);
    }
} }
function BO(e) { return typeof e == "string" || typeof e == "boolean" || typeof e == "number" || e === null; }
function im(e, t, n, o) { let r = Me(e.nativeNode), i = r ? r.lView : null; if (i !== null) {
    let s = i[m].data[r.nodeIndex];
    mn(s, i, t, n, o, e.nativeNode);
}
else
    Rp(e.nativeNode, t, n, o); }
function mn(e, t, n, o, r, i) { let s = _h(e, t); if (e.type & 11) {
    if (lu(s, n, o, r, i), De(e)) {
        let c = ye(e.index, t);
        c && c[m].firstChild && mn(c[m].firstChild, c, n, o, r, i);
    }
    else
        e.child && mn(e.child, t, n, o, r, i), s && Rp(s, n, o, r);
    let a = t[e.index];
    K(a) && sm(a, n, o, r, i);
}
else if (e.type & 4) {
    let a = t[e.index];
    lu(a[Ke], n, o, r, i), sm(a, n, o, r, i);
}
else if (e.type & 16) {
    let a = t[ee], l = a[ce].projection[e.projection];
    if (Array.isArray(l))
        for (let u of l)
            lu(u, n, o, r, i);
    else if (l) {
        let u = a[Q], d = u[m].data[l.index];
        mn(d, u, n, o, r, i);
    }
}
else
    e.child && mn(e.child, t, n, o, r, i); if (i !== s) {
    let a = e.flags & 2 ? e.projectionNext : e.next;
    a && mn(a, t, n, o, r, i);
} }
function sm(e, t, n, o, r) { for (let i = G; i < e.length; i++) {
    let s = e[i], a = s[m].firstChild;
    a && mn(a, s, t, n, o, r);
} }
function lu(e, t, n, o, r) { if (r !== e) {
    let i = Jr(e);
    if (!i)
        return;
    (o && i instanceof bn && t(i) && n.indexOf(i) === -1 || !o && t(i) && n.indexOf(i) === -1) && n.push(i);
} }
function Rp(e, t, n, o) { let r = e.childNodes, i = r.length; for (let s = 0; s < i; s++) {
    let a = r[s], c = Jr(a);
    c && ((o && c instanceof bn && t(c) && n.indexOf(c) === -1 || !o && t(c) && n.indexOf(c) === -1) && n.push(c), Rp(a, t, n, o));
} }
function UO(e, t, n, o) { let r = t.propertyBindings; if (r !== null)
    for (let i = 0; i < r.length; i++) {
        let s = r[i], c = o[s].split(A_), l = c[0];
        if (c.length > 1) {
            let u = c[1];
            for (let d = 1; d < c.length - 1; d++)
                u += b(n[s + d - 1]) + c[d + 1];
            e[l] = u;
        }
        else
            e[l] = n[s];
    } }
var uu = "__ng_debug__";
function Jr(e) { return e instanceof Node ? (e.hasOwnProperty(uu) || (e[uu] = e.nodeType == Node.ELEMENT_NODE ? new bn(e) : new Kr(e)), e[uu]) : null; }
var Mi = class {
    destroyed = !1;
    listeners = null;
    errorHandler = v(vt, { optional: !0 });
    destroyRef = v(Be);
    constructor() { this.destroyRef.onDestroy(() => { this.destroyed = !0, this.listeners = null; }); }
    subscribe(t) { if (this.destroyed)
        throw new D(953, !1); return (this.listeners ??= []).push(t), { unsubscribe: () => { let n = this.listeners?.indexOf(t); n !== void 0 && n !== -1 && this.listeners?.splice(n, 1); } }; }
    emit(t) { if (this.destroyed) {
        console.warn(Ko(953, !1));
        return;
    } if (this.listeners === null)
        return; let n = R(null); try {
        for (let o of this.listeners)
            try {
                o(t);
            }
            catch (r) {
                this.errorHandler?.handleError(r);
            }
    }
    finally {
        R(n);
    } }
};
function $O(e) { return e.destroyRef; }
function tt(e) { return lh(e); }
function Ne(e, t) { return Oi(e, t?.equal); }
var qO = e => e;
function kp(e, t) { if (typeof e == "function") {
    let n = Rc(e, qO, t?.equal);
    return uC(n, t?.debugName);
}
else {
    let n = Rc(e.source, e.computation, e.equal);
    return uC(n, e.debugName);
} }
function uC(e, t) { let n = e[se], o = e; return o.set = r => ah(n, r), o.update = r => ch(n, r), o.asReadonly = Gn.bind(e), o; }
function GO(e) { let t = e.request, n = e.params ?? t ?? (() => null); return new uc(n, zO(e), e.defaultValue, e.equal ? WO(e.equal) : void 0, e.debugName, e.injector ?? v(ae)); }
var Op = class {
    value;
    isLoading;
    constructor(t, n) { this.value = t, this.value.set = this.set.bind(this), this.value.update = this.update.bind(this), this.value.asReadonly = Gn, this.isLoading = Ne(() => this.status() === "loading" || this.status() === "reloading", void 0); }
    isError = Ne(() => this.status() === "error");
    update(t) { this.set(t(tt(this.value))); }
    isValueDefined = Ne(() => this.isError() ? !1 : this.value() !== void 0);
    _snapshot;
    get snapshot() { return this._snapshot ??= Ne(() => { let t = this.status(); return t === "error" ? { status: "error", error: this.error() } : { status: t, value: this.value() }; }); }
    hasValue() { return this.isValueDefined(); }
    asReadonly() { return this; }
}, uc = class extends Op {
    loaderFn;
    equal;
    debugName;
    pendingTasks;
    state;
    extRequest;
    effectRef;
    pendingController;
    resolvePendingTask = void 0;
    destroyed = !1;
    unregisterOnDestroy;
    status;
    error;
    constructor(t, n, o, r, i, s, a) { super(Ne(() => { let c = this.state().stream?.(); if (!c || this.state().status === "loading" && this.error())
        return o; if (!xp(c))
        throw new Ni(this.error()); return c.value; }, { equal: r }), i), this.loaderFn = n, this.equal = r, this.debugName = i, this.extRequest = kp({ source: t, computation: c => ({ request: c, reload: 0 }) }), this.state = kp({ source: this.extRequest, computation: (c, l) => { if (l) {
            let u = c.request === void 0 ? "idle" : "loading";
            return { extRequest: c, status: u, previousStatus: dC(l.value), stream: l.value.extRequest.request === c.request ? l.value.stream : void 0 };
        }
        else {
            let u = a?.(c.request);
            a = void 0;
            let d = c.request === void 0 ? "idle" : u ? "resolved" : "loading";
            return { extRequest: c, status: d, previousStatus: "idle", stream: u };
        } } }), this.effectRef = Hl(this.loadEffect.bind(this), { injector: s, manualCleanup: !0 }), this.pendingTasks = s.get(yr), this.unregisterOnDestroy = s.get(Be).onDestroy(() => this.destroy()), this.status = Ne(() => dC(this.state()), void 0), this.error = Ne(() => { let c = this.state().stream?.(); return c && !xp(c) ? c.error : void 0; }, void 0); }
    set(t) { if (this.destroyed)
        return; let n = tt(this.error), o = tt(this.state); if (!n) {
        let r = tt(this.value);
        if (o.status === "local" && (this.equal ? this.equal(r, t) : r === t))
            return;
    } this.state.set({ extRequest: o.extRequest, status: "local", previousStatus: "local", stream: $t({ value: t }, void 0) }), this.abortInProgressLoad(); }
    reload() { let { status: t } = tt(this.state); return t === "idle" || t === "loading" ? !1 : (this.extRequest.update(({ request: n, reload: o }) => ({ request: n, reload: o + 1 })), !0); }
    destroy() { this.destroyed = !0, this.unregisterOnDestroy(), this.effectRef.destroy(), this.abortInProgressLoad(), this.state.set({ extRequest: { request: void 0, reload: 0 }, status: "idle", previousStatus: "idle", stream: void 0 }); }
    loadEffect() { return ze(this, null, function* () { let t = this.extRequest(), { status: n, previousStatus: o } = tt(this.state); if (t.request === void 0)
        return; if (n !== "loading")
        return; this.abortInProgressLoad(); let r = this.resolvePendingTask = this.pendingTasks.add(), { signal: i } = this.pendingController = new AbortController; try {
        let s = yield tt(() => this.loaderFn({ params: t.request, abortSignal: i, previous: { status: o } }));
        if (i.aborted || tt(this.extRequest) !== t)
            return;
        this.state.set({ extRequest: t, status: "resolved", previousStatus: "resolved", stream: s });
    }
    catch (s) {
        if (i.aborted || tt(this.extRequest) !== t)
            return;
        this.state.set({ extRequest: t, status: "resolved", previousStatus: "error", stream: $t({ error: Lp(s) }, void 0) });
    }
    finally {
        r?.(), r = void 0;
    } }); }
    abortInProgressLoad() { tt(() => this.pendingController?.abort()), this.pendingController = void 0, this.resolvePendingTask?.(), this.resolvePendingTask = void 0; }
};
function WO(e) { return (t, n) => t === void 0 || n === void 0 ? t === n : e(t, n); }
function zO(e) { return QO(e) ? e.stream : t => ze(null, null, function* () { try {
    return $t({ value: yield e.loader(t) }, void 0);
}
catch (n) {
    return $t({ error: Lp(n) }, void 0);
} }); }
function QO(e) { return !!e.stream; }
function dC(e) { switch (e.status) {
    case "loading": return e.extRequest.reload === 0 ? "loading" : "reloading";
    case "resolved": return xp(e.stream()) ? "resolved" : "error";
    default: return e.status;
} }
function xp(e) { return e.error === void 0; }
function Lp(e) { return ZO(e) ? e : new Pp(e); }
function ZO(e) { return e instanceof Error || typeof e == "object" && typeof e.name == "string" && typeof e.message == "string"; }
var Ni = class extends Error {
    constructor(t) { super(t.message, { cause: t }); }
}, Pp = class extends Error {
    constructor(t) { super(String(t), { cause: t }); }
};
import { Subscription as Ax } from "rxjs";
var Bp = { JSACTION: "__jsaction", OWNER: "__owner" }, gC = {};
function YO(e) { return e[Bp.JSACTION]; }
function fC(e, t) { e[Bp.JSACTION] = t; }
function KO(e) { return gC[e]; }
function JO(e, t) { gC[e] = t; }
var M = { CLICK: "click", CLICKMOD: "clickmod", DBLCLICK: "dblclick", FOCUS: "focus", FOCUSIN: "focusin", BLUR: "blur", FOCUSOUT: "focusout", SUBMIT: "submit", KEYDOWN: "keydown", KEYPRESS: "keypress", KEYUP: "keyup", MOUSEOVER: "mouseover", MOUSEOUT: "mouseout", MOUSEENTER: "mouseenter", MOUSELEAVE: "mouseleave", POINTEROVER: "pointerover", POINTEROUT: "pointerout", POINTERENTER: "pointerenter", POINTERLEAVE: "pointerleave", ERROR: "error", LOAD: "load", TOUCHSTART: "touchstart", TOUCHEND: "touchend", TOUCHMOVE: "touchmove", TOGGLE: "toggle" }, XO = [M.MOUSEENTER, M.MOUSELEAVE, "pointerenter", "pointerleave"], ex = [M.CLICK, M.DBLCLICK, M.FOCUSIN, M.FOCUSOUT, M.KEYDOWN, M.KEYUP, M.KEYPRESS, M.MOUSEOVER, M.MOUSEOUT, M.SUBMIT, M.TOUCHSTART, M.TOUCHEND, M.TOUCHMOVE, "touchcancel", "auxclick", "change", "compositionstart", "compositionupdate", "compositionend", "beforeinput", "input", "select", "copy", "cut", "paste", "mousedown", "mouseup", "wheel", "contextmenu", "dragover", "dragenter", "dragleave", "drop", "dragstart", "dragend", "pointerdown", "pointermove", "pointerup", "pointercancel", "pointerover", "pointerout", "gotpointercapture", "lostpointercapture", "ended", "loadedmetadata", "pagehide", "pageshow", "visibilitychange", "beforematch"], mC = [M.FOCUS, M.BLUR, M.ERROR, M.LOAD, M.TOGGLE], mc = e => mC.indexOf(e) >= 0, tx = ex.concat(mC), yC = e => tx.indexOf(e) >= 0;
function nx(e) { return e === M.MOUSEENTER ? M.MOUSEOVER : e === M.MOUSELEAVE ? M.MOUSEOUT : e === M.POINTERENTER ? M.POINTEROVER : e === M.POINTERLEAVE ? M.POINTEROUT : e; }
function ox(e, t, n, o) { let r = !1; mc(t) && (r = !0); let i = typeof o == "boolean" ? { capture: r, passive: o } : r; return e.addEventListener(t, n, i), { eventType: t, handler: n, capture: r, passive: o }; }
function rx(e, t) { if (e.removeEventListener) {
    let n = typeof t.passive == "boolean" ? { capture: t.capture } : t.capture;
    e.removeEventListener(t.eventType, t.handler, n);
}
else
    e.detachEvent && e.detachEvent(`on${t.eventType}`, t.handler); }
function ix(e) { e.preventDefault ? e.preventDefault() : e.returnValue = !1; }
var pC = typeof navigator < "u" && /Macintosh/.test(navigator.userAgent);
function sx(e) { return e.which === 2 || e.which == null && e.button === 4; }
function ax(e) { return pC && e.metaKey || !pC && e.ctrlKey || sx(e) || e.shiftKey; }
function cx(e, t, n) { let o = e.relatedTarget; return (e.type === M.MOUSEOVER && t === M.MOUSEENTER || e.type === M.MOUSEOUT && t === M.MOUSELEAVE || e.type === M.POINTEROVER && t === M.POINTERENTER || e.type === M.POINTEROUT && t === M.POINTERLEAVE) && (!o || o !== n && !n.contains(o)); }
function lx(e, t) { let n = {}; for (let o in e) {
    if (o === "srcElement" || o === "target")
        continue;
    let r = o, i = e[r];
    typeof i != "function" && (n[r] = i);
} return e.type === M.MOUSEOVER ? n.type = M.MOUSEENTER : e.type === M.MOUSEOUT ? n.type = M.MOUSELEAVE : e.type === M.POINTEROVER ? n.type = M.POINTERENTER : n.type = M.POINTERLEAVE, n.target = n.srcElement = t, n.bubbles = !1, n._originalEvent = e, n; }
var ux = typeof navigator < "u" && /iPhone|iPad|iPod/.test(navigator.userAgent), hc = class {
    element;
    handlerInfos = [];
    constructor(t) { this.element = t; }
    addEventListener(t, n, o) { ux && (this.element.style.cursor = "pointer"), this.handlerInfos.push(ox(this.element, t, n(this.element), o)); }
    cleanUp() { for (let t = 0; t < this.handlerInfos.length; t++)
        rx(this.element, this.handlerInfos[t]); this.handlerInfos = []; }
}, dx = { EVENT_ACTION_SEPARATOR: ":" };
function Jt(e) { return e.eventType; }
function Up(e, t) { e.eventType = t; }
function fc(e) { return e.event; }
function vC(e, t) { e.event = t; }
function EC(e) { return e.targetElement; }
function IC(e, t) { e.targetElement = t; }
function DC(e) { return e.eic; }
function fx(e, t) { e.eic = t; }
function px(e) { return e.timeStamp; }
function hx(e, t) { e.timeStamp = t; }
function pc(e) { return e.eia; }
function TC(e, t, n) { e.eia = [t, n]; }
function Fp(e) { e.eia = void 0; }
function dc(e) { return e[1]; }
function gx(e) { return e.eirp; }
function CC(e, t) { e.eirp = t; }
function MC(e) { return e.eir; }
function NC(e, t) { e.eir = t; }
function wC(e) { return { eventType: e.eventType, event: e.event, targetElement: e.targetElement, eic: e.eic, eia: e.eia, timeStamp: e.timeStamp, eirp: e.eirp, eiack: e.eiack, eir: e.eir }; }
function mx(e, t, n, o, r, i, s, a) { return { eventType: e, event: t, targetElement: n, eic: o, timeStamp: r, eia: i, eirp: s, eiack: a }; }
var jp = class e {
    eventInfo;
    constructor(t) { this.eventInfo = t; }
    getEventType() { return Jt(this.eventInfo); }
    setEventType(t) { Up(this.eventInfo, t); }
    getEvent() { return fc(this.eventInfo); }
    setEvent(t) { vC(this.eventInfo, t); }
    getTargetElement() { return EC(this.eventInfo); }
    setTargetElement(t) { IC(this.eventInfo, t); }
    getContainer() { return DC(this.eventInfo); }
    setContainer(t) { fx(this.eventInfo, t); }
    getTimestamp() { return px(this.eventInfo); }
    setTimestamp(t) { hx(this.eventInfo, t); }
    getAction() { let t = pc(this.eventInfo); if (t)
        return { name: t[0], element: t[1] }; }
    setAction(t) { if (!t) {
        Fp(this.eventInfo);
        return;
    } TC(this.eventInfo, t.name, t.element); }
    getIsReplay() { return gx(this.eventInfo); }
    setIsReplay(t) { CC(this.eventInfo, t); }
    getResolved() { return MC(this.eventInfo); }
    setResolved(t) { NC(this.eventInfo, t); }
    clone() { return new e(wC(this.eventInfo)); }
}, yx = {}, vx = /\s*;\s*/, Ex = M.CLICK, Vp = class {
    a11yClickSupport = !1;
    clickModSupport = !0;
    syntheticMouseEventSupport;
    updateEventInfoForA11yClick = void 0;
    preventDefaultForA11yClick = void 0;
    populateClickOnlyAction = void 0;
    constructor({ syntheticMouseEventSupport: t = !1, clickModSupport: n = !0 } = {}) { this.syntheticMouseEventSupport = t, this.clickModSupport = n; }
    resolveEventType(t) { this.clickModSupport && Jt(t) === M.CLICK && ax(fc(t)) ? Up(t, M.CLICKMOD) : this.a11yClickSupport && this.updateEventInfoForA11yClick(t); }
    resolveAction(t) { MC(t) || (this.populateAction(t, EC(t)), NC(t, !0)); }
    resolveParentAction(t) { let n = pc(t), o = n && dc(n); Fp(t); let r = o && this.getParentNode(o); r && this.populateAction(t, r); }
    populateAction(t, n) { let o = n; for (; o && o !== DC(t) && (o.nodeType === Node.ELEMENT_NODE && this.populateActionOnElement(o, t), !pc(t));)
        o = this.getParentNode(o); let r = pc(t); if (r && (this.a11yClickSupport && this.preventDefaultForA11yClick(t), this.syntheticMouseEventSupport && (Jt(t) === M.MOUSEENTER || Jt(t) === M.MOUSELEAVE || Jt(t) === M.POINTERENTER || Jt(t) === M.POINTERLEAVE)))
        if (cx(fc(t), Jt(t), dc(r))) {
            let i = lx(fc(t), dc(r));
            vC(t, i), IC(t, dc(r));
        }
        else
            Fp(t); }
    getParentNode(t) { let n = t[Bp.OWNER]; if (n)
        return n; let o = t.parentNode; return o?.nodeName === "#document-fragment" ? o?.host ?? null : o; }
    populateActionOnElement(t, n) { let o = this.parseActions(t), r = o[Jt(n)]; r !== void 0 && TC(n, r, t), this.a11yClickSupport && this.populateClickOnlyAction(t, n, o); }
    parseActions(t) { let n = YO(t); if (!n) {
        let o = t.getAttribute(Qn.JSACTION);
        if (!o)
            n = yx, fC(t, n);
        else {
            if (n = KO(o), !n) {
                n = {};
                let r = o.split(vx);
                for (let i = 0; i < r.length; i++) {
                    let s = r[i];
                    if (!s)
                        continue;
                    let a = s.indexOf(dx.EVENT_ACTION_SEPARATOR), c = a !== -1, l = c ? s.substr(0, a).trim() : Ex, u = c ? s.substr(a + 1).trim() : s;
                    n[l] = u;
                }
                JO(o, n);
            }
            fC(t, n);
        }
    } return n; }
    addA11yClickSupport(t, n, o) { this.a11yClickSupport = !0, this.updateEventInfoForA11yClick = t, this.preventDefaultForA11yClick = n, this.populateClickOnlyAction = o; }
}, _C = (function (e) { return e[e.I_AM_THE_JSACTION_FRAMEWORK = 0] = "I_AM_THE_JSACTION_FRAMEWORK", e; })(_C || {}), Hp = class {
    dispatchDelegate;
    actionResolver;
    eventReplayer;
    eventReplayScheduled = !1;
    replayEventInfoWrappers = [];
    constructor(t, { actionResolver: n, eventReplayer: o } = {}) { this.dispatchDelegate = t, this.actionResolver = n, this.eventReplayer = o; }
    dispatch(t) { let n = new jp(t); this.actionResolver?.resolveEventType(t), this.actionResolver?.resolveAction(t); let o = n.getAction(); if (o && Ix(o.element, n) && ix(n.getEvent()), this.eventReplayer && n.getIsReplay()) {
        this.scheduleEventInfoWrapperReplay(n);
        return;
    } this.dispatchDelegate(n); }
    scheduleEventInfoWrapperReplay(t) { this.replayEventInfoWrappers.push(t), !this.eventReplayScheduled && (this.eventReplayScheduled = !0, Promise.resolve().then(() => { this.eventReplayScheduled = !1, this.eventReplayer(this.replayEventInfoWrappers); })); }
};
function Ix(e, t) { return e.tagName === "A" && (t.getEventType() === M.CLICK || t.getEventType() === M.CLICKMOD); }
var SC = Symbol.for("propagationStopped"), $p = { REPLAY: 101 };
var Dx = "`preventDefault` called during event replay.";
var Tx = "`composedPath` called during event replay.", gc = class {
    dispatchDelegate;
    clickModSupport;
    actionResolver;
    dispatcher;
    constructor(t, n = !0) { this.dispatchDelegate = t, this.clickModSupport = n, this.actionResolver = new Vp({ clickModSupport: n }), this.dispatcher = new Hp(o => { this.dispatchToDelegate(o); }, { actionResolver: this.actionResolver }); }
    dispatch(t) { this.dispatcher.dispatch(t); }
    dispatchToDelegate(t) { for (t.getIsReplay() && Nx(t), Cx(t); t.getAction();) {
        if (wx(t), mc(t.getEventType()) && t.getAction().element !== t.getTargetElement() || (this.dispatchDelegate(t.getEvent(), t.getAction().name), Mx(t)))
            return;
        this.actionResolver.resolveParentAction(t.eventInfo);
    } }
};
function Cx(e) { let t = e.getEvent(), n = e.getEvent().stopPropagation.bind(t), o = () => { t[SC] = !0, n(); }; Pn(t, "stopPropagation", o), Pn(t, "stopImmediatePropagation", o); }
function Mx(e) { return !!e.getEvent()[SC]; }
function Nx(e) { let t = e.getEvent(), n = e.getTargetElement(), o = t.preventDefault.bind(t); Pn(t, "target", n), Pn(t, "eventPhase", $p.REPLAY), Pn(t, "preventDefault", () => { throw o(), new Error(Dx + ""); }), Pn(t, "composedPath", () => { throw new Error(Tx + ""); }); }
function wx(e) { let t = e.getEvent(), n = e.getAction()?.element; n && Pn(t, "currentTarget", n, { configurable: !0 }); }
function Pn(e, t, n, { configurable: o = !1 } = {}) { Object.defineProperty(e, t, { value: n, configurable: o }); }
function bC(e, t) { e.ecrd(n => { t.dispatch(n); }, _C.I_AM_THE_JSACTION_FRAMEWORK); }
function _x(e) { return e?.q ?? []; }
function Sx(e) { e && (hC(e.c, e.et, e.h), hC(e.c, e.etc, e.h, !0)); }
function hC(e, t, n, o) { for (let r = 0; r < t.length; r++)
    e.removeEventListener(t[r], n, o); }
var bx = !1, AC = (() => { class e {
    static MOUSE_SPECIAL_SUPPORT = bx;
    containerManager;
    eventHandlers = {};
    browserEventTypeToExtraEventTypes = {};
    dispatcher = null;
    queuedEventInfos = [];
    constructor(n) { this.containerManager = n; }
    handleEvent(n, o, r) { let i = mx(n, o, o.target, r, Date.now()); this.handleEventInfo(i); }
    handleEventInfo(n) { if (!this.dispatcher) {
        CC(n, !0), this.queuedEventInfos?.push(n);
        return;
    } this.dispatcher(n); }
    addEvent(n, o, r) { if (n in this.eventHandlers || !this.containerManager || !e.MOUSE_SPECIAL_SUPPORT && XO.indexOf(n) >= 0)
        return; let i = (a, c, l) => { this.handleEvent(a, c, l); }; this.eventHandlers[n] = i; let s = nx(o || n); if (s !== n) {
        let a = this.browserEventTypeToExtraEventTypes[s] || [];
        a.push(n), this.browserEventTypeToExtraEventTypes[s] = a;
    } this.containerManager.addEventListener(s, a => c => { i(n, c, a); }, r); }
    replayEarlyEvents(n = window._ejsa) { n && (this.replayEarlyEventInfos(n.q), Sx(n), delete window._ejsa); }
    replayEarlyEventInfos(n) { for (let o = 0; o < n.length; o++) {
        let r = n[o], i = this.getEventTypesForBrowserEventType(r.eventType);
        for (let s = 0; s < i.length; s++) {
            let a = wC(r);
            Up(a, i[s]), this.handleEventInfo(a);
        }
    } }
    getEventTypesForBrowserEventType(n) { let o = []; return this.eventHandlers[n] && o.push(n), this.browserEventTypeToExtraEventTypes[n] && o.push(...this.browserEventTypeToExtraEventTypes[n]), o; }
    handler(n) { return this.eventHandlers[n]; }
    cleanUp() { this.containerManager?.cleanUp(), this.containerManager = null, this.eventHandlers = {}, this.browserEventTypeToExtraEventTypes = {}, this.dispatcher = null, this.queuedEventInfos = []; }
    registerDispatcher(n, o) { this.ecrd(n, o); }
    ecrd(n, o) { if (this.dispatcher = n, this.queuedEventInfos?.length) {
        for (let r = 0; r < this.queuedEventInfos.length; r++)
            this.handleEventInfo(this.queuedEventInfos[r]);
        this.queuedEventInfos = null;
    } }
} return e; })();
function RC(e, t = window) { return _x(t._ejsas?.[e]); }
function qp(e, t = window) { t._ejsas && (t._ejsas[e] = void 0); }
import "@angular/core/primitives/signals";
import "rxjs/operators";
import "@angular/core/primitives/di";
typeof globalThis.ngServerMode > "u" && (globalThis.ngServerMode = typeof window > "u");
var Cc = Symbol("InputSignalNode#UNSET"), JC = we(z({}, Sc), { transformFn: void 0, applyValueToInputSignal(e, t) { _c(e, t); } }), TF = Symbol();
function XC(e, t) { let n = Object.create(JC); n.value = e, n.transformFn = t?.transform; function o() { if (Ai(n), n.value === Cc) {
    let r = null;
    throw new D(-950, r);
} return n.value; } return o[se] = n, o; }
var Bo = (function (e) { return e[e.Directive = 0] = "Directive", e[e.Component = 1] = "Component", e[e.Injectable = 2] = "Injectable", e[e.Pipe = 3] = "Pipe", e[e.NgModule = 4] = "NgModule", e; })(Bo || {});
var Rx = (function (e) { return e.Angular = "angular", e.ACX = "acx", e.Wiz = "wiz", e; })(Rx || {}), kC = class {
    attributeName;
    constructor(t) { this.attributeName = t; }
    __NG_ELEMENT_ID__ = () => ca(this.attributeName);
    toString() { return `HostAttributeToken ${this.attributeName}`; }
}, CF = (() => { let e = new T(""); return e.__NG_ELEMENT_ID__ = t => { let n = _(); if (n === null)
    throw new D(-204, !1); if (n.type & 2)
    return n.value; if (t & 8)
    return null; throw new D(-204, !1); }, e; })();
function MF(e) { return new Mi; }
function OC(e, t) { return XC(e, t); }
function kx(e) { return XC(Cc, e); }
var NF = (OC.required = kx, OC);
function xC(e, t) { return Tf(t); }
function Ox(e, t) { return Cf(t); }
var wF = (xC.required = Ox, xC);
function _F(e, t) { return Mf(t); }
function PC(e, t) { return Tf(t); }
function xx(e, t) { return Cf(t); }
var SF = (PC.required = xx, PC);
function bF(e, t) { return Mf(t); }
function eM(e, t) { let n = Object.create(JC), o = new Mi; n.value = e; function r() { return Ai(n), LC(n.value), n.value; } return r[se] = n, r.asReadonly = Gn.bind(r), r.set = i => { n.equal(n.value, i) || (_c(n, i), o.emit(i)); }, r.update = i => { LC(n.value), r.set(i(n.value)); }, r.subscribe = o.subscribe.bind(o), r.destroyRef = o.destroyRef, r; }
function LC(e) { if (e === Cc)
    throw new D(952, !1); }
function FC(e, t) { return eM(e, t); }
function Px(e) { return eM(Cc, e); }
var AF = (FC.required = Px, FC), tM = !0, $o = class {
}, RF = wt("ContentChildren", (e, t = {}) => z({ selector: e, first: !1, isViewQuery: !1, descendants: !1, emitDistinctChangesOnly: tM }, t), $o), kF = wt("ContentChild", (e, t = {}) => z({ selector: e, first: !0, isViewQuery: !1, descendants: !0 }, t), $o), OF = wt("ViewChildren", (e, t = {}) => z({ selector: e, first: !1, isViewQuery: !0, descendants: !0, emitDistinctChangesOnly: tM }, t), $o), xF = wt("ViewChild", (e, t) => z({ selector: e, first: !0, isViewQuery: !0, descendants: !0 }, t), $o);
function Lx(e, t, n) { let o = new yo(n); return Promise.resolve(o); }
function jC(e) { for (let t = e.length - 1; t >= 0; t--)
    if (e[t] !== void 0)
        return e[t]; }
var Fx = (() => { class e {
    zone = v(q);
    changeDetectionScheduler = v(xe);
    applicationRef = v(Ge);
    applicationErrorHandler = v(It);
    _onMicrotaskEmptySubscription;
    initialize() { this._onMicrotaskEmptySubscription || (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({ next: () => { this.changeDetectionScheduler.runningTick || this.zone.run(() => { try {
            this.applicationRef.dirtyFlags |= 1, this.applicationRef._tick();
        }
        catch (n) {
            this.applicationErrorHandler(n);
        } }); } })); }
    ngOnDestroy() { this._onMicrotaskEmptySubscription?.unsubscribe(); }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = B({ token: e, factory: e.\u0275fac, providedIn: "root" });
} return e; })(), jx = new T("", { factory: () => !1 });
function Vx({ ngZoneFactory: e, scheduleInRootZone: t }) { return e ??= () => new q(we(z({}, nM()), { scheduleInRootZone: t })), [{ provide: zn, useValue: !1 }, { provide: q, useFactory: e }, { provide: Fe, multi: !0, useFactory: () => { let n = v(Fx, { optional: !0 }); return () => n.initialize(); } }, { provide: Fe, multi: !0, useFactory: () => { let n = v(Hx); return () => { n.initialize(); }; } }, { provide: ls, useValue: t ?? xl }]; }
function PF(e) { let t = e?.scheduleInRootZone, n = Vx({ ngZoneFactory: () => { let o = nM(e); return o.scheduleInRootZone = t, o.shouldCoalesceEventChangeDetection && J("NgZone_CoalesceEvent"), new q(o); }, scheduleInRootZone: t }); return Ye([{ provide: jx, useValue: !0 }, n]); }
function nM(e) { return { enableLongStackTrace: !1, shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1, shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1 }; }
var Hx = (() => { class e {
    subscription = new Ax;
    initialized = !1;
    zone = v(q);
    pendingTasks = v(Et);
    initialize() { if (this.initialized)
        return; this.initialized = !0; let n = null; !this.zone.isStable && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (n = this.pendingTasks.add()), this.zone.runOutsideAngular(() => { this.subscription.add(this.zone.onStable.subscribe(() => { q.assertNotInAngularZone(), queueMicrotask(() => { n !== null && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (this.pendingTasks.remove(n), n = null); }); })); }), this.subscription.add(this.zone.onUnstable.subscribe(() => { q.assertInAngularZone(), n ??= this.pendingTasks.add(); })); }
    ngOnDestroy() { this.subscription.unsubscribe(); }
    static \u0275fac = function (o) { return new (o || e); };
    static \u0275prov = B({ token: e, factory: e.\u0275fac, providedIn: "root" });
} return e; })();
var vc = new T(""), Bx = new T("");
function wi(e) { return !e.moduleRef; }
function oM(e) { let t = wi(e) ? e.r3Injector : e.moduleRef.injector, n = t.get(q); return n.run(() => { wi(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers(); let o = t.get(It), r; if (n.runOutsideAngular(() => { r = n.onError.subscribe({ next: o }); }), wi(e)) {
    let i = () => t.destroy(), s = e.platformInjector.get(vc);
    s.add(i), t.onDestroy(() => { r.unsubscribe(), s.delete(i); });
}
else {
    let i = () => e.moduleRef.destroy(), s = e.platformInjector.get(vc);
    s.add(i), e.moduleRef.onDestroy(() => { Nr(e.allPlatformModules, e.moduleRef), r.unsubscribe(), s.delete(i); });
} return $x(o, n, () => { let i = t.get(Et), s = i.add(), a = t.get(Hf); return a.runInitializers(), a.donePromise.then(() => { let c = t.get(Ap, Di); if (rD(c || Di), !t.get(Bx, !0))
    return wi(e) ? t.get(Ge) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef); if (wi(e)) {
    let u = t.get(Ge);
    return e.rootComponent !== void 0 && u.bootstrap(e.rootComponent), u;
}
else
    return rM?.(e.moduleRef, e.allPlatformModules), e.moduleRef; }).finally(() => { i.remove(s); }); }); }); }
var rM;
function VC() { rM = Ux; }
function Ux(e, t) { let n = e.injector.get(Ge); if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach(o => n.bootstrap(o));
else if (e.instance.ngDoBootstrap)
    e.instance.ngDoBootstrap(n);
else
    throw new D(-403, !1); t.push(e); }
function $x(e, t, n) { try {
    let o = n();
    return jf(o) ? o.catch(r => { throw t.runOutsideAngular(() => e(r)), r; }) : o;
}
catch (o) {
    throw t.runOutsideAngular(() => e(o)), o;
} }
var iM = (() => { class e {
    _injector;
    _modules = [];
    _destroyListeners = [];
    _destroyed = !1;
    constructor(n) { this._injector = n; }
    bootstrapModuleFactory(n, o) { let r = [lc(), ...o?.applicationProviders ?? [], Vl], i = jE(n.moduleType, this.injector, r); return VC(), oM({ moduleRef: i, allPlatformModules: this._modules, platformInjector: this.injector }); }
    bootstrapModule(n, o = []) { let r = Uf({}, o); return VC(), Lx(this.injector, r, n).then(i => this.bootstrapModuleFactory(i, r)); }
    onDestroy(n) { this._destroyListeners.push(n); }
    get injector() { return this._injector; }
    destroy() { if (this._destroyed)
        throw new D(404, !1); this._modules.slice().forEach(o => o.destroy()), this._destroyListeners.forEach(o => o()); let n = this._injector.get(vc, null); n && (n.forEach(o => o()), n.clear()), this._destroyed = !0; }
    get destroyed() { return this._destroyed; }
    static \u0275fac = function (o) { return new (o || e)(pe(ae)); };
    static \u0275prov = B({ token: e, factory: e.\u0275fac, providedIn: "platform" });
} return e; })(), Uo = null;
function qx(e) { if (Mc())
    throw new D(400, !1); Bf(), Uo = typeof ngServerMode > "u" || !ngServerMode ? e : null; let t = e.get(iM); return aM(e), t; }
function Gx(e, t, n = []) { let o = `Platform: ${t}`, r = new T(o); return (i = []) => { let s = Mc(); if (!s) {
    let a = [...n, ...i, { provide: r, useValue: !0 }];
    s = e?.(a) ?? qx(sM(a, o));
} return typeof ngServerMode < "u" && ngServerMode ? s : Wx(r); }; }
function sM(e = [], t) { return ae.create({ name: t, providers: [{ provide: tl, useValue: "platform" }, { provide: vc, useValue: new Set([() => Uo = null]) }, ...e] }); }
function Wx(e) { let t = Mc(); if (!t)
    throw new D(-401, !1); return t; }
function Mc() { return typeof ngServerMode < "u" && ngServerMode ? null : Uo?.get(iM) ?? null; }
function LF() { Mc()?.destroy(); }
function zx(e = []) { if (Uo)
    return Uo; let t = sM(e); return (typeof ngServerMode > "u" || !ngServerMode) && (Uo = t), Bf(), aM(t), t; }
function FF(e) { return { provide: yd, useValue: e, multi: !0 }; }
function aM(e) { let t = e.get(yd, null); Yi(e, () => { t?.forEach(n => n()); }); }
function jF(e) { return Ye([]); }
function VF() { return !1; }
function HF() { }
var yc = new WeakSet, HC = "";
function BC(e) { return e.get(ya, Cd); }
function Qx() { let e = [{ provide: ya, useFactory: () => { let t = !0; if (typeof ngServerMode > "u" || !ngServerMode) {
            let n = v(_t);
            t = !!window._ejsas?.[n];
        } return t && J("NgEventReplay"), t; } }]; return (typeof ngServerMode > "u" || !ngServerMode) && e.push({ provide: Fe, useValue: () => { let t = v(Ge), { injector: n } = t; if (!yc.has(t)) {
        let o = v(si);
        if (BC(n)) {
            ry();
            let r = n.get(_t), i = ny(r, (s, a, c) => { s.nodeType === Node.ELEMENT_NODE && (ty(s, a, c), wd(s, o)); });
            t.onDestroy(i);
        }
    } }, multi: !0 }, { provide: vi, useFactory: () => { let t = v(Ge), { injector: n } = t; return () => { if (!BC(n) || yc.has(t))
        return; yc.add(t); let o = n.get(_t); t.onDestroy(() => { yc.delete(t), typeof ngServerMode < "u" && !ngServerMode && qp(o); }), t.whenStable().then(() => { if (t.destroyed)
        return; let r = n.get(Sd); Zx(r, n); let i = n.get(si); i.get(HC)?.forEach(_d), i.delete(HC); let s = r.instance; ai(n) ? t.onDestroy(() => s.cleanUp()) : s.cleanUp(); }); }; }, multi: !0 }), e; }
var Zx = (e, t) => { let n = t.get(_t), o = window._ejsas[n], r = e.instance = new AC(new hc(o.c)); for (let a of o.et)
    r.addEvent(a); for (let a of o.etc)
    r.addEvent(a); let i = RC(n); r.replayEarlyEventInfos(i), qp(n); let s = new gc(a => { Kx(t, a, a.currentTarget); }); bC(r, s); };
function Yx(e, t, n) { let o = new Map, r = t[Lt], i = e.cleanup; if (!i || !r)
    return o; for (let s = 0; s < i.length;) {
    let a = i[s++], c = i[s++];
    if (typeof a != "string")
        continue;
    let l = a;
    if (!yC(l))
        continue;
    mc(l) ? n.capture.add(l) : n.regular.add(l);
    let u = L(t[c]);
    s++;
    let d = i[s++];
    (typeof d == "boolean" || d >= 0) && (o.has(u) ? o.get(u).push(l) : o.set(u, [l]));
} return o; }
function Kx(e, t, n) { let o = (n && n.getAttribute(So)) ?? ""; /d\d+/.test(o) ? Jx(o, e, t, n) : t.eventPhase === $p.REPLAY && bd(t, n); }
function Jx(e, t, n, o) { let r = t.get(Km); r.push({ event: n, currentTarget: o }), Rt(t, e, Xx(r)); }
function Xx(e) { return t => { let n = new Set(t), o = []; for (let { event: r, currentTarget: i } of e) {
    let s = i.getAttribute(So);
    n.has(s) ? bd(r, i) : o.push({ event: r, currentTarget: i });
} e.length = 0, e.push(...o); }; }
var UC = !1, $C = !1, qC = !1, eP = 1e4;
function tP() { UC || (UC = !0, uy(), KI(), BD(), JI(), KE(), ME(), eE(), yv()); }
function nP() { $C || ($C = !0, sD(), Gv(), Yv()); }
function oP() { qC || (qC = !0, Ey()); }
function rP(e) { return e.whenStable(); }
var BF = "ngcm";
function UF() { let e = [{ provide: An, useFactory: () => { let t = !0; return (typeof ngServerMode > "u" || !ngServerMode) && (t = !!v(No, { optional: !0 })?.get(va, null)), t && J("NgHydration"), t; } }, { provide: Fe, useValue: () => { if (df(!1), typeof ngServerMode < "u" && ngServerMode)
            return; let t = v(Ut); v(An) && (Dy(t), tP()); }, multi: !0 }]; return (typeof ngServerMode > "u" || !ngServerMode) && e.push({ provide: Dd, useFactory: () => v(An) }, { provide: vi, useFactory: () => { let t = v(xe); if (v(An)) {
        let n = v(Ge);
        return () => { rP(n).then(() => { n.destroyed || (ff(n), t.notify(7)); }); };
    } return () => { }; }, multi: !0 }), Ye(e); }
function $F() { return [{ provide: Td, useFactory: () => v(An) }, { provide: Fe, useValue: () => { v(An) && (nP(), df(!0), J("NgI18nHydration")); }, multi: !0 }]; }
function qF() { let e = [Qx(), { provide: Md, useValue: !0 }, { provide: St, useClass: iy }, { provide: Fe, useValue: () => { oP(), J("NgIncrementalHydration"); }, multi: !0 }]; return (typeof ngServerMode > "u" || !ngServerMode) && e.push({ provide: vi, useFactory: () => { let t = v(ae), n = v(Ut); return () => { let o = Iy(t), r = Uv(n, n.body); II(t, o, r), yy(n, t); }; }, multi: !0 }), e; }
var GC = eP - 1e3, zp = class {
    openTasks = new Map;
    add(t) { this.openTasks.set(t, new Error("Task stack tracking error")); }
    remove(t) { this.openTasks.delete(t); }
};
function GF() { let e = new zp, { openTasks: t } = e; return Ye([{ provide: Pl, useValue: e }, hI(() => { console.warn("Stability debugging utility was provided in production mode. This will cause debug code to be included in production bundles. If this is intentional because you are debugging stability issues in a production environment, you can ignore this warning."); let n = v(q), o = v(Ge), r = null; typeof Zone < "u" && n.run(() => { r = Zone.current.get("TaskTrackingZone"); }), n.runOutsideAngular(() => { let i = setTimeout(() => { if (console.debug(`---- Application did not stabilize within ${GC / 1e3} seconds ----`), typeof Zone < "u" && !r && console.info('Zone.js is present but no TaskTrackingZone found. To enable better debugging of tasks in the Angular Zone, import "zone.js/plugins/task-tracking" in your application.'), r?.macroTasks?.length) {
        console.group("Macrotasks keeping Angular Zone unstable:");
        for (let s of r?.macroTasks ?? [])
            console.debug(s.creationLocation.stack);
        console.groupEnd();
    } console.group("PendingTasks keeping application unstable:"); for (let s of t.values())
        console.debug(s.stack); console.groupEnd(); }, GC); o.whenStable().then(() => { clearTimeout(i); }); }); })]); }
function WF(e) { let t = wf(e); if (!t)
    throw cM(e); return new yo(t); }
function zF(e) { let t = wf(e); if (!t)
    throw cM(e); return t; }
function cM(e) { return new D(920, !1); }
var iP = (() => { class e {
    static __NG_ELEMENT_ID__ = sP;
} return e; })();
function sP(e) { return aP(_(), g(), (e & 16) === 16); }
function aP(e, t, n) { if (De(e) && !n) {
    let o = ye(e.index, t);
    return new Zt(o, o);
}
else if (e.type & 175) {
    let o = t[ee];
    return new Zt(o, t);
} return null; }
var Qp = class extends iP {
}, WC = class extends Qp {
}, Ec = class {
    supports(t) { return qr(t); }
    create(t) { return new Zp(t); }
}, cP = (e, t) => t, Zp = class {
    length = 0;
    collection;
    _linkedRecords = null;
    _unlinkedRecords = null;
    _previousItHead = null;
    _itHead = null;
    _itTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _movesHead = null;
    _movesTail = null;
    _removalsHead = null;
    _removalsTail = null;
    _identityChangesHead = null;
    _identityChangesTail = null;
    _trackByFn;
    constructor(t) { this._trackByFn = t || cP; }
    forEachItem(t) { let n; for (n = this._itHead; n !== null; n = n._next)
        t(n); }
    forEachOperation(t) { let n = this._itHead, o = this._removalsHead, r = 0, i = null; for (; n || o;) {
        let s = !o || n && n.currentIndex < zC(o, r, i) ? n : o, a = zC(s, r, i), c = s.currentIndex;
        if (s === o)
            r--, o = o._nextRemoved;
        else if (n = n._next, s.previousIndex == null)
            r++;
        else {
            i || (i = []);
            let l = a - r, u = c - r;
            if (l != u) {
                for (let f = 0; f < l; f++) {
                    let p = f < i.length ? i[f] : i[f] = 0, h = p + f;
                    u <= h && h < l && (i[f] = p + 1);
                }
                let d = s.previousIndex;
                i[d] = u - l;
            }
        }
        a !== c && t(s, a, c);
    } }
    forEachPreviousItem(t) { let n; for (n = this._previousItHead; n !== null; n = n._nextPrevious)
        t(n); }
    forEachAddedItem(t) { let n; for (n = this._additionsHead; n !== null; n = n._nextAdded)
        t(n); }
    forEachMovedItem(t) { let n; for (n = this._movesHead; n !== null; n = n._nextMoved)
        t(n); }
    forEachRemovedItem(t) { let n; for (n = this._removalsHead; n !== null; n = n._nextRemoved)
        t(n); }
    forEachIdentityChange(t) { let n; for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange)
        t(n); }
    diff(t) { if (t == null && (t = []), !qr(t))
        throw new D(900, !1); return this.check(t) ? this : null; }
    onDestroy() { }
    check(t) { this._reset(); let n = this._itHead, o = !1, r, i, s; if (Array.isArray(t)) {
        this.length = t.length;
        for (let a = 0; a < this.length; a++)
            i = t[a], s = this._trackByFn(a, i), n === null || !Object.is(n.trackById, s) ? (n = this._mismatch(n, i, s, a), o = !0) : (o && (n = this._verifyReinsertion(n, i, s, a)), Object.is(n.item, i) || this._addIdentityChange(n, i)), n = n._next;
    }
    else
        r = 0, lE(t, a => { s = this._trackByFn(r, a), n === null || !Object.is(n.trackById, s) ? (n = this._mismatch(n, a, s, r), o = !0) : (o && (n = this._verifyReinsertion(n, a, s, r)), Object.is(n.item, a) || this._addIdentityChange(n, a)), n = n._next, r++; }), this.length = r; return this._truncate(n), this.collection = t, this.isDirty; }
    get isDirty() { return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null || this._identityChangesHead !== null; }
    _reset() { if (this.isDirty) {
        let t;
        for (t = this._previousItHead = this._itHead; t !== null; t = t._next)
            t._nextPrevious = t._next;
        for (t = this._additionsHead; t !== null; t = t._nextAdded)
            t.previousIndex = t.currentIndex;
        for (this._additionsHead = this._additionsTail = null, t = this._movesHead; t !== null; t = t._nextMoved)
            t.previousIndex = t.currentIndex;
        this._movesHead = this._movesTail = null, this._removalsHead = this._removalsTail = null, this._identityChangesHead = this._identityChangesTail = null;
    } }
    _mismatch(t, n, o, r) { let i; return t === null ? i = this._itTail : (i = t._prev, this._remove(t)), t = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(o, null), t !== null ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._reinsertAfter(t, i, r)) : (t = this._linkedRecords === null ? null : this._linkedRecords.get(o, r), t !== null ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._moveAfter(t, i, r)) : t = this._addAfter(new Yp(n, o), i, r)), t; }
    _verifyReinsertion(t, n, o, r) { let i = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(o, null); return i !== null ? t = this._reinsertAfter(i, t._prev, r) : t.currentIndex != r && (t.currentIndex = r, this._addToMoves(t, r)), t; }
    _truncate(t) { for (; t !== null;) {
        let n = t._next;
        this._addToRemovals(this._unlink(t)), t = n;
    } this._unlinkedRecords !== null && this._unlinkedRecords.clear(), this._additionsTail !== null && (this._additionsTail._nextAdded = null), this._movesTail !== null && (this._movesTail._nextMoved = null), this._itTail !== null && (this._itTail._next = null), this._removalsTail !== null && (this._removalsTail._nextRemoved = null), this._identityChangesTail !== null && (this._identityChangesTail._nextIdentityChange = null); }
    _reinsertAfter(t, n, o) { this._unlinkedRecords !== null && this._unlinkedRecords.remove(t); let r = t._prevRemoved, i = t._nextRemoved; return r === null ? this._removalsHead = i : r._nextRemoved = i, i === null ? this._removalsTail = r : i._prevRemoved = r, this._insertAfter(t, n, o), this._addToMoves(t, o), t; }
    _moveAfter(t, n, o) { return this._unlink(t), this._insertAfter(t, n, o), this._addToMoves(t, o), t; }
    _addAfter(t, n, o) { return this._insertAfter(t, n, o), this._additionsTail === null ? this._additionsTail = this._additionsHead = t : this._additionsTail = this._additionsTail._nextAdded = t, t; }
    _insertAfter(t, n, o) { let r = n === null ? this._itHead : n._next; return t._next = r, t._prev = n, r === null ? this._itTail = t : r._prev = t, n === null ? this._itHead = t : n._next = t, this._linkedRecords === null && (this._linkedRecords = new Ic), this._linkedRecords.put(t), t.currentIndex = o, t; }
    _remove(t) { return this._addToRemovals(this._unlink(t)); }
    _unlink(t) { this._linkedRecords !== null && this._linkedRecords.remove(t); let n = t._prev, o = t._next; return n === null ? this._itHead = o : n._next = o, o === null ? this._itTail = n : o._prev = n, t; }
    _addToMoves(t, n) { return t.previousIndex === n || (this._movesTail === null ? this._movesTail = this._movesHead = t : this._movesTail = this._movesTail._nextMoved = t), t; }
    _addToRemovals(t) { return this._unlinkedRecords === null && (this._unlinkedRecords = new Ic), this._unlinkedRecords.put(t), t.currentIndex = null, t._nextRemoved = null, this._removalsTail === null ? (this._removalsTail = this._removalsHead = t, t._prevRemoved = null) : (t._prevRemoved = this._removalsTail, this._removalsTail = this._removalsTail._nextRemoved = t), t; }
    _addIdentityChange(t, n) { return t.item = n, this._identityChangesTail === null ? this._identityChangesTail = this._identityChangesHead = t : this._identityChangesTail = this._identityChangesTail._nextIdentityChange = t, t; }
}, Yp = class {
    item;
    trackById;
    currentIndex = null;
    previousIndex = null;
    _nextPrevious = null;
    _prev = null;
    _next = null;
    _prevDup = null;
    _nextDup = null;
    _prevRemoved = null;
    _nextRemoved = null;
    _nextAdded = null;
    _nextMoved = null;
    _nextIdentityChange = null;
    constructor(t, n) { this.item = t, this.trackById = n; }
}, Kp = class {
    _head = null;
    _tail = null;
    add(t) { this._head === null ? (this._head = this._tail = t, t._nextDup = null, t._prevDup = null) : (this._tail._nextDup = t, t._prevDup = this._tail, t._nextDup = null, this._tail = t); }
    get(t, n) { let o; for (o = this._head; o !== null; o = o._nextDup)
        if ((n === null || n <= o.currentIndex) && Object.is(o.trackById, t))
            return o; return null; }
    remove(t) { let n = t._prevDup, o = t._nextDup; return n === null ? this._head = o : n._nextDup = o, o === null ? this._tail = n : o._prevDup = n, this._head === null; }
}, Ic = class {
    map = new Map;
    put(t) { let n = t.trackById, o = this.map.get(n); o || (o = new Kp, this.map.set(n, o)), o.add(t); }
    get(t, n) { let o = t, r = this.map.get(o); return r ? r.get(t, n) : null; }
    remove(t) { let n = t.trackById; return this.map.get(n).remove(t) && this.map.delete(n), t; }
    get isEmpty() { return this.map.size === 0; }
    clear() { this.map.clear(); }
};
function zC(e, t, n) { let o = e.previousIndex; if (o === null)
    return o; let r = 0; return n && o < n.length && (r = n[o]), o + t + r; }
var Dc = class {
    supports(t) { return t instanceof Map || Qa(t); }
    create() { return new Jp; }
}, Jp = class {
    _records = new Map;
    _mapHead = null;
    _appendAfter = null;
    _previousMapHead = null;
    _changesHead = null;
    _changesTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _removalsHead = null;
    get isDirty() { return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null; }
    forEachItem(t) { let n; for (n = this._mapHead; n !== null; n = n._next)
        t(n); }
    forEachPreviousItem(t) { let n; for (n = this._previousMapHead; n !== null; n = n._nextPrevious)
        t(n); }
    forEachChangedItem(t) { let n; for (n = this._changesHead; n !== null; n = n._nextChanged)
        t(n); }
    forEachAddedItem(t) { let n; for (n = this._additionsHead; n !== null; n = n._nextAdded)
        t(n); }
    forEachRemovedItem(t) { let n; for (n = this._removalsHead; n !== null; n = n._nextRemoved)
        t(n); }
    diff(t) { if (!t)
        t = new Map;
    else if (!(t instanceof Map || Qa(t)))
        throw new D(900, !1); return this.check(t) ? this : null; }
    check(t) { this._reset(); let n = this._mapHead; if (this._appendAfter = null, this._forEach(t, (o, r) => { if (n && n.key === r)
        this._maybeAddToChanges(n, o), this._appendAfter = n, n = n._next;
    else {
        let i = this._getOrCreateRecordForKey(r, o);
        n = this._insertBeforeOrAppend(n, i);
    } }), n) {
        n._prev && (n._prev._next = null), this._removalsHead = n;
        for (let o = n; o !== null; o = o._nextRemoved)
            o === this._mapHead && (this._mapHead = null), this._records.delete(o.key), o._nextRemoved = o._next, o.previousValue = o.currentValue, o.currentValue = null, o._prev = null, o._next = null;
    } return this._changesTail && (this._changesTail._nextChanged = null), this._additionsTail && (this._additionsTail._nextAdded = null), this.isDirty; }
    _insertBeforeOrAppend(t, n) { if (t) {
        let o = t._prev;
        return n._next = t, n._prev = o, t._prev = n, o && (o._next = n), t === this._mapHead && (this._mapHead = n), this._appendAfter = t, t;
    } return this._appendAfter ? (this._appendAfter._next = n, n._prev = this._appendAfter) : this._mapHead = n, this._appendAfter = n, null; }
    _getOrCreateRecordForKey(t, n) { if (this._records.has(t)) {
        let r = this._records.get(t);
        this._maybeAddToChanges(r, n);
        let i = r._prev, s = r._next;
        return i && (i._next = s), s && (s._prev = i), r._next = null, r._prev = null, r;
    } let o = new Xp(t); return this._records.set(t, o), o.currentValue = n, this._addToAdditions(o), o; }
    _reset() { if (this.isDirty) {
        let t;
        for (this._previousMapHead = this._mapHead, t = this._previousMapHead; t !== null; t = t._next)
            t._nextPrevious = t._next;
        for (t = this._changesHead; t !== null; t = t._nextChanged)
            t.previousValue = t.currentValue;
        for (t = this._additionsHead; t != null; t = t._nextAdded)
            t.previousValue = t.currentValue;
        this._changesHead = this._changesTail = null, this._additionsHead = this._additionsTail = null, this._removalsHead = null;
    } }
    _maybeAddToChanges(t, n) { Object.is(n, t.currentValue) || (t.previousValue = t.currentValue, t.currentValue = n, this._addToChanges(t)); }
    _addToAdditions(t) { this._additionsHead === null ? this._additionsHead = this._additionsTail = t : (this._additionsTail._nextAdded = t, this._additionsTail = t); }
    _addToChanges(t) { this._changesHead === null ? this._changesHead = this._changesTail = t : (this._changesTail._nextChanged = t, this._changesTail = t); }
    _forEach(t, n) { t instanceof Map ? t.forEach(n) : Object.keys(t).forEach(o => n(t[o], o)); }
}, Xp = class {
    key;
    previousValue = null;
    currentValue = null;
    _nextPrevious = null;
    _next = null;
    _prev = null;
    _nextAdded = null;
    _nextRemoved = null;
    _nextChanged = null;
    constructor(t) { this.key = t; }
};
function QC() { return new lM([new Ec]); }
var lM = (() => { class e {
    factories;
    static \u0275prov = B({ token: e, providedIn: "root", factory: QC });
    constructor(n) { this.factories = n; }
    static create(n, o) { if (o != null) {
        let r = o.factories.slice();
        n = n.concat(r);
    } return new e(n); }
    static extend(n) { return { provide: e, useFactory: () => { let o = v(e, { optional: !0, skipSelf: !0 }); return e.create(n, o || QC()); } }; }
    find(n) { let o = this.factories.find(r => r.supports(n)); if (o != null)
        return o; throw new D(901, !1); }
} return e; })();
function ZC() { return new uM([new Dc]); }
var uM = (() => { class e {
    static \u0275prov = B({ token: e, providedIn: "root", factory: ZC });
    factories;
    constructor(n) { this.factories = n; }
    static create(n, o) { if (o) {
        let r = o.factories.slice();
        n = n.concat(r);
    } return new e(n); }
    static extend(n) { return { provide: e, useFactory: () => { let o = v(e, { optional: !0, skipSelf: !0 }); return e.create(n, o || ZC()); } }; }
    find(n) { let o = this.factories.find(r => r.supports(n)); if (o)
        return o; throw new D(901, !1); }
} return e; })(), lP = [new Dc], uP = [new Ec], QF = new lM(uP), ZF = new uM(lP), YF = Gx(null, "core", []), KF = (() => { class e {
    constructor(n) { }
    static \u0275fac = function (o) { return new (o || e)(pe(Ge)); };
    static \u0275mod = Sf({ type: e });
    static \u0275inj = tr({});
} return e; })();
function JF(e) { let { rootComponent: t, appProviders: n, platformProviders: o, platformRef: r } = e; if (V(k.BootstrapApplicationStart), typeof ngServerMode < "u" && ngServerMode && !r)
    throw new D(-401, !1); try {
    let i = r?.injector ?? zx(o), s = [lc(), Vl, ...n || []], a = new Wr({ providers: s, parent: i, debugName: "", runEnvironmentInitializers: !1 });
    return oM({ r3Injector: a.injector, platformInjector: i, rootComponent: t });
}
catch (i) {
    return Promise.reject(i);
}
finally {
    V(k.BootstrapApplicationEnd);
} }
var eh = class {
    views = [];
    indexByContent = new Map;
    add(t) { let n = JSON.stringify(t); if (!this.indexByContent.has(n)) {
        let o = this.views.length;
        return this.views.push(t), this.indexByContent.set(n, o), o;
    } return this.indexByContent.get(n); }
    getAll() { return this.views; }
}, dP = 0;
function dM(e) { return e.ssrId || (e.ssrId = `t${dP++}`), e.ssrId; }
function fM(e, t, n) { let o = []; return fo(e, t, n, o), o.length; }
function fP(e) { let t = []; return Ha(e, t), t.length; }
function pM(e, t) { let n = e[$]; return n && !n.hasAttribute(Co) ? Tc(n, e, null, t) : null; }
function hM(e, t) { let n = dr(e[$]), o = pM(n, t); if (o === null)
    return; let r = L(n[$]), i = e[Q], s = Tc(r, i, null, t), a = n[w], c = `${o}|${s}`; a.setAttribute(r, ro, c); }
function XF(e, t) { let n = e.injector, o = Wv(n), r = ai(n), i = new eh, s = new Map, a = e._views, c = n.get(ya, Cd), l = { regular: new Set, capture: new Set }, u = new Map; e.injector.get(_t); for (let p of a) {
    let h = Ad(p);
    if (h !== null) {
        let y = { serializedViewCollection: i, corruptedTextNodes: s, isI18nHydrationEnabled: o, isIncrementalHydrationEnabled: r, i18nChildren: new Map, eventTypesToReplay: l, shouldReplayEvents: c, deferBlocks: u };
        K(h) ? hM(h, y) : pM(h, y), yP(s, t);
    }
} let d = i.getAll(), f = n.get(No); if (f.set(va, d), u.size > 0) {
    let p = {};
    for (let [h, y] of u.entries())
        p[h] = y;
    f.set(Ea, p);
} return l; }
function pP(e, t, n, o, r) { let i = [], s = ""; for (let a = G; a < e.length; a++) {
    let c = e[a], l, u, d;
    if (st(c) && (c = c[E], K(c))) {
        u = fP(c) + 1, hM(c, r);
        let p = dr(c[$]);
        d = { [ha]: p[m].ssrId, [Mt]: u };
    }
    if (!d) {
        let p = c[m];
        p.type === 1 ? (l = p.ssrId, u = 1) : (l = dM(p), u = fM(p, c, p.firstChild)), d = { [ha]: l, [Mt]: u };
        let h = !1;
        if (nI(n[m], t)) {
            let y = Te(n, t), I = fe(n[m], t);
            if (r.isIncrementalHydrationEnabled && I.hydrateTriggers !== null) {
                let C = `d${r.deferBlocks.size}`;
                I.hydrateTriggers.has(7) && (h = !0);
                let O = [];
                Ha(e, O);
                let te = { [Mt]: O.length, [ri]: y[At] }, We = hP(I.hydrateTriggers);
                We.length > 0 && (te[ii] = We), o !== null && (te[Id] = o), r.deferBlocks.set(C, te);
                let Oe = L(e);
                Oe !== void 0 ? Oe.nodeType === Node.COMMENT_NODE && YC(Oe, C) : YC(Oe, C), h || EP(I, O, C, r), o = C, d[ma] = C;
            }
            d[ri] = y[At];
        }
        h || Object.assign(d, gM(e[a], o, r));
    }
    let f = JSON.stringify(d);
    if (i.length > 0 && f === s) {
        let p = i[i.length - 1];
        p[ni] ??= 1, p[ni]++;
    }
    else
        s = f, i.push(d);
} return i; }
function hP(e) { let t = new Set([0, 1, 2, 5]), n = []; for (let [o, r] of e)
    t.has(o) && (r === null ? n.push(o) : r.type === 5 ? n.push({ trigger: o, delay: r.delay }) : n.push({ trigger: o, intersectionObserverOptions: r.intersectionObserverOptions })); return n; }
function _i(e, t, n, o) { let r = t.index - E; e[oi] ??= {}, e[oi][r] ??= Bv(t, n, o); }
function Gp(e, t) { let n = typeof t == "number" ? t : t.index - E; e[_o] ??= [], e[_o].includes(n) || e[_o].push(n); }
function gM(e, t = null, n) { let o = {}, r = e[m], i = zv(r, n), s = n.shouldReplayEvents ? Yx(r, e, n.eventTypesToReplay) : null; for (let a = E; a < r.bindingStartIndex; a++) {
    let c = r.data[a], l = a - E, u = Qv(e, a, n);
    if (u) {
        o[ga] ??= {}, o[ga][l] = u.caseQueue;
        for (let d of u.disconnectedNodes)
            Gp(o, d);
        for (let d of u.disjointNodes) {
            let f = r.data[d + E];
            _i(o, f, e, i);
        }
        continue;
    }
    if (aa(c) && !bo(c)) {
        if (K(e[a]) && c.tView && (o[pa] ??= {}, o[pa][l] = dM(c.tView)), Lo(c, e) && vP(c)) {
            Gp(o, c);
            continue;
        }
        if (Array.isArray(c.projection)) {
            for (let d of c.projection)
                if (d)
                    if (!Array.isArray(d))
                        !sl(d) && !Mo(d) && (Lo(d, e) ? Gp(o, d) : _i(o, d, e, i));
                    else
                        throw kv(L(e[a]));
        }
        if (gP(o, c, e, i), K(e[a])) {
            let d = e[a][$];
            if (Array.isArray(d)) {
                let f = L(d);
                f.hasAttribute(Co) || Tc(f, d, t, n);
            }
            o[wo] ??= {}, o[wo][l] = pP(e[a], c, e, t, n);
        }
        else if (Array.isArray(e[a]) && !Dm(c)) {
            let d = L(e[a][$]);
            d.hasAttribute(Co) || Tc(d, e[a], t, n);
        }
        else if (c.type & 8)
            o[ti] ??= {}, o[ti][l] = fM(r, e, c.child);
        else if (c.type & 144) {
            let d = c.next;
            for (; d !== null && d.type & 144;)
                d = d.next;
            d && !Mo(d) && _i(o, d, e, i);
        }
        else if (c.type & 1) {
            let d = L(e[a]);
            kd(n, d);
        }
        if (s && c.type & 2) {
            let d = L(e[a]);
            s.has(d) && Nd(d, s.get(d), t);
        }
    }
} return o; }
function gP(e, t, n, o) { sl(t) || (t.projectionNext && t.projectionNext !== t.next && !Mo(t.projectionNext) && _i(e, t.projectionNext, n, o), t.prev === null && t.parent !== null && Lo(t.parent, n) && !Lo(t, n) && _i(e, t, n, o)); }
function mP(e) { let t = e[U]; if (!t?.constructor)
    return !1; let n = W(t.constructor); return n?.encapsulation === $e.ShadowDom || n?.encapsulation === $e.ExperimentalIsolatedShadowDom; }
function Tc(e, t, n, o) { let r = t[w]; if (wh(t) && !qa() || mP(t))
    return r.setAttribute(e, Co, ""), null; {
    let i = gM(t, n, o), s = o.serializedViewCollection.add(i);
    return r.setAttribute(e, ro, s.toString()), s;
} }
function YC(e, t) { e.textContent = `ngh=${t}`; }
function yP(e, t) { for (let [n, o] of e)
    n.after(t.createComment(o)); }
function vP(e) { let t = e; for (; t != null;) {
    if (De(t))
        return !0;
    t = t.parent;
} return !1; }
function EP(e, t, n, o) { let r = my(e.hydrateTriggers); for (let i of r)
    o.eventTypesToReplay.regular.add(i); if (r.length > 0) {
    let i = t.filter(s => s.nodeType === Node.ELEMENT_NODE);
    for (let s of i)
        Nd(s, r, n);
} }
function e1(e) { return typeof e == "boolean" ? e : e != null && e !== "false"; }
function t1(e, t = NaN) { return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : t; }
var IP = "\u{1F170}\uFE0F", Nc = !1;
function n1(e) { if (!Nc)
    return; let { startLabel: t } = mM(e); performance.mark(t); }
function o1(e) { if (!Nc)
    return; let { startLabel: t, labelName: n, endLabel: o } = mM(e); performance.mark(o), performance.measure(n, t, o), performance.clearMarks(t), performance.clearMarks(o); }
function mM(e) { let t = `${IP}:${e}`; return { labelName: t, startLabel: `start:${t}`, endLabel: `end:${t}` }; }
var KC = !1;
function r1() { if (!KC && (typeof performance > "u" || !performance.mark || !performance.measure)) {
    KC = !0, console.warn("Performance API is not supported on this platform");
    return;
} Nc = !0; }
function i1() { Nc = !1; }
function s1(e) { }
function a1(e) { return re({ usage: 1, kind: "directive", type: e.type }).compileDirectiveDeclaration(Ee, `ng:///${e.type.name}/\u0275fac.js`, e); }
function c1(e) { xf(e.type, e.decorators, e.ctorParameters ?? null, e.propDecorators ?? null); }
function l1(e) { cI(e.type, e.resolveDeferredDeps, (...t) => { let n = e.resolveMetadata(...t); xf(e.type, n.decorators, n.ctorParameters, n.propDecorators); }); }
function u1(e) { return re({ usage: 1, kind: "component", type: e.type }).compileComponentDeclaration(Ee, `ng:///${e.type.name}/\u0275cmp.js`, e); }
function d1(e) { return re({ usage: 1, kind: DP(e.target), type: e.type }).compileFactoryDeclaration(Ee, `ng:///${e.type.name}/\u0275fac.js`, e); }
function DP(e) { switch (e) {
    case Bo.Directive: return "directive";
    case Bo.Component: return "component";
    case Bo.Injectable: return "injectable";
    case Bo.Pipe: return "pipe";
    case Bo.NgModule: return "NgModule";
} }
function f1(e) { return re({ usage: 1, kind: "injectable", type: e.type }).compileInjectableDeclaration(Ee, `ng:///${e.type.name}/\u0275prov.js`, e); }
function p1(e) { return re({ usage: 1, kind: "NgModule", type: e.type }).compileInjectorDeclaration(Ee, `ng:///${e.type.name}/\u0275inj.js`, e); }
function h1(e) { return re({ usage: 1, kind: "NgModule", type: e.type }).compileNgModuleDeclaration(Ee, `ng:///${e.type.name}/\u0275mod.js`, e); }
function g1(e) { return re({ usage: 1, kind: "pipe", type: e.type }).compilePipeDeclaration(Ee, `ng:///${e.type.name}/\u0275pipe.js`, e); }
var Wp = Symbol("NOT_SET"), yM = new Set, TP = we(z({}, Sc), { kind: "afterRenderEffectPhase", consumerIsAlwaysLive: !0, consumerAllowSignalWrites: !0, value: Wp, cleanup: null, consumerMarkedDirty() { if (this.sequence.impl.executing) {
        if (this.sequence.lastPhase === null || this.sequence.lastPhase < this.phase)
            return;
        this.sequence.erroredOrDestroyed = !0;
    } this.sequence.scheduler.notify(7); }, phaseFn(e) { if (this.sequence.lastPhase = this.phase, !this.dirty)
        return this.signal; if (this.dirty = !1, this.value !== Wp && !ki(this))
        return this.signal; try {
        for (let r of this.cleanup ?? yM)
            r();
    }
    finally {
        this.cleanup?.clear();
    } let t = []; e !== void 0 && t.push(e), t.push(this.registerCleanupFn); let n = qo(this), o; try {
        o = this.userFn.apply(null, t);
    }
    finally {
        Ri(this, n);
    } return (this.value === Wp || !this.equal(this.value, o)) && (this.value = o, this.version++), this.signal; } }), th = class extends jr {
    scheduler;
    lastPhase = null;
    nodes = [void 0, void 0, void 0, void 0];
    onDestroyFns = null;
    constructor(t, n, o, r, i, s = null) { super(t, [void 0, void 0, void 0, void 0], o, !1, i.get(Be), s), this.scheduler = r; for (let a of Zd) {
        let c = n[a];
        if (c === void 0)
            continue;
        let l = Object.create(TP);
        l.sequence = this, l.phase = a, l.userFn = c, l.dirty = !0, l.signal = () => (Ai(l), l.value), l.signal[se] = l, l.registerCleanupFn = u => (l.cleanup ??= new Set).add(u), this.nodes[a] = l, this.hooks[a] = u => l.phaseFn(u);
    } }
    afterRun() { super.afterRun(), this.lastPhase = null; }
    destroy() { if (this.onDestroyFns !== null)
        for (let t of this.onDestroyFns)
            t(); super.destroy(); for (let t of this.nodes)
        if (t)
            try {
                for (let n of t.cleanup ?? yM)
                    n();
            }
            finally {
                Ot(t);
            } }
};
function m1(e, t) { if (typeof ngServerMode < "u" && ngServerMode)
    return Aa; let n = t?.injector ?? v(ae), o = n.get(xe), r = n.get(ba), i = n.get(On, null, { optional: !0 }); r.impl ??= n.get(Yd); let s = e; typeof s == "function" && (s = { mixedReadWrite: e }); let a = n.get(Wn, null, { optional: !0 }), c = new th(r.impl, [s.earlyRead, s.write, s.mixedReadWrite, s.read], a?.view, o, n, i?.snapshot(null)); return r.impl.register(c), c; }
function y1(e) { return new nh(Pf(e) ? e : Ne(e)); }
var nh = class {
    snapshot;
    constructor(t) { this.snapshot = t; }
    get state() { return this.snapshot(); }
    value = Ne(() => { if (this.state.status === "error")
        throw new Ni(this.state.error); return this.state.value; });
    status = Ne(() => this.state.status);
    error = Ne(() => this.state.status === "error" ? this.state.error : void 0);
    isLoading = Ne(() => this.state.status === "loading" || this.state.status === "reloading");
    isValueDefined = Ne(() => this.state.status !== "error" && this.state.value !== void 0);
    hasValue() { return this.isValueDefined(); }
};
function v1(e, t) { let n = W(e), o = t.elementInjector || Bn(); return new Yt(n).create(o, t.projectableNodes, t.hostElement, t.environmentInjector, t.directives, t.bindings); }
function E1(e) { let t = W(e); if (!t)
    return null; let n = new Yt(t); return { get selector() { return n.selector; }, get type() { return n.componentType; }, get inputs() { return n.inputs; }, get outputs() { return n.outputs; }, get ngContentSelectors() { return n.ngContentSelectors; }, get isStandalone() { return t.standalone; }, get isSignal() { return t.signals; } }; }
function I1(...e) { return e.reduce((t, n) => Object.assign(t, n, { providers: [...t.providers, ...n.providers] }), { providers: [] }); }
var D1 = new T("", { providedIn: "platform", factory: () => null }), T1 = new T("", { providedIn: "platform", factory: () => null }), C1 = new T("", { providedIn: "platform", factory: () => null });
export { Iw as ANIMATION_MODULE_TYPE, vi as APP_BOOTSTRAP_LISTENER, _t as APP_ID, Vf as APP_INITIALIZER, Hf as ApplicationInitStatus, KF as ApplicationModule, Ge as ApplicationRef, Om as Attribute, aC as COMPILER_OPTIONS, Dw as CSP_NONCE, Ww as CUSTOM_ELEMENTS_SCHEMA, ua as ChangeDetectionStrategy, iP as ChangeDetectorRef, OO as Compiler, dd as CompilerFactory, wO as Component, za as ComponentFactory, gi as ComponentFactoryResolver, oE as ComponentRef, kF as ContentChild, RF as ContentChildren, LO as DEFAULT_CURRENCY_CODE, Ut as DOCUMENT, bn as DebugElement, fd as DebugEventListener, Kr as DebugNode, Zp as DefaultIterableDiffer, Be as DestroyRef, sC as Directive, Fe as ENVIRONMENT_INITIALIZER, ei as ElementRef, WC as EmbeddedViewRef, _e as EnvironmentInjector, vt as ErrorHandler, gt as EventEmitter, CF as HOST_TAG_NAME, fm as Host, kC as HostAttributeToken, AO as HostBinding, RO as HostListener, Jc as INJECTOR, cm as Inject, GN as Injectable, T as InjectionToken, ae as Injector, SO as Input, lM as IterableDiffers, uM as KeyValueDiffers, Ap as LOCALE_ID, Jy as MAX_ANIMATION_TIMEOUT, lC as MissingTranslationStrategy, sa as ModuleWithComponentFactories, zw as NO_ERRORS_SCHEMA, kO as NgModule, LE as NgModuleFactory, go as NgModuleRef, q as NgZone, lm as Optional, bO as Output, Mi as OutputEmitterRef, Ew as PLATFORM_ID, yd as PLATFORM_INITIALIZER, yr as PendingTasks, _O as Pipe, iM as PlatformRef, $o as Query, js as QueryList, D1 as REQUEST, C1 as REQUEST_CONTEXT, T1 as RESPONSE_INIT, Pb as Renderer2, $r as RendererFactory2, $s as RendererStyleFlags2, rE as Sanitizer, Rn as SecurityContext, um as Self, Os as SimpleChange, dm as SkipSelf, FO as TRANSLATIONS, jO as TRANSLATIONS_FORMAT, Hr as TemplateRef, vR as Testability, dI as TestabilityRegistry, No as TransferState, pm as Type, MM as VERSION, Pi as Version, xF as ViewChild, OF as ViewChildren, Ya as ViewContainerRef, $e as ViewEncapsulation, Qp as ViewRef, ov as afterEveryRender, Kd as afterNextRender, m1 as afterRenderEffect, VO as asNativeElements, QM as assertInInjectionContext, aN as assertNotInReactiveContext, Wx as assertPlatform, e1 as booleanAttribute, Ne as computed, SF as contentChild, bF as contentChildren, v1 as createComponent, _f as createEnvironmentInjector, FE as createNgModule, RA as createNgModuleRef, qx as createPlatform, Gx as createPlatformFactory, LF as destroyPlatform, Hl as effect, HF as enableProdMode, hR as enableProfiling, Xo as forwardRef, Jr as getDebugNode, WF as getModuleFactory, zF as getNgModuleById, Mc as getPlatform, Th as importProvidersFrom, v as inject, NF as input, yE as inputBinding, VF as isDevMode, Pf as isSignal, ir as isStandalone, Lf as isWritableSignal, kp as linkedSignal, Ye as makeEnvironmentProviders, Cw as makeStateKey, I1 as mergeApplicationConfig, AF as model, t1 as numberAttribute, MF as output, vE as outputBinding, YF as platformCore, hI as provideAppInitializer, iN as provideBrowserGlobalErrorListeners, jF as provideCheckNoChangesConfig, Dh as provideEnvironmentInitializer, b_ as provideNgReflectAttributes, FF as providePlatformInitializer, GF as provideStabilityDebugging, PF as provideZoneChangeDetection, xO as provideZonelessChangeDetection, E1 as reflectComponentType, x as resolveForwardRef, GO as resource, y1 as resourceFromSnapshots, Yi as runInInjectionContext, fI as setTestabilityGetter, $t as signal, oA as twoWayBinding, tt as untracked, wF as viewChild, _F as viewChildren, Ky as \u0275ANIMATIONS_DISABLED, qm as \u0275AcxChangeDetectionStrategy, Gm as \u0275AcxViewEncapsulation, ba as \u0275AfterRenderManager, BF as \u0275CLIENT_RENDER_MODE_FLAG, G as \u0275CONTAINER_HEADER_OFFSET, xe as \u0275ChangeDetectionScheduler, za as \u0275ComponentFactory, pR as \u0275Console, Di as \u0275DEFAULT_LOCALE_ID, iI as \u0275DEFER_BLOCK_CONFIG, cR as \u0275DEFER_BLOCK_DEPENDENCY_INTERCEPTOR, St as \u0275DEHYDRATED_BLOCK_REGISTRY, kf as \u0275DeferBlockBehavior, Z as \u0275DeferBlockState, Bx as \u0275ENABLE_ROOT_COMPONENT_BOOTSTRAP, Km as \u0275EVENT_REPLAY_QUEUE, us as \u0275EffectScheduler, Rx as \u0275Framework, fy as \u0275HydrationStatus, Tw as \u0275IMAGE_CONFIG, Wm as \u0275IMAGE_CONFIG_DEFAULTS, tl as \u0275INJECTOR_SCOPE, TF as \u0275INPUT_SIGNAL_BRAND_WRITE_TYPE, It as \u0275INTERNAL_APPLICATION_ERROR_HANDLER, Mw as \u0275IS_ENABLED_BLOCKING_INITIAL_NAVIGATION, An as \u0275IS_HYDRATION_DOM_REUSE_ENABLED, Md as \u0275IS_INCREMENTAL_HYDRATION_ENABLED, si as \u0275JSACTION_BLOCK_ELEMENT_MAP, Sd as \u0275JSACTION_EVENT_CONTRACT, Vs as \u0275LContext, vo as \u0275LocaleDataIndex, rn as \u0275NG_COMP_DEF, or as \u0275NG_DIR_DEF, sn as \u0275NG_ELEMENT_ID, Wo as \u0275NG_INJ_DEF, Ui as \u0275NG_MOD_DEF, rr as \u0275NG_PIPE_DEF, jn as \u0275NG_PROV_DEF, _s as \u0275NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR, H as \u0275NO_CHANGE, yo as \u0275NgModuleFactory, Yo as \u0275NoopNgZone, IP as \u0275PERFORMANCE_MARK_PREFIX, jx as \u0275PROVIDED_NG_ZONE, lN as \u0275PROVIDED_ZONELESS, Et as \u0275PendingTasksInternal, k as \u0275ProfilerEvent, on as \u0275R3Injector, ks as \u0275ReflectionCapabilities, Yt as \u0275Render3ComponentFactory, Ks as \u0275Render3ComponentRef, mo as \u0275Render3NgModuleRef, uc as \u0275ResourceImpl, D as \u0275RuntimeError, se as \u0275SIGNAL, cy as \u0275SSR_CONTENT_INTEGRITY_MARKER, lI as \u0275TESTABILITY, uI as \u0275TESTABILITY_GETTER, rI as \u0275TimerScheduler, Sa as \u0275TracingAction, On as \u0275TracingService, Zt as \u0275ViewRef, Hi as \u0275XSS_SECURITY_URL, zn as \u0275ZONELESS_ENABLED, ky as \u0275_sanitizeHtml, ci as \u0275_sanitizeUrl, Cn as \u0275allLeavingAnimations, Ro as \u0275allowSanitizationBypassAndThrow, XF as \u0275annotateForHydration, s1 as \u0275assertType, Xw as \u0275bypassSanitizationTrustHtml, o_ as \u0275bypassSanitizationTrustResourceUrl, t_ as \u0275bypassSanitizationTrustScript, e_ as \u0275bypassSanitizationTrustStyle, n_ as \u0275bypassSanitizationTrustUrl, wA as \u0275clearResolutionOfComponentResourcesQueue, YT as \u0275compileComponent, bp as \u0275compileDirective, QT as \u0275compileNgModule, ZT as \u0275compileNgModuleDefs, Lx as \u0275compileNgModuleFactory, iC as \u0275compilePipe, tn as \u0275convertToBitFlags, Bc as \u0275createInjector, zx as \u0275createOrReusePlatformInjector, QF as \u0275defaultIterableDiffers, ZF as \u0275defaultKeyValueDiffers, po as \u0275depsTracker, uE as \u0275devModeEqual, i1 as \u0275disableProfiling, r1 as \u0275enableProfiling, Lp as \u0275encapsulateResourceError, tp as \u0275findLocaleData, WT as \u0275flushModuleScopingQueueAsMuchAsPossible, Ko as \u0275formatRuntimeError, pO as \u0275generateStandaloneInDeclarationsError, fR as \u0275getAsyncClassMetadataFn, rA as \u0275getClosestComponentName, W as \u0275getComponentDef, As as \u0275getDeferBlocks, uw as \u0275getDirectives, fa as \u0275getDocument, fw as \u0275getHostElement, nr as \u0275getInjectableDef, Me as \u0275getLContext, zR as \u0275getLocaleCurrencyCode, eD as \u0275getLocalePluralCase, $O as \u0275getOutputDestroyRef, wy as \u0275getSanitizationBypassType, gR as \u0275getTransferState, Zw as \u0275getUnknownElementStrictMode, Kw as \u0275getUnknownPropertyStrictMode, Se as \u0275global, EE as \u0275inferTagNameFromDefinition, sP as \u0275injectChangeDetectorRef, JF as \u0275internalCreateApplication, Vx as \u0275internalProvideZoneChangeDetection, gI as \u0275isBoundToModule, NA as \u0275isComponentDefPendingResolution, Wc as \u0275isEnvironmentProviders, SM as \u0275isInjectable, gn as \u0275isNgModule, jf as \u0275isPromise, pI as \u0275isSubscribable, VS as \u0275isViewDirty, HS as \u0275markForRefresh, ft as \u0275noSideEffects, _p as \u0275patchComponentDefWithScope, J as \u0275performanceMarkFeature, ec as \u0275promiseWithResolvers, lc as \u0275provideZonelessChangeDetectionInternal, mR as \u0275publishExternalGlobalUtil, xw as \u0275readHydrationInfo, WR as \u0275registerLocaleData, Tt as \u0275renderDeferBlockState, mO as \u0275resetCompiledComponents, Lw as \u0275resetIncrementalHydrationEnabledWarnedForTests, dO as \u0275resetJitOptions, kE as \u0275resolveComponentResources, _A as \u0275restoreComponentResolutionQueue, AA as \u0275setAllowDuplicateNgModuleIdsForTest, vM as \u0275setAlternateWeakRefImpl, UT as \u0275setClassDebugInfo, xf as \u0275setClassMetadata, cI as \u0275setClassMetadataAsync, nt as \u0275setCurrentInjector, yw as \u0275setDocument, RM as \u0275setInjectorProfilerContext, rD as \u0275setLocaleId, Qw as \u0275setUnknownElementStrictMode, Yw as \u0275setUnknownPropertyStrictMode, n1 as \u0275startMeasuring, o1 as \u0275stopMeasuring, fr as \u0275store, Jo as \u0275stringify, Sp as \u0275transitiveScopesFor, tc as \u0275triggerResourceLoading, wM as \u0275truncateMiddle, QR as \u0275unregisterLocaleData, bt as \u0275unwrapSafeValue, sN as \u0275unwrapWritableSignal, UF as \u0275withDomHydration, Qx as \u0275withEventReplay, $F as \u0275withI18nSupport, qF as \u0275withIncrementalHydration, GE as \u0275\u0275ControlFeature, mT as \u0275\u0275ExternalStylesFeature, Bo as \u0275\u0275FactoryTarget, WE as \u0275\u0275HostDirectivesFeature, bf as \u0275\u0275InheritDefinitionFeature, gm as \u0275\u0275NgOnChangesFeature, gT as \u0275\u0275ProvidersFeature, Zy as \u0275\u0275advance, wr as \u0275\u0275animateEnter, _r as \u0275\u0275animateEnterListener, Sr as \u0275\u0275animateLeave, ea as \u0275\u0275animateLeaveListener, $f as \u0275\u0275ariaProperty, fT as \u0275\u0275arrowFunction, tT as \u0275\u0275attachSourceLocations, qf as \u0275\u0275attribute, RD as \u0275\u0275classMap, hp as \u0275\u0275classProp, qI as \u0275\u0275componentInstance, WI as \u0275\u0275conditional, nc as \u0275\u0275conditionalBranchCreate, GI as \u0275\u0275conditionalCreate, lp as \u0275\u0275contentQuery, dp as \u0275\u0275contentQuerySignal, hE as \u0275\u0275control, fE as \u0275\u0275controlCreate, wp as \u0275\u0275declareLet, DI as \u0275\u0275defer, aI as \u0275\u0275deferEnableTimerScheduling, NI as \u0275\u0275deferHydrateNever, FI as \u0275\u0275deferHydrateOnHover, SI as \u0275\u0275deferHydrateOnIdle, RI as \u0275\u0275deferHydrateOnImmediate, HI as \u0275\u0275deferHydrateOnInteraction, xI as \u0275\u0275deferHydrateOnTimer, $I as \u0275\u0275deferHydrateOnViewport, MI as \u0275\u0275deferHydrateWhen, PI as \u0275\u0275deferOnHover, wI as \u0275\u0275deferOnIdle, bI as \u0275\u0275deferOnImmediate, jI as \u0275\u0275deferOnInteraction, kI as \u0275\u0275deferOnTimer, BI as \u0275\u0275deferOnViewport, LI as \u0275\u0275deferPrefetchOnHover, _I as \u0275\u0275deferPrefetchOnIdle, AI as \u0275\u0275deferPrefetchOnImmediate, VI as \u0275\u0275deferPrefetchOnInteraction, OI as \u0275\u0275deferPrefetchOnTimer, UI as \u0275\u0275deferPrefetchOnViewport, CI as \u0275\u0275deferPrefetchWhen, TI as \u0275\u0275deferWhen, VE as \u0275\u0275defineComponent, BE as \u0275\u0275defineDirective, B as \u0275\u0275defineInjectable, tr as \u0275\u0275defineInjector, Sf as \u0275\u0275defineNgModule, UE as \u0275\u0275definePipe, Fo as \u0275\u0275directiveInject, ml as \u0275\u0275disableBindings, zf as \u0275\u0275domElement, Kf as \u0275\u0275domElementContainer, Yf as \u0275\u0275domElementContainerEnd, ac as \u0275\u0275domElementContainerStart, ic as \u0275\u0275domElementEnd, rc as \u0275\u0275domElementStart, ap as \u0275\u0275domListener, Xf as \u0275\u0275domProperty, Rf as \u0275\u0275domTemplate, Wf as \u0275\u0275element, Zf as \u0275\u0275elementContainer, Ii as \u0275\u0275elementContainerEnd, sc as \u0275\u0275elementContainerStart, oc as \u0275\u0275elementEnd, Qr as \u0275\u0275elementStart, gl as \u0275\u0275enableBindings, BT as \u0275\u0275getComponentDepsFactory, XI as \u0275\u0275getCurrentView, Rm as \u0275\u0275getInheritedFactory, $T as \u0275\u0275getReplaceMetadataURL, gD as \u0275\u0275i18n, yD as \u0275\u0275i18nApply, mD as \u0275\u0275i18nAttributes, op as \u0275\u0275i18nEnd, rp as \u0275\u0275i18nExp, vD as \u0275\u0275i18nPostprocess, np as \u0275\u0275i18nStart, pe as \u0275\u0275inject, ca as \u0275\u0275injectAttribute, nT as \u0275\u0275interpolate, oT as \u0275\u0275interpolate1, rT as \u0275\u0275interpolate2, iT as \u0275\u0275interpolate3, sT as \u0275\u0275interpolate4, aT as \u0275\u0275interpolate5, cT as \u0275\u0275interpolate6, lT as \u0275\u0275interpolate7, uT as \u0275\u0275interpolate8, dT as \u0275\u0275interpolateV, iE as \u0275\u0275invalidFactory, Wi as \u0275\u0275invalidFactoryDep, ip as \u0275\u0275listener, CD as \u0275\u0275loadQuery, Rl as \u0275\u0275namespaceHTML, Al as \u0275\u0275namespaceMathML, bl as \u0275\u0275namespaceSVG, ED as \u0275\u0275nextContext, c1 as \u0275\u0275ngDeclareClassMetadata, l1 as \u0275\u0275ngDeclareClassMetadataAsync, u1 as \u0275\u0275ngDeclareComponent, a1 as \u0275\u0275ngDeclareDirective, d1 as \u0275\u0275ngDeclareFactory, f1 as \u0275\u0275ngDeclareInjectable, p1 as \u0275\u0275ngDeclareInjector, h1 as \u0275\u0275ngDeclareNgModule, g1 as \u0275\u0275ngDeclarePipe, xT as \u0275\u0275pipe, PT as \u0275\u0275pipeBind1, LT as \u0275\u0275pipeBind2, FT as \u0275\u0275pipeBind3, jT as \u0275\u0275pipeBind4, VT as \u0275\u0275pipeBindV, DD as \u0275\u0275projection, ID as \u0275\u0275projectionDef, Gf as \u0275\u0275property, ET as \u0275\u0275pureFunction0, IT as \u0275\u0275pureFunction1, DT as \u0275\u0275pureFunction2, TT as \u0275\u0275pureFunction3, CT as \u0275\u0275pureFunction4, MT as \u0275\u0275pureFunction5, NT as \u0275\u0275pureFunction6, wT as \u0275\u0275pureFunction7, _T as \u0275\u0275pureFunction8, ST as \u0275\u0275pureFunctionV, MD as \u0275\u0275queryAdvance, TD as \u0275\u0275queryRefresh, eT as \u0275\u0275readContextLet, ND as \u0275\u0275reference, Nf as \u0275\u0275registerNgModuleType, YI as \u0275\u0275repeater, ZI as \u0275\u0275repeaterCreate, QI as \u0275\u0275repeaterTrackByIdentity, zI as \u0275\u0275repeaterTrackByIndex, qT as \u0275\u0275replaceMetadata, El as \u0275\u0275resetView, Hd as \u0275\u0275resolveBody, Gy as \u0275\u0275resolveDocument, qy as \u0275\u0275resolveWindow, vl as \u0275\u0275restoreView, Fy as \u0275\u0275sanitizeHtml, Vd as \u0275\u0275sanitizeResourceUrl, Vy as \u0275\u0275sanitizeScript, jy as \u0275\u0275sanitizeStyle, jd as \u0275\u0275sanitizeUrl, Uy as \u0275\u0275sanitizeUrlOrResourceUrl, yT as \u0275\u0275setComponentScope, vT as \u0275\u0275setNgModuleScope, XD as \u0275\u0275storeLet, AD as \u0275\u0275styleMap, pp as \u0275\u0275styleProp, sp as \u0275\u0275syntheticHostListener, ep as \u0275\u0275syntheticHostProperty, Af as \u0275\u0275template, HT as \u0275\u0275templateRefExtractor, VD as \u0275\u0275text, gp as \u0275\u0275textInterpolate, cc as \u0275\u0275textInterpolate1, mp as \u0275\u0275textInterpolate2, yp as \u0275\u0275textInterpolate3, vp as \u0275\u0275textInterpolate4, Ep as \u0275\u0275textInterpolate5, Ip as \u0275\u0275textInterpolate6, Dp as \u0275\u0275textInterpolate7, Tp as \u0275\u0275textInterpolate8, Cp as \u0275\u0275textInterpolateV, Hy as \u0275\u0275trustConstantHtml, By as \u0275\u0275trustConstantResourceUrl, KD as \u0275\u0275twoWayBindingSet, Np as \u0275\u0275twoWayListener, Mp as \u0275\u0275twoWayProperty, $y as \u0275\u0275validateAttribute, up as \u0275\u0275viewQuery, fp as \u0275\u0275viewQuerySignal };
/*! Bundled license information:

@angular/core/fesm2022/_effect-chunk2.mjs:
@angular/core/fesm2022/_attribute-chunk.mjs:
@angular/core/fesm2022/_debug_node-chunk.mjs:
@angular/core/fesm2022/_resource-chunk.mjs:
@angular/core/fesm2022/primitives-event-dispatch.mjs:
@angular/core/fesm2022/core.mjs:
  (**
   * @license Angular v21.2.6
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
