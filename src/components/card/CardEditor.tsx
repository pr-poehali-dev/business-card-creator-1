import { useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import {
  CardField, CardStyle, Tab, FieldType,
  FIELD_META, FIELD_GROUPS, UNIQUE_TYPES, BG_PRESETS, ANALYTICS_DATA,
} from "./types";

// ─── QR Code visual ──────────────────────────────────────────────────────────

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
                  style={{ height: `${(d.views / maxViews) * 100}%`, background: "hsl(var(--accent))", minHeight: 4 }}
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
            { source: "QR-код",        pct: 48 },
            { source: "Прямая ссылка", pct: 31 },
            { source: "Мессенджеры",   pct: 21 },
          ].map(s => (
            <div key={s.source}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground">{s.source}</span>
                <span className="text-muted-foreground">{s.pct}%</span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: "hsl(var(--accent))" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Field Row (draggable) ───────────────────────────────────────────────────

function FieldItem({
  field, index,
  onMove, onToggle, onChangeValue, onChangeLabel, onChangeSecondary, onRemove,
}: {
  field: CardField; index: number;
  onMove: (from: number, to: number) => void;
  onToggle: (id: string) => void;
  onChangeValue: (id: string, value: string) => void;
  onChangeLabel: (id: string, label: string) => void;
  onChangeSecondary: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const dragFrom = useRef<number | null>(null);
  const meta = FIELD_META[field.type];
  const isCustom   = field.type === "custom";
  const isLocation = field.type === "location";
  const displayLabel = isCustom ? (field.label || meta.label) : meta.label;

  return (
    <div
      draggable
      onDragStart={e => { dragFrom.current = index; e.dataTransfer.effectAllowed = "move"; }}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); if (dragFrom.current !== null && dragFrom.current !== index) onMove(dragFrom.current, index); }}
      className={`group bg-card border border-border rounded-lg cursor-grab active:cursor-grabbing transition-all duration-150 hover:border-foreground/20 hover:shadow-sm ${!field.visible ? "opacity-40" : ""}`}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 p-3">
        <Icon name="GripVertical" size={14} className="text-muted-foreground shrink-0" />

        <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center shrink-0">
          <Icon name={meta.icon} size={13} className="text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Label row: editable for custom */}
          {isCustom ? (
            <input
              className="w-full text-[10px] text-muted-foreground uppercase tracking-wide bg-transparent outline-none placeholder:text-muted-foreground/40 mb-0.5"
              value={field.label ?? ""}
              placeholder="Название поля"
              onChange={e => onChangeLabel(field.id, e.target.value)}
            />
          ) : (
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{displayLabel}</div>
          )}
          {/* Main value */}
          <input
            className="w-full text-sm bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none"
            value={field.value}
            placeholder={isLocation ? "Название места" : meta.placeholder}
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

      {/* Location: secondary input for maps URL */}
      {isLocation && (
        <div className="px-3 pb-3 pl-[52px]">
          <input
            className="w-full text-xs bg-secondary/60 text-muted-foreground placeholder:text-muted-foreground/40 outline-none rounded px-2 py-1.5"
            value={field.secondaryValue ?? ""}
            placeholder="Ссылка из карт (https://maps.app.goo.gl/...)"
            onChange={e => onChangeSecondary(field.id, e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

// ─── Add Field Menu ───────────────────────────────────────────────────────────

function AddFieldMenu({
  fields,
  onAdd,
  onClose,
}: {
  fields: CardField[];
  onAdd: (type: FieldType) => void;
  onClose: () => void;
}) {
  // Для уникальных типов — скрываем уже добавленные
  const isAvailable = (type: FieldType) => {
    if (UNIQUE_TYPES.includes(type)) return !fields.some(f => f.type === type);
    return true; // location, note, custom — можно несколько
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-30 animate-scale-in">
      {FIELD_GROUPS.map(group => {
        const available = group.types.filter(isAvailable);
        if (available.length === 0) return null;
        return (
          <div key={group.label}>
            <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground bg-secondary/50 font-medium">
              {group.label}
            </div>
            {available.map(type => (
              <button
                key={type}
                onClick={() => { onAdd(type); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <Icon name={FIELD_META[type].icon} size={14} className="text-muted-foreground" />
                {FIELD_META[type].label}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── CardEditor ──────────────────────────────────────────────────────────────

interface CardEditorProps {
  fields: CardField[];
  cardStyle: CardStyle;
  activeTab: Tab;
  setTab: (tab: Tab) => void;
  setStyle: React.Dispatch<React.SetStateAction<CardStyle>>;
  moveField: (from: number, to: number) => void;
  toggleField: (id: string) => void;
  changeValue: (id: string, value: string) => void;
  changeLabel: (id: string, label: string) => void;
  changeSecondary: (id: string, value: string) => void;
  removeField: (id: string) => void;
  addField: (type: FieldType) => void;
}

export default function CardEditor({
  fields, cardStyle, activeTab, setTab, setStyle,
  moveField, toggleField, changeValue, changeLabel, changeSecondary, removeField, addField,
}: CardEditorProps) {
  const [addMenuOpen, setAddMenu] = useState(false);

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "editor",    label: "Редактор",  icon: "Pencil" },
    { id: "qr",        label: "QR-код",    icon: "QrCode" },
    { id: "analytics", label: "Аналитика", icon: "BarChart2" },
  ];

  return (
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

      {/* Editor tab */}
      {activeTab === "editor" && (
        <div className="animate-fade-in space-y-2">
          {fields.map((field, idx) => (
            <FieldItem
              key={field.id}
              field={field} index={idx}
              onMove={moveField} onToggle={toggleField}
              onChangeValue={changeValue}
              onChangeLabel={changeLabel}
              onChangeSecondary={changeSecondary}
              onRemove={removeField}
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
              <AddFieldMenu
                fields={fields}
                onAdd={addField}
                onClose={() => setAddMenu(false)}
              />
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
                {(["modern", "classic", "bold"] as const).map(f => (
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

      {/* QR tab */}
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

      {/* Analytics tab */}
      {activeTab === "analytics" && <AnalyticsChart />}
    </div>
  );
}
