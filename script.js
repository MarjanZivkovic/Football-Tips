
fetch("https://v3.football.api-sports.io/fixtures?live=all", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "v3.football.api-sports.io",
		"x-rapidapi-key": "e80663b34efa21c93f4b9507cc1d5aba"
	}
})
.then(response => response.json())
.then (data => data.response.forEach( el => {
	const vs = document.createElement('h2');
	vs.innerHTML = `${el.teams.home.name}  <img src='${ el.teams.home.logo}'>  : ${el.teams.away.name} <img src='${ el.teams.away.logo}'>`;
	document.body.appendChild(vs);
	console.log(el.teams)
}))
.catch(err => {
	console.log(err);
});
