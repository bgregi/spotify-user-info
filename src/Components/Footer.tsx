export default function Footer() {
	return (
		<footer style={{backgroundColor: 'rgb(25,20,20)'}} className='w-100 pt-5 pb-5 text-center'>
			<p className="m-0">
				by{' '}
				<a
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
