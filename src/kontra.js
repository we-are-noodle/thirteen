/**
 * @preserve
 * Kontra.js v10.0.2
 */
function t(t, e) {
  return Math.atan2(e.y - t.y, e.x - t.x);
}
function e(t, e, i) {
  return { x: t.x + Math.cos(e) * i, y: t.y + Math.sin(e) * i };
}
function i(t, e) {
  let i = n(t),
    s = n(e);
  return (
    i.x < s.x + s.width &&
    i.x + i.width > s.x &&
    i.y < s.y + s.height &&
    i.y + i.height > s.y
  );
}
function n(t) {
  let { x: e = 0, y: i = 0, width: n, height: s, radius: h } = t.world || t;
  return (
    t.mapwidth && ((n = t.mapwidth), (s = t.mapheight)),
    t.anchor && ((e -= n * t.anchor.x), (i -= s * t.anchor.y)),
    n < 0 && ((e += n), (n *= -1)),
    s < 0 && ((i += s), (s *= -1)),
    { x: e, y: i, width: n, height: s }
  );
}
function s(t, e, i = "y") {
  return ([t, e] = [t, e].map(n)), t[i] - e[i];
}
let h = () => {},
  r = { preventScroll: !0 };
function a(t, e) {
  let i = e.parentNode;
  if ((t.setAttribute("data-kontra", ""), i)) {
    ([...i.querySelectorAll(":scope > [data-kontra]")].pop() || e).after(t);
  } else "CANVAS" == e.nodeName ? document.body.append(t) : e.append(t);
}
function o(t, e) {
  let i = t.indexOf(e);
  if (-1 != i) return t.splice(i, 1), !0;
}
function c(t, e) {
  let { x: i, y: s, width: h, height: r } = n(e);
  do {
    (i -= e.sx || 0), (s -= e.sy || 0);
  } while ((e = e.parent));
  let a = t.x - Math.max(i, Math.min(t.x, i + h)),
    o = t.y - Math.max(s, Math.min(t.y, s + r));
  return a * a + o * o < t.radius * t.radius;
}
let d,
  l,
  u = {};
function p(t, e) {
  (u[t] = u[t] || []), u[t].push(e);
}
function f(t, ...e) {
  (u[t] || []).map((t) => t(...e));
}
let g = { get: (t, e) => "_proxy" == e || h };
function w() {
  return d;
}
function m() {
  return l;
}
function _(t, { contextless: e = !1 } = {}) {
  return (
    (d = document.getElementById(t) || t || document.querySelector("canvas")),
    e && (d = d || new Proxy({}, g)),
    (l = d.getContext("2d") || new Proxy({}, g)),
    (l.imageSmoothingEnabled = !1),
    f("init"),
    { canvas: d, context: l }
  );
}
class x {
  constructor({
    spriteSheet: t,
    frames: e,
    frameRate: i,
    loop: n = !0,
    name: s,
  }) {
    let { width: h, height: r, spacing: a = 0, margin: o = 0 } = t.frame;
    Object.assign(this, {
      spriteSheet: t,
      frames: e,
      frameRate: i,
      loop: n,
      name: s,
      width: h,
      height: r,
      spacing: a,
      margin: o,
      isStopped: !1,
      _f: 0,
      _a: 0,
    });
  }
  clone() {
    return new x(this);
  }
  start() {
    (this.isStopped = !1), this.loop || this.reset();
  }
  stop() {
    this.isStopped = !0;
  }
  reset() {
    (this._f = 0), (this._a = 0);
  }
  update(t = 1 / 60) {
    if (!this.isStopped)
      if (this.loop || this._f != this.frames.length - 1)
        for (this._a += t; this._a * this.frameRate >= 1; )
          (this._f = ++this._f % this.frames.length),
            (this._a -= 1 / this.frameRate);
      else this.stop();
  }
  render({
    x: t,
    y: e,
    width: i = this.width,
    height: n = this.height,
    context: s = m(),
  }) {
    let h = (this.frames[this._f] / this.spriteSheet._f) | 0,
      r = this.frames[this._f] % this.spriteSheet._f | 0;
    s.drawImage(
      this.spriteSheet.image,
      this.margin + r * this.width + (2 * r + 1) * this.spacing,
      this.margin + h * this.height + (2 * h + 1) * this.spacing,
      this.width,
      this.height,
      t,
      e,
      i,
      n,
    );
  }
}
function y() {
  return new x(...arguments);
}
let v = /^\//,
  b = /\/$/,
  S = new WeakMap();
function A(t, e) {
  return new URL(t, e).href;
}
let k = {},
  C = {};
function E(t) {
  return (
    window.__k || (window.__k = { dm: S, u: A, d: C, i: k }),
    new Promise((e, i) => {
      let n, s, h;
      if (
        ((n = (function (t, e) {
          return [t.replace(b, ""), e].filter((t) => t).join("/");
        })("", t)),
        k[n])
      )
        return e(k[n]);
      (s = new Image()),
        (s.onload = function () {
          (h = A(n, window.location.href)),
            (k[
              (function (t) {
                let e = t.replace(
                  "." +
                    (function (t) {
                      return t.split(".").pop();
                    })(t),
                  "",
                );
                return 2 == e.split("/").length ? e.replace(v, "") : e;
              })(t)
            ] = k[n] = k[h] = this),
            f("assetLoaded", this, t),
            e(this);
        }),
        (s.onerror = function () {
          i(n);
        }),
        (s.src = n);
    })
  );
}
class M {
  constructor(t = 0, e = 0, i = {}) {
    null != t.x
      ? ((this.x = t.x), (this.y = t.y))
      : ((this.x = t), (this.y = e));
  }
  set(t) {
    (this.x = t.x), (this.y = t.y);
  }
  add(t) {
    return new M(this.x + t.x, this.y + t.y, this);
  }
}
class L {
  constructor(t) {
    return this.init(t);
  }
  init(t = {}) {
    (this.position = (function () {
      return new M(...arguments);
    })()),
      Object.assign(this, t);
  }
  update(t) {
    this.advance(t);
  }
  advance(t) {}
  _pc() {}
}
class X extends L {
  init({
    width: t = 0,
    height: e = 0,
    context: i = m(),
    render: n = this.draw,
    update: s = this.advance,
    children: h = [],
    anchor: r = { x: 0, y: 0 },
    scaleX: a = 1,
    scaleY: o = 1,
    ...c
  } = {}) {
    (this._c = []),
      super.init({
        width: t,
        height: e,
        context: i,
        anchor: r,
        scaleX: a,
        scaleY: o,
        ...c,
      }),
      (this._di = !0),
      this._uw(),
      this.addChild(h),
      (this._rf = n),
      (this._uf = s),
      p("init", () => {
        this.context ??= m();
      });
  }
  update(t) {
    this._uf(t), this.children.map((e) => e.update && e.update(t));
  }
  render() {
    let t = this.context;
    t.save(),
      (this.x || this.y) && t.translate(this.x, this.y),
      (1 == this.scaleX && 1 == this.scaleY) ||
        t.scale(this.scaleX, this.scaleY);
    let e = this.width,
      i = this.height,
      n = -e * this.anchor.x,
      s = -i * this.anchor.y;
    (n || s) && t.translate(n, s),
      this._rf(),
      (n || s) && t.translate(-n, -s),
      this.children.map((t) => t.render && t.render()),
      t.restore();
  }
  draw() {}
  _pc() {
    this._uw(), this.children.map((t) => t._pc());
  }
  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  set x(t) {
    (this.position.x = t), this._pc();
  }
  set y(t) {
    (this.position.y = t), this._pc();
  }
  get width() {
    return this._w;
  }
  set width(t) {
    (this._w = t), this._pc();
  }
  get height() {
    return this._h;
  }
  set height(t) {
    (this._h = t), this._pc();
  }
  _uw() {
    if (!this._di) return;
    let {
      _wx: t = 0,
      _wy: e = 0,
      _wsx: i = 1,
      _wsy: n = 1,
    } = this.parent || {};
    (this._wx = this.x),
      (this._wy = this.y),
      (this._ww = this.width),
      (this._wh = this.height),
      (this._wsx = i * this.scaleX),
      (this._wsy = n * this.scaleY),
      (this._wx = this._wx * i),
      (this._wy = this._wy * n),
      (this._ww = this.width * this._wsx),
      (this._wh = this.height * this._wsy),
      (this._wx += t),
      (this._wy += e);
  }
  get world() {
    return {
      x: this._wx,
      y: this._wy,
      width: this._ww,
      height: this._wh,
      scaleX: this._wsx,
      scaleY: this._wsy,
    };
  }
  set children(t) {
    this.removeChild(this._c), this.addChild(t);
  }
  get children() {
    return this._c;
  }
  addChild(...t) {
    t.flat().map((t) => {
      this.children.push(t), (t.parent = this), (t._pc = t._pc || h), t._pc();
    });
  }
  removeChild(...t) {
    t.flat().map((t) => {
      o(this.children, t) && ((t.parent = null), t._pc());
    });
  }
  setScale(t, e = t) {
    (this.scaleX = t), (this.scaleY = e);
  }
  get scaleX() {
    return this._scx;
  }
  set scaleX(t) {
    (this._scx = t), this._pc();
  }
  get scaleY() {
    return this._scy;
  }
  set scaleY(t) {
    (this._scy = t), this._pc();
  }
}
class Y extends X {
  init({
    image: t,
    width: e = t ? t.width : void 0,
    height: i = t ? t.height : void 0,
    ...n
  } = {}) {
    super.init({ image: t, width: e, height: i, ...n });
  }
  get animations() {
    return this._a;
  }
  set animations(t) {
    let e, i;
    for (e in ((this._a = {}), t))
      (this._a[e] = t[e].clone()), (i = i || this._a[e]);
    (this.currentAnimation = i),
      (this.width = this.width || i.width),
      (this.height = this.height || i.height);
  }
  playAnimation(t) {
    this.currentAnimation?.stop(),
      (this.currentAnimation = this.animations[t]),
      this.currentAnimation.start();
  }
  advance(t) {
    super.advance(t), this.currentAnimation?.update(t);
  }
  draw() {
    this.image &&
      this.context.drawImage(
        this.image,
        0,
        0,
        this.image.width,
        this.image.height,
      ),
      this.currentAnimation &&
        this.currentAnimation.render({
          x: 0,
          y: 0,
          width: this.width,
          height: this.height,
          context: this.context,
        }),
      this.color &&
        ((this.context.fillStyle = this.color),
        this.context.fillRect(0, 0, this.width, this.height));
  }
}
function O() {
  return new Y(...arguments);
}
let j = new WeakMap(),
  F = {},
  R = {},
  D = { 0: "left", 1: "middle", 2: "right" };
function I(t = w()) {
  return j.get(t);
}
function P(t, e) {
  return parseFloat(t.getPropertyValue(e)) || 0;
}
function G(t) {
  let e = null != t.button ? D[t.button] : "left";
  (R[e] = !0), U(t, "onDown");
}
function B(t) {
  let e = null != t.button ? D[t.button] : "left";
  (R[e] = !1), U(t, "onUp");
}
function W(t) {
  U(t, "onOver");
}
function q(t) {
  (j.get(t.target)._oo = null), (R = {});
}
function N(t, e, i) {
  let n = (function (t) {
    let e = t._lf.length ? t._lf : t._cf;
    for (let i = e.length - 1; i >= 0; i--) {
      let n = e[i];
      if (n.collidesWithPointer ? n.collidesWithPointer(t) : c(t, n)) return n;
    }
  })(t);
  n && n[e] && n[e](i),
    F[e] && F[e](i, n),
    "onOver" == e &&
      (n != t._oo && t._oo && t._oo.onOut && t._oo.onOut(i), (t._oo = n));
}
function U(t, e) {
  t.preventDefault();
  let i = t.target,
    n = j.get(i),
    {
      scaleX: s,
      scaleY: h,
      offsetX: r,
      offsetY: a,
    } = (function (t) {
      let { canvas: e, _s: i } = t,
        n = e.getBoundingClientRect(),
        s =
          "none" != i.transform
            ? i.transform.replace("matrix(", "").split(",")
            : [1, 1, 1, 1],
        h = parseFloat(s[0]),
        r = parseFloat(s[3]),
        a = (P(i, "border-left-width") + P(i, "border-right-width")) * h,
        o = (P(i, "border-top-width") + P(i, "border-bottom-width")) * r,
        c = (P(i, "padding-left") + P(i, "padding-right")) * h,
        d = (P(i, "padding-top") + P(i, "padding-bottom")) * r;
      return {
        scaleX: (n.width - a - c) / e.width,
        scaleY: (n.height - o - d) / e.height,
        offsetX:
          n.left + (P(i, "border-left-width") + P(i, "padding-left")) * h,
        offsetY: n.top + (P(i, "border-top-width") + P(i, "padding-top")) * r,
      };
    })(n);
  t.type.includes("touch")
    ? (Array.from(t.touches).map(
        ({ clientX: t, clientY: e, identifier: i }) => {
          let o = n.touches[i];
          o ||
            ((o = n.touches[i] = { start: { x: (t - r) / s, y: (e - a) / h } }),
            n.touches.length++),
            (o.changed = !1);
        },
      ),
      Array.from(t.changedTouches).map(
        ({ clientX: i, clientY: o, identifier: c }) => {
          let d = n.touches[c];
          (d.changed = !0),
            (d.x = n.x = (i - r) / s),
            (d.y = n.y = (o - a) / h),
            N(n, e, t),
            f("touchChanged", t, n.touches),
            "onUp" == e &&
              (delete n.touches[c],
              n.touches.length--,
              n.touches.length || f("touchEnd"));
        },
      ))
    : ((n.x = (t.clientX - r) / s), (n.y = (t.clientY - a) / h), N(n, e, t));
}
function H(...t) {
  t.flat().map((t) => {
    let e = t.context ? t.context.canvas : w(),
      i = j.get(e);
    t.__r ||
      ((t.__r = t.render),
      (t.render = function () {
        i._cf.push(this), this.__r();
      }),
      i._o.push(t));
  });
}
function T(t) {
  let e = t.canvas;
  t.clearRect(0, 0, e.width, e.height);
}
function V({
  fps: t = 60,
  clearCanvas: e = !0,
  update: i = h,
  render: n,
  context: s = m(),
  blur: r = !1,
} = {}) {
  let a,
    o,
    c,
    d,
    l,
    u = 0,
    g = 1e3 / t,
    w = 1 / t,
    _ = e ? T : h,
    x = !0;
  function y() {
    if (
      ((o = requestAnimationFrame(y)),
      x && ((c = performance.now()), (d = c - a), (a = c), !(d > 1e3)))
    ) {
      for (u += d; u >= g; ) f("tick"), l.update(w), (u -= g);
      _(l.context), l.render();
    }
  }
  return (
    r ||
      (window.addEventListener("focus", () => {
        x = !0;
      }),
      window.addEventListener("blur", () => {
        x = !1;
      })),
    p("init", () => {
      l.context ??= m();
    }),
    (l = {
      update: i,
      render: n,
      isStopped: !0,
      context: s,
      start() {
        this.isStopped &&
          ((a = performance.now()),
          (this.isStopped = !1),
          requestAnimationFrame(y));
      },
      stop() {
        (this.isStopped = !0), cancelAnimationFrame(o);
      },
    }),
    l
  );
}
let K = [],
  $ = {},
  z = {},
  J = {
    0: "south",
    1: "east",
    2: "west",
    3: "north",
    4: "leftshoulder",
    5: "rightshoulder",
    6: "lefttrigger",
    7: "righttrigger",
    8: "select",
    9: "start",
    10: "leftstick",
    11: "rightstick",
    12: "dpadup",
    13: "dpaddown",
    14: "dpadleft",
    15: "dpadright",
  };
function Q(t) {
  K[t.gamepad.index] = { pressedButtons: {}, axes: {} };
}
function Z(t) {
  delete K[t.gamepad.index];
}
function tt() {
  K.map((t) => {
    (t.pressedButtons = {}), (t.axes = {});
  });
}
function et() {
  let t = navigator.getGamepads
    ? navigator.getGamepads()
    : navigator.webkitGetGamepads
      ? navigator.webkitGetGamepads
      : [];
  for (let e = 0; e < t.length; e++) {
    let i = t[e];
    if (!i) continue;
    i.buttons.map((t, e) => {
      let n = J[e],
        { pressed: s } = t,
        { pressedButtons: h } = K[i.index],
        r = h[n];
      !r && s
        ? [$[i.index], $].map((e) => {
            e?.[n]?.(i, t, n);
          })
        : r &&
          !s &&
          [z[i.index], z].map((e) => {
            e?.[n]?.(i, t, n);
          }),
        (h[n] = s);
    });
    let { axes: n } = K[i.index];
    (n.leftstickx = i.axes[0]),
      (n.leftsticky = i.axes[1]),
      (n.rightstickx = i.axes[2]),
      (n.rightsticky = i.axes[3]);
  }
}
let it,
  nt = {},
  st = !1,
  ht = {
    swipe: {
      touches: 1,
      threshold: 10,
      touchend({ 0: t }) {
        let e = t.x - t.start.x,
          i = t.y - t.start.y,
          n = Math.abs(e),
          s = Math.abs(i);
        if (!(n < this.threshold && s < this.threshold))
          return n > s ? (e < 0 ? "left" : "right") : i < 0 ? "up" : "down";
      },
    },
    pinch: {
      touches: 2,
      threshold: 2,
      touchstart({ 0: t, 1: e }) {
        this.prevDist = Math.hypot(t.x - e.x, t.y - e.y);
      },
      touchmove({ 0: t, 1: e }) {
        let i = Math.hypot(t.x - e.x, t.y - e.y);
        if (Math.abs(i - this.prevDist) < this.threshold) return;
        let n = i > this.prevDist ? "out" : "in";
        return (this.prevDist = i), n;
      },
    },
  };
let rt,
  at = {},
  ot = {},
  ct = {},
  dt = {
    Enter: "enter",
    Escape: "esc",
    Space: "space",
    ArrowLeft: "arrowleft",
    ArrowUp: "arrowup",
    ArrowRight: "arrowright",
    ArrowDown: "arrowdown",
  };
function lt(t = h, e) {
  t._pd && e.preventDefault(), t(e);
}
function ut(t) {
  let e = dt[t.code],
    i = at[e];
  (ct[e] = !0), lt(i, t);
}
function pt(t) {
  let e = dt[t.code],
    i = ot[e];
  (ct[e] = !1), lt(i, t);
}
function ft() {
  ct = {};
}
function gt(t, e, { handler: i = "keydown", preventDefault: n = !0 } = {}) {
  let s = "keydown" == i ? at : ot;
  (e._pd = n), [].concat(t).map((t) => (s[t] = e));
}
function wt(t = {}) {
  !(function () {
    let t;
    for (t = 0; t < 26; t++)
      dt["Key" + String.fromCharCode(t + 65)] = String.fromCharCode(t + 97);
    for (t = 0; t < 10; t++) dt["Digit" + t] = dt["Numpad" + t] = "" + t;
    window.addEventListener("keydown", ut),
      window.addEventListener("keyup", pt),
      window.addEventListener("blur", ft);
  })();
  let e = (function ({ radius: t = 5, canvas: e = w() } = {}) {
    let i = j.get(e);
    if (!i) {
      let n = window.getComputedStyle(e);
      (i = {
        x: 0,
        y: 0,
        radius: t,
        touches: { length: 0 },
        canvas: e,
        _cf: [],
        _lf: [],
        _o: [],
        _oo: null,
        _s: n,
      }),
        j.set(e, i);
    }
    return (
      e.addEventListener("mousedown", G),
      e.addEventListener("touchstart", G),
      e.addEventListener("mouseup", B),
      e.addEventListener("touchend", B),
      e.addEventListener("touchcancel", B),
      e.addEventListener("blur", q),
      e.addEventListener("mousemove", W),
      e.addEventListener("touchmove", W),
      i._t ||
        ((i._t = !0),
        p("tick", () => {
          (i._lf.length = 0),
            i._cf.map((t) => {
              i._lf.push(t);
            }),
            (i._cf.length = 0);
        })),
      i
    );
  })(t.pointer);
  return (
    st ||
      ((st = !0),
      p("touchChanged", (t, e) => {
        Object.keys(ht).map((i) => {
          let n,
            s = ht[i];
          (!it || it == i) &&
            e.length == s.touches &&
            [...Array(e.length).keys()].every((t) => e[t]) &&
            (n = s[t.type]?.(e) ?? "") &&
            nt[i + n] &&
            ((it = i), nt[i + n](t, e));
        });
      }),
      p("touchEnd", () => {
        it = 0;
      })),
    window.addEventListener("gamepadconnected", Q),
    window.addEventListener("gamepaddisconnected", Z),
    window.addEventListener("blur", tt),
    p("tick", et),
    { pointer: e }
  );
}
function mt() {
  (rt ??= Date.now()), (rt |= 0), (rt = (rt + 2654435769) | 0);
  let t = rt ^ (rt >>> 16);
  return (
    (t = Math.imul(t, 569420461)),
    (t ^= t >>> 15),
    (t = Math.imul(t, 1935289751)),
    ((t ^= t >>> 15) >>> 0) / 4294967296
  );
}
function _t(t, e, i = mt) {
  return ((i() * (e - t + 1)) | 0) + t;
}
function xt(t) {
  let e = [];
  return (
    t._dn
      ? e.push(t._dn)
      : t.children &&
        t.children.map((t) => {
          e = e.concat(xt(t));
        }),
    e
  );
}
class yt {
  constructor({
    id: t,
    name: e = t,
    objects: n = [],
    context: s = m(),
    cullObjects: h = !0,
    cullFunction: r = i,
    sortFunction: o,
    ...c
  }) {
    (this._o = []),
      Object.assign(this, {
        id: t,
        name: e,
        context: s,
        cullObjects: h,
        cullFunction: r,
        sortFunction: o,
        ...c,
      });
    let d = (this._dn = document.createElement("section"));
    (d.tabIndex = -1),
      (d.style =
        "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);"),
      (d.id = t),
      d.setAttribute("aria-label", e);
    let l = this;
    (this.camera = new (class extends X {
      set x(t) {
        (l.sx = t - this.centerX), (super.x = t);
      }
      get x() {
        return super.x;
      }
      set y(t) {
        (l.sy = t - this.centerY), (super.y = t);
      }
      get y() {
        return super.y;
      }
    })({
      context: s,
      anchor: { x: 0.5, y: 0.5 },
      render: this._rf.bind(this),
    })),
      this.add(n),
      (this._i = () => {
        this.context ??= m();
        let t = this.context.canvas,
          { width: e, height: i } = t,
          n = e / 2,
          s = i / 2;
        Object.assign(this.camera, {
          centerX: n,
          centerY: s,
          x: n,
          y: s,
          width: e,
          height: i,
        }),
          d.isConnected || a(d, t);
      }),
      this.context && this._i(),
      p("init", this._i);
  }
  set objects(t) {
    this.remove(this._o), this.add(t);
  }
  get objects() {
    return this._o;
  }
  get node() {
    return this._dn;
  }
  add(...t) {
    t.flat().map((t) => {
      this._o.push(t), (t.parent = this), this._dn.append(...xt(t));
    });
  }
  remove(...t) {
    t.flat().map((t) => {
      o(this._o, t),
        (t.parent = null),
        xt(t).map((t) => {
          a(t, this.context.canvas);
        });
    });
  }
  show() {
    this.hidden = this._dn.hidden = !1;
    let t = this._o.find((t) => t.focus);
    t ? t.focus(r) : this._dn.focus(r), this.onShow();
  }
  hide() {
    (this.hidden = this._dn.hidden = !0), this.onHide();
  }
  destroy() {
    var t, e;
    (t = "init"),
      (e = this._i),
      (u[t] = (u[t] || []).filter((t) => t != e)),
      this._dn.remove(),
      this._o.map((t) => t.destroy && t.destroy());
  }
  lookAt(t) {
    let { x: e, y: i } = t.world || t;
    (this.camera.x = e), (this.camera.y = i);
  }
  update(t) {
    this.hidden || this._o.map((e) => e.update && e.update(t));
  }
  _rf() {
    let {
      _o: t,
      context: e,
      _sx: i,
      _sy: n,
      camera: s,
      sortFunction: h,
      cullObjects: r,
      cullFunction: a,
    } = this;
    e.translate(i, n);
    let o = t;
    r && (o = o.filter((t) => a(s, t))),
      h && o.sort(h),
      o.map((t) => t.render && t.render());
  }
  render() {
    if (!this.hidden) {
      let { context: t, camera: e } = this,
        { x: i, y: n, centerX: s, centerY: h } = e;
      t.save(),
        (this._sx = s - i),
        (this._sy = h - n),
        t.translate(this._sx, this._sy),
        e.render(),
        t.restore();
    }
  }
  onShow() {}
  onHide() {}
}
function vt() {
  return new yt(...arguments);
}
function bt(t) {
  if (+t == t) return t;
  let e = [],
    i = t.split(".."),
    n = +i[0],
    s = +i[1],
    h = n;
  if (n < s) for (; h <= s; h++) e.push(h);
  else for (; h >= s; h--) e.push(h);
  return e;
}
class St {
  constructor({
    image: t,
    frameWidth: e,
    frameHeight: i,
    spacing: n = 0,
    margin: s = 0,
    animations: h,
  } = {}) {
    (this.animations = {}),
      (this.image = t),
      (this.frame = { width: e, height: i, spacing: n, margin: s }),
      (this._f = ((t.width - s) / e) | 0),
      this.createAnimations(h);
  }
  createAnimations(t) {
    let e, i;
    for (i in t) {
      let { frames: n, frameRate: s, loop: h } = t[i];
      (e = []),
        [].concat(n).map((t) => {
          e = e.concat(bt(t));
        }),
        (this.animations[i] = y({
          spriteSheet: this,
          frames: e,
          frameRate: s,
          loop: h,
          name: i,
        }));
    }
  }
}
function At() {
  return new St(...arguments);
}
let kt = 2147483648,
  Ct = 1073741824,
  Et = 536870912;
function Mt(t, e) {
  return (t / e) | 0;
}
function Lt(t, e) {
  return (t / e) | 0;
}
class Xt {
  constructor(t = {}) {
    let { width: e, height: i, tilewidth: n, tileheight: s, tilesets: h } = t,
      r = e * n,
      a = i * s,
      o = document.createElement("canvas");
    (o.width = r),
      (o.height = a),
      (this._c = o),
      (this._ctx = o.getContext("2d")),
      h.map((e) => {
        let { __k: i, location: n } = window,
          s = (i ? i.dm.get(t) : "") || n.href,
          { source: h } = e;
        if (h) {
          let t = i.d[i.u(h, s)];
          Object.keys(t).map((i) => {
            e[i] = t[i];
          });
        }
        let { image: r } = e;
        if ("" + r === r) {
          let t = i.i[i.u(r, s)];
          e.image = t;
        }
      }),
      Object.assign(this, {
        context: m(),
        layerMap: {},
        layerCanvases: {},
        mapwidth: r,
        mapheight: a,
        ...t,
      }),
      this.context && this._p(),
      p("init", () => {
        (this.context ??= m()), this._p();
      });
  }
  getPosition(t) {
    let e = w().getBoundingClientRect(),
      i = t.x - e.x,
      n = t.y - e.y;
    return {
      x: i,
      y: n,
      row: Mt(n, this.tileheight),
      col: Lt(i, this.tilewidth),
    };
  }
  layerCollidesWith(t, e) {
    let { tilewidth: i, tileheight: s, layerMap: h } = this,
      { x: r, y: a, width: o, height: c } = n(e),
      d = Mt(a, s),
      l = Lt(r, i),
      u = Mt(a + c, s),
      p = Lt(r + o, i),
      f = h[t];
    for (let t = d; t <= u; t++)
      for (let e = l; e <= p; e++) if (f.data[e + t * this.width]) return !0;
    return !1;
  }
  tileAtLayer(t, e) {
    let { layerMap: i, tileheight: n, tilewidth: s, width: h } = this,
      { row: r, col: a, x: o, y: c } = e,
      d = r ?? Mt(c, n),
      l = a ?? Lt(o, s);
    return i[t] ? i[t].data[d * h + l] : -1;
  }
  render(t = this._c, e = !0) {
    let { _d: i, context: n, sx: s = 0, sy: h = 0 } = this;
    i && this._p();
    let { width: r, height: a } = w(),
      o = Math.min(t.width, r),
      c = Math.min(t.height, a);
    n.drawImage(t, s, h, o, c, 0, 0, o, c);
  }
  renderLayer(t) {
    let { layerCanvases: e, layerMap: i } = this,
      n = i[t],
      s = e[t],
      h = s?.getContext("2d");
    if (!s) {
      let { mapwidth: i, mapheight: r } = this;
      (s = document.createElement("canvas")),
        (h = s.getContext("2d")),
        (s.width = i),
        (s.height = r),
        (e[t] = s),
        this._rl(n, h);
    }
    this.render(s, !1);
  }
  _p() {
    let { _ctx: t, layers: e = [], layerMap: i } = this;
    (this._d = !1),
      e.map((e) => {
        let { name: n, data: s, visible: h } = e;
        (e._d = !1), (i[n] = e), s && 0 != h && this._rl(e, t);
      });
  }
  _rl(t, e) {
    let { opacity: i, data: n = [] } = t,
      { tilesets: s, width: h, tilewidth: r, tileheight: a } = this;
    e.save(),
      (e.globalAlpha = i),
      n.map((t, i) => {
        if (!t) return;
        let n,
          o = 0,
          c = 0,
          d = t & kt,
          l = t & Ct,
          u = 0,
          p = 0,
          f = 0,
          g = 0,
          w = 0;
        (o = d || l),
          (w = (t &= 1073741823) & Et),
          w &&
            (d && l ? (f = 1) : d ? (u = 1) : l ? (p = 1) : (g = 1),
            (c = u || p || f || g),
            (t &= -536870913));
        for (
          let e = s.length - 1;
          e >= 0 && ((n = s[e]), !(t / n.firstgid >= 1));
          e--
        );
        let {
            image: m,
            spacing: _ = 0,
            margin: x = 0,
            firstgid: y,
            columns: v,
          } = n,
          b = t - y,
          S = v ?? (m.width / (r + _)) | 0,
          A = (i % h) * r,
          k = ((i / h) | 0) * a,
          C = x + (b % S) * (r + _),
          E = x + ((b / S) | 0) * (a + _);
        c
          ? (e.save(),
            e.translate(A + r / 2, k + a / 2),
            p || g ? e.rotate(-Math.PI / 2) : (u || f) && e.rotate(Math.PI / 2),
            (f || g) && e.scale(-1, 1),
            (A = -r / 2),
            (k = -a / 2))
          : o &&
            (e.save(),
            e.translate(A + (d ? r : 0), k + (l ? a : 0)),
            e.scale(d ? -1 : 1, l ? -1 : 1),
            (A = o ? 0 : A),
            (k = o ? 0 : k)),
          e.drawImage(m, C, E, r, a, A, k, r, a),
          (o || c) && e.restore();
      }),
      e.restore();
  }
}
function Yt() {
  return new Xt(...arguments);
}
export {
  V as GameLoop,
  X as GameObjectClass,
  vt as Scene,
  O as Sprite,
  Y as SpriteClass,
  At as SpriteSheet,
  Yt as TileEngine,
  t as angleToTarget,
  i as collides,
  s as depthSort,
  I as getPointer,
  _ as init,
  wt as initInput,
  E as loadImage,
  e as movePoint,
  gt as onKey,
  _t as randInt,
  H as track,
};
