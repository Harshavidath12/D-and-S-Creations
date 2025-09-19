const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const designerRoutes = require('./Routes/designerRoutes');
const complaintRoutes = require('./Routes/complaintRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://rashalividyanjani_db_user:jIPJXpoG3NuFgKVf@cluster0.sp3lpkf.mongodb.net/test")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/designers', designerRoutes);
app.use('/api/complaints', complaintRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
