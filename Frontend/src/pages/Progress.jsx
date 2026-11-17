import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Grid, Card, Typography, Stack, Button, TextField,
  IconButton, CircularProgress, Collapse, Tabs, Tab, Chip,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Layout from '../components/Layout';
import api from '../api/axios';

const emptyForm = { weight: '', chest: '', waist: '', hips: '', arms: '', thighs: '' };
const measurementKeys = ['chest', 'waist', 'hips', 'arms', 'thighs'];

const Progress = () => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState(0);

  const fetchLogs = () => {
    setLoading(true);
    api
      .get('/progress')
      .then((res) => setLogs(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load progress logs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/progress', {
        weight: Number(form.weight) || undefined,
        bodyMeasurements: {
          chest: Number(form.chest) || undefined,
          waist: Number(form.waist) || undefined,
          hips: Number(form.hips) || undefined,
          arms: Number(form.arms) || undefined,
          thighs: Number(form.thighs) || undefined,
        },
      });
      setForm(emptyForm);
      setShowForm(false);
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save progress log');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.delete(`/progress/${id}`);
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete entry');
    }
  };

  const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedLogs
    .filter((l) => l.weight)
    .map((l) => ({ date: new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), weight: l.weight }));

  // Build "past -> current" trend summaries per measurement, like the analytics reference cards
  const measurementTrends = measurementKeys
    .map((key) => {
      const withValue = sortedLogs.filter((l) => l.bodyMeasurements?.[key]);
      if (withValue.length < 1) return null;
      const past = withValue[0].bodyMeasurements[key];
      const current = withValue[withValue.length - 1].bodyMeasurements[key];
      const delta = +(current - past).toFixed(1);
      return { key, past, current, delta, from: withValue[0].date, to: withValue[withValue.length - 1].date };
    })
    .filter(Boolean);

  return (
    <Layout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="overline" color="text.secondary">Analytics</Typography>
          <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', mt: 0.5 }}>Progress</Typography>
        </Box>
        <Button variant="contained" startIcon={showForm ? <CloseIcon /> : <AddIcon />} onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'New Entry'}
        </Button>
      </Stack>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      {/* Tabs — mirrors the General / Body / Mode / Training analytics layout */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mt: 3,
          minHeight: 40,
          '& .MuiTabs-indicator': { display: 'none' },
        }}
      >
        {['Body', 'Weight', 'Measurements'].map((label, i) => (
          <Tab
            key={label}
            label={label}
            sx={{
              minHeight: 40,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              mr: 1,
              color: 'text.secondary',
              '&.Mui-selected': { color: '#0B0E13', bgcolor: 'secondary.main' },
            }}
          />
        ))}
      </Tabs>

      <Collapse in={showForm}>
        <Card component="form" onSubmit={handleSubmit} sx={{ p: 3, mt: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={4}>
              <TextField type="number" name="weight" label="Weight (kg)" fullWidth value={form.weight} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField type="number" name="chest" label="Chest (cm)" fullWidth value={form.chest} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField type="number" name="waist" label="Waist (cm)" fullWidth value={form.waist} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField type="number" name="hips" label="Hips (cm)" fullWidth value={form.hips} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField type="number" name="arms" label="Arms (cm)" fullWidth value={form.arms} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField type="number" name="thighs" label="Thighs (cm)" fullWidth value={form.thighs} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">Save Entry</Button>
            </Grid>
          </Grid>
        </Card>
      </Collapse>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      )}

      {/* Weight trend chart */}
      {!loading && chartData.length > 1 && (
        <Card sx={{ p: 3, mt: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="overline" color="text.secondary">Weight trend</Typography>
            <Chip
              icon={chartData[chartData.length - 1].weight <= chartData[0].weight ? <TrendingDownIcon sx={{ fontSize: 14, color: '#0B0E13 !important' }} /> : <TrendingUpIcon sx={{ fontSize: 14, color: '#0B0E13 !important' }} />}
              label={`${(chartData[chartData.length - 1].weight - chartData[0].weight).toFixed(1)} kg`}
              size="small"
              sx={{ bgcolor: 'secondary.main', color: '#0B0E13', fontWeight: 700 }}
            />
          </Stack>
          <Box sx={{ height: 260, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8A93A3' }} />
                <YAxis tick={{ fontSize: 12, fill: '#8A93A3' }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: '#151A21', color: '#fff' }} />
                <Line type="monotone" dataKey="weight" stroke="#B6FF3C" strokeWidth={2.5} dot={{ r: 4, fill: '#B6FF3C' }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      )}

      {/* Measurement trend cards — "Past -> Current" style */}
      {!loading && measurementTrends.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {measurementTrends.map((m) => (
            <Grid item xs={12} sm={6} md={4} key={m.key}>
              <Card sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize', fontWeight: 700 }}>{m.key}</Typography>
                  <Chip
                    size="small"
                    icon={m.delta >= 0 ? <TrendingUpIcon sx={{ fontSize: 14, color: '#0B0E13 !important' }} /> : <TrendingDownIcon sx={{ fontSize: 14, color: '#0B0E13 !important' }} />}
                    label={`${m.delta > 0 ? '+' : ''}${m.delta} cm`}
                    sx={{ bgcolor: 'secondary.main', color: '#0B0E13', fontWeight: 700 }}
                  />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Past</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{m.past} cm</Typography>
                  </Box>
                  <ArrowForwardIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Current</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{m.current} cm</Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && logs.length === 0 && (
        <Card sx={{ p: 4, mt: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No progress entries yet — add your first one above.</Typography>
        </Card>
      )}

      {/* Entry list */}
      <Typography variant="h6" sx={{ fontFamily: '"Archivo Black"', fontSize: '1.05rem', mt: 4, mb: 2 }}>
        All Entries
      </Typography>
      <Grid container spacing={2}>
        <AnimatePresence>
          {[...logs].reverse().map((log) => (
            <Grid item xs={12} sm={6} md={4} key={log._id}>
              <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    '&:hover': { borderColor: 'primary.main', boxShadow: '0 10px 24px rgba(255,61,113,0.12)' },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="caption" color="text.secondary">
                      {new Date(log.date).toLocaleDateString()}
                    </Typography>
                    <IconButton size="small" onClick={() => handleDelete(log._id)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Typography variant="h4" sx={{ fontFamily: '"Archivo Black"', color: 'primary.main', mt: 1 }}>
                    {log.weight ? `${log.weight} kg` : '—'}
                  </Typography>
                  {log.bodyMeasurements && (
                    <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mt: 1.5 }}>
                      {Object.entries(log.bodyMeasurements).filter(([, v]) => v).map(([k, v]) => (
                        <Box key={k}>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{k}</Typography>
                          <Typography variant="body2" fontWeight={600}>{v} cm</Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Layout>
  );
};

export default Progress;
