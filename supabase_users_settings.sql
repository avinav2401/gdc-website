CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password TEXT NOT NULL DEFAULT 'gdc2026',
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  singleton_id TEXT DEFAULT 'global' UNIQUE,
  theme_primary TEXT DEFAULT '#38bdf8',
  theme_secondary TEXT DEFAULT '#f472b6',
  theme_bg TEXT DEFAULT '#0d0d12',
  theme_bg_dark TEXT DEFAULT '#050508',
  theme_yellow TEXT DEFAULT '#fbbf24',
  hero_video_url TEXT DEFAULT 'https://cdn.pixabay.com/video/2020/07/20/45184-442220456_large.mp4',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
