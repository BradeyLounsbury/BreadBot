const ytdl = require('ytdl-core-discord');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
// const queue = [];

module.exports = {
    name: 'play',
    aliases: ['skip', 'stop', 'queue', 'leave'],
    description: 'this plays a youtube video',
    async execute(message, args, cmd) {
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channelId,
            guildId: message.guildId,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        };

        const video = await videoFinder(args.join(' '));

        if (video) {
            // if (queue.length() > 0) {
            //     queue.shift();
            // }
            // queue.push(video);

            // eslint-disable-next-line no-var
            var stream = await ytdl(video.url, { highWaterMark: 1 << 25, filter: 'audioonly' });

            const player = createAudioPlayer({
                behaviors:
                    { noSubscriber: NoSubscriberBehavior.Play },
            });
            const resource = createAudioResource(stream, { inputType: StreamType.Opus });

            connection.subscribe(player);
            await message.reply(`Now Playing ***${video.title}***`);
            player.play(resource);

            player.on(AudioPlayerStatus.AutoPaused, () => console.log('auto paused'));
            player.on(AudioPlayerStatus.Idle, () => connection.destroy());
            player.on(AudioPlayerStatus.Playing, () => console.log('playing'));
            player.on(AudioPlayerStatus.Buffering, () => console.log('buffering'));
            player.on(AudioPlayerStatus.Paused, () => console.log('paused'));
        }
    },
};