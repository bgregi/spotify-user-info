import useAuth from './useAuth';
import SpotifyWebApi from 'spotify-web-api-node';
import { useEffect, useState } from 'react';
import TopArtists from './TopArtists';
import TopTracks from './TopTracks';
import { useRecoilState } from 'recoil';
import { accessToken } from '../state/atom';
import TopGenres from './TopGenres';
import Preferences from './Preferences';
import Footer from './Footer';

export default function Dashboard() {
	const getAccessToken = useAuth();
	const [token, setToken] = useRecoilState(accessToken);

	const spotifyApi = new SpotifyWebApi({
		clientId: 'f01f87154b634e5cbd387f70e116d207',
	});

	const [userInfo, setUserInfo] = useState<
		SpotifyApi.CurrentUsersProfileResponse | undefined
	>(undefined);

	useEffect(() => {
		if (!getAccessToken) return;
		setToken(getAccessToken);
		spotifyApi.setAccessToken(getAccessToken);

		spotifyApi //GETS THE USER'S INFO
			.getMe()
			.then((res) => {
				setUserInfo(res.body);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [getAccessToken]);

	return (
		<>
			<div className='main-content d-flex flex-column justify-content-center align-items-center text-white'>
				<div
					className='d-flex flex-column justify-content-center align-items-center w-100'
					style={{
						backgroundImage:
							'linear-gradient(0deg, rgba(25,20,20,1) 5%, rgba(25,20,20,1) 26%, rgba(26,65,38,1) 63%, rgba(28,122,60,1) 82%, rgba(30,215,96,1) 100%)',
					}}>
					<img
						className='mt-5'
						style={{
							height: '150px',
							width: '150px',
							borderRadius: '50%',
							objectFit: 'cover',
						}}
						src={userInfo?.images?.[0].url}
						alt='user'
					/>
					<h1 className='text-center mt-5'>
						Hi, {userInfo?.display_name?.split(' ')[0]}!
					</h1>
					<p className='h2 mt-3 text-center'>
						We've gathered below some information about your
						listening habits...
					</p>
				</div>
				<TopArtists />
				<TopTracks />
				<TopGenres />
				<Preferences />
				<Footer />
			</div>
		</>
	);
}
