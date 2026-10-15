"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, Check, CheckCheck, ChevronDown, CircleHelp, Clock3, Command, Filter, LayoutDashboard, ListTodo, LoaderCircle, LogOut, Menu, MoreHorizontal, Plus, Search, Settings2, Sparkles, Target, Trash2, X } from "lucide-react";
import { ApiError, apiRequest, Task, TaskStatus } from "@/lib/api";

const statusLabels: Record<TaskStatus, string> = { pending: "To do", in_progress: "In progress", completed: "Completed" };
const statusClasses: Record<TaskStatus, string> = { pending: "status-todo", in_progress: "status-progress", completed: "status-done" };

function initials(email: string) { return email.slice(0, 1).toUpperCase(); }
function prettyDate(value: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value)); }

export default function TaskflowApp() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [menuTask, setMenuTask] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setToken(window.localStorage.getItem("taskflow_token") || "");
    setEmail(window.localStorage.getItem("taskflow_email") || "");
  }, []);

  const loadTasks = useCallback(async (activeToken: string) => {
    setLoading(true); setError("");
    try {
      const result = await apiRequest<Task[]>("/tasks?limit=100", activeToken);
      setTasks(result);
    } catch (e) {
      const err = e as ApiError;
      setError(err.status === 401 ? "Your session has expired. Please sign in again." : err.message);
      if (err.status === 401) { window.localStorage.removeItem("taskflow_token"); setToken(""); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (token) void loadTasks(token); else setLoading(false); }, [token, loadTasks]);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;
    const term = search.trim().toLowerCase();
    return matchesFilter && (!term || task.title.toLowerCase().includes(term) || (task.description || "").toLowerCase().includes(term));
  }), [tasks, filter, search]);
  const todoCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const completion = tasks.length ? Math.round(completedCount / tasks.length * 100) : 0;

  function signOut() {
    window.localStorage.removeItem("taskflow_token"); window.localStorage.removeItem("taskflow_email");
    setToken(""); setEmail(""); setTasks([]);
  }

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!title.trim() || !token) return;
    setSubmitting(true); setError("");
    try {
      const created = await apiRequest<Task>("/tasks", token, { method: "POST", body: JSON.stringify({ title: title.trim(), description: description.trim() || null }) });
      setTasks((current) => [created, ...current]); setTitle(""); setDescription(""); setModalOpen(false);
    } catch (e) { setError((e as Error).message); }
    finally { setSubmitting(false); }
  }

  async function updateStatus(task: Task, status: TaskStatus) {
    if (!token) return;
    try {
      const updated = await apiRequest<Task>(`/tasks/${task.id}`, token, { method: "PATCH", body: JSON.stringify({ status }) });
      setTasks((current) => current.map((item) => item.id === updated.id ? updated : item)); setMenuTask(null);
    } catch (e) { setError((e as Error).message); }
  }

  async function deleteTask(task: Task) {
    if (!token || !window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return;
    try { await apiRequest<void>(`/tasks/${task.id}`, token, { method: "DELETE" }); setTasks((current) => current.filter((item) => item.id !== task.id)); setMenuTask(null); }
    catch (e) { setError((e as Error).message); }
  }

  if (!token && !loading) return <LoginScreen onSignedIn={(nextToken, nextEmail) => { window.localStorage.setItem("taskflow_token", nextToken); window.localStorage.setItem("taskflow_email", nextEmail); setToken(nextToken); setEmail(nextEmail); }} />;

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Command size={20} strokeWidth={2.5} /></div><span>taskflow<span className="brand-period">.</span></span><button className="icon-button mobile-close" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X size={19}/></button></div>
      <div className="workspace-switch"><div className="workspace-avatar">T</div><div className="workspace-copy"><strong>Team workspace</strong><span>Free plan</span></div><ChevronDown size={15} className="muted-icon" /></div>
      <div className="nav-label">WORKSPACE</div>
      <nav className="nav-list" aria-label="Main navigation"><button className="nav-item active"><LayoutDashboard size={18}/><span>Overview</span><span className="nav-shortcut">⌘ 1</span></button><button className="nav-item" onClick={() => { setFilter("all"); document.getElementById("tasks-section")?.scrollIntoView({ behavior: "smooth" }); }}><ListTodo size={18}/><span>My tasks</span><span className="nav-count">{tasks.length}</span></button><button className="nav-item" onClick={() => setFilter("in_progress")}><CalendarDays size={18}/><span>In progress</span></button></nav>
      <div className="nav-label projects-label">YOUR SPACE</div>
      <div className="space-row"><span className="space-dot dot-violet"/>Personal goals<span className="space-number">04</span></div><div className="space-row"><span className="space-dot dot-orange"/>Work projects<span className="space-number">08</span></div><button className="add-space"><Plus size={15}/> Add a space</button>
      <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={17}/></div><strong>Make room for big ideas.</strong><p>Unlock more ways to plan, focus, and get things done.</p><button onClick={() => alert("Plan upgrades can be connected when billing is implemented.")}>Explore plans <ArrowUpRight size={14}/></button></div><button className="nav-item bottom-nav"><CircleHelp size={17}/><span>Help & support</span></button><button className="nav-item bottom-nav" onClick={signOut}><LogOut size={17}/><span>Sign out</span></button><div className="sidebar-footnote">MADE FOR YOUR NEXT BIG THING</div></div>
    </aside>
    {mobileNavOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileNavOpen(false)} />}

    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20}/></button><span>Workspace</span><span className="crumb-divider">/</span><strong>Overview</strong></div><div className="topbar-actions"><div className="search-box"><Search size={16}/><input aria-label="Search tasks" placeholder="Search anything..." value={search} onChange={(e) => setSearch(e.target.value)}/><kbd>⌘ K</kbd></div><button className="icon-button notification-button" aria-label="Notifications" onClick={() => alert("You're all caught up.")}><Bell size={18}/><span className="notification-dot"/></button><div className="topbar-divider"/><button className="profile-button" onClick={signOut} title="Sign out"><span className="profile-avatar">{email ? initials(email) : "T"}</span><ChevronDown size={14}/></button></div></header>

      <div className="page-content"><div className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/> THURSDAY, OCTOBER 15</div><h1>Good things take <span>focus.</span></h1><p className="welcome-subtitle">A little progress each day adds up to something great.</p></div><button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={17}/> New task</button></div>

        {error && <div className="error-banner" role="alert"><Activity size={17}/><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss error"><X size={16}/></button></div>}

        <section className="stats-grid" aria-label="Task summary"><StatCard label="Total tasks" value={tasks.length} note="Across your workspace" icon={<Target size={19}/>} tone="purple" loading={loading}/><StatCard label="To do" value={todoCount} note="Ready when you are" icon={<ListTodo size={19}/>} tone="blue" loading={loading}/><StatCard label="In progress" value={inProgressCount} note="Keep the momentum" icon={<Clock3 size={19}/>} tone="orange" loading={loading}/><StatCard label="Completed" value={completedCount} note="Look how far you've come" icon={<CheckCheck size={19}/>} tone="green" loading={loading}/></section>

        <section className="focus-grid"><div className="focus-card"><div className="focus-top"><div><div className="section-kicker">YOUR MOMENTUM</div><h2>Progress, not perfection.</h2><p>Every completed task is a step forward.</p></div><div className="progress-icon"><Sparkles size={21}/></div></div><div className="progress-row"><div className="progress-track"><div className="progress-fill" style={{ width: `${completion}%` }}/></div><strong>{completion}%</strong></div><div className="progress-bottom"><span>{completedCount} of {tasks.length} tasks completed</span><span className="progress-caption"><span/> You're building a habit</span></div></div>
          <div className="quote-card"><div className="quote-decoration">“</div><p>Great things are done by a series of small things brought together.</p><div className="quote-author"><span className="author-line"/> VINCENT VAN GOGH</div><div className="quote-sun"/></div></section>

        <section className="tasks-section" id="tasks-section"><div className="section-heading"><div><div className="section-kicker">THE ACTION PLAN</div><h2>Your tasks <span className="task-total">{tasks.length}</span></h2></div><div className="task-controls"><button className="filter-button" onClick={() => setFilter(filter === "all" ? "pending" : "all")}><Filter size={15}/>{filter === "all" ? "Filter" : statusLabels[filter]}<ChevronDown size={14}/></button><button className="view-all-button" onClick={() => { setFilter("all"); setSearch(""); }}>View all <ArrowUpRight size={14}/></button></div></div>
          <div className="task-tabs" role="group" aria-label="Filter tasks">{([ ["all", "All tasks"], ["pending", "To do"], ["in_progress", "In progress"], ["completed", "Completed"] ] as const).map(([value, label]) => <button key={value} className={`task-tab ${filter === value ? "selected" : ""}`} onClick={() => setFilter(value)}>{label}{value === "all" && <span>{tasks.length}</span>}</button>)}</div>
          <div className="task-table"><div className="task-table-head"><span className="task-col-title">TASK NAME</span><span>STATUS</span><span>CREATED</span><span className="actions-col"> </span></div>
            {loading ? <div className="table-state"><LoaderCircle className="spin" size={22}/><span>Loading your tasks…</span></div> : visibleTasks.length === 0 ? <div className="empty-state"><div className="empty-illustration"><Check size={25}/></div><h3>{search ? "No matching tasks" : filter === "completed" ? "Your wins will show up here" : "A clear space for your next win."}</h3><p>{search ? "Try another search term." : "Start small. Create a task and make today count."}</p>{!search && <button className="primary-button small-button" onClick={() => setModalOpen(true)}><Plus size={15}/> Create your first task</button>}</div> : visibleTasks.map((task) => <div className="task-row" key={task.id}><div className="task-title-cell"><span className={`task-checkbox ${task.status === "completed" ? "checked" : ""}`}><Check size={12}/></span><div className="task-title-copy"><strong className={task.status === "completed" ? "completed-title" : ""}>{task.title}</strong>{task.description && <span>{task.description}</span>}</div></div><div><button className={`status-pill ${statusClasses[task.status]}`} onClick={() => setMenuTask(menuTask === task.id ? null : task.id)}>{task.status === "completed" && <Check size={12}/>}<span className="status-dot"/>{statusLabels[task.status]}<ChevronDown size={12}/></button>{menuTask === task.id && <div className="task-menu">{(["pending", "in_progress", "completed"] as TaskStatus[]).map((status) => <button key={status} onClick={() => void updateStatus(task, status)}>{status === task.status && <Check size={13}/>}<span>{statusLabels[status]}</span></button>)}<div className="menu-divider"/><button className="delete-menu-item" onClick={() => void deleteTask(task)}><Trash2 size={13}/> Delete task</button></div>}</div><span className="task-date">{prettyDate(task.created_at)}</span><button className="icon-button row-more" aria-label={`More actions for ${task.title}`} onClick={() => setMenuTask(menuTask === task.id ? null : task.id)}><MoreHorizontal size={19}/></button></div>)}
          </div><div className="table-footer"><span>Showing <strong>{visibleTasks.length}</strong> of <strong>{tasks.length}</strong> tasks</span><button onClick={() => token && void loadTasks(token)} disabled={loading}><Activity size={14}/> Refresh</button></div>
        </section>
        <footer className="page-footer"><span>© 2026 TaskFlow, made for thoughtful work.</span><span><span className="footer-status"/> All systems operational</span></footer>
      </div>
    </main>

    {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}><section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="new-task-title"><div className="modal-header"><div><div className="section-kicker">MAKE IT HAPPEN</div><h2 id="new-task-title">Create a task</h2><p>Start with one thing you want to move forward.</p></div><button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Close dialog"><X size={19}/></button></div><form onSubmit={createTask}><label htmlFor="task-title">Task name <span>*</span></label><input id="task-title" autoFocus required maxLength={200} placeholder="e.g. Finish the project proposal" value={title} onChange={(e) => setTitle(e.target.value)}/><label htmlFor="task-description">Description <span className="optional-label">Optional</span></label><textarea id="task-description" rows={4} maxLength={10000} placeholder="Add a little context to your task…" value={description} onChange={(e) => setDescription(e.target.value)}/><div className="modal-hint"><Sparkles size={14}/> Keep it clear, keep it achievable.</div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-button" disabled={submitting || !title.trim()}>{submitting ? <LoaderCircle className="spin" size={16}/> : <Plus size={16}/>} Create task</button></div></form></section></div>}
  </div>;
}

function StatCard({ label, value, note, icon, tone, loading }: { label: string; value: number; note: string; icon: React.ReactNode; tone: string; loading: boolean }) {
  return <article className="stat-card"><div className="stat-card-top"><span className={`stat-icon ${tone}`}>{icon}</span><span className="stat-trend"><ArrowDownRight size={13}/></span></div><div className="stat-value">{loading ? <span className="skeleton-value"/> : value}</div><div className="stat-label">{label}</div><div className="stat-note">{note}</div></article>;
}

function LoginScreen({ onSignedIn }: { onSignedIn: (token: string, email: string) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setSuccess("");
    try {
      if (mode === "register") {
        await apiRequest<{id: number; email: string}>("/auth/register", undefined, { method: "POST", body: JSON.stringify({ email, password }) });
        setSuccess("Account created. Sign in with your new credentials."); setMode("login"); setPassword("");
      } else {
        const data = await apiRequest<{access_token: string; token_type: string}>("/auth/login", undefined, { method: "POST", body: JSON.stringify({ email, password }) });
        onSignedIn(data.access_token, email.toLowerCase());
      }
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  return <main className="auth-screen"><div className="auth-decoration auth-decoration-one"/><div className="auth-decoration auth-decoration-two"/><div className="auth-left"><div className="brand auth-brand"><div className="brand-mark"><Command size={20} strokeWidth={2.5}/></div><span>taskflow<span className="brand-period">.</span></span></div><div className="auth-pitch"><div className="auth-eyebrow"><Sparkles size={14}/> A LITTLE MORE INTENTIONAL</div><h1>Make space for<br/>what <span>matters.</span></h1><p>Bring your tasks into focus. Find your rhythm. Make meaningful progress, one day at a time.</p><div className="auth-feature"><span><Check size={15}/></span> A calmer way to plan your day</div><div className="auth-feature"><span><Check size={15}/></span> Your priorities, all in one place</div><div className="auth-feature"><span><Check size={15}/></span> Progress you can actually feel</div></div><div className="auth-left-footer">A THOUGHTFUL SPACE FOR DOING GREAT WORK.</div></div><div className="auth-right"><div className="auth-form-wrap"><div className="auth-form-eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h2>{mode === "login" ? "Welcome back." : "Create your space."}</h2><p className="auth-form-subtitle">{mode === "login" ? "Pick up where your best work begins." : "A few details, then you're on your way."}</p>{error && <div className="auth-error" role="alert">{error}</div>}{success && <div className="auth-success" role="status">{success}</div>}<form onSubmit={submit}><label htmlFor="email">Email address</label><input id="email" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/><label htmlFor="password">Password</label><input id="password" type="password" required minLength={12} maxLength={128} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="At least 12 characters" value={password} onChange={(e) => setPassword(e.target.value)}/><div className="password-note">Use at least 12 characters for a stronger password.</div><button type="submit" className="primary-button auth-submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={17}/> : null}{mode === "login" ? "Sign in to TaskFlow" : "Create my account"}<ArrowUpRight size={16}/></button></form><div className="auth-switch">{mode === "login" ? "New to TaskFlow?" : "Already have an account?"} <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess(""); }}>{mode === "login" ? "Create an account" : "Sign in"}</button></div><div className="auth-privacy"><span className="privacy-lock">◆</span> Your work is personal. Your data stays yours.</div></div><div className="auth-right-footer"><span>© 2026 TaskFlow</span><span>Built for focus <span className="tiny-heart">✳</span></span></div></div></main>;
}
