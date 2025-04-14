-- Migration number: 0001 	 2025-04-10
DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS etfs;
DROP TABLE IF EXISTS price_history;
DROP TABLE IF EXISTS user_watchlists;
DROP TABLE IF EXISTS watchlist_items;
DROP TABLE IF EXISTS technical_indicators;
DROP TABLE IF EXISTS counters;
DROP TABLE IF EXISTS access_logs;

-- Table pour stocker les informations sur les actions
CREATE TABLE IF NOT EXISTS stocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  exchange TEXT NOT NULL,
  currency TEXT NOT NULL,
  sector TEXT,
  industry TEXT,
  country TEXT,
  last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table pour stocker les informations sur les ETFs
CREATE TABLE IF NOT EXISTS etfs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  exchange TEXT NOT NULL,
  currency TEXT NOT NULL,
  category TEXT,
  family TEXT,
  last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table pour stocker l'historique des prix
CREATE TABLE IF NOT EXISTS price_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  open REAL,
  high REAL,
  low REAL,
  close REAL,
  volume INTEGER,
  adjusted_close REAL,
  UNIQUE(symbol, timestamp)
);

-- Table pour stocker les listes de surveillance des utilisateurs
CREATE TABLE IF NOT EXISTS user_watchlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table pour stocker les éléments des listes de surveillance
CREATE TABLE IF NOT EXISTS watchlist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  watchlist_id INTEGER NOT NULL,
  symbol TEXT NOT NULL,
  added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (watchlist_id) REFERENCES user_watchlists(id) ON DELETE CASCADE,
  UNIQUE(watchlist_id, symbol)
);

-- Table pour stocker les indicateurs techniques
CREATE TABLE IF NOT EXISTS technical_indicators (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT NOT NULL,
  indicator_type TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  value REAL NOT NULL,
  UNIQUE(symbol, indicator_type, timestamp)
);

-- Table pour les compteurs d'utilisation
CREATE TABLE IF NOT EXISTS counters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les journaux d'accès
CREATE TABLE IF NOT EXISTS access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT,
  path TEXT,
  accessed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Données initiales
INSERT INTO counters (name, value) VALUES 
  ('page_views', 0),
  ('api_calls', 0);

-- Création d'indices pour optimiser les performances
CREATE INDEX idx_price_history_symbol ON price_history(symbol);
CREATE INDEX idx_price_history_timestamp ON price_history(timestamp);
CREATE INDEX idx_technical_indicators_symbol ON technical_indicators(symbol);
CREATE INDEX idx_watchlist_items_watchlist_id ON watchlist_items(watchlist_id);
CREATE INDEX idx_access_logs_accessed_at ON access_logs(accessed_at);
CREATE INDEX idx_counters_name ON counters(name);

-- Insertion de quelques actions populaires pour démarrer
INSERT INTO stocks (symbol, name, exchange, currency, sector, industry, country) VALUES
  ('AAPL', 'Apple Inc.', 'NASDAQ', 'USD', 'Technology', 'Consumer Electronics', 'US'),
  ('MSFT', 'Microsoft Corporation', 'NASDAQ', 'USD', 'Technology', 'Software', 'US'),
  ('GOOGL', 'Alphabet Inc.', 'NASDAQ', 'USD', 'Communication Services', 'Internet Content & Information', 'US'),
  ('AMZN', 'Amazon.com Inc.', 'NASDAQ', 'USD', 'Consumer Cyclical', 'Internet Retail', 'US'),
  ('TSLA', 'Tesla Inc.', 'NASDAQ', 'USD', 'Consumer Cyclical', 'Auto Manufacturers', 'US');

-- Insertion de quelques ETFs populaires
INSERT INTO etfs (symbol, name, exchange, currency, category, family) VALUES
  ('SPY', 'SPDR S&P 500 ETF Trust', 'NYSE', 'USD', 'Large Blend', 'SPDR'),
  ('QQQ', 'Invesco QQQ Trust', 'NASDAQ', 'USD', 'Large Growth', 'Invesco'),
  ('VTI', 'Vanguard Total Stock Market ETF', 'NYSE', 'USD', 'Large Blend', 'Vanguard'),
  ('IEUR', 'iShares Core MSCI Europe ETF', 'NYSE', 'USD', 'Europe Stock', 'iShares'),
  ('EEM', 'iShares MSCI Emerging Markets ETF', 'NYSE', 'USD', 'Diversified Emerging Mkts', 'iShares');

-- Création d'une liste de surveillance par défaut
INSERT INTO user_watchlists (name) VALUES ('Liste par défaut');

-- Ajout d'éléments à la liste de surveillance par défaut
INSERT INTO watchlist_items (watchlist_id, symbol) VALUES
  (1, 'AAPL'),
  (1, 'MSFT'),
  (1, 'SPY'),
  (1, 'QQQ');
