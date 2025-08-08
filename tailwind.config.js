@tailwind base;
@tailwind components;
@tailwind utilities;

/* Light theme base */
@layer base {
  :root{
    --bg:#f7fafc; --text:#0f172a; --muted:#475569; --border:#e5e7eb;
    --accent:#10b981; --accent-2:#2563eb;
  }
  html, body, #root { height:100% }
  body {
    @apply text-slate-900;
    background:
      radial-gradient(900px 400px at -10% -20%, rgba(16,185,129,.08), transparent 50%),
      radial-gradient(900px 400px at 110% -10%, rgba(37,99,235,.08), transparent 50%),
      #f7fafc;
  }
}

/* Component classes (so you don’t have to touch JSX) */
@layer components {
  .container { @apply max-w-[1100px] mx-auto p-6 }
  header { @apply sticky top-0 z-30 backdrop-blur bg-white/85 border-b border-slate-200 }
  header .bar { @apply flex gap-4 items-center px-6 py-3 }
  .brand { @apply font-extrabold tracking-wide }
  .badge { @apply px-2 py-[2px] rounded-full text-xs border border-slate-200 bg-indigo-50 text-slate-700 }
  .btn {
    @apply rounded-xl border border-slate-200 bg-white text-slate-900 px-4 py-2
           shadow-sm hover:-translate-y-0.5 hover:shadow-md transition;
  }
  .btn.primary {
    @apply bg-emerald-500 text-emerald-950 font-bold border-transparent shadow-lg;
  }
  .btn.ghost { @apply bg-slate-50 }
  .grid { @apply grid gap-4 grid-cols-12 }
  .card { @apply bg-white border border-slate-200 rounded-2xl p-5 shadow-sm }
  .hero { @apply rounded-2xl p-6 border border-slate-200 bg-white shadow-md }
  .muted { @apply text-slate-600 }
  .kpi .stat { @apply bg-white border border-slate-200 rounded-xl p-4 shadow-sm }
  .kpi .num { @apply text-2xl font-extrabold }
  .list { @apply flex flex-col gap-2.5 }
  .row { @apply flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200 }
  .pill { @apply px-3 py-1 rounded-full border border-slate-200 bg-slate-50 }
  .input, select, textarea { @apply w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none }
  .input:focus, select:focus, textarea:focus { box-shadow: 0 0 0 6px rgba(37,99,235,.2); border-color: #bfdbfe; }
  .label { @apply text-xs tracking-wide text-slate-600 mb-1.5 block }
  .table { @apply w-full border-collapse }
  .table th, .table td { @apply border-b border-slate-200 px-2.5 py-2 text-left }
  .table th { @apply font-semibold text-slate-700 }
  .toast { @apply fixed bottom-4 right-4 hidden bg-white border border-slate-200 shadow-lg rounded-xl px-3.5 py-3 }
  .toast.show { @apply block }
  .hint { @apply text-xs text-slate-500 }
}
