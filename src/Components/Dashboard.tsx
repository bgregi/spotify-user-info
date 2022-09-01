import useAuth from './useAuth';
import SpotifyWebApi from 'spotify-web-api-node';
import { useEffect, useState } from 'react';

interface ICounts {
	[key: string]: number;
}

export default function Dashboard() {
	const accessToken = useAuth();
	const [userInfo, setUserInfo] = useState<
		SpotifyApi.CurrentUsersProfileResponse | undefined
	>(undefined);
	const [userTopArtists, setUserTopArtists] = useState<
		SpotifyApi.ArtistObjectFull[] | undefined
	>(undefined);
	const [userTopTracks, setUserTopTracks] = useState<
		SpotifyApi.TrackObjectFull[] | undefined
	>(undefined);
	const [userTopGenres, setUserTopGenres] = useState<string[]>();

	const spotifyApi = new SpotifyWebApi({
		clientId: 'f01f87154b634e5cbd387f70e116d207',
	});

	useEffect(() => {
		if (!accessToken) return;
		spotifyApi.setAccessToken(accessToken);

		spotifyApi //GETS THE USER'S INFO
			.getMe()
			.then((res) => {
				setUserInfo(res.body);
			})
			.catch((err) => {
				console.log(err);
			});

		spotifyApi //GETS THE USER'S TOP ARTISTS
			.getMyTopArtists({
				limit: 50,
			})
			.then((res) => {
				setUserTopArtists(res.body.items);
				// console.log(res.body.items);
			})
			.catch((err) => console.log(err));

		spotifyApi //GETS THE USER'S TOP TRACKS
			.getMyTopTracks({
				limit: 50,
			})
			.then((res) => {
				setUserTopTracks(res.body.items);
				// console.log(res.body.items);
			})
			.catch((err) => console.log(err));

		spotifyApi
			.getArtist('4OrizGCKhOrW6iDDJHN9xd')
			.then((res) => {
				// console.log(res.body);
			})
			.catch((err) => console.log(err));

	}, [accessToken]);

    useEffect(() => {
		if (userTopTracks && accessToken) {
            spotifyApi.setAccessToken(accessToken);

			spotifyApi
				.getAudioFeaturesForTrack(userTopTracks[0].id)
				.then((res) => {
					console.log(res.body);
				})
				.catch((err) => console.log(err));
		}
    }, [userTopTracks])

	useEffect(() => {
		const genres = userTopArtists
			?.map((artist) => {
				return artist.genres;
			})
			.reduce((acc, val) => acc.concat(val), []);
		const counts: ICounts = {};
		genres?.forEach((x) => {
			counts[x] = (counts[x] || 0) + 1;
		}); //CREATES OBJECT WITH NUMBER OF RECURRENCES OF EACH GENRE

		const sortedCounts = Object.entries(counts).sort((x, y) => y[1] - x[1]);
		const allGenresSorted = sortedCounts.map((genre) => genre[0]);
		allGenresSorted.splice(10);

		setUserTopGenres(allGenresSorted);
	}, [userTopTracks]);

	return (
		<div>
			<div>
				<img
					style={{
						height: '100px',
						width: 'auto',
						borderRadius: '100%',
					}}
					src={userInfo?.images?.[0].url}
					alt='user'
				/>
				Hi, {userInfo?.display_name}!
			</div>
			<div className='d-flex'>
				<div>
					<h1>Your Top Artists</h1>
					<ul>
						{userTopArtists?.map((artist, index) => (
							<li key={index}>{artist.name}</li>
						))}
					</ul>
				</div>
				<div>
					<h1>Your Top Tracks</h1>
					<ul>
						{userTopTracks?.map((track, index) => (
							<li key={index}>
								{track.name} - {track.artists[0].name}
							</li>
						))}
					</ul>
				</div>
			</div>
			<div>
				<h1>
					Based on your top artists, these are your 10 favourite
					genres
				</h1>
				<ul>
					{userTopGenres?.map((genre) => (
						<li key={genre}>{genre}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
