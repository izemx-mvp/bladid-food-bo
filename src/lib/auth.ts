const KEY = "ladid_admin_session";

export type Session = {
  email: string;
  name: string;
  role: "Super Admin";
};

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(email: string): Session {
  const session: Session = { email, name: "Yanis", role: "Super Admin" };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function signOut() {
  localStorage.removeItem(KEY);
}

export const DEMO_CREDENTIALS = {
  email: "admin@ladidfood.ma",
  password: "Ladid2026!",
};
