export type FieldType = "name" | "title" | "company" | "phone" | "email" | "website" | "address" | "note";

export interface CardField {
  id: string;
  type: FieldType;
  value: string;
  visible: boolean;
}

export interface CardStyle {
  bg: string;
  textColor: string;
  accentColor: string;
  fontStyle: "modern" | "classic" | "bold";
}

export type Tab = "editor" | "qr" | "analytics";

export const FIELD_META: Record<FieldType, { label: string; icon: string; placeholder: string }> = {
  name:    { label: "Имя",       icon: "User",      placeholder: "Иван Петров" },
  title:   { label: "Должность", icon: "Briefcase", placeholder: "Директор по маркетингу" },
  company: { label: "Компания",  icon: "Building2", placeholder: "ООО «Ромашка»" },
  phone:   { label: "Телефон",   icon: "Phone",     placeholder: "+7 (999) 123-45-67" },
  email:   { label: "Email",     icon: "Mail",      placeholder: "ivan@example.com" },
  website: { label: "Сайт",      icon: "Globe",     placeholder: "example.com" },
  address: { label: "Адрес",     icon: "MapPin",    placeholder: "Москва, ул. Тверская, 1" },
  note:    { label: "Заметка",   icon: "FileText",  placeholder: "Любой текст..." },
};

export const BG_PRESETS = [
  { bg: "#ffffff", text: "#111111", accent: "#f97316" },
  { bg: "#111111", text: "#f5f5f5", accent: "#f97316" },
  { bg: "#1a1a2e", text: "#e2e2f0", accent: "#7c3aed" },
  { bg: "#f0fdf4", text: "#14532d", accent: "#16a34a" },
  { bg: "#fefce8", text: "#713f12", accent: "#d97706" },
  { bg: "#0f172a", text: "#e2e8f0", accent: "#38bdf8" },
];

export const ANALYTICS_DATA = [
  { day: "Пн", views: 14, shares: 3 },
  { day: "Вт", views: 22, shares: 7 },
  { day: "Ср", views: 18, shares: 4 },
  { day: "Чт", views: 31, shares: 9 },
  { day: "Пт", views: 27, shares: 6 },
  { day: "Сб", views: 8,  shares: 2 },
  { day: "Вс", views: 11, shares: 3 },
];

export const makeId = () => Math.random().toString(36).slice(2, 9);

export const DEFAULT_FIELDS: CardField[] = [
  { id: makeId(), type: "name",    value: "Иван Петров",            visible: true },
  { id: makeId(), type: "title",   value: "Директор по маркетингу", visible: true },
  { id: makeId(), type: "company", value: "ООО «Ромашка»",         visible: true },
  { id: makeId(), type: "phone",   value: "+7 (999) 123-45-67",     visible: true },
  { id: makeId(), type: "email",   value: "ivan@example.com",       visible: true },
  { id: makeId(), type: "website", value: "example.com",            visible: true },
];
