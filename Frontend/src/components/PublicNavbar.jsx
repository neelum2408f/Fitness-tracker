import { Link as RouterLink, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Container, Box, Typography, Button, Avatar, Stack } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const Logo = ({ light }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34 }}>
      <FitnessCenterIcon sx={{ fontSize: 18 }} />
    </Avatar>
    <Typography
      variant="h6"
      sx={{ fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.02em', color: light ? '#fff' : 'inherit' }}
    >
      FIT<Box component="span" sx={{ color: 'primary.main' }}>PULSE</Box>
    </Typography>
  </Stack>
);

const navLinks = [
  { to: '/#features', label: 'Features' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/trainers', label: 'Trainers' },
];

const PublicNavbar = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: 'rgba(11,14,19,0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E3DFD6' }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1, justifyContent: 'space-between' }}>
          <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <Logo />
          </Box>

          <Stack direction="row" spacing={3} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navLinks.map((link) => (
              <Typography
                key={link.to}
                component={link.to.startsWith('/trainers') ? NavLink : 'a'}
                to={link.to.startsWith('/trainers') ? link.to : undefined}
                href={!link.to.startsWith('/trainers') ? link.to : undefined}
                sx={{
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                  '&.active': { color: 'primary.main' },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <Button component={RouterLink} to="/login" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.12)', color: 'text.primary' }}>
              Sign in
            </Button>
            <Button component={RouterLink} to="/register" variant="contained" endIcon={<ArrowForwardIcon />}>
              Get started
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default PublicNavbar;
