import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppBar, Toolbar, Container, Box, Typography, Button, Card, Avatar,
  Grid, Stack, Chip,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

// NOTE: These are placeholder trainer profiles (generic avatars + illustrative
// specialties) — not real people. Swap in your own instructors' names, photos
// and bios here once you have them.
const trainers = [
  { name: 'Ayesha', specialties: ['Strength Training', 'Stretching'], seed: 'trainer-ayesha' },
  { name: 'Hamza', specialties: ['Treadmill', 'Outdoor Running'], seed: 'trainer-hamza' },
  { name: 'Sana', specialties: ['Yoga', 'Meditation'], seed: 'trainer-sana' },
  { name: 'Bilal', specialties: ['Indoor Cycling', 'Strength Training'], seed: 'trainer-bilal' },
  { name: 'Mahnoor', specialties: ['Stair Climber', 'Elliptical', 'Stretching'], seed: 'trainer-mahnoor' },
  { name: 'Danish', specialties: ['Outdoor Running', 'Treadmill'], seed: 'trainer-danish' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' } }),
};

const Logo = () => (
  <Stack component={RouterLink} to="/" direction="row" alignItems="center" spacing={1} sx={{ textDecoration: 'none' }}>
    <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34 }}>
      <FitnessCenterIcon sx={{ fontSize: 18 }} />
    </Avatar>
    <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', color: 'text.primary' }}>
      FIT<Box component="span" sx={{ color: 'primary.main' }}>PULSE</Box>
    </Typography>
  </Stack>
);

const Trainers = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(11,14,19,0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1, justifyContent: 'space-between' }}>
            <Logo />
            <Stack direction="row" spacing={1.5}>
              <Button component={RouterLink} to="/" variant="text" sx={{ color: 'text.secondary' }}>Home</Button>
              <Button component={RouterLink} to="/login" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.12)', color: 'text.primary' }}>Sign in</Button>
              <Button component={RouterLink} to="/register" variant="contained" endIcon={<ArrowForwardIcon />}>Get started</Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 9 }, pb: 4 }}>
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Typography variant="overline" color="text.secondary">Meet the team</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, mt: 1, maxWidth: 700 }}>
            Trainers who keep you moving
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 560 }}>
            A diverse group of certified coaches covering strength, cardio, yoga and recovery —
            here to guide the programs you log in FitPulse.
          </Typography>
        </motion.div>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 10 } }}>
        <Grid container spacing={3}>
          {trainers.map((t, i) => (
            <Grid item xs={12} sm={6} md={4} key={t.name}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={i} whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Card sx={{ overflow: 'hidden', '&:hover': { borderColor: 'primary.main' } }}>
                  <Box sx={{ position: 'relative', height: 220, bgcolor: '#0F131A' }}>
                    <Box
                      component="img"
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${t.seed}&backgroundColor=151a21`}
                      alt={`${t.name} avatar`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', '&:hover': { opacity: 1 }, bgcolor: 'rgba(11,14,19,0.4)' }}>
                      <PlayCircleIcon sx={{ fontSize: 48, color: '#fff' }} />
                    </Box>
                  </Box>
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.1rem' }}>{t.name}</Typography>
                    <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1.5 }}>
                      {t.specialties.map((s) => (
                        <Chip key={s} label={s} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: 'text.secondary' }} />
                      ))}
                    </Stack>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 10 } }}>
        <Card sx={{ p: { xs: 4, md: 5 }, bgcolor: '#0F131A', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.6rem' }}>Ready to train with us?</Typography>
            <Typography sx={{ color: 'text.secondary', mt: 1 }}>Create your free account and start logging today.</Typography>
          </Box>
          <Button component={RouterLink} to="/register" size="large" variant="contained" endIcon={<ArrowForwardIcon />}>
            Get started free
          </Button>
        </Card>
      </Container>
    </Box>
  );
};

export default Trainers;
