import Icon from "@/components/ui/icon";
import { CardField, CardStyle, FIELD_META, BUTTON_TYPES } from "./types";

const CONTACT_TYPES = ["phone", "email", "website", "address", "note", "telegram", "max", "instagram", "location", "custom"];

// ─── Card visual ─────────────────────────────────────────────────────────────

function CardVisual({ fields, style }: { fields: CardField[]; style: CardStyle; }) {
  const vis      = fields.filter(f => f.visible && f.value.trim());
  const nameF    = vis.find(f => f.type === "name");
  const titleF   = vis.find(f => f.type === "title");
  const compF    = vis.find(f => f.type === "company");
  const contacts = vis.filter(f => CONTACT_TYPES.includes(f.type));

  const fontClass =
    style.fontStyle === "classic" ? "font-cormorant" :
    style.fontStyle === "bold"    ? "font-golos font-extrabold" :
    "font-golos font-semibold";

  const getLabel = (f: CardField) => {
    if (f.type === "custom") return f.label || FIELD_META[f.type].label;
    return FIELD_META[f.type].label;
  };

  return (
    <div
      className="rounded-xl shadow-2xl w-full max-w-[320px] mx-auto overflow-hidden transition-all duration-500"
      style={{ background: style.bg, color: style.textColor }}
    >
      <div className="p-6" style={{ borderBottom: `1px solid ${style.textColor}15` }}>
        <div
          className="w-14 h-14 rounded-full mb-4 flex items-center justify-center text-base font-bold text-white overflow-hidden shrink-0"
          style={{ background: style.accentColor }}
        >
          {style.avatar ? (
            <img src={style.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            nameF?.value?.charAt(0) ?? "?"
          )}
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
        <div className="p-5 space-y-2">
          {/* Button-style fields: telegram, max, instagram, website, custom */}
          {contacts.some(f => BUTTON_TYPES.includes(f.type)) && (
            <div className="flex flex-wrap gap-2 mb-1">
              {contacts.filter(f => BUTTON_TYPES.includes(f.type)).map(f => (
                <a
                  key={f.id}
                  href={f.value || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ background: style.accentColor + "18", color: style.accentColor }}
                >
                  <Icon name={FIELD_META[f.type].icon} size={12} style={{ color: style.accentColor }} />
                  {getLabel(f)}
                </a>
              ))}
            </div>
          )}

          {/* Row-style fields: phone, email, address, note, location */}
          {contacts.filter(f => !BUTTON_TYPES.includes(f.type)).map(f => (
            <div key={f.id} className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: style.accentColor + "18" }}
              >
                <Icon name={FIELD_META[f.type].icon} size={13} style={{ color: style.accentColor }} />
              </div>
              <div className="flex-1 min-w-0">
                {f.type === "location" && (
                  <div className="text-[10px] mb-0.5" style={{ opacity: 0.5 }}>
                    {getLabel(f)}
                  </div>
                )}
                <span className="text-sm truncate block" style={{ opacity: 0.82 }}>
                  {f.type === "location" && f.secondaryValue ? (
                    <a
                      href={f.secondaryValue}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                      style={{ color: style.accentColor }}
                    >
                      {f.value}
                    </a>
                  ) : (
                    f.value
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CardPreview panel ───────────────────────────────────────────────────────

interface CardPreviewProps {
  fields: CardField[];
  cardStyle: CardStyle;
  copied: boolean;
  publishedUrl: string | null;
  publishing: boolean;
  onCopy: () => void;
  onPublish: () => void;
}

export default function CardPreview({ fields, cardStyle, copied, publishedUrl, publishing, onCopy, onPublish }: CardPreviewProps) {
  return (
    <div className="lg:sticky lg:top-20 lg:self-start space-y-3">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest px-0.5 flex items-center justify-between">
        <span>Превью</span>
        <span className="normal-case text-[10px]">live</span>
      </div>

      <div className="bg-secondary/50 border border-border rounded-xl p-5 flex items-center justify-center min-h-[260px]">
        <CardVisual fields={fields} style={cardStyle} />
      </div>

      {publishedUrl && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2.5">Ссылка на визитку</div>
          <div className="flex items-center gap-2 bg-secondary rounded-md px-3 py-2">
            <Icon name="Link2" size={12} className="text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground truncate flex-1 font-mono">
              {publishedUrl.replace(window.location.origin, "")}
            </span>
            <button onClick={onCopy} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <Icon name={copied ? "Check" : "Copy"} size={12} />
            </button>
          </div>
          <a
            href={publishedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ExternalLink" size={11} />
            Открыть визитку
          </a>
        </div>
      )}

      <button
        onClick={onPublish}
        disabled={publishing}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors font-medium disabled:opacity-60"
      >
        {publishing
          ? <span className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
          : <Icon name={publishedUrl ? "RefreshCw" : "Rocket"} size={14} />
        }
        {publishing ? "Публикую..." : publishedUrl ? "Обновить визитку" : "Опубликовать визитку"}
      </button>
    </div>
  );
}