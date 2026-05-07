import { useState } from "react";
import Icon from "@/components/ui/icon";
import CardEditor from "@/components/card/CardEditor";
import CardPreview from "@/components/card/CardPreview";
import { CardField, CardStyle, Tab, FieldType, DEFAULT_FIELDS, makeId } from "@/components/card/types";

export default function Index() {
  const [fields, setFields]   = useState<CardField[]>(DEFAULT_FIELDS);
  const [cardStyle, setStyle] = useState<CardStyle>({ bg: "#ffffff", textColor: "#111111", accentColor: "#f97316", fontStyle: "modern" });
  const [activeTab, setTab]   = useState<Tab>("editor");
  const [copied, setCopied]   = useState(false);

  const moveField        = (from: number, to: number) => setFields(p => { const a = [...p]; const [it] = a.splice(from, 1); a.splice(to, 0, it); return a; });
  const toggleField      = (id: string) => setFields(p => p.map(f => f.id === id ? { ...f, visible: !f.visible } : f));
  const changeValue      = (id: string, v: string) => setFields(p => p.map(f => f.id === id ? { ...f, value: v } : f));
  const changeLabel      = (id: string, label: string) => setFields(p => p.map(f => f.id === id ? { ...f, label } : f));
  const changeSecondary  = (id: string, v: string) => setFields(p => p.map(f => f.id === id ? { ...f, secondaryValue: v } : f));
  const removeField      = (id: string) => setFields(p => p.filter(f => f.id !== id));
  const addField         = (type: FieldType) => setFields(p => [...p, { id: makeId(), type, value: "", visible: true }]);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://vizitka.app/i/ivan-petrov").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <CardEditor
            fields={fields}
            cardStyle={cardStyle}
            activeTab={activeTab}
            setTab={setTab}
            setStyle={setStyle}
            moveField={moveField}
            toggleField={toggleField}
            changeValue={changeValue}
            changeLabel={changeLabel}
            changeSecondary={changeSecondary}
            removeField={removeField}
            addField={addField}
          />
          <CardPreview
            fields={fields}
            cardStyle={cardStyle}
            copied={copied}
            onCopy={handleCopy}
          />
        </div>
      </div>
    </div>
  );
}
