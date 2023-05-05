const express = require('express');
const app = express();
const parentData = require('./Parent.json').data;
const childData = require('./Child.json').data;
var cors = require('cors');

app.use(cors());

const pageSize = 2;

app.get('/api/parents', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const sortedData = parentData.sort((a, b) => a.id - b.id);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = sortedData.slice(start, end).map(parent => {
    const children = childData.filter(child => child.parentId === parent.id);
    const totalAmount = children.reduce((total, child) => total + child.paidAmount, 0);
    return { ...parent, totalPaidAmount: totalAmount };
  });
  res.json(paginatedData);
});

app.get('/api/parents/:parentId/children', async(req, res) => {
    const parentId = parseInt(req.params.parentId);
    const parent = { ...parentData.filter(parent => parent.id === parentId)[0] };
    if (!parent) {
        return res.status(404).json({ error: `Parent with id ${parentId} not found.` });
    }
    delete parent.id;
    const sortedChildren = childData
      .filter((child) => child.parentId === parentId)
      .sort((a, b) => a.id - b.id)
      .map(item => ({...item, ...parent}));
  
    res.json(sortedChildren);
  });

// Start the server
app.listen(8080, () => console.log('Server started on port 8080'));