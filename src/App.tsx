import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import { useRecoilState } from 'recoil';
import { codeState } from './state/atom';
import { useEffect } from 'react';

function App() {
	const [code, setCode] = useRecoilState(codeState);

	useEffect(() => {
		const newCode: string | null = new URLSearchParams(window.location.search).get('code')
		if (newCode) setCode(newCode)
	}, []);

	return code ? <Dashboard/> : <Login />;
}

export default App;
