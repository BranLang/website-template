const express = require('express');
const { router: authRouter } = require('./auth');
const { authenticateJWT, rolesGuard } = require('./middleware');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

app.get('/admin', authenticateJWT, rolesGuard('admin'), (req, res) => {
  res.json({ message: 'Welcome admin' });
});

app.listen(3000, () => console.log('Server running'));
