const searchGames = document.querySelector('.search-games');
const loader = document.querySelector('.loader-container');
const gamesContainer = document.querySelector('.games-container');
const scoreSpan = document.querySelector('.score-tip');
const goalSpan = document.querySelector('.goal-tip');
const instructionPage = document.querySelector('.instruction-page');
const instructionBtn = document.querySelector('#instruction');
const backHomeBtn = document.querySelector('#back-home');
const popUP = document.querySelector('#pop-up');
const goToTop = document.querySelector('.to-top'); 
const adContainer = document.querySelector('.ad-container');
const marjanZivkovicAd = document.querySelector('#marjan-zivkovic a img');


const date = new Date();
const day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
const month = (date.getMonth() + 1) < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1) ;
const year = date.getFullYear();

//set current year, footer
document.querySelector('.current-year').textContent = year;

//loading
function loading(){
	gamesContainer.hidden = true;
}

function loaded(){
	loader.classList.add('none');
	gamesContainer.hidden = false;
}

// Pop up widnow handler
function showPopUP(){
	popUP.style.display = 'flex';
	popUP.style.opacity = '1';
}

window.onload = setTimeout( showPopUP, 4000 ); 

popUP.addEventListener('click', () =>{ popUP.remove()});

// Instruction page handler
instructionBtn.addEventListener('click', () =>{
	instructionPage.hidden = false;
	document.body.style.overflow = 'hidden';
})

backHomeBtn.addEventListener('click', () =>{
	instructionPage.hidden = true;
	document.body.style.overflow = 'auto';
})

//CHECKING API STATUS
// fetch(`https://v3.football.api-sports.io/fixtures?date=${year}-${month}-${day}`,{
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "v3.football.api-sports.io",
// 		"x-rapidapi-key": "e80663b34efa21c93f4b9507cc1d5aba"
// 	}
// }).then(response => response.json())
// .then(data => console.log(data))

//fetching todays fixtures on page loading
function fetchFixtures(){
	loading();
	fetch(
		//  `https://v3.football.api-sports.io/fixtures?live="1-2-3-39-40-45-61-78-88-94-106-110-135-140-144-179-197-203-207-210-218-238-244-271-283-286-315-323-332-333-345-373-407"&last=1`, 
		`https://v3.football.api-sports.io/fixtures?date=${year}-${month}-${day}`, 
	{
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "v3.football.api-sports.io",
			// "x-rapidapi-key": "e80663b34efa21c93f4b9507cc1d5aba"
			"x-rapidapi-key": `${myKey}`
		}
	})
	.then(response => response.json())
	.then (data => data.response.forEach( el => {
				if ( el.fixture.status.short === 'NS' ||  el.fixture.status.short === 'TBD' || el.fixture.status.short === '1H' || el.fixture.status.short === 'HT' || el.fixture.status.short === '2H' || el.fixture.status.short === 'ET' || el.fixture.status.short === 'P' || el.fixture.status.short === 'INT'){
					const game = document.createElement('div');
					game.classList.add('game');
					game.innerHTML = `
						<div class='game-container'>
							<div class='status'>${el.fixture.status.short}</div>
							<div class='teams'>
								<div class='league' id='league'><small>${el.league.name}, ${el.league.country}</small> <img src='${el.league.logo}' alt='League logo'></div>
								<div> <div> <img src='${ el.teams.home.logo}' alt='Home team logo'> ${el.teams.home.name} </div><div> <strong> ${el.goals.home === null ? '-' : el.goals.home}</strong></div></div> 
								<div> <div><img src='${ el.teams.away.logo}' alt='Away team logo'> ${el.teams.away.name} </div><div> <strong> ${el.goals.away === null ? '-' : el.goals.away}</strong> </div></div>
							</div>
							<button onclick='getTip(${el.teams.home.id}, ${el.teams.away.id})'>Our Tips</button>
						</div>			
						`;
					gamesContainer.appendChild(game);
		}
	})).then( () =>{ loaded() })
	.then( () =>{
		//filter leagues
		const leagues = document.querySelectorAll('.league');
	
		function filterLeagues( searchedLeague ){
			leagues.forEach( league => {
				if( league.textContent.toLowerCase().includes( searchedLeague.toLowerCase() ) ){
					league.parentNode.parentNode.parentNode.classList.remove('none');
				} else {
					league.parentNode.parentNode.parentNode.classList.add('none');
				}
			} )
		}
	
		searchGames.addEventListener('input', (e) => filterLeagues(e.target.value));
	})
	.catch(err => {
		console.log(err);
		loaded();
		gamesContainer.innerHTML = '<h2 style="text-align: center; margin: 5rem auto"> Ooops! Looks like we hit our daily limit <br> Try again tomorrow. <br> Sorry! </h2>';
		adContainer.hidden = true;
	});
}

fetchFixtures();
let fixtureID;
		
//head to head tips
function getTip( home, away ){
	const scoreArr = [];
	const goalArr = [];
	const ggArr = [];
	let scoreTip;
	let goalTip;
	let ggTip;

	scoreSpan.classList.add('calculating');
	goalSpan.classList.add('calculating');

	fetch(`https://v3.football.api-sports.io/fixtures/headtohead?h2h=${home}-${away}&last=10`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "v3.football.api-sports.io",
		// "x-rapidapi-key": "e80663b34efa21c93f4b9507cc1d5aba"
		"x-rapidapi-key": `${myKey}`
	}
	})
	.then(response => response.json())
	.then( data => data.response.forEach( match =>{
		fixtureID = match.fixture.id
		if( match.teams.home.id === home ){
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

			if ( match.goals.home > 0 && match.goals.away > 0 ){
				ggArr.push( 'gg' );
			} else {
				ggArr.push( 'ngg' );
			}
		}
	}))		
	.then( () =>{
		console.log(scoreArr, goalArr, ggArr)
		
		if( scoreArr.length >= 3 ){
			if ( ((scoreArr.filter( x => x === '1').length) > ( (scoreArr.filter( x => x === 'x').length) + (scoreArr.filter( x => x === '2').length) )) && (scoreArr.indexOf('1') === 0) ){
				scoreTip = '1';
			} else if ( ((scoreArr.filter( x => x === '2').length) > ( (scoreArr.filter( x => x === 'x').length) + (scoreArr.filter( x => x === '1').length) )) && (scoreArr.indexOf('2') === 0) ){
				scoreTip = '2';
			} else if ( ((scoreArr.filter( x => x === 'x').length) > ( (scoreArr.filter( x => x === '1').length) + (scoreArr.filter( x => x === '2').length) )) && (scoreArr.indexOf('x') === 0) ){
				scoreTip = 'X';
			} else {
				scoreTip = '-';
			}
		} else {
			scoreTip = '-';
		}

		if( goalArr.length >= 3 ){
			if ( (goalArr.filter( x => x === '3+').length > ( goalArr.length / 2 )) && ( goalArr.indexOf('3+') === 0 ) ){
				goalTip = '3+';
			} else if ( (goalArr.filter( x => x === '0-2').length > ( goalArr.length / 2 )) && ( goalArr.indexOf('0-2') === 0 ) ){
				goalTip = '0-2';
			} else {
				goalTip = '-';
			}
		} else{
			goalTip = '-';
		}

		if( ggArr.length >= 3 ){
			if( (ggArr.filter( x => x === 'gg' ).length > ggArr.length / 2 ) && ( ggArr.indexOf('gg') === 0 ) ) {
				ggTip = 'GG';
			} else {
				ggTip = '';
			}
		} else {
			ggTip = '';
		}
		
		scoreSpan.textContent = scoreTip;
		goalSpan.textContent =  ggTip + goalTip;

		scoreSpan.classList.remove('calculating');
		goalSpan.classList.remove('calculating');
	})
	.then( () =>{ predictionMatch(fixtureID) } )
	.catch(err => {
		console.log(err);
	})
}

function predictionMatch(id){
	fetch(`https://v3.football.api-sports.io/predictions?fixture=${id}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "v3.football.api-sports.io",
		// "x-rapidapi-key": "e80663b34efa21c93f4b9507cc1d5aba"
		"x-rapidapi-key": `${myKey}`
	}
	})
	.then(response => response.json())
	.then( data => console.log(data.response[0].predictions))
}

// to top handler
window.addEventListener('scroll', () => {
	if ( document.documentElement.scrollTop > 760 ){
		goToTop.hidden = false;
	} else {
		goToTop.hidden = true;
	}
});

goToTop.addEventListener('click', () =>{ window.scrollTo(0, 0) });

//Advertisement handler
const adArray = [ 'mz1', 'mz2', 'mz3', 'mz4' ];
let counter = 0;

function startAdBanner (){
	marjanZivkovicAd.src = `./img/${adArray[counter]}.jpg`;
	
	counter ++;
	if ( counter === adArray.length ){
		counter = 0;
	}
	setTimeout( startAdBanner, 5000 );
	
}

startAdBanner();