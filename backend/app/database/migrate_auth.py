import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "occupational_health.db")

def run_migration():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}, skipping migration.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    columns_to_add = [
        ("is_verified", "BOOLEAN DEFAULT 0"),
        ("approval_status", "VARCHAR(20) DEFAULT 'approved'"),
        ("trainer_id", "VARCHAR(50)"),
        ("admin_id", "VARCHAR(50)"),
        ("otp_hash", "VARCHAR(255)"),
        ("otp_purpose", "VARCHAR(50)"),
        ("otp_expires_at", "DATETIME"),
        ("otp_attempts", "INTEGER DEFAULT 0"),
        ("otp_last_sent_at", "DATETIME"),
        ("password_reset_token_hash", "VARCHAR(255)"),
        ("password_reset_expires_at", "DATETIME"),
        ("failed_login_attempts", "INTEGER DEFAULT 0"),
        ("last_login_at", "DATETIME")
    ]

    cursor.execute("PRAGMA table_info(users)")
    existing_columns = [col[1] for col in cursor.fetchall()]

    for col_name, col_def in columns_to_add:
        if col_name not in existing_columns:
            print(f"Adding column '{col_name}' to users table...")
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}")
        else:
            print(f"Column '{col_name}' already exists.")

    conn.commit()
    conn.close()
    print("Database migration completed successfully!")

if __name__ == "__main__":
    run_migration()
