import { printHelp } from './help'
import
{
  incrementStreak,
  decrementStreak,
  setStreak,
  resetStreak,
  printStats
} from '../streaks'

// Handle the provided message
export const handleMessage = async message =>
{
  // If the message is a bot command, perform some functionality
  if(message.content.charAt(0) === '!')
  {
    console.log(
      `DISCORD: Processing command "${message.content}" ` +
      `by ${message.author.tag}`
    )

    // The message as an array
    const messageBlocks = message.content.split(' ')
    // Omit the '!' in command
    const command = messageBlocks[0].substring(1)
    // Keywords following command
    const commandList = messageBlocks.slice(1)

    switch(command.toLowerCase())
    {
      case 'help':
        printHelp(message.channel)
        break
      case 'up':
        incrementStreak(message)
        break
      case 'down':
        decrementStreak(message)
        break
      case 'set':
        setStreak(message, commandList[0])
        break
      case 'reset':
        resetStreak(message)
        break
      case 'stats':
        printStats(message)
        break
      default:
        await message.reply(
          `Command \`${message.content}\` not found. See \`!help\``
        )
        break
    }
  }
}
