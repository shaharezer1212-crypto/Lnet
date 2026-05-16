"""Claude API calls for each step of the podcast creation workflow."""

import os
from pathlib import Path
import anthropic

BASE = Path(__file__).parent.parent  # /home/user/Lnet


def _read(rel_path: str) -> str:
    p = BASE / rel_path
    return p.read_text(encoding="utf-8") if p.exists() else ""


CULTURAL_GUIDELINES = _read("references/guidelines/cultural-adaptation.md")
STYLE_1 = _read("references/style-examples/01-kavod-haguf-vekedushato.md")
STYLE_2 = _read("references/style-examples/02-ekronot-tezuna-briah.md")
EPISODE_1 = _read("output/podcast-01-takhilato-shel-masa.md")


def _client() -> anthropic.Anthropic:
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key:
        raise RuntimeError("ANTHROPIC_API_KEY לא מוגדר. הגדר אותו כמשתנה סביבה.")
    return anthropic.Anthropic(api_key=key)


def _call(prompt: str, max_tokens: int = 3000) -> str:
    msg = _client().messages.create(
        model="claude-opus-4-5",
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}],
    )
    return msg.content[0].text


# ---------------------------------------------------------------------------
# Step 2 — Cultural analysis + Torah suggestions
# ---------------------------------------------------------------------------

def analyze_content(raw_content: str, parashiyot: str, avoid_notes: str) -> str:
    prompt = f"""אתה סוכן פודקאסטים מומחה לקהל החרדי בישראל.

## הנחיות הסתגלות תרבותית
{CULTURAL_GUIDELINES}

---

קיבלת חומר גולמי לפרק פודקאסט. בצע ניתוח תרבותי מפורט.

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
    return _call(prompt, max_tokens=2000)


# ---------------------------------------------------------------------------
# Step 3 — Write first draft
# ---------------------------------------------------------------------------

def write_draft(raw_content: str, analysis: str,
                course_name: str, episode_title: str) -> str:
    prompt = f"""אתה סוכן פודקאסטים מומחה לקהל החרדי בישראל.

## דוגמת סגנון 1
{STYLE_1}

## דוגמת סגנון 2 (קצרה)
{STYLE_2[:2000]}

## פרק לדוגמה (פורמט מלא)
{EPISODE_1[:3000]}

---

**שם הקורס:** {course_name}
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
- ביטויים: "בעז"ה", "ב"ה", "יישר כוח", "אמת ויציב"
- מבנה: פתיחה → אג'נדה (3 כדורים) → מעברון → פסקת פתיחה קבועה → גוף → מעברון → סיכום+תרגיל → הצצה → סיום

החזר את הטבלה בלבד, ללא הקדמות."""
    return _call(prompt, max_tokens=4500)


# ---------------------------------------------------------------------------
# Step 4 — Haredi listener critique
# ---------------------------------------------------------------------------

def critique_draft(draft: str) -> str:
    prompt = f"""אתה ר' אברהם — איש ליטאי בן 42 מבני ברק.
- נשוי + 5 ילדים, עובד בסחר יהלומים
- לומד דף יומי, ספרייתך: מסילת ישרים, נפש החיים, מכתב מאליהו
- ספקן כלפי "שיפור עצמי" — מגיב רק לדברים עם יסוד תורני
- מיד מרגיש כשמשהו נשמע "אקדמי" או "חילוני"

קרא את תסריט הפודקאסט ובקר אותו:

{draft}

---

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
    return _call(prompt, max_tokens=2000)


# ---------------------------------------------------------------------------
# Step 5 — Revise based on critique
# ---------------------------------------------------------------------------

def revise_draft(draft: str, critique: str) -> str:
    prompt = f"""אתה סוכן פודקאסטים מומחה לקהל החרדי.

**הטיוטה המקורית:**
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
    return _call(prompt, max_tokens=4500)
