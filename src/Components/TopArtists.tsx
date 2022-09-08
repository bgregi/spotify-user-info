import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { accessToken, topArtists } from "../state/atom";
import SpotifyWebApi from 'spotify-web-api-node';

export default function TopArtists() {
    const token = useRecoilValue(accessToken)
    const spotifyApi = new SpotifyWebApi({
		clientId: 'f01f87154b634e5cbd387f70e116d207',
	});

    const [userTopArtists, setUserTopArtists] = useRecoilState(topArtists);

    useEffect(() => {
        if (!token) return;
		spotifyApi.setAccessToken(token);
        spotifyApi
        .getMyTopArtists({
            limit: 50,
        })
        .then((res) => {
            setUserTopArtists(res.body.items);
            // console.log(res.body.items);
        })
        .catch((err) => console.log(err));
    }, [token])
    
	return (
		<div style={{backgroundColor: 'rgb(25,20,20)'}} className='w-100'>
            <h1 className='text-center mt-5'>Your Top Artists</h1>
			<ul className='list-group list-group-flush d-flex flex-column justify-content-center align-items-center'>
				{userTopArtists?.map((artist, index) => (
					<li style={{backgroundColor: 'rgb(25,20,20)'}} className='list-group-item text-white border-0' key={index}>
						{index + 1} - {artist.name}
					</li>
				))}
			</ul>
		</div>
	);
}
