const mongoose = require("mongoose");

const watchItemSchema = new mongoose.Schema(
  {
    movieId: { type: Number, required: true },
    title: String,
    poster: String,
    vote_average: Number,
    popularity: Number,
    genres: [String],        
    status: {
      type: String,
      enum: ["plan", "watching", "watched"],
      default: "plan"
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // plain for now
    watchlist: [watchItemSchema],
    createdAt: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model("User", userSchema);
