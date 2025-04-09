-- PostgreSQL Setup for Sessions and Devices

-- Sessions Table
CREATE TABLE IF NOT EXISTS "sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
);

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_pkey" 
  PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IF NOT EXISTS "IDX_sessions_expire" ON "sessions" ("expire");

-- Devices Table
CREATE TABLE IF NOT EXISTS "devices" (
  "id" SERIAL PRIMARY KEY,
  "session_id" TEXT NOT NULL,
  "device_id" TEXT NOT NULL,
  "user_agent" TEXT,
  "ip_address" TEXT,
  "last_seen" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "device_session_unique" UNIQUE ("session_id", "device_id")
);

CREATE INDEX IF NOT EXISTS "IDX_devices_session_id" ON "devices" ("session_id");
