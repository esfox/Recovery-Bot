const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * A User has a `name`, which is a Discord user tag,
 * and a `streak` object, which tracks their recovery
 */
const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  streak: {
    days: { type: Number, min: 0, default: 0 },
    lastModified: { type: Date, default: Date.now }
  }
})

// Define methods for the User

/**
 * Set a new streak for the User
 * @param {Number} newStreak A number representing
 * the new streak
 */
userSchema.methods.setStreak = function (newStreak) {
  this.streak.days = newStreak
  this.streak.lastModified = Date.now()
}

/**
 * A User resembles a Discord user.
 * It has a `username` and a `streak` object.
 */
exports.User = mongoose.model('User', userSchema)
