export default function numberToEmoji(number) {
    const emojis = [
        ':zero:',
        ':one:',
        ':two:',
        ':three:',
        ':four:',
        ':five:',
        ':six:',
        ':seven:',
        ':eight:',
        ':nine:',
        ':keycap_ten:'
    ]
    return emojis[number] || ''+number;
}