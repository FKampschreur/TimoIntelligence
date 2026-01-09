-- ============================================
-- Timo Intelligence Content Management Schema
-- Supabase Database Setup
-- ============================================

-- Tabel voor website content
CREATE TABLE IF NOT EXISTS content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index voor snelle queries
CREATE INDEX IF NOT EXISTS idx_content_updated_at ON content(updated_at);

-- Functie om updated_at automatisch bij te werken
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger om updated_at automatisch bij te werken bij updates
DROP TRIGGER IF EXISTS update_content_updated_at ON content;
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Tabel voor content versiegeschiedenis (optioneel, voor backup/restore)
CREATE TABLE IF NOT EXISTS content_history (
  id SERIAL PRIMARY KEY,
  content_id TEXT NOT NULL DEFAULT 'main',
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  change_description TEXT
);

-- Index voor versiegeschiedenis queries
CREATE INDEX IF NOT EXISTS idx_content_history_content_id ON content_history(content_id);
CREATE INDEX IF NOT EXISTS idx_content_history_created_at ON content_history(created_at DESC);

-- Functie om automatisch versiegeschiedenis bij te houden (optioneel)
CREATE OR REPLACE FUNCTION save_content_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO content_history (content_id, data, created_at)
  VALUES (OLD.id, OLD.data, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger om versiegeschiedenis bij te houden (optioneel)
DROP TRIGGER IF EXISTS content_history_trigger ON content;
CREATE TRIGGER content_history_trigger
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION save_content_history();

-- Tabel voor admin gebruikers (optioneel, voor meerdere admins)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Index voor admin users
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Tabel voor audit log (optioneel, voor tracking van wijzigingen)
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index voor audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);

-- Row Level Security (RLS) Policies
-- Schakel RLS in voor content tabel
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Policy: Iedereen kan content lezen (publiek)
CREATE POLICY "Content is publicly readable"
  ON content FOR SELECT
  USING (true);

-- Policy: Alleen geauthenticeerde gebruikers kunnen content updaten
-- Pas dit aan naar je eigen authenticatie systeem
CREATE POLICY "Authenticated users can update content"
  ON content FOR UPDATE
  USING (true); -- Voor nu: iedereen kan updaten. Pas aan naar je auth systeem

-- Policy: Alleen geauthenticeerde gebruikers kunnen content aanmaken
CREATE POLICY "Authenticated users can insert content"
  ON content FOR INSERT
  WITH CHECK (true); -- Voor nu: iedereen kan inserten. Pas aan naar je auth systeem

-- Schakel RLS in voor admin_users tabel
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Alleen admins kunnen andere admins zien (pas aan naar je eigen systeem)
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  USING (true); -- Pas aan naar je authenticatie systeem

-- Schakel RLS in voor audit_log tabel
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Alleen admins kunnen audit logs zien
CREATE POLICY "Admins can view audit logs"
  ON audit_log FOR SELECT
  USING (true); -- Pas aan naar je authenticatie systeem

-- Schakel RLS in voor content_history tabel
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;

-- Policy: Iedereen kan versiegeschiedenis lezen
CREATE POLICY "Content history is readable"
  ON content_history FOR SELECT
  USING (true);

-- ============================================
-- Helper Functies
-- ============================================

-- Functie om laatste versie van content op te halen
CREATE OR REPLACE FUNCTION get_latest_content()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT data INTO result
  FROM content
  WHERE id = 'main'
  LIMIT 1;
  
  RETURN COALESCE(result, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql;

-- Functie om content op te slaan
CREATE OR REPLACE FUNCTION save_content(new_data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO content (id, data)
  VALUES ('main', new_data)
  ON CONFLICT (id) 
  DO UPDATE SET data = new_data;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Functie om versiegeschiedenis op te halen
CREATE OR REPLACE FUNCTION get_content_history(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id INTEGER,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT ch.id, ch.data, ch.created_at
  FROM content_history ch
  WHERE ch.content_id = 'main'
  ORDER BY ch.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Functie om specifieke versie te herstellen
CREATE OR REPLACE FUNCTION restore_content_version(version_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  version_data JSONB;
BEGIN
  SELECT data INTO version_data
  FROM content_history
  WHERE id = version_id AND content_id = 'main';
  
  IF version_data IS NULL THEN
    RETURN false;
  END IF;
  
  UPDATE content
  SET data = version_data
  WHERE id = 'main';
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Initial Data (Optioneel)
-- ============================================

-- Voeg default content toe als deze nog niet bestaat
INSERT INTO content (id, data)
VALUES ('main', '{
  "hero": {
    "tag": "POWERED BY HOLLAND FOOD SERVICE",
    "titleLine1": "Intelligente Software.",
    "titleLine2": "Geboren in de Praktijk.",
    "description": "Vanuit Holland Food Service en Timo Vastgoed ontwikkelden wij het ultieme AI-ecosysteem voor logistiek, vastgoed en procesoptimalisatie. Nu beschikbaar voor uw organisatie.",
    "buttonPrimary": "Bekijk onze oplossingen",
    "buttonSecondary": "Vraag demo aan"
  },
  "solutions": [],
  "about": {
    "tag": "ONZE KRACHT",
    "titleLine1": "Gebouwd op Ervaring.",
    "titleLine2": "Gedreven door Innovatie.",
    "paragraph1": "Vanuit Holland Food Service en Timo Vastgoed hebben wij jarenlang de uitdagingen van logistiek en vastgoedmanagement van dichtbij meegemaakt.",
    "paragraph2": "Onze software is niet ontwikkeld in een laboratorium, maar geboren uit echte bedrijfsprocessen.",
    "paragraph3": "Nu delen wij deze intelligentie met organisaties die klaar zijn voor de volgende stap.",
    "feature1Title": "Praktijkervaring",
    "feature1Description": "Jarenlange ervaring in logistiek en vastgoedmanagement",
    "feature2Title": "Innovatie",
    "feature2Description": "Voortdurende ontwikkeling van AI-gedreven oplossingen",
    "imageUrl": "",
    "imageCaption": "",
    "imageSubcaption": ""
  },
  "partners": {
    "title": "Voor Partners & Aanbestedingen",
    "description": "Op zoek naar een technologiepartner die de taal van aanbestedingen spreekt?",
    "feature1Title": "Innovatiekracht",
    "feature1Description": "Onderscheidend vermogen in EMVI plannen.",
    "feature2Title": "ISO & Compliance",
    "feature2Description": "Veiligheid en data-integriteit gewaarborgd."
  },
  "contact": {
    "title": "Neem Contact Op",
    "introText": "Klaar om uw organisatie te optimaliseren met Timo Intelligence?",
    "addressStreet": "Nieuwe Aamsestraat 42",
    "addressPostalCode": "6662 NK Elst (Gld)",
    "addressCity": "",
    "addressNote": "(Gevestigd bij Holland Food Service)",
    "email": "info@timointelligence.nl",
    "phone": "+31 (0)481 37 45 45",
    "formTitle": "Stuur ons een bericht",
    "buttonText": "Verstuur Bericht"
  }
}'::JSONB)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Comments voor documentatie
-- ============================================

COMMENT ON TABLE content IS 'Hoofdtabel voor website content. Bevat alle bewerkbare content zoals hero, solutions, about, partners en contact secties.';
COMMENT ON TABLE content_history IS 'Versiegeschiedenis van content wijzigingen. Maakt het mogelijk om wijzigingen terug te draaien.';
COMMENT ON TABLE admin_users IS 'Admin gebruikers voor toegang tot het beheerpaneel.';
COMMENT ON TABLE audit_log IS 'Audit log voor het bijhouden van alle wijzigingen en acties.';

COMMENT ON FUNCTION get_latest_content() IS 'Haalt de laatste versie van content op.';
COMMENT ON FUNCTION save_content(JSONB) IS 'Slaat nieuwe content op of update bestaande content.';
COMMENT ON FUNCTION get_content_history(INTEGER) IS 'Haalt versiegeschiedenis op met optionele limit.';
COMMENT ON FUNCTION restore_content_version(INTEGER) IS 'Herstelt een specifieke versie van content.';
