const { User } = require('../db/models/user')
const { createUsers } = require('../db')
const { roles } = require('./roles')

// Handle a change in a user's streak.
// The user should be the author of the provided message.
const handleStreakChange = (message, streakAccessor) => {
  const query = { name: message.author.tag }
  User.findOne(query, function (error, user) {
    error || !user
      ? createUserNotFound(message, error)
      : updateStreak(user, message, streakAccessor)
  })
}

// Helper for handleStreakChange
const updateStreak = async (user, message, streakAccessor) => {
  const streak = parseInt(streakAccessor(user), 10)
  const streakString = `${streak} day${streak === 1 ? '' : 's'}`
  const successMsg =
    `Set streak to \`${streakString}\` ` + `for ${message.author.tag}`

  if (streak >= 0) {
    user.setStreak(streak)
    saveUserDBData(user, message.channel, successMsg)
    setMemberRoleByStreak(
      message.guild.member(message.author),
      streak
    )
  } else {
    await message.channel.send(`Please use a valid streak.`)
  }
}

// Set the role for a Discord GuildMember
// member - Must be a GuildMember object
const setMemberRoleByStreak = async (member, streak) => {
  // Remove previous streak roles
  Object.values(roles).forEach(async roleID => {
    if (member.roles.cache.has(roleID))
      await member.roles.remove(roleID)
  })

  const roleID = getRoleByStreak(streak)
  await member.roles.add(roleID)
}

// Return the role ID appropriate
// for the given streak
const getRoleByStreak = streak => {
  // For streaks under a week, fetch directly
  // For streaks over a week, calculate on per-week basis
  if (streak <= 7) {
    return roles[streak]
  } else {
    // Example: For streak=20,
    // streakInWeeks=2, startDayOfStreakWeek=14
    const streakInWeeks = Math.trunc(streak / 7)
    const startDayOfStreakWeek = streakInWeeks * 7
    return roles[startDayOfStreakWeek]
  }
}

// Save a database user object's data
const saveUserDBData = (user, discordChannel, discordMsg) => {
  user.save(async function (error) {
    error
      ? console.log(
          `DB: Error saving data for user: \n${user}\n` +
            `DB: Error received: \n${error}`
        )
      : await discordChannel.send(discordMsg)
  })
}

// Create a usser not found in the DB using the message object,
// and provide diagnostic information to console
// for the provided error.
const createUserNotFound = async (message, error) => {
  console.log(
    `DB: Error finding user ${message.author.tag}: ${error}` +
      `DB: Attempting to add user ${message.author.tag}`
  )

  createUsers([{ name: message.author.tag }])
  await message.channel.send(
    `Oops! You didn't exist in our database before, try again now.`
  )
}

module.exports = {
  handleStreakChange,
  createUserNotFound
}
