import { atom } from 'recoil';

export const codeState = atom<string>({
	key: 'codeState',
	default: ''
});

export const accessToken = atom<string>({
	key: 'accessToken',
	default: ''
});

export const topArtists = atom<SpotifyApi.ArtistObjectFull[]>({
	key: 'topArtists',
	default: [],
});

export const topTracks = atom<SpotifyApi.TrackObjectFull[]>({
	key: 'topTracks',
	default: [],
});

