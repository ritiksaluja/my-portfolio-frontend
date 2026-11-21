import { useState } from "react";

type FormState = "idle" | "sending" | "sent";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<FormState>("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Failed to send message, please try again.");
        setStatus("idle");
      }
    } catch (err) {
      console.error(err);
      alert("Network error, please check if backend is running.");
      setStatus("idle");
    }
  }

  const inputCls =
    "w-full bg-white/40 backdrop-blur-sm border border-slate-200 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200";

  if (status === "sent") {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-accent-green/10 border border-accent-green/30 text-accent-green font-mono text-sm">
        <span className="size-2 rounded-full bg-accent-green animate-cursor-blink shrink-0" />
        Message transmitted. I'll respond within 24 hours.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Name</label>
          <input name="name" required placeholder="Your name" value={form.name} onChange={handleChange} className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Email</label>
          <input name="email" type="email" required placeholder="you@company.com" value={form.email} onChange={handleChange} className={inputCls} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Subject</label>
        <input name="subject" required placeholder="Project inquiry / Collaboration / Hiring" value={form.subject} onChange={handleChange} className={inputCls} />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Message</label>
        <textarea name="message" required rows={5} placeholder="Tell me about your project, stack, timeline..." value={form.message} onChange={handleChange} className={`${inputCls} resize-none`} />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="relative overflow-hidden w-full sm:w-auto px-8 py-3 bg-brand text-white font-bold rounded-lg group disabled:opacity-60 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] animate-glow-pulse"
      >
        {/* shimmer sweep on hover */}
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="relative font-mono text-sm tracking-widest uppercase">
          {status === "sending" ? "Transmitting…" : "Send Message →"}
        </span>
      </button>
    </form>
  );
}
