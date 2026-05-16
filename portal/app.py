"""L-net Podcast Studio — local web portal."""

import sqlite3
from pathlib import Path
from flask import Flask, render_template, request, redirect, url_for, jsonify

BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "podcast_studio.db"

app = Flask(__name__)


# ---------------------------------------------------------------------------
# DB helpers
# ---------------------------------------------------------------------------

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    with get_db() as db:
        db.executescript("""
            CREATE TABLE IF NOT EXISTS cluster (
                id   INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );
            CREATE TABLE IF NOT EXISTS course (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                cluster_id INTEGER NOT NULL REFERENCES cluster(id) ON DELETE CASCADE,
                name       TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS episode (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                course_id INTEGER NOT NULL REFERENCES course(id) ON DELETE CASCADE,
                title     TEXT NOT NULL,
                status    TEXT NOT NULL DEFAULT 'pending'  -- 'pending' | 'written'
            );
        """)


# ---------------------------------------------------------------------------
# Routes — dashboard
# ---------------------------------------------------------------------------

@app.get("/")
def index():
    db = get_db()
    clusters = db.execute("SELECT * FROM cluster ORDER BY id").fetchall()
    data = []
    for cl in clusters:
        courses = db.execute(
            "SELECT * FROM course WHERE cluster_id = ? ORDER BY id", (cl["id"],)
        ).fetchall()
        course_data = []
        total_eps = 0
        written_eps = 0
        for co in courses:
            episodes = db.execute(
                "SELECT * FROM episode WHERE course_id = ? ORDER BY id", (co["id"],)
            ).fetchall()
            total_eps += len(episodes)
            written_eps += sum(1 for e in episodes if e["status"] == "written")
            course_data.append({"course": co, "episodes": episodes})
        data.append({
            "cluster": cl,
            "courses": course_data,
            "total": total_eps,
            "written": written_eps,
        })
    return render_template("index.html", data=data)


# ---------------------------------------------------------------------------
# Routes — clusters
# ---------------------------------------------------------------------------

@app.post("/cluster/add")
def cluster_add():
    name = request.form.get("name", "").strip()
    if name:
        try:
            with get_db() as db:
                db.execute("INSERT INTO cluster (name) VALUES (?)", (name,))
        except sqlite3.IntegrityError:
            pass
    return redirect(url_for("index"))


@app.post("/cluster/<int:cluster_id>/delete")
def cluster_delete(cluster_id):
    with get_db() as db:
        db.execute("DELETE FROM cluster WHERE id = ?", (cluster_id,))
    return redirect(url_for("index"))


# ---------------------------------------------------------------------------
# Routes — courses
# ---------------------------------------------------------------------------

@app.post("/cluster/<int:cluster_id>/course/add")
def course_add(cluster_id):
    name = request.form.get("name", "").strip()
    if name:
        with get_db() as db:
            db.execute(
                "INSERT INTO course (cluster_id, name) VALUES (?, ?)",
                (cluster_id, name),
            )
    return redirect(url_for("index") + f"#cluster-{cluster_id}")


@app.post("/course/<int:course_id>/delete")
def course_delete(course_id):
    db = get_db()
    row = db.execute("SELECT cluster_id FROM course WHERE id = ?", (course_id,)).fetchone()
    cluster_id = row["cluster_id"] if row else None
    with db:
        db.execute("DELETE FROM course WHERE id = ?", (course_id,))
    return redirect(url_for("index") + (f"#cluster-{cluster_id}" if cluster_id else ""))


# ---------------------------------------------------------------------------
# Routes — episodes
# ---------------------------------------------------------------------------

@app.post("/course/<int:course_id>/episode/add")
def episode_add(course_id):
    title = request.form.get("title", "").strip()
    if title:
        with get_db() as db:
            db.execute(
                "INSERT INTO episode (course_id, title) VALUES (?, ?)",
                (course_id, title),
            )
    db = get_db()
    row = db.execute("SELECT cluster_id FROM course WHERE id = ?", (course_id,)).fetchone()
    cluster_id = row["cluster_id"] if row else None
    return redirect(url_for("index") + (f"#cluster-{cluster_id}" if cluster_id else ""))


@app.post("/episode/<int:episode_id>/toggle")
def episode_toggle(episode_id):
    db = get_db()
    row = db.execute("SELECT status, course_id FROM episode WHERE id = ?", (episode_id,)).fetchone()
    if not row:
        return redirect(url_for("index"))
    new_status = "written" if row["status"] == "pending" else "pending"
    course_id = row["course_id"]
    with db:
        db.execute("UPDATE episode SET status = ? WHERE id = ?", (new_status, episode_id))
    row2 = db.execute("SELECT cluster_id FROM course WHERE id = ?", (course_id,)).fetchone()
    cluster_id = row2["cluster_id"] if row2 else None
    return redirect(url_for("index") + (f"#cluster-{cluster_id}" if cluster_id else ""))


@app.post("/episode/<int:episode_id>/delete")
def episode_delete(episode_id):
    db = get_db()
    row = db.execute(
        "SELECT c.cluster_id FROM episode e JOIN course c ON e.course_id = c.id WHERE e.id = ?",
        (episode_id,),
    ).fetchone()
    cluster_id = row["cluster_id"] if row else None
    with db:
        db.execute("DELETE FROM episode WHERE id = ?", (episode_id,))
    return redirect(url_for("index") + (f"#cluster-{cluster_id}" if cluster_id else ""))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    init_db()
    print("\n  L-net Podcast Studio")
    print("  http://localhost:5050\n")
    app.run(debug=True, port=5050)
