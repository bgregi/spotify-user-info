import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessToken, topTracks } from '../state/atom';
import SpotifyWebApi from 'spotify-web-api-node';

export default function TopTracks() {
    const token = useRecoilValue(accessToken)
    const spotifyApi = new SpotifyWebApi({
		clientId: 'f01f87154b634e5cbd387f70e116d207',
	});
	const [userTopTracks, setUserTopTracks] = useRecoilState(topTracks);

    useEffect(() => {
        if (!token) return;
		spotifyApi.setAccessToken(token);
        spotifyApi
        .getMyTopTracks({
            limit: 50,
        })
        .then((res) => {
            setUserTopTracks(res.body.items);
        })
        .catch((err) => console.log(err));
    }, [token])


	return (
		<div style={{backgroundColor: 'rgb(25,20,20)'}} className='w-100'>
            <h1 className='text-center mt-5'>These are your current top tracks</h1>
            <h5 className='text-center mb-4'>{'(You can click on the track to listen on Spotify)'}</h5>
			<ul className='list-group list-group-flush d-flex flex-column justify-content-center align-items-center'>
				{userTopTracks?.map((track, index) => (
					<li style={{backgroundColor: 'rgb(25,20,20)'}} className='list-group-item text-white border-0 text-center' key={index}>
                        <a className='text-decoration-none text-reset' href={track.external_urls.spotify} target='_blank' rel="noreferrer">
						    {index + 1} - {track.name} - {track.artists[0].name}
                        </a>
					</li>
				))}
			</ul>
		</div>
	);
}
