const WebSocket = require('ws');
const slack = require('slack');


module.exports = ({ musicboxHostname, slackToken, slackChannel, slackPostTs }) => {

  const ws = new WebSocket(`ws://${musicboxHostname}/mopidy/ws/`);

  // Get the current track once upon launch
  ws.on('open', function open() {
    ws.send(JSON.stringify({
      'method': 'core.playback.get_current_track',
      'jsonrpc': '2.0',
      'id': 'currentTrack',
    }));
  });

  // Continously listen to messages
  ws.on('message', (resp, flags) => {
    let track;
    const data = JSON.parse(resp);

    // extract track information from response data
    if (data.id === 'currentTrack') {
      track = data.result;
    } else if (data.event === 'track_playback_started') {
      track = data.tl_track.track;
    }
    if (!track) return;

    const artist = track.artists.map(artist => artist.name).join(' & ');
    const title = track.name;
    const text = `Current track: _${artist} – ${title}_`;

    // Update the pinned post with the current track information
    slack.chat.update({ token: slackToken, ts: slackPostTs, channel: slackChannel, text }, (err, data)=> {
      if (err) {
        console.error('ERROR', err);
        return;
      }
      console.log('CURRENT TRACK', data);
    });
  });

}
