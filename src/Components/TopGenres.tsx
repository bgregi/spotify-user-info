import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { topArtists } from '../state/atom';

interface IGenreCounts {
	[key: string]: number;
}

export default function TopGenres() {
	const [userTopGenres, setUserTopGenres] = useState<string[]>();
	const userTopArtists = useRecoilValue(topArtists);

	useEffect(() => {
		const genres = userTopArtists
			?.map((artist) => {
				return artist.genres;
			})
			.reduce((acc, val) => acc.concat(val), []);
		const counts: IGenreCounts = {};
		genres?.forEach((x) => {
			counts[x] = (counts[x] || 0) + 1;
		}); //CREATES OBJECT WITH NUMBER OF RECURRENCES OF EACH GENRE

		const sortedCounts = Object.entries(counts).sort((x, y) => y[1] - x[1]);
		const allGenresSorted = sortedCounts.map((genre) => genre[0]);
		allGenresSorted.splice(10);

		setUserTopGenres(allGenresSorted);
	}, [userTopArtists]);

	return (
		<div style={{backgroundColor: 'rgb(25,20,20)'}} className='w-100'>
			<h1 className='text-center mt-5'>
				Based on your top artists, these are your 10 favourite genres
			</h1>
			<ul className='list-group list-group-flush d-flex flex-column justify-content-center align-items-center'>
				{userTopGenres?.map((genre, index) => (
					<li style={{backgroundColor: 'rgb(25,20,20)'}} className='list-group-item text-white border-0' key={genre}>
						{index + 1} - {genre}
					</li>
				))}
			</ul>
		</div>
	);
}
