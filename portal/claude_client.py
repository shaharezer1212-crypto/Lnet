"""Claude API calls for each step of the podcast creation workflow.

Uses prompt caching to share static reference files (cultural guidelines,
style examples) across requests — first call writes the cache (~1.25x cost),
subsequent calls read from it (~0.1x cost).
"""

import os
from pathlib import Path

import anthropic

BASE = Path(__file__).parent.parent  # /home/user/Lnet
MODEL = "claude-opus-4-7"


def _read(rel_path: str) -> str:
    p = BASE / rel_path
    return p.read_text(encoding="utf-8") if p.exists() else ""


# Static reference content — loaded once at import, identical across requests.
# This is the cacheable prefix; the prompt builders below put cache_control
# markers after these blocks.
CULTURAL_GUIDELINES = _read("references/guidelines/cultural-adaptation.md")
STYLE_1 = _read("references/style-examples/01-kavod-haguf-vekedushato.md")
STYLE_2 = _read("references/style-examples/02-ekronot-tezuna-briah.md")
EPISODE_1 = _read("output/podcast-01-takhilato-shel-masa.md")


def _client() -> anthropic.Anthropic:
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key:
        raise RuntimeError("ANTHROPIC_API_KEY לא מוגדר. הגדר אותו כמשתנה סביבה.")
    return anthropic.Anthropic(api_key=key)


def _run(system, user_content: str, max_tokens: int = 8000) -> str:
    """Stream a request and return the final text. Streaming avoids HTTP
    timeouts on long outputs; get_final_message() collects the full response.
    """
    with _client().messages.stream(
        model=MODEL,
        max_tokens=max_tokens,
        thinking={"type": "adaptive"},
        output_config={"effort": "high"},
        system=system,
        messages=[{"role": "user", "content": user_content}],
    ) as stream:
        msg = stream.get_final_message()
    return next((b.text for b in msg.content if b.type == "text"), "")


# ---------------------------------------------------------------------------
# Step 2 — Cultural analysis + Torah suggestions
# ---------------------------------------------------------------------------

def analyze_content(raw_content: str, parashiyot: str, avoid_notes: str) -> str:
    system = [
        {
            "type": "text",
            "text": (
                "אתה סוכן פודקאסטים מומחה לקהל החרדי בישראל. "
                "אתה מנתח חומרי קורסים ומציע התאמות תרבותיות והצעות תורניות "
                "למפתחות למידה ב-L-net."
            ),
        },
        {
            "type": "text",
            "text": f"## הנחיות הסתגלות תרבותית\n\n{CULTURAL_GUIDELINES}",
            "cache_control": {"type": "ephemeral"},
        },
    ]

    user_content = f"""קיבלת חומר גולמי לפרק פודקאסט. בצע ניתוח תרבותי מפורט.

**חומר הפרק:**
{raw_content}

**פרשות/מקורות שביקשו לשלב:**
{parashiyot or 'לא צוין — הצע בעצמך'}

**נושאים לשים לב אליהם:**
{avoid_notes or 'לא צוין'}

---

## א. מושגים לשינוי ניסוח
לכל מושג בעייתי:
- **מושג מקורי:** ...
- **למה בעייתי:** ...
- **ניסוח חלופי:** ...

## ב. תוכן להוריד
(תוכן שאינו מתאים גם עם שינוי ניסוח — נמק)

## ג. הצעות תורניות (4-6 מקורות)
לכל מקור: ציטוט + הסבר הרלוונטיות לנושא

כתוב בעברית. היה ספציפי ומעשי."""

    return _run(system, user_content, max_tokens=3000)


# ---------------------------------------------------------------------------
# Step 3 — Write first draft (~1,200 words = lots of tokens, stream)
# ---------------------------------------------------------------------------

def write_draft(raw_content: str, analysis: str,
                course_name: str, episode_title: str) -> str:
    system = [
        {
            "type": "text",
            "text": (
                "אתה סוכן פודקאסטים מומחה לקהל החרדי בישראל. "
                "אתה כותב תסריטי פודקאסט בדיאלוג בין שני מנחים — "
                "יצחק (מסביר ומעמיק) וחיים (מחבר לחיי היומיום)."
            ),
        },
        {
            "type": "text",
            "text": f"""## דוגמת סגנון 1 — "כבוד הגוף וקדושתו"
{STYLE_1}

## דוגמת סגנון 2 — "עקרונות התזונה הבריאה" (קטע)
{STYLE_2[:2500]}

## פרק מלא לדוגמה — פרק 1 של מנהיגות תודעתית
{EPISODE_1[:4500]}""",
            "cache_control": {"type": "ephemeral"},
        },
    ]

    user_content = f"""**שם הקורס:** {course_name}
**נושא הפרק:** {episode_title}

**חומר הפרק:**
{raw_content}

**ניתוח תרבותי שאושר:**
{analysis}

---

כתוב את תסריט הפרק המלא בפורמט טבלת מרקדאון בלבד:

| # | דובר | תוכן (מה שומעים) | הערות הפקה |
|---|------|------------------|------------|

**כללים:**
- שני מנחים: יצחק (מסביר) וחיים (מחבר לחיים)
- ~1,200 מילים ≈ 10 דקות
- שומרי מקום: [ציטוט תורני – ליועצות הדת: הצעה: <תיאור>]
- ביטויים: "בעז\"ה", "ב\"ה", "יישר כוח", "אמת ויציב"
- מבנה: פתיחה → אג'נדה (3 כדורים) → מעברון → פסקת פתיחה קבועה → גוף → מעברון → סיכום+תרגיל → הצצה → סיום

החזר את הטבלה בלבד, ללא הקדמות."""

    return _run(system, user_content, max_tokens=8000)


# ---------------------------------------------------------------------------
# Step 4 — Haredi listener critique (ר' אברהם)
# ---------------------------------------------------------------------------

def critique_draft(draft: str) -> str:
    system = (
        "אתה ר' אברהם — איש ליטאי בן 42 מבני ברק.\n"
        "- נשוי + 5 ילדים, עובד בסחר יהלומים\n"
        "- לומד דף יומי, ספרייתך: מסילת ישרים, נפש החיים, מכתב מאליהו\n"
        "- ספקן כלפי \"שיפור עצמי\" — מגיב רק לדברים עם יסוד תורני\n"
        "- מיד מרגיש כשמשהו נשמע \"אקדמי\" או \"חילוני\"\n\n"
        "אתה מבקר תסריטי פודקאסט עבור הקהילה החרדית. תפקידך לסמן בעיות "
        "תרבותיות ובעיות איכות תוכן באופן מעשי וספציפי."
    )

    user_content = f"""קרא את תסריט הפודקאסט הזה ובקר אותו:

{draft}

---

החזר ביקורת בפורמט הבא:

## ציון התאמה תרבותית: X/10
[הסבר]

## ציון איכות תוכן: X/10
[הסבר]

## בעיות ספציפיות (לפי מספר שורה)
שורה XX: [בעיה + הצעה לתיקון]

## חובה לתקן
1. ...
2. ...
3. ...

## כדאי לתקן
1. ...
2. ...

## המלצת ר' אברהם
[האם ימשיך להאזין? מה יגיד לחבר אחרי שבת?]"""

    return _run(system, user_content, max_tokens=3000)


# ---------------------------------------------------------------------------
# Step 5 — Revise based on critique
# ---------------------------------------------------------------------------

def revise_draft(draft: str, critique: str) -> str:
    system = (
        "אתה סוכן פודקאסטים מומחה לקהל החרדי. אתה מתקן תסריטי פודקאסט "
        "לפי ביקורת של מאזין מהקהילה, תוך שמירה על מבנה הטבלה והכוונה המקורית."
    )

    user_content = f"""**הטיוטה המקורית:**
{draft}

**ביקורת ר' אברהם:**
{critique}

**הוראות:**
- החל את כל פריטי "חובה לתקן"
- החל "כדאי לתקן" אלא אם סותר את כוונת התוכן
- שמור על מספרי שורות ככל האפשר
- החזר: הטבלה המלאה, ואחריה שורת מפריד "---" ודוח שינויים קצר

פורמט:
[הטבלה המלאה]

---
## דוח שינויים
שורה XX: [מה השתנה]
..."""

    return _run(system, user_content, max_tokens=8000)
