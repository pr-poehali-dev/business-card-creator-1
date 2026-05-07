import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { CardField, CardStyle, FIELD_META, BUTTON_TYPES } from "@/components/card/types";

const CARD_GET_URL = "https://functions.poehali.dev/394e701a-7524-43d6-b9ae-8b431663b261";
const CONTACT_TYPES = ["phone", "email", "website", "address", "note", "telegram", "max", "instagram", "location", "custom"];

function getLabel(f: CardField) {
  if (f.type === "custom") return f.label || FIELD_META[f.type].label;
  return FIELD_META[f.type].label;
}

export default function CardPublic() {
  const { slug } = useParams<{ slug: string }>();
  const [fields, setFields] = useState<CardField[] | null>(null);
  const [style, setStyle]   = useState<CardStyle | null>(null);
  const [error, setError]   = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`${CARD_GET_URL}?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(true); return; }
        setFields(data.fields);
        setStyle(data.style);
      })
      .catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 font-golos">
        <Icon name="FileX2" size={40} className="text-muted-foreground" />
        <div className="text-lg font-medium text-foreground">Визитка не найдена</div>
        <div className="text-sm text-muted-foreground">Проверьте ссылку или попросите отправить её снова</div>
      </div>
    );
  }

  if (!fields || !style) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
      </div>
    );
  }

  const vis      = fields.filter(f => f.visible && f.value.trim());
  const nameF    = vis.find(f => f.type === "name");
  const titleF   = vis.find(f => f.type === "title");
  const compF    = vis.find(f => f.type === "company");
  const contacts = vis.filter(f => CONTACT_TYPES.includes(f.type));

  const fontClass =
    style.fontStyle === "classic" ? "font-cormorant" :
    style.fontStyle === "bold"    ? "font-golos font-extrabold" :
    "font-golos font-semibold";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-golos" style={{ background: "#f5f5f5" }}>
      <div
        className="rounded-2xl shadow-2xl w-full max-w-[360px] overflow-hidden"
        style={{ background: style.bg, color: style.textColor }}
      >
        {/* Header */}
        <div className="p-7" style={{ borderBottom: `1px solid ${style.textColor}15` }}>
          <div
            className="w-20 h-20 rounded-full mb-5 flex items-center justify-center text-2xl font-bold text-white overflow-hidden"
            style={{ background: style.accentColor }}
          >
            {style.avatar ? (
              <img src={style.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              nameF?.value?.charAt(0) ?? "?"
            )}
          </div>
          {nameF && (
            <div className={`text-2xl leading-tight ${fontClass}`}>{nameF.value}</div>
          )}
          {titleF && (
            <div className="text-sm mt-1.5" style={{ opacity: 0.65 }}>{titleF.value}</div>
          )}
          {compF && (
            <span
              className="inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: style.accentColor + "20", color: style.accentColor }}
            >
              {compF.value}
            </span>
          )}
        </div>

        {/* Contacts */}
        {contacts.length > 0 && (
          <div className="p-6 space-y-3">
            {/* Buttons */}
            {contacts.some(f => BUTTON_TYPES.includes(f.type)) && (
              <div className="flex flex-wrap gap-2 mb-2">
                {contacts.filter(f => BUTTON_TYPES.includes(f.type)).map(f => (
                  <a
                    key={f.id}
                    href={f.value || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-75 active:opacity-60"
                    style={{ background: style.accentColor + "18", color: style.accentColor }}
                  >
                    <Icon name={FIELD_META[f.type].icon} size={14} style={{ color: style.accentColor }} />
                    {getLabel(f)}
                  </a>
                ))}
              </div>
            )}

            {/* Rows */}
            {contacts.filter(f => !BUTTON_TYPES.includes(f.type)).map(f => (
              <div key={f.id} className="flex items-start gap-3.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: style.accentColor + "15" }}
                >
                  <Icon name={FIELD_META[f.type].icon} size={15} style={{ color: style.accentColor }} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  {f.type === "location" && (
                    <div className="text-[10px] mb-0.5 uppercase tracking-wide" style={{ opacity: 0.45 }}>
                      {getLabel(f)}
                    </div>
                  )}
                  <span className="text-sm" style={{ opacity: 0.85 }}>
                    {f.type === "phone" ? (
                      <a href={`tel:${f.value}`} style={{ color: style.textColor }}>{f.value}</a>
                    ) : f.type === "email" ? (
                      <a href={`mailto:${f.value}`} style={{ color: style.textColor }}>{f.value}</a>
                    ) : f.type === "location" && f.secondaryValue ? (
                      <a href={f.secondaryValue} target="_blank" rel="noopener noreferrer"
                        className="underline underline-offset-2" style={{ color: style.accentColor }}>
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

        {/* Footer */}
        <div className="px-6 pb-5 pt-1">
          <div className="text-[10px] text-center" style={{ opacity: 0.3 }}>Цифровая визитка</div>
        </div>
      </div>
    </div>
  );
}
