import json
import os
import psycopg2

SCHEMA = "t_p34109267_business_card_creato"

def handler(event: dict, context) -> dict:
    """Возвращает данные визитки по slug."""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    params = event.get("queryStringParameters") or {}
    slug = params.get("slug", "").strip()

    if not slug:
        return {
            "statusCode": 400,
            "headers": {**cors, "Content-Type": "application/json"},
            "body": json.dumps({"error": "slug required"}),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        f"SELECT slug, fields, style FROM {SCHEMA}.cards WHERE slug = '{slug.replace(chr(39), chr(39)*2)}' LIMIT 1"
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {
            "statusCode": 404,
            "headers": {**cors, "Content-Type": "application/json"},
            "body": json.dumps({"error": "not found"}),
        }

    return {
        "statusCode": 200,
        "headers": {**cors, "Content-Type": "application/json"},
        "body": json.dumps({"slug": row[0], "fields": row[1], "style": row[2]}),
    }
