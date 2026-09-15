/* ── 3D Print Calculator ──────────────────────────────────────────────────
   Standalone app. No build step, no internet. React + htm are bundled.
   Edit this file, then run build.ps1 to regenerate index.html.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var React    = window.React;
  var ReactDOM = window.ReactDOM;
  var htmFn    = window.htm && window.htm.default ? window.htm.default : window.htm;

  var useState      = React.useState;
  var useEffect     = React.useEffect;
  var useMemo       = React.useMemo;
  var createContext = React.createContext;
  var useContext    = React.useContext;

  var html = htmFn.bind(React.createElement);

  var STORAGE_KEY = 'printers_3d_v1';
  var PARTS_KEY   = 'saved_parts_3d_v1';
  var LANG_KEY    = 'app_lang';

  // ── Translations ────────────────────────────────────────────────────────
  var T = {
    en: {
      appTitle: '3D Printing Price Calculator',
      appSubtitle: 'Prices in Thai Baht (THB)',
      printerProfile: 'Printer Profile',
      addPrinter: '+ Add Printer',
      noPrinters: 'No printers yet. Add one to get started.',
      power: 'Power', filament: 'Filament', laborDay: 'Labor/Day',
      depreciation: 'Depreciation', buildVolume: 'Build Volume', profit: 'Profit',
      jobInfo: 'Job Information',
      partName: 'Part Name', partNamePlaceholder: 'e.g. Head, Body, Left Arm...',
      weight: 'Weight (g)', printHours: 'Print Hours',
      postProcess: 'Post Process (THB)', painting: 'Painting (THB)',
      modeling: 'Modeling Fee (THB)', delivery: 'Delivery (THB)',
      costBreakdown: 'Cost Breakdown',
      materialCost: 'Material Cost', electricityCost: 'Electricity Cost',
      laborCost: 'Labor Cost', depreciationCost: 'Depreciation Cost',
      postProcessLabel: 'Post Process', paintingLabel: 'Painting',
      modelingLabel: 'Modeling Fee', deliveryLabel: 'Delivery',
      wasteCost: 'Waste Cost', totalCost: 'Total Cost',
      sellingPrice: 'Selling Price', waste: 'Waste',
      savePart: 'Save This Part',
      partNameRequired: 'Please enter a part name first.',
      partSaved: '✓ Part saved!',
      savedParts: 'Saved Parts',
      noParts: 'No parts saved yet. Calculate and save a part above.',
      projectSummary: 'Project Summary',
      totalWeight: 'Total Weight', totalHours: 'Total Hours',
      totalCostSum: 'Total Cost', totalSelling: 'Total Selling Price',
      clearAll: 'Clear All', exportPrint: '🖨 Print Quotation',
      colPartName: 'Part', colPrinter: 'Printer',
      colWeight: 'Weight', colHours: 'Hours',
      colCost: 'Cost (THB)', colSelling: 'Selling (THB)',
      clearConfirmTitle: 'Clear All Parts?',
      clearConfirmMsg: 'This will permanently delete all saved parts.',
      quotationTitle: '3D Printing Quotation',
      addNewPrinter: 'Add New Printer', editPrinter: 'Edit Printer',
      printerName: 'Printer Name', printerNamePlaceholder: 'e.g. Bambu Lab P1S',
      powerW: 'Power (W)', laborDayTHB: 'Labor / Day (THB)',
      filamentKg: 'Filament (THB / kg)', electricityKwh: 'Electricity (THB / kWh)',
      depreciationHr: 'Depreciation (THB / hr)', buildVolumeMm: 'Build Volume (mm)',
      buildVolumePlaceholder: '256x256x256',
      wastePercent: 'Waste %', profitPercent: 'Profit %',
      cancel: 'Cancel', saveChanges: 'Save Changes', addPrinterBtn: 'Add Printer',
      deletePrinter: 'Delete Printer?', deleteWarning: 'will be permanently removed.',
      delete: 'Delete', selectPrinterHint: 'Select a printer to see cost breakdown',
      parts: 'parts', total: 'TOTAL', printSave: '🖨️ Print / Save PDF',
      noStorage: 'This browser is blocking saved data. Printers and parts will be lost when you close the page — use Print Quotation to keep a copy.'
    },
    lo: {
      appTitle: 'ເຄື່ອງຄິດໄລລາຄາພິມ 3D',
      appSubtitle: 'ລາຄາໃນສະກຸນເງິນໄທບາດ (THB)',
      printerProfile: 'ຂໍ້ມູນເຄື່ອງພິມ',
      addPrinter: '+ ເພີ່ມເຄື່ອງພິມ',
      noPrinters: 'ຍັງບໍ່ມີເຄື່ອງພິມ. ເພີ່ມເຄື່ອງພິມເພື່ອເລີ່ມຕົ້ນ.',
      power: 'ກຳລັງໄຟ', filament: 'ເສັ້ນໄຫມ', laborDay: 'ຄ່າແຮງ/ວັນ',
      depreciation: 'ຄ່າເສື່ອມ', buildVolume: 'ຂະໜາດພິມ', profit: 'ກຳໄລ',
      jobInfo: 'ຂໍ້ມູນງານ',
      partName: 'ຊື່ຊິ້ນສ່ວນ', partNamePlaceholder: 'ເຊັ່ນ: ຫົວ, ລຳຕົວ, ແຂນຊ້າຍ...',
      weight: 'ນ້ຳໜັກ (ກ)', printHours: 'ຊົ່ວໂມງພິມ',
      postProcess: 'ຄ່າເກັບລາຍລະອຽດ (ບາດ)', painting: 'ຄ່າເຮັດສີ (ບາດ)',
      modeling: 'ຄ່າຂື້ນແບບ (ບາດ)', delivery: 'ຄ່າສົ່ງ (ບາດ)',
      costBreakdown: 'ລາຍລະອຽດຄ່າໃຊ້ຈ່າຍ',
      materialCost: 'ຄ່າວັດສະດຸ', electricityCost: 'ຄ່າໄຟຟ້າ',
      laborCost: 'ຄ່າແຮງງານ', depreciationCost: 'ຄ່າເສື່ອມລາຄາ',
      postProcessLabel: 'ຄ່າເກັບລາຍລະອຽດ', paintingLabel: 'ຄ່າເຮັດສີ',
      modelingLabel: 'ຄ່າຂື້ນແບບ', deliveryLabel: 'ຄ່າສົ່ງ',
      wasteCost: 'ຄ່າສິ່ງເສດ', totalCost: 'ຄ່າລວມ',
      sellingPrice: 'ລາຄາຂາຍ', waste: 'ສິ່ງເສດ',
      savePart: 'ບັນທຶກຊິ້ນສ່ວນ',
      partNameRequired: 'ກະລຸນາໃສ່ຊື່ຊິ້ນສ່ວນກ່ອນ.',
      partSaved: '✓ ບັນທຶກແລ້ວ!',
      savedParts: 'ຊິ້ນສ່ວນທີ່ບັນທຶກ',
      noParts: 'ຍັງບໍ່ມີຊິ້ນສ່ວນ. ຄຳນວນແລ້ວກົດບັນທຶກ.',
      projectSummary: 'ສະຫຼຸບໂຄງການ',
      totalWeight: 'ນ້ຳໜັກລວມ', totalHours: 'ຊົ່ວໂມງລວມ',
      totalCostSum: 'ຄ່າໃຊ້ຈ່າຍລວມ', totalSelling: 'ລາຄາຂາຍລວມ',
      clearAll: 'ລຶບທັງໝົດ', exportPrint: '🖨 ພິມໃບສະເໜີ',
      colPartName: 'ຊິ້ນສ່ວນ', colPrinter: 'ເຄື່ອງພິມ',
      colWeight: 'ນ້ຳໜັກ', colHours: 'ຊົ່ວໂມງ',
      colCost: 'ຄ່າລວມ (ບາດ)', colSelling: 'ລາຄາຂາຍ (ບາດ)',
      clearConfirmTitle: 'ລຶບຊິ້ນສ່ວນທັງໝົດ?',
      clearConfirmMsg: 'ຈະລຶບຊິ້ນສ່ວນທີ່ບັນທຶກທັງໝົດ ບໍ່ສາມາດກູ້ຄືນໄດ້.',
      quotationTitle: 'ໃບສະເໜີລາຄາພິມ 3D',
      addNewPrinter: 'ເພີ່ມເຄື່ອງພິມໃໝ່', editPrinter: 'ແກ້ໄຂເຄື່ອງພິມ',
      printerName: 'ຊື່ເຄື່ອງພິມ', printerNamePlaceholder: 'ເຊັ່ນ: Bambu Lab P1S',
      powerW: 'ກຳລັງໄຟ (W)', laborDayTHB: 'ຄ່າແຮງ / ວັນ (ບາດ)',
      filamentKg: 'ເສັ້ນໄຫມ (ບາດ / ກກ)', electricityKwh: 'ຄ່າໄຟ (ບາດ / kWh)',
      depreciationHr: 'ຄ່າເສື່ອມ (ບາດ / ຊມ)', buildVolumeMm: 'ຂະໜາດພິມ (ມມ)',
      buildVolumePlaceholder: '256x256x256',
      wastePercent: '% ສິ່ງເສດ', profitPercent: '% ກຳໄລ',
      cancel: 'ຍົກເລີກ', saveChanges: 'ບັນທຶກ', addPrinterBtn: 'ເພີ່ມເຄື່ອງພິມ',
      deletePrinter: 'ລຶບເຄື່ອງພິມ?', deleteWarning: 'ຈະຖືກລຶບອອກຖາວອນ.',
      delete: 'ລຶບ', selectPrinterHint: 'ເລືອກເຄື່ອງພິມເພື່ອເບິ່ງລາຍລະອຽດ',
      parts: 'ຊິ້ນ', total: 'ລວມ',
      printSave: '🖨️ ພິມ / ບັນທຶກ PDF',
      noStorage: 'Browser ນີ້ບໍ່ອະນຸຍາດໃຫ້ບັນທຶກຂໍ້ມູນ. ເຄື່ອງພິມ ແລະ ຊິ້ນສ່ວນຈະຫາຍເມື່ອປິດໜ້ານີ້ — ໃຫ້ກົດ ພິມໃບສະເໜີ ເພື່ອເກັບໄວ້.'
    }
  };

  var LangContext = createContext('en');
  function useLang() {
    var lang = useContext(LangContext);
    return function (k) { return T[lang][k] !== undefined ? T[lang][k] : k; };
  }

  // Placeholder pricing only. Wattage and build volume are public hardware
  // specs, but every money figure below is a round neutral number — set your
  // own via the edit button. Your values stay in this browser and are never
  // part of the source.
  var DEFAULT_PRINTERS = [
    { id:'1', name:'Elegoo OrangeStorm Giga', watt:2000, laborPerDay:500, filamentPrice:500, electricityPrice:4, depreciationPerHour:10, buildVolume:'800x800x1000', wastePercent:10, profitPercent:30 },
    { id:'2', name:'Bambu Lab A1 Combo',      watt:350,  laborPerDay:500, filamentPrice:500, electricityPrice:4, depreciationPerHour:10, buildVolume:'256x256x256',   wastePercent:10, profitPercent:30 },
    { id:'3', name:'Kobra 2 Max',             watt:500,  laborPerDay:500, filamentPrice:500, electricityPrice:4, depreciationPerHour:10, buildVolume:'420x420x500',   wastePercent:10, profitPercent:30 }
  ];

  function fmt(n) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }
  // Some browsers block localStorage on file:// URLs. Detect it once so we can
  // warn the user instead of silently losing their saved parts.
  var STORAGE_OK = (function () {
    try {
      localStorage.setItem('__probe', '1');
      localStorage.removeItem('__probe');
      return true;
    } catch (e) { return false; }
  })();

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var val = JSON.parse(raw);
      return val === null || val === undefined ? fallback : val;
    } catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* quota / private mode */ }
  }

  // ── Small components ────────────────────────────────────────────────────
  function Field(props) {
    var type = props.type || 'number';
    return html`
      <div className="field">
        <label>${props.label}</label>
        <input className="input" type=${type} name=${props.name} value=${props.value}
          onChange=${props.onChange} placeholder=${props.placeholder || ''}
          required=${!!props.required} />
      </div>`;
  }

  function JobInput(props) {
    var type = props.type || 'number';

    // The field keeps what the user typed as a string. If we fed the parsed
    // number straight back into value=, clearing the box would snap it to "0"
    // and typing "5" would produce "05". The parent only ever sees a number.
    var st = useState(String(props.value));
    var text = st[0], setText = st[1];

    function toNumber(s) {
      var n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    }

    // Resync when the parent changes the value from outside (e.g. partName
    // is cleared after saving a part) without clobbering in-progress typing
    // like "" or "0." that already mean the same number.
    useEffect(function () {
      if (type === 'text') { if (props.value !== text) setText(props.value); return; }
      if (toNumber(text) !== props.value) setText(String(props.value));
    }, [props.value]);

    function onChange(e) {
      var v = e.target.value;
      if (type === 'text') { setText(v); props.onChange(v); return; }
      // "05" -> "5", but leave "0." and "0" alone.
      v = v.replace(/^0+(?=\d)/, '');
      setText(v);
      props.onChange(toNumber(v));
    }

    // Clicking into a box that shows 0 selects it, so typing replaces it.
    function onFocus(e) { if (type !== 'text') e.target.select(); }

    return html`
      <div className="field">
        <label>${props.label}</label>
        <input className="input" type=${type} value=${text} min="0"
          placeholder=${props.placeholder || ''}
          onChange=${onChange} onFocus=${onFocus} />
      </div>`;
  }

  function Chip(props) {
    return html`
      <div className="chip">
        <div className="chip-label">${props.label}</div>
        <div className="chip-value">${props.value}</div>
      </div>`;
  }

  function SumChip(props) {
    return html`
      <div className=${'sum-chip' + (props.highlight ? ' hl' : '')}>
        <div className="sum-label">${props.label}</div>
        <div className="sum-value">${props.value}</div>
      </div>`;
  }

  function CostRow(props) {
    return html`
      <div className=${'cost-row' + (props.dim ? ' dim' : '')}>
        <span>${props.label}</span>
        <span className="amt">${fmt(props.value)} THB</span>
      </div>`;
  }

  function LangToggle(props) {
    return html`
      <div className="lang-toggle">
        ${['en','lo'].map(function (l) {
          return html`
            <button key=${l} onClick=${function () { props.setLang(l); }}
              className=${'lang-btn' + (props.lang === l ? ' on' : '')}>
              ${l === 'en' ? 'ENG' : 'LAO'}
            </button>`;
        })}
      </div>`;
  }

  // ── Printer modal ───────────────────────────────────────────────────────
  function PrinterModal(props) {
    var t = useLang();
    var blank = { name:'', watt:'', laborPerDay:'', filamentPrice:'', electricityPrice:4,
                  depreciationPerHour:'', buildVolume:'', wastePercent:10, profitPercent:30 };
    var st = useState(props.printer ? Object.assign({}, props.printer) : blank);
    var form = st[0], setForm = st[1];

    function set(e) {
      var name = e.target.name, value = e.target.value;
      setForm(function (p) { var n = Object.assign({}, p); n[name] = value; return n; });
    }

    function submit(e) {
      e.preventDefault();
      props.onSave({
        id: form.id || String(Date.now()),
        name: form.name,
        watt: parseFloat(form.watt) || 0,
        laborPerDay: parseFloat(form.laborPerDay) || 0,
        filamentPrice: parseFloat(form.filamentPrice) || 0,
        electricityPrice: parseFloat(form.electricityPrice) || 0,
        depreciationPerHour: parseFloat(form.depreciationPerHour) || 0,
        buildVolume: form.buildVolume,
        wastePercent: parseFloat(form.wastePercent) || 0,
        profitPercent: parseFloat(form.profitPercent) || 0
      });
    }

    return html`
      <div className="backdrop">
        <div className="modal">
          <div className="modal-hdr">
            <h2>${props.printer ? t('editPrinter') : t('addNewPrinter')}</h2>
            <button className="modal-x" onClick=${props.onClose}>✕</button>
          </div>
          <form className="modal-form" onSubmit=${submit}>
            <div className="modal-body">
              <${Field} label=${t('printerName')} name="name" type="text"
                value=${form.name} onChange=${set} required=${true}
                placeholder=${t('printerNamePlaceholder')} />
              <div className="grid2">
                <${Field} label=${t('powerW')}         name="watt"                value=${form.watt}                onChange=${set} required=${true} placeholder="350" />
                <${Field} label=${t('laborDayTHB')}    name="laborPerDay"         value=${form.laborPerDay}         onChange=${set} required=${true} placeholder="500" />
                <${Field} label=${t('filamentKg')}     name="filamentPrice"       value=${form.filamentPrice}       onChange=${set} required=${true} placeholder="500" />
                <${Field} label=${t('electricityKwh')} name="electricityPrice"    value=${form.electricityPrice}    onChange=${set} required=${true} placeholder="4" />
                <${Field} label=${t('depreciationHr')} name="depreciationPerHour" value=${form.depreciationPerHour} onChange=${set} required=${true} placeholder="10" />
                <${Field} label=${t('buildVolumeMm')}  name="buildVolume" type="text" value=${form.buildVolume} onChange=${set} placeholder=${t('buildVolumePlaceholder')} />
                <${Field} label=${t('wastePercent')}   name="wastePercent"        value=${form.wastePercent}        onChange=${set} required=${true} />
                <${Field} label=${t('profitPercent')}  name="profitPercent"       value=${form.profitPercent}       onChange=${set} required=${true} />
              </div>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn btn-gray btn-lg btn-flex1" onClick=${props.onClose}>${t('cancel')}</button>
              <button type="submit" className="btn btn-accent btn-lg btn-flex1">${props.printer ? t('saveChanges') : t('addPrinterBtn')}</button>
            </div>
          </form>
        </div>
      </div>`;
  }

  // ── Confirm dialog ──────────────────────────────────────────────────────
  function ConfirmDialog(props) {
    var t = useLang();
    return html`
      <div className="backdrop">
        <div className="confirm">
          <div className="confirm-icon">${props.icon}</div>
          <h3>${props.title}</h3>
          ${props.name ? html`<p className="who">"<strong>${props.name}</strong>"</p>` : null}
          <p className="msg">${props.message}</p>
          <div className="confirm-foot">
            <button className="btn btn-gray btn-lg btn-flex1" onClick=${props.onCancel}>${t('cancel')}</button>
            <button className="btn btn-red btn-lg btn-flex1" onClick=${props.onConfirm}>${props.confirmLabel}</button>
          </div>
        </div>
      </div>`;
  }

  // ── Saved parts table ───────────────────────────────────────────────────
  function SavedPartsTable(props) {
    var t = useLang();
    var parts = props.parts;

    var sum = useMemo(function () {
      return {
        weight:  parts.reduce(function (s, p) { return s + p.weight; },       0),
        hours:   parts.reduce(function (s, p) { return s + p.hours; },        0),
        cost:    parts.reduce(function (s, p) { return s + p.totalCost; },    0),
        selling: parts.reduce(function (s, p) { return s + p.sellingPrice; }, 0)
      };
    }, [parts]);

    return html`
      <div className="card">
        <div className="card-hdr">
          <h2 className="card-title">
            ${t('savedParts')}
            ${parts.length > 0 ? html`<span className="badge">${parts.length}</span>` : null}
          </h2>
          ${parts.length > 0 ? html`
            <div style=${{ display:'flex', gap:'8px' }}>
              <button className="btn btn-green" onClick=${props.onPrint}>${t('exportPrint')}</button>
              <button className="btn btn-red"   onClick=${props.onClear}>${t('clearAll')}</button>
            </div>` : null}
        </div>

        ${parts.length === 0
          ? html`
            <div className="empty">
              <div className="empty-icon">📦</div>
              <p>${t('noParts')}</p>
            </div>`
          : html`
            <div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>${t('colPartName')}</th>
                      <th>${t('colPrinter')}</th>
                      <th className="r">${t('colWeight')}</th>
                      <th className="r">${t('colHours')}</th>
                      <th className="r">${t('colCost')}</th>
                      <th className="r">${t('colSelling')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    ${parts.map(function (p) {
                      return html`
                        <tr key=${p.id}>
                          <td className="name">${p.partName}</td>
                          <td className="printer">${p.printerName}</td>
                          <td className="num r">${p.weight}g</td>
                          <td className="num r">${p.hours}h</td>
                          <td className="num r">${fmt(p.totalCost)}</td>
                          <td className="sell r">${fmt(p.sellingPrice)}</td>
                          <td className="x">
                            <button className="del-x" onClick=${function () { props.onDelete(p.id); }}>✕</button>
                          </td>
                        </tr>`;
                    })}
                  </tbody>
                </table>
              </div>

              <div className="summary">
                <h3 className="summary-title">${t('projectSummary')}</h3>
                <div className="summary-grid">
                  <${SumChip} label=${t('totalWeight')}  value=${sum.weight.toLocaleString('en-US') + ' g'} />
                  <${SumChip} label=${t('totalHours')}   value=${sum.hours.toFixed(1) + ' hr'} />
                  <${SumChip} label=${t('totalCostSum')} value=${'฿' + fmt(sum.cost)} />
                  <${SumChip} label=${t('totalSelling')} value=${'฿' + fmt(sum.selling)} highlight=${true} />
                </div>
              </div>
            </div>`}
      </div>`;
  }

  // ── App ─────────────────────────────────────────────────────────────────
  function App() {
    var l  = useState(function () { return localStorage.getItem(LANG_KEY) || 'en'; });
    var lang = l[0], setLang = l[1];

    var pr = useState(function () {
      var p = load(STORAGE_KEY, null);
      return (p && p.length) ? p : DEFAULT_PRINTERS;
    });
    var printers = pr[0], setPrinters = pr[1];

    var sel = useState(function () {
      var p = load(STORAGE_KEY, null);
      var list = (p && p.length) ? p : DEFAULT_PRINTERS;
      return list[0] ? list[0].id : null;
    });
    var selectedId = sel[0], setSelectedId = sel[1];

    var sp = useState(function () {
      var v = load(PARTS_KEY, []);
      return Array.isArray(v) ? v : [];
    });
    var savedParts = sp[0], setSavedParts = sp[1];

    var j = useState({ partName:'', weight:1000, hours:10, post:0, paint:0, modeling:0, delivery:0 });
    var job = j[0], setJob = j[1];

    var m  = useState(false);  var showModal = m[0], setShowModal = m[1];
    var ep = useState(null);   var editingPrinter = ep[0], setEditingPrinter = ep[1];
    var dt = useState(null);   var deleteTarget = dt[0], setDeleteTarget = dt[1];
    var cc = useState(false);  var showClearConfirm = cc[0], setShowClearConfirm = cc[1];
    var se = useState('');     var saveError = se[0], setSaveError = se[1];
    var ss = useState(false);  var saveSuccess = ss[0], setSaveSuccess = ss[1];

    useEffect(function () { save(STORAGE_KEY, printers);   }, [printers]);
    useEffect(function () { save(PARTS_KEY,   savedParts); }, [savedParts]);
    useEffect(function () { try { localStorage.setItem(LANG_KEY, lang); } catch (e) {} }, [lang]);

    var printer = null;
    for (var i = 0; i < printers.length; i++) {
      if (printers[i].id === selectedId) { printer = printers[i]; break; }
    }

    function t(k) { return T[lang][k] !== undefined ? T[lang][k] : k; }

    var result = useMemo(function () {
      if (!printer) return null;
      var material     = (job.weight / 1000) * printer.filamentPrice;
      var electric     = (printer.watt / 1000) * job.hours * printer.electricityPrice;
      var labor        = (printer.laborPerDay / 8) * job.hours;
      var depreciation = printer.depreciationPerHour * job.hours;
      var base         = material + electric + labor + depreciation +
                         job.post + job.paint + job.modeling + job.delivery;
      var waste        = base * (printer.wastePercent / 100);
      var total        = base + waste;
      var selling      = Math.ceil(total * (1 + printer.profitPercent / 100) / 10) * 10;
      return { material:material, electric:electric, labor:labor,
               depreciation:depreciation, waste:waste, total:total, selling:selling };
    }, [printer, job]);

    // ── Printer actions ──
    function openAdd()    { setEditingPrinter(null); setShowModal(true); }
    function openEdit()   { setEditingPrinter(printer); setShowModal(true); }
    function closeModal() { setShowModal(false); setEditingPrinter(null); }

    function savePrinter(p) {
      if (editingPrinter) {
        setPrinters(function (prev) {
          return prev.map(function (x) { return x.id === p.id ? p : x; });
        });
      } else {
        setPrinters(function (prev) { return prev.concat([p]); });
        setSelectedId(p.id);
      }
      closeModal();
    }

    function deletePrinter() {
      var next = printers.filter(function (p) { return p.id !== deleteTarget.id; });
      setPrinters(next);
      if (selectedId === deleteTarget.id) setSelectedId(next[0] ? next[0].id : null);
      setDeleteTarget(null);
    }

    // ── Part actions ──
    function savePart() {
      if (!job.partName.trim()) { setSaveError(t('partNameRequired')); return; }
      if (!result || !printer) return;
      setSaveError('');
      setSavedParts(function (prev) {
        return prev.concat([{
          id: String(Date.now()),
          partName: job.partName.trim(),
          printerName: printer.name,
          printerId: printer.id,
          weight: job.weight, hours: job.hours,
          post: job.post, paint: job.paint, modeling: job.modeling, delivery: job.delivery,
          materialCost: result.material, electricCost: result.electric,
          laborCost: result.labor, depreciationCost: result.depreciation,
          wasteCost: result.waste, totalCost: result.total, sellingPrice: result.selling,
          savedAt: new Date().toISOString()
        }]);
      });
      setSaveSuccess(true);
      setJob(function (p) { var n = Object.assign({}, p); n.partName = ''; return n; });
      setTimeout(function () { setSaveSuccess(false); }, 2500);
    }

    function deletePart(id) {
      setSavedParts(function (prev) { return prev.filter(function (p) { return p.id !== id; }); });
    }
    function clearAllParts() { setSavedParts([]); setShowClearConfirm(false); }

    // ── Print quotation ──
    function printQuotation() {
      var s = {
        weight:  savedParts.reduce(function (a, p) { return a + p.weight; },       0),
        hours:   savedParts.reduce(function (a, p) { return a + p.hours; },        0),
        cost:    savedParts.reduce(function (a, p) { return a + p.totalCost; },    0),
        selling: savedParts.reduce(function (a, p) { return a + p.sellingPrice; }, 0)
      };
      var dateStr = new Date().toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric' });

      var rows = savedParts.map(function (p, i) {
        return '<tr>' +
          '<td style="color:#94a3b8">' + (i + 1) + '</td>' +
          '<td><strong>' + esc(p.partName) + '</strong></td>' +
          '<td style="color:#64748b;font-size:11px">' + esc(p.printerName) + '</td>' +
          '<td class="r">' + p.weight.toLocaleString('en-US') + 'g</td>' +
          '<td class="r">' + p.hours + 'h</td>' +
          '<td class="r">' + fmt(p.totalCost) + '</td>' +
          '<td class="r sell">' + fmt(p.sellingPrice) + '</td>' +
        '</tr>';
      }).join('');

      var doc =
'<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + esc(t('quotationTitle')) + '</title><style>' +
'*{box-sizing:border-box;margin:0;padding:0}' +
'body{font-family:"Segoe UI","Noto Sans Lao",Arial,sans-serif;padding:28px 32px;color:#1e293b;font-size:13px}' +
'.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #e2e8f0}' +
'h1{font-size:20px;color:#0891b2;margin-bottom:4px}' +
'.date{color:#94a3b8;font-size:12px;margin-top:4px}' +
'table{width:100%;border-collapse:collapse;margin-bottom:20px}' +
'thead{background:#f8fafc}' +
'th{padding:9px 10px;text-align:left;font-weight:600;color:#475569;border-bottom:2px solid #e2e8f0;font-size:11px;text-transform:uppercase;letter-spacing:.04em}' +
'th.r,td.r{text-align:right}td.r{font-family:monospace}' +
'td{padding:9px 10px;border-bottom:1px solid #f1f5f9;color:#334155}' +
'tfoot td{background:#f1f5f9;font-weight:700;border-top:2px solid #cbd5e1;padding:11px 10px}' +
'.sell{color:#0891b2;font-weight:700}' +
'.summary{background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:16px}' +
'.summary h2{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#0369a1;margin-bottom:12px;font-weight:700}' +
'.sg{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
'.sc label{font-size:11px;color:#64748b;display:block;margin-bottom:2px}' +
'.sc span{font-size:15px;font-weight:700;color:#0f172a}' +
'.sc.hl span{color:#0891b2;font-size:18px}' +
'.print-btn{margin-bottom:20px;padding:10px 22px;background:#0891b2;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:700}' +
'@media print{.no-print{display:none}body{padding:15px}}' +
'</style></head><body>' +
'<button class="print-btn no-print" onclick="window.print()">' + t('printSave') + '</button>' +
'<div class="header"><div><h1>🖨️ ' + esc(t('quotationTitle')) + '</h1>' +
'<div class="date">' + dateStr + '</div></div>' +
'<div style="text-align:right;color:#94a3b8;font-size:12px">' + savedParts.length + ' ' + esc(t('parts')) + '</div></div>' +
'<table><thead><tr><th>#</th><th>' + esc(t('colPartName')) + '</th><th>' + esc(t('colPrinter')) + '</th>' +
'<th class="r">' + esc(t('colWeight')) + '</th><th class="r">' + esc(t('colHours')) + '</th>' +
'<th class="r">' + esc(t('totalCostSum')) + ' (THB)</th><th class="r">' + esc(t('totalSelling')) + ' (THB)</th></tr></thead>' +
'<tbody>' + rows + '</tbody>' +
'<tfoot><tr><td colspan="3" style="text-align:right;color:#475569">' + esc(t('total')) + '</td>' +
'<td class="r">' + s.weight.toLocaleString('en-US') + 'g</td>' +
'<td class="r">' + s.hours.toFixed(1) + 'h</td>' +
'<td class="r">' + fmt(s.cost) + '</td>' +
'<td class="r sell">฿' + fmt(s.selling) + '</td></tr></tfoot></table>' +
'<div class="summary"><h2>' + esc(t('projectSummary')) + '</h2><div class="sg">' +
'<div class="sc"><label>' + esc(t('totalWeight')) + '</label><span>' + s.weight.toLocaleString('en-US') + ' g</span></div>' +
'<div class="sc"><label>' + esc(t('totalHours')) + '</label><span>' + s.hours.toFixed(1) + ' hr</span></div>' +
'<div class="sc"><label>' + esc(t('totalCostSum')) + '</label><span>฿' + fmt(s.cost) + '</span></div>' +
'<div class="sc hl"><label>' + esc(t('totalSelling')) + '</label><span>฿' + fmt(s.selling) + '</span></div>' +
'</div></div></body></html>';

      var win = window.open('', '_blank', 'width=860,height=700');
      if (!win) { alert('Please allow pop-ups to print the quotation.'); return; }
      win.document.write(doc);
      win.document.close();
    }

    // ── Render ──
    return html`
      <${LangContext.Provider} value=${lang}>
        <div className="wrap">
          <div className="container">

            <div className="hdr">
              <div>
                <h1>${t('appTitle')}</h1>
                <p className="sub">${t('appSubtitle')}</p>
              </div>
              <${LangToggle} lang=${lang} setLang=${setLang} />
            </div>

            ${!STORAGE_OK ? html`<div className="warn">⚠️ ${t('noStorage')}</div>` : null}

            <div className="card">
              <div className="card-hdr">
                <h2 className="card-title">${t('printerProfile')}</h2>
                <button className="btn btn-accent" onClick=${openAdd}>${t('addPrinter')}</button>
              </div>
              ${printers.length === 0
                ? html`
                  <div className="empty">
                    <div className="empty-icon">🖨️</div>
                    <p>${t('noPrinters')}</p>
                  </div>`
                : html`
                  <div>
                    <div className="row">
                      <select className="select" value=${selectedId || ''}
                        onChange=${function (e) { setSelectedId(e.target.value); }}>
                        ${printers.map(function (p) {
                          return html`<option key=${p.id} value=${p.id}>${p.name}</option>`;
                        })}
                      </select>
                      ${printer ? html`
                        <button className="icon-btn" onClick=${openEdit}>✏️</button>
                        <button className="icon-btn danger"
                          onClick=${function () { setDeleteTarget(printer); }}>🗑️</button>` : null}
                    </div>
                    ${printer ? html`
                      <div className="grid3">
                        <${Chip} label=${t('power')}        value=${printer.watt + ' W'} />
                        <${Chip} label=${t('filament')}     value=${'฿' + printer.filamentPrice + '/kg'} />
                        <${Chip} label=${t('laborDay')}     value=${'฿' + printer.laborPerDay} />
                        <${Chip} label=${t('depreciation')} value=${'฿' + printer.depreciationPerHour + '/hr'} />
                        <${Chip} label=${t('buildVolume')}  value=${printer.buildVolume || '—'} />
                        <${Chip} label=${t('profit')}       value=${printer.profitPercent + '%'} />
                      </div>` : null}
                  </div>`}
            </div>

            <div className="card">
              <h2 className="card-title" style=${{ marginBottom:'12px' }}>${t('jobInfo')}</h2>
              <div className="grid2">
                <div className="span2">
                  <${JobInput} label=${t('partName')} value=${job.partName} type="text"
                    placeholder=${t('partNamePlaceholder')}
                    onChange=${function (v) { setJob(function (p) { var n = Object.assign({}, p); n.partName = v; return n; }); }} />
                </div>
                <${JobInput} label=${t('weight')}      value=${job.weight}
                  onChange=${function (v) { setJob(function (p) { var n = Object.assign({}, p); n.weight = v; return n; }); }} />
                <${JobInput} label=${t('printHours')}  value=${job.hours}
                  onChange=${function (v) { setJob(function (p) { var n = Object.assign({}, p); n.hours = v; return n; }); }} />
                <${JobInput} label=${t('postProcess')} value=${job.post}
                  onChange=${function (v) { setJob(function (p) { var n = Object.assign({}, p); n.post = v; return n; }); }} />
                <${JobInput} label=${t('painting')}    value=${job.paint}
                  onChange=${function (v) { setJob(function (p) { var n = Object.assign({}, p); n.paint = v; return n; }); }} />
                <${JobInput} label=${t('modeling')}    value=${job.modeling}
                  onChange=${function (v) { setJob(function (p) { var n = Object.assign({}, p); n.modeling = v; return n; }); }} />
                <${JobInput} label=${t('delivery')}    value=${job.delivery}
                  onChange=${function (v) { setJob(function (p) { var n = Object.assign({}, p); n.delivery = v; return n; }); }} />
              </div>
            </div>

            ${result ? html`
              <div className="card">
                <h2 className="card-title" style=${{ marginBottom:'16px' }}>${t('costBreakdown')}</h2>
                <div className="cost-list">
                  <${CostRow} label=${t('materialCost')}     value=${result.material}     dim=${true} />
                  <${CostRow} label=${t('electricityCost')}  value=${result.electric}     dim=${true} />
                  <${CostRow} label=${t('laborCost')}        value=${result.labor}        dim=${true} />
                  <${CostRow} label=${t('depreciationCost')} value=${result.depreciation} dim=${true} />
                  ${job.post     > 0 ? html`<${CostRow} label=${t('postProcessLabel')} value=${job.post}     dim=${true} />` : null}
                  ${job.paint    > 0 ? html`<${CostRow} label=${t('paintingLabel')}    value=${job.paint}    dim=${true} />` : null}
                  ${job.modeling > 0 ? html`<${CostRow} label=${t('modelingLabel')}    value=${job.modeling} dim=${true} />` : null}
                  ${job.delivery > 0 ? html`<${CostRow} label=${t('deliveryLabel')}    value=${job.delivery} dim=${true} />` : null}
                  <${CostRow} label=${t('wasteCost')} value=${result.waste} dim=${true} />
                  <div className="cost-sep">
                    <${CostRow} label=${t('totalCost')} value=${result.total} />
                  </div>
                </div>

                <div className="price-box">
                  <div className="price-label">${t('sellingPrice')}</div>
                  <div className="price-foot">
                    <div className="price-main">฿${fmt(result.selling)}</div>
                    <div className="price-meta">
                      <div>${t('waste')}: ${printer ? printer.wastePercent : 0}%</div>
                      <div>${t('profit')}: ${printer ? printer.profitPercent : 0}%</div>
                    </div>
                  </div>
                </div>

                <div className="save-area">
                  <button className="btn btn-green btn-lg btn-block" onClick=${savePart}>
                    <span>💾</span>
                    <span>${t('savePart')}</span>
                    ${job.partName.trim() ? html`<span className="pill">"${job.partName.trim()}"</span>` : null}
                  </button>
                  ${saveError   ? html`<p className="msg-error">${saveError}</p>` : null}
                  ${saveSuccess ? html`<p className="msg-ok">${t('partSaved')}</p>` : null}
                </div>
              </div>`
              : (printers.length > 0
                  ? html`<div className="hint">${t('selectPrinterHint')}</div>`
                  : null)}

            <${SavedPartsTable}
              parts=${savedParts}
              onDelete=${deletePart}
              onClear=${function () { setShowClearConfirm(true); }}
              onPrint=${printQuotation} />

          </div>
        </div>

        ${showModal ? html`
          <${PrinterModal} printer=${editingPrinter} onSave=${savePrinter} onClose=${closeModal} />` : null}
        ${deleteTarget ? html`
          <${ConfirmDialog} icon="🗑️" title=${t('deletePrinter')} name=${deleteTarget.name}
            message=${t('deleteWarning')} confirmLabel=${t('delete')}
            onConfirm=${deletePrinter} onCancel=${function () { setDeleteTarget(null); }} />` : null}
        ${showClearConfirm ? html`
          <${ConfirmDialog} icon="🗑️" title=${t('clearConfirmTitle')}
            message=${t('clearConfirmMsg')} confirmLabel=${t('clearAll')}
            onConfirm=${clearAllParts} onCancel=${function () { setShowClearConfirm(false); }} />` : null}
      <//>`;
  }

  // ── Mount, with a visible error if anything goes wrong ──────────────────
  try {
    ReactDOM.createRoot(document.getElementById('root')).render(html`<${App} />`);
  } catch (err) {
    document.getElementById('root').innerHTML =
      '<div style="max-width:640px;margin:40px auto;padding:20px;background:#7f1d1d;' +
      'border-radius:12px;font-family:monospace;font-size:13px;line-height:1.6">' +
      '<strong style="font-size:16px">App failed to start</strong><br><br>' +
      esc(err && err.message ? err.message : String(err)) + '</div>';
    throw err;
  }
})();
