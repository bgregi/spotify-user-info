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
            <h1 className='text-center mt-5'>These are your current top artists</h1>
            <h5 className='text-center mb-4'>{'(You can click on the artist to go to their Spotify page)'}</h5>
			<ul className='list-group list-group-flush d-flex flex-column justify-content-center align-items-center'>
				{userTopArtists?.map((artist, index) => (
					<li style={{backgroundColor: 'rgb(25,20,20)'}} className='list-group-item text-white border-0' key={index}>
						<a className='text-decoration-none text-reset' href={artist.external_urls.spotify} target='_blank' rel="noreferrer">
                            {index + 1} - {artist.name}
                        </a>
					</li>
				))}
			</ul>
		</div>
	);
}