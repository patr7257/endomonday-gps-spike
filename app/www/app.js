var KEY = 'gpsspike.points';
var watcherId = null;
var BG = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.BackgroundGeolocation;

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
}
function save(pts) { localStorage.setItem(KEY, JSON.stringify(pts)); }
function $(id) { return document.getElementById(id); }

function fmt(t) { return new Date(t).toISOString(); }

function render() {
  var pts = load();
  $('count').textContent = pts.length;
  $('running').textContent = watcherId ? 'yes' : 'no';
  var lines = ['total points: ' + pts.length];
  if (pts.length) {
    lines.push('first: ' + fmt(pts[0].t));
    lines.push('last: ' + fmt(pts[pts.length - 1].t));
    var max = 0, big = [];
    for (var i = 1; i < pts.length; i++) {
      var g = (pts[i].t - pts[i - 1].t) / 1000;
      if (g > max) max = g;
      if (g > 15) big.push(g.toFixed(1) + 's at ' + fmt(pts[i - 1].t) + ' -> ' + fmt(pts[i].t));
    }
    lines.push('largest gap: ' + max.toFixed(1) + ' s');
    lines.push('gaps over 15 s: ' + big.length);
    lines = lines.concat(big);
  }
  $('stats').textContent = lines.join('\n');
}

$('start').onclick = function () {
  if (!BG) { alert('BackgroundGeolocation plugin missing'); return; }
  if (watcherId) return;
  BG.addWatcher({
    backgroundMessage: 'GPS Spike is recording your location',
    backgroundTitle: 'GPS Spike',
    requestPermissions: true,
    stale: false,
    distanceFilter: 0
  }, function (loc, err) {
    if (err) {
      if (err.code === 'NOT_AUTHORIZED') { alert('Location not authorized'); }
      return;
    }
    var pts = load();
    pts.push({ t: Date.now(), lat: loc.latitude, lon: loc.longitude, acc: loc.accuracy });
    save(pts);
    render();
  }).then(function (id) { watcherId = id; render(); });
};

$('stop').onclick = function () {
  if (!watcherId) return;
  BG.removeWatcher({ id: watcherId }).then(function () { watcherId = null; render(); });
};
$('clear').onclick = function () { save([]); $('out').value = ''; render(); };
$('export').onclick = function () { $('out').value = JSON.stringify(load()); };

render();
