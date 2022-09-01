import { atom } from 'recoil';

export const codeState = atom<string>({
	key: 'codeState',
	default: ''
});
