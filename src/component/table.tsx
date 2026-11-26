import React, { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnFiltersState, FilterFn } from "@tanstack/react-table";

// -----------------------------------------------------------------------------
// User table
// -----------------------------------------------------------------------------

interface User {
  id: number;
  name: string;
  role: string;
  dept: string;
  active: boolean;
}

type SortKey = "name" | "role" | "dept" | "active";
type SortDir = "asc" | "desc";

const users: User[] = [
  { id: 1, name: "Alice Johnson", role: "Engineer", dept: "Frontend", active: true },
  { id: 2, name: "Bob Smith", role: "Designer", dept: "UX", active: false },
  { id: 3, name: "Carol White", role: "Engineer", dept: "Backend", active: true },
  { id: 4, name: "David Lee", role: "Manager", dept: "Product", active: true },
  { id: 5, name: "Eva Martinez", role: "Engineer", dept: "Frontend", active: false },
];

const SORT_KEYS: SortKey[] = ["name", "role", "dept", "active"];

function readParams(): {
  filter: string;
  activeOnly: boolean;
  sortKey: SortKey;
  sortDir: SortDir;
} {
  const params = new URLSearchParams(window.location.search);
  const requestedSort = params.get("sort");
  const requestedDir = params.get("dir");

  return {
    filter: params.get("q") ?? "",
    activeOnly: params.get("active") === "1",
    sortKey: SORT_KEYS.includes(requestedSort as SortKey)
      ? (requestedSort as SortKey)
      : "name",
    sortDir: requestedDir === "desc" ? "desc" : "asc",
  };
}

function writeParams(
  filter: string,
  activeOnly: boolean,
  sortKey: SortKey,
  sortDir: SortDir
): void {
  const params = new URLSearchParams();
  if (filter) params.set("q", filter);
  if (activeOnly) params.set("active", "1");
  params.set("sort", sortKey);
  params.set("dir", sortDir);
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
}

function Highlight({ text, query }: { text: string; query: string }) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return <>{text}</>;

  const index = text.toLowerCase().indexOf(normalizedQuery.toLowerCase());
  if (index < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + normalizedQuery.length)}</mark>
      {text.slice(index + normalizedQuery.length)}
    </>
  );
}

export default function UserTable() {
  const [initial] = useState(readParams);
  const [filter, setFilter] = useState(initial.filter);
  const [activeOnly, setActiveOnly] = useState(initial.activeOnly);
  const [sortKey, setSortKey] = useState<SortKey>(initial.sortKey);
  const [sortDir, setSortDir] = useState<SortDir>(initial.sortDir);

  useEffect(() => {
    writeParams(filter, activeOnly, sortKey, sortDir);
  }, [filter, activeOnly, sortKey, sortDir]);

  const handleSort = (key: SortKey): void => {
    if (key === sortKey) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDir("asc");
  };

  const rows = useMemo(() => {
    const query = filter.trim().toLowerCase();
    const filtered = users.filter((user) => {
      if (activeOnly && !user.active) return false;
      return !query || user.name.toLowerCase().includes(query);
    });

    const direction = sortDir === "asc" ? 1 : -1;
    return filtered.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return (Number(aValue) - Number(bValue)) * direction;
      }

      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [filter, activeOnly, sortKey, sortDir]);

  const sortArrow = (key: SortKey): string =>
    key === sortKey ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  return (
    <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 700 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Filter by name…"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          style={{ padding: 6, flex: 1 }}
          aria-label="Filter by name"
        />
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(event) => setActiveOnly(event.target.checked)}
          />
          Active only
        </label>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {(
              [
                ["name", "Name"],
                ["role", "Role"],
                ["dept", "Department"],
                ["active", "Status"],
              ] as [SortKey, string][]
            ).map(([key, label]) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                style={{
                  textAlign: "left",
                  padding: 8,
                  borderBottom: "2px solid #ccc",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {label}
                {sortArrow(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 16, textAlign: "center", color: "#888" }}>
                No matching users
              </td>
            </tr>
          ) : (
            rows.map((user) => (
              <tr key={user.id}>
                <td style={cellStyle}>
                  <Highlight text={user.name} query={filter} />
                </td>
                <td style={cellStyle}>{user.role}</td>
                <td style={cellStyle}>{user.dept}</td>
                <td style={cellStyle}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 10,
                      fontSize: 12,
                      background: user.active ? "#d4f8d4" : "#f8d4d4",
                      color: user.active ? "#0a6b0a" : "#a10000",
                    }}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Order statistics table (TanStack React Table v8)
// -----------------------------------------------------------------------------

export type OrderStat = {
  id: string;
  customer: string;
  status: "Completed" | "Pending" | "Failed";
  amount: number;
};

const cellStyle: CSSProperties = {
  padding: 8,
  borderBottom: "1px solid #eee",
};
