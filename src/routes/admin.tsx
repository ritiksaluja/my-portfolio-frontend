import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  LogOut, Plus, Trash2, Edit, MessageSquare, Folder, 
  ExternalLink, Lock, Mail, ArrowLeft, X, Check, AlertCircle, Settings
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});

interface DBProject {
  _id: string;
  title: string;
  desc: string;
  tags: string[];
  image: string;
  projectUrl: string;
}

interface DBMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

function AdminRoute() {
  const [token, setToken] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"projects" | "messages" | "settings">("projects");
  const [projects, setProjects] = useState<DBProject[]>([]);
  const [messages, setMessages] = useState<DBMessage[]>([]);
  const [dbLoading, setDbLoading] = useState(false);

  // Settings state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Project Modal Form state
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<DBProject | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formError, setFormError] = useState("");

  // Deletion confirmation dialog modal state
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: "project" | "message";
    id: string;
    title: string;
  }>({ isOpen: false, type: "project", id: "", title: "" });

  // Check login on load and verify token validity on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      verifySavedToken(savedToken);
    }
  }, []);

  const verifySavedToken = async (savedToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      if (res.ok) {
        setToken(savedToken);
      } else {
        // Token has expired or is invalid
        handleLogout();
        toast.error("Session expired. Please log in again.");
      }
    } catch (err) {
      console.error("Token verification network error", err);
      // In case of a temporary connection problem, keep the local token but warn the user
      setToken(savedToken);
      toast.warning("Offline mode: could not verify login with backend");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on login or tab switch
  useEffect(() => {
    if (token) {
      if (activeTab === "projects") {
        fetchProjects();
      } else if (activeTab === "messages") {
        fetchMessages();
      }
    }
  }, [token, activeTab]);

  const fetchProjects = async () => {
    setDbLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        toast.error("Failed to load projects from server");
      }
    } catch (err) {
      console.error("Error fetching projects", err);
      toast.error("Network error loading projects");
    } finally {
      setDbLoading(false);
    }
  };

  const fetchMessages = async () => {
    setDbLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else if (res.status === 401) {
        handleLogout();
        toast.error("Authentication expired");
      } else {
        toast.error("Failed to retrieve messages");
      }
    } catch (err) {
      console.error("Error fetching messages", err);
      toast.error("Network error loading messages");
    } finally {
      setDbLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("admin_token", data.token);
        setToken(data.token);
        setEmailInput("");
        setPasswordInput("");
        toast.success("Successfully authenticated!");
      } else {
        setLoginError(data.error || "Login failed");
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      setLoginError("Could not connect to backend server");
      toast.error("Server connection timed out");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    toast.info("Logged out of session");
  };

  // Profile management change password action
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setSettingsError("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setSettingsError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setSettingsError("New password must be at least 6 characters long");
      return;
    }

    setSettingsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setSettingsError(data.error || "Failed to change password");
        toast.error(data.error || "Failed to change password");
      }
    } catch (err) {
      setSettingsError("Could not connect to server");
      toast.error("Network error updating settings");
    } finally {
      setSettingsLoading(false);
    }
  };

  // CRUD Actions
  const openAddModal = () => {
    setEditingProject(null);
    setFormTitle("");
    setFormDesc("");
    setFormTags("");
    setFormImage("");
    setFormUrl("");
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (p: DBProject) => {
    setEditingProject(p);
    setFormTitle(p.title);
    setFormDesc(p.desc);
    setFormTags(p.tags.join(", "));
    setFormImage(p.image);
    setFormUrl(p.projectUrl);
    setFormError("");
    setShowModal(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formTitle || !formDesc) {
      setFormError("Title and description are required");
      return;
    }

    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim().toUpperCase())
      .filter((t) => t.length > 0);

    const projectPayload = {
      title: formTitle,
      desc: formDesc,
      tags: tagsArray,
      image: formImage || "projectPos",
      projectUrl: formUrl || "#",
    };

    try {
      const url = editingProject
        ? `http://localhost:5000/api/projects/${editingProject._id}`
        : "http://localhost:5000/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectPayload),
      });

      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        toast.success(editingProject ? "Project updated!" : "New project added!");
        fetchProjects();
      } else {
        setFormError(data.error || "Failed to save project");
        toast.error(data.error || "Failed to save project");
      }
    } catch (err) {
      setFormError("Failed to connect to backend server");
      toast.error("Network error saving project");
    }
  };

  // Safe delete dialog triggers
  const triggerDeleteProject = (id: string, title: string) => {
    setConfirmDelete({
      isOpen: true,
      type: "project",
      id,
      title
    });
  };

  const triggerDeleteMessage = (id: string, name: string) => {
    setConfirmDelete({
      isOpen: true,
      type: "message",
      id,
      title: `Message from ${name}`
    });
  };

  // Perform backend deletion upon custom dialog confirmation
  const handleExecuteDeletion = async () => {
    const { type, id } = confirmDelete;
    setConfirmDelete((prev) => ({ ...prev, isOpen: false }));

    try {
      const url = type === "project" 
        ? `http://localhost:5000/api/projects/${id}` 
        : `http://localhost:5000/api/messages/${id}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success(`${type === "project" ? "Project" : "Message"} deleted successfully`);
        if (type === "project") {
          fetchProjects();
        } else {
          fetchMessages();
        }
      } else {
        toast.error(`Failed to delete ${type}`);
      }
    } catch (err) {
      toast.error("Network error executing delete operation");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-foreground font-sans relative overflow-x-hidden selection:bg-brand/10 selection:text-brand">
      {/* Background decorations */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-brand/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent-green/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* ── Login View ────────────────────────────────────────────────── */}
      {!token ? (
        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 py-12">
          <Link to="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-brand transition-colors mb-8 group self-center">
            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Portfolio
          </Link>
          
          <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-slate-200/40 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-8">
              <div className="size-12 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="size-6 text-brand" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-brand bg-clip-text text-transparent">
                Admin Console
              </h1>
              <p className="text-xs text-muted-foreground mt-1.5 font-mono">// ACCESS_RESTRICTED</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="size-3" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@mailinator.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-white/50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="size-3" /> Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-white/50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-slate-400 outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200"
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-mono">
                  <AlertCircle className="size-4 shrink-0" />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand text-white font-bold rounded-lg font-mono text-sm tracking-wider uppercase disabled:opacity-60 transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg shadow-brand/20 cursor-pointer"
              >
                {isLoading ? "Validating..." : "Authenticate →"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ── Dashboard View ────────────────────────────────────────────── */
        <div className="relative z-10 min-h-screen flex flex-col">
          
          {/* Header */}
          <nav className="flex items-center justify-between px-6 md:px-8 py-6 border-b border-border/40 bg-bg/85 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-accent-green animate-cursor-blink" />
                <span className="font-mono text-sm tracking-tighter uppercase font-bold text-slate-800">Admin.Console</span>
              </div>
              <Link to="/" className="text-xs font-mono uppercase text-muted-foreground hover:text-brand transition-colors hidden sm:block">
                ↗ Back to Portfolio
              </Link>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-destructive hover:border-destructive/30 rounded-lg text-xs font-mono transition-all cursor-pointer animate-fade-in"
            >
              <LogOut className="size-3.5" />
              Sign Out
            </button>
          </nav>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-8 py-10">
            
            {/* Tabs */}
            <div className="flex items-center gap-3 border-b border-slate-200/60 pb-5 mb-8">
              <button
                onClick={() => setActiveTab("projects")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all cursor-pointer ${
                  activeTab === "projects"
                    ? "bg-brand text-white shadow-md shadow-brand/10 font-bold"
                    : "bg-white/50 border border-slate-200/50 text-muted-foreground hover:text-foreground hover:bg-white"
                }`}
              >
                <Folder className="size-3.5" />
                Projects
              </button>
              
              <button
                onClick={() => setActiveTab("messages")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all cursor-pointer ${
                  activeTab === "messages"
                    ? "bg-brand text-white shadow-md shadow-brand/10 font-bold"
                    : "bg-white/50 border border-slate-200/50 text-muted-foreground hover:text-foreground hover:bg-white"
                }`}
              >
                <MessageSquare className="size-3.5" />
                Messages
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-brand text-white shadow-md shadow-brand/10 font-bold"
                    : "bg-white/50 border border-slate-200/50 text-muted-foreground hover:text-foreground hover:bg-white"
                }`}
              >
                <Settings className="size-3.5" />
                Settings
              </button>
            </div>

            {/* Tab: Projects */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Manage Projects</h2>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">CRUD_PROJECTS_DATABASE</p>
                  </div>
                  <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand/90 text-white font-bold rounded-lg text-xs font-mono uppercase tracking-wider hover:shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="size-4" /> Add Project
                  </button>
                </div>

                {dbLoading ? (
                  /* Premium Skeleton Grid Loader */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="bg-white/40 border border-slate-200/30 p-5 rounded-2xl flex flex-col space-y-4 animate-pulse">
                        <div className="w-full aspect-video bg-slate-200/60 rounded-xl" />
                        <div className="h-6 bg-slate-200/60 rounded w-2/3" />
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200/60 rounded w-full" />
                          <div className="h-4 bg-slate-200/60 rounded w-5/6" />
                        </div>
                        <div className="flex gap-1.5 flex-wrap pt-3 mt-auto">
                          <div className="h-4 bg-slate-200/60 rounded w-12" />
                          <div className="h-4 bg-slate-200/60 rounded w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-20 bg-white/40 border border-slate-200/40 rounded-xl font-mono text-xs text-muted-foreground">No projects found. Add one to begin!</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p) => (
                      <div key={p._id} className="bg-white/50 backdrop-blur-md border border-slate-200/40 p-5 rounded-2xl flex flex-col hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-lg text-slate-800">{p.title}</h3>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 hover:bg-slate-100 hover:text-brand rounded text-slate-400 transition-colors cursor-pointer"
                              title="Edit Project"
                            >
                              <Edit className="size-4" />
                            </button>
                            <button
                              onClick={() => triggerDeleteProject(p._id, p.title)}
                              className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded text-slate-400 transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3">{p.desc}</p>
                        <div className="flex gap-1.5 flex-wrap mb-4 mt-auto">
                          {p.tags.map((t) => (
                            <span key={t} className="text-[9px] font-mono border border-slate-200 bg-slate-50/50 px-2 py-0.5 text-slate-600 rounded">{t}</span>
                          ))}
                        </div>
                        <div className="pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs font-mono text-slate-400">
                          <span>Img: <code className="text-slate-600 font-semibold">{p.image}</code></span>
                          {p.projectUrl !== "#" && (
                            <a href={p.projectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand hover:underline">
                              Demo <ExternalLink className="size-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Messages */}
            {activeTab === "messages" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Inbox Messages</h2>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">READ_VISITOR_SUBMISSIONS</p>
                </div>

                {dbLoading ? (
                  /* Premium Inbox List Skeleton Loader */
                  <div className="space-y-4">
                    {[1, 2].map((n) => (
                      <div key={n} className="bg-white/40 border border-slate-200/30 p-6 rounded-2xl space-y-4 animate-pulse">
                        <div className="flex justify-between border-b border-slate-200/30 pb-3">
                          <div className="h-5 bg-slate-200/60 rounded w-1/3" />
                          <div className="h-4 bg-slate-200/60 rounded w-20" />
                        </div>
                        <div className="h-4 bg-slate-200/60 rounded w-1/4" />
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200/60 rounded w-full" />
                          <div className="h-4 bg-slate-200/60 rounded w-5/6" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-20 bg-white/40 border border-slate-200/40 rounded-xl font-mono text-xs text-muted-foreground">Inbox is empty. No messages received yet.</div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <div key={m._id} className="bg-white/50 backdrop-blur-md border border-slate-200/40 p-6 rounded-2xl hover:shadow-sm transition-all duration-300">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200/60 pb-3 mb-4 gap-2">
                          <div className="flex items-center justify-between w-full sm:w-auto">
                            <div>
                              <span className="font-bold text-slate-800 text-sm">{m.name}</span>
                              <code className="text-[11px] text-muted-foreground font-mono ml-2 shrink-0">&lt;{m.email}&gt;</code>
                            </div>
                            {/* Mobile Delete Button */}
                            <button
                              onClick={() => triggerDeleteMessage(m._id, m.name)}
                              className="p-1 hover:bg-destructive/10 hover:text-destructive rounded text-slate-400 transition-colors cursor-pointer sm:hidden"
                              title="Delete Message"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3 justify-between sm:justify-start">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                              {new Date(m.createdAt).toLocaleString()}
                            </span>
                            {/* Desktop Delete Button */}
                            <button
                              onClick={() => triggerDeleteMessage(m._id, m.name)}
                              className="p-1 hover:bg-destructive/10 hover:text-destructive rounded text-slate-400 transition-colors cursor-pointer hidden sm:block"
                              title="Delete Message"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-mono text-xs text-brand uppercase tracking-wider mb-2">Subject: {m.subject}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Settings (Change Password) */}
            {activeTab === "settings" && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Admin Settings</h2>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">UPDATE_SECURITY_CREDENTIALS</p>
                </div>

                <div className="bg-white/50 backdrop-blur-md border border-slate-200/40 p-6 rounded-2xl">
                  <h3 className="font-mono text-xs text-brand uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Lock className="size-4" /> Change Console Password
                  </h3>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Current Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">New Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200"
                      />
                    </div>

                    {settingsError && (
                      <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-mono animate-fade-in">
                        <AlertCircle className="size-4 shrink-0" />
                        {settingsError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className="px-5 py-2.5 bg-brand hover:bg-brand/90 text-white font-bold rounded-lg text-xs font-mono uppercase tracking-widest transition-all cursor-pointer disabled:opacity-60"
                    >
                      {settingsLoading ? "Saving..." : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ── Custom Deletion Confirmation Dialog Modal ─────────────────── */}
      {confirmDelete.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-fade-in">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setConfirmDelete((prev) => ({ ...prev, isOpen: false }))} 
          />
          
          {/* Content */}
          <div className="relative w-full max-w-md bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl z-10 animate-scale-in">
            <button 
              onClick={() => setConfirmDelete((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded text-slate-400 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <h3 className="text-xl font-bold text-slate-800 mb-3 font-mono flex items-center gap-2">
              <Trash2 className="size-5 text-destructive" /> // CONFIRM_DELETE
            </h3>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-800">{confirmDelete.title}</strong>? This will permanently remove the item from the database.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmDelete((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-mono transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDeletion}
                className="px-5 py-2 bg-destructive hover:bg-destructive/90 text-white font-bold rounded-lg text-xs font-mono uppercase tracking-widest transition-all cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ───────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          {/* Modal content */}
          <div className="relative w-full max-w-lg bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl z-10 animate-scale-in max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded text-slate-400 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <h3 className="text-xl font-bold text-slate-800 mb-6 font-mono">
              {editingProject ? "// EDIT_PROJECT" : "// ADD_PROJECT"}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. E-Commerce Engine"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain the project, features, key technical accomplishments..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="REACT, NODE.JS, POSTGRESQL"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Image Asset Key</label>
                  <input
                    type="text"
                    placeholder="projectPos"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Demo URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200"
                  />
                </div>
              </div>

              {formError && (
                <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-mono">
                  <AlertCircle className="size-4 shrink-0" />
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-mono transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand hover:bg-brand/90 text-white font-bold rounded-lg text-xs font-mono uppercase tracking-widest transition-all cursor-pointer"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
