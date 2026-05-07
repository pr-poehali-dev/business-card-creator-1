import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import CardEditor from "@/components/card/CardEditor";
import CardPreview from "@/components/card/CardPreview";
import { CardField, CardStyle, Tab, FieldType, DEFAULT_FIELDS, makeId } from "@/components/card/types";

const CARD_SAVE_URL = "https://functions.poehali.dev/471db360-a7e3-4468-8fb8-68761b1e85ac";

export default function Index() {
  const [fields, setFields]             = useState<CardField[]>(DEFAULT_FIELDS);
  const [cardStyle, setStyle]           = useState<CardStyle>({ bg: "#ffffff", textColor: "#111111", accentColor: "#f97316", fontStyle: "modern" });
  const [activeTab, setTab]             = useState<Tab>("editor");
  const [copied, setCopied]             = useState(false);
  const [publishing, setPublishing]     = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess]   = useState(false);
  const slugRef = useRef<string | null>(null);

  const moveField       = (from: number, to: number) => setFields(p => { const a = [...p]; const [it] = a.splice(from, 1); a.splice(to, 0, it); return a; });
  const toggleField     = (id: string) => setFields(p => p.map(f => f.id === id ? { ...f, visible: !f.visible } : f));
  const changeValue     = (id: string, v: string) => setFields(p => p.map(f => f.id === id ? { ...f, value: v } : f));
  const changeLabel     = (id: string, label: string) => setFields(p => p.map(f => f.id === id ? { ...f, label } : f));
  const changeSecondary = (id: string, v: string) => setFields(p => p.map(f => f.id === id ? { ...f, secondaryValue: v } : f));
  const removeField     = (id: string) => setFields(p => p.filter(f => f.id !== id));
  const addField        = (type: FieldType) => setFields(p => [...p, { id: makeId(), type, value: "", visible: true }]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(CARD_SAVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields, style: cardStyle, slug: slugRef.current }),
      });
      const data = await res.json();
      slugRef.current = data.slug;
      const url = window.location.origin + data.url;
      setPublishedUrl(url);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } finally {
      setPublishing(false);
    }
  };

  const handleCopy = () => {
    const url = publishedUrl ?? window.location.href;
    navigator.clipboard.writeText(url).catch(() => {});
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
            {publishedUrl && (
              <span className="text-muted-foreground text-sm truncate max-w-[200px]">
                {publishedUrl.replace(window.location.origin, "")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {publishedUrl && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-md hover:border-foreground/30 hover:text-foreground transition-all"
              >
                <Icon name={copied ? "Check" : "Link"} size={12} />
                {copied ? "Скопировано!" : "Ссылка"}
              </button>
            )}
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors font-medium disabled:opacity-60"
            >
              {publishing
                ? <span className="w-3 h-3 rounded-full border-2 border-background border-t-transparent animate-spin" />
                : <Icon name={publishedUrl ? "RefreshCw" : "Rocket"} size={12} />
              }
              {publishing ? "Публикую..." : publishedUrl ? "Обновить" : "Опубликовать"}
            </button>
          </div>
        </div>
      </header>

      {/* Success banner */}
      {showSuccess && publishedUrl && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2.5 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <Icon name="CheckCircle2" size={15} className="text-green-600" />
            Визитка опубликована!
          </div>
          <a
            href={publishedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-green-700 hover:underline flex items-center gap-1"
          >
            Открыть <Icon name="ExternalLink" size={11} />
          </a>
        </div>
      )}

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
            publishedUrl={publishedUrl}
            onCopy={handleCopy}
            onPublish={handlePublish}
            publishing={publishing}
          />
        </div>
      </div>
    </div>
  );
}
