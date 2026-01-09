-- ============================================
-- Migratie Script voor Bestaande Gebruikers
-- ============================================
-- Voer dit script uit als je al gebruikers hebt aangemaakt
-- maar nog geen profielen voor hen hebt

-- Maak profielen aan voor alle bestaande gebruikers die nog geen profiel hebben
INSERT INTO public.profiles (id, email, full_name, created_at)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email) as full_name,
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Update email velden voor bestaande profielen als deze leeg zijn
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- Toon resultaat
SELECT 
  COUNT(*) as total_users,
  (SELECT COUNT(*) FROM public.profiles) as total_profiles,
  COUNT(*) - (SELECT COUNT(*) FROM public.profiles) as missing_profiles
FROM auth.users;
