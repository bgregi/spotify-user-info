import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessToken, topTracks } from '../state/atom';
import SpotifyWebApi from 'spotify-web-api-node';

interface ITracksFeatures {
	acousticness: number;
	danceability: number;
	duration_ms: number;
	energy: number;
	key: number;
	liveness: number;
	loudness: number;
	mode: number;
	tempo: number;
	time_signature: number;
	valence: number;
}

const initialMeanTracksFeatures = {
	acousticness: 0,
	danceability: 0,
	duration_ms: 0,
	energy: 0,
	key: 0,
	liveness: 0,
	loudness: 0,
	mode: 0,
	tempo: 0,
	time_signature: 0,
	valence: 0,
};

export default function Preferences() {
	const token = useRecoilValue(accessToken);
	const spotifyApi = new SpotifyWebApi({
		clientId: 'f01f87154b634e5cbd387f70e116d207',
	});

	const [userTopTracks, setUserTopTracks] = useRecoilState(topTracks);
	const [tracksAudioFeatures, setTracksAudioFeatures] =
		useState<SpotifyApi.AudioFeaturesObject[]>();
	const [numericTracksFeatures, setNumericTracksFeatures] = useState<
		ITracksFeatures[]
	>([]);
	const [meanTracksFeatures, setMeanTracksFeatures] =
		useState<ITracksFeatures>(initialMeanTracksFeatures);

	const [finalPreferences, setFinalPreferences] = useState([]);

	useEffect(() => {
		if (userTopTracks && token) {
			spotifyApi.setAccessToken(token);

			const tracksIds = userTopTracks.map((track) => track.id);

			spotifyApi
				.getAudioFeaturesForTracks(tracksIds)
				.then((res) => {
					const audioFeatures = res.body.audio_features;
					setTracksAudioFeatures(audioFeatures);
					setNumericTracksFeatures(
						audioFeatures.map((track) => {
							return {
								acousticness: track.acousticness,
								danceability: track.danceability,
								duration_ms: track.duration_ms,
								energy: track.energy,
								key: track.key,
								liveness: track.liveness,
								loudness: track.loudness,
								mode: track.mode,
								tempo: track.tempo,
								time_signature: track.time_signature,
								valence: track.valence,
							};
						})
					);
				})
				.catch((err) => console.log(err));
		}
	}, [userTopTracks]);

	useEffect(() => {
		if (tracksAudioFeatures) {
			setMeanTracksFeatures({
				acousticness: getAveragePercentage('acousticness'),
				danceability: getAveragePercentage('danceability'),
				duration_ms: getAverageValue('duration_ms') / 60000, //CONVERTS ms TO min
				energy: getAveragePercentage('energy'),
				key: getMostCommonValue('key'),
				liveness: getAveragePercentage('liveness'),
				loudness: getAverageValue('loudness'),
				mode: getMostCommonValue('mode'),
				tempo: getAverageValue('tempo'),
				time_signature: getMostCommonValue('time_signature'),
				valence: getAveragePercentage('valence'),
			});
		}
	}, [tracksAudioFeatures]);

	function getAveragePercentage(feature: keyof ITracksFeatures) {
		return (
			(numericTracksFeatures
				?.map((track) => track[feature])
				.reduce((a, b) => a + b) /
				50) *
			100
		);
	}

	function getAverageValue(feature: keyof ITracksFeatures) {
		return (
			numericTracksFeatures
				?.map((track) => track[feature])
				.reduce((a, b) => a + b) / 50
		);
	}

	function getMostCommonValue(feature: keyof ITracksFeatures) {
		return numericTracksFeatures
			?.map((track) => track[feature])
			.reduce((a, b) => (a > b ? a : b));
	}

	function getVerdict(value: number, category: string, opposite: string) {
		if (value <= 25) {
			return `That means you probably don't like ${category} songs and prefer ${opposite} songs`;
		} else if (value > 25 && value <= 50) {
			return `That means you probably like a few ${category} songs, but would rather listen to ${opposite} songs`;
		} else if (value > 50 && value <= 75) {
			return `That probably means some of your favourite songs are ${category}, but yout also enjoy ${opposite} songs`;
		} else {
			return `That probably means ${category} songs are your favourite kind of songs`;
		}
	}

	function getKey(key: number) {
		switch (key) {
			case 0:
				return 'C';
			case 1:
				return 'C#';
			case 2:
				return 'D';
			case 3:
				return 'D#';
			case 4:
				return 'E';
			case 5:
				return 'F';
			case 6:
				return 'F#';
			case 7:
				return 'G';
			case 8:
				return 'G#';
			case 9:
				return 'A';
			case 10:
				return 'A#';
			case 11:
				return 'B';
			default:
				return 'unknown';
		}
	}

	function getTempo(tempo: number) {
		if (tempo < 40) {
			return 'That can be considered a very slow tempo';
		} else if (tempo < 80) {
			return 'That can be considered a slow tempo';
		} else if (tempo < 110) {
			return 'That can be considered a moderate tempo';
		} else if (tempo < 130) {
			return 'That can be considered a fast tempo';
		} else {
			return 'That can be considered a very fast tempo';
		}
	}

	return (
		<div
			style={{ backgroundColor: 'rgb(25,20,20)' }}
			className='w-100 d-flex flex-column align-items-center'>
			<h1 className='mt-5 text-center'>
				Based on yout top tracks, these are your musical preferences
			</h1>

			<h3 className='m-1 mt-5 text-center text-center'>
				Your <span className='text-success'>acousticness</span> index is{' '}
				{meanTracksFeatures.acousticness.toFixed(0)}%
			</h3>
			<h4 className='m-1 text-center'>
				{getVerdict(
					meanTracksFeatures.acousticness,
					'acoustic',
					'non-acoustic'
				)}
			</h4>

			<h3 className='m-1 mt-5 text-center'>
				Your <span className='text-success'>danceability</span> index is{' '}
				{meanTracksFeatures.danceability.toFixed(0)}%
			</h3>
			<h4 className='m-1 text-center'>
				{getVerdict(
					meanTracksFeatures.danceability,
					'danceable',
					'non-danceable'
				)}
			</h4>

			<h3 className='m-1 mt-5 text-center'>
				Your <span className='text-success'>energy</span> index is{' '}
				{meanTracksFeatures.energy.toFixed(0)}%
			</h3>
			<h4 className='m-1 text-center'>
				{getVerdict(meanTracksFeatures.energy, 'energetic', 'calmer')}
			</h4>

			<h3 className='m-1 mt-5 text-center'>
				Your <span className='text-success'>liveness</span> index is{' '}
				{meanTracksFeatures.liveness.toFixed(0)}%
			</h3>
			<h4 className='m-1 text-center'>{getVerdict(meanTracksFeatures.liveness, 'live', 'studio')}</h4>

			<h3 className='m-1 mt-5 text-center'>
				Your <span className='text-success'>valence</span> index is{' '}
				{meanTracksFeatures.valence.toFixed(0)}%
			</h3>
			<h4 className='m-1 text-center'>{getVerdict(meanTracksFeatures.valence, 'happy', 'sad')}</h4>

			<h3 className='m-1 mt-5 text-center'>
				The average <span className='text-success'>tempo</span> of your
				tracks is {meanTracksFeatures.tempo.toFixed(0)} bpm
			</h3>
			<h4 className='m-1 text-center'>{getTempo(meanTracksFeatures.tempo)}</h4>
            
			<h3 className='m-1 mt-5 text-center'>
				The average <span className='text-success'>duration</span> of
				your tracks is {Math.floor(meanTracksFeatures.duration_ms)}:
				{((meanTracksFeatures.duration_ms % 1) * 60).toFixed(0)}
			</h3>

			<h3 className='m-1 mt-5 text-center'>
				The most common <span className='text-success'>key</span> in
				your tracks is {getKey(meanTracksFeatures.key)}
			</h3>


			<h3 className='m-1 mt-5 text-center'>
				The most common{' '}
				<span className='text-success'>time signature</span> in your
				tracks is {meanTracksFeatures.time_signature}/4
			</h3>

			<h3 className='m-1 mt-5 text-center'>
				The most common <span className='text-success'>mode</span> in
				your tracks is{' '}
				{meanTracksFeatures.mode === 1 ? 'major' : 'minor'}
			</h3>
		</div>
	);
}
