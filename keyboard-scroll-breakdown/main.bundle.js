(() => {
  // vendor/motion-utils.js
  function t(t2, n2) {
    -1 === t2.indexOf(n2) && t2.push(n2);
  }
  function n(t2, n2) {
    const s = t2.indexOf(n2);
    s > -1 && t2.splice(s, 1);
  }
  var e = (t2, n2, s) => s > n2 ? n2 : s < t2 ? t2 : s;
  var r = () => {
  };
  var o = () => {
  };
  var i = {};
  var c = (t2) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t2);
  function u(t2) {
    return "object" == typeof t2 && null !== t2;
  }
  var a = (t2) => /^0[^.\s]+$/u.test(t2);
  function f(t2) {
    let n2;
    return () => (void 0 === n2 && (n2 = t2()), n2);
  }
  var h = (t2) => t2;
  var l = (t2, n2) => (s) => n2(t2(s));
  var p = (...t2) => t2.reduce(l);
  var d = (t2, n2, s) => {
    const e2 = n2 - t2;
    return 0 === e2 ? 1 : (s - t2) / e2;
  };
  var b = class {
    constructor() {
      this.subscriptions = [];
    }
    add(s) {
      return t(this.subscriptions, s), () => n(this.subscriptions, s);
    }
    notify(t2, n2, s) {
      const e2 = this.subscriptions.length;
      if (e2) if (1 === e2) this.subscriptions[0](t2, n2, s);
      else for (let r2 = 0; r2 < e2; r2++) {
        const e3 = this.subscriptions[r2];
        e3 && e3(t2, n2, s);
      }
    }
    getSize() {
      return this.subscriptions.length;
    }
    clear() {
      this.subscriptions.length = 0;
    }
  };
  var g = (t2) => 1e3 * t2;
  var y = (t2) => t2 / 1e3;
  function M(t2, n2) {
    return n2 ? t2 * (1e3 / n2) : 0;
  }
  var x = (t2, n2, s) => {
    const e2 = n2 - t2;
    return ((s - t2) % e2 + e2) % e2 + t2;
  };
  var v = (t2, n2, s) => (((1 - 3 * s + 3 * n2) * t2 + (3 * s - 6 * n2)) * t2 + 3 * n2) * t2;
  function w(t2, n2, s, e2) {
    if (t2 === n2 && s === e2) return h;
    const r2 = (n3) => (function(t3, n4, s2, e3, r3) {
      let o2, i2, c2 = 0;
      do {
        i2 = n4 + (s2 - n4) / 2, o2 = v(i2, e3, r3) - t3, o2 > 0 ? s2 = i2 : n4 = i2;
      } while (Math.abs(o2) > 1e-7 && ++c2 < 12);
      return i2;
    })(n3, 0, 1, t2, s);
    return (t3) => 0 === t3 || 1 === t3 ? t3 : v(r2(t3), n2, e2);
  }
  var A = (t2) => (n2) => n2 <= 0.5 ? t2(2 * n2) / 2 : (2 - t2(2 * (1 - n2))) / 2;
  var $ = (t2) => (n2) => 1 - t2(1 - n2);
  var k = w(0.33, 1.53, 0.69, 0.99);
  var S = $(k);
  var j = A(S);
  var z = (t2) => (t2 *= 2) < 1 ? 0.5 * S(t2) : 0.5 * (2 - Math.pow(2, -10 * (t2 - 1)));
  var F = (t2) => 1 - Math.sin(Math.acos(t2));
  var q = $(F);
  var B = A(F);
  var C = w(0.42, 0, 1, 1);
  var D = w(0, 0, 0.58, 1);
  var E = w(0.42, 0, 0.58, 1);
  var H = (t2) => Array.isArray(t2) && "number" != typeof t2[0];
  function J(t2, n2) {
    return H(t2) ? t2[x(0, t2.length, n2)] : t2;
  }
  var K = (t2) => Array.isArray(t2) && "number" == typeof t2[0];
  var L = { linear: h, easeIn: C, easeInOut: E, easeOut: D, circIn: F, circInOut: B, circOut: q, backIn: S, backInOut: j, backOut: k, anticipate: z };
  var N = (t2) => {
    if (K(t2)) {
      t2.length;
      const [n2, s, e2, r2] = t2;
      return w(n2, s, e2, r2);
    }
    return "string" == typeof t2 ? L[t2] : t2;
  };

  // vendor/motion-dom.js
  var M2 = ["setup", "read", "resolveKeyframes", "preUpdate", "update", "preRender", "render", "postRender"];
  var k2 = { value: null, addProjectionMetrics: null };
  function A2(e2, n2) {
    let s = false, i2 = true;
    const r2 = { delta: 0, timestamp: 0, isProcessing: false }, a2 = () => s = true, o2 = M2.reduce(((t2, e3) => (t2[e3] = /* @__PURE__ */ (function(t3, e4) {
      let n3 = /* @__PURE__ */ new Set(), s2 = /* @__PURE__ */ new Set(), i3 = false, r3 = false;
      const a3 = /* @__PURE__ */ new WeakSet();
      let o3 = { delta: 0, timestamp: 0, isProcessing: false }, u3 = 0;
      function l3(e5) {
        a3.has(e5) && (c3.schedule(e5), t3()), u3++, e5(o3);
      }
      const c3 = { schedule: (t4, e5 = false, r4 = false) => {
        const o4 = r4 && i3 ? n3 : s2;
        return e5 && a3.add(t4), o4.has(t4) || o4.add(t4), t4;
      }, cancel: (t4) => {
        s2.delete(t4), a3.delete(t4);
      }, process: (t4) => {
        o3 = t4, i3 ? r3 = true : (i3 = true, [n3, s2] = [s2, n3], n3.forEach(l3), e4 && k2.value && k2.value.frameloop[e4].push(u3), u3 = 0, n3.clear(), i3 = false, r3 && (r3 = false, c3.process(t4)));
      } };
      return c3;
    })(a2, n2 ? e3 : void 0), t2)), {}), { setup: u2, read: l2, resolveKeyframes: c2, preUpdate: h2, update: d2, preRender: p2, render: m, postRender: f2 } = o2, g2 = () => {
      const a3 = i.useManualTiming ? r2.timestamp : performance.now();
      s = false, i.useManualTiming || (r2.delta = i2 ? 1e3 / 60 : Math.max(Math.min(a3 - r2.timestamp, 40), 1)), r2.timestamp = a3, r2.isProcessing = true, u2.process(r2), l2.process(r2), c2.process(r2), h2.process(r2), d2.process(r2), p2.process(r2), m.process(r2), f2.process(r2), r2.isProcessing = false, s && n2 && (i2 = false, e2(g2));
    };
    return { schedule: M2.reduce(((t2, n3) => {
      const a3 = o2[n3];
      return t2[n3] = (t3, n4 = false, o3 = false) => (s || (s = true, i2 = true, r2.isProcessing || e2(g2)), a3.schedule(t3, n4, o3)), t2;
    }), {}), cancel: (t2) => {
      for (let e3 = 0; e3 < M2.length; e3++) o2[M2[e3]].cancel(t2);
    }, state: r2, steps: o2 };
  }
  var { schedule: S2, cancel: E2, state: P, steps: R } = A2("undefined" != typeof requestAnimationFrame ? requestAnimationFrame : h, true);
  var D2;
  function F2() {
    D2 = void 0;
  }
  var O = { now: () => (void 0 === D2 && O.set(P.isProcessing || i.useManualTiming ? P.timestamp : performance.now()), D2), set: (t2) => {
    D2 = t2, queueMicrotask(F2);
  } };
  var V = { layout: 0, mainThread: 0, waapi: 0 };
  var C2 = (t2) => (e2) => "string" == typeof e2 && e2.startsWith(t2);
  var $2 = C2("--");
  var K2 = C2("var(--");
  var L2 = (t2) => !!K2(t2) && W.test(t2.split("/*")[0].trim());
  var W = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
  var B2 = { test: (t2) => "number" == typeof t2, parse: parseFloat, transform: (t2) => t2 };
  var j2 = { ...B2, transform: (t2) => e(0, 1, t2) };
  var N2 = { ...B2, default: 1 };
  var Y = (t2) => Math.round(1e5 * t2) / 1e5;
  var X = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
  var I = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
  var z2 = (t2, e2) => (n2) => Boolean("string" == typeof n2 && I.test(n2) && n2.startsWith(t2) || e2 && !(function(t3) {
    return null == t3;
  })(n2) && Object.prototype.hasOwnProperty.call(n2, e2));
  var U = (t2, e2, n2) => (s) => {
    if ("string" != typeof s) return s;
    const [i2, r2, a2, o2] = s.match(X);
    return { [t2]: parseFloat(i2), [e2]: parseFloat(r2), [n2]: parseFloat(a2), alpha: void 0 !== o2 ? parseFloat(o2) : 1 };
  };
  var q2 = { ...B2, transform: (t2) => Math.round(((t3) => e(0, 255, t3))(t2)) };
  var Z = { test: z2("rgb", "red"), parse: U("red", "green", "blue"), transform: ({ red: t2, green: e2, blue: n2, alpha: s = 1 }) => "rgba(" + q2.transform(t2) + ", " + q2.transform(e2) + ", " + q2.transform(n2) + ", " + Y(j2.transform(s)) + ")" };
  var _ = { test: z2("#"), parse: function(t2) {
    let e2 = "", n2 = "", s = "", i2 = "";
    return t2.length > 5 ? (e2 = t2.substring(1, 3), n2 = t2.substring(3, 5), s = t2.substring(5, 7), i2 = t2.substring(7, 9)) : (e2 = t2.substring(1, 2), n2 = t2.substring(2, 3), s = t2.substring(3, 4), i2 = t2.substring(4, 5), e2 += e2, n2 += n2, s += s, i2 += i2), { red: parseInt(e2, 16), green: parseInt(n2, 16), blue: parseInt(s, 16), alpha: i2 ? parseInt(i2, 16) / 255 : 1 };
  }, transform: Z.transform };
  var H2 = (t2) => ({ test: (e2) => "string" == typeof e2 && e2.endsWith(t2) && 1 === e2.split(" ").length, parse: parseFloat, transform: (e2) => `${e2}${t2}` });
  var G = H2("deg");
  var J2 = H2("%");
  var Q = H2("px");
  var tt = H2("vh");
  var et = H2("vw");
  var nt = (() => ({ ...J2, parse: (t2) => J2.parse(t2) / 100, transform: (t2) => J2.transform(100 * t2) }))();
  var st = { test: z2("hsl", "hue"), parse: U("hue", "saturation", "lightness"), transform: ({ hue: t2, saturation: e2, lightness: n2, alpha: s = 1 }) => "hsla(" + Math.round(t2) + ", " + J2.transform(Y(e2)) + ", " + J2.transform(Y(n2)) + ", " + Y(j2.transform(s)) + ")" };
  var it = { test: (t2) => Z.test(t2) || _.test(t2) || st.test(t2), parse: (t2) => Z.test(t2) ? Z.parse(t2) : st.test(t2) ? st.parse(t2) : _.parse(t2), transform: (t2) => "string" == typeof t2 ? t2 : t2.hasOwnProperty("red") ? Z.transform(t2) : st.transform(t2), getAnimatableNone: (t2) => {
    const e2 = it.parse(t2);
    return e2.alpha = 0, it.transform(e2);
  } };
  var rt = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
  var at = "number";
  var ot = "color";
  var ut = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
  function lt(t2) {
    const e2 = t2.toString(), n2 = [], s = { color: [], number: [], var: [] }, i2 = [];
    let r2 = 0;
    const a2 = e2.replace(ut, ((t3) => (it.test(t3) ? (s.color.push(r2), i2.push(ot), n2.push(it.parse(t3))) : t3.startsWith("var(") ? (s.var.push(r2), i2.push("var"), n2.push(t3)) : (s.number.push(r2), i2.push(at), n2.push(parseFloat(t3))), ++r2, "${}"))).split("${}");
    return { values: n2, split: a2, indexes: s, types: i2 };
  }
  function ct(t2) {
    return lt(t2).values;
  }
  function ht(t2) {
    const { split: e2, types: n2 } = lt(t2), s = e2.length;
    return (t3) => {
      let i2 = "";
      for (let r2 = 0; r2 < s; r2++) if (i2 += e2[r2], void 0 !== t3[r2]) {
        const e3 = n2[r2];
        i2 += e3 === at ? Y(t3[r2]) : e3 === ot ? it.transform(t3[r2]) : t3[r2];
      }
      return i2;
    };
  }
  var dt = (t2) => "number" == typeof t2 ? 0 : it.test(t2) ? it.getAnimatableNone(t2) : t2;
  var pt = { test: function(t2) {
    return isNaN(t2) && "string" == typeof t2 && (t2.match(X)?.length || 0) + (t2.match(rt)?.length || 0) > 0;
  }, parse: ct, createTransformer: ht, getAnimatableNone: function(t2) {
    const e2 = ct(t2);
    return ht(t2)(e2.map(dt));
  } };
  function mt(t2, e2, n2) {
    return n2 < 0 && (n2 += 1), n2 > 1 && (n2 -= 1), n2 < 1 / 6 ? t2 + 6 * (e2 - t2) * n2 : n2 < 0.5 ? e2 : n2 < 2 / 3 ? t2 + (e2 - t2) * (2 / 3 - n2) * 6 : t2;
  }
  function ft({ hue: t2, saturation: e2, lightness: n2, alpha: s }) {
    t2 /= 360, n2 /= 100;
    let i2 = 0, r2 = 0, a2 = 0;
    if (e2 /= 100) {
      const s2 = n2 < 0.5 ? n2 * (1 + e2) : n2 + e2 - n2 * e2, o2 = 2 * n2 - s2;
      i2 = mt(o2, s2, t2 + 1 / 3), r2 = mt(o2, s2, t2), a2 = mt(o2, s2, t2 - 1 / 3);
    } else i2 = r2 = a2 = n2;
    return { red: Math.round(255 * i2), green: Math.round(255 * r2), blue: Math.round(255 * a2), alpha: s };
  }
  function gt(t2, e2) {
    return (n2) => n2 > 0 ? e2 : t2;
  }
  var yt = (t2, e2, n2) => t2 + (e2 - t2) * n2;
  var vt = (t2, e2, n2) => {
    const s = t2 * t2, i2 = n2 * (e2 * e2 - s) + s;
    return i2 < 0 ? 0 : Math.sqrt(i2);
  };
  var wt = [_, Z, st];
  function bt(t2) {
    const e2 = (n2 = t2, wt.find(((t3) => t3.test(n2))));
    var n2;
    if (r(Boolean(e2), `'${t2}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable"), !Boolean(e2)) return false;
    let i2 = e2.parse(t2);
    return e2 === st && (i2 = ft(i2)), i2;
  }
  var Tt = (t2, e2) => {
    const n2 = bt(t2), s = bt(e2);
    if (!n2 || !s) return gt(t2, e2);
    const i2 = { ...n2 };
    return (t3) => (i2.red = vt(n2.red, s.red, t3), i2.green = vt(n2.green, s.green, t3), i2.blue = vt(n2.blue, s.blue, t3), i2.alpha = yt(n2.alpha, s.alpha, t3), Z.transform(i2));
  };
  var xt = /* @__PURE__ */ new Set(["none", "hidden"]);
  function Mt(t2, e2) {
    return xt.has(t2) ? (n2) => n2 <= 0 ? t2 : e2 : (n2) => n2 >= 1 ? e2 : t2;
  }
  function kt(t2, e2) {
    return (n2) => yt(t2, e2, n2);
  }
  function At(t2) {
    return "number" == typeof t2 ? kt : "string" == typeof t2 ? L2(t2) ? gt : it.test(t2) ? Tt : Pt : Array.isArray(t2) ? St : "object" == typeof t2 ? it.test(t2) ? Tt : Et : gt;
  }
  function St(t2, e2) {
    const n2 = [...t2], s = n2.length, i2 = t2.map(((t3, n3) => At(t3)(t3, e2[n3])));
    return (t3) => {
      for (let e3 = 0; e3 < s; e3++) n2[e3] = i2[e3](t3);
      return n2;
    };
  }
  function Et(t2, e2) {
    const n2 = { ...t2, ...e2 }, s = {};
    for (const i2 in n2) void 0 !== t2[i2] && void 0 !== e2[i2] && (s[i2] = At(t2[i2])(t2[i2], e2[i2]));
    return (t3) => {
      for (const e3 in s) n2[e3] = s[e3](t3);
      return n2;
    };
  }
  var Pt = (t2, e2) => {
    const n2 = pt.createTransformer(e2), r2 = lt(t2), a2 = lt(e2);
    return r2.indexes.var.length === a2.indexes.var.length && r2.indexes.color.length === a2.indexes.color.length && r2.indexes.number.length >= a2.indexes.number.length ? xt.has(t2) && !a2.values.length || xt.has(e2) && !r2.values.length ? Mt(t2, e2) : p(St((function(t3, e3) {
      const n3 = [], s = { color: 0, var: 0, number: 0 };
      for (let i2 = 0; i2 < e3.values.length; i2++) {
        const r3 = e3.types[i2], a3 = t3.indexes[r3][s[r3]], o2 = t3.values[a3] ?? 0;
        n3[i2] = o2, s[r3]++;
      }
      return n3;
    })(r2, a2), a2.values), n2) : (r(true, `Complex values '${t2}' and '${e2}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different"), gt(t2, e2));
  };
  function Rt(t2, e2, n2) {
    if ("number" == typeof t2 && "number" == typeof e2 && "number" == typeof n2) return yt(t2, e2, n2);
    return At(t2)(t2, e2);
  }
  var Dt = (t2) => {
    const e2 = ({ timestamp: e3 }) => t2(e3);
    return { start: (t3 = true) => S2.update(e2, t3), stop: () => E2(e2), now: () => P.isProcessing ? P.timestamp : O.now() };
  };
  var Ft = (t2, e2, n2 = 10) => {
    let s = "";
    const i2 = Math.max(Math.round(e2 / n2), 2);
    for (let e3 = 0; e3 < i2; e3++) s += Math.round(1e4 * t2(e3 / (i2 - 1))) / 1e4 + ", ";
    return `linear(${s.substring(0, s.length - 2)})`;
  };
  var Ot = 2e4;
  function Vt(t2) {
    let e2 = 0;
    let n2 = t2.next(e2);
    for (; !n2.done && e2 < Ot; ) e2 += 50, n2 = t2.next(e2);
    return e2 >= Ot ? 1 / 0 : e2;
  }
  function Ct(t2, e2 = 100, n2) {
    const s = n2({ ...t2, keyframes: [0, e2] }), i2 = Math.min(Vt(s), Ot);
    return { type: "keyframes", ease: (t3) => s.next(i2 * t3).value / e2, duration: y(i2) };
  }
  function $t(t2, e2, n2) {
    const s = Math.max(e2 - 5, 0);
    return M(n2 - t2(s), e2 - s);
  }
  var Kt = 100;
  var Lt = 10;
  var Wt = 1;
  var Bt = 0;
  var jt = 800;
  var Nt = 0.3;
  var Yt = 0.3;
  var Xt = { granular: 0.01, default: 2 };
  var It = { granular: 5e-3, default: 0.5 };
  var zt = 0.01;
  var Ut = 10;
  var qt = 0.05;
  var Zt = 1;
  var _t = 1e-3;
  function Ht({ duration: t2 = jt, bounce: e2 = Nt, velocity: i2 = Bt, mass: a2 = Wt }) {
    let u2, l2;
    r(t2 <= g(Ut), "Spring duration must be 10 seconds or less", "spring-duration-limit");
    let c2 = 1 - e2;
    c2 = e(qt, Zt, c2), t2 = e(zt, Ut, y(t2)), c2 < 1 ? (u2 = (e3) => {
      const n2 = e3 * c2, s = n2 * t2, r2 = n2 - i2, a3 = Jt(e3, c2), o2 = Math.exp(-s);
      return _t - r2 / a3 * o2;
    }, l2 = (e3) => {
      const n2 = e3 * c2 * t2, s = n2 * i2 + i2, r2 = Math.pow(c2, 2) * Math.pow(e3, 2) * t2, a3 = Math.exp(-n2), o2 = Jt(Math.pow(e3, 2), c2);
      return (-u2(e3) + _t > 0 ? -1 : 1) * ((s - r2) * a3) / o2;
    }) : (u2 = (e3) => Math.exp(-e3 * t2) * ((e3 - i2) * t2 + 1) - 1e-3, l2 = (e3) => Math.exp(-e3 * t2) * (t2 * t2 * (i2 - e3)));
    const h2 = (function(t3, e3, n2) {
      let s = n2;
      for (let n3 = 1; n3 < Gt; n3++) s -= t3(s) / e3(s);
      return s;
    })(u2, l2, 5 / t2);
    if (t2 = g(t2), isNaN(h2)) return { stiffness: Kt, damping: Lt, duration: t2 };
    {
      const e3 = Math.pow(h2, 2) * a2;
      return { stiffness: e3, damping: 2 * c2 * Math.sqrt(a2 * e3), duration: t2 };
    }
  }
  var Gt = 12;
  function Jt(t2, e2) {
    return t2 * Math.sqrt(1 - e2 * e2);
  }
  var Qt = ["duration", "bounce"];
  var te = ["stiffness", "damping", "mass"];
  function ee(t2, e2) {
    return e2.some(((e3) => void 0 !== t2[e3]));
  }
  function ne(t2 = Yt, e2 = Nt) {
    const s = "object" != typeof t2 ? { visualDuration: t2, keyframes: [0, 1], bounce: e2 } : t2;
    let { restSpeed: i2, restDelta: a2 } = s;
    const u2 = s.keyframes[0], l2 = s.keyframes[s.keyframes.length - 1], c2 = { done: false, value: u2 }, { stiffness: h2, damping: d2, mass: p2, duration: m, velocity: f2, isResolvedFromDuration: g2 } = (function(t3) {
      let e3 = { velocity: Bt, stiffness: Kt, damping: Lt, mass: Wt, isResolvedFromDuration: false, ...t3 };
      if (!ee(t3, te) && ee(t3, Qt)) if (t3.visualDuration) {
        const s2 = t3.visualDuration, i3 = 2 * Math.PI / (1.2 * s2), r2 = i3 * i3, a3 = 2 * e(0.05, 1, 1 - (t3.bounce || 0)) * Math.sqrt(r2);
        e3 = { ...e3, mass: Wt, stiffness: r2, damping: a3 };
      } else {
        const n2 = Ht(t3);
        e3 = { ...e3, ...n2, mass: Wt }, e3.isResolvedFromDuration = true;
      }
      return e3;
    })({ ...s, velocity: -y(s.velocity || 0) }), y2 = f2 || 0, v2 = d2 / (2 * Math.sqrt(h2 * p2)), w2 = l2 - u2, b2 = y(Math.sqrt(h2 / p2)), T = Math.abs(w2) < 5;
    let x2;
    if (i2 || (i2 = T ? Xt.granular : Xt.default), a2 || (a2 = T ? It.granular : It.default), v2 < 1) {
      const t3 = Jt(b2, v2);
      x2 = (e3) => {
        const n2 = Math.exp(-v2 * b2 * e3);
        return l2 - n2 * ((y2 + v2 * b2 * w2) / t3 * Math.sin(t3 * e3) + w2 * Math.cos(t3 * e3));
      };
    } else if (1 === v2) x2 = (t3) => l2 - Math.exp(-b2 * t3) * (w2 + (y2 + b2 * w2) * t3);
    else {
      const t3 = b2 * Math.sqrt(v2 * v2 - 1);
      x2 = (e3) => {
        const n2 = Math.exp(-v2 * b2 * e3), s2 = Math.min(t3 * e3, 300);
        return l2 - n2 * ((y2 + v2 * b2 * w2) * Math.sinh(s2) + t3 * w2 * Math.cosh(s2)) / t3;
      };
    }
    const M3 = { calculatedDuration: g2 && m || null, next: (t3) => {
      const e3 = x2(t3);
      if (g2) c2.done = t3 >= m;
      else {
        let n2 = 0 === t3 ? y2 : 0;
        v2 < 1 && (n2 = 0 === t3 ? g(y2) : $t(x2, t3, e3));
        const s2 = Math.abs(n2) <= i2, r2 = Math.abs(l2 - e3) <= a2;
        c2.done = s2 && r2;
      }
      return c2.value = c2.done ? l2 : e3, c2;
    }, toString: () => {
      const t3 = Math.min(Vt(M3), Ot), e3 = Ft(((e4) => M3.next(t3 * e4).value), t3, 30);
      return t3 + "ms " + e3;
    }, toTransition: () => {
    } };
    return M3;
  }
  function se({ keyframes: t2, velocity: e2 = 0, power: n2 = 0.8, timeConstant: s = 325, bounceDamping: i2 = 10, bounceStiffness: r2 = 500, modifyTarget: a2, min: o2, max: u2, restDelta: l2 = 0.5, restSpeed: c2 }) {
    const h2 = t2[0], d2 = { done: false, value: h2 }, p2 = (t3) => void 0 === o2 ? u2 : void 0 === u2 || Math.abs(o2 - t3) < Math.abs(u2 - t3) ? o2 : u2;
    let m = n2 * e2;
    const f2 = h2 + m, g2 = void 0 === a2 ? f2 : a2(f2);
    g2 !== f2 && (m = g2 - h2);
    const y2 = (t3) => -m * Math.exp(-t3 / s), v2 = (t3) => g2 + y2(t3), w2 = (t3) => {
      const e3 = y2(t3), n3 = v2(t3);
      d2.done = Math.abs(e3) <= l2, d2.value = d2.done ? g2 : n3;
    };
    let b2, T;
    const x2 = (t3) => {
      var e3;
      (e3 = d2.value, void 0 !== o2 && e3 < o2 || void 0 !== u2 && e3 > u2) && (b2 = t3, T = ne({ keyframes: [d2.value, p2(d2.value)], velocity: $t(v2, t3, d2.value), damping: i2, stiffness: r2, restDelta: l2, restSpeed: c2 }));
    };
    return x2(0), { calculatedDuration: null, next: (t3) => {
      let e3 = false;
      return T || void 0 !== b2 || (e3 = true, w2(t3), x2(t3)), void 0 !== b2 && t3 >= b2 ? T.next(t3 - b2) : (!e3 && w2(t3), d2);
    } };
  }
  function ie(s, r2, { clamp: a2 = true, ease: o2, mixer: c2 } = {}) {
    const h2 = s.length;
    if (o(h2 === r2.length, "Both input and output ranges must be the same length", "range-length"), 1 === h2) return () => r2[0];
    if (2 === h2 && r2[0] === r2[1]) return () => r2[1];
    const d2 = s[0] === s[1];
    s[0] > s[h2 - 1] && (s = [...s].reverse(), r2 = [...r2].reverse());
    const p2 = (function(n2, s2, r3) {
      const a3 = [], o3 = r3 || i.mix || Rt, u2 = n2.length - 1;
      for (let t2 = 0; t2 < u2; t2++) {
        let r4 = o3(n2[t2], n2[t2 + 1]);
        if (s2) {
          const n3 = Array.isArray(s2) ? s2[t2] || h : s2;
          r4 = p(n3, r4);
        }
        a3.push(r4);
      }
      return a3;
    })(r2, o2, c2), m = p2.length, f2 = (t2) => {
      if (d2 && t2 < s[0]) return r2[0];
      let e2 = 0;
      if (m > 1) for (; e2 < s.length - 2 && !(t2 < s[e2 + 1]); e2++) ;
      const n2 = d(s[e2], s[e2 + 1], t2);
      return p2[e2](n2);
    };
    return a2 ? (t2) => f2(e(s[0], s[h2 - 1], t2)) : f2;
  }
  function re(t2, e2) {
    const n2 = t2[t2.length - 1];
    for (let s = 1; s <= e2; s++) {
      const i2 = d(0, e2, s);
      t2.push(yt(n2, 1, i2));
    }
  }
  function ae(t2) {
    const e2 = [0];
    return re(e2, t2.length - 1), e2;
  }
  function oe(t2, e2) {
    return t2.map(((t3) => t3 * e2));
  }
  function ue(t2, e2) {
    return t2.map((() => e2 || E)).splice(0, t2.length - 1);
  }
  function le({ duration: t2 = 300, keyframes: e2, times: n2, ease: s = "easeInOut" }) {
    const i2 = H(s) ? s.map(N) : N(s), r2 = { done: false, value: e2[0] }, a2 = ie(oe(n2 && n2.length === e2.length ? n2 : ae(e2), t2), e2, { ease: Array.isArray(i2) ? i2 : ue(e2, i2) });
    return { calculatedDuration: t2, next: (e3) => (r2.value = a2(e3), r2.done = e3 >= t2, r2) };
  }
  ne.applyToOptions = (t2) => {
    const e2 = Ct(t2, 100, ne);
    return t2.ease = e2.ease, t2.duration = g(e2.duration), t2.type = "keyframes", t2;
  };
  var ce = (t2) => null !== t2;
  function he(t2, { repeat: e2, repeatType: n2 = "loop" }, s, i2 = 1) {
    const r2 = t2.filter(ce), a2 = i2 < 0 || e2 && "loop" !== n2 && e2 % 2 == 1 ? 0 : r2.length - 1;
    return a2 && void 0 !== s ? s : r2[a2];
  }
  var de = { decay: se, inertia: se, tween: le, keyframes: le, spring: ne };
  function pe(t2) {
    "string" == typeof t2.type && (t2.type = de[t2.type]);
  }
  var me = class {
    constructor() {
      this.updateFinished();
    }
    get finished() {
      return this._finished;
    }
    updateFinished() {
      this._finished = new Promise(((t2) => {
        this.resolve = t2;
      }));
    }
    notifyFinished() {
      this.resolve();
    }
    then(t2, e2) {
      return this.finished.then(t2, e2);
    }
  };
  var fe = (t2) => t2 / 100;
  var ge = class extends me {
    constructor(t2) {
      super(), this.state = "idle", this.startTime = null, this.isStopped = false, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
        const { motionValue: t3 } = this.options;
        t3 && t3.updatedAt !== O.now() && this.tick(O.now()), this.isStopped = true, "idle" !== this.state && (this.teardown(), this.options.onStop?.());
      }, V.mainThread++, this.options = t2, this.initAnimation(), this.play(), false === t2.autoplay && this.pause();
    }
    initAnimation() {
      const { options: t2 } = this;
      pe(t2);
      const { type: e2 = le, repeat: n2 = 0, repeatDelay: s = 0, repeatType: r2, velocity: a2 = 0 } = t2;
      let { keyframes: o2 } = t2;
      const u2 = e2 || le;
      u2 !== le && "number" != typeof o2[0] && (this.mixKeyframes = p(fe, Rt(o2[0], o2[1])), o2 = [0, 100]);
      const l2 = u2({ ...t2, keyframes: o2 });
      "mirror" === r2 && (this.mirroredGenerator = u2({ ...t2, keyframes: [...o2].reverse(), velocity: -a2 })), null === l2.calculatedDuration && (l2.calculatedDuration = Vt(l2));
      const { calculatedDuration: c2 } = l2;
      this.calculatedDuration = c2, this.resolvedDuration = c2 + s, this.totalDuration = this.resolvedDuration * (n2 + 1) - s, this.generator = l2;
    }
    updateTime(t2) {
      const e2 = Math.round(t2 - this.startTime) * this.playbackSpeed;
      null !== this.holdTime ? this.currentTime = this.holdTime : this.currentTime = e2;
    }
    tick(t2, e2 = false) {
      const { generator: s, totalDuration: i2, mixKeyframes: r2, mirroredGenerator: a2, resolvedDuration: o2, calculatedDuration: u2 } = this;
      if (null === this.startTime) return s.next(0);
      const { delay: l2 = 0, keyframes: c2, repeat: h2, repeatType: d2, repeatDelay: p2, type: m, onUpdate: f2, finalKeyframe: g2 } = this.options;
      this.speed > 0 ? this.startTime = Math.min(this.startTime, t2) : this.speed < 0 && (this.startTime = Math.min(t2 - i2 / this.speed, this.startTime)), e2 ? this.currentTime = t2 : this.updateTime(t2);
      const y2 = this.currentTime - l2 * (this.playbackSpeed >= 0 ? 1 : -1), v2 = this.playbackSpeed >= 0 ? y2 < 0 : y2 > i2;
      this.currentTime = Math.max(y2, 0), "finished" === this.state && null === this.holdTime && (this.currentTime = i2);
      let w2 = this.currentTime, b2 = s;
      if (h2) {
        const t3 = Math.min(this.currentTime, i2) / o2;
        let e3 = Math.floor(t3), s2 = t3 % 1;
        !s2 && t3 >= 1 && (s2 = 1), 1 === s2 && e3--, e3 = Math.min(e3, h2 + 1);
        Boolean(e3 % 2) && ("reverse" === d2 ? (s2 = 1 - s2, p2 && (s2 -= p2 / o2)) : "mirror" === d2 && (b2 = a2)), w2 = e(0, 1, s2) * o2;
      }
      const T = v2 ? { done: false, value: c2[0] } : b2.next(w2);
      r2 && (T.value = r2(T.value));
      let { done: x2 } = T;
      v2 || null === u2 || (x2 = this.playbackSpeed >= 0 ? this.currentTime >= i2 : this.currentTime <= 0);
      const M3 = null === this.holdTime && ("finished" === this.state || "running" === this.state && x2);
      return M3 && m !== se && (T.value = he(c2, this.options, g2, this.speed)), f2 && f2(T.value), M3 && this.finish(), T;
    }
    then(t2, e2) {
      return this.finished.then(t2, e2);
    }
    get duration() {
      return y(this.calculatedDuration);
    }
    get iterationDuration() {
      const { delay: t2 = 0 } = this.options || {};
      return this.duration + y(t2);
    }
    get time() {
      return y(this.currentTime);
    }
    set time(t2) {
      t2 = g(t2), this.currentTime = t2, null === this.startTime || null !== this.holdTime || 0 === this.playbackSpeed ? this.holdTime = t2 : this.driver && (this.startTime = this.driver.now() - t2 / this.playbackSpeed), this.driver?.start(false);
    }
    get speed() {
      return this.playbackSpeed;
    }
    set speed(t2) {
      this.updateTime(O.now());
      const e2 = this.playbackSpeed !== t2;
      this.playbackSpeed = t2, e2 && (this.time = y(this.currentTime));
    }
    play() {
      if (this.isStopped) return;
      const { driver: t2 = Dt, startTime: e2 } = this.options;
      this.driver || (this.driver = t2(((t3) => this.tick(t3)))), this.options.onPlay?.();
      const n2 = this.driver.now();
      "finished" === this.state ? (this.updateFinished(), this.startTime = n2) : null !== this.holdTime ? this.startTime = n2 - this.holdTime : this.startTime || (this.startTime = e2 ?? n2), "finished" === this.state && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
    }
    pause() {
      this.state = "paused", this.updateTime(O.now()), this.holdTime = this.currentTime;
    }
    complete() {
      "running" !== this.state && this.play(), this.state = "finished", this.holdTime = null;
    }
    finish() {
      this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.();
    }
    cancel() {
      this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
    }
    teardown() {
      this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null, V.mainThread--;
    }
    stopDriver() {
      this.driver && (this.driver.stop(), this.driver = void 0);
    }
    sample(t2) {
      return this.startTime = 0, this.tick(t2, true);
    }
    attachTimeline(t2) {
      return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), t2.observe(this);
    }
  };
  function ve(t2) {
    for (let e2 = 1; e2 < t2.length; e2++) t2[e2] ?? (t2[e2] = t2[e2 - 1]);
  }
  var we = (t2) => 180 * t2 / Math.PI;
  var be = (t2) => {
    const e2 = we(Math.atan2(t2[1], t2[0]));
    return xe(e2);
  };
  var Te = { x: 4, y: 5, translateX: 4, translateY: 5, scaleX: 0, scaleY: 3, scale: (t2) => (Math.abs(t2[0]) + Math.abs(t2[3])) / 2, rotate: be, rotateZ: be, skewX: (t2) => we(Math.atan(t2[1])), skewY: (t2) => we(Math.atan(t2[2])), skew: (t2) => (Math.abs(t2[1]) + Math.abs(t2[2])) / 2 };
  var xe = (t2) => ((t2 %= 360) < 0 && (t2 += 360), t2);
  var Me = (t2) => Math.sqrt(t2[0] * t2[0] + t2[1] * t2[1]);
  var ke = (t2) => Math.sqrt(t2[4] * t2[4] + t2[5] * t2[5]);
  var Ae = { x: 12, y: 13, z: 14, translateX: 12, translateY: 13, translateZ: 14, scaleX: Me, scaleY: ke, scale: (t2) => (Me(t2) + ke(t2)) / 2, rotateX: (t2) => xe(we(Math.atan2(t2[6], t2[5]))), rotateY: (t2) => xe(we(Math.atan2(-t2[2], t2[0]))), rotateZ: be, rotate: be, skewX: (t2) => we(Math.atan(t2[4])), skewY: (t2) => we(Math.atan(t2[1])), skew: (t2) => (Math.abs(t2[1]) + Math.abs(t2[4])) / 2 };
  function Se(t2) {
    return t2.includes("scale") ? 1 : 0;
  }
  function Ee(t2, e2) {
    if (!t2 || "none" === t2) return Se(e2);
    const n2 = t2.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
    let s, i2;
    if (n2) s = Ae, i2 = n2;
    else {
      const e3 = t2.match(/^matrix\(([-\d.e\s,]+)\)$/u);
      s = Te, i2 = e3;
    }
    if (!i2) return Se(e2);
    const r2 = s[e2], a2 = i2[1].split(",").map(Re);
    return "function" == typeof r2 ? r2(a2) : a2[r2];
  }
  var Pe = (t2, e2) => {
    const { transform: n2 = "none" } = getComputedStyle(t2);
    return Ee(n2, e2);
  };
  function Re(t2) {
    return parseFloat(t2.trim());
  }
  var De = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"];
  var Fe = (() => new Set(De))();
  var Oe = (t2) => t2 === B2 || t2 === Q;
  var Ve = /* @__PURE__ */ new Set(["x", "y", "z"]);
  var Ce = De.filter(((t2) => !Ve.has(t2)));
  var $e = { width: ({ x: t2 }, { paddingLeft: e2 = "0", paddingRight: n2 = "0" }) => t2.max - t2.min - parseFloat(e2) - parseFloat(n2), height: ({ y: t2 }, { paddingTop: e2 = "0", paddingBottom: n2 = "0" }) => t2.max - t2.min - parseFloat(e2) - parseFloat(n2), top: (t2, { top: e2 }) => parseFloat(e2), left: (t2, { left: e2 }) => parseFloat(e2), bottom: ({ y: t2 }, { top: e2 }) => parseFloat(e2) + (t2.max - t2.min), right: ({ x: t2 }, { left: e2 }) => parseFloat(e2) + (t2.max - t2.min), x: (t2, { transform: e2 }) => Ee(e2, "x"), y: (t2, { transform: e2 }) => Ee(e2, "y") };
  $e.translateX = $e.x, $e.translateY = $e.y;
  var Ke = /* @__PURE__ */ new Set();
  var Le = false;
  var We = false;
  var Be = false;
  function je() {
    if (We) {
      const t2 = Array.from(Ke).filter(((t3) => t3.needsMeasurement)), e2 = new Set(t2.map(((t3) => t3.element))), n2 = /* @__PURE__ */ new Map();
      e2.forEach(((t3) => {
        const e3 = (function(t4) {
          const e4 = [];
          return Ce.forEach(((n3) => {
            const s = t4.getValue(n3);
            void 0 !== s && (e4.push([n3, s.get()]), s.set(n3.startsWith("scale") ? 1 : 0));
          })), e4;
        })(t3);
        e3.length && (n2.set(t3, e3), t3.render());
      })), t2.forEach(((t3) => t3.measureInitialState())), e2.forEach(((t3) => {
        t3.render();
        const e3 = n2.get(t3);
        e3 && e3.forEach((([e4, n3]) => {
          t3.getValue(e4)?.set(n3);
        }));
      })), t2.forEach(((t3) => t3.measureEndState())), t2.forEach(((t3) => {
        void 0 !== t3.suspendedScrollY && window.scrollTo(0, t3.suspendedScrollY);
      }));
    }
    We = false, Le = false, Ke.forEach(((t2) => t2.complete(Be))), Ke.clear();
  }
  function Ne() {
    Ke.forEach(((t2) => {
      t2.readKeyframes(), t2.needsMeasurement && (We = true);
    }));
  }
  function Ye() {
    Be = true, Ne(), je(), Be = false;
  }
  var Xe = class {
    constructor(t2, e2, n2, s, i2, r2 = false) {
      this.state = "pending", this.isAsync = false, this.needsMeasurement = false, this.unresolvedKeyframes = [...t2], this.onComplete = e2, this.name = n2, this.motionValue = s, this.element = i2, this.isAsync = r2;
    }
    scheduleResolve() {
      this.state = "scheduled", this.isAsync ? (Ke.add(this), Le || (Le = true, S2.read(Ne), S2.resolveKeyframes(je))) : (this.readKeyframes(), this.complete());
    }
    readKeyframes() {
      const { unresolvedKeyframes: t2, name: e2, element: n2, motionValue: s } = this;
      if (null === t2[0]) {
        const i2 = s?.get(), r2 = t2[t2.length - 1];
        if (void 0 !== i2) t2[0] = i2;
        else if (n2 && e2) {
          const s2 = n2.readValue(e2, r2);
          null != s2 && (t2[0] = s2);
        }
        void 0 === t2[0] && (t2[0] = r2), s && void 0 === i2 && s.set(t2[0]);
      }
      ve(t2);
    }
    setFinalKeyframe() {
    }
    measureInitialState() {
    }
    renderEndStyles() {
    }
    measureEndState() {
    }
    complete(t2 = false) {
      this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t2), Ke.delete(this);
    }
    cancel() {
      "scheduled" === this.state && (Ke.delete(this), this.state = "pending");
    }
    resume() {
      "pending" === this.state && this.scheduleResolve();
    }
  };
  var Ie = (t2) => t2.startsWith("--");
  function ze(t2, e2, n2) {
    Ie(e2) ? t2.style.setProperty(e2, n2) : t2.style[e2] = n2;
  }
  var Ue = f((() => void 0 !== window.ScrollTimeline));
  var qe = {};
  function Ze(t2, e2) {
    const n2 = f(t2);
    return () => qe[e2] ?? n2();
  }
  var _e = Ze((() => {
    try {
      document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch (t2) {
      return false;
    }
    return true;
  }), "linearEasing");
  var He = ([t2, e2, n2, s]) => `cubic-bezier(${t2}, ${e2}, ${n2}, ${s})`;
  var Ge = { linear: "linear", ease: "ease", easeIn: "ease-in", easeOut: "ease-out", easeInOut: "ease-in-out", circIn: He([0, 0.65, 0.55, 1]), circOut: He([0.55, 0, 1, 0.45]), backIn: He([0.31, 0.01, 0.66, -0.59]), backOut: He([0.33, 1.53, 0.69, 0.99]) };
  function Je(t2, e2) {
    return t2 ? "function" == typeof t2 ? _e() ? Ft(t2, e2) : "ease-out" : K(t2) ? He(t2) : Array.isArray(t2) ? t2.map(((t3) => Je(t3, e2) || Ge.easeOut)) : Ge[t2] : void 0;
  }
  function Qe(t2, e2, n2, { delay: s = 0, duration: i2 = 300, repeat: r2 = 0, repeatType: a2 = "loop", ease: o2 = "easeOut", times: u2 } = {}, l2 = void 0) {
    const c2 = { [e2]: n2 };
    u2 && (c2.offset = u2);
    const h2 = Je(o2, i2);
    Array.isArray(h2) && (c2.easing = h2), k2.value && V.waapi++;
    const d2 = { delay: s, duration: i2, easing: Array.isArray(h2) ? "linear" : h2, fill: "both", iterations: r2 + 1, direction: "reverse" === a2 ? "alternate" : "normal" };
    l2 && (d2.pseudoElement = l2);
    const p2 = t2.animate(c2, d2);
    return k2.value && p2.finished.finally((() => {
      V.waapi--;
    })), p2;
  }
  function tn(t2) {
    return "function" == typeof t2 && "applyToOptions" in t2;
  }
  function en({ type: t2, ...e2 }) {
    return tn(t2) && _e() ? t2.applyToOptions(e2) : (e2.duration ?? (e2.duration = 300), e2.ease ?? (e2.ease = "easeOut"), e2);
  }
  var nn = class extends me {
    constructor(t2) {
      if (super(), this.finishedTime = null, this.isStopped = false, !t2) return;
      const { element: e2, name: n2, keyframes: s, pseudoElement: i2, allowFlatten: r2 = false, finalKeyframe: a2, onComplete: o2 } = t2;
      this.isPseudoElement = Boolean(i2), this.allowFlatten = r2, this.options = t2, o("string" != typeof t2.type, `Mini animate() doesn't support "type" as a string.`, "mini-spring");
      const l2 = en(t2);
      this.animation = Qe(e2, n2, s, l2, i2), false === l2.autoplay && this.animation.pause(), this.animation.onfinish = () => {
        if (this.finishedTime = this.time, !i2) {
          const t3 = he(s, this.options, a2, this.speed);
          this.updateMotionValue ? this.updateMotionValue(t3) : ze(e2, n2, t3), this.animation.cancel();
        }
        o2?.(), this.notifyFinished();
      };
    }
    play() {
      this.isStopped || (this.animation.play(), "finished" === this.state && this.updateFinished());
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.finish?.();
    }
    cancel() {
      try {
        this.animation.cancel();
      } catch (t2) {
      }
    }
    stop() {
      if (this.isStopped) return;
      this.isStopped = true;
      const { state: t2 } = this;
      "idle" !== t2 && "finished" !== t2 && (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
    }
    commitStyles() {
      this.isPseudoElement || this.animation.commitStyles?.();
    }
    get duration() {
      const t2 = this.animation.effect?.getComputedTiming?.().duration || 0;
      return y(Number(t2));
    }
    get iterationDuration() {
      const { delay: t2 = 0 } = this.options || {};
      return this.duration + y(t2);
    }
    get time() {
      return y(Number(this.animation.currentTime) || 0);
    }
    set time(t2) {
      this.finishedTime = null, this.animation.currentTime = g(t2);
    }
    get speed() {
      return this.animation.playbackRate;
    }
    set speed(t2) {
      t2 < 0 && (this.finishedTime = null), this.animation.playbackRate = t2;
    }
    get state() {
      return null !== this.finishedTime ? "finished" : this.animation.playState;
    }
    get startTime() {
      return Number(this.animation.startTime);
    }
    set startTime(t2) {
      this.animation.startTime = t2;
    }
    attachTimeline({ timeline: t2, observe: n2 }) {
      return this.allowFlatten && this.animation.effect?.updateTiming({ easing: "linear" }), this.animation.onfinish = null, t2 && Ue() ? (this.animation.timeline = t2, h) : n2(this);
    }
  };
  var sn = { anticipate: z, backInOut: j, circInOut: B };
  function rn(t2) {
    "string" == typeof t2.ease && t2.ease in sn && (t2.ease = sn[t2.ease]);
  }
  var an = class extends nn {
    constructor(t2) {
      rn(t2), pe(t2), super(t2), t2.startTime && (this.startTime = t2.startTime), this.options = t2;
    }
    updateMotionValue(t2) {
      const { motionValue: e2, onUpdate: n2, onComplete: s, element: i2, ...r2 } = this.options;
      if (!e2) return;
      if (void 0 !== t2) return void e2.set(t2);
      const a2 = new ge({ ...r2, autoplay: false }), u2 = g(this.finishedTime ?? this.time);
      e2.setWithVelocity(a2.sample(u2 - 10).value, a2.sample(u2).value, 10), a2.stop();
    }
  };
  var on = (t2, e2) => "zIndex" !== e2 && (!("number" != typeof t2 && !Array.isArray(t2)) || !("string" != typeof t2 || !pt.test(t2) && "0" !== t2 || t2.startsWith("url(")));
  function un(t2) {
    t2.duration = 0, t2.type = "keyframes";
  }
  var ln = /* @__PURE__ */ new Set(["opacity", "clipPath", "filter", "transform"]);
  var cn = f((() => Object.hasOwnProperty.call(Element.prototype, "animate")));
  function hn(t2) {
    const { motionValue: e2, name: n2, repeatDelay: s, repeatType: i2, damping: r2, type: a2 } = t2, o2 = e2?.owner?.current;
    if (!(o2 instanceof HTMLElement)) return false;
    const { onUpdate: u2, transformTemplate: l2 } = e2.owner.getProps();
    return cn() && n2 && ln.has(n2) && ("transform" !== n2 || !l2) && !u2 && !s && "mirror" !== i2 && 0 !== r2 && "inertia" !== a2;
  }
  var dn = class extends me {
    constructor({ autoplay: t2 = true, delay: e2 = 0, type: n2 = "keyframes", repeat: s = 0, repeatDelay: i2 = 0, repeatType: r2 = "loop", keyframes: a2, name: o2, motionValue: u2, element: l2, ...c2 }) {
      super(), this.stop = () => {
        this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
      }, this.createdAt = O.now();
      const h2 = { autoplay: t2, delay: e2, type: n2, repeat: s, repeatDelay: i2, repeatType: r2, name: o2, motionValue: u2, element: l2, ...c2 }, d2 = l2?.KeyframeResolver || Xe;
      this.keyframeResolver = new d2(a2, ((t3, e3, n3) => this.onKeyframesResolved(t3, e3, h2, !n3)), o2, u2, l2), this.keyframeResolver?.scheduleResolve();
    }
    onKeyframesResolved(n2, i2, r2, a2) {
      this.keyframeResolver = void 0;
      const { name: o2, type: u2, velocity: l2, delay: c2, isHandoff: h2, onUpdate: d2 } = r2;
      this.resolvedAt = O.now(), (function(t2, e2, n3, i3) {
        const r3 = t2[0];
        if (null === r3) return false;
        if ("display" === e2 || "visibility" === e2) return true;
        const a3 = t2[t2.length - 1], o3 = on(r3, e2), u3 = on(a3, e2);
        return r(o3 === u3, `You are trying to animate ${e2} from "${r3}" to "${a3}". "${o3 ? a3 : r3}" is not an animatable value.`, "value-not-animatable"), !(!o3 || !u3) && ((function(t3) {
          const e3 = t3[0];
          if (1 === t3.length) return true;
          for (let n4 = 0; n4 < t3.length; n4++) if (t3[n4] !== e3) return true;
        })(t2) || ("spring" === n3 || tn(n3)) && i3);
      })(n2, o2, u2, l2) || (!i.instantAnimations && c2 || d2?.(he(n2, r2, i2)), n2[0] = n2[n2.length - 1], un(r2), r2.repeat = 0);
      const p2 = { startTime: a2 ? this.resolvedAt && this.resolvedAt - this.createdAt > 40 ? this.resolvedAt : this.createdAt : void 0, finalKeyframe: i2, ...r2, keyframes: n2 }, m = !h2 && hn(p2) ? new an({ ...p2, element: p2.motionValue.owner.current }) : new ge(p2);
      m.finished.then((() => this.notifyFinished())).catch(h), this.pendingTimeline && (this.stopTimeline = m.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = m;
    }
    get finished() {
      return this._animation ? this.animation.finished : this._finished;
    }
    then(t2, e2) {
      return this.finished.finally(t2).then((() => {
      }));
    }
    get animation() {
      return this._animation || (this.keyframeResolver?.resume(), Ye()), this._animation;
    }
    get duration() {
      return this.animation.duration;
    }
    get iterationDuration() {
      return this.animation.iterationDuration;
    }
    get time() {
      return this.animation.time;
    }
    set time(t2) {
      this.animation.time = t2;
    }
    get speed() {
      return this.animation.speed;
    }
    get state() {
      return this.animation.state;
    }
    set speed(t2) {
      this.animation.speed = t2;
    }
    get startTime() {
      return this.animation.startTime;
    }
    attachTimeline(t2) {
      return this._animation ? this.stopTimeline = this.animation.attachTimeline(t2) : this.pendingTimeline = t2, () => this.stop();
    }
    play() {
      this.animation.play();
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.complete();
    }
    cancel() {
      this._animation && this.animation.cancel(), this.keyframeResolver?.cancel();
    }
  };
  var pn = class {
    constructor(t2) {
      this.stop = () => this.runAll("stop"), this.animations = t2.filter(Boolean);
    }
    get finished() {
      return Promise.all(this.animations.map(((t2) => t2.finished)));
    }
    getAll(t2) {
      return this.animations[0][t2];
    }
    setAll(t2, e2) {
      for (let n2 = 0; n2 < this.animations.length; n2++) this.animations[n2][t2] = e2;
    }
    attachTimeline(t2) {
      const e2 = this.animations.map(((e3) => e3.attachTimeline(t2)));
      return () => {
        e2.forEach(((t3, e3) => {
          t3 && t3(), this.animations[e3].stop();
        }));
      };
    }
    get time() {
      return this.getAll("time");
    }
    set time(t2) {
      this.setAll("time", t2);
    }
    get speed() {
      return this.getAll("speed");
    }
    set speed(t2) {
      this.setAll("speed", t2);
    }
    get state() {
      return this.getAll("state");
    }
    get startTime() {
      return this.getAll("startTime");
    }
    get duration() {
      return mn(this.animations, "duration");
    }
    get iterationDuration() {
      return mn(this.animations, "iterationDuration");
    }
    runAll(t2) {
      this.animations.forEach(((e2) => e2[t2]()));
    }
    play() {
      this.runAll("play");
    }
    pause() {
      this.runAll("pause");
    }
    cancel() {
      this.runAll("cancel");
    }
    complete() {
      this.runAll("complete");
    }
  };
  function mn(t2, e2) {
    let n2 = 0;
    for (let s = 0; s < t2.length; s++) {
      const i2 = t2[s][e2];
      null !== i2 && i2 > n2 && (n2 = i2);
    }
    return n2;
  }
  var fn = class extends pn {
    then(t2, e2) {
      return this.finished.finally(t2).then((() => {
      }));
    }
  };
  var bn = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
  function Tn(t2) {
    const e2 = bn.exec(t2);
    if (!e2) return [,];
    const [, n2, s, i2] = e2;
    return [`--${n2 ?? s}`, i2];
  }
  function xn(t2, e2, n2 = 1) {
    o(n2 <= 4, `Max CSS variable fallback depth detected in property "${t2}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
    const [s, i2] = Tn(t2);
    if (!s) return;
    const r2 = window.getComputedStyle(e2).getPropertyValue(s);
    if (r2) {
      const t3 = r2.trim();
      return c(t3) ? parseFloat(t3) : t3;
    }
    return L2(i2) ? xn(i2, e2, n2 + 1) : i2;
  }
  function Mn(t2, e2) {
    return t2?.[e2] ?? t2?.default ?? t2;
  }
  var kn = /* @__PURE__ */ new Set(["width", "height", "top", "left", "right", "bottom", ...De]);
  var An = (t2) => (e2) => e2.test(t2);
  var Sn = [B2, Q, J2, G, et, tt, { test: (t2) => "auto" === t2, parse: (t2) => t2 }];
  var En = (t2) => Sn.find(An(t2));
  var Pn = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
  function Rn(t2) {
    const [e2, n2] = t2.slice(0, -1).split("(");
    if ("drop-shadow" === e2) return t2;
    const [s] = n2.match(X) || [];
    if (!s) return t2;
    const i2 = n2.replace(s, "");
    let r2 = Pn.has(e2) ? 1 : 0;
    return s !== n2 && (r2 *= 100), e2 + "(" + r2 + i2 + ")";
  }
  var Dn = /\b([a-z-]*)\(.*?\)/gu;
  var Fn = { ...pt, getAnimatableNone: (t2) => {
    const e2 = t2.match(Dn);
    return e2 ? e2.map(Rn).join(" ") : t2;
  } };
  var On = { ...B2, transform: Math.round };
  var Vn = { rotate: G, rotateX: G, rotateY: G, rotateZ: G, scale: N2, scaleX: N2, scaleY: N2, scaleZ: N2, skew: G, skewX: G, skewY: G, distance: Q, translateX: Q, translateY: Q, translateZ: Q, x: Q, y: Q, z: Q, perspective: Q, transformPerspective: Q, opacity: j2, originX: nt, originY: nt, originZ: Q };
  var Cn = { borderWidth: Q, borderTopWidth: Q, borderRightWidth: Q, borderBottomWidth: Q, borderLeftWidth: Q, borderRadius: Q, radius: Q, borderTopLeftRadius: Q, borderTopRightRadius: Q, borderBottomRightRadius: Q, borderBottomLeftRadius: Q, width: Q, maxWidth: Q, height: Q, maxHeight: Q, top: Q, right: Q, bottom: Q, left: Q, padding: Q, paddingTop: Q, paddingRight: Q, paddingBottom: Q, paddingLeft: Q, margin: Q, marginTop: Q, marginRight: Q, marginBottom: Q, marginLeft: Q, backgroundPositionX: Q, backgroundPositionY: Q, ...Vn, zIndex: On, fillOpacity: j2, strokeOpacity: j2, numOctaves: On };
  var $n = { ...Cn, color: it, backgroundColor: it, outlineColor: it, fill: it, stroke: it, borderColor: it, borderTopColor: it, borderRightColor: it, borderBottomColor: it, borderLeftColor: it, filter: Fn, WebkitFilter: Fn };
  var Kn = (t2) => $n[t2];
  function Ln(t2, e2) {
    let n2 = Kn(t2);
    return n2 !== Fn && (n2 = pt), n2.getAnimatableNone ? n2.getAnimatableNone(e2) : void 0;
  }
  var Wn = /* @__PURE__ */ new Set(["auto", "none", "0"]);
  var Bn = class extends Xe {
    constructor(t2, e2, n2, s, i2) {
      super(t2, e2, n2, s, i2, true);
    }
    readKeyframes() {
      const { unresolvedKeyframes: t2, element: e2, name: n2 } = this;
      if (!e2 || !e2.current) return;
      super.readKeyframes();
      for (let n3 = 0; n3 < t2.length; n3++) {
        let s2 = t2[n3];
        if ("string" == typeof s2 && (s2 = s2.trim(), L2(s2))) {
          const i3 = xn(s2, e2.current);
          void 0 !== i3 && (t2[n3] = i3), n3 === t2.length - 1 && (this.finalKeyframe = s2);
        }
      }
      if (this.resolveNoneKeyframes(), !kn.has(n2) || 2 !== t2.length) return;
      const [s, i2] = t2, r2 = En(s), a2 = En(i2);
      if (r2 !== a2) if (Oe(r2) && Oe(a2)) for (let e3 = 0; e3 < t2.length; e3++) {
        const n3 = t2[e3];
        "string" == typeof n3 && (t2[e3] = parseFloat(n3));
      }
      else $e[n2] && (this.needsMeasurement = true);
    }
    resolveNoneKeyframes() {
      const { unresolvedKeyframes: t2, name: e2 } = this, n2 = [];
      for (let e3 = 0; e3 < t2.length; e3++) (null === t2[e3] || ("number" == typeof (s = t2[e3]) ? 0 === s : null === s || "none" === s || "0" === s || a(s))) && n2.push(e3);
      var s;
      n2.length && (function(t3, e3, n3) {
        let s2, i2 = 0;
        for (; i2 < t3.length && !s2; ) {
          const e4 = t3[i2];
          "string" == typeof e4 && !Wn.has(e4) && lt(e4).values.length && (s2 = t3[i2]), i2++;
        }
        if (s2 && n3) for (const i3 of e3) t3[i3] = Ln(n3, s2);
      })(t2, n2, e2);
    }
    measureInitialState() {
      const { element: t2, unresolvedKeyframes: e2, name: n2 } = this;
      if (!t2 || !t2.current) return;
      "height" === n2 && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = $e[n2](t2.measureViewportBox(), window.getComputedStyle(t2.current)), e2[0] = this.measuredOrigin;
      const s = e2[e2.length - 1];
      void 0 !== s && t2.getValue(n2, s).jump(s, false);
    }
    measureEndState() {
      const { element: t2, name: e2, unresolvedKeyframes: n2 } = this;
      if (!t2 || !t2.current) return;
      const s = t2.getValue(e2);
      s && s.jump(this.measuredOrigin, false);
      const i2 = n2.length - 1, r2 = n2[i2];
      n2[i2] = $e[e2](t2.measureViewportBox(), window.getComputedStyle(t2.current)), null !== r2 && void 0 === this.finalKeyframe && (this.finalKeyframe = r2), this.removedTransforms?.length && this.removedTransforms.forEach((([e3, n3]) => {
        t2.getValue(e3).set(n3);
      })), this.resolveNoneKeyframes();
    }
  };
  var Xn = f((() => {
    try {
      document.createElement("div").animate({ opacity: [1] });
    } catch (t2) {
      return false;
    }
    return true;
  }));
  function zn(t2, e2, n2) {
    if (t2 instanceof EventTarget) return [t2];
    if ("string" == typeof t2) {
      let s = document;
      e2 && (s = e2.current);
      const i2 = n2?.[t2] ?? s.querySelectorAll(t2);
      return i2 ? Array.from(i2) : [];
    }
    return Array.from(t2);
  }
  function Un(t2) {
    return (e2, n2) => {
      const s = zn(e2), i2 = [];
      for (const e3 of s) {
        const s2 = t2(e3, n2);
        i2.push(s2);
      }
      return () => {
        for (const t3 of i2) t3();
      };
    };
  }
  var qn = (t2, e2) => e2 && "number" == typeof t2 ? e2.transform(t2) : t2;
  var Zn = class {
    constructor() {
      this.latest = {}, this.values = /* @__PURE__ */ new Map();
    }
    set(t2, e2, n2, s, i2 = true) {
      const r2 = this.values.get(t2);
      r2 && r2.onRemove();
      const a2 = () => {
        const s2 = e2.get();
        this.latest[t2] = i2 ? qn(s2, Cn[t2]) : s2, n2 && S2.render(n2);
      };
      a2();
      const o2 = e2.on("change", a2);
      s && e2.addDependent(s);
      const u2 = () => {
        o2(), n2 && E2(n2), this.values.delete(t2), s && e2.removeDependent(s);
      };
      return this.values.set(t2, { value: e2, onRemove: u2 }), u2;
    }
    get(t2) {
      return this.values.get(t2)?.value;
    }
    destroy() {
      for (const t2 of this.values.values()) t2.onRemove();
    }
  };
  function _n(t2) {
    const e2 = /* @__PURE__ */ new WeakMap(), n2 = [];
    return (s, i2) => {
      const r2 = e2.get(s) ?? new Zn();
      e2.set(s, r2);
      for (const e3 in i2) {
        const a2 = i2[e3], o2 = t2(s, r2, e3, a2);
        n2.push(o2);
      }
      return () => {
        for (const t3 of n2) t3();
      };
    };
  }
  var Hn = (t2, e2, n2, s) => {
    const i2 = (function(t3, e3) {
      if (!(e3 in t3)) return false;
      const n3 = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(t3), e3) || Object.getOwnPropertyDescriptor(t3, e3);
      return n3 && "function" == typeof n3.set;
    })(t2, n2), r2 = i2 ? n2 : n2.startsWith("data") || n2.startsWith("aria") ? n2.replace(/([A-Z])/g, ((t3) => `-${t3.toLowerCase()}`)) : n2;
    const a2 = i2 ? () => {
      t2[r2] = e2.latest[n2];
    } : () => {
      const s2 = e2.latest[n2];
      null == s2 ? t2.removeAttribute(r2) : t2.setAttribute(r2, String(s2));
    };
    return e2.set(n2, s, a2);
  };
  var Gn = Un(_n(Hn));
  var Jn = _n(((t2, e2, n2, s) => e2.set(n2, s, (() => {
    t2[n2] = e2.latest[n2];
  }), void 0, false)));
  function Qn(t2) {
    return u(t2) && "offsetHeight" in t2;
  }
  var ts = { current: void 0 };
  var es = class {
    constructor(t2, e2 = {}) {
      this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (t3) => {
        const e3 = O.now();
        if (this.updatedAt !== e3 && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(t3), this.current !== this.prev && (this.events.change?.notify(this.current), this.dependents)) for (const t4 of this.dependents) t4.dirty();
      }, this.hasAnimated = false, this.setCurrent(t2), this.owner = e2.owner;
    }
    setCurrent(t2) {
      var e2;
      this.current = t2, this.updatedAt = O.now(), null === this.canTrackVelocity && void 0 !== t2 && (this.canTrackVelocity = (e2 = this.current, !isNaN(parseFloat(e2))));
    }
    setPrevFrameValue(t2 = this.current) {
      this.prevFrameValue = t2, this.prevUpdatedAt = this.updatedAt;
    }
    onChange(t2) {
      return this.on("change", t2);
    }
    on(t2, e2) {
      this.events[t2] || (this.events[t2] = new b());
      const n2 = this.events[t2].add(e2);
      return "change" === t2 ? () => {
        n2(), S2.read((() => {
          this.events.change.getSize() || this.stop();
        }));
      } : n2;
    }
    clearListeners() {
      for (const t2 in this.events) this.events[t2].clear();
    }
    attach(t2, e2) {
      this.passiveEffect = t2, this.stopPassiveEffect = e2;
    }
    set(t2) {
      this.passiveEffect ? this.passiveEffect(t2, this.updateAndNotify) : this.updateAndNotify(t2);
    }
    setWithVelocity(t2, e2, n2) {
      this.set(e2), this.prev = void 0, this.prevFrameValue = t2, this.prevUpdatedAt = this.updatedAt - n2;
    }
    jump(t2, e2 = true) {
      this.updateAndNotify(t2), this.prev = t2, this.prevUpdatedAt = this.prevFrameValue = void 0, e2 && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
    }
    dirty() {
      this.events.change?.notify(this.current);
    }
    addDependent(t2) {
      this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(t2);
    }
    removeDependent(t2) {
      this.dependents && this.dependents.delete(t2);
    }
    get() {
      return ts.current && ts.current.push(this), this.current;
    }
    getPrevious() {
      return this.prev;
    }
    getVelocity() {
      const t2 = O.now();
      if (!this.canTrackVelocity || void 0 === this.prevFrameValue || t2 - this.updatedAt > 30) return 0;
      const e2 = Math.min(this.updatedAt - this.prevUpdatedAt, 30);
      return M(parseFloat(this.current) - parseFloat(this.prevFrameValue), e2);
    }
    start(t2) {
      return this.stop(), new Promise(((e2) => {
        this.hasAnimated = true, this.animation = t2(e2), this.events.animationStart && this.events.animationStart.notify();
      })).then((() => {
        this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
      }));
    }
    stop() {
      this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
    }
    isAnimating() {
      return !!this.animation;
    }
    clearAnimation() {
      delete this.animation;
    }
    destroy() {
      this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
    }
  };
  function ns(t2, e2) {
    return new es(t2, e2);
  }
  var ss = { x: "translateX", y: "translateY", z: "translateZ", transformPerspective: "perspective" };
  var is = /* @__PURE__ */ new Set(["originX", "originY", "originZ"]);
  var rs = (t2, e2, n2, s) => {
    let i2, r2;
    return Fe.has(n2) ? (e2.get("transform") || (Qn(t2) || e2.get("transformBox") || rs(t2, e2, "transformBox", new es("fill-box")), e2.set("transform", new es("none"), (() => {
      t2.style.transform = (function(t3) {
        let e3 = "", n3 = true;
        for (let s2 = 0; s2 < De.length; s2++) {
          const i3 = De[s2], r3 = t3.latest[i3];
          if (void 0 === r3) continue;
          let a2 = true;
          a2 = "number" == typeof r3 ? r3 === (i3.startsWith("scale") ? 1 : 0) : 0 === parseFloat(r3), a2 || (n3 = false, e3 += `${ss[i3] || i3}(${t3.latest[i3]}) `);
        }
        return n3 ? "none" : e3.trim();
      })(e2);
    }))), r2 = e2.get("transform")) : is.has(n2) ? (e2.get("transformOrigin") || e2.set("transformOrigin", new es(""), (() => {
      const n3 = e2.latest.originX ?? "50%", s2 = e2.latest.originY ?? "50%", i3 = e2.latest.originZ ?? 0;
      t2.style.transformOrigin = `${n3} ${s2} ${i3}`;
    })), r2 = e2.get("transformOrigin")) : i2 = Ie(n2) ? () => {
      t2.style.setProperty(n2, e2.latest[n2]);
    } : () => {
      t2.style[n2] = e2.latest[n2];
    }, e2.set(n2, s, i2, r2);
  };
  var as = Un(_n(rs));
  var os = Q.transform;
  var us = Un(_n(((t2, e2, n2, s) => {
    if (n2.startsWith("path")) return (function(t3, e3, n3, s2) {
      return S2.render((() => t3.setAttribute("pathLength", "1"))), "pathOffset" === n3 ? e3.set(n3, s2, (() => t3.setAttribute("stroke-dashoffset", os(-e3.latest[n3])))) : (e3.get("stroke-dasharray") || e3.set("stroke-dasharray", new es("1 1"), (() => {
        const { pathLength: n4 = 1, pathSpacing: s3 } = e3.latest;
        t3.setAttribute("stroke-dasharray", `${os(n4)} ${os(s3 ?? 1 - Number(n4))}`);
      })), e3.set(n3, s2, void 0, e3.get("stroke-dasharray")));
    })(t2, e2, n2, s);
    if (n2.startsWith("attr")) return Hn(t2, e2, (function(t3) {
      return t3.replace(/^attr([A-Z])/, ((t4, e3) => e3.toLowerCase()));
    })(n2), s);
    return (n2 in t2.style ? rs : Hn)(t2, e2, n2, s);
  })));
  var { schedule: ls, cancel: cs } = A2(queueMicrotask, false);
  function Ss(t2) {
    return u(t2) && "ownerSVGElement" in t2;
  }
  var Rs = (t2, e2, n2) => (s, i2) => i2 && i2[0] ? i2[0][t2 + "Size"] : Ss(s) && "getBBox" in s ? s.getBBox()[e2] : s[n2];
  var Ds = Rs("inline", "width", "offsetWidth");
  var Fs = Rs("block", "height", "offsetHeight");
  function qs(t2) {
    return Ss(t2) && "svg" === t2.tagName;
  }
  var Qs = (t2) => Boolean(t2 && t2.getVelocity);
  var ii = [...Sn, it, pt];
  var ri = (t2) => ii.find(An(t2));
  var Ai = M2.reduce(((t2, e2) => (t2[e2] = (t3) => E2(t3), t2)), {});

  // vendor/motion.js
  function ot2(t2) {
    return "object" == typeof t2 && !Array.isArray(t2);
  }
  function it2(e2, n2, s, r2) {
    return "string" == typeof e2 && ot2(n2) ? zn(e2, s, r2) : e2 instanceof NodeList ? Array.from(e2) : Array.isArray(e2) ? e2 : [e2];
  }
  function at2(t2, e2, n2) {
    return t2 * (e2 + 1);
  }
  function lt2(t2, e2, n2, s) {
    return "number" == typeof e2 ? e2 : e2.startsWith("-") || e2.startsWith("+") ? Math.max(0, t2 + parseFloat(e2)) : "<" === e2 ? n2 : e2.startsWith("<") ? Math.max(0, n2 + parseFloat(e2.slice(1))) : s.get(e2) ?? t2;
  }
  function ut2(t2, n2, s, r2, o2, i2) {
    !(function(t3, e2, n3) {
      for (let s2 = 0; s2 < t3.length; s2++) {
        const r3 = t3[s2];
        r3.at > e2 && r3.at < n3 && (n(t3, r3), s2--);
      }
    })(t2, o2, i2);
    for (let a2 = 0; a2 < n2.length; a2++) t2.push({ value: n2[a2], at: yt(o2, i2, r2[a2]), easing: J(s, a2) });
  }
  function ct2(t2, e2) {
    for (let n2 = 0; n2 < t2.length; n2++) t2[n2] = t2[n2] / (e2 + 1);
  }
  function ht2(t2, e2) {
    return t2.at === e2.at ? null === t2.value ? 1 : null === e2.value ? -1 : 0 : t2.at - e2.at;
  }
  function ft2(t2, e2) {
    return !e2.has(t2) && e2.set(t2, {}), e2.get(t2);
  }
  function pt2(t2, e2) {
    return e2[t2] || (e2[t2] = []), e2[t2];
  }
  function dt2(t2) {
    return Array.isArray(t2) ? t2 : [t2];
  }
  function mt2(t2, e2) {
    return t2 && t2[e2] ? { ...t2, ...t2[e2] } : { ...t2 };
  }
  var gt2 = (t2) => "number" == typeof t2;
  var yt2 = (t2) => t2.every(gt2);
  var vt2 = /* @__PURE__ */ new WeakMap();
  function wt2(t2) {
    const e2 = [{}, {}];
    return t2?.values.forEach(((t3, n2) => {
      e2[0][n2] = t3.get(), e2[1][n2] = t3.getVelocity();
    })), e2;
  }
  function Vt2(t2, e2, n2, s) {
    if ("function" == typeof e2) {
      const [r2, o2] = wt2(s);
      e2 = e2(void 0 !== n2 ? n2 : t2.custom, r2, o2);
    }
    if ("string" == typeof e2 && (e2 = t2.variants && t2.variants[e2]), "function" == typeof e2) {
      const [r2, o2] = wt2(s);
      e2 = e2(void 0 !== n2 ? n2 : t2.custom, r2, o2);
    }
    return e2;
  }
  function xt2(t2, e2, n2) {
    t2.hasValue(e2) ? t2.getValue(e2).set(n2) : t2.addValue(e2, ns(n2));
  }
  function St2(t2) {
    return ((t3) => Array.isArray(t3))(t2) ? t2[t2.length - 1] || 0 : t2;
  }
  function Ct2(t2, e2) {
    const n2 = (function(t3, e3, n3) {
      const s2 = t3.getProps();
      return Vt2(s2, e3, void 0 !== n3 ? n3 : s2.custom, t3);
    })(t2, e2);
    let { transitionEnd: s = {}, transition: r2 = {}, ...o2 } = n2 || {};
    o2 = { ...o2, ...s };
    for (const e3 in o2) {
      xt2(t2, e3, St2(o2[e3]));
    }
  }
  function bt2(t2, e2) {
    const s = t2.getValue("willChange");
    if (r2 = s, Boolean(Qs(r2) && r2.add)) return s.add(e2);
    if (!s && i.WillChange) {
      const n2 = new i.WillChange("auto");
      t2.addValue("willChange", n2), n2.add(e2);
    }
    var r2;
  }
  var At2 = (t2) => t2.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase();
  var Mt2 = "data-" + At2("framerAppearId");
  function Tt2(t2) {
    return t2.props[Mt2];
  }
  var Bt2 = (t2) => null !== t2;
  var Pt2 = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 };
  var Et2 = { type: "keyframes", duration: 0.8 };
  var kt2 = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 };
  var Lt2 = (t2, { keyframes: e2 }) => e2.length > 2 ? Et2 : Fe.has(t2) ? t2.startsWith("scale") ? { type: "spring", stiffness: 550, damping: 0 === e2[1] ? 2 * Math.sqrt(550) : 30, restSpeed: 10 } : Pt2 : kt2;
  var Ft2 = (t2, e2, n2, s = {}, r2, o2) => (i2) => {
    const a2 = Mn(s, t2) || {}, l2 = a2.delay || s.delay || 0;
    let { elapsed: d2 = 0 } = s;
    d2 -= g(l2);
    const m = { keyframes: Array.isArray(n2) ? n2 : [null, n2], ease: "easeOut", velocity: e2.getVelocity(), ...a2, delay: -d2, onUpdate: (t3) => {
      e2.set(t3), a2.onUpdate && a2.onUpdate(t3);
    }, onComplete: () => {
      i2(), a2.onComplete && a2.onComplete();
    }, name: t2, motionValue: e2, element: o2 ? void 0 : r2 };
    (function({ when: t3, delay: e3, delayChildren: n3, staggerChildren: s2, staggerDirection: r3, repeat: o3, repeatType: i3, repeatDelay: a3, from: l3, elapsed: u2, ...c2 }) {
      return !!Object.keys(c2).length;
    })(a2) || Object.assign(m, Lt2(t2, m)), m.duration && (m.duration = g(m.duration)), m.repeatDelay && (m.repeatDelay = g(m.repeatDelay)), void 0 !== m.from && (m.keyframes[0] = m.from);
    let g2 = false;
    if ((false === m.type || 0 === m.duration && !m.repeatDelay) && (un(m), 0 === m.delay && (g2 = true)), (i.instantAnimations || i.skipAnimations) && (g2 = true, un(m), m.delay = 0), m.allowFlatten = !a2.type && !a2.ease, g2 && !o2 && void 0 !== e2.get()) {
      const t3 = (function(t4, { repeat: e3, repeatType: n3 = "loop" }, s2) {
        const r3 = t4.filter(Bt2), o3 = e3 && "loop" !== n3 && e3 % 2 == 1 ? 0 : r3.length - 1;
        return o3 && void 0 !== s2 ? s2 : r3[o3];
      })(m.keyframes, a2);
      if (void 0 !== t3) return void S2.update((() => {
        m.onUpdate(t3), m.onComplete();
      }));
    }
    return a2.isSync ? new ge(m) : new dn(m);
  };
  function Ot2({ protectedKeys: t2, needsAnimating: e2 }, n2) {
    const s = t2.hasOwnProperty(n2) && true !== e2[n2];
    return e2[n2] = false, s;
  }
  function It2(t2, e2, { delay: n2 = 0, transitionOverride: s, type: r2 } = {}) {
    let { transition: o2 = t2.getDefaultTransition(), transitionEnd: i2, ...a2 } = e2;
    s && (o2 = s);
    const l2 = [], c2 = r2 && t2.animationState && t2.animationState.getState()[r2];
    for (const e3 in a2) {
      const s2 = t2.getValue(e3, t2.latestValues[e3] ?? null), r3 = a2[e3];
      if (void 0 === r3 || c2 && Ot2(c2, e3)) continue;
      const i3 = { delay: n2, ...Mn(o2 || {}, e3) }, f2 = s2.get();
      if (void 0 !== f2 && !s2.isAnimating && !Array.isArray(r3) && r3 === f2 && !i3.velocity) continue;
      let p2 = false;
      if (window.MotionHandoffAnimation) {
        const n3 = Tt2(t2);
        if (n3) {
          const t3 = window.MotionHandoffAnimation(n3, e3, S2);
          null !== t3 && (i3.startTime = t3, p2 = true);
        }
      }
      bt2(t2, e3), s2.start(Ft2(e3, s2, r3, t2.shouldReduceMotion && kn.has(e3) ? { type: false } : i3, t2, p2));
      const m = s2.animation;
      m && l2.push(m);
    }
    return i2 && Promise.all(l2).then((() => {
      S2.update((() => {
        i2 && Ct2(t2, i2);
      }));
    })), l2;
  }
  var Wt2 = { animation: ["animate", "variants", "whileHover", "whileTap", "exit", "whileInView", "whileFocus", "whileDrag"], exit: ["exit"], drag: ["drag", "dragControls"], focus: ["whileFocus"], hover: ["whileHover", "onHoverStart", "onHoverEnd"], tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"], pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"], inView: ["whileInView", "onViewportEnter", "onViewportLeave"], layout: ["layout", "layoutId"] };
  var jt2 = {};
  for (const t2 in Wt2) jt2[t2] = { isEnabled: (e2) => Wt2[t2].some(((t3) => !!e2[t3])) };
  var Nt2 = () => ({ x: { min: 0, max: 0 }, y: { min: 0, max: 0 } });
  var Dt2 = "undefined" != typeof window;
  var Rt2 = { current: null };
  var Ht2 = { current: false };
  var Ut2 = ["initial", "animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit"];
  function $t2(t2) {
    return null !== (e2 = t2.animate) && "object" == typeof e2 && "function" == typeof e2.start || Ut2.some(((e3) => (function(t3) {
      return "string" == typeof t3 || Array.isArray(t3);
    })(t2[e3])));
    var e2;
  }
  var zt2 = ["AnimationStart", "AnimationComplete", "Update", "BeforeLayoutMeasure", "LayoutMeasure", "LayoutAnimationStart", "LayoutAnimationComplete"];
  var Gt2 = class {
    scrapeMotionValuesFromProps(t2, e2, n2) {
      return {};
    }
    constructor({ parent: t2, props: e2, presenceContext: s, reducedMotionConfig: r2, blockInitialAnimation: o2, visualState: i2 }, a2 = {}) {
      this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = false, this.isControllingVariants = false, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Xe, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
        this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
      }, this.renderScheduledAt = 0, this.scheduleRender = () => {
        const t3 = O.now();
        this.renderScheduledAt < t3 && (this.renderScheduledAt = t3, S2.render(this.render, false, true));
      };
      const { latestValues: l2, renderState: u2 } = i2;
      this.latestValues = l2, this.baseTarget = { ...l2 }, this.initialValues = e2.initial ? { ...l2 } : {}, this.renderState = u2, this.parent = t2, this.props = e2, this.presenceContext = s, this.depth = t2 ? t2.depth + 1 : 0, this.reducedMotionConfig = r2, this.options = a2, this.blockInitialAnimation = Boolean(o2), this.isControllingVariants = $t2(e2), this.isVariantNode = (function(t3) {
        return Boolean($t2(t3) || t3.variants);
      })(e2), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = Boolean(t2 && t2.current);
      const { willChange: c2, ...f2 } = this.scrapeMotionValuesFromProps(e2, {}, this);
      for (const t3 in f2) {
        const e3 = f2[t3];
        void 0 !== l2[t3] && Qs(e3) && e3.set(l2[t3]);
      }
    }
    mount(t2) {
      this.current = t2, vt2.set(t2, this), this.projection && !this.projection.instance && this.projection.mount(t2), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach(((t3, e2) => this.bindToMotionValue(e2, t3))), Ht2.current || (function() {
        if (Ht2.current = true, Dt2) if (window.matchMedia) {
          const t3 = window.matchMedia("(prefers-reduced-motion)"), e2 = () => Rt2.current = t3.matches;
          t3.addEventListener("change", e2), e2();
        } else Rt2.current = false;
      })(), this.shouldReduceMotion = "never" !== this.reducedMotionConfig && ("always" === this.reducedMotionConfig || Rt2.current), this.parent?.addChild(this), this.update(this.props, this.presenceContext);
    }
    unmount() {
      this.projection && this.projection.unmount(), E2(this.notifyUpdate), E2(this.render), this.valueSubscriptions.forEach(((t2) => t2())), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
      for (const t2 in this.events) this.events[t2].clear();
      for (const t2 in this.features) {
        const e2 = this.features[t2];
        e2 && (e2.unmount(), e2.isMounted = false);
      }
      this.current = null;
    }
    addChild(t2) {
      this.children.add(t2), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(t2);
    }
    removeChild(t2) {
      this.children.delete(t2), this.enteringChildren && this.enteringChildren.delete(t2);
    }
    bindToMotionValue(t2, e2) {
      this.valueSubscriptions.has(t2) && this.valueSubscriptions.get(t2)();
      const n2 = Fe.has(t2);
      n2 && this.onBindTransform && this.onBindTransform();
      const s = e2.on("change", ((e3) => {
        this.latestValues[t2] = e3, this.props.onUpdate && S2.preRender(this.notifyUpdate), n2 && this.projection && (this.projection.isTransformDirty = true), this.scheduleRender();
      }));
      let r2;
      window.MotionCheckAppearSync && (r2 = window.MotionCheckAppearSync(this, t2, e2)), this.valueSubscriptions.set(t2, (() => {
        s(), r2 && r2(), e2.owner && e2.stop();
      }));
    }
    sortNodePosition(t2) {
      return this.current && this.sortInstanceNodePosition && this.type === t2.type ? this.sortInstanceNodePosition(this.current, t2.current) : 0;
    }
    updateFeatures() {
      let t2 = "animation";
      for (t2 in jt2) {
        const e2 = jt2[t2];
        if (!e2) continue;
        const { isEnabled: n2, Feature: s } = e2;
        if (!this.features[t2] && s && n2(this.props) && (this.features[t2] = new s(this)), this.features[t2]) {
          const e3 = this.features[t2];
          e3.isMounted ? e3.update() : (e3.mount(), e3.isMounted = true);
        }
      }
    }
    triggerBuild() {
      this.build(this.renderState, this.latestValues, this.props);
    }
    measureViewportBox() {
      return this.current ? this.measureInstanceViewportBox(this.current, this.props) : { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
    }
    getStaticValue(t2) {
      return this.latestValues[t2];
    }
    setStaticValue(t2, e2) {
      this.latestValues[t2] = e2;
    }
    update(t2, e2) {
      (t2.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = t2, this.prevPresenceContext = this.presenceContext, this.presenceContext = e2;
      for (let e3 = 0; e3 < zt2.length; e3++) {
        const n2 = zt2[e3];
        this.propEventSubscriptions[n2] && (this.propEventSubscriptions[n2](), delete this.propEventSubscriptions[n2]);
        const s = t2["on" + n2];
        s && (this.propEventSubscriptions[n2] = this.on(n2, s));
      }
      this.prevMotionValues = (function(t3, e3, s) {
        for (const r2 in e3) {
          const o2 = e3[r2], i2 = s[r2];
          if (Qs(o2)) t3.addValue(r2, o2);
          else if (Qs(i2)) t3.addValue(r2, ns(o2, { owner: t3 }));
          else if (i2 !== o2) if (t3.hasValue(r2)) {
            const e4 = t3.getValue(r2);
            true === e4.liveStyle ? e4.jump(o2) : e4.hasAnimated || e4.set(o2);
          } else {
            const e4 = t3.getStaticValue(r2);
            t3.addValue(r2, ns(void 0 !== e4 ? e4 : o2, { owner: t3 }));
          }
        }
        for (const n2 in s) void 0 === e3[n2] && t3.removeValue(n2);
        return e3;
      })(this, this.scrapeMotionValuesFromProps(t2, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
    }
    getProps() {
      return this.props;
    }
    getVariant(t2) {
      return this.props.variants ? this.props.variants[t2] : void 0;
    }
    getDefaultTransition() {
      return this.props.transition;
    }
    getTransformPagePoint() {
      return this.props.transformPagePoint;
    }
    getClosestVariantNode() {
      return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
    }
    addVariantChild(t2) {
      const e2 = this.getClosestVariantNode();
      if (e2) return e2.variantChildren && e2.variantChildren.add(t2), () => e2.variantChildren.delete(t2);
    }
    addValue(t2, e2) {
      const n2 = this.values.get(t2);
      e2 !== n2 && (n2 && this.removeValue(t2), this.bindToMotionValue(t2, e2), this.values.set(t2, e2), this.latestValues[t2] = e2.get());
    }
    removeValue(t2) {
      this.values.delete(t2);
      const e2 = this.valueSubscriptions.get(t2);
      e2 && (e2(), this.valueSubscriptions.delete(t2)), delete this.latestValues[t2], this.removeValueFromRenderState(t2, this.renderState);
    }
    hasValue(t2) {
      return this.values.has(t2);
    }
    getValue(t2, e2) {
      if (this.props.values && this.props.values[t2]) return this.props.values[t2];
      let n2 = this.values.get(t2);
      return void 0 === n2 && void 0 !== e2 && (n2 = ns(null === e2 ? void 0 : e2, { owner: this }), this.addValue(t2, n2)), n2;
    }
    readValue(t2, e2) {
      let s = void 0 === this.latestValues[t2] && this.current ? this.getBaseTargetFromProps(this.props, t2) ?? this.readValueFromInstance(this.current, t2, this.options) : this.latestValues[t2];
      return null != s && ("string" == typeof s && (c(s) || a(s)) ? s = parseFloat(s) : !ri(s) && pt.test(e2) && (s = Ln(t2, e2)), this.setBaseTarget(t2, Qs(s) ? s.get() : s)), Qs(s) ? s.get() : s;
    }
    setBaseTarget(t2, e2) {
      this.baseTarget[t2] = e2;
    }
    getBaseTarget(t2) {
      const { initial: e2 } = this.props;
      let s;
      if ("string" == typeof e2 || "object" == typeof e2) {
        const n2 = Vt2(this.props, e2, this.presenceContext?.custom);
        n2 && (s = n2[t2]);
      }
      if (e2 && void 0 !== s) return s;
      const r2 = this.getBaseTargetFromProps(this.props, t2);
      return void 0 === r2 || Qs(r2) ? void 0 !== this.initialValues[t2] && void 0 === s ? void 0 : this.baseTarget[t2] : r2;
    }
    on(t2, e2) {
      return this.events[t2] || (this.events[t2] = new b()), this.events[t2].add(e2);
    }
    notify(t2, ...e2) {
      this.events[t2] && this.events[t2].notify(...e2);
    }
    scheduleRenderMicrotask() {
      ls.render(this.render);
    }
  };
  var Kt2 = class extends Gt2 {
    constructor() {
      super(...arguments), this.KeyframeResolver = Bn;
    }
    sortInstanceNodePosition(t2, e2) {
      return 2 & t2.compareDocumentPosition(e2) ? 1 : -1;
    }
    getBaseTargetFromProps(t2, e2) {
      return t2.style ? t2.style[e2] : void 0;
    }
    removeValueFromRenderState(t2, { vars: e2, style: n2 }) {
      delete e2[t2], delete n2[t2];
    }
    handleChildMotionValue() {
      this.childSubscription && (this.childSubscription(), delete this.childSubscription);
      const { children: t2 } = this.props;
      Qs(t2) && (this.childSubscription = t2.on("change", ((t3) => {
        this.current && (this.current.textContent = `${t3}`);
      })));
    }
  };
  var Yt2 = { x: "translateX", y: "translateY", z: "translateZ", transformPerspective: "perspective" };
  var Xt2 = De.length;
  function qt2(t2, e2, n2) {
    const { style: s, vars: r2, transformOrigin: o2 } = t2;
    let i2 = false, a2 = false;
    for (const t3 in e2) {
      const n3 = e2[t3];
      if (Fe.has(t3)) i2 = true;
      else if ($2(t3)) r2[t3] = n3;
      else {
        const e3 = qn(n3, Cn[t3]);
        t3.startsWith("origin") ? (a2 = true, o2[t3] = e3) : s[t3] = e3;
      }
    }
    if (e2.transform || (i2 || n2 ? s.transform = (function(t3, e3, n3) {
      let s2 = "", r3 = true;
      for (let o3 = 0; o3 < Xt2; o3++) {
        const i3 = De[o3], a3 = t3[i3];
        if (void 0 === a3) continue;
        let l2 = true;
        if (l2 = "number" == typeof a3 ? a3 === (i3.startsWith("scale") ? 1 : 0) : 0 === parseFloat(a3), !l2 || n3) {
          const t4 = qn(a3, Cn[i3]);
          l2 || (r3 = false, s2 += `${Yt2[i3] || i3}(${t4}) `), n3 && (e3[i3] = t4);
        }
      }
      return s2 = s2.trim(), n3 ? s2 = n3(e3, r3 ? "" : s2) : r3 && (s2 = "none"), s2;
    })(e2, t2.transform, n2) : s.transform && (s.transform = "none")), a2) {
      const { originX: t3 = "50%", originY: e3 = "50%", originZ: n3 = 0 } = o2;
      s.transformOrigin = `${t3} ${e3} ${n3}`;
    }
  }
  function Zt2(t2, { style: e2, vars: n2 }, s, r2) {
    const o2 = t2.style;
    let i2;
    for (i2 in e2) o2[i2] = e2[i2];
    for (i2 in r2?.applyProjectionStyles(o2, s), n2) o2.setProperty(i2, n2[i2]);
  }
  var Jt2 = {};
  function Qt2(t2, { layout: e2, layoutId: n2 }) {
    return Fe.has(t2) || t2.startsWith("origin") || (e2 || void 0 !== n2) && (!!Jt2[t2] || "opacity" === t2);
  }
  function _t2(t2, e2, s) {
    const { style: r2 } = t2, o2 = {};
    for (const i2 in r2) (Qs(r2[i2]) || e2.style && Qs(e2.style[i2]) || Qt2(i2, t2) || void 0 !== s?.getValue(i2)?.liveStyle) && (o2[i2] = r2[i2]);
    return o2;
  }
  var te2 = class extends Kt2 {
    constructor() {
      super(...arguments), this.type = "html", this.renderInstance = Zt2;
    }
    readValueFromInstance(t2, e2) {
      if (Fe.has(e2)) return this.projection?.isProjecting ? Se(e2) : Pe(t2, e2);
      {
        const s = (n2 = t2, window.getComputedStyle(n2)), r2 = ($2(e2) ? s.getPropertyValue(e2) : s[e2]) || 0;
        return "string" == typeof r2 ? r2.trim() : r2;
      }
      var n2;
    }
    measureInstanceViewportBox(t2, { transformPagePoint: e2 }) {
      return (function(t3, e3) {
        return (function({ top: t4, left: e4, right: n2, bottom: s }) {
          return { x: { min: e4, max: n2 }, y: { min: t4, max: s } };
        })((function(t4, e4) {
          if (!e4) return t4;
          const n2 = e4({ x: t4.left, y: t4.top }), s = e4({ x: t4.right, y: t4.bottom });
          return { top: n2.y, left: n2.x, bottom: s.y, right: s.x };
        })(t3.getBoundingClientRect(), e3));
      })(t2, e2);
    }
    build(t2, e2, n2) {
      qt2(t2, e2, n2.transformTemplate);
    }
    scrapeMotionValuesFromProps(t2, e2, n2) {
      return _t2(t2, e2, n2);
    }
  };
  var ee2 = class extends Gt2 {
    constructor() {
      super(...arguments), this.type = "object";
    }
    readValueFromInstance(t2, e2) {
      if ((function(t3, e3) {
        return t3 in e3;
      })(e2, t2)) {
        const n2 = t2[e2];
        if ("string" == typeof n2 || "number" == typeof n2) return n2;
      }
    }
    getBaseTargetFromProps() {
    }
    removeValueFromRenderState(t2, e2) {
      delete e2.output[t2];
    }
    measureInstanceViewportBox() {
      return { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
    }
    build(t2, e2) {
      Object.assign(t2.output, e2);
    }
    renderInstance(t2, { output: e2 }) {
      Object.assign(t2, e2);
    }
    sortInstanceNodePosition() {
      return 0;
    }
  };
  var ne2 = { offset: "stroke-dashoffset", array: "stroke-dasharray" };
  var se2 = { offset: "strokeDashoffset", array: "strokeDasharray" };
  function re2(t2, { attrX: e2, attrY: n2, attrScale: s, pathLength: r2, pathSpacing: o2 = 1, pathOffset: i2 = 0, ...a2 }, l2, u2, c2) {
    if (qt2(t2, a2, u2), l2) return void (t2.style.viewBox && (t2.attrs.viewBox = t2.style.viewBox));
    t2.attrs = t2.style, t2.style = {};
    const { attrs: h2, style: f2 } = t2;
    h2.transform && (f2.transform = h2.transform, delete h2.transform), (f2.transform || h2.transformOrigin) && (f2.transformOrigin = h2.transformOrigin ?? "50% 50%", delete h2.transformOrigin), f2.transform && (f2.transformBox = c2?.transformBox ?? "fill-box", delete h2.transformBox), void 0 !== e2 && (h2.x = e2), void 0 !== n2 && (h2.y = n2), void 0 !== s && (h2.scale = s), void 0 !== r2 && (function(t3, e3, n3 = 1, s2 = 0, r3 = true) {
      t3.pathLength = 1;
      const o3 = r3 ? ne2 : se2;
      t3[o3.offset] = Q.transform(-s2);
      const i3 = Q.transform(e3), a3 = Q.transform(n3);
      t3[o3.array] = `${i3} ${a3}`;
    })(h2, r2, o2, i2, false);
  }
  var oe2 = /* @__PURE__ */ new Set(["baseFrequency", "diffuseConstant", "kernelMatrix", "kernelUnitLength", "keySplines", "keyTimes", "limitingConeAngle", "markerHeight", "markerWidth", "numOctaves", "targetX", "targetY", "surfaceScale", "specularConstant", "specularExponent", "stdDeviation", "tableValues", "viewBox", "gradientTransform", "pathLength", "startOffset", "textLength", "lengthAdjust"]);
  var ie2 = class extends Kt2 {
    constructor() {
      super(...arguments), this.type = "svg", this.isSVGTag = false, this.measureInstanceViewportBox = Nt2;
    }
    getBaseTargetFromProps(t2, e2) {
      return t2[e2];
    }
    readValueFromInstance(t2, e2) {
      if (Fe.has(e2)) {
        const t3 = Kn(e2);
        return t3 && t3.default || 0;
      }
      return e2 = oe2.has(e2) ? e2 : At2(e2), t2.getAttribute(e2);
    }
    scrapeMotionValuesFromProps(t2, e2, s) {
      return (function(t3, e3, s2) {
        const r2 = _t2(t3, e3, s2);
        for (const s3 in t3) (Qs(t3[s3]) || Qs(e3[s3])) && (r2[-1 !== De.indexOf(s3) ? "attr" + s3.charAt(0).toUpperCase() + s3.substring(1) : s3] = t3[s3]);
        return r2;
      })(t2, e2, s);
    }
    build(t2, e2, n2) {
      re2(t2, e2, this.isSVGTag, n2.transformTemplate, n2.style);
    }
    renderInstance(t2, e2, n2, s) {
      !(function(t3, e3, n3, s2) {
        Zt2(t3, e3, void 0, s2);
        for (const n4 in e3.attrs) t3.setAttribute(oe2.has(n4) ? n4 : At2(n4), e3.attrs[n4]);
      })(t2, e2, 0, s);
    }
    mount(t2) {
      var e2;
      this.isSVGTag = "string" == typeof (e2 = t2.tagName) && "svg" === e2.toLowerCase(), super.mount(t2);
    }
  };
  function ae2(t2) {
    const e2 = { presenceContext: null, props: {}, visualState: { renderState: { transform: {}, transformOrigin: {}, style: {}, vars: {}, attrs: {} }, latestValues: {} } }, n2 = Ss(t2) && !qs(t2) ? new ie2(e2) : new te2(e2);
    n2.mount(t2), vt2.set(t2, n2);
  }
  function le2(t2) {
    const e2 = new ee2({ presenceContext: null, props: {}, visualState: { renderState: { output: {} }, latestValues: {} } });
    e2.mount(t2), vt2.set(t2, e2);
  }
  function ue2(t2, e2, s, r2) {
    const o2 = [];
    if ((function(t3, e3) {
      return Qs(t3) || "number" == typeof t3 || "string" == typeof t3 && !ot2(e3);
    })(t2, e2)) o2.push((function(t3, e3, s2) {
      const r3 = Qs(t3) ? t3 : ns(t3);
      return r3.start(Ft2("", r3, e3, s2)), r3.animation;
    })(t2, ot2(e2) && e2.default || e2, s && s.default || s));
    else {
      const n2 = it2(t2, e2, r2), i2 = n2.length;
      o(Boolean(i2), "No valid elements provided.", "no-valid-elements");
      for (let t3 = 0; t3 < i2; t3++) {
        const r3 = n2[t3];
        o(null !== r3, "You're trying to perform an animation on null. Ensure that selectors are correctly finding elements and refs are correctly hydrated.", "animate-null");
        const a2 = r3 instanceof Element ? ae2 : le2;
        vt2.has(r3) || a2(r3);
        const l2 = vt2.get(r3), u2 = { ...s };
        "delay" in u2 && "function" == typeof u2.delay && (u2.delay = u2.delay(t3, i2)), o2.push(...It2(l2, { ...e2, transition: u2 }, {}));
      }
    }
    return o2;
  }
  function ce2(t2, e2, a2) {
    const l2 = [], u2 = (function(t3, { defaultTransition: e3 = {}, ...a3 } = {}, l3, u3) {
      const c2 = e3.duration || 0.3, h2 = /* @__PURE__ */ new Map(), f2 = /* @__PURE__ */ new Map(), p2 = {}, d2 = /* @__PURE__ */ new Map();
      let m = 0, g2 = 0, y2 = 0;
      for (let a4 = 0; a4 < t3.length; a4++) {
        const h3 = t3[a4];
        if ("string" == typeof h3) {
          d2.set(h3, g2);
          continue;
        }
        if (!Array.isArray(h3)) {
          d2.set(h3.name, lt2(g2, h3.at, m, d2));
          continue;
        }
        let [v2, w2, V2 = {}] = h3;
        void 0 !== V2.at && (g2 = lt2(g2, V2.at, m, d2));
        let x2 = 0;
        const S3 = (t4, n2, a5, l4 = 0, h4 = 0) => {
          const f3 = dt2(t4), { delay: p3 = 0, times: d3 = ae(f3), type: m2 = "keyframes", repeat: v3, repeatType: w3, repeatDelay: V3 = 0, ...S4 } = n2;
          let { ease: C3 = e3.ease || "easeOut", duration: b2 } = n2;
          const A3 = "function" == typeof p3 ? p3(l4, h4) : p3, M3 = f3.length, T = tn(m2) ? m2 : u3?.[m2 || "keyframes"];
          if (M3 <= 2 && T) {
            let t5 = 100;
            if (2 === M3 && yt2(f3)) {
              const e5 = f3[1] - f3[0];
              t5 = Math.abs(e5);
            }
            const e4 = { ...S4 };
            void 0 !== b2 && (e4.duration = g(b2));
            const n3 = Ct(e4, t5, T);
            C3 = n3.ease, b2 = n3.duration;
          }
          b2 ?? (b2 = c2);
          const B3 = g2 + A3;
          1 === d3.length && 0 === d3[0] && (d3[1] = 1);
          const P2 = d3.length - f3.length;
          if (P2 > 0 && re(d3, P2), 1 === f3.length && f3.unshift(null), v3) {
            o(v3 < 20, "Repeat count too high, must be less than 20", "repeat-count-high"), b2 = at2(b2, v3);
            const t5 = [...f3], e4 = [...d3];
            C3 = Array.isArray(C3) ? [...C3] : [C3];
            const n3 = [...C3];
            for (let s = 0; s < v3; s++) {
              f3.push(...t5);
              for (let r2 = 0; r2 < t5.length; r2++) d3.push(e4[r2] + (s + 1)), C3.push(0 === r2 ? "linear" : J(n3, r2 - 1));
            }
            ct2(d3, v3);
          }
          const E3 = B3 + b2;
          ut2(a5, f3, C3, d3, B3, E3), x2 = Math.max(A3 + b2, x2), y2 = Math.max(E3, y2);
        };
        if (Qs(v2)) S3(w2, V2, pt2("default", ft2(v2, f2)));
        else {
          const t4 = it2(v2, w2, l3, p2), e4 = t4.length;
          for (let n2 = 0; n2 < e4; n2++) {
            const s = ft2(t4[n2], f2);
            for (const t5 in w2) S3(w2[t5], mt2(V2, t5), pt2(t5, s), n2, e4);
          }
        }
        m = g2, g2 += x2;
      }
      return f2.forEach(((t4, n2) => {
        for (const s in t4) {
          const r2 = t4[s];
          r2.sort(ht2);
          const o2 = [], i2 = [], l4 = [];
          for (let t5 = 0; t5 < r2.length; t5++) {
            const { at: e4, value: n3, easing: s2 } = r2[t5];
            o2.push(n3), i2.push(d(0, y2, e4)), l4.push(s2 || "easeOut");
          }
          0 !== i2[0] && (i2.unshift(0), o2.unshift(o2[0]), l4.unshift("easeInOut")), 1 !== i2[i2.length - 1] && (i2.push(1), o2.push(null)), h2.has(n2) || h2.set(n2, { keyframes: {}, transition: {} });
          const u4 = h2.get(n2);
          u4.keyframes[s] = o2, u4.transition[s] = { ...e3, duration: y2, ease: l4, times: i2, ...a3 };
        }
      })), h2;
    })(t2, e2, a2, { spring: ne });
    return u2.forEach((({ keyframes: t3, transition: e3 }, n2) => {
      l2.push(...ue2(n2, t3, e3));
    })), l2;
  }
  function he2(t2) {
    return function(e2, n2, s) {
      let r2, o2 = [];
      if (i2 = e2, Array.isArray(i2) && i2.some(Array.isArray)) o2 = ce2(e2, n2, t2);
      else {
        const { onComplete: i3, ...a3 } = s || {};
        "function" == typeof i3 && (r2 = i3), o2 = ue2(e2, n2, a3, t2);
      }
      var i2;
      const a2 = new fn(o2);
      return r2 && a2.finished.then(r2), t2 && (t2.animations.push(a2), a2.finished.then((() => {
        n(t2.animations, a2);
      }))), a2;
    };
  }
  var fe2 = he2();

  // main.js
  (function() {
    "use strict";
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const frameEl = document.querySelector(".scrub-frame");
    const scrubSection = document.querySelector("#scrub");
    const progressLine = document.querySelector(".progress-line");
    const dotRail = document.querySelector(".dot-rail");
    const wordLines = gsap.utils.toArray(".word-line");
    const totalFrames = 49;
    const framePath = (index) => `video/frames/frame_${String(index).padStart(4, "0")}.jpg`;
    const railLabels = {
      0: "Idle",
      2: "Lift",
      4: "Reveal",
      6: "Break",
      8: "Settle",
      10: "Done"
    };
    let rafId = 0;
    let pendingFrame = 1;
    let currentFrame = 1;
    let lastScrubProgress = 0;
    const frameCache = /* @__PURE__ */ new Map();
    gsap.registerPlugin(ScrollTrigger);
    function initHero() {
      const letters = gsap.utils.toArray(".hero-title span");
      if (prefersReduced) {
        gsap.set(letters, { opacity: 1, y: 0 });
        return;
      }
      gsap.to(letters, {
        opacity: 1,
        y: 0,
        duration: 0.72,
        ease: "power4.out",
        stagger: 0.04,
        delay: 0.12
      });
    }
    function splitWords() {
      wordLines.forEach((line) => {
        const words = line.textContent.trim().split(/\s+/);
        line.innerHTML = words.map((word) => `<span class="word">${word}</span>`).join(" ");
      });
    }
    function preloadFrame(index) {
      const clamped = gsap.utils.clamp(1, totalFrames, index);
      if (frameCache.has(clamped)) return;
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(clamped);
      frameCache.set(clamped, img);
    }
    function preloadAround(index, radius = 4) {
      for (let i2 = index - radius; i2 <= index + radius; i2 += 1) preloadFrame(i2);
    }
    function loadFrames() {
      if (!frameEl) return;
      frameEl.classList.add("is-ready");
      preloadAround(1, 8);
      requestFrameTime(lastScrubProgress);
      ScrollTrigger.refresh();
    }
    function initLazyFrames() {
      const isNearScrub = () => {
        const rect = scrubSection.getBoundingClientRect();
        const margin = window.innerHeight * 0.3;
        return rect.top < window.innerHeight + margin && rect.bottom > -margin;
      };
      if (isNearScrub()) {
        loadFrames();
        return;
      }
      if (!("IntersectionObserver" in window)) {
        loadFrames();
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadFrames();
          observer.disconnect();
        }
      }, { rootMargin: "30% 0px" });
      observer.observe(scrubSection);
    }
    function requestFrameTime(progress) {
      pendingFrame = Math.round(gsap.utils.clamp(0, 1, progress) * (totalFrames - 1)) + 1;
      preloadAround(pendingFrame);
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (!frameEl || pendingFrame === currentFrame) return;
        currentFrame = pendingFrame;
        frameEl.src = framePath(currentFrame);
      });
    }
    function setCamera(state) {
      frameEl.style.transform = `translate3d(${state.x}vw, ${state.y}vh, 0) scale(${state.scale}) rotate(${state.rotate}deg)`;
    }
    function setRail(progress) {
      if (!dotRail) return;
      const bucket = Math.min(10, Math.floor(progress * 10.999));
      dotRail.querySelectorAll(".rail-dot").forEach((dot, index) => {
        dot.classList.toggle("is-active", index === bucket);
      });
    }
    function buildRail() {
      if (!dotRail) return;
      dotRail.innerHTML = Array.from({ length: 11 }, (_2, index) => {
        const label = railLabels[index] || "";
        return `<span class="rail-dot"><span>${label}</span></span>`;
      }).join("");
    }
    function initScrubTimeline() {
      if (!frameEl || !scrubSection) return;
      if (isMobile || prefersReduced) {
        loadFrames();
        gsap.set(".word-line .word", { opacity: 0 });
        return;
      }
      gsap.set(wordLines, { autoAlpha: 0 });
      gsap.set(".word-line .word", { opacity: 0, y: 24, scale: 0.92 });
      const state = { frame: 0, scale: 1.02, x: -18, y: 5, rotate: -0.8 };
      const applyState = () => {
        requestFrameTime(state.frame);
        setCamera(state);
      };
      const revealWords = (line, at3) => {
        const words = line.querySelectorAll(".word");
        timeline.set(wordLines, { autoAlpha: 0 }, at3);
        timeline.set(line, { autoAlpha: 1 }, at3);
        timeline.fromTo(
          words,
          { opacity: 0, y: 24, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power4.out", stagger: 0.06 },
          at3 + 0.04
        );
        timeline.to(words, { opacity: 0, y: -14, duration: 0.32, ease: "power2.in", stagger: 0.015 }, at3 + 1.22);
        timeline.to(line, { autoAlpha: 0, duration: 0.22, ease: "power2.out" }, at3 + 1.42);
      };
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scrubSection,
          start: "top top",
          end: "+=1200%",
          pin: ".scrub-stage",
          scrub: 1.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => gsap.set([progressLine, dotRail], { autoAlpha: 1 }),
          onEnterBack: () => gsap.set([progressLine, dotRail], { autoAlpha: 1 }),
          onLeave: () => gsap.set([progressLine, dotRail, wordLines], { autoAlpha: 0 }),
          onLeaveBack: () => gsap.set([progressLine, dotRail, wordLines], { autoAlpha: 0 }),
          onUpdate: (self) => {
            const progress = self.progress;
            lastScrubProgress = progress;
            progressLine.style.height = `${progress * 100}vh`;
            setRail(progress);
          }
        }
      });
      timeline.to(state, { frame: 0.12, scale: 1.1, x: -17, y: 5.2, rotate: -0.7, duration: 1.2, onUpdate: applyState }, 0).to(state, { frame: 0.24, scale: 1.24, x: -9, y: 2.5, rotate: -0.35, duration: 1.4, ease: "power2.inOut", onUpdate: applyState }, 1.2).to(state, { frame: 0.43, scale: 1.38, x: -1.5, y: 0.4, rotate: 0, duration: 1.7, ease: "power2.inOut", onUpdate: applyState }, 2.6).to(state, { frame: 0.64, scale: 1.48, x: 7.5, y: -1.2, rotate: 0.28, duration: 1.9, ease: "power2.inOut", onUpdate: applyState }, 4.3).to(state, { frame: 0.84, scale: 1.6, x: 14, y: -2.2, rotate: 0.48, duration: 1.7, ease: "power2.inOut", onUpdate: applyState }, 6.2).to(state, { frame: 1, scale: 1.42, x: 0, y: 0, rotate: 0, duration: 1.6, ease: "power2.inOut", onUpdate: applyState }, 7.9);
      wordLines.forEach((line, index) => revealWords(line, 0.8 + index * 1.65));
    }
    function initCallouts() {
      const callouts = gsap.utils.toArray(".callout");
      if (!callouts.length || isMobile || prefersReduced) return;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".callout-section",
          start: "top 62%",
          once: true
        }
      });
      callouts.forEach((callout, index) => {
        const labelX = callout.classList.contains("left") ? -24 : 24;
        timeline.to(callout.querySelector(".callout-dot"), {
          scale: 1,
          duration: 0.32,
          ease: "power4.out"
        }, index * 0.2).to(callout.querySelector(".callout-line"), {
          scaleX: 1,
          duration: 0.42,
          ease: "power2.inOut"
        }, index * 0.2 + 0.08).fromTo(
          callout.querySelector(".callout-label"),
          { opacity: 0, x: labelX },
          { opacity: 1, x: 0, duration: 0.42, ease: "power4.out" },
          index * 0.2 + 0.18
        );
      });
    }
    function initSpecRows() {
      ScrollTrigger.batch(".spec-row", {
        start: "top 86%",
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "power4.out",
          stagger: 0.06
        })
      });
    }
    function initCta() {
      const button = document.querySelector(".reserve-button");
      if (button && !prefersReduced) {
        button.addEventListener("pointermove", (event) => {
          const rect = button.getBoundingClientRect();
          const x2 = (event.clientX - rect.left - rect.width / 2) * 0.12;
          const y2 = (event.clientY - rect.top - rect.height / 2) * 0.16;
          fe2(button, { x: x2, y: y2, scale: 1.025 }, { type: "spring", stiffness: 520, damping: 32 });
        });
        button.addEventListener("pointerleave", () => {
          fe2(button, { x: 0, y: 0, scale: 1 }, { type: "spring", stiffness: 420, damping: 28 });
        });
      }
      if (prefersReduced) return;
      gsap.to(".cta h2", {
        backgroundPosition: "100% 50%",
        ease: "none",
        scrollTrigger: {
          trigger: ".cta",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
    splitWords();
    buildRail();
    initHero();
    initLazyFrames();
    initScrubTimeline();
    initCallouts();
    initSpecRows();
    initCta();
  })();
})();
