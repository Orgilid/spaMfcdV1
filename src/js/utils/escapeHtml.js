// Энэ нь XSS (Cross-Site Scripting) халдлагаас хамгаалах зориулалттай.
// Хэрэглэгчийн оруулсан текстийг HTML-д аюулгүй байдлаар гаргахын тулд
// тусгай тэмдэгтүүдийг HTML entity-ээр солих функц.
export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
