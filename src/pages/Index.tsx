import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ──────────────────────────────────────────────────────────────────

type FieldType = "name" | "title" | "company" | "phone" | "email" | "website" | "address" | "note";

interface CardField {
  id: string;
  type: FieldType;
  value: string;
  visible: boolean;
}

interface CardStyle {
  bg: string;
  textColor: string;
  accentColor: string;
  fontStyle: "modern" | "classic" | "bold";
}

type Tab = "editor" | "qr" | "analytics";

// ─── Constants ───────────────────────────────────────────────────────────────

const FIELD_META: Record<FieldType, { label: string; icon: string; placeholder: string }> = {
  name:    { label: "Имя",       icon: "User",      placeholder: "Иван Петров" },
  title:   { label: "Должность", icon: "Briefcase", placeholder: "Директор по маркетингу" },
  company: { label: "Компания",  icon: "Building2", placeholder: "ООО «Ромашка»" },
  phone:   { label: "Телефон",   icon: "Phone",     placeholder: "+7 (999) 123-45-67" },
  email:   { label: "Email",     icon: "Mail",      placeholder: "ivan@example.com" },
  website: { label: "Сайт",      icon: "Globe",     placeholder: "example.com" },
  address: { label: "Адрес",     icon: "MapPin",    placeholder: "Москва, ул. Тверская, 1" },
  note:    { label: "Заметка",   icon: "FileText",  placeholder: "Любой текст..." },
};

const BG_PRESETS = [
  { bg: "#ffffff", text: "#111111", accent: "#f97316" },
  { bg: "#111111", text: "#f5f5f5", accent: "#f97316" },
  { bg: "#1a1a2e", text: "#e2e2f0", accent: "#7c3aed" },
  { bg: "#f0fdf4", text: "#14532d", accent: "#16a34a" },
  { bg: "#fefce8", text: "#713f12", accent: "#d97706" },
  { bg: "#0f172a", text: "#e2e8f0", accent: "#38bdf8" },
];

const ANALYTICS_DATA = [
  { day: "Пн", views: 14, shares: 3 },
  { day: "Вт", views: 22, shares: 7 },
  { day: "Ср", views: 18, shares: 4 },
  { day: "Чт", views: 31, shares: 9 },
  { day: "Пт", views: 27, shares: 6 },
  { day: "Сб", views: 8,  shares: 2 },
  { day: "Вс", views: 11, shares: 3 },
];

const makeId = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_FIELDS: CardField[] = [
  { id: makeId(), type: "name",    value: "Иван Петров",            visible: true },
  { id: makeId(), type: "title",   value: "Директор по маркетингу", visible: true },
  { id: makeId(), type: "company", value: "ООО «Ромашка»",         visible: true },
  { id: makeId(), type: "phone",   value: "+7 (999) 123-45-67",     visible: true },
  { id: makeId(), type: "email",   value: "ivan@example.com",       visible: true },
  { id: makeId(), type: "website", value: "example.com",            visible: true },
];

// ─── QR Code visual ─────────────────────────────────────────────────────────

function QRPlaceholder({ accent }: { accent: string }) {
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,1,0,1,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,1,1,1,0,1,1,0,1,0],
    [0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,1,0,0,1,1,1],
    [1,1,1,0,1,1,1,0,1,1,0,0,1,0,1,1,1,0,1,0,1],
    [0,0,0,1,0,0,0,1,0,1,1,1,0,0,0,1,0,1,0,0,1],
    [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,0,0,1,1,0],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,1,0,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,1,0,0,0,1,0,1,1,0,0],
    [1,0,1,1,1,0,1,0,1,1,0,1,1,1,1,0,1,0,1,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,0,0,1,0,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,0,1,0,1,1],
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(21, 1fr)", gap: 1.5, width: 180, height: 180 }}>
      {pattern.flat().map((cell, i) => (
        <div key={i} style={{ background: cell ? accent : "transparent", borderRadius: 1 }} />
      ))}
    </div>
  );
}

// ─── Analytics ───────────────────────────────────────────────────────────────

function AnalyticsChart() {
  const maxViews = Math.max(...ANALYTICS_DATA.map(d => d.views));
  const total = ANALYTICS_DATA.reduce((s, d) => s + d.views, 0);
  const shares = ANALYTICS_DATA.reduce((s, d) => s + d.shares, 0);

  return (
    <div className="animate-fade-in space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Просмотров", value: total, icon: "Eye" },
          { label: "Поделились", value: shares, icon: "Share2" },
          { label: "Конверсия",  value: `${Math.round(shares / total * 100)}%`, icon: "TrendingUp" },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
              <Icon name={stat.icon} size={13} />
              <span className="text-[10px] uppercase tracking-wide">{stat.label}</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <div className="text-xs font-medium text-foreground uppercase tracking-wide mb-5">Просмотры за неделю</div>
        <div className="flex items-end gap-2 h-28">
          {ANALYTICS_DATA.map(d => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center justify-end" style={{ height: 88 }}>
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: `${(d.views / maxViews) * 100}%`,
                    background: "hsl(var(--accent))",
                    minHeight: 4,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <div className="text-xs font-medium text-foreground uppercase tracking-wide mb-4">Источники</div>
        <div className="space-y-3">
          {[
            { source: "QR-код",       pct: 48 },
            { source: "Прямая ссылка", pct: 31 },
            { source: "Мессенджеры",  pct: 21 },
          ].map(s => (
            <div key={s.source}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground">{s.source}</span>
                <span className="text-muted-foreground">{s.pct}%</span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${s.pct}%`, background: "hsl(var(--accent))" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Card Preview ────────────────────────────────────────────────────────────

function CardPreview({ fields, style }: { fields: CardField[]; style: CardStyle }) {
  const vis = fields.filter(f => f.visible && f.value.trim());
  const nameF    = vis.find(f => f.type === "name");
  const titleF   = vis.find(f => f.type === "title");
  const compF    = vis.find(f => f.type === "company");
  const contacts = vis.filter(f => ["phone","email","website","address","note"].includes(f.type));

  const fontClass =
    style.fontStyle === "classic" ? "font-cormorant" :
    style.fontStyle === "bold"    ? "font-golos font-extrabold" :
    "font-golos font-semibold";

  return (
    <div
      className="rounded-xl shadow-2xl w-full max-w-[320px] mx-auto overflow-hidden transition-all duration-500"
      style={{ background: style.bg, color: style.textColor }}
    >
      <div className="p-6" style={{ borderBottom: `1px solid ${style.textColor}15` }}>
        <div
          className="w-11 h-11 rounded-full mb-4 flex items-center justify-center text-base font-bold text-white"
          style={{ background: style.accentColor }}
        >
          {nameF?.value?.charAt(0) ?? "?"}
        </div>
        {nameF && (
          <div className={`text-xl leading-tight ${fontClass}`}>{nameF.value}</div>
        )}
        {titleF && (
          <div className="text-sm mt-1" style={{ opacity: 0.65 }}>{titleF.value}</div>
        )}
        {compF && (
          <span
            className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded"
            style={{ background: style.accentColor + "20", color: style.accentColor }}
          >
            {compF.value}
          </span>
        )}
      </div>

      {contacts.length > 0 && (
        <div className="p-5 space-y-3">
          {contacts.map(f => (
            <div key={f.id} className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                style={{ background: style.accentColor + "18" }}
              >
                <Icon name={FIELD_META[f.type].icon} size={13} style={{ color: style.accentColor }} />
              </div>
              <span className="text-sm truncate" style={{ opacity: 0.82 }}>{f.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Field Row (draggable) ───────────────────────────────────────────────────

function FieldItem({
  field, index,
  onMove, onToggle, onChangeValue, onRemove,
}: {
  field: CardField; index: number;
  onMove: (from: number, to: number) => void;
  onToggle: (id: string) => void;
  onChangeValue: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const dragFrom = useRef<number | null>(null);
  const meta = FIELD_META[field.type];

  return (
    <div
      draggable
      onDragStart={e => { dragFrom.current = index; e.dataTransfer.effectAllowed = "move"; }}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); if (dragFrom.current !== null && dragFrom.current !== index) onMove(dragFrom.current, index); }}
      className={`group flex items-center gap-3 p-3 bg-card border border-border rounded-lg cursor-grab active:cursor-grabbing transition-all duration-150 hover:border-foreground/20 hover:shadow-sm ${!field.visible ? "opacity-40" : ""}`}
    >
      <Icon name="GripVertical" size={14} className="text-muted-foreground shrink-0" />

      <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center shrink-0">
        <Icon name={meta.icon} size={13} className="text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{meta.label}</div>
        <input
          className="w-full text-sm bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none"
          value={field.value}
          placeholder={meta.placeholder}
          onChange={e => onChangeValue(field.id, e.target.value)}
        />
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggle(field.id)}
          className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Icon name={field.visible ? "Eye" : "EyeOff"} size={13} />
        </button>
        <button
          onClick={() => onRemove(field.id)}
          className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Icon name="Trash2" size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function Index() {
  const [fields, setFields]     = useState<CardField[]>(DEFAULT_FIELDS);
  const [cardStyle, setStyle]   = useState<CardStyle>({ bg: "#ffffff", textColor: "#111111", accentColor: "#f97316", fontStyle: "modern" });
  const [activeTab, setTab]     = useState<Tab>("editor");
  const [addMenuOpen, setAddMenu] = useState(false);
  const [copied, setCopied]     = useState(false);

  const allTypes    = Object.keys(FIELD_META) as FieldType[];
  const unusedTypes = allTypes.filter(t => t !== "note" && !fields.some(f => f.type === t));
  const addableTypes = unusedTypes.length > 0 ? unusedTypes : ["note" as FieldType];

  const moveField    = (from: number, to: number) => setFields(p => { const a = [...p]; const [it] = a.splice(from,1); a.splice(to,0,it); return a; });
  const toggleField  = (id: string) => setFields(p => p.map(f => f.id === id ? { ...f, visible: !f.visible } : f));
  const changeValue  = (id: string, v: string) => setFields(p => p.map(f => f.id === id ? { ...f, value: v } : f));
  const removeField  = (id: string) => setFields(p => p.filter(f => f.id !== id));
  const addField     = (type: FieldType) => { setFields(p => [...p, { id: makeId(), type, value: "", visible: true }]); setAddMenu(false); };

  const handleCopy = () => {
    navigator.clipboard.writeText("https://vizitka.app/i/ivan-petrov").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "editor",    label: "Редактор",  icon: "Pencil" },
    { id: "qr",        label: "QR-код",    icon: "QrCode" },
    { id: "analytics", label: "Аналитика", icon: "BarChart2" },
  ];

  return (
    <div className="min-h-screen bg-background font-golos">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
              <Icon name="CreditCard" size={13} className="text-background" />
            </div>
            <span className="font-semibold text-sm text-foreground">Визитка</span>
            <span className="text-muted-foreground text-sm">/ Иван Петров</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-md hover:border-foreground/30 hover:text-foreground transition-all"
            >
              <Icon name={copied ? "Check" : "Link"} size={12} />
              {copied ? "Скопировано!" : "Ссылка"}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors font-medium">
              <Icon name="Rocket" size={12} />
              Опубликовать
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* ── Left ── */}
          <div className="space-y-3">
            {/* Tab bar */}
            <div className="flex border border-border rounded-lg overflow-hidden bg-card">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon name={tab.icon} size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Editor */}
            {activeTab === "editor" && (
              <div className="animate-fade-in space-y-2">
                {fields.map((field, idx) => (
                  <FieldItem
                    key={field.id}
                    field={field} index={idx}
                    onMove={moveField} onToggle={toggleField}
                    onChangeValue={changeValue} onRemove={removeField}
                  />
                ))}

                {/* Add field dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setAddMenu(!addMenuOpen)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-muted-foreground border border-dashed border-border rounded-lg hover:border-foreground/30 hover:text-foreground hover:bg-card transition-all"
                  >
                    <Icon name="Plus" size={14} />
                    Добавить поле
                  </button>
                  {addMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-30 animate-scale-in">
                      {addableTypes.map(type => (
                        <button
                          key={type}
                          onClick={() => addField(type)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                        >
                          <Icon name={FIELD_META[type].icon} size={14} className="text-muted-foreground" />
                          {FIELD_META[type].label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Style settings */}
                <div className="bg-card border border-border rounded-lg p-4 space-y-5 mt-2">
                  <div className="text-xs font-medium text-foreground uppercase tracking-widest">Оформление</div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-2.5">Тема</div>
                    <div className="flex gap-2">
                      {BG_PRESETS.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => setStyle(s => ({ ...s, bg: p.bg, textColor: p.text, accentColor: p.accent }))}
                          className="w-8 h-8 rounded-full border-2 transition-all"
                          title={p.bg}
                          style={{
                            background: p.bg,
                            borderColor: cardStyle.bg === p.bg ? p.accent : "transparent",
                            boxShadow: cardStyle.bg === p.bg ? `0 0 0 3px ${p.accent}33` : "0 0 0 1px rgba(0,0,0,0.12)",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-2.5">Шрифт</div>
                    <div className="flex gap-2">
                      {(["modern","classic","bold"] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setStyle(s => ({ ...s, fontStyle: f }))}
                          className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                            cardStyle.fontStyle === f
                              ? "border-foreground bg-foreground text-background"
                              : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                          }`}
                        >
                          {{ modern: "Модерн", classic: "Классика", bold: "Жирный" }[f]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-2.5">Акцентный цвет</div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={cardStyle.accentColor}
                        onChange={e => setStyle(s => ({ ...s, accentColor: e.target.value }))}
                        className="w-8 h-8 rounded-md border border-border cursor-pointer"
                      />
                      <span className="text-xs text-muted-foreground font-mono">{cardStyle.accentColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* QR */}
            {activeTab === "qr" && (
              <div className="animate-fade-in bg-card border border-border rounded-lg p-6 space-y-6">
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">QR-код визитки</div>
                  <div className="text-xs text-muted-foreground">Сканирование открывает страницу с вашими контактами</div>
                </div>

                <div className="flex justify-center">
                  <div className="p-5 bg-white rounded-xl shadow-sm border border-border inline-block">
                    <QRPlaceholder accent={cardStyle.accentColor} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 py-2.5 text-sm border border-border rounded-lg text-foreground hover:bg-secondary transition-all">
                    <Icon name="Download" size={14} />
                    Скачать PNG
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2.5 text-sm bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors font-medium">
                    <Icon name="Printer" size={14} />
                    На печать
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="text-xs font-medium text-foreground uppercase tracking-widest">Настройки QR</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Цвет модулей</span>
                    <input
                      type="color"
                      value={cardStyle.accentColor}
                      onChange={e => setStyle(s => ({ ...s, accentColor: e.target.value }))}
                      className="w-7 h-7 rounded border border-border cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Размер</span>
                    <input type="range" min={120} max={280} defaultValue={180} className="w-24" style={{ accentColor: "hsl(var(--accent))" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Analytics */}
            {activeTab === "analytics" && <AnalyticsChart />}
          </div>

          {/* ── Right: Preview ── */}
          <div className="lg:sticky lg:top-20 lg:self-start space-y-3">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest px-0.5 flex items-center justify-between">
              <span>Превью</span>
              <span className="normal-case text-[10px]">live</span>
            </div>

            <div className="bg-secondary/50 border border-border rounded-xl p-5 flex items-center justify-center min-h-[260px]">
              <CardPreview fields={fields} style={cardStyle} />
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2.5">Ссылка на визитку</div>
              <div className="flex items-center gap-2 bg-secondary rounded-md px-3 py-2">
                <Icon name="Link2" size={12} className="text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground truncate flex-1 font-mono">vizitka.app/i/ivan-petrov</span>
                <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name={copied ? "Check" : "Copy"} size={12} />
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">Статистика</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Просмотров", value: "131" },
                  { label: "Поделились", value: "34" },
                ].map(s => (
                  <div key={s.label} className="text-center py-1">
                    <div className="text-2xl font-semibold text-foreground">{s.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 text-sm bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors font-medium">
              <Icon name="Rocket" size={14} />
              Опубликовать визитку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}