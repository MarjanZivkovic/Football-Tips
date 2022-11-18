const gamesContainer = document.querySelector('.games-container');
const scoreSpan = document.querySelector('.score-tip');
const goalSpan = document.querySelector('.goal-tip');

const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();


//fetching todays fixtures
fetch(`https://v3.football.api-sports.io/fixtures?date=${year}-${month}-${day}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "v3.football.api-sports.io",
		"x-rapidapi-key": "e80663b34efa21c93f4b9507cc1d5aba"
	}
})
.then(response => response.json())
.then (data => data.response.forEach( el => {
	const game = document.createElement('div');
	game.classList.add('game');
	game.innerHTML = `
		<div class='game-container'>
			<div class='status'>${el.fixture.status.short}</div>
			<div class='teams'>
				<div><small>${el.league.name}, ${el.league.country}</small></div>
				<div> <div> <img src='${ el.teams.home.logo}'> ${el.teams.home.name} </div><div> <strong> ${el.goals.home === null ? '-' : el.goals.home}</strong></div></div> 
				<div> <div><img src='${ el.teams.away.logo}'> ${el.teams.away.name} </div><div> <strong> ${el.goals.away === null ? '-' : el.goals.away}</strong> </div></div>
			</div>
			<button onclick='getTip(${el.teams.home.id}, ${el.teams.away.id})'>Our Tip</button>
		</div>			
		`;
	gamesContainer.appendChild(game);
}))
.catch(err => {
	console.log(err);
});
		
//head to head tips
function getTip( home, away ){
	const scoreArr = [];
	const goalArr = [];
	let scoreTip;
	let goalTip;

	fetch(`https://v3.football.api-sports.io/fixtures/headtohead?h2h=${home}-${away}&last=10`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "v3.football.api-sports.io",
		"x-rapidapi-key": "e80663b34efa21c93f4b9507cc1d5aba"
	}
	})
	.then(response => response.json())
	.then( data => data.response.forEach( match =>{
		if ( (match.goals.home + match.goals.away) > 2  ){
			goalArr.push('3+');
		} else if ( (match.goals.home + match.goals.away) <= 2 ){
			goalArr.push('0-2');
		}
		
		if ( match.teams.home.winner ){
			scoreArr.push('1');
		} else if ( match.teams.away.winner ){
			scoreArr.push('2');
		} else if( match.teams.home.winner === null || match.teams.away.winner === null){
			scoreArr.push('x');
		}
		}))
	.then( () =>{
		console.log(scoreArr, goalArr)
	
		if ( (scoreArr.filter( x => x === '1').length) > ( (scoreArr.filter( x => x === 'x').length) + (scoreArr.filter( x => x === '2').length) ) ){
			scoreTip = '1';
		} else if ( (scoreArr.filter( x => x === '2').length) > ( (scoreArr.filter( x => x === 'x').length) + (scoreArr.filter( x => x === '1').length) ) ){
			scoreTip = '2';
		} else if ( (scoreArr.filter( x => x === 'x').length) > ( (scoreArr.filter( x => x === '1').length) + (scoreArr.filter( x => x === '2').length) ) ){
			scoreTip = 'X';
		} else {
			scoreTip = '-';
		}
	
		if ( goalArr.filter( x => x === '3+').length > 5 ){
			goalTip = '3+';
		} else if ( goalArr.filter( x => x === '0-2').length > 5){
			goalTip = '0-2';
		} else {
			goalTip = '-';
		}
		scoreSpan.textContent = scoreTip;
		goalSpan.textContent = goalTip;
	})		
	.catch(err => {
		console.log(err);
	})
}
