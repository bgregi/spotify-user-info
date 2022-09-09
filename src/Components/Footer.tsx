export default function Footer() {
	return (
		<footer
			style={{
				backgroundImage:
					'linear-gradient(180deg, rgba(25,20,20,1) 5%, rgba(25,20,20,1) 26%, rgba(26,65,38,1) 63%, rgba(28,122,60,1) 82%, rgba(30,215,96,1) 100%)',
			}}
			className='w-100 pt-5 pb-4 d-flex flex-column align-items-center'>
			<div className='d-flex align-items-start mt-3'>
				<h5 style={{ margin: '3px 6px 0 0' }}>Powered by</h5>
				<img
					src={require('../assets/spotifyLogo.png')}
					alt='Spotify'
					style={{ width: '100px' }}
				/>
			</div>
			<p className='m-0 mt-2'>
				made by{' '}
				<a  className="text-white"
					href='https://github.com/bgregi'
					target='_blank'
					rel='noreferrer'>
					bgregi
				</a>{' '}
				| {new Date().getFullYear()}
			</p>
		</footer>
	);
}
