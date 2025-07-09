
import { createTheme, ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Progress from './pages/Progress';
import Content from './pages/Content';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '12px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/content" element={<Content />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
