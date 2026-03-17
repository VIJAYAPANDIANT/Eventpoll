-- SQL schema for Eventpoll migration to PostgreSQL (Neon)

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    userRole VARCHAR(50),
    pollsCreated JSONB DEFAULT '[]',
    templateCreated JSONB DEFAULT '[]',
    pollsAttended JSONB DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    adminId VARCHAR(255),
    templateName VARCHAR(255),
    questions JSONB DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS polls (
    id SERIAL PRIMARY KEY,
    pollId VARCHAR(255) UNIQUE,
    adminId VARCHAR(255),
    pollName VARCHAR(255),
    templateName VARCHAR(255),
    questions JSONB DEFAULT '[]',
    pollStatus BOOLEAN DEFAULT TRUE,
    usersAttended JSONB DEFAULT '[]',
    pollCreatedAt VARCHAR(50),
    pollEndsAt VARCHAR(50)
);
