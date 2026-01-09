/**
 * Supabase Backend Server voor Timo Intelligence
 * 
 * Dit is een Express.js server die als proxy fungeert tussen je frontend
 * en Supabase. Dit is nodig omdat Supabase Row Level Security (RLS) policies
 * directe frontend toegang kan beperken.
 * 
 * Alternatief: Je kunt ook Supabase Edge Functions gebruiken (zie supabase/functions/)
 */

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuratie
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Supabase client initialiseren
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key voor backend

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY moeten zijn ingesteld in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Timo Intelligence API'
  });
});

// GET /api/content - Haal content op
app.get('/api/content', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('data')
      .eq('id', 'main')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Content bestaat nog niet
        return res.status(404).json({ error: 'Content not found' });
      }
      throw error;
    }

    if (!data || !data.data) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(data.data);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ 
      error: 'Failed to fetch content',
      message: error.message 
    });
  }
});

// PUT /api/content - Sla content op
app.put('/api/content', async (req, res) => {
  try {
    const contentData = req.body;

    // Valideer dat content data aanwezig is
    if (!contentData || typeof contentData !== 'object') {
      return res.status(400).json({ error: 'Invalid content data' });
    }

    // Valideer basis structuur
    const requiredFields = ['hero', 'solutions', 'about', 'partners', 'contact'];
    const missingFields = requiredFields.filter(field => !contentData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        missing: missingFields 
      });
    }

    // Sla op in Supabase (upsert = insert of update)
    const { data, error } = await supabase
      .from('content')
      .upsert({
        id: 'main',
        data: contentData
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log naar audit log (optioneel)
    try {
      await supabase
        .from('audit_log')
        .insert({
          action: 'UPDATE',
          table_name: 'content',
          record_id: 'main',
          new_data: contentData,
          ip_address: req.ip,
          user_agent: req.get('user-agent')
        });
    } catch (auditError) {
      // Audit log fout mag niet de main request breken
      console.warn('Failed to log audit:', auditError);
    }

    res.json({ success: true, updated_at: data.updated_at });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ 
      error: 'Failed to save content',
      message: error.message 
    });
  }
});

// GET /api/content/history - Haal versiegeschiedenis op
app.get('/api/content/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const { data, error } = await supabase
      .from('content_history')
      .select('id, data, created_at, change_description')
      .eq('content_id', 'main')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch history',
      message: error.message 
    });
  }
});

// POST /api/content/restore/:versionId - Herstel specifieke versie
app.post('/api/content/restore/:versionId', async (req, res) => {
  try {
    const versionId = parseInt(req.params.versionId);
    
    if (isNaN(versionId)) {
      return res.status(400).json({ error: 'Invalid version ID' });
    }

    // Haal versie op
    const { data: version, error: fetchError } = await supabase
      .from('content_history')
      .select('data')
      .eq('id', versionId)
      .eq('content_id', 'main')
      .single();

    if (fetchError || !version) {
      return res.status(404).json({ error: 'Version not found' });
    }

    // Herstel content
    const { error: restoreError } = await supabase
      .from('content')
      .upsert({
        id: 'main',
        data: version.data
      }, {
        onConflict: 'id'
      });

    if (restoreError) {
      throw restoreError;
    }

    res.json({ success: true, message: 'Content restored' });
  } catch (error) {
    console.error('Error restoring content:', error);
    res.status(500).json({ 
      error: 'Failed to restore content',
      message: error.message 
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Timo Intelligence API Server running on port ${PORT}`);
  console.log(`📡 Supabase URL: ${supabaseUrl}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'all origins'}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/content`);
  console.log(`  PUT  /api/content`);
  console.log(`  GET  /api/content/history`);
  console.log(`  POST /api/content/restore/:versionId`);
});
