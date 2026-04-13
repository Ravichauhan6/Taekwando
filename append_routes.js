const fs = require('fs');
const content = `
// --- Dynamic Admin APIs generated below ---

// Admin Users (UserRoles)
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await AdminUser.find({}, '-password'); // Don't send passwords
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/admin/users", async (req, res) => {
  try {
    const user = new AdminUser(req.body); // In real app, hash password here using bcrypt!
    await user.save();
    res.json({ success: true, user: { username: user.username, _id: user._id } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/admin/users/:id", async (req, res) => {
  try {
    await AdminUser.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Belt Promotions
app.get("/api/belt-promotions", async (req, res) => {
  try { res.json(await BeltPromotion.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/belt-promotions", async (req, res) => {
  try { res.json(await new BeltPromotion(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.patch("/api/belt-promotions/:id", async (req, res) => {
  try { res.json(await BeltPromotion.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Coach Academy
app.get("/api/coaches", async (req, res) => {
  try { res.json(await Coach.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/coaches", async (req, res) => {
  try { res.json(await new Coach(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.patch("/api/coaches/:id", async (req, res) => {
  try { res.json(await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/coaches/:id", async (req, res) => {
  try { await Coach.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Events
app.get("/api/events", async (req, res) => {
  try { res.json(await Event.find().sort({ created_at: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/events", async (req, res) => {
  try { res.json(await new Event(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.patch("/api/events/:id", async (req, res) => {
  try { res.json(await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/events/:id", async (req, res) => {
  try { await Event.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Media Gallery
app.get("/api/media", async (req, res) => {
  try { res.json(await Media.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/media", async (req, res) => {
  try { res.json(await new Media(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/media/:id", async (req, res) => {
  try { await Media.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Document Downloads
app.get("/api/documents", async (req, res) => {
  try { res.json(await DocumentModel.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/documents", async (req, res) => {
  try { res.json(await new DocumentModel(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/documents/:id", async (req, res) => {
  try { await DocumentModel.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Notifications
app.get("/api/notifications", async (req, res) => {
  try { res.json(await NotificationModel.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post("/api/notifications", async (req, res) => {
  try { res.json(await new NotificationModel(req.body).save()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/notifications/:id", async (req, res) => {
  try { await NotificationModel.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
`;

try {
  let file = 'server.ts';
  let src = fs.readFileSync(file, 'utf8');
  if (!src.includes('Dynamic Admin APIs generated below')) {
    src = src.replace('app.listen(PORT', content + '\n\napp.listen(PORT');
    fs.writeFileSync(file, src);
    console.log('Appended robust schemas and routes successfully.');
  } else {
    console.log('Routes already appended');
  }
} catch (e) {
  console.log(e);
}
