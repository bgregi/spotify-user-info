import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { accessToken, topTracks } from "../state/atom";
import SpotifyWebApi from 'spotify-web-api-node';

interface ITracksFeatures {
	acousticness: number;
	danceability: number;
	duration_ms: number;
	energy: number;
	instrumentalness: number;
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
	instrumentalness: 0,
	key: 0,
	liveness: 0,
	loudness: 0,
	mode: 0,
	tempo: 0,
	time_signature: 0,
	valence: 0,
};

export default function Preferences() {
    const token = useRecoilValue(accessToken)
    const spotifyApi = new SpotifyWebApi({
		clientId: 'f01f87154b634e5cbd387f70e116d207',
	});
    
    const [userTopTracks, setUserTopTracks] = useRecoilState(topTracks);
    const [tracksAudioFeatures, setTracksAudioFeatures] = useState<SpotifyApi.AudioFeaturesObject[]>();
    const [numericTracksFeatures, setNumericTracksFeatures] = useState<ITracksFeatures[]>([]);
    const [meanTracksFeatures, setMeanTracksFeatures] = useState<ITracksFeatures>(initialMeanTracksFeatures);

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
								instrumentalness: track.instrumentalness,
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
				acousticness: getAverageValue('acousticness'),
				danceability: getAverageValue('danceability'),
				duration_ms: getAverageValue('duration_ms'),
				energy: getAverageValue('energy'),
				instrumentalness: getAverageValue('instrumentalness'),
				key: getMostCommonValue('key'),
				liveness: getAverageValue('liveness'),
				loudness: getAverageValue('loudness'),
				mode: getMostCommonValue('mode'),
				tempo: getAverageValue('tempo'),
				time_signature: getMostCommonValue('time_signature'),
				valence: getAverageValue('valence'),
			});
		}
	}, [tracksAudioFeatures]);
    
	return (
		<div style={{backgroundColor: 'rgb(25,20,20)'}} className='w-100'>
					<h1 className="mt-5 text-center">
						Based on yout top tracks, these are your musical
						preferences
					</h1>
					<ul className='list-group list-group-flush d-flex flex-column justify-content-center align-items-center'>
						<li className='list-group-item'>
							acousticness: {meanTracksFeatures.acousticness}
						</li>
						<li className='list-group-item'>
							danceability:{meanTracksFeatures.danceability}
						</li>
						<li className='list-group-item'>
							duration_ms:{meanTracksFeatures.duration_ms}
						</li>
						<li className='list-group-item'>
							energy:{meanTracksFeatures.energy}
						</li>
						<li className='list-group-item'>
							instrumentalness:
							{meanTracksFeatures.instrumentalness}
						</li>
						<li className='list-group-item'>
							key:{meanTracksFeatures.key}
						</li>
						<li className='list-group-item'>
							liveness:{meanTracksFeatures.liveness}
						</li>
						<li className='list-group-item'>
							loudness:{meanTracksFeatures.loudness}
						</li>
						<li className='list-group-item'>
							mode:{meanTracksFeatures.mode}
						</li>
						<li className='list-group-item'>
							tempo:{meanTracksFeatures.tempo}
						</li>
						<li className='list-group-item'>
							time_signature:{meanTracksFeatures.time_signature}
						</li>
						<li className='list-group-item'>
							valence:{meanTracksFeatures.valence}
						</li>
					</ul>
		</div>
	);
}
