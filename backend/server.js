import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();  // Çevre değişkenlerini yükle
console.log("MONGO_URI:", process.env.MONGO_URI);
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Bağlantısı
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ Hata: MONGO_URI tanımlanmamış!");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB'ye başarıyla bağlandı"))
  .catch((err) => {
    console.error("❌ MongoDB bağlantı hatası:", err);
    process.exit(1);
  });

// Task Model (MongoDB Şeması)
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

// API Rotaları
app.get("/tasks", async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

app.post("/tasks", async (req, res, next) => {
  try {
    console.log("📥 Gelen istek verisi:", req.body);  // Hata ayıklama için eklendi
    
    if (!req.body.title || !req.body.description) {
      console.log("❌ Eksik veri hatası! Gelen veri:", req.body);
      return res.status(400).json({ error: "Eksik veri! 'title' ve 'description' alanları zorunludur." });
    }
    
    const newTask = new Task(req.body);
    await newTask.save();
    
    console.log("✅ MongoDB'ye kaydedilen görev:", newTask);  // MongoDB'ye gerçekten eklendi mi?
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error("❌ Görev ekleme hatası:", error);
    next(error);
  }
});

app.delete("/tasks/:id", async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Silinecek görev bulunamadı." });
    }
    res.json({ message: "Görev silindi", deletedTask });
  } catch (error) {
    next(error);
  }
});

// Hata Yakalama Middleware
app.use((err, req, res, next) => {
  console.error("❌ Sunucu hatası:", err);
  res.status(500).json({ error: "Sunucu hatası, lütfen tekrar deneyin." });
});

// Sunucu Başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
