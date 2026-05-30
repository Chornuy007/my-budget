var form = { type: 'expense', user: 'Чоловік', source: 'Карта', curr: 'UAH' };
var list = [];
var sym = { UAH: 'UAH', USD: 'USD', EUR: 'EUR', PLN: 'PLN' };
var url = "https://googleapis.com";

function setParam(p, v) {
    form[p] = v;
    if(p==='type'){ document.getElementById('t-expense').className = "btn " + (v==='expense'?'active':''); document.getElementById('t-income').className = "btn " + (v==='income'?'active':''); }
    if(p==='user'){ document.getElementById('u-Чоловік').className = "btn " + (v==='Чоловік'?'active':''); document.getElementById('u-Дружина').className = "btn " + (v==='Дружина'?'active':''); }
    if(p==='source'){ document.getElementById('s-Карта').className = "btn " + (v==='Карта'?'active':''); document.getElementById('s-Готівка').className = "btn " + (v==='Готівка'?'active':''); }
    if(p==='curr'){ ['UAH','USD','EUR','PLN'].forEach(function(c) { document.getElementById('c-' + c).className = "btn " + (v===c?'active':''); }); }
}

async function addTransaction() {
    var am = document.getElementById('amount'); if (!am.value || am.value <= 0) return alert('Введіть суму!');
    var now = new Date(); var dateStr = now.toLocaleDateString('uk-UA') + ', ' + now.toLocaleTimeString('uk-UA', {hour:'2-digit', minute:'2-digit'});
    var data = { fields: { type: { stringValue: form.type }, user: { stringValue: form.user }, source: { stringValue: form.source }, curr: { stringValue: form.curr }, amount: { doubleValue: parseFloat(am.value) }, cat: { stringValue: document.getElementById('category').value }, date: { stringValue: dateStr }, timestamp: { integerValue: Date.now().toString() } } };
    try {
        var res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if(!res.ok) { var err = await res.json(); alert("Помилка хмари: " + err.error.message); return; }
        am.value = ''; loadTransactions();
    } catch (e) { alert("Помилка мережі: " + e.message); }
}

async function removeTransaction(docName) {
    if(confirm('Видалити цей запис?')) {
        try { await fetch("https://googleapis.com" + docName + "?key=AIzaSyA_WHG4yV4URzQh-H3tCrMCJSKdChRGoJo", { method: "DELETE" }); loadTransactions(); } catch (e) { alert("Помилка видалення"); }
    }
}

async function loadTransactions() {
    try {
        var res = await fetch(url + "&pageSize=100"); var data = await res.json(); list = [];
        if (data.documents) {
            data.documents.forEach(function(d) {
                var f = d.fields;
                list.push({ id: d.name, type: f.type.stringValue, user: f.user.stringValue, source: f.source.stringValue, curr: f.curr.stringValue, amount: parseFloat(f.amount.doubleValue || f.amount.integerValue), cat: f.cat.stringValue, date: f.date.stringValue, timestamp: parseInt(f.timestamp.integerValue) });
            });
            list.sort(function(a,b) { return b.timestamp - a.timestamp; });
        }
        updateUI();
    } catch (e) {}
}

function updateUI() {
    var el = document.getElementById('list'); el.innerHTML = '';
    var stEl = document.getElementById('stats-list'); stEl.innerHTML = '';
    var bal = { UAH: 0, USD: 0, EUR: 0, PLN: 0 }; var cats = {};
    list.forEach(function(t) {
        bal[t.curr] += (t.type === 'income' ? t.amount : -t.amount);
        if(t.type === 'expense') { if(!cats[t.cat]) cats[t.cat] = { UAH: 0, USD: 0, EUR: 0, PLN: 0 }; cats[t.cat][t.curr] += t.amount; }
        var uClass = t.user === 'Чоловік' ? 'u-male' : 'u-female';
        el.innerHTML += '<div class="item ' + (t.type==='income'?'inc':'') + '"><small><span class="u-tag ' + uClass + '">' + t.user + '</span> • <b>' + t.source + '</b><br>' + t.cat + '<br>' + t.date + '</small><div style="display:flex;align-items:center;"><b style="color:' + (t.type==='income'?'#059669':'#ef4444') + '">' + (t.type==='income'?'+':'-') + t.amount.toFixed(2) + ' ' + sym[t.curr] + '</b><button onclick="removeTransaction(\'' + t.id + '\')" class="del-btn">✕</button></div></div>';
    });
    var hasStats = false;
    for (var c in cats) {
        var text = []; for(var curr in cats[c]) { if(cats[c][curr] > 0) text.push(cats[c][curr].toFixed(2) + ' ' + sym[curr]); }
        if(text.length > 0) { hasStats = true; stEl.innerHTML += '<div class="stat-line"><span>' + c + '</span><b>' + text.join(' | ') + '</b></div>'; }
    }
    document.getElementById('stats-card').style.display = hasStats ? 'block' : 'none';
    ['UAH','USD','EUR','PLN'].forEach(function(c) { document.getElementById('b-' + c).innerText = bal[c].toFixed(2) + ' ' + sym[c]; });
}

loadTransactions();
setInterval(loadTransactions, 5000);
