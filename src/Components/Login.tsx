import Container from 'react-bootstrap/Container';

export default function Login() {
	const CLIENT_ID = 'f01f87154b634e5cbd387f70e116d207';
	const RESPONSE_TYPE = 'code';
	const REDIRECT_URI = 'http://localhost:3000';
	const scopeList = [
		'streaming',
		'user-read-email',
		'user-read-private',
		'user-library-read',
		'user-library-modify',
		'user-read-playback-state',
		'user-modify-playback-state',
        'user-top-read'
	];

	const scope = scopeList.join('%20');

	const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${scope}`;

	return (
		<Container
			className='d-flex flex-column justify-content-center align-items-center m-0'
			style={{ minHeight: '100vh', minWidth: '100vw', backgroundColor: 'rgb(25,20,20)' }}>
			<h1 className='mb-2 text-white'>Welcome to What's My Taste!</h1>
			<h3 className='mb-4 text-white'>To start, please login</h3>
			<a style={{backgroundColor: 'rgb(30,215,96)'}} className='btn btn-lg' href={AUTH_URL}>
				Login with Spotify
			</a>
		</Container>
	);
}
