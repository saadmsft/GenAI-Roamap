
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Dashboard,
  Map,
  Assignment,
  BarChart,
  Psychology,
  Article,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Dashboard /> },
    { path: '/roadmap', label: 'Roadmap', icon: <Map /> },
    { path: '/projects', label: 'Projects', icon: <Assignment /> },
    { path: '/skills', label: 'Skills', icon: <Psychology /> },
    { path: '/progress', label: 'Progress', icon: <BarChart /> },
    { path: '/content', label: 'Content', icon: <Article /> },
  ];

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GenAI Architect Roadmap
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
