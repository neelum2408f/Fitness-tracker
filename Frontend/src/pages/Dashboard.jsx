import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box, Grid, Card, Typography, Stack, Avatar, Badge, IconButton,
  CircularProgress, Chip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TimerIcon from '@mui/icons-material/Timer';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import { Link as RouterLink } from 'react-router-dom';
import ProgressRing from '../components/ProgressRing';
import Layout from '../components/Layout';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const cardArt = ['#FF3D71', '#B6FF3C', '#31D9FF', '#9B6BFF'];
const weekdayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard')
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  // Build a simple "did I train this day" map for the current week from recent workouts
  const weekActivity = weekdayLabels.map((label, i) => {
    const hasWorkout = data?.recentWorkouts?.some((w) => {
      const d = new Date(w.date);
      const jsDay = d.getDay(); // 0=Sun..6=Sat
      const mondayIndexed = jsDay === 0 ? 6 : jsDay - 1;
      const now = new Date();
      const withinWeek = (now - d) / 86400000 < 7;
      return mondayIndexed === i && withinWeek;
    });
    const isToday = (() => {
      const now = new Date();
      const jsDay = now.getDay();
      const mondayIndexed = jsDay === 0 ? 6 : jsDay - 1;
      return mondayIndexed === i;
    })();
    return { label, hasWorkout, isToday };
  });

  const weeklyMinutes = data?.recentWorkouts?.reduce((sum, w) => sum + (w.duration || 0), 0) || 0;

  return (
    <Layout>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}

      {data && (
        <>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={`https://i.pravatar.cc/80?u=${user?._id || user?.email}`}
                sx={{ width: 52, height: 52, border: '2px solid #FF3D71' }}
              />
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.4rem' }}>
                  Hello, {user?.name?.split(' ')[0] || 'Athlete'} 👋
                </Typography>
              </Box>
            </Stack>
            <IconButton
              component={RouterLink}
              to="/notifications"
              sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Badge badgeContent={data.unreadNotifications} color="primary">
                <NotificationsIcon sx={{ color: 'text.primary' }} />
              </Badge>
            </IconButton>
          </Stack>

          {/* Rings card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Box>
                  <Typography variant="overline" color="text.secondary">Current</Typography>
                  <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.1rem' }}>
                    {data.totalWorkouts} total workout{data.totalWorkouts === 1 ? '' : 's'}
                  </Typography>
                </Box>
                <Chip component={RouterLink} to="/workouts" clickable label="+ Add Workout" sx={{ bgcolor: 'primary.main', color: '#0B0E13', fontWeight: 700 }} />
              </Stack>

              <Stack direction="row" justifyContent="space-around" sx={{ mt: 4, flexWrap: 'wrap', gap: 3 }}>
                <ProgressRing
                  value={Math.min(data.totalWorkouts, 30)}
                  max={30}
                  color="#FF3D71"
                  icon={<FitnessCenterIcon sx={{ color: '#FF3D71', fontSize: 22 }} />}
                  label="Workouts"
                />
                <ProgressRing
                  value={Math.min(data.weeklyCalories, 14000)}
                  max={14000}
                  color="#B6FF3C"
                  icon={<LocalFireDepartmentIcon sx={{ color: '#B6FF3C', fontSize: 22 }} />}
                  label="Kcal (week)"
                />
                <ProgressRing
                  value={Math.min(weeklyMinutes, 300)}
                  max={300}
                  color="#31D9FF"
                  icon={<TimerIcon sx={{ color: '#31D9FF', fontSize: 22 }} />}
                  label="Minutes"
                />
              </Stack>

              <Stack sx={{ mt: 1 }}>
                <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', textAlign: 'center', mt: 1 }}>
                  {data.totalWorkouts} <Typography component="span" variant="body2" color="text.secondary">workouts</Typography>
                  {'  '}·{'  '}
                  {data.weeklyCalories}<Typography component="span" variant="body2" color="text.secondary"> kcal</Typography>
                  {'  '}·{'  '}
                  {weeklyMinutes}<Typography component="span" variant="body2" color="text.secondary"> min</Typography>
                </Typography>
              </Stack>
            </Card>
          </motion.div>

          {/* Weekly tracker */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <Card sx={{ p: 3, mt: 2.5 }}>
              <Typography variant="overline" color="text.secondary">This week</Typography>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                {weekActivity.map((d) => (
                  <Box key={d.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: d.hasWorkout ? 'primary.main' : 'rgba(255,255,255,0.06)',
                        border: d.isToday ? '2px solid #31D9FF' : '2px solid transparent',
                      }}
                    >
                      {d.hasWorkout && <FitnessCenterIcon sx={{ fontSize: 16, color: '#0B0E13' }} />}
                    </Box>
                    <Typography variant="caption" sx={{ color: d.isToday ? '#31D9FF' : 'text.secondary', fontWeight: d.isToday ? 700 : 400 }}>
                      {d.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          </motion.div>

          {/* Recent workouts as "program" cards */}
          <Box sx={{ mt: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.1rem' }}>
                Recent Workouts
              </Typography>
              <Typography component={RouterLink} to="/workouts" variant="body2" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}>
                See all →
              </Typography>
            </Stack>

            {data.recentWorkouts?.length ? (
              <Grid container spacing={2}>
                {data.recentWorkouts.map((w, i) => (
                  <Grid item xs={12} sm={6} md={4} key={w._id}>
                    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                      <Card
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          height: 150,
                          p: 2.5,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          '&:hover': { borderColor: cardArt[i % cardArt.length] },
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            background: `radial-gradient(circle at 85% 15%, ${cardArt[i % cardArt.length]}33, transparent 55%)`,
                          }}
                        />
                        <FitnessCenterIcon sx={{ position: 'absolute', top: 16, right: 16, color: cardArt[i % cardArt.length], opacity: 0.5, fontSize: 30 }} />
                        <Chip
                          size="small"
                          label={w.category}
                          sx={{ alignSelf: 'flex-start', mb: 1, textTransform: 'capitalize', bgcolor: 'rgba(255,255,255,0.08)', color: 'text.primary' }}
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{w.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{w.duration || 0} min</Typography>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No workouts yet — log your first one!</Typography>
              </Card>
            )}
          </Box>

          {/* Nutrition + weight side cards */}
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Typography variant="overline" color="text.secondary">Recent Nutrition</Typography>
                {data.recentNutrition?.length ? (
                  <Stack sx={{ mt: 2 }} divider={<Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} />} spacing={1.5}>
                    {data.recentNutrition.map((n) => (
                      <Stack key={n._id} direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ bgcolor: 'rgba(182,255,60,0.12)', width: 32, height: 32 }}>
                            <RestaurantIcon sx={{ fontSize: 16, color: '#B6FF3C' }} />
                          </Avatar>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>{n.mealType}</Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">{n.totalCalories} kcal</Typography>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>No nutrition logs yet.</Typography>
                )}
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: 'rgba(49,217,255,0.12)', width: 36, height: 36 }}>
                    <MonitorWeightIcon sx={{ color: '#31D9FF' }} />
                  </Avatar>
                  <Typography variant="overline" color="text.secondary">Latest Weight</Typography>
                </Stack>
                <Typography variant="h3" sx={{ fontFamily: '"Archivo Black"', mt: 2 }}>
                  {data.latestProgress?.weight ? `${data.latestProgress.weight}` : '—'}
                  <Typography component="span" variant="body1" color="text.secondary"> kg</Typography>
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
