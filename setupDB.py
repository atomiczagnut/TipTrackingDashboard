import sqlite3

DATABASE_NAME = "C:\\Users\\atomi\\OneDrive\\Code\\JavaScript\\TipTrackingDashboard\\tip_data.db"

conn = sqlite3.connect(DATABASE_NAME)

cursor = conn.cursor()

create_table_query = '''
CREATE TABLE IF NOT EXISTS tips (
    shift_id INTEGER PRIMARY KEY,
    date TEXT,
    day_of_week TEXT,
    am_or_pm TEXT,
    hours_worked DECIMAL,
    tips_earned DECIMAL
);
'''

cursor.execute(create_table_query)

initial_data = [
    (1, "2025-09-30", "Tue", "AM", 3.83, 64.57),
    (2, "2025-10-01", "Wed", "PM", 4.98, 54.06),
    (3, "2025-10-02", "Thu", "AM", 3.84, 63.18),
    (4, "2025-10-03", "Fri", "AM", 3.20, 46.99),
    (5, "2025-10-04", "Sat", "PM", 4.71, 83.61)
]

insert_data_query = '''
INSERT INTO tips (shift_id, date, day_of_week, am_or_pm, hours_worked, tips_earned)
VALUES(?, ?, ?, ?, ?, ?)
'''

cursor.executemany(insert_data_query, initial_data)

conn.commit()

conn.close()

print(f"Database '{DATABASE_NAME}' has been created and populated successfully.")