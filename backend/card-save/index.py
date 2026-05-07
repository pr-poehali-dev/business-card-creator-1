import json
import os
import random
import string

import psycopg2

SCHEMA = "t_p34109267_business_card_creato"

def make_slug():
    chars = string.ascii_lowercase + string.digits
    return "".join(random.choices(chars, k=8))

def handler(event: dict, context) -> dict:
    """Сохраняет или обновляет визитку, возвращает slug и URL."""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    body = json.loads(event.get("body") or "{}")
    fields = body.get("fields", [])
    style = body.get("style", {})
    slug = body.get("slug") or make_slug()

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute(
        f"""
        INSERT INTO {SCHEMA}.cards (slug, fields, style, updated_at)
        VALUES ('{slug}', '{json.dumps(fields, ensure_ascii=False).replace("'", "''")}',
                '{json.dumps(style, ensure_ascii=False).replace("'", "''")}', NOW())
        ON CONFLICT (slug) DO UPDATE
          SET fields = EXCLUDED.fields,
              style  = EXCLUDED.style,
              updated_at = NOW()
        RETURNING slug, created_at, updated_at
        """
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": {**cors, "Content-Type": "application/json"},
        "body": json.dumps({
            "slug": row[0],
            "url": f"/card/{row[0]}",
        }),
    }